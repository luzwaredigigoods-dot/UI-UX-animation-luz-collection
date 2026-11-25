/* Backgrounds · Part 1 — six hero backgrounds that react to a tap. */
(function () {
  var SRC = 'Backgrounds · Part 1';
  var CT = '<div class="ct"><span class="bdg">Now in beta</span><b>Build faster</b><small>Launch a polished site in minutes.</small><span class="go">Get started</span></div>';
  var BASE =
    '& .hero{position:relative;width:236px;height:150px;border-radius:14px;overflow:hidden;background:#12142b;color:#fff;cursor:pointer;isolation:isolate}' +
    '& .ct{position:absolute;inset:0;display:grid;place-content:center;justify-items:center;gap:3px;z-index:2;pointer-events:none;text-align:center}' +
    '& .bdg{font-size:8px;padding:2px 8px;border-radius:99px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.22)}' +
    '& .ct b{font-size:20px;font-weight:600;letter-spacing:-.01em;line-height:1.15}' +
    '& .ct small{font-size:8.5px;opacity:.75}' +
    '& .go{margin-top:6px;font-size:9px;font-weight:600;background:#fff;color:#12142b;border-radius:99px;padding:4px 13px}' +
    '& .tap{position:absolute;width:26px;height:26px;margin:-13px 0 0 -13px;border-radius:50%;border:1.5px solid rgba(255,255,255,.85);pointer-events:none;z-index:3}';

  LUZ.add({
    id: 'bg-mesh-gradient',
    cat: 'Latar & Efek',
    name: 'Mesh Gradient',
    source: SRC,
    trigger: 'tap',
    motion: 'Tiga gumpalan warna (violet, cyan, pink) diblur ±26px di belakang teks. Setiap ketukan menggeser dan mengubah ukuran semua gumpalan ke posisi acak baru (translate ±80px, scale 0.8–1.4); pink bergerak paling jauh. Tidak kembali, cukup diam di posisi baru.',
    timing: '≈1100ms · ease-in-out lembut (cubic-bezier .45,0,.55,1)',
    use: 'Latar hero landing page atau kartu promosi yang terasa hidup tanpa mengganggu teks.',
    tags: 'mesh gradient blob blur hero background tap drift',
    allowColor: true,
    html: '<div class="hero"><i class="blob b1"></i><i class="blob b2"></i><i class="blob b3"></i>' + CT + '</div>',
    css: BASE +
      '& .blob{position:absolute;left:50%;top:50%;width:130px;height:130px;margin:-65px;border-radius:50%;filter:blur(26px);opacity:.85;transition:transform 1.1s cubic-bezier(.45,0,.55,1)}' +
      '& .b1{background:#7c5cff;transform:translate(-60px,-30px)}' +
      '& .b2{background:#22d3ee;transform:translate(-70px,40px) scale(.8)}' +
      '& .b3{background:#f472b6;transform:translate(70px,30px)}',
    js: function (root, api) {
      var hero = root.querySelector('.hero');
      var blobs = root.querySelectorAll('.blob');
      if (api.reduce) blobs.forEach(function (b) { b.style.transitionDuration = '200ms'; });
      function drift() {
        blobs.forEach(function (b, i) {
          var k = i === 2 ? 1.4 : 1; // pink travels furthest
          var x = Math.round((Math.random() * 160 - 80) * k), y = Math.round((Math.random() * 90 - 45) * k);
          b.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + (0.8 + Math.random() * 0.6).toFixed(2) + ')';
        });
      }
      hero.addEventListener('click', drift);
      var t = setTimeout(drift, 600);
      return function () { clearTimeout(t); };
    }
  });

  LUZ.add({
    id: 'bg-aurora',
    cat: 'Latar & Efek',
    name: 'Aurora Background',
    source: SRC,
    trigger: 'tap',
    motion: 'Pita aurora horizontal (cyan/biru/violet, blur) bergoyang kiri-kanan terus-menerus dalam loop 6–8 detik, ditambah titik bintang. Saat diketuk pita “melonjak”: kecerahan naik ±1.7× dan pita meninggi (scaleY 1.3) lalu turun pelan.',
    timing: 'goyang 6–8s ease-in-out bolak-balik · lonjakan naik 300ms, turun 800ms ease-out',
    use: 'Latar hero aplikasi bertema malam atau layar sambutan; ketukan memberi rasa responsif.',
    tags: 'aurora bands sway glow surge background stars',
    allowColor: true,
    html: '<div class="hero"><div class="aur"><i class="band a1"></i><i class="band a2"></i><i class="band a3"></i></div><i class="stars"></i>' + CT + '</div>',
    css: BASE +
      '& .hero{background:#0b1026}' +
      '& .aur{position:absolute;inset:0;transform-origin:50% 40%}' +
      '& .band{position:absolute;left:-30%;width:160%;height:34px;border-radius:50%;filter:blur(14px);animation:aurSway 7s ease-in-out infinite alternate}' +
      '& .a1{top:22px;background:linear-gradient(90deg,transparent,#22d3ee,#6366f1,transparent);transform:rotate(-6deg)}' +
      '& .a2{top:52px;background:linear-gradient(90deg,transparent,#3b82f6,#a855f7,transparent);animation-duration:8.5s;animation-delay:-3s;opacity:.8}' +
      '& .a3{top:84px;background:linear-gradient(90deg,transparent,#2dd4bf,#3b82f6,transparent);animation-duration:6s;animation-delay:-1s;opacity:.55}' +
      '& .stars{position:absolute;inset:0;background-image:radial-gradient(1px 1px at 20% 30%,#fff,transparent),radial-gradient(1px 1px at 70% 20%,#fff,transparent),radial-gradient(1px 1px at 85% 70%,#fff,transparent),radial-gradient(1px 1px at 35% 80%,#fff,transparent),radial-gradient(1px 1px at 55% 55%,#fff,transparent);opacity:.6}' +
      '@keyframes aurSway{from{translate:-12% 0}to{translate:12% 4px}}' +
      '@media (prefers-reduced-motion: reduce){& .band{animation:none}}',
    js: function (root, api) {
      var hero = root.querySelector('.hero'), aur = root.querySelector('.aur');
      function surge() {
        aur.animate(api.reduce
          ? [{ filter: 'brightness(1)' }, { filter: 'brightness(1.5)' }, { filter: 'brightness(1)' }]
          : [{ filter: 'brightness(1)', transform: 'scaleY(1)' },
             { filter: 'brightness(1.7)', transform: 'scaleY(1.3)', offset: 0.27 },
             { filter: 'brightness(1)', transform: 'scaleY(1)' }],
          { duration: 1100, easing: 'ease-out' });
      }
      hero.addEventListener('click', surge);
      var t = setTimeout(surge, 600);
      return function () { clearTimeout(t); };
    }
  });

  LUZ.add({
    id: 'bg-noise-texture',
    cat: 'Latar & Efek',
    name: 'Noise Texture',
    source: SRC,
    trigger: 'tap',
    motion: 'Lapisan butir film (noise) bergetar di atas cahaya lembut di sudut kartu. Setiap ketukan membuat butir berdenyut (opasitas 0.14→0.4→0.14), cahaya membesar (scale 1→1.25) dan warnanya berganti pink → teal → biru.',
    timing: 'denyut ≈700ms ease-out · pergantian warna 600ms',
    use: 'Latar kartu premium atau header profil yang butuh tekstur analog.',
    tags: 'noise grain film texture glow pulse hue',
    allowColor: true,
    html: '<div class="hero"><i class="glow"></i><i class="grain"></i>' + CT + '</div>',
    css: BASE +
      '& .glow{position:absolute;right:-60px;bottom:-70px;width:220px;height:200px;border-radius:50%;background:radial-gradient(closest-side,#f0508c,rgba(124,92,255,.5) 60%,transparent);filter:blur(10px);transition:filter .6s ease}' +
      '& .grain{position:absolute;inset:-20px;opacity:.14;mix-blend-mode:overlay;animation:grainJit .5s steps(3) infinite}' +
      '@keyframes grainJit{0%{transform:translate(0,0)}33%{transform:translate(-6px,4px)}66%{transform:translate(5px,-5px)}100%{transform:translate(0,0)}}' +
      '@media (prefers-reduced-motion: reduce){& .grain{animation:none}}',
    js: function (root, api) {
      var hero = root.querySelector('.hero'), glow = root.querySelector('.glow'), grain = root.querySelector('.grain');
      var c = document.createElement('canvas'); c.width = c.height = 90;
      var g = c.getContext('2d'), img = g.createImageData(90, 90);
      for (var i = 0; i < img.data.length; i += 4) { var v = Math.random() * 255; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
      g.putImageData(img, 0, 0); grain.style.backgroundImage = 'url(' + c.toDataURL() + ')';
      var hues = [0, 200, 250], h = 0;
      function pulse() {
        h = (h + 1) % hues.length;
        glow.style.filter = 'blur(10px) hue-rotate(' + hues[h] + 'deg)';
        grain.animate([{ opacity: 0.14 }, { opacity: 0.4, offset: 0.3 }, { opacity: 0.14 }], { duration: 700, easing: 'ease-out' });
        if (!api.reduce) glow.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.25)', offset: 0.35 }, { transform: 'scale(1)' }], { duration: 700, easing: 'ease-out' });
      }
      hero.addEventListener('click', pulse);
      var t = setTimeout(pulse, 600);
      return function () { clearTimeout(t); };
    }
  });

  LUZ.add({
    id: 'bg-dot-grid',
    cat: 'Latar & Efek',
    name: 'Dot Grid',
    source: SRC,
    trigger: 'tap',
    motion: 'Grid titik yang memudar ke tepi (mask radial). Ketukan mengirim riak berbentuk cincin dari titik sentuh: tiap titik yang dilewati cincin membesar 1.8× dan menyala, lalu redup lagi; jeda tiap titik sebanding jaraknya ke titik sentuh.',
    timing: 'cincin menyebar ≈800ms · tiap titik 450ms ease-out · jeda 2.2ms/px',
    use: 'Latar hero teknis/developer, atau umpan balik ketukan pada area kosong yang luas.',
    tags: 'dot grid ripple wave tap distance stagger',
    allowColor: true,
    html: '<div class="hero"><div class="dots"></div>' + CT + '</div>',
    css: BASE +
      '& .hero{background:#0d0f1f}' +
      '& .dots{position:absolute;inset:0;-webkit-mask-image:radial-gradient(ellipse at center,#000 30%,transparent 80%);mask-image:radial-gradient(ellipse at center,#000 30%,transparent 80%)}' +
      '& .dots i{position:absolute;width:3px;height:3px;margin:-1.5px;border-radius:50%;background:#8fa0ff;opacity:.3}',
    js: function (root, api) {
      var hero = root.querySelector('.hero'), box = root.querySelector('.dots'), dots = [];
      for (var y = 8; y < 150; y += 14) for (var x = 8; x < 236; x += 14) {
        var d = document.createElement('i'); d.style.left = x + 'px'; d.style.top = y + 'px';
        box.appendChild(d); dots.push([d, x, y]);
      }
      function ripple(px, py) {
        dots.forEach(function (p) {
          var dist = Math.hypot(p[1] - px, p[2] - py);
          p[0].animate([{ transform: 'scale(1)', opacity: 0.3 }, { transform: 'scale(1.8)', opacity: 1, offset: 0.35 }, { transform: 'scale(1)', opacity: 0.3 }],
            { duration: 450, delay: api.reduce ? 0 : dist * 2.2, easing: 'ease-out' });
        });
      }
      hero.addEventListener('click', function (e) { var r = hero.getBoundingClientRect(); ripple(e.clientX - r.left, e.clientY - r.top); });
      var t = setTimeout(function () { ripple(190, 30); }, 600);
      return function () { clearTimeout(t); };
    }
  });

  LUZ.add({
    id: 'bg-spotlight',
    cat: 'Latar & Efek',
    name: 'Spotlight Effect',
    source: SRC,
    trigger: 'tap',
    motion: 'Grid garis redup menutupi kartu. Sorot cahaya lembut berdiameter ±140px menerangi garis di sekitarnya. Saat diketuk, sorot meluncur dari posisinya sekarang ke titik sentuh (sedikit tertinggal) dan garis di sana ikut menyala.',
    timing: '≈700ms · ease-out (cubic-bezier .2,.8,.2,1)',
    use: 'Latar section fitur atau kartu harga yang mengikuti kursor/sentuhan.',
    tags: 'spotlight grid lines glow follow cursor tap mask',
    allowColor: true,
    html: '<div class="hero"><i class="grid"></i><i class="lit"></i><i class="spot"></i>' + CT + '</div>',
    css: BASE +
      '& .hero{background:#0c0d16}' +
      '& .grid,& .lit{position:absolute;inset:0;background-image:linear-gradient(rgba(140,150,255,.16) 1px,transparent 1px),linear-gradient(90deg,rgba(140,150,255,.16) 1px,transparent 1px);background-size:18px 18px}' +
      '& .lit{background-image:linear-gradient(rgba(170,180,255,.9) 1px,transparent 1px),linear-gradient(90deg,rgba(170,180,255,.9) 1px,transparent 1px);-webkit-mask:radial-gradient(closest-side,#000,transparent) no-repeat;mask:radial-gradient(closest-side,#000,transparent) no-repeat;-webkit-mask-size:140px 140px;mask-size:140px 140px;-webkit-mask-position:150px 60px;mask-position:150px 60px;transition:-webkit-mask-position .7s cubic-bezier(.2,.8,.2,1),mask-position .7s cubic-bezier(.2,.8,.2,1)}' +
      '& .spot{position:absolute;left:0;top:0;width:140px;height:140px;border-radius:50%;background:radial-gradient(closest-side,rgba(120,130,255,.35),transparent);transform:translate(150px,60px);transition:transform .7s cubic-bezier(.2,.8,.2,1)}',
    js: function (root, api) {
      var hero = root.querySelector('.hero'), lit = root.querySelector('.lit'), spot = root.querySelector('.spot');
      if (api.reduce) { lit.style.transition = spot.style.transition = 'none'; }
      function go(x, y) {
        var p = (x - 70) + 'px ' + (y - 70) + 'px';
        lit.style.webkitMaskPosition = p; lit.style.maskPosition = p;
        spot.style.transform = 'translate(' + (x - 70) + 'px,' + (y - 70) + 'px)';
      }
      go(220, 130);
      hero.addEventListener('click', function (e) { var r = hero.getBoundingClientRect(); go(e.clientX - r.left, e.clientY - r.top); });
      var t = setTimeout(function () { go(30, 30); }, 600);
      return function () { clearTimeout(t); };
    }
  });

  LUZ.add({
    id: 'bg-animated-gradient',
    cat: 'Latar & Efek',
    name: 'Animated Gradient',
    source: SRC,
    trigger: 'tap',
    motion: 'Gradien linear besar mengalir pelan terus-menerus (lapisan 3× ukuran kartu digeser bolak-balik). Setiap ketukan memutar sudut gradien +60° dan menggeser hue ke palet berikutnya (ungu/pink → biru/teal → violet/magenta) dengan crossfade halus.',
    timing: 'alir 10s loop · putar & hue 800ms ease-in-out',
    use: 'Latar hero, kartu CTA, atau layar login yang ingin terasa hidup.',
    tags: 'animated gradient flow angle hue rotate background',
    allowColor: true,
    html: '<div class="hero"><div class="rot"><i class="flow"></i></div>' + CT + '</div>',
    css: BASE +
      '& .rot{position:absolute;left:50%;top:50%;width:320px;height:320px;margin:-160px;transition:transform .8s ease-in-out,filter .8s ease-in-out}' +
      '& .flow{position:absolute;inset:-50%;background:linear-gradient(90deg,#3b2bb5,#8b3fd9,#d9468f,#3b2bb5,#8b3fd9);animation:gFlow 10s ease-in-out infinite alternate}' +
      '@keyframes gFlow{from{transform:translateX(-18%)}to{transform:translateX(18%)}}' +
      '@media (prefers-reduced-motion: reduce){& .flow{animation:none}}',
    js: function (root, api) {
      var hero = root.querySelector('.hero'), rot = root.querySelector('.rot'), n = 0;
      if (api.reduce) rot.style.transitionDuration = '200ms';
      var hues = [0, -120, -40]; // ungu/pink → biru/teal → violet/magenta
      function turn() { n++; rot.style.transform = 'rotate(' + n * 60 + 'deg)'; rot.style.filter = 'hue-rotate(' + hues[n % 3] + 'deg)'; }
      hero.addEventListener('click', turn);
      var t = setTimeout(turn, 600);
      return function () { clearTimeout(t); };
    }
  });
})();
