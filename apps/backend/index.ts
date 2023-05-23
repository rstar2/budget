/* eslint-disable no-console */
import path from "node:path";

import { parseFromFile } from "./src/lib/parse";
import calculate from "./src/lib/calculate";

(async () => {
    let fileName = process.argv[2];
    fileName = path.resolve(__dirname, fileName);

    const monthExpenses = await parseFromFile(fileName);
    let perMonth = calculate(monthExpenses);
    perMonth = +perMonth.toFixed(2);

    console.log(
        `Month expenses for ${monthExpenses.month.toLocaleDateString("en", {
            year: "numeric",
            month: "long",
        })} : ${perMonth}`,
    );

    process.exit();
})();
