/* Copy to Clipboard · Part 1 — one invite link, six ways to confirm "copied". */
(function () {
  var SRC = 'Copy to Clipboard · Part 1';
  var ICON = '<svg viewBox="0 0 12 12"><rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><path d="M8 4V2.8A1.3 1.3 0 0 0 6.7 1.5H2.8A1.3 1.3 0 0 0 1.5 2.8v3.9A1.3 1.3 0 0 0 2.8 8H4"/></svg>';
  function html(inField, inCard) {
    return '<div class="cp"><div class="top"><b>Invite link</b><small>Expires in 7 days</small></div>' +
      '<div class="fld"><span class="lk">orbi.team/join/K7Q2</span><button class="btn" type="button"><span class="lbl">' + ICON + 'Copy</span></button>' + (inField || '') + '</div>' +
      '<p class="hint">Anyone with this link can join your team</p>' + (inCard || '') + '</div>';
  }
  var CSS =
    '& .cp{position:relative;width:240px;padding:12px;border-radius:14px;background:var(--d-bg);border:1px solid var(--d-soft);color:var(--d-fg)}' +
    '& .top{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px}& .top b{font-size:10.5px}& .top small{font-size:8.5px;color:var(--d-mid)}' +
    '& .fld{position:relative;display:flex;align-items:center;justify-content:space-between;height:42px;padding:0 5px 0 12px;border-radius:11px;border:1px solid var(--d-soft);transition:border-color .25s}' +
    '& .lk{position:relative;font-size:12px;white-space:nowrap}' +
    '& .btn{position:relative;z-index:1;height:32px;min-width:74px;padding:0 11px;border:0;border-radius:9px;background:var(--d-accent);color:var(--d-bg);font:inherit;font-size:11px;font-weight:600;cursor:pointer;transition:background .25s,color .25s}' +
    '& .lbl{display:flex;align-items:center;justify-content:center;gap:5px}' +
    '& .lbl svg{width:11px;height:11px;fill:none;stroke:currentColor;stroke-width:1.3}' +
    '& .btn.done{background:#1fbf8f;color:#fff}' +
    '& .hint{margin:8px 0 0;font-size:8.5px;color:var(--d-mid)}';

  LUZ.add({
    id: 'copy-select-sweep',
    cat: 'Feedback & Notifikasi',
    name: 'Select Sweep',
    source: SRC,
    trigger: 'tap',
    motion: 'Sorotan seleksi teks biru lengkap dengan dua pegangan menyapu teks tautan dari kiri ke kanan (clip-path), seolah teks dipilih; setelah itu tombol berubah hijau “✓ Copied”. Setelah ±1.4 detik seleksi hilang dan tombol kembali ke “Copy”.',
    timing: 'sapuan 300ms ease-out · tahan 1400ms · kembali 200ms',
    use: 'Tombol salin tautan undangan, nomor rekam medis, atau kode referensi.',
    tags: 'copy clipboard select highlight sweep copied button',
    allowColor: true,
    html: html(),
    css: CSS +
      '& .sel{position:absolute;inset:-3px -3px;border-radius:3px;background:var(--d-accent);opacity:.25;clip-path:inset(0 100% 0 0)}' +
      '& .hd{position:absolute;top:-4px;bottom:-4px;width:2px;background:var(--d-accent);opacity:0}& .hd::after{content:"";position:absolute;left:-2px;width:6px;height:6px;border-radius:50%;background:var(--d-accent)}' +
      '& .hd.l{left:-4px}& .hd.l::after{top:-4px}& .hd.r{right:-4px}& .hd.r::after{bottom:-4px}',
    js: function (root, api) {
      var btn = root.querySelector('.btn'), lbl = root.querySelector('.lbl'), lk = root.querySelector('.lk'), ic = lbl.innerHTML, tm = [];
      lk.insertAdjacentHTML('afterbegin', '<i class="sel"></i><i class="hd l"></i><i class="hd r"></i>');
      var sel = lk.querySelector('.sel'), hds = lk.querySelectorAll('.hd');
      function label(on) { lbl.innerHTML = on ? '✓ Copied' : ic; btn.classList.toggle('done', on); }
      function copy() {
        tm.forEach(clearTimeout); tm = [];
        sel.animate([{ clipPath: 'inset(0 100% 0 0)', opacity: 0.25 }, { clipPath: 'inset(0 0 0 0)', opacity: 0.25 }], { duration: api.reduce ? 1 : 300, easing: 'ease-out', fill: 'forwards' });
        hds.forEach(function (h, i) { h.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 120, delay: i * 200, fill: 'forwards' }); });
        tm.push(setTimeout(function () { label(true); }, 300));
        tm.push(setTimeout(function () {
          label(false);
          [sel].concat([].slice.call(hds)).forEach(function (x) { x.animate([{ opacity: getComputedStyle(x).opacity }, { opacity: 0 }], { duration: 200, fill: 'forwards' }); });
        }, 1700));
      }
      btn.onclick = copy;
      tm.push(setTimeout(copy, 600));
      return function () { tm.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'copy-ghost-fly',
    cat: 'Feedback & Notifikasi',
    name: 'Ghost Fly',
    source: SRC,
    trigger: 'tap',
    motion: 'Salinan transparan teks tautan (chip “hantu”) terangkat dari field dan terbang melengkung ke tombol (naik 22px di tengah lintasan, mengecil ke 0.3 sambil memudar). Saat tiba, tombol meletup (scale 1→1.12→1) dengan 4 percikan dan berubah hijau “✓ Copied”.',
    timing: 'terbang 350ms ease-in-out · letup 300ms pegas · tahan 1400ms',
    use: 'Salin kode/ID ke clipboard dengan jejak visual “isi ini masuk ke clipboard”.',
    tags: 'copy clipboard ghost fly arc chip pop sparkle',
    allowColor: true,
    html: html('<span class="spk"><i></i><i></i><i></i><i></i></span>'),
    css: CSS +
      '& .gh{position:absolute;left:12px;top:50%;margin-top:-10px;padding:2px 6px;border-radius:6px;background:var(--d-soft);font-size:12px;white-space:nowrap;pointer-events:none;z-index:2}' +
      '& .spk{position:absolute;right:42px;top:50%;width:0;height:0;z-index:2}' +
      '& .spk i{position:absolute;left:-1px;top:0;width:2px;height:5px;border-radius:1px;background:#1fbf8f;opacity:0}',
    js: function (root, api) {
      var btn = root.querySelector('.btn'), lbl = root.querySelector('.lbl'), lk = root.querySelector('.lk'), fld = root.querySelector('.fld'), ic = lbl.innerHTML, tm = [];
      function label(on) { lbl.innerHTML = on ? '✓ Copied' : ic; btn.classList.toggle('done', on); }
      function land() {
        label(true);
        btn.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.12)', offset: 0.4 }, { transform: 'scale(1)' }], { duration: 300, easing: 'cubic-bezier(.34,1.56,.64,1)' });
        root.querySelectorAll('.spk i').forEach(function (s, i) {
          var a = 'rotate(' + (i * 90 + 45) + 'deg)';
          s.animate([{ transform: a + ' translateY(-22px)', opacity: 1 }, { transform: a + ' translateY(-32px)', opacity: 0 }], { duration: 300, easing: 'ease-out' });
        });
      }
      function copy() {
        tm.forEach(clearTimeout); tm = [];
        if (api.reduce) land();
        else {
          var g = document.createElement('span'); g.className = 'gh'; g.textContent = lk.textContent; fld.appendChild(g);
          var dx = btn.offsetLeft + btn.offsetWidth / 2 - (12 + g.offsetWidth / 2);
          g.animate([{ transform: 'translate(0,0) scale(1)', opacity: 0.85 }, { transform: 'translate(' + dx / 2 + 'px,-22px) scale(.75)', opacity: 0.7 }, { transform: 'translate(' + dx + 'px,0) scale(.3)', opacity: 0 }],
            { duration: 350, easing: 'ease-in-out' }).onfinish = function () { g.remove(); land(); };
        }
        tm.push(setTimeout(function () { label(false); }, 1750));
      }
      btn.onclick = copy;
      tm.push(setTimeout(copy, 600));
      return function () { tm.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'copy-flip-board',
    cat: 'Feedback & Notifikasi',
    name: 'Flip Board',
    source: SRC,
    trigger: 'tap',
    motion: 'Label tombol membalik seperti papan split-flap: “Copy” berputar rotateX 0→90°, berganti, lalu “Copied” masuk −90°→0 sementara warna tombol berubah hijau. Setelah ±1.4 detik label membalik lagi ke “Copy”.',
    timing: 'flip 125ms ease-in + 125ms ease-out · tahan 1400ms',
    use: 'Tombol salin di tabel/daftar yang sempit, karena ukuran tombol tidak berubah.',
    tags: 'copy clipboard flip board split flap label rotateX',
    allowColor: true,
    html: html(),
    css: CSS + '& .btn::after{content:"";position:absolute;left:0;right:0;top:50%;height:1px;background:rgba(0,0,0,.18)}',
    js: function (root, api) {
      var btn = root.querySelector('.btn'), lbl = root.querySelector('.lbl'), ic = lbl.innerHTML, tm = [];
      function flip(on) {
        var d = api.reduce ? 1 : 125;
        lbl.animate([{ transform: 'perspective(120px) rotateX(0)' }, { transform: 'perspective(120px) rotateX(90deg)' }], { duration: d, easing: 'ease-in' }).onfinish = function () {
          lbl.innerHTML = on ? '✓ Copied' : ic; btn.classList.toggle('done', on);
          lbl.animate([{ transform: 'perspective(120px) rotateX(-90deg)' }, { transform: 'perspective(120px) rotateX(0)' }], { duration: d, easing: 'ease-out' });
        };
      }
      function copy() {
        tm.forEach(clearTimeout); tm = [];
        flip(true);
        tm.push(setTimeout(function () { flip(false); }, 1650));
      }
      btn.onclick = copy;
      tm.push(setTimeout(copy, 600));
      return function () { tm.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'copy-pill-stretch',
    cat: 'Feedback & Notifikasi',
    name: 'Pill Stretch',
    source: SRC,
    trigger: 'tap',
    motion: 'Tombol meregang ke kiri menutupi seluruh field menjadi bilah hijau lebar bertuliskan “✓ Link copied” (clip-path dari posisi tombol ke lebar penuh), dan centangnya tergambar. Setelah ±1.4 detik bilah menyusut kembali menjadi tombol “Copy”.',
    timing: 'regang 350ms ease-out (cubic-bezier .2,.8,.2,1) · centang 200ms · tahan 1400ms · susut 250ms ease-in',
    use: 'Konfirmasi salin yang paling jelas di layar ponsel, misalnya tautan pembayaran.',
    tags: 'copy clipboard pill stretch expand full width confirmation',
    allowColor: true,
    html: html('<span class="wide"><svg viewBox="0 0 12 12"><path pathLength="1" d="M2.5 6.5 5 9l4.5-5.5"/></svg>Link copied</span>'),
    css: CSS +
      '& .wide{position:absolute;inset:4px;z-index:2;display:flex;align-items:center;justify-content:center;gap:6px;border-radius:9px;background:#1fbf8f;color:#fff;font-size:12px;font-weight:600;clip-path:inset(0 0 0 100% round 9px)}' +
      '& .wide svg{width:12px;height:12px;fill:none;stroke:#fff;stroke-width:1.8;stroke-linecap:round;stroke-dasharray:1;stroke-dashoffset:1}',
    js: function (root, api) {
      var btn = root.querySelector('.btn'), wide = root.querySelector('.wide'), chk = wide.querySelector('path'), tm = [];
      function copy() {
        tm.forEach(clearTimeout); tm = [];
        var x = btn.offsetLeft - 4 + 'px';
        wide.animate([{ clipPath: 'inset(0 0 0 ' + x + ' round 9px)' }, { clipPath: 'inset(0 0 0 0 round 9px)' }], { duration: api.reduce ? 1 : 350, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' });
        chk.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 200, delay: 150, fill: 'both' });
        tm.push(setTimeout(function () {
          wide.animate([{ clipPath: 'inset(0 0 0 0 round 9px)' }, { clipPath: 'inset(0 0 0 ' + x + ' round 9px)', opacity: 1, offset: 0.9 }, { clipPath: 'inset(0 0 0 ' + x + ' round 9px)', opacity: 0 }],
            { duration: api.reduce ? 1 : 250, easing: 'ease-in', fill: 'forwards' });
        }, 1750));
      }
      btn.onclick = copy;
      tm.push(setTimeout(copy, 600));
      return function () { tm.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'copy-char-wave',
    cat: 'Feedback & Notifikasi',
    name: 'Char Wave',
    source: SRC,
    trigger: 'tap',
    motion: 'Huruf-huruf tautan melompat (translateY −4px) dan berubah mint dalam gelombang yang berjalan dari tombol ke kiri (jeda 25ms per huruf), sementara tombol menjadi hijau “✓ Copied”. Setelah ±1.4 detik teks kembali ke warna semula.',
    timing: 'lompat 300ms per huruf · stagger 25ms (kanan→kiri) · tahan 1400ms',
    use: 'Salin teks pendek yang ingin ditegaskan isinya, misalnya kode voucher atau PIN sementara.',
    tags: 'copy clipboard text wave letters stagger hop color',
    allowColor: true,
    html: html(),
    css: CSS + '& .lk span{display:inline-block;white-space:pre;transition:color .2s}& .lk.mint span{color:#1fbf8f}',
    js: function (root, api) {
      var btn = root.querySelector('.btn'), lbl = root.querySelector('.lbl'), lk = root.querySelector('.lk'), ic = lbl.innerHTML, tm = [];
      lk.innerHTML = lk.textContent.split('').map(function (c) { return '<span>' + c + '</span>'; }).join('');
      var ch = lk.querySelectorAll('span'), n = ch.length;
      function label(on) { lbl.innerHTML = on ? '✓ Copied' : ic; btn.classList.toggle('done', on); lk.classList.toggle('mint', on); }
      function copy() {
        tm.forEach(clearTimeout); tm = [];
        ch.forEach(function (c, i) {
          var d = api.reduce ? 0 : (n - 1 - i) * 25;
          c.style.transitionDelay = d + 'ms';
          if (!api.reduce) c.animate([{ transform: 'none' }, { transform: 'translateY(-4px)', offset: 0.4 }, { transform: 'none' }], { duration: 300, delay: d, easing: 'ease-out' });
        });
        label(true);
        tm.push(setTimeout(function () { ch.forEach(function (c) { c.style.transitionDelay = '0ms'; }); label(false); }, 1900));
      }
      btn.onclick = copy;
      tm.push(setTimeout(copy, 600));
      return function () { tm.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'copy-outline-echo',
    cat: 'Feedback & Notifikasi',
    name: 'Outline Echo',
    source: SRC,
    trigger: 'tap',
    motion: 'Border field berkedip mint dan dua garis luar beriak keluar dari field (scale 1→1.04×1.25 sambil memudar, jeda 150ms), sementara tombol berubah hijau “✓ Copied”. Setelah ±1.4 detik semua kembali normal.',
    timing: 'riak 450ms ease-out · jeda 150ms · tahan 1400ms',
    use: 'Konfirmasi salin yang menyorot sumber teksnya, misalnya alamat dompet atau nomor rekening.',
    tags: 'copy clipboard outline echo ripple border flash',
    allowColor: true,
    html: html('<i class="echo"></i><i class="echo"></i>'),
    css: CSS +
      '& .echo{position:absolute;inset:-1px;border-radius:11px;border:1.5px solid #1fbf8f;opacity:0;pointer-events:none}' +
      '& .cp.ok .fld{border-color:#1fbf8f}',
    js: function (root, api) {
      var cp = root.querySelector('.cp'), btn = root.querySelector('.btn'), lbl = root.querySelector('.lbl'), ic = lbl.innerHTML, tm = [];
      function label(on) { lbl.innerHTML = on ? '✓ Copied' : ic; btn.classList.toggle('done', on); cp.classList.toggle('ok', on); }
      function copy() {
        tm.forEach(clearTimeout); tm = [];
        label(true);
        if (!api.reduce) root.querySelectorAll('.echo').forEach(function (e, i) {
          e.animate([{ transform: 'scale(1)', opacity: 0.9 }, { transform: 'scale(1.04,1.25)', opacity: 0 }], { duration: 450, delay: i * 150, easing: 'ease-out' });
        });
        tm.push(setTimeout(function () { label(false); }, 1400));
      }
      btn.onclick = copy;
      tm.push(setTimeout(copy, 600));
      return function () { tm.forEach(clearTimeout); };
    }
  });
})();
