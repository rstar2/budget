import { HStack, Heading, VStack, useTheme } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BeatLoader } from "react-spinners";
import { useEffectOnce } from "react-use";

export default function Home() {
    const theme = useTheme();
    const { t } = useTranslation();

    const [data, setData] = useState<string | undefined>();

    useEffectOnce(() => {
        setTimeout(() => {
            setData("hello");
        }, 5000);
    });

    return (
        <>
            <VStack height="full">
                <HStack mb={2} flexShrink={0} width="full" justifyContent="space-between">
                    {/* show loading until data is valid */}
                    {!data ? (
                        <BeatLoader
                            style={{ display: "inline" }}
                            size={8}
                            color={theme.__cssMap["colors.chakra-body-text"].value}
                        />
                    ) : (
                        <Heading size="md">{t("data")}</Heading>
                    )}
                </HStack>
            </VStack>
        </>
    );
}
