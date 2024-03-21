import { Container, VStack } from "@chakra-ui/react";
import { Outlet, useNavigate } from "@tanstack/react-router";
import HomeFooter from "../components/HomeFooter";
import { useAuthUser } from "../cache/auth";
import { AuthUser } from "../types";
import { useEffect } from "react";

export default function HomeRoot() {
    const navigate = useNavigate();
    const authUser = useAuthUser();

    useEffect(() => {
        if (authUser !== AuthUser.Auth) {
            navigate({ to: "/" });
            return;
        }
    }, [authUser, navigate]);

    return (
        <VStack height="full">
            <Container flexGrow={1} overflow="auto" mb={2} maxW="90%">
                <Outlet />
            </Container>
            <HomeFooter />
        </VStack>
    );
}
