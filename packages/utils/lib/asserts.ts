export function assertDefined<T>(obj: T): asserts obj is Exclude<T, undefined | null> {
    if (obj === undefined || obj === null) throw new Error(`Object is NOT defined: ${obj}`);
}
