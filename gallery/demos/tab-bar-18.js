/* Tab Bar · Part 18 — six ways to move the active tab in a 4-icon bar
   (Home, Search, Likes, Profile). Tap any tab; each demo autoplays one switch.
   Slot geometry shared by all: bar 236px, slots 54px wide starting at x=10. */
(function () {
  var SRC = 'Tab Bar · Part 18';
  var IC = [
    '<path d="M4 11l8-7 8 7v9h-5v-6H9v6H4z"/>',
    '<circle cx="11" cy="11" r="6"/><path d="M16 16l4 4"/>',
    '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    '<circle cx="12" cy="8" r="4"/><path d="M4 20c1-4 4.5-6 8-6s7 2 8 6"/>'
  ];
  var NM = ['Home', 'Search', 'Likes', 'Profile'];
  var svg = function (i) { return '<svg viewBox="0 0 24 24">' + IC[i] + '</svg>'; };
  // build the 4 tab buttons; extra(i) adds inner markup per tab
  var tabs = function (on, extra) {
    return [0, 1, 2, 3].map(function (i) {
      return '<button class="tb' + (i === on ? ' on' : '') + '" style="left:' + (9 + 54 * i) + 'px" aria-label="' + NM[i] + '">' + svg(i) + (extra ? extra(i) : '') + '</button>';
    }).join('');
  };
  var CSS =
    '& .bar{position:relative;width:236px;height:48px;border-radius:24px;background:var(--d-bg);border:1px solid var(--d-soft);box-shadow:0 2px 6px rgba(0,0,0,.08)}' +
    '& .tb{position:absolute;top:0;width:54px;height:100%;display:grid;place-items:center;background:none;border:0;padding:0;color:var(--d-fg);cursor:pointer;-webkit-tap-highlight-color:transparent}' +
    '& .tb svg{position:relative;width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}';

  LUZ.add({
    id: 'tabbar18-sliding-pill',
    cat: 'Menu & Navigasi',
    name: 'Sliding Pill',
    source: SRC,
    trigger: 'tap',
    motion: 'Pil aksen (46×34px) di belakang ikon aktif meluncur ke tab yang diketuk. Di tengah jalan pil meregang (scaleX hingga ±1.9 untuk lompatan 1 tab, lebih panjang untuk lompatan jauh) sehingga menutupi dua ikon sekaligus, lalu menyusut kembali dengan overshoot 4px seperti pegas. Ikon di dalam pil berganti warna ke warna permukaan.',
    timing: '≈480ms cubic-bezier(.3,.7,.4,1) · regangan puncak di 45% · overshoot 4px di 80% · warna ikon 200ms',
    use: 'Bottom navigation aplikasi mobile, misalnya pindah Beranda ↔ Jadwal ↔ Pasien ↔ Profil.',
    tags: 'tab bar bottom navigation sliding pill indicator stretch spring',
    html: '<div class="bar"><span class="pl"></span>' + tabs(2) + '</div>',
    css: CSS +
      '& .pl{position:absolute;left:13px;top:6px;width:46px;height:34px;border-radius:17px;background:var(--d-accent);transform:translateX(108px)}' +
      '& .tb{transition:color .2s}& .tb.on{color:var(--d-bg)}',
    js: function (root, api) {
      var tabs = [].slice.call(root.querySelectorAll('.tb')), pill = root.querySelector('.pl'), cur = 2, T;
      function go(i) {
        if (i === cur) return;
        var a = cur, from = getComputedStyle(pill).transform, dir = i > a ? 1 : -1;
        cur = i;
        tabs.forEach(function (t, k) { t.classList.toggle('on', k === i); });
        pill.getAnimations().forEach(function (x) { x.cancel(); });
        pill.style.transform = 'translateX(' + 54 * i + 'px)';
        if (api.reduce) return;
        var s = 1 + Math.abs(i - a) * 54 / 46 * 0.8;
        pill.animate([
          { transform: from },
          { transform: 'translateX(' + 27 * (a + i) + 'px) scaleX(' + s + ')', offset: 0.45 },
          { transform: 'translateX(' + (54 * i + dir * 4) + 'px) scaleX(1)', offset: 0.8 },
          { transform: 'translateX(' + 54 * i + 'px)' }
        ], { duration: 480, easing: 'cubic-bezier(.3,.7,.4,1)' });
      }
      tabs.forEach(function (t, k) { t.addEventListener('click', function () { clearTimeout(T); go(k); }); });
      T = setTimeout(function () { go(1); }, 600);
      return function () { clearTimeout(T); };
    }
  });

  LUZ.add({
    id: 'tabbar18-liquid-bulge',
    cat: 'Menu & Navigasi',
    name: 'Liquid Bulge',
    source: SRC,
    trigger: 'tap',
    motion: 'Permukaan bar punya tonjolan (bukit 60×28px) di atas tab aktif. Saat tab lain diketuk, tonjolan memipih dan melebar (scale 1.9×0.45) sambil mengalir ke tab tujuan, lalu menggembung lagi. Ikon aktif naik 10px ke dalam tonjolan dan berubah warna aksen; ikon lama turun kembali.',
    timing: 'tonjolan 500ms cubic-bezier(.4,0,.3,1), pipih di 50% · ikon naik 350ms cubic-bezier(.3,1.5,.5,1) (overshoot kecil)',
    use: 'Bottom navigation dengan gaya organik/lembut, misalnya aplikasi kesehatan atau wellness.',
    tags: 'tab bar liquid bulge bump gooey blob navigation',
    allowColor: true,
    html: '<div class="lw"><span class="bp"></span><div class="bar">' + tabs(2) + '</div></div>',
    css: CSS +
      '& .lw{position:relative;margin-top:16px;filter:drop-shadow(0 1px 1px rgba(0,0,0,.12)) drop-shadow(0 3px 6px rgba(0,0,0,.1))}' +
      '& .lw .bar{border:0;box-shadow:none}' +
      '& .bp{position:absolute;left:6px;top:-13px;width:60px;height:30px;border-radius:50% 50% 0 0/100% 100% 0 0;background:var(--d-bg);transform:translateX(108px)}' +
      '& .tb svg{transition:transform .35s cubic-bezier(.3,1.5,.5,1),color .25s}& .tb.on{color:var(--d-accent)}& .tb.on svg{transform:translateY(-10px)}',
    js: function (root, api) {
      var tabs = [].slice.call(root.querySelectorAll('.tb')), bump = root.querySelector('.bp'), cur = 2, T;
      function go(i) {
        if (i === cur) return;
        var a = cur, from = getComputedStyle(bump).transform;
        cur = i;
        tabs.forEach(function (t, k) { t.classList.toggle('on', k === i); });
        bump.getAnimations().forEach(function (x) { x.cancel(); });
        bump.style.transform = 'translateX(' + 54 * i + 'px)';
        if (api.reduce) return;
        bump.animate([
          { transform: from },
          { transform: 'translateX(' + 27 * (a + i) + 'px) scale(1.9,.45)', offset: 0.5 },
          { transform: 'translateX(' + 54 * i + 'px) scale(1,1)' }
        ], { duration: 500, easing: 'cubic-bezier(.4,0,.3,1)' });
      }
      tabs.forEach(function (t, k) { t.addEventListener('click', function () { clearTimeout(T); go(k); }); });
      T = setTimeout(function () { go(1); }, 600);
      return function () { clearTimeout(T); };
    }
  });

  LUZ.add({
    id: 'tabbar18-floating-notch',
    cat: 'Menu & Navigasi',
    name: 'Floating Notch',
    source: SRC,
    trigger: 'tap',
    motion: 'Bola aksen 38px berisi ikon aktif melayang di atas bar, duduk di lekukan (notch) berjari-jari 25px yang dipotong dari tepi atas bar. Saat tab lain diketuk, bola melompat dalam busur (naik 14px di tengah) ke tab tujuan dan lekukan ikut bergeser bersamanya; ikon di bola berganti di puncak lompatan. Di slot aktif, ikon bar disembunyikan dan diganti label huruf kapital kecil (HOME, SEARCH…).',
    timing: 'lompatan 450ms ease-in-out (busur sinus) · label pudar 200ms',
    use: 'Bottom navigation dengan tombol aktif yang menonjol, misalnya aplikasi booking atau dompet digital.',
    tags: 'tab bar floating notch cutout ball hop arc fab navigation',
    html: '<div class="nw"><div class="bar">' + tabs(2, function (i) { return '<small class="lb">' + NM[i].toUpperCase() + '</small>'; }) + '</div><span class="bl">' + svg(2) + '</span></div>',
    css: CSS +
      '& .nw{position:relative;margin-top:22px}' +
      '& .nw .bar{--x:145px;-webkit-mask:radial-gradient(circle at var(--x) 0,transparent 24px,black 25px);mask:radial-gradient(circle at var(--x) 0,transparent 24px,black 25px)}' +
      '& .bl{position:absolute;left:0;top:0;width:38px;height:38px;border-radius:50%;background:var(--d-accent);color:var(--d-bg);display:grid;place-items:center;box-shadow:0 3px 8px rgba(0,0,0,.2);transform:translate(126px,-19px);pointer-events:none}' +
      '& .bl svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}' +
      '& .tb svg{transition:opacity .2s}& .tb.on svg{opacity:0}' +
      '& .lb{position:absolute;bottom:7px;font-size:8px;letter-spacing:.14em;font-weight:600;opacity:0;transition:opacity .2s}& .tb.on .lb{opacity:1}',
    js: function (root, api) {
      var tabs = [].slice.call(root.querySelectorAll('.tb')), bar = root.querySelector('.bar'), ball = root.querySelector('.bl');
      var cur = 2, x = 145, raf, T;
      var put = function (px, py) { x = px; bar.style.setProperty('--x', px + 'px'); ball.style.transform = 'translate(' + (px - 19) + 'px,' + (py - 19) + 'px)'; };
      function go(i) {
        if (i === cur) return;
        cur = i; cancelAnimationFrame(raf);
        tabs.forEach(function (t, k) { t.classList.toggle('on', k === i); });
        var x0 = x, x1 = 37 + 54 * i, t0 = performance.now(), swapped = false;
        if (api.reduce) { ball.innerHTML = tabs[i].querySelector('svg').outerHTML; return put(x1, 0); }
        (function step(now) {
          var t = Math.min(1, (now - t0) / 450), e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          if (t > 0.5 && !swapped) { swapped = true; ball.innerHTML = tabs[i].querySelector('svg').outerHTML; }
          put(x0 + (x1 - x0) * e, -14 * Math.sin(Math.PI * t));
          if (t < 1) raf = requestAnimationFrame(step);
        })(t0);
      }
      tabs.forEach(function (t, k) { t.addEventListener('click', function () { clearTimeout(T); go(k); }); });
      T = setTimeout(function () { go(1); }, 600);
      return function () { clearTimeout(T); cancelAnimationFrame(raf); };
    }
  });

  LUZ.add({
    id: 'tabbar18-icon-fill',
    cat: 'Menu & Navigasi',
    name: 'Icon Fill',
    source: SRC,
    trigger: 'tap',
    motion: 'Ikon yang diketuk ditekan dulu (scale 0.7), lalu terisi warna aksen dan memantul ke 1.25 sebelum kembali 1. Dua cincin aksen memancar dari ikon (scale 0.6→2, pudar) berjarak 120ms, dan garis bawah 12px tumbuh dari tengah (scaleX 0→1). Ikon lama kehilangan isinya dan sedikit mengecil (0.85) lalu normal.',
    timing: 'ikon 450ms ease-out (0.7 → 1.25 → 1) · cincin 500ms, jeda 120ms · garis bawah 250ms delay 100ms',
    use: 'Tab bar yang ingin memberi umpan balik jelas tanpa indikator bergerak, misalnya menu favorit/notifikasi.',
    tags: 'tab bar icon fill ink ripple ring underline press bounce',
    html: '<div class="bar">' + tabs(2, function () { return '<i class="ul"></i>'; }) + '</div>',
    css: CSS +
      '& .tb svg{transition:fill .2s}& .tb.on{color:var(--d-accent)}& .tb.on svg{fill:currentColor}' +
      '& .ul{position:absolute;bottom:6px;left:21px;width:12px;height:2.5px;border-radius:2px;background:var(--d-accent);transform:scaleX(0);transition:transform .25s}' +
      '& .tb.on .ul{transform:scaleX(1);transition-delay:.1s}' +
      '& .rg{position:absolute;left:12px;top:8px;width:30px;height:30px;border-radius:50%;border:1.5px solid var(--d-accent);pointer-events:none;opacity:0}',
    js: function (root, api) {
      var tabs = [].slice.call(root.querySelectorAll('.tb')), cur = 2, T;
      function go(i) {
        if (i === cur) return;
        var old = tabs[cur].querySelector('svg'), ic = tabs[i].querySelector('svg');
        cur = i;
        tabs.forEach(function (t, k) { t.classList.toggle('on', k === i); });
        if (api.reduce) return;
        old.animate({ transform: ['scale(1)', 'scale(.85)', 'scale(1)'] }, { duration: 250, easing: 'ease-out' });
        ic.animate({ transform: ['scale(1)', 'scale(.7)', 'scale(1.25)', 'scale(1)'], offset: [0, 0.2, 0.6, 1] }, { duration: 450, easing: 'ease-out' });
        [0, 120].forEach(function (d) {
          var r = document.createElement('i'); r.className = 'rg'; tabs[i].appendChild(r);
          r.animate({ transform: ['scale(.6)', 'scale(2)'], opacity: [0.7, 0] }, { duration: 500, delay: d, easing: 'ease-out' }).onfinish = function () { r.remove(); };
        });
      }
      tabs.forEach(function (t, k) { t.addEventListener('click', function () { clearTimeout(T); go(k); }); });
      T = setTimeout(function () { go(1); }, 600);
      return function () { clearTimeout(T); };
    }
  });

  LUZ.add({
    id: 'tabbar18-expanding-label',
    cat: 'Menu & Navigasi',
    name: 'Expanding Label',
    source: SRC,
    trigger: 'tap',
    motion: 'Tab aktif berupa pil aksen 88px berisi ikon + label (Home, Search, Likes, Profile); tab lain hanya ikon 40px. Saat tab lain diketuk, pil lama menutup (clip-path dari kanan, pudar) dan pil baru membuka ke kanan dari ikonnya, label muncul menyusul. Ikon-ikon lain bergeser (translateX) memberi ruang dengan pegas ringan.',
    timing: 'geser & buka pil 400ms cubic-bezier(.3,1.3,.5,1) (overshoot kecil) · label pudar 200ms delay 120ms',
    use: 'Bottom navigation yang menampilkan nama halaman aktif, misalnya aplikasi dengan banyak ikon yang kurang jelas.',
    tags: 'tab bar expanding label pill grow width reflow navigation',
    html: '<div class="bar">' + [0, 1, 2, 3].map(function (i) {
      return '<button class="tx' + (i === 2 ? ' on' : '') + '" aria-label="' + NM[i] + '"><i class="pp"></i>' + svg(i) + '<span>' + NM[i] + '</span></button>';
    }).join('') + '</div>',
    css: CSS +
      '& .bar{overflow:hidden}' +
      '& .tx{position:absolute;left:0;top:4px;width:40px;height:38px;border:0;padding:0;background:none;color:var(--d-fg);cursor:pointer;transition:transform .4s cubic-bezier(.3,1.3,.5,1),color .2s;-webkit-tap-highlight-color:transparent}' +
      '& .pp{position:absolute;left:0;top:0;width:88px;height:100%;border-radius:19px;background:var(--d-accent);opacity:0;clip-path:inset(0 48px 0 0 round 19px);transition:clip-path .4s cubic-bezier(.3,1,.4,1),opacity .25s}' +
      '& .tx svg{position:absolute;left:10px;top:9px;width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}' +
      '& .tx span{position:absolute;left:34px;top:10px;font-size:12.5px;font-weight:600;opacity:0;transition:opacity .15s}' +
      '& .tx.on{width:88px;color:var(--d-bg)}& .tx.on .pp{opacity:1;clip-path:inset(0 0 0 0 round 19px)}& .tx.on span{opacity:1;transition:opacity .2s .12s}',
    js: function (root, api) {
      var tabs = [].slice.call(root.querySelectorAll('.tx')), T;
      function go(i, instant) {
        var x = 8;
        tabs.forEach(function (t, k) {
          t.classList.toggle('on', k === i);
          t.style.transition = api.reduce || instant ? 'none' : '';
          t.style.transform = 'translateX(' + x + 'px)'; x += (k === i ? 88 : 40) + 3.3;
        });
      }
      tabs.forEach(function (t, k) { t.addEventListener('click', function () { clearTimeout(T); go(k); }); });
      go(2, true);
      T = setTimeout(function () { go(1); }, 600);
      return function () { clearTimeout(T); };
    }
  });

  LUZ.add({
    id: 'tabbar18-bubble-float',
    cat: 'Menu & Navigasi',
    name: 'Bubble Float',
    source: SRC,
    trigger: 'tap',
    motion: 'Saat tab diketuk, 8 titik tinta (6 aksen, 2 warna teks, diameter 4–11px) muncul dari ikon dan naik 40–80px sambil melayang ke kanan (−12…+30px), membesar dari 0.3 ke 1, lalu pecah (scale 1.5) dan pudar. Ikon aktif berubah warna aksen dan titik kecil 4px muncul di bawahnya.',
    timing: 'tiap gelembung 900–1100ms ease-out · stagger 25ms · warna ikon 200ms',
    use: 'Tab bar yang ingin terasa playful, misalnya tab Favorit/Suka atau aplikasi sosial.',
    tags: 'tab bar bubble float particles ink dots rise pop confetti',
    html: '<div class="bw"><div class="bar">' + tabs(2, function () { return '<i class="dt"></i>'; }) + '</div></div>',
    css: CSS +
      '& .bw{position:relative;margin-top:70px}' +
      '& .tb{transition:color .2s}& .tb.on{color:var(--d-accent)}' +
      '& .dt{position:absolute;bottom:7px;left:25px;width:4px;height:4px;border-radius:50%;background:var(--d-accent);transform:scale(0);transition:transform .2s}& .tb.on .dt{transform:scale(1)}' +
      '& .bb{position:absolute;border-radius:50%;pointer-events:none}',
    js: function (root, api) {
      var wrap = root.querySelector('.bw'), tabs = [].slice.call(root.querySelectorAll('.tb')), cur = 2, T;
      function go(i) {
        if (i === cur) return;
        cur = i;
        tabs.forEach(function (t, k) { t.classList.toggle('on', k === i); });
        if (api.reduce) return;
        for (var n = 0; n < 8; n++) {
          var b = document.createElement('i'), s = 4 + Math.random() * 7, dx = -12 + Math.random() * 42, dy = -40 - Math.random() * 40;
          b.className = 'bb';
          b.style.cssText = 'width:' + s + 'px;height:' + s + 'px;left:' + (37 + 54 * i - s / 2) + 'px;top:' + (20 - s / 2) + 'px;background:var(' + (n % 4 === 3 ? '--d-fg' : '--d-accent') + ')';
          wrap.appendChild(b);
          b.animate([
            { transform: 'translate(0,0) scale(.3)', opacity: 1 },
            { transform: 'translate(' + dx * 0.6 + 'px,' + dy * 0.7 + 'px) scale(1)', opacity: 1, offset: 0.6 },
            { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(1.5)', opacity: 0 }
          ], { duration: 900 + Math.random() * 200, delay: n * 25, easing: 'ease-out', fill: 'backwards' }).onfinish = function () { this.effect.target.remove(); };
        }
      }
      tabs.forEach(function (t, k) { t.addEventListener('click', function () { clearTimeout(T); go(k); }); });
      T = setTimeout(function () { go(1); }, 600);
      return function () { clearTimeout(T); };
    }
  });
})();
