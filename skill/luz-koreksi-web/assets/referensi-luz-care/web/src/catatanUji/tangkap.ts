// Catatan uji: menggambarkan objek layar yang ditunjuk (jenis, label, jejak, pemilih CSS, letak) dan halaman/perangkat.
// ATURAN: isi kotak isian (value input/textarea/select) TIDAK PERNAH dibaca. Label kotak isian diambil dari <label>, aria-label,
// atau placeholder; teks di dalam wadah diambil dari salinan yang kotak isiannya dibuang dulu.

export interface Kotak { x: number; y: number; w: number; h: number }
export interface Objek { jenis: string; label: string; jejak: string[]; pemilih: string; kotak: Kotak }
export interface Halaman { alamat: string; judul: string; menu: string; tab: string }
export interface Perangkat { lebar: number; tinggi: number; rasio: number; sentuh: boolean; peramban: string; tema: string }

const KONTROL = "input, textarea, select, [contenteditable]";
const INTERAKTIF = "button, a[href], input, textarea, select, label, summary, [role=button], [role=tab], [role=link], [role=checkbox], [role=switch], [role=radio], [role=option], [role=menuitem], [contenteditable]";

const ringkas = (s: string | null | undefined, maks: number) => (s ?? "").replace(/\s+/g, " ").trim().slice(0, maks);

/** Teks yang terlihat dari sebuah elemen, tanpa isi kotak isian dan tanpa pilihan <select>. */
function teksTerlihat(el: Element, maks = 80): string {
  if (!(el instanceof HTMLElement)) return ringkas(el.textContent, maks);
  if (!el.querySelector(KONTROL)) return ringkas(el.innerText || el.textContent, maks);
  const c = el.cloneNode(true) as HTMLElement;
  c.querySelectorAll(KONTROL).forEach((x) => x.remove());
  return ringkas(c.textContent, maks);
}

function teksLabelledby(el: Element): string {
  const ids = el.getAttribute("aria-labelledby");
  if (!ids) return "";
  return ringkas(ids.split(/\s+/).map((id) => { const x = document.getElementById(id); return x ? teksTerlihat(x, 80) : ""; }).join(" "), 80);
}

function adaKelas(el: Element, pola: RegExp): boolean {
  return typeof el.className === "string" && pola.test(el.className);
}

export function jenisDari(el: Element): string {
  const tag = el.tagName.toLowerCase();
  const peran = el.getAttribute("role") ?? "";
  if (peran === "tab") return "Tab";
  if (peran === "tablist") return "Deretan tab";
  if (peran === "dialog" || tag === "dialog") return "Dialog";
  if (peran === "checkbox" || peran === "switch") return "Saklar";
  if (tag === "button" || peran === "button") return "Tombol";
  if (tag === "a") return "Tautan";
  if (tag === "input") {
    const t = (el as HTMLInputElement).type;
    if (t === "checkbox") return "Kotak centang";
    if (t === "radio") return "Pilihan";
    if (t === "range") return "Penggeser";
    if (t === "file") return "Unggah berkas";
    if (t === "button" || t === "submit") return "Tombol";
    return "Kotak isian";
  }
  if (tag === "textarea") return "Kotak teks";
  if (tag === "select") return "Pilihan daftar";
  if (tag === "img") return "Gambar";
  if (tag === "svg") return "Ikon";
  if (tag === "canvas") return "Grafik";
  if (/^h[1-6]$/.test(tag)) return "Judul";
  if (tag === "label") return "Label";
  if (tag === "nav") return "Menu";
  if (tag === "table") return "Tabel";
  if (tag === "tr") return "Baris tabel";
  if (tag === "td" || tag === "th") return "Sel tabel";
  if (tag === "li") return "Butir daftar";
  if (tag === "ul" || tag === "ol") return "Daftar";
  if (tag === "form") return "Form";
  if (tag === "header") return "Kepala";
  if (tag === "footer") return "Kaki";
  if (adaKelas(el, /kartu|card/i)) return "Kartu";
  if (adaKelas(el, /ubin|tile/i)) return "Ubin";
  if (adaKelas(el, /chip|lencana|badge/i)) return "Chip";
  if (adaKelas(el, /dialog|modal/i)) return "Dialog";
  if (adaKelas(el, /panel|rel\b/i)) return "Panel";
  if (adaKelas(el, /grafik|chart/i)) return "Grafik";
  if (adaKelas(el, /tombol|btn/i)) return "Tombol";
  if (tag === "section" || tag === "article" || tag === "aside" || tag === "fieldset") return "Bagian";
  if (tag === "p") return "Paragraf";
  if (["span", "strong", "em", "b", "small", "i", "time", "dd", "dt"].includes(tag)) return "Teks";
  return "Wadah";
}

