# Mengerjakan catatan yang ditempel pengguna

## Format salinan

Tombol "Salin catatan (N)" menghasilkan satu blok per catatan:

```markdown
## #12 · Tampilan · Prioritas tinggi · Baru
- Halaman: Poliklinik › Urutan panggil (`/`, Staf)
- Perangkat: 390×844, rasio 3, layar sentuh, Safari, tema terang
- Penulis: Nama Penguji (dokter) · 14/11/2026 09:12
- Gambar layar: ada (/api/catatan-uji/<id>/gambar)
- ID: <uuid>
- Objek:
  1. Tombol "Daftar" (Poliklinik › Urutan panggil) `main > section.antrean > button.utama` di x312 y96 120×40
  2. Judul "Urutan panggil" (...) `...` di x16 y88 200×28

> Tombol Daftar terlalu dekat dengan judul, di HP sering tertekan.
> @2 sebaiknya satu baris.
- 14/11/2026 10:00 Sedang dikerjakan oleh dokter
```

`@1`, `@2` di isi catatan merujuk ke nomor di daftar "Objek".

Bila fitur Motion terpasang, isi catatan bisa memuat baris seperti:
```
@1 animasi: `button5-spring-pop` (Spring Pop · susut 120ms ease-in · pegas ≈480ms)
```
Artinya penguji sudah mencoba dan memilih animasi itu untuk objek @1. Kerjakan dengan skill `luz-motion`: ambil gerak, durasi, dan kode acuannya dari katalog, terapkan ke objek @1, lalu laporkan seperti catatan lain. Kategori `Animasi` dipakai untuk catatan yang isinya hanya permintaan animasi.

## Cara menemukan objek di kode

1. Halaman: alamat + menu + tab. Pada aplikasi satu halaman, menu lebih berguna daripada alamat.
2. Label objek (teks tombol, judul, label isian) dicari dengan grep di sumber; pemilih CSS membantu memastikan elemen yang benar
   (kelas, `data-*`), tetapi kelas hasil pembangun (hash) tidak bisa dicari, jadi pakai label dan jejak wadah.
3. Letak (`x y w h`) dan ukuran layar dari baris Perangkat: ulangi di Playwright dengan ukuran yang sama untuk melihat masalahnya
   sebelum dan sesudah diubah.

## Urutan kerja

1. Kelompokkan per halaman dan prioritas; tinggi dulu.
2. Catatan yang meminta perubahan alur, aturan, atau isi yang punya keputusan tercatat di proyek: tanyakan dulu, sebut keputusan
   yang bertentangan. Catatan tampilan murni (jarak, ukuran, warna, teks terpotong) boleh langsung dikerjakan bila aturan proyek
   mengizinkan.
3. Kategori "Error": coba ulangi di ukuran layar yang sama; bila tidak bisa diulang, katakan dan minta langkahnya.
4. Setelah mengubah: uji di ukuran layar catatan + satu ukuran PC + satu ukuran HP; periksa tidak ada gulir mendatar dan kontras
   teks tetap ≥ 4,5:1.

## Laporan ke pengguna

Per nomor catatan, satu baris:
- `#12` selesai: tombol Daftar diberi jarak 12 px dari judul (`berkas:baris`), diuji 390×844 dan 1366×768.
- `#13` tidak dikerjakan: bertentangan dengan keputusan <tanggal> "<keputusan>"; perlu konfirmasi.

Lalu ingatkan langkah pemasangan ke server uji (bila ada) dan bahwa **status diubah penguji di panel**: Sedang dikerjakan → Selesai,
perlu dicek; penguji memberi Diterima atau Dibuka lagi setelah memeriksa di server uji. Claude hanya mengubah status sendiri bila
punya akun uji di server dan pengguna memintanya.

## Gambar layar

Teks salinan hanya membawa tautan gambar yang butuh login. Bila catatan bergantung pada tampilan ("lihat gambar", warna, posisi
yang tidak jelas dari teks), minta pengguna melampirkan potret layar dari panel detail. Jangan menebak isi gambar.
