/* Demo panel: luz-koreksi-web "Mode catatan" + Luz Motion tab.
   A compact, framework-free version of the Catatan uji flow, made to show (and test) the motion
   features: recommendations per captured object, live preview on the real element, pick and
   search, and the "animasi:" lines in the copied Markdown.
   In a real project this logic goes into luz-koreksi-web's index.ts (see references/motion.md).
   Rules kept from luz-koreksi-web: shadow DOM isolation, never read input values, right-click /
   500 ms long-press only while the mode is on, Esc turns it off. */
(function () {
  'use strict';
  var LM = window.LuzMotionKoreksi;
  if (!LM) { console.warn('LuzMotionKoreksi missing'); return; }
  var MAKS = 5;
  var host = document.createElement('div');
  host.setAttribute('data-luz-koreksi', '');
  var root = host.attachShadow({ mode: 'open' });
  document.body.appendChild(host);

  var S = {
    aktif: false, buka: false, tab: 'tulis',
    objek: [],          // {el, jenis, label, nama, pemilih, rek:[ids], pilih:id|null}
    fokus: 0,           // index of object whose recommendations are shown
    cari: '', isi: '', kategori: 'Tampilan', prioritas: 'Sedang',
    catatan: []         // saved notes (memory only in this demo)
  };

  /* ---------- styles (inside shadow DOM) ---------- */
  var css = '' +
    ':host{all:initial}*{box-sizing:border-box;font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}' +
    '[hidden]{display:none!important}' +
    '.apung{position:fixed;right:max(16px,env(safe-area-inset-right,0px));bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:2147483000;display:flex;gap:8px;align-items:center}' +
    '.btn{font:600 13px/1 inherit;border-radius:999px;border:1px solid #9a3412;background:#c2410c;color:#fff;padding:12px 16px;cursor:pointer;min-height:44px;box-shadow:0 6px 18px rgba(0,0,0,.18)}' +
    '.btn.ghost{background:#fff;color:#9a3412}.btn:focus-visible,.x:focus-visible,button:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible{outline:2px solid #1f4bd8;outline-offset:2px}' +
    '.pita{position:fixed;top:0;left:0;right:0;z-index:2147483000;background:#c2410c;color:#fff;font:600 12.5px/1.2 inherit;padding:calc(8px + env(safe-area-inset-top,0px)) 16px 8px;text-align:center;letter-spacing:.02em}' +
    '.sorot{position:fixed;z-index:2147482999;pointer-events:none;border:2px solid #c2410c;border-radius:6px;background:rgba(194,65,12,.06);transition:all .08s}' +
    '.tanda{position:fixed;z-index:2147482999;pointer-events:none;border:2px solid #c2410c;border-radius:6px}' +
    '.tanda b{position:absolute;top:-11px;left:-11px;background:#c2410c;color:#fff;font:700 11px/1 inherit;border-radius:999px;padding:4px 6px}' +
    '.panel{position:fixed;right:max(16px,env(safe-area-inset-right,0px));bottom:calc(76px + env(safe-area-inset-bottom,0px));width:min(400px,calc(100vw - 32px));max-height:min(72vh,620px);z-index:2147483001;background:#fffdfb;color:#1c1917;border:1px solid #e7e0da;border-radius:14px;box-shadow:0 18px 48px rgba(0,0,0,.22);display:flex;flex-direction:column;overflow:hidden;font-size:13.5px}' +
    '@media (max-width:719px){.panel{left:16px;right:16px;width:auto;top:calc(64px + env(safe-area-inset-top,0px));bottom:auto;max-height:50vh}}' +
    '.kepala{display:flex;gap:6px;align-items:center;padding:10px 10px 0 14px}.kepala strong{font-size:14px;margin-right:auto}' +
    '.tabs{display:flex;gap:4px;padding:8px 10px 0 10px;border-bottom:1px solid #eee6df}' +
    '.tabs button{border:0;background:none;padding:8px 10px;font:600 12.5px inherit;color:#78716c;border-bottom:2px solid transparent;cursor:pointer}.tabs button[aria-selected=true]{color:#9a3412;border-color:#c2410c}' +
    '.isi{overflow:auto;padding:12px 14px 14px;display:grid;gap:12px}' +
    '.x{border:0;background:none;font-size:18px;line-height:1;cursor:pointer;color:#78716c;min-width:36px;min-height:36px;border-radius:8px}' +
    '.kosong{color:#78716c;font-size:13px;line-height:1.5}' +
    '.obj{display:flex;flex-wrap:wrap;gap:6px}.objc{display:flex;align-items:center;gap:6px;border:1px solid #e7e0da;border-radius:999px;padding:4px 6px 4px 4px;cursor:pointer;background:#fff;font-size:12.5px;max-width:100%}' +
    '.objc[aria-pressed=true]{border-color:#c2410c;background:#fff4ec}.objc b{background:#c2410c;color:#fff;border-radius:999px;padding:3px 6px;font-size:11px}' +
    '.objc span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:180px}.objc i{font-style:normal;color:#78716c;font-size:11px}' +
    '.seksi{display:grid;gap:8px}.judul{font:700 11px/1 inherit;letter-spacing:.08em;text-transform:uppercase;color:#78716c;display:flex;justify-content:space-between;align-items:center}' +
    '.judul a{font-weight:600;letter-spacing:0;text-transform:none;color:#1f4bd8;text-decoration:none}' +
    '.rek{display:grid;gap:6px}.r{display:grid;grid-template-columns:1fr auto auto;gap:6px;align-items:center;border:1px solid #eee6df;border-radius:10px;padding:8px 8px 8px 10px;background:#fff}' +
    '.r.on{border-color:#1f4bd8;box-shadow:0 0 0 1px #1f4bd8;background:#f5f7ff}.r .nm{min-width:0}.r .nm strong{display:block;font-size:13px}.r .nm code{font:11px ui-monospace,Menlo,monospace;color:#57534e}' +
    '.r .nm small{display:block;color:#78716c;font-size:11.5px;margin-top:2px;line-height:1.35}' +
    '.mini{border:1px solid #d6d3d1;background:#fff;border-radius:8px;padding:7px 9px;font:600 12px inherit;cursor:pointer;min-height:34px;white-space:nowrap}' +
    '.mini.biru{background:#1f4bd8;border-color:#1f4bd8;color:#fff}.mini[disabled]{opacity:.45;cursor:default}' +
    'input[type=search],textarea,select{width:100%;border:1px solid #d6d3d1;border-radius:8px;padding:8px 10px;font:13.5px inherit;background:#fff;color:#1c1917}' +
    'textarea{min-height:84px;resize:vertical;line-height:1.45}.baris2{display:grid;grid-template-columns:1fr 1fr;gap:8px}' +
    '.aksi{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap}.pesan{font-size:12.5px;color:#15803d;min-height:1em}' +
    '.cat{border:1px solid #eee6df;border-radius:10px;padding:10px;background:#fff;display:grid;gap:4px;font-size:12.5px}.cat pre{white-space:pre-wrap;margin:0;font:12px/1.45 ui-monospace,Menlo,monospace}' +
    '.catatan-kecil{font-size:11.5px;color:#78716c;line-height:1.4}';

  root.innerHTML = '<style>' + css + '</style>' +
    '<div class="pita" hidden>Mode catatan · klik kanan objek (tekan lama di HP) · Esc untuk keluar</div>' +
    '<div class="sorot" hidden></div><div class="tanda-wadah"></div>' +
    '<div class="apung"><button class="btn mode" type="button" aria-pressed="false">Catatan uji</button></div>' +
    '<section class="panel" hidden aria-label="Panel catatan"></section>';

  var $ = function (s) { return root.querySelector(s); };
  var pita = $('.pita'), sorot = $('.sorot'), tandaW = $('.tanda-wadah'), panel = $('.panel'), tMode = $('.mode');

  /* ---------- capture helpers (labels only, never input values) ---------- */
  function namaObjek(el) {
    var t = el.getAttribute('aria-label') || '';
    if (!t && el.id) { var l = document.querySelector('label[for="' + CSS.escape(el.id) + '"]'); if (l) t = l.textContent; }
    if (!t && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) t = el.getAttribute('placeholder') || el.name || '';
    if (!t && el.tagName === 'IMG') t = el.alt || '';
    if (!t) t = (el.innerText || el.textContent || '').trim();
    t = t.replace(/\s+/g, ' ').trim();
    return t.length > 60 ? t.slice(0, 57) + '…' : t || el.tagName.toLowerCase();
  }
  function pemilih(el) {
    var parts = [], n = el;
    for (var i = 0; n && n.nodeType === 1 && i < 5 && n !== document.body; i++, n = n.parentElement) {
      var p = n.tagName.toLowerCase();
      if (n.id) { parts.unshift(p + '#' + n.id); break; }
      var cls = [].slice.call(n.classList).filter(function (c) { return !/^(is-|has-)/.test(c); }).slice(0, 2);
      if (cls.length) p += '.' + cls.join('.');
      parts.unshift(p);
    }
    return parts.join(' > ');
  }
  function bukanModul(e) { return e.composedPath && e.composedPath().indexOf(host) >= 0; }

  /* ---------- mode on/off ---------- */
  function setAktif(on) {
    S.aktif = on; pita.hidden = !on; sorot.hidden = true;
    tMode.textContent = on ? 'Mode catatan: nyala' : 'Catatan uji';
    tMode.setAttribute('aria-pressed', on);
    document.documentElement.style.webkitUserSelect = on ? 'none' : '';
    document.documentElement.style.userSelect = on ? 'none' : '';
    if (on && !S.buka) { S.buka = true; render(); }
  }
  tMode.addEventListener('click', function () { setAktif(!S.aktif); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && S.aktif) setAktif(false);
    if (e.altKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) setAktif(!S.aktif);
  });

  document.addEventListener('pointermove', function (e) {
    if (!S.aktif || e.pointerType === 'touch' || bukanModul(e)) { if (S.aktif) sorot.hidden = true; return; }
    var r = e.target.getBoundingClientRect();
    sorot.hidden = false;
    sorot.style.cssText = 'left:' + (r.left - 3) + 'px;top:' + (r.top - 3) + 'px;width:' + (r.width + 6) + 'px;height:' + (r.height + 6) + 'px';
  }, true);

  var tekan = null, abaikanCtx = 0, telanKlik = false;
  function tangkap(target) {
    if (S.objek.length >= MAKS) { S.pesan = 'Maksimal ' + MAKS + ' objek per catatan.'; render(); return; }
    var rek = LM.rekomendasi(target, 6);
    var el = rek.target;
    if (S.objek.some(function (o) { return o.el === el; })) { S.fokus = S.objek.findIndex(function (o) { return o.el === el; }); render(); return; }
    S.objek.push({ el: el, jenis: rek.jenis, label: rek.label, nama: namaObjek(el), pemilih: pemilih(el), rek: rek.daftar.map(function (d) { return d.id; }), pilih: null });
    S.fokus = S.objek.length - 1; S.buka = true; S.tab = 'tulis'; S.pesan = '';
    render(); gambarTanda();
  }
  document.addEventListener('contextmenu', function (e) {
    if (!S.aktif || bukanModul(e)) return;
    e.preventDefault(); e.stopImmediatePropagation();
    if (Date.now() - abaikanCtx < 800) return; // Android sends contextmenu after a long-press
    tangkap(e.target);
  }, true);
  document.addEventListener('pointerdown', function (e) {
    if (!S.aktif || e.pointerType !== 'touch' || bukanModul(e)) return;
    var t = e.target, x = e.clientX, y = e.clientY;
    tekan = { t: setTimeout(function () { abaikanCtx = Date.now(); telanKlik = true; tangkap(t); }, 500), x: x, y: y };
  }, true);
  ['pointerup', 'pointercancel'].forEach(function (ev) {
    document.addEventListener(ev, function () { if (tekan) { clearTimeout(tekan.t); tekan = null; } }, true);
  });
  document.addEventListener('pointermove', function (e) {
    if (tekan && Math.hypot(e.clientX - tekan.x, e.clientY - tekan.y) > 10) { clearTimeout(tekan.t); tekan = null; }
  }, true);
  document.addEventListener('click', function (e) {
    if (telanKlik && !bukanModul(e)) { e.preventDefault(); e.stopImmediatePropagation(); telanKlik = false; }
  }, true);

  function gambarTanda() {
    tandaW.innerHTML = '';
    S.objek.forEach(function (o, i) {
      if (!o.el.isConnected) return;
      var r = o.el.getBoundingClientRect();
      var d = document.createElement('div'); d.className = 'tanda';
      d.style.cssText = 'left:' + (r.left - 3) + 'px;top:' + (r.top - 3) + 'px;width:' + (r.width + 6) + 'px;height:' + (r.height + 6) + 'px';
      d.innerHTML = '<b>@' + (i + 1) + '</b>';
      tandaW.appendChild(d);
    });
  }
  window.addEventListener('scroll', gambarTanda, true);
  window.addEventListener('resize', gambarTanda);

  /* ---------- panel ---------- */
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function kartuAnimasi(d, o) {
    var on = o && o.pilih === d.id;
    return '<div class="r' + (on ? ' on' : '') + '"><div class="nm"><strong>' + esc(d.n) + '</strong><code>' + esc(d.id) + '</code>' +
      '<small>' + esc(LM.namaKeluarga(d.g)) + ' · ' + esc(d.d) + '</small></div>' +
      '<button class="mini" type="button" data-pratinjau="' + d.id + '" ' + (o ? '' : 'disabled') + ' aria-label="Pratinjau ' + esc(d.n) + ' pada objek">▶ Coba</button>' +
      '<button class="mini' + (on ? ' biru' : '') + '" type="button" data-pilih="' + d.id + '" ' + (o ? '' : 'disabled') + '>' + (on ? 'Dipilih' : 'Pilih') + '</button></div>';
  }
  function htmlTulis() {
    if (!S.objek.length) return '<p class="kosong">Nyalakan <b>Mode catatan</b>, lalu klik kanan objek di halaman (tekan lama di HP). Objek masuk sebagai @1, @2, dan Luz Motion langsung menyarankan animasi yang cocok untuk objek itu.</p>';
    var o = S.objek[S.fokus] || S.objek[0];
    var h = '<div class="seksi"><div class="judul">Objek</div><div class="obj">' + S.objek.map(function (x, i) {
      return '<button class="objc" type="button" data-fokus="' + i + '" aria-pressed="' + (i === S.fokus) + '"><b>@' + (i + 1) + '</b><span>' + esc(x.nama) + '</span><i>' + esc(x.label) + (x.pilih ? ' · ✓ animasi' : '') + '</i></button>';
    }).join('') + '<button class="mini" type="button" data-hapus="' + S.fokus + '" aria-label="Hapus objek @' + (S.fokus + 1) + '">Hapus @' + (S.fokus + 1) + '</button></div></div>';
    h += '<div class="seksi"><div class="judul"><span>Animasi cocok untuk @' + (S.fokus + 1) + ' (' + esc(o.label) + ')</span><a href="' + LM.GALERI + '" target="_blank" rel="noopener">Galeri ↗</a></div>' +
      '<div class="rek">' + o.rek.map(function (id) { return kartuAnimasi(LM.get(id), o); }).join('') + '</div>' +
      '<p class="catatan-kecil">▶ Coba memutar perkiraan gerak langsung pada objek @' + (S.fokus + 1) + ' di halaman. Versi persisnya ada di galeri.</p></div>';
    h += '<div class="seksi"><label class="judul" for="lm-cari">Cari animasi lain</label><input id="lm-cari" type="search" placeholder="mis. blur, stagger, sheet, confetti" value="' + esc(S.cari) + '">' +
      '<div class="rek hasil">' + LM.cari(S.cari, 8).map(function (d) { return kartuAnimasi(d, o); }).join('') + '</div></div>';
    h += '<div class="seksi"><label class="judul" for="lm-isi">Catatan perbaikan</label>' +
      '<textarea id="lm-isi" placeholder="Tulis koreksinya. @1, @2 merujuk ke objek.">' + esc(S.isi) + '</textarea>' +
      '<div class="baris2"><select id="lm-kat" aria-label="Kategori">' + ['Tampilan', 'Alur', 'Teks', 'Error', 'Animasi'].map(function (k) { return '<option' + (k === S.kategori ? ' selected' : '') + '>' + k + '</option>'; }).join('') + '</select>' +
      '<select id="lm-pri" aria-label="Prioritas">' + ['Tinggi', 'Sedang', 'Rendah'].map(function (k) { return '<option' + (k === S.prioritas ? ' selected' : '') + '>' + k + '</option>'; }).join('') + '</select></div>' +
      '<div class="aksi"><span class="pesan">' + esc(S.pesan || '') + '</span><button class="mini" type="button" data-batal>Kosongkan</button><button class="mini biru" type="button" data-simpan>Simpan catatan</button></div></div>';
    return h;
  }
  function markdown() {
    return S.catatan.map(function (c) {
      var m = '## #' + c.no + ' · ' + c.kategori + ' · Prioritas ' + c.prioritas.toLowerCase() + ' · Baru\n' +
        '- Halaman: ' + c.halaman + '\n- Perangkat: ' + c.perangkat + '\n- Objek:\n' +
        c.objek.map(function (o, i) { return '  ' + (i + 1) + '. ' + o.label + ' "' + o.nama + '" `' + o.pemilih + '`'; }).join('\n') + '\n';
      m += '\n' + c.isi.split('\n').map(function (l) { return '> ' + l; }).join('\n') + '\n';
      return m;
    }).join('\n');
  }
  function htmlDaftar() {
    if (!S.catatan.length) return '<p class="kosong">Belum ada catatan tersimpan.</p>';
    return '<div class="aksi"><span class="pesan">' + esc(S.pesan || '') + '</span><button class="mini biru" type="button" data-salin>Salin catatan (' + S.catatan.length + ')</button></div>' +
      S.catatan.slice().reverse().map(function (c) {
        return '<div class="cat"><strong>#' + c.no + ' · ' + esc(c.kategori) + ' · ' + esc(c.prioritas) + '</strong><pre>' + esc(c.isi) + '</pre>' +
          c.objek.filter(function (o) { return o.pilih; }).map(function (o) { return '<code>' + esc(o.pilih) + '</code>'; }).join(' ') + '</div>';
      }).join('') + '<textarea readonly aria-label="Markdown catatan">' + esc(markdown()) + '</textarea>';
  }
  function render() {
    panel.hidden = !S.buka;
    if (!S.buka) return;
    var aktif = document.activeElement === host ? root.activeElement : null;
    var fokusId = aktif && aktif.id, pos = aktif && aktif.selectionStart;
    panel.innerHTML = '<div class="kepala"><strong>Catatan uji</strong><button class="x" type="button" data-tutup aria-label="Tutup panel">×</button></div>' +
      '<div class="tabs" role="tablist"><button role="tab" type="button" data-tab="tulis" aria-selected="' + (S.tab === 'tulis') + '">Tulis</button>' +
      '<button role="tab" type="button" data-tab="daftar" aria-selected="' + (S.tab === 'daftar') + '">Daftar (' + S.catatan.length + ')</button></div>' +
      '<div class="isi">' + (S.tab === 'tulis' ? htmlTulis() : htmlDaftar()) + '</div>';
    if (fokusId) { var n = root.getElementById(fokusId); if (n) { n.focus(); try { n.setSelectionRange(pos, pos); } catch (x) {} } }
  }

  function sisipBaris(id) {
    var o = S.objek[S.fokus];
    var line = LM.baris(id, S.fokus + 1);
    var re = new RegExp('^@' + (S.fokus + 1) + ' animasi: .*$', 'm');
    S.isi = re.test(S.isi) ? S.isi.replace(re, line) : (S.isi ? S.isi.replace(/\s*$/, '') + '\n' : '') + line;
    o.pilih = id;
  }

  panel.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.hasAttribute('data-tutup')) { S.buka = false; render(); return; }
    if (b.dataset.tab) { S.tab = b.dataset.tab; S.pesan = ''; render(); return; }
    if (b.dataset.fokus) { S.fokus = +b.dataset.fokus; render(); return; }
    if (b.dataset.hapus) {
      var i = +b.dataset.hapus; var o = S.objek[i];
      if (o && o.pilih) S.isi = S.isi.replace(new RegExp('^@' + (i + 1) + ' animasi: .*\\n?', 'm'), '');
      S.objek.splice(i, 1); S.fokus = Math.max(0, Math.min(S.fokus, S.objek.length - 1)); render(); gambarTanda(); return;
    }
    if (b.dataset.pratinjau) { var ob = S.objek[S.fokus]; if (ob) { ob.el.scrollIntoView({ block: 'nearest' }); LM.pratinjau(ob.el, b.dataset.pratinjau); } return; }
    if (b.dataset.pilih) { sisipBaris(b.dataset.pilih); render(); return; }
    if (b.hasAttribute('data-batal')) { S.objek = []; S.isi = ''; S.pesan = ''; render(); gambarTanda(); return; }
    if (b.hasAttribute('data-simpan')) {
      if (!S.objek.length || !S.isi.trim()) { S.pesan = 'Tangkap objek dan tulis catatannya dulu.'; render(); return; }
      S.catatan.push({
        no: S.catatan.length + 1, kategori: S.kategori, prioritas: S.prioritas, isi: S.isi.trim(),
        halaman: (document.querySelector('h1') || {}).textContent + ' (`' + location.pathname.split('/').pop() + '`)',
        perangkat: innerWidth + '×' + innerHeight + ', ' + (matchMedia('(pointer:coarse)').matches ? 'layar sentuh' : 'mouse'),
        objek: S.objek.map(function (o) { return { label: o.label, nama: o.nama, pemilih: o.pemilih, pilih: o.pilih }; })
      });
      S.objek = []; S.isi = ''; S.pesan = 'Tersimpan sebagai #' + S.catatan.length + '.'; render(); gambarTanda(); return;
    }
    if (b.hasAttribute('data-salin')) {
      var md = markdown();
      var ok = function () { S.pesan = 'Tersalin. Tempel di chat Claude.'; render(); };
      try { navigator.clipboard.writeText(md).then(ok, function () { S.pesan = 'Salin manual dari kotak di bawah.'; render(); }); } catch (x) { S.pesan = 'Salin manual dari kotak di bawah.'; render(); }
    }
  });
  panel.addEventListener('input', function (e) {
    var t = e.target;
    if (t.id === 'lm-isi') S.isi = t.value;
    if (t.id === 'lm-cari') { S.cari = t.value; var h = root.querySelector('.hasil'); if (h) h.innerHTML = LM.cari(S.cari, 8).map(function (d) { return kartuAnimasi(d, S.objek[S.fokus]); }).join(''); }
  });
  panel.addEventListener('change', function (e) {
    if (e.target.id === 'lm-kat') S.kategori = e.target.value;
    if (e.target.id === 'lm-pri') S.prioritas = e.target.value;
  });

  window.LuzKoreksiDemo = { setAktif: setAktif, tangkap: tangkap, keadaan: S, markdown: markdown };
})();
