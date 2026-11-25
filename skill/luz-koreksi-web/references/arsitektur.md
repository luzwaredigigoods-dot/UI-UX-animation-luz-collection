# Arsitektur dan keputusan rancangan

Isi: 1. Alur pengguna · 2. Bagian modul · 3. Penjaga produksi · 4. Apa yang ditangkap · 5. Gambar layar · 6. Jebakan yang sudah
ditemukan · 7. Varian tanpa server · 8. Batas dan angka

## 1. Alur pengguna

1. Tombol apung **Catatan uji** (pojok kanan bawah, di atas bilah menu bawah bila ada). Pintasan Alt+Shift+C.
2. **Mode catatan** menyala: pita di atas layar "Mode catatan · klik kanan objek". Objek yang ditunjuk kursor disorot.
3. Klik kanan (PC) atau tekan lama 500 ms (HP/iPad) pada objek → objek masuk panel sebagai @1 … @5, panel terbuka kecil.
   Penguji bisa memilih "wadah" yang lebih besar (tombol, kartu, bagian) lewat chip tingkat.
4. Penguji menulis koreksi, memilih kategori (Tampilan, Alur, Teks, Error) dan prioritas (Tinggi, Sedang, Rendah), lalu Simpan.
   Gambar layar dengan kotak bernomor ikut tersimpan (bisa dimatikan).
5. Tab **Daftar**: saringan status/kategori/aplikasi/"halaman ini saja", **Salin catatan (N)** = Markdown ke clipboard,
   detail per catatan, sorot objek yang dicatat bila halaman sama, ubah status, hapus (penulis, selama status Baru).
6. Esc mematikan mode. Saat Mode catatan mati, klik kanan dan tekan lama berjalan normal (menu konteks peramban tetap ada).

Status: Baru → Sedang dikerjakan → Selesai, perlu dicek → Diterima / Dibuka lagi. "Belum selesai" = baru, dikerjakan, dibuka-lagi.

## 2. Bagian modul (kode acuan `assets/referensi-luz-care/web/`)

| Berkas | Tugas |
|---|---|
| `public/catatan-uji/pemuat.js` | Pemuat kecil: tanya `/api/catatan-uji/status`; hanya bila `aktif: true` modul diunduh (`import()`), cadangan untuk server vite dev. Bisa ditempel di halaman HTML statis dengan `<script type="module">` |
| `src/catatanUjiPemuat.ts` | Memanggil pemuat dari aplikasi React (`main.tsx`) tanpa ikut dibundel |
| `src/catatanUji/index.ts` | Keadaan, panel (HTML string di shadow DOM), peristiwa, simpan/daftar/status/hapus, ekspor Markdown |
| `src/catatanUji/tangkap.ts` | Dari elemen ke data objek: jenis, label, jejak wadah, pemilih CSS, letak; identitas halaman; perangkat |
| `src/catatanUji/gambar.ts` | Gambar layar (html-to-image) + kotak bernomor, tempel dialog modal |
| `src/catatanUji/gaya.ts` | CSS di dalam shadow DOM + CSS kecil untuk halaman (matikan seleksi teks/callout iOS selama mode) |

Pembangun: modul dibangun sebagai entri terpisah dengan **nama tetap** (`/catatan-uji/catatan-uji.js`, tanpa hash) agar pemuat bisa
memanggilnya; server web memberi `Cache-Control: no-cache` untuk `/catatan-uji/*` supaya perbaikan langsung terpakai.
Ketergantungan luar hanya `html-to-image` (MIT; versi acuan 1.11.13).

## 3. Penjaga produksi

- Server: fungsi `catatanUjiNyala(env)` = saklar khusus **dan** mode uji/pengembangan. Rute hanya didaftarkan bila nyala dan mode
  bukan produksi, jadi di produksi semua rute 404 (bukan 403: tidak membocorkan bahwa fitur ada).
- Peramban: pemuat tidak mengunduh modul bila status bukan 200 `{aktif:true}`.
- Tes wajib: aplikasi dengan mode produksi + saklar nyala tetap 404.
- Sebelum server uji dipakai untuk hal lain: perintah hapus-semua (baris + berkas gambar), lalu kosongkan saklar.

## 4. Apa yang ditangkap dari objek (tangkap.ts)

- `jenis` (Tombol, Tautan, Kotak isian, Judul, Menu, Gambar, …), `label` dari aria-label / label `<label for>` / teks terlihat /
  placeholder / alt / title. **Bukan nilai isian.**
- `jejak`: wadah penanda (section, article, nav, dialog, form, header, main, table, …) dengan judulnya, maks. beberapa tingkat.
- `pemilih`: pemilih CSS pendek (≤ 5 tingkat; id, atribut data penanda seperti `data-menu`, kelas, `:nth-of-type`).
- `kotak`: x, y, w, h relatif ke layar saat itu.
- `rantaiDari`: daftar wadah dari elemen ke atas agar penguji bisa memilih "tombolnya" walau yang diklik ikon SVG di dalamnya.
- Halaman: alamat (pathname + hash, tanpa query), judul h1, **menu aktif** (`[data-menu][aria-current=page]` atau `nav
  [aria-current=page]`), tab aktif (`[role=tab][aria-selected=true]`). Identitas halaman = alamat + menu, karena aplikasi satu
  halaman sering tidak mengubah alamat per menu.
