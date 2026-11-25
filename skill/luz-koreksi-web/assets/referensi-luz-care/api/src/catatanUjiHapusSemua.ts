// Menghapus SEMUA catatan uji beserta gambar layarnya (docs/rencana-pemasangan.md bagian 8, cara pasang g). Wajib dijalankan sebelum
// server uji dipakai untuk hal lain atau sebelum data asli masuk, lalu kosongkan CATATAN_UJI di .env.
// Pakai (di server): sudo docker compose exec api npm run catatan-uji:hapus-semua -- --ya
import { buatPool } from "./db";
import { penyimpananLokal } from "./penyimpanan";

const pool = buatPool();
try {
  const r = await pool.query<{ n: number; g: number }>("select count(*)::int as n, count(gambar_kunci)::int as g from catatan_uji");
  const { n, g } = r.rows[0]!;
  if (!process.argv.includes("--ya")) {
    console.log(`Ada ${n} catatan uji (${g} gambar layar). Untuk menghapus semuanya, ulangi dengan: npm run catatan-uji:hapus-semua -- --ya`);
  } else {
    const simpan = penyimpananLokal(process.env.BERKAS_DIR ?? "./data-berkas", process.env.BERKAS_KUNCI ?? "");
    const k = await pool.query<{ gambar_kunci: string }>("select gambar_kunci from catatan_uji where gambar_kunci is not null");
    await pool.query("delete from catatan_uji");
    for (const x of k.rows) await simpan.hapus(x.gambar_kunci);
    await pool.query(
      "insert into log_audit (pengguna_id, aksi, entitas, detail) values (null, 'hapus-semua', 'catatan-uji', $1)",
      [JSON.stringify({ catatan: n, gambar: k.rows.length, dari: "terminal" })],
    );
    console.log(`Terhapus: ${n} catatan uji dan ${k.rows.length} gambar layar.`);
  }
} finally {
  await pool.end();
}
