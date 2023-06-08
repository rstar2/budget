/* eslint-disable no-console */

/**
 * This is dynamic configuration (while app.json is static)
 * https://docs.expo.dev/workflow/configuration/
 *
 * Will receive config as the app.json if present
 */
module.exports = ({ config }) => {
    console.log(`Incoming config`, JSON.stringify(config));

    return {
        name: "Budget",
        slug: "budget",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/budget-icon.png",
        userInterfaceStyle: "light",
        splash: {
            image: "./assets/budget-splash.png",
            resizeMode: "cover",
            backgroundColor: "#F5AF19",
        },
        updates: {
            fallbackToCacheTimeout: 0,
        },
        assetBundlePatterns: ["**/*"],
        ios: {
            supportsTablet: true,
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/budget-adaptive-icon.png",
                backgroundColor: "#F5AF19",
            },
            package: "com.rumenneshev.apps",
        },
        web: {
            favicon: "./assets/favicon.png",
        },
        extra: {
            // fact: 'kittens are cool',
            // All values in extra will be passed to your app. Like in App.ts
            //    import Constants from 'expo-constants';
            //    Constants.expoConfig.extra.fact === 'kittens are cool';

            eas: {
                projectId: "44647bcc-80fa-40d2-b01f-ecec98c0e864",
            },
        },
    };
};
