/* eslint-disable no-console */
import { Redis } from "ioredis";
import { LRUCache } from "lru-cache";
import type { CacheHandler as NextCacheHandler, CacheHandlerValue } from "next/dist/server/lib/incremental-cache";

const VALKEY_HOST = process.env.VALKEY_HOST;
if (!VALKEY_HOST) {
    throw new Error("VALKEY_HOST is required");
}

const VALKEY_PORT = parseInt(process.env.VALKEY_PORT || "6379", 10);

const VALKEY_PASSWORD = process.env.VALKEY_PASSWORD;
if (!VALKEY_PASSWORD) {
    throw new Error("VALKEY_PASSWORD is required");
}

const VALKEY_KEY_PREFIX = process.env.VALKEY_KEY_PREFIX || "";

const CACHE_TTL_IN_S = 24 * 60 * 60; // 1 day

const redis = new Redis({
    enableOfflineQueue: false,
    host: VALKEY_HOST,
    keyPrefix: VALKEY_KEY_PREFIX,
    password: VALKEY_PASSWORD,
    port: VALKEY_PORT,
    enableAutoPipelining: true,
});

// Typed with Next's `CacheHandlerValue` so the in-memory fallback stores the exact same
// wrapped `{ lastModified, value }` shape as the Redis path (and as `get` returns). This
// prevents the two cache paths from drifting apart
const fallbackCache = new LRUCache<string, CacheHandlerValue>({
    maxSize: 50 * 1024 * 1024, // 50MB
    ttl: CACHE_TTL_IN_S * 1000,
    ttlAutopurge: true,
});

let isFallbackInUse = false;

function parseBodyForGqlError(body: string) {
    try {
        const decodedBody = Buffer.from(body, "base64").toString("utf-8");
        if (!decodedBody.startsWith("{")) return null; // Not a JSON response, ignore
        return JSON.parse(decodedBody);
    } catch (error) {
        console.error("CacheHandler.parseBodyForGqlError error", error);
        return null;
    }
}

function isCacheKeyFullRoute(key: string) {
    //full-route-cache keys are the page url (and start with /), data caches are a hash
    return key.startsWith("/");
}

export default class CacheHandler {
    async get(key: string): Promise<ReturnType<NextCacheHandler["get"]>> {
        if (isCacheKeyFullRoute(key)) {
            return null;
        }
        if (redis.status === "ready") {
            try {
                const redisResponse = await redis.get(key);
                if (isFallbackInUse) {
                    isFallbackInUse = false;
                    console.info(`${new Date().toISOString()} [${VALKEY_HOST} up] Switching back to redis cache`);
                }
                if (!redisResponse) {
                    return null;
                }
                return JSON.parse(redisResponse) as CacheHandlerValue;
            } catch (e) {
                console.error("CacheHandler.get error", e);
            }
        }

        // fallback to in-memory cache
        if (!isFallbackInUse) {
            console.warn(`${new Date().toISOString()} | [${VALKEY_HOST} down] switching to fallback in-memory cache`);
            isFallbackInUse = true;
        }

        return fallbackCache.get(key) ?? null;
    }

    async set(key: string, value: Parameters<NextCacheHandler["set"]>[1]): Promise<void> {
        if (isCacheKeyFullRoute(key)) {
            return;
        }

        if (value?.kind === "FETCH") {
            const responseBody = parseBodyForGqlError(value.data.body);
            if (responseBody?.errors) {
                // Must not cache GraphQL errors
                console.error("CacheHandler.set GraphQL Error: ", responseBody.errors);
                return;
            }
        }

        const data: CacheHandlerValue = {
            lastModified: Date.now(),
            value,
        };
        const stringData = JSON.stringify(data);

        if (redis.status === "ready") {
            try {
                await redis.set(key, stringData, "EX", CACHE_TTL_IN_S);
            } catch (e) {
                console.error("CacheHandler.set error", e);
            }
            return;
        }
        fallbackCache.set(key, data, { size: stringData.length });
    }

    async revalidateTag(tags: string | string[]): Promise<void> {
        if (tags.length === 0) return;
        console.warn("CacheHandler.revalidateTag", tags);
    }
}
