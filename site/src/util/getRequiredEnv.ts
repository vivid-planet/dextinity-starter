/**
 * Returns the value of an environment variable that must be set at runtime, and throws a descriptive error if it isn't.
 */
export function getRequiredEnv(name: string) {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Environment variable ${name} must be set`);
    }

    return value;
}
