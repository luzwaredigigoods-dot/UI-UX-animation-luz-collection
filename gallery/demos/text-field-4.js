/* Text Field · Part 4 — six password-field focus/typing effects.
   The field is a real <input>: tap it and type. 600ms after mounting it auto-types "sunset42"
   (without stealing focus) so the thumbnail shows motion; focusing the field cancels the autoplay. */
(function () {
  var SRC = 'Text Field · Part 4';
  var EYE = '<svg class="eye" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/><path class="sl" d="M4 4l16 16" pathLength="1"/></svg>';
  var FIELD = '<label class="fld"><span class="lb">PASSWORD</span><input type="password" aria-label="Password" autocomplete="off" spellcheck="false">' + EYE + '</label>';
  var BASE =
    '& .box{position:relative;width:220px}' +
    '& .fld{position:relative;display:block;width:220px;height:42px;border:1px solid var(--d-mid);border-radius:10px;background:var(--d-bg);cursor:text;transition:border-color .15s,box-shadow .15s}' +
    '& .fld input{position:absolute;inset:0;width:100%;border:0;background:none;outline:0;padding:0 40px 0 12px;font:16px/1 sans-serif;letter-spacing:.18em;color:var(--d-fg);caret-color:var(--d-fg)}' +
    '& .lb{position:absolute;left:12px;top:50%;margin-top:-6px;font:600 10px/12px sans-serif;letter-spacing:.16em;color:var(--d-mid);pointer-events:none;transform-origin:0 50%;transition:transform .15s cubic-bezier(.2,.8,.2,1),opacity .15s,color .15s}' +
    '& .fld.v .lb,& .fld.f .lb{opacity:0}' +
    '& .eye{position:absolute;right:11px;top:50%;margin-top:-9px;width:18px;height:18px;fill:none;stroke:var(--d-fg);stroke-width:1.6;stroke-linecap:round;pointer-events:none}';
  // auto-typing helper shared by the real-<input> demos (copied into each js for portability)

  LUZ.add({
    id: 'field-floating-label',
    cat: 'Input & Form',
    name: 'Floating Label',
    source: SRC,
    trigger: 'fokus',
    motion: 'Saat fokus, placeholder "PASSWORD" mengecil ke 0.78 dan naik ke garis border atas, border terputus di belakang label (notch) dan menebal serta menggelap. Saat kosong dan blur, label turun lagi ke dalam field.',
    timing: 'label 150ms cubic-bezier(.2,.8,.2,1) · border 150ms · ketik 60ms/huruf',
    use: 'Field login atau form data pasien yang ringkas tanpa label terpisah di atasnya.',
    tags: 'floating label input focus notch outline material',
    html: '<div class="box">' + FIELD + '</div>',
    css: BASE +
      '& .fld.v .lb,& .fld.f .lb{opacity:1;color:var(--d-fg);transform:translateY(-21px) scale(.78);background:var(--d-bg);padding:0 4px;margin-left:-4px}' +
      '& .fld.f{border-color:var(--d-fg);box-shadow:0 0 0 .6px var(--d-fg)}',
    js: function (root, api) {
      var f = root.querySelector('.fld'), inp = f.querySelector('input'), T = [];
      function upd() { f.classList.toggle('v', !!inp.value); }
      function sim() {
        var s = 'sunset42', t = 150; f.classList.add('f');
        for (var i = 1; i <= s.length; i++) T.push(setTimeout(function (n) { inp.value = s.slice(0, n); upd(); }, t += 60, i));
        t += 1400;
        for (i = s.length - 1; i >= 0; i--) T.push(setTimeout(function (n) { inp.value = s.slice(0, n); upd(); }, t += 33, i));
        T.push(setTimeout(function () { f.classList.remove('f'); }, t + 200));
      }
      inp.addEventListener('input', upd);
      inp.addEventListener('focus', function () { T.forEach(clearTimeout); f.classList.add('f'); });
      inp.addEventListener('blur', function () { f.classList.remove('f'); });
      T.push(setTimeout(sim, 600));
      return function () { T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'field-underline-grow',
    cat: 'Input & Form',
    name: 'Underline Grow',
    source: SRC,
    trigger: 'fokus',
    motion: 'Saat fokus, placeholder menghilang dan garis bawah gelap 2px di dalam tepi bawah field tumbuh dari tengah ke kedua sisi (scaleX 0 → 1). Saat blur, garis menyusut kembali ke titik tengah. Border tetap tipis dan terang.',
    timing: 'garis 200ms ease-out (masuk) · 160ms ease-in (keluar)',
    use: 'Penanda fokus yang halus untuk form panjang, misalnya formulir pendaftaran pasien.',
    tags: 'underline grow focus input scaleX center',
    html: '<div class="box">' + FIELD + '</div>',
    css: BASE + '& .fld{border-color:var(--d-soft)}' +
      '& .fld::after{content:"";position:absolute;left:10px;right:10px;bottom:5px;height:2px;border-radius:2px;background:var(--d-fg);transform:scaleX(0);transition:transform .16s ease-in}' +
      '& .fld.f::after{transform:scaleX(1);transition:transform .2s cubic-bezier(.2,.8,.2,1)}',
    js: function (root, api) {
      var f = root.querySelector('.fld'), inp = f.querySelector('input'), T = [];
      function upd() { f.classList.toggle('v', !!inp.value); }
      function sim() {
        var s = 'sunset42', t = 150; f.classList.add('f');
        for (var i = 1; i <= s.length; i++) T.push(setTimeout(function (n) { inp.value = s.slice(0, n); upd(); }, t += 60, i));
        t += 1400;
        for (i = s.length - 1; i >= 0; i--) T.push(setTimeout(function (n) { inp.value = s.slice(0, n); upd(); }, t += 33, i));
        T.push(setTimeout(function () { f.classList.remove('f'); }, t + 200));
      }
      inp.addEventListener('input', upd);
      inp.addEventListener('focus', function () { T.forEach(clearTimeout); f.classList.add('f'); });
      inp.addEventListener('blur', function () { f.classList.remove('f'); });
      T.push(setTimeout(sim, 600));
      return function () { T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'field-glow-border',
    cat: 'Input & Form',
    name: 'Glow Border',
    source: SRC,
    trigger: 'fokus',
    motion: 'Selama field fokus, segmen terang sepanjang ±20% keliling berjalan searah jarum jam mengitari border bulat (atas kiri→kanan, turun, bawah kanan→kiri) seperti komet, berulang terus. Segmen hilang saat blur.',
    timing: '1 putaran 1,1 dtk linear, berulang · muncul/hilang 150ms',
    use: 'Menarik perhatian ke field yang sedang aktif, misalnya field PIN atau kode OTP.',
    tags: 'glow border comet focus ring stroke-dashoffset conic',
    html: '<div class="box">' + FIELD.replace('</label>', '<svg class="ring" viewBox="0 0 220 42" preserveAspectRatio="none" aria-hidden="true"><rect x="1" y="1" width="218" height="40" rx="9" pathLength="100"/></svg></label>') + '</div>',
    css: BASE + '& .fld{border-color:var(--d-soft)}' +
      '& .ring{position:absolute;inset:-1px;width:220px;height:42px;fill:none;stroke:var(--d-fg);stroke-width:2.2;stroke-linecap:round;stroke-dasharray:20 80;opacity:0;transition:opacity .15s;filter:drop-shadow(0 0 3px var(--d-accent));pointer-events:none;animation:fgring 1.1s linear infinite}' +
      '& .fld.f .ring{opacity:1}' +
      '@keyframes fgring{to{stroke-dashoffset:-100}}' +
      '@media (prefers-reduced-motion:reduce){& .ring{animation:none;stroke-dasharray:none}}',
    js: function (root, api) {
      var f = root.querySelector('.fld'), inp = f.querySelector('input'), T = [];
      function upd() { f.classList.toggle('v', !!inp.value); }
      function sim() {
        var s = 'sunset42', t = 150; f.classList.add('f');
        for (var i = 1; i <= s.length; i++) T.push(setTimeout(function (n) { inp.value = s.slice(0, n); upd(); }, t += 60, i));
        t += 1800;
        for (i = s.length - 1; i >= 0; i--) T.push(setTimeout(function (n) { inp.value = s.slice(0, n); upd(); }, t += 33, i));
        T.push(setTimeout(function () { f.classList.remove('f'); }, t + 200));
      }
      inp.addEventListener('input', upd);
      inp.addEventListener('focus', function () { T.forEach(clearTimeout); f.classList.add('f'); });
      inp.addEventListener('blur', function () { f.classList.remove('f'); });
      T.push(setTimeout(sim, 600));
      return function () { T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'field-live-validation',
    cat: 'Input & Form',
    name: 'Live Validation',
    source: SRC,
    trigger: 'ketik',
    motion: 'Saat isian kurang dari 8 karakter, border berubah putus-putus, lencana "!" hitam meletup (scale 0 → 1.15 → 1) dan teks bantu "8+ CHARACTERS" muncul di bawah. Begitu mencapai 8 karakter, border jadi utuh dan gelap, lencana berputar berganti tanda centang, teks bantu menjadi "LOOKS GOOD".',
    timing: 'lencana pop 200ms spring · putar ganti ikon 250ms · teks bantu fade+geser 150ms',
    use: 'Validasi kata sandi atau NIK saat diketik, tanpa menunggu tombol kirim.',
    tags: 'live validation inline error success badge check password strength',
    html: '<div class="box">' + FIELD.replace(EYE, '<i class="bd" aria-hidden="true"></i>' + EYE) + '<p class="help" aria-live="polite"></p></div>',
    css: BASE +
      '& .bd{position:absolute;right:36px;top:50%;width:16px;height:16px;margin-top:-8px;border-radius:50%;background:var(--d-fg);color:var(--d-bg);font:800 10px/16px sans-serif;text-align:center;font-style:normal;transform:scale(0)}' +
      '& .box.warn .fld{border-style:dashed;border-color:var(--d-fg)}' +
      '& .box.ok .fld{border-color:var(--d-fg);box-shadow:0 0 0 .6px var(--d-fg)}' +
      '& .box.warn .bd,& .box.ok .bd{transform:scale(1)}' +
      '& .help{position:absolute;left:2px;top:46px;margin:0;font:600 8.5px/1 sans-serif;letter-spacing:.16em;color:var(--d-fg)}',
    js: function (root, api) {
      var box = root.querySelector('.box'), f = root.querySelector('.fld'), inp = f.querySelector('input'), bd = f.querySelector('.bd'), help = root.querySelector('.help'), T = [], st = '';
      function upd() {
        f.classList.toggle('v', !!inp.value);
        var n = inp.value.length, s = n === 0 ? '' : n < 8 ? 'warn' : 'ok';
        if (s === st) return;
        box.classList.remove('warn', 'ok'); if (s) box.classList.add(s);
        bd.textContent = s === 'ok' ? '✓' : '!';
        help.textContent = s === 'ok' ? 'LOOKS GOOD' : s ? '8+ CHARACTERS' : '';
        if (!api.reduce && s) {
          bd.animate(st && s === 'ok' ? [{ transform: 'rotate(-180deg) scale(.6)' }, { transform: 'none' }] : [{ transform: 'scale(0)' }, { transform: 'scale(1.15)', offset: .7 }, { transform: 'scale(1)' }], { duration: st ? 250 : 200, easing: 'ease-out' });
          help.animate([{ opacity: 0, transform: 'translateY(-4px)' }, { opacity: 1, transform: 'none' }], { duration: 150 });
        }
        st = s;
      }
      function sim() {
        var s = 'sunset42', t = 150; f.classList.add('f');
        for (var i = 1; i <= 5; i++) T.push(setTimeout(function (n) { inp.value = s.slice(0, n); upd(); }, t += 60, i));
        t += 700;
        for (i = 6; i <= s.length; i++) T.push(setTimeout(function (n) { inp.value = s.slice(0, n); upd(); }, t += 90, i));
        t += 1400;
        for (i = s.length - 1; i >= 0; i--) T.push(setTimeout(function (n) { inp.value = s.slice(0, n); upd(); }, t += 33, i));
        T.push(setTimeout(function () { f.classList.remove('f'); }, t + 200));
      }
      inp.addEventListener('input', upd);
      inp.addEventListener('focus', function () { T.forEach(clearTimeout); f.classList.add('f'); });
      inp.addEventListener('blur', function () { f.classList.remove('f'); });
      T.push(setTimeout(sim, 600));
      return function () { T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'field-password-reveal',
    cat: 'Input & Form',
    name: 'Password Reveal',
    source: SRC,
    trigger: 'tap',
    motion: 'Ketuk ikon mata: garis coret pada ikon tertarik keluar, lalu titik-titik berubah menjadi huruf satu per satu dari kiri ke kanan, tiap karakter berputar/naik ke tempatnya (rotateX). Ketuk lagi untuk menyembunyikan dengan urutan yang sama.',
    timing: 'ikon 150ms · stagger 50ms per karakter · flip tiap karakter 100ms ease-out',
    use: 'Tombol lihat/sembunyikan kata sandi pada halaman login.',
    tags: 'password reveal show hide eye toggle stagger characters flip',
    html: '<div class="box"><div class="fld v" role="group" aria-label="Password"><span class="txt" aria-hidden="true"></span><button type="button" class="eb" aria-label="Tampilkan password" aria-pressed="false">' + EYE + '</button></div></div>',
    css: BASE +
      '& .fld{cursor:pointer}& .txt{position:absolute;left:12px;top:0;bottom:0;display:flex;align-items:center;font:500 14px/1 sans-serif;letter-spacing:.12em;perspective:200px}' +
      '& .txt span{display:inline-block;min-width:9px;text-align:center}' +
      '& .eb{position:absolute;right:0;top:0;width:44px;height:42px;border:0;background:none;cursor:pointer}' +
      '& .eb .eye{right:13px}& .sl{stroke-dasharray:1;stroke-dashoffset:0;transition:stroke-dashoffset .15s ease}& .eb[aria-pressed="true"] .sl{stroke-dashoffset:1}',
    js: function (root, api) {
      var f = root.querySelector('.fld'), txt = root.querySelector('.txt'), eb = root.querySelector('.eb'), W = 'sunset42', T = [], show = false;
      txt.innerHTML = W.split('').map(function () { return '<span>•</span>'; }).join('');
      var spans = [].slice.call(txt.children);
      function toggle() {
        show = !show; eb.setAttribute('aria-pressed', show); eb.setAttribute('aria-label', show ? 'Sembunyikan password' : 'Tampilkan password');
        T.forEach(clearTimeout); T = [];
        spans.forEach(function (s, i) {
          var want = show ? W[i] : '•';
          if (s.textContent === want) return;
          if (api.reduce) { s.textContent = want; return; }
          T.push(setTimeout(function () {
            s.animate([{ transform: 'rotateX(0)' }, { transform: 'rotateX(90deg)' }], { duration: 50, easing: 'ease-in' }).onfinish = function () {
              s.textContent = want;
              s.animate([{ transform: 'rotateX(-90deg) translateY(3px)' }, { transform: 'none' }], { duration: 70, easing: 'ease-out' });
            };
          }, i * 50));
        });
      }
      f.addEventListener('click', toggle);
      T.push(setTimeout(toggle, 600));
      return function () { T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'field-char-counter',
    cat: 'Input & Form',
    name: 'Char Counter',
    source: SRC,
    trigger: 'ketik',
    motion: 'Cincin progres kecil di bawah kanan field terisi searah jarum jam setiap karakter diketik (maks 12). Saat sisa ≤ 3, cincin membesar 1.4× dan angka sisa (3, 2, 1) muncul di kirinya; karakter melebihi batas ditolak dengan field bergetar.',
    timing: 'isi cincin 150ms ease-out per karakter · membesar 200ms spring · getar 240ms',
    use: 'Batas panjang isian, misalnya catatan singkat, judul, atau kode dengan panjang tetap.',
    tags: 'character counter limit ring progress maxlength remaining shake',
    html: '<div class="box">' + FIELD.replace('autocomplete', 'maxlength="12" autocomplete') + '<div class="cnt" aria-live="polite"><b></b><svg viewBox="0 0 20 20" aria-hidden="true"><circle class="tr" cx="10" cy="10" r="7"/><circle class="pg" cx="10" cy="10" r="7" pathLength="100"/></svg></div></div>',
    css: BASE + '& .fld{border-color:var(--d-soft)}& .fld.f{border-color:var(--d-mid)}' +
      '& .cnt{position:absolute;right:0;top:48px;display:flex;align-items:center;gap:5px;font:700 10px/1 sans-serif;transform-origin:100% 50%;transition:transform .2s cubic-bezier(.34,1.56,.64,1)}' +
      '& .cnt.low{transform:scale(1.4)}& .cnt b{opacity:0;transition:opacity .15s}& .cnt.low b{opacity:1}' +
      '& .cnt svg{width:16px;height:16px;fill:none;stroke-width:2.4;transform:rotate(-90deg)}& .tr{stroke:var(--d-soft)}' +
      '& .pg{stroke:var(--d-fg);stroke-dasharray:100;stroke-dashoffset:100;transition:stroke-dashoffset .15s ease-out}',
    js: function (root, api) {
      var f = root.querySelector('.fld'), inp = f.querySelector('input'), cnt = root.querySelector('.cnt'), pg = cnt.querySelector('.pg'), T = [], MAX = 12;
      function upd() {
        var n = inp.value.length, left = MAX - n;
        f.classList.toggle('v', n > 0);
        pg.style.strokeDashoffset = 100 - n / MAX * 100;
        cnt.classList.toggle('low', n > 0 && left <= 3); cnt.querySelector('b').textContent = left;
      }
      function reject() { if (!api.reduce) f.animate([{ transform: 'none' }, { transform: 'translateX(-4px)' }, { transform: 'translateX(4px)' }, { transform: 'translateX(-2px)' }, { transform: 'none' }], 240); }
      function sim() {
        var s = 'sunsetlake42', t = 150; f.classList.add('f');
        for (var i = 1; i <= s.length; i++) T.push(setTimeout(function (n) { inp.value = s.slice(0, n); upd(); }, t += i > 8 ? 160 : 60, i));
        T.push(setTimeout(reject, t += 250)); t += 1200;
        for (i = s.length - 1; i >= 0; i--) T.push(setTimeout(function (n) { inp.value = s.slice(0, n); upd(); }, t += 33, i));
        T.push(setTimeout(function () { f.classList.remove('f'); }, t + 200));
      }
      inp.addEventListener('input', upd);
      inp.addEventListener('keydown', function (e) { if (inp.value.length >= MAX && e.key.length === 1) reject(); });
      inp.addEventListener('focus', function () { T.forEach(clearTimeout); f.classList.add('f'); });
      inp.addEventListener('blur', function () { f.classList.remove('f'); });
      T.push(setTimeout(sim, 600));
      return function () { T.forEach(clearTimeout); };
    }
  });
})();
