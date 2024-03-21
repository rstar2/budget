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
import ViewReportMonth from "./ViewReportMonth";
import ViewReportMonths from "./ViewReportMonths";
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
    switch (mode) {
        case undefined:
            // this is when drawer is closed
            view = "";
            break;
        case HomeDrawerMode.month:
            view = <ViewReportMonth />;
            break;
        case HomeDrawerMode.months:
            view = <ViewReportMonths />;
            break;
        case HomeDrawerMode.settings:
            view = <ViewSettings />;
            break;
        default:
            missingHandling(mode);
    }
    return (
        <Drawer isOpen={isOpen} onClose={handleClose} placement="left" size="full">
            <DrawerOverlay />
            <DrawerContent>
                <HStack justifyContent="space-between" px={3} mb={2}>
                    <Heading>{t("title")}</Heading>
                    <CloseIcon onClick={handleClose} />
                </HStack>
                <DrawerBody> {view} </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
}
