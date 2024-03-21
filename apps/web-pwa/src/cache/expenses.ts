import { useMutation, useQuery } from "@tanstack/react-query";
import { Unsubscribe } from "@firebase/firestore";
import { format } from "date-fns";

import firebase, { parseDocs } from "../firebase";
import type { Expense, ExpenseNew, ExpenseType } from "../types";
import { queryClient } from "./index";

const collectionTypes = firebase.collection(import.meta.env.VITE_FIREBASE_COLL_TYPES!);
const collectionExpenses = firebase.collection(import.meta.env.VITE_FIREBASE_COLL_EXPENSES!);

let unsubscribeTypes: Unsubscribe | undefined;
let unsubscribeExpenses: Unsubscribe | undefined;
firebase.onAuthStateChanged((user) => {
    if (user) {
        unsubscribeTypes = firebase.onSnapshot(collectionTypes, (snapshot) => {
            const data = parseDocs(snapshot).map(({ id }) => id) as ExpenseType[];
            queryClient.setQueryData<ExpenseType[]>(["types"], data);
        });

        unsubscribeExpenses = firebase.onSnapshot(collectionExpenses, (snapshot) => {
            const expenses = parseDocs(snapshot) as unknown as Expense[];

            const expensesMonthMap = expenses.reduce((res, expense) => {
                const month = getMonth(expense.date);
                let expensesMonth = res[month];
                if (!expensesMonth) {
                    expensesMonth = [];
                    res[month] = expensesMonth;
                }
                expensesMonth.push(expense);
                return res;
            }, {} as Record<string, Expense[]>);

            const months: string[] = [];
            // cache each month expenses
            Object.entries(expensesMonthMap).forEach(([month, expenses]) => {
                months.push(month);
                queryClient.setQueryData<Expense[]>(["expenses", month], expenses);
            });

            // cache the parsed/fount months
            queryClient.setQueryData<string[]>(["expenses", "months"], months.sort());
        });
    } else {
        unsubscribeTypes?.();
        unsubscribeTypes = undefined;
        unsubscribeExpenses?.();
        unsubscribeExpenses = undefined;
    }
});

function getMonth(date: Date): string {
    return format(date, "yyyy-MM");
}

/**
 * Query for the expenses months.
 */
export function useExpenseMonths() {
    const { data } = useQuery<string[]>({
        queryKey: ["expenses", "months"],
        queryFn: () => Promise.reject(new Error("Not used")),
        enabled: false,
        staleTime: Infinity,
        initialData: [],
    });
    return data;
}

/**
 * Query for the Expenses state.
 * @param months the months whose expenses to get
 */
export function useExpensesPerMonths(months: string[]) {
    const expensesPerMonth = [];

    for (const month of months) {
        // it OK here as the usage of the useExpensesPerMonths() is assumed to be in components that are
        // recreated if months change
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const expenses = useExpenses(month)!;
        expensesPerMonth.push({ month, expenses });
    }
    return expensesPerMonth;
}

/**
 * Query for the Expenses state.
 * @param dateOrMonth the date for which month will get expenses
 */
export function useExpenses(dateOrMonth: Date | string) {
    const month = dateOrMonth instanceof Date ? getMonth(dateOrMonth) : dateOrMonth;
    const { data } = useQuery<Expense[]>({
        queryKey: ["expenses", month],
        queryFn: () => Promise.reject(new Error("Not used")),
        enabled: false,
        staleTime: Infinity,
    });
    return data;
}

/**
 * Query for the Expenses state.
 */
export function useExpenseTypes() {
    const { data } = useQuery<ExpenseType[]>({
        queryKey: ["types"],
        queryFn: () => Promise.reject(new Error("Not used")),
        enabled: false,
        staleTime: Infinity,
    });
    return data;
}

export function useExpenseAdd() {
    const mutation = useMutation({
        mutationFn: async (expenseNew: ExpenseNew) => {
            // call Firestore
            await firebase.addDoc(collectionExpenses, expenseNew);
        },
        // meta is used for success/failed notification on mutation result
        meta: {
            action: ["Expense", "Add"],
        },
    });

    // if needed can return the whole mutation, like loading, and error state
    return mutation.mutateAsync;
}
