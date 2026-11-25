/* Stepper · Part 1 — one − / + quantity stepper, six ways to change the number. */
(function () {
  var SRC = 'Stepper · Part 1';
  var HTML = '<div class="stp"><div class="top"><b>Orbit Mug</b><small>Quantity</small></div>' +
    '<div class="pill"><button class="sb minus" type="button" aria-label="Kurangi"><i class="g"></i></button>' +
    '<span class="num" aria-live="polite"><span class="val">2</span></span>' +
    '<button class="sb plus" type="button" aria-label="Tambah"><i class="g"></i></button></div></div>';
  var CSS =
    '& .stp{width:224px;padding:12px;border-radius:16px;background:var(--d-bg);border:1px solid var(--d-soft)}' +
    '& .top{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px}' +
    '& .top b{font-size:12px}& .top small{font-size:9px;color:var(--d-mid)}' +
    '& .pill{position:relative;display:flex;align-items:center;justify-content:space-between;padding:5px;border-radius:99px;background:var(--d-soft)}' +
    '& .sb{position:relative;z-index:2;width:44px;height:44px;padding:0;border:0;border-radius:50%;background:var(--d-accent);display:grid;place-items:center;cursor:pointer;transition:background .2s,opacity .2s}' +
    '& .sb.off{background:var(--d-mid);opacity:.45;cursor:default}' +
    '& .g{position:relative;display:block;width:14px;height:14px}' +
    '& .g::before,& .g::after{content:"";position:absolute;left:0;top:6px;width:14px;height:2px;border-radius:2px;background:var(--d-bg)}' +
    '& .g::after{transform:rotate(90deg)}& .minus .g::after{display:none}' +
    '& .num{position:relative;z-index:1;width:44px;height:34px;font-size:28px;font-weight:600;line-height:34px;text-align:center;color:var(--d-fg)}' +
    '& .num span{position:absolute;inset:0}';

  LUZ.add({
    id: 'stepper-soft-press',
    cat: 'Tombol & Toggle',
    name: 'Soft Press',
    source: SRC,
    trigger: 'tap',
    motion: 'Tombol yang diketuk mengempis lembut (scale 1→0.88→1.04→1). Angka lama hilang, angka baru muncul dari kecil (scale 0.3, opacity 0) ke 1.08 lalu 1.',
    timing: 'tombol 280ms · angka 300ms ease-out, overshoot 1.08',
    use: 'Stepper jumlah barang di keranjang, jumlah dosis, atau jumlah tamu.',
    tags: 'stepper quantity counter press squish pop number',
    html: HTML,
    css: CSS,
    js: function (root, api) {
      var v = 2, minus = root.querySelector('.minus'), plus = root.querySelector('.plus'), val = root.querySelector('.val');
      function step(d, btn) {
        var n = v + d; if (n < 1 || n > 9) return;
        v = n; minus.classList.toggle('off', v === 1); val.textContent = v;
        btn.animate([{ transform: 'scale(1)' }, { transform: 'scale(.88)', offset: 0.35 }, { transform: 'scale(1.04)', offset: 0.7 }, { transform: 'scale(1)' }], { duration: 280, easing: 'ease-out' });
        val.animate(api.reduce ? [{ opacity: 0 }, { opacity: 1 }]
          : [{ transform: 'scale(.3)', opacity: 0 }, { transform: 'scale(1.08)', opacity: 1, offset: 0.7 }, { transform: 'scale(1)', opacity: 1 }],
          { duration: 300, easing: 'ease-out' });
      }
      minus.onclick = function () { step(-1, minus); };
      plus.onclick = function () { step(1, plus); };
      var t = setTimeout(function () { step(1, plus); }, 600);
      return function () { clearTimeout(t); };
    }
  });

  LUZ.add({
    id: 'stepper-side-slide',
    cat: 'Tombol & Toggle',
    name: 'Side Slide',
    source: SRC,
    trigger: 'tap',
    motion: 'Pil bergeser 3px ke arah tombol. Angka baru meluncur masuk dari sisi tombol yang diketuk (+ dari kanan, − dari kiri) sementara angka lama keluar ke sisi berlawanan; keduanya sempat terlihat bersamaan.',
    timing: '≈300ms · ease-out (cubic-bezier .2,.8,.2,1) · geser 22px + crossfade',
    use: 'Stepper yang arah perubahannya perlu terasa jelas (tambah vs kurang).',
    tags: 'stepper slide direction number swap horizontal',
    html: HTML,
    css: CSS + '& .num{overflow:hidden}',
    js: function (root, api) {
      var v = 2, minus = root.querySelector('.minus'), plus = root.querySelector('.plus'), num = root.querySelector('.num'), pill = root.querySelector('.pill');
      function step(d) {
        var n = v + d; if (n < 1 || n > 9) return;
        v = n; minus.classList.toggle('off', v === 1);
        [].slice.call(num.children, 0, -1).forEach(function (x) { x.remove(); }); // drop leftovers if interrupted
        var old = num.lastElementChild, s = document.createElement('span');
        s.textContent = v; num.appendChild(s);
        var o = { duration: api.reduce ? 120 : 300, easing: 'cubic-bezier(.2,.8,.2,1)' }, x = api.reduce ? 0 : d * 22;
        s.animate([{ transform: 'translateX(' + x + 'px)', opacity: 0 }, { transform: 'none', opacity: 1 }], o);
        old.animate([{ transform: 'none', opacity: 1 }, { transform: 'translateX(' + -x + 'px)', opacity: 0 }], o).onfinish = function () { old.remove(); };
        pill.animate([{ transform: 'none' }, { transform: 'translateX(' + d * 3 + 'px)' }, { transform: 'none' }], { duration: 250 });
      }
      minus.onclick = function () { step(-1); };
      plus.onclick = function () { step(1); };
      var t = setTimeout(function () { step(1); }, 600);
      return function () { clearTimeout(t); };
    }
  });

  LUZ.add({
    id: 'stepper-ripple-reveal',
    cat: 'Tombol & Toggle',
    name: 'Ripple Reveal',
    source: SRC,
    trigger: 'tap',
    motion: 'Gelombang berwarna (teal untuk +, violet untuk −) menyebar melingkar dari tombol yang diketuk melintasi seluruh pil (clip-path circle 0→240px). Angka baru terungkap saat tepi gelombang melewatinya, lalu warna gelombang memudar.',
    timing: 'gelombang 350ms ease-out · pudar 300ms',
    use: 'Stepper atau pemilih jumlah yang ingin memberi tanda arah lewat warna.',
    tags: 'stepper ripple reveal clip-path circle wave',
    allowColor: true,
    html: HTML,
    css: CSS + '& .pill{overflow:hidden}' +
      '& .wave{position:absolute;inset:0;z-index:1;display:grid;place-items:center;font-size:28px;font-weight:600;color:var(--d-fg)}' +
      '& .wave.up{background:linear-gradient(rgba(45,212,191,.38),rgba(45,212,191,.38)),var(--d-soft)}& .wave.down{background:linear-gradient(rgba(139,92,246,.38),rgba(139,92,246,.38)),var(--d-soft)}',
    js: function (root, api) {
      var v = 2, minus = root.querySelector('.minus'), plus = root.querySelector('.plus'), val = root.querySelector('.val'), pill = root.querySelector('.pill');
      function step(d, btn) {
        var n = v + d; if (n < 1 || n > 9) return;
        v = n; minus.classList.toggle('off', v === 1);
        var w = document.createElement('div');
        w.className = 'wave ' + (d > 0 ? 'up' : 'down'); w.textContent = v; pill.appendChild(w);
        var x = btn.offsetLeft + btn.offsetWidth / 2;
        w.animate([{ clipPath: 'circle(0px at ' + x + 'px 50%)' }, { clipPath: 'circle(240px at ' + x + 'px 50%)' }],
          { duration: api.reduce ? 1 : 350, easing: 'ease-out', fill: 'forwards' }).onfinish = function () {
          val.textContent = v;
          w.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' }).onfinish = function () { w.remove(); };
        };
      }
      minus.onclick = function () { step(-1, minus); };
      plus.onclick = function () { step(1, plus); };
      var t = setTimeout(function () { step(1, plus); }, 600);
      return function () { clearTimeout(t); };
    }
  });

  LUZ.add({
    id: 'stepper-stretch-pill',
    cat: 'Tombol & Toggle',
    name: 'Stretch Pill',
    source: SRC,
    trigger: 'tap',
    motion: 'Pil meregang ke arah tombol yang diketuk (scaleX 1→1.06→0.98→1, titik tumpu di sisi berlawanan) lalu memantul kembali. Angka baru bergoyang seperti jeli (skewX −12°→8°→−4°→0).',
    timing: '≈450ms · pegas teredam (ease-out)',
    use: 'Stepper di aplikasi yang bernuansa ramah/playful, misalnya jumlah gelas air harian.',
    tags: 'stepper stretch elastic jelly wobble pill',
    html: HTML,
    css: CSS,
    js: function (root, api) {
      var v = 2, minus = root.querySelector('.minus'), plus = root.querySelector('.plus'), val = root.querySelector('.val'), pill = root.querySelector('.pill');
      function step(d) {
        var n = v + d; if (n < 1 || n > 9) return;
        v = n; minus.classList.toggle('off', v === 1); val.textContent = v;
        if (api.reduce) return;
        pill.style.transformOrigin = d > 0 ? 'left center' : 'right center';
        pill.animate([{ transform: 'scaleX(1)' }, { transform: 'scaleX(1.06)', offset: 0.35 }, { transform: 'scaleX(.98)', offset: 0.7 }, { transform: 'scaleX(1)' }], { duration: 450, easing: 'ease-out' });
        val.animate([{ transform: 'skewX(0)' }, { transform: 'skewX(-12deg) scaleY(1.08)' }, { transform: 'skewX(8deg)' }, { transform: 'skewX(-4deg)' }, { transform: 'skewX(0)' }], { duration: 450, easing: 'ease-out' });
      }
      minus.onclick = function () { step(-1); };
      plus.onclick = function () { step(1); };
      var t = setTimeout(function () { step(1); }, 600);
      return function () { clearTimeout(t); };
    }
  });

  LUZ.add({
    id: 'stepper-glyph-spin',
    cat: 'Tombol & Toggle',
    name: 'Glyph Spin',
    source: SRC,
    trigger: 'tap',
    motion: 'Ikon + atau − pada tombol berputar setengah putaran (180°; tanda + tampak seperti × di tengah putaran). Angka membalik di sumbu horizontal: rotateX 0→90° (hilang), nilai berganti, lalu −90°→0.',
    timing: 'ikon 350ms ease-in-out · balik angka 175ms ease-in + 175ms ease-out',
    use: 'Stepper di form pemesanan atau pengaturan jumlah yang ingin terasa mekanis.',
    tags: 'stepper icon rotate spin flip rotateX number',
    html: HTML,
    css: CSS,
    js: function (root, api) {
      var v = 2, minus = root.querySelector('.minus'), plus = root.querySelector('.plus'), val = root.querySelector('.val'), num = root.querySelector('.num');
      function step(d, btn) {
        var n = v + d; if (n < 1 || n > 9) return;
        v = n; minus.classList.toggle('off', v === 1);
        if (api.reduce) { val.textContent = v; return; }
        btn.querySelector('.g').animate([{ transform: 'rotate(0)' }, { transform: 'rotate(180deg)' }], { duration: 350, easing: 'ease-in-out' });
        num.animate([{ transform: 'perspective(200px) rotateX(0)' }, { transform: 'perspective(200px) rotateX(90deg)' }], { duration: 175, easing: 'ease-in' }).onfinish = function () {
          val.textContent = v;
          num.animate([{ transform: 'perspective(200px) rotateX(-90deg)' }, { transform: 'perspective(200px) rotateX(0)' }], { duration: 175, easing: 'ease-out' });
        };
      }
      minus.onclick = function () { step(-1, minus); };
      plus.onclick = function () { step(1, plus); };
      var t = setTimeout(function () { step(1, plus); }, 600);
      return function () { clearTimeout(t); };
    }
  });

  LUZ.add({
    id: 'stepper-halo-burst',
    cat: 'Tombol & Toggle',
    name: 'Halo Burst',
    source: SRC,
    trigger: 'tap',
    motion: 'Cincin bercahaya meledak dari tombol (garis + cincin titik-titik, scale 1→1.7 sambil memudar). Angka baru muncul besar dan buram (scale 1.5, blur 4px, opacity 0.3) lalu mengecil tajam ke ukuran normal.',
    timing: 'cincin 450ms ease-out · angka 300ms ease-out',
    use: 'Stepper untuk aksi yang ingin dirayakan, misalnya menambah tiket atau poin.',
    tags: 'stepper halo ring burst glow zoom blur number',
    html: HTML,
    css: CSS +
      '& .halo{position:absolute;inset:-3px;border-radius:50%;border:2px solid var(--d-accent);outline:2px dotted var(--d-accent);outline-offset:4px;pointer-events:none}',
    js: function (root, api) {
      var v = 2, minus = root.querySelector('.minus'), plus = root.querySelector('.plus'), val = root.querySelector('.val');
      function step(d, btn) {
        var n = v + d; if (n < 1 || n > 9) return;
        v = n; minus.classList.toggle('off', v === 1); val.textContent = v;
        if (api.reduce) return;
        var h = document.createElement('i'); h.className = 'halo'; btn.appendChild(h);
        h.animate([{ transform: 'scale(1)', opacity: 0.9 }, { transform: 'scale(1.7)', opacity: 0 }], { duration: 450, easing: 'ease-out' }).onfinish = function () { h.remove(); };
        val.animate([{ transform: 'scale(1.5)', filter: 'blur(4px)', opacity: 0.3 }, { transform: 'scale(1)', filter: 'blur(0)', opacity: 1 }], { duration: 300, easing: 'ease-out' });
      }
      minus.onclick = function () { step(-1, minus); };
      plus.onclick = function () { step(1, plus); };
      var t = setTimeout(function () { step(1, plus); }, 600);
      return function () { clearTimeout(t); };
    }
  });
})();
