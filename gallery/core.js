/* Luz Motion — registry, gallery renderer, and prompt builder.
   Each demo file calls LUZ.add({...}). See README for the entry contract. */
(function () {
  'use strict';
  var entries = [];
  var byId = {};
  var LUZ = (window.LUZ = {
    add: function (e) {
      if (byId[e.id]) { console.warn('duplicate id', e.id); return; }
      byId[e.id] = e; entries.push(e);
    },
    all: function () { return entries.slice(); },
    get: function (id) { return byId[id]; }
  });

  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- helpers ---------- */
  function scopeCss(id, css) { return (css || '').replace(/&/g, '[data-d="' + id + '"]'); }
  function el(tag, attrs, html) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === 'class') n.className = attrs[k]; else n.setAttribute(k, attrs[k]);
    }
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function store(k, v) {
    try { if (v === undefined) return JSON.parse(localStorage.getItem('luz:' + k)); localStorage.setItem('luz:' + k, JSON.stringify(v)); } catch (e) { return null; }
  }
  function copy(text, btn) {
    var done = function () { var t = btn.textContent; btn.textContent = 'Tersalin'; btn.classList.add('ok'); setTimeout(function () { btn.textContent = t; btn.classList.remove('ok'); }, 1400); };
    var fallback = function () {
      var ta = document.getElementById('copy-fallback');
      ta.value = text; ta.hidden = false; ta.focus(); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { btn.textContent = 'Pilih teks lalu salin'; }
    };
    try { navigator.clipboard.writeText(text).then(done, fallback); } catch (e) { fallback(); }
  }

  /* ---------- mount a demo into a stage ---------- */
  var cssDone = {};
  function mount(e, stage) {
    if (stage._cleanup) { try { stage._cleanup(); } catch (x) {} stage._cleanup = null; }
    if (!cssDone[e.id]) {
      var s = el('style'); s.textContent = scopeCss(e.id, e.css); document.head.appendChild(s); cssDone[e.id] = 1;
    }
    stage.setAttribute('data-d', e.id);
    stage.innerHTML = e.html || '';
    if (typeof e.js === 'function') {
      try { stage._cleanup = e.js(stage, { reduce: reduce }) || null; } catch (err) { console.error(e.id, err); }
    }
  }

  /* ---------- code text for prompts ---------- */
  function codeFor(e) {
    var out = '';
    if (e.html) out += '<!-- HTML -->\n' + e.html.trim() + '\n\n';
    if (e.css) out += '/* CSS — ganti "&" dengan selector wadah komponen Anda */\n' + e.css.trim() + '\n\n';
    if (e.js) out += '// JS — root = elemen wadah\n(' + e.js.toString() + ')(root);\n';
    return out.trim();
  }

  function promptBlock(e, i, withCode) {
    var lines = [];
    lines.push((i != null ? (i + 1) + '. ' : '') + '[' + e.id + '] ' + e.name + ' — ' + e.cat);
    lines.push('   Pemicu: ' + e.trigger);
    lines.push('   Gerak: ' + e.motion);
    lines.push('   Durasi & easing: ' + e.timing);
    if (e.use) lines.push('   Cocok untuk: ' + e.use);
    if (withCode) lines.push('   Referensi kode (vanilla, sesuaikan ke stack):\n```\n' + codeFor(e) + '\n```');
    return lines.join('\n');
  }

  var STACK = {
    vanilla: 'HTML + CSS + JavaScript vanilla',
    tailwind: 'React + Tailwind CSS (transisi CSS / keyframes di tailwind.config)',
    motion: 'React + Motion (framer-motion): pakai motion.div, AnimatePresence, layout, spring',
    vue: 'Vue 3 (<Transition>/<TransitionGroup>) + CSS',
    apps: 'Google Apps Script HtmlService (HTML + CSS + JS vanilla dalam satu berkas)'
  };

  function buildPrompt(ids, opts) {
    var list = ids.map(function (id) { return byId[id]; }).filter(Boolean);
    var p = [];
    var mode = opts.mode === 'fix'
      ? 'Perbaiki animasi yang SUDAH ADA di proyek ini memakai pola dari Luz Motion berikut. Cari komponennya dulu, jangan buat ulang dari nol, ubah sesedikit mungkin.'
      : 'Tambahkan animasi UI dari koleksi Luz Motion berikut ke proyek ini.';
    p.push(mode);
    if (opts.target) p.push('Target: ' + opts.target);
    if (opts.issue) p.push('Masalah sekarang: ' + opts.issue);
    p.push('Stack: ' + STACK[opts.stack]);
    p.push('');
    p.push('Animasi yang dipilih:');
    list.forEach(function (e, i) { p.push(promptBlock(e, i, opts.code)); p.push(''); });
    p.push('Aturan wajib:');
    p.push('- Animasikan transform dan opacity saja (hindari width/height/top/left kecuali clip-path atau layout animation).');
    p.push('- Interaksi UI di bawah 300 ms; elemen besar (sheet, halaman) boleh 300–500 ms. Ease-out untuk masuk, ease-in lebih cepat untuk keluar.');
    p.push('- Hormati prefers-reduced-motion: ganti gerak dengan fade singkat atau tanpa animasi.');
    p.push('- Bisa diinterupsi: klik ulang di tengah animasi harus membalik arah, bukan menunggu selesai.');
    p.push('- Target sentuh minimal 44×44 px; fokus keyboard terlihat; atribut aria (aria-expanded, aria-hidden) ikut berubah.');
    p.push('- Animasi yang dipakai sangat sering (puluhan kali sehari) dibuat lebih singkat atau tanpa animasi.');
    p.push('- Setelah selesai, sebutkan berkas yang diubah dan cara mengujinya.');
    return p.join('\n');
  }
  LUZ.buildPrompt = buildPrompt;

  /* ---------- gallery UI ---------- */
  function init() {
    var grid = document.getElementById('grid');
    var chips = document.getElementById('chips');
    var q = document.getElementById('q');
    var count = document.getElementById('count');
    var selected = store('sel') || [];
    selected = selected.filter(function (id) { return byId[id]; });
    var activeCat = store('cat') || 'Semua';

    var cats = ['Semua'];
    entries.forEach(function (e) { if (cats.indexOf(e.cat) < 0) cats.push(e.cat); });
    if (cats.indexOf(activeCat) < 0) activeCat = 'Semua';

    cats.forEach(function (c) {
      var n = c === 'Semua' ? entries.length : entries.filter(function (e) { return e.cat === c; }).length;
      var b = el('button', { class: 'chip', type: 'button', 'data-cat': c }, esc(c) + ' <span>' + n + '</span>');
      b.addEventListener('click', function () { activeCat = c; store('cat', c); filter(); });
      chips.appendChild(b);
    });

    var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (items) {
      items.forEach(function (it) {
        var st = it.target;
        if (it.isIntersecting && !st._mounted) { st._mounted = true; mount(byId[st.dataset.id], st); }
        else if (!it.isIntersecting && st._mounted) {
          if (st._cleanup) { try { st._cleanup(); } catch (x) {} st._cleanup = null; }
          st.innerHTML = ''; st._mounted = false;
        }
      });
    }, { rootMargin: '200px' }) : null;

    entries.forEach(function (e) {
      var card = el('article', { class: 'card', id: 'c-' + e.id, 'data-id': e.id });
      var stage = el('div', { class: 'stage', 'data-id': e.id, 'aria-label': 'Demo ' + e.name });
      var meta = el('div', { class: 'meta' });
      meta.innerHTML =
        '<div class="row1"><code class="id">' + esc(e.id) + '</code><span class="trig">' + esc(e.trigger) + '</span></div>' +
        '<h3>' + esc(e.name) + '</h3>' +
        '<p class="motion">' + esc(e.motion) + '</p>' +
        '<p class="timing">' + esc(e.timing) + '</p>';
      var actions = el('div', { class: 'actions' });
      var pick = el('label', { class: 'pick' });
      var cb = el('input', { type: 'checkbox', id: 'pick-' + e.id });
      cb.checked = selected.indexOf(e.id) >= 0;
      pick.appendChild(cb); pick.appendChild(document.createTextNode(' Pilih'));
      cb.addEventListener('change', function () {
        var i = selected.indexOf(e.id);
        if (cb.checked && i < 0) selected.push(e.id);
        if (!cb.checked && i >= 0) selected.splice(i, 1);
        card.classList.toggle('on', cb.checked); store('sel', selected); tray();
      });
      var replay = el('button', { type: 'button', class: 'ghost' }, 'Ulang');
      replay.addEventListener('click', function () { mount(e, stage); stage._mounted = true; });
      var cp = el('button', { type: 'button', class: 'ghost' }, 'Salin prompt');
      cp.addEventListener('click', function () { copy(buildPrompt([e.id], opts()), cp); });
      actions.appendChild(pick); actions.appendChild(replay); actions.appendChild(cp);
      card.appendChild(stage); card.appendChild(meta); card.appendChild(actions);
      if (cb.checked) card.classList.add('on');
      grid.appendChild(card);
      if (io) io.observe(stage); else { mount(e, stage); stage._mounted = true; }
    });

    function filter() {
      var term = (q.value || '').toLowerCase().trim();
      var shown = 0;
      entries.forEach(function (e) {
        var hay = (e.id + ' ' + e.name + ' ' + e.cat + ' ' + e.motion + ' ' + (e.use || '') + ' ' + (e.tags || '')).toLowerCase();
        var ok = (activeCat === 'Semua' || e.cat === activeCat) && (!term || hay.indexOf(term) >= 0);
        document.getElementById('c-' + e.id).hidden = !ok;
        if (ok) shown++;
      });
      [].forEach.call(chips.children, function (b) { b.setAttribute('aria-pressed', b.dataset.cat === activeCat); });
      count.textContent = shown + ' animasi';
    }
    q.addEventListener('input', filter);
    filter();

    /* tray */
    var trayEl = document.getElementById('tray');
    var trayList = document.getElementById('tray-list');
    var out = document.getElementById('out');
    ['target', 'issue', 'stack', 'mode', 'withcode'].forEach(function (k) {
      var n = document.getElementById(k); var v = store('opt-' + k);
      if (v != null) { if (n.type === 'checkbox') n.checked = v; else n.value = v; }
      n.addEventListener('input', function () { store('opt-' + k, n.type === 'checkbox' ? n.checked : n.value); render(); });
      n.addEventListener('change', function () { store('opt-' + k, n.type === 'checkbox' ? n.checked : n.value); render(); });
    });
    function opts() {
      return {
        target: document.getElementById('target').value.trim(),
        issue: document.getElementById('issue').value.trim(),
        stack: document.getElementById('stack').value,
        mode: document.getElementById('mode').value,
        code: document.getElementById('withcode').checked
      };
    }
    function render() {
      document.getElementById('issue-wrap').hidden = document.getElementById('mode').value !== 'fix';
      out.value = selected.length ? buildPrompt(selected, opts()) : '';
    }
    function tray() {
      trayEl.classList.toggle('has', selected.length > 0);
      document.getElementById('sel-n').textContent = selected.length;
      trayList.innerHTML = '';
      selected.forEach(function (id) {
        var b = el('button', { type: 'button', class: 'tag', title: 'Hapus dari pilihan' }, esc(id) + ' <span aria-hidden="true">×</span>');
        b.addEventListener('click', function () {
          var cb = document.getElementById('pick-' + id); cb.checked = false; cb.dispatchEvent(new Event('change'));
        });
        trayList.appendChild(b);
      });
      render();
    }
    document.getElementById('toggle-tray').addEventListener('click', function () {
      var open = trayEl.classList.toggle('open');
      this.setAttribute('aria-expanded', open);
      this.textContent = open ? 'Tutup' : 'Susun prompt';
    });
    document.getElementById('copy-all').addEventListener('click', function () { if (out.value) copy(out.value, this); });
    document.getElementById('clear').addEventListener('click', function () {
      selected.slice().forEach(function (id) { var cb = document.getElementById('pick-' + id); cb.checked = false; cb.dispatchEvent(new Event('change')); });
    });
    tray();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else setTimeout(init, 0);
})();