- Perangkat: lebar × tinggi, rasio piksel, sentuh/mouse, peramban, tema.

Semua teks dipotong di server (label ≤ 120, jejak ≤ 8 × 80, pemilih ≤ 400, dsb.) dan bidang yang tidak dikenal dibuang.

## 5. Gambar layar (gambar.ts)

- `html-to-image` menggambar `document.body` seukuran layar; posisi gulir ditiru dengan **margin negatif** (bukan transform) agar
  elemen `position: fixed` (bilah atas/bawah) tetap di tempatnya.
- Host modul dikecualikan (`filter`).
- Kotak oranye bernomor digambar di kanvas sesuai `kotak` tiap objek.
- JPEG mutu 0,82 lalu 0,65, skala turun sampai ≤ 1,4 MB; gagal = catatan tetap tersimpan tanpa gambar.
- Efek kaca (`backdrop-filter`) dan sebagian bayangan tidak tergambar persis. Gambar hanya bantuan, sebutkan ke pengguna.

## 6. Jebakan yang sudah ditemukan (jangan diulang)

1. **Dialog modal** (`showModal()`) ada di top layer dan membuat semua di luar dialog *inert*: tombol dan panel modul tidak bisa
   diklik. Perbaikan: `MutationObserver` (atribut `open`, childList subtree) memindahkan host modul **ke dalam** dialog modal teratas
   selama terbuka, dan kembali ke `body` saat ditutup. Untuk gambar layar, dialog digambar terpisah (seluruh isi termasuk yang
   tergulir, gaya `position: static; margin: 0; max-height: none`) lalu ditempel di letaknya di atas latar redup. Bila dialog web
   tujuan memakai `transform`, `position: fixed` di dalamnya tidak lagi relatif ke layar: periksa.
2. Atribut `hidden` kalah oleh CSS `display:flex` milik sendiri → tambah `[hidden]{display:none!important}` di CSS shadow.
3. Android mengirim `contextmenu` setelah tekan lama → objek masuk dua kali. Abaikan contextmenu yang datang sesaat setelah tekan
   lama ditangani. Setelah tekan lama, **ketukan berikutnya ditelan** agar tombol di bawahnya tidak ikut berjalan.
4. Listener `contextmenu` dipasang di fase *capture* dan hanya bertindak saat mode aktif; `preventDefault` +
   `stopImmediatePropagation` hanya saat itu.
5. Selama mode aktif: `user-select: none` dan `-webkit-touch-callout: none` di halaman (kecuali isian dan modul), kalau tidak tekan
   lama di iOS memilih teks.
6. Panel di HP: lembar bawah menutupi menu bawah aplikasi. Saat menangkap objek panel tetap **kecil** dan di HP (< 720 px) pindah ke
   atas di bawah pita. Tombol apung dihitung di atas bilah `nav`/`footer` yang menempel di bawah.
7. Layar kunci aplikasi: sembunyikan modul selama layar kunci tampil (di Luz Care `.s-kunci`), supaya isi catatan tidak terbaca di
   atas layar kunci.
8. Halaman yang dicatat = halaman **saat Simpan** bila semua objek masih terpasang di DOM (penguji bisa pindah menu sambil menulis).
9. Ubah ukuran jendela: gambar ulang sorotan hanya bila lebar berubah (di HP, tinggi berubah setiap bilah alamat bergerak).
10. Keadaan panel (isi draf, objek, saringan) disimpan di `sessionStorage` per tab, sehingga muat ulang tidak menghapus draf.
11. Halaman masuk/statis: penguji belum login di halaman itu. Status penulis dibaca dari cookie sesi yang sama (login di tab lain).

## 7. Varian tanpa server (belum pernah dibuat)

Untuk web statis atau bila backend tidak boleh diubah:
- Penjaga: modul hanya dimuat bila halaman dibuka dengan penanda yang hanya ada di build uji (mis. variabel build
  `VITE_KOREKSI=nyala`) atau dari `localhost`. Jangan memakai parameter alamat saja di produksi: siapa pun bisa mengetiknya.
- Penyimpanan: IndexedDB (catatan + Blob gambar), bukan localStorage (batas ~5 MB).
- Ekspor: "Salin catatan" (Markdown, sama dengan format server) + "Unduh ZIP" (catatan.md + `gambar/N.jpg`); butuh pustaka ZIP
  kecil atau ZIP tanpa kompresi buatan sendiri.
- Status dan riwayat hanya lokal; beri tahu pengguna bahwa catatan tidak terlihat di perangkat lain dan hilang bila data situs
  dihapus.

## 8. Batas dan angka (acuan Luz Care)

Maks. 5 objek per catatan, isi 1-2.000 karakter, satu gambar per catatan ≤ 1,5 MB (dibuat ≤ 1,4 MB), tekan lama 500 ms, panel
380 px di PC, lembar bawah di < 720 px.
