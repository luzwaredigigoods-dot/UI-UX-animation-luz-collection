---
name: luz-koreksi-web
description: Pasang modul "catatan koreksi tampilan" (alat review UI/UX) ke sebuah web, berasal dari modul Catatan uji Luz Care. Penguji membuka halaman seperti biasa, menyalakan Mode catatan, lalu klik kanan (tekan lama di HP/iPad) objek di layar; objek itu masuk ke panel catatan sebagai @1, @2, ..., penguji menulis perbaikannya, gambar layar bertanda ikut tersimpan, lalu catatan disalin sebagai Markdown untuk dikerjakan Claude. Fitur Motion: saat objek ditangkap, panel menyarankan animasi Luz Motion yang cocok untuk jenis objek itu, pratinjaunya bisa diputar langsung pada objek di halaman, dan animasi yang dipilih ikut tertulis di catatan. Pakai skill ini setiap kali pengguna ingin memasang alat catatan/koreksi/feedback/anotasi/review tampilan di web atau aplikasi web, ingin "klik kanan objek lalu tulis perbaikan", ingin memilih/mencoba animasi langsung pada objek web, menyebut luz-koreksi-web, Catatan uji, atau "fitur koreksi web seperti di Luz Care", walaupun tidak menyebut nama skill ini. Juga pakai saat pengguna menempelkan catatan hasil alat ini (berjudul "##
---

# luz-koreksi-web

Alat kerja pengembangan: penguji (biasanya pemilik web, bukan pemrogram) menandai objek di layar dan menulis koreksinya, sehingga
perbaikan tampilan lebih terarah daripada tangkapan layar + penjelasan di chat. Ini **bukan fitur produk**: hanya menyala di server
uji/pengembangan dan tidak pernah di produksi.

Kode acuan yang sudah berjalan dan teruji ada di `assets/referensi-luz-care/` (React + Vite di depan, Fastify + PostgreSQL di
belakang). Untuk web lain, kode itu **disesuaikan, bukan disalin mentah**: alamat API, cara login, deteksi halaman/menu, bilah menu
bawah, layar kunci, dan bahasa berbeda di tiap web.

## Fitur Motion (bawaan, bisa dimatikan)

Setelah objek ditangkap, panel menampilkan **animasi yang cocok** dari koleksi Luz Motion (198 animasi unik) sesuai jenis objek (tombol, menu, kotak isian, baris daftar, badge, angka, dialog, kartu, dsb.). Penguji bisa **▶ Coba** (pratinjau perkiraan gerak langsung pada objek asli), **Pilih** (menulis `@N animasi: \`id\`` ke catatan), mencari animasi lain, dan membuka galeri untuk versi persisnya. Tidak butuh perubahan backend: baris animasi disimpan di isi catatan. Rincian pemasangan: `references/motion.md`. Contoh jalan tanpa server: `assets/luz-motion/demo.html`.

## Dua pekerjaan yang dicakup skill ini

1. **Memasang** modul ke web baru (bagian "Alur pemasangan").
2. **Mengerjakan catatan** yang ditempel pengguna (bagian "Mengerjakan catatan"; rincian di `references/mengerjakan-catatan.md`).

## Alur pemasangan

Ikuti aturan kerja proyek tujuan (CLAUDE.md dan sejenisnya) lebih dulu; bila proyek meminta rencana + persetujuan sebelum kode,
lakukan itu.

1. **Kenali web tujuan.** Baca struktur repo: kerangka depan (React/Vue/HTML biasa/lainnya), pembangun (Vite/webpack/tanpa),
   ada server sendiri atau tidak, basis data, cara login dan nama cookie sesi, apakah ada lebih dari satu jenis pengguna, apakah
   alamat berubah per menu atau menu hanya berganti di dalam satu alamat, ada bilah menu bawah di HP, ada layar kunci, ada dialog
   modal (`<dialog>.showModal()`), dan cara web itu membedakan mode uji/produksi.
2. **Pilih bentuk penyimpanan** (jelaskan ke pengguna, minta pilihan bila tidak jelas):
   - **Dengan server** (bawaan bila web punya backend + basis data): catatan dan gambar disimpan di server uji, semua penguji melihat
     daftar yang sama, Claude bisa membaca langsung lewat akun uji. Acuan: `assets/referensi-luz-care/api/`.
   - **Tanpa server** (web statis atau backend tidak boleh disentuh): catatan di IndexedDB peramban penguji, diekspor sebagai
     Markdown + gambar (ZIP). Lebih sederhana tetapi catatan hanya ada di satu peramban. Lihat `references/arsitektur.md` bagian
     "Varian tanpa server". Varian ini belum pernah dibuat; uji lebih teliti.
3. **Tulis rencana singkat** ke pengguna: berkas yang ditambah/diubah, penjaga produksi, apa yang tersimpan, dan pertanyaan yang
   belum jelas. Tunggu persetujuan bila proyek atau pengguna memintanya.
4. **Pasang**, dengan `references/titik-penyesuaian.md` sebagai daftar bagian kode acuan yang wajib diubah. Pasang juga fitur Motion menurut `references/motion.md` kecuali pengguna menolaknya. Pertahankan
   keputusan rancangan di `references/arsitektur.md`; sebagian besar lahir dari masalah nyata (dialog modal, Android, menu bawah).
5. **Uji** seperti di Luz Care (acuan `assets/referensi-luz-care/api/test/` dan `assets/referensi-luz-care/uji-peramban/`):
   tes API (penjaga produksi 404, penulis hanya menghapus miliknya, batas ukuran), lalu uji peramban dengan Playwright di PC dan
   ukuran HP: tombol muncul, klik kanan menangkap objek, tekan lama di layar sentuh, objek di dalam dialog modal, gambar layar
   tersimpan, Salin catatan menghasilkan Markdown, panel tidak menutupi menu bawah, tidak ada gulir mendatar.
6. **Laporkan jujur**: apa yang diuji dan apa yang belum (HP/iPad sungguhan, Safari iOS hampir pasti belum).

## Aturan yang tidak boleh dilonggarkan

- **Tidak pernah aktif di produksi.** Dua kunci: mode server uji/pengembangan **dan** saklar khusus (di Luz Care
  `MODE=uji|pengembangan` + `CATATAN_UJI=nyala`). Di produksi rute tidak didaftarkan (404) dan pemuat tidak mengunduh modul.
  Alasannya: alat ini merekam gambar layar; di produksi gambar itu bisa berisi data pengguna sungguhan.
- **Tidak membaca isi kotak isian.** Dari objek hanya diambil jenis, label, jejak wadah, pemilih CSS, dan letak. Nilai
  `input`/`textarea`/`select` tidak pernah dibaca, walau di server uji, karena penguji bisa saja mengetik data sungguhan.
- **Gambar layar = data.** Simpan terenkripsi bila web punya penyimpanan terenkripsi; beri perintah hapus-semua sebelum server uji
  dipakai untuk hal lain; jangan pernah mengirim gambar atau catatan ke layanan luar.
- **Modul terisolasi**: shadow DOM, tanpa kerangka (vanilla TS), CSS halaman tidak boleh menembus dan sebaliknya. Halaman harus
  tetap berjalan normal bila modul gagal dimuat.

## Mengerjakan catatan

Saat pengguna menempelkan hasil "Salin catatan" (Markdown berjudul `## #N · Kategori · Prioritas ... · Status`):

1. Kerjakan per nomor catatan, prioritas tinggi dulu. Temukan objek dari baris "Objek" (nama, jejak wadah, pemilih CSS, letak) dan
   halaman (alamat + menu + tab).
2. Bila catatan ambigu atau bertentangan dengan keputusan proyek yang tercatat, tanyakan dulu; jangan menebak.
3. Uji perubahannya di ukuran layar yang tercatat di baris "Perangkat".
4. Baris `@N animasi: \`id\` (...)` di isi catatan berarti penguji memilih animasi Luz Motion untuk objek @N: kerjakan dengan skill `luz-motion` (cari ID di katalognya; ID lama yang digabung diarahkan ke penggantinya). Terapkan ke objek yang sama, ikuti aturan tetap luz-motion (reduced-motion, bisa diinterupsi, durasi).
5. Laporkan per nomor: diubah apa (berkas:baris), atau alasan tidak dikerjakan. Ingatkan penguji mengubah status di panel
   (Sedang dikerjakan → Selesai, perlu dicek; penguji memberi Diterima / Dibuka lagi).

Gambar layar tidak ikut di teks salinan (hanya tautan yang butuh login). Minta pengguna melampirkan potret layar bila catatan
bergantung pada tampilan. Rincian: `references/mengerjakan-catatan.md`.

## Berkas dalam skill ini

| Berkas | Isi | Kapan dibaca |
|---|---|---|
| `references/arsitektur.md` | Cara kerja, keputusan rancangan dan alasannya, jebakan yang sudah ditemukan, varian tanpa server | Sebelum memasang |
| `references/titik-penyesuaian.md` | Daftar bagian kode acuan yang khusus Luz Care dan harus diubah | Saat memasang |
| `references/kontrak-api.md` | Rute, bentuk data, skema tabel | Saat membuat backend |
| `references/mengerjakan-catatan.md` | Format Markdown catatan dan cara menindaklanjutinya | Saat pengguna menempel catatan |
| `assets/referensi-luz-care/` | Kode acuan lengkap (depan, API, migrasi, tes, uji peramban) | Saat memasang |
| `references/motion.md` | Fitur Motion: rekomendasi animasi per objek, pratinjau di objek asli, cara memasang ke index.ts | Saat memasang, dan saat catatan berisi baris `animasi:` |
| `assets/luz-motion/` | Data katalog Luz Motion, logika rekomendasi + pratinjau, panel acuan, halaman demo | Saat memasang fitur Motion |
