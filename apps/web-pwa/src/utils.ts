import i18n from "i18next";
import { z } from "zod";

export function safeParse(schema: z.Schema, str: unknown): string {
    const result = schema.safeParse(str);
    if (result.success) return "";

    // return the first error
    const error = result.error.errors[0];

    // these are the default zod messages if not localized
    // return error.message;

    // some simple kind of localization of the zod errors
    // that's enough for this simple case,
    // otherwise can use the "zod-i18n-map" package for  more robust solution
    // @ts-expect-error (error.minimum and error.maximum are not always defined but it's ok here)
    return i18n.t(error.message, { min: error.minimum, max: error.maximum });
}

export function isNumber(val: unknown): boolean {
    return typeof val === "number";
}

export function missingHandling(val: never): never {
    throw new Error(`Value ${val} is not handled`);
}

export function enumKeys<O extends object, K extends keyof O>(obj: O): K[] {
    return Object.keys(obj).filter((k) => Number.isNaN(+k)) as K[];
}

export function enumForEach<O extends object, K extends keyof O>(
    obj: O,
    callback: (item: O[K]) => void,
): void {
    for (const key of enumKeys(obj)) {
        callback(obj[key as K]);
    }
}

export function enumForEachKey<O extends object, K extends keyof O>(
    obj: O,
    callback: (item: K) => void,
): void {
    for (const key of enumKeys(obj)) {
        callback(key as K);
    }
}

export function enumForEachPair<O extends object, K extends keyof O>(
    obj: O,
    callback: (item: O[K], key: K) => void,
): void {
    for (const key of enumKeys(obj)) {
        callback(obj[key as K], key as K);
    }
}

// export function enumIsIn<O extends ListArgString>(obj: O, str: string): obj is O {
//     return Object.values(obj).includes(str);
// }

export function enumValues<O extends Record<string, string>>(obj: O): string[] {
    return Object.values(obj);
}

// export function enumValuesAsSet<O extends ListArgString>(obj: O): Set<string> {
//     return new Set<string>(enumValues(obj));
// }
