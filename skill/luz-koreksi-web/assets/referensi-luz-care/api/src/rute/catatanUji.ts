// Catatan uji (2026-11-13; docs/rencana-pemasangan.md bagian 8). Alat kerja pengembangan, BUKAN fitur produk: dr. Lulu menyalakan
// Mode catatan di server uji, mengklik kanan (tekan lama di iPad/HP) objek di layar, lalu menulis perbaikannya. Claude membaca
// catatan lewat rute staf di bawah. Rute ini hanya dipasang bila catatanUjiNyala() (MODE uji/pengembangan + CATATAN_UJI=nyala) dan
// tidak pernah di produksi (app.ts). Penulis: staf (semua peran) atau akun pasien dummy; pasien hanya melihat catatannya sendiri.
// Dari objek hanya disimpan jenis, label, jejak, pemilih CSS, dan letaknya; isi kotak isian tidak pernah dikirim (dijaga di modul
// peramban apps/web/src/catatanUji). Log audit tanpa isi catatan.
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type pg from "pg";
import { catatAudit } from "../audit";
import type { Perlu } from "../penjaga";
import { jenisGambar, type Penyimpanan } from "../penyimpanan";
import { NAMA_COOKIE, muatSesi } from "../sesi";
import { NAMA_COOKIE_PASIEN, muatSesiPasien, type SesiPasien } from "../sesiPasien";
import { GalatMasukan, pilihan, teks, uuid } from "../validasi";
import { kirimGambar } from "./cetak";

export const BATAS_GAMBAR_CATATAN_UJI = 1.5 * 1024 * 1024;
export const MAKS_OBJEK = 5;
export const STATUS_CATATAN_UJI = ["baru", "dikerjakan", "selesai", "diterima", "dibuka-lagi"] as const;
const APLIKASI = ["staf", "pasien", "masuk"] as const;
const KATEGORI = ["tampilan", "alur", "teks", "error", "animasi"] as const;
const PRIORITAS = ["tinggi", "sedang", "rendah"] as const;

declare module "fastify" {
  interface FastifyRequest {
    sesiPasienUji?: SesiPasien;
  }
}

/** Teks yang diambil otomatis dari layar: dipangkas, tanpa karakter kendali, dipotong (bukan ditolak) bila terlalu panjang. */
function potong(v: unknown, maks: number): string {
  if (typeof v !== "string") return "";
  // eslint-disable-next-line no-control-regex
  return v.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim().slice(0, maks);
}
function angka(v: unknown, min: number, maks: number): number {
  const n = typeof v === "number" && Number.isFinite(v) ? v : 0;
  return Math.min(maks, Math.max(min, n));
}

function bacaHalaman(v: unknown) {
  const h = (v && typeof v === "object" ? v : {}) as Record<string, unknown>;
  return { alamat: potong(h.alamat, 300), judul: potong(h.judul, 150), menu: potong(h.menu, 60), tab: potong(h.tab, 60) };
}

function bacaPerangkat(v: unknown) {
  const p = (v && typeof v === "object" ? v : {}) as Record<string, unknown>;
  return {
    lebar: Math.round(angka(p.lebar, 0, 20000)),
    tinggi: Math.round(angka(p.tinggi, 0, 20000)),
    rasio: Math.round(angka(p.rasio, 0, 10) * 100) / 100,
    sentuh: p.sentuh === true,
    peramban: potong(p.peramban, 80),
    tema: potong(p.tema, 12),
  };
}

