import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ListItem, UnorderedList, Select, VStack, Box, HStack, Text } from "@chakra-ui/react";

import { useExpenses, useExpenseTypes } from "../cache/expenses";
import { getTypeColor } from "../colors";
import { Expense } from "../types";

export default function ViewListMonth() {
    const { t } = useTranslation();
    const [filterType, setFilterType] = useState<string>();

    const types = useExpenseTypes() ?? [];
    const expenses = useExpenses(new Date());

    const [filteredExpenses, filteredAmount] = useMemo(() => {
        let result = expenses ?? [];
        if (filterType) result = result?.filter(({ type }) => filterType === type);

        return [result, result.reduce((res, { amount }) => res + amount, 0)];
    }, [expenses, filterType]);

    return (
        <VStack height="full">
            <HStack>
                <Select
                    width="80%"
                    mb={2}
                    onChange={(e) => setFilterType(e.target.value)}
                    value={filterType}
                >
                    <option key={"All"} value={undefined}>
                        {t("label.all")}
                    </option>
                    {types.map((type) => (
                        <option key={type} value={type}>
                            {t(`label.type.${type}`)}
                        </option>
                    ))}
                </Select>
                <Text ml={2}>{filteredAmount.toFixed(2)}</Text>
            </HStack>
            <Box flexGrow={1} overflowY="auto">
                <UnorderedList>
                    {filteredExpenses.map((expense) => {
                        return (
                            <ListItem color={getTypeColor(expense.type)}>
                                {expense.date.toDateString()} - {expense.amount.toFixed(2)}
                            </ListItem>
                        );
                    })}
                </UnorderedList>
            </Box>
        </VStack>
    );
}
