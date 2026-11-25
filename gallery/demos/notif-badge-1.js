/* Notification Badge · Part 1 — one badge, six ways to count.
   Every demo: tap "+ New alert" to add one (max 9); tap the bell tile to clear ("All caught up").
   Autoplay: clear → +1 → +1. */
(function () {
  var SRC = 'Notification Badge · Part 1';
  var BELL = '<svg viewBox="0 0 24 24"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20a2 2 0 0 0 4 0"/></svg>';
  var html = function (badgeInner, extra) {
    return '<div class="nb"><span class="ic" role="button" aria-label="Tandai semua sudah dibaca">' + BELL + (extra || '') +
      '<span class="bd" aria-live="polite">' + (badgeInner || '<span class="n">3</span>') + '</span></span>' +
      '<div class="tx"><b>Notifications</b><small class="sub">3 new alerts</small></div>' +
      '<button class="add" type="button">+ New alert</button></div>';
  };
  var CSS =
    '& .nb{width:226px;padding:16px 14px;display:grid;grid-template-columns:50px 1fr;gap:8px 12px;align-items:center;background:var(--d-bg);border:1px solid var(--d-soft);border-radius:16px}' +
    '& .ic{grid-row:span 2;position:relative;width:50px;height:50px;border-radius:14px;display:grid;place-items:center;background:var(--d-accent);color:var(--d-bg);cursor:pointer}' +
    '& .ic svg{width:24px;height:24px;fill:currentColor;stroke:currentColor;stroke-width:1.5;stroke-linejoin:round}' +
    '& .bd{position:absolute;top:-7px;right:-7px;min-width:20px;height:20px;border-radius:10px;display:grid;place-items:center;background:#ff3b6b;color:#fff;font:700 11px/1 sans-serif;box-shadow:0 0 0 2px var(--d-bg)}' +
    '& .bd>*{grid-area:1/1}' +
    '& .tx{display:grid;line-height:1.25}& .tx b{font-size:13px}& .sub{font-size:10px;color:var(--d-mid)}' +
    '& .add{justify-self:start;border:1px solid var(--d-soft);background:transparent;border-radius:99px;padding:5px 11px;font-size:11px;font-weight:600;cursor:pointer;min-height:28px}';

  /* Shared flow (inside each js): set(k) updates the subtitle, then calls appear / change / clear. */

  LUZ.add({
    id: 'badge-spring-scale',
    cat: 'Feedback & Notifikasi',
    name: 'Spring Scale',
    source: SRC,
    trigger: 'tap',
    motion: 'Badge muncul dengan pegas: scale 0 → 1.3 → 0.92 → 1. Tiap hitungan baru membuat badge menggembung ke 1.25 lalu memantul kembali ke 1. Saat dikosongkan, badge mengecil ke 0.',
    timing: 'muncul 350ms spring · gembung 300ms · hilang 150ms ease-in',
    use: 'Badge jumlah pesan atau tugas baru, misalnya hasil lab baru di aplikasi dokter.',
    tags: 'notification badge count spring scale pop swell',
    allowColor: true,
    html: html(),
    css: CSS,
    js: function (root, api) {
      var nb = root.querySelector('.nb'), bd = nb.querySelector('.bd'), num = bd.querySelector('.n'), n = 3, T = [];
      function set(k) {
        var p = n; n = k; bd.getAnimations().forEach(function (a) { a.cancel(); });
        nb.querySelector('.sub').textContent = n ? n + ' new alert' + (n > 1 ? 's' : '') : 'All caught up';
        if (n) { num.textContent = n; bd.style.visibility = ''; }
        if (api.reduce) { bd.style.visibility = n ? '' : 'hidden'; return; }
        if (!n) bd.animate({ transform: ['scale(1)', 'scale(0)'] }, { duration: 150, easing: 'ease-in', fill: 'forwards' }).finished.then(function () { if (!n) bd.style.visibility = 'hidden'; }, function () {});
        else if (!p) bd.animate({ transform: ['scale(0)', 'scale(1.3)', 'scale(.92)', 'scale(1)'] }, { duration: 350, easing: 'ease-out' });
        else bd.animate({ transform: ['scale(1)', 'scale(1.25)', 'scale(.95)', 'scale(1)'] }, { duration: 300, easing: 'ease-out' });
      }
      nb.querySelector('.add').addEventListener('click', function () { T.forEach(clearTimeout); set(Math.min(n + 1, 9)); });
      nb.querySelector('.ic').addEventListener('click', function () { T.forEach(clearTimeout); if (n) set(0); });
      T.push(setTimeout(function () { set(0); }, 600), setTimeout(function () { set(1); }, 1400), setTimeout(function () { set(2); }, 2100));
      return function () { T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'badge-slot-roll',
    cat: 'Feedback & Notifikasi',
    name: 'Slot Roll',
    source: SRC,
    trigger: 'tap',
    motion: 'Angka di dalam badge bergulir vertikal seperti mesin slot: angka lama naik keluar (translateY 0 → −18px) sementara angka baru masuk dari bawah, terpotong oleh badge. Saat dikosongkan, badge memipih lalu menutup seperti tirai (scaleY ke 0).',
    timing: 'gulir 180ms ease-out · muncul: titik 150ms lalu gulir · tirai 200ms ease-in',
    use: 'Penghitung yang sering berubah, misalnya antrean pasien atau jumlah item di keranjang.',
    tags: 'notification badge slot machine roll digits odometer blind close',
    allowColor: true,
    html: html('<span class="n">3</span><span class="n2"></span>'),
    css: CSS + '& .bd{overflow:hidden}& .n2{opacity:0}',
    js: function (root, api) {
      var nb = root.querySelector('.nb'), bd = nb.querySelector('.bd'), num = bd.querySelector('.n'), n2 = bd.querySelector('.n2'), n = 3, T = [];
      function roll(old, d) {
        n2.textContent = old;
        n2.animate({ transform: ['translateY(0)', 'translateY(-18px)'], opacity: [1, 1] }, { duration: 180, delay: d, easing: 'ease-out', fill: 'backwards' });
        num.animate({ transform: ['translateY(18px)', 'translateY(0)'] }, { duration: 180, delay: d, easing: 'ease-out', fill: 'backwards' });
      }
      function set(k) {
        var p = n; n = k; [bd, num, n2].forEach(function (e) { e.getAnimations().forEach(function (a) { a.cancel(); }); });
        nb.querySelector('.sub').textContent = n ? n + ' new alert' + (n > 1 ? 's' : '') : 'All caught up';
        if (n) { num.textContent = n; bd.style.visibility = ''; }
        if (api.reduce) { bd.style.visibility = n ? '' : 'hidden'; return; }
        if (!n) bd.animate({ transform: ['scale(1,1)', 'scale(1.15,.5)', 'scale(1.15,0)'] }, { duration: 200, easing: 'ease-in', fill: 'forwards' }).finished.then(function () { if (!n) bd.style.visibility = 'hidden'; }, function () {});
        else if (!p) { bd.animate({ transform: ['scale(0)', 'scale(1)'] }, { duration: 150, easing: 'ease-out' }); roll('', 120); }
        else roll(p, 0);
      }
      nb.querySelector('.add').addEventListener('click', function () { T.forEach(clearTimeout); set(Math.min(n + 1, 9)); });
      nb.querySelector('.ic').addEventListener('click', function () { T.forEach(clearTimeout); if (n) set(0); });
      T.push(setTimeout(function () { set(0); }, 600), setTimeout(function () { set(1); }, 1400), setTimeout(function () { set(2); }, 2100));
      return function () { T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'badge-coin-flip',
    cat: 'Feedback & Notifikasi',
    name: 'Coin Flip',
    source: SRC,
    trigger: 'tap',
    motion: 'Setiap perubahan angka membalik badge pada sumbu Y seperti koin (rotateY 0 → 90°, angka diganti saat badge tampak dari samping, lalu −90° → 0). Saat dikosongkan, badge membalik menjadi badge mint berisi centang, diam ≈400ms, lalu mengecil hilang.',
    timing: 'setengah balik 80ms ease-in + 90ms ease-out · centang ditahan 400ms · hilang 150ms',
    use: 'Status yang berganti makna, misalnya badge tugas yang berubah menjadi "selesai".',
    tags: 'notification badge coin flip rotateY 3d check done',
    allowColor: true,
    html: html(),
    css: CSS + '& .bd.ck{background:#22b98f}',
    js: function (root, api) {
      var nb = root.querySelector('.nb'), bd = nb.querySelector('.bd'), num = bd.querySelector('.n'), n = 3, T = [];
      var P = 'perspective(200px) ';
      function flip(after, then) {
        bd.animate({ transform: [P + 'rotateY(0)', P + 'rotateY(90deg)'] }, { duration: 80, easing: 'ease-in' }).finished.then(function () {
          after(); var a = bd.animate({ transform: [P + 'rotateY(-90deg)', P + 'rotateY(0)'] }, { duration: 90, easing: 'ease-out' }); if (then) a.finished.then(then, function () {});
        }, function () {});
      }
      function set(k) {
        var p = n; n = k; bd.getAnimations().forEach(function (a) { a.cancel(); }); bd.classList.remove('ck');
        nb.querySelector('.sub').textContent = n ? n + ' new alert' + (n > 1 ? 's' : '') : 'All caught up';
        if (api.reduce) { num.textContent = n; bd.style.visibility = n ? '' : 'hidden'; return; }
        if (!n) flip(function () { bd.classList.add('ck'); num.textContent = '✓'; }, function () {
          bd.animate({ transform: ['scale(1)', 'scale(0)'] }, { duration: 150, delay: 400, easing: 'ease-in', fill: 'forwards' }).finished.then(function () { if (!n) bd.style.visibility = 'hidden'; }, function () {});
        });
        else if (!p) { num.textContent = n; bd.style.visibility = ''; bd.animate({ transform: [P + 'rotateY(-90deg) scale(.6)', P + 'rotateY(0) scale(1)'] }, { duration: 180, easing: 'ease-out' }); }
        else flip(function () { num.textContent = n; });
      }
      nb.querySelector('.add').addEventListener('click', function () { T.forEach(clearTimeout); set(Math.min(n + 1, 9)); });
      nb.querySelector('.ic').addEventListener('click', function () { T.forEach(clearTimeout); if (n) set(0); });
      T.push(setTimeout(function () { set(0); }, 600), setTimeout(function () { set(1); }, 1700), setTimeout(function () { set(2); }, 2400));
      return function () { T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'badge-gooey-drip',
    cat: 'Feedback & Notifikasi',
    name: 'Gooey Drip',
    source: SRC,
    trigger: 'tap',
    motion: 'Badge keluar dari tengah ikon seperti cairan kental: titik kecil di pusat ikon meluncur ke sudut kanan atas sambil memanjang (scale 0.9 × 1.25), lalu memipih (1.15 × 0.85) dan membulat, diikuti tetesan kecil yang menyusul. Tiap hitungan baru, tetesan mengalir dari pusat ikon ke badge dan badge menggembung. Saat dikosongkan, badge tersedot kembali ke pusat ikon.',
    timing: 'keluar 450ms ease-out · tetesan 300ms (jeda 80ms) · tersedot 380ms ease-in',
    use: 'Badge di ikon aplikasi bernuansa organik/lembut, misalnya aplikasi kesehatan ibu dan anak.',
    tags: 'notification badge gooey drip liquid ooze blob suck back',
    allowColor: true,
    html: html(null, '<span class="dp"></span>'),
    css: CSS + '& .dp{position:absolute;top:-1px;right:-1px;width:8px;height:8px;border-radius:50%;background:#ff3b6b;opacity:0;pointer-events:none}',
    js: function (root, api) {
      var nb = root.querySelector('.nb'), bd = nb.querySelector('.bd'), dp = nb.querySelector('.dp'), num = bd.querySelector('.n'), n = 3, T = [];
      var C = 'translate(-21px,21px) ';
      function drop(rev) {
        var k = [{ transform: C + 'scale(.6)', opacity: 1 }, { transform: 'translate(-4px,4px) scale(.9)', opacity: 1, offset: 0.8 }, { transform: 'scale(.3)', opacity: 0 }];
        dp.animate(rev ? k.reverse() : k, { duration: 300, delay: 80, easing: 'ease-in-out', fill: 'backwards' });
      }
      function set(k) {
        var p = n; n = k; [bd, dp].forEach(function (e) { e.getAnimations().forEach(function (a) { a.cancel(); }); });
        nb.querySelector('.sub').textContent = n ? n + ' new alert' + (n > 1 ? 's' : '') : 'All caught up';
        if (n) { num.textContent = n; bd.style.visibility = ''; }
        if (api.reduce) { bd.style.visibility = n ? '' : 'hidden'; return; }
        if (!n) {
          drop(true);
          bd.animate({ transform: ['none', 'translate(-8px,8px) scale(1.1,.8)', C + 'scale(.2)'] }, { duration: 380, easing: 'ease-in', fill: 'forwards' }).finished.then(function () { if (!n) bd.style.visibility = 'hidden'; }, function () {});
        } else if (!p) {
          bd.animate([{ transform: C + 'scale(.3)' }, { transform: 'translate(-9px,9px) scale(.9,1.25)', offset: 0.5 }, { transform: 'scale(1.15,.85)', offset: 0.8 }, { transform: 'none' }], { duration: 450, easing: 'ease-out' });
          drop();
        } else { drop(); bd.animate({ transform: ['scale(1)', 'scale(1)', 'scale(1.2)', 'scale(1)'], offset: [0, 0.6, 0.8, 1] }, { duration: 420 }); }
      }
      nb.querySelector('.add').addEventListener('click', function () { T.forEach(clearTimeout); set(Math.min(n + 1, 9)); });
      nb.querySelector('.ic').addEventListener('click', function () { T.forEach(clearTimeout); if (n) set(0); });
      T.push(setTimeout(function () { set(0); }, 600), setTimeout(function () { set(1); }, 1400), setTimeout(function () { set(2); }, 2100));
      return function () { T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'badge-sonar-ring',
    cat: 'Feedback & Notifikasi',
    name: 'Sonar Ring',
    source: SRC,
    trigger: 'tap',
    motion: 'Setiap hitungan baru memancarkan cincin outline merah muda dari badge yang mengembang (scale 1 → 2.2) sambil memudar, seperti sonar; badge sendiri berdenyut 1 → 1.15 → 1. Saat dikosongkan, cincin "jatuh kembali": mengecil dari 2.2 ke 1 ke arah badge, lalu badge menyusut hilang.',
    timing: 'cincin keluar 400ms ease-out · denyut 250ms · cincin masuk 300ms + badge hilang 250ms',
    use: 'Notifikasi yang butuh perhatian, misalnya panggilan darurat atau pesan dari perawat jaga.',
    tags: 'notification badge sonar ring pulse ripple radar',
    allowColor: true,
    html: html(null, '<span class="rg"></span>'),
    css: CSS + '& .rg{position:absolute;top:-7px;right:-7px;width:20px;height:20px;border-radius:50%;border:2px solid #ff3b6b;opacity:0;pointer-events:none}',
    js: function (root, api) {
      var nb = root.querySelector('.nb'), bd = nb.querySelector('.bd'), rg = nb.querySelector('.rg'), num = bd.querySelector('.n'), n = 3, T = [];
      function set(k) {
        var p = n; n = k; [bd, rg].forEach(function (e) { e.getAnimations().forEach(function (a) { a.cancel(); }); });
        nb.querySelector('.sub').textContent = n ? n + ' new alert' + (n > 1 ? 's' : '') : 'All caught up';
        if (n) { num.textContent = n; bd.style.visibility = ''; }
        if (api.reduce) { bd.style.visibility = n ? '' : 'hidden'; return; }
        if (!n) {
          rg.animate({ transform: ['scale(2.2)', 'scale(1)'], opacity: [0, 0.7, 0] }, { duration: 300, easing: 'ease-in' });
          bd.animate({ transform: ['scale(1)', 'scale(1)', 'scale(0)'], offset: [0, 0.4, 1] }, { duration: 420, easing: 'ease-in', fill: 'forwards' }).finished.then(function () { if (!n) bd.style.visibility = 'hidden'; }, function () {});
        } else {
          rg.animate({ transform: ['scale(1)', 'scale(2.2)'], opacity: [0.8, 0] }, { duration: 400, easing: 'ease-out' });
          bd.animate({ transform: p ? ['scale(1)', 'scale(1.15)', 'scale(1)'] : ['scale(0)', 'scale(1.15)', 'scale(1)'] }, { duration: 250, easing: 'ease-out' });
        }
      }
      nb.querySelector('.add').addEventListener('click', function () { T.forEach(clearTimeout); set(Math.min(n + 1, 9)); });
      nb.querySelector('.ic').addEventListener('click', function () { T.forEach(clearTimeout); if (n) set(0); });
      T.push(setTimeout(function () { set(0); }, 600), setTimeout(function () { set(1); }, 1400), setTimeout(function () { set(2); }, 2100));
      return function () { T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'badge-stretch-slide',
    cat: 'Feedback & Notifikasi',
    name: 'Stretch Slide',
    source: SRC,
    trigger: 'tap',
    motion: 'Badge muncul dari titik kecil (scale 0.3) yang tumbuh menjadi lingkaran. Saat angka berubah, latar badge meregang menjadi pil (scaleX 1 → 1.8 → 1) sementara angka lama bergeser keluar ke kiri dan angka baru masuk dari kanan. Saat dikosongkan, badge menyusut ke titik, diam sebentar, lalu memudar.',
    timing: 'muncul 220ms ease-out · regang + geser 260ms ease-in-out · menyusut 160ms, pudar 150ms (jeda 250ms)',
    use: 'Penghitung yang naik beruntun, misalnya jumlah pasien menunggu di poli.',
    tags: 'notification badge stretch pill slide digits elastic',
    allowColor: true,
    html: html('<span class="bg"></span><span class="n">3</span><span class="n2"></span>'),
    css: CSS + '& .bd{background:transparent;box-shadow:none}& .bg{width:100%;height:100%;border-radius:10px;background:#ff3b6b;box-shadow:0 0 0 2px var(--d-bg)}& .n,& .n2{position:relative}& .n2{opacity:0}',
    js: function (root, api) {
      var nb = root.querySelector('.nb'), bd = nb.querySelector('.bd'), bg = bd.querySelector('.bg'), num = bd.querySelector('.n'), n2 = bd.querySelector('.n2'), n = 3, T = [];
      function set(k) {
        var p = n; n = k; [bd, bg, num, n2].forEach(function (e) { e.getAnimations().forEach(function (a) { a.cancel(); }); });
        nb.querySelector('.sub').textContent = n ? n + ' new alert' + (n > 1 ? 's' : '') : 'All caught up';
        if (n) { num.textContent = n; bd.style.visibility = ''; }
        if (api.reduce) { bd.style.visibility = n ? '' : 'hidden'; return; }
        if (!n) bd.animate([{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(.35)', opacity: 1, offset: 0.3 }, { transform: 'scale(.35)', opacity: 1, offset: 0.75 }, { transform: 'scale(.35)', opacity: 0 }], { duration: 560, fill: 'forwards' })
          .finished.then(function () { if (!n) bd.style.visibility = 'hidden'; }, function () {});
        else if (!p) bd.animate({ transform: ['scale(.3)', 'scale(1)'] }, { duration: 220, easing: 'ease-out' });
        else {
          n2.textContent = p; var o = { duration: 260, easing: 'ease-in-out' };
          bg.animate({ transform: ['scaleX(1)', 'scaleX(1.8)', 'scaleX(1)'] }, o);
          n2.animate({ transform: ['translateX(0)', 'translateX(-10px)'], opacity: [1, 0] }, o);
          num.animate({ transform: ['translateX(10px)', 'translateX(0)'], opacity: [0, 1] }, o);
        }
      }
      nb.querySelector('.add').addEventListener('click', function () { T.forEach(clearTimeout); set(Math.min(n + 1, 9)); });
      nb.querySelector('.ic').addEventListener('click', function () { T.forEach(clearTimeout); if (n) set(0); });
      T.push(setTimeout(function () { set(0); }, 600), setTimeout(function () { set(1); }, 1400), setTimeout(function () { set(2); }, 2100));
      return function () { T.forEach(clearTimeout); };
    }
  });
})();
