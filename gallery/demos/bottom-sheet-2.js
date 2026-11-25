/* Bottom Sheet · Part 2 — stacked sheets, map peek, full screen, resize steps, backdrop blur, scroll inside. */
(function () {
  var src = 'Bottom Sheet · Part 2';
  var cat = 'Modal, Sheet & Tooltip';
  var frame =
    '& .fr{position:relative;width:236px;height:200px;border-radius:16px;overflow:hidden;background:var(--d-soft);color:var(--d-fg);font-size:10.5px}' +
    '& .pg{padding:12px 14px;font-weight:600;color:var(--d-mid)}' +
    '& .sh{position:absolute;left:0;right:0;bottom:0;border-radius:16px 16px 0 0;background:var(--d-bg);box-shadow:0 -6px 20px rgba(0,0,0,.18);padding:8px 12px 12px;touch-action:none}' +
    '& .hdl{display:block;width:30px;height:4px;border-radius:2px;background:var(--d-mid);margin:0 auto 8px;opacity:.6}' +
    '& .li{display:flex;align-items:center;gap:8px;padding:5px 0}& .li small{display:block;color:var(--d-mid);font-size:8.5px}' +
    '& .av{flex:none;width:18px;height:18px;border-radius:50%;background:var(--d-accent)}' +
    '& .b2{background:#2fbf8f}& .b3{background:#ff6b9a}& .b4{background:#ffb02e}';

  LUZ.add({
    id: 'sheet-stacked-sheets', cat: cat, name: 'Stacked Sheets', source: src, trigger: 'tap', allowColor: true,
    motion: 'Ketuk "Notifications": sheet kedua naik dari bawah (translateY 100% → 0) dengan pegas, sementara sheet pertama mundur ke scale 0.94, naik 8px dan meredup ke 60% sehingga mengintip di atasnya. Tombol ‹ membalik: sheet kedua turun, sheet pertama kembali normal.',
    timing: '≈420ms cubic-bezier(.32,1.25,.5,1) (overshoot kecil)',
    use: 'pengaturan bertingkat di mobile, mis. Pengaturan → Notifikasi pengingat obat',
    tags: 'bottom sheet stacked nested push scale back dim',
    html: '<div class="fr"><div class="pg">Profile</div>' +
      '<div class="sh s1"><i class="hdl"></i><b>Settings</b><div class="li"><i class="av"></i><div>Account<small>Name, email, photo</small></div></div><button type="button" class="li nt"><i class="av b3"></i><div>Notifications<small>Sounds, badges</small></div></button><div class="li"><i class="av b2"></i><div>Privacy</div></div></div>' +
      '<div class="sh s2"><i class="hdl"></i><div class="tb"><button type="button" class="bk">‹</button><b>Notifications</b></div><div class="li">Sounds<i class="tg on"></i></div><div class="li">Badges<i class="tg"></i></div><div class="li">Previews<i class="tg on"></i></div></div></div>',
    css: frame + '& .s1{top:34px;transform-origin:50% 0}& .s2{height:128px;transform:translateY(100%)}' +
      '& .nt{width:100%;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}' +
      '& .tb{display:flex;align-items:center;gap:6px;margin-bottom:4px}& .tb b{flex:1;text-align:center;margin-right:24px}' +
      '& .bk{width:24px;height:24px;border-radius:50%;border:0;background:var(--d-soft);color:var(--d-fg);cursor:pointer}' +
      '& .s2 .li{justify-content:space-between}& .tg{width:24px;height:14px;border-radius:7px;background:var(--d-soft)}& .tg.on{background:var(--d-accent)}',
    js: function (root, api) {
      var s1 = root.querySelector('.s1'), s2 = root.querySelector('.s2'), on = false, t = [];
      function go(o) {
        if (o === on) return; on = o;
        var opt = { duration: api.reduce ? 1 : 420, easing: 'cubic-bezier(.32,1.25,.5,1)', fill: 'both', direction: o ? 'normal' : 'reverse' };
        s2.animate([{ transform: 'translateY(100%)' }, { transform: 'none' }], opt);
        s1.animate([{ transform: 'none', filter: 'brightness(1)' }, { transform: 'translateY(-8px) scale(.94)', filter: 'brightness(.6)' }], opt);
      }
      root.querySelector('.nt').onclick = function () { go(true); };
      root.querySelector('.bk').onclick = function () { go(false); };
      t.push(setTimeout(function () { go(true); }, 600), setTimeout(function () { go(false); }, 2200));
      return function () { t.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'sheet-map-peek', cat: cat, name: 'Map Peek', source: src, trigger: 'drag', allowColor: true,
    motion: 'Sheet di atas peta mula-mula hanya mengintip 48px ("3 cafés nearby"). Seret pegangannya ke atas: sheet mengikuti jari lalu menempel ke posisi terbuka dengan pegas, dan baris daftar (Moon Café, Leaf & Bean, Corner Brew) naik 12px dan muncul satu per satu. Seret turun untuk kembali mengintip.',
    timing: 'ikut jari · snap ≈420ms cubic-bezier(.32,1.2,.5,1) · baris stagger 80ms, 260ms ease-out',
    use: 'peta lokasi klinik/apotek terdekat dengan daftar yang bisa ditarik',
    tags: 'bottom sheet map peek drag snap detent stagger list',
    html: '<div class="fr mp"><i class="pin p1"></i><i class="pin p2"></i><i class="pin p3"></i>' +
      '<div class="sh"><i class="hdl"></i><div class="hx"><b>3 cafés nearby</b><small>Open now</small></div>' +
      '<div class="li"><i class="av"></i><div>Moon Café<small>2 min · Open</small></div></div><div class="li"><i class="av b2"></i><div>Leaf &amp; Bean<small>5 min · Open</small></div></div><div class="li"><i class="av b4"></i><div>Corner Brew<small>8 min · Open</small></div></div></div></div>',
    css: frame + '& .mp{background:linear-gradient(90deg,transparent 48%,var(--d-bg) 48% 52%,transparent 52%) 0 0/60px 60px,linear-gradient(transparent 46%,var(--d-bg) 46% 54%,transparent 54%) 0 0/70px 50px,var(--d-soft)}' +
      '& .pin{position:absolute;width:12px;height:12px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:var(--d-accent)}& .p1{left:60px;top:30px;background:#2fbf8f}& .p2{left:130px;top:52px}& .p3{left:190px;top:34px;background:#ffb02e}' +
      '& .mp .sh{height:150px;cursor:grab}& .hx{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px}& .hx small{color:#2fbf8f;font-size:9px}',
    js: function (root, api) {
      var sh = root.querySelector('.sh'), rows = sh.querySelectorAll('.li'), COL = 102, ty = COL, y0 = null, b0 = 0, t = [], k = api.reduce ? 0.01 : 1;
      function put(v) { ty = v; sh.style.transform = 'translateY(' + v + 'px)'; }
      function to(v) {
        var from = ty; put(v);
        sh.animate([{ transform: 'translateY(' + from + 'px)' }, { transform: 'translateY(' + v + 'px)' }], { duration: 420 * k, easing: 'cubic-bezier(.32,1.2,.5,1)' });
        rows.forEach(function (r, i) {
          r.animate(v === 0 ? [{ transform: 'translateY(12px)', opacity: 0 }, { transform: 'none', opacity: 1 }] : [{ opacity: 1 }, { opacity: 0 }],
            { duration: (v === 0 ? 260 : 150) * k, delay: (v === 0 ? 120 + i * 80 : 0) * k, easing: 'ease-out', fill: 'both' });
        });
      }
      put(COL); rows.forEach(function (r) { r.style.opacity = 0; });
      sh.addEventListener('pointerdown', function (e) { b0 = new DOMMatrix(getComputedStyle(sh).transform).m42; sh.getAnimations().forEach(function (a) { a.cancel(); }); put(b0); y0 = e.clientY; sh.setPointerCapture(e.pointerId); });
      sh.addEventListener('pointermove', function (e) { if (y0 !== null) put(Math.max(-8, Math.min(COL, b0 + e.clientY - y0))); });
      sh.addEventListener('pointerup', function (e) {
        if (y0 === null) return;
        var moved = Math.abs(e.clientY - y0) > 4; y0 = null;
        to(moved ? (ty < COL / 2 ? 0 : COL) : (b0 < COL / 2 ? COL : 0));
      });
      t.push(setTimeout(function () { to(0); }, 600), setTimeout(function () { to(COL); }, 2400));
      return function () { t.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'sheet-full-screen', cat: cat, name: 'Full Screen', source: src, trigger: 'drag', allowColor: true,
    motion: 'Tarik sheet "Reviews" ke puncak: sheet naik mengisi layar, sudut atas radius 16px menjadi 0 (persegi), pegangan memudar dan muncul header dengan tombol "Done". Done atau tarik turun mengembalikannya menjadi sheet bersudut bulat.',
    timing: 'ikut jari · snap ≈400ms cubic-bezier(.32,1.15,.5,1) · radius & header ikut progres',
    use: 'daftar ulasan, riwayat, atau catatan panjang yang bisa dibuka penuh',
    tags: 'bottom sheet full screen expand corners radius drag detent header',
    html: '<div class="fr fs"><div class="pg">Hotel</div><div class="sh"><div class="top"><b>Reviews</b><button type="button" class="dn">Done</button></div><i class="hdl"></i><b class="tt">Reviews</b>' +
      [['Mia', '★★★★★ Lovely view', ''], ['Leo', '★★★★☆ Quiet rooms', ' b2'], ['Ava', '★★★★★ Great breakfast', ' b3'], ['Kai', '★★★★☆ Friendly staff', ' b4']].map(function (r) { return '<div class="li"><i class="av' + r[2] + '"></i><div>' + r[0] + '<small>' + r[1] + '</small></div></div>'; }).join('') + '</div></div>',
    css: frame + '& .fs .sh{top:0;cursor:grab}& .top{position:absolute;left:0;right:0;top:0;height:34px;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;border-bottom:1px solid var(--d-soft);background:var(--d-bg)}' +
      '& .dn{position:absolute;right:8px;border:0;background:none;color:var(--d-accent);font:600 10px inherit;cursor:pointer;padding:8px}& .tt{display:block;margin-bottom:2px}',
    js: function (root, api) {
      var sh = root.querySelector('.sh'), top = root.querySelector('.top'), hdl = root.querySelector('.hdl'), COL = 60, ty = COL, y0 = null, b0 = 0, t = [], run;
      function put(v) {
        var p = 1 - v / COL; ty = v;
        sh.style.transform = 'translateY(' + v + 'px)'; sh.style.borderRadius = 16 * (1 - p) + 'px ' + 16 * (1 - p) + 'px 0 0';
        top.style.opacity = p; top.style.pointerEvents = p > 0.9 ? 'auto' : 'none'; hdl.style.opacity = 0.6 * (1 - p);
      }
      function to(v) {
        var from = ty, t0 = performance.now(), D = api.reduce ? 1 : 400;
        var me = run = {};
        (function f(now) { // ease-out with a small overshoot; drives transform + radius + header together
          if (run !== me || y0 !== null) return;
          var p = Math.min(1, (now - t0) / D), e = 1 - Math.pow(1 - p, 3) * Math.cos(p * 4);
          put(p < 1 ? from + (v - from) * Math.min(e, 1.04) : v);
          if (p < 1) requestAnimationFrame(f);
        })(t0);
      }
      put(COL);
      sh.addEventListener('pointerdown', function (e) { if (e.target.closest('.dn')) return; b0 = ty; y0 = e.clientY; sh.setPointerCapture(e.pointerId); });
      sh.addEventListener('pointermove', function (e) { if (y0 !== null) put(Math.max(0, Math.min(COL + 20, b0 + e.clientY - y0))); });
      sh.addEventListener('pointerup', function (e) {
        if (y0 === null) return;
        var moved = Math.abs(e.clientY - y0) > 4; y0 = null;
        to(moved ? (ty < COL / 2 ? 0 : COL) : (b0 > 0 ? 0 : ty));
      });
      root.querySelector('.dn').onclick = function () { to(COL); };
      t.push(setTimeout(function () { to(0); }, 600), setTimeout(function () { to(COL); }, 2300));
      return function () { t.forEach(clearTimeout); run = null; };
    }
  });

  LUZ.add({
    id: 'sheet-resize-steps', cat: cat, name: 'Resize Steps', source: src, trigger: 'tap', allowColor: true,
    motion: 'Satu sheet melewati tiga langkah: "Pick a size" (pendek) → "Pick a color" + tombol Add to bag (lebih tinggi) → "✓ Added to bag" (pendek). Tiap langkah isi lama memudar 120ms, isi baru masuk, dan tinggi sheet menyesuaikan dengan pegas (overshoot ±6px).',
    timing: 'isi keluar 120ms + masuk 200ms · tinggi ≈440ms cubic-bezier(.32,1.3,.5,1)',
    use: 'alur pemesanan/registrasi singkat di sheet, mis. pilih jadwal → konfirmasi → selesai',
    tags: 'bottom sheet resize height steps spring content change morph',
    html: '<div class="fr rs"><div class="pg">Shop</div><div class="sh"><i class="hdl"></i><div class="ct"></div></div></div>',
    css: frame + '& .rs .sh{height:170px;bottom:0}' +
      '& .chips{display:flex;gap:6px;margin-top:8px}& .chips button{flex:1;height:30px;border:0;border-radius:8px;background:var(--d-soft);color:var(--d-fg);font:600 10px inherit;cursor:pointer}& .chips button.on{background:var(--d-accent);color:var(--d-bg)}' +
      '& .cl{display:flex;gap:10px;margin:8px 0}& .cl button{width:22px;height:22px;border-radius:50%;border:0;cursor:pointer}& .cl button.on{box-shadow:0 0 0 2px var(--d-bg),0 0 0 4px var(--d-fg)}' +
      '& .add{width:100%;height:30px;border:0;border-radius:99px;background:var(--d-accent);color:var(--d-bg);font:600 10px inherit;cursor:pointer}' +
      '& .ok{display:flex;gap:8px;align-items:center;width:100%;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer;padding:4px 0}& .ok i{width:22px;height:22px;border-radius:50%;background:#2fbf8f;color:#fff;display:grid;place-items:center;font-style:normal}& .ok small{display:block;color:var(--d-mid)}',
    js: function (root, api) {
      var V = [
        '<b>Pick a size</b><div class="chips"><button type="button">S</button><button type="button">M</button><button type="button">L</button></div>',
        '<b>Pick a color</b><div class="cl"><button type="button" style="background:#5b5cff"></button><button type="button" style="background:#2fa9ff"></button><button type="button" style="background:#ff6b9a"></button><button type="button" style="background:#ffc53d"></button><button type="button" style="background:#2fbf8f"></button></div><button type="button" class="add">Add to bag</button>',
        '<button type="button" class="ok"><i>✓</i><div><b>Added to bag</b><small>Size M · Pink</small></div></button>'
      ];
      var sh = root.querySelector('.sh'), ct = root.querySelector('.ct'), cur = -1, ty = 170, t = [], k = api.reduce ? 0.01 : 1;
      function show(n) {
        var first = cur < 0; cur = n;
        ct.animate([{ opacity: 1 }, { opacity: 0 }], { duration: first ? 0 : 120 * k }).onfinish = function () {
          ct.innerHTML = V[n]; ct.style.opacity = 1;
          var h = ct.offsetHeight + 30, from = ty; ty = 170 - h;
          sh.style.transform = 'translateY(' + ty + 'px)';
          sh.animate([{ transform: 'translateY(' + from + 'px)' }, { transform: 'translateY(' + ty + 'px)' }], { duration: 440 * k, easing: 'cubic-bezier(.32,1.3,.5,1)' });
          ct.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 200 * k, easing: 'ease-out' });
        };
      }
      ct.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        if (cur === 0) { b.classList.add('on'); show(1); }
        else if (cur === 1) { if (b.classList.contains('add')) show(2); else { ct.querySelectorAll('.cl button').forEach(function (x) { x.classList.toggle('on', x === b); }); } }
        else show(0);
      });
      sh.style.transform = 'translateY(170px)'; show(0);
      t.push(setTimeout(function () { show(1); }, 900), setTimeout(function () { show(2); }, 1800));
      return function () { t.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'sheet-backdrop-blur', cat: cat, name: 'Backdrop Blur', source: src, trigger: 'drag', allowColor: true,
    motion: 'Saat sheet "Filters" ditarik naik, layar galeri di belakangnya makin blur (0 → 8px) dan meredup (brightness 1 → 0.65) sebanding dengan progres tarikan. Turunkan sheet dan latar kembali tajam.',
    timing: 'ikut jari · snap ≈400ms cubic-bezier(.32,1.2,.5,1) · blur mengikuti posisi sheet',
    use: 'panel filter atau aksi yang perlu fokus di atas konten, mis. filter daftar pasien',
    tags: 'bottom sheet backdrop blur dim focus drag progress',
    html: '<div class="fr bb"><div class="gal"><div class="pg">Gallery</div><div class="ims"><i class="g1"></i><i class="g2"></i><i class="g3"></i><i class="g4"></i></div></div>' +
      '<div class="sh"><i class="hdl"></i><b>Filters</b><div class="sw"><span><i class="g1"></i>Vivid</span><span><i class="f2"></i>Warm</span><span><i class="g2"></i>Cool</span><span><i class="f4"></i>Mono</span><span><i class="f5"></i>Dream</span></div></div></div>',
    css: frame + '& .ims{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:0 12px}& .ims i{height:56px;border-radius:10px}' +
      '& .g1{background:linear-gradient(150deg,#5b3fb8,#c06bd6)}& .g2{background:linear-gradient(#1b2f7a,#2f6fe0)}& .g3{background:linear-gradient(#17493a,#1f7a55)}& .g4{background:linear-gradient(#3a2470,#b0479a)}' +
      '& .f2{background:#ffb02e}& .f4{background:#9a9aa5}& .f5{background:#ff6b9a}' +
      '& .bb .sh{height:110px;cursor:grab}& .sw{display:flex;gap:6px;margin-top:8px}& .sw span{flex:1;display:grid;gap:3px;justify-items:center;font-size:8px;color:var(--d-mid)}& .sw i{width:100%;height:30px;border-radius:8px}',
    js: function (root, api) {
      var sh = root.querySelector('.sh'), gal = root.querySelector('.gal'), COL = 76, ty = COL, y0 = null, b0 = 0, t = [], run;
      function put(v) {
        var p = 1 - v / COL; ty = v;
        sh.style.transform = 'translateY(' + v + 'px)';
        gal.style.filter = 'blur(' + (8 * p).toFixed(2) + 'px) brightness(' + (1 - 0.35 * p).toFixed(3) + ')';
      }
      function to(v) {
        var from = ty, t0 = performance.now(), D = api.reduce ? 1 : 400;
        var me = run = {};
        (function f(now) {
          if (run !== me || y0 !== null) return;
          var p = Math.min(1, (now - t0) / D), e = 1 - Math.pow(1 - p, 3);
          put(from + (v - from) * e);
          if (p < 1) requestAnimationFrame(f);
        })(t0);
      }
      put(COL);
      sh.addEventListener('pointerdown', function (e) { b0 = ty; y0 = e.clientY; sh.setPointerCapture(e.pointerId); });
      sh.addEventListener('pointermove', function (e) { if (y0 !== null) put(Math.max(0, Math.min(COL, b0 + e.clientY - y0))); });
      sh.addEventListener('pointerup', function (e) {
        if (y0 === null) return;
        var moved = Math.abs(e.clientY - y0) > 4; y0 = null;
        to(moved ? (ty < COL / 2 ? 0 : COL) : (b0 < COL / 2 ? COL : 0));
      });
      t.push(setTimeout(function () { to(0); }, 600), setTimeout(function () { to(COL); }, 2200));
      return function () { t.forEach(clearTimeout); run = null; };
    }
  });

  LUZ.add({
    id: 'sheet-scroll-inside', cat: cat, name: 'Scroll Inside', source: src, trigger: 'scroll', allowColor: true,
    motion: 'Gulir daftar di dalam sheet: judul besar "Messages" (rata kiri) mengecil ke 0.6× dan memudar sementara judul kecil di tengah header muncul, mengikuti 40px pertama guliran. Gulir kembali ke atas dan judul besar muncul lagi.',
    timing: 'langsung mengikuti scroll (scroll-linked) · autoplay gulir 700ms ease-in-out',
    use: 'sheet berisi daftar panjang (pesan, riwayat obat) dengan header yang menghemat ruang',
    tags: 'bottom sheet scroll large title collapse header scroll-linked',
    html: '<div class="fr si"><div class="pg">Inbox</div><div class="sh"><i class="hdl"></i><b class="sm">Messages</b><div class="sc"><b class="big">Messages</b>' +
      [['Mia Park', 'See you at 7?', ''], ['Leo Cruz', 'Sent the files', ' b2'], ['Ava Stone', 'Lunch tomorrow?', ' b3'], ['Kai Ito', 'Thanks a lot!', ' b4'], ['Noa Kim', 'On my way', ''], ['Eli Ray', 'Call me back', ' b2'], ['Ivy Lee', 'Got it', ' b3']].map(function (r) { return '<div class="li"><i class="av' + r[2] + '"></i><div>' + r[0] + '<small>' + r[1] + '</small></div></div>'; }).join('') + '</div></div></div>',
    css: frame + '& .si .sh{top:30px;padding-bottom:0;display:flex;flex-direction:column}' +
      '& .sm{position:absolute;left:0;right:0;top:12px;text-align:center;opacity:0;pointer-events:none}' +
      '& .sc{flex:1;overflow-y:auto;scrollbar-width:none;padding-top:4px;touch-action:pan-y}& .sc::-webkit-scrollbar{display:none}' +
      '& .big{display:block;font-size:17px;transform-origin:0 50%;margin-bottom:4px}',
    js: function (root, api) {
      var sc = root.querySelector('.sc'), big = root.querySelector('.big'), sm = root.querySelector('.sm'), t = [], raf;
      function draw() {
        var p = Math.min(1, sc.scrollTop / 40);
        big.style.transform = 'scale(' + (1 - 0.4 * p) + ')'; big.style.opacity = 1 - p; sm.style.opacity = p;
      }
      sc.addEventListener('scroll', draw);
      function glide(to) {
        var from = sc.scrollTop, t0 = performance.now(), D = api.reduce ? 1 : 700;
        cancelAnimationFrame(raf);
        (function f(now) { var p = Math.min(1, (now - t0) / D), e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; sc.scrollTop = from + (to - from) * e; if (p < 1) raf = requestAnimationFrame(f); })(t0);
      }
      t.push(setTimeout(function () { glide(70); }, 600), setTimeout(function () { glide(0); }, 2000));
      return function () { t.forEach(clearTimeout); cancelAnimationFrame(raf); };
    }
  });
})();
