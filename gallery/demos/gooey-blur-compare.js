/* "Change one number" — Menu · Gooey. The same pink FAB menu three times; the gooey SVG filter
   (blur, then alpha × 24 − 10.5) is identical except for the blur amount: 0 / 9 / 20px.
   The demo is ~0.55× the size of the video's menu, so stdDeviation is scaled by 0.55 (labels keep the video's values).
   Loops on its own (open, close); tap to toggle immediately. */
LUZ.add({
  id: 'principle-gooey-blur',
  cat: 'Prinsip Gerak',
  name: 'Gooey Blur 0 / 9 / 20px',
  source: 'Change one number · Menu · Gooey',
  trigger: 'load/loop',
  motion: 'Tombol FAB "+" berputar 45° menjadi "×" dan 4 item bulat keluar ke kanan berurutan (jeda 50ms), seolah tiap item terlepas dari item sebelumnya, digerakkan pegas ω0 12, ζ 0.5. Bentuk bulatnya melewati filter SVG gooey (blur lalu alpha × 24 − 10.5). blur 0 = "No goo": lingkaran keras tanpa sambungan. blur 9px = "Gooey": lingkaran menyatu dengan jembatan cair lalu putus. blur 20px = "Melted": semua meleleh, item kecil nyaris hilang.',
  timing: 'pegas ω0 12 rad/s, ζ 0.5 · ≈600ms · stagger 50ms · rotasi + 200ms · filter alpha 24 / −10.5 (blur demo diskalakan 0.55× sesuai ukuran)',
  use: 'Menentukan blur untuk menu FAB bergaya gooey: pakai ≈ seperempat diameter item (di sini 9px untuk item 24–34px); terlalu besar membuat ikon dan item kecil hilang.',
  tags: 'gooey goo metaball svg filter blur color matrix fab menu speed dial principle',
  allowColor: true,
  html: '<div class="gb">' + [[0, 'No goo'], [9, 'Gooey'], [20, 'Melted']].map(function (r) {
    return '<div class="row" data-b="' + r[0] + '"><small class="lb">blur(' + r[0] + 'px)<em>' + r[1] + '</em></small>' +
      '<div class="goo"><i class="fab"></i><i class="it"></i><i class="it"></i><i class="it"></i><i class="it"></i></div>' +
      '<div class="ico"><b class="fab">+</b><b class="it">◉</b><b class="it">▣</b><b class="it">★</b><b class="it">▦</b></div></div>';
  }).join('') + '</div>',
  css:
    '& .gb{width:236px;display:grid;gap:4px;cursor:pointer}' +
    '& .row{position:relative;height:70px;border-bottom:1px dashed var(--d-soft)}& .row:last-child{border:0}' +
    '& .lb{position:absolute;left:0;top:2px;font:600 10px/1 ui-monospace,monospace}& .lb em{margin-left:6px;font-style:normal;font-weight:500;color:var(--d-mid)}' +
    '& .goo,& .ico{position:absolute;left:0;right:0;top:16px;height:52px}' +
    '& .goo i,& .ico b{position:absolute;left:14px;top:9px;width:34px;height:34px;border-radius:50%}' +
    '& .goo i{background:#ff3b6b}' +
    '& .goo .it,& .ico .it{left:19px;top:14px;width:24px;height:24px}' +
    '& .ico b{display:grid;place-items:center;color:#fff;font:600 11px/1 sans-serif}& .ico .it{opacity:0;transition:opacity .15s}& .op .ico .it{opacity:1}& .ico .fab{font-size:22px;font-weight:300}',
  js: function (root, api) {
    var rows = [].slice.call(root.querySelectorAll('.row')), open = false;
    // one SVG filter per row; ids are generated so the demo can be mounted twice
    rows.forEach(function (r) {
      var id = 'goo' + Math.random().toString(36).slice(2, 8), ns = 'http://www.w3.org/2000/svg', svg = document.createElementNS(ns, 'svg');
      svg.setAttribute('width', 0); svg.setAttribute('height', 0); svg.style.position = 'absolute';
      svg.innerHTML = '<filter id="' + id + '" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur in="SourceGraphic" stdDeviation="' + r.dataset.b * 0.55 + '" result="b"/>' +
        '<feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10.5"/></filter>';
      r.appendChild(svg); r.querySelector('.goo').style.filter = 'url(#' + id + ')';
    });
    function spring(z, w0, ms, n) { // damped spring progress 0 → 1
      var out = [], wd = w0 * Math.sqrt(1 - z * z);
      for (var i = 0; i <= n; i++) { var t = i / n * ms / 1000; out.push(1 - Math.exp(-z * w0 * t) * (Math.cos(wd * t) + z * w0 / wd * Math.sin(wd * t))); }
      out[n] = 1; return out;
    }
    var xs = spring(0.5, 12, 650, 30);
    function play() {
      open = !open;
      rows.forEach(function (r) {
        r.classList.toggle('op', open);
        r.querySelectorAll('.it').forEach(function (el, k) {
          var i = k % 4, to = 44 + i * 40, from = open ? 0 : to, end = open ? to : 0;
          el.getAnimations().forEach(function (a) { a.cancel(); });
          el.style.transform = 'translateX(' + end + 'px)';
          if (api.reduce) return;
          el.animate(xs.map(function (x) { return { transform: 'translateX(' + (from + (end - from) * x) + 'px)' }; }),
            { duration: 650, delay: (open ? i : 3 - i) * 50, fill: 'backwards' });
        });
        var plus = r.querySelector('.ico .fab');
        plus.style.transform = open ? 'rotate(45deg)' : 'none';
        if (!api.reduce) plus.animate({ transform: open ? ['none', 'rotate(45deg)'] : ['rotate(45deg)', 'none'] }, { duration: 200, easing: 'ease-out' });
      });
    }
    var t = setInterval(play, 1500), t0 = setTimeout(play, 400);
    root.querySelector('.gb').addEventListener('click', play);
    return function () { clearInterval(t); clearTimeout(t0); };
  }
});