/** Judul di dalam sebuah wadah (untuk menamai kartu, bagian, dialog). */
function judulDalam(el: Element): string {
  const j = el.querySelector("h1, h2, h3, h4, h5, legend, caption, [class*=judul], [class*=title]");
  return j ? teksTerlihat(j, 60) : "";
}

export function labelDari(el: Element): string {
  const aria = ringkas(el.getAttribute("aria-label"), 80) || teksLabelledby(el);
  if (aria) return aria;
  const tag = el.tagName.toLowerCase();
  if (el.matches("input, textarea, select")) {
    const id = el.id;
    const lbl = (id ? document.querySelector(`label[for="${CSS.escape(id)}"]`) : null) ?? el.closest("label");
    const t = lbl ? teksTerlihat(lbl, 80) : "";
    return t || ringkas(el.getAttribute("placeholder"), 80) || ringkas(el.getAttribute("title"), 80) || ringkas(el.getAttribute("name"), 40);
  }
  if (tag === "img") return ringkas(el.getAttribute("alt"), 80);
  if (tag === "svg") return ringkas(el.querySelector("title")?.textContent, 80);
  const j = jenisDari(el);
  if (["Tombol", "Tautan", "Tab", "Judul", "Label", "Butir daftar", "Sel tabel", "Teks", "Paragraf", "Chip", "Saklar", "Baris tabel"].includes(j)) {
    return teksTerlihat(el, 80) || ringkas(el.getAttribute("title"), 80);
  }
  return judulDalam(el) || ringkas(el.getAttribute("title"), 80);
}

const PENANDA = /(kartu|card|panel|dialog|modal|bagian|ubin|lembar|rel\b|tab-|tabel|grafik|kepala|menu)/i;
/** Wadah bernama di atas objek, dari luar ke dalam, maks. 5 (mis. ["CPPT", "Kartu status"]). */
export function jejakDari(el: Element, akar: Element | null): string[] {
  const hasil: string[] = [];
  for (let a = el.parentElement; a && a !== document.body && a !== akar; a = a.parentElement) {
    const tag = a.tagName.toLowerCase();
    const peran = a.getAttribute("role") ?? "";
    const penanda = ["section", "article", "aside", "nav", "dialog", "form", "fieldset", "header", "main", "table"].includes(tag)
      || ["dialog", "tablist", "region", "navigation", "tabpanel"].includes(peran) || adaKelas(a, PENANDA);
    if (!penanda) continue;
    const nama = ringkas(a.getAttribute("aria-label"), 60) || judulDalam(a) || jenisDari(a);
    if (nama && hasil[hasil.length - 1] !== nama) hasil.push(nama);
    if (hasil.length >= 5) break;
  }
  return hasil.reverse();
}

function bagianPemilih(el: Element): { s: string; berhenti: boolean } {
  const tag = el.tagName.toLowerCase();
  if (el.id && /^[a-z][\w-]{0,40}$/i.test(el.id) && !/\d{3,}/.test(el.id)) return { s: `${tag}#${el.id}`, berhenti: true };
  let s = tag;
  const menu = el.getAttribute("data-menu");
  if (menu) s += `[data-menu="${menu}"]`;
  const kelas = typeof el.className === "string" ? el.className.split(/\s+/).filter((k) => k && !k.startsWith("cu-")).slice(0, 2) : [];
  for (const k of kelas) s += `.${CSS.escape(k)}`;
  const induk = el.parentElement;
  if (induk) {
    const sama = [...induk.children].filter((x) => x.tagName === el.tagName && (kelas.length === 0 || kelas.every((k) => x.classList.contains(k))));
    if (sama.length > 1) s += `:nth-of-type(${[...induk.children].filter((x) => x.tagName === el.tagName).indexOf(el) + 1})`;
  }
  return { s, berhenti: false };
}

