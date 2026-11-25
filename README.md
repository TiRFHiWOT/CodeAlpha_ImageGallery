# Image Gallery — CodeAlpha Frontend Task 1

A responsive image gallery built with HTML, CSS, and JavaScript.

## Features

- Responsive grid layout (1 column on phones, 2 on tablets, up to 4 on desktop)
- Category filters: a horizontal strip of photo cards — each category is a
  small photo with its name and photo count on it (All is a 2×2 collage);
  the active card gets an amber outline. The strip scrolls with the page.
  Plus a "Showing X of 12 photos" line
- Lightbox view: click any photo to open it large — only the photo shows,
  with the X always visible. Tap the photo (or swipe to the next one) to
  reveal the title, counter and dots, and they hide again after 1 second;
  the caption is the photo title only, with no category tag. Swipe left/right
  (touch or mouse drag) to slide smoothly to the next/previous photo, with
  dot indicators; keyboard arrows also work, Esc or backdrop click closes
- Theme: ChatGPT grey with an amber accent, flat, no gradients and no
  shadows — dark grey (#212121) in dark mode, white in light mode. The
  wordmark follows the mode (light grey in dark mode, near-black in light
  mode) so it always reads clearly. Theme toggle in the top bar, choice is
  saved. (The one exception is the dark fade behind photo captions, kept so
  white caption text stays readable.)
- App-style top bar with a photo logo mark (frame with sun and mountains,
  white on solid amber) and "Gallery" in Poppins, instead of a
  big page title — no photo-count badge next to it
- Hover effects: photo zooms, caption slides up with title and category tag
- Smooth transitions throughout
- Bonus: photo effects — Black & white and Sepia filters for the whole gallery, behind a sliders button in the top bar

## Files

- `index.html` — page structure and the 12 photos (3 per category)
- `styles.css` — layout, hover effects, lightbox, responsive breakpoints
- `script.js` — filters, photo effects, lightbox logic, keyboard support
- `images/` — 12 photos (800×600), local files so the gallery works offline

## Run it

Open `index.html` in any browser, or serve the folder:

```bash
python3 -m http.server
```

then visit http://localhost:8000

## Internship

CodeAlpha — Frontend Development Internship. Complete any 2 or 3 of the 4 tasks
for the completion certificate. This is Task 1 of 4.
