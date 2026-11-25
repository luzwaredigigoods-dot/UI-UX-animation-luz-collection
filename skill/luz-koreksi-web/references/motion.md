# Motion feature (Luz Motion inside the notes panel)

Turned on by default when installing the module. When the tester captures an object, the panel immediately shows **animations that suit that object** from the Luz Motion collection (198 unique animations). The tester can:
1. **▶ Coba**: play an approximate preview of the motion **on the real object** on the page under test.
2. **Pilih**: write the line `@N animasi: \`id\` (Name · duration)` into the note text.
3. **Cari animasi lain**: search the whole collection (name, ID, category, use).
4. **Galeri ↗**: open the Luz Motion gallery for the exact version of the motion.

When the notes are copied as Markdown, the animation line is carried in the note text. Claude then implements it with the `luz-motion` skill.

Working example (can be opened without a server): `assets/luz-motion/demo.html`.

## Files

| File | Purpose |
|---|---|
| `assets/luz-motion/luz-motion-data.js` | Compact catalog: `id, n (name), c (category), t (trigger), d (duration), u (use), g (preview family)` + `LUZ_MOTION_ALIAS` (merged old IDs). Generated, never edited by hand. |
| `assets/luz-motion/luz-motion-koreksi.js` | Logic without UI: `jenisObjek(el)`, `rekomendasi(el, n)`, `cari(q, n)`, `pratinjau(el, id)`, `hentikan(el)`, `baris(id, nomor)`, `tautanGaleri(id)`. Vanilla, no dependencies. |
| `assets/luz-motion/panel-motion.js` | Reference panel UI (shadow DOM) for the demo: object chips, recommendation cards, search, preview, pick, Markdown. |
| `assets/luz-motion/build.js` | Regenerates `luz-motion-data.js` from the Luz Motion repo (`gallery/demos`). Run it from the root of the `UI-UX-animation-luz-collection` repo when the collection changes. |

## How recommendations are chosen

`jenisObjek(el)` checks the element and its ancestors in this order. The first match wins:
toggle (checkbox/radio/switch) → isian (input/textarea/select/label) → tab (`role=tab`, `aria-current=page`) → icon button (button with no text) → badge → button → notification/toast (`role=status|alert`) → dialog/sheet → menu/nav → progress → list/row (`li`, `tr`, `role=row|option`) → number (short text made of digits) → heading/text → card/image → page section.

For each type there is a **calm-first** list (`PILIHAN` in `luz-motion-koreksi.js`), suitable for clinical/work apps; the expressive options come after. The rest of the slots are filled from the matching category. Adjust `PILIHAN` and the `JENIS` order when the target site's markup is unusual: for example, a site that uses `div.btn` without `role=button` needs to be added to the button test.

## How the preview works on the real object

The real object is not the gallery mini-UI, so the preview plays a **family** of motion approximations with the Web Animations API (`el.animate`). The page's styles and DOM are not changed. The families are: press & bounce, grow-in, drop & land, focus from blur, slide in, 3D hinge, 3D flip, wobble, shake, jelly, circle opening, sweep, line then opening, scrolling number/text, pulsing ring, and staggered per child.
- An element with `display:inline` is temporarily made `inline-block` during the preview, then restored.
- A new preview on the same object cancels the previous one (`hentikan`).
- Tell the tester: the preview is an approximation; the exact version is in the gallery (the panel has a link).

## Status in Luz Care (2026-11-25)

Already installed in Luz Care (PR `luzwaredigigoods-dot/luz-care#7`, branch `claude/catatan-uji-motion`). The reference code in `assets/referensi-luz-care/` has been updated to that version: `web/src/catatanUji/motion.ts` (TS wrapper), `index.ts` (Animasi section, `motion-*` events), `gaya.ts` (`.mo-*`), `public/catatan-uji/pemuat.js` (loads the catalog), `api/migrations/032_catatan_uji_animasi.sql` + `api/src/rute/catatanUji.ts` (Animasi category), and `api/test/catatanUjiMotion.test.ts`. For a new web, copy from there; the steps below explain what each part does.

Note on the Vite dev server: it refuses `import()` of files in `public/`. Test the module on a build (`vite build` + `vite preview`).

## Integration into the reference code (`assets/referensi-luz-care/web/src/catatanUji/`)

There are no backend changes: the animation line is stored in the note text (`isi`), so the database, API, and tests stay as they are.

1. **Load the data and logic together with the module**, only in test mode (the same production guard). The easiest way: copy `luz-motion-data.js` and `luz-motion-koreksi.js` into `public/catatan-uji/`, then in `pemuat.js` load them with `<script>` (or `import()` if made into ES modules) **before** `catatan-uji.js`. Do not bundle them into the main app.
2. **`Butir`** (index.ts): add `rek: string[]` and `animasi: string | null`.
3. **`tambahObjek(target, …)`**: after the object enters, call `LuzMotionKoreksi.rekomendasi(target, 6)`. Store `rek = daftar.map(d => d.id)`.
   - If `rekomendasi().target` differs from the chosen container, follow the container chosen by the tester (`pilihWadah`): call `rekomendasi()` again whenever the container level changes.
4. **`htmlTulis()`**: below the object list, add a "Animasi cocok untuk @N" section for the active object (one at a time, so the panel stays small on phones):
   - recommendation cards (name, ID, family + duration) with **▶ Coba** and **Pilih** buttons;
   - a search field;
   - a "Galeri ↗" link.
   Copy the markup and CSS from `panel-motion.js` (the `kartuAnimasi` + `htmlTulis` sections), using the colours from `gaya.ts`.
5. **Panel events**:
   - `data-pratinjau` → `LuzMotionKoreksi.pratinjau(butir.el, id)`. The `el` must still be attached (`isConnected`); if it is not, show "the object is no longer on the page".
   - `data-pilih` → put/replace the line `@N animasi: …` in the textarea (see `sisipBaris` in `panel-motion.js`), and set `butir.animasi = id`.
   - When an object is removed, remove its `@N animasi:` line too, and renumber the remaining lines if the @ numbers shift.
6. **Category**: add `Animasi` to the category options (UI and server validation, `kontrak-api.md`). This is the only small backend change, and it is optional: without it, use the Tampilan category.
7. **Do not** read input values: this feature only uses the element type, its label, and its position. That matches the module's existing rules.
8. **Browser tests** (add to `uji-catatan.js`):
   - right-click a button → the recommendations contain an ID with the `button`/`stepper` prefix;
   - ▶ Coba → `el.getAnimations().length > 0` while it runs and `0` after it finishes;
   - Pilih → the textarea contains `@1 animasi: \``;
   - Salin catatan → the Markdown contains the line;
   - at phone size the panel does not cover the floating button and there is no horizontal scroll.

## Updating the catalog

When the Luz Motion collection gains new animations, from the root of the Luz Motion repo run:
```
node gallery/check.js && node koreksi-motion/build.js
```
Then copy `koreksi-motion/luz-motion-data.js` to the target web project (and to this skill's `assets/luz-motion/`).
