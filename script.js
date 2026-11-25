// Image Gallery — CodeAlpha Task 1
// Features: category filters, photo effects, ChatGPT grey + amber theme,
// lightbox with swipe/drag sliding (no arrow buttons), dot indicators,
// keyboard navigation (arrows + Escape), click backdrop to close.

const gallery = document.getElementById('gallery');
const items = Array.from(gallery.querySelectorAll('.gallery-item'));
const filterButtons = document.querySelectorAll('.cat-card');
const emptyMessage = document.getElementById('emptyMessage');
const showingLine = document.getElementById('showingLine');

const lightbox = document.getElementById('lightbox');
const lightboxContent = document.getElementById('lightboxContent');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxCounter = document.getElementById('lightboxCounter');
const lightboxDots = document.getElementById('lightboxDots');
const lightboxClose = document.getElementById('lightboxClose');

let currentIndex = 0; // index inside the currently visible items

// ---------- Theme: dark ember by default, light mode on toggle ----------
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeIcon.textContent = theme === 'dark' ? '\u2600' : '\u263E';
  themeToggle.setAttribute(
    'aria-label',
    theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
  );
  try {
    localStorage.setItem('gallery-theme', theme);
  } catch (e) {
    // storage unavailable (e.g. private mode) — theme still applies for this visit
  }
}

let savedTheme = 'dark';
try {
  savedTheme = localStorage.getItem('gallery-theme') || 'dark';
} catch (e) {
  savedTheme = 'dark';
}
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(next);
});

// ---------- Helpers ----------
function visibleItems() {
  return items.filter((item) => !item.classList.contains('hidden'));
}

// ---------- Category filters ----------
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');

    const filter = button.dataset.filter;
    let shown = 0;
    items.forEach((item) => {
      const match = filter === 'all' || item.dataset.category === filter;
      item.classList.toggle('hidden', !match);
      if (match) shown += 1;
    });
    emptyMessage.hidden = shown !== 0;
    const label = filter === 'all' ? 'all categories' : filter;
    showingLine.textContent = `Showing ${shown} of ${items.length} photos in ${label}`;
  });
});

// ---------- Photo effects (behind the sliders button in the top bar) ----------
const effectsBtn = document.getElementById('effectsBtn');
const effectsPanel = document.getElementById('effectsPanel');
const effectOptions = document.querySelectorAll('.effect-option');

function closeEffectsPanel() {
  effectsPanel.hidden = true;
  effectsBtn.classList.remove('open');
  effectsBtn.setAttribute('aria-expanded', 'false');
}

effectsBtn.addEventListener('click', (event) => {
  event.stopPropagation();
  const willOpen = effectsPanel.hidden;
  effectsPanel.hidden = !willOpen;
  effectsBtn.classList.toggle('open', willOpen);
  effectsBtn.setAttribute('aria-expanded', String(willOpen));
});

effectOptions.forEach((option) => {
  option.addEventListener('click', () => {
    effectOptions.forEach((opt) => opt.classList.remove('active'));
    option.classList.add('active');
    gallery.classList.remove('effect-grayscale', 'effect-sepia');
    if (option.dataset.effect !== 'none') {
      gallery.classList.add(`effect-${option.dataset.effect}`);
    }
    closeEffectsPanel();
  });
});

// Tap anywhere else closes the panel.
document.addEventListener('click', (event) => {
  if (!effectsPanel.hidden && !effectsPanel.contains(event.target)) {
    closeEffectsPanel();
  }
});

