import { createCache } from "cache-manager";

// Uses cache-manager's default in-memory Keyv store. Don't pass a store from a directly installed keyv: cache-manager v7 requires keyv v5, and keyv v6 stores break wrap().
export const memoryCache = createCache({
    ttl: 15 * 60 * 1000, // 15 minutes
    refreshThreshold: 5 * 60 * 1000, // refresh if less than 5 minutes TTL are remaining
});

memoryCache.on("refresh", ({ error }) => {
    if (error) {
        console.error("Error refreshing cache in background", error);
    }
});
