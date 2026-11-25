/* Notifications · Part 3 — one toast, six ways to show it.
   Every demo: tap "Notify" to show the toast above the button; tap the toast (or its ×) to dismiss.
   The toast alternates between "Upload complete" and "Jun sent a message". Autoplays show → hide once. */
(function () {
  var SRC = 'Notifications · Part 3';
  var html = function (extra) {
    return '<div class="w"><div class="ts" role="status"><div class="ct"><span class="av">✓</span>' +
      '<span class="tt"><b>Upload complete</b><small>report-final.pdf · 2.4 MB</small></span><span class="x" role="button" aria-label="Tutup">×</span></div>' + (extra || '') + '</div>' +
      '<button class="nf" type="button"><svg viewBox="0 0 24 24"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20a2 2 0 0 0 4 0"/></svg>Notify</button></div>';
  };
  var CSS =
    '& .w{position:relative;width:230px;height:132px}' +
    '& .ts{position:absolute;left:0;right:0;top:6px;height:54px;visibility:hidden;cursor:pointer}' +
    '& .w.on .ts{visibility:visible}' +
    '& .ct{height:100%;display:flex;align-items:center;gap:10px;padding:0 10px 0 12px;background:var(--d-bg);border:1px solid var(--d-soft);border-radius:14px;box-shadow:0 8px 20px rgba(0,0,0,.12)}' +
    '& .av{flex:none;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;background:#22b98f;color:#fff;font:700 13px/1 sans-serif}' +
    '& .av.j{background:var(--d-accent);color:var(--d-bg)}' +
    '& .tt{flex:1;min-width:0;display:grid;line-height:1.25}& .tt b{font-size:12px}& .tt small{font-size:9.5px;color:var(--d-mid);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '& .x{width:22px;height:22px;border-radius:50%;border:1px solid var(--d-soft);display:grid;place-items:center;color:var(--d-mid);font-size:13px}' +
    '& .nf{position:absolute;left:50%;bottom:6px;transform:translateX(-50%);display:flex;align-items:center;gap:6px;border:0;border-radius:99px;padding:0 18px;height:36px;background:var(--d-accent);color:var(--d-bg);font-size:12.5px;font-weight:600;cursor:pointer}' +
    '& .nf svg{width:14px;height:14px;fill:currentColor}';

  /* Shared flow (inside each js): toggle() → content swap + enter(), or leave() then hide. */

  LUZ.add({
    id: 'toast-circle-reveal',
    cat: 'Feedback & Notifikasi',
    name: 'Circle Reveal',
    source: SRC,
    trigger: 'tap',
    motion: 'Lingkaran clip-path yang berpusat di tombol Notify (di bawah toast) tumbuh ke atas dan membuka toast dengan tepi melengkung. Saat ditutup, lingkaran menyusut ke arah tombol × di kanan, seolah toast masuk ke tombol tutup.',
    timing: 'buka 300ms ease-out · tutup 300ms ease-in',
    use: 'Toast yang jelas berasal dari sebuah tombol aksi, misalnya "Simpan" atau "Kirim resep".',
    tags: 'toast notification circle reveal clip-path from button close into x',
    allowColor: true,
    html: html(),
    css: CSS,
    js: function (root, api) {
      var w = root.querySelector('.w'), ts = w.querySelector('.ts'), on = false, k = 0, T = [];
      var M = [['✓', 'Upload complete', 'report-final.pdf · 2.4 MB'], ['J', 'Jun sent a message', 'Are we still on for 7?']];
      function enter() { ts.animate({ clipPath: ['circle(0% at 50% 170%)', 'circle(160% at 50% 170%)'] }, { duration: 300, easing: 'ease-out' }); }
      function leave() { return [ts.animate({ clipPath: ['circle(160% at 92% 50%)', 'circle(0% at 92% 50%)'] }, { duration: 300, easing: 'ease-in', fill: 'forwards' })]; }
      function kill() { w.querySelectorAll('*').forEach(function (e) { e.getAnimations().forEach(function (a) { a.cancel(); }); }); }
      function toggle() {
        on = !on; kill();
        if (on) {
          var m = M[k++ % 2], av = ts.querySelector('.av'); av.textContent = m[0]; av.classList.toggle('j', m[0] === 'J');
          ts.querySelector('b').textContent = m[1]; ts.querySelector('small').textContent = m[2];
          w.classList.add('on'); if (!api.reduce) enter();
        } else Promise.all((api.reduce ? [] : leave()).map(function (a) { return a.finished; })).then(function () { if (!on) w.classList.remove('on'); }, function () {});
      }
      w.querySelector('.nf').addEventListener('click', function () { T.forEach(clearTimeout); toggle(); });
      ts.addEventListener('click', function () { T.forEach(clearTimeout); if (on) toggle(); });
      T.push(setTimeout(toggle, 600), setTimeout(toggle, 2400));
      return function () { T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'toast-button-morph',
    cat: 'Feedback & Notifikasi',
    name: 'Button Morph',
    source: SRC,
    trigger: 'tap',
    motion: 'Tombol Notify meregang ke atas menjadi gumpalan biru (shared element: translate + scale dari kotak tombol ke kotak toast), lalu isi toast memudar masuk saat gumpalan memudar. Saat ditutup, isi memudar kembali ke gumpalan biru yang menyusut turun dan menyatu dengan tombol.',
    timing: 'morph 300ms ease-out · isi masuk 150ms (mulai 250ms) · kembali 420ms ease-in',
    use: 'Konfirmasi yang lahir dari tombol yang ditekan, misalnya "Pengingat dibuat" setelah tombol jadwalkan.',
    tags: 'toast notification button morph shared element flip expand blob',
    allowColor: true,
    html: html(),
    css: CSS + '& .bl{position:absolute;left:0;right:0;top:6px;height:54px;border-radius:14px;background:linear-gradient(90deg,var(--d-accent),var(--d-mid));opacity:0;pointer-events:none}',
    js: function (root, api) {
      var w = root.querySelector('.w'), ts = w.querySelector('.ts'), nf = w.querySelector('.nf'), bl = document.createElement('span'), on = false, k = 0, T = [];
      var M = [['✓', 'Upload complete', 'report-final.pdf · 2.4 MB'], ['J', 'Jun sent a message', 'Are we still on for 7?']];
      bl.className = 'bl'; w.insertBefore(bl, nf);
      function from() { // .nf is centred with left:50% + translateX(-50%), so offsetLeft is its centre x
        var dx = nf.offsetLeft - (ts.offsetLeft + ts.offsetWidth / 2), dy = nf.offsetTop + nf.offsetHeight / 2 - (ts.offsetTop + ts.offsetHeight / 2);
        return 'translate(' + dx + 'px,' + dy + 'px) scale(' + nf.offsetWidth / ts.offsetWidth + ',' + nf.offsetHeight / ts.offsetHeight + ')';
      }
      function enter() {
        bl.animate([{ transform: from(), opacity: 1 }, { transform: 'none', opacity: 1, offset: 0.67 }, { transform: 'none', opacity: 0 }], { duration: 450, easing: 'ease-out' });
        ts.animate({ opacity: [0, 1] }, { duration: 150, delay: 250, fill: 'backwards' });
      }
      function leave() {
        return [ts.animate({ opacity: [1, 0] }, { duration: 120, fill: 'forwards' }),
          bl.animate([{ transform: 'none', opacity: 0 }, { transform: 'none', opacity: 1, offset: 0.25 }, { transform: from(), opacity: 1, offset: 0.9 }, { transform: from(), opacity: 0 }], { duration: 420, easing: 'ease-in' })];
      }
      function kill() { w.querySelectorAll('*').forEach(function (e) { e.getAnimations().forEach(function (a) { a.cancel(); }); }); }
      function toggle() {
        on = !on; kill();
        if (on) {
          var m = M[k++ % 2], av = ts.querySelector('.av'); av.textContent = m[0]; av.classList.toggle('j', m[0] === 'J');
          ts.querySelector('b').textContent = m[1]; ts.querySelector('small').textContent = m[2];
          w.classList.add('on'); if (!api.reduce) enter();
        } else Promise.all((api.reduce ? [] : leave()).map(function (a) { return a.finished; })).then(function () { if (!on) w.classList.remove('on'); }, function () {});
      }
      nf.addEventListener('click', function () { T.forEach(clearTimeout); toggle(); });
      ts.addEventListener('click', function () { T.forEach(clearTimeout); if (on) toggle(); });
      T.push(setTimeout(toggle, 600), setTimeout(toggle, 2400));
      return function () { T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'toast-outline-draw',
    cat: 'Feedback & Notifikasi',
    name: 'Outline Draw',
    source: SRC,
    trigger: 'tap',
    motion: 'Garis biru bercahaya menggambar keliling kotak searah jarum jam dari kiri atas (stroke-dashoffset 100 → 0), lalu isi toast tersapu masuk dari kiri ke kanan (clip-path inset) dan garis meredup menjadi border tipis. Saat ditutup, isi tersapu keluar ke kiri lalu garisnya dihapus kembali.',
    timing: 'garis 300ms ease-in-out · sapuan isi 250ms ease-out (mulai 280ms) · tutup 200ms + 250ms',
    use: 'Notifikasi di tema gelap/teknis, misalnya status sinkronisasi data atau unggahan selesai.',
    tags: 'toast notification outline draw stroke dashoffset glow wipe text',
    allowColor: true,
    html: html('<svg class="tr" aria-hidden="true"><rect width="100%" height="100%" rx="14" pathLength="100"/></svg>'),
    css: CSS + '& .ct{border-color:transparent}& .tr{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none}' +
      '& .tr rect{fill:none;stroke:var(--d-accent);stroke-width:1.5;stroke-dasharray:100;opacity:.5;filter:drop-shadow(0 0 2px var(--d-accent))}',
    js: function (root, api) {
      var w = root.querySelector('.w'), ts = w.querySelector('.ts'), ct = ts.querySelector('.ct'), line = ts.querySelector('.tr rect'), on = false, k = 0, T = [];
      var M = [['✓', 'Upload complete', 'report-final.pdf · 2.4 MB'], ['J', 'Jun sent a message', 'Are we still on for 7?']];
      function enter() {
        line.animate({ strokeDashoffset: [100, 0], opacity: [1, 1, 0.5] }, { duration: 600, easing: 'ease-in-out' });
        ct.animate({ clipPath: ['inset(-20px 100% -20px -20px)', 'inset(-20px -20px -20px -20px)'] }, { duration: 250, delay: 280, easing: 'ease-out', fill: 'backwards' });
      }
      function leave() {
        return [ct.animate({ clipPath: ['inset(-20px -20px -20px -20px)', 'inset(-20px 100% -20px -20px)'] }, { duration: 200, easing: 'ease-in', fill: 'forwards' }),
          line.animate({ strokeDashoffset: [0, 100], opacity: [1, 1] }, { duration: 250, delay: 200, easing: 'ease-in', fill: 'forwards' })];
      }
      function kill() { w.querySelectorAll('*').forEach(function (e) { e.getAnimations().forEach(function (a) { a.cancel(); }); }); }
      function toggle() {
        on = !on; kill();
        if (on) {
          var m = M[k++ % 2], av = ts.querySelector('.av'); av.textContent = m[0]; av.classList.toggle('j', m[0] === 'J');
          ts.querySelector('b').textContent = m[1]; ts.querySelector('small').textContent = m[2];
          w.classList.add('on'); if (!api.reduce) enter();
        } else Promise.all((api.reduce ? [] : leave()).map(function (a) { return a.finished; })).then(function () { if (!on) w.classList.remove('on'); }, function () {});
      }
      w.querySelector('.nf').addEventListener('click', function () { T.forEach(clearTimeout); toggle(); });
      ts.addEventListener('click', function () { T.forEach(clearTimeout); if (on) toggle(); });
      T.push(setTimeout(toggle, 600), setTimeout(toggle, 2400));
      return function () { T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'toast-blinds',
    cat: 'Feedback & Notifikasi',
    name: 'Blinds',
    source: SRC,
    trigger: 'tap',
    motion: 'Toast terbuka bilah demi bilah seperti tirai jendela: 5 bilah horizontal masing-masing membuka dari garis tengahnya (clip-path polygon), berurutan dari atas ke bawah. Saat ditutup, bilah menutup mulai dari bilah paling bawah ke atas.',
    timing: 'buka 350ms total, stagger ≈50ms per bilah · tutup 300ms dari bawah',
    use: 'Notifikasi bergaya rapi/arsitektural, misalnya pengumuman jadwal atau status ruangan.',
    tags: 'toast notification blinds slats venetian clip-path polygon stagger',
    allowColor: true,
    html: html(),
    css: CSS,
    js: function (root, api) {
      var w = root.querySelector('.w'), ts = w.querySelector('.ts'), on = false, k = 0, T = [];
      var M = [['✓', 'Upload complete', 'report-final.pdf · 2.4 MB'], ['J', 'Jun sent a message', 'Are we still on for 7?']];
      function blinds(open, up) {
        var frames = [];
        for (var f = 0; f <= 10; f++) {
          var pts = [];
          for (var i = 0; i < 5; i++) {
            var j = up ? 4 - i : i, h = Math.max(0, Math.min(1, (f / 10) * 2 - j * 0.25)); if (!open) h = 1 - h;
            var c = i * 20 + 10, y0 = (c - 10 * h).toFixed(2), y1 = (c + 10 * h).toFixed(2);
            pts.push('-5% ' + y0 + '%, 105% ' + y0 + '%, 105% ' + y1 + '%, -5% ' + y1 + '%');
          }
          frames.push({ clipPath: 'polygon(' + pts.join(', ') + ')' });
        }
        return frames;
      }
      function enter() { ts.animate(blinds(true, false), { duration: 350, easing: 'ease-out' }); }
      function leave() { return [ts.animate(blinds(false, true), { duration: 300, easing: 'ease-in', fill: 'forwards' })]; }
      function kill() { w.querySelectorAll('*').forEach(function (e) { e.getAnimations().forEach(function (a) { a.cancel(); }); }); }
      function toggle() {
        on = !on; kill();
        if (on) {
          var m = M[k++ % 2], av = ts.querySelector('.av'); av.textContent = m[0]; av.classList.toggle('j', m[0] === 'J');
          ts.querySelector('b').textContent = m[1]; ts.querySelector('small').textContent = m[2];
          w.classList.add('on'); if (!api.reduce) enter();
        } else Promise.all((api.reduce ? [] : leave()).map(function (a) { return a.finished; })).then(function () { if (!on) w.classList.remove('on'); }, function () {});
      }
      w.querySelector('.nf').addEventListener('click', function () { T.forEach(clearTimeout); toggle(); });
      ts.addEventListener('click', function () { T.forEach(clearTimeout); if (on) toggle(); });
      T.push(setTimeout(toggle, 600), setTimeout(toggle, 2400));
      return function () { T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'toast-pixel-dissolve',
    cat: 'Feedback & Notifikasi',
    name: 'Pixel Dissolve',
    source: SRC,
    trigger: 'tap',
    motion: 'Toast dirakit dari 24 ubin piksel (8×3) yang terbang dari posisi acak (±40px, berputar) lalu menempel di tempatnya, kolom kiri lebih dulu; setelah lengkap isi toast muncul dan ubin hilang. Saat ditutup, toast remuk menjadi ubin yang melayang naik dan memudar dari kiri ke kanan.',
    timing: 'ubin 300ms ease-out, stagger 30ms per kolom · isi 100ms · remuk 400ms, stagger 25ms',
    use: 'Notifikasi bergaya digital/game, atau saat ingin menegaskan sesuatu "dibangun", misalnya laporan selesai dibuat.',
    tags: 'toast notification pixel dissolve tiles assemble crumble disintegrate',
    allowColor: true,
    html: html('<span class="px"></span>'),
    css: CSS + '& .px{position:absolute;inset:0;pointer-events:none}& .px i{position:absolute;width:12.5%;height:33.4%;background:var(--d-bg);border:1px solid var(--d-soft);opacity:0}',
    js: function (root, api) {
      var w = root.querySelector('.w'), ts = w.querySelector('.ts'), ct = ts.querySelector('.ct'), px = ts.querySelector('.px'), on = false, k = 0, T = [], tiles = [];
      var M = [['✓', 'Upload complete', 'report-final.pdf · 2.4 MB'], ['J', 'Jun sent a message', 'Are we still on for 7?']];
      for (var i = 0; i < 24; i++) { var t = document.createElement('i'); t.style.left = (i % 8) * 12.5 + '%'; t.style.top = Math.floor(i / 8) * 33.3 + '%'; px.appendChild(t); tiles.push(t); }
      var R = function (n) { return (Math.random() - 0.5) * n; };
      function enter() {
        tiles.forEach(function (t, i) {
          t.animate([{ transform: 'translate(' + R(80) + 'px,' + R(60) + 'px) rotate(' + R(180) + 'deg)', opacity: 0 }, { transform: 'none', opacity: 1, offset: 0.6 }, { transform: 'none', opacity: 1, offset: 0.85 }, { transform: 'none', opacity: 0 }],
            { duration: 500, delay: (i % 8) * 30, easing: 'ease-out' });
        });
        ct.animate({ opacity: [0, 1] }, { duration: 100, delay: 480, fill: 'backwards' });
      }
      function leave() {
        var a = [ct.animate({ opacity: [1, 0] }, { duration: 60, fill: 'forwards' })];
        tiles.forEach(function (t, i) {
          a.push(t.animate([{ transform: 'none', opacity: 1 }, { transform: 'translate(' + R(16) + 'px,' + (-14 - Math.random() * 20) + 'px) rotate(' + R(90) + 'deg) scale(.6)', opacity: 0 }],
            { duration: 400, delay: (i % 8) * 25, easing: 'ease-in', fill: 'both' }));
        });
        return a;
      }
      function kill() { w.querySelectorAll('*').forEach(function (e) { e.getAnimations().forEach(function (a) { a.cancel(); }); }); }
      function toggle() {
        on = !on; kill();
        if (on) {
          var m = M[k++ % 2], av = ts.querySelector('.av'); av.textContent = m[0]; av.classList.toggle('j', m[0] === 'J');
          ts.querySelector('b').textContent = m[1]; ts.querySelector('small').textContent = m[2];
          w.classList.add('on'); if (!api.reduce) enter();
        } else Promise.all((api.reduce ? [] : leave()).map(function (a) { return a.finished; })).then(function () { if (!on) w.classList.remove('on'); }, function () {});
      }
      w.querySelector('.nf').addEventListener('click', function () { T.forEach(clearTimeout); toggle(); });
      ts.addEventListener('click', function () { T.forEach(clearTimeout); if (on) toggle(); });
      T.push(setTimeout(toggle, 600), setTimeout(toggle, 2400));
      return function () { T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'toast-depth-focus',
    cat: 'Feedback & Notifikasi',
    name: 'Depth Focus',
    source: SRC,
    trigger: 'tap',
    motion: 'Toast melesat dari kejauhan: dari scale 0.7, blur(8px), opacity 0 menjadi scale 1.03 lalu 1, tajam dan penuh. Saat ditutup, toast terus mendekat melewati mata (scale 1 → 1.3) sambil kabur dan memudar.',
    timing: 'masuk 260ms ease-out (overshoot 3%) · keluar 300ms ease-in',
    use: 'Toast yang perlu terasa penting tapi tetap halus, misalnya "Pembayaran berhasil".',
    tags: 'toast notification depth focus zoom blur scale z-axis',
    allowColor: true,
    html: html(),
    css: CSS,
    js: function (root, api) {
      var w = root.querySelector('.w'), ts = w.querySelector('.ts'), on = false, k = 0, T = [];
      var M = [['✓', 'Upload complete', 'report-final.pdf · 2.4 MB'], ['J', 'Jun sent a message', 'Are we still on for 7?']];
      function enter() { ts.animate({ transform: ['scale(.7)', 'scale(1.03)', 'scale(1)'], filter: ['blur(8px)', 'blur(0)', 'blur(0)'], opacity: [0, 1, 1] }, { duration: 260, easing: 'ease-out' }); }
      function leave() { return [ts.animate({ transform: ['scale(1)', 'scale(1.3)'], filter: ['blur(0)', 'blur(8px)'], opacity: [1, 0] }, { duration: 300, easing: 'ease-in', fill: 'forwards' })]; }
      function kill() { w.querySelectorAll('*').forEach(function (e) { e.getAnimations().forEach(function (a) { a.cancel(); }); }); }
      function toggle() {
        on = !on; kill();
        if (on) {
          var m = M[k++ % 2], av = ts.querySelector('.av'); av.textContent = m[0]; av.classList.toggle('j', m[0] === 'J');
          ts.querySelector('b').textContent = m[1]; ts.querySelector('small').textContent = m[2];
          w.classList.add('on'); if (!api.reduce) enter();
        } else Promise.all((api.reduce ? [] : leave()).map(function (a) { return a.finished; })).then(function () { if (!on) w.classList.remove('on'); }, function () {});
      }
      w.querySelector('.nf').addEventListener('click', function () { T.forEach(clearTimeout); toggle(); });
      ts.addEventListener('click', function () { T.forEach(clearTimeout); if (on) toggle(); });
      T.push(setTimeout(toggle, 600), setTimeout(toggle, 2400));
      return function () { T.forEach(clearTimeout); };
    }
  });
})();
