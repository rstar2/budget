import path from "node:path";

import fg from "fast-glob";

import calculate from "./src/lib/calculate";
import { parseFromFile } from "./src/lib/parse";

(async () => {
    const folderName = path.resolve(__dirname, process.argv[2]);

    const files = await fg(["*.txt"], { cwd: folderName, absolute: true });

    for (const file of files) {
        const monthExpenses = await parseFromFile(files[i]);
        let perMonth = calculate(monthExpenses);
        perMonth = +perMonth.toFixed(2);

        // eslint-disable-next-line no-console
        console.log(
            `Month expenses for ${monthExpenses.month.toLocaleDateString("en", {
                year: "numeric",
                month: "numeric",
            })} : ${perMonth}`,
        );
    }

    process.exit();
})();
