/* Search · Part 3 — one search bar, six ways to open it.
   Every demo: tap the search button and the bar opens, "cam" is typed and three suggestions appear.
   Tap a suggestion to pick it (the bar and list close); tap elsewhere to close. Autoplays once. */
(function () {
  var SRC = 'Search · Part 3';
  var ICON = '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/></svg>';
  var TRACE = function (r) { return '<svg class="tr" aria-hidden="true"><rect width="100%" height="100%" rx="' + r + '" pathLength="100"/></svg>'; };
  var HTML =
    '<div class="w">' +
      '<div class="hd"><b>Explore</b><span class="sb" role="button" aria-label="Buka pencarian">' + ICON + '</span></div>' +
      '<div class="bar">' + ICON + '<span class="q">cam</span><span class="x" aria-label="Tutup">×</span>' + TRACE(17) + '</div>' +
      '<div class="ls" role="listbox">' +
        '<div class="li"><span><b>cam</b>era bag</span></div><div class="li"><span><b>cam</b>ping chair</span></div><div class="li"><span><b>cam</b>el coat</span></div>' + TRACE(12) +
      '</div>' +
      '<div class="cards"><i></i><i></i><i></i><i></i></div>' +
    '</div>';
  var CSS =
    '& .w{position:relative;width:224px;height:160px;cursor:pointer}' +
    '& svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;flex:none}' +
    '& .hd{position:absolute;inset:0 0 auto;height:34px;display:flex;align-items:center;justify-content:space-between;transition:opacity .15s}' +
    '& .hd b{font-size:17px;letter-spacing:-.01em}' +
    '& .sb{width:30px;height:30px;border-radius:50%;border:1px solid var(--d-soft);display:grid;place-items:center}' +
    '& .bar{position:absolute;inset:0 0 auto;height:34px;display:flex;align-items:center;gap:8px;padding:0 12px;border:1.5px solid var(--d-accent);border-radius:17px;background:var(--d-bg);visibility:hidden;z-index:2}' +
    '& .q{flex:1;font-size:12px;white-space:nowrap;overflow:hidden}' +
    '& .q::after{content:"";display:inline-block;width:1px;height:12px;margin-left:1px;vertical-align:-2px;background:var(--d-accent)}' +
    '& .x{width:18px;height:18px;border-radius:50%;background:var(--d-soft);display:grid;place-items:center;font-size:12px;line-height:1}' +
    '& .ls{position:absolute;top:40px;left:0;right:0;padding:4px;background:var(--d-bg);border:1px solid var(--d-soft);border-radius:12px;visibility:hidden;z-index:2;box-shadow:0 8px 18px rgba(0,0,0,.12)}' +
    '& .li{height:26px;display:flex;align-items:center;padding:0 10px;border-radius:8px;font-size:11.5px;color:var(--d-mid)}' +
    '& .li b{color:var(--d-fg)}' +
    '& .li.pk{background:var(--d-accent);color:var(--d-bg)}& .li.pk b{color:var(--d-bg)}' +
    '& .w.on .bar,& .w.on .ls{visibility:visible}& .w.on .hd{opacity:0}' +
    '& .cards{position:absolute;top:46px;left:0;right:0;display:grid;grid-template-columns:1fr 1fr;gap:8px 10px}' +
    '& .cards i{height:50px;border-radius:10px;background:linear-gradient(120deg,var(--d-accent),var(--d-soft))}' +
    '& .cards i:nth-child(even){background:linear-gradient(120deg,var(--d-mid),var(--d-soft))}' +
    '& .tr{display:none;position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none}' +
    '& .tr rect{fill:none;stroke:var(--d-accent);stroke-width:2;stroke-dasharray:100;filter:drop-shadow(0 0 3px var(--d-accent))}';

  /* Shared flow, repeated inside each js so every demo stays self-contained:
     click → open (enter) / pick a row → close (leave). */

  LUZ.add({
    id: 'search-circle-reveal',
    cat: 'Input & Form',
    name: 'Circle Reveal',
    source: SRC,
    trigger: 'tap',
    motion: 'Bar pencarian dibuka oleh lingkaran clip-path yang tumbuh dari tombol cari di ujung kanan sampai menutupi bar. Daftar saran dibuka lingkaran kedua dari titik ketuk di kanan atas daftar. Saat ditutup, lingkaran menyusut kembali ke tombol X.',
    timing: 'bar 220ms ease-out · daftar 240ms (jeda 80ms) · tutup 180ms ease-in',
    use: 'Kolom cari di header aplikasi yang tersembunyi di balik ikon kaca pembesar.',
    tags: 'search bar circle reveal clip-path expand from button suggestions dropdown',
    html: HTML, css: CSS,
    js: function (root, api) {
      var w = root.querySelector('.w'), bar = w.querySelector('.bar'), ls = w.querySelector('.ls'), q = w.querySelector('.q'), on = false, T = [];
      var C = function (r, x, y) { return 'circle(' + r + ' at ' + x + ' ' + y + ')'; };
      function enter() {
        bar.animate({ clipPath: [C('0%', '93%', '50%'), C('150%', '93%', '50%')] }, { duration: 220, easing: 'ease-out' });
        ls.animate({ clipPath: [C('0%', '85%', '0%'), C('160%', '85%', '0%')] }, { duration: 240, delay: 80, easing: 'ease-out', fill: 'backwards' });
      }
      function leave() {
        return [ls.animate({ clipPath: [C('160%', '85%', '0%'), C('0%', '85%', '0%')] }, { duration: 160, easing: 'ease-in', fill: 'forwards' }),
          bar.animate({ clipPath: [C('150%', '93%', '50%'), C('0%', '93%', '50%')] }, { duration: 180, delay: 100, easing: 'ease-in', fill: 'forwards' })];
      }
      function kill() { w.querySelectorAll('*').forEach(function (e) { e.getAnimations().forEach(function (a) { a.cancel(); }); }); }
      function toggle() {
        on = !on; kill();
        if (on) { q.textContent = 'cam'; w.querySelectorAll('.pk').forEach(function (e) { e.classList.remove('pk'); }); w.classList.add('on'); if (!api.reduce) enter(); }
        else Promise.all((api.reduce ? [] : leave()).map(function (a) { return a.finished; })).then(function () { if (!on) w.classList.remove('on'); }, function () {});
      }
      function pick(li) { li.classList.add('pk'); q.textContent = li.textContent; T.push(setTimeout(toggle, 280)); }
      w.addEventListener('click', function (e) { T.forEach(clearTimeout); var li = e.target.closest('.li'); if (on && li) pick(li); else toggle(); });
      T.push(setTimeout(toggle, 600), setTimeout(function () { pick(ls.children[1]); }, 2000));
      return function () { T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'search-paper-unfold',
    cat: 'Input & Form',
    name: 'Paper Unfold',
    source: SRC,
    trigger: 'tap',
    motion: 'Bar terbuka seperti kertas dilipat: berputar rotateY dari 90° ke 0 dengan engsel di tepi kanan (dekat tombol). Baris saran terbuka satu per satu dari atas, masing-masing rotateX −90° → 0 dengan engsel di tepi atas. Saat ditutup, baris terlipat dari bawah ke atas lalu bar terlipat ke kanan.',
    timing: 'bar 300ms ease-out · baris 220ms, stagger 70ms · tutup kebalikan, 160ms per baris',
    use: 'Pencarian bergaya editorial/majalah, atau menu saran yang ingin terasa "dibuka".',
    tags: 'search paper fold unfold rotateX rotateY 3d stagger rows',
    html: HTML, css: CSS + '& .w{perspective:500px}& .bar{transform-origin:100% 50%}& .li{transform-origin:50% 0}',
    js: function (root, api) {
      var w = root.querySelector('.w'), bar = w.querySelector('.bar'), ls = w.querySelector('.ls'), q = w.querySelector('.q'), on = false, T = [];
      var rows = [].slice.call(ls.querySelectorAll('.li'));
      function enter() {
        bar.animate({ transform: ['perspective(500px) rotateY(90deg)', 'perspective(500px) rotateY(0)'] }, { duration: 300, easing: 'ease-out' });
        ls.animate({ opacity: [0, 1] }, { duration: 1, delay: 200, fill: 'backwards' });
        rows.forEach(function (r, i) { r.animate({ transform: ['perspective(400px) rotateX(-90deg)', 'perspective(400px) rotateX(0)'], opacity: [0, 1] }, { duration: 220, delay: 200 + i * 70, easing: 'ease-out', fill: 'backwards' }); });
      }
      function leave() {
        var a = rows.map(function (r, i) { return r.animate({ transform: ['perspective(400px) rotateX(0)', 'perspective(400px) rotateX(-90deg)'], opacity: [1, 0] }, { duration: 160, delay: (2 - i) * 60, easing: 'ease-in', fill: 'forwards' }); });
        a.push(ls.animate({ opacity: [1, 0] }, { duration: 1, delay: 300, fill: 'forwards' }));
        a.push(bar.animate({ transform: ['perspective(500px) rotateY(0)', 'perspective(500px) rotateY(90deg)'] }, { duration: 220, delay: 280, easing: 'ease-in', fill: 'forwards' }));
        return a;
      }
      function kill() { w.querySelectorAll('*').forEach(function (e) { e.getAnimations().forEach(function (a) { a.cancel(); }); }); }
      function toggle() {
        on = !on; kill();
        if (on) { q.textContent = 'cam'; w.querySelectorAll('.pk').forEach(function (e) { e.classList.remove('pk'); }); w.classList.add('on'); if (!api.reduce) enter(); }
        else Promise.all((api.reduce ? [] : leave()).map(function (a) { return a.finished; })).then(function () { if (!on) w.classList.remove('on'); }, function () {});
      }
      function pick(li) { li.classList.add('pk'); q.textContent = li.textContent; T.push(setTimeout(toggle, 280)); }
      w.addEventListener('click', function (e) { T.forEach(clearTimeout); var li = e.target.closest('.li'); if (on && li) pick(li); else toggle(); });
      T.push(setTimeout(toggle, 600), setTimeout(function () { pick(rows[1]); }, 2100));
      return function () { T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'search-jelly-pop',
    cat: 'Input & Form',
    name: 'Jelly Pop',
    source: SRC,
    trigger: 'tap',
    motion: 'Bar muncul dari scale 0.8 dengan goyangan jeli: scaleX dan scaleY bergantian (1.06/0.94 → 0.97/1.03 → 1). Panel daftar lalu tiap saran pop ke 1.08 dan bergoyang turun ke 1, berurutan dari atas. Saat ditutup, bar tergencet (scaleY turun, scaleX naik) lalu mengecil ke tombol.',
    timing: 'bar 420ms spring lembut · baris 360ms, stagger 60ms · tutup 200ms ease-in',
    use: 'Aplikasi yang bernuansa ramah/main-main, misalnya pencarian di aplikasi edukasi pasien anak.',
    tags: 'search jelly wobble squash stretch pop spring bouncy suggestions',
    html: HTML, css: CSS + '& .bar{transform-origin:90% 50%}& .ls{transform-origin:50% 0}',
    js: function (root, api) {
      var w = root.querySelector('.w'), bar = w.querySelector('.bar'), ls = w.querySelector('.ls'), q = w.querySelector('.q'), on = false, T = [];
      var rows = [].slice.call(ls.querySelectorAll('.li'));
      var JELLY = ['scale(.8,.8)', 'scale(1.06,.94)', 'scale(.97,1.03)', 'scale(1.01,.99)', 'scale(1)'];
      function enter() {
        bar.animate({ transform: JELLY, opacity: [0, 1, 1, 1, 1] }, { duration: 420, easing: 'ease-out' });
        ls.animate({ transform: JELLY, opacity: [0, 1, 1, 1, 1] }, { duration: 380, delay: 120, easing: 'ease-out', fill: 'backwards' });
        rows.forEach(function (r, i) { r.animate({ transform: ['scale(.6)', 'scale(1.08)', 'scale(.97)', 'scale(1)'], opacity: [0, 1, 1, 1] }, { duration: 360, delay: 200 + i * 60, easing: 'ease-out', fill: 'backwards' }); });
      }
      function leave() {
        return [ls.animate({ transform: ['scale(1)', 'scale(.85)'], opacity: [1, 0] }, { duration: 160, easing: 'ease-in', fill: 'forwards' }),
          bar.animate({ transform: ['scale(1)', 'scale(1.06,.8)', 'scale(.3,.3)'], opacity: [1, 1, 0] }, { duration: 200, delay: 80, easing: 'ease-in', fill: 'forwards' })];
      }
      function kill() { w.querySelectorAll('*').forEach(function (e) { e.getAnimations().forEach(function (a) { a.cancel(); }); }); }
      function toggle() {
        on = !on; kill();
        if (on) { q.textContent = 'cam'; w.querySelectorAll('.pk').forEach(function (e) { e.classList.remove('pk'); }); w.classList.add('on'); if (!api.reduce) enter(); }
        else Promise.all((api.reduce ? [] : leave()).map(function (a) { return a.finished; })).then(function () { if (!on) w.classList.remove('on'); }, function () {});
      }
      function pick(li) { li.classList.add('pk'); q.textContent = li.textContent; T.push(setTimeout(toggle, 280)); }
      w.addEventListener('click', function (e) { T.forEach(clearTimeout); var li = e.target.closest('.li'); if (on && li) pick(li); else toggle(); });
      T.push(setTimeout(toggle, 600), setTimeout(function () { pick(rows[1]); }, 2100));
      return function () { T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'search-border-trace',
    cat: 'Input & Form',
    name: 'Border Trace',
    source: SRC,
    trigger: 'tap',
    motion: 'Garis biru bercahaya menelusuri keliling bar (stroke-dashoffset 100 → 0), lalu teks bar tersapu masuk dari kiri ke kanan (clip-path inset). Daftar saran ditelusuri garis yang sama, lalu kata-katanya tersapu masuk. Saat ditutup, isi memudar dan garis ditarik kembali.',
    timing: 'garis 250ms ease-in-out · sapuan teks 160ms · daftar mulai 150ms kemudian · tutup 200ms',
    use: 'Kolom cari di dashboard gelap/teknis yang butuh sorotan fokus yang jelas.',
    tags: 'search border trace stroke dashoffset glow line draw text wipe',
    html: HTML, css: CSS + '& .tr{display:block}& .tr rect{stroke-dashoffset:0}& .bar,& .ls{border-color:transparent}',
    js: function (root, api) {
      var w = root.querySelector('.w'), bar = w.querySelector('.bar'), ls = w.querySelector('.ls'), q = w.querySelector('.q'), on = false, T = [];
      var lines = w.querySelectorAll('.tr rect'), words = [q].concat([].slice.call(ls.querySelectorAll('.li span')));
      function enter() {
        lines.forEach(function (l, i) { l.animate({ strokeDashoffset: [100, 0] }, { duration: 250, delay: i * 150, easing: 'ease-in-out', fill: 'backwards' }); });
        words.forEach(function (t, i) { t.animate({ clipPath: ['inset(0 100% 0 0)', 'inset(0 0 0 0)'] }, { duration: 160, delay: i ? 320 + i * 40 : 200, easing: 'ease-out', fill: 'backwards' }); });
      }
      function leave() {
        var a = words.map(function (t) { return t.animate({ opacity: [1, 0] }, { duration: 120, fill: 'forwards' }); });
        lines.forEach(function (l) { a.push(l.animate({ strokeDashoffset: [0, -100] }, { duration: 200, delay: 100, easing: 'ease-in', fill: 'forwards' })); });
        a.push(ls.animate({ opacity: [1, 0] }, { duration: 120, delay: 180, fill: 'forwards' }), bar.animate({ opacity: [1, 0] }, { duration: 120, delay: 200, fill: 'forwards' }));
        return a;
      }
      function kill() { w.querySelectorAll('*').forEach(function (e) { e.getAnimations().forEach(function (a) { a.cancel(); }); }); }
      function toggle() {
        on = !on; kill();
        if (on) { q.textContent = 'cam'; w.querySelectorAll('.pk').forEach(function (e) { e.classList.remove('pk'); }); w.classList.add('on'); if (!api.reduce) enter(); }
        else Promise.all((api.reduce ? [] : leave()).map(function (a) { return a.finished; })).then(function () { if (!on) w.classList.remove('on'); }, function () {});
      }
      function pick(li) { li.classList.add('pk'); q.textContent = li.textContent; T.push(setTimeout(toggle, 280)); }
      w.addEventListener('click', function (e) { T.forEach(clearTimeout); var li = e.target.closest('.li'); if (on && li) pick(li); else toggle(); });
      T.push(setTimeout(toggle, 600), setTimeout(function () { pick(ls.querySelectorAll('.li')[1]); }, 2100));
      return function () { T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'search-blur-focus',
    cat: 'Input & Form',
    name: 'Blur Focus',
    source: SRC,
    trigger: 'tap',
    motion: 'Semua yang masuk datang dari blur(8px) dan opacity 0 lalu tajam: judul memudar kabur, bar menajam, lalu daftar menajam. Saat memilih, baris lain kabur duluan, baris terpilih tetap tajam sebentar, lalu daftar dan bar kabur keluar dan judul "Explore" menajam kembali.',
    timing: 'masuk 220ms ease-out · daftar jeda 100ms · keluar 180ms ease-in',
    use: 'Transisi lembut untuk kolom cari di aplikasi bernuansa tenang/premium.',
    tags: 'search blur focus filter sharpen fade in suggestions',
    html: HTML, css: CSS + '& .hd{transition:opacity .2s,filter .2s}& .w.on .hd{filter:blur(6px)}',
    js: function (root, api) {
      var w = root.querySelector('.w'), bar = w.querySelector('.bar'), ls = w.querySelector('.ls'), q = w.querySelector('.q'), on = false, T = [];
      var rows = [].slice.call(ls.querySelectorAll('.li'));
      var IN = { filter: ['blur(8px)', 'blur(0)'], opacity: [0, 1] }, OUT = { filter: ['blur(0)', 'blur(8px)'], opacity: [1, 0] };
      function enter() {
        bar.animate(IN, { duration: 220, easing: 'ease-out' });
        ls.animate(IN, { duration: 220, delay: 100, easing: 'ease-out', fill: 'backwards' });
      }
      function leave() {
        var a = rows.filter(function (r) { return !r.classList.contains('pk'); }).map(function (r) { return r.animate(OUT, { duration: 140, fill: 'forwards' }); });
        a.push(ls.animate(OUT, { duration: 180, delay: 120, easing: 'ease-in', fill: 'forwards' }), bar.animate(OUT, { duration: 180, delay: 160, easing: 'ease-in', fill: 'forwards' }));
        return a;
      }
      function kill() { w.querySelectorAll('*').forEach(function (e) { e.getAnimations().forEach(function (a) { if (a.effect) a.cancel(); }); }); }
      function toggle() {
        on = !on; kill();
        if (on) { q.textContent = 'cam'; w.querySelectorAll('.pk').forEach(function (e) { e.classList.remove('pk'); }); w.classList.add('on'); if (!api.reduce) enter(); }
        else Promise.all((api.reduce ? [] : leave()).map(function (a) { return a.finished; })).then(function () { if (!on) w.classList.remove('on'); }, function () {});
      }
      function pick(li) { li.classList.add('pk'); q.textContent = li.textContent; T.push(setTimeout(toggle, 280)); }
      w.addEventListener('click', function (e) { T.forEach(clearTimeout); var li = e.target.closest('.li'); if (on && li) pick(li); else toggle(); });
      T.push(setTimeout(toggle, 600), setTimeout(function () { pick(rows[1]); }, 2000));
      return function () { T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'search-spotlight-dim',
    cat: 'Input & Form',
    name: 'Spotlight Dim',
    source: SRC,
    trigger: 'tap',
    motion: 'Saat pencarian aktif, konten halaman (kartu) meredup ke opacity 0.3 dan bar terangkat 3px dengan bayangan lebih tebal. Daftar saran meluncur turun dari balik bar (translateY −24px → 0 dengan clip-path terbuka dari atas). Saat memilih, baris lain meredup, daftar meluncur naik kembali ke balik bar dan halaman terang lagi.',
    timing: 'redup 200ms · angkat bar 200ms ease-out · daftar 260ms ease-out · tutup 200ms ease-in',
    use: 'Pencarian global yang perlu memusatkan perhatian, misalnya cari pasien di atas daftar jadwal.',
    tags: 'search spotlight dim overlay focus lift slide down from behind',
    html: HTML, css: CSS + '& .w.on .bar{box-shadow:0 8px 18px rgba(0,0,0,.25)}& .ls{z-index:1}& .cards{transition:opacity .2s}& .w.on .cards{opacity:.3}',
    js: function (root, api) {
      var w = root.querySelector('.w'), bar = w.querySelector('.bar'), ls = w.querySelector('.ls'), q = w.querySelector('.q'), on = false, T = [];
      var rows = [].slice.call(ls.querySelectorAll('.li'));
      function enter() {
        bar.animate({ transform: ['translateY(0)', 'translateY(-3px)'], opacity: [0, 1] }, { duration: 200, easing: 'ease-out', fill: 'forwards' });
        ls.animate({ transform: ['translateY(-24px)', 'translateY(0)'], clipPath: ['inset(24px 0 0 0)', 'inset(0 0 0 0)'] }, { duration: 260, delay: 120, easing: 'ease-out', fill: 'backwards' });
      }
      function leave() {
        var a = rows.filter(function (r) { return !r.classList.contains('pk'); }).map(function (r) { return r.animate({ opacity: [1, 0.3] }, { duration: 120, fill: 'forwards' }); });
        a.push(ls.animate({ transform: ['translateY(0)', 'translateY(-24px)'], clipPath: ['inset(0 0 0 0)', 'inset(100% 0 0 0)'] }, { duration: 200, delay: 100, easing: 'ease-in', fill: 'forwards' }),
          bar.animate({ transform: ['translateY(-3px)', 'translateY(0)'], opacity: [1, 0] }, { duration: 160, delay: 260, fill: 'forwards' }));
        return a;
      }
      function kill() { w.querySelectorAll('*').forEach(function (e) { e.getAnimations().forEach(function (a) { if (a.effect) a.cancel(); }); }); }
      function toggle() {
        on = !on; kill();
        if (on) { q.textContent = 'cam'; w.querySelectorAll('.pk').forEach(function (e) { e.classList.remove('pk'); }); w.classList.add('on'); if (!api.reduce) enter(); }
        else Promise.all((api.reduce ? [] : leave()).map(function (a) { return a.finished; })).then(function () { if (!on) w.classList.remove('on'); }, function () {});
      }
      function pick(li) { li.classList.add('pk'); q.textContent = li.textContent; T.push(setTimeout(toggle, 280)); }
      w.addEventListener('click', function (e) { T.forEach(clearTimeout); var li = e.target.closest('.li'); if (on && li) pick(li); else toggle(); });
      T.push(setTimeout(toggle, 600), setTimeout(function () { pick(rows[1]); }, 2100));
      return function () { T.forEach(clearTimeout); };
    }
  });
})();