// ---------- Lightbox ----------
function renderDots() {
  const visible = visibleItems();
  lightboxDots.innerHTML = '';
  visible.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === currentIndex ? ' active' : '');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Photo ${i + 1}`);
    dot.addEventListener('click', (event) => {
      event.stopPropagation();
      goToPhoto(i);
    });
    lightboxDots.appendChild(dot);
  });
}

function fillPhoto() {
  const visible = visibleItems();
  const item = visible[currentIndex];
  const img = item.querySelector('img');
  const title = item.querySelector('.caption-title').textContent;

  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightboxCaption.textContent = title;
  lightboxCounter.textContent = `${currentIndex + 1} / ${visible.length}`;
  renderDots();
}

// ---------- Lightbox UI auto-hide ----------
// Only the photo shows, with the X always visible. Tap the photo (or swipe
// to another) and the title, counter and dots appear, then hide after 1 second.
let uiHideTimer = null;

function hideLightboxUI() {
  clearTimeout(uiHideTimer);
  lightbox.classList.add('ui-hidden');
}

function showLightboxUI() {
  lightbox.classList.remove('ui-hidden');
  clearTimeout(uiHideTimer);
  uiHideTimer = setTimeout(() => lightbox.classList.add('ui-hidden'), 1000);
}

function toggleLightboxUI() {
  if (lightbox.classList.contains('ui-hidden')) {
    showLightboxUI();
  } else {
    hideLightboxUI();
  }
}

function openLightbox(item) {
  const visible = visibleItems();
  currentIndex = visible.indexOf(item);
  fillPhoto();
  lightboxContent.style.transition = '';
  lightboxContent.style.transform = '';
  lightboxContent.style.opacity = '';
  lightbox.hidden = false;
  hideLightboxUI();
  document.body.style.overflow = 'hidden';
  lightboxClose.focus();
}

function closeLightbox() {
  clearTimeout(uiHideTimer);
  lightbox.hidden = true;
  document.body.style.overflow = '';
}

// Smooth slide: current photo glides out, next one glides in.
function goToPhoto(index, direction = 1) {
  const visible = visibleItems();
  if (visible.length <= 1) return;
  const target = (index + visible.length) % visible.length;
  if (target === currentIndex) return;

  const content = lightboxContent;
  content.style.transition = 'transform 0.22s ease, opacity 0.22s ease';
  content.style.transform = `translateX(${-direction * 60}px)`;
  content.style.opacity = '0';

  setTimeout(() => {
    currentIndex = target;
    fillPhoto();
    showLightboxUI();
    content.style.transition = 'none';
    content.style.transform = `translateX(${direction * 60}px)`;
    // Force reflow so the next transition animates from the offset position.
    void content.offsetWidth;
    content.style.transition = 'transform 0.28s ease, opacity 0.28s ease';
    content.style.transform = 'translateX(0)';
    content.style.opacity = '1';
  }, 220);
}

function nextPhoto(step) {
  goToPhoto(currentIndex + step, step);
}

items.forEach((item) => {
  item.addEventListener('click', () => openLightbox(item));
  item.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openLightbox(item);
    }
  });
});

lightboxClose.addEventListener('click', closeLightbox);

// Click on the dark backdrop (not the photo) closes the lightbox
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});

// ---------- Swipe / drag: no arrow buttons ----------
// Pointer events cover touch swipes and mouse drags.
let dragStartX = null;
let dragX = 0;

lightboxContent.addEventListener('pointerdown', (event) => {
  dragStartX = event.clientX;
  dragX = 0;
  lightboxContent.classList.add('dragging');
  lightboxContent.style.transition = 'none';
  try {
    lightboxContent.setPointerCapture(event.pointerId);
  } catch (e) {
    // pointer capture not supported — dragging still works via move/up
  }
});

lightboxContent.addEventListener('pointermove', (event) => {
  if (dragStartX === null) return;
  dragX = event.clientX - dragStartX;
  // Follow the finger/mouse with a little resistance.
  lightboxContent.style.transform = `translateX(${dragX * 0.6}px)`;
});

function endDrag() {
  if (dragStartX === null) return;
  lightboxContent.classList.remove('dragging');
  dragStartX = null;
  if (Math.abs(dragX) > 70) {
    nextPhoto(dragX < 0 ? 1 : -1);
  } else {
    // Snap back to place — a tap toggles the controls.
    lightboxContent.style.transition = 'transform 0.25s ease';
    lightboxContent.style.transform = 'translateX(0)';
    if (Math.abs(dragX) < 8) toggleLightboxUI();
  }
  dragX = 0;
}

lightboxContent.addEventListener('pointerup', endDrag);
lightboxContent.addEventListener('pointercancel', endDrag);

// Keyboard: arrows to move, Escape to close
document.addEventListener('keydown', (event) => {
  if (lightbox.hidden) return;
  if (event.key === 'ArrowRight') nextPhoto(1);
  if (event.key === 'ArrowLeft') nextPhoto(-1);
  if (event.key === 'Escape') closeLightbox();
});
