/* Password Strength · Part 1 — one 4-segment meter, six ways to fill it. */
(function () {
  var SRC = 'Password Strength · Part 1';
  var LOCK = '<svg viewBox="0 0 12 12"><rect x="2" y="5.5" width="8" height="5.5" rx="1"/><path d="M4 5.5V4a2 2 0 0 1 4 0v1.5"/></svg>';
  function html(bar, word) {
    return '<div class="pw" role="button" tabindex="0" aria-label="Ketik / hapus kata sandi"><small class="lb">Password</small>' +
      '<div class="fld">' + LOCK + '<span class="dots">•••••••••</span><i class="car"></i></div>' +
      '<div class="mtr">' + (bar || '<i></i><i></i><i></i><i></i>') + '</div>' +
      '<div class="foot">' + (word || '<b class="w">Good</b>') + '<span class="hint">Add a symbol</span></div></div>';
  }
  var CSS =
    '& .pw{position:relative;width:236px;padding:12px;border-radius:14px;background:var(--d-bg);border:1px solid var(--d-soft);cursor:pointer;color:var(--d-fg)}' +
    '& .lb{font-size:9px;color:var(--d-mid)}' +
    '& .fld{display:flex;align-items:center;gap:7px;height:36px;margin-top:4px;padding:0 12px;border-radius:10px;border:1.5px solid var(--d-accent)}' +
    '& .fld svg{width:12px;height:12px;flex:none;fill:none;stroke:currentColor;stroke-width:1.4}' +
    '& .dots{font-size:13px;letter-spacing:1px;white-space:nowrap}' +
    '& .car{width:1.5px;height:15px;background:var(--d-accent);animation:pwCar 1s steps(1) infinite}' +
    '@keyframes pwCar{50%{opacity:0}}' +
    '& .mtr{position:relative;display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-top:11px}' +
    '& .mtr i{position:relative;height:5px;border-radius:3px;background:var(--d-soft);transition:background .3s}' +
    '& .foot{display:flex;justify-content:space-between;align-items:center;margin-top:9px;height:18px}' +
    '& .w{font-size:13px;font-weight:600;color:#2fa8ff;transition:color .3s}' +
    '& .hint{font-size:9px;color:var(--d-mid)}';
  var GOOD = '<i style="background:#2fa8ff"></i><i style="background:#2fa8ff"></i><i style="background:#2fa8ff"></i><i></i>';

  LUZ.add({
    id: 'pwstr-flow-fill',
    cat: 'Input & Form',
    name: 'Flow Fill',
    source: SRC,
    trigger: 'ketik',
    motion: 'Satu isian cair dengan kepala bercahaya meluncur sepanjang bilah, melewati celah antar-segmen, lalu berhenti di segmen terakhir level baru; warnanya berbaur ke warna kekuatan baru (merah → oranye → biru → teal). Saat dikosongkan, isian mundur.',
    timing: '≈400ms per segmen · ease-in-out · warna 400ms',
    use: 'Indikator kekuatan kata sandi di form daftar/ganti sandi.',
    tags: 'password strength meter fill flow liquid glow segments',
    allowColor: true,
    html: html('<span class="trk"><i></i><i></i><i></i><i></i></span><span class="fill"></span><span class="head"></span>'),
    css: CSS +
      '& .mtr{display:block;height:5px}& .trk{position:absolute;inset:0;display:grid;grid-template-columns:repeat(4,1fr);gap:7px}' +
      '& .fill{position:absolute;inset:0;background:#2fa8ff;clip-path:inset(0 25% 0 0);-webkit-mask:linear-gradient(90deg,#000 calc(100% - 7px),transparent 0) 0 0/calc(25% + 1.75px) 100% repeat-x;mask:linear-gradient(90deg,#000 calc(100% - 7px),transparent 0) 0 0/calc(25% + 1.75px) 100% repeat-x;transition:clip-path .4s ease-in-out,background-color .4s}' +
      '& .head{position:absolute;left:-5px;top:-2.5px;width:10px;height:10px;border-radius:50%;background:#fff;box-shadow:0 0 8px 3px rgba(255,255,255,.8);opacity:.9;transition:transform .4s ease-in-out,opacity .3s}',
    js: function (root, api) {
      var L = [[0, '', '', ''], [3, 'Weak', 'Add more characters', '#ef4f6a'], [6, 'Fair', 'Add a number', '#f5a524'], [9, 'Good', 'Add a symbol', '#2fa8ff'], [12, 'Strong', 'Great password', '#22c3a6']];
      var lv = 3, pw = root.querySelector('.pw'), fill = root.querySelector('.fill'), head = root.querySelector('.head'), bar = root.querySelector('.mtr');
      function put(k) {
        var d = Math.max(300, 400 * Math.abs(k - lv)) + 'ms';
        lv = k;
        root.querySelector('.dots').textContent = '•'.repeat(L[k][0]);
        var w = root.querySelector('.w'); w.textContent = L[k][1]; w.style.color = L[k][3];
        root.querySelector('.hint').textContent = L[k][2];
        fill.style.transitionDuration = head.style.transitionDuration = api.reduce ? '0ms' : d;
        fill.style.clipPath = 'inset(0 ' + (100 - k * 25) + '% 0 0)';
        if (k) fill.style.backgroundColor = L[k][3];
        var segW = (bar.offsetWidth - 21) / 4;
        head.style.transform = 'translateX(' + (k ? k * segW + (k - 1) * 7 : 0) + 'px)';
        head.style.opacity = k ? 0.9 : 0;
      }
      put(3);
      pw.onclick = function () { put((lv + 1) % 5); };
      var t = setTimeout(pw.onclick, 600);
      return function () { clearTimeout(t); };
    }
  });

  LUZ.add({
    id: 'pwstr-block-drop',
    cat: 'Input & Form',
    name: 'Block Drop',
    source: SRC,
    trigger: 'ketik',
    motion: 'Setiap segmen baru jatuh dari arah field (translateY −22px→0) lalu mendarat dengan efek gepeng (scale 1.15×0.6 → 1), bergiliran 80ms. Saat kata sandi dihapus, segmen terjatuh miring (±12°) dan memudar.',
    timing: 'jatuh 350ms · gepeng di 60–75% · stagger 80ms · jatuh-hapus 350ms ease-in',
    use: 'Meter kekuatan sandi atau progres bertingkat yang ingin terasa fisik/playful.',
    tags: 'password strength block drop squash bounce segments',
    allowColor: true,
    html: html(GOOD),
    css: CSS,
    js: function (root, api) {
      var L = [[0, '', '', ''], [3, 'Weak', 'Add more characters', '#ef4f6a'], [6, 'Fair', 'Add a number', '#f5a524'], [9, 'Good', 'Add a symbol', '#2fa8ff'], [12, 'Strong', 'Great password', '#22c3a6']];
      var lv = 3, pw = root.querySelector('.pw'), segs = root.querySelectorAll('.mtr i');
      function put(k) {
        var old = lv; lv = k;
        root.querySelector('.dots').textContent = '•'.repeat(L[k][0]);
        var w = root.querySelector('.w'); w.textContent = L[k][1]; w.style.color = L[k][3];
        root.querySelector('.hint').textContent = L[k][2];
        segs.forEach(function (s, i) {
          if (i < k) {
            s.style.background = L[k][3];
            if (i >= old && !api.reduce) s.animate([{ transform: 'translateY(-22px)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1, offset: 0.6 },
              { transform: 'scale(1.15,.6)', offset: 0.75 }, { transform: 'none' }], { duration: 350, delay: (i - old) * 80, easing: 'ease-out', fill: 'backwards' });
          } else if (k === 0 && i < old && !api.reduce) {
            s.animate([{ transform: 'none', opacity: 1 }, { transform: 'translateY(14px) rotate(' + (i % 2 ? 12 : -12) + 'deg)', opacity: 0 }], { duration: 350, easing: 'ease-in' })
              .onfinish = function () { if (lv === 0) s.style.background = ''; };
          } else s.style.background = '';
        });
      }
      pw.onclick = function () { put((lv + 1) % 5); };
      var t = setTimeout(pw.onclick, 600);
      return function () { clearTimeout(t); };
    }
  });

  LUZ.add({
    id: 'pwstr-spark-feed',
    cat: 'Input & Form',
    name: 'Spark Feed',
    source: SRC,
    trigger: 'ketik',
    motion: 'Setiap kali huruf diketik, percikan putih kecil melompat dari kursor di field, melengkung turun ke segmen berikutnya (±300ms), dan segmen itu baru terisi (scaleX 0→1) saat percikan tiba. Segmen yang sudah terisi berganti warna mengikuti level.',
    timing: 'percikan 300ms ease-in-out (lintasan busur) · jeda 120ms antarpercikan · isi segmen 150ms',
    use: 'Meter sandi yang ingin menunjukkan hubungan sebab-akibat antara ketikan dan kekuatan.',
    tags: 'password strength spark particle arc feed segments',
    allowColor: true,
    html: html(GOOD + '<b class="spk"></b>'),
    css: CSS +
      '& .spk{position:absolute;left:0;top:0;width:6px;height:6px;margin:-3px;border-radius:50%;background:#fff;box-shadow:0 0 6px 2px var(--d-accent);opacity:0;pointer-events:none}',
    js: function (root, api) {
      var L = [[0, '', '', ''], [3, 'Weak', 'Add more characters', '#ef4f6a'], [6, 'Fair', 'Add a number', '#f5a524'], [9, 'Good', 'Add a symbol', '#2fa8ff'], [12, 'Strong', 'Great password', '#22c3a6']];
      var lv = 3, pw = root.querySelector('.pw'), segs = root.querySelectorAll('.mtr i'), car = root.querySelector('.car');
      function pos(el) { var a = el.getBoundingClientRect(), b = pw.getBoundingClientRect(); return [a.left - b.left + a.width / 2, a.top - b.top + a.height / 2]; }
      function put(k) {
        var old = lv; lv = k;
        root.querySelector('.dots').textContent = '•'.repeat(L[k][0]);
        var w = root.querySelector('.w'); w.textContent = L[k][1]; w.style.color = L[k][3];
        root.querySelector('.hint').textContent = L[k][2];
        segs.forEach(function (s, i) {
          if (i >= k) { s.style.background = ''; return; }
          if (i < old || api.reduce) { s.style.background = L[k][3]; return; }
          var sp = root.querySelector('.spk').cloneNode(); pw.appendChild(sp);
          var c = pos(car), e = pos(s), m = [(c[0] + e[0]) / 2, Math.min(c[1], e[1]) - 12];
          var tr = function (p) { return 'translate(' + p[0] + 'px,' + p[1] + 'px)'; };
          sp.animate([{ transform: tr(c), opacity: 1 }, { transform: tr(m), opacity: 1 }, { transform: tr(e), opacity: 1 }],
            { duration: 300, delay: (i - old) * 120, easing: 'ease-in-out' }).onfinish = function () {
            sp.remove();
            if (lv < i + 1) return;
            s.style.background = L[lv][3];
            s.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 150, easing: 'ease-out' });
          };
        });
      }
      pw.onclick = function () { put((lv + 1) % 5); };
      var t = setTimeout(pw.onclick, 600);
      return function () { clearTimeout(t); };
    }
  });

  LUZ.add({
    id: 'pwstr-chain-light',
    cat: 'Input & Form',
    name: 'Chain Light',
    source: SRC,
    trigger: 'ketik',
    motion: 'Setiap kali level berubah, semua segmen terisi menyala ulang satu per satu dari kiri ke kanan seperti rantai lampu: tiap segmen berkilat putih terang (brightness 2.2 + glow) lalu turun ke warna kekuatannya.',
    timing: 'tiap segmen 260ms ease-out · stagger 70ms',
    use: 'Meter kekuatan sandi, atau indikator langkah yang ingin menegaskan perubahan level.',
    tags: 'password strength chain light flash sequential segments',
    allowColor: true,
    html: html(GOOD),
    css: CSS,
    js: function (root, api) {
      var L = [[0, '', '', ''], [3, 'Weak', 'Add more characters', '#ef4f6a'], [6, 'Fair', 'Add a number', '#f5a524'], [9, 'Good', 'Add a symbol', '#2fa8ff'], [12, 'Strong', 'Great password', '#22c3a6']];
      var lv = 3, pw = root.querySelector('.pw'), segs = root.querySelectorAll('.mtr i');
      function put(k) {
        lv = k;
        root.querySelector('.dots').textContent = '•'.repeat(L[k][0]);
        var w = root.querySelector('.w'); w.textContent = L[k][1]; w.style.color = L[k][3];
        root.querySelector('.hint').textContent = L[k][2];
        segs.forEach(function (s, i) {
          s.style.background = i < k ? L[k][3] : '';
          if (i < k && !api.reduce) s.animate([{ filter: 'brightness(2.2)', boxShadow: '0 0 8px 2px ' + L[k][3] }, { filter: 'brightness(1)', boxShadow: '0 0 0 0 transparent' }],
            { duration: 260, delay: i * 70, easing: 'ease-out', fill: 'backwards' });
        });
      }
      pw.onclick = function () { put((lv + 1) % 5); };
      var t = setTimeout(pw.onclick, 600);
      return function () { clearTimeout(t); };
    }
  });

  LUZ.add({
    id: 'pwstr-flap-label',
    cat: 'Input & Form',
    name: 'Flap Label',
    source: SRC,
    trigger: 'ketik',
    motion: 'Kata kekuatan (Weak/Fair/Good/Strong) ada di ubin kecil bergaris tengah dan berganti dengan membalik seperti papan split-flap (rotateX 0→90°, teks berganti, −90°→0). Segmen baru “terbuka” dari tepi atas (scaleY 0→1) bergiliran.',
    timing: 'flap 150ms ease-in + 150ms ease-out · segmen 220ms stagger 60ms',
    use: 'Label status yang berganti, misalnya kekuatan sandi atau status antrean.',
    tags: 'password strength split flap label flip rotateX board',
    allowColor: true,
    html: html(GOOD, '<b class="w tile">Good</b>'),
    css: CSS +
      '& .tile{position:relative;padding:1px 7px;border-radius:4px;background:var(--d-soft)}' +
      '& .tile::after{content:"";position:absolute;left:0;right:0;top:50%;height:1px;background:var(--d-bg);opacity:.7}' +
      '& .mtr i{transform-origin:top}',
    js: function (root, api) {
      var L = [[0, '', '', ''], [3, 'Weak', 'Add more characters', '#ef4f6a'], [6, 'Fair', 'Add a number', '#f5a524'], [9, 'Good', 'Add a symbol', '#2fa8ff'], [12, 'Strong', 'Great password', '#22c3a6']];
      var lv = 3, pw = root.querySelector('.pw'), segs = root.querySelectorAll('.mtr i'), w = root.querySelector('.w');
      function put(k) {
        var old = lv; lv = k;
        root.querySelector('.dots').textContent = '•'.repeat(L[k][0]);
        root.querySelector('.hint').textContent = L[k][2];
        w.style.color = L[k][3];
        w.animate([{ transform: 'perspective(120px) rotateX(0)' }, { transform: 'perspective(120px) rotateX(90deg)' }], { duration: api.reduce ? 1 : 150, easing: 'ease-in' }).onfinish = function () {
          w.textContent = L[lv][1] || '—';
          w.animate([{ transform: 'perspective(120px) rotateX(-90deg)' }, { transform: 'perspective(120px) rotateX(0)' }], { duration: api.reduce ? 1 : 150, easing: 'ease-out' });
        };
        segs.forEach(function (s, i) {
          s.style.background = i < k ? L[k][3] : '';
          if (i < k && i >= old && !api.reduce) s.animate([{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], { duration: 220, delay: (i - old) * 60, easing: 'ease-out', fill: 'backwards' });
        });
      }
      pw.onclick = function () { put((lv + 1) % 5); };
      var t = setTimeout(pw.onclick, 600);
      return function () { clearTimeout(t); };
    }
  });

  LUZ.add({
    id: 'pwstr-liquid-link',
    cat: 'Input & Form',
    name: 'Liquid Link',
    source: SRC,
    trigger: 'ketik',
    motion: 'Isian merambat seperti cairan: “leher” tipis keluar dari segmen terisi menyeberangi celah (scaleX 0→1), segmen berikutnya terisi dari kiri dengan sedikit menggembung (scaleY 1.3→1), lalu lehernya putus (menipis ke 0). Saat dihapus, segmen menyusut menjadi titik dan hilang.',
    timing: 'per segmen 300ms (leher 150ms, isi 200ms, putus 120ms) · hapus 300ms ease-in',
    use: 'Progres bertahap yang ingin terasa organik, misalnya kekuatan sandi atau langkah onboarding.',
    tags: 'password strength liquid neck goo connect snap segments',
    allowColor: true,
    html: html('<i style="color:#2fa8ff"><b></b></i><i style="color:#2fa8ff"><b></b></i><i style="color:#2fa8ff"><b></b></i><i></i>'),
    css: CSS +
      '& .mtr i{color:var(--d-soft);background:currentColor;transition:color .3s}' +
      '& .mtr b{position:absolute;left:100%;top:1px;width:7px;height:3px;background:currentColor;transform:scaleX(0);transform-origin:left}',
    js: function (root, api) {
      var L = [[0, '', '', ''], [3, 'Weak', 'Add more characters', '#ef4f6a'], [6, 'Fair', 'Add a number', '#f5a524'], [9, 'Good', 'Add a symbol', '#2fa8ff'], [12, 'Strong', 'Great password', '#22c3a6']];
      var lv = 3, pw = root.querySelector('.pw'), segs = root.querySelectorAll('.mtr i');
      function put(k) {
        var old = lv; lv = k;
        root.querySelector('.dots').textContent = '•'.repeat(L[k][0]);
        var w = root.querySelector('.w'); w.textContent = L[k][1]; w.style.color = L[k][3];
        root.querySelector('.hint').textContent = L[k][2];
        segs.forEach(function (s, i) {
          if (k === 0 && i < old && !api.reduce) {
            s.animate([{ transform: 'none', opacity: 1 }, { transform: 'scaleX(.12)', opacity: 0 }], { duration: 300, easing: 'ease-in' })
              .onfinish = function () { if (lv === 0) s.style.color = ''; };
            return;
          }
          s.style.color = i < k ? L[k][3] : '';
          if (i < k && i >= old && !api.reduce) {
            var d = (i - old) * 300;
            if (i > 0) segs[i - 1].firstChild.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)', offset: 0.5 }, { transform: 'scaleX(1) scaleY(1)', offset: 0.75 }, { transform: 'scaleX(1) scaleY(0)' }],
              { duration: 300, delay: d, easing: 'ease-in-out' });
            s.animate([{ clipPath: 'inset(0 100% 0 0)', transform: 'scaleY(1)' }, { clipPath: 'inset(0 0 0 0)', transform: 'scaleY(1.3)', offset: 0.7 }, { clipPath: 'inset(0 0 0 0)', transform: 'scaleY(1)' }],
              { duration: 200, delay: d + 100, easing: 'ease-out', fill: 'backwards' });
          }
        });
      }
      pw.onclick = function () { put((lv + 1) % 5); };
      var t = setTimeout(pw.onclick, 600);
      return function () { clearTimeout(t); };
    }
  });
})();
