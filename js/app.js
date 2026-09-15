// Main Application Logic

let currentQuote = null;
let currentFilter = null;
let deferredPrompt = null;

// DOM Elements
const quoteCard = document.getElementById('quoteCard');
const quoteEmoji = document.getElementById('quoteEmoji');
const quoteSource = document.getElementById('quoteSource');
const quoteText = document.getElementById('quoteText');
const quoteCitation = document.getElementById('quoteCitation');

const newQuoteBtn = document.getElementById('newQuoteBtn');
const shareBtn = document.getElementById('shareBtn');
const copyBtn = document.getElementById('copyBtn');
const filterChips = document.querySelectorAll('.chip');

const bellBtn = document.getElementById('bellBtn');
const settingsModal = document.getElementById('settingsModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const doneModalBtn = document.getElementById('doneModalBtn');
const notifToggle = document.getElementById('notifToggle');
const religionSection = document.getElementById('religionSection');
const religionSelect = document.getElementById('religionSelect');
const timeSection = document.getElementById('timeSection');
const hourInput = document.getElementById('hourInput');
const minuteInput = document.getElementById('minuteInput');
const timeDisplay = document.getElementById('timeDisplay');
const hintBanner = document.getElementById('hintBanner');
const enableNotifHintBtn = document.getElementById('enableNotifHintBtn');
const installBanner = document.getElementById('installBanner');
const installBtn = document.getElementById('installBtn');
const toast = document.getElementById('toast');

// Format time string
function formatDisplayTime(hour, minute) {
  const ampm = hour < 12 ? 'AM' : 'PM';
  let h = hour % 12;
  if (h === 0) h = 12;
  const m = minute.toString().padStart(2, '0');
  return `${h}:${m} ${ampm}`;
}

// Display quote with transition
function displayQuote(quote) {
  currentQuote = quote;
  quoteCard.classList.add('fade-out');

  setTimeout(() => {
    quoteEmoji.textContent = quote.source.emoji;
    quoteSource.textContent = quote.source.name;
    quoteText.textContent = `“${quote.text}”`;
    quoteCitation.textContent = `— ${quote.citation}`;
    quoteCard.classList.remove('fade-out');
  }, 180);
}

// Show toast message
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

// Update UI based on filter
function setFilter(filterKey) {
  currentFilter = filterKey;
  filterChips.forEach(chip => {
    const key = chip.dataset.filter || null;
    if (key === currentFilter) {
      chip.classList.add('selected');
    } else {
      chip.classList.remove('selected');
    }
  });

  const nextQuote = getRandomQuote(currentFilter);
  displayQuote(nextQuote);
}

// Share Quote
async function shareQuote() {
  if (!currentQuote) return;

  const shareData = {
    title: `${currentQuote.source.name} Quote`,
    text: `"${currentQuote.text}"\n— ${currentQuote.citation}\n\n${currentQuote.source.emoji} ${currentQuote.source.name}`,
    url: window.location.href
  };

  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
    } catch (err) {
      if (err.name !== 'AbortError') {
        copyQuoteToClipboard();
      }
    }
  } else {
    copyQuoteToClipboard();
  }
}

// Copy Quote
function copyQuoteToClipboard() {
  if (!currentQuote) return;

  const text = `"${currentQuote.text}"\n— ${currentQuote.citation}\n\n${currentQuote.source.emoji} ${currentQuote.source.name}`;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Quote copied to clipboard!');
    }).catch(() => {
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    showToast('Quote copied to clipboard!');
  } catch (e) {
    showToast('Failed to copy');
  }
  document.body.removeChild(textarea);
}

// Notification Settings Modal
function openSettingsModal() {
  const isEnabled = NotificationManager.isEnabled();
  const { hour, minute } = NotificationManager.getTime();

  notifToggle.checked = isEnabled;
  religionSelect.value = NotificationManager.getReligion();
  hourInput.value = hour.toString().padStart(2, '0');
  minuteInput.value = minute.toString().padStart(2, '0');
  timeDisplay.textContent = `Daily notification scheduled at ${formatDisplayTime(hour, minute)}`;

  if (isEnabled) {
    religionSection.classList.add('visible');
    timeSection.classList.add('visible');
  } else {
    religionSection.classList.remove('visible');
    timeSection.classList.remove('visible');
  }

  settingsModal.classList.add('open');
}

