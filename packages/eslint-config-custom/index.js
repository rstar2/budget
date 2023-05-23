module.exports = {
    extends: ["next", "turbo", "prettier"],
    plugins: ["prettier"],
    rules: {
        "@next/next/no-html-link-for-pages": "off",
    },
    parserOptions: {
        babelOptions: {
            presets: [require.resolve("next/babel")],
        },
    },
    rules: {
        "prettier/prettier": "error",

        "react/jsx-key": "off",

        "no-console": "error",
    },
};
