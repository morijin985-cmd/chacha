// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
  PASSWORD: 'elaybaho',
  SONG_URL: 'https://raw.githubusercontent.com/reredz/Chacha/main/Niall%20Horan%20-%20This%20Town%20(Official%20Lyric%20Video).mp3',
  EMOJI_CONFETTI: ['❤️', '😘', '😍', '💕', '💖', '🧡', '💛', '💚', '🥰', '🙈', '🤎', '🤍', '💗', '💞', '💓', '❤️‍🔥', '❤️‍🩹', '🖤', '💜', '😚', '💙', '💘', '✨', '🌹'],
  PLAYFUL_MESSAGES: [
    "Mali mali baby  ",
    "Nice try ",
    "Malapit na baby, kaya mo yan ",
    "Ang layo naman niyan baby ",
    "Ano na boss HAHAHAHA ",
    "Kaya mo pa ba? HAHHAHA",
  ],
  HINTS: [
    "Clue 1: Starts with 'e'",
    "Clue 2: Has something to do with 'baho' ",
    "Clue 3: Try mo 'elay' + 'baho' haha"
  ],
  PHOTOS: [
    {
      src: '911cae49-f4bd-45d6-b949-7e5eff86f733.jfif',
      caption: 'SOBRANG GANDA NAMAN NG BABY KO NA YAN'
    },
    {
      src: '381350d7-f209-41cb-b5e9-99f39ea1ac3b.jfif',
      caption: 'Sarap mo naman dito boss haha😩'
    },
    {
      src: '13e9ea99-77f1-490c-8158-4713749616a6.jfif',
      caption: 'Payag ako magka rabies kung ikaw naman kakagat sakin'
    },
    {
      src: '05358380-3f13-4533-974d-0529d62fc69e.jfif',
      caption: 'Tuluyan na nga nahulog sa mga mata mo boss'
    },
    {
      src: '1000056467.jpg',
      caption: 'Kahit bigyan ako isang milyon, hindi kita lalayuan e'
    },
    {
      src: '1000056468.jpg',
      caption: 'Ang ganda ganda ampucha g ako maging shokoy mo'
    },
    {
      src: 'e008bb90-c236-434c-8983-114d775318f6.jfif',
      caption: 'Cute naman ng baby ko parang inosente ah haha'
    },
    {
      src: 'eb50409b-6048-4aeb-8265-398eea7483c1.jfif',
      caption: 'Simula bata mahilig na talaga sa bali leeg'
    }
  ]
};

// ============================================
// STATE MANAGEMENT
// ============================================
let state = {
  heartClickCount: 0,
  isAudioPlaying: false,
  currentHintLevel: 0,
  audioPlayer: null,
  musicPlayer: null,
  scrollThrottleTimeout: null
};

// ============================================
// INITIALIZATION
// ============================================
window.addEventListener('DOMContentLoaded', () => {
  state.audioPlayer = document.getElementById('audioPlayer');
  state.musicPlayer = document.getElementById('musicPlayer');
  
  // Preload audio
  preloadAudio();
  
  // Initialize event listeners
  initializeNavigationButtons();
  initPhotoGallery();
  loadLastSection();
  setupScrollListener();
  setupKeyboardShortcuts();
});

// ============================================
// AUDIO MANAGEMENT
// ============================================
function preloadAudio() {
  // Attempt to preload the audio file
  state.audioPlayer.src = CONFIG.SONG_URL;
  state.audioPlayer.preload = 'auto';
  
  // Handle audio errors gracefully
  state.audioPlayer.addEventListener('error', () => {
    console.warn('Audio file could not be loaded from URL');
  });
}

function toggleMusic() {
  if (!state.isAudioPlaying) {
    playMusic();
  } else {
    pauseMusic();
  }
}

function playMusic() {
  state.audioPlayer.play().catch(err => {
    console.error('Could not play audio:', err);
    showNotification('Could not play "This Town" by Niall Horan. Please check that the MP3 file exists in the repository.');
  });
  state.musicPlayer.classList.add('playing');
  state.isAudioPlaying = true;
  state.musicPlayer.setAttribute('aria-pressed', 'true');
}

