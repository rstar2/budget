import { useEffect, useCallback, useState } from "react";
import {
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerOverlay,
    HStack,
    Heading,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { useTranslation } from "react-i18next";
import ViewSettings from "./ViewSettings";
import ViewListMonth from "./ViewListMonth";
import ViewChartMonth from "./ViewChartMonth";
import ViewChartMonths from "./ViewChartMonths";
import { HomeDrawerMode } from "../types";
import { missingHandling } from "../utils";

type HomeHeaderProps = React.PropsWithChildren<{
    mode: HomeDrawerMode | undefined;
    onClose: () => void;
}>;

export default function HomeDrawer({ mode, onClose }: HomeHeaderProps) {
    const { t } = useTranslation();

    const [isOpen, setOpen] = useState(false);

    useEffect(() => {
        if (!mode) {
            setOpen((isOpen) => {
                if (isOpen) history.replaceState(history.state, "", window.location.href);
                return false;
            });
        } else {
            setOpen(true);
            history.replaceState(history.state, "", window.location.href + "?drawerMode=" + mode);
            window.addEventListener("popstate", onClose);
            return () => window.removeEventListener("popstate", onClose);
        }
    }, [setOpen, mode, onClose]);
    const handleClose = useCallback(() => history.back(), []);

    let view;
    let header;
    switch (mode) {
        case undefined:
            // this is when drawer is closed
            view = "";
            header = "title";
            break;
        case HomeDrawerMode.list_month:
            view = <ViewListMonth />;
            header = "view.listMonth";
            break;
        case HomeDrawerMode.chart_month:
            view = <ViewChartMonth />;
            header = "view.chartMonth";
            break;
        case HomeDrawerMode.chart_months:
            view = <ViewChartMonths />;
            header = "view.chartMonths";
            break;
        case HomeDrawerMode.settings:
            view = <ViewSettings />;
            header = "view.settings";
            break;
        default:
            missingHandling(mode);
    }
    return (
        <Drawer isOpen={isOpen} onClose={handleClose} placement="left" size="full">
            <DrawerOverlay />
            <DrawerContent>
                <HStack justifyContent="space-between" px={3} m={2}>
                    <Heading>{t(header)}</Heading>
                    <CloseIcon onClick={handleClose} />
                </HStack>
                <DrawerBody> {view} </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
}
