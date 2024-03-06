# Budget PWA

## Local development

```npm run dev```

## Deploy

```npm run deploy```

## PWA support

### Use the recommended Vite plugin for PWA - https://vite-pwa-org.netlify.app

- It will dynamically inject a manifest file. Before that can generate all needed icon assets using the `@vite-pwa/assets-generator` npm script.
- Use the `registerType: "autoUpdate"` option as thus specific UI could be auto updated on new version
