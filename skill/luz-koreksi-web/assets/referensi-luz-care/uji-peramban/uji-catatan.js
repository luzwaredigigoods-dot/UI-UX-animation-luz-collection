// Uji alur peramban Catatan uji (data dummy). Jalankan: node uji-catatan.js  (preview :4173 + API :3000 dengan CATATAN_UJI=nyala)
const { chromium, devices } = require('playwright');
const fs = require('fs');
const URL = 'http://localhost:4173';
let lulus = 0, gagal = 0;
const cek = (ok, pesan) => { if (ok) { lulus++; } else { gagal++; console.log('  GAGAL:', pesan); } };
const sr = (p, sel) => p.evaluate((s) => { const r = document.getElementById('cu-akar')?.shadowRoot; return r ? !!r.querySelector(s) : false; }, sel);
const teksSr = (p, sel) => p.evaluate((s) => document.getElementById('cu-akar')?.shadowRoot?.querySelector(s)?.textContent ?? null, sel);
const klikSr = (p, sel) => p.evaluate((s) => { const e = document.getElementById('cu-akar').shadowRoot.querySelector(s); if (!e) throw new Error('tidak ada ' + s); e.click(); }, sel);
const terlihatSr = (p, sel) => p.evaluate((s) => { const e = document.getElementById('cu-akar')?.shadowRoot?.querySelector(s); return !!e && getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().width > 0; }, sel);
const tunggu = (ms) => new Promise((r) => setTimeout(r, ms));
async function tungguSr(p, sel, ms = 5000) { const t = Date.now(); while (Date.now() - t < ms) { if (await terlihatSr(p, sel)) return true; await tunggu(100); } return false; }
async function tungguTeks(p, sel, pola, ms = 8000) { const t = Date.now(); let x; while (Date.now() - t < ms) { x = await teksSr(p, sel); if (x && pola.test(x)) return x; await tunggu(150); } return x; }
const isiSr = (p, sel, nilai) => p.evaluate(([s, v]) => { const e = document.getElementById('cu-akar').shadowRoot.querySelector(s); e.focus(); e.value = v; e.dispatchEvent(new Event('input', { bubbles: true, composed: true })); }, [sel, nilai]);
/** Klik kanan sungguhan (mouse) dan catat apakah menu konteks bawaan dicegah. */
async function klikKanan(p, sel) {
  await p.evaluate(() => { window.__ctx = null; document.addEventListener('contextmenu', (e) => { window.__ctx = e.defaultPrevented; }, { once: true }); });
  await p.locator(sel).first().click({ button: 'right' });
  await tunggu(150);
  return p.evaluate(() => window.__ctx);
}

