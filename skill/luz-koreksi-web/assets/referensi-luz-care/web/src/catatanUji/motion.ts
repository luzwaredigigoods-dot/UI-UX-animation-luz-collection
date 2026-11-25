// Fitur Motion Catatan uji (2026-11-25, keputusan dr. Lulu "A setuju, B1 a, B2 a, B3 a").
// Katalog Luz Motion (198 animasi) + logika rekomendasi dan pratinjau dimuat pemuat.js dari /catatan-uji/luz-motion-data.js dan
// /catatan-uji/luz-motion.js (berkas hasil buatan repo UI-UX-animation-luz-collection, jangan diubah tangan). Bila keduanya tidak
// termuat, semua fungsi di sini kosong dan panel tampil tanpa bagian Animasi.
// Pratinjau hanya menganimasikan elemen (Web Animations API, gaya dikembalikan setelahnya); isi kotak isian tidak dibaca.

export interface Animasi {
  /** ID tetap, mis. button5-spring-pop */ id: string;
  /** nama */ n: string;
  /** kategori */ c: string;
  /** pemicu */ t: string;
  /** durasi & easing */ d: string;
  /** cocok untuk */ u: string;
  /** keluarga pratinjau */ g: string;
}

interface LuzMotion {
  GALERI: string;
  get(id: string): Animasi | undefined;
  rekomendasi(el: Element, n?: number): { jenis: string; label: string; target: Element; daftar: Animasi[] };
  cari(q: string, n?: number): Animasi[];
  pratinjau(el: Element, id: string): Promise<boolean>;
  hentikan(el: Element): void;
  namaKeluarga(g: string): string;
  baris(id: string, nomor?: number): string;
}

const lm = (): LuzMotion | null => (window as unknown as { LuzMotionKoreksi?: LuzMotion }).LuzMotionKoreksi ?? null;

export const motionAda = () => lm() !== null;
export const galeri = () => lm()?.GALERI ?? "";
export const animasi = (id: string | null) => (id ? lm()?.get(id) ?? null : null);
export const keluarga = (g: string) => lm()?.namaKeluarga(g) ?? g;
export const cariAnimasi = (q: string) => lm()?.cari(q, 8) ?? [];

/** Jenis objek (Tombol, Menu / navigasi, Kotak isian, ...) dan 6 animasi yang cocok, yang tenang lebih dulu. */
export function rekomendasi(el: Element | null): { label: string; ids: string[] } {
  const m = lm();
  if (!m || !el) return { label: "", ids: [] };
  try {
    const r = m.rekomendasi(el, 6);
    return { label: r.label, ids: r.daftar.map((d) => d.id) };
  } catch {
    return { label: "", ids: [] };
  }
}

/** Putar perkiraan gerak animasi pada objek asli di layar. */
export function pratinjau(el: Element, id: string): void {
  const m = lm();
  if (m) void m.pratinjau(el, id);
}

/** Baris yang ditulis ke isi catatan, mis. "@1 animasi: `button5-spring-pop` (Spring Pop · …)". */
export function barisAnimasi(id: string, nomor: number): string {
  return lm()?.baris(id, nomor) ?? `@${nomor} animasi: \`${id}\``;
}

const POLA = /^@(\d) animasi: .*$/gm;

/** Ganti atau tambah baris animasi untuk objek @nomor di isi catatan. */
export function pasangBaris(isi: string, nomor: number, id: string): string {
  const baru = barisAnimasi(id, nomor);
  const re = new RegExp(`^@${nomor} animasi: .*$`, "m");
  if (re.test(isi)) return isi.replace(re, baru);
  return (isi.trim() ? `${isi.replace(/\s+$/, "")}\n` : "") + baru;
}

/** Objek @hapus dihapus: buang barisnya dan geser nomor baris animasi objek sesudahnya (@3 → @2). Teks lain tidak diubah. */
export function hapusBaris(isi: string, hapus: number): string {
  return isi
    .replace(new RegExp(`^@${hapus} animasi: .*(\\n|$)`, "m"), "")
    .replace(POLA, (baris, n: string) => (Number(n) > hapus ? baris.replace(/^@\d/, `@${Number(n) - 1}`) : baris))
    .replace(/\n+$/, "");
}
