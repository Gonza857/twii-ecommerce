export async function safe<T, E = Error>(promise: Promise<T>): Promise<[T | null, E | null]> {
    try {
        const data = await promise;
        return [data, null];
    } catch (err) {
        return [null, err as E];
    }
}

// utils/safeSync.ts
export function safeSync<T, E = Error>(fn: () => T): [T | null, E | null] {
    try {
        const result = fn();
        return [result, null];
    } catch (err) {
        return [null, err as E];
    }
}
