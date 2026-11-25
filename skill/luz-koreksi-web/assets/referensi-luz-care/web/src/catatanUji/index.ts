// Catatan uji (2026-11-13; docs/rencana-pemasangan.md bagian 8). Alat kerja pengembangan di server uji, bukan fitur produk.
// Dimuat oleh /catatan-uji/pemuat.js hanya bila /api/catatan-uji/status menjawab (rute itu tidak ada di produksi).
// Mode catatan: klik kanan (tekan lama di iPad/HP) objek di layar -> objek masuk panel sebagai @1, @2, ... lalu tulis perbaikannya.
// Saat Mode catatan mati, klik kanan dan tekan lama berfungsi seperti biasa. Isi kotak isian tidak pernah dibaca (lihat tangkap.ts).
import { ambilGambar } from "./gambar";
import { GAYA, GAYA_HALAMAN } from "./gaya";
import {
  animasi, cariAnimasi, galeri, hapusBaris, keluarga, motionAda, pasangBaris, pratinjau, rekomendasi, type Animasi,
} from "./motion";
import {
  aplikasiIni, gambarkan, halamanIni, kotakDari, namaObjek, perangkatIni, rantaiDari, type Halaman, type Objek,
} from "./tangkap";

type Penulis = { jenis: "staf"; nama: string; peran: string } | { jenis: "pasien" } | null;
interface Butir {
  objek: Objek; el: Element | null; rantai: Element[]; pilih: number;
  /** Fitur Motion: jenis objek, 6 animasi yang cocok, dan animasi yang dipilih penguji (null = belum). */
  jenis: string; rek: string[]; animasi: string | null;
}
interface Catatan {
  id: string; nomor: number; dibuatPada: string; diubahPada: string; aplikasi: string; halaman: Halaman;
  perangkat: { lebar: number; tinggi: number; rasio: number; sentuh: boolean; peramban: string; tema: string };
  kategori: string; prioritas: string; isi: string; objek: Objek[]; adaGambar: boolean; status: string;
  riwayat: Array<{ pada: string; status: string; keterangan: string | null; oleh: string }>;
  penulis: { jenis: string; nama: string; peran?: string }; milikSaya: boolean;
}

const MAKS_OBJEK = 5;
const KATEGORI: Array<[string, string]> = [["tampilan", "Tampilan"], ["alur", "Alur"], ["teks", "Teks"], ["error", "Error"], ["animasi", "Animasi"]];
const PRIORITAS: Array<[string, string]> = [["tinggi", "Tinggi"], ["sedang", "Sedang"], ["rendah", "Rendah"]];
const STATUS: Array<[string, string]> = [
  ["baru", "Baru"], ["dikerjakan", "Sedang dikerjakan"], ["selesai", "Selesai, perlu dicek"], ["diterima", "Diterima"], ["dibuka-lagi", "Dibuka lagi"],
];
const APLIKASI: Record<string, string> = { staf: "Staf", pasien: "Pasien", masuk: "Halaman masuk" };
const label = (daftar: Array<[string, string]>, k: string) => daftar.find((x) => x[0] === k)?.[1] ?? k;
const ANTREAN = ["baru", "dikerjakan", "dibuka-lagi"];
const SIMPAN_KUNCI = "luz-catatan-uji";

const esc = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const waktu = (iso: string) => {
  const d = new Date(iso);
  return `${d.toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" })} ${d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`;
};
const IKON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z"/><path d="M13.5 7.5l3 3"/></svg>`;

// ---- Keadaan ---------------------------------------------------------------------------------------------------------------------

const k = {
  penulis: null as Penulis,
  sudahCek: false,
  aktif: false,
  buka: false,
  kecil: false,
  sisi: "kanan" as "kanan" | "kiri",
  tab: "tulis" as "tulis" | "daftar" | "detail",
  butir: [] as Butir[],
  isi: "",
  kategori: "tampilan",
  prioritas: "sedang",
  gambar: true,
  halaman: null as Halaman | null,
  pesan: "" as string,
  galat: false,
  sedang: false,
  daftar: [] as Catatan[],
  memuat: false,
  saring: { status: "antrean", aplikasi: "", kategori: "", halamanIni: false },
  detail: null as string | null,
  /** Fitur Motion: objek yang bagian Animasinya terbuka (-1 = semua terlipat, keputusan B2 a) dan kata pencarian. */
  motionBuka: -1,
  motionCari: "",
};

/** Aplikasi staf tidak mengubah alamat per menu, jadi "halaman yang sama" = alamat + menu yang aktif. */
const kunciHalaman = (h: Pick<Halaman, "alamat" | "menu">) => `${h.alamat}|${h.menu}`;
const halamanSama = (h: Pick<Halaman, "alamat" | "menu">) => kunciHalaman(h) === kunciHalaman(halamanIni());

const api = () => (k.penulis?.jenis === "pasien" ? "/api/aplikasi/catatan-uji" : "/api/catatan-uji");

function simpanKeadaan() {
  try {
    sessionStorage.setItem(SIMPAN_KUNCI, JSON.stringify({
      aktif: k.aktif, buka: k.buka, kecil: k.kecil, sisi: k.sisi, isi: k.isi, kategori: k.kategori, prioritas: k.prioritas, gambar: k.gambar,
      halaman: k.halaman, objek: k.butir.map((b) => b.objek), animasi: k.butir.map((b) => b.animasi), saring: k.saring,
    }));
  } catch { /* penyimpanan peramban tidak tersedia: tidak apa-apa */ }
}

function muatKeadaan() {
  try {
    const s = JSON.parse(sessionStorage.getItem(SIMPAN_KUNCI) ?? "null");
    if (!s) return;
    Object.assign(k, {
      aktif: s.aktif === true, buka: s.buka === true, kecil: s.kecil === true, sisi: s.sisi === "kiri" ? "kiri" : "kanan",
      isi: typeof s.isi === "string" ? s.isi : "", kategori: s.kategori ?? "tampilan", prioritas: s.prioritas ?? "sedang", gambar: s.gambar !== false,
      halaman: s.halaman ?? null, saring: { ...k.saring, ...(s.saring ?? {}) },
    });
    // Objek dari halaman sebelumnya: dicari lagi lewat pemilihnya bila halamannya sama.
    const sama = s.halaman && halamanSama(s.halaman);
    const pilihan: unknown[] = Array.isArray(s.animasi) ? s.animasi : [];
    k.butir = (Array.isArray(s.objek) ? s.objek : []).slice(0, MAKS_OBJEK).map((o: Objek, i: number) => {
      let el: Element | null = null;
      if (sama && o.pemilih) { try { el = document.querySelector(o.pemilih); } catch { el = null; } }
      const id = typeof pilihan[i] === "string" ? pilihan[i] as string : null;
      return { objek: o, el, rantai: el ? [el] : [], pilih: 0, ...rekomendasiButir(el), animasi: animasi(id) ? id : null };
    });
  } catch { /* abaikan */ }
}

