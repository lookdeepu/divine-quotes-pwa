# 🕊️ Divine Quotes - Progressive Web App (PWA)

A responsive, offline-first Progressive Web App that curates **60 inspiring motivational quotes** from the **Bible**, **Bhagavad Gita**, and **Holy Quran** (20 from each).

Built with zero-build modern web standards (vanilla HTML5, CSS3, ES6 JavaScript) so you can push directly to GitHub and publish on GitHub Pages instantly.

---

## ✨ Features

- **60 Curated Sacred Quotes**: 20 from the Bible, 20 from the Bhagavad Gita, and 20 from the Holy Quran with scripture citations.
- **Dynamic Shuffling**: Displays a random quote upon each launch or when tapping **New Quote**.
- **Category Filter**: View quotes across **All** scriptures or isolate by ✝️ **Bible**, 🕉️ **Gita**, or ☪️ **Quran**.
- **Web Share & Clipboard**: Native mobile share sheet (`navigator.share`) with automatic fallback to clipboard copy.
- **Daily Notifications**: Configure daily notifications at your desired hour and minute with persistent storage.
- **100% Offline Support**: Cached via Service Worker (`sw.js`) so the app works anywhere without internet.
- **Installable PWA**: Can be installed to the home screen on Android, iPhone/iPad (iOS Safari), and Desktop like a native app.

> **Notification note:** The current daily scheduler is a local/foreground scheduler. It can display notifications while the app is running, but reliable delivery while the app is suspended or closed requires a Web Push subscription plus a server-side scheduler. This PR prepares the service worker and iOS onboarding for that architecture; it does not add a push backend.

---

## 🚀 How to Push to GitHub & Publish to GitHub Pages

### Step 1: Create a Repository on GitHub
1. Go to [github.com/new](https://github.com/new).
2. Name your repository (e.g. `divine-quotes-pwa`).
3. Set visibility to **Public** and click **Create repository**.

### Step 2: Push Your Code via Terminal
Open PowerShell or Command Prompt, navigate to this project folder, and run:

```bash
cd "C:\Users\Dr.Tejaswi\.gemini\antigravity\scratch\divine-quotes-pwa"

git init
git add .
git commit -m "Initial commit: Divine Quotes PWA"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/divine-quotes-pwa.git
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repository on GitHub.
2. Click **Settings** → **Pages**.
3. Under **Build and deployment** → **Branch**, select `main` and `/ (root)`.
4. Click **Save**.

---

## 📲 How to Install as an App on Phones

### On Android (Chrome / Edge / Samsung Internet)
1. Open the live GitHub Pages URL.
2. Tap the **Install** banner or browser menu → **Add to Home screen / Install app**.
3. Launch Divine Quotes from the home screen.

### On iPhone & iPad (Safari)
1. Open the live GitHub Pages URL in **Safari**.
2. Tap **Share**.
3. Tap **Add to Home Screen**.
4. Tap **Add**.
5. Launch Divine Quotes from the Home Screen before enabling notifications.

### iPhone notification troubleshooting
- Notifications must be enabled for the installed Home Screen web app.
- If the app is opened only as a normal Safari tab, the notification permission flow in this app asks you to install it first.
- Check iOS Settings → Notifications if permission was previously granted or denied.

---

## 📂 Project Structure

```
divine-quotes-pwa/
├── index.html              # Main HTML5 layout & meta tags
├── css/
│   └── style.css           # Material 3 inspired theme & dark mode
├── js/
│   ├── quotes.js           # 60 quotes database
│   ├── notifications.js    # Notification permission & local scheduler
│   └── app.js              # UI controller & events
├── sw.js                   # Service worker, caching & Web Push handler
├── manifest.webmanifest    # PWA configuration & metadata
├── icons/
│   ├── icon.svg
│   ├── icon-192.png
│   └── icon-512.png
└── README.md
```
