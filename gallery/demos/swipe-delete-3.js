/* Swipe to Delete · Part 3 — one inbox, six ways for a row to leave.
   Drag a row to the left (or just tap it) to delete; the deleted row is recycled at the bottom. */
(function () {
  var SRC = 'Swipe to Delete · Part 3';
  var PEOPLE = [['Ivy Moss', 'Dinner on Friday?', '8:55', '#e8578a'], ['Owen Hale', 'Draft v2 attached', '8:02', '#1fae8f'],
    ['Luna Reyes', 'Call me when you can', 'Tue', '#f0a33a'], ['Sam Ortiz', 'Thanks for the help', 'Mon', '#f07a4a'],
    ['Nora Vale', 'Trip photos are up!', '9:41', '#7c5cff'], ['Theo Banks', 'Meeting moved to 3 PM', '9:20', '#2f9bff']];
  function list(under) {
    return '<div class="lst">' + PEOPLE.map(function (p) {
      return '<div class="rw">' + (under || '') + '<div class="fg"><i class="av" style="background:' + p[3] + '">' + p[0][0] + '</i>' +
        '<span class="tx"><b>' + p[0] + '</b><small>' + p[1] + '</small></span><span class="tm">' + p[2] + '</span></div></div>';
    }).join('') + '</div>';
  }
  var CSS =
    '& .lst{position:relative;width:240px;height:174px;overflow:hidden;border-radius:14px;background:var(--d-bg);border:1px solid var(--d-soft)}' +
    '& .rw{position:relative;height:43px}' +
    '& .fg{position:absolute;inset:0;display:flex;align-items:center;gap:9px;padding:0 12px;background:var(--d-bg);border-bottom:1px solid var(--d-soft);cursor:grab;touch-action:pan-y}' +
    '& .av{flex:none;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;font-size:10px;font-weight:700;font-style:normal;color:#fff}' +
    '& .tx{flex:1;min-width:0;display:grid;line-height:1.25;color:var(--d-fg)}& .tx b{font-size:11px}& .tx small{font-size:9px;color:var(--d-mid)}' +
    '& .tm{font-size:8.5px;color:var(--d-mid)}' +
    '& .fx{position:absolute;pointer-events:none}';

  LUZ.add({
    id: 'swipedel-bin-lid-flip',
    cat: 'List & Gesture',
    name: 'Bin Lid Flip',
    source: SRC,
    trigger: 'drag',
    motion: 'Menggeser baris ke kiri membuka area merah berikon tempat sampah di kanan. Saat dilepas, baris meluncur keluar ke kiri, bilah merah memenuhi baris dengan ikon bergeser ke tengah dan tutupnya terbuka (rotate −30°), lalu bilah merah menutup ke atas menjadi garis tipis dan hilang; baris di bawahnya naik mengisi.',
    timing: 'keluar 200ms ease-in · tutup sampah 150ms · bilah menutup 300ms · baris lain naik 300ms ease-out',
    use: 'Hapus item di daftar pesan, notifikasi, atau daftar antrean pasien.',
    tags: 'swipe delete trash bin lid red reveal list',
    allowColor: true,
    html: list('<div class="bg"><span class="bin"><i class="lid"></i><i class="can"></i></span></div>'),
    css: CSS +
      '& .bg{position:absolute;inset:0;display:flex;justify-content:flex-end;align-items:center;padding-right:18px;background:#ef4f6a;transform-origin:50% 0}' +
      '& .bin{position:relative;width:12px;height:14px}& .can{position:absolute;left:1px;bottom:0;width:10px;height:10px;border:1.5px solid #fff;border-top:0;border-radius:0 0 2px 2px;box-sizing:border-box}' +
      '& .lid{position:absolute;left:0;top:1px;width:12px;height:1.5px;background:#fff;transform-origin:0 50%}',
    js: function (root, api) {
      var lst = root.querySelector('.lst'), busy = false, tm = [];
      function collapse(row) { // recycle the row at the bottom, slide the rows below it up (FLIP)
        var below = []; for (var n = row.nextElementSibling; n; n = n.nextElementSibling) below.push(n);
        row.getAnimations({ subtree: true }).forEach(function (a) { a.cancel(); });
        row.querySelector('.fg').style.transform = ''; lst.appendChild(row); busy = false;
        below.forEach(function (n) { n.animate([{ transform: 'translateY(43px)' }, { transform: 'none' }], { duration: 300, easing: 'cubic-bezier(.2,.8,.2,1)' }); });
      }
      function del(row, dx) {
        busy = true;
        var fg = row.querySelector('.fg'), d = api.reduce ? 0.3 : 1, o = function (ms, delay) { return { duration: ms * d, delay: delay * d, easing: 'ease-in', fill: 'forwards' }; };
        fg.animate([{ transform: 'translateX(' + dx + 'px)' }, { transform: 'translateX(-105%)' }], o(200, 0));
        row.querySelector('.bin').animate([{ transform: 'none' }, { transform: 'translateX(' + -(row.offsetWidth / 2 - 24) + 'px)' }], o(200, 0));
        row.querySelector('.lid').animate([{ transform: 'none' }, { transform: 'rotate(-30deg)' }], o(150, 200));
        row.querySelector('.bg').animate([{ transform: 'scaleY(1)' }, { transform: 'scaleY(.08)', offset: 0.7 }, { transform: 'scaleY(0)' }], o(300, 450)).onfinish = function () { collapse(row); };
      }
      lst.addEventListener('pointerdown', function (e) {
        var fg = e.target.closest('.fg'); if (!fg || busy) return;
        var x0 = e.clientX, dx = 0; fg.setPointerCapture(e.pointerId);
        fg.onpointermove = function (ev) { dx = Math.min(0, ev.clientX - x0); fg.style.transform = 'translateX(' + dx + 'px)'; };
        fg.onpointerup = fg.onpointercancel = function () {
          fg.onpointermove = fg.onpointerup = fg.onpointercancel = null;
          if (dx > -6 || dx < -60) del(fg.parentNode, dx); else fg.style.transform = '';
        };
      });
      var t = setTimeout(function () { del(lst.firstElementChild, 0); }, 600);
      return function () { clearTimeout(t); tm.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'swipedel-pop-to-dot',
    cat: 'List & Gesture',
    name: 'Pop to Dot',
    source: SRC,
    trigger: 'drag',
    motion: 'Baris yang digeser berubah merah muda. Saat dilepas, isinya memudar dan baris menyusut menjadi pil merah lalu titik (scale 0.4×0.5 → 0.05, sudut membulat), kemudian titik itu pecah menjadi cincin 8 percikan yang memudar; baris lain naik.',
    timing: 'menyusut 300ms ease-in · percikan 250ms ease-out · naik 300ms',
    use: 'Hapus item kecil seperti notifikasi, tag, atau item checklist.',
    tags: 'swipe delete shrink dot pop sparks burst list',
    allowColor: true,
    html: list(),
    css: CSS +
      '& .hot .fg{background:linear-gradient(rgba(239,79,106,.3),rgba(239,79,106,.3)),var(--d-bg)}' +
      '& .spark{left:50%;top:50%;width:4px;height:4px;margin:-2px;border-radius:50%;background:#ef4f6a}',
    js: function (root, api) {
      var lst = root.querySelector('.lst'), busy = false, tm = [];
      function collapse(row) {
        var below = []; for (var n = row.nextElementSibling; n; n = n.nextElementSibling) below.push(n);
        row.getAnimations({ subtree: true }).forEach(function (a) { a.cancel(); });
        row.querySelectorAll('.fx').forEach(function (x) { x.remove(); });
        row.classList.remove('hot'); row.querySelector('.fg').style.transform = ''; lst.appendChild(row); busy = false;
        below.forEach(function (n) { n.animate([{ transform: 'translateY(43px)' }, { transform: 'none' }], { duration: 300, easing: 'cubic-bezier(.2,.8,.2,1)' }); });
      }
      function del(row, dx) {
        busy = true; row.classList.add('hot');
        var fg = row.querySelector('.fg');
        [].forEach.call(fg.children, function (c) { c.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: 'forwards' }); });
        fg.animate([{ transform: 'translateX(' + dx + 'px)', borderRadius: '0px' },
          { transform: 'scale(.4,.5)', borderRadius: '99px', background: '#ef4f6a', offset: 0.5 },
          { transform: 'scale(.05)', borderRadius: '99px', background: '#ef4f6a' }], { duration: api.reduce ? 100 : 300, easing: 'ease-in', fill: 'forwards' }).onfinish = function () {
          fg.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 60, fill: 'forwards' });
          for (var i = 0; i < 8; i++) {
            var s = document.createElement('i'); s.className = 'fx spark'; row.appendChild(s);
            var a = i * Math.PI / 4;
            s.animate([{ transform: 'none', opacity: 1 }, { transform: 'translate(' + Math.cos(a) * 18 + 'px,' + Math.sin(a) * 14 + 'px) scale(.5)', opacity: 0 }],
              { duration: 250, easing: 'ease-out', fill: 'forwards' });
          }
          tm.push(setTimeout(function () { collapse(row); }, 260));
        };
      }
      lst.addEventListener('pointerdown', function (e) {
        var fg = e.target.closest('.fg'); if (!fg || busy) return;
        var x0 = e.clientX, dx = 0; fg.setPointerCapture(e.pointerId);
        fg.onpointermove = function (ev) { dx = Math.min(0, ev.clientX - x0); fg.style.transform = 'translateX(' + dx + 'px)'; fg.parentNode.classList.toggle('hot', dx < -20); };
        fg.onpointerup = fg.onpointercancel = function () {
          fg.onpointermove = fg.onpointerup = fg.onpointercancel = null;
          if (dx > -6 || dx < -60) del(fg.parentNode, dx); else { fg.style.transform = ''; fg.parentNode.classList.remove('hot'); }
        };
      });
      var t = setTimeout(function () { del(lst.firstElementChild, 0); }, 600);
      return function () { clearTimeout(t); tm.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'swipedel-blade-slice',
    cat: 'List & Gesture',
    name: 'Blade Slice',
    source: SRC,
    trigger: 'drag',
    motion: 'Garis “pisau” merah muda bercahaya mengikuti jari dari kanan ke kiri tepat di tengah baris. Saat dilepas, garis menuntaskan potongan, lalu baris terbelah dua: separuh atas naik 6px dan separuh bawah turun 6px sambil memudar; baris lain naik.',
    timing: 'potong 150ms · belah 300ms ease-out · naik 300ms',
    use: 'Hapus item dengan nuansa tegas, misalnya membatalkan janji atau tugas.',
    tags: 'swipe delete slice blade split cut halves list',
    allowColor: true,
    html: list('<i class="fx blade"></i>'),
    css: CSS +
      '& .blade{right:0;top:50%;z-index:2;width:100%;height:2px;margin-top:-1px;background:#ff5c8a;box-shadow:0 0 6px 1px #ff5c8a;transform:scaleX(0);transform-origin:right}' +
      '& .half{inset:0}',
    js: function (root, api) {
      var lst = root.querySelector('.lst'), busy = false, tm = [];
      function collapse(row) {
        var below = []; for (var n = row.nextElementSibling; n; n = n.nextElementSibling) below.push(n);
        row.getAnimations({ subtree: true }).forEach(function (a) { a.cancel(); });
        row.querySelectorAll('.half').forEach(function (x) { x.remove(); });
        row.querySelector('.fg').style.visibility = ''; row.querySelector('.blade').style.transform = ''; lst.appendChild(row); busy = false;
        below.forEach(function (n) { n.animate([{ transform: 'translateY(43px)' }, { transform: 'none' }], { duration: 300, easing: 'cubic-bezier(.2,.8,.2,1)' }); });
      }
      function del(row, dx) {
        busy = true;
        var fg = row.querySelector('.fg'), blade = row.querySelector('.blade'), w = row.offsetWidth;
        blade.animate([{ transform: 'scaleX(' + -dx / w + ')', opacity: 1 }, { transform: 'scaleX(1)', opacity: 1 }], { duration: api.reduce ? 1 : 150, easing: 'ease-out', fill: 'forwards' }).onfinish = function () {
          blade.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' });
          [['inset(0 0 50% 0)', -6], ['inset(50% 0 0 0)', 6]].forEach(function (h) {
            var c = fg.cloneNode(true); c.className = 'fg fx half'; c.style.clipPath = h[0]; row.appendChild(c);
            c.animate([{ transform: 'none', opacity: 1 }, { transform: 'translateY(' + h[1] + 'px) rotate(' + h[1] / 6 + 'deg)', opacity: 0 }], { duration: 300, easing: 'ease-out', fill: 'forwards' });
          });
          fg.style.visibility = 'hidden';
          tm.push(setTimeout(function () { collapse(row); }, 300));
        };
      }
      lst.addEventListener('pointerdown', function (e) {
        var fg = e.target.closest('.fg'); if (!fg || busy) return;
        var x0 = e.clientX, dx = 0, blade = fg.parentNode.querySelector('.blade'); fg.setPointerCapture(e.pointerId);
        fg.onpointermove = function (ev) { dx = Math.min(0, ev.clientX - x0); blade.style.transform = 'scaleX(' + Math.min(1, -dx / fg.offsetWidth) + ')'; };
        fg.onpointerup = fg.onpointercancel = function () {
          fg.onpointermove = fg.onpointerup = fg.onpointercancel = null;
          if (dx > -6 || dx < -60) del(fg.parentNode, dx); else blade.style.transform = '';
        };
      });
      var t = setTimeout(function () { del(lst.firstElementChild, 0); }, 600);
      return function () { clearTimeout(t); tm.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'swipedel-dust-crumble',
    cat: 'List & Gesture',
    name: 'Dust Crumble',
    source: SRC,
    trigger: 'drag',
    motion: 'Setelah dilepas, baris hancur menjadi pasir dari kanan ke kiri: topeng clip-path menghapus baris (inset kanan 0→100%) dan tepat di garis hapus muncul ±40 partikel kecil yang terbang ke kanan-atas (20–45px) sambil memudar.',
    timing: 'hapus 600ms linear · partikel 500ms ease-out, jeda sesuai posisi x · naik 300ms',
    use: 'Hapus permanen yang ingin terasa “benar-benar hilang”, misalnya kosongkan arsip atau hapus draf.',
    tags: 'swipe delete dust disintegrate particles crumble thanos list',
    allowColor: true,
    html: list(),
    css: CSS + '& .dust{left:0;top:0;width:3px;height:3px;border-radius:1px;background:var(--d-mid)}',
    js: function (root, api) {
      var lst = root.querySelector('.lst'), busy = false, tm = [];
      function collapse(row) {
        var below = []; for (var n = row.nextElementSibling; n; n = n.nextElementSibling) below.push(n);
        row.getAnimations({ subtree: true }).forEach(function (a) { a.cancel(); });
        row.querySelectorAll('.fx').forEach(function (x) { x.remove(); });
        row.querySelector('.fg').style.transform = ''; lst.appendChild(row); busy = false;
        below.forEach(function (n) { n.animate([{ transform: 'translateY(43px)' }, { transform: 'none' }], { duration: 300, easing: 'cubic-bezier(.2,.8,.2,1)' }); });
      }
      function del(row, dx) {
        busy = true;
        var fg = row.querySelector('.fg'), w = row.offsetWidth, T = api.reduce ? 150 : 600;
        fg.style.transform = '';
        fg.animate([{ clipPath: 'inset(0 0 0 0)' }, { clipPath: 'inset(0 100% 0 0)' }], { duration: T, fill: 'forwards' });
        for (var i = 0; i < 40 && !api.reduce; i++) {
          var p = document.createElement('i'), x = Math.random() * w, y = 6 + Math.random() * 31;
          p.className = 'fx dust'; p.style.transform = 'translate(' + x + 'px,' + y + 'px)'; row.appendChild(p);
          p.animate([{ opacity: 0, transform: 'translate(' + x + 'px,' + y + 'px)' }, { opacity: 1, transform: 'translate(' + x + 'px,' + y + 'px)', offset: 0.05 },
            { opacity: 0, transform: 'translate(' + (x + 20 + Math.random() * 25) + 'px,' + (y - 8 - Math.random() * 20) + 'px)' }],
            { duration: 500, delay: (1 - x / w) * T, easing: 'ease-out', fill: 'both' });
        }
        tm.push(setTimeout(function () { collapse(row); }, T + (api.reduce ? 0 : 450)));
      }
      lst.addEventListener('pointerdown', function (e) {
        var fg = e.target.closest('.fg'); if (!fg || busy) return;
        var x0 = e.clientX, dx = 0; fg.setPointerCapture(e.pointerId);
        fg.onpointermove = function (ev) { dx = Math.min(0, ev.clientX - x0); fg.style.transform = 'translateX(' + dx + 'px)'; };
        fg.onpointerup = fg.onpointercancel = function () {
          fg.onpointermove = fg.onpointerup = fg.onpointercancel = null;
          if (dx > -6 || dx < -60) del(fg.parentNode, dx); else fg.style.transform = '';
        };
      });
      var t = setTimeout(function () { del(lst.firstElementChild, 0); }, 600);
      return function () { clearTimeout(t); tm.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'swipedel-elastic-snap',
    cat: 'List & Gesture',
    name: 'Elastic Snap',
    source: SRC,
    trigger: 'drag',
    motion: 'Saat digeser, baris meregang seperti karet (scaleX naik hingga ±1.25 dengan tumpuan di kanan, teks sedikit kabur). Saat dilepas, baris lepas dan melesat ke kiri (translateX −110%, scaleX 1.35, blur 2px) dalam sekejap; baris lain naik.',
    timing: 'regang mengikuti jari · lepas 150ms ease-in · naik 300ms',
    use: 'Hapus cepat di daftar yang sering dibersihkan, misalnya kotak masuk atau keranjang.',
    tags: 'swipe delete elastic stretch rubber snap fling list',
    allowColor: true,
    html: list(),
    css: CSS + '& .fg{transform-origin:right center}',
    js: function (root, api) {
      var lst = root.querySelector('.lst'), busy = false, tm = [];
      function pull(dx) { return 'translateX(' + dx + 'px) scaleX(' + (1 + Math.min(0.25, -dx / 300)) + ')'; }
      function collapse(row) {
        var below = []; for (var n = row.nextElementSibling; n; n = n.nextElementSibling) below.push(n);
        row.getAnimations({ subtree: true }).forEach(function (a) { a.cancel(); });
        row.querySelector('.fg').style.transform = row.querySelector('.fg').style.filter = ''; lst.appendChild(row); busy = false;
        below.forEach(function (n) { n.animate([{ transform: 'translateY(43px)' }, { transform: 'none' }], { duration: 300, easing: 'cubic-bezier(.2,.8,.2,1)' }); });
      }
      function del(row, dx) {
        busy = true;
        var fg = row.querySelector('.fg'), k = dx < -6 ? [] : [{ transform: pull(-40), filter: 'blur(.6px)', offset: 0.6 }]; // a tap gets a short stretch first
        fg.animate([{ transform: pull(dx), filter: 'blur(0)' }].concat(k, [{ transform: 'translateX(-110%) scaleX(1.35)', filter: 'blur(2px)' }]),
          { duration: api.reduce ? 100 : k.length ? 400 : 150, easing: 'ease-in', fill: 'forwards' }).onfinish = function () { collapse(row); };
      }
      lst.addEventListener('pointerdown', function (e) {
        var fg = e.target.closest('.fg'); if (!fg || busy) return;
        var x0 = e.clientX, dx = 0; fg.setPointerCapture(e.pointerId);
        fg.onpointermove = function (ev) { dx = Math.min(0, ev.clientX - x0); fg.style.transform = pull(dx); fg.style.filter = 'blur(' + Math.min(1, -dx / 80) + 'px)'; };
        fg.onpointerup = fg.onpointercancel = function () {
          fg.onpointermove = fg.onpointerup = fg.onpointercancel = null;
          if (dx > -6 || dx < -60) del(fg.parentNode, dx); else fg.style.transform = fg.style.filter = '';
        };
      });
      var t = setTimeout(function () { del(lst.firstElementChild, 0); }, 600);
      return function () { clearTimeout(t); tm.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'swipedel-genie-bin',
    cat: 'List & Gesture',
    name: 'Genie Bin',
    source: SRC,
    trigger: 'drag',
    motion: 'Lingkaran merah kecil berikon sampah muncul di kiri baris (scale 0→1). Baris lalu tersedot ke dalamnya seperti efek genie: bentuknya menyempit menjadi trapesium (clip-path polygon) sambil mengecil ke arah kiri (scale 1→0.04) dan memudar, lalu ikon sampah ikut hilang.',
    timing: 'ikon muncul 150ms · sedot 400ms ease-in · ikon hilang 150ms · naik 300ms',
    use: 'Pindahkan item ke tempat sampah/arsip dengan jejak visual ke mana item pergi.',
    tags: 'swipe delete genie suck bin minimize list',
    allowColor: true,
    html: list('<span class="fx gbin"><i></i></span>'),
    css: CSS +
      '& .gbin{left:10px;top:10px;z-index:2;width:22px;height:22px;border-radius:50%;background:#ef4f6a;display:grid;place-items:center;transform:scale(0)}' +
      '& .gbin i{width:8px;height:9px;border:1.5px solid #fff;border-top-width:2.5px;border-radius:0 0 2px 2px}' +
      '& .fg{transform-origin:left center}',
    js: function (root, api) {
      var lst = root.querySelector('.lst'), busy = false, tm = [];
      function collapse(row) {
        var below = []; for (var n = row.nextElementSibling; n; n = n.nextElementSibling) below.push(n);
        row.getAnimations({ subtree: true }).forEach(function (a) { a.cancel(); });
        row.querySelector('.fg').style.transform = ''; lst.appendChild(row); busy = false;
        below.forEach(function (n) { n.animate([{ transform: 'translateY(43px)' }, { transform: 'none' }], { duration: 300, easing: 'cubic-bezier(.2,.8,.2,1)' }); });
      }
      function del(row, dx) {
        busy = true;
        var fg = row.querySelector('.fg'), bin = row.querySelector('.gbin'), d = api.reduce ? 0.3 : 1;
        bin.animate([{ transform: 'scale(0)' }, { transform: 'scale(1.15)', offset: 0.7 }, { transform: 'scale(1)' }], { duration: 150 * d, fill: 'forwards' });
        fg.animate([{ transform: 'translateX(' + dx + 'px)', clipPath: 'polygon(0 0,100% 0,100% 100%,0 100%)', opacity: 1 },
          { transform: 'translateX(-6px) scale(.6,.7)', clipPath: 'polygon(0 30%,100% 0,100% 100%,0 70%)', opacity: 0.9, offset: 0.5 },
          { transform: 'translateX(14px) scale(.04,.15)', clipPath: 'polygon(0 45%,100% 20%,100% 80%,0 55%)', opacity: 0.2 }],
          { duration: 400 * d, delay: 100 * d, easing: 'ease-in', fill: 'forwards' });
        bin.animate([{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(0)', opacity: 0 }], { duration: 150 * d, delay: 520 * d, fill: 'forwards' })
          .onfinish = function () { collapse(row); };
      }
      lst.addEventListener('pointerdown', function (e) {
        var fg = e.target.closest('.fg'); if (!fg || busy) return;
        var x0 = e.clientX, dx = 0; fg.setPointerCapture(e.pointerId);
        fg.onpointermove = function (ev) { dx = Math.min(0, ev.clientX - x0); fg.style.transform = 'translateX(' + dx + 'px)'; };
        fg.onpointerup = fg.onpointercancel = function () {
          fg.onpointermove = fg.onpointerup = fg.onpointercancel = null;
          if (dx > -6 || dx < -60) del(fg.parentNode, dx); else fg.style.transform = '';
        };
      });
      var t = setTimeout(function () { del(lst.firstElementChild, 0); }, 600);
      return function () { clearTimeout(t); tm.forEach(clearTimeout); };
    }
  });
})();
