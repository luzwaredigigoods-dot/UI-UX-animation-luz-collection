/* Icon Morph · Part 1 — three toggle buttons per demo: Menu ↔ Close, Play ↔ Pause, Add ↔ Added.
   Tap any button; the circle fills with accent and the icon changes with that demo's motion.
   Each demo autoplays once (the three buttons flip one after another, 250ms apart). */
(function () {
  var SRC = 'Icon Morph · Part 1';
  var N = [['Menu', 'Close'], ['Play', 'Pause'], ['Add', 'Added']];
  var IC = [
    ['<path d="M5 7h14M5 12h14M5 17h14"/>', '<path d="M6 6l12 12M18 6L6 18"/>'],
    ['<path class="f" d="M8 5.5v13l11-6.5z"/>', '<rect class="f" x="6" y="5" width="4" height="14" rx="1"/><rect class="f" x="14" y="5" width="4" height="14" rx="1"/>'],
    ['<path d="M12 5v14M5 12h14"/>', '<path d="M5 12.5l4.5 4.5L19 7"/>']
  ];
  var svg = function (s) { return '<svg viewBox="0 0 24 24">' + s + '</svg>'; };
  // inner(i) returns the button's inside; default = two stacked icon layers .a (off) and .b (on)
  var layers = function (wrap) {
    return function (i) { return '<span class="ic a">' + wrap(svg(IC[i][0])) + '</span><span class="ic b">' + wrap(svg(IC[i][1])) + '</span>'; };
  };
  var same = function (s) { return s; };
  var row = function (inner) {
    return '<div class="row">' + [0, 1, 2].map(function (i) {
      return '<div class="it"><button class="ib" aria-pressed="false" data-a="' + N[i][0] + '" data-b="' + N[i][1] + '">' + inner(i) + '</button><small>' + N[i][0] + '</small></div>';
    }).join('') + '</div>';
  };
  var CSS =
    '& .row{display:flex;gap:18px}& .it{display:grid;justify-items:center;gap:7px}' +
    '& .it small{font-size:11px;color:var(--d-mid);transition:color .2s}& .on+small{color:var(--d-fg);font-weight:600}' +
    '& .ib{position:relative;width:52px;height:52px;border-radius:50%;border:1.5px solid var(--d-soft);background:none;padding:0;cursor:pointer;color:var(--d-fg);transition:color .25s,border-color .25s;-webkit-tap-highlight-color:transparent}' +
    '& .ib::before{content:"";position:absolute;inset:-1.5px;border-radius:50%;background:var(--d-accent);opacity:0;transform:scale(.7);transition:opacity .25s,transform .35s cubic-bezier(.3,1.5,.5,1)}' +
    '& .ib.on{color:var(--d-bg);border-color:transparent}& .ib.on::before{opacity:1;transform:scale(1)}' +
    '& .ic{position:absolute;inset:0;display:grid;place-items:center}' +
    '& .ic svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}& .ic .f{fill:currentColor}' +
    '& .ib .b{opacity:0}& .ib.on .a{opacity:0}& .ib.on .b{opacity:1}';

  LUZ.add({
    id: 'iconmorph1-stroke-morph',
    cat: 'Tombol & Toggle',
    name: 'Stroke Morph',
    source: SRC,
    trigger: 'tap',
    motion: 'Garis-garis ikon sendiri yang berpindah: 3 garis menu berputar ±45° jadi X (garis tengah menyusut ke 0), segitiga Play terbelah dua lalu tiap potongan (clip-path polygon) berubah jadi batang Pause, dan dua garis tanda + berputar dan memendek jadi centang. Semua dengan pegas yang sedikit melewati posisi akhir. Lingkaran latar terisi aksen (scale 0.7→1).',
    timing: '450ms cubic-bezier(.3,1.6,.5,1) (overshoot) · isi lingkaran 350ms',
    use: 'Tombol ikon dua keadaan yang sering dipakai: buka/tutup menu, putar/jeda media, tambah ke daftar.',
    tags: 'icon morph hamburger close play pause plus check stroke transform toggle',
    html: row(function (i) {
      var p = [['i', 'l1'], ['i', 'l2'], ['i', 'l3']];
      if (i === 1) p = [['b', 'p1'], ['b', 'p2']];
      if (i === 2) p = [['i', 'm1'], ['i', 'm2']];
      return '<span class="sm">' + p.map(function (x) { return '<' + x[0] + ' class="' + x[1] + '"></' + x[0] + '>'; }).join('') + '</span>';
    }),
    css: CSS +
      '& .sm{position:absolute;left:50%;top:50%;width:24px;height:24px;margin:-12px 0 0 -12px}' +
      '& .sm i{position:absolute;left:5px;top:10.8px;width:14px;height:2.4px;border-radius:2px;background:currentColor;transition:transform .45s cubic-bezier(.3,1.6,.5,1),opacity .2s}' +
      '& .l1{transform:translateY(-5px)}& .l3{transform:translateY(5px)}' +
      '& .on .l1{transform:rotate(45deg) scaleX(1.2)}& .on .l2{opacity:0;transform:scaleX(0)}& .on .l3{transform:rotate(-45deg) scaleX(1.2)}' +
      '& .sm b{position:absolute;inset:0;background:currentColor;transition:clip-path .45s cubic-bezier(.3,1.3,.5,1)}' +
      '& .p1{clip-path:polygon(33% 23%,58% 38%,58% 62%,33% 77%)}& .p2{clip-path:polygon(58% 38%,79% 50%,79% 50%,58% 62%)}' +
      '& .on .p1{clip-path:polygon(25% 21%,42% 21%,42% 79%,25% 79%)}& .on .p2{clip-path:polygon(58% 21%,75% 21%,75% 79%,58% 79%)}' +
      '& .m1{transform:translate(0,0) rotate(90deg) scaleX(1)}& .m2{transform:translate(0,0) rotate(0) scaleX(1)}' +
      '& .on .m1{transform:translate(-4.75px,2.75px) rotate(45deg) scaleX(.46)}& .on .m2{transform:translate(2.25px,0) rotate(-46.5deg) scaleX(.99)}',
    js: function (root, api) {
      var bs = root.querySelectorAll('.ib'), T = [];
      if (api.reduce) root.querySelectorAll('.sm *').forEach(function (e) { e.style.transition = 'none'; });
      function tog(b) {
        var on = !b.classList.contains('on');
        b.classList.toggle('on', on); b.setAttribute('aria-pressed', on);
        b.nextElementSibling.textContent = b.dataset[on ? 'b' : 'a'];
      }
      bs.forEach(function (b) { b.addEventListener('click', function () { T.forEach(clearTimeout); tog(b); }); });
      bs.forEach(function (b, i) { T.push(setTimeout(function () { tog(b); }, 600 + i * 250)); });
      return function () { T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'iconmorph1-spin-swap',
    cat: 'Tombol & Toggle',
    name: 'Spin Swap',
    source: SRC,
    trigger: 'tap',
    motion: 'Ikon lama berputar −180° sambil mengecil ke 0.3 dan memudar; ikon baru masuk berputar dari 180° ke 0° dan membesar dari 0.3 ke 1 dengan pegas, mulai 100ms setelah ikon lama.',
    timing: 'keluar 300ms ease-in · masuk 350ms cubic-bezier(.3,1.4,.5,1) delay 100ms',
    use: 'Ganti ikon status yang ingin terasa hidup, misalnya tombol putar/jeda atau simpan ke favorit.',
    tags: 'icon swap spin rotate scale crossfade toggle',
    html: row(layers(same)),
    css: CSS,
    js: function (root, api) {
      var bs = root.querySelectorAll('.ib'), T = [];
      function anim(out, inn) {
        out.animate({ transform: ['rotate(0) scale(1)', 'rotate(-180deg) scale(.3)'], opacity: [1, 0] }, { duration: 300, easing: 'ease-in' });
        inn.animate({ transform: ['rotate(180deg) scale(.3)', 'rotate(0) scale(1)'], opacity: [0, 1] }, { duration: 350, delay: 100, easing: 'cubic-bezier(.3,1.4,.5,1)', fill: 'backwards' });
      }
      function tog(b) {
        var on = !b.classList.contains('on'), out = b.querySelector(on ? '.a' : '.b'), inn = b.querySelector(on ? '.b' : '.a');
        b.classList.toggle('on', on); b.setAttribute('aria-pressed', on);
        b.nextElementSibling.textContent = b.dataset[on ? 'b' : 'a'];
        b.getAnimations({ subtree: true }).forEach(function (a) { a.cancel(); });
        if (!api.reduce) anim(out, inn);
      }
      bs.forEach(function (b) { b.addEventListener('click', function () { T.forEach(clearTimeout); tog(b); }); });
      bs.forEach(function (b, i) { T.push(setTimeout(function () { tog(b); }, 600 + i * 250)); });
      return function () { T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'iconmorph1-pen-redraw',
    cat: 'Tombol & Toggle',
    name: 'Pen Redraw',
    source: SRC,
    trigger: 'tap',
    motion: 'Ikon lama dihapus goresan demi goresan (stroke-dashoffset 0→1), lalu ikon baru digambar ulang oleh "pena" bercahaya: tiap goresan ditarik bergantian berjarak 80ms dengan glow drop-shadow 4px yang memudar, dan isi bentuk padat (Play/Pause) muncul di akhir.',
    timing: 'hapus 220ms ease-in · gambar 380ms ease-out per goresan, mulai 200ms, stagger 80ms · glow 600ms',
    use: 'Konfirmasi yang ingin terasa "ditulis tangan", misalnya tanda tangan selesai, tugas ditambahkan, atau langkah onboarding.',
    tags: 'icon pen draw redraw stroke dashoffset line drawing glow',
    html: row(layers(function (s) { return s.replace(/<(path|rect)/g, '<$1 pathLength="1"'); })),
    css: CSS + '& .ic svg *{stroke-dasharray:1}',
    js: function (root, api) {
      var bs = root.querySelectorAll('.ib'), T = [];
      function anim(out, inn) {
        out.animate({ opacity: [1, 1] }, { duration: 220 });
        out.querySelectorAll('svg *').forEach(function (p) { p.animate({ strokeDashoffset: [0, 1], fillOpacity: [1, 0] }, { duration: 220, easing: 'ease-in' }); });
        inn.querySelectorAll('svg *').forEach(function (p, k) {
          p.animate({ strokeDashoffset: [1, 0, 0], fillOpacity: [0, 0, 1] }, { duration: 460, delay: 200 + k * 80, easing: 'ease-out', fill: 'backwards' });
        });
        inn.querySelector('svg').animate({ filter: ['drop-shadow(0 0 4px currentColor)', 'drop-shadow(0 0 0 currentColor)'] }, { duration: 600, delay: 200, fill: 'backwards' });
      }
      function tog(b) {
        var on = !b.classList.contains('on'), out = b.querySelector(on ? '.a' : '.b'), inn = b.querySelector(on ? '.b' : '.a');
        b.classList.toggle('on', on); b.setAttribute('aria-pressed', on);
        b.nextElementSibling.textContent = b.dataset[on ? 'b' : 'a'];
        b.getAnimations({ subtree: true }).forEach(function (a) { a.cancel(); });
        if (!api.reduce) anim(out, inn);
      }
      bs.forEach(function (b) { b.addEventListener('click', function () { T.forEach(clearTimeout); tog(b); }); });
      bs.forEach(function (b, i) { T.push(setTimeout(function () { tog(b); }, 600 + i * 250)); });
      return function () { T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'iconmorph1-melt-drop',
    cat: 'Tombol & Toggle',
    name: 'Melt & Drop',
    source: SRC,
    trigger: 'tap',
    motion: 'Ikon lama meleleh: memanjang ke bawah (scale 0.8×1.5, turun 6px), kabur (blur 3px), lalu hilang. Ikon baru jatuh dari 16px di atas, mendarat dengan squash (scale 1.2×0.75), memantul kecil (0.95×1.05), lalu diam.',
    timing: 'leleh 380ms ease-in · jatuh 420ms ease-out delay 160ms (squash di 60%)',
    use: 'Toggle yang playful atau bertema cairan, misalnya pengingat minum, mode tidur, atau tombol di aplikasi anak.',
    tags: 'icon melt drip drop squash stretch blur liquid toggle',
    html: row(layers(same)),
    css: CSS + '& .ic{transform-origin:50% 70%}',
    js: function (root, api) {
      var bs = root.querySelectorAll('.ib'), T = [];
      function anim(out, inn) {
        out.animate({ transform: ['translateY(0) scale(1,1)', 'translateY(6px) scale(.8,1.5)'], filter: ['blur(0)', 'blur(3px)'], opacity: [1, 0] }, { duration: 380, easing: 'ease-in' });
        inn.animate([
          { transform: 'translateY(-16px) scale(.9,1.1)', opacity: 0 },
          { transform: 'translateY(0) scale(1.2,.75)', opacity: 1, offset: 0.6 },
          { transform: 'translateY(0) scale(.95,1.05)', offset: 0.8 },
          { transform: 'none', opacity: 1 }
        ], { duration: 420, delay: 160, easing: 'ease-out', fill: 'backwards' });
      }
      function tog(b) {
        var on = !b.classList.contains('on'), out = b.querySelector(on ? '.a' : '.b'), inn = b.querySelector(on ? '.b' : '.a');
        b.classList.toggle('on', on); b.setAttribute('aria-pressed', on);
        b.nextElementSibling.textContent = b.dataset[on ? 'b' : 'a'];
        b.getAnimations({ subtree: true }).forEach(function (a) { a.cancel(); });
        if (!api.reduce) anim(out, inn);
      }
      bs.forEach(function (b) { b.addEventListener('click', function () { T.forEach(clearTimeout); tog(b); }); });
      bs.forEach(function (b, i) { T.push(setTimeout(function () { tog(b); }, 600 + i * 250)); });
      return function () { T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'iconmorph1-tumble-flip',
    cat: 'Tombol & Toggle',
    name: 'Tumble Flip',
    source: SRC,
    trigger: 'tap',
    motion: 'Seluruh tombol berguling dari atas ke bawah (rotateX 0→90° dengan perspective 300px), berganti keadaan saat tegak lurus (ikon, warna, label), lalu berlanjut dari −90° ke 0° sehingga sisi baliknya yang tampak.',
    timing: '500ms ease-in-out · pergantian keadaan tepat di 250ms',
    use: 'Toggle yang ingin terasa seperti kartu dua sisi, misalnya ikuti/berhenti ikuti atau tandai selesai.',
    tags: 'icon tumble flip rotateX 3d card back face toggle',
    html: row(layers(same)),
    css: CSS,
    js: function (root, api) {
      var bs = root.querySelectorAll('.ib'), T = [], P = 'perspective(300px) rotateX(';
      function set(b, on) {
        b.classList.toggle('on', on); b.setAttribute('aria-pressed', on);
        b.nextElementSibling.textContent = b.dataset[on ? 'b' : 'a'];
      }
      function tog(b) {
        // target state is kept on the element so a second tap mid-flip still reverses correctly
        var target = b._on = !(b._on === undefined ? b.classList.contains('on') : b._on);
        clearTimeout(b._t); b.getAnimations().forEach(function (a) { a.cancel(); });
        if (api.reduce) return set(b, target);
        b.animate({ transform: [P + '0)', P + '90deg)', P + '-90deg)', P + '0)'], offset: [0, 0.5, 0.5, 1] }, { duration: 500, easing: 'ease-in-out' });
        b._t = setTimeout(function () { set(b, target); }, 250); T.push(b._t);
      }
      bs.forEach(function (b) { b.addEventListener('click', function () { tog(b); }); });
      bs.forEach(function (b, i) { T.push(setTimeout(function () { tog(b); }, 600 + i * 250)); });
      return function () { T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'iconmorph1-slice-shift',
    cat: 'Tombol & Toggle',
    name: 'Slice Shift',
    source: SRC,
    trigger: 'tap',
    motion: 'Ikon dipotong jadi 3 strip horizontal (clip-path). Strip ikon lama bergeser ±12px bergantian kiri/kanan sambil memudar dengan stagger 40ms; strip ikon baru masuk dari arah berlawanan dan menyatu kembali di tengah.',
    timing: 'keluar 260ms ease-in, stagger 40ms · masuk 300ms ease-out mulai 140ms, stagger 40ms',
    use: 'Ganti ikon bergaya digital/glitch, misalnya mode privasi, enkripsi, atau aplikasi bertema teknologi.',
    tags: 'icon slice shift strips split glitch clip-path toggle',
    html: row(layers(function (s) { return '<span class="sl">' + s + '</span><span class="sl">' + s + '</span><span class="sl">' + s + '</span>'; })),
    css: CSS + '& .sl{position:absolute;inset:0;display:grid;place-items:center}' +
      '& .sl:nth-child(1){clip-path:inset(0 0 66.6% 0)}& .sl:nth-child(2){clip-path:inset(33.3% 0 33.3% 0)}& .sl:nth-child(3){clip-path:inset(66.6% 0 0 0)}',
    js: function (root, api) {
      var bs = root.querySelectorAll('.ib'), T = [];
      function anim(out, inn) {
        out.animate({ opacity: [1, 1] }, { duration: 340 });
        out.querySelectorAll('.sl').forEach(function (s, k) { var d = k % 2 ? 12 : -12; s.animate({ transform: ['translateX(0)', 'translateX(' + d + 'px)'], opacity: [1, 0] }, { duration: 260, delay: k * 40, easing: 'ease-in', fill: 'forwards' }); });
        inn.querySelectorAll('.sl').forEach(function (s, k) { var d = k % 2 ? -12 : 12; s.animate({ transform: ['translateX(' + d + 'px)', 'translateX(0)'], opacity: [0, 1] }, { duration: 300, delay: 140 + k * 40, easing: 'ease-out', fill: 'backwards' }); });
      }
      function tog(b) {
        var on = !b.classList.contains('on'), out = b.querySelector(on ? '.a' : '.b'), inn = b.querySelector(on ? '.b' : '.a');
        b.classList.toggle('on', on); b.setAttribute('aria-pressed', on);
        b.nextElementSibling.textContent = b.dataset[on ? 'b' : 'a'];
        b.getAnimations({ subtree: true }).forEach(function (a) { a.cancel(); });
        if (!api.reduce) anim(out, inn);
      }
      bs.forEach(function (b) { b.addEventListener('click', function () { T.forEach(clearTimeout); tog(b); }); });
      bs.forEach(function (b, i) { T.push(setTimeout(function () { tog(b); }, 600 + i * 250)); });
      return function () { T.forEach(clearTimeout); };
    }
  });
})();
