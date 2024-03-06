import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Center, VStack } from "@chakra-ui/react";
import { PuffLoader as Loader } from "react-spinners";

import { useAuthUser } from "../cache/auth";
import { AuthUser } from "../types";

const splashMinShowTime = 1000;

let splashStart: number | undefined;

export default function Splash() {
    const navigate = useNavigate();

    // NOTE: do not trigger Suspense from this component
    // const { t, i18n } = useTranslation(undefined, { useSuspense: false });

    const authUser = useAuthUser();

    useEffect(() => {
        if (!splashStart) splashStart = Date.now();

        let to: string | undefined;
        if (authUser === AuthUser.Auth) to = "/home";
        else if (authUser === AuthUser.NotAuth) to = "/login";

        if (to) {
            const splashShown = Date.now() - splashStart;
            if (splashShown > splashMinShowTime) navigate({ to });
            else {
                setTimeout(() => navigate({ to }), splashMinShowTime - splashShown);
            }
        }
    }, [authUser, navigate]); // navigate is stable, but to make ESLINT happy

    // const loading = i18n.exists("loading") ? t("loading") : "...";

    return (
        <Center w="full" h="full">
            <VStack>
                {/* <Text color="brand.400">{loading}</Text> */}
                <Loader color="var(--chakra-colors-brand-400)" size={100} />
            </VStack>
        </Center>
    );
}
