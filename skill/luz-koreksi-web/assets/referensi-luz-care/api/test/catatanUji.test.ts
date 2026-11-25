// Catatan uji (2026-11-13; docs/rencana-pemasangan.md bagian 8): modul catatan perbaikan tampilan, hanya di server uji/pengembangan.
// Data dummy saja.
import { readFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { buatApp } from "../src/app";
import { catatanUjiNyala } from "../src/pengaturan";
import { penyimpananLokal } from "../src/penyimpanan";
import { klien } from "./bantu";
import { PENGGUNA, cookieDari, siapkan } from "./siapkan";

const JPEG = readFileSync(new URL("./data/foto-kecil.jpg", import.meta.url));
const PNG = readFileSync(new URL("./data/foto-persegi.png", import.meta.url));

let ctx: Awaited<ReturnType<typeof siapkan>>;
let k: ReturnType<typeof klien>;
let dokter = "", asisten = "", admin = "", pasien = "", pasien2 = "";
const q = (sql: string, p: unknown[] = []) => ctx.pool.query(sql, p);
const inject = (method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE", url: string, cookie: string, payload?: object) =>
  ctx.app.inject({ method, url, headers: { cookie }, ...(payload ? { payload } : {}) });
const unggah = (url: string, cookie: string, isi: Buffer, mime = "image/jpeg") =>
  ctx.app.inject({ method: "PUT", url, headers: { cookie, "content-type": mime }, payload: isi });

const contoh = (tambahan: Record<string, unknown> = {}) => ({
  aplikasi: "staf",
  halaman: { alamat: "/#poliklinik", judul: "Poliklinik", menu: "Poliklinik", tab: "Urutan panggil" },
  perangkat: { lebar: 1366, tinggi: 768, rasio: 1, sentuh: false, peramban: "Chrome", tema: "" },
  kategori: "tampilan",
  prioritas: "sedang",
  isi: "Samakan tinggi @1 dengan @2",
  objek: [
    { jenis: "Tombol", label: "Salin", jejak: ["CPPT", "Kartu status"], pemilih: "button.s-salin", kotak: { x: 10, y: 20, w: 80, h: 32 } },
    { jenis: "Ubin", label: "UK", jejak: ["Kartu pasien"], pemilih: "div.s-ubin:nth-of-type(1)", kotak: { x: 100, y: 20, w: 120, h: 60 } },
  ],
  ...tambahan,
});

async function akunPasien(email: string) {
  const pid = (await k.minta("POST", "/api/pasien", admin, { nama: `Pasien Catatan ${email.slice(0, 2)}`, tglLahir: "1992-02-02", noHp: "080000000071", konfirmasiMirip: true })).json().pasien.id;
  expect((await k.minta("POST", "/api/kunjungan", admin, { pasienId: pid, jenis: "obstetri" })).statusCode).toBe(201);
  const r = await k.minta("POST", "/api/peserta", admin, { pasienId: pid, email, cara: "tunai" });
  expect(r.statusCode, r.body).toBe(201);
  let c = cookieDari(await ctx.app.inject({ method: "POST", url: "/api/aplikasi/masuk", payload: { email, kataSandi: r.json().kataSandiSementara } }));
  await inject("POST", "/api/aplikasi/sandi-awal", c, { kataSandiBaru: "teh manis sore" });
  c = cookieDari(await ctx.app.inject({ method: "POST", url: "/api/aplikasi/masuk", payload: { email, kataSandi: "teh manis sore" } }));
  return c;
}

beforeAll(async () => {
  ctx = await siapkan({ catatanUji: true, mode: "uji" });
  k = klien(ctx);
  dokter = await k.masuk(PENGGUNA.dokter);
  asisten = await k.masuk(PENGGUNA.asisten);
  admin = await k.masuk(PENGGUNA.admin);
  await q(`insert into persetujuan_teks (versi, isi, butir, contoh) values (1, 'BELUM DITETAPKAN: teks contoh (dummy)', '["Saya setuju (contoh)"]', true)`);
  expect((await k.minta("PUT", "/api/pengaturan/aplikasi-pasien", dokter, { aktif: true, hargaSesi: 1000 })).statusCode).toBe(200);
  pasien = await akunPasien("catatan.satu@contoh.test");
  pasien2 = await akunPasien("catatan.dua@contoh.test");
});
afterAll(async () => {
  await ctx.app.close();
  await ctx.pool.end();
});

describe("pengaman: hanya server uji/pengembangan dengan CATATAN_UJI=nyala", () => {
  it("catatanUjiNyala butuh CATATAN_UJI=nyala dan MODE uji/pengembangan", () => {
    expect(catatanUjiNyala({ CATATAN_UJI: "nyala", MODE: "uji" })).toBe(true);
    expect(catatanUjiNyala({ CATATAN_UJI: "nyala", MODE: "pengembangan" })).toBe(true);
    expect(catatanUjiNyala({ CATATAN_UJI: "nyala", MODE: "produksi" })).toBe(false);
    expect(catatanUjiNyala({ CATATAN_UJI: "nyala" })).toBe(false);
    expect(catatanUjiNyala({ MODE: "uji" })).toBe(false);
    expect(catatanUjiNyala({ CATATAN_UJI: "ya", MODE: "uji" })).toBe(false);
  });

  it("di produksi rute tidak ada walau opsi dinyalakan; tanpa opsi juga tidak ada", async () => {
    for (const opsi of [{ mode: "produksi" as const, catatanUji: true }, { mode: "uji" as const, catatanUji: false }]) {
      const app = buatApp({ pool: ctx.pool, penyimpanan: penyimpananLokal(ctx.folderBerkas, randomBytes(32).toString("base64")), ...opsi });
      await app.ready();
      expect((await app.inject({ method: "GET", url: "/api/catatan-uji/status" })).statusCode).toBe(404);
      expect((await app.inject({ method: "GET", url: "/api/catatan-uji", headers: { cookie: dokter } })).statusCode).toBe(404);
      expect((await app.inject({ method: "POST", url: "/api/catatan-uji", headers: { cookie: dokter }, payload: contoh() })).statusCode).toBe(404);
      expect((await app.inject({ method: "GET", url: "/api/aplikasi/catatan-uji/saya", headers: { cookie: pasien } })).statusCode).toBe(404);
      await app.close();
    }
  });

  it("status menyebut penulis staf bila ada sesi staf", async () => {
    expect((await ctx.app.inject({ method: "GET", url: "/api/catatan-uji/status" })).json()).toEqual({ aktif: true, penulis: null });
    expect((await inject("GET", "/api/catatan-uji/status", asisten)).json().penulis).toMatchObject({ jenis: "staf", peran: "asisten" });
    expect((await inject("GET", "/api/aplikasi/catatan-uji/saya", pasien)).json().penulis).toEqual({ jenis: "pasien" });
    expect((await ctx.app.inject({ method: "GET", url: "/api/aplikasi/catatan-uji/saya" })).statusCode).toBe(401);
  });
});

describe("membuat catatan", () => {
  let idDokter = "";
  it("staf membuat catatan + gambar layar JPEG; audit tanpa isi", async () => {
    const r = await inject("POST", "/api/catatan-uji", dokter, contoh());
    expect(r.statusCode, r.body).toBe(200);
    idDokter = r.json().id;
    expect(r.json().nomor).toBeGreaterThan(0);
    expect((await unggah(`/api/catatan-uji/${idDokter}/gambar`, dokter, JPEG)).statusCode).toBe(200);
    // Sekali saja.
    expect((await unggah(`/api/catatan-uji/${idDokter}/gambar`, dokter, JPEG)).statusCode).toBe(409);
    const g = await inject("GET", `/api/catatan-uji/${idDokter}/gambar`, asisten);
    expect(g.statusCode).toBe(200);
    expect(g.headers["content-type"]).toBe("image/jpeg");
    expect(Buffer.compare(g.rawPayload, JPEG)).toBe(0);
    const a = await q("select aksi, detail from log_audit where entitas = 'catatan-uji' and entitas_id = $1 order by id", [idDokter]);
    expect(a.rows.map((x) => x.aksi)).toEqual(["buat", "unggah-gambar"]);
    expect(JSON.stringify(a.rows)).not.toContain("Samakan");
  });

  it("gambar: hanya JPEG, maks. 1,5 MB, hanya penulisnya", async () => {
    const id = (await inject("POST", "/api/catatan-uji", asisten, contoh())).json().id;
    expect((await unggah(`/api/catatan-uji/${id}/gambar`, asisten, PNG, "image/png")).statusCode).toBe(400);
    const besar = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff]), randomBytes(1.6 * 1024 * 1024)]);
    expect((await unggah(`/api/catatan-uji/${id}/gambar`, asisten, besar)).statusCode).toBe(413);
    expect((await unggah(`/api/catatan-uji/${id}/gambar`, dokter, JPEG)).statusCode).toBe(404);
    expect((await unggah(`/api/aplikasi/catatan-uji/${id}/gambar`, pasien, JPEG)).statusCode).toBe(404);
  });

  it("masukan ditolak: isi kosong/terlalu panjang, kategori, lebih dari 5 objek", async () => {
    expect((await inject("POST", "/api/catatan-uji", dokter, contoh({ isi: "  " }))).statusCode).toBe(400);
    expect((await inject("POST", "/api/catatan-uji", dokter, contoh({ isi: "x".repeat(2001) }))).statusCode).toBe(400);
    expect((await inject("POST", "/api/catatan-uji", dokter, contoh({ kategori: "lain" }))).statusCode).toBe(400);
    expect((await inject("POST", "/api/catatan-uji", dokter, contoh({ prioritas: "darurat" }))).statusCode).toBe(400);
    expect((await inject("POST", "/api/catatan-uji", dokter, contoh({ aplikasi: "lain" }))).statusCode).toBe(400);
    const enam = Array.from({ length: 6 }, () => contoh().objek[0]);
    expect((await inject("POST", "/api/catatan-uji", dokter, contoh({ objek: enam }))).statusCode).toBe(400);
    // Tanpa objek boleh (catatan umum tentang halaman).
    expect((await inject("POST", "/api/catatan-uji", dokter, contoh({ objek: [] }))).statusCode).toBe(200);
  });

  it("teks otomatis dari layar dipotong, angka letak dibatasi; isian di luar daftar dibuang", async () => {
    const r = await inject("POST", "/api/catatan-uji", dokter, contoh({
      halaman: { alamat: "/" + "a".repeat(400), judul: "Judul\nbaris", rahasia: "x" },
      objek: [{ jenis: "Tombol", label: "L".repeat(300), jejak: Array.from({ length: 12 }, (_, i) => `J${i}`), pemilih: "p", kotak: { x: 1e9, y: "a", w: -5, h: 10.6 }, nilai: "isi kotak" }],
    }));
    const c = (await q("select halaman, objek from catatan_uji where id = $1", [r.json().id])).rows[0];
    expect(c.halaman.alamat).toHaveLength(300);
    expect(c.halaman.judul).toBe("Judul baris");
    expect(c.halaman.rahasia).toBeUndefined();
    expect(c.objek[0].label).toHaveLength(120);
    expect(c.objek[0].jejak).toHaveLength(8);
    expect(c.objek[0].kotak).toEqual({ x: 20000, y: 0, w: 0, h: 11 });
    expect(c.objek[0].nilai).toBeUndefined();
  });

  it("tanpa masuk ditolak", async () => {
    expect((await ctx.app.inject({ method: "POST", url: "/api/catatan-uji", payload: contoh() })).statusCode).toBe(401);
    expect((await ctx.app.inject({ method: "POST", url: "/api/aplikasi/catatan-uji", payload: contoh() })).statusCode).toBe(401);
  });

  it("staf melihat semua catatan (juga milik pasien) dengan penulis", async () => {
    const rp = await inject("POST", "/api/aplikasi/catatan-uji", pasien, contoh({ aplikasi: "pasien", isi: "Tombol menu bawah kecil" }));
    expect(rp.statusCode, rp.body).toBe(200);
    const d = (await inject("GET", "/api/catatan-uji", admin)).json().catatan as Array<{ id: string; penulis: { jenis: string; nama: string }; milikSaya: boolean; isi: string }>;
    expect(d.find((x) => x.id === idDokter)).toMatchObject({ penulis: { jenis: "staf", nama: "Uji dokter" }, milikSaya: false });
    expect(d.find((x) => x.id === rp.json().id)?.penulis.jenis).toBe("pasien");
    const saring = (await inject("GET", "/api/catatan-uji?aplikasi=pasien", dokter)).json().catatan as unknown[];
    expect(saring).toHaveLength(1);
    expect((await inject("GET", "/api/catatan-uji?status=hilang", dokter)).statusCode).toBe(400);
  });
});

