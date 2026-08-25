name: Build Android APK

on:
  push:
    branches: [ "main", "master" ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Setup Java JDK 17
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'

      - name: Build Web & Create APK
        run: |
          set -e
          echo "=== 1. 패키지 설치 ==="
          npm install --legacy-peer-deps
          npm install @capacitor/core @capacitor/cli @capacitor/android --save-dev

          echo "=== 2. 웹 번들 빌드 ==="
          npm run build || npx vite build

          echo "=== 3. Capacitor 설정 ==="
          cat << 'EOF' > capacitor.config.json
          {
            "appId": "kr.co.bluecall.app",
            "appName": "Blue Call",
            "webDir": "dist"
          }
          EOF

          echo "=== 4. Android 플랫폼 생성 ==="
          rm -rf android
          npx cap add android
          npx cap sync android

          echo "=== 5. Gradle APK 빌드 ==="
          cd android
          chmod +x gradlew
          ./gradlew assembleDebug --no-daemon

      - name: Upload Debug APK
        uses: actions/upload-artifact@v4
        with:
          name: BlueCall-debug-apk
          path: android/app/build/outputs/apk/debug/app-debug.apk