// ---- Kerangka (shadow DOM) -------------------------------------------------------------------------------------------------------

const host = document.createElement("div");
host.id = "cu-akar";
host.style.cssText = "position:fixed;top:0;left:0;width:0;height:0;z-index:2147483000;";
const akar = host.attachShadow({ mode: "open" });
akar.innerHTML = `<style>${GAYA}</style><div class="akar">
  <div class="bingkai" hidden></div>
  <div class="pita" hidden role="status"><span class="panjang">Mode catatan · klik kanan objek (tekan lama di HP) · Esc keluar</span><span class="pendek">Mode catatan · tekan lama objek</span>
    <button type="button" data-aksi="panel">Panel</button><button type="button" data-aksi="matikan">Matikan</button></div>
  <div class="sorot" hidden></div><div class="sorot-label" hidden></div>
  <div class="tanda-wadah"></div><div class="kilat-wadah"></div>
  <button type="button" class="apung" data-aksi="apung" aria-pressed="false">${IKON}<span class="teks">Catatan uji</span><span class="angka" hidden></span></button>
  <section class="panel kanan" hidden role="dialog" aria-label="Catatan uji" aria-modal="false"></section>
</div>`;
const $ = <T extends Element>(s: string) => akar.querySelector(s) as T;
const elBingkai = $<HTMLElement>(".bingkai");
const elPita = $<HTMLElement>(".pita");
const elSorot = $<HTMLElement>(".sorot");
const elSorotLabel = $<HTMLElement>(".sorot-label");
const elTanda = $<HTMLElement>(".tanda-wadah");
const elKilat = $<HTMLElement>(".kilat-wadah");
const elApung = $<HTMLButtonElement>(".apung");
const elPanel = $<HTMLElement>(".panel");

const gayaHalaman = document.createElement("style");
gayaHalaman.textContent = GAYA_HALAMAN;

const diDalamKita = (e: Event) => e.composedPath().includes(host);

/**
 * Dialog modal (showModal, mis. "Daftarkan pasien") berada di atas segalanya dan membuat semua di luar dialog tidak bisa diklik.
 * Selama ada dialog modal terbuka, Catatan uji dipindahkan ke dalam dialog itu (tetap menempel di layar karena dialog Luz Care
 * tidak memakai transform), lalu kembali ke halaman saat dialog ditutup atau dilepas.
 */
function dialogModalAtas(): HTMLDialogElement | null {
  const terbuka = [...document.querySelectorAll("dialog")].filter((d) => {
    if (!d.open) return false;
    try { return d.matches(":modal"); } catch { return true; }
  });
  return terbuka[terbuka.length - 1] ?? null;
}
let rafPindah = 0;
function pindahkanHost() {
  rafPindah = 0;
  const tujuan = dialogModalAtas() ?? document.body;
  if (host.parentElement !== tujuan) tujuan.append(host);
}
const jadwalPindah = () => { if (!rafPindah) rafPindah = requestAnimationFrame(pindahkanHost); };

// ---- Server ----------------------------------------------------------------------------------------------------------------------

async function cekPenulis() {
  try {
    const r = await fetch("/api/catatan-uji/status", { credentials: "same-origin", cache: "no-store" });
    const j = r.ok ? await r.json() : null;
    if (j?.penulis?.jenis === "staf") { k.penulis = j.penulis; k.sudahCek = true; return; }
    const p = await fetch("/api/aplikasi/catatan-uji/saya", { credentials: "same-origin", cache: "no-store" });
    k.penulis = p.ok ? { jenis: "pasien" } : null;
  } catch {
    k.penulis = null;
  }
  k.sudahCek = true;
}

async function muatDaftar() {
  if (!k.penulis) return;
  k.memuat = true;
  try {
    const r = await fetch(api(), { credentials: "same-origin", cache: "no-store" });
    if (r.ok) k.daftar = (await r.json()).catatan as Catatan[];
  } catch { /* koneksi putus: daftar lama tetap */ }
  k.memuat = false;
  perbaruiApung();
  if (k.buka && k.tab !== "tulis") gambarPanel();
}

// ---- Objek -----------------------------------------------------------------------------------------------------------------------

/** Rekomendasi animasi untuk objek (kosong bila fitur Motion tidak termuat atau objek tidak lagi di layar). */
function rekomendasiButir(el: Element | null): { jenis: string; rek: string[] } {
  const r = rekomendasi(el);
  return { jenis: r.label, rek: r.ids };
}

function tambahObjek(target: Element, dariMouse: boolean) {
  const { rantai, bawaan } = rantaiDari(target, host);
  const el = rantai[bawaan]!;
  // Panel yang dikecilkan tetap kecil (di HP agar objek lain bisa ditekan); jumlah objek tampil di kepalanya.
  void bukaPanel("tulis", { tetapKecil: true });
  if (k.butir.some((b) => b.el === el)) {
    kilat(el);
    return;
  }
  if (k.butir.length >= MAKS_OBJEK) {
    setPesan(`Maksimal ${MAKS_OBJEK} objek per catatan. Hapus salah satu dulu.`, true);
    return;
  }
  k.butir.push({ objek: gambarkan(el, host), el, rantai, pilih: bawaan, ...rekomendasiButir(el), animasi: null });
  if (!k.halaman) k.halaman = halamanIni();
  setPesan("", false, false);
  simpanKeadaan();
  gambarPanel();
  if (dariMouse) (akar.querySelector("textarea") as HTMLTextAreaElement | null)?.focus();
}

function pilihWadah(i: number, tingkat: number) {
  const b = k.butir[i];
  const el = b?.rantai[tingkat];
  if (!b || !el) return;
  b.pilih = tingkat;
  b.el = el;
  b.objek = gambarkan(el, host);
  Object.assign(b, rekomendasiButir(el));
  simpanKeadaan();
  gambarPanel();
}

function hapusObjek(i: number) {
  if (k.butir[i]?.animasi || /^@\d animasi: /m.test(k.isi)) k.isi = hapusBaris(k.isi, i + 1);
  k.butir.splice(i, 1);
  if (k.motionBuka === i) k.motionBuka = -1; else if (k.motionBuka > i) k.motionBuka--;
  if (!k.butir.length && !k.isi.trim()) k.halaman = null;
  simpanKeadaan();
  gambarPanel();
}

