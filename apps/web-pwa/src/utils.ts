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

export function randomColor() {
    return Array.from({ length: 3 })
        .map(() => Math.ceil(Math.random() * 255))
        .map((col) => col.toString(16).padStart(2, "0"))
        .reduce((res, colHex) => `${res}${colHex}`, "#");
}

const expensesColorMap = Object.entries({
    "red.900": 6000,
    "red.600": 5000,
    "red.300": 4000,
    "green.800": 3000,
    "green.400": 2000,
    "white.900": 0,
});

export function getExpensesThemeColor(amount: number): string {
    // for sure the last one will be matched finally
    const found = expensesColorMap.find(([_color, breakpoint]) => amount >= breakpoint)!;
    return found[0];
}
