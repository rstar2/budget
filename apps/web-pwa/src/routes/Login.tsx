import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSetState } from "react-use";
import { z } from "zod";
import {
    Center,
    VStack,
    Button,
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
    InputGroup,
    InputRightElement,
    IconButton,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

import { useAuthLoginWithEmailAndPassword } from "../cache/auth";
import { useNavigate } from "@tanstack/react-router";
import { safeParse } from "../utils";

const emailSchema = z.string().email({ message: "error.email.invalid" });

// const passwordSpecialSymbols = "^$*.[]{}()?\"!@#%&/,><':;|_~`".split("");
const passwordSchema = z
    .string()
    .min(5, { message: "error.password.min" })
    .max(20, { message: "error.password.max" });
//   .refine(
//     (val) => {
//       return passwordSpecialSymbols.some((specialChar) =>
//         val.includes(specialChar),
//       );
//     },
//     {
//       message: "Must contain special characters",
//     },
//   );

export default function Login() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const login = useAuthLoginWithEmailAndPassword();

    const [localState, setLocalState] = useSetState({
        email: "",
        emailValidError: "",
        password: "",
        passwordValidError: "",
        isShowPassword: false,
    });
    const handleEmailChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
        (e) => {
            const email = e.target.value;
            setLocalState({
                email,
                emailValidError: safeParse(emailSchema, email),
            });
        },
        [setLocalState],
    );

    const handlePasswordChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
        (e) => {
            const password = e.target.value;
            setLocalState({
                password,
                passwordValidError: safeParse(passwordSchema, password),
            });
        },
        [setLocalState],
    );

    const handleLogin = async () => {
        await login(localState);
        navigate({ to: "/home" });
    };

    return (
        <Center w="full" h="full">
            <VStack>
                <FormControl isRequired isInvalid={!!localState.emailValidError}>
                    <FormLabel>{t("label.auth.email")}</FormLabel>
                    <Input onChange={handleEmailChange} />
                    <FormErrorMessage>{localState.emailValidError}</FormErrorMessage>
                </FormControl>

                <FormControl mt={6} isRequired isInvalid={!!localState.passwordValidError}>
                    <FormLabel>{t("label.auth.password")}</FormLabel>
                    <InputGroup>
                        <Input
                            onChange={handlePasswordChange}
                            type={localState.isShowPassword ? "input" : "password"}
                        />
                        <InputRightElement>
                            <IconButton
                                variant="ghost"
                                icon={localState.isShowPassword ? <ViewOffIcon /> : <ViewIcon />}
                                aria-label="Password visibility"
                                onClick={() =>
                                    setLocalState({
                                        isShowPassword: !localState.isShowPassword,
                                    })
                                }
                            />
                        </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>{localState.passwordValidError}</FormErrorMessage>
                </FormControl>

                <Button
                    mt={6}
                    isDisabled={!!localState.emailValidError || !!localState.passwordValidError}
                    onClick={handleLogin}
                >
                    {t("action.login")}
                </Button>
            </VStack>
        </Center>
    );
}