function kilat(el: Element) {
  const r = el.getBoundingClientRect();
  const d = document.createElement("div");
  d.className = "kilat";
  d.style.cssText = `left:${r.left - 3}px;top:${r.top - 3}px;width:${r.width + 6}px;height:${r.height + 6}px`;
  elKilat.append(d);
  setTimeout(() => d.remove(), 1700);
}

function sorotPemilih(o: Objek, h: Halaman) {
  const sini = halamanSama(h);
  let el: Element | null = null;
  try { el = document.querySelector(o.pemilih); } catch { el = null; }
  if (!el) {
    setPesan(sini ? "Objek tidak ditemukan lagi di layar ini." : `Objek ada di halaman lain: ${[h.menu || h.judul, h.tab].filter(Boolean).join(" › ") || h.alamat}`, true);
    return;
  }
  if (!sini) {
    setPesan(`Buka dulu halamannya: ${[h.menu || h.judul, h.tab].filter(Boolean).join(" › ") || h.alamat}`, true);
    return;
  }
  el.scrollIntoView({ block: "center", behavior: "smooth" });
  setTimeout(() => kilat(el!), 350);
}

// ---- Lapisan sorot ---------------------------------------------------------------------------------------------------------------

let rafSorot = 0;
let targetSorot: Element | null = null;
function sorot(target: Element | null) {
  targetSorot = target;
  if (rafSorot) return;
  rafSorot = requestAnimationFrame(() => {
    rafSorot = 0;
    const t = targetSorot;
    if (!t || !k.aktif) { elSorot.hidden = true; elSorotLabel.hidden = true; return; }
    const { rantai, bawaan } = rantaiDari(t, host);
    const el = rantai[bawaan]!;
    const r = el.getBoundingClientRect();
    elSorot.hidden = false;
    elSorot.style.cssText = `left:${r.left - 2}px;top:${r.top - 2}px;width:${r.width + 4}px;height:${r.height + 4}px`;
    const o = gambarkan(el, host);
    elSorotLabel.textContent = namaObjek(o);
    elSorotLabel.hidden = false;
    const atas = r.top > 26 ? r.top - 24 : r.bottom + 4;
    elSorotLabel.style.cssText = `left:${Math.max(4, Math.min(r.left, window.innerWidth - 200))}px;top:${atas}px`;
  });
}

function gambarTanda() {
  elTanda.innerHTML = "";
  if (!k.aktif && !k.buka) return;
  k.butir.forEach((b, i) => {
    if (!b.el || !b.el.isConnected) return;
    const r = b.el.getBoundingClientRect();
    if (!r.width && !r.height) return;
    const d = document.createElement("div");
    d.className = "tanda";
    d.style.cssText = `left:${r.left - 3}px;top:${r.top - 3}px;width:${r.width + 6}px;height:${r.height + 6}px`;
    d.innerHTML = `<b>${i + 1}</b>`;
    elTanda.append(d);
  });
}
let rafTanda = 0;
const jadwalTanda = () => { if (!rafTanda) rafTanda = requestAnimationFrame(() => { rafTanda = 0; gambarTanda(); }); };

// ---- Mode dan tombol apung -------------------------------------------------------------------------------------------------------

function setAktif(nyala: boolean) {
  k.aktif = nyala;
  document.documentElement.classList.toggle("cu-aktif", nyala);
  elBingkai.hidden = !nyala;
  elPita.hidden = !nyala;
  if (!nyala) { elSorot.hidden = true; elSorotLabel.hidden = true; }
  perbaruiApung();
  jadwalTanda();
  simpanKeadaan();
}

function perbaruiApung() {
  elApung.setAttribute("aria-pressed", String(k.aktif));
  const n = k.daftar.filter((c) => (k.penulis?.jenis === "staf" ? ANTREAN.includes(c.status) : c.status === "baru")).length;
  const angka = elApung.querySelector(".angka") as HTMLElement;
  angka.hidden = !n;
  angka.textContent = String(n);
  elApung.setAttribute("aria-label", `Catatan uji${k.aktif ? ", mode catatan aktif" : ""}${n ? `, ${n} belum selesai` : ""}`);
}

/** Tombol apung di atas bilah menu bawah (aplikasi staf di iPad/HP, aplikasi pasien). */
function posisiApung() {
  // Layar terkunci aplikasi staf: Catatan uji ikut disembunyikan (daftar dan gambar layar tidak tampil di atas layar kunci).
  const terkunci = !!document.querySelector(".s-kunci");
  host.style.display = terkunci ? "none" : "";
  if (terkunci) return;
  let bawah = 16;
  for (const el of document.querySelectorAll("nav, footer, [class*='bawah'], [class*='bottom']")) {
    if (host.contains(el)) continue;
    const s = getComputedStyle(el);
    if (s.position !== "fixed" && s.position !== "sticky") continue;
    const r = el.getBoundingClientRect();
    if (r.height > 0 && r.height < 180 && r.bottom >= window.innerHeight - 24 && r.width > window.innerWidth * 0.5) {
      bawah = Math.max(bawah, window.innerHeight - r.top + 10);
    }
  }
  elApung.style.setProperty("--bawah", `calc(${Math.round(bawah)}px + env(safe-area-inset-bottom, 0px))`);
}

async function bukaPanel(tab?: "tulis" | "daftar", opsi: { tetapKecil?: boolean } = {}) {
  if (tab) k.tab = tab;
  const baru = !k.buka;
  k.buka = true;
  if (!opsi.tetapKecil || baru) k.kecil = false;
  elPanel.hidden = false;
  simpanKeadaan();
  gambarPanel();
  if (baru && (!k.sudahCek || !k.penulis)) {
    await cekPenulis();
    gambarPanel();
    if (k.penulis) void muatDaftar();
  }
}

function tutupPanel() {
  k.buka = false;
  elPanel.hidden = true;
  jadwalTanda();
  simpanKeadaan();
}

// ---- Panel -----------------------------------------------------------------------------------------------------------------------

function setPesan(p: string, galat = false, gambar = true) {
  k.pesan = p;
  k.galat = galat;
  if (gambar) gambarPanel();
}

