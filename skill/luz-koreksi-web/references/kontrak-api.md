# Kontrak API (versi dengan server)

Semua rute hanya ada bila saklar nyala dan mode bukan produksi. Alamat contoh memakai awalan Luz Care; boleh diganti asal modul
depan ikut diubah.

| Metode + alamat | Login | Isi |
|---|---|---|
| `GET /api/catatan-uji/status` | tidak wajib | `{ aktif: true, penulis: {jenis, nama, peran} \| null }`. Dipakai pemuat dan untuk tahu siapa penulis |
| `GET /api/catatan-uji?status=&aplikasi=&kategori=` | wajib | `{ catatan: Catatan[] }` terbaru dulu; `status` = `antrean` (baru, dikerjakan, dibuka-lagi), `selesai`, `semua`, atau satu status |
| `POST /api/catatan-uji` | wajib | Badan: `{aplikasi, halaman, perangkat, kategori, prioritas, isi, objek[]}` → `{ catatan }` |
| `PUT /api/catatan-uji/:id/gambar` | penulis | Badan JPEG mentah (`Content-Type: image/jpeg`), sekali per catatan, ≤ 1,5 MB, diperiksa dari isi berkas (FF D8 FF) |
| `GET /api/catatan-uji/:id/gambar` | wajib | JPEG, `Cache-Control: no-store` |
| `PATCH /api/catatan-uji/:id/status` | wajib | `{status, keterangan?}`; 409 bila sama dengan status sekarang; menambah baris riwayat |
| `DELETE /api/catatan-uji/:id` | penulis | Hanya selama status `baru`; berkas gambar ikut dihapus |

Luz Care punya rute pasien yang sama di `/api/aplikasi/catatan-uji/*` (pasien hanya melihat catatannya sendiri dan tidak mengubah
status). Web dengan satu jenis pengguna tidak membutuhkannya.

## Bentuk Catatan

```ts
interface Catatan {
  id: string; nomor: number; dibuatPada: string; diubahPada: string;
  aplikasi: string;                         // bagian web
  halaman: { alamat: string; judul: string; menu: string; tab: string };
  perangkat: { lebar: number; tinggi: number; rasio: number; sentuh: boolean; peramban: string; tema: string };
  kategori: "tampilan" | "alur" | "teks" | "error";
  prioritas: "tinggi" | "sedang" | "rendah";
  isi: string;                              // 1-2000 karakter
  objek: Array<{ jenis: string; label: string; jejak: string[]; pemilih: string; kotak: { x: number; y: number; w: number; h: number } }>; // ≤ 5
  adaGambar: boolean;
  status: "baru" | "dikerjakan" | "selesai" | "diterima" | "dibuka-lagi";
  riwayat: Array<{ pada: string; status: string; keterangan: string | null; oleh: string }>;
  penulis: { jenis: string; nama: string; peran?: string }; milikSaya: boolean;
}
```

Server **membersihkan** semua masukan: memotong teks, membuang bidang tak dikenal, membatasi angka kotak, menolak kategori/prioritas
di luar daftar. Jangan percaya data dari peramban.

## Skema tabel (PostgreSQL, sesuaikan kunci asing)

Lihat `assets/referensi-luz-care/api/migrations/028_catatan_uji.sql`. Ringkas:

```sql
create table catatan_uji (
  id uuid primary key default gen_random_uuid(),
  nomor serial,
  dibuat_pada timestamptz not null default now(),
  diubah_pada timestamptz not null default now(),
  penulis uuid not null references pengguna(id),        -- Luz Care: penulis_staf / penulis_pasien + check tepat satu
  aplikasi text not null,
  halaman jsonb not null, perangkat jsonb not null,
  kategori text not null check (kategori in ('tampilan','alur','teks','error')),
  prioritas text not null check (prioritas in ('tinggi','sedang','rendah')),
  isi text not null check (char_length(isi) between 1 and 2000),
  objek jsonb not null default '[]' check (jsonb_typeof(objek) = 'array' and jsonb_array_length(objek) <= 5),
  gambar_kunci text,
  status text not null default 'baru' check (status in ('baru','dikerjakan','selesai','diterima','dibuka-lagi'))
);
create table catatan_uji_riwayat (
  id bigserial primary key,
  catatan_id uuid not null references catatan_uji(id) on delete cascade,
  pada timestamptz not null default now(),
  oleh uuid references pengguna(id),
  status text not null,
  keterangan text check (keterangan is null or char_length(keterangan) <= 300)
);
```

Tanpa PostgreSQL: SQLite/MySQL dengan kolom JSON sebagai teks juga cukup; batas di atas tetap ditegakkan di kode.
