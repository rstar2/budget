import { MonthExpenses } from "utils";

export default function calculate(monthExpenses: MonthExpenses): number {
    const perMonth = monthExpenses.dayExpenses.reduce((acc, dayExpenses) => {
        const perDay = dayExpenses.expenses.reduce((a, b) => a + b);
        return acc + perDay;
    }, 0);

    return perMonth;
}
