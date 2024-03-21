import { useMemo } from "react";
import { Heading, ScaleFade, VStack, useDisclosure, useTheme } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { BeatLoader as Loader } from "react-spinners";
import { isSameMonth } from "date-fns";

import { AddExpense } from "../components/AddExpense";
import { useExpenseTypes, useExpenses } from "../cache/expenses";
import { getExpensesThemeColor } from "../utils";

export default function Home() {
    const theme = useTheme();

    const types = useExpenseTypes();
    const expenses = useExpenses(new Date());

    const { isOpen: isOpenAdd, onToggle: onToggleAdd } = useDisclosure();

    // calculate only the expenses for this month
    const monthExpenses = useMemo(() => {
        if (!expenses) return -1;

        const now = new Date();

        return expenses
            .filter(({ date }) => isSameMonth(now, date))
            .reduce((res, expense) => res + expense.amount, 0);
    }, [expenses]);

    return (
        <>
            <VStack height="full">
                {/* show loading until data is valid */}
                {!types || !expenses ? (
                    <Loader
                        style={{ display: "inline" }}
                        size={8}
                        color={theme.__cssMap["colors.chakra-body-text"].value}
                    />
                ) : (
                    <VStack width="full" height="full" justifyContent="space-around">
                        {/*  Use the `boxSize` prop to change the icon size -there are chakra sizes 20,24, 28, 32, ... */}
                        <AddIcon boxSize={44} onClick={onToggleAdd} />
                        <ScaleFade initialScale={0.1} in={isOpenAdd}>
                            <AddExpense onAdd={onToggleAdd} />
                        </ScaleFade>

                        {/* show if known */}
                        {monthExpenses >= 0 && (
                            <Heading color={getExpensesThemeColor(monthExpenses)}>
                                {monthExpenses.toFixed(2)}
                            </Heading>
                        )}
                    </VStack>
                )}
            </VStack>
        </>
    );
}