function closeSettingsModal() {
  settingsModal.classList.remove('open');
}

function updateNotificationUIState() {
  const isEnabled = NotificationManager.isEnabled();
  if (isEnabled) {
    bellBtn.classList.add('active');
    hintBanner.style.display = 'none';
  } else {
    bellBtn.classList.remove('active');
    hintBanner.style.display = 'flex';
  }
}

async function handleNotificationToggle(e) {
  const willEnable = e.target.checked;
  if (willEnable) {
    const permission = await NotificationManager.requestPermission();
    if (permission === 'granted') {
      NotificationManager.setEnabled(true);
      religionSection.classList.add('visible');
      timeSection.classList.add('visible');
      updateNotificationUIState();
      showToast('Daily notifications enabled!');
    } else if (permission === 'denied') {
      notifToggle.checked = false;
      NotificationManager.setEnabled(false);
      religionSection.classList.remove('visible');
      timeSection.classList.remove('visible');
      showToast('Permission denied. Please allow notifications in browser settings.');
    } else {
      notifToggle.checked = false;
      NotificationManager.setEnabled(false);
      religionSection.classList.remove('visible');
      timeSection.classList.remove('visible');
      showToast('Notifications are not supported in this browser.');
    }
  } else {
    NotificationManager.setEnabled(false);
    religionSection.classList.remove('visible');
    timeSection.classList.remove('visible');
    updateNotificationUIState();
    showToast('Daily notifications disabled');
  }
}

function handleReligionChange() {
  NotificationManager.setReligion(religionSelect.value);
  showToast(religionSelect.value
    ? `Daily notifications set to ${religionSelect.options[religionSelect.selectedIndex].text.replace(/^\S+\s/, '')}`
    : 'Daily notifications set to all religions');
}

function handleTimeChange() {
  let h = parseInt(hourInput.value, 10);
  let m = parseInt(minuteInput.value, 10);

  if (isNaN(h) || h < 0) h = 0;
  if (h > 23) h = 23;
  if (isNaN(m) || m < 0) m = 0;
  if (m > 59) m = 59;

  hourInput.value = h.toString().padStart(2, '0');
  minuteInput.value = m.toString().padStart(2, '0');

  NotificationManager.setTime(h, m);
  timeDisplay.textContent = `Daily notification scheduled at ${formatDisplayTime(h, m)}`;
}

// Event Listeners
newQuoteBtn.addEventListener('click', () => {
  displayQuote(getRandomQuote(currentFilter));
});

shareBtn.addEventListener('click', shareQuote);
copyBtn.addEventListener('click', copyQuoteToClipboard);

filterChips.forEach(chip => {
  chip.addEventListener('click', () => {
    const key = chip.dataset.filter || null;
    setFilter(key);
  });
});

bellBtn.addEventListener('click', openSettingsModal);
closeModalBtn.addEventListener('click', closeSettingsModal);
doneModalBtn.addEventListener('click', closeSettingsModal);
settingsModal.addEventListener('click', (e) => {
  if (e.target === settingsModal) closeSettingsModal();
});

enableNotifHintBtn.addEventListener('click', openSettingsModal);

notifToggle.addEventListener('change', handleNotificationToggle);
religionSelect.addEventListener('change', handleReligionChange);
hourInput.addEventListener('change', handleTimeChange);
minuteInput.addEventListener('change', handleTimeChange);

// PWA Installation Hook
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBanner.classList.add('show');
});

installBtn.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === 'accepted') {
    showToast('Thank you for installing Divine Quotes!');
  }
  deferredPrompt = null;
  installBanner.classList.remove('show');
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => {
        console.log('Service Worker registered successfully:', reg.scope);
      })
      .catch(err => {
        console.log('Service Worker registration failed:', err);
      });
  });
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  updateNotificationUIState();
  NotificationManager.startDailyChecker();
  displayQuote(getRandomQuote());
});
