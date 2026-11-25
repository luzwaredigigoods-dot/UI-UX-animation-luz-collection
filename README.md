# Luz Motion

A collection of 214 UI/UX animations, learned from 39 screen recordings of animation references (the Drive folder "ui/ux animation"). Each animation:

- has a fixed ID (e.g. `menu-circle-reveal`, `toast-depth-focus`)
- is rebuilt as an interactive live demo (HTML + CSS + JS vanilla, no libraries)
- has an Indonesian description of its motion, its duration/easing, and when to use it

## Contents

| Path | What it does |
|---|---|
| `gallery/index.html` | Demo gallery. Open it in a browser (no server needed). Filter by category, search, tick **Pilih**, then **Susun prompt**. |
| `gallery/demos/*.js` | One file per video (set). Each file registers 6 animations with `LUZ.add({...})`. |
| `gallery/core.js` | Registry, renderer, and prompt builder. |
| `gallery/check.js` | Validates every demo + rebuilds the script list in `index.html` and the skill's catalog. |
| `skill/luz-motion/` | Claude skill: `SKILL.md` + `references/katalog.md`. |
| `docs/KONTRAK-DEMO.md` | Format rules for adding new animations. |

## How to use it

**1. Pick from the gallery (easiest)**
Open the gallery, try the demos, and tick the ones you want. In the bottom tray:
- **Mode**: add new, or fix an existing animation
- **Target**: which element or page
- **Stack**: vanilla / React+Tailwind / React+Motion / Vue / Apps Script

Then press **Salin prompt** and paste it to Claude in your project. The prompt already includes the motion details, the timings, the reference code, and the required rules (reduced-motion, interruptible, touch target ≥44px).

**2. Name the ID directly**
With the `luz-motion` skill installed, write something like:
> pakai `menu-staggered-dropdown` untuk menu profil, dan `toast-depth-focus` untuk notifikasi simpan

**3. Fix an existing web/app**
Together with the `luz-koreksi-web` skill: mark the element, then write a note such as "ganti jadi `sheet-backdrop-blur`".

## Installing the skill

Upload the `skill/luz-motion` folder (as a zip) in claude.ai → Settings → Capabilities → Skills, or copy it to `~/.claude/skills/luz-motion` for Claude Code.

## Adding animations from a new video

1. Follow `docs/KONTRAK-DEMO.md` and create `gallery/demos/<set>.js`.
2. Run `node gallery/check.js` (validates + updates the gallery and the catalog).

## Categories

Menu & Navigasi · Tombol & Toggle · Input & Form · List & Gesture · Kartu & Konten · Modal, Sheet & Tooltip · Feedback & Notifikasi · Loading & Skeleton · Teks & Angka · Transisi Halaman · Latar & Efek · Prinsip Gerak (comparisons of stagger, spring damping, gooey blur, glass blur)

## Notes

- 2 of the 41 videos in the folder (`05-56-10`, `05-56-44`) are not included yet. They are over the Drive connector's 10 MB limit, and sharing permission for them was not granted.
- Some cells are simplified (for example the gooey effect without an SVG filter, or a genie effect approximated with clip-path). The details are in the comments of each demo file.
