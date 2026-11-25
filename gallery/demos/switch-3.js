/* Switch · Part 3 — one toggle, six ways to flip it.
   Every demo: tap the card to flip the "Alerts" switch (it autoplays Off → On once).
   The label On/Off swaps instantly; only the knob/track motion differs. */
(function () {
  var SRC = 'Switch · Part 3';
  var BELL = '<svg viewBox="0 0 24 24"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20a2 2 0 0 0 4 0"/></svg>';
  var html = function (inner) {
    return '<div class="cd on"><span class="bl">' + BELL + '</span><div class="tx"><b>Alerts</b><small class="st">On</small></div>' +
      '<div class="tk" role="switch" aria-checked="true" aria-label="Alerts"><span class="fl"></span>' + (inner || '') + '<span class="kn"></span></div></div>';
  };
  var CSS =
    '& .cd{width:214px;height:66px;padding:0 14px;display:flex;align-items:center;gap:10px;background:var(--d-bg);border:1px solid var(--d-soft);border-radius:16px;cursor:pointer}' +
    '& .bl{width:30px;height:30px;border-radius:9px;display:grid;place-items:center;background:var(--d-soft);color:var(--d-mid);transition:background .25s,color .25s}' +
    '& .on .bl{background:var(--d-accent);color:var(--d-bg)}' +
    '& .bl svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;stroke-linejoin:round}' +
    '& .tx{flex:1;display:grid;line-height:1.2}& .tx b{font-size:14px}& .st{font-size:10.5px;color:var(--d-mid)}' +
    '& .tk{position:relative;width:56px;height:32px;border-radius:16px;background:var(--d-soft)}' +
    '& .fl{position:absolute;inset:0;border-radius:inherit;background:var(--d-accent);opacity:0;transition:opacity .25s}' +
    '& .on .fl{opacity:1}' +
    '& .kn{position:absolute;left:3px;top:3px;width:26px;height:26px;border-radius:50%;background:#fff;box-shadow:0 2px 5px rgba(0,0,0,.25);transform:translateX(24px)}';

  LUZ.add({
    id: 'switch-ghost-trail',
    cat: 'Tombol & Toggle',
    name: 'Ghost Trail',
    source: SRC,
    trigger: 'tap',
    motion: 'Knob melesat ke sisi lain dan meninggalkan 3 bayangan (afterimage) knob di sepanjang lintasan dengan opacity 0.5/0.35/0.2 yang tertinggal 35ms satu sama lain lalu memudar. Warna track berganti bersamaan.',
    timing: 'knob 250ms cubic-bezier(.2,.8,.2,1) · bayangan +35ms bertahap, pudar ≈200ms · warna 250ms',
    use: 'Toggle pengaturan yang ingin terasa cepat dan bertenaga, misalnya mode fokus atau notifikasi.',
    tags: 'switch toggle ghost trail afterimage motion blur dash knob',
    allowColor: true,
    html: html('<span class="kn gh"></span><span class="kn gh"></span><span class="kn gh"></span>'),
    css: CSS + '& .gh{opacity:0;box-shadow:none}',
    js: function (root, api) {
      var cd = root.querySelector('.cd'), kn = cd.querySelector('.kn:not(.gh)'), gh = cd.querySelectorAll('.gh'), on = true, T = [];
      var X = function (x) { return 'translateX(' + x + 'px)'; };
      function flip() {
        on = !on; var a = on ? 0 : 24, b = 24 - a;
        cd.classList.toggle('on', on); cd.querySelector('.st').textContent = on ? 'On' : 'Off'; cd.querySelector('.tk').setAttribute('aria-checked', on);
        cd.querySelectorAll('.kn').forEach(function (k) { k.getAnimations().forEach(function (x) { x.cancel(); }); });
        kn.style.transform = X(b);
        if (api.reduce) return;
        kn.animate({ transform: [X(a), X(b)] }, { duration: 250, easing: 'cubic-bezier(.2,.8,.2,1)' });
        gh.forEach(function (g, i) { g.animate({ transform: [X(a), X(b)], opacity: [0.5 - i * 0.15, 0.3 - i * 0.08, 0] }, { duration: 250 + i * 60, delay: (i + 1) * 35, easing: 'cubic-bezier(.2,.8,.2,1)' }); });
      }
      cd.addEventListener('click', function () { T.forEach(clearTimeout); flip(); });
      T.push(setTimeout(flip, 600), setTimeout(flip, 1800));
      return function () { T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'switch-pixel-teleport',
    cat: 'Tombol & Toggle',
    name: 'Pixel Teleport',
    source: SRC,
    trigger: 'tap',
    motion: 'Knob pecah menjadi grid piksel 4×4. Piksel-piksel terbang menyeberangi track sebagai awan acak (tiap piksel punya offset dan jeda sendiri), berkumpul lagi di tujuan, lalu menyatu kembali menjadi knob utuh. Warna track berganti di tengah perjalanan.',
    timing: 'pecah 80ms · terbang ≈350ms dengan jeda acak 0–60ms · menyatu 100ms · total ≈550ms',
    use: 'Toggle bertema digital/teknologi, misalnya mengaktifkan sinkronisasi atau mode privasi.',
    tags: 'switch toggle pixel teleport disintegrate particles rebuild',
    allowColor: true,
    html: html(),
    css: CSS + '& .px{position:absolute;left:3px;top:3px;width:6px;height:6px;border-radius:1px;background:#fff;opacity:0;pointer-events:none}',
    js: function (root, api) {
      var cd = root.querySelector('.cd'), tk = cd.querySelector('.tk'), kn = cd.querySelector('.kn'), on = true, T = [], px = [];
      for (var i = 0; i < 16; i++) { var p = document.createElement('i'); p.className = 'px'; p.style.margin = (i >> 2) * 6.6 + 'px 0 0 ' + (i % 4) * 6.6 + 'px'; tk.appendChild(p); px.push(p); }
      function flip() {
        on = !on; var a = on ? 0 : 24, b = 24 - a;
        cd.classList.toggle('on', on); cd.querySelector('.st').textContent = on ? 'On' : 'Off'; tk.setAttribute('aria-checked', on);
        [kn].concat(px).forEach(function (k) { k.getAnimations().forEach(function (x) { x.cancel(); }); });
        kn.style.transform = 'translateX(' + b + 'px)';
        if (api.reduce) return;
        kn.animate({ opacity: [1, 0, 0, 1], offset: [0, 0.15, 0.82, 1] }, { duration: 550 });
        px.forEach(function (p) {
          var mx = (a + b) / 2 + (Math.random() - 0.5) * 30, my = (Math.random() - 0.5) * 26;
          p.animate([{ transform: 'translate(' + a + 'px,0)', opacity: 0 }, { transform: 'translate(' + a + 'px,0)', opacity: 1, offset: 0.12 },
            { transform: 'translate(' + mx + 'px,' + my + 'px) rotate(90deg)', offset: 0.5 }, { transform: 'translate(' + b + 'px,0)', opacity: 1, offset: 0.85 }, { transform: 'translate(' + b + 'px,0)', opacity: 0 }],
            { duration: 500, delay: Math.random() * 60, easing: 'ease-in-out' });
        });
      }
      cd.addEventListener('click', function () { T.forEach(clearTimeout); flip(); });
      T.push(setTimeout(flip, 600), setTimeout(flip, 1800));
      return function () { T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'switch-water-fill',
    cat: 'Tombol & Toggle',
    name: 'Water Fill',
    source: SRC,
    trigger: 'tap',
    motion: 'Saat On, gelembung kecil naik lalu warna aksen naik dari dasar track seperti air dengan permukaan bergelombang yang terus bergoyang (kotak bersudut bulat 42% yang berputar). Saat Off, air surut ke bawah. Knob meluncur ke sisi tujuan.',
    timing: 'air naik/surut 380ms cubic-bezier(.3,.7,.4,1) · gelombang berputar 2.4s linear terus · knob 260ms ease-out · gelembung 400ms',
    use: 'Toggle yang berkaitan dengan cairan/level, misalnya pengingat minum atau infus, atau sekadar toggle yang ramah.',
    tags: 'switch toggle water fill liquid wave slosh bubbles',
    allowColor: true,
    html: html('<span class="wl"><span class="wv"></span></span><i class="bb"></i><i class="bb"></i><i class="bb"></i>'),
    css: CSS + '& .tk{overflow:hidden}& .fl{display:none}' +
      '& .wl{position:absolute;left:-32px;top:-98px;width:120px;height:132px;transform:translateY(134px);transition:transform .38s cubic-bezier(.3,.7,.4,1)}' +
      '& .on .wl{transform:translateY(0)}' +
      '& .wv{position:absolute;inset:0;border-radius:42%;background:var(--d-accent);animation:switch3spin 2.4s linear infinite}' +
      '& .bb{position:absolute;bottom:2px;width:4px;height:4px;border-radius:50%;background:#fff;opacity:0}' +
      '& .bb:nth-of-type(1){left:12px}& .bb:nth-of-type(2){left:22px}& .bb:nth-of-type(3){left:34px}' +
      '@keyframes switch3spin{to{transform:rotate(360deg)}}' +
      '@media (prefers-reduced-motion:reduce){& .wv{animation:none}& .wl{transition:none}}',
    js: function (root, api) {
      var cd = root.querySelector('.cd'), kn = cd.querySelector('.kn'), on = true, T = [];
      function flip() {
        on = !on; var a = on ? 0 : 24, b = 24 - a;
        cd.classList.toggle('on', on); cd.querySelector('.st').textContent = on ? 'On' : 'Off'; cd.querySelector('.tk').setAttribute('aria-checked', on);
        kn.getAnimations().forEach(function (x) { x.cancel(); });
        kn.style.transform = 'translateX(' + b + 'px)';
        if (api.reduce) return;
        kn.animate({ transform: ['translateX(' + a + 'px)', 'translateX(' + b + 'px)'] }, { duration: 260, easing: 'ease-out' });
        if (on) cd.querySelectorAll('.bb').forEach(function (d, i) { d.animate({ transform: ['translateY(0)', 'translateY(-22px)'], opacity: [0, 0.9, 0] }, { duration: 400, delay: i * 70, easing: 'ease-out' }); });
      }
      cd.addEventListener('click', function () { T.forEach(clearTimeout); flip(); });
      T.push(setTimeout(flip, 600), setTimeout(flip, 1800));
      return function () { T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'switch-tilt-roll',
    cat: 'Tombol & Toggle',
    name: 'Tilt & Roll',
    source: SRC,
    trigger: 'tap',
    motion: 'Track miring 7° dengan sisi tujuan lebih rendah, knob menggelinding turun (translateX + rotate 360°) sambil makin cepat. Sampai di ujung, knob tergencet ke dinding (scale 0.82 × 1.12) lalu memantul bulat lagi, dan track kembali datar.',
    timing: 'miring 120ms · gelinding 340ms ease-in · gencet 60ms + pantul 120ms · total ≈520ms',
    use: 'Toggle yang ingin terasa fisik dan main-main, misalnya di aplikasi kebiasaan/game kecil.',
    tags: 'switch toggle tilt roll gravity squash physical',
    allowColor: true,
    html: html(),
    css: CSS + '& .kn::after{content:"";position:absolute;left:5px;top:5px;width:6px;height:6px;border-radius:50%;background:var(--d-soft)}',
    js: function (root, api) {
      var cd = root.querySelector('.cd'), tk = cd.querySelector('.tk'), kn = cd.querySelector('.kn'), on = true, T = [];
      function flip() {
        on = !on; var a = on ? 0 : 24, b = 24 - a, d = b > a ? 1 : -1, X = function (x) { return 'translateX(' + x + 'px) '; };
        cd.classList.toggle('on', on); cd.querySelector('.st').textContent = on ? 'On' : 'Off'; tk.setAttribute('aria-checked', on);
        [tk, kn].forEach(function (k) { k.getAnimations().forEach(function (x) { x.cancel(); }); });
        kn.style.transform = X(b);
        if (api.reduce) return;
        tk.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(' + 7 * d + 'deg)', offset: 0.22 }, { transform: 'rotate(' + 7 * d + 'deg)', offset: 0.7 }, { transform: 'rotate(0)' }], { duration: 520, easing: 'ease-out' });
        kn.animate([{ transform: X(a) + 'rotate(0) scale(1)', easing: 'ease-in' }, { transform: X(a) + 'rotate(0) scale(1)', offset: 0.15, easing: 'ease-in' },
          { transform: X(b) + 'rotate(' + 360 * d + 'deg) scale(1)', offset: 0.7 }, { transform: X(b) + 'rotate(' + 360 * d + 'deg) scale(.82,1.12)', offset: 0.8 }, { transform: X(b) + 'rotate(' + 360 * d + 'deg) scale(1)' }], { duration: 520 });
      }
      cd.addEventListener('click', function () { T.forEach(clearTimeout); flip(); });
      T.push(setTimeout(flip, 600), setTimeout(flip, 1800));
      return function () { T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'switch-glitch-snap',
    cat: 'Tombol & Toggle',
    name: 'Glitch Snap',
    source: SRC,
    trigger: 'tap',
    motion: 'Knob melompat ke sisi lain dalam 4 langkah patah (steps), selama bergerak tampil RGB split (salinan merah dan cyan bergeser ±3px) dan irisan horizontal yang terpotong (clip-path inset berganti-ganti). Di akhir knob mendarat bersih, warna track berganti tanpa transisi.',
    timing: 'total 240ms steps(4) · RGB split + irisan selama gerak · track ganti seketika',
    use: 'Toggle untuk produk bertema cyber/gaming, atau mode developer/debug.',
    tags: 'switch toggle glitch rgb split chromatic aberration slice steps',
    allowColor: true,
    html: html(),
    css: CSS + '& .fl{transition:none}',
    js: function (root, api) {
      var cd = root.querySelector('.cd'), kn = cd.querySelector('.kn'), on = true, T = [];
      var RGB = '-3px 0 0 rgba(255,0,90,.85), 3px 0 0 rgba(0,220,255,.85)';
      function flip() {
        on = !on; var a = on ? 0 : 24, b = 24 - a;
        cd.classList.toggle('on', on); cd.querySelector('.st').textContent = on ? 'On' : 'Off'; cd.querySelector('.tk').setAttribute('aria-checked', on);
        kn.getAnimations().forEach(function (x) { x.cancel(); });
        kn.style.transform = 'translateX(' + b + 'px)';
        if (api.reduce) return;
        kn.animate({ transform: ['translateX(' + a + 'px)', 'translateX(' + b + 'px)'] }, { duration: 240, easing: 'steps(4, jump-end)' });
        kn.animate({ boxShadow: [RGB, RGB, RGB, 'none'], clipPath: ['inset(0 -8px 0 -8px)', 'inset(20% -8px 40% -8px)', 'inset(55% -8px 8% -8px)', 'inset(0 -8px 0 -8px)'] }, { duration: 240, easing: 'steps(1, jump-end)' });
      }
      cd.addEventListener('click', function () { T.forEach(clearTimeout); flip(); });
      T.push(setTimeout(flip, 600), setTimeout(flip, 1800));
      return function () { T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'switch-confetti-pop',
    cat: 'Tombol & Toggle',
    name: 'Confetti Pop',
    source: SRC,
    trigger: 'tap',
    motion: 'Saat On, knob meluncur ke kanan lalu 14 potongan konfeti warna-warni menyembur dari knob ke atas dan samping sambil berputar, lalu jatuh dan memudar. Saat Off, knob meluncur ke kiri dan muncul "kepulan debu": cincin 10 titik abu-abu yang mengembang dari knob lalu hilang.',
    timing: 'knob 250ms ease-out · konfeti ≈900ms ease-out · debu 350ms ease-out',
    use: 'Toggle yang menandai pencapaian, misalnya mengaktifkan target harian atau menyelesaikan pengaturan.',
    tags: 'switch toggle confetti burst celebration dust puff particles',
    allowColor: true,
    html: html('<span class="fx"></span>'),
    css: CSS + '& .fx{position:absolute;left:16px;top:16px;width:0;height:0;pointer-events:none;z-index:2}' +
      '& .fx i{position:absolute;left:-2px;top:-3px;width:4px;height:7px;border-radius:1px}',
    js: function (root, api) {
      var cd = root.querySelector('.cd'), kn = cd.querySelector('.kn'), fx = cd.querySelector('.fx'), on = true, T = [];
      function bit(color, kf, ms) {
        var p = document.createElement('i'); p.style.background = color; fx.appendChild(p);
        p.animate(kf, { duration: ms, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'forwards' }).finished.then(function () { p.remove(); }, function () {});
      }
      function flip() {
        on = !on; var a = on ? 0 : 24, b = 24 - a;
        cd.classList.toggle('on', on); cd.querySelector('.st').textContent = on ? 'On' : 'Off'; cd.querySelector('.tk').setAttribute('aria-checked', on);
        kn.getAnimations().forEach(function (x) { x.cancel(); });
        kn.style.transform = 'translateX(' + b + 'px)'; fx.style.transform = 'translateX(' + b + 'px)';
        if (api.reduce) return;
        kn.animate({ transform: ['translateX(' + a + 'px)', 'translateX(' + b + 'px)'] }, { duration: 250, easing: 'ease-out' });
        for (var i = 0; i < (on ? 14 : 10); i++) {
          var ang = on ? -Math.PI / 2 + (Math.random() - 0.5) * 2.6 : i / 10 * 2 * Math.PI, r = on ? 22 + Math.random() * 18 : 20;
          var x = Math.cos(ang) * r, y = Math.sin(ang) * r;
          if (on) bit('hsl(' + Math.round(Math.random() * 360) + ' 90% 60%)', [{ transform: 'translate(0,0) rotate(0)', opacity: 1 },
            { transform: 'translate(' + x + 'px,' + y + 'px) rotate(200deg)', opacity: 1, offset: 0.45 }, { transform: 'translate(' + x * 1.3 + 'px,' + (y + 34) + 'px) rotate(420deg)', opacity: 0 }], 900);
          else bit('var(--d-mid)', [{ transform: 'translate(0,0) scale(1)', opacity: 0.8, borderRadius: '50%' }, { transform: 'translate(' + x + 'px,' + y + 'px) scale(.4)', opacity: 0, borderRadius: '50%' }], 350);
        }
      }
      cd.addEventListener('click', function () { T.forEach(clearTimeout); flip(); });
      T.push(setTimeout(flip, 600), setTimeout(flip, 1800));
      return function () { T.forEach(clearTimeout); fx.innerHTML = ''; };
    }
  });
})();
