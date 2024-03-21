import path from "node:path";
import { fileURLToPath } from "node:url";

import dotenv from "dotenv";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.resolve(__dirname, "../..");

// https://vitejs.dev/config/
export default defineConfig((/* { mode, command, isSsrBuild, isPreview } */) => {
    // NOTE: both files ".env" and ".env.local" are obligatory to be present,
    // so dotenv.config() will throw error if they are not
    let envs = dotenv.config({ path: path.resolve(root, ".env") });
    if (envs.error) throw envs.error;
    envs = dotenv.config({ path: path.resolve(root, ".env.local"), override: true });
    if (envs.error) throw envs.error;

    // import/define all FIREBASE_xxx environment variables into the Vite-React app,
    // Note - define then again with "import.meta.env.VITE_xxx" name just for consistency, but it can whatever name
    const defineFirebaseEnvs = Object.keys(process.env)
        .filter((key) => key.startsWith("FIREBASE_"))
        .reduce((res, key) => {
            res["import.meta.env.VITE_" + key] = JSON.stringify(process.env[key]);
            return res;
        }, {} as { [key: string]: string });

    return {
        server: {
            // this will make it listen to all addresses like 0.0.0.0 not just the default "localhost"
            // https://vitejs.dev/config/server-options
            host: true,
        },

        define: {
            // __APP_VERSION__: JSON.stringify("v1.0.0"),
            // __API_URL__: "window.__backend_api_url",
            // "import.meta.env.ENV_VARIABLE": JSON.stringify(process.env.ENV_VARIABLE),
            ...defineFirebaseEnvs,
        },

        plugins: [
            react(),

            // for PWA - https://vite-pwa-org.netlify.app/guide/
            VitePWA({
                // // with "autoUpdate" it will auto update
                // registerType: "autoUpdate",
                // with "prompt" in registerSW.tsx the new--version logic is handled
                registerType: "prompt",

                includeAssets: [
                    "favicon.ico",
                    "apple-touch-icon-180x180.png",
                    "maskable-icon-512x512.png",
                ],

                // dynamic manifest generation
                // NOTE - the images are generated with the npm script `generate-pwa-assets`,
                // which uses the `pwa-assets-generator` node lib
                manifest: {
                    name: "Budget Calendar",
                    short_name: "Budget",
                    description: "Budget reports per day",
                    icons: [
                        {
                            src: "/pwa-192x192.png",
                            sizes: "192x192",
                            type: "image/png",
                            purpose: "favicon",
                        },
                        {
                            src: "/pwa-512x512.png",
                            sizes: "512x512",
                            type: "image/png",
                            purpose: "favicon",
                        },
                        {
                            src: "/apple-touch-icon-180x180.png",
                            sizes: "180x180",
                            type: "image/png",
                            purpose: "apple touch icon",
                        },
                        {
                            src: "/maskable-icon-512x512.png",
                            sizes: "512x512",
                            type: "image/png",
                            purpose: "any maskable",
                        },
                    ],
                    theme_color: "#444466",
                    background_color: "#113344",
                    display: "standalone",
                    // setting orientation fixes it and it cannot be changed,
                    // not setting a value allows the user to change it by rotating the telephone
                    // orientation: "any", "natural", "portrait"
                    scope: "/",
                    start_url: "/",
                },

                //   workbox: {
                //     globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
                //   },

                //   injectRegister: "script",
                //   strategies: "injectManifest",
                //   srcDir: "src",
                //   filename: "sw.ts",

                devOptions: {
                    enabled: true,
                    type: "module",
                },
            }),
        ],
    };
});
