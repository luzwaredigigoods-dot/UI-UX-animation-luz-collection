// Catatan uji (alat kerja server uji, docs/rencana-pemasangan.md bagian 8): pemuat kecil yang bertanya ke server dulu; di produksi
// server menjawab 404 dan modulnya tidak pernah diunduh.
const PEMUAT = "/catatan-uji/pemuat.js";
export function muatCatatanUji() {
  import(/* @vite-ignore */ PEMUAT).catch(() => undefined);
}
