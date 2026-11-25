// Uji ukuran + kontras panel Catatan uji (data dummy).
const { chromium } = require('playwright');
const URL = 'http://localhost:4173';
const UKURAN = [[320, 568], [360, 740], [390, 844], [430, 932], [768, 1024], [820, 1180], [1024, 768], [1280, 800], [1366, 768], [1920, 1080]];
let lulus = 0, gagal = 0, kombinasi = 0, minKontras = 99, elemenKontras = 0;
const cek = (ok, pesan) => { if (ok) lulus++; else { gagal++; console.log('  GAGAL:', pesan); } };
const tunggu = (ms) => new Promise((r) => setTimeout(r, ms));
const klikSr = (p, sel) => p.evaluate((s) => document.getElementById('cu-akar').shadowRoot.querySelector(s)?.click(), sel);

async function periksa(p, nama) {
  kombinasi++;
  const h = await p.evaluate(() => {
    const r = document.getElementById('cu-akar').shadowRoot;
    const vw = innerWidth, vh = innerHeight;
    const kotak = (s) => { const e = r.querySelector(s); if (!e || getComputedStyle(e).display === 'none') return null; const b = e.getBoundingClientRect(); return { l: b.left, r: b.right, t: b.top, b: b.bottom, w: b.width, h: b.height }; };
    const kecilTombol = [...r.querySelectorAll('.panel button')].filter((x) => getComputedStyle(x).display !== 'none' && x.getBoundingClientRect().height > 0 && x.getBoundingClientRect().height < 24).map((x) => x.textContent);
    const isi = r.querySelector('.panel .isi');
    return {
      gulirMendatar: document.documentElement.scrollWidth > vw + 1,
      panel: kotak('.panel'), apung: kotak('.apung'), pita: kotak('.pita'), vw, vh, kecilTombol,
      isiMeluap: isi ? isi.scrollWidth > isi.clientWidth + 1 : false,
    };
  });
  const dalam = (k) => !k || (k.l >= -0.5 && k.r <= h.vw + 0.5 && k.t >= -0.5 && k.b <= h.vh + 0.5);
  cek(!h.gulirMendatar, `${nama}: tanpa gulir mendatar`);
  cek(dalam(h.panel), `${nama}: panel di dalam layar ${JSON.stringify(h.panel)}`);
  cek(dalam(h.apung), `${nama}: tombol apung di dalam layar`);
  cek(dalam(h.pita), `${nama}: pita di dalam layar ${JSON.stringify(h.pita)}`);
  cek(!h.isiMeluap, `${nama}: isi panel tidak meluap mendatar`);
  cek(h.kecilTombol.length === 0, `${nama}: tombol >= 24 px (${h.kecilTombol.join(', ')})`);
  // Kontras teks di dalam panel (latar efektif dari leluhur di shadow DOM).
  const k = await p.evaluate(() => {
    const r = document.getElementById('cu-akar').shadowRoot;
    const rgb = (s) => { const m = s.match(/rgba?\(([^)]+)\)/); if (!m) return null; const v = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r: v[0], g: v[1], b: v[2], a: v[3] ?? 1 }; };
    const lum = (c) => { const f = (x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
    const latar = (e) => { for (let a = e; a; a = a.parentElement) { const c = rgb(getComputedStyle(a).backgroundColor); if (c && c.a > 0.9) return c; } return { r: 255, g: 253, b: 249, a: 1 }; };
    const hasil = [];
    for (const e of r.querySelectorAll('*')) {
      if ([...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().width > 0 && !e.closest('[hidden]')) {
        if (e.disabled || e.closest('button:disabled')) continue;
        const f = rgb(getComputedStyle(e).color), bg = latar(e);
        const L1 = lum(f), L2 = lum(bg);
        hasil.push({ t: e.textContent.trim().slice(0, 30), k: (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05) });
      }
    }
    return hasil;
  });
  for (const x of k) { elemenKontras++; minKontras = Math.min(minKontras, x.k); if (x.k < 4.5) cek(false, `${nama}: kontras ${x.k.toFixed(2)} "${x.t}"`); }
}

(async () => {
  const b = await chromium.launch();
  for (const [w, hgt] of UKURAN) {
    // Staf
    const c = await b.newContext({ viewport: { width: w, height: hgt } });
    const p = await c.newPage();
    await p.request.post(URL + '/api/masuk', { data: { namaPengguna: 'dokter', kataSandi: 'dummy-dokter-123' } });
    await p.goto(URL + '/');
    await p.waitForFunction(() => !!document.getElementById('cu-akar')?.shadowRoot?.querySelector('.apung'));
    await tunggu(1600);
    await klikSr(p, '.apung');
    await tunggu(400);
    // Dua objek lewat klik kanan pada judul dan kartu sapaan (di luar panel bila memungkinkan).
    await p.evaluate(() => {
      const pilih = [document.querySelector('h1'), document.querySelector('[data-menu="poli"]')].filter(Boolean);
      for (const el of pilih) el.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, button: 2, clientX: 5, clientY: 5 }));
    });
    await p.evaluate(() => { const t = document.getElementById('cu-akar').shadowRoot.querySelector('textarea'); t.value = 'Uji ukuran layar dengan catatan agak panjang untuk melihat pembungkusan teks @1 @2'; t.dispatchEvent(new Event('input', { bubbles: true, composed: true })); });
    await tunggu(200);
    await periksa(p, `staf ${w}x${hgt} tulis`);
    if (w === 390 || w === 1366) await p.screenshot({ path: `${__dirname}/gambar/ukuran-staf-${w}.png` });
    await klikSr(p, '[data-aksi="tab-daftar"]');
    await tunggu(600);
    await periksa(p, `staf ${w}x${hgt} daftar`);
    await klikSr(p, '[data-aksi="buka"]');
    await tunggu(500);
    await periksa(p, `staf ${w}x${hgt} detail`);
    if (w === 390) await p.screenshot({ path: `${__dirname}/gambar/ukuran-staf-${w}-detail.png` });
    await klikSr(p, '[data-aksi="kecil"]');
    await tunggu(150);
    await periksa(p, `staf ${w}x${hgt} kecil`);
    // Bersihkan draf agar ukuran berikutnya mulai sama.
    await p.evaluate(() => sessionStorage.clear());
    await c.close();
  }
  console.log(`${kombinasi} kombinasi, lulus ${lulus}, gagal ${gagal}; kontras ${elemenKontras} elemen teks, terendah ${minKontras.toFixed(2)}:1`);
  await b.close();
  process.exit(gagal ? 1 : 0);
})();
