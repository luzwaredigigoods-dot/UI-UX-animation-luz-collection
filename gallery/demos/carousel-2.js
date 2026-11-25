/* Carousel · Part 2 — cube turn, thumbnail strip, onboarding, infinite loop, stack slide, circular wheel.
   Scenes (Mountains / Ocean / Garden / City) are drawn with CSS gradients. */
(function () {
  var src = 'Carousel · Part 2';
  var cat = 'Kartu & Konten';
  var scenes =
    '& .mt{background:radial-gradient(circle at 68% 34%,#ffc27a 0 10%,transparent 11%),linear-gradient(150deg,transparent 58%,#3b2a7a 59%),linear-gradient(210deg,transparent 52%,#4a3592 53%),linear-gradient(#5b3fb8,#c06bd6)}' +
    '& .oc{background:radial-gradient(circle at 30% 30%,#fff 0 5%,transparent 6%),repeating-linear-gradient(170deg,transparent 0 9px,rgba(255,255,255,.08) 9px 11px),linear-gradient(#1b2f7a,#2f6fe0)}' +
    '& .gd{background:radial-gradient(circle at 35% 58%,#ff6b9a 0 8%,transparent 9%),radial-gradient(circle at 66% 40%,#ffd24a 0 10%,transparent 11%),radial-gradient(circle at 52% 76%,#ff9ac0 0 6%,transparent 7%),linear-gradient(#17493a,#1f7a55)}' +
    '& .ct{background:radial-gradient(circle at 80% 22%,#ffe08a 0 6%,transparent 7%),linear-gradient(to top,#1c1240 0 40%,transparent 40%),repeating-linear-gradient(90deg,#2a1c5c 0 14px,transparent 14px 22px) bottom/100% 70% no-repeat,linear-gradient(#3a2470,#b0479a)}' +
    '& .sc{position:relative;border-radius:14px;overflow:hidden;color:#fff}' +
    '& .sc b{position:absolute;left:10px;bottom:8px;font-size:11px}';
  var dots = '& .dots{display:flex;gap:5px;justify-content:center}& .dots i{width:5px;height:5px;border-radius:3px;background:var(--d-soft);transition:transform .3s,background .3s}& .dots i.on{background:var(--d-accent)}';

  LUZ.add({
    id: 'carousel2-cube-turn', cat: cat, name: 'Cube Turn', source: src, trigger: 'tap', allowColor: true,
    motion: 'Halaman berputar seperti sisi kubus: kartu sekarang rotateY 0 → −90° berporos di tepi kanan sambil bergeser −100%, kartu berikut masuk dari rotateY 90° berporos di tepi kiri. Sisi yang menjauh menggelap (brightness 1 → 0.4).',
    timing: '≈520ms cubic-bezier(.65,0,.35,1) · perspektif 600px',
    use: 'galeri atau langkah onboarding yang ingin terasa 3D dan berbobot',
    tags: 'carousel cube turn 3d rotateY page flip darken',
    html: '<div class="cw"><div class="cube"><div class="sc mt a"><b>Mountains</b></div><div class="sc oc b"><b>Ocean</b></div></div><div class="dots"><i class="on"></i><i></i><i></i><i></i></div></div>',
    css: scenes + dots + '& .cw{display:grid;gap:10px}& .cube{position:relative;width:200px;height:120px;perspective:600px;cursor:pointer}& .cube .sc{position:absolute;inset:0;backface-visibility:hidden}& .cube .b{opacity:0}',
    js: function (root, api) {
      var S = [['mt', 'Mountains'], ['oc', 'Ocean'], ['gd', 'Garden'], ['ct', 'City']];
      var A = root.querySelector('.a'), B = root.querySelector('.b'), ds = root.querySelectorAll('.dots i'), i = 0, busy = false, t = [];
      function set(el, n) { el.className = 'sc ' + S[n][0] + ' ' + (el === A ? 'a' : 'b'); el.firstChild.textContent = S[n][1]; }
      function next() {
        if (busy) return; busy = true;
        var n = (i + 1) % 4, o = { duration: api.reduce ? 1 : 520, easing: 'cubic-bezier(.65,0,.35,1)' };
        set(B, n);
        A.animate([{ transformOrigin: '100% 50%', transform: 'translateX(0) rotateY(0)', filter: 'brightness(1)' }, { transformOrigin: '100% 50%', transform: 'translateX(-100%) rotateY(-90deg)', filter: 'brightness(.4)' }], o);
        B.animate([{ transformOrigin: '0 50%', transform: 'translateX(100%) rotateY(90deg)', filter: 'brightness(.4)', opacity: 1 }, { transformOrigin: '0 50%', transform: 'none', filter: 'brightness(1)', opacity: 1 }], o).onfinish = function () {
          i = n; set(A, n); busy = false;
          ds.forEach(function (d, j) { d.classList.toggle('on', j === n); });
        };
      }
      root.querySelector('.cube').onclick = next;
      t.push(setTimeout(next, 600), setTimeout(next, 1700));
      return function () { t.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'carousel2-thumbnail-strip', cat: cat, name: 'Thumbnail Strip', source: src, trigger: 'tap', allowColor: true,
    motion: 'Ketuk thumbnail: gambar besar bergeser horizontal ke slide yang sesuai (translateX −i×100%), dan cincin biru pada deretan thumbnail meluncur ke thumbnail yang diketuk dengan pantulan kecil.',
    timing: 'slide ≈420ms cubic-bezier(.2,.8,.2,1) · cincin ≈320ms cubic-bezier(.34,1.56,.64,1)',
    use: 'galeri foto produk atau foto luka/rontgen dengan pratinjau kecil',
    tags: 'carousel thumbnail strip gallery ring indicator slide',
    html: '<div class="ts"><div class="vp"><div class="tr"><div class="sc mt"><b>Mountains</b></div><div class="sc oc"><b>Ocean</b></div><div class="sc gd"><b>Garden</b></div><div class="sc ct"><b>City</b></div></div></div>' +
      '<div class="th"><button type="button" class="sc mt" aria-label="Mountains"></button><button type="button" class="sc oc" aria-label="Ocean"></button><button type="button" class="sc gd" aria-label="Garden"></button><button type="button" class="sc ct" aria-label="City"></button><i class="ring"></i></div></div>',
    css: scenes + '& .ts{display:grid;gap:10px;width:204px}& .vp{overflow:hidden;border-radius:14px;height:110px}& .tr{display:flex;height:100%}& .tr .sc{flex:0 0 100%;border-radius:0}' +
      '& .th{position:relative;display:flex;gap:8px}& .th .sc{width:45px;height:32px;border:0;border-radius:8px;cursor:pointer;padding:0}' +
      '& .ring{position:absolute;left:-3px;top:-3px;width:51px;height:38px;border-radius:10px;border:2px solid var(--d-accent);box-sizing:border-box;pointer-events:none}',
    js: function (root, api) {
      var tr = root.querySelector('.tr'), ring = root.querySelector('.ring'), t = [], k = api.reduce ? 0.01 : 1;
      function go(i) {
        var a = new DOMMatrix(getComputedStyle(tr).transform).m41, r = new DOMMatrix(getComputedStyle(ring).transform).m41;
        tr.style.transform = 'translateX(' + -i * 204 + 'px)'; ring.style.transform = 'translateX(' + i * 53 + 'px)';
        tr.animate([{ transform: 'translateX(' + a + 'px)' }, { transform: tr.style.transform }], { duration: 420 * k, easing: 'cubic-bezier(.2,.8,.2,1)' });
        ring.animate([{ transform: 'translateX(' + r + 'px)' }, { transform: ring.style.transform }], { duration: 320 * k, easing: 'cubic-bezier(.34,1.56,.64,1)' });
      }
      root.querySelectorAll('.th button').forEach(function (b, i) { b.onclick = function () { go(i); }; });
      t.push(setTimeout(function () { go(2); }, 600), setTimeout(function () { go(1); }, 1600));
      return function () { t.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'carousel2-onboarding', cat: cat, name: 'Onboarding', source: src, trigger: 'tap', allowColor: true,
    motion: 'Isi langkah lama keluar ke kiri 24px sambil memudar, isi baru masuk dari kanan 24px dengan blur 2px; indikator titik aktif memanjang jadi pill. Di langkah terakhir tombol kecil "Next" melebar jadi "Get started" (clip-path), labelnya crossfade. Back membalik arah.',
    timing: 'isi keluar 150ms ease-in + masuk 240ms ease-out · tombol melebar 320ms cubic-bezier(.34,1.3,.64,1)',
    use: 'alur onboarding atau panduan pertama kali membuka aplikasi klinik',
    tags: 'onboarding carousel steps next button morph width dots',
    html: '<div class="ob"><div class="stp"><i class="ic">★</i><div><b>Save your favorites</b><small>Keep the best moments in one place.</small></div></div>' +
      '<div class="ft"><button type="button" class="bkb">Back</button><div class="dots"><i class="on"></i><i></i><i></i></div><button type="button" class="nx"><i class="bgk"></i><span class="l1">Next</span><span class="l2">Get started</span></button></div></div>',
    css: dots + '& .ob{width:220px;padding:14px;border-radius:16px;background:var(--d-bg);box-shadow:0 0 0 1px var(--d-soft);display:grid;gap:22px}' +
      '& .stp{display:flex;gap:10px;align-items:center;min-height:52px}& .stp small{display:block;color:var(--d-mid);font-size:9.5px;margin-top:2px}' +
      '& .ic{flex:none;width:36px;height:36px;border-radius:50%;display:grid;place-items:center;font-style:normal;color:#fff;background:linear-gradient(135deg,#6f5cff,#3f8cff)}' +
      '& .ft{display:flex;align-items:center;gap:8px}& .dots{flex:1}& .dots i.on{transform:scaleX(2.4)}' +
      '& .bkb{border:0;background:none;color:var(--d-mid);font:inherit;font-size:10px;cursor:pointer;padding:8px 4px}' +
      '& .nx{position:relative;width:92px;height:30px;border:0;background:none;color:#fff;font:600 10px inherit;cursor:pointer;padding:0}' +
      '& .bgk{position:absolute;inset:0;border-radius:99px;background:linear-gradient(90deg,#6f5cff,#3f8cff);clip-path:inset(0 0 0 44px round 99px);transition:clip-path 320ms cubic-bezier(.34,1.3,.64,1)}' +
      '& .nx span{position:absolute;top:9px;transition:opacity .2s}& .l1{right:13px}& .l2{left:0;right:0;opacity:0}' +
      '& .ob.last .bgk{clip-path:inset(0 0 0 0 round 99px)}& .ob.last .l1{opacity:0}& .ob.last .l2{opacity:1}',
    js: function (root, api) {
      var S = [['★', 'Save your favorites', 'Keep the best moments in one place.'], ['◉', 'Never miss a thing', 'Smart alerts tell you what matters.'], ['✓', 'You are all set', "Your space is ready. Let's begin!"]];
      var ob = root.querySelector('.ob'), st = root.querySelector('.stp'), ds = root.querySelectorAll('.dots i'), i = 0, t = [], k = api.reduce ? 0.01 : 1;
      function go(n) {
        if (n < 0 || n > 2) n = 0;
        var dir = n > i ? 1 : -1; i = n;
        ob.classList.toggle('last', n === 2);
        ds.forEach(function (d, j) { d.classList.toggle('on', j === n); });
        st.animate([{ transform: 'none', opacity: 1 }, { transform: 'translateX(' + -24 * dir + 'px)', opacity: 0 }], { duration: 150 * k, easing: 'ease-in' }).onfinish = function () {
          st.querySelector('.ic').textContent = S[n][0]; st.querySelector('b').textContent = S[n][1]; st.querySelector('small').textContent = S[n][2];
          st.animate([{ transform: 'translateX(' + 24 * dir + 'px)', opacity: 0, filter: 'blur(2px)' }, { transform: 'none', opacity: 1, filter: 'blur(0)' }], { duration: 240 * k, easing: 'ease-out' });
        };
      }
      root.querySelector('.nx').onclick = function () { go(i + 1); };
      root.querySelector('.bkb').onclick = function () { if (i > 0) go(i - 1); };
      t.push(setTimeout(function () { go(1); }, 600), setTimeout(function () { go(2); }, 1400));
      return function () { t.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'carousel2-infinite-loop', cat: cat, name: 'Infinite Loop', source: src, trigger: 'drag', allowColor: true,
    motion: 'Kartu "Day 1–6" berjajar dengan tetangga mengintip di kiri-kanan. Tiap geser (atau ketuk) jalur bergeser satu kartu (130px); setelah Day 6 langsung muncul Day 1 tanpa lompatan karena kartu terdepan dipindah ke belakang saat animasi selesai.',
    timing: '≈420ms cubic-bezier(.2,.8,.2,1)',
    use: 'carousel promo atau jadwal mingguan yang berputar tanpa ujung',
    tags: 'carousel infinite loop wrap endless swipe track',
    html: '<div class="il"><div class="trk">' + [1, 2, 3, 4, 5, 6].map(function (n) { return '<div class="sc ' + ['mt', 'oc', 'gd', 'ct'][(n - 1) % 4] + '"><b>Day ' + n + '</b></div>'; }).join('') + '</div></div>',
    css: scenes + '& .il{width:100%;height:120px;overflow:hidden;touch-action:pan-y;cursor:grab}& .trk{display:flex;gap:10px;height:100%;margin-left:calc(50% - 190px)}& .trk .sc{flex:0 0 120px}',
    js: function (root, api) {
      var trk = root.querySelector('.trk'), busy = false, x0 = null, t = [];
      function step(dir) {
        if (busy) return; busy = true;
        var o = { duration: api.reduce ? 1 : 420, easing: 'cubic-bezier(.2,.8,.2,1)' };
        if (dir > 0) trk.animate([{ transform: 'none' }, { transform: 'translateX(-130px)' }], o).onfinish = function () { trk.appendChild(trk.firstElementChild); busy = false; };
        else { trk.insertBefore(trk.lastElementChild, trk.firstElementChild); trk.animate([{ transform: 'translateX(-130px)' }, { transform: 'none' }], o).onfinish = function () { busy = false; }; }
      }
      var il = root.querySelector('.il');
      il.addEventListener('pointerdown', function (e) { x0 = e.clientX; });
      il.addEventListener('pointerup', function (e) { if (x0 === null) return; var dx = e.clientX - x0; x0 = null; step(dx > 20 ? -1 : 1); });
      t.push(setTimeout(function () { step(1); }, 600), setTimeout(function () { step(1); }, 1300));
      return function () { t.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'carousel2-stack-slide', cat: cat, name: 'Stack Slide', source: src, trigger: 'tap', allowColor: true,
    motion: 'Tumpukan kartu: kartu teratas meluncur keluar ke kiri (translateX −120%, rotate −8°, memudar), kartu di bawahnya naik ke depan dari scale 0.94 / geser 12px ke posisi penuh, kartu ketiga ikut maju satu tingkat. Kartu yang keluar kembali ke belakang tumpukan.',
    timing: 'keluar ≈340ms ease-in · naik ≈360ms cubic-bezier(.34,1.4,.64,1)',
    use: 'kartu rekomendasi atau antrean pasien yang diproses satu per satu',
    tags: 'carousel stack slide deck cards swipe away step up',
    html: '<div class="sk"><div class="sc ct"><b>City</b></div><div class="sc gd"><b>Garden</b></div><div class="sc oc"><b>Ocean</b></div><div class="sc mt"><b>Mountains</b></div></div>',
    css: scenes + '& .sk{position:relative;width:180px;height:116px;cursor:pointer}' +
      '& .sk .sc{position:absolute;inset:0;transition:transform 360ms cubic-bezier(.34,1.4,.64,1),opacity .3s;box-shadow:0 6px 16px rgba(0,0,0,.25)}' +
      '& .sk .sc[data-p="0"]{z-index:4}& .sk .sc[data-p="1"]{z-index:3;transform:translateX(12px) scale(.94);filter:brightness(.8)}& .sk .sc[data-p="2"]{z-index:2;transform:translateX(24px) scale(.88);filter:brightness(.6)}& .sk .sc[data-p="3"]{z-index:1;transform:translateX(24px) scale(.88);opacity:0}',
    js: function (root, api) {
      var sk = root.querySelector('.sk'), cs = [].slice.call(sk.children).reverse(), busy = false, t = [];
      function lay() { cs.forEach(function (c, i) { c.dataset.p = i; }); }
      function next() {
        if (busy) return; busy = true;
        var top = cs.shift(); cs.push(top);
        top.animate([{ transform: 'none', opacity: 1 }, { transform: 'translateX(-120%) rotate(-8deg)', opacity: 0 }], { duration: api.reduce ? 1 : 340, easing: 'ease-in' }).onfinish = function () { busy = false; };
        lay();
      }
      lay(); sk.onclick = next;
      t.push(setTimeout(next, 600), setTimeout(next, 1500));
      return function () { t.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'carousel2-circular-wheel', cat: cat, name: 'Circular Wheel', source: src, trigger: 'tap', allowColor: true,
    motion: 'Item lingkaran duduk di roda besar (radius 140px, jarak 45°). Ketuk/geser memutar seluruh roda sehingga item berikut menggelinding ke puncak: item terpilih membesar ke 1.3× dengan cincin biru, item lain turun mengikuti busur dan meredup. Label dan "n/4" di bawah ikut berganti.',
    timing: '≈560ms cubic-bezier(.65,0,.35,1) dengan settle kecil',
    use: 'pemilih kategori atau mode yang ingin terasa playful, mis. pilih jenis layanan',
    tags: 'carousel circular wheel rotate arc picker selection ring',
    html: '<div class="cwh"><div class="wh">' + [0, 1, 2, 3, 4, 5, 6, 7].map(function (n) { return '<div class="it"><div class="sc ' + ['mt', 'oc', 'gd', 'ct'][n % 4] + '"></div></div>'; }).join('') + '</div><div class="lb"><b>Mountains</b><small>1/4</small></div></div>',
    css: scenes + '& .cwh{position:relative;width:100%;height:230px;overflow:hidden;cursor:pointer}' +
      '& .wh{position:absolute;left:50%;top:200px;width:0;height:0;transition:transform 560ms cubic-bezier(.65,0,.35,1)}' +
      '& .it{position:absolute;left:-22px;top:-22px;width:44px;height:44px}' +
      '& .it .sc{width:100%;height:100%;border-radius:50%;transition:transform 560ms cubic-bezier(.65,0,.35,1),filter .4s,box-shadow .4s;filter:brightness(.55)}' +
      '& .it.on .sc{filter:none;box-shadow:0 0 0 2px var(--d-bg),0 0 0 4px var(--d-accent)}' +
      '& .lb{position:absolute;left:0;right:0;top:118px;text-align:center;display:grid;gap:1px}& .lb small{color:var(--d-mid);font-size:9px}',
    js: function (root, api) {
      var N = ['Mountains', 'Ocean', 'Garden', 'City'], wh = root.querySelector('.wh'), its = root.querySelectorAll('.it'), sel = 0, t = [];
      if (api.reduce) wh.style.transition = 'none';
      function draw() {
        wh.style.transform = 'rotate(' + -sel * 45 + 'deg)';
        its.forEach(function (it, i) {
          var on = ((sel % 8) + 8) % 8 === i;
          it.classList.toggle('on', on);
          it.style.transform = 'rotate(' + i * 45 + 'deg) translateY(-140px)';
          it.firstChild.style.transform = 'rotate(' + (sel * 45 - i * 45) + 'deg) scale(' + (on ? 1.3 : 0.85) + ')';
        });
        var n = ((sel % 4) + 4) % 4;
        root.querySelector('.lb b').textContent = N[n]; root.querySelector('.lb small').textContent = (n + 1) + '/4';
      }
      draw();
      root.querySelector('.cwh').onclick = function (e) { sel += e.clientX - this.getBoundingClientRect().left < this.offsetWidth / 2 ? -1 : 1; draw(); };
      t.push(setTimeout(function () { sel++; draw(); }, 600), setTimeout(function () { sel++; draw(); }, 1500));
      return function () { t.forEach(clearTimeout); };
    }
  });
})();
