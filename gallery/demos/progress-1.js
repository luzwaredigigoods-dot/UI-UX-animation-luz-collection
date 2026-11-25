/* Progress · Part 1 — one progress bar, six ways to fill it.
   Every demo loops on its own: 0 → 15 → 25 → 40 → 50 → 65 → 75 → 90 → 100% (one step every 600ms),
   "Upload complete" at 100%, then resets. The fill is a full-width bar revealed with clip-path. */
(function () {
  var SRC = 'Progress · Part 1';
  var html = function (extra) {
    return '<div class="pc" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">' +
      '<div class="hd"><span class="ic">↑</span><div class="tt"><b>Uploading 4 files</b><small>0 of 4 uploaded</small></div><b class="pct">0%</b></div>' +
      '<div class="tr"><span class="fl"></span>' + (extra || '') + '</div></div>';
  };
  var CSS =
    '& .pc{width:228px;padding:14px;background:var(--d-bg);border:1px solid var(--d-soft);border-radius:16px;display:grid;gap:12px}' +
    '& .hd{display:flex;align-items:center;gap:9px}' +
    '& .ic{width:24px;height:24px;border-radius:50%;border:1.5px solid var(--d-soft);display:grid;place-items:center;font-size:12px;font-weight:700}' +
    '& .tt{flex:1;display:grid;line-height:1.25}& .tt b{font-size:11.5px}& .tt small{font-size:9.5px;color:var(--d-mid)}' +
    '& .pct{font-size:20px;font-variant-numeric:tabular-nums;letter-spacing:-.02em}' +
    '& .tr{position:relative;height:12px;border-radius:6px;background:var(--d-soft)}' +
    '& .fl{position:absolute;inset:0;border-radius:6px;background:var(--d-accent);clip-path:inset(0 100% 0 0 round 6px);overflow:hidden}';

  LUZ.add({
    id: 'progress-liquid-wave',
    cat: 'Loading & Skeleton',
    name: 'Liquid Wave',
    source: SRC,
    trigger: 'load/loop',
    motion: 'Bar terisi seperti cairan: ujung depannya berupa gelembung elips yang bergoyang (scaleX 1 → 1.6 → 0.8 → 1.3 → 1) saat bergerak, dan 3 gelembung kecil naik di dalam isian lalu pecah. Setelah berhenti, ujungnya mendatar kembali.',
    timing: 'isi 420ms ease-out per langkah · goyangan ujung 600ms · gelembung 500ms',
    use: 'Progres unggah/unduh yang ingin terasa hidup, misalnya mengunggah hasil lab atau foto pasien.',
    tags: 'progress bar liquid wave fill bubbles slosh upload',
    html: html('<span class="fr"></span>'),
    css: CSS + '& .tr{overflow:hidden}& .fr{position:absolute;left:0;top:0;width:14px;height:12px;margin-left:-8px;border-radius:50%;background:var(--d-accent);opacity:0}' +
      '& .bu{position:absolute;bottom:1px;width:3px;height:3px;border-radius:50%;background:var(--d-bg)}',
    js: function (root, api) {
      var pc = root.querySelector('.pc'), fl = pc.querySelector('.fl'), tr = pc.querySelector('.tr'), fr = pc.querySelector('.fr');
      var S = [0, 15, 25, 40, 50, 65, 75, 90, 100], i = 0, cur = 0;
      var C = function (p) { return 'inset(0 ' + (100 - p) + '% 0 0 round 6px)'; };
      function anim(a, b) {
        var W = tr.offsetWidth, X = function (p) { return 'translateX(' + W * p / 100 + 'px) '; };
        fl.animate({ clipPath: [C(a), C(b)] }, { duration: 420, easing: 'ease-out' });
        fr.animate([{ transform: X(a) + 'scaleX(1)', opacity: 1 }, { transform: X(b) + 'scaleX(1.6)', offset: 0.6 }, { transform: X(b) + 'scaleX(.8)', offset: 0.75 }, { transform: X(b) + 'scaleX(1.3)', offset: 0.88 }, { transform: X(b) + 'scaleX(1)', opacity: 0 }], { duration: 600, easing: 'ease-out' });
        for (var j = 0; j < 3; j++) {
          var u = document.createElement('i'); u.className = 'bu'; u.style.left = (a + (b - a) * (j + 0.5) / 3) + '%'; tr.appendChild(u);
          u.animate({ transform: ['translateY(0)', 'translateY(-8px)'], opacity: [0, 0.8, 0] }, { duration: 500, delay: 120 + j * 80, fill: 'both' }).finished.then(function () { this.remove(); }.bind(u), function () {});
        }
      }
      function go() {
        i = (i + 1) % (S.length + 2); var b = S[Math.min(i, S.length - 1)];
        if (i >= S.length) return;
        if (!api.reduce && b > cur) anim(cur, b);
        cur = b; fl.style.clipPath = C(b); pc.setAttribute('aria-valuenow', b);
        pc.querySelector('.pct').textContent = b + '%';
        pc.querySelector('.tt b').textContent = b === 100 ? 'Upload complete' : 'Uploading 4 files';
        pc.querySelector('.tt small').textContent = Math.floor(b / 25) + ' of 4 uploaded';
      }
      var t = setInterval(go, 600);
      return function () { clearInterval(t); };
    }
  });

  LUZ.add({
    id: 'progress-block-build',
    cat: 'Loading & Skeleton',
    name: 'Block Build',
    source: SRC,
    trigger: 'load/loop',
    motion: 'Untuk tiap kenaikan, 5 balok kecil bersudut bulat muncul satu per satu di kanan isian (scale 0 → 1, jeda 50ms), lalu menyatu menjadi bar mulus: celah tertutup saat isian utama menyusul dan balok memudar.',
    timing: 'balok 140ms ease-out, stagger 50ms · menyatu 150ms · total ≈550ms',
    use: 'Progres bertahap yang jelas per bagian, misalnya proses unggah beberapa berkas berkas klaim.',
    tags: 'progress bar blocks build stagger pop fuse segments',
    html: html(),
    css: CSS + '& .bk{position:absolute;top:0;bottom:0;border-radius:3px;background:var(--d-accent)}',
    js: function (root, api) {
      var pc = root.querySelector('.pc'), fl = pc.querySelector('.fl'), tr = pc.querySelector('.tr');
      var S = [0, 15, 25, 40, 50, 65, 75, 90, 100], i = 0, cur = 0;
      var C = function (p) { return 'inset(0 ' + (100 - p) + '% 0 0 round 6px)'; };
      function anim(a, b) {
        var w = (b - a) / 5;
        fl.animate({ clipPath: [C(a), C(a), C(b)], offset: [0, 0.7, 1] }, { duration: 550, easing: 'ease-out' });
        for (var j = 0; j < 5; j++) {
          var k = document.createElement('i'); k.className = 'bk'; k.style.left = 'calc(' + (a + w * j) + '% + 1px)'; k.style.width = 'calc(' + w + '% - 2px)'; tr.appendChild(k);
          k.animate([{ transform: 'scale(0)' }, { transform: 'scale(1)', offset: 0.25 }, { transform: 'scale(1)', opacity: 1, offset: 0.75 }, { transform: 'scale(1)', opacity: 0 }],
            { duration: 560 - j * 50, delay: j * 50, easing: 'ease-out', fill: 'both' }).finished.then(function () { this.remove(); }.bind(k), function () {});
        }
      }
      function go() {
        i = (i + 1) % (S.length + 2); var b = S[Math.min(i, S.length - 1)];
        if (i >= S.length) return;
        if (!api.reduce && b > cur) anim(cur, b);
        cur = b; fl.style.clipPath = C(b); pc.setAttribute('aria-valuenow', b);
        pc.querySelector('.pct').textContent = b + '%';
        pc.querySelector('.tt b').textContent = b === 100 ? 'Upload complete' : 'Uploading 4 files';
        pc.querySelector('.tt small').textContent = Math.floor(b / 25) + ' of 4 uploaded';
      }
      var t = setInterval(go, 600);
      return function () { clearInterval(t); };
    }
  });

  LUZ.add({
    id: 'progress-candy-stripes',
    cat: 'Loading & Skeleton',
    name: 'Candy Stripes',
    source: SRC,
    trigger: 'load/loop',
    motion: 'Saat bar mengisi, garis-garis diagonal 45° muncul di atas isian dan berlari melintasinya (background-position bergerak terus). Setelah isian berhenti, garis memudar dalam ≈300ms dan bar kembali polos.',
    timing: 'isi 420ms ease-out · garis berlari 0.6s linear berulang · muncul 70ms, pudar 300ms',
    use: 'Progres yang sedang aktif bekerja, misalnya sinkronisasi data rekam medis.',
    tags: 'progress bar candy stripes diagonal barber pole animated',
    allowColor: true,
    html: html(),
    css: CSS + '& .sp{position:absolute;inset:0;opacity:0;background:repeating-linear-gradient(45deg,rgba(255,255,255,.4) 0 5px,transparent 5px 10px);background-size:14.14px 14.14px;animation:progress1candy .6s linear infinite}' +
      '@keyframes progress1candy{to{background-position:14.14px 0}}' +
      '@media (prefers-reduced-motion:reduce){& .sp{animation:none}}',
    js: function (root, api) {
      var pc = root.querySelector('.pc'), fl = pc.querySelector('.fl'), sp = document.createElement('span');
      var S = [0, 15, 25, 40, 50, 65, 75, 90, 100], i = 0, cur = 0;
      var C = function (p) { return 'inset(0 ' + (100 - p) + '% 0 0 round 6px)'; };
      sp.className = 'sp'; fl.appendChild(sp);
      function anim(a, b) {
        fl.animate({ clipPath: [C(a), C(b)] }, { duration: 420, easing: 'ease-out' });
        sp.animate({ opacity: [0, 1, 1, 0], offset: [0, 0.1, 0.6, 1] }, { duration: 750 });
      }
      function go() {
        i = (i + 1) % (S.length + 2); var b = S[Math.min(i, S.length - 1)];
        if (i >= S.length) return;
        if (!api.reduce && b > cur) anim(cur, b);
        cur = b; fl.style.clipPath = C(b); pc.setAttribute('aria-valuenow', b);
        pc.querySelector('.pct').textContent = b + '%';
        pc.querySelector('.tt b').textContent = b === 100 ? 'Upload complete' : 'Uploading 4 files';
        pc.querySelector('.tt small').textContent = Math.floor(b / 25) + ' of 4 uploaded';
      }
      var t = setInterval(go, 600);
      return function () { clearInterval(t); };
    }
  });

  LUZ.add({
    id: 'progress-spring-overshoot',
    cat: 'Loading & Skeleton',
    name: 'Spring Overshoot',
    source: SRC,
    trigger: 'load/loop',
    motion: 'Isian bar memegas melewati targetnya sekitar 9% lebar track, mundur ke −3%, maju lagi +1%, lalu diam di nilai yang benar, seperti pegas teredam (ζ ≈ 0.45).',
    timing: '≈550ms · overshoot +9% → −3% → +1% → target',
    use: 'Progres yang ingin terasa energik, misalnya langkah onboarding atau skor kelengkapan profil.',
    tags: 'progress bar spring overshoot bounce wobble settle',
    html: html(),
    css: CSS,
    js: function (root, api) {
      var pc = root.querySelector('.pc'), fl = pc.querySelector('.fl');
      var S = [0, 15, 25, 40, 50, 65, 75, 90, 100], i = 0, cur = 0;
      var C = function (p) { return 'inset(0 ' + (100 - Math.min(p, 100)) + '% 0 0 round 6px)'; };
      function anim(a, b) {
        fl.animate({ clipPath: [C(a), C(b + 9), C(b - 3), C(b + 1), C(b)], offset: [0, 0.35, 0.6, 0.8, 1] }, { duration: 550, easing: 'ease-in-out' });
      }
      function go() {
        i = (i + 1) % (S.length + 2); var b = S[Math.min(i, S.length - 1)];
        if (i >= S.length) return;
        if (!api.reduce && b > cur) anim(cur, b);
        cur = b; fl.style.clipPath = C(b); pc.setAttribute('aria-valuenow', b);
        pc.querySelector('.pct').textContent = b + '%';
        pc.querySelector('.tt b').textContent = b === 100 ? 'Upload complete' : 'Uploading 4 files';
        pc.querySelector('.tt small').textContent = Math.floor(b / 25) + ' of 4 uploaded';
      }
      var t = setInterval(go, 600);
      return function () { clearInterval(t); };
    }
  });

  LUZ.add({
    id: 'progress-comet-glow',
    cat: 'Loading & Skeleton',
    name: 'Comet Glow',
    source: SRC,
    trigger: 'load/loop',
    motion: 'Kepala bercahaya putih (radial glow 22px, lebih besar dari tinggi bar) melesat di ujung isian ke nilai baru sambil menebar 4 percikan kecil di belakangnya, lalu kepala meredup setelah sampai.',
    timing: 'melesat 400ms ease-out · kepala pudar 200ms · percikan 350ms · total ≈600ms',
    use: 'Progres singkat yang perlu menarik mata, misalnya pengiriman resep atau rujukan.',
    tags: 'progress bar comet glow head sparks trail shine',
    allowColor: true,
    html: html('<span class="cm"></span>'),
    css: CSS + '& .cm{position:absolute;left:0;top:50%;width:22px;height:22px;margin:-11px 0 0 -14px;border-radius:50%;background:radial-gradient(circle,#fff 0 22%,rgba(255,255,255,.55) 40%,transparent 70%);opacity:0;pointer-events:none}' +
      '& .sk{position:absolute;top:5px;width:2px;height:2px;border-radius:50%;background:#fff;box-shadow:0 0 3px var(--d-accent)}',
    js: function (root, api) {
      var pc = root.querySelector('.pc'), fl = pc.querySelector('.fl'), tr = pc.querySelector('.tr'), cm = pc.querySelector('.cm');
      var S = [0, 15, 25, 40, 50, 65, 75, 90, 100], i = 0, cur = 0;
      var C = function (p) { return 'inset(0 ' + (100 - p) + '% 0 0 round 6px)'; };
      function anim(a, b) {
        var W = tr.offsetWidth, X = function (p) { return 'translateX(' + W * p / 100 + 'px)'; };
        fl.animate({ clipPath: [C(a), C(b)] }, { duration: 400, easing: 'ease-out' });
        cm.animate([{ transform: X(a), opacity: 1 }, { transform: X(b), opacity: 1, offset: 0.66 }, { transform: X(b), opacity: 0 }], { duration: 600, easing: 'ease-out' });
        for (var j = 0; j < 4; j++) {
          var s = document.createElement('i'); s.className = 'sk'; s.style.left = (a + (b - a) * (j + 1) / 5) + '%'; tr.appendChild(s);
          s.animate({ transform: ['translate(0,0)', 'translate(-6px,' + (j % 2 ? 6 : -6) + 'px)'], opacity: [1, 0] }, { duration: 350, delay: 80 * j, fill: 'both' }).finished.then(function () { this.remove(); }.bind(s), function () {});
        }
      }
      function go() {
        i = (i + 1) % (S.length + 2); var b = S[Math.min(i, S.length - 1)];
        if (i >= S.length) return;
        if (!api.reduce && b > cur) anim(cur, b);
        cur = b; fl.style.clipPath = C(b); pc.setAttribute('aria-valuenow', b);
        pc.querySelector('.pct').textContent = b + '%';
        pc.querySelector('.tt b').textContent = b === 100 ? 'Upload complete' : 'Uploading 4 files';
        pc.querySelector('.tt small').textContent = Math.floor(b / 25) + ' of 4 uploaded';
      }
      var t = setInterval(go, 600);
      return function () { clearInterval(t); };
    }
  });

  LUZ.add({
    id: 'progress-pixel-dissolve',
    cat: 'Loading & Skeleton',
    name: 'Pixel Dissolve',
    source: SRC,
    trigger: 'load/loop',
    motion: 'Bagian baru tidak langsung terisi: muncul dulu sebagai ±14 piksel kecil 3px yang tersebar acak di area kenaikan dan berkelip (opacity 0 → 1 → 0.3 → 1), lalu isian utama menyusul dan piksel menghilang sehingga bagian itu menjadi padat.',
    timing: 'piksel 500ms dengan jeda acak 0–150ms · isian menyusul 200ms (mulai di 250ms) · total ≈550ms',
    use: 'Progres bergaya digital, misalnya pemrosesan/rendering gambar radiologi.',
    tags: 'progress bar pixel dissolve sparkle digital noise fill',
    allowColor: true,
    html: html(),
    css: CSS + '& .pp{position:absolute;width:3px;height:3px;background:var(--d-accent);box-shadow:0 0 2px #fff}',
    js: function (root, api) {
      var pc = root.querySelector('.pc'), fl = pc.querySelector('.fl'), tr = pc.querySelector('.tr');
      var S = [0, 15, 25, 40, 50, 65, 75, 90, 100], i = 0, cur = 0;
      var C = function (p) { return 'inset(0 ' + (100 - p) + '% 0 0 round 6px)'; };
      function anim(a, b) {
        fl.animate({ clipPath: [C(a), C(b)] }, { duration: 200, delay: 250, easing: 'ease-out', fill: 'backwards' });
        for (var j = 0; j < 14; j++) {
          var p = document.createElement('i'); p.className = 'pp'; p.style.left = (a + Math.random() * (b - a)) + '%'; p.style.top = Math.floor(Math.random() * 3) * 3 + 'px'; tr.appendChild(p);
          p.animate({ opacity: [0, 1, 0.3, 1, 0] }, { duration: 500, delay: Math.random() * 150, fill: 'both' }).finished.then(function () { this.remove(); }.bind(p), function () {});
        }
      }
      function go() {
        i = (i + 1) % (S.length + 2); var b = S[Math.min(i, S.length - 1)];
        if (i >= S.length) return;
        if (!api.reduce && b > cur) anim(cur, b);
        cur = b; fl.style.clipPath = C(b); pc.setAttribute('aria-valuenow', b);
        pc.querySelector('.pct').textContent = b + '%';
        pc.querySelector('.tt b').textContent = b === 100 ? 'Upload complete' : 'Uploading 4 files';
        pc.querySelector('.tt small').textContent = Math.floor(b / 25) + ' of 4 uploaded';
      }
      var t = setInterval(go, 600);
      return function () { clearInterval(t); };
    }
  });
})();