function htmlTulis(): string {
  if (!k.penulis) {
    return `<p class="petunjuk">Masuk dulu (staf atau akun pasien uji), bisa di tab lain, untuk menulis catatan uji.</p>
      <div class="aksi"><button type="button" class="kedua" data-aksi="cek">Periksa lagi</button></div>`;
  }
  const objek = k.butir.length
    ? k.butir.map((b, i) => {
      const tingkat = b.rantai.length > 1
        ? `<div class="wadah"><span>Pilih:</span>${(() => {
          // Tingkat dengan nama sama (wadah tanpa nama sendiri) hanya ditampilkan sekali, kecuali yang sedang dipilih.
          const sudah = new Set<string>();
          return b.rantai.slice(0, 8).map((el, t) => {
            const nama = namaObjek(gambarkan(el, host));
            if (t !== b.pilih && sudah.has(nama)) return "";
            sudah.add(nama);
            return `<button type="button" data-aksi="wadah" data-i="${i}" data-t="${t}" aria-pressed="${t === b.pilih}" title="${esc(nama)}">${esc(nama)}</button>`;
          }).join("");
        })()}</div>`
        : "";
      const hilang = b.el && b.el.isConnected ? "" : `<div class="jejak">Objek dari layar sebelumnya</div>`;
      return `<div class="objek"><div class="baris"><span class="nomor">${i + 1}</span><span class="nama">${esc(namaObjek(b.objek))}</span>
        <span class="kecil-aksi">${b.el && b.el.isConnected ? `<button type="button" class="ikon" data-aksi="sorot-butir" data-i="${i}">Sorot</button>` : ""}
        <button type="button" class="ikon" data-aksi="hapus-objek" data-i="${i}" aria-label="Hapus objek ${i + 1}">×</button></span></div>
        ${b.objek.jejak.length ? `<div class="jejak">${esc(b.objek.jejak.join(" › "))}</div>` : ""}${hilang}${tingkat}${htmlMotion(b, i)}</div>`;
    }).join("")
    : `<p class="petunjuk">${k.aktif ? "Klik kanan objek di layar (tekan lama di iPad/HP) untuk menyebutnya." : "Nyalakan Mode catatan, lalu klik kanan objek di layar (tekan lama di iPad/HP)."}
       Tanpa objek, catatan berlaku untuk halaman ini.</p>`;
  const h = k.halaman ?? halamanIni();
  const halaman = [h.menu || h.judul, h.tab].filter(Boolean).join(" › ");
  return `${objek}
    ${k.butir.length && k.butir.length < MAKS_OBJEK ? `<p class="info">Klik kanan objek lain untuk menambah (maks. ${MAKS_OBJEK}).</p>` : ""}
    <label class="judul" for="cu-isi">Perbaikan</label>
    <textarea id="cu-isi" maxlength="2000" placeholder="Tulis perbaikannya. Sebut objek dengan @1, @2." data-isian="isi">${esc(k.isi)}</textarea>
    <div class="sebut">${k.butir.map((_, i) => `<button type="button" data-aksi="sebut" data-i="${i}" aria-label="Sisipkan @${i + 1}">@${i + 1}</button>`).join("")}
      <span class="hitung" aria-live="off">${k.isi.length}/2000</span></div>
    <span class="judul" id="cu-kat">Kategori</span>
    <div class="pilih" role="group" aria-labelledby="cu-kat">${KATEGORI.map(([v, l]) => `<button type="button" data-aksi="kategori" data-v="${v}" aria-pressed="${k.kategori === v}">${l}</button>`).join("")}</div>
    <span class="judul" id="cu-pri">Prioritas</span>
    <div class="pilih" role="group" aria-labelledby="cu-pri">${PRIORITAS.map(([v, l]) => `<button type="button" data-aksi="prioritas" data-v="${v}" aria-pressed="${k.prioritas === v}">${l}</button>`).join("")}</div>
    <label class="centang"><input type="checkbox" data-isian="gambar" ${k.gambar ? "checked" : ""}> Sertakan gambar layar</label>
    <p class="info">Halaman: ${esc(halaman || h.alamat)} · ${window.innerWidth}×${window.innerHeight}</p>
    <div class="aksi"><button type="button" class="utama" data-aksi="simpan" ${k.sedang ? "disabled" : ""}>${k.sedang ? "Menyimpan…" : "Simpan"}</button>
      <button type="button" class="kedua" data-aksi="kosongkan" ${k.sedang ? "disabled" : ""}>Kosongkan</button></div>
    <p class="pesan ${k.galat ? "galat" : ""}" role="status">${esc(k.pesan)}</p>`;
}

// ---- Fitur Motion: bagian "Animasi" per objek ------------------------------------------------------------------------------------

function kartuAnimasi(d: Animasi, i: number, b: Butir): string {
  const dipilih = b.animasi === d.id;
  const bisaCoba = !!(b.el && b.el.isConnected);
  return `<li class="mo-kartu${dipilih ? " dipilih" : ""}"><span class="mo-nama"><b>${esc(d.n)}</b><code>${esc(d.id)}</code>
      <small>${esc(keluarga(d.g))} · ${esc(d.d)}</small></span>
    <span class="mo-tombol"><button type="button" class="ikon" data-aksi="motion-coba" data-i="${i}" data-id="${esc(d.id)}" ${bisaCoba ? "" : "disabled"}
      aria-label="Coba ${esc(d.n)} pada objek ${i + 1}">▶ Coba</button>
    <button type="button" class="ikon${dipilih ? " aktif" : ""}" data-aksi="motion-pilih" data-i="${i}" data-id="${esc(d.id)}" aria-pressed="${dipilih}">${dipilih ? "Dipilih" : "Pilih"}</button></span></li>`;
}

function htmlMotion(b: Butir, i: number): string {
  if (!motionAda() || (!b.rek.length && !b.animasi)) return "";
  const pilihan = animasi(b.animasi);
  const buka = k.motionBuka === i;
  const ringkas = `<div class="mo-ringkas"><button type="button" class="mo-buka" data-aksi="motion-buka" data-i="${i}" aria-expanded="${buka}">
      Animasi${b.jenis ? ` untuk ${esc(b.jenis.toLowerCase())}` : ""} (${b.rek.length}) ${buka ? "▾" : "▸"}</button>
    ${pilihan ? `<span class="mo-terpilih">✓ ${esc(pilihan.n)} <button type="button" class="ikon" data-aksi="motion-lepas" data-i="${i}" aria-label="Batalkan animasi objek ${i + 1}">×</button></span>` : ""}</div>`;
  if (!buka) return ringkas;
  const rek = b.rek.map((id) => animasi(id)).filter((d): d is Animasi => !!d);
  const hasil = cariAnimasi(k.motionCari);
  return `${ringkas}<div class="mo-isi">
    <ul class="mo-daftar">${rek.map((d) => kartuAnimasi(d, i, b)).join("")}</ul>
    <label class="judul" for="cu-mo-cari">Cari animasi lain</label>
    <input id="cu-mo-cari" class="ket" type="search" maxlength="40" placeholder="mis. blur, stagger, sheet" value="${esc(k.motionCari)}" data-isian="motion-cari" data-i="${i}">
    <ul class="mo-daftar mo-hasil">${hasil.map((d) => kartuAnimasi(d, i, b)).join("")}</ul>
    <p class="info">▶ Coba memutar perkiraan gerak pada objek ${i + 1} di layar; versi persisnya di
      <a href="${esc(galeri())}${pilihan ? `#c-${esc(pilihan.id)}` : ""}" target="_blank" rel="noopener">galeri Luz Motion ↗</a>.</p></div>`;
}

