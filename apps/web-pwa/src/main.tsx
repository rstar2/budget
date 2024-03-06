import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";

import { RouterProvider } from "./routes";
import { CacheProvider } from "./cache/index.tsx";
import theme from "./theme.ts";

import "./main.css";

import "./registerSW.ts";

import "./i18n.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ChakraProvider resetCSS theme={theme}>
            <CacheProvider>
                <RouterProvider />
            </CacheProvider>
        </ChakraProvider>
    </React.StrictMode>,
);
