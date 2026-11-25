// Catatan uji, fitur Motion (2026-11-25, keputusan dr. Lulu "A setuju, B1 a, B2 a, B3 a"): kategori "animasi" (migrasi 032) dan
// baris "@N animasi: `id`" di isi catatan disimpan apa adanya. Data dummy saja.
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { klien } from "./bantu";
import { PENGGUNA, siapkan } from "./siapkan";

let ctx: Awaited<ReturnType<typeof siapkan>>;
let k: ReturnType<typeof klien>;
let dokter = "";
const inject = (method: "GET" | "POST", url: string, cookie: string, payload?: object) =>
  ctx.app.inject({ method, url, headers: { cookie }, ...(payload ? { payload } : {}) });

const ISI = "@1 animasi: `button5-spring-pop` (Spring Pop · susut 120ms ease-in · pegas ≈480ms)\nTombol terasa kaku saat ditekan.";
const contoh = (tambahan: Record<string, unknown> = {}) => ({
  aplikasi: "staf",
  halaman: { alamat: "/#poliklinik", judul: "Poliklinik", menu: "Poliklinik", tab: "Urutan panggil" },
  perangkat: { lebar: 1366, tinggi: 768, rasio: 1, sentuh: false, peramban: "Chrome", tema: "" },
  kategori: "animasi",
  prioritas: "sedang",
  isi: ISI,
  objek: [{ jenis: "Tombol", label: "Panggil", jejak: ["Urutan panggil"], pemilih: "button.s-panggil", kotak: { x: 10, y: 20, w: 80, h: 32 } }],
  ...tambahan,
});

beforeAll(async () => {
  ctx = await siapkan({ catatanUji: true, mode: "uji" });
  k = klien(ctx);
  dokter = await k.masuk(PENGGUNA.dokter);
});
afterAll(async () => {
  await ctx.app.close();
  await ctx.pool.end();
});

describe("Catatan uji: kategori Animasi", () => {
  it("catatan berkategori animasi tersimpan dengan baris animasinya utuh", async () => {
    const r = await inject("POST", "/api/catatan-uji", dokter, contoh());
    expect(r.statusCode, r.body).toBe(200);
    const daftar = (await inject("GET", "/api/catatan-uji?status=baru", dokter)).json();
    const c = (daftar.catatan ?? daftar).find((x: { id: string }) => x.id === r.json().id);
    expect(c.kategori).toBe("animasi");
    expect(c.isi).toBe(ISI);
  });

  it("saringan kategori animasi hanya mengembalikan catatan animasi", async () => {
    expect((await inject("POST", "/api/catatan-uji", dokter, contoh({ kategori: "tampilan", isi: "Jarak @1 terlalu rapat" }))).statusCode).toBe(200);
    const daftar = (await inject("GET", "/api/catatan-uji?kategori=animasi", dokter)).json();
    const isi = (daftar.catatan ?? daftar) as Array<{ kategori: string }>;
    expect(isi.length).toBeGreaterThan(0);
    expect(isi.every((c) => c.kategori === "animasi")).toBe(true);
  });

  it("kategori di luar daftar tetap ditolak, dan basis data menolak kategori asing", async () => {
    expect((await inject("POST", "/api/catatan-uji", dokter, contoh({ kategori: "gerak" }))).statusCode).toBe(400);
    await expect(ctx.pool.query("update catatan_uji set kategori = 'gerak'")).rejects.toThrow();
  });
});