function bacaObjek(v: unknown) {
  if (v === undefined || v === null) return [];
  if (!Array.isArray(v)) throw new GalatMasukan("Objek tidak valid");
  if (v.length > MAKS_OBJEK) throw new GalatMasukan(`Maksimal ${MAKS_OBJEK} objek per catatan`);
  return v.map((o) => {
    const x = (o && typeof o === "object" ? o : {}) as Record<string, unknown>;
    const k = (x.kotak && typeof x.kotak === "object" ? x.kotak : {}) as Record<string, unknown>;
    return {
      jenis: potong(x.jenis, 40) || "Elemen",
      label: potong(x.label, 120),
      jejak: (Array.isArray(x.jejak) ? x.jejak : []).slice(0, 8).map((j) => potong(j, 80)).filter(Boolean),
      pemilih: potong(x.pemilih, 400),
      kotak: {
        x: Math.round(angka(k.x, -20000, 20000)), y: Math.round(angka(k.y, -20000, 20000)),
        w: Math.round(angka(k.w, 0, 20000)), h: Math.round(angka(k.h, 0, 20000)),
      },
    };
  });
}

function bacaCatatan(b: Record<string, unknown> | undefined) {
  const body = b ?? {};
  return {
    aplikasi: pilihan(body.aplikasi, "Aplikasi", APLIKASI),
    halaman: bacaHalaman(body.halaman),
    perangkat: bacaPerangkat(body.perangkat),
    kategori: pilihan(body.kategori, "Kategori", KATEGORI),
    prioritas: pilihan(body.prioritas, "Prioritas", PRIORITAS),
    isi: teks(body.isi, "Catatan", { wajib: true, maks: 2000 }),
    objek: bacaObjek(body.objek),
  };
}

const KOLOM = `c.id, c.nomor, c.dibuat_pada as "dibuatPada", c.diubah_pada as "diubahPada", c.aplikasi, c.halaman, c.perangkat, c.kategori,
  c.prioritas, c.isi, c.objek, c.gambar_kunci is not null as "adaGambar", c.status,
  coalesce((select json_agg(json_build_object('pada', r.pada, 'status', r.status, 'keterangan', r.keterangan, 'oleh', u.nama) order by r.pada)
              from catatan_uji_riwayat r join pengguna u on u.id = r.oleh where r.catatan_id = c.id), '[]'::json) as riwayat`;