function pauseMusic() {
  state.audioPlayer.pause();
  state.audioPlayer.currentTime = 0;
  state.musicPlayer.classList.remove('playing');
  state.isAudioPlaying = false;
  state.musicPlayer.setAttribute('aria-pressed', 'false');
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================
function showNotification(message) {
  alert(message);
}

// ============================================
// PASSWORD MANAGEMENT
// ============================================
function handlePasswordKeypress(event) {
  if (event.key === 'Enter') {
    checkPassword();
  }
}

function checkPassword() {
  const input = document.getElementById('passwordInput');
  const message = document.getElementById('wrongPasswordMessage');
  
  if (input.value === CONFIG.PASSWORD) {
    unlockContent(input);
  } else {
    showWrongPasswordFeedback(input, message);
  }
}

function unlockContent(input) {
  const passwordScreen = document.getElementById('passwordScreen');
  passwordScreen.style.animation = 'slideIn 0.6s ease-out reverse';
  setTimeout(() => {
    passwordScreen.classList.add('hidden');
  }, 300);
  input.value = '';
}

function showWrongPasswordFeedback(input, message) {
  const emoji = ['😢', '🙈', '😕', '😤', '🤔', '😭', '🥺', '😖'];
  const randomEmoji = emoji[Math.floor(Math.random() * emoji.length)];
  const randomMessage = CONFIG.PLAYFUL_MESSAGES[Math.floor(Math.random() * CONFIG.PLAYFUL_MESSAGES.length)];
  
  message.innerHTML = `
    <div class="wrong-password-emoji">${randomEmoji}</div>
    <div class="wrong-password-message">${randomMessage}</div>
  `;
  
  // Add shake animation to input
  input.style.animation = 'none';
  setTimeout(() => {
    input.style.animation = 'shake 0.5s ease-in-out';
  }, 10);
  
  input.value = '';
  input.focus();
}

function showPasswordHint() {
  const hintDisplay = document.getElementById('hintDisplay');
  const hintButton = document.getElementById('hintButton');
  
  if (state.currentHintLevel < CONFIG.HINTS.length) {
    const hint = CONFIG.HINTS[state.currentHintLevel];
    hintDisplay.innerHTML = `
      <div class="hint-text">
        ${hint}
        <button class="hint-copy-btn" onclick="copyHintToClipboard('${hint}')" aria-label="Copy hint to clipboard">Copy</button>
      </div>
    `;
    state.currentHintLevel++;
  }
  
  if (state.currentHintLevel >= CONFIG.HINTS.length) {
    hintButton.disabled = true;
    hintButton.textContent = 'No more hints';
  }
}

function copyHintToClipboard(hint) {
  navigator.clipboard.writeText(hint).then(() => {
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = '✓ Copied!';
    
    setTimeout(() => {
      btn.textContent = originalText;
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy:', err);
  });
}

// ============================================
// NAVIGATION
// ============================================
function initializeNavigationButtons() {
  const navButtons = document.querySelectorAll('.nav-button');
  const sections = ['home', 'photos', 'flowers', 'songs'];
  
  navButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => showSection(sections[index]));
  });
}

function showSection(sectionId) {
  // Hide all sections
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => section.classList.remove('active'));
  
  // Remove active class from all buttons
  const buttons = document.querySelectorAll('.nav-button');
  buttons.forEach(btn => btn.classList.remove('active'));
  
  // Show selected section
  document.getElementById(sectionId).classList.add('active');
  
  // Activate corresponding button
  const sections_array = ['home', 'photos', 'flowers', 'songs'];
  const buttonIndex = sections_array.indexOf(sectionId);
  buttons[buttonIndex].classList.add('active');
  
  // Save and scroll
  saveCurrentSection(sectionId);
  window.scrollTo(0, 0);
}

function saveCurrentSection(sectionId) {
  localStorage.setItem('lastSection', sectionId);
}

function loadLastSection() {
  const lastSection = localStorage.getItem('lastSection');
  if (lastSection) {
    showSection(lastSection);
  }
}

// ============================================
// SCROLL FUNCTIONALITY
// ============================================
function setupScrollListener() {
  window.addEventListener('scroll', throttledScrollHandler);
}

function throttledScrollHandler() {
  if (state.scrollThrottleTimeout) return;
  
  state.scrollThrottleTimeout = setTimeout(() => {
    updateScrollToTopButton();
    state.scrollThrottleTimeout = null;
  }, 100);
}

function updateScrollToTopButton() {
  const scrollToTopBtn = document.getElementById('scrollToTop');
  if (window.pageYOffset > 300) {
    scrollToTopBtn.classList.add('show');
  } else {
    scrollToTopBtn.classList.remove('show');
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Alt + M to toggle music
    if (e.altKey && e.key === 'm') {
      toggleMusic();
    }
    // Alt + T to scroll to top
    if (e.altKey && e.key === 't') {
      scrollToTop();
    }
  });
}

// ============================================
// HEART INTERACTION
// ============================================
function handleHeartKeydown(event) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    showMessage(event);
  }
}

