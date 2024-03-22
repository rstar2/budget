import { useMemo, useCallback } from "react";
import { PuffLoader as Loader } from "react-spinners";
import { useTranslation, type UseTranslationResponse } from "react-i18next";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

import { useExpenses, useExpenseTypes } from "../cache/expenses";
import { getTypeColor } from "../colors";

type PieCell = any;
type TFunction = UseTranslationResponse<any, unknown>["t"];

export default function ViewChartMonth() {
    const { t } = useTranslation();
    const types = useExpenseTypes();
    const expenses = useExpenses(new Date());

    const colors = useMemo(() => {
        const colors = {} as Record<string, string>;
        if (!types) return colors;

        for (const type of types) {
            colors[type] = getTypeColor(type);
        }
        return colors;
    }, [types]);

    const renderLabel = useCallback((cell: PieCell) => renderCustomizedLabel(cell, t), [t]);

    if (!expenses || !types) return <Loader />;
    return (
        <>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={expenses}
                        dataKey="amount"
                        cx="50%"
                        cy="50%"
                        outerRadius={"80%"}
                        // label
                        label={renderLabel}
                        labelLine={false}
                    >
                        {expenses.map(({ type }) => (
                            <Cell key={type} fill={colors[type]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </>
    );
}

// const RADIAN = Math.PI / 180;
const renderCustomizedLabel = (cell: PieCell, t: TFunction) => {
    // const { cx, cy, midAngle, innerRadius, outerRadius, percent, payload } = cell;
    // const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    // const x = cx + radius * Math.cos(-midAngle * RADIAN);
    // const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // return (s
    //     <text
    //         x={x}
    //         y={y}
    //         fill="white"
    //         textAnchor={x > cx ? "start" : "end"}
    //         dominantBaseline="central"
    //     >
    //         {`${payload.type} - ${(percent * 100).toFixed(0)}%`}
    //     </text>
    // );

    const { percent, payload } = cell;
    return `${t(`label.type.${payload.type}`)} - ${Math.round(percent * 100)}%`;
};
