/* Screen Transition · Part 2 — six list → detail transitions.
   Tap a tile on "Explore" to open the detail screen, tap ‹ to go back. */
(function () {
  var html =
    '<div class="w">' +
      '<div class="list">' +
        '<div class="hd"><b>Explore</b><i class="dot"></i></div>' +
        '<div class="tiles">' +
          '<button class="t pk" type="button"><span>Peaks</span></button>' +
          '<button class="t oc" type="button"><span>Ocean</span></button>' +
          '<button class="t gd" type="button"><span>Garden</span></button>' +
        '</div>' +
      '</div>' +
      '<div class="det">' +
        '<div class="img gd"></div>' +
        '<div class="tx"><b>Garden</b><small>Garden walk · ★ 4.7</small><i></i><i></i><i class="s"></i><span class="bn">Book now</span></div>' +
        '<button class="bk" type="button" aria-label="Back">‹</button>' +
      '</div>' +
    '</div>';

  var css =
    '& .w{position:relative;width:236px;height:160px;border-radius:14px;overflow:hidden;background:var(--d-bg);color:var(--d-fg);font-size:11px;box-shadow:0 0 0 1px var(--d-soft)}' +
    '& .list,& .det{position:absolute;inset:0;background:var(--d-bg)}' +
    '& .list{padding:12px;display:grid;grid-template-rows:auto 1fr;gap:10px}' +
    '& .hd{display:flex;justify-content:space-between;align-items:center}' +
    '& .dot{width:8px;height:8px;border-radius:50%;background:var(--d-accent)}' +
    '& .tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}' +
    '& .t{border:0;border-radius:10px;padding:0;position:relative;cursor:pointer}' +
    '& .t span{position:absolute;left:6px;bottom:5px;color:#fff;font-size:9.5px;font-weight:600}' +
    '& .pk{background:radial-gradient(circle at 62% 38%,#ffc27a 0 11%,transparent 12%),linear-gradient(160deg,transparent 55%,#3b2a7a 56%),linear-gradient(#5b3fb8,#b06ad8)}' +
    '& .oc{background:radial-gradient(circle at 35% 30%,#fff 0 6%,transparent 7%),linear-gradient(#1b2f7a,#2f6fe0)}' +
    '& .gd{background:radial-gradient(circle at 35% 55%,#ff6b9a 0 8%,transparent 9%),radial-gradient(circle at 65% 40%,#ffd24a 0 10%,transparent 11%),radial-gradient(circle at 55% 72%,#ff9ac0 0 6%,transparent 7%),linear-gradient(#17493a,#1f7a55)}' +
    '& .det{display:grid;grid-template-columns:46% 1fr;opacity:0;pointer-events:none}' +
    '& .w.on .det{pointer-events:auto}' +
    '& .tx{padding:14px 10px;display:grid;gap:5px;align-content:start}' +
    '& .tx b{font-size:13px}& .tx small{color:var(--d-mid);font-size:9px}' +
    '& .tx i{height:4px;border-radius:2px;background:var(--d-soft)}& .tx i.s{width:60%}' +
    '& .bn{margin-top:8px;background:var(--d-accent);color:var(--d-bg);border-radius:99px;text-align:center;padding:5px;font-weight:600;font-size:9.5px}' +
    '& .bk{position:absolute;left:6px;top:6px;width:26px;height:26px;border-radius:50%;border:0;background:rgba(0,0,0,.35);color:#fff;font-size:15px;line-height:1;cursor:pointer}';

  var src = 'Screen Transition · Part 2';
  var cat = 'Transisi Halaman';

  LUZ.add({
    id: 'screen-swipe-back', cat: cat, name: 'Swipe Back', source: src, trigger: 'drag', allowColor: true,
    motion: 'Detail masuk dari kanan (translateX 100% → 0) sementara daftar bergeser −30% dan meredup (paralaks). Untuk kembali, seret layar detail ke kanan: progres mengikuti jari; lepas lewat 35% lebar maka selesai kembali, kurang dari itu memantul ke posisi semula.',
    timing: '≈380ms cubic-bezier(.2,.8,.2,1) · daftar bergerak 30% dari jarak detail',
    use: 'navigasi daftar pasien → detail pasien di app mobile, kembali dengan gesture tepi kiri',
    tags: 'swipe back parallax push navigation edge gesture ios',
    html: html, css: css + '& .det{touch-action:none;cursor:grab}',
    js: function (root, api) {
      var w = root.querySelector('.w'), L = root.querySelector('.list'), D = root.querySelector('.det');
      var t = [], on = false, dur = api.reduce ? 1 : 380, anims = null, x0 = null;
      function make(fwd) {
        var o = { duration: dur, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'both', direction: fwd ? 'normal' : 'reverse' };
        return [
          D.animate([{ transform: 'translateX(100%)', opacity: 1 }, { transform: 'none', opacity: 1 }], o),
          L.animate([{ transform: 'none', filter: 'brightness(1)' }, { transform: 'translateX(-30%)', filter: 'brightness(.6)' }], o)
        ];
      }
      function go(fwd) { on = fwd; w.classList.toggle('on', fwd); make(fwd); }
      root.addEventListener('click', function (e) {
        if (e.target.closest('.t') && !on) go(true);
        else if (e.target.closest('.bk') && on) go(false);
      });
      // drag the detail screen to the right to go back
      D.addEventListener('pointerdown', function (e) {
        if (!on || e.target.closest('.bk')) return;
        x0 = e.clientX; anims = make(false); anims.forEach(function (a) { a.pause(); a.currentTime = 0; });
        D.setPointerCapture(e.pointerId);
      });
      D.addEventListener('pointermove', function (e) {
        if (x0 === null) return;
        var p = Math.max(0, Math.min(1, (e.clientX - x0) / D.offsetWidth));
        anims.forEach(function (a) { a.currentTime = p * dur; });
      });
      function up(e) {
        if (x0 === null) return;
        var p = (e.clientX - x0) / D.offsetWidth; x0 = null;
        if (p > 0.35) { on = false; w.classList.remove('on'); anims.forEach(function (a) { a.play(); }); }
        else anims.forEach(function (a) { a.reverse(); });
      }
      D.addEventListener('pointerup', up); D.addEventListener('pointercancel', up);
      t.push(setTimeout(function () { go(true); }, 600), setTimeout(function () { go(false); }, 2200));
      return function () { t.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'screen-split-doors', cat: cat, name: 'Split Doors', source: src, trigger: 'tap', allowColor: true,
    motion: 'Layar lama dibelah vertikal di tengah: belahan kiri meluncur ke kiri −100%, belahan kanan ke kanan +100% seperti pintu geser, memperlihatkan detail di belakangnya yang membesar dari scale 0.92. Kembali = kedua pintu menutup dan bertemu di tengah.',
    timing: '≈450ms cubic-bezier(.65,0,.35,1) (ease-in-out)',
    use: 'membuka halaman detail atau ringkasan yang terasa "dibuka", mis. hasil pemeriksaan',
    tags: 'split doors reveal page transition clip-path slide apart',
    html: html, css: css + '& .half{z-index:2}',
    js: function (root, api) {
      var w = root.querySelector('.w'), L = root.querySelector('.list'), D = root.querySelector('.det');
      var R = L.cloneNode(true), t = [], on = false;
      L.classList.add('half'); R.classList.add('half');
      L.style.clipPath = 'inset(0 50% 0 0)'; R.style.clipPath = 'inset(0 0 0 50%)';
      w.insertBefore(R, D.nextSibling);
      function go(fwd) {
        on = fwd; w.classList.toggle('on', fwd);
        var o = { duration: api.reduce ? 1 : 450, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'both', direction: fwd ? 'normal' : 'reverse' };
        L.animate([{ transform: 'none' }, { transform: 'translateX(-100%)' }], o);
        R.animate([{ transform: 'none' }, { transform: 'translateX(100%)' }], o);
        D.animate([{ transform: 'scale(.92)', opacity: 1 }, { transform: 'none', opacity: 1 }], o);
      }
      root.addEventListener('click', function (e) {
        if (e.target.closest('.t') && !on) go(true);
        else if (e.target.closest('.bk') && on) go(false);
      });
      t.push(setTimeout(function () { go(true); }, 600), setTimeout(function () { go(false); }, 2200));
      return function () { t.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'screen-blinds', cat: cat, name: 'Blinds', source: src, trigger: 'tap', allowColor: true,
    motion: 'Layar baru dipotong jadi 6 bilah horizontal; tiap bilah berputar masuk dari rotateX −90° ke 0 (perspektif 400px) berurutan dari atas ke bawah dengan jeda 45ms. Kembali = bilah berputar keluar dari bawah ke atas.',
    timing: 'tiap bilah ≈260ms ease-out · stagger 45ms · total ≈490ms',
    use: 'pergantian tampilan dasbor atau laporan yang ingin terasa "berganti panel"',
    tags: 'blinds slats stagger rotateX venetian page transition',
    html: html, css: css + '& .slat{z-index:2}',
    js: function (root, api) {
      var w = root.querySelector('.w'), D = root.querySelector('.det'), t = [], on = false, slats = [];
      for (var i = 0; i < 6; i++) {
        var s = D.cloneNode(true);
        s.classList.add('slat');
        s.style.clipPath = 'inset(' + (i * 100 / 6) + '% 0 ' + (100 - (i + 1) * 100 / 6) + '% 0)';
        s.style.transformOrigin = '50% ' + ((i + 0.5) * 100 / 6) + '%';
        w.appendChild(s); slats.push(s);
      }
      function go(fwd) {
        on = fwd; w.classList.toggle('on', fwd);
        slats.forEach(function (s, i) {
          s.animate([{ transform: 'perspective(400px) rotateX(-90deg)', opacity: 1 }, { transform: 'perspective(400px) rotateX(0)', opacity: 1 }],
            { duration: api.reduce ? 1 : 260, delay: api.reduce ? 0 : (fwd ? i : 5 - i) * 45, easing: 'ease-out', fill: 'both', direction: fwd ? 'normal' : 'reverse' });
        });
      }
      root.addEventListener('click', function (e) {
        if (e.target.closest('.t') && !on) go(true);
        else if (e.target.closest('.bk') && on) go(false);
      });
      t.push(setTimeout(function () { go(true); }, 600), setTimeout(function () { go(false); }, 2200));
      return function () { t.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'screen-depth-stack', cat: cat, name: 'Depth Stack', source: src, trigger: 'tap', allowColor: true,
    motion: 'Layar lama mundur dalam 3D: scale 0.88, rotateX 12° (perspektif 600px), naik 6px dan meredup ke 50%. Layar baru naik dari bawah (translateY 100% → 0) di atasnya. Kembali = layar baru turun, layar lama tegak dan terang lagi.',
    timing: '≈420ms cubic-bezier(.2,.8,.2,1)',
    use: 'membuka form atau detail di atas daftar, mis. tambah catatan kunjungan',
    tags: 'depth stack 3d tilt push modal page rise',
    html: html, css: css,
    js: function (root, api) {
      var w = root.querySelector('.w'), L = root.querySelector('.list'), D = root.querySelector('.det'), t = [], on = false;
      function go(fwd) {
        on = fwd; w.classList.toggle('on', fwd);
        var o = { duration: api.reduce ? 1 : 420, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'both', direction: fwd ? 'normal' : 'reverse' };
        L.animate([{ transform: 'none', filter: 'brightness(1)' }, { transform: 'perspective(600px) translateY(-6px) rotateX(12deg) scale(.88)', filter: 'brightness(.5)' }], o);
        D.animate([{ transform: 'translateY(100%)', opacity: 1 }, { transform: 'none', opacity: 1 }], o);
      }
      root.addEventListener('click', function (e) {
        if (e.target.closest('.t') && !on) go(true);
        else if (e.target.closest('.bk') && on) go(false);
      });
      t.push(setTimeout(function () { go(true); }, 600), setTimeout(function () { go(false); }, 2200));
      return function () { t.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'screen-blur-dissolve', cat: cat, name: 'Blur Dissolve', source: src, trigger: 'tap', allowColor: true,
    motion: 'Crossfade berbasis blur: layar lama blur 0 → 16px sambil memudar, layar baru dari blur 16px dan opacity 0 menjadi tajam. Keduanya bertumpuk di tengah transisi. Kembali memakai efek yang sama terbalik.',
    timing: '≈420ms ease-in-out',
    use: 'perpindahan tab atau halaman yang tidak punya arah ruang (mis. ganti mode tampilan)',
    tags: 'blur dissolve crossfade focus page transition',
    html: html, css: css,
    js: function (root, api) {
      var w = root.querySelector('.w'), L = root.querySelector('.list'), D = root.querySelector('.det'), t = [], on = false;
      function go(fwd) {
        on = fwd; w.classList.toggle('on', fwd);
        var o = { duration: api.reduce ? 1 : 420, easing: 'ease-in-out', fill: 'both', direction: fwd ? 'normal' : 'reverse' };
        L.animate([{ filter: 'blur(0)', opacity: 1 }, { filter: 'blur(16px)', opacity: 0 }], o);
        D.animate([{ filter: 'blur(16px)', opacity: 0 }, { filter: 'blur(0)', opacity: 1 }], o);
      }
      root.addEventListener('click', function (e) {
        if (e.target.closest('.t') && !on) go(true);
        else if (e.target.closest('.bk') && on) go(false);
      });
      t.push(setTimeout(function () { go(true); }, 600), setTimeout(function () { go(false); }, 2200));
      return function () { t.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'screen-liquid-wipe', cat: cat, name: 'Liquid Wipe', source: src, trigger: 'tap', allowColor: true,
    motion: 'Layar baru terungkap oleh clip-path polygon bertepi gelombang sinus (amplitudo 6%) yang bergerak dari kanan ke kiri; tepinya diberi pita aksen bercahaya 3% yang ikut bergerak. Kembali = gelombang menyapu ke arah sebaliknya (kiri → kanan).',
    timing: '≈520ms cubic-bezier(.65,0,.35,1)',
    use: 'transisi yang ingin terasa hidup, mis. layar sukses atau onboarding',
    tags: 'liquid wipe wave clip-path polygon glow reveal',
    html: html, css: css + '& .glow{position:absolute;inset:0;background:var(--d-accent);filter:blur(1.5px);opacity:0}',
    js: function (root, api) {
      var w = root.querySelector('.w'), D = root.querySelector('.det'), t = [], on = false;
      var G = document.createElement('div'); G.className = 'glow'; w.insertBefore(G, D);
      function wave(x) { // vertical sine edge at x%, filled to the right
        var p = ['100% 0', '100% 100%'];
        for (var y = 100; y >= 0; y -= 10) p.push((x + 6 * Math.sin(y / 50 * Math.PI)).toFixed(1) + '% ' + y + '%');
        return 'polygon(' + p.join(',') + ')';
      }
      function go(fwd) {
        on = fwd; w.classList.toggle('on', fwd);
        var o = { duration: api.reduce ? 1 : 520, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'both', direction: fwd ? 'normal' : 'reverse' };
        D.animate([{ clipPath: wave(112), opacity: 1 }, { clipPath: wave(-12), opacity: 1 }], o);
        G.animate([{ clipPath: wave(109), opacity: 1 }, { clipPath: wave(-15), opacity: 1 }], o);
      }
      root.addEventListener('click', function (e) {
        if (e.target.closest('.t') && !on) go(true);
        else if (e.target.closest('.bk') && on) go(false);
      });
      t.push(setTimeout(function () { go(true); }, 600), setTimeout(function () { go(false); }, 2200));
      return function () { t.forEach(clearTimeout); };
    }
  });
})();
