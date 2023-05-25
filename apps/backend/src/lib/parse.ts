import fs from "node:fs/promises";

import { assertDefined, DayExpenses, MonthExpenses } from "utils";

const monthHeaderRegex = /### (\d\d\d\d).(\d\d) ###/;
const dayExpensesRegex = /(\d\d?) -> (.+)/;
const dayExpensesSplitRegex = /\s\+\s/;

export async function parseFromFile(fileName: string): Promise<MonthExpenses> {
    const contents = await fs.readFile(fileName, "utf-8");
    return parse(contents);
}

export async function parse(contents: string): Promise<MonthExpenses> {
    let month: Date | undefined;
    let dayExpenses: DayExpenses[] = [];
    contents.split(/\r?\n/).forEach((line) => {
        line = line.trim();
        if (!line) return;

        if (!month) {
            // first parse the header with the month
            const headerMatch = line.match(monthHeaderRegex);

            if (!headerMatch) throw new Error(`Not proper month header: ${line}`);

            const yearNum = +headerMatch[1];
            const monthNum = +headerMatch[2];

            // validate
            if (!yearNum || !monthNum) throw new Error(`Not proper month header: ${line}`);

            // the months in JS Date are from 0
            month = new Date(yearNum, monthNum - 1);
        } else {
            // parse each day's expenses
            const dayExpensesMatch = line.match(dayExpensesRegex);

            if (!dayExpensesMatch) throw new Error(`Not proper day expenses: ${line}`);

            const dayNum = +dayExpensesMatch[1];
            const expensesStr = dayExpensesMatch[2];
            const expensesParts = expensesStr.trim().split(dayExpensesSplitRegex);
            const expenses = expensesParts.map((expenseStr) => parseFloat(expenseStr));
            const day = new Date(month);
            day.setDate(dayNum);
            const aDayExpenses: DayExpenses = {
                day,
                expenses,
            };
            dayExpenses.push(aDayExpenses);
            // console.log(`Day expenses: ${day.toDateString()} - ${expenses.join(", ")}`);
        }
    });

    assertDefined(month);

    return {
        month,
        dayExpenses,
    };
}