function pilihAnimasi(i: number, id: string) {
  const b = k.butir[i];
  if (!b || !animasi(id)) return;
  const kosong = !k.isi.trim();
  b.animasi = id;
  k.isi = pasangBaris(k.isi, i + 1, id).slice(0, 2000);
  // Catatan yang isinya hanya permintaan animasi langsung berkategori Animasi; penguji tetap bisa menggantinya.
  if (kosong) k.kategori = "animasi";
  if (!k.halaman) k.halaman = halamanIni();
  simpanKeadaan();
  gambarPanel();
}

function lepasAnimasi(i: number) {
  const b = k.butir[i];
  if (!b) return;
  b.animasi = null;
  k.isi = k.isi.replace(new RegExp(`^@${i + 1} animasi: .*(\\n|$)`, "m"), "").replace(/\n+$/, "");
  simpanKeadaan();
  gambarPanel();
}

function tersaring(): Catatan[] {
  const s = k.saring;
  const kini = kunciHalaman(halamanIni());
  return k.daftar.filter((c) =>
    (s.status === "semua" || (s.status === "antrean" ? ANTREAN.includes(c.status) : c.status === s.status))
    && (!s.aplikasi || c.aplikasi === s.aplikasi) && (!s.kategori || c.kategori === s.kategori)
    && (!s.halamanIni || kunciHalaman(c.halaman) === kini));
}

function htmlDaftar(): string {
  if (!k.penulis) return htmlTulis();
  const s = k.saring;
  const opsi = (pilihan: Array<[string, string]>, nilai: string) => pilihan.map(([v, l]) => `<option value="${v}" ${v === nilai ? "selected" : ""}>${esc(l)}</option>`).join("");
  const daftar = tersaring();
  return `<div class="saring">
      <label>Status<select data-isian="s-status">${opsi([["antrean", "Belum selesai"], ["selesai", "Perlu dicek"], ["semua", "Semua"], ...STATUS], s.status)}</select></label>
      <label>Kategori<select data-isian="s-kategori">${opsi([["", "Semua"], ...KATEGORI], s.kategori)}</select></label>
      <label>Aplikasi<select data-isian="s-aplikasi">${opsi([["", "Semua"], ...Object.entries(APLIKASI)], s.aplikasi)}</select></label>
      <label class="centang"><input type="checkbox" data-isian="s-halaman" ${s.halamanIni ? "checked" : ""}> Halaman ini saja</label>
    </div>
    <div class="aksi"><button type="button" class="kedua" data-aksi="salin" ${daftar.length ? "" : "disabled"}>Salin catatan (${daftar.length})</button>
      <button type="button" class="kedua" data-aksi="muat">Muat ulang</button></div>
    <p class="pesan ${k.galat ? "galat" : ""}" role="status">${esc(k.pesan)}</p>
    ${daftar.length ? `<ul class="daftar">${daftar.map((c) => `<li><button type="button" data-aksi="buka" data-id="${c.id}">
        <span class="atas">#${c.nomor} · ${esc(label(KATEGORI, c.kategori))} · ${esc(label(PRIORITAS, c.prioritas))} <span class="status st-${c.status}">${esc(label(STATUS, c.status))}</span></span>
        <span class="ringkas">${esc(c.isi)}</span>
        <span class="bawah">${esc([c.halaman.menu || c.halaman.judul, c.halaman.tab].filter(Boolean).join(" › ") || c.halaman.alamat)} · ${esc(c.penulis.nama)} · ${waktu(c.dibuatPada)}</span>
      </button></li>`).join("")}</ul>` : `<p class="kosong">${k.memuat ? "Memuat…" : "Tidak ada catatan untuk saringan ini."}</p>`}`;
}

function sorotIsi(isi: string): string {
  return esc(isi).replace(/@([1-5])(?!\d)/g, "<mark>@$1</mark>");
}

function htmlDetail(): string {
  const c = k.daftar.find((x) => x.id === k.detail);
  if (!c) return `<p class="kosong">Catatan tidak ditemukan.</p><div class="aksi"><button type="button" class="kedua" data-aksi="kembali">Kembali</button></div>`;
  const staf = k.penulis?.jenis === "staf";
  const h = c.halaman;
  const objek = c.objek.length
    ? `<ol class="riwayat">${c.objek.map((o, i) => `<li><b>@${i + 1}</b> ${esc(namaObjek(o))}${o.jejak.length ? ` · ${esc(o.jejak.join(" › "))}` : ""}
        <br><code>${esc(o.pemilih)}</code> <button type="button" class="ikon" data-aksi="sorot-catatan" data-i="${i}">Sorot</button></li>`).join("")}</ol>`
    : "<p class=\"info\">Tanpa objek (catatan untuk halaman).</p>";
  const p = c.perangkat;
  return `<div class="detail">
    <div class="aksi" style="margin-top:0"><button type="button" class="kedua" data-aksi="kembali">‹ Daftar</button></div>
    <h3>#${c.nomor} · ${esc(label(KATEGORI, c.kategori))} · Prioritas ${esc(label(PRIORITAS, c.prioritas).toLowerCase())} <span class="status st-${c.status}">${esc(label(STATUS, c.status))}</span></h3>
    <div class="teks">${sorotIsi(c.isi)}</div>
    <span class="judul">Objek</span>${objek}
    <dl>
      <dt>Halaman</dt><dd>${esc([h.menu || h.judul, h.tab].filter(Boolean).join(" › "))} <code>${esc(h.alamat)}</code> · ${esc(APLIKASI[c.aplikasi] ?? c.aplikasi)}</dd>
      <dt>Perangkat</dt><dd>${p.lebar}×${p.tinggi}, rasio ${p.rasio}, ${p.sentuh ? "layar sentuh" : "mouse"}, ${esc(p.peramban)}${p.tema ? `, tema ${esc(p.tema)}` : ""}</dd>
      <dt>Penulis</dt><dd>${esc(c.penulis.nama)}${c.penulis.peran ? ` (${esc(c.penulis.peran)})` : ""} · ${waktu(c.dibuatPada)}</dd>
    </dl>
    ${c.adaGambar ? `<a href="${api()}/${c.id}/gambar" target="_blank" rel="noopener"><img src="${api()}/${c.id}/gambar" alt="Gambar layar catatan #${c.nomor}" loading="lazy"></a>` : `<p class="info">Tanpa gambar layar.</p>`}
    ${c.riwayat.length ? `<span class="judul">Riwayat</span><ul class="riwayat">${c.riwayat.map((r) => `<li>${waktu(r.pada)} · ${esc(label(STATUS, r.status))} · ${esc(r.oleh)}${r.keterangan ? ` · ${esc(r.keterangan)}` : ""}</li>`).join("")}</ul>` : ""}
    ${staf ? `<label class="judul" for="cu-ket">Ubah status</label><input class="ket" id="cu-ket" maxlength="300" placeholder="Keterangan (opsional), mis. commit">
      <div class="pilih" style="margin-top:6px">${STATUS.filter(([v]) => v !== c.status).map(([v, l]) => `<button type="button" data-aksi="status" data-v="${v}">${esc(l)}</button>`).join("")}</div>` : ""}
    ${c.milikSaya && c.status === "baru" ? `<div class="aksi"><button type="button" class="kedua bahaya" data-aksi="hapus">Hapus catatan</button></div>` : ""}
    <p class="pesan ${k.galat ? "galat" : ""}" role="status">${esc(k.pesan)}</p>
  </div>`;
}

