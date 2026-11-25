/* Skeleton Loading · Part 1 — six ways a post card swaps to a skeleton and loads the next post.
   Each part of the card is a "slot" (.s) holding its content (.c) and its grey skeleton block (::before).
   Slot class .k = skeleton state. Tap the card to load the next post; autoplay once after 600ms. */
(function () {
  var SRC = 'Skeleton Loading · Part 1';
  var HTML = '<div class="post" role="button" tabindex="0" aria-label="Muat kiriman berikutnya" aria-busy="false">' +
    '<div class="s av"><i class="c"></i></div><div class="s t nm"><span class="c"></span></div><div class="s t mt"><span class="c"></span></div>' +
    '<div class="s t ti"><span class="c"></span></div><div class="s t sb"><span class="c"></span></div><div class="s t st"><span class="c"></span></div>' +
    '<div class="s im"><i class="c"></i></div></div>';
  var BASE =
    '& .post{position:relative;width:236px;height:118px;background:var(--d-bg);border-radius:14px;cursor:pointer;--h:205}' +
    '& .s{position:absolute;display:flex;align-items:center}' +
    '& .s::before{content:"";position:absolute;inset:0;border-radius:5px;background:var(--d-soft);opacity:0;pointer-events:none}' +
    '& .s.k::before{opacity:1}& .s.k .c{opacity:0}' +
    '& .c{white-space:nowrap;font-style:normal}' +
    '& .av{left:12px;top:12px;width:26px;height:26px}& .av::before{border-radius:50%}' +
    '& .av .c{width:26px;height:26px;border-radius:50%;display:grid;place-items:center;font:700 8px/1 sans-serif;color:#fff;background:linear-gradient(135deg,hsl(var(--h) 70% 58%),hsl(calc(var(--h) + 40) 70% 45%))}' +
    '& .nm{left:46px;top:12px;width:82px;height:12px;font:700 11px/1 sans-serif}' +
    '& .mt{left:46px;top:28px;width:62px;height:9px;font:500 8.5px/1 sans-serif;color:var(--d-mid)}' +
    '& .ti{left:12px;top:50px;width:122px;height:14px;font:700 12.5px/1 sans-serif}' +
    '& .sb{left:12px;top:69px;width:136px;height:10px;font:400 9.5px/1 sans-serif;color:var(--d-mid)}' +
    '& .st{left:12px;top:88px;width:70px;height:16px;font:500 9px/1 sans-serif}& .st::before{border-radius:8px}' +
    '& .im{right:12px;top:12px;width:66px;height:94px}& .im::before{border-radius:10px}' +
    '& .im .c{width:100%;height:100%;border-radius:10px;background:radial-gradient(circle at 72% 22%,#fff 0 6px,transparent 7px),linear-gradient(hsl(var(--h) 55% 22%),hsl(calc(var(--h) + 30) 60% 48%))}';
  var TAGS = 'skeleton loading placeholder shimmer card feed post ';

  LUZ.add({
    id: 'skeleton-blur-focus',
    cat: 'Loading & Skeleton',
    name: 'Blur Focus',
    source: SRC,
    trigger: 'tap',
    allowColor: true,
    motion: 'Kiriman lama blur (0 → 8px) sambil memudar menjadi blok abu-abu lembut. Setelah jeda, kiriman baru muncul dalam keadaan blur 8px dan opacity 0.3, lalu menajam ke fokus penuh.',
    timing: 'keluar 150ms · tahan skeleton 300ms · fokus masuk 320ms ease-out',
    use: 'Memuat ulang kartu atau feed (refresh data pasien, ganti halaman daftar) tanpa kedipan kosong.',
    tags: TAGS + 'blur focus crossfade',
    html: HTML,
    css: BASE + '& .s::before{transition:opacity .15s}',
    js: function (root, api) {
      var p = root.querySelector('.post'), S = [].slice.call(p.querySelectorAll('.s')), k = 0, run = 0, T = [];
      var P = [['SI', 'Sana Ito', '11m · Osaka', 'City after dark', 'Every window tells a story', '2.4k', '102', 265], ['JB', 'Jonah Bell', '17m · Lapland', 'Quiet lake night', 'Moonlight and pine trees', '659', '27', 205], ['MO', 'Mika Ono', '2m · Alps', 'Above the clouds', 'Sunrise from the ridge trail', '1.2k', '48', 320], ['TL', 'Theo Lane', '6m · Okinawa', 'Clear water day', 'Swam out to the reef at noon', '864', '31', 190]];
      var wait = function (ms) { return new Promise(function (r) { T.push(setTimeout(r, ms)); }); };
      function fill(d) { var v = [d[0], d[1], d[2], d[3], d[4], '♥ ' + d[5] + '    ○ ' + d[6], '']; S.forEach(function (s, i) { s.firstChild.textContent = v[i]; }); p.style.setProperty('--h', d[7]); }
      async function load() {
        var my = ++run, C = S.map(function (s) { return s.firstChild; });
        p.setAttribute('aria-busy', 'true');
        if (!api.reduce) await Promise.all(C.map(function (c) { return c.animate([{ filter: 'blur(0)', opacity: 1 }, { filter: 'blur(8px)', opacity: 0 }], { duration: 150 }).finished; }));
        S.forEach(function (s) { s.classList.add('k'); });
        await wait(300); if (my !== run) return;
        fill(P[k = (k + 1) % 4]); S.forEach(function (s) { s.classList.remove('k'); });
        if (!api.reduce) C.forEach(function (c) { c.animate([{ filter: 'blur(8px)', opacity: .3 }, { filter: 'blur(0)', opacity: 1 }], { duration: 320, easing: 'ease-out' }); });
        p.setAttribute('aria-busy', 'false');
      }
      fill(P[0]);
      p.addEventListener('click', load);
      T.push(setTimeout(load, 600));
      return function () { run++; T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'skeleton-bar-morph',
    cat: 'Loading & Skeleton',
    name: 'Bar Morph',
    source: SRC,
    trigger: 'tap',
    allowColor: true,
    motion: 'Saat memuat, garis bawah berwarna muncul di bawah setiap teks lalu menebal menjadi bar abu-abu. Saat data datang, avatar dan gambar muncul dulu, bar abu-abu menyusut tingginya menjadi garis bawah 2px bergradien, teks naik keluar dari garis (translateY 6px → 0), lalu garis memudar.',
    timing: 'bar ↔ garis 200ms ease-out · teks naik 180ms · garis pudar 200ms',
    use: 'Memuat daftar atau detail berisi banyak teks, misalnya ringkasan rekam medis atau feed artikel.',
    tags: TAGS + 'bar morph underline rise text',
    html: HTML,
    css: BASE +
      '& .t::before{transform-origin:50% 100%;transition:transform .2s cubic-bezier(.2,.8,.2,1),background .2s,opacity .2s}' +
      '& .post.ul .t::before{opacity:1;transform:scaleY(.18);background:linear-gradient(90deg,#6d5cf6,#3b9bff)}' +
      '& .post.ul .t.k::before{transform:none;background:var(--d-soft)}' +
      '& .c{transition:opacity .18s,transform .18s ease-out}& .t.k .c{transform:translateY(6px)}' +
      '& .av::before,& .im::before,& .av .c,& .im .c{transition:opacity .2s}',
    js: function (root, api) {
      var p = root.querySelector('.post'), S = [].slice.call(p.querySelectorAll('.s')), k = 0, run = 0, T = [];
      var P = [['SI', 'Sana Ito', '11m · Osaka', 'City after dark', 'Every window tells a story', '2.4k', '102', 265], ['JB', 'Jonah Bell', '17m · Lapland', 'Quiet lake night', 'Moonlight and pine trees', '659', '27', 205], ['MO', 'Mika Ono', '2m · Alps', 'Above the clouds', 'Sunrise from the ridge trail', '1.2k', '48', 320], ['TL', 'Theo Lane', '6m · Okinawa', 'Clear water day', 'Swam out to the reef at noon', '864', '31', 190]];
      var wait = function (ms) { return new Promise(function (r) { T.push(setTimeout(r, ms)); }); };
      function fill(d) { var v = [d[0], d[1], d[2], d[3], d[4], '♥ ' + d[5] + '    ○ ' + d[6], '']; S.forEach(function (s, i) { s.firstChild.textContent = v[i]; }); p.style.setProperty('--h', d[7]); }
      var set = function (on, sel) { S.forEach(function (s) { if (!sel || s.matches(sel)) s.classList.toggle('k', on); }); };
      async function load() {
        var my = ++run, d = api.reduce ? 0 : 1;
        p.classList.add('ul'); await wait(150 * d);
        set(true); await wait(500); if (my !== run) return;
        fill(P[k = (k + 1) % 4]);
        set(false, '.av,.im'); await wait(120 * d);
        set(false); await wait(380 * d); if (my !== run) return;
        p.classList.remove('ul');
      }
      fill(P[0]);
      p.addEventListener('click', load);
      T.push(setTimeout(load, 600));
      return function () { run++; T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'skeleton-type-reveal',
    cat: 'Loading & Skeleton',
    name: 'Type Reveal',
    source: SRC,
    trigger: 'tap',
    allowColor: true,
    motion: 'Kiriman meredup menjadi skeleton. Avatar dan gambar muncul lebih dulu, lalu setiap baris diketik bergantian dari atas ke bawah (nama, waktu, judul, deskripsi, statistik): caret berjalan di depan dan bar abu-abu di kanannya terpotong habis seiring huruf terisi.',
    timing: 'pudar 150ms · ketik ±14ms/huruf, baris berurutan · total ±1 dtk',
    use: 'Konten hasil AI atau ringkasan otomatis yang "ditulis" ke layar, misalnya ringkasan kunjungan pasien.',
    tags: TAGS + 'typewriter type caret reveal sequential lines',
    html: HTML,
    css: BASE + '& .s::before{clip-path:inset(0 0 0 calc(var(--p,0) * 100%) round 5px)}' +
      '& .s.ty .c{opacity:1}& .s.ty .c::after{content:"";display:inline-block;width:1.5px;height:1em;margin-left:1px;vertical-align:-2px;background:currentColor}',
    js: function (root, api) {
      var p = root.querySelector('.post'), S = [].slice.call(p.querySelectorAll('.s')), k = 0, run = 0, T = [];
      var P = [['SI', 'Sana Ito', '11m · Osaka', 'City after dark', 'Every window tells a story', '2.4k', '102', 265], ['JB', 'Jonah Bell', '17m · Lapland', 'Quiet lake night', 'Moonlight and pine trees', '659', '27', 205], ['MO', 'Mika Ono', '2m · Alps', 'Above the clouds', 'Sunrise from the ridge trail', '1.2k', '48', 320], ['TL', 'Theo Lane', '6m · Okinawa', 'Clear water day', 'Swam out to the reef at noon', '864', '31', 190]];
      var wait = function (ms) { return new Promise(function (r) { T.push(setTimeout(r, ms)); }); };
      function vals(d) { return [d[0], d[1], d[2], d[3], d[4], '♥ ' + d[5] + '    ○ ' + d[6], '']; }
      async function load() {
        var my = ++run, d = P[k = (k + 1) % 4], v = vals(d);
        if (!api.reduce) await p.animate([{ opacity: 1 }, { opacity: .4 }], { duration: 150 }).finished;
        S.forEach(function (s) { s.classList.add('k'); s.style.setProperty('--p', 0); });
        await wait(250); if (my !== run) return;
        p.style.setProperty('--h', d[7]); S[0].firstChild.textContent = v[0];
        S[0].classList.remove('k'); S[6].classList.remove('k');
        for (var i = 1; i < 6; i++) {
          var s = S[i], c = s.firstChild, txt = v[i];
          if (api.reduce) { c.textContent = txt; s.classList.remove('k'); continue; }
          s.classList.add('ty');
          for (var n = 0; n <= txt.length; n++) { c.textContent = txt.slice(0, n); s.style.setProperty('--p', n / txt.length); await wait(14); if (my !== run) return; }
          s.classList.remove('ty', 'k');
        }
      }
      var v0 = vals(P[0]); S.forEach(function (s, i) { s.firstChild.textContent = v0[i]; });
      p.addEventListener('click', load);
      T.push(setTimeout(load, 600));
      return function () { run++; T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'skeleton-mosaic-resolve',
    cat: 'Loading & Skeleton',
    name: 'Mosaic Resolve',
    source: SRC,
    trigger: 'tap',
    allowColor: true,
    motion: 'Kiriman lama memecah menjadi piksel kasar (4 → 8 → 12px) lalu menjadi blok skeleton berpiksel yang berkilau. Kiriman baru muncul dalam piksel 12px dan menajam bertahap 12 → 6 → 3px → tajam, bertangga (bukan halus).',
    timing: '3 langkah × 80ms keluar · kilau 600ms · 3 langkah × 80ms masuk (steps)',
    use: 'Memuat gambar atau kartu bergambar dengan kesan retro/digital, misalnya galeri hasil pemindaian.',
    tags: TAGS + 'mosaic pixelate pixel resolve steps svg filter',
    html: HTML,
    css: BASE + '& .post.sh .s::before{animation:skmz .3s steps(2) infinite alternate}@keyframes skmz{to{opacity:.45}}',
    js: function (root, api) {
      var p = root.querySelector('.post'), S = [].slice.call(p.querySelectorAll('.s')), k = 0, run = 0, T = [];
      var P = [['SI', 'Sana Ito', '11m · Osaka', 'City after dark', 'Every window tells a story', '2.4k', '102', 265], ['JB', 'Jonah Bell', '17m · Lapland', 'Quiet lake night', 'Moonlight and pine trees', '659', '27', 205], ['MO', 'Mika Ono', '2m · Alps', 'Above the clouds', 'Sunrise from the ridge trail', '1.2k', '48', 320], ['TL', 'Theo Lane', '6m · Okinawa', 'Clear water day', 'Swam out to the reef at noon', '864', '31', 190]];
      var wait = function (ms) { return new Promise(function (r) { T.push(setTimeout(r, ms)); }); };
      function fill(d) { var v = [d[0], d[1], d[2], d[3], d[4], '♥ ' + d[5] + '    ○ ' + d[6], '']; S.forEach(function (s, i) { s.firstChild.textContent = v[i]; }); p.style.setProperty('--h', d[7]); }
      // pixelate filter (unique id per mount): flood a dot every N px, keep source pixels under it, dilate to N×N blocks
      var id = 'mz' + Math.random().toString(36).slice(2, 8), ns = 'http://www.w3.org/2000/svg';
      var svg = document.createElementNS(ns, 'svg'); svg.setAttribute('width', 0); svg.setAttribute('height', 0); svg.style.position = 'absolute';
      svg.innerHTML = '<filter id="' + id + '" x="0" y="0" width="1" height="1"><feFlood x="0" y="0" width="1" height="1"/><feComposite class="cp" width="8" height="8"/><feTile result="a"/><feComposite in="SourceGraphic" in2="a" operator="in"/><feMorphology class="mo" operator="dilate" radius="4"/></filter>';
      root.appendChild(svg);
      function px(n) {
        if (!n) { p.style.filter = ''; return; }
        svg.querySelector('.cp').setAttribute('width', n); svg.querySelector('.cp').setAttribute('height', n);
        svg.querySelector('.mo').setAttribute('radius', n / 2); p.style.filter = 'url(#' + id + ')';
      }
      async function load() {
        var my = ++run;
        if (api.reduce) { fill(P[k = (k + 1) % 4]); return; }
        for (var a = [4, 8, 12], i = 0; i < 3; i++) { px(a[i]); await wait(80); if (my !== run) return; }
        S.forEach(function (s) { s.classList.add('k'); }); p.classList.add('sh'); px(6);
        await wait(600); if (my !== run) return;
        fill(P[k = (k + 1) % 4]); p.classList.remove('sh'); S.forEach(function (s) { s.classList.remove('k'); });
        for (a = [12, 6, 3, 0], i = 0; i < 4; i++) { px(a[i]); await wait(80); if (my !== run) return; }
      }
      fill(P[0]);
      p.addEventListener('click', load);
      T.push(setTimeout(load, 600));
      return function () { run++; T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'skeleton-flip-tiles',
    cat: 'Loading & Skeleton',
    name: 'Flip Tiles',
    source: SRC,
    trigger: 'tap',
    allowColor: true,
    motion: 'Setiap blok berputar seperti kartu pada sumbu horizontal (rotateX 0 → 90°, ganti sisi, 90° → 0): saat memuat sisi konten berganti ke sisi abu-abu dari atas ke bawah, lalu kiriman baru membalik kembali berurutan avatar → nama → gambar → waktu → judul → deskripsi → statistik.',
    timing: 'flip tiap blok 100ms · stagger 35ms atas → bawah · tahan skeleton 330ms',
    use: 'Memuat dasbor berisi banyak kartu atau ubin angka, misalnya ubin statistik harian klinik.',
    tags: TAGS + 'flip tiles rotateX stagger card',
    html: HTML,
    css: BASE + '& .post{perspective:400px}',
    js: function (root, api) {
      var p = root.querySelector('.post'), S = [].slice.call(p.querySelectorAll('.s')), k = 0, run = 0, T = [];
      var P = [['SI', 'Sana Ito', '11m · Osaka', 'City after dark', 'Every window tells a story', '2.4k', '102', 265], ['JB', 'Jonah Bell', '17m · Lapland', 'Quiet lake night', 'Moonlight and pine trees', '659', '27', 205], ['MO', 'Mika Ono', '2m · Alps', 'Above the clouds', 'Sunrise from the ridge trail', '1.2k', '48', 320], ['TL', 'Theo Lane', '6m · Okinawa', 'Clear water day', 'Swam out to the reef at noon', '864', '31', 190]];
      var wait = function (ms) { return new Promise(function (r) { T.push(setTimeout(r, ms)); }); };
      function fill(d) { var v = [d[0], d[1], d[2], d[3], d[4], '♥ ' + d[5] + '    ○ ' + d[6], '']; S.forEach(function (s, i) { s.firstChild.textContent = v[i]; }); p.style.setProperty('--h', d[7]); }
      var OUT = [0, 1, 6, 2, 3, 4, 5], IN = [0, 1, 6, 2, 3, 4, 5]; // av, nm, im, mt, ti, sb, st
      function flip(s, toK, delay) {
        if (api.reduce) { s.classList.toggle('k', toK); return; }
        s.animate([{ transform: 'rotateX(0)' }, { transform: 'rotateX(90deg)' }], { duration: 50, delay: delay, easing: 'ease-in', fill: 'forwards' }).onfinish = function () {
          s.classList.toggle('k', toK);
          s.animate([{ transform: 'rotateX(-90deg)' }, { transform: 'none' }], { duration: 50, easing: 'ease-out', fill: 'forwards' });
        };
      }
      async function load() {
        var my = ++run;
        OUT.forEach(function (i, n) { flip(S[i], true, n * 35); });
        await wait(7 * 35 + 100 + 330); if (my !== run) return;
        fill(P[k = (k + 1) % 4]);
        IN.forEach(function (i, n) { flip(S[i], false, n * 35); });
      }
      fill(P[0]);
      p.addEventListener('click', load);
      T.push(setTimeout(load, 600));
      return function () { run++; T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'skeleton-comet-outline',
    cat: 'Loading & Skeleton',
    name: 'Comet Outline',
    source: SRC,
    trigger: 'tap',
    allowColor: true,
    motion: 'Kiriman memudar ke skeleton, lalu pada semua blok sekaligus seberkas cahaya aksen menelusuri garis tepinya (stroke-dashoffset, mulai dari tepi kanan) sampai lingkarannya tertutup dan berpendar. Konten baru lalu mengisi dari dalam dan garis tepi memudar.',
    timing: 'pudar 150ms · telusur 400ms ease-in-out · isi 200ms · garis pudar 250ms',
    use: 'Status "sedang menyiapkan" yang terasa aktif, misalnya saat sistem menyusun laporan atau hasil lab.',
    tags: TAGS + 'comet outline stroke trace glow dashoffset svg',
    html: HTML,
    css: BASE + '& .s svg{position:absolute;inset:-2px;width:calc(100% + 4px);height:calc(100% + 4px);overflow:visible;fill:none;stroke:var(--d-accent);stroke-width:1.6;filter:drop-shadow(0 0 3px var(--d-accent));pointer-events:none}',
    js: function (root, api) {
      var p = root.querySelector('.post'), S = [].slice.call(p.querySelectorAll('.s')), k = 0, run = 0, T = [];
      var P = [['SI', 'Sana Ito', '11m · Osaka', 'City after dark', 'Every window tells a story', '2.4k', '102', 265], ['JB', 'Jonah Bell', '17m · Lapland', 'Quiet lake night', 'Moonlight and pine trees', '659', '27', 205], ['MO', 'Mika Ono', '2m · Alps', 'Above the clouds', 'Sunrise from the ridge trail', '1.2k', '48', 320], ['TL', 'Theo Lane', '6m · Okinawa', 'Clear water day', 'Swam out to the reef at noon', '864', '31', 190]];
      var wait = function (ms) { return new Promise(function (r) { T.push(setTimeout(r, ms)); }); };
      function fill(d) { var v = [d[0], d[1], d[2], d[3], d[4], '♥ ' + d[5] + '    ○ ' + d[6], '']; S.forEach(function (s, i) { s.firstChild.textContent = v[i]; }); p.style.setProperty('--h', d[7]); }
      // one outline per slot; rect drawn from the right-middle edge (path starts there)
      S.forEach(function (s) {
        var w = s.offsetWidth + 4, h = s.offsetHeight + 4, r = s.matches('.av') ? h / 2 : s.matches('.im') ? 11 : Math.min(8, h / 2);
        s.insertAdjacentHTML('beforeend', '<svg viewBox="0 0 ' + w + ' ' + h + '"><path pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" opacity="0" d="M' + (w - 1) + ' ' + h / 2 + 'V' + (h - 1 - r) + 'A' + r + ' ' + r + ' 0 0 1 ' + (w - 1 - r) + ' ' + (h - 1) + 'H' + (1 + r) + 'A' + r + ' ' + r + ' 0 0 1 1 ' + (h - 1 - r) + 'V' + (1 + r) + 'A' + r + ' ' + r + ' 0 0 1 ' + (1 + r) + ' 1H' + (w - 1 - r) + 'A' + r + ' ' + r + ' 0 0 1 ' + (w - 1) + ' ' + (1 + r) + 'Z"/></svg>');
      });
      async function load() {
        var my = ++run, L = S.map(function (s) { return s.querySelector('path'); });
        if (!api.reduce) await Promise.all(S.map(function (s) { return s.firstChild.animate({ opacity: [1, 0] }, 150).finished; }));
        S.forEach(function (s) { s.classList.add('k'); });
        if (!api.reduce) await Promise.all(L.map(function (l) { return l.animate([{ strokeDashoffset: 100, opacity: 1 }, { strokeDashoffset: 0, opacity: 1 }], { duration: 400, easing: 'ease-in-out', fill: 'forwards' }).finished; }));
        if (my !== run) return;
        fill(P[k = (k + 1) % 4]); S.forEach(function (s) { s.classList.remove('k'); });
        if (api.reduce) return;
        S.forEach(function (s) { s.firstChild.animate([{ opacity: 0, transform: 'scale(.96)' }, { opacity: 1, transform: 'none' }], { duration: 200, easing: 'ease-out' }); });
        L.forEach(function (l) { l.animate([{ strokeDashoffset: 0, opacity: 1 }, { strokeDashoffset: 0, opacity: 0 }], { duration: 250, delay: 150, fill: 'forwards' }); });
      }
      fill(P[0]);
      p.addEventListener('click', load);
      T.push(setTimeout(load, 600));
      return function () { run++; T.forEach(clearTimeout); };
    }
  });
})();
