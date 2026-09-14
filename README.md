# 🕊️ Divine Quotes - Progressive Web App (PWA)

A responsive, offline-first Progressive Web App that curates **60 inspiring motivational quotes** from the **Bible**, **Bhagavad Gita**, and **Holy Quran** (20 from each). 

Built with zero-build modern web standards (vanilla HTML5, CSS3, ES6 JavaScript) so you can push directly to GitHub and publish on **GitHub Pages** instantly.

---

## ✨ Features

- **60 Curated Sacred Quotes**: 20 from the Bible, 20 from the Bhagavad Gita, and 20 from the Holy Quran with scripture citations.
- **Dynamic Shuffling**: Displays a random quote upon each launch or when tapping **New Quote**.
- **Category Filter**: View quotes across **All** scriptures or isolate by ✝️ **Bible**, 🕉️ **Gita**, or ☪️ **Quran**.
- **Web Share & Clipboard**: Native mobile share sheet (`navigator.share`) with automatic fallback to clipboard copy.
- **Daily Notifications**: Configure daily notifications at your desired hour and minute with persistent storage.
- **100% Offline Support**: Cached via Service Worker (`sw.js`) so the app works anywhere without internet.
- **Installable PWA**: Can be installed to the home screen on Android, iPhone/iPad (iOS Safari), and Desktop like a native app.

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

# Initialize git repository
git init

# Add all files and commit
git add .
git commit -m "Initial commit: Divine Quotes PWA"

# Set branch name to main
git branch -M main

# Link your GitHub repository (replace USERNAME and REPO with yours)
git remote add origin https://github.com/YOUR_USERNAME/divine-quotes-pwa.git

# Push to GitHub
git push -u origin main
```

### Step 3: Enable GitHub Pages (3 Clicks)
1. Go to your repository on GitHub.
2. Click **Settings** (tab on the top right).
3. In the left sidebar, click **Pages**.
4. Under **Build and deployment** > **Branch**:
   - Select **`main`** branch.
   - Leave the folder as **`/ (root)`**.
   - Click **Save**.
5. Within 1–2 minutes, GitHub will give you your live URL:
   ```
   https://YOUR_USERNAME.github.io/divine-quotes-pwa/
   ```

---

## 📲 How to Install as an App on Phones

### On Android (Chrome / Edge / Samsung Internet):
1. Open your live GitHub Pages URL.
2. Tap the **Install** banner on screen, or tap the three-dots menu (**⋮**) in Chrome.
3. Tap **Add to Home screen** or **Install app**.
4. The Divine Quotes icon will now appear on your home screen and run in fullscreen standalone mode.

### On iPhone & iPad (Safari):
1. Open your live GitHub Pages URL in **Safari**.
2. Tap the **Share** button (the square with an arrow pointing up).
3. Scroll down and tap **Add to Home Screen**.
4. Tap **Add** in the top-right corner.

---

## 📂 Project Structure

```
divine-quotes-pwa/
├── index.html              # Main HTML5 layout & meta tags
├── css/
│   └── style.css           # Material 3 inspired theme & dark mode
├── js/
│   ├── quotes.js           # 60 quotes database (Bible, Gita, Quran)
│   ├── notifications.js    # Web Notifications & daily scheduler
│   └── app.js              # UI controller & events
├── sw.js                   # Service worker for offline caching & A2HS
├── manifest.webmanifest    # PWA configuration & metadata
├── icons/
│   ├── icon.svg            # Scalable vector icon
│   ├── icon-192.png        # Standard PWA icon
│   └── icon-512.png        # High-res PWA icon
└── README.md               # Documentation & deployment guide
```