function gambarPanel() {
  if (!k.buka) { elPanel.hidden = true; return; }
  // Pertahankan fokus dan kursor di kotak teks saat panel digambar ulang.
  const fokus = akar.activeElement as HTMLElement | null;
  const idFokus = fokus?.id;
  const kursor = fokus instanceof HTMLTextAreaElement ? [fokus.selectionStart, fokus.selectionEnd] : null;
  const gulir = (elPanel.querySelector(".isi") as HTMLElement | null)?.scrollTop ?? 0;
  const lebar = window.innerWidth >= 720;
  elPanel.className = `panel ${k.sisi}${k.kecil ? " kecil" : ""}`;
  const nBelum = k.daftar.filter((c) => ANTREAN.includes(c.status)).length;
  const isi = k.tab === "tulis" ? htmlTulis() : k.tab === "daftar" ? htmlDaftar() : htmlDetail();
  const jumlah = k.kecil && k.butir.length ? ` <span class="jumlah">· ${k.butir.length} objek</span>` : "";
  elPanel.innerHTML = `<div class="kepala"><h2>Catatan uji${jumlah}</h2>
      ${lebar ? `<button type="button" class="ikon" data-aksi="sisi" aria-label="Pindahkan panel ke ${k.sisi === "kanan" ? "kiri" : "kanan"}">${k.sisi === "kanan" ? "⇤ Kiri" : "Kanan ⇥"}</button>` : ""}
      <button type="button" class="ikon" data-aksi="kecil" aria-expanded="${!k.kecil}">${k.kecil ? "Besarkan" : "Kecilkan"}</button>
      <button type="button" class="ikon" data-aksi="tutup" aria-label="Tutup panel">×</button></div>
    <div class="tab" role="tablist" aria-label="Catatan uji">
      <button type="button" role="tab" data-aksi="tab-tulis" aria-selected="${k.tab === "tulis"}">Tulis</button>
      <button type="button" role="tab" data-aksi="tab-daftar" aria-selected="${k.tab !== "tulis"}">Daftar${nBelum ? ` (${nBelum})` : ""}</button></div>
    <div class="isi" role="tabpanel">${isi}</div>`;
  const panelIsi = elPanel.querySelector(".isi") as HTMLElement;
  panelIsi.scrollTop = gulir;
  if (idFokus) {
    const x = akar.getElementById(idFokus) as HTMLElement | null;
    x?.focus();
    if (x instanceof HTMLTextAreaElement && kursor) x.setSelectionRange(kursor[0] ?? null, kursor[1] ?? null);
  }
  jadwalTanda();
}

// ---- Simpan, salin, status -------------------------------------------------------------------------------------------------------

