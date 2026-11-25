-- Catatan uji: kategori "animasi" untuk fitur Motion (2026-11-25, keputusan dr. Lulu "A setuju, B1 a, B2 a, B3 a").
-- Penguji memilih animasi Luz Motion untuk objek di layar; catatannya bisa berkategori Animasi. Data dummy saja.
alter table catatan_uji drop constraint catatan_uji_kategori_check;
alter table catatan_uji add constraint catatan_uji_kategori_check
  check (kategori in ('tampilan', 'alur', 'teks', 'error', 'animasi'));