describe("pasien dummy", () => {
  it("hanya melihat catatannya sendiri dan gambarnya sendiri", async () => {
    const a = (await inject("POST", "/api/aplikasi/catatan-uji", pasien2, contoh({ aplikasi: "pasien", isi: "Catatan pasien dua" }))).json().id;
    expect((await unggah(`/api/aplikasi/catatan-uji/${a}/gambar`, pasien2, JPEG)).statusCode).toBe(200);
    const satu = (await inject("GET", "/api/aplikasi/catatan-uji", pasien)).json().catatan as Array<{ isi: string }>;
    expect(satu.map((x) => x.isi)).toEqual(["Tombol menu bawah kecil"]);
    expect((await inject("GET", `/api/aplikasi/catatan-uji/${a}/gambar`, pasien)).statusCode).toBe(404);
    expect((await inject("GET", `/api/aplikasi/catatan-uji/${a}/gambar`, pasien2)).statusCode).toBe(200);
    // Cookie pasien tidak membuka rute staf.
    expect((await inject("GET", "/api/catatan-uji", pasien)).statusCode).toBe(401);
    expect((await inject("PATCH", `/api/catatan-uji/${a}/status`, pasien, { status: "selesai" })).statusCode).toBe(401);
  });
});

describe("status dan hapus", () => {
  it("staf mengubah status dengan keterangan; riwayat dan audit tercatat", async () => {
    const id = (await inject("POST", "/api/catatan-uji", admin, contoh())).json().id;
    expect((await inject("PATCH", `/api/catatan-uji/${id}/status`, asisten, { status: "dikerjakan" })).statusCode).toBe(200);
    expect((await inject("PATCH", `/api/catatan-uji/${id}/status`, asisten, { status: "dikerjakan" })).statusCode).toBe(409);
    expect((await inject("PATCH", `/api/catatan-uji/${id}/status`, asisten, { status: "selesai", keterangan: "commit abc1234" })).statusCode).toBe(200);
    expect((await inject("PATCH", `/api/catatan-uji/${id}/status`, dokter, { status: "beres" })).statusCode).toBe(400);
    const c = ((await inject("GET", "/api/catatan-uji?status=selesai", dokter)).json().catatan as Array<{ id: string; status: string; riwayat: Array<{ status: string; keterangan: string | null; oleh: string }> }>).find((x) => x.id === id)!;
    expect(c.status).toBe("selesai");
    expect(c.riwayat.map((x) => [x.status, x.keterangan, x.oleh])).toEqual([["dikerjakan", null, "Uji asisten"], ["selesai", "commit abc1234", "Uji asisten"]]);
    const a = await q("select detail from log_audit where aksi = 'ubah-status' and entitas_id = $1 order by id", [id]);
    expect(a.rows.map((x) => x.detail.ke)).toEqual(["dikerjakan", "selesai"]);
    // Sudah diproses: penulis tidak bisa menghapus lagi.
    expect((await inject("DELETE", `/api/catatan-uji/${id}`, admin)).statusCode).toBe(409);
  });

  it("hapus hanya oleh penulisnya selama Baru; gambar ikut terhapus", async () => {
    const id = (await inject("POST", "/api/catatan-uji", asisten, contoh())).json().id;
    await unggah(`/api/catatan-uji/${id}/gambar`, asisten, JPEG);
    const kunci = (await q("select gambar_kunci from catatan_uji where id = $1", [id])).rows[0].gambar_kunci as string;
    expect((await inject("DELETE", `/api/catatan-uji/${id}`, dokter)).statusCode).toBe(404);
    expect((await inject("DELETE", `/api/catatan-uji/${id}`, asisten)).statusCode).toBe(200);
    expect((await q("select 1 from catatan_uji where id = $1", [id])).rowCount).toBe(0);
    const { existsSync } = await import("node:fs");
    expect(existsSync(`${ctx.folderBerkas}/${kunci}`)).toBe(false);
    // Pasien: hanya catatannya sendiri.
    const p = (await inject("POST", "/api/aplikasi/catatan-uji", pasien, contoh({ aplikasi: "pasien" }))).json().id;
    expect((await inject("DELETE", `/api/aplikasi/catatan-uji/${p}`, pasien2)).statusCode).toBe(404);
    expect((await inject("DELETE", `/api/aplikasi/catatan-uji/${p}`, pasien)).statusCode).toBe(200);
  });
});
