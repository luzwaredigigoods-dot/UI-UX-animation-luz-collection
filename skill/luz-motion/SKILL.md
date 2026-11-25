---
name: luz-motion
description: Koleksi animasi UI/UX siap pakai milik dok Luz (Luz Motion), 214 animasi dari menu, tombol/toggle, input, list & swipe, tooltip, sheet, toast, loading/skeleton, progress, badge, angka, teks, pagination, date picker, latar. Tiap animasi punya ID (mis. menu-circle-reveal, switch-ghost-trail), deskripsi gerak, durasi/easing, dan kode referensi. Pakai skill ini setiap kali dok menyebut ID Luz Motion, menempelkan prompt dari galeri Luz Motion, minta "pakai animasi dari koleksi", "ganti animasi X jadi Y", "animasi menu/dropdown/toast/skeleton/toggle seperti di galeri", atau minta menambah/mengoreksi animasi di web/app. Untuk prinsip dan review UX umum, pasangkan dengan skill ux-animasi.
---

# Luz Motion

Koleksi animasi UI yang dipelajari dari rekaman layar referensi dok Luz (seri "ui_motion_prompts": Menu, Search, Switch, Tooltip, Text Field, Toast, Skeleton, dsb.). Setiap animasi sudah dibuat ulang sebagai demo hidup di galeri dan diberi ID tetap.

- Galeri (pilih, coba, susun prompt): `gallery/index.html` di repo `UI-UX-animation-luz-collection`, juga dipublikasikan sebagai artifact.
- Katalog lengkap per kategori: `references/katalog.md` (ID, gerak, durasi, kegunaan, berkas kode).
- Kode referensi tiap animasi: `gallery/demos/<set>.js` di repo (HTML + CSS + JS vanilla).

## Cara kerja saat dipanggil

1. **Kenali ID.** Kalau prompt menyebut ID (bentuk `set-nama`, mis. `toast-depth-focus`), cari di `references/katalog.md`. Kalau dok hanya menyebut nama atau efeknya ("yang dropdown-nya muncul satu-satu"), cari padanan terdekat di katalog, sebutkan ID yang dipilih, lalu lanjut.
2. **Ambil kode referensi.** Buka berkas demo yang tercantum. Bila repo tidak ada di sesi ini, pakai deskripsi gerak + durasi di katalog; itu cukup untuk membangun ulang.
3. **Sesuaikan ke proyek, jangan tempel mentah.**
   - Pakai token warna, font, radius, dan komponen yang sudah ada di proyek. Demo memakai `--d-fg/--d-bg/--d-soft/--d-mid/--d-accent`; petakan ke token proyek.
   - Ganti selector `&` di CSS demo dengan kelas komponen sebenarnya.
   - Terjemahkan ke stack proyek:
     - **Vanilla / Apps Script HtmlService**: CSS transition/keyframes + `element.animate()`.
     - **React + Tailwind**: kelas `transition-*`, keyframes di `tailwind.config`, state untuk buka/tutup; unmount sesudah animasi keluar selesai.
     - **React + Motion (framer-motion)**: `motion.*`, `AnimatePresence` untuk masuk/keluar, `layout`/`layoutId` untuk highlight yang berpindah (pagination, tab, date picker), `transition={{type:'spring', ...}}` dengan angka dari katalog.
     - **Vue**: `<Transition>`/`<TransitionGroup>`.
4. **Mode koreksi** (prompt berisi "Perbaiki animasi yang SUDAH ADA"): cari komponen yang dimaksud lebih dulu, ukur apa yang salah (durasi, easing, properti yang dianimasikan, tidak bisa diinterupsi, tidak ada exit), ubah seminimal mungkin agar sesuai ID yang dipilih, lalu laporkan sebelum/sesudah.
5. **Verifikasi.** Jalankan app bila bisa. Pastikan buka→tutup→buka cepat tidak merusak state, dan `prefers-reduced-motion` dihormati. Laporkan berkas yang diubah.

## Aturan tetap (berlaku untuk semua animasi koleksi)

- Animasikan `transform`, `opacity`, `filter`, `clip-path`. Hindari animasi `width/height/top/left`, kecuali lewat layout animation (FLIP / Motion `layout`).
- Durasi: mikro-interaksi 120–300 ms; panel/sheet/halaman 300–500 ms. Masuk pakai ease-out atau spring; keluar lebih cepat (≈70% durasi masuk) dengan ease-in.
- Spring default (dari video "Change one number"): ω₀ 13–16, ζ ≈ 0.6 (overshoot ±9%). ζ 0.3 terlalu goyang untuk UI kerja, ζ 1.0 terasa kaku. Di Motion: `{type:'spring', stiffness: 260, damping: 20}` ≈ ζ0.6.
- Stagger daftar: ≈65 ms per baris dengan 260 ms ease-out per baris. 0 ms terasa serentak, 200 ms terasa lamban.
- Efek gooey: blur ≈9px + alpha matrix `×24 −10.5`. Kaca buram: `backdrop-filter: blur(20px) saturate(160%)` + tint + garis tepi 1px.
- Bisa diinterupsi: aksi berlawanan di tengah animasi membalik arah dari posisi saat ini.
- `prefers-reduced-motion: reduce`: ganti gerak dengan fade ≤150 ms atau perubahan instan; efek partikel, confetti, shake, dan loop latar dimatikan.
- Aksesibilitas: `aria-expanded`, `aria-hidden`, fokus berpindah ke panel yang dibuka dan kembali ke pemicu saat ditutup; target sentuh ≥44 px.
- Frekuensi: aksi yang diulang puluhan kali per hari (mis. input data pasien, navigasi tab utama) memakai varian paling tenang atau tanpa animasi. Efek meriah (confetti, burst, glitch, pixel) hanya untuk momen jarang: sukses pertama, onboarding, pencapaian.

## Panduan memilih cepat

| Kebutuhan | Pilihan tenang (default app kerja/klinis) | Pilihan ekspresif |
|---|---|---|
| Menu dropdown | `menu-staggered-dropdown`, `menu5-zipper-rows` | `menu-circle-reveal`, `menu5-swing-hinge` |
| Drawer / sheet | `menu-side-drawer`, `menu-bottom-sheet` | `menu-fab-fan` |
| Toggle | `switch-ghost-trail` | `switch-tilt-roll`, `switch-confetti-pop` |
| Toast/notifikasi | `toast-depth-focus` | `toast-button-morph`, `toast-blinds` |
| Loading konten | `skeleton-blur-focus` | `skeleton-flip-tiles`, `skeleton-comet-outline` |
| Error input | `inerr-message-drop`, `inerr-red-echo` | `inerr-tilt-wobble` |
| Angka berubah | `counter-smooth-count`, `counter-odometer-roll` | `counter-decode-lock` |
| Hapus item daftar | `swipe-inline-undo` | `swipedel-genie-bin`, `swipe-liquid-delete` |

ID di tabel ini adalah contoh dari katalog. Selalu cek `references/katalog.md` untuk daftar terbaru.

## Hubungan dengan skill lain

- `ux-animasi`: prinsip (20 prinsip, hukum UX) dan review. Luz Motion adalah katalog konkretnya.
- `luz-koreksi-web`: dok bisa menandai elemen di web lalu menulis "pakai `toast-depth-focus`". Catatan itu langsung dikerjakan dengan skill ini.
- `poles-tampilan`: animasi ekspresif tidak boleh menutupi desain yang belum rapi. Poles dulu, baru beri gerak.
