/* Swipe Actions · Part 4 — six swipe gestures on the top row of a mini list.
   Every demo: tap the list (or wait for autoplay) and the top row performs its action,
   is removed, the rows below slide up 200ms and a new row fades in at the bottom. */
(function () {
  var SRC = 'Swipe Actions · Part 4';
  var HATCH = 'repeating-linear-gradient(45deg,var(--d-soft) 0 2px,transparent 2px 7px)';
  var BASE =
    '& .list{width:236px;padding:6px 8px;background:var(--d-bg);border-radius:14px;cursor:pointer}' +
    '& .row{position:relative;overflow:hidden;height:46px;border-bottom:1px solid var(--d-soft)}' +
    '& .row:last-child{border-bottom:0}' +
    '& .fg{position:absolute;inset:4px 0;display:flex;align-items:center;gap:9px;padding:0 8px;background:var(--d-bg);border:1px solid transparent;border-radius:9px}' +
    '& .fg i{flex:none;width:22px;height:22px;border:1px solid var(--d-mid);border-radius:50%;display:grid;place-items:center;font:600 9px/1 sans-serif;font-style:normal}' +
    '& .fg b{flex:1;font-size:9.5px;letter-spacing:.14em;font-weight:600;white-space:nowrap}' +
    '& .fg span{font-size:9px;color:var(--d-mid)}' +
    '& .act{position:absolute;inset:4px 0;border-radius:9px;display:flex;align-items:center;padding:0 12px;background:' + HATCH + ';color:var(--d-fg);justify-content:flex-end}' +
    '& svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}';
  var TRASH = '<svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>';
  var HTML = '<div class="list" role="list" aria-label="Daftar pesan, ketuk untuk menggeser baris teratas"></div>';

  LUZ.add({
    id: 'swipe-card-swipe',
    cat: 'List & Gesture',
    name: 'Card Swipe',
    source: SRC,
    trigger: 'drag',
    motion: 'Baris teratas terangkat (scale 1.02 + bayangan), lalu digeser ke kanan 40px sambil berputar 7° dan cap "LIKE" mengecil dari 1.3 ke 1. Setelah itu kartu terlempar keluar ke kanan sambil memudar, baris di bawahnya naik satu baris.',
    timing: 'angkat 60ms · geser 270ms ease-out · lempar 130ms ease-in · baris naik 200ms',
    use: 'Swipe untuk menyukai/menyetujui item, misalnya menandai jadwal pasien sudah dikonfirmasi.',
    tags: 'swipe right like tinder card fly out stamp list dismiss',
    html: HTML,
    css: BASE +
      '& .stamp{position:absolute;left:8px;top:50%;margin-top:-11px;padding:3px 8px;border:2px solid var(--d-fg);border-radius:6px;font:800 11px/1 sans-serif;letter-spacing:.12em;background:var(--d-bg);opacity:0}' +
      '& .row{overflow:visible}& .fg.lift{border-color:var(--d-mid);box-shadow:0 6px 14px rgba(0,0,0,.12)}',
    js: function (root, api) {
      var list = root.querySelector('.list'), N = [['IVY MOSS', '8:55'], ['OWEN HALE', '8:02'], ['NORA VALE', '9:41'], ['THEO BANKS', '9:20']];
      var k = 0, busy = false, dead = false, T = [];
      var wait = function (ms) { return new Promise(function (r) { T.push(setTimeout(r, ms)); }); };
      function row() {
        var d = N[k++ % 4], r = document.createElement('div'); r.className = 'row';
        r.innerHTML = '<div class="fg"><i>' + d[0][0] + '</i><b>' + d[0] + '</b><span>' + d[1] + '</span><em class="stamp">LIKE</em></div>';
        return r;
      }
      function next(r) {
        var h = r.offsetHeight; r.remove();
        [].forEach.call(list.children, function (c) { c.animate([{ transform: 'translateY(' + h + 'px)' }, { transform: 'none' }], { duration: 200, easing: 'cubic-bezier(.2,.8,.2,1)' }); });
        var n = row(); list.appendChild(n); n.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: 'ease-out' });
      }
      async function play() {
        if (busy) return; busy = true;
        var r = list.firstElementChild, fg = r.querySelector('.fg'), st = r.querySelector('.stamp');
        if (!api.reduce) {
          fg.classList.add('lift');
          fg.animate([{ transform: 'none' }, { transform: 'scale(1.02)' }], { duration: 60, fill: 'forwards' });
          await wait(60); if (dead) return;
          st.animate([{ opacity: 0, transform: 'scale(1.3)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 200, fill: 'forwards', easing: 'ease-out' });
          await fg.animate([{ transform: 'scale(1.02)' }, { transform: 'translateX(40px) rotate(7deg) scale(1.02)' }], { duration: 270, fill: 'forwards', easing: 'cubic-bezier(.2,.8,.2,1)' }).finished;
          if (dead) return;
          await fg.animate([{ transform: 'translateX(40px) rotate(7deg)', opacity: 1 }, { transform: 'translateX(260px) rotate(14deg)', opacity: 0 }], { duration: 130, fill: 'forwards', easing: 'ease-in' }).finished;
        } else await r.animate({ opacity: [1, 0] }, { duration: 150, fill: 'forwards' }).finished;
        if (dead) return; next(r); busy = false;
      }
      for (var i = 0; i < 3; i++) list.appendChild(row());
      list.addEventListener('click', play);
      T.push(setTimeout(play, 600));
      return function () { dead = true; T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'swipe-swipe-to-pin',
    cat: 'List & Gesture',
    name: 'Swipe to Pin',
    source: SRC,
    trigger: 'drag',
    motion: 'Baris digeser ke kanan 56px dan membuka panel arsir di kiri berisi ikon pin yang membesar dari 0.4. Baris memantul kembali ke 0, ikon pin kecil muncul di samping jam, lalu baris naik keluar sambil blur dan memudar.',
    timing: 'geser 250ms ease-out · balik 300ms spring (overshoot) · keluar 220ms ease-in',
    use: 'Menyematkan percakapan atau pasien prioritas ke atas daftar.',
    tags: 'swipe right pin reveal action hatched spring back list',
    html: HTML,
    css: BASE + '& .act{justify-content:flex-start}& .act svg{opacity:0}& .fg .pin{width:11px;height:11px;opacity:0}',
    js: function (root, api) {
      var list = root.querySelector('.list'), N = [['IVY MOSS', '8:55'], ['OWEN HALE', '8:02'], ['NORA VALE', '9:41'], ['THEO BANKS', '9:20']];
      var PIN = '<svg viewBox="0 0 24 24" class="PC"><path d="M9 3h6l-1 6 4 4H6l4-4zM12 13v8"/></svg>';
      var k = 0, busy = false, dead = false, T = [];
      var wait = function (ms) { return new Promise(function (r) { T.push(setTimeout(r, ms)); }); };
      function row() {
        var d = N[k++ % 4], r = document.createElement('div'); r.className = 'row';
        r.innerHTML = '<div class="act">' + PIN.replace('PC', 'big') + '</div><div class="fg"><i>' + d[0][0] + '</i><b>' + d[0] + '</b>' + PIN.replace('PC', 'pin') + '<span>' + d[1] + '</span></div>';
        return r;
      }
      function next(r) {
        var h = r.offsetHeight; r.remove();
        [].forEach.call(list.children, function (c) { c.animate([{ transform: 'translateY(' + h + 'px)' }, { transform: 'none' }], { duration: 200, easing: 'cubic-bezier(.2,.8,.2,1)' }); });
        var n = row(); list.appendChild(n); n.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: 'ease-out' });
      }
      async function play() {
        if (busy) return; busy = true;
        var r = list.firstElementChild, fg = r.querySelector('.fg');
        if (!api.reduce) {
          r.querySelector('.big').animate([{ opacity: 0, transform: 'scale(.4)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 250, fill: 'forwards', easing: 'ease-out' });
          await fg.animate([{ transform: 'none' }, { transform: 'translateX(56px)' }], { duration: 250, fill: 'forwards', easing: 'cubic-bezier(.2,.8,.2,1)' }).finished;
          await wait(150); if (dead) return;
          r.querySelector('.pin').animate([{ opacity: 0, transform: 'scale(0)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 200, delay: 120, fill: 'forwards', easing: 'cubic-bezier(.34,1.56,.64,1)' });
          await fg.animate([{ transform: 'translateX(56px)' }, { transform: 'none' }], { duration: 300, fill: 'forwards', easing: 'cubic-bezier(.34,1.56,.64,1)' }).finished;
          await wait(250); if (dead) return;
          await r.animate([{ opacity: 1 }, { opacity: 0, transform: 'translateY(-20px)', filter: 'blur(3px)' }], { duration: 220, fill: 'forwards', easing: 'ease-in' }).finished;
        } else await r.animate({ opacity: [1, 0] }, { duration: 150, fill: 'forwards' }).finished;
        if (dead) return; next(r); busy = false;
      }
      for (var i = 0; i < 3; i++) list.appendChild(row());
      list.addEventListener('click', play);
      T.push(setTimeout(play, 600));
      return function () { dead = true; T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'swipe-peek-hint',
    cat: 'List & Gesture',
    name: 'Peek Hint',
    source: SRC,
    trigger: 'tap',
    motion: 'Baris bergeser ke kiri 48px dengan sedikit pantulan dan mengintipkan panel arsir berisi ikon tempat sampah yang bergoyang ±12°. Lalu isi baris memudar sehingga seluruh baris jadi arsir (hapus), dan baris di bawahnya naik.',
    timing: 'intip 220ms spring · tahan 250ms · pudar 120ms · baris naik 200ms',
    use: 'Memberi petunjuk bahwa baris bisa digeser untuk dihapus, misalnya saat pertama kali membuka daftar.',
    tags: 'peek hint swipe left reveal delete trash wiggle affordance',
    html: HTML,
    css: BASE,
    js: function (root, api) {
      var list = root.querySelector('.list'), N = [['IVY MOSS', '8:55'], ['OWEN HALE', '8:02'], ['NORA VALE', '9:41'], ['THEO BANKS', '9:20']];
      var TR = '<svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>';
      var k = 0, busy = false, dead = false, T = [];
      var wait = function (ms) { return new Promise(function (r) { T.push(setTimeout(r, ms)); }); };
      function row() {
        var d = N[k++ % 4], r = document.createElement('div'); r.className = 'row';
        r.innerHTML = '<div class="act">' + TR + '</div><div class="fg"><i>' + d[0][0] + '</i><b>' + d[0] + '</b><span>' + d[1] + '</span></div>';
        return r;
      }
      function next(r) {
        var h = r.offsetHeight; r.remove();
        [].forEach.call(list.children, function (c) { c.animate([{ transform: 'translateY(' + h + 'px)' }, { transform: 'none' }], { duration: 200, easing: 'cubic-bezier(.2,.8,.2,1)' }); });
        var n = row(); list.appendChild(n); n.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: 'ease-out' });
      }
      async function play() {
        if (busy) return; busy = true;
        var r = list.firstElementChild, fg = r.querySelector('.fg');
        if (!api.reduce) {
          r.querySelector('.act svg').animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-12deg)' }, { transform: 'rotate(12deg)' }, { transform: 'rotate(0)' }], { duration: 300, delay: 120 });
          await fg.animate([{ transform: 'none' }, { transform: 'translateX(-48px)' }], { duration: 220, fill: 'forwards', easing: 'cubic-bezier(.34,1.56,.64,1)' }).finished;
          await wait(250); if (dead) return;
          await fg.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: 'forwards' }).finished;
          await wait(150);
        } else await r.animate({ opacity: [1, 0] }, { duration: 150, fill: 'forwards' }).finished;
        if (dead) return; next(r); busy = false;
      }
      for (var i = 0; i < 3; i++) list.appendChild(row());
      list.addEventListener('click', play);
      T.push(setTimeout(play, 600));
      return function () { dead = true; T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'swipe-liquid-delete',
    cat: 'List & Gesture',
    name: 'Liquid Delete',
    source: SRC,
    trigger: 'drag',
    motion: 'Baris bergeser ke kiri 70px dan dari tepi kanannya keluar gumpalan cairan gelap: titik kecil memanjang jadi kapsul berleher tipis berisi ikon tempat sampah. Leher menipis lalu putus, baris lenyap, kapsul mengecil jadi titik lalu pecah jadi 8 partikel melingkar.',
    timing: 'geser + gumpalan 300ms ease-out · leher putus 80ms · pecah partikel 300ms ease-out',
    use: 'Hapus item dengan umpan balik yang terasa "fisik", misalnya menghapus draf catatan.',
    tags: 'liquid goo metaball delete swipe particles burst trash',
    html: HTML,
    css: BASE +
      '& .act{background:none;padding:0}' +
      '& .blob{position:absolute;right:2px;top:50%;width:64px;height:28px;margin-top:-14px;border-radius:14px;background:var(--d-fg);color:var(--d-bg);display:grid;place-items:center;transform-origin:100% 50%;transform:scale(0)}' +
      '& .neck{position:absolute;right:58px;top:50%;width:20px;height:12px;margin-top:-6px;background:var(--d-fg);border-radius:6px;transform:scaleX(0);transform-origin:100% 50%}' +
      '& .dot{position:absolute;right:30px;top:50%;width:6px;height:6px;margin-top:-3px;border-radius:50%;background:var(--d-fg);opacity:0}',
    js: function (root, api) {
      var list = root.querySelector('.list'), N = [['IVY MOSS', '8:55'], ['OWEN HALE', '8:02'], ['NORA VALE', '9:41'], ['THEO BANKS', '9:20']];
      var TR = '<svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>';
      var k = 0, busy = false, dead = false, T = [];
      var wait = function (ms) { return new Promise(function (r) { T.push(setTimeout(r, ms)); }); };
      function row() {
        var d = N[k++ % 4], r = document.createElement('div'); r.className = 'row';
        r.innerHTML = '<div class="act"><i class="neck"></i><i class="blob">' + TR + '</i>' + new Array(9).join('<i class="dot"></i>') + '</div><div class="fg"><i>' + d[0][0] + '</i><b>' + d[0] + '</b><span>' + d[1] + '</span></div>';
        return r;
      }
      function next(r) {
        var h = r.offsetHeight; r.remove();
        [].forEach.call(list.children, function (c) { c.animate([{ transform: 'translateY(' + h + 'px)' }, { transform: 'none' }], { duration: 200, easing: 'cubic-bezier(.2,.8,.2,1)' }); });
        var n = row(); list.appendChild(n); n.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: 'ease-out' });
      }
      async function play() {
        if (busy) return; busy = true;
        var r = list.firstElementChild, fg = r.querySelector('.fg'), blob = r.querySelector('.blob'), neck = r.querySelector('.neck');
        if (!api.reduce) {
          var o = { duration: 300, fill: 'forwards', easing: 'cubic-bezier(.2,.8,.2,1)' };
          fg.animate([{ transform: 'none' }, { transform: 'translateX(-70px)' }], o);
          blob.animate([{ transform: 'scale(.15,.4)' }, { transform: 'scale(.4,.8)', offset: .3 }, { transform: 'scale(1)' }], o);
          await neck.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], o).finished;
          await wait(180); if (dead) return;
          await neck.animate([{ transform: 'scale(1,1)' }, { transform: 'scale(1,.2)' }, { transform: 'scale(0,0)' }], { duration: 160, fill: 'forwards' }).finished;
          fg.animate([{ opacity: 1, filter: 'blur(0)' }, { opacity: 0, filter: 'blur(4px)' }], { duration: 160, fill: 'forwards' });
          await blob.animate([{ transform: 'scale(1)' }, { transform: 'scale(.12)' }], { duration: 140, fill: 'forwards', easing: 'ease-in' }).finished;
          blob.style.opacity = 0;
          r.querySelectorAll('.dot').forEach(function (d, i) {
            var a = i / 8 * Math.PI * 2;
            d.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translate(' + Math.cos(a) * 22 + 'px,' + Math.sin(a) * 16 + 'px) scale(.4)' }], { duration: 300, easing: 'ease-out', fill: 'forwards' });
          });
          await wait(300);
        } else await r.animate({ opacity: [1, 0] }, { duration: 150, fill: 'forwards' }).finished;
        if (dead) return; next(r); busy = false;
      }
      for (var i = 0; i < 3; i++) list.appendChild(row());
      list.addEventListener('click', play);
      T.push(setTimeout(play, 600));
      return function () { dead = true; T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'swipe-snooze-clock',
    cat: 'List & Gesture',
    name: 'Snooze Clock',
    source: SRC,
    trigger: 'drag',
    motion: 'Baris bergeser ke kiri 72px membuka panel arsir berisi jam kecil berlabel "6 PM"; jarum jam berputar dua putaran saat panel terbuka. Isi baris lalu memudar dan baris dihapus, baris di bawahnya naik.',
    timing: 'geser 260ms ease-out · jarum 720° 600ms ease-out · pudar 120ms · baris naik 200ms',
    use: 'Tunda pengingat atau tugas sampai jam tertentu, misalnya "ingatkan kontrol pasien jam 6 sore".',
    tags: 'snooze clock remind later swipe left spin hand',
    html: HTML,
    css: BASE + '& .act{flex-direction:column;justify-content:center;align-items:flex-end;gap:1px;font:700 8px/1 sans-serif}& .act .hand{transform-origin:12px 13px}',
    js: function (root, api) {
      var list = root.querySelector('.list'), N = [['IVY MOSS', '8:55'], ['OWEN HALE', '8:02'], ['NORA VALE', '9:41'], ['THEO BANKS', '9:20']];
      var CLK = '<svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="8"/><path d="M10 2h4"/><path class="hand" d="M12 13V8"/></svg>';
      var k = 0, busy = false, dead = false, T = [];
      var wait = function (ms) { return new Promise(function (r) { T.push(setTimeout(r, ms)); }); };
      function row() {
        var d = N[k++ % 4], r = document.createElement('div'); r.className = 'row';
        r.innerHTML = '<div class="act">' + CLK + '<span>6 PM</span></div><div class="fg"><i>' + d[0][0] + '</i><b>' + d[0] + '</b><span>' + d[1] + '</span></div>';
        return r;
      }
      function next(r) {
        var h = r.offsetHeight; r.remove();
        [].forEach.call(list.children, function (c) { c.animate([{ transform: 'translateY(' + h + 'px)' }, { transform: 'none' }], { duration: 200, easing: 'cubic-bezier(.2,.8,.2,1)' }); });
        var n = row(); list.appendChild(n); n.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: 'ease-out' });
      }
      async function play() {
        if (busy) return; busy = true;
        var r = list.firstElementChild, fg = r.querySelector('.fg');
        if (!api.reduce) {
          r.querySelector('.hand').animate([{ transform: 'rotate(0)' }, { transform: 'rotate(720deg)' }], { duration: 600, easing: 'cubic-bezier(.2,.8,.2,1)' });
          fg.animate([{ transform: 'none' }, { transform: 'translateX(-72px)' }], { duration: 260, fill: 'forwards', easing: 'cubic-bezier(.2,.8,.2,1)' });
          await wait(700); if (dead) return;
          await fg.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: 'forwards' }).finished;
          await wait(150);
        } else await r.animate({ opacity: [1, 0] }, { duration: 150, fill: 'forwards' }).finished;
        if (dead) return; next(r); busy = false;
      }
      for (var i = 0; i < 3; i++) list.appendChild(row());
      list.addEventListener('click', play);
      T.push(setTimeout(play, 600));
      return function () { dead = true; T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'swipe-inline-undo',
    cat: 'List & Gesture',
    name: 'Inline Undo',
    source: SRC,
    trigger: 'tap',
    motion: 'Baris digeser ke kiri 48px memperlihatkan tempat sampah, lalu berganti menjadi bar "DELETED … UNDO" dengan garis hitung mundur di bawah yang menyusut dari kanan ke kiri. Ketuk UNDO untuk mengembalikan baris; bila waktu habis baris dihapus dan baris lain naik.',
    timing: 'geser 220ms ease-out · bar masuk 180ms · hitung mundur 2,5 dtk linear (di video dipercepat) · kolaps 200ms',
    use: 'Hapus yang bisa dibatalkan tanpa dialog konfirmasi, misalnya menghapus jadwal atau obat dari resep.',
    tags: 'undo delete countdown snackbar inline swipe list',
    html: HTML,
    css: BASE +
      '& .undo{position:absolute;inset:4px 0;border:1px solid var(--d-mid);border-radius:9px;background:var(--d-bg);display:flex;align-items:center;justify-content:space-between;padding:0 10px;font:600 8px/1 sans-serif;letter-spacing:.14em;color:var(--d-mid);opacity:0;pointer-events:none}' +
      '& .undo button{font:800 9.5px/1 sans-serif;letter-spacing:.12em;color:var(--d-fg);background:none;border:0;padding:12px 4px;margin-right:-4px;cursor:pointer}' +
      '& .undo .cd{position:absolute;left:10px;right:10px;bottom:6px;height:2px;background:var(--d-fg);transform-origin:0 50%}',
    js: function (root, api) {
      var list = root.querySelector('.list'), N = [['IVY MOSS', '8:55'], ['OWEN HALE', '8:02'], ['NORA VALE', '9:41'], ['THEO BANKS', '9:20']];
      var TR = '<svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>';
      var k = 0, busy = false, dead = false, T = [];
      var wait = function (ms) { return new Promise(function (r) { T.push(setTimeout(r, ms)); }); };
      function row() {
        var d = N[k++ % 4], r = document.createElement('div'); r.className = 'row';
        r.innerHTML = '<div class="act">' + TR + '</div><div class="fg"><i>' + d[0][0] + '</i><b>' + d[0] + '</b><span>' + d[1] + '</span></div><div class="undo">DELETED<button type="button">UNDO</button><i class="cd"></i></div>';
        return r;
      }
      function next(r) {
        var h = r.offsetHeight; r.remove();
        [].forEach.call(list.children, function (c) { c.animate([{ transform: 'translateY(' + h + 'px)' }, { transform: 'none' }], { duration: 200, easing: 'cubic-bezier(.2,.8,.2,1)' }); });
        var n = row(); list.appendChild(n); n.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: 'ease-out' });
      }
      async function play(e) {
        if (busy) return; busy = true;
        var r = list.firstElementChild, fg = r.querySelector('.fg'), un = r.querySelector('.undo'), undone = false;
        var swipe = fg.animate([{ transform: 'none', opacity: 1 }, { transform: 'translateX(-48px)', opacity: 1 }, { transform: 'translateX(-48px)', opacity: 0 }], { duration: api.reduce ? 1 : 400, fill: 'forwards', easing: 'ease-out' });
        await swipe.finished; if (dead) return;
        un.style.pointerEvents = 'auto';
        un.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 180, fill: 'forwards' });
        var bar = un.querySelector(".cd").animate([{ transform: 'scaleX(1)' }, { transform: 'scaleX(0)' }], { duration: 2500, fill: 'forwards' });
        un.querySelector('button').onclick = function (ev) {
          ev.stopPropagation(); undone = true; bar.cancel(); un.style.pointerEvents = 'none';
          un.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 150, fill: 'forwards' });
          swipe.reverse(); swipe.finished.then(function () { busy = false; });
        };
        await bar.finished.catch(function () {});
        if (dead || undone) return;
        await un.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 150, fill: 'forwards' }).finished;
        if (dead) return; next(r); busy = false;
      }
      for (var i = 0; i < 3; i++) list.appendChild(row());
      list.addEventListener('click', play);
      T.push(setTimeout(play, 600));
      return function () { dead = true; T.forEach(clearTimeout); };
    }
  });
})();
