import { useRef, useMemo } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    // Legend,
    ResponsiveContainer,
} from "recharts";
import { useTranslation } from "react-i18next";

import { useExpenseMonths, useExpensesPerMonths } from "../cache/expenses";
import { getExpensesThemeColor } from "../utils";
import { useToken } from "@chakra-ui/react";

let recreateKey = 0;

export default function ViewReportMonths() {
    const months = useExpenseMonths();
    const monthsUsed = useRef(months);

    if (months !== monthsUsed.current) {
        monthsUsed.current = months;
        recreateKey++;
    }

    return <ViewReportMonthsImpl key={recreateKey} months={months} />;
}

function ViewReportMonthsImpl({ months }: { months: string[] }) {
    const { t } = useTranslation();
    const expensesPerMonths = useExpensesPerMonths(months);

    // currently only combined/all amount is calculated
    const series = useMemo(() => {
        return [
            {
                name: t("label.all"),
                data: expensesPerMonths.map(({ month, expenses }) => ({
                    month,
                    amount: expenses.reduce((res, expense) => res + expense.amount, 0),
                })),
            },
        ];
    }, [expensesPerMonths, t]);

    return (
        <>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart width={500} height={300}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" type="category" />
                    <YAxis dataKey="amount" />
                    <Tooltip />
                    {/* <Legend /> */}
                    {series.map((s) => (
                        <Line
                            dataKey="amount"
                            data={s.data}
                            name={s.name}
                            key={s.name}
                            // make it curved/interpolated
                            // type="monotone"
                            // set color
                            // stroke="red"
                            activeDot={{ r: 6 }}
                            label={<AmountLabel />}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </>
    );
}

function AmountLabel(props: any) {
    const {
        /* these are default props from recharts */
        x,
        y,
        value,
        /* can pass any custom props from the parent */
    } = props;

    // get Chakra theme color , like "red.100"
    const themeColor = getExpensesThemeColor(value);
    // convert it ot real value RGB color
    const color = useToken(
        // the key within the theme, in this case `theme.colors`
        "colors",
        // the subkey(s), resolving to `theme.colors.red.100`
        themeColor,
        // a single fallback or fallback array matching the length of the previous arg
    );
    return (
        <g transform={`translate(${x},${y})`}>
            <text
                x={0}
                y={0}
                dy={-8}
                fill={color}
                fontSize={14}
                textAnchor="middle"
                /* transform="rotate(-35)" */
            >
                {value}
            </text>
        </g>
    );
}
