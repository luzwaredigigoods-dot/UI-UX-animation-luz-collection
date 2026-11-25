/* Date Picker · Part 1 — the same week strip, six ways to move the selection. */
(function () {
  var SRC = 'Date Picker · Part 1';
  var DAYS = [['S', 15], ['M', 16], ['T', 17], ['W', 18], ['T', 19], ['F', 20], ['S', 21]];
  var HTML = '<div class="dp"><div class="hd"><b>November 2026</b><span>‹ ›</span></div><div class="wk">' +
    DAYS.map(function (d, i) { return '<button type="button" class="dy' + (i === 3 ? ' today' : '') + '"><small>' + d[0] + '</small><b>' + d[1] + '</b></button>'; }).join('') +
    '</div><div class="ft"><span class="lbl">Mon, Nov 16</span><span class="sl">5 slots</span></div></div>';
  var CSS =
    '& .dp{width:240px;padding:12px 10px;border-radius:16px;background:var(--d-bg);border:1px solid var(--d-soft);color:var(--d-fg)}' +
    '& .hd{display:flex;justify-content:space-between;align-items:center;padding:0 4px 8px}& .hd b{font-size:11px}& .hd span{font-size:11px;color:var(--d-mid);letter-spacing:4px}' +
    '& .wk{position:relative;display:grid;grid-template-columns:repeat(7,1fr)}' +
    '& .dy{position:relative;display:grid;justify-items:center;gap:3px;height:58px;padding:7px 0 0;border:0;background:none;font:inherit;color:var(--d-fg);cursor:pointer}' +
    '& .dy small{position:relative;z-index:1;font-size:8px;color:var(--d-mid);transition:color .2s}& .dy b{position:relative;z-index:1;font-size:13px;transition:color .2s}' +
    '& .dy.today b::before{content:"";position:absolute;left:50%;top:50%;width:24px;height:24px;margin:-13.5px -12px;border-radius:50%;border:1.5px solid var(--d-mid);z-index:-1}' +
    '& .dy.on small,& .dy.on b{color:var(--d-bg)}& .dy.on.today b::before{border-color:transparent}' +
    '& .cap{position:absolute;left:50%;top:2px;width:28px;height:54px;margin-left:-14px;border-radius:14px;background:var(--d-accent);pointer-events:none}' +
    '& .ft{display:flex;justify-content:space-between;margin-top:10px;padding:0 4px;font-size:9.5px;overflow:hidden}& .sl{color:var(--d-mid)}';

  LUZ.add({
    id: 'datepick-halo-trace',
    cat: 'Input & Form',
    name: 'Halo Trace',
    source: SRC,
    trigger: 'tap',
    motion: 'Kapsul lama memudar. Cincin garis bercahaya menelusuri keliling hari yang diketuk (stroke-dashoffset 1→0, kepala komet terang di ujungnya), lalu kapsul biru terisi dari dalam cincin (fade + scale 0.85→1) dan cincin memudar.',
    timing: 'lama pudar 150ms · telusur 350ms ease-in-out · isi 200ms ease-out',
    use: 'Pemilih tanggal janji temu atau jadwal kontrol pasien.',
    tags: 'date picker halo ring trace stroke draw capsule select',
    html: HTML,
    css: CSS + '& .ring{position:absolute;left:50%;top:2px;width:30px;height:56px;margin-left:-15px;overflow:visible;pointer-events:none}& .ring rect{fill:none;stroke:var(--d-accent);stroke-width:2;stroke-dasharray:1;filter:drop-shadow(0 0 2px var(--d-accent))}',
    js: function (root, api) {
      var SLOTS = [2, 5, 3, 4, 6, 6, 3], NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      var days = root.querySelectorAll('.dy'), ft = root.querySelector('.ft'), cur = 1, tm = [];
      days.forEach(function (d) { d.insertAdjacentHTML('afterbegin', '<i class="cap"></i>'); });
      var caps = root.querySelectorAll('.cap');
      function show(i, on) { caps[i].style.opacity = on ? 1 : 0; days[i].classList.toggle('on', !!on); }
      days.forEach(function (d, i) { show(i, i === cur); });
      function go(i) {
        if (i === cur) return;
        var from = cur; cur = i;
        caps.forEach(function (c) { c.getAnimations().forEach(function (a) { a.finish(); }); });
        root.querySelectorAll('.fx').forEach(function (x) { x.remove(); });
        days.forEach(function (d, k) { if (k !== from) show(k, k === i); });
        ft.querySelector('.lbl').textContent = NAMES[i] + ', Nov ' + DAYS[i][1];
        ft.querySelector('.sl').textContent = SLOTS[i] + ' slots';
        ft.animate([{ transform: 'translateY(6px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 250, easing: 'ease-out' });
        var a = caps[from], b = caps[i], dir = i > from ? 1 : -1;
        if (api.reduce) { show(from, false); return; }
        a.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 150, fill: 'forwards' }).onfinish = function () { if (cur !== from) show(from, false); a.getAnimations().forEach(function (x) { x.cancel(); }); };
        show(i, false);
        days[i].insertAdjacentHTML('beforeend', '<svg class="fx ring" viewBox="0 0 30 56"><rect pathLength="1" x="1" y="1" width="28" height="54" rx="14"/></svg>');
        var ring = days[i].querySelector('.ring'), rect = ring.firstChild;
        rect.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 350, easing: 'ease-in-out', fill: 'forwards' }).onfinish = function () {
          if (cur !== i) return ring.remove();
          show(i, true);
          b.animate([{ opacity: 0, transform: 'scale(.85)' }, { opacity: 1, transform: 'none' }], { duration: 200, easing: 'ease-out' });
          ring.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250, fill: 'forwards' }).onfinish = function () { ring.remove(); };
        };
      }
      days.forEach(function (d, i) { d.onclick = function () { go(i); }; });
      tm.push(setTimeout(function () { go(3); }, 600));
      return function () { tm.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'datepick-snap-brackets',
    cat: 'Input & Form',
    name: 'Snap Brackets',
    source: SRC,
    trigger: 'tap',
    motion: 'Empat sudut siku terbang dari hari lama ke hari yang diketuk, terbuka lebar (bingkai 1.5× lebih besar), lalu menjepit rapat di sekeliling kapsul baru dengan pegas; kapsul terisi dan siku memudar.',
    timing: 'terbang 250ms ease-out · jepit 250ms pegas (cubic-bezier .34,1.56,.64,1) · pudar 200ms',
    use: 'Pilih tanggal/slot yang ingin terasa “terkunci” dengan presisi, misalnya jadwal operasi.',
    tags: 'date picker brackets corners snap frame focus select',
    html: HTML,
    css: CSS + '& .brk{position:absolute;left:50%;top:2px;width:30px;height:56px;margin-left:-15px;pointer-events:none;z-index:2}& .brk i{position:absolute;width:7px;height:7px;border:2px solid var(--d-fg)}& .brk i:nth-child(1){left:-3px;top:-3px;border-right:0;border-bottom:0}& .brk i:nth-child(2){right:-3px;top:-3px;border-left:0;border-bottom:0}& .brk i:nth-child(3){left:-3px;bottom:-3px;border-right:0;border-top:0}& .brk i:nth-child(4){right:-3px;bottom:-3px;border-left:0;border-top:0}',
    js: function (root, api) {
      var SLOTS = [2, 5, 3, 4, 6, 6, 3], NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      var days = root.querySelectorAll('.dy'), ft = root.querySelector('.ft'), cur = 1, tm = [];
      days.forEach(function (d) { d.insertAdjacentHTML('afterbegin', '<i class="cap"></i>'); });
      var caps = root.querySelectorAll('.cap');
      function show(i, on) { caps[i].style.opacity = on ? 1 : 0; days[i].classList.toggle('on', !!on); }
      days.forEach(function (d, i) { show(i, i === cur); });
      function go(i) {
        if (i === cur) return;
        var from = cur; cur = i;
        caps.forEach(function (c) { c.getAnimations().forEach(function (a) { a.finish(); }); });
        root.querySelectorAll('.fx').forEach(function (x) { x.remove(); });
        days.forEach(function (d, k) { if (k !== from) show(k, k === i); });
        ft.querySelector('.lbl').textContent = NAMES[i] + ', Nov ' + DAYS[i][1];
        ft.querySelector('.sl').textContent = SLOTS[i] + ' slots';
        ft.animate([{ transform: 'translateY(6px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 250, easing: 'ease-out' });
        var a = caps[from], b = caps[i], dir = i > from ? 1 : -1;
        if (api.reduce) { show(from, false); return; }
        show(from, false);
        var dx = (from - i) * days[0].offsetWidth;
        days[i].insertAdjacentHTML('beforeend', '<span class="fx brk"><i></i><i></i><i></i><i></i></span>');
        var br = days[i].querySelector('.brk');
        br.animate([{ transform: 'translateX(' + dx + 'px) scale(1)' }, { transform: 'scale(1.5,1.3)', offset: 0.5 }, { transform: 'scale(1)' }],
          { duration: 500, easing: 'cubic-bezier(.34,1.56,.64,1)' }).onfinish = function () {
          br.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: 'forwards' }).onfinish = function () { br.remove(); };
        };
        b.animate([{ opacity: 0 }, { opacity: 0, offset: 0.5 }, { opacity: 1 }], { duration: 450 });
      }
      days.forEach(function (d, i) { d.onclick = function () { go(i); }; });
      tm.push(setTimeout(function () { go(3); }, 600));
      return function () { tm.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'datepick-rise-land',
    cat: 'Input & Form',
    name: 'Rise & Land',
    source: SRC,
    trigger: 'tap',
    motion: 'Kapsul hari yang diketuk terangkat 8px dengan bayangan dalam dan sedikit membesar (scale 1.06), lalu mendarat kembali dengan efek gepeng (scaleY 0.92 → 1). Kapsul lama memudar turun di saat yang sama.',
    timing: 'naik 180ms ease-out · turun 200ms ease-in · gepeng 120ms · lama pudar 200ms',
    use: 'Pemilih hari pada kalender mingguan aplikasi jadwal atau kebiasaan.',
    tags: 'date picker rise lift land squash shadow capsule',
    html: HTML,
    css: CSS,
    js: function (root, api) {
      var SLOTS = [2, 5, 3, 4, 6, 6, 3], NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      var days = root.querySelectorAll('.dy'), ft = root.querySelector('.ft'), cur = 1, tm = [];
      days.forEach(function (d) { d.insertAdjacentHTML('afterbegin', '<i class="cap"></i>'); });
      var caps = root.querySelectorAll('.cap');
      function show(i, on) { caps[i].style.opacity = on ? 1 : 0; days[i].classList.toggle('on', !!on); }
      days.forEach(function (d, i) { show(i, i === cur); });
      function go(i) {
        if (i === cur) return;
        var from = cur; cur = i;
        caps.forEach(function (c) { c.getAnimations().forEach(function (a) { a.finish(); }); });
        root.querySelectorAll('.fx').forEach(function (x) { x.remove(); });
        days.forEach(function (d, k) { if (k !== from) show(k, k === i); });
        ft.querySelector('.lbl').textContent = NAMES[i] + ', Nov ' + DAYS[i][1];
        ft.querySelector('.sl').textContent = SLOTS[i] + ' slots';
        ft.animate([{ transform: 'translateY(6px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 250, easing: 'ease-out' });
        var a = caps[from], b = caps[i], dir = i > from ? 1 : -1;
        if (api.reduce) { show(from, false); return; }
        a.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(4px)' }], { duration: 200 }).onfinish = function () { if (cur !== from) show(from, false); };
        b.style.transformOrigin = '50% 100%';
        days[i].animate([{ transform: 'none' }, { transform: 'translateY(-8px)', offset: 0.36 }, { transform: 'translateY(0)', offset: 0.76 }, { transform: 'none' }], { duration: 500 });
        b.animate([{ transform: 'none', boxShadow: '0 0 0 rgba(0,0,0,0)' },
          { transform: 'scale(1.06)', boxShadow: '0 10px 16px rgba(0,0,0,.28)', offset: 0.36, easing: 'ease-in' },
          { transform: 'scale(1.04,.92)', boxShadow: '0 1px 2px rgba(0,0,0,.2)', offset: 0.76 }, { transform: 'none', boxShadow: '0 0 0 rgba(0,0,0,0)' }], { duration: 500, easing: 'ease-out' });
      }
      days.forEach(function (d, i) { d.onclick = function () { go(i); }; });
      tm.push(setTimeout(function () { go(3); }, 600));
      return function () { tm.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'datepick-side-wipe',
    cat: 'Input & Form',
    name: 'Side Wipe',
    source: SRC,
    trigger: 'tap',
    motion: 'Warna kapsul lama tersapu keluar ke arah hari baru (clip-path dari sisi berlawanan), lalu warna menyapu masuk ke kapsul baru dari sisi yang sama, sehingga seolah warnanya mengalir searah perpindahan.',
    timing: 'sapu keluar 175ms ease-in · sapu masuk 175ms ease-out (total ≈350ms)',
    use: 'Pemilih tanggal atau tab yang perlu menunjukkan arah maju/mundur.',
    tags: 'date picker wipe clip-path direction capsule',
    html: HTML,
    css: CSS,
    js: function (root, api) {
      var SLOTS = [2, 5, 3, 4, 6, 6, 3], NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      var days = root.querySelectorAll('.dy'), ft = root.querySelector('.ft'), cur = 1, tm = [];
      days.forEach(function (d) { d.insertAdjacentHTML('afterbegin', '<i class="cap"></i>'); });
      var caps = root.querySelectorAll('.cap');
      function show(i, on) { caps[i].style.opacity = on ? 1 : 0; days[i].classList.toggle('on', !!on); }
      days.forEach(function (d, i) { show(i, i === cur); });
      function go(i) {
        if (i === cur) return;
        var from = cur; cur = i;
        caps.forEach(function (c) { c.getAnimations().forEach(function (a) { a.finish(); }); });
        root.querySelectorAll('.fx').forEach(function (x) { x.remove(); });
        days.forEach(function (d, k) { if (k !== from) show(k, k === i); });
        ft.querySelector('.lbl').textContent = NAMES[i] + ', Nov ' + DAYS[i][1];
        ft.querySelector('.sl').textContent = SLOTS[i] + ' slots';
        ft.animate([{ transform: 'translateY(6px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 250, easing: 'ease-out' });
        var a = caps[from], b = caps[i], dir = i > from ? 1 : -1;
        if (api.reduce) { show(from, false); return; }
        var outTo = dir > 0 ? 'inset(0 0 0 100% round 14px)' : 'inset(0 100% 0 0 round 14px)';
        var inFrom = dir > 0 ? 'inset(0 100% 0 0 round 14px)' : 'inset(0 0 0 100% round 14px)';
        a.style.opacity = 1; days[from].classList.add('on');
        a.animate([{ clipPath: 'inset(0 0 0 0 round 14px)' }, { clipPath: outTo }], { duration: 175, easing: 'ease-in' }).onfinish = function () { if (cur !== from) show(from, false); };
        b.animate([{ clipPath: inFrom }, { clipPath: inFrom, offset: 0.5 }, { clipPath: 'inset(0 0 0 0 round 14px)' }], { duration: 350, easing: 'ease-out' });
      }
      days.forEach(function (d, i) { d.onclick = function () { go(i); }; });
      tm.push(setTimeout(function () { go(3); }, 600));
      return function () { tm.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'datepick-dot-swell',
    cat: 'Input & Form',
    name: 'Dot Swell',
    source: SRC,
    trigger: 'tap',
    motion: 'Titik kecil di bawah tanggal yang diketuk membengkak ke atas menjadi kapsul penuh (scale 0.15×0.08 → 1 dari tepi bawah, ujung tetap membulat). Kapsul lama menyusut kembali menjadi titik dan hilang.',
    timing: 'bengkak 350ms ease-out (cubic-bezier .2,.8,.2,1) · susut 250ms ease-in',
    use: 'Kalender mingguan yang menandai hari berjadwal dengan titik, misalnya jadwal minum obat.',
    tags: 'date picker dot swell grow scale capsule morph',
    html: HTML,
    css: CSS + '& .cap{transform-origin:50% 92%}',
    js: function (root, api) {
      var SLOTS = [2, 5, 3, 4, 6, 6, 3], NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      var days = root.querySelectorAll('.dy'), ft = root.querySelector('.ft'), cur = 1, tm = [];
      days.forEach(function (d) { d.insertAdjacentHTML('afterbegin', '<i class="cap"></i>'); });
      var caps = root.querySelectorAll('.cap');
      function show(i, on) { caps[i].style.opacity = on ? 1 : 0; days[i].classList.toggle('on', !!on); }
      days.forEach(function (d, i) { show(i, i === cur); });
      function go(i) {
        if (i === cur) return;
        var from = cur; cur = i;
        caps.forEach(function (c) { c.getAnimations().forEach(function (a) { a.finish(); }); });
        root.querySelectorAll('.fx').forEach(function (x) { x.remove(); });
        days.forEach(function (d, k) { if (k !== from) show(k, k === i); });
        ft.querySelector('.lbl').textContent = NAMES[i] + ', Nov ' + DAYS[i][1];
        ft.querySelector('.sl').textContent = SLOTS[i] + ' slots';
        ft.animate([{ transform: 'translateY(6px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 250, easing: 'ease-out' });
        var a = caps[from], b = caps[i], dir = i > from ? 1 : -1;
        if (api.reduce) { show(from, false); return; }
        a.animate([{ transform: 'none', opacity: 1 }, { transform: 'scale(.15,.08)', opacity: 1, offset: 0.85 }, { transform: 'scale(.15,.08)', opacity: 0 }], { duration: 250, easing: 'ease-in' }).onfinish = function () { if (cur !== from) show(from, false); };
        b.animate([{ transform: 'scale(.15,.08)' }, { transform: 'scale(.15,.08)', offset: 0.15 }, { transform: 'none' }], { duration: 400, easing: 'cubic-bezier(.2,.8,.2,1)' });
      }
      days.forEach(function (d, i) { d.onclick = function () { go(i); }; });
      tm.push(setTimeout(function () { go(3); }, 600));
      return function () { tm.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'datepick-twist-in',
    cat: 'Input & Form',
    name: 'Twist In',
    source: SRC,
    trigger: 'tap',
    motion: 'Kapsul baru berputar masuk dari seperempat putaran (rotate 90°→0, scale 0.6→1) dengan pegas, sementara kapsul lama berputar pergi ke arah lain (rotate −90°, scale 0.6) sambil memudar.',
    timing: 'masuk 350ms pegas (cubic-bezier .34,1.4,.64,1) · keluar 250ms ease-in',
    use: 'Pemilih tanggal di aplikasi yang bernuansa playful, atau penanda pilihan pada grid kecil.',
    tags: 'date picker twist rotate spin scale capsule spring',
    html: HTML,
    css: CSS,
    js: function (root, api) {
      var SLOTS = [2, 5, 3, 4, 6, 6, 3], NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      var days = root.querySelectorAll('.dy'), ft = root.querySelector('.ft'), cur = 1, tm = [];
      days.forEach(function (d) { d.insertAdjacentHTML('afterbegin', '<i class="cap"></i>'); });
      var caps = root.querySelectorAll('.cap');
      function show(i, on) { caps[i].style.opacity = on ? 1 : 0; days[i].classList.toggle('on', !!on); }
      days.forEach(function (d, i) { show(i, i === cur); });
      function go(i) {
        if (i === cur) return;
        var from = cur; cur = i;
        caps.forEach(function (c) { c.getAnimations().forEach(function (a) { a.finish(); }); });
        root.querySelectorAll('.fx').forEach(function (x) { x.remove(); });
        days.forEach(function (d, k) { if (k !== from) show(k, k === i); });
        ft.querySelector('.lbl').textContent = NAMES[i] + ', Nov ' + DAYS[i][1];
        ft.querySelector('.sl').textContent = SLOTS[i] + ' slots';
        ft.animate([{ transform: 'translateY(6px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 250, easing: 'ease-out' });
        var a = caps[from], b = caps[i], dir = i > from ? 1 : -1;
        if (api.reduce) { show(from, false); return; }
        a.animate([{ transform: 'none', opacity: 1 }, { transform: 'rotate(-90deg) scale(.6)', opacity: 0 }], { duration: 250, easing: 'ease-in' }).onfinish = function () { if (cur !== from) show(from, false); };
        b.animate([{ transform: 'rotate(90deg) scale(.6)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 350, easing: 'cubic-bezier(.34,1.4,.64,1)' });
      }
      days.forEach(function (d, i) { d.onclick = function () { go(i); }; });
      tm.push(setTimeout(function () { go(3); }, 600));
      return function () { tm.forEach(clearTimeout); };
    }
  });
})();
