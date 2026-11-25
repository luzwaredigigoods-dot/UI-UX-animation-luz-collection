/* Menu · Part 2 — six menu open & close animations.
   Every demo: tap the trigger to open, tap again (or the X / backdrop) to close. Each autoplays one open at 600ms. */
(function () {
  var SRC = 'Menu · Part 2';
  var I = function (d) { return '<svg viewBox="0 0 24 24"><path d="' + d + '"/></svg>'; };
  var SVG = '& svg{fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}';
  // 3-line hamburger that turns into an X when its parent has .open
  var HB = '& .hb{position:relative;width:28px;height:28px;border:0;padding:0;background:none;color:inherit;cursor:pointer}' +
    '& .hb i{position:absolute;left:6px;top:13px;width:16px;height:2px;border-radius:2px;background:currentColor;transition:transform .3s,opacity .2s}' +
    '& .hb i:nth-child(1){transform:translateY(-5px)}& .hb i:nth-child(3){transform:translateY(5px)}' +
    '& .open .hb i:nth-child(1){transform:rotate(45deg)}& .open .hb i:nth-child(2){opacity:0}& .open .hb i:nth-child(3){transform:rotate(-45deg)}';
  LUZ.add({
    id: 'menu2-push-back',
    cat: 'Menu & Navigasi',
    name: 'Push Back',
    source: SRC,
    trigger: 'tap',
    motion: 'Halaman depan mundur: bergeser 120px ke kanan, mengecil ke 0.78, dan miring 3D (rotateY −14°), memperlihatkan menu di belakangnya. Item menu (Home, Explore, Library, Settings) masuk dari kiri 14px sambil memudar dengan stagger 40ms. Ikon ≡ berubah jadi X. Tutup membalik semuanya.',
    timing: 'halaman 420ms cubic-bezier(.3,.8,.3,1) · item 300ms, delay 80–200ms (stagger 40ms) · ikon 300ms',
    use: 'Menu navigasi utama aplikasi mobile yang ingin terasa berlapis, misalnya menu samping aplikasi klinik.',
    tags: 'menu push back reveal side drawer scale 3d page behind hamburger',
    html: '<div class="pb"><ul class="mn"><li>Home</li><li>Explore</li><li>Library</li><li>Settings</li></ul>' +
      '<div class="pg"><button class="hb" aria-label="Menu" aria-expanded="false"><i></i><i></i><i></i></button><span class="sk t"></span><span class="sk k"></span><span class="rw"><span class="sk"></span><span class="sk"></span><span class="sk"></span></span></div></div>',
    css: HB +
      '& .pb{position:relative;width:236px;height:176px;border-radius:16px;background:var(--d-soft);overflow:hidden;cursor:pointer}' +
      '& .mn{position:absolute;left:16px;top:24px;margin:0;padding:0;list-style:none;display:grid;gap:11px;font-size:13px;font-weight:600}' +
      '& .mn li{padding-left:9px;border-left:2px solid var(--d-mid);opacity:0;transform:translateX(-14px);transition:opacity .25s,transform .3s cubic-bezier(.3,.8,.3,1)}' +
      '& .mn li:first-child{border-color:var(--d-accent)}' +
      '& .open .mn li{opacity:1;transform:none}& .open .mn li:nth-child(1){transition-delay:.08s}& .open .mn li:nth-child(2){transition-delay:.12s}& .open .mn li:nth-child(3){transition-delay:.16s}& .open .mn li:nth-child(4){transition-delay:.2s}' +
      '& .pg{position:absolute;inset:0;padding:10px 12px;background:var(--d-bg);border-radius:16px;box-shadow:0 6px 20px rgba(0,0,0,.18);transform-origin:left center;transform:perspective(600px) translateX(0) scale(1) rotateY(0);transition:transform .42s cubic-bezier(.3,.8,.3,1)}' +
      '& .open .pg{transform:perspective(600px) translateX(120px) scale(.78) rotateY(-14deg)}' +
      '& .sk{display:block;border-radius:6px;background:var(--d-soft)}' +
      '& .t{position:absolute;left:84px;top:21px;width:70px;height:6px}& .k{height:46px;margin-top:12px}' +
      '& .rw{display:flex;gap:8px;margin-top:10px}& .rw .sk{flex:1;height:52px}',
    js: function (root) {
      var el = root.querySelector('.pb'), T = setTimeout(go, 600);
      function go() { el.querySelector('[aria-expanded]').setAttribute('aria-expanded', el.classList.toggle('open')); }
      el.addEventListener('click', function () { clearTimeout(T); go(); });
      return function () { clearTimeout(T); };
    }
  });

  LUZ.add({
    id: 'menu2-kebab-popover',
    cat: 'Menu & Navigasi',
    name: 'Kebab Popover',
    source: SRC,
    trigger: 'tap',
    motion: 'Tiga titik tombol ⋮ terbang keluar (masing-masing ke kiri-bawah 78px, turun 44/64/84px, stagger 40ms) dan menjadi ikon titik di depan tiap baris menu (Edit, Share, Delete). Bersamaan panel popover membesar dari pojok kanan-atas (scale 0.5→1) dan label baris muncul berurutan. Tutup: titik terbang kembali menjadi ⋮.',
    timing: 'titik 380ms cubic-bezier(.3,1.4,.5,1), stagger 40ms · panel 300ms ease-out · label 200ms delay 150/190/230ms',
    use: 'Menu aksi per item (lebih banyak/opsi), misalnya kartu pasien atau baris tabel dengan Edit, Bagikan, Hapus.',
    tags: 'menu kebab more dots popover overflow fly morph context menu',
    html: '<div class="kc"><div class="hd"><span class="av"></span><span class="ln"><i></i><i></i></span><button class="kb" aria-label="Opsi" aria-expanded="false"></button></div><div class="bd"></div>' +
      '<div class="pp"><span>Edit</span><span>Share</span><span>Delete</span></div><i class="kd"></i><i class="kd"></i><i class="kd"></i></div>',
    css: '& .kc{position:relative;width:232px;height:172px;cursor:pointer}' +
      '& .hd{height:44px;display:flex;align-items:center;gap:10px;padding:0 12px;border-radius:12px;background:var(--d-bg);border:1px solid var(--d-soft)}' +
      '& .av{width:24px;height:24px;border-radius:50%;background:var(--d-accent)}' +
      '& .ln{flex:1;display:grid;gap:5px}& .ln i{display:block;height:6px;width:70%;border-radius:3px;background:var(--d-soft)}& .ln i+i{width:45%}' +
      '& .kb{width:28px;height:28px;border:0;padding:0;background:none;cursor:pointer}' +
      '& .bd{height:112px;margin-top:8px;border-radius:12px;background:var(--d-bg);border:1px solid var(--d-soft)}' +
      '& .pp{position:absolute;right:8px;top:40px;width:116px;padding:6px;display:grid;border-radius:12px;background:var(--d-bg);border:1px solid var(--d-soft);box-shadow:0 8px 20px rgba(0,0,0,.16);transform-origin:top right;transform:scale(.5);opacity:0;transition:transform .3s ease-out,opacity .2s}' +
      '& .open .pp{transform:none;opacity:1}' +
      '& .pp span{height:26px;line-height:26px;padding-left:24px;font-size:12.5px;opacity:0;transition:opacity .12s}& .pp span:last-child{color:var(--d-accent)}' +
      '& .open .pp span{opacity:1;transition:opacity .2s .15s}& .open .pp span:nth-child(2){transition-delay:.19s}& .open .pp span:nth-child(3){transition-delay:.23s}' +
      '& .kd{position:absolute;left:202.5px;top:13.5px;width:5px;height:5px;border-radius:50%;background:var(--d-fg);pointer-events:none;transition:transform .38s cubic-bezier(.3,1.4,.5,1),background .3s}' +
      '& .kd:nth-of-type(2){top:19.5px;transition-delay:.04s}& .kd:nth-of-type(3){top:25.5px;transition-delay:.08s}' +
      '& .open .kd{background:var(--d-accent);transform:translate(-78px,44px)}& .open .kd:nth-of-type(2){transform:translate(-78px,64px)}& .open .kd:nth-of-type(3){transform:translate(-78px,84px)}',
    js: function (root) {
      var el = root.querySelector('.kc'), T = setTimeout(go, 600);
      function go() { el.querySelector('[aria-expanded]').setAttribute('aria-expanded', el.classList.toggle('open')); }
      el.addEventListener('click', function () { clearTimeout(T); go(); });
      return function () { clearTimeout(T); };
    }
  });

  LUZ.add({
    id: 'menu2-gooey-menu',
    cat: 'Menu & Navigasi',
    name: 'Gooey Menu',
    source: SRC,
    trigger: 'tap',
    motion: 'Empat tombol bulat 32px (kamera, galeri, bintang, kalender) memisah dari tombol utama 44px seperti tetesan: tiap tetes meregang (scale 1.5×0.7) saat lepas, meluncur ke kanan 52/92/132/172px, melewati posisi 4px lalu membulat. Stagger 50ms. Ikon ≡ jadi X. Tutup: tetesan meregang lagi dan tersedot kembali ke tombol utama, urutan terbalik.',
    timing: 'buka 480ms ease-out per tetes, stagger 50ms · tutup 320ms ease-in, stagger 40ms terbalik',
    use: 'Tombol aksi cepat (FAB) yang membuka beberapa pilihan, misalnya unggah foto, catatan, atau jadwal.',
    tags: 'menu gooey blob droplet fab speed dial split merge stretch',
    html: '<div class="gm"><button class="cb">' + I('M4 8h3l2-2h6l2 2h3v11H4zM12 16.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6') + '</button><button class="cb">' + I('M4 5h16v14H4zM4 15l5-5 5 5 2-2 4 4') + '</button>' +
      '<button class="cb">' + I('M12 4l2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.5-.8z') + '</button><button class="cb">' + I('M4 6h16v14H4zM4 10h16M8 3v5M16 3v5') + '</button>' +
      '<button class="mb hb" aria-label="Aksi cepat" aria-expanded="false"><i></i><i></i><i></i></button></div>',
    css: HB + SVG +
      '& .gm{position:relative;width:232px;height:60px}' +
      '& .mb{position:absolute;left:4px;top:8px;width:44px;height:44px;border-radius:50%;background:var(--d-accent);color:var(--d-bg);box-shadow:0 4px 12px rgba(0,0,0,.2)}& .mb i{left:14px;top:21px}' +
      '& .cb{position:absolute;left:10px;top:14px;width:32px;height:32px;border:0;padding:0;border-radius:50%;background:var(--d-accent);color:var(--d-bg);display:grid;place-items:center;cursor:pointer;opacity:0;transform:scale(.4);pointer-events:none}' +
      '& .open .cb{pointer-events:auto}& .cb svg{width:15px;height:15px}',
    js: function (root, api) {
      var gm = root.querySelector('.gm'), mb = gm.querySelector('.mb'), cb = gm.querySelectorAll('.cb'), T;
      function go() {
        var open = gm.classList.toggle('open'); mb.setAttribute('aria-expanded', open);
        cb.forEach(function (c, i) {
          var x = 52 + 40 * i, from = getComputedStyle(c).transform, op = getComputedStyle(c).opacity;
          c.getAnimations().forEach(function (a) { a.cancel(); });
          c.style.transform = open ? 'translateX(' + x + 'px)' : 'scale(.4)'; c.style.opacity = open ? 1 : 0;
          if (api.reduce) return;
          c.animate(open
            ? [{ transform: from, opacity: op }, { transform: 'translateX(' + x * 0.6 + 'px) scale(1.5,.7)', opacity: 1, offset: 0.45 }, { transform: 'translateX(' + (x + 4) + 'px) scale(.9,1.1)', offset: 0.75 }, { transform: 'translateX(' + x + 'px)', opacity: 1 }]
            : [{ transform: from, opacity: op }, { transform: 'translateX(' + x * 0.4 + 'px) scale(1.4,.7)', opacity: 1, offset: 0.6 }, { transform: 'scale(.4)', opacity: 0 }],
            { duration: open ? 480 : 320, delay: (open ? i : 3 - i) * (open ? 50 : 40), easing: open ? 'ease-out' : 'ease-in', fill: 'backwards' });
        });
      }
      mb.addEventListener('click', function () { clearTimeout(T); go(); });
      T = setTimeout(go, 600);
      return function () { clearTimeout(T); };
    }
  });

  LUZ.add({
    id: 'menu2-fold-down',
    cat: 'Menu & Navigasi',
    name: 'Fold Down',
    source: SRC,
    trigger: 'tap',
    motion: 'Baris-baris dropdown (Design, Motion, Code, Sound) terlipat terbuka satu per satu seperti kertas: tiap baris berputar dari rotateX(−90°) ke 0 dengan engsel di tepi atas, stagger 70ms, sementara wadah daftar membuka dari atas ke bawah (clip-path) seolah mendorong baris berikutnya. Chevron berputar 180°. Tutup: baris terlipat kembali dari bawah ke atas.',
    timing: 'tiap baris 300ms ease-out, stagger 70ms (total ≈510ms) · tutup stagger 50ms terbalik · chevron 300ms',
    use: 'Dropdown filter atau kategori, misalnya pilih poli, kategori obat, atau jenis laporan.',
    tags: 'menu dropdown fold unfold paper rotateX stagger accordion select',
    html: '<div class="fd"><button class="fh" aria-expanded="false">Categories' + I('M6 9l6 6 6-6') + '</button><div class="fl">' +
      ['Design', 'Motion', 'Code', 'Sound'].map(function (n) { return '<div class="fr"><i></i>' + n + '<b></b></div>'; }).join('') + '</div></div>',
    css: SVG +
      '& .fd{width:190px;height:170px}' +
      '& .fh{width:100%;height:36px;display:flex;align-items:center;justify-content:space-between;padding:0 12px;border-radius:10px;border:1px solid var(--d-soft);background:var(--d-bg);font-weight:700;font-size:13px;cursor:pointer}' +
      '& .fh svg{width:16px;height:16px;transition:transform .3s}& .open .fh{border-color:var(--d-accent)}& .open .fh svg{transform:rotate(180deg)}' +
      '& .fl{margin:4px 6px 0;perspective:400px;clip-path:inset(0 0 100% 0);transition:clip-path .4s ease-in .1s}& .open .fl{clip-path:inset(0 0 -4px 0);transition:clip-path .5s ease-out}' +
      '& .fr{height:28px;display:flex;align-items:center;gap:9px;padding:0 10px;font-size:12.5px;background:var(--d-bg);border-bottom:1px solid var(--d-soft);transform-origin:top;transform:rotateX(-90deg);opacity:0;transition:transform .3s ease-out,opacity .3s}' +
      '& .fr i{width:8px;height:8px;border-radius:2px;background:var(--d-accent)}& .fr:nth-child(2) i{opacity:.75}& .fr:nth-child(3) i{opacity:.5}& .fr:nth-child(4) i{opacity:.3}' +
      '& .fr b{margin-left:auto;width:16px;height:4px;border-radius:2px;background:var(--d-soft)}' +
      '& .fr:nth-child(1){transition-delay:.15s}& .fr:nth-child(2){transition-delay:.1s}& .fr:nth-child(3){transition-delay:.05s}' +
      '& .open .fr{transform:none;opacity:1}& .open .fr:nth-child(1){transition-delay:0s}& .open .fr:nth-child(2){transition-delay:.07s}& .open .fr:nth-child(3){transition-delay:.14s}& .open .fr:nth-child(4){transition-delay:.21s}',
    js: function (root) {
      var fd = root.querySelector('.fd'), fh = fd.querySelector('.fh'), T = setTimeout(go, 600);
      function go() { fh.setAttribute('aria-expanded', fd.classList.toggle('open')); }
      fh.addEventListener('click', function () { clearTimeout(T); go(); });
      return function () { clearTimeout(T); };
    }
  });

  LUZ.add({
    id: 'menu2-button-to-panel',
    cat: 'Menu & Navigasi',
    name: 'Button to Panel',
    source: SRC,
    trigger: 'tap',
    motion: 'Tombol pil "+ New" (76×32px) di pojok kanan-bawah tumbuh menjadi panel 200×150px: clip-path membuka dari pojok itu ke seluruh panel, warna aksen tombol memudar menjadi permukaan panel. Judul "Create" dan pilihan Note, Photo, Event muncul naik 6px berurutan. X menyusutkan panel kembali menjadi tombol.',
    timing: 'tumbuh 420ms cubic-bezier(.3,1.15,.4,1) (overshoot kecil) · isi 200ms delay 180/230/280ms · susut 350ms',
    use: 'Tombol buat-baru yang membuka pilihan jenis, misalnya buat catatan, unggah foto pemeriksaan, atau jadwal kontrol.',
    tags: 'menu button morph expand panel container transform fab create clip-path',
    html: '<div class="bw"><div class="bp"><i class="bb"></i><i class="ba"></i><div class="pc"><b>Create</b><button class="x" aria-label="Tutup">' + I('M6 6l12 12M18 6L6 18') + '</button>' +
      '<span>' + I('M4 20l4-1 11-11-3-3L5 16z') + 'Note</span><span>' + I('M4 5h16v14H4zM4 15l5-5 5 5 2-2 4 4') + 'Photo</span><span>' + I('M4 6h16v14H4zM4 10h16M8 3v5M16 3v5') + 'Event</span></div>' +
      '<span class="nw">+ New</span></div></div>',
    css: SVG +
      '& .bw{position:relative;width:200px;height:150px}' +
      '& .bp{position:absolute;inset:0;border-radius:16px;cursor:pointer;clip-path:inset(118px 0 0 124px round 16px);transition:clip-path .35s ease-in-out}' +
      '& .open .bp{clip-path:inset(0 0 0 0 round 16px);transition:clip-path .42s cubic-bezier(.3,1.15,.4,1);cursor:default}' +
      '& .bb{position:absolute;inset:0;border-radius:16px;background:var(--d-bg);box-shadow:inset 0 0 0 1px var(--d-soft)}' +
      '& .ba{position:absolute;inset:0;background:var(--d-accent);transition:opacity .3s}& .open .ba{opacity:0}' +
      '& .nw{position:absolute;right:0;bottom:0;width:76px;height:32px;display:grid;place-items:center;font-weight:700;font-size:13px;color:var(--d-bg);transition:opacity .2s .15s}& .open .nw{opacity:0;transition:opacity .1s}' +
      '& .pc{position:absolute;inset:0;padding:12px 14px;display:grid;grid-template-columns:1fr auto;align-content:start;gap:6px}' +
      '& .pc b{font-size:14px;line-height:24px}& .x{width:24px;height:24px;border:0;padding:3px;background:none;color:var(--d-mid);cursor:pointer}' +
      '& .pc span{grid-column:1/-1;display:flex;align-items:center;gap:8px;height:26px;padding:0 8px;border-radius:7px;background:var(--d-soft);font-size:12.5px}& .pc span svg{width:13px;height:13px;color:var(--d-accent)}' +
      '& .pc>*{opacity:0;transform:translateY(6px);transition:opacity .1s,transform .1s}' +
      '& .open .pc>*{opacity:1;transform:none;transition:opacity .2s .18s,transform .25s .18s}& .open .pc span:nth-of-type(2){transition-delay:.23s}& .open .pc span:nth-of-type(3){transition-delay:.28s}',
    js: function (root) {
      var bw = root.querySelector('.bw'), T = setTimeout(function () { bw.classList.add('open'); }, 600);
      bw.addEventListener('click', function (e) {
        clearTimeout(T);
        if (!bw.classList.contains('open')) bw.classList.add('open');
        else if (e.target.closest('.x')) bw.classList.remove('open');
      });
      return function () { clearTimeout(T); };
    }
  });

  LUZ.add({
    id: 'menu2-command-palette',
    cat: 'Menu & Navigasi',
    name: 'Command Palette',
    source: SRC,
    trigger: 'tap',
    motion: 'Ketuk ikon cari: latar halaman meredup, palet perintah jatuh dari 14px di atas (scale 0.96→1) dengan pegas kecil. Kueri "set" mengetik sendiri satu huruf per 110ms dengan kursor berkedip, lalu hasil (Settings, Set status, Setup guide) masuk naik 6px berurutan dengan stagger 60ms; baris pertama tersorot. Ketuk lagi untuk menutup (palet memudar ke atas).',
    timing: 'palet 280ms cubic-bezier(.3,1.3,.5,1) · ketik 3×110ms · hasil 220ms, stagger 60ms · tutup 200ms',
    use: 'Pencarian cepat/perintah di dashboard atau aplikasi web (⌘K), misalnya cari pasien, menu, atau pengaturan.',
    tags: 'menu command palette search spotlight cmdk typing stagger results dropdown',
    html: '<div class="cp"><div class="tb"><span class="sk"></span><button class="sb" aria-label="Cari" aria-expanded="false">' + I('M11 17a6 6 0 1 0 0-12 6 6 0 0 0 0 12M16 16l4 4') + '</button></div>' +
      '<span class="sk k"></span><span class="rw"><span class="sk"></span><span class="sk"></span><span class="sk"></span></span><i class="ov"></i>' +
      '<div class="pl"><div class="q">' + I('M11 17a6 6 0 1 0 0-12 6 6 0 0 0 0 12M16 16l4 4') + '<span class="tx"></span><i class="ct"></i><kbd>⌘K</kbd></div>' +
      '<div class="r"><b>Set</b>tings</div><div class="r"><b>Set</b> status</div><div class="r"><b>Set</b>up guide</div></div></div>',
    css: SVG +
      '& .cp{position:relative;width:236px;height:178px;padding:10px 12px;border-radius:14px;background:var(--d-bg);border:1px solid var(--d-soft);overflow:hidden;cursor:pointer}' +
      '& .tb{display:flex;align-items:center;justify-content:center;height:26px}& .tb .sk{width:60px;height:6px}' +
      '& .sb{position:absolute;right:8px;top:9px;width:28px;height:28px;border:0;padding:5px;background:none;cursor:pointer}' +
      '& .sk{display:block;border-radius:6px;background:var(--d-soft)}& .k{height:40px;margin-top:10px}& .rw{display:flex;gap:8px;margin-top:10px}& .rw .sk{flex:1;height:60px}' +
      '& .ov{position:absolute;inset:0;background:rgba(0,0,0,.28);opacity:0;transition:opacity .25s}& .open .ov{opacity:1}' +
      '& .pl{position:absolute;left:10px;right:10px;top:12px;padding:6px;border-radius:12px;background:var(--d-bg);border:1px solid var(--d-soft);box-shadow:0 10px 24px rgba(0,0,0,.22);opacity:0;transform:translateY(-14px) scale(.96);transition:opacity .2s,transform .2s ease-in}' +
      '& .open .pl{opacity:1;transform:none;transition:opacity .2s,transform .28s cubic-bezier(.3,1.3,.5,1)}' +
      '& .q{display:flex;align-items:center;gap:6px;height:28px;padding:0 6px;font-size:13px;border-bottom:1px solid var(--d-soft);margin-bottom:4px}& .q svg{width:13px;height:13px;color:var(--d-mid)}' +
      '& .ct{width:1.5px;height:14px;background:var(--d-accent);animation:menu2blink 1s steps(1) infinite}& kbd{margin-left:auto;font:10px/1 inherit;color:var(--d-mid);padding:3px 4px;border-radius:4px;background:var(--d-soft)}' +
      '& .r{height:24px;line-height:24px;padding:0 8px 0 22px;border-radius:6px;font-size:12px;position:relative;opacity:0;transform:translateY(6px);transition:opacity .22s,transform .22s}' +
      '& .r::before{content:"";position:absolute;left:8px;top:8px;width:8px;height:8px;border-radius:2px;background:var(--d-accent)}& .r:first-of-type{background:var(--d-soft)}' +
      '& .r.on{opacity:1;transform:none}' +
      '@keyframes menu2blink{50%{opacity:0}}',
    js: function (root, api) {
      var cp = root.querySelector('.cp'), tx = cp.querySelector('.tx'), rs = cp.querySelectorAll('.r'), T = [];
      function go() {
        T.forEach(clearTimeout); T = [];
        var open = cp.classList.toggle('open'); cp.querySelector('.sb').setAttribute('aria-expanded', open);
        if (!open) { rs.forEach(function (r) { r.classList.remove('on'); }); T.push(setTimeout(function () { tx.textContent = ''; }, 200)); return; }
        var step = api.reduce ? 0 : 1;
        'set'.split('').forEach(function (c, i) { T.push(setTimeout(function () { tx.textContent = 'set'.slice(0, i + 1); }, step * (300 + i * 110))); });
        rs.forEach(function (r, i) { T.push(setTimeout(function () { r.classList.add('on'); }, step * (660 + i * 60))); });
      }
      cp.addEventListener('click', go);
      T.push(setTimeout(go, 600));
      return function () { T.forEach(clearTimeout); };
    }
  });
})();
