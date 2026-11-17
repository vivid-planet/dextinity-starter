export const sdk = process.env.TRACING_ENABLED === "1" ? (await import("./tracing-sdk.js")).sdk : undefined;
