import {
    Box,
    Container,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerOverlay,
    HStack,
    Heading,
    useDisclosure,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { Outlet } from "@tanstack/react-router";

import { useTranslation } from "react-i18next";

export default function HomeRoot() {
    return (
        <Container display="flex" flexDirection="column" maxW="90%">
            <HeaderWithDrawer />
            <Box flexGrow={1} overflow="auto" mb={2}>
                <Outlet />
            </Box>
        </Container>
    );
}

function HeaderWithDrawer({ children }: React.PropsWithChildren) {
    const { t } = useTranslation();
    const { isOpen, onToggle, onClose } = useDisclosure();

    return (
        <>
            <HStack mb={2} flexShrink={0}>
                <HamburgerIcon onClick={onToggle} />
                <Heading>{t("title")}</Heading>
            </HStack>

            <Drawer isOpen={isOpen} onClose={onClose} placement="left">
                <DrawerOverlay />
                <DrawerContent>
                    <HStack>
                        <HamburgerIcon onClick={onToggle} />
                    </HStack>
                    <DrawerBody>{children}</DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
}