(async () => {
  const b = await chromium.launch();
  const S = __dirname + '/gambar';
  fs.mkdirSync(S, { recursive: true });

  // ---------- 1. Staf di PC ----------
  console.log('1. Staf di PC (1366x768)');
  const c = await b.newContext({ viewport: { width: 1366, height: 768 } });
  await c.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: URL });
  const p = await c.newPage();
  const galatHalaman = [];
  p.on('pageerror', (e) => galatHalaman.push(e.message));
  cek((await p.request.post(URL + '/api/masuk', { data: { namaPengguna: 'dokter', kataSandi: 'dummy-dokter-123' } })).ok(), 'masuk dokter');
  await p.goto(URL + '/');
  cek(await tungguSr(p, '.apung'), 'tombol Catatan uji tampil');
  cek(/Catatan uji/.test(await teksSr(p, '.apung')), 'teks tombol di PC');
  cek(!(await terlihatSr(p, '.pita')) && !(await terlihatSr(p, '.bingkai')), 'mode mati saat awal (pita dan bingkai tidak terlihat)');
  // Mode mati: klik kanan biasa tidak dicegah, panel tidak terbuka.
  cek((await klikKanan(p, 'h1')) === false, 'mode mati: klik kanan biasa tidak dicegah');
  cek(!(await terlihatSr(p, '.panel')), 'mode mati: panel tidak terbuka oleh klik kanan');
  // Nyalakan.
  await klikSr(p, '.apung');
  cek(await tungguSr(p, '.pita'), 'pita mode tampil');
  cek(await terlihatSr(p, '.bingkai'), 'bingkai mode tampil');
  cek(await terlihatSr(p, '.panel'), 'panel terbuka saat mode dinyalakan');
  cek(/Klik kanan objek/.test(await teksSr(p, '.panel')), 'petunjuk awal');
  // Arahkan kursor: sorot.
  await p.locator('[data-menu="poli"]').first().hover();
  await tunggu(200);
  cek(await terlihatSr(p, '.sorot'), 'sorot saat kursor di atas objek');
  cek(/Tombol/.test(await teksSr(p, '.sorot-label')), 'label sorot: ' + await teksSr(p, '.sorot-label'));
  await p.screenshot({ path: S + '/1-sorot.png' });
  // Klik kanan pada teks di dalam tombol menu -> naik ke tombolnya.
  cek((await klikKanan(p, '[data-menu="poli"] >> nth=0')) !== false, 'mode aktif: klik kanan tidak sampai ke aplikasi');
  const nama1 = await teksSr(p, '.objek .nama');
  cek(/Tombol/.test(nama1 ?? ''), 'objek 1 tombol menu: ' + nama1);
  cek(await sr(p, '.wadah button[aria-pressed="true"]'), 'pilihan wadah tampil');
  cek(await terlihatSr(p, '.tanda'), 'tanda nomor objek di layar');
  // Objek kedua: judul halaman.
  await klikKanan(p, 'h1');
  const n = await p.evaluate(() => document.getElementById('cu-akar').shadowRoot.querySelectorAll('.objek').length);
  cek(n === 2, 'dua objek: ' + n);
  // Klik kanan objek yang sama lagi tidak menambah.
  await klikKanan(p, 'h1');
  cek(await p.evaluate(() => document.getElementById('cu-akar').shadowRoot.querySelectorAll('.objek').length) === 2, 'objek sama tidak ganda');
  // Pilih wadah lebih besar untuk objek 2.
  const wadah2 = await p.evaluate(() => [...document.getElementById('cu-akar').shadowRoot.querySelectorAll('.objek')[1].querySelectorAll('.wadah button')].map((x) => x.textContent));
  cek(wadah2.length >= 2, 'tingkat wadah objek 2: ' + wadah2.join(' | '));
  await p.evaluate(() => document.getElementById('cu-akar').shadowRoot.querySelectorAll('.objek')[1].querySelectorAll('.wadah button')[1].click());
  const nama2 = await p.evaluate(() => document.getElementById('cu-akar').shadowRoot.querySelectorAll('.objek .nama')[1].textContent);
  cek(nama2 !== 'Judul "Dashboard"', 'objek 2 diganti wadahnya: ' + nama2);
  await isiSr(p, 'textarea', 'Uji: samakan warna ');
  await klikSr(p, '[data-aksi="sebut"][data-i="0"]');
  cek(/@1 $/.test(await p.evaluate(() => document.getElementById('cu-akar').shadowRoot.querySelector('textarea').value)), 'sisipkan @1');
  await klikSr(p, '[data-aksi="kategori"][data-v="teks"]');
  await klikSr(p, '[data-aksi="prioritas"][data-v="tinggi"]');
  // Tulisan bertahan setelah dimuat ulang (per tab).
  await p.reload();
  cek(await tungguSr(p, '.panel'), 'panel tetap terbuka setelah muat ulang');
  cek(/samakan warna @1/.test(await p.evaluate(() => document.getElementById('cu-akar').shadowRoot.querySelector('textarea')?.value)), 'tulisan bertahan setelah muat ulang');
  cek(await p.evaluate(() => document.getElementById('cu-akar').shadowRoot.querySelectorAll('.objek').length) === 2, 'objek bertahan setelah muat ulang');
  cek(await terlihatSr(p, '.pita'), 'mode tetap menyala setelah muat ulang');
  await p.screenshot({ path: S + '/1-panel.png' });
  await klikSr(p, '[data-aksi="simpan"]');
  const pesan = await tungguTeks(p, '.pesan', /Tersimpan sebagai #\d+/);
  cek(/Tersimpan sebagai #\d+\.$/.test(pesan ?? ''), 'tersimpan dengan gambar: ' + pesan);
  const daftar = (await (await p.request.get(URL + '/api/catatan-uji')).json()).catatan;
  const c1 = daftar[0];
  cek(c1 && c1.objek.length === 2 && c1.kategori === 'teks' && c1.prioritas === 'tinggi' && c1.adaGambar, 'catatan di server: ' + JSON.stringify(c1 && { o: c1.objek.length, k: c1.kategori, g: c1.adaGambar }));
  cek(c1.halaman.menu === 'Dashboard' && c1.halaman.judul === 'Dashboard', 'halaman: ' + JSON.stringify(c1.halaman));
  cek(c1.perangkat.lebar === 1366 && c1.perangkat.sentuh === false, 'perangkat: ' + JSON.stringify(c1.perangkat));
  cek(c1.objek[0].pemilih.includes('[data-menu="poli"]'), 'pemilih objek 1: ' + c1.objek[0].pemilih);
  const g = await p.request.get(URL + `/api/catatan-uji/${c1.id}/gambar`);
  const gb = await g.body();
  fs.writeFileSync(S + '/1-gambar-server.jpg', gb);
  cek(g.headers()['content-type'] === 'image/jpeg' && gb.length > 5000, 'gambar layar JPEG ' + gb.length + ' byte');

  // Isi kotak isian tidak pernah ikut.
  await p.locator('[data-menu="rekam"]').first().click();
  await p.evaluate(() => { const m = [...document.querySelectorAll('[data-menu]')].find((x) => /Medical/i.test(x.textContent)); m?.click(); });
  await tunggu(800);
  const kotakCari = p.locator('input[type="search"], input').first();
  await kotakCari.fill('RAHASIA-12345');
  await klikKanan(p, 'input >> nth=0');
  await isiSr(p, 'textarea', 'Kotak cari terlalu sempit');
  await klikSr(p, '[data-aksi="simpan"]');
  await tungguTeks(p, '.pesan', /Tersimpan/);
  const c2 = (await (await p.request.get(URL + '/api/catatan-uji')).json()).catatan[0];
  cek(!JSON.stringify(c2).includes('RAHASIA'), 'isi kotak isian tidak ikut tersimpan');
  cek(/Kotak isian/.test(c2.objek[0]?.jenis ?? ''), 'jenis kotak isian: ' + c2.objek[0]?.jenis + ' / ' + c2.objek[0]?.label);
  cek(c2.halaman.menu === 'Medical record', 'menu Medical record: ' + c2.halaman.menu);

  // Daftar, detail, status, salin.
  await klikSr(p, '[data-aksi="tab-daftar"]');
  await tunggu(500);
  const nDaftar = await p.evaluate(() => document.getElementById('cu-akar').shadowRoot.querySelectorAll('.daftar li').length);
  cek(nDaftar >= 2, 'daftar berisi catatan: ' + nDaftar);
  await klikSr(p, '[data-aksi="salin"]');
  await tunggu(300);
  const papan = await p.evaluate(() => navigator.clipboard.readText());
  cek(/^## #\d+ · Teks|## #\d+/.test(papan) && papan.includes('Objek:') && papan.includes('> '), 'salin catatan Markdown');
  cek(!papan.includes('RAHASIA'), 'salinan tanpa isi kotak isian');
  await klikSr(p, `[data-aksi="buka"][data-id="${c1.id}"]`);
  cek(await sr(p, '.detail img'), 'detail menampilkan gambar layar');
  await p.screenshot({ path: S + '/1-detail.png' });
  await p.evaluate(() => { const e = document.getElementById('cu-akar').shadowRoot.getElementById('cu-ket'); e.value = 'commit uji123'; });
  await klikSr(p, '[data-aksi="status"][data-v="dikerjakan"]');
  await tunggu(600);
  const c1b = (await (await p.request.get(URL + '/api/catatan-uji')).json()).catatan.find((x) => x.id === c1.id);
  cek(c1b.status === 'dikerjakan' && c1b.riwayat[0]?.keterangan === 'commit uji123', 'status diubah + riwayat');
  cek(/uji123/.test(await teksSr(p, '.detail') ?? ''), 'riwayat tampil di detail');
  // Sorot objek catatan di halaman yang sama (catatan 1 dari Dashboard; sekarang di Medical record -> pesan halaman lain).
  await klikSr(p, '[data-aksi="sorot-catatan"][data-i="0"]');
  cek(/halaman lain|Buka dulu/.test(await teksSr(p, '.detail .pesan') ?? ''), 'sorot dari halaman lain memberi pesan');

  // Panel pindah kiri, kecilkan, tutup.
  await klikSr(p, '[data-aksi="sisi"]');
  cek(await sr(p, '.panel.kiri'), 'panel pindah ke kiri');
  await klikSr(p, '[data-aksi="kecil"]');
  cek(await sr(p, '.panel.kecil'), 'panel dikecilkan');
  await klikSr(p, '[data-aksi="kecil"]');
  await klikSr(p, '[data-aksi="sisi"]');
  // Esc: mode mati, klik kanan normal lagi.
  await p.keyboard.press('Escape');
  cek(!(await terlihatSr(p, '.pita')) && !(await terlihatSr(p, '.panel')), 'Esc mematikan mode dan menutup panel');
  cek((await klikKanan(p, 'h1')) === false, 'setelah Esc klik kanan biasa');
  // Pintasan Alt+Shift+C.
  await p.keyboard.press('Alt+Shift+C');
  cek(await terlihatSr(p, '.pita'), 'Alt+Shift+C menyalakan mode');
  await p.keyboard.press('Alt+Shift+C');
  cek(!(await terlihatSr(p, '.pita')), 'Alt+Shift+C mematikan mode');
  // Badge angka di tombol.
  cek(/\d/.test(await teksSr(p, '.apung .angka') ?? ''), 'angka catatan belum selesai di tombol: ' + await teksSr(p, '.apung .angka'));
  // Layar terkunci: Catatan uji disembunyikan.
  await p.evaluate(() => [...document.querySelectorAll('button')].find((x) => /^\s*Kunci\s*$/.test(x.textContent))?.click());
  await tunggu(1300);
  cek(await p.evaluate(() => !!document.querySelector('.s-kunci')), 'layar terkunci tampil');
  cek(await p.evaluate(() => getComputedStyle(document.getElementById('cu-akar')).display === 'none'), 'Catatan uji tersembunyi saat layar terkunci');
  cek(galatHalaman.length === 0, 'tanpa galat JS: ' + galatHalaman.join('; '));
  await c.close();

  // ---------- 2. Pasien di HP: tekan lama ----------
  console.log('2. Aplikasi pasien di HP (tekan lama)');
  const cd = await b.newContext({ viewport: { width: 1280, height: 800 } });
  const rq = cd.request;
  await rq.post(URL + '/api/masuk', { data: { namaPengguna: 'dokter', kataSandi: 'dummy-dokter-123' } });
  await rq.put(URL + '/api/pengaturan/aplikasi-pasien', { data: { aktif: true, hargaSesi: 1000 } });
  const email = `catatan.${Date.now()}@contoh.test`;
  const pid = (await (await rq.post(URL + '/api/pasien', { data: { nama: 'Uji Catatan HP', tglLahir: '1994-04-04', noHp: '080000000072', konfirmasiMirip: true } })).json()).pasien.id;
  await rq.post(URL + '/api/kunjungan', { data: { pasienId: pid, jenis: 'obstetri', tempatId: (await (await rq.get(URL + '/api/tempat')).json()).tempat.find((t) => t.nama === 'Idola').id } });
  const ps = await (await rq.post(URL + '/api/peserta', { data: { pasienId: pid, email, cara: 'tunai' } })).json();
  cek(!!ps.kataSandiSementara, 'peserta uji dibuat: ' + JSON.stringify(ps).slice(0, 120));
  await cd.close();
  const hp = await b.newContext({ ...devices['iPhone 13'] });
  const ph = await hp.newPage();
  const galatHp = [];
  ph.on('pageerror', (e) => galatHp.push(e.message));
  await ph.request.post(URL + '/api/aplikasi/masuk', { data: { email, kataSandi: ps.kataSandiSementara } });
  await ph.request.post(URL + '/api/aplikasi/sandi-awal', { data: { kataSandiBaru: 'teh manis sore' } });
  await ph.request.post(URL + '/api/aplikasi/masuk', { data: { email, kataSandi: 'teh manis sore' } });
  const t = (await (await ph.request.get(URL + '/api/aplikasi/persetujuan')).json()).teks;
  await ph.request.post(URL + '/api/aplikasi/persetujuan', { data: { versi: t.versi, butir: t.butir.map(() => true) } });
  await ph.goto(URL + '/pasien/');
  cek(await tungguSr(ph, '.apung'), 'tombol tampil di aplikasi pasien');
  await tunggu(1700);
  const posisi = await ph.evaluate(() => {
    const a = document.getElementById('cu-akar').shadowRoot.querySelector('.apung').getBoundingClientRect();
    const n = document.querySelector('nav.tab-bawah')?.getBoundingClientRect();
    return { a: a.bottom, n: n ? n.top : null, lebar: a.width };
  });
  cek(posisi.n !== null && posisi.a <= posisi.n, 'tombol di atas menu bawah: ' + JSON.stringify(posisi));
  cek(posisi.lebar <= 80, 'tombol ringkas di HP (ikon + angka): ' + posisi.lebar);
  await ph.locator('#cu-akar').evaluate((h) => h.shadowRoot.querySelector('.apung').click());
  cek(await tungguSr(ph, '.panel'), 'panel terbuka di HP');
  const bentuk = await ph.evaluate(() => { const r = document.getElementById('cu-akar').shadowRoot.querySelector('.panel').getBoundingClientRect(); return { l: r.left, r: r.right, b: r.bottom, t: r.top, w: innerWidth, h: innerHeight }; });
  cek(bentuk.l >= 0 && bentuk.r <= bentuk.w && bentuk.b <= bentuk.h && bentuk.t > bentuk.h * 0.3, 'panel = lembar bawah di HP: ' + JSON.stringify(bentuk));
  // Kecilkan panel agar objek di layar bisa ditekan lama.
  await klikSr(ph, '[data-aksi="kecil"]');
  const cdp = await hp.newCDPSession(ph);
  async function tekanLama(sel) {
    const box = await ph.locator(sel).first().boundingBox();
    const x = box.x + box.width / 2, y = box.y + box.height / 2;
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    await tunggu(750);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await tunggu(400);
  }
  const hashAwal = await ph.evaluate(() => location.hash);
  const tombolNav = 'nav.tab-bawah button >> nth=1';
  await tekanLama(tombolNav);
  cek(await ph.evaluate(() => location.hash) === hashAwal, 'tekan lama tidak menjalankan tombol di bawahnya');
  const namaHp = await teksSr(ph, '.objek .nama');
  cek(/Tombol/.test(namaHp ?? ''), 'tekan lama menangkap tombol menu bawah: ' + namaHp);
  cek(await sr(ph, '.panel.kecil'), 'panel tetap kecil setelah objek ditangkap');
  cek(/1 objek/.test(await teksSr(ph, '.kepala h2') ?? ''), 'jumlah objek di kepala panel kecil');
  await ph.screenshot({ path: S + '/2-hp-kecil.png' });
  // Ketukan biasa tetap berjalan selama mode menyala (pindah menu).
  await ph.locator(tombolNav).tap();
  await tunggu(500);
  cek(await ph.evaluate(() => location.hash) !== hashAwal, 'ketukan biasa tetap memindah menu: ' + await ph.evaluate(() => location.hash));
  await klikSr(ph, '[data-aksi="kecil"]');
  await isiSr(ph, 'textarea', 'Tombol @1 terlalu kecil untuk jempol');
  await klikSr(ph, '[data-aksi="simpan"]');
  const pesanHp = await tungguTeks(ph, '.pesan', /Tersimpan sebagai #\d+/);
  cek(/Tersimpan sebagai #\d+\.$/.test(pesanHp ?? ''), 'pasien menyimpan dengan gambar: ' + pesanHp);
  const milik = (await (await ph.request.get(URL + '/api/aplikasi/catatan-uji')).json()).catatan;
  cek(milik[0]?.halaman.menu === 'Hasil', 'halaman = layar saat disimpan: ' + milik[0]?.halaman.menu);
  cek(milik.length === 1 && milik[0].aplikasi === 'pasien' && milik[0].perangkat.sentuh === true && milik[0].perangkat.lebar === 390, 'catatan pasien: ' + JSON.stringify(milik.map((x) => [x.aplikasi, x.perangkat.lebar, x.perangkat.sentuh])));
  const gh = await ph.request.get(URL + `/api/aplikasi/catatan-uji/${milik[0].id}/gambar`);
  fs.writeFileSync(S + '/2-gambar-hp.jpg', await gh.body());
  cek(gh.ok(), 'gambar layar pasien tersimpan');
  await klikSr(ph, '[data-aksi="tab-daftar"]');
  await tunggu(500);
  cek(await ph.evaluate(() => document.getElementById('cu-akar').shadowRoot.querySelectorAll('.daftar li').length) === 1, 'pasien hanya melihat catatannya');
  await klikSr(ph, '[data-aksi="buka"]');
  cek(!(await sr(ph, '[data-aksi="status"]')), 'pasien tidak bisa mengubah status');
  cek(await sr(ph, '[data-aksi="hapus"]'), 'pasien bisa menghapus catatan Baru miliknya');
  await ph.screenshot({ path: S + '/2-hp-detail.png' });
  const lebarHp = await ph.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
  cek(lebarHp, 'HP tanpa gulir mendatar');
  cek(galatHp.length === 0, 'tanpa galat JS di HP: ' + galatHp.join('; '));
  await hp.close();

  // ---------- 3. Halaman masuk tanpa sesi ----------
  console.log('3. Halaman masuk (tanpa sesi)');
  const cm = await b.newContext({ viewport: { width: 1280, height: 800 } });
  const pm = await cm.newPage();
  for (const alamat of ['/masuk/staf.html', '/masuk/', '/uji/imt-tiruan.html']) {
    await pm.goto(URL + alamat);
    cek(await tungguSr(pm, '.apung'), 'tombol tampil di ' + alamat);
  }
  await pm.goto(URL + '/masuk/staf.html');
  await tungguSr(pm, '.apung');
  await klikSr(pm, '.apung');
  cek(/Masuk dulu/.test(await tungguTeks(pm, '.panel', /Masuk dulu/) ?? ''), 'tanpa sesi: diminta masuk dulu');
  // Staf masuk di tab lain -> Periksa lagi -> bisa menulis.
  const tabLain = await cm.newPage();
  await tabLain.request.post(URL + '/api/masuk', { data: { namaPengguna: 'admin', kataSandi: 'dummy-admin-123' } });
  await klikSr(pm, '[data-aksi="cek"]');
  cek(await tungguSr(pm, 'textarea'), 'setelah masuk di tab lain bisa menulis');
  // Panel menutupi kartu masuk di kanan: pindahkan ke kiri dulu.
  await klikSr(pm, '[data-aksi="sisi"]');
  await klikKanan(pm, 'button[type="submit"]');
  cek(/Tombol/.test(await teksSr(pm, '.objek .nama') ?? ''), 'tombol Masuk tertangkap: ' + await teksSr(pm, '.objek .nama'));
  await isiSr(pm, 'textarea', 'Tombol Masuk kurang kontras');
  await klikSr(pm, '[data-aksi="simpan"]');
  cek(/Tersimpan/.test(await tungguTeks(pm, '.pesan', /Tersimpan/) ?? ''), 'catatan dari halaman masuk tersimpan');
  const cMasuk = (await (await pm.request.get(URL + '/api/catatan-uji')).json()).catatan[0];
  cek(cMasuk.aplikasi === 'masuk' && cMasuk.penulis.peran === 'admin', 'aplikasi "masuk", penulis admin: ' + cMasuk.aplikasi);
  await cm.close();

  // ---------- 4. Modul mati (server tanpa rute status) ----------
  console.log('4. Modul mati');
  const cx = await b.newContext({ viewport: { width: 1280, height: 800 } });
  const px = await cx.newPage();
  const diminta = [];
  px.on('request', (r) => diminta.push(r.url()));
  await cx.route('**/api/catatan-uji/status', (r) => r.fulfill({ status: 404, body: '{"pesan":"Not Found"}', contentType: 'application/json' }));
  await px.request.post(URL + '/api/masuk', { data: { namaPengguna: 'dokter', kataSandi: 'dummy-dokter-123' } });
  for (const alamat of ['/', '/masuk/staf.html', '/pasien/']) {
    await px.goto(URL + alamat);
    await tunggu(1200);
    cek(!(await px.evaluate(() => !!document.getElementById('cu-akar'))), 'modul mati: tidak ada tombol di ' + alamat);
  }
  cek(!diminta.some((u) => u.includes('/catatan-uji/catatan-uji.js')), 'modul mati: catatan-uji.js tidak diunduh');
  cek(diminta.some((u) => u.includes('/catatan-uji/pemuat.js')), 'pemuat tetap bertanya ke server');
  // Klik kanan biasa di aplikasi.
  await px.goto(URL + '/');
  await tunggu(800);
  cek((await klikKanan(px, 'h1')) === false, 'modul mati: klik kanan biasa');
  await cx.close();

  // ---------- 5. Dialog modal (Daftarkan pasien) ----------
  console.log('5. Dialog modal');
  const cdl = await b.newContext({ viewport: { width: 1913, height: 1023 } });
  const pd = await cdl.newPage();
  await pd.request.post(URL + '/api/masuk', { data: { namaPengguna: 'dokter', kataSandi: 'dummy-dokter-123' } });
  await pd.evaluate(() => sessionStorage.clear()).catch(() => {});
  await pd.goto(URL + '/');
  await pd.waitForFunction(() => !!document.getElementById('cu-akar'));
  await pd.locator('[data-menu="poli"]').first().click();
  await tunggu(600);
  await pd.locator('button', { hasText: /^\s*Daftar( pasien)?\s*$/ }).first().click();
  await pd.waitForSelector('dialog[open]');
  await tunggu(300);
  cek(await pd.evaluate(() => document.getElementById('cu-akar').parentElement?.tagName === 'DIALOG'), 'Catatan uji pindah ke dalam dialog modal');
  // Klik sungguhan: Playwright gagal bila tombol tertutup atau tidak bisa diklik (inert).
  await pd.locator('.apung').click({ timeout: 5000 });
  cek(await tungguSr(pd, '.pita') && await terlihatSr(pd, '.panel'), 'tombol bisa diklik saat dialog terbuka; mode + panel tampil');
  await pd.locator('dialog input').first().click({ button: 'right' });
  const namaDlg = await teksSr(pd, '.objek .nama');
  cek(/Kotak isian/.test(namaDlg ?? ''), 'objek di dalam dialog tertangkap: ' + namaDlg);
  cek(/Daftarkan pasien|Identitas|Pasien baru/.test(await teksSr(pd, '.objek .jejak') ?? ''), 'jejak menyebut dialog: ' + await teksSr(pd, '.objek .jejak'));
  await isiSr(pd, 'textarea', 'Kolom @1 di dialog daftar perlu contoh isian');
  await klikSr(pd, '[data-aksi="simpan"]');
  cek(/Tersimpan sebagai #\d+\.$/.test(await tungguTeks(pd, '.pesan', /Tersimpan/) ?? ''), 'simpan dari dalam dialog dengan gambar');
  const cDlg = (await (await pd.request.get(URL + '/api/catatan-uji')).json()).catatan[0];
  fs.writeFileSync(S + '/5-gambar-dialog.jpg', await (await pd.request.get(URL + `/api/catatan-uji/${cDlg.id}/gambar`)).body());
  await pd.screenshot({ path: S + '/5-dialog.png' });
  // Dialog digulir ke bawah: objek di bagian bawah dialog tetap tergambar di tempatnya.
  await pd.evaluate(() => { const d = document.querySelector('dialog[open]'); d.scrollTop = d.scrollHeight; });
  await tunggu(200);
  await pd.locator('dialog button', { hasText: 'Daftarkan ke antrean' }).click({ button: 'right' });
  await isiSr(pd, 'textarea', 'Tombol @1 terlalu jauh di bawah');
  await klikSr(pd, '[data-aksi="simpan"]');
  await tungguTeks(pd, '.pesan', /Tersimpan sebagai #\d+\.$/);
  const cDlg2 = (await (await pd.request.get(URL + '/api/catatan-uji')).json()).catatan[0];
  cek(cDlg2.adaGambar && cDlg2.objek[0]?.jenis === 'Tombol', 'catatan dari dialog yang digulir tersimpan dengan gambar');
  fs.writeFileSync(S + '/5-gambar-dialog-gulir.jpg', await (await pd.request.get(URL + `/api/catatan-uji/${cDlg2.id}/gambar`)).body());
  await pd.screenshot({ path: S + '/5-dialog-gulir.png' });
  // Tutup dialog: Catatan uji kembali ke halaman dan tetap bisa diklik.
  await pd.evaluate(() => document.querySelector('dialog[open]')?.close());
  await tunggu(300);
  cek(await pd.evaluate(() => document.getElementById('cu-akar').parentElement === document.body), 'kembali ke halaman setelah dialog ditutup');
  await pd.locator('[data-aksi="matikan"]').click({ timeout: 5000 });
  await pd.locator('[data-aksi="tutup"]').click({ timeout: 5000 });
  cek(!(await terlihatSr(pd, '.pita')) && !(await terlihatSr(pd, '.panel')), 'Matikan + tutup panel dengan klik sungguhan setelah dialog ditutup');
  await pd.locator('.apung').click({ timeout: 5000 });
  cek(await terlihatSr(pd, '.pita'), 'tombol apung bisa diklik lagi setelah dialog ditutup');
  await cdl.close();

  console.log(`\nLulus ${lulus}, gagal ${gagal}`);
  await b.close();
  process.exit(gagal ? 1 : 0);
})();
