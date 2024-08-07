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

const typesColorMap = {
    food: "#6BABAA",
    car: "#fecdf",
    others: "#00FF00",
    Rumen: "#FF0000",
    Maya: "#00FF00",
    Kasia: "0000FF",
} as Record<string, string>;

const gray = "gray.900";

export function getTypeColor(type: string): string {
    return typesColorMap[type] ?? gray; //randomColor();
}
