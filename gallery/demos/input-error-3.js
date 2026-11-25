/* Input Error · Part 3 — one email field, six ways to say "that's not valid". */
(function () {
  var SRC = 'Input Error · Part 3';
  var zz = '0,4';
  for (var i = 1; i <= 24; i++) zz += ' ' + i * 5 + ',' + (i % 2 ? 0 : 8);
  function html(extraField, extraFrm) {
    return '<div class="frm"><div class="fld"><small>Email</small><div class="row"><span class="tx">mia@orbi</span><i class="car"></i></div><span class="ic"></span>' + (extraField || '') + '</div>' +
      '<p class="msg">Enter a valid email</p>' + (extraFrm || '') + '<button class="go" type="button">Continue →</button></div>';
  }
  var CSS =
    '& .frm{width:230px;display:grid;gap:5px}' +
    '& .fld{position:relative;padding:7px 12px 8px;border-radius:10px;border:1.5px solid var(--d-soft);background:var(--d-bg);transition:border-color .2s}' +
    '& .fld small{display:block;font-size:9px;color:var(--d-mid);transition:color .2s}' +
    '& .row{display:flex;align-items:center;height:20px;font-size:15px;font-weight:500;color:var(--d-fg)}' +
    '& .car{width:1.5px;height:15px;margin-left:1px;background:var(--d-accent);animation:ieCar 1s steps(1) infinite}' +
    '@keyframes ieCar{50%{opacity:0}}' +
    '& .ic{position:absolute;right:10px;top:50%;width:16px;height:16px;margin-top:-8px;border-radius:50%;display:grid;place-items:center;font-size:10px;font-weight:700;color:#fff;transform:scale(0);transition:transform .2s}' +
    '& .err .ic{background:#ef4f6a;transform:scale(1)}& .err .ic::before{content:"!"}' +
    '& .ok .ic{background:#1fbf8f;transform:scale(1)}& .ok .ic::before{content:"✓"}' +
    '& .err .fld{border-color:#ef4f6a}& .err .fld small{color:#ef4f6a}& .ok .fld{border-color:#1fbf8f}' +
    '& .msg{margin:0 0 0 4px;height:12px;font-size:9.5px;color:#ef4f6a;opacity:0;transition:opacity .2s}' +
    '& .err .msg{opacity:1}' +
    '& .go{margin-top:6px;height:36px;border:0;border-radius:99px;background:linear-gradient(90deg,#7c5cff,#2fa8ff);color:#fff;font:inherit;font-weight:600;font-size:12px;cursor:pointer}' +
    '& .go:active{transform:scale(.97)}';

  LUZ.add({
    id: 'inerr-zigzag-underline',
    cat: 'Input & Form',
    name: 'Zigzag Underline',
    source: SRC,
    trigger: 'tap',
    motion: 'Garis bawah merah zigzag tergambar di bawah teks dari kiri ke kanan dengan amplitudo besar, lalu “berdengung”: amplitudonya berayun bolak-balik dan meluruh (scaleY 1→−0.7→0.5→−0.3→0.08) hingga menjadi garis lurus tipis merah. Border dan label ikut merah, pesan galat muncul.',
    timing: 'gambar 200ms · dengung 400ms meluruh · ulang: Continue → galat → benar → reset',
    use: 'Validasi field email/NIK/nomor HP saat tombol kirim ditekan.',
    tags: 'input error validation zigzag underline squiggle buzz',
    allowColor: true,
    html: html('<svg class="zz" viewBox="0 0 120 8" preserveAspectRatio="none"><polyline pathLength="1" points="' + zz + '"/></svg>'),
    css: CSS +
      '& .zz{position:absolute;left:12px;bottom:3px;width:96px;height:8px;overflow:visible;opacity:0}' +
      '& .zz polyline{fill:none;stroke:#ef4f6a;stroke-width:1.6;stroke-dasharray:1;vector-effect:non-scaling-stroke}' +
      '& .err .zz{opacity:1}',
    js: function (root, api) {
      var frm = root.querySelector('.frm'), tx = root.querySelector('.tx'), zz = root.querySelector('.zz'), line = zz.firstChild, st = 0;
      function run() {
        st = (st + 1) % 3;
        frm.className = 'frm' + (st === 1 ? ' err' : st === 2 ? ' ok' : '');
        tx.textContent = st === 2 ? 'mia@orbi.app' : 'mia@orbi';
        if (st !== 1) return;
        line.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: api.reduce ? 1 : 200, fill: 'forwards' });
        zz.animate(api.reduce ? [{ transform: 'scaleY(.08)' }, { transform: 'scaleY(.08)' }]
          : [{ transform: 'scaleY(1)' }, { transform: 'scaleY(1)', offset: 0.33 }, { transform: 'scaleY(-.7)' }, { transform: 'scaleY(.5)' }, { transform: 'scaleY(-.3)' }, { transform: 'scaleY(.15)' }, { transform: 'scaleY(.08)' }],
          { duration: 600, easing: 'linear', fill: 'forwards' });
      }
      root.querySelector('.go').onclick = run;
      var t = setTimeout(run, 600);
      return function () { clearTimeout(t); };
    }
  });

  LUZ.add({
    id: 'inerr-alert-pop',
    cat: 'Input & Form',
    name: 'Alert Pop',
    source: SRC,
    trigger: 'tap',
    motion: 'Lingkaran merah berisi “!” meloncat keluar di ujung kanan field dengan pegas (scale 0→1.25→1), sekaligus 8 garis percikan memancar ke segala arah lalu memudar. Border merah dan pesan galat ikut muncul.',
    timing: 'ikon 350ms pegas (cubic-bezier .34,1.56,.64,1) · percikan 300ms ease-out',
    use: 'Galat validasi yang perlu menarik perhatian, misalnya field wajib di form pendaftaran pasien.',
    tags: 'input error alert icon pop spring sparks burst',
    allowColor: true,
    html: html('<span class="spk"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>'),
    css: CSS +
      '& .err .ic{transition:none}' +
      '& .spk{position:absolute;right:18px;top:50%;width:0;height:0;pointer-events:none}' +
      '& .spk i{position:absolute;left:-.75px;top:0;width:1.5px;height:5px;border-radius:1px;background:#ef4f6a;opacity:0}',
    js: function (root, api) {
      var frm = root.querySelector('.frm'), tx = root.querySelector('.tx'), ic = root.querySelector('.ic'), sparks = root.querySelectorAll('.spk i'), st = 0;
      function run() {
        st = (st + 1) % 3;
        frm.className = 'frm' + (st === 1 ? ' err' : st === 2 ? ' ok' : '');
        tx.textContent = st === 2 ? 'mia@orbi.app' : 'mia@orbi';
        if (st !== 1 || api.reduce) return;
        ic.animate([{ transform: 'scale(0)' }, { transform: 'scale(1.25)', offset: 0.6 }, { transform: 'scale(1)' }], { duration: 350, easing: 'cubic-bezier(.34,1.56,.64,1)' });
        sparks.forEach(function (s, i) {
          var a = 'rotate(' + i * 45 + 'deg)';
          s.animate([{ transform: a + ' translateY(-9px) scaleY(.4)', opacity: 1 }, { transform: a + ' translateY(-17px) scaleY(1)', opacity: 0 }], { duration: 300, delay: 80, easing: 'ease-out' });
        });
      }
      root.querySelector('.go').onclick = run;
      var t = setTimeout(run, 600);
      return function () { clearTimeout(t); };
    }
  });

  LUZ.add({
    id: 'inerr-message-drop',
    cat: 'Input & Form',
    name: 'Message Drop',
    source: SRC,
    trigger: 'tap',
    motion: 'Pesan galat merah jatuh dari bawah field (translateY −10px→0) lalu berayun seperti bandul dengan tumpuan di kiri (rotate −6°→4°→−2.5°→1°→0) sampai diam. Border field berubah merah.',
    timing: '≈600ms · ayunan teredam, ease-out',
    use: 'Pesan bantuan/galat di bawah field form yang ingin terasa ringan dan ramah.',
    tags: 'input error message drop swing pendulum helper text',
    allowColor: true,
    html: html(),
    css: CSS + '& .msg{transform-origin:0 0}',
    js: function (root, api) {
      var frm = root.querySelector('.frm'), tx = root.querySelector('.tx'), msg = root.querySelector('.msg'), st = 0;
      function run() {
        st = (st + 1) % 3;
        frm.className = 'frm' + (st === 1 ? ' err' : st === 2 ? ' ok' : '');
        tx.textContent = st === 2 ? 'mia@orbi.app' : 'mia@orbi';
        if (st !== 1 || api.reduce) return;
        msg.animate([{ transform: 'translateY(-10px) rotate(-6deg)', opacity: 0 }, { transform: 'translateY(0) rotate(4deg)', opacity: 1, offset: 0.4 },
          { transform: 'rotate(-2.5deg)', offset: 0.65 }, { transform: 'rotate(1deg)', offset: 0.85 }, { transform: 'rotate(0)', opacity: 1 }], { duration: 600, easing: 'ease-out' });
      }
      root.querySelector('.go').onclick = run;
      var t = setTimeout(run, 600);
      return function () { clearTimeout(t); };
    }
  });

  LUZ.add({
    id: 'inerr-red-echo',
    cat: 'Input & Form',
    name: 'Red Echo',
    source: SRC,
    trigger: 'tap',
    motion: 'Border field berkedip merah bercahaya dua kali; setiap kedipan melepaskan garis gema (outline) yang mengembang keluar (scale 1→1.05×1.35) sambil memudar.',
    timing: 'dua kedip @150ms (total 600ms) · gema 450ms ease-out, jeda 300ms',
    use: 'Galat yang muncul berulang atau field kritis, misalnya kata sandi salah saat login.',
    tags: 'input error flash glow echo outline ripple',
    allowColor: true,
    html: html('<i class="echo"></i><i class="echo"></i>'),
    css: CSS + '& .echo{position:absolute;inset:-1.5px;border-radius:10px;border:1.5px solid #ef4f6a;opacity:0;pointer-events:none}',
    js: function (root, api) {
      var frm = root.querySelector('.frm'), tx = root.querySelector('.tx'), fld = root.querySelector('.fld'), echo = root.querySelectorAll('.echo'), st = 0;
      function run() {
        st = (st + 1) % 3;
        frm.className = 'frm' + (st === 1 ? ' err' : st === 2 ? ' ok' : '');
        tx.textContent = st === 2 ? 'mia@orbi.app' : 'mia@orbi';
        if (st !== 1 || api.reduce) return;
        var off = '0 0 0 0 rgba(239,79,106,0)', on = '0 0 12px 2px rgba(239,79,106,.75)';
        fld.animate([{ boxShadow: off }, { boxShadow: on, offset: 0.25 }, { boxShadow: off, offset: 0.5 }, { boxShadow: on, offset: 0.75 }, { boxShadow: off }], { duration: 600 });
        echo.forEach(function (e, i) {
          e.animate([{ transform: 'scale(1)', opacity: 0.8 }, { transform: 'scale(1.05,1.35)', opacity: 0 }], { duration: 450, delay: i * 300, easing: 'ease-out' });
        });
      }
      root.querySelector('.go').onclick = run;
      var t = setTimeout(run, 600);
      return function () { clearTimeout(t); };
    }
  });

  LUZ.add({
    id: 'inerr-letter-jitter',
    cat: 'Input & Form',
    name: 'Letter Jitter',
    source: SRC,
    trigger: 'tap',
    motion: 'Setiap huruf melompat (translateY −5px) dan bergetar miring (±6°) sambil memerah, bergiliran dari kiri ke kanan seperti gelombang, lalu kembali ke posisi dan warnanya semula.',
    timing: 'tiap huruf 350ms · stagger 30ms · total ±600ms',
    use: 'Galat format teks (email, kode promo) di form yang ingin terasa hidup.',
    tags: 'input error letters jitter wave stagger shake text',
    allowColor: true,
    html: html(),
    css: CSS + '& .tx span{display:inline-block;white-space:pre}',
    js: function (root, api) {
      var frm = root.querySelector('.frm'), tx = root.querySelector('.tx'), st = 0;
      function run() {
        st = (st + 1) % 3;
        frm.className = 'frm' + (st === 1 ? ' err' : st === 2 ? ' ok' : '');
        tx.textContent = st === 2 ? 'mia@orbi.app' : 'mia@orbi';
        if (st !== 1 || api.reduce) return;
        tx.innerHTML = tx.textContent.split('').map(function (c) { return '<span>' + c + '</span>'; }).join('');
        tx.querySelectorAll('span').forEach(function (s, i) {
          var r = i % 2 ? 6 : -6;
          s.animate([{ transform: 'none', color: 'var(--d-fg)' }, { transform: 'translateY(-5px) rotate(' + r + 'deg)', color: '#ef4f6a', offset: 0.35 },
            { transform: 'translateY(1px) rotate(' + -r / 2 + 'deg)', color: '#ef4f6a', offset: 0.6 }, { transform: 'none', color: 'var(--d-fg)' }],
            { duration: 350, delay: i * 30, easing: 'ease-out' });
        });
      }
      root.querySelector('.go').onclick = run;
      var t = setTimeout(run, 600);
      return function () { clearTimeout(t); };
    }
  });

  LUZ.add({
    id: 'inerr-tilt-wobble',
    cat: 'Input & Form',
    name: 'Tilt Wobble',
    source: SRC,
    trigger: 'tap',
    motion: 'Seluruh field bergoyang miring kiri-kanan seperti jeli (rotate +3° → −2.5° → +1.5° → −0.5° → 0) lalu diam, sementara border dan pesan berubah merah.',
    timing: '≈600ms · pegas teredam, ease-out',
    use: 'Alternatif “shake” yang lebih lembut untuk galat login atau PIN salah.',
    tags: 'input error wobble tilt shake jelly rotate',
    allowColor: true,
    html: html(),
    css: CSS,
    js: function (root, api) {
      var frm = root.querySelector('.frm'), tx = root.querySelector('.tx'), fld = root.querySelector('.fld'), st = 0;
      function run() {
        st = (st + 1) % 3;
        frm.className = 'frm' + (st === 1 ? ' err' : st === 2 ? ' ok' : '');
        tx.textContent = st === 2 ? 'mia@orbi.app' : 'mia@orbi';
        if (st !== 1 || api.reduce) return;
        fld.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(3deg)' }, { transform: 'rotate(-2.5deg)' }, { transform: 'rotate(1.5deg)' }, { transform: 'rotate(-.5deg)' }, { transform: 'rotate(0)' }],
          { duration: 600, easing: 'ease-out' });
      }
      root.querySelector('.go').onclick = run;
      var t = setTimeout(run, 600);
      return function () { clearTimeout(t); };
    }
  });
})();
