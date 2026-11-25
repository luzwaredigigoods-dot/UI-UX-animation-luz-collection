/* Carousel · Part 1 — pill dots, snap peek, cover scale, story bars, parallax, page counter.
   Scenes (Mountains / Ocean / Garden / City) are drawn with CSS gradients. */
(function () {
  var src = 'Carousel · Part 1';
  var cat = 'Kartu & Konten';
  var scenes =
    '& .mt{background:radial-gradient(circle at 68% 34%,#ffc27a 0 10%,transparent 11%),linear-gradient(150deg,transparent 58%,#3b2a7a 59%),linear-gradient(210deg,transparent 52%,#4a3592 53%),linear-gradient(#5b3fb8,#c06bd6)}' +
    '& .oc{background:radial-gradient(circle at 30% 30%,#fff 0 5%,transparent 6%),repeating-linear-gradient(170deg,transparent 0 9px,rgba(255,255,255,.08) 9px 11px),linear-gradient(#1b2f7a,#2f6fe0)}' +
    '& .gd{background:radial-gradient(circle at 35% 58%,#ff6b9a 0 8%,transparent 9%),radial-gradient(circle at 66% 40%,#ffd24a 0 10%,transparent 11%),radial-gradient(circle at 52% 76%,#ff9ac0 0 6%,transparent 7%),linear-gradient(#17493a,#1f7a55)}' +
    '& .ct{background:radial-gradient(circle at 80% 22%,#ffe08a 0 6%,transparent 7%),linear-gradient(to top,#1c1240 0 40%,transparent 40%),repeating-linear-gradient(90deg,#2a1c5c 0 14px,transparent 14px 22px) bottom/100% 70% no-repeat,linear-gradient(#3a2470,#b0479a)}' +
    '& .sc{position:relative;border-radius:14px;overflow:hidden;color:#fff;flex:none}& .sc b{position:absolute;left:10px;bottom:8px;font-size:11px}';
  var four = function (w) { return ['mt', 'oc', 'gd', 'ct'].map(function (c, i) { return '<div class="sc ' + c + '" style="width:' + w + 'px"><b>' + ['Mountains', 'Ocean', 'Garden', 'City'][i] + '</b></div>'; }).join(''); };

  LUZ.add({
    id: 'carousel1-pill-dots', cat: cat, name: 'Pill Dots', source: src, trigger: 'tap', allowColor: true,
    motion: 'Kartu bergeser horizontal satu langkah (180px) dengan tetangga mengintip. Pada indikator, titik aktif melebar dari 6px menjadi pill 18px (clip-path) dan berwarna aksen, sementara pill sebelumnya menyusut kembali menjadi titik abu.',
    timing: 'kartu ≈400ms cubic-bezier(.2,.8,.2,1) · titik ≈300ms ease',
    use: 'carousel banner atau tips kesehatan di beranda aplikasi',
    tags: 'carousel pill dots indicator pagination stretch',
    html: '<div class="pd"><div class="vp"><div class="tr">' + four(170) + '</div></div><div class="dots"><i class="on"></i><i></i><i></i><i></i></div></div>',
    css: scenes + '& .pd{display:grid;gap:10px;width:100%}& .vp{overflow:hidden;cursor:pointer}& .tr{display:flex;gap:10px;height:104px;padding-left:calc(50% - 85px)}' +
      '& .dots{display:flex;justify-content:center}& .dots i{width:18px;height:6px;background:var(--d-mid);clip-path:inset(0 6px round 3px);transition:clip-path .3s ease,background .3s}& .dots i.on{clip-path:inset(0 0 round 3px);background:var(--d-accent)}',
    js: function (root, api) {
      var tr = root.querySelector('.tr'), ds = root.querySelectorAll('.dots i'), i = 0, t = [];
      function go(n) {
        var from = new DOMMatrix(getComputedStyle(tr).transform).m41; i = (n + 4) % 4;
        tr.style.transform = 'translateX(' + -i * 180 + 'px)';
        tr.animate([{ transform: 'translateX(' + from + 'px)' }, { transform: tr.style.transform }], { duration: api.reduce ? 1 : 400, easing: 'cubic-bezier(.2,.8,.2,1)' });
        ds.forEach(function (d, j) { d.classList.toggle('on', j === i); });
      }
      root.querySelector('.vp').onclick = function () { go(i + 1); };
      ds.forEach(function (d, j) { d.onclick = function () { go(j); }; });
      t.push(setTimeout(function () { go(1); }, 600), setTimeout(function () { go(2); }, 1500));
      return function () { t.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'carousel1-snap-peek', cat: cat, name: 'Snap Peek', source: src, trigger: 'drag', allowColor: true,
    motion: 'Kartu tengah ukuran penuh, kartu tetangga mengintip di sisi dengan scale 0.9 dan redup. Seret: jalur mengikuti jari; lepas lewat 40px maka menempel ke kartu berikut dengan pegas yang lewat ±8px lalu diam, kartu baru membesar ke 1 dan terang.',
    timing: 'ikut jari · snap ≈480ms cubic-bezier(.34,1.35,.64,1)',
    use: 'pemilih kartu (mis. paket layanan atau dokter) yang digeser satu per satu',
    tags: 'carousel snap peek spring drag swipe neighbors scale',
    html: '<div class="vp"><div class="tr">' + four(150) + '</div></div>',
    css: scenes + '& .vp{width:100%;overflow:hidden;touch-action:pan-y;cursor:grab}& .tr{display:flex;gap:12px;height:110px;padding-left:calc(50% - 75px)}' +
      '& .tr .sc{transform:scale(.9);filter:brightness(.6);transition:transform .45s cubic-bezier(.34,1.35,.64,1),filter .45s}& .tr .sc.on{transform:none;filter:none}',
    js: function (root, api) {
      var tr = root.querySelector('.tr'), cs = tr.children, i = 0, x0 = null, base = 0, t = [];
      function cur() { return new DOMMatrix(getComputedStyle(tr).transform).m41; }
      function go(n, from) {
        i = Math.max(0, Math.min(3, n)); if (from === undefined) from = cur();
        tr.getAnimations().forEach(function (a) { a.cancel(); });
        tr.style.transform = 'translateX(' + -i * 162 + 'px)';
        tr.animate([{ transform: 'translateX(' + from + 'px)' }, { transform: tr.style.transform }], { duration: api.reduce ? 1 : 480, easing: 'cubic-bezier(.34,1.35,.64,1)' });
        [].forEach.call(cs, function (c, j) { c.classList.toggle('on', j === i); });
      }
      var vp = root.querySelector('.vp');
      vp.addEventListener('pointerdown', function (e) { base = cur(); tr.getAnimations().forEach(function (a) { a.cancel(); }); tr.style.transform = 'translateX(' + base + 'px)'; x0 = e.clientX; vp.setPointerCapture(e.pointerId); });
      vp.addEventListener('pointermove', function (e) { if (x0 !== null) tr.style.transform = 'translateX(' + (base + e.clientX - x0) + 'px)'; });
      vp.addEventListener('pointerup', function (e) {
        if (x0 === null) return; var dx = e.clientX - x0; x0 = null;
        go(Math.abs(dx) < 5 ? (i + 1) % 4 : dx < -40 ? i + 1 : dx > 40 ? i - 1 : i, base + dx);
      });
      go(0, 0);
      t.push(setTimeout(function () { go(1); }, 600), setTimeout(function () { go(2); }, 1500));
      return function () { t.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'carousel1-cover-scale', cat: cat, name: 'Cover Scale', source: src, trigger: 'tap', allowColor: true,
    motion: 'Gaya coverflow: kartu tengah besar dan terang; kartu samping scale 0.78, rotateY ±28° menghadap ke dalam, bergeser ±78px dan redup 50%. Ketuk kanan/kiri: semua kartu bergeser bersama, kartu baru tegak, membesar dan terang.',
    timing: '≈460ms cubic-bezier(.65,0,.35,1) · perspektif 600px',
    use: 'pemilih album, template laporan, atau sampul dengan fokus pada satu item',
    tags: 'carousel coverflow cover scale tilt rotateY 3d center focus',
    html: '<div class="cf">' + four(110) + '</div>',
    css: scenes + '& .cf{position:relative;width:100%;height:130px;perspective:600px;cursor:pointer}& .cf .sc{position:absolute;left:calc(50% - 55px);top:10px;height:110px;transition:transform 460ms cubic-bezier(.65,0,.35,1),filter 460ms,opacity 460ms}',
    js: function (root, api) {
      var cf = root.querySelector('.cf'), cs = cf.children, i = 1, t = [];
      if (api.reduce) [].forEach.call(cs, function (c) { c.style.transition = 'none'; });
      function draw() {
        [].forEach.call(cs, function (c, j) {
          var d = j - i;
          c.style.transform = 'translateX(' + d * 78 + 'px) rotateY(' + -d * 28 + 'deg) scale(' + (d ? 0.78 : 1) + ')';
          c.style.filter = d ? 'brightness(.5)' : 'none'; c.style.zIndex = 10 - Math.abs(d); c.style.opacity = Math.abs(d) > 1 ? 0 : 1;
        });
      }
      cf.onclick = function (e) { var r = cf.getBoundingClientRect(); i = Math.max(0, Math.min(3, i + (e.clientX - r.left < r.width / 2 ? -1 : 1))); draw(); };
      draw();
      t.push(setTimeout(function () { i = 2; draw(); }, 600), setTimeout(function () { i = 1; draw(); }, 1600));
      return function () { t.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'carousel1-story-bars', cat: cat, name: 'Story Bars', source: src, trigger: 'tap', allowColor: true,
    motion: 'Cerita penuh dengan bar progres bersegmen di atas. Bar aktif terisi linear dari kiri ke kanan (scaleX 0 → 1) lalu otomatis pindah ke cerita berikut. Ketuk kanan = maju (bar sekarang langsung penuh), ketuk kiri = mundur (bar dikosongkan). Gambar baru masuk dengan crossfade + scale 1.04 → 1.',
    timing: 'bar 3000ms linear per cerita · ganti gambar 260ms ease-out',
    use: 'pengumuman/edukasi pasien berformat story, atau tur fitur baru',
    tags: 'story bars progress segmented auto advance instagram stories',
    html: '<div class="sb"><div class="bars"><i><s></s></i><i><s></s></i><i><s></s></i><i><s></s></i></div><div class="who"><i></i>Mia · 2h</div><div class="sc mt"><b>Mountains</b></div></div>',
    css: scenes + '& .sb{position:relative;width:200px;height:150px;border-radius:14px;overflow:hidden;cursor:pointer}& .sb .sc{position:absolute;inset:0;border-radius:0}' +
      '& .bars{position:absolute;left:8px;right:8px;top:7px;display:flex;gap:4px;z-index:2}& .bars i{flex:1;height:3px;border-radius:2px;background:rgba(255,255,255,.35);overflow:hidden}' +
      '& .bars s{display:block;height:100%;background:#fff;transform:scaleX(0);transform-origin:left}' +
      '& .who{position:absolute;left:8px;top:16px;z-index:2;display:flex;gap:5px;align-items:center;color:#fff;font-size:9px}& .who i{width:14px;height:14px;border-radius:50%;background:var(--d-accent)}',
    js: function (root, api) {
      var S = [['mt', 'Mountains'], ['oc', 'Ocean'], ['gd', 'Garden'], ['ct', 'City']];
      var sb = root.querySelector('.sb'), sc = root.querySelector('.sc'), bars = root.querySelectorAll('.bars s'), i = 0, run, t = [];
      function show(n) {
        i = (n + 4) % 4;
        bars.forEach(function (b, j) { b.getAnimations().forEach(function (a) { a.cancel(); }); b.style.transform = j < i ? 'none' : 'scaleX(0)'; });
        sc.className = 'sc ' + S[i][0]; sc.firstChild.textContent = S[i][1];
        sc.animate([{ opacity: 0, transform: 'scale(1.04)' }, { opacity: 1, transform: 'none' }], { duration: api.reduce ? 1 : 260, easing: 'ease-out' });
        run = bars[i].animate([{ transform: 'scaleX(0)' }, { transform: 'none' }], { duration: 3000, easing: 'linear', fill: 'forwards' });
        run.onfinish = function () { show(i + 1); };
      }
      sb.onclick = function (e) { var r = sb.getBoundingClientRect(); show(i + (e.clientX - r.left < r.width / 3 ? -1 : 1)); };
      t.push(setTimeout(function () { show(0); }, 300));
      return function () { t.forEach(clearTimeout); if (run) run.onfinish = null; };
    }
  });

  LUZ.add({
    id: 'carousel1-parallax', cat: cat, name: 'Parallax', source: src, trigger: 'tap', allowColor: true,
    motion: 'Saat kartu bergeser satu langkah, gambar di dalam kartu digeser balik 50% dari gerak bingkainya (maks ±90px), sehingga gambar tertinggal dan terasa punya kedalaman. Label "n of 4" ikut berganti.',
    timing: '≈520ms cubic-bezier(.2,.8,.2,1) · faktor paralaks 0.5',
    use: 'galeri hero atau kartu destinasi/fasilitas yang ingin terasa premium',
    tags: 'carousel parallax depth image layer slide speed',
    html: '<div class="px"><div class="vp"><div class="tr">' + ['mt', 'oc', 'gd', 'ct'].map(function (c, i) { return '<div class="cd"><div class="sc ' + c + ' in"></div><b>' + ['Mountains', 'Ocean', 'Garden', 'City'][i] + '</b><small>' + (i + 1) + ' of 4</small></div>'; }).join('') + '</div></div></div>',
    css: scenes + '& .px{width:100%;min-width:0;overflow:hidden}& .vp{overflow:hidden;cursor:pointer}& .tr{display:flex;gap:10px;height:120px;padding-left:calc(50% - 85px)}' +
      '& .cd{position:relative;flex:none;width:170px;border-radius:14px;overflow:hidden;color:#fff}& .cd .in{position:absolute;inset:0 -90px;border-radius:0}' +
      '& .cd b{position:absolute;left:10px;bottom:8px;font-size:11px}& .cd small{position:absolute;right:10px;bottom:9px;font-size:8.5px;opacity:.8}',
    js: function (root, api) {
      var tr = root.querySelector('.tr'), ins = root.querySelectorAll('.in'), pos = 0, raf, t = [];
      function draw(p) { // p = current slide position (can be fractional)
        tr.style.transform = 'translateX(' + -p * 180 + 'px)';
        ins.forEach(function (n, j) { n.style.transform = 'translateX(' + Math.max(-1, Math.min(1, p - j)) * 180 * 0.5 + 'px)'; });
      }
      function go(n) {
        var a = pos, b = (n + 4) % 4, t0 = performance.now(), D = api.reduce ? 1 : 520;
        cancelAnimationFrame(raf);
        (function f(now) { var q = Math.min(1, (now - t0) / D), e = 1 - Math.pow(1 - q, 3); pos = a + (b - a) * e; draw(pos); if (q < 1) raf = requestAnimationFrame(f); })(t0);
      }
      draw(0);
      root.querySelector('.vp').onclick = function () { go(Math.round(pos) + 1); };
      t.push(setTimeout(function () { go(1); }, 600), setTimeout(function () { go(2); }, 1600));
      return function () { t.forEach(clearTimeout); cancelAnimationFrame(raf); };
    }
  });

  LUZ.add({
    id: 'carousel1-page-counter', cat: cat, name: 'Page Counter', source: src, trigger: 'tap', allowColor: true,
    motion: 'Kartu bergeser ke slide berikut; di sampingnya angka halaman besar bergulir vertikal (angka lama naik keluar, baru masuk dari bawah; mundur = arah terbalik), nama slide crossfade, dan garis progres biru memanjang ke n/4 (scaleX).',
    timing: 'kartu ≈420ms · gulir angka ≈320ms cubic-bezier(.2,.8,.2,1) · garis 320ms ease-out',
    use: 'galeri bernomor atau langkah panduan yang perlu menunjukkan posisi (2/4)',
    tags: 'carousel page counter number roll progress line pagination',
    html: '<div class="pc"><div class="vp"><div class="tr">' + four(140) + '</div></div><div class="ix"><div class="nm"><span class="roll"><b>1</b></span><small>/4</small></div><span class="lb">Mountains</span><i class="ln"><s></s></i></div></div>',
    css: scenes + '& .pc{display:flex;gap:12px;align-items:center}& .vp{width:140px;overflow:hidden;border-radius:14px;cursor:pointer}& .tr{display:flex;height:100px}' +
      '& .ix{display:grid;gap:4px;width:60px}& .nm{display:flex;align-items:baseline;gap:2px}& .nm small{color:var(--d-mid)}' +
      '& .roll{display:inline-grid;overflow:hidden;height:30px;font-size:26px;line-height:30px}& .roll b{grid-area:1/1}' +
      '& .lb{font-size:10px;color:var(--d-mid)}& .ln{height:3px;border-radius:2px;background:var(--d-soft)}& .ln s{display:block;height:100%;border-radius:2px;background:var(--d-accent);transform-origin:left;transform:scaleX(.25);transition:transform 320ms ease-out}',
    js: function (root, api) {
      var N = ['Mountains', 'Ocean', 'Garden', 'City'], tr = root.querySelector('.tr'), roll = root.querySelector('.roll'), lb = root.querySelector('.lb'), i = 0, t = [], k = api.reduce ? 0.01 : 1;
      function go(n) {
        n = (n + 4) % 4; if (n === i) return;
        var dir = n > i ? 1 : -1, from = new DOMMatrix(getComputedStyle(tr).transform).m41; i = n;
        tr.style.transform = 'translateX(' + -n * 140 + 'px)';
        tr.animate([{ transform: 'translateX(' + from + 'px)' }, { transform: tr.style.transform }], { duration: 420 * k, easing: 'cubic-bezier(.2,.8,.2,1)' });
        var old = roll.lastElementChild, nw = document.createElement('b'); nw.textContent = n + 1; roll.appendChild(nw);
        var o = { duration: 320 * k, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'both' };
        old.animate([{ transform: 'none', opacity: 1 }, { transform: 'translateY(' + -100 * dir + '%)', opacity: 0 }], o).onfinish = function () { old.remove(); };
        nw.animate([{ transform: 'translateY(' + 100 * dir + '%)', opacity: 0 }, { transform: 'none', opacity: 1 }], o);
        lb.animate([{ opacity: 1 }, { opacity: 0 }, { opacity: 1 }], { duration: 320 * k }); t.push(setTimeout(function () { lb.textContent = N[n]; }, 160 * k));
        root.querySelector('.ln s').style.transform = 'scaleX(' + (n + 1) / 4 + ')';
      }
      root.querySelector('.vp').onclick = function () { go(i + 1); };
      t.push(setTimeout(function () { go(1); }, 600), setTimeout(function () { go(2); }, 1500));
      return function () { t.forEach(clearTimeout); };
    }
  });
})();
