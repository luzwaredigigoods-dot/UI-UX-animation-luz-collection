/* Text Effects · Part 1 — six ways to swap one big word for the next (GO → DONE → READY → SET).
   Tap "Next" (or anywhere on the card). Autoplay once after 600ms. Each new word arrives tinted
   and fades to the text colour. */
(function () {
  var SRC = 'Text Effects · Part 1';
  var HTML = '<div class="te" role="group" aria-label="Kata berganti"><div class="wd" aria-live="polite"></div>' +
    '<div class="ctl"><div class="sg" aria-hidden="true"><i></i><i class="on"></i><i></i><i></i></div>' +
    '<button type="button" class="nx">Next ›</button></div></div>';
  var BASE =
    '& .te{position:relative;width:236px;height:150px;background:var(--d-bg);border-radius:16px;cursor:pointer;overflow:hidden}' +
    '& .wd{position:absolute;left:0;right:0;top:18px;height:70px}' +
    '& .w{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:800 44px/1 sans-serif;letter-spacing:-.01em;white-space:nowrap}' +
    '& .w span{display:inline-block}' +
    '& .ctl{position:absolute;left:16px;right:14px;bottom:16px;display:flex;align-items:center;justify-content:space-between}' +
    '& .sg{display:flex;gap:5px}& .sg i{width:16px;height:3px;border-radius:2px;background:var(--d-soft);transition:width .25s,background .25s}& .sg i.on{width:28px;background:var(--d-accent)}' +
    '& .nx{min-height:34px;padding:0 14px;border:0;border-radius:99px;background:linear-gradient(90deg,#6d5cf6,#3b9bff);color:#fff;font:700 12px/1 sans-serif;cursor:pointer}';
  var TAGS = 'text effect word swap headline kinetic typography ';

  LUZ.add({
    id: 'text-word-burst',
    cat: 'Teks & Angka',
    name: 'Word Burst',
    source: SRC,
    trigger: 'tap',
    allowColor: true,
    motion: 'Huruf kata lama merenggang, memudar abu-abu dan blur. Huruf kata baru berangkat bertumpuk di titik tengah (scale 0.3, sedikit berputar acak) lalu memantul keluar ke posisinya, diiringi 12 garis sinar warna-warni yang memancar dari tengah dan memudar.',
    timing: 'keluar 150ms · huruf masuk 250ms spring overshoot · sinar 300ms ease-out · warna → teks 300ms',
    use: 'Momen perayaan singkat, misalnya "SELESAI" setelah pasien menyelesaikan semua langkah.',
    tags: TAGS + 'burst explode letters rays spring center',
    html: HTML,
    css: BASE + '& .ray{position:absolute;left:50%;top:50%;width:14px;height:2px;margin:-1px 0 0 -7px;border-radius:2px}',
    js: function (root, api) {
      var te = root.querySelector('.te'), box = root.querySelector('.wd'), segs = root.querySelectorAll('.sg i'), W = ['GO', 'DONE', 'READY', 'SET'], i = 1, cur, T = [];
      var fg = getComputedStyle(root).color, RC = ['#ff6fa8', '#ffd25e', '#4fd6ff', '#9b7bff'];
      function mk(t) { var w = document.createElement('div'); w.className = 'w'; w.innerHTML = t.split('').map(function (c) { return '<span>' + c + '</span>'; }).join(''); box.appendChild(w); return w; }
      function next() {
        i = (i + 1) % 4; segs.forEach(function (s, j) { s.classList.toggle('on', j === i); });
        var old = cur; cur = mk(W[i]);
        if (api.reduce) { old.remove(); return; }
        var ol = [].slice.call(old.children), mid = (ol.length - 1) / 2;
        ol.forEach(function (s, n) { s.animate([{ transform: 'none', opacity: 1, filter: 'blur(0)' }, { transform: 'translateX(' + (n - mid) * 5 + 'px)', opacity: 0, filter: 'blur(4px)' }], { duration: 150, fill: 'forwards' }); });
        T.push(setTimeout(function () { old.remove(); }, 160));
        var cx = cur.offsetWidth / 2;
        [].forEach.call(cur.children, function (s) {
          var dx = cx - (s.offsetLeft + s.offsetWidth / 2), rot = (Math.random() * 40 - 20).toFixed(0);
          s.animate([{ transform: 'translateX(' + dx + 'px) scale(.3) rotate(' + rot + 'deg)', opacity: 0 }, { transform: 'scale(1.08)', opacity: 1, offset: .7 }, { transform: 'none' }], { duration: 250, easing: 'cubic-bezier(.2,.8,.2,1)' });
        });
        cur.animate([{ color: '#8f86ff' }, { color: '#8f86ff', offset: .4 }, { color: fg }], { duration: 600 });
        for (var r = 0; r < 12; r++) {
          var ray = document.createElement('i'), a = r * 30 + 15; ray.className = 'ray'; ray.style.background = RC[r % 4]; box.appendChild(ray);
          ray.animate([{ transform: 'rotate(' + a + 'deg) translateX(10px) scaleX(.4)', opacity: 1 }, { transform: 'rotate(' + a + 'deg) translateX(' + (60 + r % 3 * 12) + 'px) scaleX(1)', opacity: 0 }], { duration: 300, easing: 'ease-out' }).onfinish = function () { this.effect.target.remove(); };
        }
      }
      cur = mk(W[i]);
      te.addEventListener('click', next);
      T.push(setTimeout(next, 600));
      return function () { T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'text-stamp',
    cat: 'Teks & Angka',
    name: 'Text Stamp',
    source: SRC,
    trigger: 'tap',
    allowColor: true,
    motion: 'Kata baru (merah muda) jatuh dari scale 1.6 dan blur seperti stempel, menghantam ke 1.0, sedikit tenggelam ke 0.93 lalu kembali 1. Saat menghantam muncul 3 garis kecepatan di tiap sisi dan seluruh kartu bergetar mendatar ±4px.',
    timing: 'hantam 100ms ease-in · pantul 150ms · getar kartu 250ms · warna → teks 300ms',
    use: 'Konfirmasi tegas, misalnya cap "LUNAS" atau "DISETUJUI" pada tagihan atau resep.',
    tags: TAGS + 'stamp slam impact shake squash',
    html: HTML,
    css: BASE + '& .dash{position:absolute;top:50%;width:12px;height:2px;border-radius:2px;background:var(--d-fg)}',
    js: function (root, api) {
      var te = root.querySelector('.te'), box = root.querySelector('.wd'), segs = root.querySelectorAll('.sg i'), W = ['GO', 'DONE', 'READY', 'SET'], i = 1, cur, T = [];
      var fg = getComputedStyle(root).color;
      function mk(t) { var w = document.createElement('div'); w.className = 'w'; w.textContent = t; box.appendChild(w); return w; }
      function next() {
        i = (i + 1) % 4; segs.forEach(function (s, j) { s.classList.toggle('on', j === i); });
        var old = cur; cur = mk(W[i]);
        if (api.reduce) { old.remove(); return; }
        old.animate({ opacity: [1, 0] }, { duration: 100, fill: 'forwards' }).onfinish = function () { old.remove(); };
        cur.animate([{ transform: 'scale(1.6)', filter: 'blur(3px)', opacity: 0 }, { transform: 'scale(1)', filter: 'blur(0)', opacity: 1, offset: .4, easing: 'ease-out' }, { transform: 'scale(.93)', offset: .65 }, { transform: 'none' }], { duration: 250, easing: 'ease-in' });
        cur.animate([{ color: '#ff5c9a' }, { color: '#ff5c9a', offset: .3 }, { color: fg }], { duration: 650 });
        T.push(setTimeout(function () {
          te.animate([{ transform: 'none' }, { transform: 'translateX(-4px)' }, { transform: 'translateX(4px)' }, { transform: 'translateX(-2px)' }, { transform: 'none' }], 250);
          var rg = document.createRange(); rg.selectNodeContents(cur);
          var wl = box.offsetWidth / 2 - rg.getBoundingClientRect().width / 2;
          for (var n = 0; n < 6; n++) {
            var d = document.createElement('i'), L = n < 3; d.className = 'dash';
            d.style.left = (L ? wl - 22 : box.offsetWidth - wl + 10) + 'px'; d.style.marginTop = ((n % 3) - 1) * 8 - 1 + 'px'; box.appendChild(d);
            d.animate([{ opacity: 0, transform: 'translateX(0)' }, { opacity: .8, offset: .3 }, { opacity: 0, transform: 'translateX(' + (L ? -10 : 10) + 'px)' }], { duration: 300, easing: 'ease-out' }).onfinish = function () { this.effect.target.remove(); };
          }
        }, 100));
      }
      cur = mk(W[i]);
      te.addEventListener('click', next);
      T.push(setTimeout(next, 600));
      return function () { T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'text-punch-zoom',
    cat: 'Teks & Angka',
    name: 'Punch Zoom',
    source: SRC,
    trigger: 'tap',
    allowColor: true,
    motion: 'Kata baru (biru muda) melesat dari ukuran besar (scale 1.7) ke normal dengan jejak zoom: dua salinan bayangan pada scale 1.45 dan 1.2 ikut mengecil sambil memudar. Kata lama memudar di bawahnya, warna biru muda pudar ke warna teks.',
    timing: 'zoom 130ms ease-out · jejak 180ms · warna → teks 500ms',
    use: 'Menonjolkan angka atau status penting yang baru berubah, misalnya hasil lab "NORMAL".',
    tags: TAGS + 'punch zoom scale trail ghost',
    html: HTML,
    css: BASE,
    js: function (root, api) {
      var te = root.querySelector('.te'), box = root.querySelector('.wd'), segs = root.querySelectorAll('.sg i'), W = ['GO', 'DONE', 'READY', 'SET'], i = 1, cur, T = [];
      var fg = getComputedStyle(root).color;
      function mk(t) { var w = document.createElement('div'); w.className = 'w'; w.textContent = t; box.appendChild(w); return w; }
      function next() {
        i = (i + 1) % 4; segs.forEach(function (s, j) { s.classList.toggle('on', j === i); });
        var old = cur; cur = mk(W[i]);
        if (api.reduce) { old.remove(); return; }
        old.animate({ opacity: [1, 0] }, { duration: 130, fill: 'forwards' }).onfinish = function () { old.remove(); };
        [[1.45, .35, 30], [1.2, .2, 60]].forEach(function (g) {
          var gh = mk(W[i]);
          gh.animate([{ transform: 'scale(' + (g[0] + .3) + ')', opacity: g[1], color: '#7cc4ff' }, { transform: 'scale(1)', opacity: 0, color: '#7cc4ff' }], { duration: 180, delay: g[2], fill: 'backwards', easing: 'ease-out' }).onfinish = function () { gh.remove(); };
        });
        cur.animate([{ transform: 'scale(1.7)', opacity: .4 }, { transform: 'none', opacity: 1 }], { duration: 130, easing: 'cubic-bezier(.2,.8,.2,1)' });
        cur.animate([{ color: '#7cc4ff' }, { color: '#7cc4ff', offset: .25 }, { color: fg }], { duration: 650 });
      }
      cur = mk(W[i]);
      te.addEventListener('click', next);
      T.push(setTimeout(next, 600));
      return function () { T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'text-split-slice',
    cat: 'Teks & Angka',
    name: 'Split Slice',
    source: SRC,
    trigger: 'tap',
    allowColor: true,
    motion: 'Garis sayatan bercahaya (miring ±10°) menyapu kata lama dan kata itu terbelah lalu memudar. Kata baru dipotong diagonal menjadi dua: separuh atas meluncur dari kanan, separuh bawah dari kiri (clip-path polygon), bertemu tepat dan mengunci; garis sayatan memudar sesudahnya.',
    timing: 'sayatan 100ms · dua belahan 200ms ease-out · garis pudar 300ms · warna → teks 400ms',
    use: 'Pergantian judul atau status yang tegas, misalnya label tahap "MENUNGGU → DIPROSES".',
    tags: TAGS + 'split slice diagonal clip-path halves cut',
    html: HTML,
    css: BASE + '& .cut{position:absolute;left:30px;right:30px;top:50%;height:2px;margin-top:-1px;border-radius:2px;background:linear-gradient(90deg,#9b7bff,#4fd6ff);box-shadow:0 0 6px #6aa8ff;transform:rotate(-10deg)}' +
      '& .w.top{clip-path:polygon(0 0,100% 0,100% 32%,0 68%)}& .w.bot{clip-path:polygon(0 68%,100% 32%,100% 100%,0 100%)}',
    js: function (root, api) {
      var te = root.querySelector('.te'), box = root.querySelector('.wd'), segs = root.querySelectorAll('.sg i'), W = ['GO', 'DONE', 'READY', 'SET'], i = 1, cur, T = [];
      var fg = getComputedStyle(root).color;
      function mk(t, c) { var w = document.createElement('div'); w.className = 'w' + (c ? ' ' + c : ''); w.textContent = t; box.appendChild(w); return w; }
      function next() {
        i = (i + 1) % 4; segs.forEach(function (s, j) { s.classList.toggle('on', j === i); });
        var old = cur; cur = mk(W[i]);
        if (api.reduce) { old.remove(); return; }
        cur.style.opacity = 0;
        var line = document.createElement('i'); line.className = 'cut'; box.appendChild(line);
        line.animate([{ transform: 'rotate(-10deg) scaleX(0)', transformOrigin: '0 50%', opacity: 1 }, { transform: 'rotate(-10deg) scaleX(1)', transformOrigin: '0 50%', opacity: 1, offset: .25 }, { transform: 'rotate(-10deg) scaleX(1)', opacity: 0 }], { duration: 400 }).onfinish = function () { line.remove(); };
        old.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(4px)' }], { duration: 160, delay: 60, fill: 'forwards' }).onfinish = function () { old.remove(); };
        var c = { duration: 200, delay: 100, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' };
        var a = mk(W[i], 'top'), b = mk(W[i], 'bot'), w = cur;
        [a, b].forEach(function (h, n) { h.animate([{ color: '#7cc4ff' }, { color: fg }], { duration: 600 }); });
        a.animate([{ transform: 'translate(46px,-8px)', opacity: 0 }, { transform: 'none', opacity: 1 }], c);
        b.animate([{ transform: 'translate(-46px,8px)', opacity: 0 }, { transform: 'none', opacity: 1 }], c).onfinish = function () { a.remove(); b.remove(); w.style.opacity = ''; };
        cur.animate([{ color: '#7cc4ff' }, { color: fg }], { duration: 600 });
      }
      cur = mk(W[i]);
      te.addEventListener('click', next);
      T.push(setTimeout(next, 600));
      return function () { T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'text-letter-cascade',
    cat: 'Teks & Angka',
    name: 'Letter Cascade',
    source: SRC,
    trigger: 'tap',
    allowColor: true,
    motion: 'Huruf kata lama jatuh ke bawah sambil berputar, blur dan memudar dari kiri ke kanan. Huruf kata baru jatuh dari 40px di atas satu per satu dari kiri ke kanan, sedikit miring, melewati garis dasar 7px lalu memantul kembali.',
    timing: 'tiap huruf 320ms bouncy · stagger 50ms kiri → kanan · keluar 220ms stagger 40ms',
    use: 'Judul atau angka yang tampil playful, misalnya ucapan selamat datang di aplikasi pasien.',
    tags: TAGS + 'letter cascade drop bounce stagger per-letter',
    html: HTML,
    css: BASE,
    js: function (root, api) {
      var te = root.querySelector('.te'), box = root.querySelector('.wd'), segs = root.querySelectorAll('.sg i'), W = ['GO', 'DONE', 'READY', 'SET'], i = 1, cur, T = [];
      var fg = getComputedStyle(root).color;
      function mk(t) { var w = document.createElement('div'); w.className = 'w'; w.innerHTML = t.split('').map(function (c) { return '<span>' + c + '</span>'; }).join(''); box.appendChild(w); return w; }
      function next() {
        i = (i + 1) % 4; segs.forEach(function (s, j) { s.classList.toggle('on', j === i); });
        var old = cur; cur = mk(W[i]);
        if (api.reduce) { old.remove(); return; }
        [].forEach.call(old.children, function (s, n) {
          s.animate([{ transform: 'none', opacity: 1 }, { transform: 'translateY(34px) rotate(' + (n % 2 ? 22 : -22) + 'deg)', opacity: 0, filter: 'blur(3px)' }], { duration: 220, delay: n * 40, easing: 'ease-in', fill: 'forwards' });
        });
        T.push(setTimeout(function () { old.remove(); }, old.children.length * 40 + 240));
        [].forEach.call(cur.children, function (s, n) {
          s.animate([{ transform: 'translateY(-40px) rotate(-8deg)', opacity: 0, color: '#8f86ff' }, { transform: 'translateY(7px) rotate(2deg)', opacity: 1, offset: .55 }, { transform: 'translateY(-2px)', offset: .8 }, { transform: 'none', color: fg }], { duration: 320, delay: 60 + n * 50, easing: 'ease-out', fill: 'backwards' });
        });
      }
      cur = mk(W[i]);
      te.addEventListener('click', next);
      T.push(setTimeout(next, 600));
      return function () { T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'text-outline-fill',
    cat: 'Teks & Angka',
    name: 'Outline Fill',
    source: SRC,
    trigger: 'tap',
    allowColor: true,
    motion: 'Isi putih kata lama terkuras dari atas ke bawah sampai tinggal garis tepinya, lalu hilang. Garis tepi kata baru tergambar sendiri (stroke-dashoffset pada teks SVG), ditahan sebentar, lalu isi warna teks naik dari bawah ke atas di dalamnya (clip-path inset).',
    timing: 'kuras 150ms · gambar garis 120ms · tahan 300ms · isi naik 130ms ease-out',
    use: 'Judul atau angka besar yang "terisi" sebagai tanda selesai, misalnya target harian tercapai.',
    tags: TAGS + 'outline stroke draw fill rise svg text clip-path',
    html: HTML,
    css: BASE + '& .w svg{position:absolute;left:50%;top:50%;width:220px;height:60px;margin:-30px 0 0 -110px;overflow:visible}' +
      '& .w text{font:800 44px/1 sans-serif;text-anchor:middle}& .ol text{fill:none;stroke:var(--d-accent);stroke-width:1.4;stroke-dasharray:600}& .fl text{fill:currentColor}',
    js: function (root, api) {
      var te = root.querySelector('.te'), box = root.querySelector('.wd'), segs = root.querySelectorAll('.sg i'), W = ['GO', 'DONE', 'READY', 'SET'], i = 1, cur, T = [];
      function mk(t) {
        var w = document.createElement('div'), tx = '<text x="110" y="46">' + t + '</text>'; w.className = 'w';
        w.innerHTML = '<svg class="ol" viewBox="0 0 220 60" aria-hidden="true">' + tx + '</svg><svg class="fl" viewBox="0 0 220 60" role="img" aria-label="' + t + '">' + tx + '</svg>';
        box.appendChild(w); return w;
      }
      function next() {
        i = (i + 1) % 4; segs.forEach(function (s, j) { s.classList.toggle('on', j === i); });
        var old = cur; cur = mk(W[i]);
        if (api.reduce) { old.remove(); return; }
        old.querySelector('.ol').getAnimations().forEach(function (a) { a.cancel(); }); old.querySelector('.ol').style.opacity = 1;
        old.querySelector('.fl').animate([{ clipPath: 'inset(0 0 0 0)' }, { clipPath: 'inset(100% 0 0 0)' }], { duration: 150, fill: 'forwards' });
        old.animate([{ opacity: 1 }, { opacity: 1, offset: .6 }, { opacity: 0 }], { duration: 260, fill: 'forwards' }).onfinish = function () { old.remove(); };
        cur.querySelector('.ol text').animate([{ strokeDashoffset: 600 }, { strokeDashoffset: 0 }], { duration: 120, delay: 200, easing: 'ease-out', fill: 'backwards' });
        cur.querySelector('.fl').animate([{ clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(100% 0 0 0)', offset: .8 }, { clipPath: 'inset(0 0 0 0)' }], { duration: 650, delay: 200, easing: 'ease-out', fill: 'backwards' });
        cur.querySelector('.ol').animate([{ opacity: 1 }, { opacity: 0 }], { duration: 150, delay: 850, fill: 'forwards' });
      }
      cur = mk(W[i]); cur.querySelector('.ol').style.opacity = 0;
      te.addEventListener('click', next);
      T.push(setTimeout(next, 600));
      return function () { T.forEach(clearTimeout); };
    }
  });
})();
