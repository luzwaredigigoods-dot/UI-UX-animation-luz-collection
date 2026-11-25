/* "Change one number" — Toast · Island. Three Dynamic-Island toasts with the same spring stiffness
   (ω0 = 13 rad/s, size 128×36 → 410×124, drawn here at ~46% scale); only the damping ratio ζ changes.
   Loops on its own: expand, hold, collapse. Tap to toggle immediately. */
LUZ.add({
  id: 'principle-spring-damping',
  cat: 'Prinsip Gerak',
  name: 'Spring Damping ζ 0.3 / 0.6 / 1.0',
  source: 'Change one number · Toast · Island',
  trigger: 'load/loop',
  motion: 'Tiga toast "pulau" (pil 128×36 → kartu 410×124) dengan kekakuan pegas sama, ω0 = 13; hanya rasio redaman ζ yang berbeda. ζ 0.3 "Wobbly": melewati target +37% dan berayun ±2 kali; saat menutup sempat lebih kecil dari pil. ζ 0.6 "Bouncy": satu overshoot kecil +9%. ζ 1.0 "Stiff": teredam kritis tanpa overshoot. Isi kartu (avatar, nama, gelombang suara) memudar masuk setelah ukuran hampir penuh.',
  timing: 'pegas ω0 13 rad/s · ζ 0.3 settle ≈1s · ζ 0.6 ≈0.45s · ζ 1.0 ≈0.4s · isi masuk 250ms (jeda 120ms), keluar 120ms',
  use: 'Memilih "rasa" pegas untuk notifikasi/kartu yang membesar: ζ ≈ 0.6 untuk pop yang hidup tapi tidak norak, ζ 1.0 untuk UI klinis yang serius.',
  tags: 'spring damping ratio zeta overshoot wobbly bouncy stiff dynamic island toast physics',
  allowColor: true,
  html: '<div class="sd">' + [[0.3, 'Wobbly', '+37%'], [0.6, 'Bouncy', '+9%'], [1, 'Stiff', '+0%']].map(function (r) {
    return '<div class="row" data-z="' + r[0] + '"><small class="lb">ζ ' + r[0].toFixed(1) + '<em>' + r[1] + ' · ' + r[2] + '</em></small>' +
      '<div class="isl"><span class="bg"></span><span class="dot"></span><span class="ct"><i class="av">M</i><span class="nm"><b>Mika</b><small>Voice message · 0:12</small></span>' +
      '<span class="wv"><i></i><i></i><i></i><i></i><i></i></span></span></div></div>';
  }).join('') + '</div>',
  css:
    '& .sd{width:244px;display:grid;gap:4px;cursor:pointer}' +
    '& .row{position:relative;height:70px;border-bottom:1px dashed var(--d-soft)}& .row:last-child{border:0}' +
    '& .lb{position:absolute;left:0;top:2px;font:600 10px/1 ui-monospace,monospace;color:var(--d-fg)}' +
    '& .lb em{margin-left:6px;font-style:normal;font-weight:500;color:var(--d-mid)}' +
    '& .isl{position:absolute;left:50%;top:16px;width:190px;height:52px;margin-left:-95px}' +
    '& .bg{position:absolute;inset:0;border-radius:26px;background:#111;box-shadow:0 0 0 1.5px var(--d-soft);transform:scale(.31,.29)}' +
    '& .dot{position:absolute;left:50%;top:50%;width:5px;height:5px;margin:-2.5px 0 0 14px;border-radius:50%;background:#ff3b4f}' +
    '& .ct{position:absolute;inset:0;display:flex;align-items:center;gap:8px;padding:0 14px;color:#fff;opacity:0}' +
    '& .av{width:28px;height:28px;border-radius:50%;display:grid;place-items:center;background:#ff3b4f;font:700 12px/1 sans-serif;font-style:normal}' +
    '& .nm{flex:1;display:grid;line-height:1.2}& .nm b{font-size:11px}& .nm small{font-size:8.5px;opacity:.65}' +
    '& .wv{display:flex;gap:2px;align-items:center;height:16px}& .wv i{width:2.5px;border-radius:2px;background:#ff3b4f}' +
    '& .wv i:nth-child(1){height:6px}& .wv i:nth-child(2){height:14px}& .wv i:nth-child(3){height:9px}& .wv i:nth-child(4){height:16px}& .wv i:nth-child(5){height:7px}',
  js: function (root, api) {
    var rows = [].slice.call(root.querySelectorAll('.row')), open = false, P = [0.31, 0.29];
    // closed-form damped spring, x(t) from 0 → 1 (underdamped for ζ < 1, critically damped for ζ = 1)
    function spring(z, w0, ms, n) {
      var out = [];
      for (var i = 0; i <= n; i++) {
        var t = i / n * ms / 1000, wd = w0 * Math.sqrt(Math.max(1 - z * z, 0));
        out.push(z < 1 ? 1 - Math.exp(-z * w0 * t) * (Math.cos(wd * t) + z * w0 / wd * Math.sin(wd * t)) : 1 - Math.exp(-w0 * t) * (1 + w0 * t));
      }
      out[n] = 1; return out;
    }
    function play() {
      open = !open;
      rows.forEach(function (r) {
        var bg = r.querySelector('.bg'), ct = r.querySelector('.ct'), dot = r.querySelector('.dot');
        [bg, ct, dot].forEach(function (e) { e.getAnimations().forEach(function (a) { a.cancel(); }); });
        var end = open ? 'scale(1,1)' : 'scale(' + P[0] + ',' + P[1] + ')';
        bg.style.transform = end; ct.style.opacity = open ? 1 : 0; dot.style.opacity = open ? 0 : 1;
        if (api.reduce) return;
        var xs = spring(+r.dataset.z, 13, 1100, 44);
        bg.animate(xs.map(function (x) {
          var f = open ? x : 1 - x, sx = Math.max(0.04, P[0] + (1 - P[0]) * f), sy = Math.max(0.04, P[1] + (1 - P[1]) * f);
          return { transform: 'scale(' + sx + ',' + sy + ')' };
        }), { duration: 1100 });
        ct.animate({ opacity: open ? [0, 1] : [1, 0] }, open ? { duration: 250, delay: 120, fill: 'backwards' } : { duration: 120 });
        dot.animate({ opacity: open ? [1, 0] : [0, 1] }, { duration: 120, delay: open ? 0 : 200, fill: 'backwards' });
      });
    }
    var t = setInterval(play, 1700);
    var t0 = setTimeout(play, 400);
    root.querySelector('.sd').addEventListener('click', play);
    return function () { clearInterval(t); clearTimeout(t0); };
  }
});
