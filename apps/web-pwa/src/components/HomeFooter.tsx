import { useState, useCallback } from "react";
import { HStack, IconButton } from "@chakra-ui/react";
import { CiSettings as SettingsIcon } from "react-icons/ci";
import { PiChartLine as ChartLineIcon } from "react-icons/pi";
import { PiChartPieSlice as ChartPieSliceIcon } from "react-icons/pi";
import { PiListBullets as ListBulletsIcon } from "react-icons/pi";

import HomeDrawer from "../components/HomeDrawer";
import { HomeDrawerMode } from "../types";
import { enumValues, missingHandling } from "../utils";

const size = "32px";

const actions = enumValues(HomeDrawerMode)
    // @ts-expect-error (it  is HomeDrawerMode)
    .map((mode: HomeDrawerMode) => {
        let ariaLabel, Icon;
        switch (mode) {
            case HomeDrawerMode.list_month:
                ariaLabel = "Month Expenses";
                Icon = ListBulletsIcon;
                break;
            case HomeDrawerMode.chart_month:
                ariaLabel = "Month Chart";
                Icon = ChartPieSliceIcon;
                break;
            case HomeDrawerMode.chart_months:
                ariaLabel = "Months Chart";
                Icon = ChartLineIcon;
                break;
            case HomeDrawerMode.settings:
                ariaLabel = "Settings";
                Icon = SettingsIcon;
                break;
            default:
                missingHandling(mode);
        }

        return {
            ariaLabel,
            Icon,
            action: mode,
        };
    });
export default function HomeFooter() {
    const [drawerMode, setDrawerMode] = useState<HomeDrawerMode>();

    const handleDrawerMode = useCallback(
        // @ts-expect-error (dataset is present on the input element)
        (e: React.MouseEvent) => setDrawerMode(e.target.dataset.action),
        [setDrawerMode],
    );
    const handleDrawerClose = useCallback(() => setDrawerMode(undefined), [setDrawerMode]);

    return (
        <>
            <HStack justifyContent="space-around" width="full" mb={2}>
                {actions.map((action) => (
                    <IconButton
                        aria-label={action.ariaLabel}
                        icon={
                            <action.Icon
                                size={size}
                                data-action={action.action}
                                onClick={handleDrawerMode}
                            />
                        }
                    />
                ))}
            </HStack>

            <HomeDrawer mode={drawerMode} onClose={handleDrawerClose} />
        </>
    );
}
