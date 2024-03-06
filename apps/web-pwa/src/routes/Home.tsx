import { useState } from "react";
import { useEffectOnce } from "react-use";
import { useTranslation } from "react-i18next";
import { HStack, Heading, VStack, useTheme } from "@chakra-ui/react";
import { BeatLoader } from "react-spinners";
import firebase, { parseDocs } from "../firebase";

export default function Home() {
    const theme = useTheme();
    const { t } = useTranslation();

    const [data, setData] = useState<string | undefined>();

    useEffectOnce(() => {
        const collection = firebase.collection("data");
        return firebase.onSnapshot(collection, (snapshot) => {
            const data = parseDocs(snapshot);
            setData(JSON.stringify(data));
        });
    });

    return (
        <>
            <VStack height="full">
                <HStack mb={2} flexShrink={0} width="full" justifyContent="space-between">
                    <Heading size="md">{t("data")}</Heading>

                    {/* show loading until data is valid */}
                    {!data ? (
                        <BeatLoader
                            style={{ display: "inline" }}
                            size={8}
                            color={theme.__cssMap["colors.chakra-body-text"].value}
                        />
                    ) : (
                        <Heading size="sm">{data}</Heading>
                    )}
                </HStack>
            </VStack>
        </>
    );
}
