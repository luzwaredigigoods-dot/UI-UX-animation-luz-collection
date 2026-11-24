# Demo contract (for anyone adding animations)

Each video gets one file: `gallery/demos/<slug>.js` (for example `swipe-actions-4.js`). Each animation calls:

```js
LUZ.add({
  id: 'swipe-card-swipe',        // kebab-case, unique, format <set>-<name>
  cat: 'List & Gesture',          // ONE of the categories below
  name: 'Card Swipe',             // label as shown in the video
  source: 'Swipe Actions · Part 4',
  trigger: 'tap',                 // tap | hover | fokus | ketik | load/loop | scroll | drag
  motion: 'Indonesian, 1-3 sentences: what moves, in what order, and the transform.',
  timing: '≈300ms · spring overshoot kecil · stagger 50ms',
  use: 'Indonesian, short: when to use it in a web/app (for example "hapus item di daftar pasien").',
  tags: 'english keywords for search',
  html: `<div class="...">...</div>`,
  css: `& .x { ... }`,            // '&' is replaced by the demo's container selector. Do not use a bare '&' for anything else.
  js: function (root, api) {      // optional. root = container element. api.reduce = prefers-reduced-motion
    // add interaction here; return a cleanup function if you use setInterval/setTimeout/listeners on window
  }
});
```

Allowed categories (use exactly these):
`Menu & Navigasi`, `Tombol & Toggle`, `Input & Form`, `List & Gesture`, `Kartu & Konten`, `Modal, Sheet & Tooltip`, `Loading & Skeleton`, `Feedback & Notifikasi`, `Teks & Angka`, `Transisi Halaman`, `Prinsip Gerak`, `Latar & Efek`

Rules:
- The demo stage is about 268×230 px. Render a mini UI that fits inside it, centred, with no overflow.
- Colours come ONLY from tokens: `var(--d-fg)` text/ink, `var(--d-bg)` card surface, `var(--d-soft)` faint lines/fills, `var(--d-mid)` grey, `var(--d-accent)` accent. Use no literal colours, except a gradient or brand colour that is the point of the animation; keep it readable in light and dark. If you deliberately use a literal colour, add `allowColor: true` to the entry.
- The demo must be **interactive**: tapping or clicking the real element triggers the animation (and taps again reverse it where that makes sense). If the video shows an automatic loop (a loader, a demo of the principle), let it loop by itself. Interactive demos should also autoplay once about 600ms after mounting, then wait for interaction, so the gallery thumbnail shows motion.
- Animate transform, opacity, filter, clip-path. Use the Web Animations API (`el.animate`) or CSS transitions/keyframes. No external libraries.
- Make it interruptible: a click in the middle of an animation must not break the state.
- Respect `api.reduce`: if true, use a short fade or an instant change.
- Clean up every `setInterval`/`setTimeout` in the returned cleanup function (the gallery unmounts demos when they leave the screen).
- Code must be self-contained and readable, because the code is copied into prompts as a reference. Keep the `js` function short.
- CSS selectors must always start with `&` so they do not leak.
- Use `class` names inside the demo; never use global `id`s (a demo can be mounted twice).
- Write the `motion`/`use` text in Indonesian, with specific numbers from the video.

Check: `node gallery/check.js` (validates the format of all demos).

Visual check (recommended before you finish): open the gallery with Playwright (Chromium is pre-installed; `require('playwright')`), load `file://.../gallery/index.html`, wait 1.5 s, take a screenshot at deviceScaleFactor 1 of your demo cards (`#c-<id>`), and look at it. Then click each stage and take another screenshot. Fix anything that overflows, is invisible, or throws a console error.