function showMessage(event) {
  const messageDiv = document.getElementById('message');
  messageDiv.style.display = 'block';

  const reasons = document.querySelectorAll('.reason');

  if (!messageDiv.dataset.revealed) {
    reasons.forEach(reason => reason.classList.remove('visible'));
    reasons.forEach((reason, index) => {
      setTimeout(() => reason.classList.add('visible'), index * 800);
    });
    messageDiv.dataset.revealed = 'true';
  }

  state.heartClickCount++;

  if (state.heartClickCount > 1) {
    document.getElementById('clickCounter').innerHTML =
      `<div class="click-counter">❤️ You've clicked ${state.heartClickCount} times!</div>`;
  }

  createConfetti(event);
  playHeartSound();

  if (state.heartClickCount === 20) {
    showSecretMessage();
  }
}

function showSecretMessage() {
  const secret = document.getElementById('secretMessage');
  secret.style.display = 'block';
  secret.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // Confetti celebration
  for (let i = 0; i < 60; i++) {
    setTimeout(() => createConfetti({ target: { getBoundingClientRect: () => ({
      left: window.innerWidth / 2,
      top: window.innerHeight / 2,
      width: 0,
      height: 0
    })} }), i * 50);
  }
}

// ============================================
// CONFETTI ANIMATION
// ============================================
function createConfetti(event) {
  const rect = event.target.getBoundingClientRect();
  
  for (let i = 0; i < 15; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.textContent = CONFIG.EMOJI_CONFETTI[Math.floor(Math.random() * CONFIG.EMOJI_CONFETTI.length)];
    
    const xPos = rect.left + rect.width / 2;
    const yPos = rect.top + rect.height / 2;
    
    confetti.style.left = xPos + 'px';
    confetti.style.top = yPos + 'px';
    
    document.body.appendChild(confetti);
    
    const angle = (Math.PI * 2 * i) / 15;
    const velocity = 5 + Math.random() * 5;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity - 5;
    
    animateConfetti(confetti, xPos, yPos, vx, vy);
  }
}

function animateConfetti(confetti, xPos, yPos, vx, vy) {
  let x = xPos;
  let y = yPos;
  let vxCurrent = vx;
  let vyCurrent = vy;
  
  const animate = () => {
    x += vxCurrent;
    y += vyCurrent;
    vyCurrent += 0.1; // gravity
    
    confetti.style.left = x + 'px';
    confetti.style.top = y + 'px';
    confetti.style.opacity = 1 - (y - yPos) / 300;
    
    if (y - yPos < 300) {
      requestAnimationFrame(animate);
    } else {
      confetti.remove();
    }
  };
  
  animate();
}

// ============================================
// SOUND EFFECTS
// ============================================
function playHeartSound() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.1);
  } catch (e) {
    // Audio context not available, continue without sound
    console.log('Audio context not available');
  }
}

// ============================================
// PHOTO GALLERY
// ============================================
function initPhotoGallery() {
  if (CONFIG.PHOTOS.length === 0) return;
  
  const photoGrid = document.getElementById('photoGrid');
  photoGrid.innerHTML = '';
  CONFIG.PHOTOS.forEach((photo, index) => {
    const photoCard = document.createElement('div');
    photoCard.className = 'photo-card';
    photoCard.setAttribute('role', 'button');
    photoCard.setAttribute('tabindex', '0');
    photoCard.setAttribute('aria-label', `Photo ${index + 1}: ${photo.caption}`);
    
    photoCard.innerHTML = `
      <img 
        src="${photo.src}" 
        alt="Photo ${index + 1}" 
        onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22150%22 height=%22150%22%3E%3Crect fill=%22%23ddd%22 width=%22150%22 height=%22150%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22%3EImage not found%3C/text%3E%3C/svg%3E'"
      >
      <div class="photo-overlay">👁️</div>
    `;
    
    photoCard.addEventListener('click', () => openPhotoModal(index));
    photoCard.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openPhotoModal(index);
      }
    });
    
    photoGrid.appendChild(photoCard);
  });
}

function openPhotoModal(index) {
  const modal = document.getElementById('photoModal');
  document.getElementById('modalImage').src = CONFIG.PHOTOS[index].src;
  document.getElementById('modalCaption').textContent = CONFIG.PHOTOS[index].caption;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closePhotoModal(event) {
  // Prevent closing when clicking modal content
  if (event && event.target.id !== 'photoModal') return;
  
  const modal = document.getElementById('photoModal');
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closePhotoModal({ target: { id: 'photoModal' } });
  }
});

// ============================================
// CLEANUP ON PAGE UNLOAD
// ============================================
window.addEventListener('beforeunload', () => {
  pauseMusic();
});
