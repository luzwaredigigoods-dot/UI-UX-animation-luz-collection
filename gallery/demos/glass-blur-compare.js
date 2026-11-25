/* "Change one number" — Glass · Frosted. The same floating tab bar three times over a busy,
   scrolling background. Every glass layer is identical (saturate 160%, tint, 1px edge, gloss, shadow)
   except backdrop-filter blur: 0 / 20 / 48px. The pink pill hops between tabs on its own; tap a tab to move it. */
LUZ.add({
  id: 'principle-glass-blur',
  cat: 'Prinsip Gerak',
  name: 'Frosted Glass Blur 0 / 20 / 48px',
  source: 'Change one number · Glass · Frosted',
  trigger: 'load/loop',
  motion: 'Tiga tab bar kaca yang sama melayang di atas latar ramai (garis diagonal, lingkaran, cincin, garis hitam, "Aa") yang terus bergulir ke atas. Semua lapisan kaca sama (saturate 160%, tint putih, tepi 1px, kilap, bayangan); hanya backdrop blur yang beda. blur 0 "Clear": latar terbaca tajam dan berisik. blur 20px "Frosted ✓": bentuk di belakang jadi gumpalan lembut. blur 48px "Milky": tinggal rona warna. Pil merah muda pindah antar tab dengan pegas: sedikit melewati tujuan dan bar ikut terdorong 3px ke arah gerak.',
  timing: 'pil ≈300ms pegas (ω0 20, ζ 0.45, overshoot kecil) · dorongan bar 300ms · latar bergulir 4s linear terus · pindah tab otomatis tiap 1.4s',
  use: 'Memilih blur untuk tab bar/header kaca di atas konten bergambar: ≈20px membuat ikon tetap terbaca tanpa menghapus kesan kaca.',
  tags: 'glassmorphism frosted glass backdrop-filter blur tab bar pill indicator principle',
  allowColor: true,
  html: '<div class="gl">' + [[0, 'Clear'], [20, 'Frosted ✓'], [48, 'Milky']].map(function (r) {
    var tile = '<div class="tile"><i class="a"></i><i class="b"></i><i class="c"></i><i class="d"></i><i class="e"></i><b>Aa</b></div>';
    return '<div class="row"><small class="lb">blur(' + r[0] + 'px)<em>' + r[1] + '</em></small><div class="vp"><div class="bgk">' + tile + tile + '</div>' +
      '<div class="bar" role="tablist" style="--b:' + r[0] + 'px"><span class="pl"></span>' +
      ['⌂', '⌕', '♡', '◯'].map(function (g, i) { return '<button class="tb" type="button" role="tab" aria-label="Tab ' + (i + 1) + '">' + g + '</button>'; }).join('') +
      '</div></div></div>';
  }).join('') + '</div>',
  css:
    '& .gl{width:240px;display:grid;gap:4px}' +
    '& .lb{display:block;height:13px;font:600 10px/1 ui-monospace,monospace}& .lb em{margin-left:6px;font-style:normal;font-weight:500;color:var(--d-mid)}' +
    '& .vp{position:relative;height:56px;border-radius:10px;overflow:hidden;background:#fff}' +
    '& .bgk{position:absolute;left:0;right:0;top:0;animation:glass1scroll 4s linear infinite}' +
    '& .tile{position:relative;height:88px}' +
    '& .tile i,& .tile b{position:absolute}' +
    '& .a{left:0;top:6px;width:96px;height:30px;background:repeating-linear-gradient(45deg,#2b5cff 0 4px,transparent 4px 9px)}' +
    '& .b{right:0;top:48px;width:84px;height:30px;background:repeating-linear-gradient(90deg,#ff3b6b 0 3px,transparent 3px 7px)}' +
    '& .c{left:112px;top:2px;width:44px;height:44px;border-radius:50%;background:#2b5cff}' +
    '& .d{left:26px;top:48px;width:30px;height:30px;border-radius:50%;border:5px solid #ff3b6b}' +
    '& .e{left:96px;top:56px;width:70px;height:20px;background:repeating-linear-gradient(0deg,#111 0 3px,transparent 3px 8px)}' +
    '& .tile b{right:8px;top:0;font:800 30px/1 sans-serif;color:#111}' +
    '& .bar{position:absolute;left:50%;top:50%;width:196px;height:36px;margin:-18px 0 0 -98px;display:flex;align-items:center;border-radius:18px;' +
      'background:linear-gradient(180deg,rgba(255,255,255,.4),rgba(255,255,255,.12));border:1px solid rgba(255,255,255,.7);' +
      'box-shadow:0 6px 16px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.9);-webkit-backdrop-filter:blur(var(--b)) saturate(160%);backdrop-filter:blur(var(--b)) saturate(160%)}' +
    '& .pl{position:absolute;left:4px;top:5px;width:40px;height:24px;border-radius:12px;background:#ff3b6b;box-shadow:0 2px 6px rgba(255,59,107,.4)}' +
    '& .tb{position:relative;flex:1;height:100%;border:0;background:none;font-size:15px;color:#111;cursor:pointer}' +
    '@keyframes glass1scroll{to{transform:translateY(-88px)}}' +
    '@media (prefers-reduced-motion:reduce){& .bgk{animation:none}}',
  js: function (root, api) {
    var bars = [].slice.call(root.querySelectorAll('.bar')), cur = 1, T;
    var X = function (i) { return i * 49 + 0.5; }; // 4 tabs × 49px, pill 40px centred in its tab
    function spring(z, w0, ms, n) { // damped spring progress 0 → 1
      var out = [], wd = w0 * Math.sqrt(1 - z * z);
      for (var i = 0; i <= n; i++) { var t = i / n * ms / 1000; out.push(1 - Math.exp(-z * w0 * t) * (Math.cos(wd * t) + z * w0 / wd * Math.sin(wd * t))); }
      out[n] = 1; return out;
    }
    var xs = spring(0.45, 20, 450, 24);
    function go(to) {
      var from = cur; cur = to; if (from === to) return;
      bars.forEach(function (b) {
        var pl = b.querySelector('.pl'), d = to > from ? 1 : -1;
        [b, pl].forEach(function (e) { e.getAnimations().forEach(function (a) { a.cancel(); }); });
        pl.style.transform = 'translateX(' + X(to) + 'px)';
        if (api.reduce) return;
        pl.animate(xs.map(function (x) { return { transform: 'translateX(' + (X(from) + (X(to) - X(from)) * x) + 'px)' }; }), { duration: 450 });
        b.animate({ transform: ['none', 'translateX(' + 3 * d + 'px)', 'none'] }, { duration: 300, easing: 'ease-out' });
      });
    }
    bars.forEach(function (b) { b.querySelector('.pl').style.transform = 'translateX(' + X(cur) + 'px)'; });
    var order = [2, 0, 3, 1], k = 0;
    function auto() { go(order[k++ % 4]); }
    T = setInterval(auto, 1400);
    root.addEventListener('click', function (e) {
      var tb = e.target.closest('.tb'); if (!tb) return;
      clearInterval(T); go([].indexOf.call(tb.parentNode.querySelectorAll('.tb'), tb));
      T = setInterval(auto, 2800);
    });
    return function () { clearInterval(T); };
  }
});
