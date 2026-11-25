/* Menu · Part 6 — the six classic menus on one minimal screen (light, outlined). */
(function () {
  var SRC = 'Menu · Part 6';
  var HEAD = '<div class="hd"><span class="ttl">HOME</span><button class="hb" type="button" aria-label="Menu" aria-expanded="false"><i></i><i></i><i></i></button></div>' +
    '<div class="body"><p><i></i><b></b></p><p><i></i><b></b></p><p><i></i><b></b></p></div>';
  var ICO = {
    home: '<svg viewBox="0 0 14 14"><path d="M2.5 6.5 7 2.8l4.5 3.7V11.5h-9z"/></svg>',
    explore: '<svg viewBox="0 0 14 14"><circle cx="7" cy="7" r="4.6"/><circle cx="7" cy="7" r="1.2"/></svg>',
    library: '<svg viewBox="0 0 14 14"><path d="M4.5 3.5v7M7 3.5v7M9.5 3.5v7"/></svg>'
  };
  var BASE =
    '& .scr{position:relative;width:236px;height:176px;border-radius:12px;background:var(--d-bg);border:1px solid var(--d-soft);overflow:hidden;color:var(--d-fg)}' +
    '& .hd{display:flex;justify-content:space-between;align-items:center;height:44px;padding:0 10px 0 14px;border-bottom:1px solid var(--d-soft)}' +
    '& .ttl{font-size:10px;font-weight:600;letter-spacing:.22em}' +
    '& .hb{position:relative;z-index:6;width:28px;height:28px;padding:0;border-radius:50%;border:1px solid var(--d-fg);background:var(--d-bg);cursor:pointer}' +
    '& .hb::before{content:"";position:absolute;inset:-8px}' +
    '& .hb i{position:absolute;left:8px;width:10px;height:1.5px;border-radius:1px;background:var(--d-fg)}' +
    '& .hb i:nth-child(1){top:8.5px}& .hb i:nth-child(2){top:12.25px}& .hb i:nth-child(3){top:16px}' +
    '& .body{padding:16px 14px;display:grid;gap:13px;transition:opacity .3s}' +
    '& .body p{margin:0;display:flex;align-items:center;gap:6px}' +
    '& .body p i{width:3px;height:3px;border-radius:50%;background:var(--d-mid)}' +
    '& .body p b{height:1.5px;width:150px;background:var(--d-soft)}& .body p:nth-child(2) b{width:116px}& .body p:nth-child(3) b{width:136px}' +
    '& .open .body{opacity:.3}' +
    '& .it{position:relative;display:flex;align-items:center;gap:6px;padding:2px 0;border:0;background:none;color:var(--d-mid);font:inherit;font-size:8.5px;font-weight:600;letter-spacing:.14em;cursor:pointer;text-align:left}' +
    '& .it.on{color:var(--d-fg)}' +
    '& svg{width:12px;height:12px;fill:none;stroke:currentColor;stroke-width:1.2}';
  // hamburger -> × in one step (used by cells that swap the icon)
  var XICON =
    '& .hb i{transition:transform .2s ease,opacity .15s}' +
    '& .open .hb i:nth-child(1){transform:translateY(3.75px) rotate(45deg)}& .open .hb i:nth-child(2){opacity:0}& .open .hb i:nth-child(3){transform:translateY(-3.75px) rotate(-45deg)}';
  // shared behaviour: open/close + pick an item, title crossfades to the picked label
  function base(extra) { return BASE + extra; }

  LUZ.add({
    id: 'menu-hamburger-morph',
    cat: 'Menu & Navigasi',
    name: 'Hamburger Morph',
    source: SRC,
    trigger: 'tap',
    motion: 'Dua tahap ikon: tiga garis menyatu ke garis tengah (“−”, 150ms) lalu berputar menjadi X (200ms); saat menutup urutannya dibalik. Garis pemisah vertikal tergambar dari atas, lalu HOME/EXPLORE/LIBRARY muncul bergiliran atas→bawah (fade + geser 6px, jeda 60ms) sementara konten meredup.',
    timing: 'ikon 150ms + 200ms · garis 250ms · item 200ms stagger 60ms',
    use: 'Menu utama aplikasi mobile/web responsif di header.',
    tags: 'hamburger morph x icon menu stagger nav',
    html: '<div class="scr">' + HEAD + '<nav class="nav"><button class="it on" type="button">HOME</button><button class="it" type="button">EXPLORE</button><button class="it" type="button">LIBRARY</button></nav></div>',
    css: base(
      '& .hb i{transition:translate .15s ease .2s,rotate .2s ease,opacity 0s .2s}' +
      '& .open .hb i{transition:translate .15s ease,rotate .2s ease .15s,opacity 0s .15s}' +
      '& .open .hb i:nth-child(1){translate:0 3.75px;rotate:45deg}& .open .hb i:nth-child(2){opacity:0}& .open .hb i:nth-child(3){translate:0 -3.75px;rotate:-45deg}' +
      '& .nav{position:absolute;left:120px;top:60px;padding-left:12px;display:grid;gap:9px;pointer-events:none}' +
      '& .nav::before{content:"";position:absolute;left:0;top:-6px;bottom:-6px;width:1px;background:var(--d-fg);transform:scaleY(0);transform-origin:top;transition:transform .25s ease}' +
      '& .open .nav{pointer-events:auto}& .open .nav::before{transform:scaleY(1)}' +
      '& .nav .it{opacity:0;transform:translateX(6px);transition:opacity .2s,transform .2s}' +
      '& .nav .it::before{content:"";width:4px;height:4px;border-radius:50%;background:currentColor}' +
      '& .open .nav .it{opacity:1;transform:none}' +
      '& .open .nav .it:nth-child(1){transition-delay:.12s}& .open .nav .it:nth-child(2){transition-delay:.18s}& .open .nav .it:nth-child(3){transition-delay:.24s}'),
    js: function (root) {
      var scr = root.querySelector('.scr'), hb = root.querySelector('.hb'), ttl = root.querySelector('.ttl'), its = root.querySelectorAll('.it'), open = false;
      function set(o) { open = o; scr.classList.toggle('open', o); hb.setAttribute('aria-expanded', o); }
      function pick(i) {
        its.forEach(function (x, j) { x.classList.toggle('on', j === i); }); set(false);
        ttl.animate([{ opacity: 1 }, { opacity: 0 }], 150).onfinish = function () { ttl.textContent = its[i].textContent; ttl.animate([{ opacity: 0 }, { opacity: 1 }], 200); };
      }
      hb.onclick = function () { set(!open); };
      its.forEach(function (x, i) { x.onclick = function () { pick(i); }; });
      var t = [setTimeout(function () { set(true); }, 600), setTimeout(function () { pick(2); }, 1900)];
      return function () { t.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'menu-side-drawer',
    cat: 'Menu & Navigasi',
    name: 'Side Drawer',
    source: SRC,
    trigger: 'tap',
    motion: 'Panel selebar ±46% meluncur masuk dari kiri (translateX −100%→0) dengan garis tepi kanan tebal 2px; isinya avatar + daftar HOME/EXPLORE/LIBRARY, item aktif bertitik. Konten di belakang meredup. Memilih item menutup laci kembali ke kiri.',
    timing: 'buka 350ms ease-out (cubic-bezier .2,.8,.2,1) · tutup 300ms ease-in',
    use: 'Navigasi samping aplikasi dengan banyak bagian, misalnya modul EMR (pasien, jadwal, laporan).',
    tags: 'side drawer off-canvas navigation slide panel',
    html: '<div class="scr">' + HEAD + '<aside class="drw"><div class="av"><i></i><b></b></div><button class="it on" type="button">HOME</button><button class="it" type="button">EXPLORE</button><button class="it" type="button">LIBRARY</button></aside></div>',
    css: base(
      '& .drw{position:absolute;left:0;top:0;bottom:0;z-index:4;width:46%;padding:14px 12px;display:grid;align-content:start;gap:9px;background:var(--d-bg);border-right:2px solid var(--d-fg);transform:translateX(-102%);transition:transform .3s cubic-bezier(.4,0,1,1)}' +
      '& .open .drw{transform:none;transition:transform .35s cubic-bezier(.2,.8,.2,1)}' +
      '& .av{display:flex;align-items:center;gap:6px;margin-bottom:8px}& .av i{width:12px;height:12px;border-radius:50%;border:1px solid var(--d-mid)}& .av b{width:40px;height:1.5px;background:var(--d-soft)}' +
      '& .drw .it::before{content:"";width:4px;height:4px;border-radius:50%;background:currentColor}'),
    js: function (root) {
      var scr = root.querySelector('.scr'), hb = root.querySelector('.hb'), ttl = root.querySelector('.ttl'), its = root.querySelectorAll('.it'), open = false;
      function set(o) { open = o; scr.classList.toggle('open', o); hb.setAttribute('aria-expanded', o); }
      function pick(i) {
        its.forEach(function (x, j) { x.classList.toggle('on', j === i); }); set(false);
        ttl.animate([{ opacity: 1 }, { opacity: 0 }], 150).onfinish = function () { ttl.textContent = its[i].textContent; ttl.animate([{ opacity: 0 }, { opacity: 1 }], 200); };
      }
      hb.onclick = function () { set(!open); };
      its.forEach(function (x, i) { x.onclick = function () { pick(i); }; });
      var t = [setTimeout(function () { set(true); }, 600), setTimeout(function () { pick(2); }, 1900)];
      return function () { t.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'menu-fab-fan',
    cat: 'Menu & Navigasi',
    name: 'FAB Fan',
    source: SRC,
    trigger: 'tap',
    motion: 'Tiga tombol ikon bulat keluar dari tombol menu dan menyebar diagonal ke kiri-bawah (HOME paling jauh, EXPLORE tengah, LIBRARY terdekat), dihubungkan garis tipis yang tergambar. Tiap tombol tumbuh dari scale 0 dengan pegas, bergiliran 50ms; ikon menu menjadi ×. Item terpilih terisi hitam, lalu semua kembali masuk ke tombol dengan urutan terbalik.',
    timing: 'buka 300ms pegas (cubic-bezier .34,1.56,.64,1) stagger 50ms · tutup 200ms ease-in',
    use: 'Aksi cepat dari tombol mengambang, misalnya tambah pasien / jadwal / catatan.',
    tags: 'fab speed dial fan radial menu stagger spring',
    html: '<div class="scr">' + HEAD +
      '<svg class="ln" viewBox="0 0 236 176"><polyline pathLength="1" points="146,50 172,84 212,102"/></svg>' +
      '<button class="it fi on" type="button" style="--x:-66px;--y:28px" aria-label="Home">' + ICO.home + '<span>HOME</span></button>' +
      '<button class="it fi" type="button" style="--x:-40px;--y:62px" aria-label="Explore">' + ICO.explore + '<span>EXPLORE</span></button>' +
      '<button class="it fi" type="button" style="--x:0px;--y:80px" aria-label="Library">' + ICO.library + '<span>LIBRARY</span></button></div>',
    css: base(XICON +
      '& .ln{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}' +
      '& .ln polyline{fill:none;stroke:var(--d-mid);stroke-width:.8;stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset .2s}' +
      '& .open .ln polyline{stroke-dashoffset:0;transition:stroke-dashoffset .3s .12s}' +
      '& .fi{position:absolute;left:200px;top:10px;z-index:4;width:24px;height:24px;padding:0;justify-content:center;border-radius:50%;border:1px solid var(--d-fg);background:var(--d-bg);color:var(--d-fg);opacity:0;transform:scale(0);pointer-events:none;transition:transform .2s cubic-bezier(.4,0,1,1),opacity .2s,background .2s,color .2s}' +
      '& .fi span{position:absolute;top:27px;left:50%;transform:translateX(-50%);font-size:6.5px;color:var(--d-mid)}' +
      '& .fi.on{background:var(--d-fg);color:var(--d-bg)}& .fi.on span{color:var(--d-fg)}' +
      '& .open .fi{opacity:1;transform:translate(var(--x),var(--y)) scale(1);pointer-events:auto;transition:transform .3s cubic-bezier(.34,1.56,.64,1),opacity .15s,background .2s,color .2s}' +
      '& .open .fi:nth-of-type(2){transition-delay:.05s}& .open .fi:nth-of-type(3){transition-delay:.1s}& .fi:nth-of-type(1){transition-delay:.1s}& .fi:nth-of-type(2){transition-delay:.05s}' +
      '& .open .fi:nth-of-type(1){transition-delay:0s}'),
    js: function (root) {
      var scr = root.querySelector('.scr'), hb = root.querySelector('.hb'), ttl = root.querySelector('.ttl'), its = root.querySelectorAll('.it'), open = false;
      function set(o) { open = o; scr.classList.toggle('open', o); hb.setAttribute('aria-expanded', o); }
      function pick(i) {
        its.forEach(function (x, j) { x.classList.toggle('on', j === i); });
        ttl.animate([{ opacity: 1 }, { opacity: 0 }], 150).onfinish = function () { ttl.textContent = its[i].textContent; ttl.animate([{ opacity: 0 }, { opacity: 1 }], 200); };
        t.push(setTimeout(function () { set(false); }, 350)); // show the filled state briefly
      }
      hb.onclick = function () { set(!open); };
      its.forEach(function (x, i) { x.onclick = function () { pick(i); }; });
      var t = [setTimeout(function () { set(true); }, 600), setTimeout(function () { pick(2); }, 1700)];
      return function () { t.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'menu-bottom-sheet',
    cat: 'Modal, Sheet & Tooltip',
    name: 'Bottom Sheet',
    source: SRC,
    trigger: 'tap',
    motion: 'Lembar bawah setinggi ±62% naik dari tepi bawah dengan tepi atas melengkung bergaris 2px dan pegangan kecil, lalu sedikit mengendap. Isinya tiga tab ikon (HOME/EXPLORE/LIBRARY); ikon yang diketuk terisi hitam, kemudian lembar turun lagi.',
    timing: 'naik 380ms ease-out dengan overshoot kecil (cubic-bezier .2,.9,.25,1.08) · turun 280ms ease-in',
    use: 'Menu aksi atau navigasi di layar ponsel yang mudah dijangkau jempol.',
    tags: 'bottom sheet drawer slide up handle tabs mobile',
    html: '<div class="scr">' + HEAD + '<div class="sh">' +
      '<button class="it on" type="button"><b>' + ICO.home + '</b>HOME</button>' +
      '<button class="it" type="button"><b>' + ICO.explore + '</b>EXPLORE</button>' +
      '<button class="it" type="button"><b>' + ICO.library + '</b>LIBRARY</button></div></div>',
    css: base(
      '& .sh{position:absolute;left:0;right:0;bottom:0;z-index:4;height:62%;display:grid;grid-template-columns:repeat(3,1fr);align-items:center;padding:16px 14px 8px;background:var(--d-bg);border-top:2px solid var(--d-fg);border-radius:16px 16px 0 0;transform:translateY(102%);transition:transform .28s cubic-bezier(.4,0,1,1)}' +
      '& .open .sh{transform:none;transition:transform .38s cubic-bezier(.2,.9,.25,1.08)}' +
      '& .sh::before{content:"";position:absolute;top:7px;left:50%;width:22px;height:2px;margin-left:-11px;border-radius:2px;background:var(--d-mid)}' +
      '& .sh .it{flex-direction:column;gap:6px;font-size:6.5px}' +
      '& .sh .it b{display:grid;place-items:center;width:28px;height:28px;border-radius:50%;border:1px solid var(--d-fg);color:var(--d-fg);transition:background .2s,color .2s}' +
      '& .sh .it.on b{background:var(--d-fg);color:var(--d-bg)}'),
    js: function (root) {
      var scr = root.querySelector('.scr'), hb = root.querySelector('.hb'), ttl = root.querySelector('.ttl'), its = root.querySelectorAll('.it'), open = false;
      function set(o) { open = o; scr.classList.toggle('open', o); hb.setAttribute('aria-expanded', o); }
      function pick(i) {
        its.forEach(function (x, j) { x.classList.toggle('on', j === i); });
        ttl.animate([{ opacity: 1 }, { opacity: 0 }], 150).onfinish = function () { ttl.textContent = its[i].textContent; ttl.animate([{ opacity: 0 }, { opacity: 1 }], 200); };
        t.push(setTimeout(function () { set(false); }, 350));
      }
      hb.onclick = function () { set(!open); };
      its.forEach(function (x, i) { x.onclick = function () { pick(i); }; });
      var t = [setTimeout(function () { set(true); }, 600), setTimeout(function () { pick(2); }, 1700)];
      return function () { t.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'menu-staggered-dropdown',
    cat: 'Menu & Navigasi',
    name: 'Staggered Dropdown',
    source: SRC,
    trigger: 'tap',
    motion: 'Kartu berbingkai jatuh di bawah tombol (fade + translateY −6px→0). Item muncul satu per satu atas→bawah (HOME, EXPLORE, LIBRARY, jeda ±90ms, fade + turun 4px); bilah vertikal pendek menandai item aktif. Saat menutup, item memudar terbalik (bawah dulu) lalu kartunya hilang.',
    timing: 'kartu 200ms · item 150ms stagger 90ms · tutup terbalik, kartu menyusul 270ms',
    use: 'Dropdown akun/profil atau menu filter di header desktop.',
    tags: 'dropdown stagger menu reverse close list',
    html: '<div class="scr">' + HEAD + '<div class="dd"><button class="it on" type="button">HOME</button><button class="it" type="button">EXPLORE</button><button class="it" type="button">LIBRARY</button></div></div>',
    css: base(
      '& .dd{position:absolute;right:10px;top:50px;z-index:4;width:100px;padding:10px 10px 10px 16px;display:grid;gap:8px;background:var(--d-bg);border:1px solid var(--d-mid);border-radius:8px;opacity:0;transform:translateY(-6px);pointer-events:none;transition:opacity .2s .27s,transform .2s .27s}' +
      '& .open .dd{opacity:1;transform:none;pointer-events:auto;transition:opacity .2s,transform .2s}' +
      '& .dd .it{opacity:0;transform:translateY(-4px);transition:opacity .15s,transform .15s,color .2s}' +
      '& .dd .it::before{content:"";width:3px;height:3px;border-radius:50%;background:currentColor}' +
      '& .dd .it::after{content:"";position:absolute;left:-9px;top:1px;bottom:1px;width:2px;background:var(--d-fg);transform:scaleY(0);transition:transform .2s}' +
      '& .dd .it.on::after{transform:scaleY(1)}' +
      '& .open .dd .it{opacity:1;transform:none}' +
      '& .dd .it:nth-child(1){transition-delay:.18s}& .dd .it:nth-child(2){transition-delay:.09s}& .dd .it:nth-child(3){transition-delay:0s}' +
      '& .open .dd .it:nth-child(1){transition-delay:.08s}& .open .dd .it:nth-child(2){transition-delay:.17s}& .open .dd .it:nth-child(3){transition-delay:.26s}'),
    js: function (root) {
      var scr = root.querySelector('.scr'), hb = root.querySelector('.hb'), ttl = root.querySelector('.ttl'), its = root.querySelectorAll('.it'), open = false;
      function set(o) { open = o; scr.classList.toggle('open', o); hb.setAttribute('aria-expanded', o); }
      function pick(i) {
        its.forEach(function (x, j) { x.classList.toggle('on', j === i); });
        ttl.animate([{ opacity: 1 }, { opacity: 0 }], 150).onfinish = function () { ttl.textContent = its[i].textContent; ttl.animate([{ opacity: 0 }, { opacity: 1 }], 200); };
        t.push(setTimeout(function () { set(false); }, 300));
      }
      hb.onclick = function () { set(!open); };
      its.forEach(function (x, i) { x.onclick = function () { pick(i); }; });
      var t = [setTimeout(function () { set(true); }, 600), setTimeout(function () { pick(2); }, 1800)];
      return function () { t.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'menu-circle-reveal',
    cat: 'Menu & Navigasi',
    name: 'Circle Reveal',
    source: SRC,
    trigger: 'tap',
    motion: 'Lapisan menu penuh terbuka lewat lingkaran yang membesar dari pusat tombol (clip-path circle 0→300px); tepi lingkaran tampak sebagai busur garis tipis yang menyapu ke kiri. Isinya daftar besar bertipe tipis HOME/EXPLORE/LIBRARY, item aktif bergaris bawah. Memilih item menyusutkan lingkaran kembali ke tombol.',
    timing: '500ms · ease-in-out (cubic-bezier .65,0,.35,1), tutup dengan kurva sama',
    use: 'Menu layar penuh untuk situs portofolio/landing atau aplikasi dengan sedikit tujuan utama.',
    tags: 'circle reveal clip-path fullscreen menu overlay expand',
    html: '<div class="scr">' + HEAD + '<i class="ring"></i><div class="ov"><button class="it on" type="button">HOME</button><button class="it" type="button">EXPLORE</button><button class="it" type="button">LIBRARY</button></div></div>',
    css: base(XICON +
      '& .ov{position:absolute;inset:0;z-index:4;padding:40px 22px 0;display:grid;align-content:start;gap:4px;background:var(--d-bg);clip-path:circle(0px at 210px 22px);transition:clip-path .5s cubic-bezier(.65,0,.35,1)}' +
      '& .open .ov{clip-path:circle(300px at 210px 22px)}' +
      '& .ring{position:absolute;left:210px;top:22px;z-index:5;width:600px;height:600px;margin:-300px;border-radius:50%;border:1.5px solid var(--d-fg);transform:scale(0);pointer-events:none;transition:transform .5s cubic-bezier(.65,0,.35,1)}' +
      '& .open .ring{transform:scale(1)}' +
      '& .ov .it{justify-self:start;font-size:21px;font-weight:300;letter-spacing:.04em;border-bottom:1.5px solid transparent;padding:0}' +
      '& .ov .it.on{border-bottom-color:var(--d-fg)}'),
    js: function (root) {
      var scr = root.querySelector('.scr'), hb = root.querySelector('.hb'), ttl = root.querySelector('.ttl'), its = root.querySelectorAll('.it'), open = false;
      function set(o) { open = o; scr.classList.toggle('open', o); hb.setAttribute('aria-expanded', o); }
      function pick(i) {
        its.forEach(function (x, j) { x.classList.toggle('on', j === i); });
        ttl.textContent = its[i].textContent;
        t.push(setTimeout(function () { set(false); }, 300));
      }
      hb.onclick = function () { set(!open); };
      its.forEach(function (x, i) { x.onclick = function () { pick(i); }; });
      var t = [setTimeout(function () { set(true); }, 600), setTimeout(function () { pick(2); }, 1900)];
      return function () { t.forEach(clearTimeout); };
    }
  });
})();
