/* Rating · Part 2 — star bounce, score pill (NPS), mood gauge, score fly, rating tags, score wheel. */
(function () {
  var src = 'Rating · Part 2';
  var cat = 'Input & Form';
  var STAR = '<svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true"><path d="M12 2.5l2.9 6 6.6.8-4.9 4.6 1.3 6.5L12 17.2l-5.9 3.2 1.3-6.5L2.5 9.3l6.6-.8z"/></svg>';
  var starCss = '& .st{display:inline-block;border:0;background:none;padding:0;cursor:pointer}& .st svg{fill:none;stroke:var(--d-mid);stroke-width:1.5;stroke-linejoin:round;transition:fill .15s,stroke .15s}& .st.on svg{fill:#ffc53d;stroke:#ffc53d}';
  function stars(n, size) { var s = ''; for (var i = 0; i < n; i++) s += '<button type="button" class="st" style="width:' + size + 'px;height:' + size + 'px" aria-label="' + (i + 1) + ' star">' + STAR + '</button>'; return s; }

  LUZ.add({
    id: 'rating-star-bounce', cat: cat, name: 'Star Bounce', source: src, trigger: 'tap', allowColor: true,
    motion: 'Ketuk bintang ke-5: bintang terisi kuning dari kiri ke kanan dengan jeda 70ms; tiap bintang melompat (translateY −8px, scale 1.25) saat terisi. Bintang terakhir juga berputar 360° dan memancarkan 10 titik confetti warna-warni ke segala arah, lalu label "Amazing!" pop di atas.',
    timing: 'tiap hop 320ms cubic-bezier(.34,1.56,.64,1) · stagger 70ms · confetti 600ms ease-out · total ≈900ms',
    use: 'rating kepuasan layanan setelah kunjungan, memberi rasa senang saat memberi 5 bintang',
    tags: 'rating stars bounce hop confetti burst spin feedback',
    html: '<div class="sbx"><b class="lb">Tap to rate</b><div class="row">' + stars(5, 30) + '</div></div>',
    css: starCss + '& .sbx{position:relative;display:grid;gap:10px;justify-items:center}& .row{display:flex;gap:6px}& .lb{font-size:12px;color:var(--d-mid);height:16px}& .lb.ok{color:#ffc53d}' +
      '& .cf{position:absolute;width:5px;height:5px;border-radius:50%;pointer-events:none}',
    js: function (root, api) {
      var ss = root.querySelectorAll('.st'), lb = root.querySelector('.lb'), box = root.querySelector('.sbx'), t = [], k = api.reduce ? 0.01 : 1;
      var C = ['#ff6b9a', '#ffc53d', '#3fa9ff', '#2fbf8f', '#a879ff'];
      function rate(n) {
        t.forEach(clearTimeout); t = [];
        ss.forEach(function (s) { s.classList.remove('on'); });
        lb.textContent = 'Tap to rate'; lb.classList.remove('ok');
        ss.forEach(function (s, i) {
          if (i >= n) return;
          t.push(setTimeout(function () {
            s.classList.add('on');
            s.animate([{ transform: 'none' }, { transform: 'translateY(-8px) scale(1.25)' + (i === 4 ? ' rotate(180deg)' : '') }, { transform: i === 4 ? 'rotate(360deg)' : 'none' }], { duration: 320 * k, easing: 'cubic-bezier(.34,1.56,.64,1)' });
            if (i === 4) burst(s);
          }, i * 70 * k));
        });
        if (n === 5) t.push(setTimeout(function () { lb.textContent = 'Amazing!'; lb.classList.add('ok'); lb.animate([{ transform: 'scale(.6)', opacity: 0 }, { transform: 'scale(1.15)', opacity: 1 }, { transform: 'none' }], { duration: 300 * k }); }, 360 * k));
      }
      function burst(s) {
        var r = s.getBoundingClientRect(), b = box.getBoundingClientRect();
        for (var i = 0; i < 10; i++) {
          var d = document.createElement('i'), a = i / 10 * Math.PI * 2; d.className = 'cf'; d.style.background = C[i % 5];
          d.style.left = r.left - b.left + r.width / 2 + 'px'; d.style.top = r.top - b.top + r.height / 2 + 'px'; box.appendChild(d);
          d.animate([{ transform: 'none', opacity: 1 }, { transform: 'translate(' + Math.cos(a) * 26 + 'px,' + Math.sin(a) * 26 + 'px) scale(.4)', opacity: 0 }], { duration: 600 * k, easing: 'ease-out' }).onfinish = function () { this.effect.target.remove(); };
        }
      }
      ss.forEach(function (s, i) { s.onclick = function () { rate(i + 1); }; });
      t.push(setTimeout(function () { rate(5); }, 600));
      return function () { t.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'rating-score-pill', cat: cat, name: 'Score Pill', source: src, trigger: 'tap', allowColor: true,
    motion: 'Deret angka 0–10. Ketuk satu angka: sorotan berbentuk pill meluncur ke angka itu dengan pegas, warnanya berubah sesuai suasana (0–6 merah muda, 7–8 kuning "Good", 9–10 hijau toska "Love it!"), dan label di atasnya ikut meluncur serta berganti teks.',
    timing: 'pill ≈340ms cubic-bezier(.34,1.56,.64,1) · warna 250ms',
    use: 'survei NPS / kemungkinan merekomendasikan klinik (0–10)',
    tags: 'rating nps score pill slide spring color mood 0-10',
    html: '<div class="np"><div class="trk"><i class="hl"></i><span class="tag">Good</span>' + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function (n) { return '<button type="button">' + n + '</button>'; }).join('') + '</div><div class="ax"><small>Not likely</small><small>Very likely</small></div></div>',
    css: '& .np{display:grid;gap:6px}& .trk{position:relative;display:flex;gap:2px;padding-top:30px}' +
      '& .trk button{position:relative;z-index:1;width:18px;height:24px;border:0;border-radius:6px;background:var(--d-soft);color:var(--d-fg);font:600 9px inherit;cursor:pointer;padding:0}' +
      '& .hl{position:absolute;left:0;top:30px;width:18px;height:24px;border-radius:6px;z-index:2;pointer-events:none;transition:background .25s;mix-blend-mode:normal}' +
      '& .tag{position:absolute;top:0;left:-16px;width:50px;white-space:nowrap;height:20px;border-radius:99px;font-size:9px;font-weight:600;display:grid;place-items:center;transition:background .25s,color .25s}' +
      '& .ax{display:flex;justify-content:space-between;color:var(--d-mid);font-size:8.5px}& .trk button.on{color:#1a1200;z-index:3;background:none}',
    js: function (root, api) {
      var bs = root.querySelectorAll('.trk button'), hl = root.querySelector('.hl'), tag = root.querySelector('.tag'), t = [];
      function mood(n) { return n >= 9 ? ['#2fd1a8', 'Love it!'] : n >= 7 ? ['#ffc53d', 'Good'] : n >= 4 ? ['#ff9a5c', 'Okay'] : ['#ff6b9a', 'Not great']; }
      function pick(n) {
        var m = mood(n), x = n * 20, o = { duration: api.reduce ? 1 : 340, easing: 'cubic-bezier(.34,1.56,.64,1)' };
        [hl, tag].forEach(function (e) { var from = getComputedStyle(e).transform; e.style.transform = 'translateX(' + x + 'px)'; e.animate([{ transform: from === 'none' ? 'translateX(0)' : from }, { transform: e.style.transform }], o); });
        hl.style.background = m[0]; tag.style.background = m[0]; tag.style.color = '#1a1200'; tag.textContent = m[1];
        bs.forEach(function (b, i) { b.classList.toggle('on', i === n); });
      }
      bs.forEach(function (b, i) { b.onclick = function () { pick(i); }; });
      pick(8);
      t.push(setTimeout(function () { pick(10); }, 600), setTimeout(function () { pick(3); }, 1600));
      return function () { t.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'rating-mood-gauge', cat: cat, name: 'Mood Gauge', source: src, trigger: 'drag', allowColor: true,
    motion: 'Gauge setengah lingkaran berwarna ungu → toska → kuning. Seret ujung jarum di sepanjang busur: jarum berputar mengikuti jari (−90° sampai +90°), warna wajah di tengah berubah, mulutnya melengkung dari cemberut ke senyum (path morph), dan label berganti Awful / Bad / Okay / Good / Love it!.',
    timing: 'ikut jari tanpa delay · autoplay sapuan 900ms ease-in-out · label crossfade saat berganti zona',
    use: 'skala nyeri, suasana hati, atau kepuasan pasien yang diisi dengan menggeser',
    tags: 'rating mood gauge dial needle drag face emoji slider',
    html: '<div class="mg"><svg viewBox="0 0 120 70" width="150" height="88"><path class="ar" d="M12 62a48 48 0 0 1 96 0"/><path class="ac" pathLength="100" d="M12 62a48 48 0 0 1 96 0"/><g class="nd"><line x1="60" y1="62" x2="60" y2="22"/><circle cx="60" cy="18" r="6"/></g><circle class="fc" cx="60" cy="44" r="11"/><circle class="ey" cx="56" cy="42" r="1.3"/><circle class="ey" cx="64" cy="42" r="1.3"/><path class="mo" d="M55 49 Q60 45 65 49"/><circle cx="60" cy="62" r="3" class="hub"/></svg><div class="tx"><b>Awful</b><small>Your mood</small></div></div>',
    css: '& .mg{display:flex;align-items:center;gap:8px;touch-action:none}& svg{overflow:visible;cursor:grab}' +
      '& .ar{fill:none;stroke:var(--d-soft);stroke-width:8;stroke-linecap:round}& .ac{fill:none;stroke:var(--d-accent);stroke-width:8;stroke-linecap:round;stroke-dasharray:100;opacity:.9}' +
      '& .nd line{stroke:var(--d-fg);stroke-width:2.5;stroke-linecap:round}& .nd circle{fill:var(--d-bg);stroke:var(--d-fg);stroke-width:2}& .hub{fill:var(--d-fg)}' +
      '& .fc{transition:fill .2s}& .ey{fill:#1a1a2a}& .mo{fill:none;stroke:#1a1a2a;stroke-width:1.6;stroke-linecap:round}& .tx{display:grid;width:58px}& .tx b{font-size:13px;transition:color .2s}& .tx small{color:var(--d-mid);font-size:8.5px}',
    js: function (root, api) {
      var svg = root.querySelector('svg'), nd = root.querySelector('.nd'), fc = root.querySelector('.fc'), mo = root.querySelector('.mo'), ac = root.querySelector('.ac'), lb = root.querySelector('.tx b'), drag = false, raf, t = [];
      var Z = [['Awful', '#8a7dff'], ['Bad', '#6f8cff'], ['Okay', '#4fb6ff'], ['Good', '#2fd1a8'], ['Love it!', '#ffc53d']];
      function set(p) { // p 0..1 along the arc
        nd.setAttribute('transform', 'rotate(' + (p * 180 - 90) + ' 60 62)');
        ac.style.strokeDashoffset = 100 - p * 100;
        var z = Z[Math.min(4, Math.floor(p * 5))]; fc.style.fill = z[1]; ac.style.stroke = z[1]; lb.style.color = z[1];
        if (lb.textContent !== z[0]) { lb.textContent = z[0]; lb.animate([{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], { duration: api.reduce ? 1 : 180 }); }
        var c = 45 + p * 8; mo.setAttribute('d', 'M55 ' + (49 - p * 2) + ' Q60 ' + c + ' 65 ' + (49 - p * 2));
      }
      function fromEvent(e) {
        var r = svg.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height * 62 / 70;
        var a = Math.atan2(e.clientY - cy, e.clientX - cx); // -PI (left) .. 0 (right)
        set(Math.max(0, Math.min(1, (a < 0 ? a + Math.PI : (e.clientX < cx ? 0 : Math.PI)) / Math.PI)));
      }
      svg.addEventListener('pointerdown', function (e) { drag = true; cancelAnimationFrame(raf); svg.setPointerCapture(e.pointerId); fromEvent(e); });
      svg.addEventListener('pointermove', function (e) { if (drag) fromEvent(e); });
      svg.addEventListener('pointerup', function () { drag = false; });
      function sweep(a, b) {
        var t0 = performance.now(), D = api.reduce ? 1 : 900;
        (function f(now) { var q = Math.min(1, (now - t0) / D), e = q < .5 ? 2 * q * q : 1 - Math.pow(-2 * q + 2, 2) / 2; set(a + (b - a) * e); if (q < 1 && !drag) raf = requestAnimationFrame(f); })(t0);
      }
      set(0.05);
      t.push(setTimeout(function () { sweep(0.05, 0.95); }, 600));
      return function () { t.forEach(clearTimeout); cancelAnimationFrame(raf); };
    }
  });

  LUZ.add({
    id: 'rating-score-fly', cat: cat, name: 'Score Fly', source: src, trigger: 'tap', allowColor: true,
    motion: 'Ketuk bintang ke-5: kelima bintang terisi cepat (jeda 40ms), lalu salinan bintang kecil terbang di busur dari bintang ke-5 ke bintang di header sambil mengecil (scale 1 → 0.5). Saat tiba, bintang header berdenyut dan angka rata-rata bergulir 4.2 → 4.3 serta jumlah ulasan 128 → 129.',
    timing: 'isi 40ms stagger · terbang ≈480ms cubic-bezier(.5,0,.3,1) · gulir angka 300ms',
    use: 'ulasan produk/layanan yang langsung memperbarui rata-rata rating di header',
    tags: 'rating score fly star arc average update number roll',
    html: '<div class="sf"><div class="hd"><i class="ic"></i><b>Ceramic Mug</b><span class="avg"><i class="hs">★</i><span class="roll"><b>4.2</b></span></span><small class="cnt">(128)</small></div><div class="rr"><small>Rate it</small><div class="row">' + stars(5, 22) + '</div></div></div>',
    css: starCss + '& .sf{position:relative;width:226px;padding:12px;border-radius:14px;background:var(--d-bg);box-shadow:0 0 0 1px var(--d-soft);display:grid;gap:14px;font-size:10.5px}' +
      '& .hd{display:flex;align-items:center;gap:6px}& .ic{width:18px;height:18px;border-radius:5px;background:var(--d-accent)}& .hd>b{flex:1}' +
      '& .avg{display:flex;align-items:center;gap:2px;font-weight:700}& .hs{font-style:normal;color:#ffc53d}& .cnt{color:var(--d-mid);font-size:8.5px}' +
      '& .roll{display:inline-grid;overflow:hidden;height:14px;line-height:14px}& .roll b{grid-area:1/1}' +
      '& .rr{display:flex;align-items:center;justify-content:space-between}& .rr small{color:var(--d-mid)}& .row{display:flex;gap:4px}' +
      '& .fly{position:absolute;width:14px;height:14px;color:#ffc53d;font-size:14px;line-height:14px;pointer-events:none}',
    js: function (root, api) {
      var sf = root.querySelector('.sf'), ss = root.querySelectorAll('.st'), hs = root.querySelector('.hs'), roll = root.querySelector('.roll'), cnt = root.querySelector('.cnt'), t = [], k = api.reduce ? 0.01 : 1, done = false;
      function num(v) {
        var old = roll.lastElementChild, nw = document.createElement('b'); nw.textContent = v; roll.appendChild(nw);
        var o = { duration: 300 * k, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'both' };
        old.animate([{ transform: 'none' }, { transform: 'translateY(-100%)' }], o).onfinish = function () { old.remove(); };
        nw.animate([{ transform: 'translateY(100%)' }, { transform: 'none' }], o);
      }
      function rate(n) {
        t.forEach(clearTimeout); t = [];
        ss.forEach(function (s, i) { s.classList.remove('on'); if (i < n) t.push(setTimeout(function () { s.classList.add('on'); s.animate([{ transform: 'scale(1.3)' }, { transform: 'none' }], { duration: 200 * k }); }, i * 40 * k)); });
        if (n === 5 && !done) {
          done = true;
          t.push(setTimeout(function () {
            var a = ss[4].getBoundingClientRect(), b = hs.getBoundingClientRect(), o = sf.getBoundingClientRect(), f = document.createElement('i');
            f.className = 'fly'; f.textContent = '★'; f.style.left = a.left - o.left + 4 + 'px'; f.style.top = a.top - o.top + 4 + 'px'; sf.appendChild(f);
            var dx = b.left - a.left - 4, dy = b.top - a.top - 4;
            f.animate([{ transform: 'none' }, { transform: 'translate(' + dx * .4 + 'px,' + (dy - 30) + 'px) scale(.8)', offset: .5 }, { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(.5)' }], { duration: 480 * k, easing: 'cubic-bezier(.5,0,.3,1)' }).onfinish = function () {
              f.remove(); hs.animate([{ transform: 'scale(1.6)' }, { transform: 'none' }], { duration: 300 * k, easing: 'ease-out' });
              num('4.3'); cnt.textContent = '(129)';
            };
          }, 220 * k));
        } else if (n < 5 && done) { done = false; num('4.2'); cnt.textContent = '(128)'; }
      }
      ss.forEach(function (s, i) { s.onclick = function () { rate(i + 1); }; });
      t.push(setTimeout(function () { rate(5); }, 600));
      return function () { t.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'rating-rating-tags', cat: cat, name: 'Rating Tags', source: src, trigger: 'tap', allowColor: true,
    motion: 'Setelah memberi bintang, judul "What went well?" muncul dan chip Fast, Friendly, Clean, Tasty pop satu per satu dari kiri (scale 0.6 → 1, jeda 70ms). Ketuk chip: chip terisi aksen dan ikon ✓ masuk dari kiri (lebar 0 → 10px) sehingga chip melebar.',
    timing: 'chip pop 260ms cubic-bezier(.34,1.56,.64,1) · stagger 70ms · ✓ 220ms ease-out',
    use: 'umpan balik cepat setelah rating (mis. "dokter ramah", "antrean cepat")',
    tags: 'rating tags chips pop stagger select check feedback',
    html: '<div class="rt"><div class="row">' + stars(5, 24) + '</div><b class="q">What went well?</b><div class="chs">' + ['Fast', 'Friendly', 'Clean', 'Tasty'].map(function (c) { return '<button type="button" class="ch"><i>✓</i>' + c + '</button>'; }).join('') + '</div></div>',
    css: starCss + '& .rt{display:grid;gap:10px;justify-items:center;width:236px}& .row{display:flex;gap:5px}& .q{font-size:10.5px;opacity:0}' +
      '& .chs{display:flex;gap:5px;min-height:26px}& .ch{display:flex;align-items:center;height:26px;padding:0 9px;border:0;border-radius:99px;background:var(--d-soft);color:var(--d-fg);font:600 9.5px inherit;cursor:pointer;opacity:0;transition:background .2s,color .2s}' +
      '& .ch i{display:inline-block;width:0;overflow:hidden;font-style:normal;transition:width 220ms ease-out,margin 220ms ease-out}& .ch.on{background:var(--d-accent);color:var(--d-bg)}& .ch.on i{width:10px;margin-right:3px}',
    js: function (root, api) {
      var ss = root.querySelectorAll('.st'), q = root.querySelector('.q'), cs = root.querySelectorAll('.ch'), shown = false, t = [], k = api.reduce ? 0.01 : 1;
      function rate(n) {
        ss.forEach(function (s, i) { s.classList.toggle('on', i < n); });
        if (shown) return; shown = true;
        q.animate([{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], { duration: 220 * k, fill: 'forwards' });
        cs.forEach(function (c, i) { c.animate([{ opacity: 0, transform: 'scale(.6)' }, { opacity: 1, transform: 'none' }], { duration: 260 * k, delay: (120 + i * 70) * k, easing: 'cubic-bezier(.34,1.56,.64,1)', fill: 'forwards' }); });
      }
      ss.forEach(function (s, i) { s.onclick = function () { rate(i + 1); }; });
      cs.forEach(function (c) { c.onclick = function () { c.classList.toggle('on'); }; });
      t.push(setTimeout(function () { rate(4); }, 600), setTimeout(function () { cs[1].classList.add('on'); }, 1300), setTimeout(function () { cs[0].classList.add('on'); }, 1700));
      return function () { t.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'rating-score-wheel', cat: cat, name: 'Score Wheel', source: src, trigger: 'drag', allowColor: true,
    motion: 'Picker angka 1–10 berbentuk drum 3D: angka di atas/bawah kotak pilihan rotateX ±25° per langkah, mengecil dan memudar. Seret atau flick vertikal: drum berputar mengikuti jari dengan momentum lalu menempel ke angka terdekat dengan pegas kecil. Warna kotak dan label berubah: Poor (merah muda) → Fair (oranye) → Good (biru) → Great! (toska).',
    timing: 'ikut jari · snap ≈420ms cubic-bezier(.25,1.3,.5,1) · autoplay flick 3 → 9',
    use: 'pemilih skor atau angka (skala nyeri 1–10, jumlah dosis) dengan gestur roda',
    tags: 'rating score wheel picker drum 3d flick snap momentum',
    html: '<div class="sw"><div class="drum"><i class="sel"></i><div class="nums">' + [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function (n) { return '<b>' + n + '</b>'; }).join('') + '</div></div><div class="tx"><b>Poor</b><small>out of 10</small></div></div>',
    css: '& .sw{display:flex;align-items:center;gap:16px}& .drum{position:relative;width:64px;height:150px;perspective:300px;cursor:grab;touch-action:none;overflow:hidden}' +
      '& .sel{position:absolute;left:4px;right:4px;top:60px;height:30px;border-radius:8px;border:2px solid var(--c,#ff6b9a);box-sizing:border-box;transition:border-color .25s}' +
      '& .nums{position:absolute;inset:0;transform-style:preserve-3d}& .nums b{position:absolute;left:0;right:0;top:60px;height:30px;line-height:30px;text-align:center;font-size:17px;backface-visibility:hidden}' +
      '& .tx{display:grid;width:64px}& .tx b{font-size:14px;color:var(--c,#ff6b9a);transition:color .25s}& .tx small{color:var(--d-mid);font-size:8.5px}',
    js: function (root, api) {
      var sw = root.querySelector('.sw'), drum = root.querySelector('.drum'), bs = root.querySelectorAll('.nums b'), lb = root.querySelector('.tx b'), pos = 2, y0 = null, p0 = 0, v = 0, ly = 0, lt = 0, raf, t = [];
      function draw() {
        bs.forEach(function (b, i) {
          var d = i - pos, a = d * 25;
          b.style.transform = 'rotateX(' + -a + 'deg) translateZ(60px)'; b.style.opacity = Math.abs(a) > 80 ? 0 : 1 - Math.abs(d) * 0.3;
        });
        var n = Math.round(pos) + 1, m = n >= 9 ? ['Great!', '#2fd1a8'] : n >= 7 ? ['Good', '#4f8bff'] : n >= 5 ? ['Fair', '#ff9a5c'] : ['Poor', '#ff6b9a'];
        lb.textContent = m[0]; sw.style.setProperty('--c', m[1]);
      }
      function snapTo(target) {
        target = Math.max(0, Math.min(9, Math.round(target)));
        var a = pos, t0 = performance.now(), D = api.reduce ? 1 : 420;
        cancelAnimationFrame(raf);
        (function f(now) { // ease with ~6% overshoot
          var q = Math.min(1, (now - t0) / D), e = 1 + 2.2 * Math.pow(q - 1, 3) + 1.2 * Math.pow(q - 1, 2);
          pos = a + (target - a) * e; draw(); if (q < 1) raf = requestAnimationFrame(f); else { pos = target; draw(); }
        })(t0);
      }
      drum.addEventListener('pointerdown', function (e) { cancelAnimationFrame(raf); y0 = ly = e.clientY; lt = e.timeStamp; p0 = pos; v = 0; drum.setPointerCapture(e.pointerId); });
      drum.addEventListener('pointermove', function (e) {
        if (y0 === null) return;
        pos = Math.max(-0.4, Math.min(9.4, p0 - (e.clientY - y0) / 30));
        v = -(e.clientY - ly) / 30 / Math.max(1, e.timeStamp - lt) * 1000; ly = e.clientY; lt = e.timeStamp; draw();
      });
      drum.addEventListener('pointerup', function () { if (y0 === null) return; y0 = null; snapTo(pos + v * 0.15); });
      draw();
      t.push(setTimeout(function () { snapTo(8); }, 600));
      return function () { t.forEach(clearTimeout); cancelAnimationFrame(raf); };
    }
  });
})();