async function simpan() {
  if (!k.penulis) return;
  const isi = k.isi.trim();
  if (!isi) { setPesan("Tulis perbaikannya dulu.", true); return; }
  k.sedang = true;
  elSorot.hidden = true;
  elSorotLabel.hidden = true;
  const ukur = k.butir.map((b) => (b.el && b.el.isConnected ? kotakDari(b.el) : null));
  setPesan(k.gambar ? "Mengambil gambar layar…" : "Menyimpan…");
  let gambar: Blob | null = null;
  if (k.gambar) {
    // Tanda dan bingkai mode tidak ikut: gambar diambil dari halaman, bukan dari lapisan Catatan uji. Dialog modal yang terbuka
    // digambar terpisah lalu ditempel di letaknya (lihat gambar.ts).
    gambar = await ambilGambar(host, ukur, dialogModalAtas());
  }
  const objek = k.butir.map((b, i) => (ukur[i] ? { ...b.objek, kotak: ukur[i]! } : b.objek));
  // Halaman = layar saat disimpan (sama dengan gambar layarnya) bila semua objek masih di layar; bila ada objek dari layar
  // sebelumnya, halaman tempat objek pertama ditunjuk.
  const semuaDiLayar = k.butir.every((b) => b.el && b.el.isConnected);
  const kiriman = {
    aplikasi: aplikasiIni(), halaman: semuaDiLayar || !k.halaman ? halamanIni() : k.halaman, perangkat: perangkatIni(),
    kategori: k.kategori, prioritas: k.prioritas, isi, objek,
  };
  try {
    const r = await fetch(api(), { method: "POST", credentials: "same-origin", headers: { "content-type": "application/json" }, body: JSON.stringify(kiriman) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) {
      k.sedang = false;
      if (r.status === 401) { k.penulis = null; setPesan("Sesi berakhir. Masuk lagi, tulisan tidak hilang.", true); return; }
      setPesan(j.pesan ?? `Gagal menyimpan (${r.status}). Tulisan tidak hilang.`, true);
      return;
    }
    let catatanGambar = "";
    if (gambar) {
      const g = await fetch(`${api()}/${j.id}/gambar`, { method: "PUT", credentials: "same-origin", headers: { "content-type": "image/jpeg" }, body: gambar }).catch(() => null);
      if (!g || !g.ok) catatanGambar = " (gambar layar gagal dikirim)";
    } else if (k.gambar) catatanGambar = " (gambar layar gagal dibuat)";
    k.butir = [];
    k.isi = "";
    k.halaman = null;
    k.motionBuka = -1;
    k.sedang = false;
    simpanKeadaan();
    setPesan(`Tersimpan sebagai #${j.nomor}${catatanGambar}.`);
    void muatDaftar();
  } catch {
    k.sedang = false;
    setPesan("Koneksi putus. Tulisan tidak hilang; tekan Simpan lagi.", true);
  }
}

export function markdown(daftar: Catatan[]): string {
  return daftar.map((c) => {
    const h = c.halaman;
    const p = c.perangkat;
    const baris = [
      `## #${c.nomor} · ${label(KATEGORI, c.kategori)} · Prioritas ${label(PRIORITAS, c.prioritas).toLowerCase()} · ${label(STATUS, c.status)}`,
      `- Halaman: ${[h.menu || h.judul, h.tab].filter(Boolean).join(" › ")} (\`${h.alamat}\`, ${APLIKASI[c.aplikasi] ?? c.aplikasi})`,
      `- Perangkat: ${p.lebar}×${p.tinggi}, rasio ${p.rasio}, ${p.sentuh ? "layar sentuh" : "mouse"}, ${p.peramban}${p.tema ? `, tema ${p.tema}` : ""}`,
      `- Penulis: ${c.penulis.nama}${c.penulis.peran ? ` (${c.penulis.peran})` : ""} · ${waktu(c.dibuatPada)}`,
      `- Gambar layar: ${c.adaGambar ? `ada (${api()}/${c.id}/gambar)` : "tidak ada"}`,
      `- ID: ${c.id}`,
    ];
    if (c.objek.length) {
      baris.push("- Objek:");
      c.objek.forEach((o, i) => baris.push(`  ${i + 1}. ${namaObjek(o)}${o.jejak.length ? ` (${o.jejak.join(" › ")})` : ""} \`${o.pemilih}\` di x${o.kotak.x} y${o.kotak.y} ${o.kotak.w}×${o.kotak.h}`));
    }
    baris.push("", ...c.isi.split("\n").map((x) => `> ${x}`));
    for (const r of c.riwayat) baris.push(`- ${waktu(r.pada)} ${label(STATUS, r.status)} oleh ${r.oleh}${r.keterangan ? `: ${r.keterangan}` : ""}`);
    return baris.join("\n");
  }).join("\n\n");
}

async function salinTeks(t: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(t);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = t;
    ta.style.cssText = "position:fixed;left:-9999px;top:0";
    akar.append(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}

async function ubahStatus(status: string) {
  const c = k.daftar.find((x) => x.id === k.detail);
  if (!c) return;
  const ket = (akar.getElementById("cu-ket") as HTMLInputElement | null)?.value ?? "";
  try {
    const r = await fetch(`${api()}/${c.id}/status`, {
      method: "PATCH", credentials: "same-origin", headers: { "content-type": "application/json" }, body: JSON.stringify({ status, keterangan: ket }),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) { setPesan(j.pesan ?? `Gagal (${r.status})`, true); return; }
    setPesan(`Status #${c.nomor}: ${label(STATUS, status)}.`, false, false);
    await muatDaftar();
  } catch {
    setPesan("Koneksi putus. Coba lagi.", true);
  }
}

async function hapusCatatan() {
  const c = k.daftar.find((x) => x.id === k.detail);
  if (!c || !window.confirm(`Hapus catatan #${c.nomor}?`)) return;
  const r = await fetch(`${api()}/${c.id}`, { method: "DELETE", credentials: "same-origin" }).catch(() => null);
  if (!r || !r.ok) { setPesan("Gagal menghapus.", true); return; }
  k.tab = "daftar";
  k.detail = null;
  setPesan(`Catatan #${c.nomor} dihapus.`, false, false);
  await muatDaftar();
  gambarPanel();
}

// ---- Peristiwa panel -------------------------------------------------------------------------------------------------------------

akar.addEventListener("click", (e) => {
  const t = (e.target as Element).closest<HTMLElement>("[data-aksi]");
  if (!t) return;
  const i = Number(t.dataset.i);
  switch (t.dataset.aksi) {
    case "apung":
      if (k.aktif) { setAktif(false); tutupPanel(); } else { setAktif(true); void bukaPanel("tulis"); }
      break;
    case "panel": void bukaPanel(); break;
    case "matikan": setAktif(false); break;
    case "tutup": tutupPanel(); break;
    case "kecil": k.kecil = !k.kecil; simpanKeadaan(); gambarPanel(); break;
    case "sisi": k.sisi = k.sisi === "kanan" ? "kiri" : "kanan"; simpanKeadaan(); gambarPanel(); break;
    case "tab-tulis": k.tab = "tulis"; setPesan("", false); break;
    case "tab-daftar": k.tab = "daftar"; k.detail = null; setPesan("", false); void muatDaftar(); break;
    case "cek": k.sudahCek = false; void cekPenulis().then(() => { gambarPanel(); void muatDaftar(); }); break;
    case "wadah": pilihWadah(i, Number(t.dataset.t)); break;
    case "hapus-objek": hapusObjek(i); break;
    case "sorot-butir": { const el = k.butir[i]?.el; if (el) { el.scrollIntoView({ block: "center" }); kilat(el); } break; }
    case "sebut": {
      const ta = akar.getElementById("cu-isi") as HTMLTextAreaElement | null;
      if (!ta) break;
      const sisip = `@${i + 1} `;
      const a = ta.selectionStart ?? ta.value.length;
      const b = ta.selectionEnd ?? a;
      k.isi = (ta.value.slice(0, a) + sisip + ta.value.slice(b)).slice(0, 2000);
      ta.value = k.isi;
      ta.focus();
      ta.setSelectionRange(a + sisip.length, a + sisip.length);
      simpanKeadaan();
      (akar.querySelector(".hitung") as HTMLElement).textContent = `${k.isi.length}/2000`;
      break;
    }
    case "kategori": k.kategori = t.dataset.v!; simpanKeadaan(); gambarPanel(); break;
    case "prioritas": k.prioritas = t.dataset.v!; simpanKeadaan(); gambarPanel(); break;
    case "simpan": void simpan(); break;
    case "kosongkan": k.butir = []; k.isi = ""; k.halaman = null; k.motionBuka = -1; simpanKeadaan(); setPesan(""); break;
    case "muat": void muatDaftar(); break;
    case "salin": {
      const daftar = tersaring();
      void salinTeks(markdown(daftar)).then((ok) => setPesan(ok ? `Tersalin ${daftar.length} catatan. Tempel ke chat Claude.` : "Gagal menyalin.", !ok));
      break;
    }
    case "buka": k.tab = "detail"; k.detail = t.dataset.id ?? null; setPesan(""); break;
    case "kembali": k.tab = "daftar"; k.detail = null; setPesan(""); break;
    case "sorot-catatan": {
      const c = k.daftar.find((x) => x.id === k.detail);
      const o = c?.objek[i];
      if (c && o) sorotPemilih(o, c.halaman);
      break;
    }
    case "motion-buka": k.motionBuka = k.motionBuka === i ? -1 : i; k.motionCari = ""; gambarPanel(); break;
    case "motion-coba": {
      const el = k.butir[i]?.el;
      if (el && el.isConnected && t.dataset.id) { el.scrollIntoView({ block: "nearest" }); pratinjau(el, t.dataset.id); }
      break;
    }
    case "motion-pilih": pilihAnimasi(i, t.dataset.id ?? ""); break;
    case "motion-lepas": lepasAnimasi(i); break;
    case "status": void ubahStatus(t.dataset.v!); break;
    case "hapus": void hapusCatatan(); break;
  }
});

akar.addEventListener("input", (e) => {
  const t = e.target as HTMLElement;
  if (t.dataset.isian === "isi") {
    k.isi = (t as HTMLTextAreaElement).value.slice(0, 2000);
    (akar.querySelector(".hitung") as HTMLElement).textContent = `${k.isi.length}/2000`;
    if (!k.halaman) k.halaman = halamanIni();
    simpanKeadaan();
  } else if (t.dataset.isian === "motion-cari") {
    // Hasil pencarian diganti di tempat agar kotak cari tidak kehilangan fokus.
    k.motionCari = (t as HTMLInputElement).value;
    const i = Number(t.dataset.i);
    const b = k.butir[i];
    const wadah = akar.querySelector(".mo-hasil");
    if (b && wadah) wadah.innerHTML = cariAnimasi(k.motionCari).map((d) => kartuAnimasi(d, i, b)).join("");
  }
});
akar.addEventListener("change", (e) => {
  const t = e.target as HTMLInputElement | HTMLSelectElement;
  switch (t.dataset.isian) {
    case "gambar": k.gambar = (t as HTMLInputElement).checked; break;
    case "s-status": k.saring.status = t.value; break;
    case "s-kategori": k.saring.kategori = t.value; break;
    case "s-aplikasi": k.saring.aplikasi = t.value; break;
    case "s-halaman": k.saring.halamanIni = (t as HTMLInputElement).checked; break;
    default: return;
  }
  simpanKeadaan();
  if (t.dataset.isian !== "gambar") { setPesan("", false); }
});

// ---- Peristiwa halaman (hanya bertindak saat Mode catatan menyala) --------------------------------------------------------------

let abaikanKonteksSampai = 0;
let tahanKlikSampai = 0;
let tekan: { id: number; x: number; y: number; t: number; target: Element } | null = null;

window.addEventListener("contextmenu", (e) => {
  if (!k.aktif || diDalamKita(e)) return;
  e.preventDefault();
  e.stopImmediatePropagation();
  if (Date.now() < abaikanKonteksSampai) return;
  const t = e.target instanceof Element ? e.target : null;
  if (t) tambahObjek(t, (e as PointerEvent).pointerType !== "touch" && e.button === 2);
}, true);

window.addEventListener("pointermove", (e) => {
  if (!k.aktif) return;
  if (e.pointerType === "mouse") {
    sorot(diDalamKita(e) || !(e.target instanceof Element) ? null : e.target);
    return;
  }
  if (tekan && e.pointerId === tekan.id && Math.hypot(e.clientX - tekan.x, e.clientY - tekan.y) > 10) {
    clearTimeout(tekan.t);
    tekan = null;
  }
}, true);

window.addEventListener("pointerdown", (e) => {
  if (!k.aktif || e.pointerType === "mouse" || diDalamKita(e) || !(e.target instanceof Element)) return;
  if (tekan) clearTimeout(tekan.t);
  const target = e.target;
  tekan = {
    id: e.pointerId, x: e.clientX, y: e.clientY, target,
    t: window.setTimeout(() => {
      tekan = null;
      // Android juga mengirim contextmenu setelah tekan lama: diabaikan agar objek tidak masuk dua kali.
      abaikanKonteksSampai = Date.now() + 1500;
      tahanKlikSampai = Date.now() + 1500;
      navigator.vibrate?.(15);
      tambahObjek(target, false);
    }, 500),
  };
}, true);
const lepas = (e: PointerEvent) => { if (tekan && e.pointerId === tekan.id) { clearTimeout(tekan.t); tekan = null; } };
window.addEventListener("pointerup", lepas, true);
window.addEventListener("pointercancel", lepas, true);

// Setelah tekan lama, ketukan yang menyusul tidak boleh menjalankan tombol di bawahnya.
window.addEventListener("click", (e) => {
  if (Date.now() < tahanKlikSampai && !diDalamKita(e)) {
    e.preventDefault();
    e.stopImmediatePropagation();
    tahanKlikSampai = 0;
  }
}, true);
window.addEventListener("selectstart", (e) => {
  if (k.aktif && !diDalamKita(e) && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) e.preventDefault();
}, true);

window.addEventListener("keydown", (e) => {
  if (e.altKey && e.shiftKey && e.code === "KeyC") {
    e.preventDefault();
    if (k.aktif) setAktif(false); else { setAktif(true); void bukaPanel("tulis"); }
    return;
  }
  if (e.key === "Escape" && k.aktif) {
    setAktif(false);
    tutupPanel();
  }
}, true);

window.addEventListener("scroll", jadwalTanda, true);
// Papan ketik HP mengubah tinggi layar: panel hanya digambar ulang bila lebarnya berubah (agar kotak teks tidak kehilangan fokus).
let lebarTerakhir = window.innerWidth;
window.addEventListener("resize", () => {
  jadwalTanda();
  posisiApung();
  if (window.innerWidth !== lebarTerakhir) { lebarTerakhir = window.innerWidth; gambarPanel(); }
});
document.addEventListener("pointerleave", () => sorot(null));

// ---- Mulai -----------------------------------------------------------------------------------------------------------------------

async function mulai() {
  if (document.getElementById("cu-akar")) return;
  document.head.append(gayaHalaman);
  document.body.append(host);
  new MutationObserver(jadwalPindah).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["open"] });
  pindahkanHost();
  muatKeadaan();
  setAktif(k.aktif);
  posisiApung();
  setInterval(posisiApung, 1000);
  await cekPenulis();
  if (k.buka) { elPanel.hidden = false; gambarPanel(); } else elPanel.hidden = true;
  void muatDaftar();
}

void mulai();
