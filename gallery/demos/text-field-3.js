/* Text Field · Part 3 — tap, type, verify: six ways to give feedback.
   Every demo: tap the verified field → it clears and an email is typed; when the arrow lights up,
   tap it (or the field) → verified (mint check). Autoplays one full cycle. */
(function () {
  var SRC = 'Text Field · Part 3';
  var ARROW = '<svg class="ar" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var CHECK = '<svg class="ck" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  var html = function (extra) {
    return '<div class="fw"><small class="lb">Email</small>' +
      '<div class="fd ok" role="textbox" aria-label="Email"><span class="v">leo@mail.io</span><span class="bt" role="button" aria-label="Verifikasi">' + ARROW + CHECK + '</span>' + (extra || '') + '<span class="fx"></span></div>' +
      '<small class="nt">✓ Email verified</small></div>';
  };
  var CSS =
    '& .fw{position:relative;width:224px;display:grid;gap:5px;cursor:pointer}' +
    '& .lb{font-size:10px;font-weight:600;color:var(--d-accent)}' +
    '& .fd{position:relative;height:42px;display:flex;align-items:center;gap:8px;padding:0 8px 0 14px;background:var(--d-bg);border:1.5px solid var(--d-soft);border-radius:12px}' +
    '& .fd.ed{border-color:var(--d-accent)}& .fd.ok{border-color:#22b98f}' +
    '& .v{flex:1;font-size:13px;font-weight:500;white-space:nowrap}' +
    '& .ed .v::after{content:"";display:inline-block;width:1.5px;height:14px;margin-left:1px;vertical-align:-2px;background:var(--d-accent);animation:field3blink 1s steps(1) infinite}' +
    '& .bt{position:relative;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;background:var(--d-soft);color:var(--d-mid);transition:background .2s,color .2s}' +
    '& .rd .bt{background:var(--d-accent);color:var(--d-bg)}& .ok .bt{background:#22b98f;color:#fff}' +
    '& .bt svg{grid-area:1/1;width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}' +
    '& .ck{display:none}& .ok .ck{display:block}& .ok .ar{display:none}' +
    '& .nt{font-size:10px;color:#22b98f;opacity:0;transition:opacity .2s}& .fw:has(.ok) .nt{opacity:1}' +
    '& .fx{position:absolute;inset:0;pointer-events:none;overflow:visible}' +
    '& .ghost{position:absolute;left:0;pointer-events:none}' +
    '@keyframes field3blink{50%{opacity:0}}';

  LUZ.add({
    id: 'field3-corner-lock',
    cat: 'Input & Form',
    name: 'Corner Lock',
    source: SRC,
    trigger: 'tap',
    motion: 'Di setiap ketukan (fokus dan kirim), empat siku sudut berbentuk L terbang masuk dari 8px di luar tiap sudut lalu "mengunci" pas di sudut kolom dengan sedikit overshoot. Siku bercahaya sebentar lalu memudar ke border.',
    timing: 'masuk 220ms cubic-bezier(.3,1.5,.5,1) · tahan 300ms · pudar 250ms',
    use: 'Menandai fokus/konfirmasi di kolom penting, misalnya input NIK atau nomor rekam medis.',
    tags: 'text field input focus corner brackets lock frame snap',
    allowColor: true,
    html: html('<i class="cr"></i><i class="cr"></i><i class="cr"></i><i class="cr"></i>'),
    css: CSS + '& .cr{position:absolute;width:10px;height:10px;border:2.5px solid var(--d-accent);opacity:0;pointer-events:none}' +
      '& .cr:nth-of-type(1){left:-5px;top:-5px;border-width:2.5px 0 0 2.5px;border-radius:5px 0 0 0}& .cr:nth-of-type(2){right:-5px;top:-5px;border-width:2.5px 2.5px 0 0;border-radius:0 5px 0 0}' +
      '& .cr:nth-of-type(3){left:-5px;bottom:-5px;border-width:0 0 2.5px 2.5px;border-radius:0 0 0 5px}& .cr:nth-of-type(4){right:-5px;bottom:-5px;border-width:0 2.5px 2.5px 0;border-radius:0 0 5px 0}',
    js: function (root, api) {
      var fw = root.querySelector('.fw'), fd = fw.querySelector('.fd'), v = fd.querySelector('.v'), st = 'ok', T = [], k = 0;
      var W = ['mia@mail.com', 'leo@mail.io'], D = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
      function lock() {
        if (api.reduce) return;
        fd.querySelectorAll('.cr').forEach(function (c, i) {
          c.style.borderColor = st === 'ok' ? '#22b98f' : '';
          c.animate([{ transform: 'translate(' + D[i][0] * 8 + 'px,' + D[i][1] * 8 + 'px)', opacity: 0 }, { transform: 'none', opacity: 1, offset: 0.3 }, { opacity: 1, offset: 0.7 }, { opacity: 0 }],
            { duration: 750, easing: 'cubic-bezier(.3,1.5,.5,1)' });
        });
      }
      function edit() {
        st = 'ed'; fd.className = 'fd ed'; v.textContent = ''; lock();
        W[k++ % 2].split('').forEach(function (ch, i, a) { T.push(setTimeout(function () { v.textContent += ch; if (i === a.length - 1) fd.classList.add('rd'); }, 150 + i * 60)); });
      }
      function verify() { st = 'ok'; fd.className = 'fd ok'; lock(); }
      fw.addEventListener('click', function () { if (st === 'ok') edit(); else if (fd.classList.contains('rd')) verify(); });
      T.push(setTimeout(edit, 600), setTimeout(verify, 1900));
      return function () { T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'field3-rubber-border',
    cat: 'Input & Form',
    name: 'Rubber Border',
    source: SRC,
    trigger: 'tap',
    motion: 'Border kolom penyok ke dalam tepat di titik ketuk (tepi atas melengkung ±7px dengan lembah di posisi x ketukan), lalu bergoyang balik seperti karet dalam 2–3 osilasi yang meredam. Terjadi saat ketuk kolom dan saat ketuk tombol kirim.',
    timing: '≈500ms · pegas teredam (amplitudo 7px · e^(−t/120ms) · periode ≈280ms)',
    use: 'Kolom input yang ingin terasa lentur dan responsif terhadap sentuhan, misalnya form di aplikasi mobile.',
    tags: 'text field input rubber elastic border dent wobble svg path spring',
    allowColor: true,
    html: html('<svg class="ol" viewBox="0 0 224 42" preserveAspectRatio="none" aria-hidden="true"><path/></svg>'),
    css: CSS + '& .fd,& .fd.ed,& .fd.ok{border-color:transparent}' +
      '& .ol{position:absolute;inset:-1.5px;width:calc(100% + 3px);height:calc(100% + 3px);overflow:visible;pointer-events:none;color:var(--d-soft)}' +
      '& .ed .ol{color:var(--d-accent)}& .ok .ol{color:#22b98f}& .ol path{fill:none;stroke:currentColor;stroke-width:1.5}',
    js: function (root, api) {
      var fw = root.querySelector('.fw'), fd = fw.querySelector('.fd'), v = fd.querySelector('.v'), path = fd.querySelector('.ol path'), st = 'ok', T = [], k = 0, raf;
      var W = ['mia@mail.com', 'leo@mail.io'];
      function draw(x, d) {
        x = Math.max(36, Math.min(188, x));
        path.setAttribute('d', 'M12 0H' + (x - 24) + 'Q' + x + ' ' + 2 * d + ' ' + (x + 24) + ' 0H212Q224 0 224 12V30Q224 42 212 42H12Q0 42 0 30V12Q0 0 12 0Z');
      }
      function dent(x) {
        cancelAnimationFrame(raf); if (api.reduce) return draw(x, 0);
        var t0 = performance.now();
        (function step(now) { var t = now - t0; draw(x, 7 * Math.exp(-t / 120) * Math.cos(t / 45)); if (t < 520) raf = requestAnimationFrame(step); else draw(x, 0); })(t0);
      }
      function edit(x) {
        st = 'ed'; fd.className = 'fd ed'; v.textContent = ''; dent(x);
        W[k++ % 2].split('').forEach(function (ch, i, a) { T.push(setTimeout(function () { v.textContent += ch; if (i === a.length - 1) fd.classList.add('rd'); }, 150 + i * 60)); });
      }
      function verify(x) { st = 'ok'; fd.className = 'fd ok'; dent(x); }
      draw(100, 0);
      fw.addEventListener('click', function (e) {
        var x = e.clientX - fd.getBoundingClientRect().left;
        if (st === 'ok') edit(x); else if (fd.classList.contains('rd')) verify(x);
      });
      T.push(setTimeout(function () { edit(60); }, 600), setTimeout(function () { verify(200); }, 1900));
      return function () { T.forEach(clearTimeout); cancelAnimationFrame(raf); };
    }
  });

  LUZ.add({
    id: 'field3-key-pop',
    cat: 'Input & Form',
    name: 'Key Pop',
    source: SRC,
    trigger: 'ketik',
    motion: 'Setiap huruf yang diketik memunculkan "gelembung tuts" kotak bulat biru berisi huruf itu di bawah caret: scale 0.3 → 1.1 → 1 sambil naik 6px, lalu memudar. Saat kirim, ikon centang melompat masuk ke tombol (turun dari −16px dengan pantulan kecil) dan tombol berubah mint.',
    timing: 'gelembung 380ms ease-out per huruf (huruf tiap 60ms) · centang 320ms dengan pantulan',
    use: 'Input PIN/OTP atau kolom pendek di layar sentuh, agar pengguna yakin hurufnya masuk.',
    tags: 'text field typing key bubble pop keyboard preview check jump',
    allowColor: true,
    html: html(),
    css: CSS + '& .kb{position:absolute;top:40px;width:18px;height:21px;margin-left:-9px;border-radius:5px;display:grid;place-items:center;background:var(--d-accent);color:var(--d-bg);font:600 11px/1 sans-serif}',
    js: function (root, api) {
      var fw = root.querySelector('.fw'), fd = fw.querySelector('.fd'), v = fd.querySelector('.v'), fx = fd.querySelector('.fx'), st = 'ok', T = [], k = 0;
      var W = ['mia@mail.com', 'leo@mail.io'];
      function key(ch) {
        if (api.reduce) return;
        var b = document.createElement('i'); b.className = 'kb'; b.textContent = ch; b.style.left = v.offsetLeft + v.offsetWidth + 'px'; fx.appendChild(b);
        b.animate([{ transform: 'translateY(6px) scale(.3)', opacity: 0 }, { transform: 'translateY(0) scale(1.1)', opacity: 1, offset: 0.3 }, { transform: 'scale(1)', opacity: 1, offset: 0.7 }, { opacity: 0 }],
          { duration: 380, easing: 'ease-out' }).finished.then(function () { b.remove(); }, function () {});
      }
      function edit() {
        st = 'ed'; fd.className = 'fd ed'; v.textContent = '';
        W[k++ % 2].split('').forEach(function (ch, i, a) { T.push(setTimeout(function () { v.textContent += ch; key(ch); if (i === a.length - 1) fd.classList.add('rd'); }, 150 + i * 60)); });
      }
      function verify() {
        st = 'ok'; fd.className = 'fd ok';
        if (!api.reduce) fd.querySelector('.ck').animate([{ transform: 'translateY(-16px) scale(.6)', opacity: 0 }, { transform: 'translateY(2px) scale(1.1)', opacity: 1, offset: 0.7 }, { transform: 'none' }], { duration: 320, easing: 'ease-out' });
      }
      fw.addEventListener('click', function () { if (st === 'ok') edit(); else if (fd.classList.contains('rd')) verify(); });
      T.push(setTimeout(edit, 600), setTimeout(verify, 1900));
      return function () { T.forEach(clearTimeout); fx.innerHTML = ''; };
    }
  });

  LUZ.add({
    id: 'field3-spark-keys',
    cat: 'Input & Form',
    name: 'Spark Keys',
    source: SRC,
    trigger: 'ketik',
    motion: 'Setiap huruf yang diketik melempar 5 percikan kecil warna-warni ke atas dari caret; percikan melayang ±10px lalu hilang. Saat verifikasi, ledakan konfeti 10 garis radial memancar dari tombol yang berubah menjadi centang mint.',
    timing: 'percikan 280ms ease-out per huruf · ledakan 420ms ease-out',
    use: 'Form yang ingin terasa menyenangkan, misalnya pendaftaran akun atau input kode undangan.',
    tags: 'text field typing sparks particles confetti burst verify',
    allowColor: true,
    html: html(),
    css: CSS + '& .sp{position:absolute;width:3px;height:3px;border-radius:50%}& .ray{position:absolute;width:2px;height:6px;border-radius:2px;background:#22b98f}',
    js: function (root, api) {
      var fw = root.querySelector('.fw'), fd = fw.querySelector('.fd'), v = fd.querySelector('.v'), fx = fd.querySelector('.fx'), st = 'ok', T = [], k = 0;
      var W = ['mia@mail.com', 'leo@mail.io'];
      function puff(cls, x, y, n, kf, ms) {
        if (api.reduce) return;
        for (var i = 0; i < n; i++) {
          var p = document.createElement('i'); p.className = cls; p.style.left = x + 'px'; p.style.top = y + 'px';
          if (cls === 'sp') p.style.background = 'hsl(' + Math.round(Math.random() * 360) + ' 90% 60%)';
          fx.appendChild(p);
          p.animate(kf(i, n), { duration: ms, easing: 'ease-out', fill: 'forwards' }).finished.then(function () { this.remove(); }.bind(p), function () {});
        }
      }
      function spark() {
        puff('sp', v.offsetLeft + v.offsetWidth, 14, 5, function () {
          return { transform: ['translate(0,0)', 'translate(' + (Math.random() - 0.5) * 20 + 'px,' + (-6 - Math.random() * 12) + 'px)'], opacity: [1, 0] };
        }, 280);
      }
      function edit() {
        st = 'ed'; fd.className = 'fd ed'; v.textContent = '';
        W[k++ % 2].split('').forEach(function (ch, i, a) { T.push(setTimeout(function () { v.textContent += ch; spark(); if (i === a.length - 1) fd.classList.add('rd'); }, 150 + i * 60)); });
      }
      function verify() {
        st = 'ok'; fd.className = 'fd ok';
        var b = fd.querySelector('.bt');
        puff('ray', b.offsetLeft + 12, b.offsetTop + 10, 10, function (i, n) {
          var r = 'rotate(' + i * 360 / n + 'deg) ';
          return { transform: [r + 'translateY(-12px)', r + 'translateY(-22px)'], opacity: [1, 0] };
        }, 420);
      }
      fw.addEventListener('click', function () { if (st === 'ok') edit(); else if (fd.classList.contains('rd')) verify(); });
      T.push(setTimeout(edit, 600), setTimeout(verify, 1900));
      return function () { T.forEach(clearTimeout); fx.innerHTML = ''; };
    }
  });

  LUZ.add({
    id: 'field3-flip-verify',
    cat: 'Input & Form',
    name: 'Flip Verify',
    source: SRC,
    trigger: 'tap',
    motion: 'Saat verifikasi, seluruh kolom berbalik pada sumbu horizontal (rotateX 0 → 90°, tepat di tengah terlihat tipis seperti garis) dan muncul sisi belakangnya yang mint "terverifikasi". Mengetuk kolom yang sudah terverifikasi membaliknya lagi ke sisi biru yang kosong untuk mengetik ulang.',
    timing: 'setengah pertama 130ms ease-in · setengah kedua 140ms ease-out · total ≈270ms',
    use: 'Konfirmasi status yang tegas, misalnya kolom email/telepon yang sudah diverifikasi OTP.',
    tags: 'text field flip card rotateX verify back side state change',
    allowColor: true,
    html: html(),
    css: CSS,
    js: function (root, api) {
      var fw = root.querySelector('.fw'), fd = fw.querySelector('.fd'), v = fd.querySelector('.v'), st = 'ok', T = [], k = 0;
      var W = ['mia@mail.com', 'leo@mail.io'];
      function flip() {
        if (api.reduce) return;
        var old = fd.cloneNode(true); old.classList.add('ghost'); old.setAttribute('aria-hidden', 'true');
        old.style.top = fd.offsetTop + 'px'; old.style.width = fd.offsetWidth + 'px'; fw.appendChild(old);
        old.animate({ transform: ['perspective(400px) rotateX(0)', 'perspective(400px) rotateX(90deg)'] }, { duration: 130, easing: 'ease-in', fill: 'forwards' }).finished.then(function () { old.remove(); }, function () {});
        fd.animate({ transform: ['perspective(400px) rotateX(-90deg)', 'perspective(400px) rotateX(0)'] }, { duration: 140, delay: 130, easing: 'ease-out', fill: 'backwards' });
      }
      function edit() {
        flip(); st = 'ed'; fd.className = 'fd ed'; v.textContent = '';
        W[k++ % 2].split('').forEach(function (ch, i, a) { T.push(setTimeout(function () { v.textContent += ch; if (i === a.length - 1) fd.classList.add('rd'); }, 300 + i * 60)); });
      }
      function verify() { flip(); st = 'ok'; fd.className = 'fd ok'; }
      fw.addEventListener('click', function () { if (st === 'ok') edit(); else if (fd.classList.contains('rd')) verify(); });
      T.push(setTimeout(edit, 600), setTimeout(verify, 2000));
      return function () { T.forEach(clearTimeout); fw.querySelectorAll('.ghost').forEach(function (g) { g.remove(); }); };
    }
  });

  LUZ.add({
    id: 'field3-scan-sweep',
    cat: 'Input & Form',
    name: 'Scan Sweep',
    source: SRC,
    trigger: 'tap',
    motion: 'Batang cahaya vertikal menyapu kolom dari kiri ke kanan. Di belakang batang (sebelah kiri) kolom sudah dicat dengan status baru, di depannya masih status lama (salinan status lama dipotong clip-path inset dari kiri). Dipakai saat kosongkan untuk mengetik dan saat terverifikasi.',
    timing: 'sapuan 280ms cubic-bezier(.4,0,.2,1) · batang cahaya 14px',
    use: 'Perubahan status yang ingin terlihat "dipindai", misalnya verifikasi kartu BPJS atau kode voucher.',
    tags: 'text field scan sweep light bar wipe repaint state change',
    allowColor: true,
    html: html(),
    css: CSS + '& .beam{position:absolute;top:-3px;bottom:-3px;left:0;width:14px;margin-left:-7px;border-radius:7px;background:linear-gradient(90deg,transparent,var(--d-accent),transparent);pointer-events:none;opacity:.85}',
    js: function (root, api) {
      var fw = root.querySelector('.fw'), fd = fw.querySelector('.fd'), v = fd.querySelector('.v'), st = 'ok', T = [], k = 0;
      var W = ['mia@mail.com', 'leo@mail.io'];
      function sweep() {
        if (api.reduce) return;
        var old = fd.cloneNode(true), beam = document.createElement('i'), o = { duration: 280, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' };
        old.classList.add('ghost'); old.setAttribute('aria-hidden', 'true'); old.style.top = fd.offsetTop + 'px'; old.style.width = fd.offsetWidth + 'px';
        beam.className = 'beam'; old.appendChild(beam); fw.appendChild(old);
        old.animate({ clipPath: ['inset(-4px -4px -4px 0)', 'inset(-4px -4px -4px 100%)'] }, o).finished.then(function () { old.remove(); }, function () {});
        beam.animate({ transform: ['translateX(0)', 'translateX(' + fd.offsetWidth + 'px)'] }, o);
      }
      function edit() {
        sweep(); st = 'ed'; fd.className = 'fd ed'; v.textContent = '';
        W[k++ % 2].split('').forEach(function (ch, i, a) { T.push(setTimeout(function () { v.textContent += ch; if (i === a.length - 1) fd.classList.add('rd'); }, 320 + i * 60)); });
      }
      function verify() { sweep(); st = 'ok'; fd.className = 'fd ok'; }
      fw.addEventListener('click', function () { if (st === 'ok') edit(); else if (fd.classList.contains('rd')) verify(); });
      T.push(setTimeout(edit, 600), setTimeout(verify, 2000));
      return function () { T.forEach(clearTimeout); fw.querySelectorAll('.ghost').forEach(function (g) { g.remove(); }); };
    }
  });
})();
