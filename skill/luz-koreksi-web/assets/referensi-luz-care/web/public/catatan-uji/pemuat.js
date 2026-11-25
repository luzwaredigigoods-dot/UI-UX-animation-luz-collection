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
    // Fitur Motion (2026-11-25): katalog Luz Motion + rekomendasi/pratinjau animasi, dimuat sebelum modul. Bila gagal, Catatan uji
    // tetap jalan tanpa bagian Animasi.
    for (const src of ["/catatan-uji/luz-motion-data.js", "/catatan-uji/luz-motion.js"]) {
      await new Promise((ok) => {
        const s = document.createElement("script");
        s.src = src;
        s.onload = ok;
        s.onerror = ok;
        document.head.appendChild(s);
      });
    }
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