/** Pemilih CSS pendek (maks. 5 tingkat), untuk menemukan objek di kode dan menyorotnya lagi. */
export function pemilihDari(el: Element): string {
  const bagian: string[] = [];
  for (let a: Element | null = el; a && a !== document.body && a !== document.documentElement && bagian.length < 5; a = a.parentElement) {
    const b = bagianPemilih(a);
    bagian.unshift(b.s);
    if (b.berhenti) break;
  }
  return bagian.join(" > ");
}

export function kotakDari(el: Element): Kotak {
  const r = el.getBoundingClientRect();
  return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) };
}

export function gambarkan(el: Element, akar: Element | null): Objek {
  return { jenis: jenisDari(el), label: labelDari(el), jejak: jejakDari(el, akar), pemilih: pemilihDari(el), kotak: kotakDari(el) };
}

/** Nama singkat untuk tampilan: Tombol "Salin". */
export function namaObjek(o: { jenis: string; label: string }): string {
  return o.label ? `${o.jenis} "${o.label.length > 40 ? `${o.label.slice(0, 39)}…` : o.label}"` : o.jenis;
}

/**
 * Rantai elemen dari yang diklik ke atas (maks. 8), dan pilihan bawaannya: elemen interaktif terdekat (tombol, kotak isian, tab,
 * tautan) dalam 4 tingkat; bila tidak ada, elemen yang diklik (ikon di dalam SVG naik ke SVG-nya).
 */
export function rantaiDari(target: Element, akar: Element | null): { rantai: Element[]; bawaan: number } {
  let t: Element = target;
  // Bagian dalam ikon SVG (path, circle) naik ke <svg>.
  const svg = t.closest("svg");
  if (svg) t = svg;
  const rantai: Element[] = [];
  for (let a: Element | null = t; a && a !== document.body && a !== document.documentElement && a !== akar && rantai.length < 8; a = a.parentElement) rantai.push(a);
  if (!rantai.length) rantai.push(target);
  let bawaan = 0;
  const i = rantai.slice(0, 5).findIndex((e) => e.matches(INTERAKTIF));
  if (i >= 0) bawaan = i;
  return { rantai, bawaan };
}

export function halamanIni(): Halaman {
  const vis = (e: Element | null) => (e && (e as HTMLElement).offsetParent !== null ? e : null);
  const h1 = document.querySelector("h1");
  const menu = vis(document.querySelector('[data-menu][aria-current="page"], nav [aria-current="page"]'))
    ?? document.querySelector('[aria-current="page"]');
  const tab = [...document.querySelectorAll('[role="tab"][aria-selected="true"]')].find((e) => vis(e)) ?? null;
  return {
    alamat: (location.pathname + location.hash).slice(0, 300),
    judul: ringkas(h1 ? teksTerlihat(h1, 150) : document.title, 150),
    menu: menu ? teksTerlihat(menu, 60) : "",
    tab: tab ? teksTerlihat(tab, 60) : "",
  };
}

function peramban(): string {
  const ua = navigator.userAgent;
  const nama = /Edg\//.test(ua) ? "Edge" : /SamsungBrowser/.test(ua) ? "Samsung Internet" : /Firefox\//.test(ua) ? "Firefox"
    : /CriOS|Chrome\//.test(ua) ? "Chrome" : /Safari\//.test(ua) ? "Safari" : "Peramban lain";
  const os = /iPhone|iPad|iPod/.test(ua) ? "iOS" : /Android/.test(ua) ? "Android" : /Windows/.test(ua) ? "Windows" : /Mac OS X/.test(ua) ? "macOS" : /Linux/.test(ua) ? "Linux" : "";
  return os ? `${nama} · ${os}` : nama;
}

export function perangkatIni(): Perangkat {
  return {
    lebar: window.innerWidth,
    tinggi: window.innerHeight,
    rasio: Math.round((window.devicePixelRatio || 1) * 100) / 100,
    sentuh: window.matchMedia("(pointer: coarse)").matches,
    peramban: peramban(),
    tema: document.documentElement.dataset.tema ?? "",
  };
}

export function aplikasiIni(): "staf" | "pasien" | "masuk" {
  const p = location.pathname;
  if (p.startsWith("/pasien")) return "pasien";
  if (p.startsWith("/masuk") || p.startsWith("/uji")) return "masuk";
  return "staf";
}
