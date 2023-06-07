# Budget ReactNative App

A [react-native](https://reactnative.dev/) app built using [expo](https://docs.expo.dev/)

## Expo

If running with `expo start` then pressing `a` will open Android emulator/device, but pressing `shift-a` will allow to choose from all available emulator/devices

- The name of the app is set in `app.json` BUT if changed then the 'android' folder has to be removed in order to be recreated properly with the new name in ApplicationManifest.xml

## EAS build

- Login to EAS `eas login`
- Build an AppStore app (in Android - AAB file) `npm run build`
- Build a direct installable app (in Android - APK file) `npm run build:apk`
