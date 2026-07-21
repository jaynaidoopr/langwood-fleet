# Building the Kevin GPS Android app

This project has already been:
- Simplified for mobile: the bottom nav and side drawer now only show **Map, Devices, Trips, Alerts** (plus Settings/Sign out in the drawer) — no clutter.
- Wrapped with **Capacitor** so it can run as a native Android app. The `android/` folder is a full Gradle project with your web app already built into it.

## What you need on your own machine
- [Android Studio](https://developer.android.com/studio) (includes the Android SDK) — this is required; it can't be done in this sandbox since it needs Google's SDK servers.
- Node.js 18+ (only needed if you want to change the code and rebuild the web app)

## Fastest path: just get the APK
1. Unzip this project.
2. Open **Android Studio** → "Open" → select the `android/` folder (not the project root).
3. Let Gradle sync (first time will download the Android Gradle Plugin — needs internet).
4. Build → Build Bundle(s) / APK(s) → **Build APK(s)**.
5. Install the resulting APK from `android/app/build/outputs/apk/debug/app-debug.apk` onto your phone (enable "Install unknown apps" for whichever app you use to open the file).

## If you want to change code and rebuild the web layer
```bash
npm install
npm run build          # builds the web app into dist/
npx cap sync android    # copies dist/ into android/app/src/main/assets/public
```
Then rebuild in Android Studio as above.

## Important: pointing it at your Traccar server
By default this points at the public demo server (`https://demo3.traccar.org`). To use your own server:
1. Edit `.env.production` → set `VITE_TRACCAR_URL=https://your-server.com`.
2. Since the app runs as a native shell (not a browser tab), your Traccar server must allow CORS from the app. Add this to `traccar.xml` on your server:
   ```xml
   <entry key='web.origin'>https://localhost</entry>
   ```
   (Capacitor Android apps make requests with origin `https://localhost` by default.)
3. Re-run the build steps above.

## App identity
- Package name: `com.kevin.gpsmobile` (change in `capacitor.config.ts` and `android/app/build.gradle` if you want a different one)
- App name shown on the phone: "Kevin GPS"

You can change the launcher icon by replacing the files in `android/app/src/main/res/mipmap-*/`.
