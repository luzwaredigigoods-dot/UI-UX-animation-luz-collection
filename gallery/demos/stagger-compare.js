/* "Change one number" — the same dropdown three times; only the row stagger differs (0 / 65 / 200 ms).
   Plays in a loop at ×½ speed like the source video; tap to open/close now. */
LUZ.add({
  id: 'stagger-compare-menu',
  cat: 'Prinsip Gerak',
  name: 'Change one number (Stagger)',
  source: 'Change one number · Menu Stagger (×½ slow-mo)',
  trigger: 'load/loop',
  motion: 'Tiga dropdown identik dibuka bersamaan: tombol Menu terisi warna aksen dan chevron berputar 180°, kartu memantul terbuka dari atas (spring ω₀16 ζ0.62, overshoot ±8%), lalu 4 baris muncul (fade + turun 6px) dengan jeda antarbaris 0, 65, atau 200ms. Garis waktu di bawah menunjukkan kapan tiap baris jalan dan kapan baris terakhir selesai: 360, 555, 960ms.',
  timing: 'kartu spring ω₀16 ζ0.62 (±500ms) · tiap baris 260ms ease-out mulai 100ms · stagger 0 / 65 / 200ms · tutup 150ms · demo diputar ×½',
  use: 'Patokan memilih stagger untuk menu, daftar, atau kartu: ±65ms terasa halus, 0ms terasa serentak/kaku, 200ms terasa lambat.',
  tags: 'stagger timing delay comparison dropdown menu list principle spring',
  html: '<div class="sc" role="group" aria-label="Perbandingan stagger 0, 65, 200 ms">' + [[0, 'Serentak'], [65, 'Halus'], [200, 'Lambat']].map(function (c) {
    return '<div class="col' + (c[0] === 65 ? ' best' : '') + '" data-s="' + c[0] + '"><p class="hd"><b>' + c[0] + ' ms</b>' + c[1] + '</p>' +
      '<button type="button" class="mb" aria-expanded="false">Menu<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 3.5l3 3 3-3"/></svg></button>' +
      '<div class="dd"><span>Profile</span><span>Settings</span><span>Saved</span><span class="lo">Log out</span></div>' +
      '<div class="tl" aria-hidden="true"><i class="ph"></i>' + [0, 1, 2, 3].map(function (i) { return '<i class="br" style="left:' + (100 + i * c[0]) / 10 + '%;top:' + i * 7 + 'px"></i>'; }).join('') + '</div>' +
      '<p class="done">' + (100 + 3 * c[0] + 260) + ' ms</p></div>';
  }).join('') + '</div>',
  css:
    '& .sc{display:grid;grid-template-columns:repeat(3,78px);gap:6px;cursor:pointer}' +
    '& .col{position:relative;height:206px;padding:6px;border:1px solid var(--d-soft);border-radius:10px;background:var(--d-bg)}' +
    '& .col.best{border-color:var(--d-accent)}' +
    '& .hd{margin:0 0 5px;font:600 8px/1.2 sans-serif;color:var(--d-mid)}& .hd b{display:block;font:700 12px/1.1 ui-monospace,monospace;color:var(--d-fg)}' +
    '& .col.best .hd b{color:var(--d-accent)}' +
    '& .mb{display:flex;align-items:center;justify-content:space-between;width:100%;height:20px;padding:0 6px;border:1px solid var(--d-mid);border-radius:6px;background:var(--d-bg);color:var(--d-fg);font:700 8.5px/1 sans-serif;cursor:pointer;transition:background .2s,color .2s,border-color .2s}' +
    '& .mb svg{width:9px;height:9px;fill:none;stroke:currentColor;stroke-width:1.6;transition:transform .2s}' +
    '& .mb[aria-expanded="true"]{background:var(--d-accent);border-color:var(--d-accent);color:var(--d-bg)}& .mb[aria-expanded="true"] svg{transform:rotate(180deg)}' +
    '& .dd{margin-top:4px;padding:3px;border:1px solid var(--d-soft);border-radius:7px;background:var(--d-bg);box-shadow:0 4px 10px rgba(0,0,0,.08);transform-origin:50% 0;opacity:0}' +
    '& .dd span{display:block;padding:3px 4px;border-radius:4px;font:500 8.5px/1.2 sans-serif;opacity:0}& .dd .lo{color:var(--d-accent)}' +
    '& .tl{position:absolute;left:6px;right:6px;bottom:20px;height:28px;border-left:1px solid var(--d-soft)}' +
    '& .tl .br{position:absolute;width:26%;height:5px;border-radius:2px;background:var(--d-accent);opacity:.25}' +
    '& .tl .ph{position:absolute;left:0;top:-2px;bottom:-2px;width:1px;background:var(--d-fg);opacity:0}' +
    '& .done{position:absolute;left:6px;bottom:5px;margin:0;font:700 9px/1 ui-monospace,monospace}',
  js: function (root, api) {
    var cols = [].slice.call(root.querySelectorAll('.col')), open = false, T = [], X = api.reduce ? 0 : 2; // X = ×½ slow-mo
    function anim(el, k, o) { return el.animate(k, Object.assign({ fill: 'forwards' }, o, { duration: o.duration * X || 1, delay: (o.delay || 0) * X })); }
    function set(on) {
      open = on;
      root.getAnimations({ subtree: true }).forEach(function (a) { if (a.effect.target !== root) a.cancel(); });
      cols.forEach(function (c) {
        var s = +c.dataset.s, dd = c.querySelector('.dd'), rows = dd.children;
        c.querySelector('.mb').setAttribute('aria-expanded', on);
        if (!on) { anim(dd, [{ opacity: 1 }, { opacity: 0 }], { duration: 150 }); return; }
        // spring ω0=16, ζ=0.62 sampled: peak ≈ 250ms (+8%), settled ≈ 500ms
        anim(dd, [{ opacity: 0, transform: 'scaleY(.6)' }, { opacity: 1, transform: 'scaleY(1.08)', offset: .5 }, { transform: 'scaleY(.99)', offset: .8 }, { opacity: 1, transform: 'none' }], { duration: 500, easing: 'ease-out' });
        [].forEach.call(rows, function (r, i) { anim(r, [{ opacity: 0, transform: 'translateY(-6px)' }, { opacity: 1, transform: 'none' }], { duration: 260, delay: 100 + i * s, easing: 'cubic-bezier(.2,.8,.2,1)' }); });
        var tl = c.querySelector('.tl'), w = tl.offsetWidth;
        anim(tl.querySelector('.ph'), [{ opacity: 1, transform: 'none' }, { opacity: 1, transform: 'translateX(' + w + 'px)' }], { duration: 1000, easing: 'linear' });
        [].forEach.call(tl.querySelectorAll('.br'), function (b, i) { anim(b, [{ opacity: .25 }, { opacity: 1 }], { duration: 260, delay: 100 + i * s }); });
      });
    }
    function loop() { set(!open); T.push(setTimeout(loop, open ? 1100 * Math.max(X, 1) + 900 : 1200)); }
    root.querySelector('.sc').addEventListener('click', function () { T.forEach(clearTimeout); T = []; set(!open); T.push(setTimeout(loop, 3000)); });
    T.push(setTimeout(loop, 600));
    return function () { T.forEach(clearTimeout); };
  }
});
