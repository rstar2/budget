import { useState, useCallback } from "react";
import { HStack, IconButton } from "@chakra-ui/react";
import { HamburgerIcon as MenuIcon } from "@chakra-ui/icons";
import { PiChartLine as ChartLine } from "react-icons/pi";
import { PiChartPieSlice as ChartPieSlice } from "react-icons/pi";
import HomeDrawer from "../components/HomeDrawer";
import { HomeDrawerMode } from "../types";

const size = "32px";

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
                <IconButton
                    aria-label="Chart month"
                    icon={
                        <ChartPieSlice
                            size={size}
                            data-action={HomeDrawerMode.month}
                            onClick={handleDrawerMode}
                        />
                    }
                />
                <IconButton
                    aria-label="Chart months"
                    icon={
                        <ChartLine
                            size={size}
                            data-action={HomeDrawerMode.months}
                            onClick={handleDrawerMode}
                        />
                    }
                />
                <IconButton
                    aria-label="Settings"
                    icon={
                        <MenuIcon
                            boxSize={size}
                            data-action={HomeDrawerMode.settings}
                            onClick={handleDrawerMode}
                        />
                    }
                />
            </HStack>

            <HomeDrawer mode={drawerMode} onClose={handleDrawerClose} />
        </>
    );
}
