/* Tooltip · Part 1 — six ways for a tooltip bubble to move to the tapped toolbar button.
   Tap an icon (or anywhere on the card to step to the next one). Autoplay steps once after 600ms. */
(function () {
  var SRC = 'Tooltip · Part 1';
  var ICON = {
    Share: '<path d="M12 3v12M7 8l5-5 5 5M5 13v7h14v-7"/>',
    Save: '<path d="M6 3h12v18l-6-5-6 5z"/>',
    Edit: '<path d="M20 4l-9 9-4 1 1-4 9-9zM4 20h16"/>',
    Delete: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>'
  };
  var HTML = '<div class="tt">' + '<div class="tools">' + ['Share', 'Save', 'Edit', 'Delete'].map(function (k) {
    return '<button type="button" aria-label="' + k + '"><svg viewBox="0 0 24 24">' + ICON[k] + '</svg></button>';
  }).join('') + '</div></div>';
  var GRAD = 'linear-gradient(90deg,#6d5cf6,#3b9bff)';
  var BASE =
    '& .tt{position:relative;width:236px;height:150px;background:var(--d-bg);border-radius:16px;cursor:pointer}' +
    '& .tools{position:absolute;left:12px;right:12px;bottom:14px;display:flex;justify-content:space-between;padding:4px;border:1px solid var(--d-soft);border-radius:14px}' +
    '& .tools button{width:44px;height:40px;display:grid;place-items:center;border:1px solid transparent;border-radius:10px;background:none;color:var(--d-mid);cursor:pointer;transition:background .2s,border-color .2s,color .2s}' +
    '& .tools button.on{background:var(--d-soft);border-color:var(--d-mid);color:var(--d-fg)}' +
    '& .tools svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}' +
    '& .tip{position:absolute;bottom:76px;translate:-50% 0;min-width:62px;padding:6px 10px;border-radius:9px;background:' + GRAD + ';color:#fff;font:700 13px/1.1 sans-serif;text-align:center;white-space:nowrap;transform-origin:50% 100%;box-shadow:0 6px 16px rgba(80,90,255,.35);pointer-events:none}' +
    '& .tip::after{content:"";position:absolute;left:50%;bottom:-4px;width:8px;height:8px;margin-left:-4px;background:#4f82fb;transform:rotate(45deg);border-radius:1px}';
  var TIM = { tool: 'tooltip popover toolbar bubble' };

  LUZ.add({
    id: 'tooltip-arrow-grow',
    cat: 'Modal, Sheet & Tooltip',
    name: 'Arrow Grow',
    source: SRC,
    trigger: 'tap',
    allowColor: true,
    motion: 'Gelembung lama memudar, blur 4px dan mengecil. Gelembung baru tumbuh dari ujung panahnya (transform-origin di bawah tengah): scale 0.2 → 1.06 → 1 dengan opacity 0 → 1, latar tombol aktif ikut berpindah.',
    timing: 'keluar 100ms · masuk 250ms spring overshoot 6%',
    use: 'Tooltip label ikon di toolbar editor atau aksi baris tabel.',
    tags: TIM.tool + ' scale grow origin arrow spring',
    html: HTML,
    css: BASE,
    js: function (root, api) {
      var tt = root.querySelector('.tt'), btns = [].slice.call(root.querySelectorAll('.tools button')), cur = null, idx = 3, T = [];
      function go(i) {
        idx = i; var b = btns[i], old = cur;
        btns.forEach(function (x) { x.classList.toggle('on', x === b); });
        cur = document.createElement('div'); cur.className = 'tip'; cur.textContent = b.getAttribute('aria-label');
        cur.style.left = (b.offsetLeft + b.offsetWidth / 2 + 13) + 'px'; tt.appendChild(cur);
        if (old) { var a = old.animate([{ opacity: 1 }, { opacity: 0, transform: 'scale(.8)', filter: 'blur(4px)' }], { duration: api.reduce ? 1 : 100, fill: 'forwards' }); a.onfinish = function () { old.remove(); }; }
        if (old && !api.reduce) cur.animate([{ opacity: 0, transform: 'scale(.2)' }, { opacity: 1, transform: 'scale(1.06)', offset: .6 }, { transform: 'scale(1)' }], { duration: 250, easing: 'ease-out' });
      }
      tt.addEventListener('click', function (e) { var b = e.target.closest('button'); go(b ? btns.indexOf(b) : (idx + 1) % 4); });
      go(3); T.push(setTimeout(function () { go(0); }, 600));
      return function () { T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'tooltip-glide-follow',
    cat: 'Modal, Sheet & Tooltip',
    name: 'Glide Follow',
    source: SRC,
    trigger: 'tap',
    allowColor: true,
    motion: 'Hanya ada satu gelembung yang meluncur mendatar ke tombol berikutnya. Panah bergerak lebih dulu (220ms), badan gelembung menyusul lebih lambat (320ms) dengan sedikit overshoot, dan teks label crossfade di tengah jalan.',
    timing: 'panah 220ms ease-out · badan 320ms spring · teks crossfade 160ms',
    use: 'Petunjuk yang mengikuti pilihan aktif, misalnya penanda langkah di tab atau segmented control.',
    tags: TIM.tool + ' glide follow translate lag arrow leads',
    html: HTML,
    css: BASE + '& .tip::after{display:none}& .arr{position:absolute;bottom:72px;width:8px;height:8px;margin-left:-4px;background:#4f82fb;transform-origin:50% 50%;rotate:45deg;border-radius:1px}',
    js: function (root, api) {
      var tt = root.querySelector('.tt'), btns = [].slice.call(root.querySelectorAll('.tools button')), idx = 3, T = [];
      var tip = document.createElement('div'), arr = document.createElement('i');
      tip.className = 'tip'; arr.className = 'arr'; tt.appendChild(tip); tt.appendChild(arr);
      var x = function (b) { return b.offsetLeft + b.offsetWidth / 2 + 13; };
      function go(i) {
        var from = tip.getBoundingClientRect().left + tip.offsetWidth / 2 - tt.getBoundingClientRect().left;
        var to = x(btns[i]); idx = i; var d = from - to;
        btns.forEach(function (b, j) { b.classList.toggle('on', j === i); });
        tip.style.left = arr.style.left = to + 'px';
        if (api.reduce || !tip.textContent) { tip.textContent = btns[i].getAttribute('aria-label'); return; }
        arr.animate([{ transform: 'translateX(' + d + 'px)' }, { transform: 'none' }], { duration: 220, easing: 'cubic-bezier(.2,.8,.2,1)' });
        tip.animate([{ transform: 'translateX(' + d + 'px)', filter: 'blur(1.5px)' }, { transform: 'translateX(-3px)', filter: 'blur(0)', offset: .75 }, { transform: 'none' }], { duration: 320, delay: 40, fill: 'backwards', easing: 'cubic-bezier(.3,.7,.3,1)' });
        tip.animate([{ color: 'rgba(255,255,255,1)' }, { color: 'rgba(255,255,255,0)' }], { duration: 80, fill: 'forwards' }).onfinish = function () {
          tip.textContent = btns[i].getAttribute('aria-label');
          tip.animate([{ color: 'rgba(255,255,255,0)' }, { color: 'rgba(255,255,255,1)' }], { duration: 80, fill: 'forwards' });
        };
      }
      tt.addEventListener('click', function (e) { var b = e.target.closest('button'); go(b ? btns.indexOf(b) : (idx + 1) % 4); });
      go(3); T.push(setTimeout(function () { go(0); }, 600));
      return function () { T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'tooltip-type-on',
    cat: 'Modal, Sheet & Tooltip',
    name: 'Type On',
    source: SRC,
    trigger: 'tap',
    allowColor: true,
    motion: 'Label lama dihapus huruf demi huruf (backspace) dengan caret berkedip, lalu gelembungnya blur keluar. Gelembung baru muncul dengan blur-in berisi caret kosong, kemudian label baru diketik satu huruf per 60ms.',
    timing: 'hapus 33ms/huruf · blur keluar-masuk 100ms · ketik 60ms/huruf · caret kedip 1s',
    use: 'Tooltip atau label status yang berganti teks, misalnya status simpan "Menyimpan… / Tersimpan".',
    tags: TIM.tool + ' typewriter typing caret backspace text',
    html: HTML,
    css: BASE + '& .tip b{display:inline-block;width:1.5px;height:12px;margin-left:1px;vertical-align:-1px;background:currentColor;animation:ttcar 1s steps(1) infinite}@keyframes ttcar{50%{opacity:0}}',
    js: function (root, api) {
      var tt = root.querySelector('.tt'), btns = [].slice.call(root.querySelectorAll('.tools button')), cur = null, idx = 3, T = [], run = 0;
      var wait = function (ms) { return new Promise(function (r) { T.push(setTimeout(r, ms)); }); };
      function make(b, txt) {
        var t = document.createElement('div'); t.className = 'tip'; t.innerHTML = '<span>' + txt + '</span><b></b>';
        t.style.left = (b.offsetLeft + b.offsetWidth / 2 + 13) + 'px'; tt.appendChild(t); return t;
      }
      async function go(i) {
        var my = ++run, b = btns[i], label = b.getAttribute('aria-label'), old = cur; idx = i;
        btns.forEach(function (x) { x.classList.toggle('on', x === b); });
        if (api.reduce || !old) { if (old) old.remove(); cur = make(b, label); return; }
        var s = old.querySelector('span');
        while (s.textContent.length) { s.textContent = s.textContent.slice(0, -1); await wait(33); if (my !== run) return old.remove(); }
        old.animate([{ opacity: 1 }, { opacity: 0, filter: 'blur(4px)' }], { duration: 100, fill: 'forwards' }).onfinish = function () { old.remove(); };
        cur = make(b, ''); var n = cur.querySelector('span');
        cur.animate([{ opacity: 0, filter: 'blur(4px)' }, { opacity: 1, filter: 'blur(0)' }], { duration: 100 });
        await wait(120);
        for (var c = 1; c <= label.length; c++) { if (my !== run) return; n.textContent = label.slice(0, c); await wait(60); }
      }
      tt.addEventListener('click', function (e) { var b = e.target.closest('button'); go(b ? btns.indexOf(b) : (idx + 1) % 4); });
      go(3); T.push(setTimeout(function () { go(0); }, 600));
      return function () { run++; T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'tooltip-elastic-drop',
    cat: 'Modal, Sheet & Tooltip',
    name: 'Elastic Drop',
    source: SRC,
    trigger: 'tap',
    allowColor: true,
    motion: 'Gelembung baru jatuh dari 20px di atas dalam keadaan memanjang (scale 0.9×1.15) dan blur, lalu gepeng saat mendarat (scale 1.12×0.8) dan memantul kembali ke 1. Gelembung lama turun sedikit sambil memudar.',
    timing: 'masuk 380ms elastis (squash & stretch) · keluar 150ms',
    use: 'Tooltip atau badge yang ingin terasa playful, misalnya hint onboarding atau notifikasi poin.',
    tags: TIM.tool + ' elastic drop squash stretch bounce',
    html: HTML,
    css: BASE,
    js: function (root, api) {
      var tt = root.querySelector('.tt'), btns = [].slice.call(root.querySelectorAll('.tools button')), cur = null, idx = 3, T = [];
      function go(i) {
        idx = i; var b = btns[i], old = cur;
        btns.forEach(function (x) { x.classList.toggle('on', x === b); });
        cur = document.createElement('div'); cur.className = 'tip'; cur.textContent = b.getAttribute('aria-label');
        cur.style.left = (b.offsetLeft + b.offsetWidth / 2 + 13) + 'px'; tt.appendChild(cur);
        if (old) old.animate([{ opacity: 1 }, { opacity: 0, transform: 'translateY(6px)', filter: 'blur(3px)' }], { duration: api.reduce ? 1 : 150, fill: 'forwards' }).onfinish = function () { old.remove(); };
        if (old && !api.reduce) cur.animate([
          { opacity: 0, transform: 'translateY(-20px) scale(.9,1.15)', filter: 'blur(3px)' },
          { opacity: 1, transform: 'translateY(0) scale(1.12,.8)', filter: 'blur(0)', offset: .5 },
          { transform: 'scale(.96,1.06)', offset: .78 },
          { transform: 'none' }], { duration: 380, easing: 'ease-in-out' });
      }
      tt.addEventListener('click', function (e) { var b = e.target.closest('button'); go(b ? btns.indexOf(b) : (idx + 1) % 4); });
      go(3); T.push(setTimeout(function () { go(0); }, 600));
      return function () { T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'tooltip-fold-open',
    cat: 'Modal, Sheet & Tooltip',
    name: 'Fold Open',
    source: SRC,
    trigger: 'tap',
    allowColor: true,
    motion: 'Gelembung lama melipat jadi garis tipis lalu hilang. Gelembung baru muncul sebagai garis 2px yang melebar dari tengah (scaleX 0 → 1), lalu terbuka ke bawah (scaleY dari garis ke 1, origin atas); teks muncul terakhir.',
    timing: 'garis melebar 100ms · buka ke bawah 100ms · teks fade 100ms · keluar 150ms',
    use: 'Popover atau tooltip dengan kesan rapi/teknis, misalnya keterangan nilai lab di grafik.',
    tags: TIM.tool + ' fold unfold line scaleX scaleY clip',
    html: HTML,
    css: BASE + '& .tip{transform-origin:50% 0}& .tip span{display:inline-block}',
    js: function (root, api) {
      var tt = root.querySelector('.tt'), btns = [].slice.call(root.querySelectorAll('.tools button')), cur = null, idx = 3, T = [];
      function go(i) {
        idx = i; var b = btns[i], old = cur;
        btns.forEach(function (x) { x.classList.toggle('on', x === b); });
        cur = document.createElement('div'); cur.className = 'tip'; cur.innerHTML = '<span>' + b.getAttribute('aria-label') + '</span>';
        cur.style.left = (b.offsetLeft + b.offsetWidth / 2 + 13) + 'px'; tt.appendChild(cur);
        if (old) old.animate([{ transform: 'none' }, { transform: 'scale(1,.08)', offset: .6 }, { transform: 'scale(1,.08)', opacity: 0 }], { duration: api.reduce ? 1 : 150, fill: 'forwards' }).onfinish = function () { old.remove(); };
        if (!old || api.reduce) return;
        cur.animate([{ transform: 'scale(0,.08)' }, { transform: 'scale(1,.08)', offset: .5 }, { transform: 'scale(1,1)' }], { duration: 200, easing: 'ease-out' });
        cur.querySelector('span').animate([{ opacity: 0, filter: 'blur(3px)' }, { opacity: 1, filter: 'blur(0)' }], { duration: 100, delay: 200, fill: 'backwards' });
      }
      tt.addEventListener('click', function (e) { var b = e.target.closest('button'); go(b ? btns.indexOf(b) : (idx + 1) % 4); });
      go(3); T.push(setTimeout(function () { go(0); }, 600));
      return function () { T.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'tooltip-ink-bloom',
    cat: 'Modal, Sheet & Tooltip',
    name: 'Ink Bloom',
    source: SRC,
    trigger: 'tap',
    allowColor: true,
    motion: 'Tetes tinta kecil naik dari tombol (translateY 34px → 0, scale 0.35 → 1) menjadi lingkaran, lalu mekar mendatar menjadi gelembung persegi bulat (clip-path inset membuka). Teks muncul terakhir; gelembung lama menyusut jadi tetes dan tenggelam ke tombolnya.',
    timing: 'naik 120ms ease-out · mekar 150ms · teks 100ms · keluar 200ms ease-in',
    use: 'Tooltip yang terasa "lahir" dari tombol, misalnya bantuan pada tombol aksi utama (FAB).',
    tags: TIM.tool + ' ink drop bloom morph clip-path blob',
    html: HTML,
    css: BASE,
    js: function (root, api) {
      var tt = root.querySelector('.tt'), btns = [].slice.call(root.querySelectorAll('.tools button')), cur = null, idx = 3, T = [];
      var K = [
        { transform: 'translateY(34px) scale(.35,.5)', clipPath: 'inset(0 calc(50% - 12px) round 12px)', opacity: .6, color: 'transparent' },
        { transform: 'none', clipPath: 'inset(0 calc(50% - 12px) round 12px)', opacity: 1, color: 'transparent', offset: .35 },
        { transform: 'none', clipPath: 'inset(0 0 -8px round 9px)', color: 'transparent', offset: .75 },
        { transform: 'none', clipPath: 'inset(0 0 -8px round 9px)', color: '#fff' }];
      function go(i) {
        idx = i; var b = btns[i], old = cur;
        btns.forEach(function (x) { x.classList.toggle('on', x === b); });
        cur = document.createElement('div'); cur.className = 'tip'; cur.textContent = b.getAttribute('aria-label');
        cur.style.left = (b.offsetLeft + b.offsetWidth / 2 + 13) + 'px'; tt.appendChild(cur);
        if (old) old.animate(K.slice().reverse().map(function (k) { var o = Object.assign({}, k); delete o.offset; return o; }), { duration: api.reduce ? 1 : 200, easing: 'ease-in', fill: 'forwards' }).onfinish = function () { old.remove(); };
        if (old && !api.reduce) cur.animate(K, { duration: 340, easing: 'ease-out' });
      }
      tt.addEventListener('click', function (e) { var b = e.target.closest('button'); go(b ? btns.indexOf(b) : (idx + 1) % 4); });
      go(3); T.push(setTimeout(function () { go(0); }, 600));
      return function () { T.forEach(clearTimeout); };
    }
  });
})();
