/* Button · Part 5 — one gradient pill button, six press feedbacks.
   Every tap advances the state Start → Pause → Resume → Finish → Start;
   the gradient and label swap at the deepest point of the press.
   Gradients are the point of the set, so literal colours are allowed. */
(function () {
  var SRC = 'Button · Part 5';
  var CSS =
    '& .bt{position:relative;width:200px;height:50px;border:0;border-radius:25px;padding:0;cursor:pointer;color:#fff;font:700 16px/1 system-ui,-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 8px 18px rgba(0,0,0,.28);-webkit-tap-highlight-color:transparent}' +
    '& .bt svg{width:14px;height:14px;fill:#fff}' +
    '& .s0{background:linear-gradient(90deg,#6a5cff,#2bb4ff)}& .s1{background:linear-gradient(90deg,#ff5fa2,#7b5cff)}' +
    '& .s2{background:linear-gradient(90deg,#1a9bff,#16b58a)}& .s3{background:linear-gradient(90deg,#ff9a1f,#ff5f8f)}';
  var HTML = '<button class="bt s3"><svg viewBox="0 0 14 14"><path d="M2 7.5l3.2 3L12 3.5" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg><b>Finish</b></button>';
  /* Each js below repeats the small state swap (ST labels/icons + next()) so every demo stays self-contained. */

  LUZ.add({
    id: 'button5-soft-inset',
    cat: 'Tombol & Toggle',
    name: 'Soft Inset',
    source: SRC,
    trigger: 'tap',
    motion: 'Bayangan timbul di bawah tombol hilang dan berganti bayangan dalam (inner shadow) sehingga pil terlihat tenggelam: scale 0.96, kecerahan turun ke 0.8. Label dan gradien berganti saat paling dalam, lalu tombol muncul kembali ke 1 dengan bayangan luar.',
    timing: 'tenggelam 150ms ease-out · tahan ≈100ms · muncul 300ms ease-out · total ≈550ms',
    use: 'Tombol aksi utama bergaya neumorphism/soft UI, misalnya tombol Mulai/Selesai sesi.',
    tags: 'button press inset inner shadow neumorphism sink pop state',
    allowColor: true,
    html: HTML.replace('<svg', '<i class="in"></i><svg'),
    css: CSS + '& .in{position:absolute;inset:0;border-radius:inherit;box-shadow:inset 0 5px 12px rgba(0,0,0,.5),inset 0 -2px 6px rgba(255,255,255,.15);opacity:0;pointer-events:none}',
    js: function (root, api) {
      var ST = [['Start', '<path d="M3 1.5v11l10-5.5z"/>'], ['Pause', '<path d="M2.5 1.5h3v11h-3zM8.5 1.5h3v11h-3z"/>'], ['Resume', '<path d="M3 1.5v11l10-5.5z"/>'], ['Finish', '<path d="M2 7.5l3.2 3L12 3.5" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>']];
      var b = root.querySelector('.bt'), s = 3, T = [];
      var next = function () { b.classList.remove('s' + s); s = (s + 1) % 4; b.classList.add('s' + s); b.querySelector('svg').innerHTML = ST[s][1]; b.querySelector('b').textContent = ST[s][0]; };
      function press() {
        T.forEach(clearTimeout); T = [setTimeout(next, api.reduce ? 0 : 200)];
        if (api.reduce) return;
        b.animate({ transform: ['scale(1)', 'scale(.96)', 'scale(.96)', 'scale(1)'], filter: ['brightness(1)', 'brightness(.8)', 'brightness(.8)', 'brightness(1)'], boxShadow: ['0 8px 18px rgba(0,0,0,.28)', '0 0 0 rgba(0,0,0,0)', '0 0 0 rgba(0,0,0,0)', '0 8px 18px rgba(0,0,0,.28)'], offset: [0, 0.27, 0.45, 1] }, { duration: 550, easing: 'ease-out' });
        b.querySelector('.in').animate({ opacity: [0, 1, 1, 0], offset: [0, 0.27, 0.45, 1] }, { duration: 550, easing: 'ease-out' });
      }
      b.addEventListener('click', press);
      T.push(setTimeout(press, 600));
      return function () { T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'button5-finger-dent',
    cat: 'Tombol & Toggle',
    name: 'Finger Dent',
    source: SRC,
    trigger: 'tap',
    motion: 'Permukaan pil penyok tepat di bawah jari: sisi yang ditekan memipih (scaleY 0.86 dengan titik tumpu di posisi jari) dan muncul bayangan cekung bulat di titik sentuh. Setelah dilepas, pil bergoyang seperti karet (scaleX/scaleY 1.05/0.95 → 0.98/1.02 → 1) sebelum diam. Label berganti saat penyok paling dalam.',
    timing: 'penyok 120ms ease-out · goyangan karet ≈500ms (3 osilasi mengecil) · total ≈620ms',
    use: 'Tombol yang ingin terasa fisik dan kenyal, misalnya tombol mulai latihan atau rekam.',
    tags: 'button press dent rubber wobble squash jelly finger',
    allowColor: true,
    html: HTML.replace('<b>', '<i class="dn"></i><b>'),
    css: CSS + '& .bt{overflow:hidden}& .dn{position:absolute;top:50%;left:50px;width:60px;height:60px;margin:-30px 0 0 -30px;border-radius:50%;background:radial-gradient(circle,rgba(0,0,0,.35),rgba(0,0,0,0) 70%);opacity:0;pointer-events:none}',
    js: function (root, api) {
      var ST = [['Start', '<path d="M3 1.5v11l10-5.5z"/>'], ['Pause', '<path d="M2.5 1.5h3v11h-3zM8.5 1.5h3v11h-3z"/>'], ['Resume', '<path d="M3 1.5v11l10-5.5z"/>'], ['Finish', '<path d="M2 7.5l3.2 3L12 3.5" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>']];
      var b = root.querySelector('.bt'), dn = b.querySelector('.dn'), s = 3, T = [];
      var next = function () { b.classList.remove('s' + s); s = (s + 1) % 4; b.classList.add('s' + s); b.querySelector('svg').innerHTML = ST[s][1]; b.querySelector('b').textContent = ST[s][0]; };
      function press(x) {
        T.forEach(clearTimeout); T = [setTimeout(next, api.reduce ? 0 : 120)];
        if (api.reduce) return;
        b.style.transformOrigin = x + 'px 50%'; dn.style.left = x + 'px';
        b.animate({ transform: ['scale(1,1)', 'scale(.97,.86)', 'scale(1.05,.95)', 'scale(.98,1.02)', 'scale(1.01,.99)', 'scale(1,1)'], offset: [0, 0.2, 0.45, 0.65, 0.82, 1] }, { duration: 620, easing: 'ease-out' });
        dn.animate({ opacity: [0, 1, 0], transform: ['scale(.5)', 'scale(1)', 'scale(1.2)'], offset: [0, 0.2, 0.6] }, { duration: 620, easing: 'ease-out' });
      }
      b.addEventListener('click', function (e) { press(e.clientX - b.getBoundingClientRect().left); });
      T.push(setTimeout(function () { press(40); }, 600));
      return function () { T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'button5-tilt-press',
    cat: 'Tombol & Toggle',
    name: 'Tilt Press',
    source: SRC,
    trigger: 'tap',
    motion: 'Tombol miring 3D ke arah sisi yang ditekan: rotateY ±14° (perspective 400px) sehingga sisi itu terdorong ke belakang dan sisi seberang terangkat, scale 0.97. Lalu tombol bergoyang kembali datar (−5° → 2° → 0°) seperti papan jungkat-jungkit. Label berganti di titik miring terdalam.',
    timing: 'miring 140ms ease-out · kembali ≈460ms dengan 2 ayunan mengecil · total ≈600ms',
    use: 'Tombol kartu/aksi yang ingin terasa responsif terhadap posisi jari, misalnya tombol bayar atau konfirmasi.',
    tags: 'button press tilt 3d perspective rotate rock seesaw',
    allowColor: true,
    html: HTML,
    css: CSS,
    js: function (root, api) {
      var ST = [['Start', '<path d="M3 1.5v11l10-5.5z"/>'], ['Pause', '<path d="M2.5 1.5h3v11h-3zM8.5 1.5h3v11h-3z"/>'], ['Resume', '<path d="M3 1.5v11l10-5.5z"/>'], ['Finish', '<path d="M2 7.5l3.2 3L12 3.5" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>']];
      var b = root.querySelector('.bt'), s = 3, T = [];
      var next = function () { b.classList.remove('s' + s); s = (s + 1) % 4; b.classList.add('s' + s); b.querySelector('svg').innerHTML = ST[s][1]; b.querySelector('b').textContent = ST[s][0]; };
      function press(x) {
        T.forEach(clearTimeout); T = [setTimeout(next, api.reduce ? 0 : 140)];
        if (api.reduce) return;
        var d = x < 100 ? -1 : 1, r = function (a, sc) { return 'perspective(400px) rotateY(' + a * d + 'deg) scale(' + sc + ')'; };
        b.animate({ transform: [r(0, 1), r(14, 0.97), r(-5, 1), r(2, 1), r(0, 1)], offset: [0, 0.23, 0.55, 0.8, 1] }, { duration: 600, easing: 'ease-out' });
      }
      b.addEventListener('click', function (e) { press(e.clientX - b.getBoundingClientRect().left); });
      T.push(setTimeout(function () { press(40); }, 600));
      return function () { T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'button5-haptic-buzz',
    cat: 'Tombol & Toggle',
    name: 'Haptic Buzz',
    source: SRC,
    trigger: 'tap',
    motion: 'Getaran pendek seperti HP: tombol bergeser kiri-kanan ±3px sebanyak 6 kali sambil sedikit mengecil (0.97). Bersamaan, dua pasang busur getar "((  ))" muncul di kedua sisi tombol, bergerak 4px menjauh lalu pudar. Label berganti di awal getaran.',
    timing: 'getar 320ms linear (6 siklus ≈53ms) · busur 450ms ease-out, busur luar +60ms',
    use: 'Umpan balik tekan yang meniru haptic di web, misalnya tombol panggil/darurat atau konfirmasi penting.',
    tags: 'button haptic buzz vibrate shake wiggle arcs feedback',
    allowColor: true,
    html: '<div class="hw"><i class="ar l"></i><i class="ar l o"></i>' + HTML + '<i class="ar r"></i><i class="ar r o"></i></div>',
    css: CSS + '& .hw{position:relative}' +
      '& .ar{position:absolute;top:50%;width:12px;height:26px;margin-top:-13px;border-radius:50%;border:2px solid transparent;opacity:0;pointer-events:none}' +
      '& .l{left:-14px;border-left-color:var(--d-mid)}& .l.o{left:-22px}& .r{right:-14px;border-right-color:var(--d-mid)}& .r.o{right:-22px}',
    js: function (root, api) {
      var ST = [['Start', '<path d="M3 1.5v11l10-5.5z"/>'], ['Pause', '<path d="M2.5 1.5h3v11h-3zM8.5 1.5h3v11h-3z"/>'], ['Resume', '<path d="M3 1.5v11l10-5.5z"/>'], ['Finish', '<path d="M2 7.5l3.2 3L12 3.5" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>']];
      var b = root.querySelector('.bt'), s = 3, T = [];
      var next = function () { b.classList.remove('s' + s); s = (s + 1) % 4; b.classList.add('s' + s); b.querySelector('svg').innerHTML = ST[s][1]; b.querySelector('b').textContent = ST[s][0]; };
      function press() {
        T.forEach(clearTimeout); T = [setTimeout(next, api.reduce ? 0 : 60)];
        if (api.reduce) return;
        var k = [];
        for (var i = 0; i <= 12; i++) k.push('translateX(' + (i === 12 ? 0 : (i % 2 ? 3 : -3)) + 'px) scale(' + (i === 12 ? 1 : 0.97) + ')');
        b.animate({ transform: k }, { duration: 320, easing: 'linear' });
        root.querySelectorAll('.ar').forEach(function (a) {
          var d = a.classList.contains('l') ? -4 : 4;
          a.animate({ opacity: [0, 1, 0], transform: ['translateX(0)', 'translateX(' + d + 'px)'] }, { duration: 450, delay: a.classList.contains('o') ? 60 : 0, easing: 'ease-out' });
        });
      }
      b.addEventListener('click', press);
      T.push(setTimeout(press, 600));
      return function () { T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'button5-pogo-bounce',
    cat: 'Tombol & Toggle',
    name: 'Pogo Bounce',
    source: SRC,
    trigger: 'tap',
    motion: 'Tombol ditekan turun 4px (scale 0.96), lalu melambung ke atas 16px seperti bola, mendarat, memantul lagi 6px, dan mendarat kedua kali. Bayangan menipis saat tombol di udara. Label berganti saat tekanan pertama.',
    timing: '≈800ms · tekan 100ms · lambung 1 (16px) ≈300ms · lambung 2 (6px) ≈250ms · ease-in-out per segmen',
    use: 'Tombol yang ingin terasa riang, misalnya tombol mulai permainan, Selesai tugas, atau hadiah.',
    tags: 'button pogo bounce jump hop ball land double bounce',
    allowColor: true,
    html: HTML,
    css: CSS,
    js: function (root, api) {
      var ST = [['Start', '<path d="M3 1.5v11l10-5.5z"/>'], ['Pause', '<path d="M2.5 1.5h3v11h-3zM8.5 1.5h3v11h-3z"/>'], ['Resume', '<path d="M3 1.5v11l10-5.5z"/>'], ['Finish', '<path d="M2 7.5l3.2 3L12 3.5" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>']];
      var b = root.querySelector('.bt'), s = 3, T = [];
      var next = function () { b.classList.remove('s' + s); s = (s + 1) % 4; b.classList.add('s' + s); b.querySelector('svg').innerHTML = ST[s][1]; b.querySelector('b').textContent = ST[s][0]; };
      function press() {
        T.forEach(clearTimeout); T = [setTimeout(next, api.reduce ? 0 : 100)];
        if (api.reduce) return;
        var y = function (v, sc) { return 'translateY(' + v + 'px) scale(' + sc + ')'; };
        b.animate({ transform: [y(0, 1), y(4, 0.96), y(-16, 1), y(0, 1), y(-6, 1), y(0, 1)], boxShadow: ['0 8px 18px rgba(0,0,0,.28)', '0 3px 6px rgba(0,0,0,.28)', '0 20px 24px rgba(0,0,0,.12)', '0 8px 18px rgba(0,0,0,.28)', '0 12px 20px rgba(0,0,0,.2)', '0 8px 18px rgba(0,0,0,.28)'], offset: [0, 0.12, 0.38, 0.62, 0.8, 1], easing: 'ease-in-out' }, { duration: 800 });
      }
      b.addEventListener('click', press);
      T.push(setTimeout(press, 600));
      return function () { T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'button5-spring-pop',
    cat: 'Tombol & Toggle',
    name: 'Spring Pop',
    source: SRC,
    trigger: 'tap',
    motion: 'Tombol menyusut ke 0.85 di bawah jari, lalu memegas kembali lebih besar dari semula (1.12), turun ke 0.97, dan mengendap di 1. Label dan gradien berganti saat ukuran paling kecil.',
    timing: 'susut 120ms ease-in · pegas ≈480ms (1.12 → 0.97 → 1) · total ≈600ms',
    use: 'Tombol aksi utama serbaguna yang butuh konfirmasi tekan yang jelas, misalnya Simpan, Kirim, atau Selesai.',
    tags: 'button spring pop scale press overshoot bounce',
    allowColor: true,
    html: HTML,
    css: CSS,
    js: function (root, api) {
      var ST = [['Start', '<path d="M3 1.5v11l10-5.5z"/>'], ['Pause', '<path d="M2.5 1.5h3v11h-3zM8.5 1.5h3v11h-3z"/>'], ['Resume', '<path d="M3 1.5v11l10-5.5z"/>'], ['Finish', '<path d="M2 7.5l3.2 3L12 3.5" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>']];
      var b = root.querySelector('.bt'), s = 3, T = [];
      var next = function () { b.classList.remove('s' + s); s = (s + 1) % 4; b.classList.add('s' + s); b.querySelector('svg').innerHTML = ST[s][1]; b.querySelector('b').textContent = ST[s][0]; };
      function press() {
        T.forEach(clearTimeout); T = [setTimeout(next, api.reduce ? 0 : 120)];
        if (api.reduce) return;
        b.animate({ transform: ['scale(1)', 'scale(.85)', 'scale(1.12)', 'scale(.97)', 'scale(1.01)', 'scale(1)'], offset: [0, 0.2, 0.5, 0.72, 0.88, 1] }, { duration: 600, easing: 'ease-out' });
      }
      b.addEventListener('click', press);
      T.push(setTimeout(press, 600));
      return function () { T.forEach(clearTimeout); };
    }
  });
})();