export function ruteCatatanUji(app: FastifyInstance, pool: pg.Pool, perlu: Perlu, simpan: Penyimpanan) {
  const penjagaPasien = async (req: FastifyRequest, res: FastifyReply) => {
    const sesi = await muatSesiPasien(pool, req.cookies[NAMA_COOKIE_PASIEN]);
    if (!sesi || sesi.hanyaGantiSandi) return res.code(401).send({ pesan: "Silakan masuk" });
    req.sesiPasienUji = sesi;
  };

  type Penulis = { staf: string } | { pasien: string };
  const penulisDari = (req: FastifyRequest): Penulis =>
    req.sesi ? { staf: req.sesi.pengguna.id } : { pasien: req.sesiPasienUji!.akun.id };
  const audit = (req: FastifyRequest, aksi: string, id: string, detail: Record<string, unknown>) => {
    const p = penulisDari(req);
    return catatAudit(pool, { penggunaId: "staf" in p ? p.staf : null, akunPasienId: "pasien" in p ? p.pasien : null, aksi, entitas: "catatan-uji", entitasId: id, detail });
  };

  async function buat(req: FastifyRequest<{ Body: Record<string, unknown> }>) {
    const c = bacaCatatan(req.body);
    const p = penulisDari(req);
    const r = await pool.query<{ id: string; nomor: number }>(
      `insert into catatan_uji (penulis_staf, penulis_pasien, aplikasi, halaman, perangkat, kategori, prioritas, isi, objek)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning id, nomor`,
      ["staf" in p ? p.staf : null, "pasien" in p ? p.pasien : null, c.aplikasi, JSON.stringify(c.halaman), JSON.stringify(c.perangkat),
        c.kategori, c.prioritas, c.isi, JSON.stringify(c.objek)],
    );
    const x = r.rows[0]!;
    await audit(req, "buat", x.id, { nomor: x.nomor, objek: c.objek.length });
    return { id: x.id, nomor: x.nomor };
  }

  /** Catatan milik penulis ini (untuk unggah gambar dan hapus). */
  async function milik(req: FastifyRequest, id: string) {
    const p = penulisDari(req);
    const r = await pool.query<{ id: string; nomor: number; status: string; gambar_kunci: string | null }>(
      `select id, nomor, status, gambar_kunci from catatan_uji where id = $1 and ${"staf" in p ? "penulis_staf" : "penulis_pasien"} = $2`,
      [id, "staf" in p ? p.staf : p.pasien],
    );
    return r.rows[0] ?? null;
  }

  async function unggahGambar(req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) {
    const c = await milik(req, uuid(req.params.id));
    if (!c) return res.code(404).send({ pesan: "Catatan tidak ditemukan" });
    if (c.gambar_kunci) return res.code(409).send({ pesan: "Gambar layar sudah ada" });
    const isi = req.body;
    if (!Buffer.isBuffer(isi) || jenisGambar(isi) !== "image/jpeg") throw new GalatMasukan("Gambar layar harus JPEG");
    const kunci = await simpan.simpan(isi);
    const r = await pool.query("update catatan_uji set gambar_kunci = $2 where id = $1 and gambar_kunci is null", [c.id, kunci]);
    if (!r.rowCount) {
      await simpan.hapus(kunci);
      return res.code(409).send({ pesan: "Gambar layar sudah ada" });
    }
    await audit(req, "unggah-gambar", c.id, { nomor: c.nomor, ukuran: isi.length });
    return { ok: true };
  }

  async function hapus(req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) {
    const c = await milik(req, uuid(req.params.id));
    if (!c) return res.code(404).send({ pesan: "Catatan tidak ditemukan" });
    if (c.status !== "baru") return res.code(409).send({ pesan: "Catatan yang sudah diproses tidak bisa dihapus" });
    await pool.query("delete from catatan_uji where id = $1", [c.id]);
    if (c.gambar_kunci) await simpan.hapus(c.gambar_kunci);
    await audit(req, "hapus", c.id, { nomor: c.nomor });
    return { ok: true };
  }

  // ---- Staf (semua peran): melihat semua catatan dan mengubah status. ---------------------------------------------------------

  /** Tanpa login pun dijawab (pemuat modul bertanya di sini); penulis terisi bila ada sesi staf. */
  app.get("/api/catatan-uji/status", async (req) => {
    const s = await muatSesi(pool, req.cookies[NAMA_COOKIE], false);
    const staf = s && !s.hanyaGantiSandi ? { jenis: "staf", nama: s.pengguna.nama, peran: s.pengguna.peran } : null;
    return { aktif: true, penulis: staf };
  });

  app.get<{ Querystring: { status?: string; aplikasi?: string; kategori?: string } }>("/api/catatan-uji", { preHandler: perlu.masuk() }, async (req) => {
    const status = (req.query.status ?? "").split(",").filter(Boolean).map((s) => pilihan(s, "Status", STATUS_CATATAN_UJI));
    const aplikasi = req.query.aplikasi ? pilihan(req.query.aplikasi, "Aplikasi", APLIKASI) : null;
    const kategori = req.query.kategori ? pilihan(req.query.kategori, "Kategori", KATEGORI) : null;
    const r = await pool.query(
      `select ${KOLOM},
              case when c.penulis_staf is not null then json_build_object('jenis', 'staf', 'nama', u.nama, 'peran', u.peran)
                   else json_build_object('jenis', 'pasien', 'nama', 'Akun pasien ' || p.no_rm) end as penulis,
              c.penulis_staf is not distinct from $4 as "milikSaya"
         from catatan_uji c
         left join pengguna u on u.id = c.penulis_staf
         left join akun_pasien a on a.id = c.penulis_pasien
         left join pasien p on p.id = a.pasien_id
        where (cardinality($1::text[]) = 0 or c.status = any($1)) and ($2::text is null or c.aplikasi = $2) and ($3::text is null or c.kategori = $3)
        order by c.nomor desc limit 500`,
      [status, aplikasi, kategori, req.sesi!.pengguna.id],
    );
    return { catatan: r.rows };
  });

  app.post<{ Body: Record<string, unknown> }>("/api/catatan-uji", { preHandler: perlu.masuk() }, buat);
  app.put<{ Params: { id: string } }>("/api/catatan-uji/:id/gambar", { preHandler: perlu.masuk(), bodyLimit: BATAS_GAMBAR_CATATAN_UJI }, unggahGambar);
  app.delete<{ Params: { id: string } }>("/api/catatan-uji/:id", { preHandler: perlu.masuk() }, hapus);

  app.get<{ Params: { id: string } }>("/api/catatan-uji/:id/gambar", { preHandler: perlu.masuk() }, async (req, res) => {
    const r = await pool.query<{ gambar_kunci: string | null }>("select gambar_kunci from catatan_uji where id = $1", [uuid(req.params.id)]);
    const k = r.rows[0]?.gambar_kunci;
    if (!k) return res.code(404).send({ pesan: "Gambar tidak ada" });
    return kirimGambar(res, await simpan.baca(k), "image/jpeg");
  });

  app.patch<{ Params: { id: string }; Body: { status?: unknown; keterangan?: unknown } }>(
    "/api/catatan-uji/:id/status", { preHandler: perlu.masuk() }, async (req, res) => {
      const id = uuid(req.params.id);
      const status = pilihan(req.body?.status, "Status", STATUS_CATATAN_UJI);
      const keterangan = teks(req.body?.keterangan, "Keterangan", { maks: 300 }) || null;
      const lama = (await pool.query<{ nomor: number; status: string }>("select nomor, status from catatan_uji where id = $1", [id])).rows[0];
      if (!lama) return res.code(404).send({ pesan: "Catatan tidak ditemukan" });
      if (lama.status === status) return res.code(409).send({ pesan: "Status sudah sama" });
      await pool.query("update catatan_uji set status = $2, diubah_pada = now() where id = $1", [id, status]);
      await pool.query("insert into catatan_uji_riwayat (catatan_id, oleh, status, keterangan) values ($1, $2, $3, $4)", [id, req.sesi!.pengguna.id, status, keterangan]);
      await audit(req, "ubah-status", id, { nomor: lama.nomor, dari: lama.status, ke: status });
      return { ok: true };
    },
  );

  // ---- Akun pasien dummy: menulis dan melihat catatannya sendiri, tidak mengubah status. --------------------------------------

  app.get("/api/aplikasi/catatan-uji/saya", { preHandler: penjagaPasien }, async () => ({ aktif: true, penulis: { jenis: "pasien" } }));

  app.get("/api/aplikasi/catatan-uji", { preHandler: penjagaPasien }, async (req) => {
    const r = await pool.query(
      `select ${KOLOM}, json_build_object('jenis', 'pasien', 'nama', 'Anda') as penulis, true as "milikSaya"
         from catatan_uji c where c.penulis_pasien = $1 order by c.nomor desc limit 500`,
      [req.sesiPasienUji!.akun.id],
    );
    return { catatan: r.rows };
  });

  app.post<{ Body: Record<string, unknown> }>("/api/aplikasi/catatan-uji", { preHandler: penjagaPasien }, buat);
  app.put<{ Params: { id: string } }>("/api/aplikasi/catatan-uji/:id/gambar", { preHandler: penjagaPasien, bodyLimit: BATAS_GAMBAR_CATATAN_UJI }, unggahGambar);
  app.delete<{ Params: { id: string } }>("/api/aplikasi/catatan-uji/:id", { preHandler: penjagaPasien }, hapus);

  app.get<{ Params: { id: string } }>("/api/aplikasi/catatan-uji/:id/gambar", { preHandler: penjagaPasien }, async (req, res) => {
    const r = await pool.query<{ gambar_kunci: string | null }>(
      "select gambar_kunci from catatan_uji where id = $1 and penulis_pasien = $2", [uuid(req.params.id), req.sesiPasienUji!.akun.id],
    );
    const k = r.rows[0]?.gambar_kunci;
    if (!k) return res.code(404).send({ pesan: "Gambar tidak ada" });
    return kirimGambar(res, await simpan.baca(k), "image/jpeg");
  });
}
