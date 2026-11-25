/* Pull to Refresh · Part 3 — one activity feed, six refresh indicators.
   Drag the feed down (≥80px) and release, or just tap it to watch a simulated pull. */
(function () {
  var SRC = 'Pull to Refresh · Part 3';
  var FEED = [['Juno Vega', 'started a live room', '#22b8cf'], ['Theo Park', 'shared a new playlist', '#d65ad8'],
    ['Mira Hale', 'posted 3 new photos', '#7c5cff'], ['Kai Rowe', 'liked your post', '#f07a7a']];
  function row(p) {
    return '<div class="it"><i class="av" style="background:' + p[2] + '">' + p[0][0] + '</i><span class="tx"><b>' + p[0] + '</b><small>' + p[1] + '</small></span><i class="app" style="background:' + p[2] + '"></i></div>';
  }
  function html(ind) { return '<div class="pr"><div class="ind">' + ind + '</div><div class="feed">' + FEED.map(row).join('') + '</div></div>'; }
  var CSS =
    '& .pr{position:relative;width:236px;height:176px;overflow:hidden;border-radius:14px;background:var(--d-bg);border:1px solid var(--d-soft);cursor:grab;touch-action:none}' +
    '& .ind{position:absolute;left:0;right:0;top:0;height:44px;display:grid;place-items:center;pointer-events:none}' +
    '& .ind>*{grid-area:1/1}' +
    '& .feed{position:relative;padding:0 8px}' +
    '& .it{position:relative;display:flex;align-items:center;gap:9px;height:42px;padding:0 6px;border-bottom:1px solid var(--d-soft);color:var(--d-fg)}' +
    '& .it.new::after{content:"";position:absolute;inset:3px 0;border-radius:9px;border:1px solid var(--d-accent);background:var(--d-accent);opacity:.14;animation:prFade .5s 1.2s forwards}' +
    '@keyframes prFade{to{opacity:0}}' +
    '& .av{flex:none;width:22px;height:22px;border-radius:50%;display:grid;place-items:center;font-size:9.5px;font-weight:700;font-style:normal;color:#fff}' +
    '& .tx{flex:1;display:grid;line-height:1.25}& .tx b{font-size:10.5px}& .tx small{font-size:8.5px;color:var(--d-mid)}' +
    '& .app{width:20px;height:20px;border-radius:6px;opacity:.85}';

  LUZ.add({
    id: 'pullrefresh-top-line',
    cat: 'Loading & Skeleton',
    name: 'Top Line',
    source: SRC,
    trigger: 'drag',
    motion: 'Garis tipis di atas daftar tumbuh dari tengah ke dua sisi sebanding jarak tarik (scaleX 0→1). Saat dilepas, kilau cahaya berlari di sepanjang garis selama memuat; setelah selesai garis berubah teal lalu memudar, daftar memantul kembali dan pos baru muncul di atas dengan sorotan.',
    timing: 'tarik mengikuti jari · kilau 600ms linear berulang · memuat ≈700ms · selesai 300ms · daftar kembali 300ms ease-out',
    use: 'Muat ulang feed, daftar pasien, atau kotak masuk di aplikasi mobile.',
    tags: 'pull to refresh line progress shimmer loader',
    allowColor: true,
    html: html('<i class="ln"><b></b></i>'),
    css: CSS +
      '& .ind{place-items:start center;padding-top:8px}' +
      '& .ln{width:80%;height:2.5px;border-radius:2px;background:var(--d-accent);overflow:hidden;transform:scaleX(0);transition:background .2s,opacity .3s}' +
      '& .ln b{display:block;width:40%;height:100%;background:linear-gradient(90deg,transparent,#fff,transparent);opacity:0}' +
      '& .ln.run b{opacity:.9;animation:prShine .6s linear infinite}@keyframes prShine{from{transform:translateX(-100%)}to{transform:translateX(250%)}}' +
      '& .ln.ok{background:#22c3a6;opacity:0;transition-delay:0s,.2s}',
    js: function (root, api) {
      var ln = root.querySelector('.ln');
      function setP(p) { ln.style.transform = 'scaleX(' + Math.min(1, p) + ')'; }
      function load() { ln.classList.add('run'); }
      function done() { ln.classList.remove('run'); ln.classList.add('ok'); }
      function reset() { ln.className = 'ln'; ln.style.transform = 'scaleX(0)'; }
      // ---- shared pull driver ----
      var POOL = [['Kai Rowe', 'liked your post', '#f07a7a'], ['Mira Hale', 'posted 3 new photos', '#7c5cff'], ['Theo Park', 'shared a new playlist', '#d65ad8'], ['Juno Vega', 'started a live room', '#22b8cf']];
      var pr = root.querySelector('.pr'), feed = root.querySelector('.feed'), busy = false, tm = [], raf = 0, k = 0;
      function pull(p) { feed.style.transform = 'translateY(' + Math.min(p, 1.15) * 44 + 'px)'; setP(p); }
      function refresh() {
        busy = true; feed.style.transition = 'transform .2s ease-out'; pull(1); load();
        tm.push(setTimeout(function () {
          done();
          tm.push(setTimeout(function () {
            var d = POOL[k++ % 4], r = document.createElement('div');
            r.innerHTML = '<div class="it new"><i class="av" style="background:' + d[2] + '">' + d[0][0] + '</i><span class="tx"><b>' + d[0] + '</b><small>' + d[1] + '</small></span><i class="app" style="background:' + d[2] + '"></i></div>';
            feed.prepend(r.firstChild); feed.lastElementChild.remove();
            feed.style.transition = 'none'; feed.style.transform = 'translateY(2px)'; void feed.offsetHeight;
            feed.style.transition = 'transform .3s cubic-bezier(.2,.8,.2,1)'; feed.style.transform = '';
            reset(); busy = false;
          }, api.reduce ? 0 : 300));
        }, api.reduce ? 200 : 700));
      }
      function auto() {
        busy = true; feed.style.transition = 'none';
        var t0 = performance.now();
        (function f(now) { var p = Math.min(1, (now - t0) / 450); pull(p * p * (3 - 2 * p)); if (p < 1) raf = requestAnimationFrame(f); else refresh(); })(t0);
      }
      pr.onpointerdown = function (e) {
        if (busy) return;
        var y0 = e.clientY, dy = 0; pr.setPointerCapture(e.pointerId); feed.style.transition = 'none';
        pr.onpointermove = function (ev) { dy = Math.max(0, ev.clientY - y0); pull(dy / 80); };
        pr.onpointerup = pr.onpointercancel = function () {
          pr.onpointermove = pr.onpointerup = pr.onpointercancel = null;
          if (dy >= 80) refresh(); else if (dy < 6) auto(); else { feed.style.transition = 'transform .3s'; pull(0); }
        };
      };
      tm.push(setTimeout(auto, 600));
      return function () { tm.forEach(clearTimeout); cancelAnimationFrame(raf); };
    }
  });

  LUZ.add({
    id: 'pullrefresh-spring-coil',
    cat: 'Loading & Skeleton',
    name: 'Spring Coil',
    source: SRC,
    trigger: 'drag',
    motion: 'Pegas zigzag biru menggantung di atas daftar dan meregang vertikal mengikuti tarikan (scaleY 0.25→1). Saat dilepas, pegas memantul (memendek–memanjang ±2 kali, teredam) selama memuat, lalu memudar; pos baru muncul di atas.',
    timing: 'regang mengikuti jari · pantul 600ms teredam · memuat ≈700ms · pudar 300ms',
    use: 'Pull-to-refresh bergaya playful untuk aplikasi konsumen atau gamifikasi.',
    tags: 'pull to refresh spring coil bounce elastic loader',
    allowColor: true,
    html: html('<svg class="coil" viewBox="0 0 14 34"><polyline points="7,0 1,4 13,8 1,12 13,16 1,20 13,24 1,28 7,32"/></svg>'),
    css: CSS +
      '& .coil{width:14px;height:34px;margin-top:-4px;overflow:visible;transform-origin:50% 0;transform:scaleY(0);transition:opacity .3s}' +
      '& .coil polyline{fill:none;stroke:var(--d-accent);stroke-width:1.6;stroke-linejoin:round;vector-effect:non-scaling-stroke}',
    js: function (root, api) {
      var coil = root.querySelector('.coil');
      function setP(p) { coil.style.opacity = 1; coil.style.transform = 'scaleY(' + (0.25 + 0.75 * Math.min(1.1, p)) + ')'; }
      function load() { if (!api.reduce) coil.animate([{ transform: 'scaleY(1)' }, { transform: 'scaleY(.55)' }, { transform: 'scaleY(1.1)' }, { transform: 'scaleY(.8)' }, { transform: 'scaleY(1)' }], { duration: 600, easing: 'ease-out' }); }
      function done() { coil.style.opacity = 0; }
      function reset() { coil.style.transform = 'scaleY(0)'; }
      // ---- shared pull driver ----
      var POOL = [['Kai Rowe', 'liked your post', '#f07a7a'], ['Mira Hale', 'posted 3 new photos', '#7c5cff'], ['Theo Park', 'shared a new playlist', '#d65ad8'], ['Juno Vega', 'started a live room', '#22b8cf']];
      var pr = root.querySelector('.pr'), feed = root.querySelector('.feed'), busy = false, tm = [], raf = 0, k = 0;
      function pull(p) { feed.style.transform = 'translateY(' + Math.min(p, 1.15) * 44 + 'px)'; setP(p); }
      function refresh() {
        busy = true; feed.style.transition = 'transform .2s ease-out'; pull(1); load();
        tm.push(setTimeout(function () {
          done();
          tm.push(setTimeout(function () {
            var d = POOL[k++ % 4], r = document.createElement('div');
            r.innerHTML = '<div class="it new"><i class="av" style="background:' + d[2] + '">' + d[0][0] + '</i><span class="tx"><b>' + d[0] + '</b><small>' + d[1] + '</small></span><i class="app" style="background:' + d[2] + '"></i></div>';
            feed.prepend(r.firstChild); feed.lastElementChild.remove();
            feed.style.transition = 'none'; feed.style.transform = 'translateY(2px)'; void feed.offsetHeight;
            feed.style.transition = 'transform .3s cubic-bezier(.2,.8,.2,1)'; feed.style.transform = '';
            reset(); busy = false;
          }, api.reduce ? 0 : 300));
        }, api.reduce ? 200 : 700));
      }
      function auto() {
        busy = true; feed.style.transition = 'none';
        var t0 = performance.now();
        (function f(now) { var p = Math.min(1, (now - t0) / 450); pull(p * p * (3 - 2 * p)); if (p < 1) raf = requestAnimationFrame(f); else refresh(); })(t0);
      }
      pr.onpointerdown = function (e) {
        if (busy) return;
        var y0 = e.clientY, dy = 0; pr.setPointerCapture(e.pointerId); feed.style.transition = 'none';
        pr.onpointermove = function (ev) { dy = Math.max(0, ev.clientY - y0); pull(dy / 80); };
        pr.onpointerup = pr.onpointercancel = function () {
          pr.onpointermove = pr.onpointerup = pr.onpointercancel = null;
          if (dy >= 80) refresh(); else if (dy < 6) auto(); else { feed.style.transition = 'transform .3s'; pull(0); }
        };
      };
      tm.push(setTimeout(auto, 600));
      return function () { tm.forEach(clearTimeout); cancelAnimationFrame(raf); };
    }
  });

  LUZ.add({
    id: 'pullrefresh-sync-spin',
    cat: 'Loading & Skeleton',
    name: 'Sync Spin',
    source: SRC,
    trigger: 'drag',
    motion: 'Ikon refresh muncul dan berputar sebanding tarikan (0→270°, opacity 0→1). Saat dilepas, ikon berputar terus selama memuat, lalu berganti menjadi lingkaran hijau bercentang yang meletup (scale 0→1.2→1) sebelum memudar; pos baru muncul di atas.',
    timing: 'putar 600ms/putaran linear · memuat ≈700ms · centang 300ms pegas',
    use: 'Sinkronisasi data (rekam medis, jadwal) yang perlu konfirmasi “berhasil”.',
    tags: 'pull to refresh sync spinner rotate check success',
    allowColor: true,
    html: html('<svg class="sp" viewBox="0 0 20 20"><path d="M16 10a6 6 0 1 1-1.8-4.3"/><path d="M14.8 2.5v3.6h-3.6"/></svg><span class="ok">✓</span>'),
    css: CSS +
      '& .sp{width:20px;height:20px;fill:none;stroke:var(--d-accent);stroke-width:1.8;stroke-linecap:round;opacity:0}' +
      '& .ok{width:20px;height:20px;border-radius:50%;background:#1fbf8f;color:#fff;font-size:11px;font-weight:700;display:grid;place-items:center;transform:scale(0)}',
    js: function (root, api) {
      var sp = root.querySelector('.sp'), ok = root.querySelector('.ok'), spin = null;
      function setP(p) { sp.style.opacity = Math.min(1, p); sp.style.transform = 'rotate(' + Math.min(1, p) * 270 + 'deg)'; }
      function load() { spin = sp.animate([{ transform: 'rotate(270deg)' }, { transform: 'rotate(630deg)' }], { duration: api.reduce ? 1200 : 600, iterations: Infinity }); }
      function done() {
        if (spin) spin.cancel(); sp.style.opacity = 0;
        ok.animate([{ transform: 'scale(0)' }, { transform: 'scale(1.2)', offset: 0.6 }, { transform: 'scale(1)' }], { duration: 300, easing: 'ease-out', fill: 'forwards' });
      }
      function reset() { ok.getAnimations().forEach(function (a) { a.cancel(); }); setP(0); }
      // ---- shared pull driver ----
      var POOL = [['Kai Rowe', 'liked your post', '#f07a7a'], ['Mira Hale', 'posted 3 new photos', '#7c5cff'], ['Theo Park', 'shared a new playlist', '#d65ad8'], ['Juno Vega', 'started a live room', '#22b8cf']];
      var pr = root.querySelector('.pr'), feed = root.querySelector('.feed'), busy = false, tm = [], raf = 0, k = 0;
      function pull(p) { feed.style.transform = 'translateY(' + Math.min(p, 1.15) * 44 + 'px)'; setP(p); }
      function refresh() {
        busy = true; feed.style.transition = 'transform .2s ease-out'; pull(1); load();
        tm.push(setTimeout(function () {
          done();
          tm.push(setTimeout(function () {
            var d = POOL[k++ % 4], r = document.createElement('div');
            r.innerHTML = '<div class="it new"><i class="av" style="background:' + d[2] + '">' + d[0][0] + '</i><span class="tx"><b>' + d[0] + '</b><small>' + d[1] + '</small></span><i class="app" style="background:' + d[2] + '"></i></div>';
            feed.prepend(r.firstChild); feed.lastElementChild.remove();
            feed.style.transition = 'none'; feed.style.transform = 'translateY(2px)'; void feed.offsetHeight;
            feed.style.transition = 'transform .3s cubic-bezier(.2,.8,.2,1)'; feed.style.transform = '';
            reset(); busy = false;
          }, api.reduce ? 0 : 300));
        }, api.reduce ? 200 : 700));
      }
      function auto() {
        busy = true; feed.style.transition = 'none';
        var t0 = performance.now();
        (function f(now) { var p = Math.min(1, (now - t0) / 450); pull(p * p * (3 - 2 * p)); if (p < 1) raf = requestAnimationFrame(f); else refresh(); })(t0);
      }
      pr.onpointerdown = function (e) {
        if (busy) return;
        var y0 = e.clientY, dy = 0; pr.setPointerCapture(e.pointerId); feed.style.transition = 'none';
        pr.onpointermove = function (ev) { dy = Math.max(0, ev.clientY - y0); pull(dy / 80); };
        pr.onpointerup = pr.onpointercancel = function () {
          pr.onpointermove = pr.onpointerup = pr.onpointercancel = null;
          if (dy >= 80) refresh(); else if (dy < 6) auto(); else { feed.style.transition = 'transform .3s'; pull(0); }
        };
      };
      tm.push(setTimeout(auto, 600));
      return function () { tm.forEach(clearTimeout); cancelAnimationFrame(raf); };
    }
  });

  LUZ.add({
    id: 'pullrefresh-chevron-stack',
    cat: 'Loading & Skeleton',
    name: 'Chevron Stack',
    source: SRC,
    trigger: 'drag',
    motion: 'Tiga chevron bertumpuk menyala satu per satu dari atas ke bawah seiring tarikan (abu-abu → aksen). Saat dilepas, cahaya berlari turun melewati ketiganya dua kali; setelah selesai, ketiganya merapat menjadi satu chevron lalu memudar.',
    timing: 'nyala per ⅓ tarikan · lari cahaya 2× (300ms, stagger 100ms) · rapat 300ms',
    use: 'Petunjuk arah tarik yang jelas untuk pengguna baru, misalnya daftar antrean.',
    tags: 'pull to refresh chevron arrows sequence light hint',
    allowColor: true,
    html: html('<span class="chv"><svg viewBox="0 0 12 6"><polyline points="1,1 6,5 11,1"/></svg><svg viewBox="0 0 12 6"><polyline points="1,1 6,5 11,1"/></svg><svg viewBox="0 0 12 6"><polyline points="1,1 6,5 11,1"/></svg></span>'),
    css: CSS +
      '& .chv{display:grid;gap:1px}& .chv svg{width:14px;height:7px;fill:none;stroke:var(--d-mid);stroke-width:1.6;stroke-linecap:round;opacity:0;transition:stroke .15s,opacity .15s}' +
      '& .chv svg.on{stroke:var(--d-accent);opacity:1}',
    js: function (root, api) {
      var ch = root.querySelectorAll('.chv svg');
      function setP(p) { ch.forEach(function (c, i) { c.style.opacity = p > 0.05 ? 1 : 0; c.classList.toggle('on', p > (i + 1) / 3.2); }); }
      function load() { if (!api.reduce) ch.forEach(function (c, i) { c.animate([{ opacity: 1 }, { opacity: 0.25 }, { opacity: 1 }], { duration: 300, delay: i * 100, iterations: 2 }); }); }
      function done() { ch.forEach(function (c, i) { c.animate([{ transform: 'none', opacity: 1 }, { transform: 'translateY(' + (1 - i) * 8 + 'px)', opacity: 0 }], { duration: 300, easing: 'ease-in', fill: 'forwards' }); }); }
      function reset() { ch.forEach(function (c) { c.getAnimations().forEach(function (a) { a.cancel(); }); }); setP(0); }
      // ---- shared pull driver ----
      var POOL = [['Kai Rowe', 'liked your post', '#f07a7a'], ['Mira Hale', 'posted 3 new photos', '#7c5cff'], ['Theo Park', 'shared a new playlist', '#d65ad8'], ['Juno Vega', 'started a live room', '#22b8cf']];
      var pr = root.querySelector('.pr'), feed = root.querySelector('.feed'), busy = false, tm = [], raf = 0, k = 0;
      function pull(p) { feed.style.transform = 'translateY(' + Math.min(p, 1.15) * 44 + 'px)'; setP(p); }
      function refresh() {
        busy = true; feed.style.transition = 'transform .2s ease-out'; pull(1); load();
        tm.push(setTimeout(function () {
          done();
          tm.push(setTimeout(function () {
            var d = POOL[k++ % 4], r = document.createElement('div');
            r.innerHTML = '<div class="it new"><i class="av" style="background:' + d[2] + '">' + d[0][0] + '</i><span class="tx"><b>' + d[0] + '</b><small>' + d[1] + '</small></span><i class="app" style="background:' + d[2] + '"></i></div>';
            feed.prepend(r.firstChild); feed.lastElementChild.remove();
            feed.style.transition = 'none'; feed.style.transform = 'translateY(2px)'; void feed.offsetHeight;
            feed.style.transition = 'transform .3s cubic-bezier(.2,.8,.2,1)'; feed.style.transform = '';
            reset(); busy = false;
          }, api.reduce ? 0 : 300));
        }, api.reduce ? 200 : 700));
      }
      function auto() {
        busy = true; feed.style.transition = 'none';
        var t0 = performance.now();
        (function f(now) { var p = Math.min(1, (now - t0) / 450); pull(p * p * (3 - 2 * p)); if (p < 1) raf = requestAnimationFrame(f); else refresh(); })(t0);
      }
      pr.onpointerdown = function (e) {
        if (busy) return;
        var y0 = e.clientY, dy = 0; pr.setPointerCapture(e.pointerId); feed.style.transition = 'none';
        pr.onpointermove = function (ev) { dy = Math.max(0, ev.clientY - y0); pull(dy / 80); };
        pr.onpointerup = pr.onpointercancel = function () {
          pr.onpointermove = pr.onpointerup = pr.onpointercancel = null;
          if (dy >= 80) refresh(); else if (dy < 6) auto(); else { feed.style.transition = 'transform .3s'; pull(0); }
        };
      };
      tm.push(setTimeout(auto, 600));
      return function () { tm.forEach(clearTimeout); cancelAnimationFrame(raf); };
    }
  });

  LUZ.add({
    id: 'pullrefresh-avatar-drop',
    cat: 'Loading & Skeleton',
    name: 'Avatar Drop',
    source: SRC,
    trigger: 'drag',
    motion: 'Avatar penulis pos berikutnya (lingkaran berwarna + titik hijau) mengintip turun dari atas seiring tarikan (translateY −24px→0, opacity 0→1). Saat dilepas avatar berdenyut selama memuat, lalu jatuh ke baris barunya yang meluncur masuk di puncak daftar.',
    timing: 'intip mengikuti jari · denyut 600ms · jatuh 300ms ease-in · baris baru 300ms ease-out',
    use: 'Feed sosial atau chat: memberi petunjuk siapa yang punya kabar baru.',
    tags: 'pull to refresh avatar peek drop new post feed',
    allowColor: true,
    html: html('<i class="peek av"></i>'),
    css: CSS +
      '& .peek{position:relative;opacity:0}& .peek::after{content:"";position:absolute;right:-1px;bottom:-1px;width:7px;height:7px;border-radius:50%;background:#22c55e;border:1.5px solid var(--d-bg)}',
    js: function (root, api) {
      var pk = root.querySelector('.peek'), nx = [['K', '#f07a7a'], ['M', '#7c5cff'], ['T', '#d65ad8'], ['J', '#22b8cf']], n = 0;
      function setP(p) { var q = Math.min(1, p); pk.style.opacity = q; pk.style.transform = 'translateY(' + (q - 1) * 24 + 'px)'; }
      function load() { if (!api.reduce) pk.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.12)' }, { transform: 'scale(1)' }], { duration: 600 }); }
      function done() { pk.animate([{ transform: 'none', opacity: 1 }, { transform: 'translateY(30px) scale(.9)', opacity: 0 }], { duration: 300, easing: 'ease-in', fill: 'forwards' }); }
      function reset() { pk.getAnimations().forEach(function (a) { a.cancel(); }); n++; pk.textContent = nx[n % 4][0]; pk.style.background = nx[n % 4][1]; setP(0); }
      pk.textContent = 'K'; pk.style.background = '#f07a7a';
      // ---- shared pull driver ----
      var POOL = [['Kai Rowe', 'liked your post', '#f07a7a'], ['Mira Hale', 'posted 3 new photos', '#7c5cff'], ['Theo Park', 'shared a new playlist', '#d65ad8'], ['Juno Vega', 'started a live room', '#22b8cf']];
      var pr = root.querySelector('.pr'), feed = root.querySelector('.feed'), busy = false, tm = [], raf = 0, k = 0;
      function pull(p) { feed.style.transform = 'translateY(' + Math.min(p, 1.15) * 44 + 'px)'; setP(p); }
      function refresh() {
        busy = true; feed.style.transition = 'transform .2s ease-out'; pull(1); load();
        tm.push(setTimeout(function () {
          done();
          tm.push(setTimeout(function () {
            var d = POOL[k++ % 4], r = document.createElement('div');
            r.innerHTML = '<div class="it new"><i class="av" style="background:' + d[2] + '">' + d[0][0] + '</i><span class="tx"><b>' + d[0] + '</b><small>' + d[1] + '</small></span><i class="app" style="background:' + d[2] + '"></i></div>';
            feed.prepend(r.firstChild); feed.lastElementChild.remove();
            feed.style.transition = 'none'; feed.style.transform = 'translateY(2px)'; void feed.offsetHeight;
            feed.style.transition = 'transform .3s cubic-bezier(.2,.8,.2,1)'; feed.style.transform = '';
            reset(); busy = false;
          }, api.reduce ? 0 : 300));
        }, api.reduce ? 200 : 700));
      }
      function auto() {
        busy = true; feed.style.transition = 'none';
        var t0 = performance.now();
        (function f(now) { var p = Math.min(1, (now - t0) / 450); pull(p * p * (3 - 2 * p)); if (p < 1) raf = requestAnimationFrame(f); else refresh(); })(t0);
      }
      pr.onpointerdown = function (e) {
        if (busy) return;
        var y0 = e.clientY, dy = 0; pr.setPointerCapture(e.pointerId); feed.style.transition = 'none';
        pr.onpointermove = function (ev) { dy = Math.max(0, ev.clientY - y0); pull(dy / 80); };
        pr.onpointerup = pr.onpointercancel = function () {
          pr.onpointermove = pr.onpointerup = pr.onpointercancel = null;
          if (dy >= 80) refresh(); else if (dy < 6) auto(); else { feed.style.transition = 'transform .3s'; pull(0); }
        };
      };
      tm.push(setTimeout(auto, 600));
      return function () { tm.forEach(clearTimeout); cancelAnimationFrame(raf); };
    }
  });

  LUZ.add({
    id: 'pullrefresh-logo-trace',
    cat: 'Loading & Skeleton',
    name: 'Logo Trace',
    source: SRC,
    trigger: 'drag',
    motion: 'Garis luar logo heksagon tergambar sedikit demi sedikit seiring tarikan (stroke-dashoffset 1→0). Saat dilepas, logo terisi warna aksen dengan titik putih di tengah dan berputar 60°, lalu mengecil dan hilang ketika pos baru masuk.',
    timing: 'gambar mengikuti jari · isi + putar 500ms ease-in-out · kecil 250ms ease-in',
    use: 'Pull-to-refresh bermerek: logo klinik/aplikasi sebagai indikator.',
    tags: 'pull to refresh logo trace stroke draw brand hexagon',
    allowColor: true,
    html: html('<svg class="hex" viewBox="0 0 24 24"><path pathLength="1" d="M12 2 20.7 7v10L12 22l-8.7-5V7z"/><circle cx="12" cy="12" r="2.6"/></svg>'),
    css: CSS +
      '& .hex{width:22px;height:22px;overflow:visible}' +
      '& .hex path{fill:var(--d-accent);fill-opacity:0;stroke:var(--d-accent);stroke-width:1.8;stroke-linejoin:round;stroke-dasharray:1;stroke-dashoffset:1;transition:fill-opacity .3s}' +
      '& .hex circle{fill:var(--d-bg);opacity:0;transition:opacity .3s}& .hex.full path{fill-opacity:1}& .hex.full circle{opacity:1}',
    js: function (root, api) {
      var hex = root.querySelector('.hex'), path = hex.querySelector('path');
      function setP(p) { path.style.strokeDashoffset = 1 - Math.min(1, p); }
      function load() { hex.classList.add('full'); if (!api.reduce) hex.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(60deg)' }], { duration: 500, easing: 'ease-in-out', fill: 'forwards' }); }
      function done() { hex.animate([{ transform: 'rotate(60deg) scale(1)', opacity: 1 }, { transform: 'rotate(60deg) scale(0)', opacity: 0 }], { duration: 250, easing: 'ease-in', fill: 'forwards' }); }
      function reset() { hex.getAnimations().forEach(function (a) { a.cancel(); }); hex.classList.remove('full'); setP(0); }
      // ---- shared pull driver ----
      var POOL = [['Kai Rowe', 'liked your post', '#f07a7a'], ['Mira Hale', 'posted 3 new photos', '#7c5cff'], ['Theo Park', 'shared a new playlist', '#d65ad8'], ['Juno Vega', 'started a live room', '#22b8cf']];
      var pr = root.querySelector('.pr'), feed = root.querySelector('.feed'), busy = false, tm = [], raf = 0, k = 0;
      function pull(p) { feed.style.transform = 'translateY(' + Math.min(p, 1.15) * 44 + 'px)'; setP(p); }
      function refresh() {
        busy = true; feed.style.transition = 'transform .2s ease-out'; pull(1); load();
        tm.push(setTimeout(function () {
          done();
          tm.push(setTimeout(function () {
            var d = POOL[k++ % 4], r = document.createElement('div');
            r.innerHTML = '<div class="it new"><i class="av" style="background:' + d[2] + '">' + d[0][0] + '</i><span class="tx"><b>' + d[0] + '</b><small>' + d[1] + '</small></span><i class="app" style="background:' + d[2] + '"></i></div>';
            feed.prepend(r.firstChild); feed.lastElementChild.remove();
            feed.style.transition = 'none'; feed.style.transform = 'translateY(2px)'; void feed.offsetHeight;
            feed.style.transition = 'transform .3s cubic-bezier(.2,.8,.2,1)'; feed.style.transform = '';
            reset(); busy = false;
          }, api.reduce ? 0 : 300));
        }, api.reduce ? 200 : 700));
      }
      function auto() {
        busy = true; feed.style.transition = 'none';
        var t0 = performance.now();
        (function f(now) { var p = Math.min(1, (now - t0) / 450); pull(p * p * (3 - 2 * p)); if (p < 1) raf = requestAnimationFrame(f); else refresh(); })(t0);
      }
      pr.onpointerdown = function (e) {
        if (busy) return;
        var y0 = e.clientY, dy = 0; pr.setPointerCapture(e.pointerId); feed.style.transition = 'none';
        pr.onpointermove = function (ev) { dy = Math.max(0, ev.clientY - y0); pull(dy / 80); };
        pr.onpointerup = pr.onpointercancel = function () {
          pr.onpointermove = pr.onpointerup = pr.onpointercancel = null;
          if (dy >= 80) refresh(); else if (dy < 6) auto(); else { feed.style.transition = 'transform .3s'; pull(0); }
        };
      };
      tm.push(setTimeout(auto, 600));
      return function () { tm.forEach(clearTimeout); cancelAnimationFrame(raf); };
    }
  });
})();
