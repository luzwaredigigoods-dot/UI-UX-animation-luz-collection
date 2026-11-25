/* Menu · Part 5 — six new ways to open the same "View as" dropdown.
   Every demo: tap the "View as" button to open the menu; tap an item to pick it (highlight + check,
   the menu closes and the button label and preview change). Autoplays open → pick once. */
(function () {
  var SRC = 'Menu · Part 5';
  var V = [['Grid', '▦'], ['List', '☰'], ['Board', '▥'], ['Calendar', '▤']];
  var html = function (extra) {
    return '<div class="w" data-v="Grid"><small class="lab">VIEW AS</small>' +
      '<button class="tg" type="button" aria-haspopup="menu" aria-expanded="false"><span class="ic">▦</span><b class="cur">Grid</b><span class="cv">‹</span></button>' +
      '<small class="cnt">12 projects</small><div class="pv" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>' +
      '<div class="mn" role="menu">' + V.map(function (v, i) {
        return '<div class="it' + (i ? '' : ' sel') + '" role="menuitemradio" data-v="' + v[0] + '"><span>' + v[1] + '</span>' + v[0] + '<em>✓</em></div>';
      }).join('') + '</div>' + (extra || '') + '</div>';
  };
  var CSS =
    '& .w{position:relative;width:236px;height:132px}' +
    '& .lab{position:absolute;left:0;top:0;font-size:8.5px;letter-spacing:.12em;color:var(--d-mid)}' +
    '& .tg{position:absolute;left:0;top:16px;width:100px;height:38px;display:flex;align-items:center;gap:7px;padding:0 10px;border:1.5px solid var(--d-accent);border-radius:12px;background:var(--d-bg);cursor:pointer}' +
    '& .tg b{flex:1;text-align:left;font-size:12px}& .ic{font-size:13px;color:var(--d-accent)}' +
    '& .cv{font-size:15px;line-height:1;color:var(--d-mid);transition:transform .2s}& .w.on .cv{transform:rotate(-90deg)}' +
    '& .cnt{position:absolute;left:2px;top:60px;font-size:9px;color:var(--d-mid)}' +
    '& .pv{position:absolute;left:112px;top:0;width:124px;height:118px;padding:8px;border-radius:12px;background:var(--d-bg);display:grid;grid-template-columns:repeat(3,1fr);gap:6px}' +
    '& .pv i{border-radius:5px;background:var(--d-soft)}' +
    '& .w[data-v=List] .pv{grid-template-columns:1fr}& .w[data-v=List] .pv i{height:8px;align-self:center}' +
    '& .w[data-v=Board] .pv{grid-template-columns:repeat(3,1fr);grid-auto-flow:column;grid-template-rows:2fr 1fr}' +
    '& .w[data-v=Calendar] .pv{grid-template-columns:repeat(6,1fr);align-content:center}& .w[data-v=Calendar] .pv i{height:16px}& .w[data-v=Calendar] .pv i:nth-child(3){background:var(--d-accent)}' +
    '& .mn{position:absolute;left:112px;top:0;width:124px;padding:5px;background:var(--d-bg);border:1px solid var(--d-soft);border-radius:12px;box-shadow:0 10px 22px rgba(0,0,0,.14);visibility:hidden;z-index:2}' +
    '& .w.on .mn{visibility:visible}' +
    '& .it{height:26px;display:flex;align-items:center;gap:7px;padding:0 8px;border-radius:8px;font-size:11.5px;cursor:pointer}' +
    '& .it span{width:12px;color:var(--d-accent)}& .it em{margin-left:auto;font-style:normal;font-size:10px;opacity:0}' +
    '& .it.sel em{opacity:1}& .it.pk{background:var(--d-accent);color:var(--d-bg)}& .it.pk span{color:var(--d-bg)}';

  /* Shared flow (inside each js): tap button → toggle(); tap item → pick() → close after 220ms. */

  LUZ.add({
    id: 'menu5-swing-hinge',
    cat: 'Menu & Navigasi',
    name: 'Swing Hinge',
    source: SRC,
    trigger: 'tap',
    motion: 'Panel menu tergantung pada pin engsel di sudut kiri atasnya. Saat dibuka, panel berayun turun dari rotate(35°) ke 0, melewati sampai −6°, balik 3°, lalu diam seperti bandul teredam. Saat item dipilih, panel cepat berayun pergi (rotate 25°) sambil memudar.',
    timing: 'buka 500ms ease-out (ζ ≈ 0.4) · tutup 160ms ease-in',
    use: 'Dropdown yang ingin terasa fisik/menyenangkan, misalnya pengganti tampilan di dashboard.',
    tags: 'menu dropdown swing hinge pendulum rotate sway pin',
    html: html(),
    css: CSS + '& .mn{transform-origin:9px 7px}& .mn::before{content:"";position:absolute;left:6px;top:4px;width:6px;height:6px;border-radius:50%;background:var(--d-mid)}',
    js: function (root, api) {
      var w = root.querySelector('.w'), mn = w.querySelector('.mn'), tg = w.querySelector('.tg'), on = false, T = [];
      function enter() { mn.animate({ transform: ['rotate(35deg)', 'rotate(-6deg)', 'rotate(3deg)', 'rotate(-1deg)', 'rotate(0)'], opacity: [0, 1, 1, 1, 1] }, { duration: 500, easing: 'ease-out' }); }
      function leave() { return [mn.animate({ transform: ['rotate(0)', 'rotate(25deg)'], opacity: [1, 0] }, { duration: 160, easing: 'ease-in', fill: 'forwards' })]; }
      function kill() { w.querySelectorAll('.mn,.mn *').forEach(function (e) { e.getAnimations().forEach(function (a) { a.cancel(); }); }); }
      function toggle() {
        on = !on; kill(); tg.setAttribute('aria-expanded', on);
        if (on) { w.querySelectorAll('.pk').forEach(function (e) { e.classList.remove('pk'); }); w.classList.add('on'); if (!api.reduce) enter(); }
        else Promise.all((api.reduce ? [] : leave()).map(function (a) { return a.finished; })).then(function () { if (!on) w.classList.remove('on'); }, function () {});
      }
      function pick(it) {
        w.querySelectorAll('.it').forEach(function (e) { e.classList.toggle('sel', e === it); }); it.classList.add('pk');
        T.push(setTimeout(function () { w.dataset.v = it.dataset.v; w.querySelector('.cur').textContent = it.dataset.v; w.querySelector('.ic').textContent = it.firstChild.textContent; toggle(); }, 220));
      }
      w.addEventListener('click', function (e) {
        var it = e.target.closest('.it'); T.forEach(clearTimeout);
        if (on && it) pick(it); else if (e.target.closest('.tg')) toggle();
      });
      T.push(setTimeout(toggle, 600), setTimeout(function () { pick(w.querySelectorAll('.it')[2]); }, 1700));
      return function () { T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'menu5-double-doors',
    cat: 'Menu & Navigasi',
    name: 'Double Doors',
    source: SRC,
    trigger: 'tap',
    motion: 'Menu dibelah dua: separuh kiri berengsel di tepi kiri dan separuh kanan di tepi kanan. Saat dibuka, kedua daun pintu berayun menutup ke tengah (rotateY ±90° → 0) dan membentuk panel utuh. Saat item dipilih, kedua daun berayun membuka keluar (0 → ±100°) sambil memudar.',
    timing: 'tutup pintu (buka menu) 220ms ease-out · buka pintu (tutup menu) 220ms ease-in',
    use: 'Menu pilihan yang ingin terasa seperti membuka/menutup lemari, misalnya filter kategori produk.',
    tags: 'menu dropdown double doors split halves rotateY 3d swing',
    html: html(),
    css: CSS + '& .dr{pointer-events:none;visibility:visible}',
    js: function (root, api) {
      var w = root.querySelector('.w'), mn = w.querySelector('.mn'), tg = w.querySelector('.tg'), on = false, T = [];
      function doors(open) {
        return [['inset(0 50% 0 0)', '0% 50%', -1], ['inset(0 0 0 50%)', '100% 50%', 1]].map(function (d) {
          var c = mn.cloneNode(true); c.classList.add('dr'); c.setAttribute('aria-hidden', 'true'); c.style.clipPath = d[0]; c.style.transformOrigin = d[1]; w.appendChild(c);
          var a = c.animate({ transform: open ? ['perspective(500px) rotateY(' + 90 * d[2] + 'deg)', 'perspective(500px) rotateY(0)'] : ['perspective(500px) rotateY(0)', 'perspective(500px) rotateY(' + 100 * d[2] + 'deg)'], opacity: open ? [0.4, 1] : [1, 0] },
            { duration: 220, easing: open ? 'ease-out' : 'ease-in', fill: 'forwards' });
          a.finished.then(function () { c.remove(); }, function () { c.remove(); });
          return a;
        });
      }
      function enter() { doors(true); mn.animate({ opacity: [0, 1] }, { duration: 1, delay: 220, fill: 'backwards' }); }
      function leave() { mn.animate({ opacity: [0, 0] }, { duration: 220, fill: 'forwards' }); return doors(false); }
      function kill() { w.querySelectorAll('.mn,.mn *').forEach(function (e) { e.getAnimations().forEach(function (a) { a.cancel(); }); }); }
      function toggle() {
        on = !on; kill(); tg.setAttribute('aria-expanded', on);
        if (on) { w.querySelectorAll('.pk').forEach(function (e) { e.classList.remove('pk'); }); w.classList.add('on'); if (!api.reduce) enter(); }
        else Promise.all((api.reduce ? [] : leave()).map(function (a) { return a.finished; })).then(function () { if (!on) w.classList.remove('on'); }, function () {});
      }
      function pick(it) {
        w.querySelectorAll('.mn:not(.dr) .it').forEach(function (e) { e.classList.toggle('sel', e === it); }); it.classList.add('pk');
        T.push(setTimeout(function () { w.dataset.v = it.dataset.v; w.querySelector('.cur').textContent = it.dataset.v; w.querySelector('.ic').textContent = it.firstChild.textContent; toggle(); }, 220));
      }
      w.addEventListener('click', function (e) {
        var it = e.target.closest('.it'); T.forEach(clearTimeout);
        if (on && it) pick(it); else if (e.target.closest('.tg')) toggle();
      });
      T.push(setTimeout(toggle, 600), setTimeout(function () { pick(mn.querySelectorAll('.it')[2]); }, 1700));
      return function () { T.forEach(clearTimeout); w.querySelectorAll('.dr').forEach(function (d) { d.remove(); }); };
    }
  });

  LUZ.add({
    id: 'menu5-liquid-fill',
    cat: 'Menu & Navigasi',
    name: 'Liquid Fill',
    source: SRC,
    trigger: 'tap',
    motion: 'Menu terisi dari bawah ke atas seperti cairan: tepi clip-path polygon berbentuk gelombang (amplitudo ±6%, berganti arah tiap langkah) naik dari bawah sampai menutupi seluruh panel. Saat item dipilih, cairan surut turun dengan tepi bergelombang yang sama.',
    timing: 'isi 260ms ease-out · surut 200ms ease-in',
    use: 'Menu di aplikasi bertema cair/kesehatan, misalnya pilihan jenis cairan infus atau target minum.',
    tags: 'menu dropdown liquid fill wave clip-path polygon rise drain',
    html: html(),
    css: CSS,
    js: function (root, api) {
      var w = root.querySelector('.w'), mn = w.querySelector('.mn'), tg = w.querySelector('.tg'), on = false, T = [];
      function wave(rev) {
        var f = [];
        for (var i = 0; i <= 10; i++) {
          var y = 110 - i * 12, a = i === 10 ? 0 : (i % 2 ? 6 : -6);
          f.push({ clipPath: 'polygon(0% 100%, 100% 100%, 100% ' + y + '%, 75% ' + (y + a) + '%, 50% ' + y + '%, 25% ' + (y - a) + '%, 0% ' + y + '%)' });
        }
        return rev ? f.reverse() : f;
      }
      function enter() { mn.animate(wave(false), { duration: 260, easing: 'ease-out' }); }
      function leave() { return [mn.animate(wave(true), { duration: 200, easing: 'ease-in', fill: 'forwards' })]; }
      function kill() { w.querySelectorAll('.mn,.mn *').forEach(function (e) { e.getAnimations().forEach(function (a) { a.cancel(); }); }); }
      function toggle() {
        on = !on; kill(); tg.setAttribute('aria-expanded', on);
        if (on) { w.querySelectorAll('.pk').forEach(function (e) { e.classList.remove('pk'); }); w.classList.add('on'); if (!api.reduce) enter(); }
        else Promise.all((api.reduce ? [] : leave()).map(function (a) { return a.finished; })).then(function () { if (!on) w.classList.remove('on'); }, function () {});
      }
      function pick(it) {
        w.querySelectorAll('.it').forEach(function (e) { e.classList.toggle('sel', e === it); }); it.classList.add('pk');
        T.push(setTimeout(function () { w.dataset.v = it.dataset.v; w.querySelector('.cur').textContent = it.dataset.v; w.querySelector('.ic').textContent = it.firstChild.textContent; toggle(); }, 220));
      }
      w.addEventListener('click', function (e) {
        var it = e.target.closest('.it'); T.forEach(clearTimeout);
        if (on && it) pick(it); else if (e.target.closest('.tg')) toggle();
      });
      T.push(setTimeout(toggle, 600), setTimeout(function () { pick(w.querySelectorAll('.it')[2]); }, 1700));
      return function () { T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'menu5-zipper-rows',
    cat: 'Menu & Navigasi',
    name: 'Zipper Rows',
    source: SRC,
    trigger: 'tap',
    motion: 'Baris-baris menu meluncur masuk dari sisi yang bergantian seperti ritsleting: baris 1 dari kanan, baris 2 dari kiri, baris 3 dari kanan, dan seterusnya (translateX ±40px + opacity), berurutan dari atas. Saat item dipilih, baris meluncur keluar ke sisi yang bergantian.',
    timing: 'baris 240ms ease-out, stagger 40ms · panel 120ms · keluar 160ms ease-in, stagger 30ms',
    use: 'Menu pendek yang ingin terasa dinamis, misalnya pilihan urutan atau tampilan daftar pasien.',
    tags: 'menu dropdown zipper rows alternate slide stagger',
    html: html(),
    css: CSS + '& .mn{overflow:hidden}',
    js: function (root, api) {
      var w = root.querySelector('.w'), mn = w.querySelector('.mn'), tg = w.querySelector('.tg'), on = false, T = [];
      var rows = [].slice.call(mn.querySelectorAll('.it')), X = function (i) { return 'translateX(' + (i % 2 ? -40 : 40) + 'px)'; };
      function enter() {
        mn.animate({ opacity: [0, 1] }, { duration: 120 });
        rows.forEach(function (r, i) { r.animate({ transform: [X(i), 'none'], opacity: [0, 1] }, { duration: 240, delay: 60 + i * 40, easing: 'ease-out', fill: 'backwards' }); });
      }
      function leave() {
        var a = rows.map(function (r, i) { return r.animate({ transform: ['none', X(i)], opacity: [1, 0] }, { duration: 160, delay: i * 30, easing: 'ease-in', fill: 'forwards' }); });
        a.push(mn.animate({ opacity: [1, 0] }, { duration: 120, delay: 180, fill: 'forwards' }));
        return a;
      }
      function kill() { w.querySelectorAll('.mn,.mn *').forEach(function (e) { e.getAnimations().forEach(function (a) { a.cancel(); }); }); }
      function toggle() {
        on = !on; kill(); tg.setAttribute('aria-expanded', on);
        if (on) { w.querySelectorAll('.pk').forEach(function (e) { e.classList.remove('pk'); }); w.classList.add('on'); if (!api.reduce) enter(); }
        else Promise.all((api.reduce ? [] : leave()).map(function (a) { return a.finished; })).then(function () { if (!on) w.classList.remove('on'); }, function () {});
      }
      function pick(it) {
        rows.forEach(function (e) { e.classList.toggle('sel', e === it); }); it.classList.add('pk');
        T.push(setTimeout(function () { w.dataset.v = it.dataset.v; w.querySelector('.cur').textContent = it.dataset.v; w.querySelector('.ic').textContent = it.firstChild.textContent; toggle(); }, 220));
      }
      w.addEventListener('click', function (e) {
        var it = e.target.closest('.it'); T.forEach(clearTimeout);
        if (on && it) pick(it); else if (e.target.closest('.tg')) toggle();
      });
      T.push(setTimeout(toggle, 600), setTimeout(function () { pick(rows[2]); }, 1700));
      return function () { T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'menu5-scroll-unroll',
    cat: 'Menu & Navigasi',
    name: 'Scroll Unroll',
    source: SRC,
    trigger: 'tap',
    motion: 'Sebuah "rol" tebal berwarna aksen (batang bulat 8px, sedikit lebih lebar dari menu) bergerak dari tepi atas ke bawah dan membuka item-item di atasnya seperti gulungan kertas dibuka (clip-path inset dari bawah). Saat item dipilih, rol menggulung kembali ke atas dan menutup menu.',
    timing: 'buka 260ms ease-out · gulung 200ms ease-in · rol memudar di 15% terakhir',
    use: 'Menu bertema dokumen/arsip, misalnya pilihan format laporan atau riwayat kunjungan.',
    tags: 'menu dropdown scroll unroll roller paper reveal clip-path',
    html: html('<span class="rl"></span>'),
    css: CSS + '& .rl{position:absolute;left:109px;top:-3px;width:130px;height:8px;border-radius:4px;background:var(--d-accent);box-shadow:0 2px 6px rgba(0,0,0,.25);opacity:0;pointer-events:none;z-index:3}',
    js: function (root, api) {
      var w = root.querySelector('.w'), mn = w.querySelector('.mn'), tg = w.querySelector('.tg'), rl = w.querySelector('.rl'), on = false, T = [];
      function move(open, ms, ease) {
        var h = mn.offsetHeight, Y = function (y) { return 'translateY(' + y + 'px)'; };
        var k = [{ transform: Y(0), opacity: 1 }, { transform: Y(h), opacity: 1, offset: 0.85 }, { transform: Y(h), opacity: 0 }];
        rl.animate(open ? k : [{ transform: Y(h), opacity: 1 }, { transform: Y(0), opacity: 1, offset: 0.85 }, { transform: Y(0), opacity: 0 }], { duration: ms, easing: ease });
        return mn.animate({ clipPath: open ? ['inset(0 0 100% 0)', 'inset(0 0 0% 0)'] : ['inset(0 0 0% 0)', 'inset(0 0 100% 0)'] }, { duration: ms * 0.85, easing: ease, fill: open ? 'none' : 'forwards' });
      }
      function enter() { move(true, 260, 'ease-out'); }
      function leave() { return [move(false, 200, 'ease-in')]; }
      function kill() { w.querySelectorAll('.mn,.mn *,.rl').forEach(function (e) { e.getAnimations().forEach(function (a) { a.cancel(); }); }); }
      function toggle() {
        on = !on; kill(); tg.setAttribute('aria-expanded', on);
        if (on) { w.querySelectorAll('.pk').forEach(function (e) { e.classList.remove('pk'); }); w.classList.add('on'); if (!api.reduce) enter(); }
        else Promise.all((api.reduce ? [] : leave()).map(function (a) { return a.finished; })).then(function () { if (!on) w.classList.remove('on'); }, function () {});
      }
      function pick(it) {
        w.querySelectorAll('.it').forEach(function (e) { e.classList.toggle('sel', e === it); }); it.classList.add('pk');
        T.push(setTimeout(function () { w.dataset.v = it.dataset.v; w.querySelector('.cur').textContent = it.dataset.v; w.querySelector('.ic').textContent = it.firstChild.textContent; toggle(); }, 220));
      }
      w.addEventListener('click', function (e) {
        var it = e.target.closest('.it'); T.forEach(clearTimeout);
        if (on && it) pick(it); else if (e.target.closest('.tg')) toggle();
      });
      T.push(setTimeout(toggle, 600), setTimeout(function () { pick(w.querySelectorAll('.it')[2]); }, 1700));
      return function () { T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'menu5-line-expand',
    cat: 'Menu & Navigasi',
    name: 'Line Expand',
    source: SRC,
    trigger: 'tap',
    motion: 'Garis tipis bercahaya melesat keluar dari tombol ke kanan melintasi posisi menu (scaleX 0 → 1, origin kiri), lalu garis itu membuka secara vertikal menjadi panel menu (clip-path inset terbuka ke atas dan ke bawah dari tinggi garis). Saat item dipilih, menu kembali memipih menjadi garis yang lalu ditarik masuk ke tombol.',
    timing: 'garis 120ms ease-out · buka 220ms ease-out (mulai 100ms) · tutup 180ms + garis 120ms',
    use: 'Dropdown yang jelas terhubung ke tombol pemicunya, misalnya pilihan tampilan atau filter di toolbar.',
    tags: 'menu dropdown line expand scaleX clip-path from button connector',
    html: html('<span class="ln"></span>'),
    css: CSS + '& .ln{position:absolute;left:100px;top:34px;width:136px;height:2px;border-radius:1px;background:var(--d-accent);box-shadow:0 0 6px var(--d-accent);transform-origin:0 50%;opacity:0;pointer-events:none;z-index:3}',
    js: function (root, api) {
      var w = root.querySelector('.w'), mn = w.querySelector('.mn'), tg = w.querySelector('.tg'), ln = w.querySelector('.ln'), on = false, T = [];
      function slit() { var y = ln.offsetTop - mn.offsetTop; return 'inset(' + y + 'px 0 ' + (mn.offsetHeight - y) + 'px 0)'; }
      function enter() {
        ln.animate({ transform: ['scaleX(0)', 'scaleX(1)', 'scaleX(1)'], opacity: [1, 1, 0] }, { duration: 320, easing: 'ease-out' });
        mn.animate({ clipPath: [slit(), 'inset(0 0 0 0)'] }, { duration: 220, delay: 100, easing: 'ease-out', fill: 'backwards' });
      }
      function leave() {
        return [mn.animate({ clipPath: ['inset(0 0 0 0)', slit()] }, { duration: 180, easing: 'ease-in', fill: 'forwards' }),
          ln.animate({ transform: ['scaleX(1)', 'scaleX(0)'], opacity: [1, 1] }, { duration: 120, delay: 160, easing: 'ease-in' })];
      }
      function kill() { w.querySelectorAll('.mn,.mn *,.ln').forEach(function (e) { e.getAnimations().forEach(function (a) { a.cancel(); }); }); }
      function toggle() {
        on = !on; kill(); tg.setAttribute('aria-expanded', on);
        if (on) { w.querySelectorAll('.pk').forEach(function (e) { e.classList.remove('pk'); }); w.classList.add('on'); if (!api.reduce) enter(); }
        else Promise.all((api.reduce ? [] : leave()).map(function (a) { return a.finished; })).then(function () { if (!on) w.classList.remove('on'); }, function () {});
      }
      function pick(it) {
        w.querySelectorAll('.it').forEach(function (e) { e.classList.toggle('sel', e === it); }); it.classList.add('pk');
        T.push(setTimeout(function () { w.dataset.v = it.dataset.v; w.querySelector('.cur').textContent = it.dataset.v; w.querySelector('.ic').textContent = it.firstChild.textContent; toggle(); }, 220));
      }
      w.addEventListener('click', function (e) {
        var it = e.target.closest('.it'); T.forEach(clearTimeout);
        if (on && it) pick(it); else if (e.target.closest('.tg')) toggle();
      });
      T.push(setTimeout(toggle, 600), setTimeout(function () { pick(w.querySelectorAll('.it')[2]); }, 1700));
      return function () { T.forEach(clearTimeout); };
    }
  });
})();
