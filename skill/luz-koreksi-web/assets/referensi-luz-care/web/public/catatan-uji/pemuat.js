// Pemuat Catatan uji (docs/rencana-pemasangan.md bagian 8). Hanya bertanya ke server; modulnya diunduh bila server menjawab bahwa
// Catatan uji menyala (MODE uji/pengembangan + CATATAN_UJI=nyala). Di produksi rute status tidak ada (404) dan tidak ada yang dimuat.
(async () => {
  if (window.__catatanUjiDimuat) return;
  window.__catatanUjiDimuat = true;
  try {
    const r = await fetch("/api/catatan-uji/status", { credentials: "same-origin", cache: "no-store" });
    if (!r.ok) return;
    const j = await r.json();
    if (!j || j.aktif !== true) return;
    try {
      await import("/catatan-uji/catatan-uji.js");
    } catch {
      // Server pengembangan (vite): modul dibaca langsung dari sumbernya.
      await import("/src/catatanUji/index.ts");
    }
  } catch {
    /* Catatan uji tidak tersedia: halaman tetap berjalan seperti biasa. */
  }
})();
