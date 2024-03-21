import { useCallback } from "react";
import {
    Button,
    Card,
    CardBody,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Select,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useSetState } from "react-use";
import { z } from "zod";

import { useExpenseAdd, useExpenseTypes } from "../cache/expenses";
import { isNumber, safeParse } from "../utils";
import { DefaultExpenseType } from "../types";

const amountSchema = z
    .number({
        invalid_type_error: "error.amount.required",
        required_error: "error.amount.required",
    })
    .min(1, { message: "error.amount.min" })
    .max(5000, { message: "error.amount.max" });

export function AddExpense({ onAdd }: { onAdd?: () => void }) {
    const { t } = useTranslation();

    const types = useExpenseTypes()!;
    const expenseAdd = useExpenseAdd();

    const [localState, setLocalState] = useSetState({
        amount: "" as number | string,
        amountValidError: "",
        type: DefaultExpenseType,
    });

    const handleAmountChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
        (e) => {
            const amount = e.target.valueAsNumber;
            setLocalState({
                amount,
                amountValidError: safeParse(amountSchema, amount),
            });
        },
        [setLocalState],
    );

    const handleTypeChange: React.ChangeEventHandler<HTMLSelectElement> = useCallback(
        (e) => {
            const type = e.target.value;
            setLocalState({ type });
        },
        [setLocalState],
    );

    const handleAdd = async () => {
        await expenseAdd({
            amount: localState.amount as number,
            type: localState.type,
            date: new Date(),
        });
        setLocalState({
            amount: "",
            amountValidError: "",
        });
        onAdd?.();
    };

    return (
        <Card>
            <CardBody>
                <VStack width="full">
                    <FormControl isRequired isInvalid={!!localState.amountValidError}>
                        <FormLabel>{t("label.expense.amount")}</FormLabel>
                        <Input
                            onChange={handleAmountChange}
                            type="number"
                            value={localState.amount}
                        />
                        <FormErrorMessage>{localState.amountValidError}</FormErrorMessage>
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>{t("label.expense.type")}</FormLabel>
                        <Select value={localState.type} onChange={handleTypeChange}>
                            {types.map((type) => (
                                <option key={type} value={type}>
                                    <Text casing="capitalize">{type}</Text>
                                </option>
                            ))}
                        </Select>
                    </FormControl>

                    <Button
                        onClick={handleAdd}
                        isDisabled={!!localState.amountValidError || !isNumber(localState.amount)}
                    >
                        {t("action.add")}
                    </Button>
                </VStack>
            </CardBody>
        </Card>
    );
}
