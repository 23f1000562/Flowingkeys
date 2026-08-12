document.addEventListener('DOMContentLoaded', () => {
  // 1. THEME TOGGLER
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  // Check saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
  }

  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  // 2. FALLING CHERRY BLOSSOM PETALS GENERATOR
  const petalContainer = document.getElementById('petal-container');
  const maxPetals = 25;

  function createPetal() {
    // Limit active petals for performance
    if (petalContainer.children.length >= maxPetals) return;

    const petal = document.createElement('div');
    petal.classList.add('petal');

    const size = Math.random() * 8 + 6; // 6px to 14px
    const startX = Math.random() * window.innerWidth;
    const duration = Math.random() * 6 + 6; // 6s to 12s
    const delay = Math.random() * 4;

    petal.style.width = `${size}px`;
    petal.style.height = `${size}px`;
    petal.style.left = `${startX}px`;
    petal.style.top = `-15px`;
    petal.style.animationDuration = `${duration}s`;
    petal.style.animationDelay = `${delay}s`;

    // Vary opacity and rotation start
    petal.style.opacity = Math.random() * 0.5 + 0.4;
    petal.style.transform = `rotate(${Math.random() * 360}deg)`;

    petalContainer.appendChild(petal);

    // Remove petal after animation finishes
    setTimeout(() => {
      petal.remove();
    }, (duration + delay) * 1000);
  }

  // Initial batch
  for (let i = 0; i < 10; i++) {
    createPetal();
  }

  // Interval for spawning new petals
  setInterval(createPetal, 400);

  // 3. INTERACTIVE MOCK WPF APPLICATION SIMULATOR
  // Element selections
  const btnStart = document.getElementById('app-btn-start');
  const btnPause = document.getElementById('app-btn-pause');
  const btnStop = document.getElementById('app-btn-stop');
  const statusTitle = document.getElementById('app-status-title');
  const statusDesc = document.getElementById('app-status-desc');

  const overlayCountdown = document.getElementById('app-countdown-overlay');
  const overlayCountdownNum = document.getElementById('overlay-countdown-num');
  const btnCancelCountdown = document.getElementById('app-btn-cancel-countdown');

  const overlayTyping = document.getElementById('app-typing-overlay');
  const typingTitle = document.getElementById('typing-overlay-title');
  const progressIndicator = document.getElementById('typing-progress-indicator');
  const percentSpan = document.getElementById('typing-percent');
  const btnPauseOverlay = document.getElementById('overlay-btn-pause');
  const btnStopOverlay = document.getElementById('overlay-btn-stop');

  const statChars = document.getElementById('stat-chars');
  const statWords = document.getElementById('stat-words');
  const statLines = document.getElementById('stat-lines');

  // Simulation State Variables
  let appState = 'ready'; // 'ready', 'countdown', 'typing', 'paused', 'completed'
  let countdownVal = 3;
  let countdownTimer = null;
  let typingProgress = 0;
  let typingTimer = null;

  const originalStats = {
    chars: '1,248',
    words: '208',
    lines: '36'
  };

  // Helper: Reset simulator to Ready state
  function resetToReady() {
    clearInterval(countdownTimer);
    clearInterval(typingTimer);
    
    appState = 'ready';
    statusTitle.innerHTML = 'Ready to Flow 🌸';
    statusDesc.innerHTML = 'Paste your text, focus your target window, and hit Start.';
    
    statChars.innerText = originalStats.chars;
    statWords.innerText = originalStats.words;
    statLines.innerText = originalStats.lines;

    overlayCountdown.classList.add('hidden');
    overlayTyping.classList.add('hidden');

    btnStart.disabled = false;
    btnPause.disabled = true;
    btnPause.innerHTML = `
      <svg viewBox="0 0 24 24" width="16" height="16">
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="currentColor"/>
      </svg>
      Pause (F9)
    `;
    btnStop.disabled = true;
  }

  // Trigger Countdown Overlay
  function startSimulation() {
    appState = 'countdown';
    btnStart.disabled = true;
    btnPause.disabled = true;
    btnStop.disabled = false;

    statusTitle.innerHTML = 'Starting... ⏳';
    statusDesc.innerHTML = 'Switching to the target text field...';

    overlayCountdown.classList.remove('hidden');
    countdownVal = 3;
    overlayCountdownNum.innerText = countdownVal;

    countdownTimer = setInterval(() => {
      countdownVal--;
      if (countdownVal > 0) {
        overlayCountdownNum.innerText = countdownVal;
      } else {
        clearInterval(countdownTimer);
        overlayCountdown.classList.add('hidden');
        startTypingSimulation();
      }
    }, 1000);
  }

  // Start Typing Simulation
  function startTypingSimulation() {
    appState = 'typing';
    overlayTyping.classList.remove('hidden');
    btnPause.disabled = false;
    typingTitle.innerText = 'Typing... 🌸';
    btnPauseOverlay.innerText = 'Pause';

    typingTimer = setInterval(() => {
      if (appState === 'typing') {
        typingProgress += 2.5; // Advance progress
        if (typingProgress > 100) typingProgress = 100;

        progressIndicator.style.width = `${typingProgress}%`;
        percentSpan.innerText = Math.round(typingProgress);

        // Dynamically count down the characters/words left in mock cards
        const factor = (100 - typingProgress) / 100;
        const currentChars = Math.round(1248 * factor);
        const currentWords = Math.round(208 * factor);
        const currentLines = Math.round(36 * factor);

        statChars.innerText = currentChars.toLocaleString();
        statWords.innerText = currentWords.toLocaleString();
        statLines.innerText = currentLines.toLocaleString();

        if (typingProgress >= 100) {
          clearInterval(typingTimer);
          completeSimulation();
        }
      }
    }, 100);
  }

  // Pause typing
  function togglePause() {
    if (appState === 'typing') {
      appState = 'paused';
      statusTitle.innerHTML = 'Flow Paused ⏸';
      statusDesc.innerHTML = 'Typing suspended. Hit Resume to continue.';
      typingTitle.innerText = 'Typing Paused ⏸';
      btnPauseOverlay.innerText = 'Resume';
      btnPause.innerHTML = `
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path d="M8 5v14l11-7z" fill="currentColor"/>
        </svg>
        Resume (F9)
      `;
    } else if (appState === 'paused') {
      appState = 'typing';
      statusTitle.innerHTML = 'Typing... 🌸';
      statusDesc.innerHTML = 'Injecting characters into target window.';
      typingTitle.innerText = 'Typing... 🌸';
      btnPauseOverlay.innerText = 'Pause';
      btnPause.innerHTML = `
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="currentColor"/>
        </svg>
        Pause (F9)
      `;
    }
  }

  // Complete Simulation
  function completeSimulation() {
    appState = 'completed';
    overlayTyping.classList.add('hidden');
    statusTitle.innerHTML = 'Flow Completed! 🎉';
    statusDesc.innerHTML = 'All 1,248 characters typed successfully.';
    
    statChars.innerText = '0';
    statWords.innerText = '0';
    statLines.innerText = '0';

    btnStart.disabled = false;
    btnPause.disabled = true;
    btnStop.disabled = true;

    // Reset progress back to 0 for next click
    typingProgress = 0;
  }

  // Event Listeners for Mock buttons
  btnStart.addEventListener('click', startSimulation);
  btnCancelCountdown.addEventListener('click', resetToReady);
  btnStop.addEventListener('click', resetToReady);

  btnPause.addEventListener('click', togglePause);
  btnPauseOverlay.addEventListener('click', togglePause);

  btnStopOverlay.addEventListener('click', resetToReady);

  // 3.5 MOCK APP TAB SWITCHER
  const sidebarItems = document.querySelectorAll('.sidebar-item');
  const tabPanels = document.querySelectorAll('.app-tab-panel');
  const otherTabTitle = document.getElementById('other-tab-title');

  sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
      // Set active button state
      sidebarItems.forEach(sib => sib.classList.remove('active'));
      item.classList.add('active');

      // Hide all panels
      tabPanels.forEach(panel => panel.classList.add('hidden'));

      // Show targeted panel
      const targetTab = item.dataset.tab;
      if (targetTab === 'dashboard') {
        document.getElementById('tab-dashboard').classList.remove('hidden');
      } else if (targetTab === 'settings') {
        document.getElementById('tab-settings').classList.remove('hidden');
      } else if (targetTab === 'about') {
        document.getElementById('tab-about').classList.remove('hidden');
      } else {
        // Hotkeys, History, etc.
        const otherPanel = document.getElementById('tab-other');
        otherPanel.classList.remove('hidden');
        otherTabTitle.innerText = item.textContent.trim();
      }
    });
  });

  // 4. ACTIVE NAVIGATION LINK HIGH-LIGHT ON SCROLL
  const sections = document.querySelectorAll('section, footer');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 100; // Offset for header height

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && href.substring(1) === current) {
        link.classList.add('active');
      }
    });
  });
});
