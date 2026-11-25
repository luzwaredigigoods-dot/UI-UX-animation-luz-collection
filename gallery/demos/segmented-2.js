/* Segmented Control · Part 2 — six size pickers (S / M / L / XL). */
(function () {
  var src = 'Segmented Control · Part 2';
  var cat = 'Tombol & Toggle';
  var segs = '<button type="button">S</button><button type="button">M</button><button type="button">L</button><button type="button">XL</button>';
  var segCss =
    '& .seg{position:relative;display:grid;grid-template-columns:repeat(4,46px);padding:4px;border-radius:99px;background:var(--d-soft)}' +
    '& .seg button{position:relative;z-index:1;height:32px;border:0;background:none;color:var(--d-mid);font:600 11px/1 inherit;cursor:pointer;transition:color .2s}' +
    '& .seg button.on{color:var(--d-fg)}' +
    '& .pill{position:absolute;left:4px;top:4px;width:46px;height:32px;border-radius:99px;pointer-events:none}';

  LUZ.add({
    id: 'segment-outline-glide', cat: cat, name: 'Outline Glide', source: src, trigger: 'tap', allowColor: true,
    motion: 'Tidak ada isian, hanya outline pill bergradasi aksen (1.5px + glow) yang meluncur ke segmen terpilih. Di tengah perjalanan outline meregang scaleX 1.25 lalu mendarat dengan overshoot kecil; label terpilih menjadi terang.',
    timing: '≈320ms cubic-bezier(.34,1.56,.64,1) · regangan di 50% perjalanan',
    use: 'filter ringan atau pemilih ukuran yang tidak ingin terlalu berat secara visual',
    tags: 'segmented control outline glide gradient border tab indicator',
    html: '<div class="seg">' + segs + '<i class="pill"></i></div>',
    css: segCss + '& .pill{border:1.5px solid transparent;background:linear-gradient(var(--d-soft),var(--d-soft)) padding-box,linear-gradient(90deg,#7c5cff,#3fa9ff) border-box;box-shadow:0 0 10px rgba(110,120,255,.45);box-sizing:border-box}',
    js: function (root, api) {
      var pill = root.querySelector('.pill'), bs = root.querySelectorAll('.seg button'), t = [];
      function pick(i) {
        var from = new DOMMatrix(getComputedStyle(pill).transform).m41, to = i * 46;
        bs.forEach(function (b, j) { b.classList.toggle('on', j === i); });
        pill.style.transform = 'translateX(' + to + 'px)';
        pill.animate([{ transform: 'translateX(' + from + 'px)' }, { transform: 'translateX(' + (from + to) / 2 + 'px) scaleX(' + (from === to ? 1 : 1.25) + ')' }, { transform: 'translateX(' + to + 'px)' }],
          { duration: api.reduce ? 1 : 320, easing: 'cubic-bezier(.34,1.56,.64,1)' });
      }
      bs.forEach(function (b, i) { b.onclick = function () { pick(i); }; });
      pick(2);
      t.push(setTimeout(function () { pick(0); }, 600), setTimeout(function () { pick(3); }, 1400));
      return function () { t.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'segment-vertical-stack', cat: cat, name: 'Vertical Stack', source: src, trigger: 'tap', allowColor: true,
    motion: 'Kontrol segmen vertikal di sisi kiri: pill biru meluncur naik/turun ke ukuran terpilih. Panel di kanan ikut: isi lama keluar 10px searah gerak sambil blur 3px dan memudar, isi baru masuk dari sisi berlawanan; bar "Fit" memanjang/memendek ke nilai baru.',
    timing: 'pill ≈300ms cubic-bezier(.34,1.56,.64,1) · isi keluar 120ms + masuk 200ms ease-out · bar 300ms',
    use: 'pemilih varian dengan pratinjau detail, mis. pilih dosis dan lihat keterangannya',
    tags: 'segmented vertical stack panel slide content swap progress bar',
    html: '<div class="vs"><div class="col"><i class="pill"></i><button type="button">S</button><button type="button">M</button><button type="button">L</button><button type="button">XL</button></div>' +
      '<div class="pn"><div class="pc"><b class="av">L</b><div><b class="nm">Large</b><small class="ms">104 × 74 cm</small></div></div><small class="fl">Fit</small><div class="fit"><i></i></div></div></div>',
    css: '& .vs{display:flex;gap:10px;align-items:stretch}' +
      '& .col{position:relative;display:grid;grid-template-rows:repeat(4,32px);width:40px;padding:4px;border-radius:14px;background:var(--d-soft)}' +
      '& .col button{position:relative;z-index:1;border:0;background:none;color:var(--d-mid);font:600 11px inherit;cursor:pointer}& .col button.on{color:#fff}' +
      '& .pill{position:absolute;left:4px;top:4px;width:40px;height:32px;border-radius:10px;background:linear-gradient(90deg,#6f5cff,#3f8cff)}' +
      '& .pn{width:150px;padding:12px;border-radius:14px;background:var(--d-bg);box-shadow:0 0 0 1px var(--d-soft);display:grid;align-content:start;gap:8px;overflow:hidden}' +
      '& .pc{display:flex;gap:8px;align-items:center}& .pc small{display:block;color:var(--d-mid);font-size:9px}' +
      '& .av{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;color:#fff;background:linear-gradient(135deg,#6f5cff,#3f8cff)}' +
      '& .fl{color:var(--d-mid);font-size:9px;margin-top:22px}' +
      '& .fit{height:5px;border-radius:3px;background:var(--d-soft)}& .fit i{display:block;height:100%;border-radius:3px;background:var(--d-accent);transform-origin:left;transition:transform .3s ease-out}',
    js: function (root, api) {
      var D = [['S', 'Small', 88, 66, .2], ['M', 'Medium', 96, 70, .45], ['L', 'Large', 104, 74, .75], ['XL', 'Extra large', 112, 78, .95]];
      var pill = root.querySelector('.pill'), pc = root.querySelector('.pc'), bs = root.querySelectorAll('.col button'), t = [], cur = 2;
      function pick(i) {
        var dir = i > cur ? 1 : -1, d = D[i], k = api.reduce ? 0.01 : 1; cur = i;
        bs.forEach(function (b, j) { b.classList.toggle('on', j === i); });
        var from = new DOMMatrix(getComputedStyle(pill).transform).m42;
        pill.style.transform = 'translateY(' + i * 32 + 'px)';
        pill.animate([{ transform: 'translateY(' + from + 'px)' }, { transform: 'translateY(' + i * 32 + 'px)' }], { duration: 300 * k, easing: 'cubic-bezier(.34,1.56,.64,1)' });
        root.querySelector('.fit i').style.transform = 'scaleX(' + d[4] + ')';
        pc.animate([{ transform: 'none', opacity: 1, filter: 'blur(0)' }, { transform: 'translateY(' + -dir * 10 + 'px)', opacity: 0, filter: 'blur(3px)' }], { duration: 120 * k, easing: 'ease-in' }).onfinish = function () {
          pc.querySelector('.av').textContent = d[0]; pc.querySelector('.nm').textContent = d[1];
          pc.querySelector('.ms').textContent = d[2] + ' × ' + d[3] + ' cm';
          pc.animate([{ transform: 'translateY(' + dir * 10 + 'px)', opacity: 0, filter: 'blur(3px)' }, { transform: 'none', opacity: 1, filter: 'blur(0)' }], { duration: 200 * k, easing: 'ease-out' });
        };
      }
      bs.forEach(function (b, i) { b.onclick = function () { pick(i); }; });
      pill.style.transform = 'translateY(64px)'; bs[2].classList.add('on'); root.querySelector('.fit i').style.transform = 'scaleX(.75)';
      t.push(setTimeout(function () { pick(0); }, 600), setTimeout(function () { pick(1); }, 1500));
      return function () { t.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'segment-pressed-keys', cat: cat, name: 'Pressed Keys', source: src, trigger: 'tap', allowColor: true,
    motion: 'Setiap segmen adalah tombol 3D dengan alas 3px di bawahnya. Tombol yang dipilih turun 3px (menempel ke alas) dan terisi warna aksen, lalu tetap tertekan; tombol sebelumnya naik kembali dengan pantulan kecil.',
    timing: 'tekan ≈120ms ease-out · lepas ≈240ms cubic-bezier(.34,1.56,.64,1)',
    use: 'pilihan yang ingin terasa fisik/taktil, mis. pilih shift jaga atau ruang',
    tags: 'segmented pressed key 3d button tactile depress',
    html: '<div class="keys">' + ['S', 'M', 'L', 'XL'].map(function (s) { return '<button type="button"><span>' + s + '</span></button>'; }).join('') + '</div>',
    css: '& .keys{display:flex;gap:8px}' +
      '& .keys button{width:44px;height:44px;border:0;padding:0;border-radius:10px;background:var(--d-mid);cursor:pointer}' +
      '& .keys span{display:grid;place-items:center;height:41px;border-radius:10px;background:var(--d-soft);color:var(--d-fg);font:600 12px inherit;transform:translateY(-3px);transition:transform 240ms cubic-bezier(.34,1.56,.64,1),background .15s}' +
      '& .keys button.on span{transform:translateY(0);background:linear-gradient(135deg,#6f5cff,#3f8cff);color:#fff;transition:transform 120ms ease-out,background .15s}' +
      '& .keys button.on{background:#3a3aa8}',
    js: function (root, api) {
      var bs = root.querySelectorAll('.keys button'), t = [];
      if (api.reduce) bs.forEach(function (b) { b.firstChild.style.transition = 'none'; });
      function pick(i) { bs.forEach(function (b, j) { b.classList.toggle('on', j === i); }); }
      bs.forEach(function (b, i) { b.onclick = function () { pick(i); }; });
      pick(2);
      t.push(setTimeout(function () { pick(0); }, 600), setTimeout(function () { pick(1); }, 1400));
      return function () { t.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'segment-price-roll', cat: cat, name: 'Price Roll', source: src, trigger: 'tap', allowColor: true,
    motion: 'Pill isian meluncur ke ukuran terpilih. Harga bergulir seperti odometer: angka lama naik keluar (translateY −100%, blur 2px), angka baru masuk dari bawah. Label "Save %" ikut bergulir lalu pop scale 1 → 1.15 → 1.',
    timing: 'pill ≈280ms spring · gulir harga ≈320ms cubic-bezier(.2,.8,.2,1) · pop tag 260ms',
    use: 'harga atau biaya yang berubah karena pilihan, mis. tarif paket pemeriksaan',
    tags: 'segmented price roll odometer number ticker badge pop',
    html: '<div class="pr"><div class="seg">' + segs + '<i class="pill"></i></div>' +
      '<div class="cd"><small>Everyday Tee</small><div class="row"><div class="roll"><b>$26</b></div><span class="sv"><span class="roll"><b>Save 15%</b></span></span></div><small>Ships in 2 days</small></div></div>',
    css: segCss + '& .pill{background:linear-gradient(90deg,#6f5cff,#3f8cff)}& .seg button.on{color:#fff}' +
      '& .pr{display:grid;gap:10px}& .cd{padding:12px;border-radius:14px;background:var(--d-bg);box-shadow:0 0 0 1px var(--d-soft);display:grid;gap:2px}' +
      '& .cd small{color:var(--d-mid);font-size:9px}& .row{display:flex;justify-content:space-between;align-items:center}' +
      '& .roll{position:relative;display:inline-grid;overflow:hidden;height:1.25em}& .roll b{grid-area:1/1;white-space:nowrap}' +
      '& .row>.roll{font-size:24px}& .sv{background:#ffc53d;color:#3a2a00;border-radius:99px;padding:4px 9px;font-size:10px}',
    js: function (root, api) {
      var P = [['$18', 'Save 5%'], ['$22', 'Save 10%'], ['$26', 'Save 15%'], ['$30', 'Save 20%']];
      var pill = root.querySelector('.pill'), bs = root.querySelectorAll('.seg button'), rolls = root.querySelectorAll('.roll'), t = [], cur = 2, k = api.reduce ? 0.01 : 1;
      function roll(box, text, dir) {
        var old = box.lastElementChild, nw = document.createElement('b'); nw.textContent = text; box.appendChild(nw);
        var o = { duration: 320 * k, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'both' };
        old.animate([{ transform: 'none', filter: 'blur(0)' }, { transform: 'translateY(' + -100 * dir + '%)', filter: 'blur(2px)' }], o).onfinish = function () { old.remove(); };
        nw.animate([{ transform: 'translateY(' + 100 * dir + '%)', filter: 'blur(2px)' }, { transform: 'none', filter: 'blur(0)' }], o);
      }
      function pick(i) {
        if (i === cur) return;
        var dir = i > cur ? 1 : -1; cur = i;
        bs.forEach(function (b, j) { b.classList.toggle('on', j === i); });
        var from = new DOMMatrix(getComputedStyle(pill).transform).m41;
        pill.style.transform = 'translateX(' + i * 46 + 'px)';
        pill.animate([{ transform: 'translateX(' + from + 'px)' }, { transform: 'translateX(' + i * 46 + 'px)' }], { duration: 280 * k, easing: 'cubic-bezier(.34,1.56,.64,1)' });
        roll(rolls[0], P[i][0], dir); roll(rolls[1], P[i][1], dir);
        root.querySelector('.sv').animate([{ transform: 'scale(1)' }, { transform: 'scale(1.15)' }, { transform: 'scale(1)' }], { duration: 260 * k, delay: 120 * k, easing: 'ease-out' });
      }
      bs.forEach(function (b, i) { b.onclick = function () { pick(i); }; });
      pill.style.transform = 'translateX(92px)'; bs[2].classList.add('on');
      t.push(setTimeout(function () { pick(0); }, 600), setTimeout(function () { pick(1); }, 1500));
      return function () { t.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'segment-size-picker', cat: cat, name: 'Size Picker', source: src, trigger: 'tap', allowColor: true,
    motion: 'Ikon kaus membesar/mengecil sesuai ukuran (S 0.78, M 0.9, L 1.02, XL 1.14) dengan pantulan pegas, huruf ukurannya ikut berganti; pill isian segmen meluncur ke pilihan.',
    timing: 'kaus ≈420ms cubic-bezier(.34,1.8,.64,1) · pill ≈280ms spring',
    use: 'pemilih ukuran produk atau skala (mis. ukuran manset tensimeter) yang perlu umpan balik visual',
    tags: 'segmented size picker scale bounce icon spring',
    html: '<div class="sp"><div class="shirt"><svg viewBox="0 0 64 56" width="64" height="56" aria-hidden="true"><path d="M22 4l-16 8 6 14 6-3v29h28V23l6 3 6-14-16-8c-2 5-6 7-10 7s-8-2-10-7z"/></svg><b>L</b></div><div class="seg">' + segs + '<i class="pill"></i></div></div>',
    css: segCss + '& .pill{background:var(--d-bg);box-shadow:0 1px 4px rgba(0,0,0,.2)}' +
      '& .sp{display:grid;justify-items:center;gap:14px}& .shirt{position:relative;display:grid;place-items:center;height:72px}' +
      '& .shirt svg{fill:#4f7bff;filter:drop-shadow(0 4px 8px rgba(80,110,255,.35))}& .shirt b{position:absolute;color:#fff;font-size:13px;top:28px}',
    js: function (root, api) {
      var S = [.78, .9, 1.02, 1.14], L = ['S', 'M', 'L', 'XL'];
      var pill = root.querySelector('.pill'), sh = root.querySelector('.shirt'), bs = root.querySelectorAll('.seg button'), t = [], k = api.reduce ? 0.01 : 1;
      function pick(i) {
        bs.forEach(function (b, j) { b.classList.toggle('on', j === i); });
        var from = new DOMMatrix(getComputedStyle(pill).transform).m41;
        pill.style.transform = 'translateX(' + i * 46 + 'px)';
        pill.animate([{ transform: 'translateX(' + from + 'px)' }, { transform: 'translateX(' + i * 46 + 'px)' }], { duration: 280 * k, easing: 'cubic-bezier(.34,1.56,.64,1)' });
        var s0 = new DOMMatrix(getComputedStyle(sh).transform).a;
        sh.style.transform = 'scale(' + S[i] + ')';
        sh.animate([{ transform: 'scale(' + s0 + ')' }, { transform: 'scale(' + S[i] + ')' }], { duration: 420 * k, easing: 'cubic-bezier(.34,1.8,.64,1)' });
        sh.querySelector('b').textContent = L[i];
      }
      bs.forEach(function (b, i) { b.onclick = function () { pick(i); }; });
      pill.style.transform = 'translateX(92px)'; sh.style.transform = 'scale(1.02)'; bs[2].classList.add('on');
      t.push(setTimeout(function () { pick(0); }, 600), setTimeout(function () { pick(3); }, 1500));
      return function () { t.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'segment-drag-thumb', cat: cat, name: 'Drag Thumb', source: src, trigger: 'drag', allowColor: true,
    motion: 'Thumb biru bisa diseret di sepanjang trek. Jika ditarik melewati ujung kiri/kanan, thumb meregang seperti karet (scaleX bertambah dengan hambatan 0.4× dari jarak tarik, berjangkar di sisi dalam). Saat dilepas, thumb memantul ke segmen terdekat.',
    timing: 'ikut jari (tanpa delay) · snap ≈380ms cubic-bezier(.34,1.56,.64,1)',
    use: 'slider bertahap atau segmen yang bisa digeser, mis. skala nyeri 4 tingkat',
    tags: 'segmented drag thumb rubber band stretch snap slider pointer',
    html: '<div class="seg dt">' + segs + '<i class="pill"></i></div>',
    css: segCss + '& .dt{touch-action:none}& .pill{background:linear-gradient(90deg,#6f5cff,#3f8cff);pointer-events:auto;cursor:grab;z-index:2}& .seg button.on{color:#fff}',
    js: function (root, api) {
      var pill = root.querySelector('.pill'), bs = root.querySelectorAll('.seg button'), t = [], x = 0, sx = null, x0 = 0, max = 138;
      function draw(v) { // v = raw position, may go past the ends
        var o = v < 0 ? -v * 0.4 : v > max ? (v - max) * 0.4 : 0;
        pill.style.transformOrigin = v < 0 ? 'right' : 'left';
        pill.style.transform = 'translateX(' + Math.max(0, Math.min(max, v)) + 'px) scaleX(' + (1 + o / 46) + ')';
      }
      function snap(i) {
        var from = getComputedStyle(pill).transform; x = i * 46;
        bs.forEach(function (b, j) { b.classList.toggle('on', j === i); });
        draw(x);
        pill.animate([{ transform: from }, { transform: pill.style.transform }], { duration: api.reduce ? 1 : 380, easing: 'cubic-bezier(.34,1.56,.64,1)' });
      }
      bs.forEach(function (b, i) { b.onclick = function () { snap(i); }; });
      pill.addEventListener('pointerdown', function (e) { sx = e.clientX; x0 = x; pill.setPointerCapture(e.pointerId); });
      pill.addEventListener('pointermove', function (e) { if (sx !== null) draw(x0 + e.clientX - sx); });
      function up(e) { if (sx === null) return; var v = x0 + e.clientX - sx; sx = null; snap(Math.max(0, Math.min(3, Math.round(v / 46)))); }
      pill.addEventListener('pointerup', up); pill.addEventListener('pointercancel', up);
      snap(0);
      // autoplay: pull past the right end, then let go
      t.push(setTimeout(function () { snap(3); }, 600), setTimeout(function () {
        var from = getComputedStyle(pill).transform; draw(max + 70);
        pill.animate([{ transform: from }, { transform: pill.style.transform }], { duration: api.reduce ? 1 : 300, easing: 'ease-out' });
      }, 1200), setTimeout(function () { snap(3); }, 1700));
      return function () { t.forEach(clearTimeout); };
    }
  });
})();
