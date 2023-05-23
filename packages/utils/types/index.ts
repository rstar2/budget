export type Expense = number;

export type DayExpenses = {
    day: Date;
    expenses: Expense[];
};

export type MonthExpenses = {
    month: Date;
    dayExpenses: DayExpenses[];
};

export type YearExpenses = {
    year: number;
    monthExpenses: MonthExpenses[];
};
