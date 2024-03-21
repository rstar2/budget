export enum AuthUser {
    Unknown,
    NotAuth,
    Auth,
}

export type ExpenseType = string;

export const DefaultExpenseType = "food";

export type ExpenseNew = {
    type: ExpenseType;
    date: Date;
    amount: number;
};
export type Expense = ExpenseNew & {
    id: string;
};

export enum HomeDrawerMode {
    "month" = "month",
    "months" = "months",
    "settings" = "settings",
}
