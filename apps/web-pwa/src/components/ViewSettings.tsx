import { Button } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useAuthLogout } from "../cache/auth";

export default function ViewSettings() {
    const { t } = useTranslation();
    const logout = useAuthLogout();

    return <Button onClick={() => logout()}>{t("action.logout")}</Button>;
}
