-- Catatan uji (2026-11-13, docs/rencana-pemasangan.md bagian 8): catatan perbaikan tampilan yang ditulis di server uji dengan
-- menunjuk objek di layar. Alat kerja pengembangan, BUKAN fitur produk: rute API-nya hanya dipasang bila MODE=uji/pengembangan
-- dan CATATAN_UJI=nyala (apps/api/src/pengaturan.ts catatanUjiNyala). Server uji hanya berisi data dummy; sebelum server uji
-- dipakai untuk hal lain, semua catatan + gambarnya dihapus dengan `npm run catatan-uji:hapus-semua`.
-- Yang disimpan dari objek hanya jenis, label, jejak, pemilih CSS, dan letaknya; isi kotak isian tidak pernah dibaca.
create table catatan_uji (
  id uuid primary key default gen_random_uuid(),
  -- Nomor pendek untuk disebut di chat ("#12").
  nomor serial unique,
  dibuat_pada timestamptz not null default now(),
  diubah_pada timestamptz not null default now(),
  -- Penulis: staf atau akun pasien dummy, tepat satu.
  penulis_staf uuid references pengguna (id),
  penulis_pasien uuid references akun_pasien (id) on delete cascade,
  check ((penulis_staf is null) <> (penulis_pasien is null)),
  aplikasi text not null check (aplikasi in ('staf', 'pasien', 'masuk')),
  -- { alamat, judul, menu, tab }
  halaman jsonb not null check (jsonb_typeof(halaman) = 'object'),
  -- { lebar, tinggi, rasio, sentuh, peramban, tema }
  perangkat jsonb not null check (jsonb_typeof(perangkat) = 'object'),
  kategori text not null check (kategori in ('tampilan', 'alur', 'teks', 'error')),
  prioritas text not null check (prioritas in ('tinggi', 'sedang', 'rendah')),
  isi text not null check (char_length(btrim(isi)) between 1 and 2000),
  -- [{ jenis, label, jejak[], pemilih, kotak {x, y, w, h} }], 0-5 objek
  objek jsonb not null check (jsonb_typeof(objek) = 'array' and jsonb_array_length(objek) <= 5),
  -- Gambar layar (JPEG terenkripsi di penyimpanan berkas); diunggah setelah catatan dibuat, sekali.
  gambar_kunci text,
  status text not null default 'baru' check (status in ('baru', 'dikerjakan', 'selesai', 'diterima', 'dibuka-lagi'))
);
create index catatan_uji_status on catatan_uji (status, dibuat_pada desc);

create table catatan_uji_riwayat (
  id uuid primary key default gen_random_uuid(),
  catatan_id uuid not null references catatan_uji (id) on delete cascade,
  pada timestamptz not null default now(),
  oleh uuid not null references pengguna (id),
  status text not null check (status in ('baru', 'dikerjakan', 'selesai', 'diterima', 'dibuka-lagi')),
  -- Catatan pendek, mis. rujukan commit.
  keterangan text check (keterangan is null or char_length(keterangan) <= 300)
);
create index catatan_uji_riwayat_catatan on catatan_uji_riwayat (catatan_id, pada);
