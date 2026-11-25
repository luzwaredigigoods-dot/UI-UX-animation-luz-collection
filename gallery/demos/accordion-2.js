/* Accordion · Part 2 — expand all, side panels, step timeline, accent bar, price breakdown, chart reveal.
   Bodies open with the grid-template-rows 0fr → 1fr trick so height can be animated without measuring. */
(function () {
  var src = 'Accordion · Part 2';
  var cat = 'List & Gesture';
  var box = '& .bx{width:232px;padding:12px;border-radius:16px;background:var(--d-bg);box-shadow:0 0 0 1px var(--d-soft);font-size:10.5px;color:var(--d-fg)}' +
    '& .bd{display:grid;grid-template-rows:0fr;transition:grid-template-rows 280ms cubic-bezier(.2,.8,.2,1)}& .bd>div{overflow:hidden;min-height:0}' +
    '& .open>.bd{grid-template-rows:1fr}' +
    '& .chv{display:inline-block;transition:transform 280ms ease;color:var(--d-mid)}& .open .chv{transform:rotate(180deg)}';

  LUZ.add({
    id: 'accordion-expand-all', cat: cat, name: 'Expand All', source: src, trigger: 'tap',
    motion: 'Tombol "Expand all" membuka baris Overview, Ingredients, Steps satu per satu dari atas ke bawah (jeda 80ms), chevron berputar 180° dan teks isi turun 4px sambil muncul. "Collapse all" menutup dengan urutan terbalik, dari bawah ke atas.',
    timing: 'tiap baris ≈280ms cubic-bezier(.2,.8,.2,1) · stagger 80ms',
    use: 'buka/tutup semua bagian rekam medis atau FAQ sekaligus',
    tags: 'accordion expand all collapse stagger sequence rows',
    html: '<div class="bx ea"><div class="hd"><b>Recipe</b><button type="button" class="all">Expand all</button></div>' +
      [['Overview', 'A quick soup for cold evenings.'], ['Ingredients', 'Carrots, ginger, onion, stock.'], ['Steps', 'Cook 20 min, then blend smooth.']].map(function (r) {
        return '<div class="rw"><div class="rh">' + r[0] + '<i class="chv">⌄</i></div><div class="bd"><div><p>' + r[1] + '</p></div></div></div>';
      }).join('') + '</div>',
    css: box + '& .ea{display:grid;gap:6px}& .hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:2px}' +
      '& .all{border:0;border-radius:99px;padding:6px 10px;background:var(--d-accent);color:var(--d-bg);font:600 9.5px inherit;cursor:pointer}' +
      '& .rw{border-radius:9px;background:var(--d-soft);padding:7px 9px}& .rh{display:flex;justify-content:space-between}' +
      '& .bd p{margin:4px 0 0;color:var(--d-mid);font-size:9.5px;transform:translateY(-4px);opacity:0;transition:transform .28s,opacity .28s}& .open p{transform:none;opacity:1}',
    js: function (root, api) {
      var rows = root.querySelectorAll('.rw'), btn = root.querySelector('.all'), on = false, t = [];
      function set(o) {
        on = o; btn.textContent = o ? 'Collapse all' : 'Expand all';
        rows.forEach(function (r, i) {
          var d = api.reduce ? 0 : (o ? i : rows.length - 1 - i) * 80;
          r.querySelector('.bd').style.transitionDelay = r.querySelector('p').style.transitionDelay = r.querySelector('.chv').style.transitionDelay = d + 'ms';
          r.classList.toggle('open', o);
        });
      }
      btn.onclick = function () { set(!on); };
      t.push(setTimeout(function () { set(true); }, 600), setTimeout(function () { set(false); }, 2200));
      return function () { t.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'accordion-side-panels', cat: cat, name: 'Side Panels', source: src, trigger: 'tap', allowColor: true,
    motion: 'Empat panel berdiri berdampingan. Panel yang diketuk melebar (flex-grow 1 → 6) sementara panel yang tadinya terbuka melipat jadi strip tipis dengan label vertikal. Judul dan "n trails" muncul setelah lebar hampir selesai.',
    timing: 'lebar ≈460ms cubic-bezier(.65,0,.35,1) · teks fade 200ms delay 200ms',
    use: 'memilih satu kategori dari beberapa dengan pratinjau, mis. pilih poli/klinik',
    tags: 'accordion horizontal side panels flex expand gallery',
    html: '<div class="sp">' + [['pk', 'Peaks', 12], ['cs', 'Coast', 8], ['md', 'Meadow', 15], ['fr', 'Forest', 10]].map(function (p, i) {
      return '<button type="button" class="pn ' + p[0] + (i === 0 ? ' open' : '') + '"><span class="v">' + p[1] + '</span><span class="ti"><b>' + p[1] + '</b><small>' + p[2] + ' trails</small></span></button>';
    }).join('') + '</div>',
    css: '& .sp{display:flex;gap:6px;width:236px;height:130px}' +
      '& .pn{position:relative;flex:1;min-width:0;border:0;border-radius:12px;overflow:hidden;cursor:pointer;color:#fff;padding:0;transition:flex-grow 460ms cubic-bezier(.65,0,.35,1)}& .pn.open{flex-grow:6}' +
      '& .pk{background:radial-gradient(circle at 65% 35%,#ffc27a 0 9%,transparent 10%),linear-gradient(150deg,transparent 58%,#3b2a7a 59%),linear-gradient(#5b3fb8,#c06bd6)}' +
      '& .cs{background:linear-gradient(#1b2f7a,#2f6fe0)}& .md{background:radial-gradient(circle at 40% 55%,#ff6b9a 0 9%,transparent 10%),radial-gradient(circle at 65% 38%,#ffd24a 0 11%,transparent 12%),linear-gradient(#17493a,#1f7a55)}' +
      '& .fr{background:linear-gradient(160deg,transparent 60%,#0d3020 61%),linear-gradient(#123d2c,#1b5e40)}' +
      '& .v{position:absolute;left:50%;bottom:10px;transform:translateX(-50%) rotate(-90deg);transform-origin:center;white-space:nowrap;font-size:9px;font-weight:600;transition:opacity .2s}' +
      '& .ti{position:absolute;left:10px;bottom:8px;text-align:left;opacity:0;transition:opacity .2s}& .ti small{display:block;font-size:8.5px;opacity:.8}' +
      '& .open .v{opacity:0}& .open .ti{opacity:1;transition-delay:.2s}',
    js: function (root, api) {
      var ps = root.querySelectorAll('.pn'), t = [];
      if (api.reduce) ps.forEach(function (p) { p.style.transition = 'none'; });
      function open(i) { ps.forEach(function (p, j) { p.classList.toggle('open', j === i); }); }
      ps.forEach(function (p, i) { p.onclick = function () { open(i); }; });
      t.push(setTimeout(function () { open(2); }, 600), setTimeout(function () { open(0); }, 2000));
      return function () { t.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'accordion-step-timeline', cat: cat, name: 'Step Timeline', source: src, trigger: 'tap',
    motion: 'Stepper vertikal: tekan "Continue" → isi langkah aktif menutup, lingkarannya terisi dan muncul ✓ dengan pop (scale 0.4 → 1.15 → 1), garis penghubung terisi dari atas ke bawah, lalu langkah berikut aktif (cincin aksen) dan isinya terbuka. "Back" membalik urutan.',
    timing: 'tutup 280ms · ✓ pop 260ms · garis 240ms · buka langkah berikut 280ms (total ≈600ms)',
    use: 'alur checkout atau pendaftaran pasien bertahap (data diri → jadwal → pembayaran)',
    tags: 'stepper timeline accordion checkout progress steps tick',
    html: '<div class="bx tl">' +
      '<div class="st done"><i class="dt">✓</i><b>Cart</b><span class="ln"></span></div>' +
      '<div class="st open a"><i class="dt">✓</i><b>Address</b><span class="ln"></span><div class="bd"><div><p>12 Park Lane, Apt 4</p><button type="button" class="go">Continue</button></div></div></div>' +
      '<div class="st b"><i class="dt">✓</i><b>Payment</b><div class="bd"><div><p>Card •••• 2047</p><button type="button" class="go">Pay $48</button><button type="button" class="back">Back</button></div></div></div>' +
      '</div>',
    css: box + '& .tl{display:grid;gap:10px}& .st{position:relative;display:grid;grid-template-columns:18px 1fr;column-gap:10px;align-items:center}' +
      '& .st>.bd{grid-column:2}& .st b{font-weight:600}' +
      '& .dt{width:16px;height:16px;border-radius:50%;box-shadow:inset 0 0 0 1.5px var(--d-mid);display:grid;place-items:center;font-style:normal;font-size:9px;color:transparent;transition:box-shadow .2s,background .2s}' +
      '& .st.open .dt{box-shadow:inset 0 0 0 2px var(--d-accent)}& .st.done .dt{background:var(--d-accent);color:var(--d-bg);box-shadow:none}' +
      '& .ln{position:absolute;left:7.5px;top:18px;height:calc(100% - 8px);width:1.5px;background:var(--d-soft)}' +
      '& .ln::after{content:"";position:absolute;inset:0;background:var(--d-accent);transform-origin:top;transform:scaleY(0);transition:transform 240ms ease-out}& .done>.ln::after{transform:none}' +
      '& .bd p{margin:4px 0 6px;color:var(--d-mid);font-size:9.5px}' +
      '& .go{border:0;border-radius:99px;padding:6px 12px;background:var(--d-accent);color:var(--d-bg);font:600 9.5px inherit;cursor:pointer}' +
      '& .back{border:0;background:none;color:var(--d-accent);font:600 9.5px inherit;cursor:pointer;margin-left:6px}',
    js: function (root, api) {
      var a = root.querySelector('.a'), b = root.querySelector('.b'), t = [], k = api.reduce ? 0.01 : 1, step = 0;
      function pop(el) { el.querySelector('.dt').animate([{ transform: 'scale(.4)' }, { transform: 'scale(1.15)' }, { transform: 'scale(1)' }], { duration: 260 * k, easing: 'ease-out' }); }
      function next() {
        if (step) return; step = 1;
        a.classList.remove('open');
        t.push(setTimeout(function () { a.classList.add('done'); pop(a); }, 200 * k), setTimeout(function () { b.classList.add('open'); }, 420 * k));
      }
      function back() {
        if (!step) return; step = 0;
        b.classList.remove('open');
        t.push(setTimeout(function () { a.classList.remove('done'); a.classList.add('open'); }, 240 * k));
      }
      root.querySelectorAll('.go')[0].onclick = next;
      root.querySelectorAll('.go')[1].onclick = back;
      root.querySelector('.back').onclick = back;
      t.push(setTimeout(next, 600), setTimeout(back, 2400));
      return function () { t.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'accordion-accent-bar', cat: cat, name: 'Accent Bar', source: src, trigger: 'tap',
    motion: 'Membuka baris memunculkan bar aksen 3px di sisi kirinya yang tumbuh dari atas ke bawah (scaleY 0 → 1), nomor baris "02" berubah warna aksen, latar baris menerang, chevron berputar 180°, dan isi terbuka. Menutup = bar menyusut ke atas.',
    timing: 'bar & isi ≈300ms cubic-bezier(.2,.8,.2,1)',
    use: 'daftar tahapan proyek atau protokol klinis bernomor yang bisa dibuka satu per satu',
    tags: 'accordion accent bar indicator number highlight row expand',
    html: '<div class="bx ab">' + [['01', 'Design', 'Sketch the flows and screens. 1 week · 2 people'], ['02', 'Build', 'Code each screen, then connect them. 2 weeks · 3 people'], ['03', 'Launch', 'Ship, watch the metrics, fix fast. 1 week · 4 people']].map(function (r) {
      return '<div class="rw"><i class="br"></i><button type="button" class="rh"><span class="no">' + r[0] + '</span>' + r[1] + '<i class="chv">⌄</i></button><div class="bd"><div><p>' + r[2] + '</p></div></div></div>';
    }).join('') + '</div>',
    css: box + '& .ab{display:grid;gap:2px}& .rw{position:relative;border-radius:8px;padding:0 8px 0 12px;transition:background .3s}& .rw.open{background:var(--d-soft)}' +
      '& .rh{display:flex;gap:8px;width:100%;align-items:center;border:0;background:none;color:inherit;font:inherit;padding:9px 0;cursor:pointer;text-align:left}& .rh .chv{margin-left:auto}' +
      '& .no{color:var(--d-mid);font-size:9px;transition:color .3s}& .open .no{color:var(--d-accent)}' +
      '& .br{position:absolute;left:0;top:4px;bottom:4px;width:3px;border-radius:2px;background:linear-gradient(var(--d-accent),transparent);transform:scaleY(0);transform-origin:top;transition:transform 300ms cubic-bezier(.2,.8,.2,1)}& .open .br{transform:none}' +
      '& .bd p{margin:0 0 8px 22px;color:var(--d-mid);font-size:9.5px}',
    js: function (root, api) {
      var rows = root.querySelectorAll('.rw'), t = [];
      if (api.reduce) root.querySelectorAll('.br,.bd').forEach(function (e) { e.style.transition = 'none'; });
      function tog(i) { rows.forEach(function (r, j) { r.classList.toggle('open', j === i && !r.classList.contains('open')); }); }
      rows.forEach(function (r, i) { r.querySelector('.rh').onclick = function () { tog(i); }; });
      t.push(setTimeout(function () { tog(1); }, 600), setTimeout(function () { tog(1); }, 2300));
      return function () { t.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'accordion-price-breakdown', cat: cat, name: 'Price Breakdown', source: src, trigger: 'tap',
    motion: 'Ketuk baris Total: kartu terbuka, baris Subtotal, Shipping, Tax, Discount turun 6px dan muncul berurutan (jeda 50ms), lalu tiap nominal menghitung naik dari $0 ke nilainya. Chevron berputar. Ketuk lagi untuk menutup.',
    timing: 'buka 280ms · stagger 50ms · hitung naik ≈550ms ease-out (cubic)',
    use: 'rincian tagihan pasien atau biaya tindakan yang bisa dibuka dari total',
    tags: 'accordion price breakdown count up number receipt total',
    html: '<div class="bx pb"><button type="button" class="rh"><span>Total</span><b>$128.40</b><i class="chv">⌄</i></button><div class="bd"><div>' +
      [['Subtotal', 112], ['Shipping', 6.9], ['Tax', 14.5], ['Discount', -5]].map(function (l) { return '<p><span>' + l[0] + '</span><span class="n" data-v="' + l[1] + '">$0.00</span></p>'; }).join('') + '</div></div></div>',
    css: box + '& .rh{display:flex;gap:8px;width:100%;align-items:center;border:0;background:none;color:inherit;font:inherit;padding:4px 0;cursor:pointer}& .rh b{margin-left:auto;font-size:13px}' +
      '& .bd p{display:flex;justify-content:space-between;margin:6px 0 0;color:var(--d-mid);opacity:0;transform:translateY(-6px);transition:opacity .25s,transform .25s}& .open p{opacity:1;transform:none}& .n{color:var(--d-fg);font-variant-numeric:tabular-nums}',
    js: function (root, api) {
      var pb = root.querySelector('.pb'), ps = root.querySelectorAll('.bd p'), t = [], raf;
      function count() {
        var t0 = performance.now(), D = api.reduce ? 1 : 550;
        cancelAnimationFrame(raf);
        (function f(now) {
          var p = Math.min(1, (now - t0) / D), e = 1 - Math.pow(1 - p, 3);
          ps.forEach(function (q) { var n = q.querySelector('.n'), v = +n.dataset.v * e; n.textContent = (v < 0 ? '-$' : '$') + Math.abs(v).toFixed(2); });
          if (p < 1) raf = requestAnimationFrame(f);
        })(t0);
      }
      function tog() {
        var o = pb.classList.toggle('open');
        ps.forEach(function (p, i) { p.style.transitionDelay = (o && !api.reduce ? 120 + i * 50 : 0) + 'ms'; });
        if (o) count();
      }
      root.querySelector('.rh').onclick = tog;
      t.push(setTimeout(tog, 600), setTimeout(tog, 2400));
      return function () { t.forEach(clearTimeout); cancelAnimationFrame(raf); };
    }
  });

  LUZ.add({
    id: 'accordion-chart-reveal', cat: cat, name: 'Chart Reveal', source: src, trigger: 'tap', allowColor: true,
    motion: 'Baris statistik "Views this week 4.2k ▲12%" terbuka menjadi grafik batang: 7 batang (M–S) tumbuh dari garis dasar (scaleY 0 → 1) berurutan kiri ke kanan dengan jeda 60ms dan overshoot kecil; batang tertinggi (Sabtu) bergradasi aksen. Menutup = batang menyusut lalu baris menutup.',
    timing: 'buka 280ms · tiap batang 320ms cubic-bezier(.34,1.56,.64,1) · stagger 60ms',
    use: 'ringkasan statistik di dasbor yang bisa dibuka, mis. kunjungan pasien per hari',
    tags: 'accordion chart reveal bar chart grow stagger stats',
    html: '<div class="bx cr"><button type="button" class="rh"><span>Views this week</span><b>4.2k</b><small>▲12%</small><i class="chv">⌄</i></button><div class="bd"><div><div class="ch">' +
      [40, 62, 36, 74, 58, 100, 30].map(function (h, i) { return '<i' + (i === 5 ? ' class="hi"' : '') + ' style="height:' + h + '%"></i>'; }).join('') + '</div><div class="dy"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div></div></div></div>',
    css: box + '& .rh{display:flex;gap:6px;width:100%;align-items:center;border:0;background:none;color:inherit;font:inherit;padding:4px 0;cursor:pointer}& .rh b{margin-left:auto}& .rh small{color:#2fbf8f;font-size:9px}' +
      '& .ch{display:flex;align-items:flex-end;gap:8px;height:70px;padding:10px 4px 0}& .ch i{flex:1;border-radius:4px 4px 2px 2px;background:var(--d-soft);transform:scaleY(0);transform-origin:bottom}& .ch i.hi{background:linear-gradient(#6aa8ff,#5b5cff)}' +
      '& .dy{display:flex;gap:8px;padding:4px 4px 0;color:var(--d-mid);font-size:8px}& .dy span{flex:1;text-align:center}',
    js: function (root, api) {
      var cr = root.querySelector('.cr'), bars = root.querySelectorAll('.ch i'), t = [], k = api.reduce ? 0.01 : 1;
      function tog() {
        var o = !cr.classList.contains('open');
        if (o) cr.classList.add('open');
        bars.forEach(function (b, i) {
          b.animate([{ transform: 'scaleY(' + (o ? 0 : 1) + ')' }, { transform: 'scaleY(' + (o ? 1 : 0) + ')' }],
            { duration: (o ? 320 : 180) * k, delay: (o ? 140 + i * 60 : 0) * k, easing: o ? 'cubic-bezier(.34,1.56,.64,1)' : 'ease-in', fill: 'both' });
        });
        if (!o) t.push(setTimeout(function () { cr.classList.remove('open'); }, 160 * k));
      }
      root.querySelector('.rh').onclick = tog;
      t.push(setTimeout(tog, 600), setTimeout(tog, 2600));
      return function () { t.forEach(clearTimeout); };
    }
  });
})();
