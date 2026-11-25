# Titik penyesuaian: bagian kode acuan yang khusus Luz Care

Path relatif ke `assets/referensi-luz-care/`. Ubah semua ini untuk web tujuan; sisanya umumnya bisa dipakai apa adanya.

## Depan (web/)

| Tempat | Isi di Luz Care | Ubah menjadi |
|---|---|---|
| `src/catatanUji/index.ts` `Penulis`, `cekPenulis()` | Dua jenis pengguna: staf (`/api/catatan-uji/status` mengembalikan `penulis`) dan pasien (`/api/aplikasi/catatan-uji/saya`) karena cookie pasien hanya berlaku di `/api/aplikasi` | Satu jenis pengguna cukup memakai jawaban status. Tambah jenis hanya bila web punya sesi terpisah |
| `index.ts` `api()` | Pilih alamat API staf atau pasien | Satu alamat, mis. `/api/koreksi` |
| `index.ts` `APLIKASI`, `tangkap.ts` `aplikasiIni()` | staf `/`, pasien `/pasien`, masuk `/masuk` dan `/uji` | Bagian web tujuan (mis. publik / admin), atau hapus bila hanya satu |
| `index.ts` `SIMPAN_KUNCI` | `luz-catatan-uji` | Nama unik per web |
| `index.ts` `posisiApung()` | Sembunyikan saat `.s-kunci` (layar kunci) ada | Pemilih layar kunci web tujuan, atau hapus |
| `index.ts` teks panel | Bahasa Indonesia, sapaan "staf atau akun pasien uji" | Bahasa dan istilah web tujuan |
| `tangkap.ts` `pemilihDari()` | Atribut penanda `data-menu` | Atribut stabil yang dipakai web tujuan (`data-testid`, `data-menu`, dsb.) |
| `tangkap.ts` `halamanIni()` | Menu aktif `[data-menu][aria-current=page]` | Cara web tujuan menandai menu aktif. Bila alamat berubah per halaman, menu boleh kosong |
| `gaya.ts` | Warna merek Luz Care (krem/oranye, `#c2410c`) | Warna yang kontras dengan web tujuan agar modul tidak tertukar dengan isi halaman; periksa kontras ≥ 4,5:1 |
| `gambar.ts` `WARNA` | `#c2410c` | Sama dengan warna aksen modul |
| `public/catatan-uji/pemuat.js` | Cadangan `/src/catatanUji/index.ts` untuk vite dev | Sesuaikan path sumber, atau hapus bila tidak memakai vite |
| `src/catatanUjiPemuat.ts` | Dipanggil di `main.tsx` staf dan pasien | Titik masuk aplikasi tujuan; halaman HTML statis memakai `<script type="module" src="/catatan-uji/pemuat.js">` |

Pembangun (di Luz Care `apps/web/vite.config.ts`):
```ts
build: { rollupOptions: {
  input: { /* entri lain */, "catatan-uji": resolve(__dirname, "src/catatanUji/index.ts") },
  output: { entryFileNames: (c) => (c.name === "catatan-uji" ? "catatan-uji/catatan-uji.js" : "assets/[name]-[hash].js") },
} }
```
Webpack/lainnya: entri terpisah dengan nama berkas tetap, tanpa hash, tidak diimpor oleh bundel utama.

Server web (Caddy di Luz Care): `Cache-Control: no-cache` untuk `/catatan-uji/*`.

## Belakang (api/)

| Tempat | Isi di Luz Care | Ubah menjadi |
|---|---|---|
| `src/rute/catatanUji.ts` `ruteCatatanUji(app, pool, perlu, penyimpanan)` | Fastify + `pg`; `perlu.masuk` = penjaga login staf; `muatSesiPasien` untuk pasien | Kerangka dan penjaga login web tujuan |
| Penyimpanan gambar | `penyimpanan` Luz Care (berkas terenkripsi AES-256-GCM di disk) | Penyimpanan berkas web tujuan; enkripsi bila ada |
| Log audit | `catatAudit` aksi buat/unggah-gambar/hapus/ubah-status, tanpa isi | Log audit web tujuan bila ada; jangan menyimpan isi catatan di log |
| `migrations/028_catatan_uji.sql` | Kunci asing ke `pengguna` (staf) dan `akun_pasien` | Tabel pengguna web tujuan; satu kolom penulis bila satu jenis pengguna |
| `src/catatanUjiHapusSemua.ts` | Skrip npm `catatan-uji:hapus-semua -- --ya` | Perintah setara di web tujuan |
| Saklar | `pengaturan.ts` `catatanUjiNyala()`: `CATATAN_UJI=nyala` + `MODE=uji|pengembangan` | Nama variabel lingkungan dan mode web tujuan; tambahkan ke `.env.example` dan `docker-compose.yml` (kosong) |
| `test/catatanUji.test.ts` | vitest + `buatApp({ catatanUji: true })` | Kerangka tes web tujuan; tes produksi-404 wajib ada |

## Uji peramban (uji-peramban/)

`uji-catatan.js` (alur lengkap: klik kanan, wadah, simpan + gambar, daftar, salin, status, HP tekan lama, halaman masuk, dialog
modal) dan `uji-ukuran-catatan.js` (beberapa ukuran layar, tanpa gulir mendatar). Ditulis untuk server lokal Luz Care dengan akun
dummy; ganti alamat, cara login, dan pemilih halaman. Elemen modul dibaca lewat
`document.getElementById('cu-akar').shadowRoot`.
