/* Pagination · Part 1 — the same pager (‹ 1 2 3 4 5 ›), six ways to change page. */
(function () {
  var SRC = 'Pagination · Part 1';
  var HTML = '<div class="pg"><div class="cards"></div><div class="pager"><button class="ar prev" type="button" aria-label="Sebelumnya">‹</button>' +
    '<span class="nums"><i class="hl"></i><button type="button">1</button><button type="button">2</button><button type="button">3</button><button type="button" class="on">4</button><button type="button">5</button></span>' +
    '<button class="ar next" type="button" aria-label="Berikutnya">›</button></div></div>';
  var CSS =
    '& .pg{width:240px;padding:12px;border-radius:16px;background:var(--d-bg);border:1px solid var(--d-soft);color:var(--d-fg)}' +
    '& .cards{position:relative;height:62px;perspective:500px}' +
    '& .set{position:absolute;inset:0;display:grid;grid-template-columns:repeat(3,1fr);gap:7px}' +
    '& .cd{position:relative;display:flex;flex-direction:column;justify-content:space-between;padding:7px 8px;border-radius:10px;color:#fff;overflow:hidden}' +
    '& .cd b{font-size:17px;line-height:1}& .cd small{font-size:8px;opacity:.9}' +
    '& .cd::after{content:"";position:absolute;right:8px;bottom:9px;width:4px;height:4px;border-radius:50%;background:#fff;opacity:.85}' +
    '& .pager{display:flex;align-items:center;justify-content:space-between;margin-top:14px}' +
    '& .ar{width:28px;height:28px;padding:0;border-radius:50%;border:1px solid var(--d-soft);background:none;color:var(--d-fg);font-size:15px;line-height:1;cursor:pointer}' +
    '& .nums{position:relative;display:flex;gap:4px}' +
    '& .nums button{position:relative;z-index:1;width:26px;height:26px;padding:0;border:0;border-radius:7px;background:none;font:inherit;font-size:11px;font-weight:600;color:var(--d-mid);cursor:pointer;transition:color .2s}' +
    '& .nums button.on{color:var(--d-bg)}' +
    '& .hl{position:absolute;left:0;top:0;width:26px;height:26px;border-radius:7px;background:var(--d-accent);transform-origin:13px 13px}';

  LUZ.add({
    id: 'pagination-elastic-glide',
    cat: 'Menu & Navigasi',
    name: 'Elastic Glide',
    source: SRC,
    trigger: 'tap',
    motion: 'Sorotan nomor meregang menjadi pil panjang dari nomor lama ke nomor baru, lalu menyusut di nomor baru. Kartu lama bergeser keluar searah perpindahan (40px + memudar) dan kartu baru meluncur masuk dari sisi berlawanan, bergiliran 50ms.',
    timing: 'sorotan 380ms ease-in-out (regang di 45%) · kartu 350ms ease-out stagger 50ms',
    use: 'Paginasi daftar/kartu, misalnya halaman hasil pencarian pasien atau galeri.',
    tags: 'pagination elastic stretch indicator slide cards stagger',
    allowColor: true,
    html: HTML,
    css: CSS,
    js: function (root, api) {
      var N = ['Aster', 'Briar', 'Cove', 'Dune', 'Echo', 'Fern', 'Glade', 'Haze', 'Isle', 'Jade', 'Kelp', 'Lumen', 'Moss', 'Nectar', 'Opal'];
      var C = [['#5b4bd6', '#8d7bff'], ['#2f7fd8', '#5fb0ff'], ['#d64f86', '#ff86b0'], ['#c99a2e', '#f2c45a'], ['#1e9e8a', '#3fd1b4']];
      var cur = 4, cards = root.querySelector('.cards'), hl = root.querySelector('.hl'), btns = root.querySelectorAll('.nums button');
      function make(p) { // one page = three cards
        var s = document.createElement('div'); s.className = 'set';
        for (var i = 0; i < 3; i++) {
          var n = (p - 1) * 3 + i;
          s.insertAdjacentHTML('beforeend', '<div class="cd" style="background:linear-gradient(135deg,' + C[p - 1][0] + ',' + C[p - 1][1] + ')"><b>' + String(n + 1).padStart(2, '0') + '</b><small>' + N[n] + '</small></div>');
        }
        return s;
      }
      function x(p) { return btns[p - 1].offsetLeft; }
      function at(px) { return 'translateX(' + px + 'px)'; }
      cards.appendChild(make(4)); hl.style.transform = at(x(4));
      function go(p) {
        if (p < 1 || p > 5 || p === cur) return;
        var a = x(cur), b = x(p), dir = p > cur ? 1 : -1; cur = p;
        btns.forEach(function (bt, i) { bt.classList.toggle('on', i === p - 1); });
        cards.querySelectorAll('.old').forEach(function (s) { s.remove(); }); // interrupted mid-transition
        var old = cards.querySelector('.set'), nw = make(p); old.classList.add('old'); cards.appendChild(nw);
        hl.style.transform = at(b);
        if (api.reduce) { old.remove(); return; }
        var cs = nw.children, os = old.children;
        var lo = Math.min(a, b);
        hl.animate([{ transform: at(a) + ' scaleX(1)', transformOrigin: '0 50%' }, { transform: at(lo) + ' scaleX(' + (Math.abs(b - a) + 26) / 26 + ')', transformOrigin: '0 50%', offset: 0.45 },
          { transform: at(b) + ' scaleX(1)', transformOrigin: '0 50%' }], { duration: 380, easing: 'ease-in-out' });
        old.animate([{ opacity: 1 }, { opacity: 1 }], 350).onfinish = function () { old.remove(); };
        [].forEach.call(os, function (c, i) { c.animate([{ transform: 'none', opacity: 1 }, { transform: 'translateX(' + -dir * 40 + 'px)', opacity: 0 }], { duration: 250, delay: i * 40, easing: 'ease-in', fill: 'forwards' }); });
        [].forEach.call(cs, function (c, i) { c.animate([{ transform: 'translateX(' + dir * 40 + 'px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 350, delay: 100 + i * 50, easing: 'ease-out', fill: 'backwards' }); });

      }
      root.querySelector('.prev').onclick = function () { go(cur - 1); };
      root.querySelector('.next').onclick = function () { go(cur + 1); };
      btns.forEach(function (bt, i) { bt.onclick = function () { go(i + 1); }; });
      var t = setTimeout(function () { go(1); }, 600);
      return function () { clearTimeout(t); };
    }
  });

  LUZ.add({
    id: 'pagination-arc-hop',
    cat: 'Menu & Navigasi',
    name: 'Arc Hop',
    source: SRC,
    trigger: 'tap',
    motion: 'Sorotan mengecil menjadi bola (scale 0.35), melompat dalam busur 18px di atas deretan nomor ke nomor baru, lalu membesar lagi menjadi kotak. Kartu lama memudar dan kartu baru jatuh dari atas satu per satu (−14px→0, jeda 80ms) dengan sedikit pantulan.',
    timing: 'lompat 500ms ease-in-out · kartu 300ms pegas (cubic-bezier .34,1.4,.64,1) stagger 80ms',
    use: 'Paginasi carousel atau onboarding yang ingin terasa ringan dan ceria.',
    tags: 'pagination arc hop bounce ball indicator drop cards',
    allowColor: true,
    html: HTML,
    css: CSS,
    js: function (root, api) {
      var N = ['Aster', 'Briar', 'Cove', 'Dune', 'Echo', 'Fern', 'Glade', 'Haze', 'Isle', 'Jade', 'Kelp', 'Lumen', 'Moss', 'Nectar', 'Opal'];
      var C = [['#5b4bd6', '#8d7bff'], ['#2f7fd8', '#5fb0ff'], ['#d64f86', '#ff86b0'], ['#c99a2e', '#f2c45a'], ['#1e9e8a', '#3fd1b4']];
      var cur = 4, cards = root.querySelector('.cards'), hl = root.querySelector('.hl'), btns = root.querySelectorAll('.nums button');
      function make(p) { // one page = three cards
        var s = document.createElement('div'); s.className = 'set';
        for (var i = 0; i < 3; i++) {
          var n = (p - 1) * 3 + i;
          s.insertAdjacentHTML('beforeend', '<div class="cd" style="background:linear-gradient(135deg,' + C[p - 1][0] + ',' + C[p - 1][1] + ')"><b>' + String(n + 1).padStart(2, '0') + '</b><small>' + N[n] + '</small></div>');
        }
        return s;
      }
      function x(p) { return btns[p - 1].offsetLeft; }
      function at(px) { return 'translateX(' + px + 'px)'; }
      cards.appendChild(make(4)); hl.style.transform = at(x(4));
      function go(p) {
        if (p < 1 || p > 5 || p === cur) return;
        var a = x(cur), b = x(p), dir = p > cur ? 1 : -1; cur = p;
        btns.forEach(function (bt, i) { bt.classList.toggle('on', i === p - 1); });
        cards.querySelectorAll('.old').forEach(function (s) { s.remove(); }); // interrupted mid-transition
        var old = cards.querySelector('.set'), nw = make(p); old.classList.add('old'); cards.appendChild(nw);
        hl.style.transform = at(b);
        if (api.reduce) { old.remove(); return; }
        var cs = nw.children, os = old.children;
        hl.animate([{ transform: at(a) + ' scale(1)' }, { transform: at(a) + ' scale(.35)', offset: 0.2 }, { transform: at((a + b) / 2) + ' translateY(-18px) scale(.35)', offset: 0.55 },
          { transform: at(b) + ' scale(.35)', offset: 0.85 }, { transform: at(b) + ' scale(1)' }], { duration: 500, easing: 'ease-in-out' });
        old.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 150, fill: 'forwards' }).onfinish = function () { old.remove(); };
        [].forEach.call(cs, function (c, i) { c.animate([{ transform: 'translateY(-14px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 300, delay: 150 + i * 80, easing: 'cubic-bezier(.34,1.4,.64,1)', fill: 'backwards' }); });
      }
      root.querySelector('.prev').onclick = function () { go(cur - 1); };
      root.querySelector('.next').onclick = function () { go(cur + 1); };
      btns.forEach(function (bt, i) { bt.onclick = function () { go(i + 1); }; });
      var t = setTimeout(function () { go(1); }, 600);
      return function () { clearTimeout(t); };
    }
  });

  LUZ.add({
    id: 'pagination-squeeze-line',
    cat: 'Menu & Navigasi',
    name: 'Squeeze Line',
    source: SRC,
    trigger: 'tap',
    motion: 'Sorotan memipih menjadi garis bawah tipis di bawah nomornya (scaleY 0.15, turun 11px), garis itu memanjang sambil menyeberang ke nomor baru, lalu tumbuh kembali menjadi kotak. Kartu lama tenggelam (turun 8px + memudar) dan kartu baru naik dari bawah bergiliran.',
    timing: 'sorotan 450ms ease-in-out · kartu lama 200ms · kartu baru 300ms ease-out stagger 70ms',
    use: 'Paginasi bergaya minimal di tabel atau daftar dokumen.',
    tags: 'pagination squeeze underline bar morph indicator rise cards',
    allowColor: true,
    html: HTML,
    css: CSS,
    js: function (root, api) {
      var N = ['Aster', 'Briar', 'Cove', 'Dune', 'Echo', 'Fern', 'Glade', 'Haze', 'Isle', 'Jade', 'Kelp', 'Lumen', 'Moss', 'Nectar', 'Opal'];
      var C = [['#5b4bd6', '#8d7bff'], ['#2f7fd8', '#5fb0ff'], ['#d64f86', '#ff86b0'], ['#c99a2e', '#f2c45a'], ['#1e9e8a', '#3fd1b4']];
      var cur = 4, cards = root.querySelector('.cards'), hl = root.querySelector('.hl'), btns = root.querySelectorAll('.nums button');
      function make(p) { // one page = three cards
        var s = document.createElement('div'); s.className = 'set';
        for (var i = 0; i < 3; i++) {
          var n = (p - 1) * 3 + i;
          s.insertAdjacentHTML('beforeend', '<div class="cd" style="background:linear-gradient(135deg,' + C[p - 1][0] + ',' + C[p - 1][1] + ')"><b>' + String(n + 1).padStart(2, '0') + '</b><small>' + N[n] + '</small></div>');
        }
        return s;
      }
      function x(p) { return btns[p - 1].offsetLeft; }
      function at(px) { return 'translateX(' + px + 'px)'; }
      cards.appendChild(make(4)); hl.style.transform = at(x(4));
      function go(p) {
        if (p < 1 || p > 5 || p === cur) return;
        var a = x(cur), b = x(p), dir = p > cur ? 1 : -1; cur = p;
        btns.forEach(function (bt, i) { bt.classList.toggle('on', i === p - 1); });
        cards.querySelectorAll('.old').forEach(function (s) { s.remove(); }); // interrupted mid-transition
        var old = cards.querySelector('.set'), nw = make(p); old.classList.add('old'); cards.appendChild(nw);
        hl.style.transform = at(b);
        if (api.reduce) { old.remove(); return; }
        var cs = nw.children, os = old.children;
        hl.animate([{ transform: at(a) }, { transform: at(a) + ' translateY(11px) scaleY(.15)', offset: 0.25 }, { transform: at((a + b) / 2) + ' translateY(11px) scale(1.7,.15)', offset: 0.5 },
          { transform: at(b) + ' translateY(11px) scaleY(.15)', offset: 0.75 }, { transform: at(b) }], { duration: 450, easing: 'ease-in-out' });
        old.animate([{ transform: 'none', opacity: 1 }, { transform: 'translateY(8px)', opacity: 0 }], { duration: 200, easing: 'ease-in', fill: 'forwards' }).onfinish = function () { old.remove(); };
        [].forEach.call(cs, function (c, i) { c.animate([{ transform: 'translateY(12px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 300, delay: 150 + i * 70, easing: 'ease-out', fill: 'backwards' }); });
      }
      root.querySelector('.prev').onclick = function () { go(cur - 1); };
      root.querySelector('.next').onclick = function () { go(cur + 1); };
      btns.forEach(function (bt, i) { bt.onclick = function () { go(i + 1); }; });
      var t = setTimeout(function () { go(1); }, 600);
      return function () { clearTimeout(t); };
    }
  });

  LUZ.add({
    id: 'pagination-bloom-reveal',
    cat: 'Menu & Navigasi',
    name: 'Bloom Reveal',
    source: SRC,
    trigger: 'tap',
    motion: 'Sorotan langsung pindah ke nomor baru dan mekar dari tengahnya (scale 0→1, lingkaran → kotak membulat). Kumpulan kartu baru terbuka lewat lingkaran clip-path yang mengembang dari arah nomor yang diketuk, menutupi kartu lama.',
    timing: 'mekar 300ms ease-out · buka lingkaran 500ms ease-in-out',
    use: 'Pergantian halaman/tab konten yang ingin terasa “membuka”, misalnya kategori produk.',
    tags: 'pagination bloom circle reveal clip-path indicator scale',
    allowColor: true,
    html: HTML,
    css: CSS,
    js: function (root, api) {
      var N = ['Aster', 'Briar', 'Cove', 'Dune', 'Echo', 'Fern', 'Glade', 'Haze', 'Isle', 'Jade', 'Kelp', 'Lumen', 'Moss', 'Nectar', 'Opal'];
      var C = [['#5b4bd6', '#8d7bff'], ['#2f7fd8', '#5fb0ff'], ['#d64f86', '#ff86b0'], ['#c99a2e', '#f2c45a'], ['#1e9e8a', '#3fd1b4']];
      var cur = 4, cards = root.querySelector('.cards'), hl = root.querySelector('.hl'), btns = root.querySelectorAll('.nums button');
      function make(p) { // one page = three cards
        var s = document.createElement('div'); s.className = 'set';
        for (var i = 0; i < 3; i++) {
          var n = (p - 1) * 3 + i;
          s.insertAdjacentHTML('beforeend', '<div class="cd" style="background:linear-gradient(135deg,' + C[p - 1][0] + ',' + C[p - 1][1] + ')"><b>' + String(n + 1).padStart(2, '0') + '</b><small>' + N[n] + '</small></div>');
        }
        return s;
      }
      function x(p) { return btns[p - 1].offsetLeft; }
      function at(px) { return 'translateX(' + px + 'px)'; }
      cards.appendChild(make(4)); hl.style.transform = at(x(4));
      function go(p) {
        if (p < 1 || p > 5 || p === cur) return;
        var a = x(cur), b = x(p), dir = p > cur ? 1 : -1; cur = p;
        btns.forEach(function (bt, i) { bt.classList.toggle('on', i === p - 1); });
        cards.querySelectorAll('.old').forEach(function (s) { s.remove(); }); // interrupted mid-transition
        var old = cards.querySelector('.set'), nw = make(p); old.classList.add('old'); cards.appendChild(nw);
        hl.style.transform = at(b);
        if (api.reduce) { old.remove(); return; }
        var cs = nw.children, os = old.children;
        hl.animate([{ transform: at(b) + ' scale(0)', borderRadius: '50%' }, { transform: at(b) + ' scale(1)', borderRadius: '7px' }], { duration: 300, easing: 'ease-out' });
        var r1 = btns[p - 1].getBoundingClientRect(), r2 = cards.getBoundingClientRect(), cx = r1.left + r1.width / 2 - r2.left;
        nw.animate([{ clipPath: 'circle(0px at ' + cx + 'px 130%)' }, { clipPath: 'circle(300px at ' + cx + 'px 130%)' }], { duration: 500, easing: 'ease-in-out' }).onfinish = function () { old.remove(); };
      }
      root.querySelector('.prev').onclick = function () { go(cur - 1); };
      root.querySelector('.next').onclick = function () { go(cur + 1); };
      btns.forEach(function (bt, i) { bt.onclick = function () { go(i + 1); }; });
      var t = setTimeout(function () { go(1); }, 600);
      return function () { clearTimeout(t); };
    }
  });

  LUZ.add({
    id: 'pagination-comet-trail',
    cat: 'Menu & Navigasi',
    name: 'Comet Trail',
    source: SRC,
    trigger: 'tap',
    motion: 'Sorotan melesat ke nomor baru sambil meninggalkan jejak empat bayangan yang tertinggal 25ms satu sama lain dan memudar. Kartu lama meredup; kartu baru memperbesar diri dari scale 0.85 dengan blur 4px menjadi tajam.',
    timing: 'lesat 300ms ease-in-out · jejak 4× jeda 25ms · kartu 350ms ease-out',
    use: 'Paginasi dengan lompatan jauh (1 → 5) agar arah perpindahan tetap terbaca.',
    tags: 'pagination comet trail motion blur ghost indicator zoom cards',
    allowColor: true,
    html: HTML,
    css: CSS,
    js: function (root, api) {
      var N = ['Aster', 'Briar', 'Cove', 'Dune', 'Echo', 'Fern', 'Glade', 'Haze', 'Isle', 'Jade', 'Kelp', 'Lumen', 'Moss', 'Nectar', 'Opal'];
      var C = [['#5b4bd6', '#8d7bff'], ['#2f7fd8', '#5fb0ff'], ['#d64f86', '#ff86b0'], ['#c99a2e', '#f2c45a'], ['#1e9e8a', '#3fd1b4']];
      var cur = 4, cards = root.querySelector('.cards'), hl = root.querySelector('.hl'), btns = root.querySelectorAll('.nums button');
      function make(p) { // one page = three cards
        var s = document.createElement('div'); s.className = 'set';
        for (var i = 0; i < 3; i++) {
          var n = (p - 1) * 3 + i;
          s.insertAdjacentHTML('beforeend', '<div class="cd" style="background:linear-gradient(135deg,' + C[p - 1][0] + ',' + C[p - 1][1] + ')"><b>' + String(n + 1).padStart(2, '0') + '</b><small>' + N[n] + '</small></div>');
        }
        return s;
      }
      function x(p) { return btns[p - 1].offsetLeft; }
      function at(px) { return 'translateX(' + px + 'px)'; }
      cards.appendChild(make(4)); hl.style.transform = at(x(4));
      function go(p) {
        if (p < 1 || p > 5 || p === cur) return;
        var a = x(cur), b = x(p), dir = p > cur ? 1 : -1; cur = p;
        btns.forEach(function (bt, i) { bt.classList.toggle('on', i === p - 1); });
        cards.querySelectorAll('.old').forEach(function (s) { s.remove(); }); // interrupted mid-transition
        var old = cards.querySelector('.set'), nw = make(p); old.classList.add('old'); cards.appendChild(nw);
        hl.style.transform = at(b);
        if (api.reduce) { old.remove(); return; }
        var cs = nw.children, os = old.children;
        var path = [{ transform: at(a) }, { transform: at(b) }];
        hl.animate(path, { duration: 300, easing: 'ease-in-out' });
        for (var k = 1; k <= 4; k++) {
          var g = hl.cloneNode(); g.className = 'hl'; g.style.opacity = 0.5 - k * 0.1; hl.parentNode.insertBefore(g, hl);
          g.animate(path, { duration: 300, delay: k * 25, easing: 'ease-in-out', fill: 'both' }).onfinish = function () { this.effect.target.remove(); };
        }
        old.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 150, fill: 'forwards' }).onfinish = function () { old.remove(); };
        nw.animate([{ transform: 'scale(.85)', filter: 'blur(4px)', opacity: 0 }, { transform: 'none', filter: 'blur(0)', opacity: 1 }], { duration: 350, easing: 'ease-out' });
      }
      root.querySelector('.prev').onclick = function () { go(cur - 1); };
      root.querySelector('.next').onclick = function () { go(cur + 1); };
      btns.forEach(function (bt, i) { bt.onclick = function () { go(i + 1); }; });
      var t = setTimeout(function () { go(1); }, 600);
      return function () { clearTimeout(t); };
    }
  });

  LUZ.add({
    id: 'pagination-page-turn',
    cat: 'Menu & Navigasi',
    name: 'Page Turn',
    source: SRC,
    trigger: 'tap',
    motion: 'Panel kartu berputar 3D seperti halaman buku (rotateY 0→90° dengan perspektif, kartu tampak memipih), isinya berganti, lalu berputar masuk −90°→0. Sorotan nomor ikut membalik di sumbu vertikal saat berpindah ke nomor baru.',
    timing: 'putar keluar 200ms ease-in + masuk 250ms ease-out · sorotan 400ms',
    use: 'Pergantian halaman katalog, majalah, atau laporan yang dibaca per halaman.',
    tags: 'pagination page turn flip 3d rotateY perspective',
    allowColor: true,
    html: HTML,
    css: CSS,
    js: function (root, api) {
      var N = ['Aster', 'Briar', 'Cove', 'Dune', 'Echo', 'Fern', 'Glade', 'Haze', 'Isle', 'Jade', 'Kelp', 'Lumen', 'Moss', 'Nectar', 'Opal'];
      var C = [['#5b4bd6', '#8d7bff'], ['#2f7fd8', '#5fb0ff'], ['#d64f86', '#ff86b0'], ['#c99a2e', '#f2c45a'], ['#1e9e8a', '#3fd1b4']];
      var cur = 4, cards = root.querySelector('.cards'), hl = root.querySelector('.hl'), btns = root.querySelectorAll('.nums button');
      function make(p) { // one page = three cards
        var s = document.createElement('div'); s.className = 'set';
        for (var i = 0; i < 3; i++) {
          var n = (p - 1) * 3 + i;
          s.insertAdjacentHTML('beforeend', '<div class="cd" style="background:linear-gradient(135deg,' + C[p - 1][0] + ',' + C[p - 1][1] + ')"><b>' + String(n + 1).padStart(2, '0') + '</b><small>' + N[n] + '</small></div>');
        }
        return s;
      }
      function x(p) { return btns[p - 1].offsetLeft; }
      function at(px) { return 'translateX(' + px + 'px)'; }
      cards.appendChild(make(4)); hl.style.transform = at(x(4));
      function go(p) {
        if (p < 1 || p > 5 || p === cur) return;
        var a = x(cur), b = x(p), dir = p > cur ? 1 : -1; cur = p;
        btns.forEach(function (bt, i) { bt.classList.toggle('on', i === p - 1); });
        cards.querySelectorAll('.old').forEach(function (s) { s.remove(); }); // interrupted mid-transition
        var old = cards.querySelector('.set'), nw = make(p); old.classList.add('old'); cards.appendChild(nw);
        hl.style.transform = at(b);
        if (api.reduce) { old.remove(); return; }
        var cs = nw.children, os = old.children;
        hl.animate([{ transform: at(a) + ' rotateY(0)' }, { transform: at(a) + ' rotateY(90deg)', offset: 0.45 }, { transform: at(b) + ' rotateY(90deg)', offset: 0.55 }, { transform: at(b) + ' rotateY(0)' }], { duration: 400 });
        nw.style.visibility = 'hidden';
        cards.animate([{ transform: 'rotateY(0)' }, { transform: 'rotateY(' + dir * -90 + 'deg)' }], { duration: 200, easing: 'ease-in' }).onfinish = function () {
          old.remove(); nw.style.visibility = '';
          cards.animate([{ transform: 'rotateY(' + dir * 90 + 'deg)' }, { transform: 'rotateY(0)' }], { duration: 250, easing: 'ease-out' });
        };
      }
      root.querySelector('.prev').onclick = function () { go(cur - 1); };
      root.querySelector('.next').onclick = function () { go(cur + 1); };
      btns.forEach(function (bt, i) { bt.onclick = function () { go(i + 1); }; });
      var t = setTimeout(function () { go(1); }, 600);
      return function () { clearTimeout(t); };
    }
  });
})();
