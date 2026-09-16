// Web Notifications Management & Daily Scheduler
//
// Important: this is a local/foreground scheduler. It can display a notification
// while the app is running, but it cannot guarantee delivery while the PWA is
// suspended or closed. Reliable background delivery requires Web Push + a
// server-side scheduler and is intentionally kept separate from this module.

const NotificationManager = {
  STORAGE_KEYS: {
    ENABLED: 'divine_quotes_notifications_enabled',
    HOUR: 'divine_quotes_notification_hour',
    MINUTE: 'divine_quotes_notification_minute',
    LAST_SENT: 'divine_quotes_last_notification_date'
  },

  isEnabled() {
    return localStorage.getItem(this.STORAGE_KEYS.ENABLED) === 'true';
  },

  setEnabled(val) {
    localStorage.setItem(this.STORAGE_KEYS.ENABLED, val ? 'true' : 'false');
  },

  getTime() {
    const hour = parseInt(localStorage.getItem(this.STORAGE_KEYS.HOUR) ?? '8', 10);
    const minute = parseInt(localStorage.getItem(this.STORAGE_KEYS.MINUTE) ?? '0', 10);
    return { hour, minute };
  },

  setTime(hour, minute) {
    localStorage.setItem(this.STORAGE_KEYS.HOUR, hour);
    localStorage.setItem(this.STORAGE_KEYS.MINUTE, minute);
  },

  isStandalone() {
    return window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;
  },

  isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  },

  async requestPermission() {
    if (!('Notification' in window)) {
      return 'unsupported';
    }

    // iOS/iPadOS Web Push is supported for Home Screen web apps. Keep the
    // permission request tied to the user's toggle interaction.
    if (this.isIOS() && !this.isStandalone()) {
      return 'ios-install-required';
    }

    return await Notification.requestPermission();
  },

  async sendQuoteNotification(quote = null) {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return false;
    }

    const q = quote || getRandomQuote();
    const title = `${q.source.emoji} ${q.source.name}`;
    const options = {
      body: `"${q.text}"\n— ${q.citation}`,
      icon: 'icons/icon-192.png',
      badge: 'icons/icon-192.png',
      tag: 'daily-divine-quote',
      renotify: true,
      data: {
        url: window.location.href,
        quoteId: q.id
      }
    };

    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(title, options);
        return true;
      } catch (err) {
        console.warn('SW showNotification failed, falling back to Notification constructor', err);
      }
    }

    try {
      new Notification(title, options);
      return true;
    } catch (e) {
      console.error('Notification error:', e);
      return false;
    }
  },

  checkAndTriggerDailyNotification() {
    if (!this.isEnabled()) return;
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    const now = new Date();
    const { hour, minute } = this.getTime();
    const todayStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    const lastSent = localStorage.getItem(this.STORAGE_KEYS.LAST_SENT);

    if (lastSent === todayStr) return;

    const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();
    const scheduledTotalMinutes = hour * 60 + minute;

    if (currentTotalMinutes >= scheduledTotalMinutes) {
      this.sendQuoteNotification().then((sent) => {
        if (sent) {
          localStorage.setItem(this.STORAGE_KEYS.LAST_SENT, todayStr);
        }
      });
    }
  },

  startDailyChecker() {
    this.checkAndTriggerDailyNotification();
    setInterval(() => {
      this.checkAndTriggerDailyNotification();
    }, 30000);
  }
};
