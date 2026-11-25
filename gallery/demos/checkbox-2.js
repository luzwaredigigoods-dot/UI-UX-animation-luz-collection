/* Checkbox · Part 2 — drag select, hand-drawn tick, flip tick, progress ring, tri-state, pop burst. */
(function () {
  var src = 'Checkbox · Part 2';
  var cat = 'Tombol & Toggle';
  var CHECK = '<svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true"><path class="tk" d="M5 12.5l4.5 4.5L19 7.5" pathLength="1"/></svg>';
  var boxCss = '& .cb{position:relative;flex:none;border-radius:6px;box-shadow:inset 0 0 0 1.5px var(--d-mid);transition:background .15s,box-shadow .15s}' +
    '& .cb .tk{fill:none;stroke:#fff;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset 220ms ease-out}' +
    '& .cb.on{background:linear-gradient(135deg,#6f8cff,#4f5cff);box-shadow:none}& .cb.on .tk{stroke-dashoffset:0}';

  LUZ.add({
    id: 'checkbox-drag-select', cat: cat, name: 'Drag Select', source: src, trigger: 'drag', allowColor: true,
    motion: 'Tekan kotak pertama lalu seret ke bawah: setiap baris yang dilewati jari langsung tercentang (✓ tergambar 220ms, kotak pop scale 1.15) dan pita sorotan bulat di belakang baris memanjang mengikuti seretan. Jika seretan dimulai dari kotak yang sudah tercentang, semua yang dilewati justru dicentang-hapus.',
    timing: 'per kotak: isi 150ms + tick 220ms ease-out · pop 200ms · pita ikut jari',
    use: 'pilih banyak item sekaligus, mis. tandai beberapa jadwal minum obat atau hari praktik',
    tags: 'checkbox drag select multi select range paint swipe check',
    html: '<div class="ds"><i class="band"></i>' + [['Mon', 'Gym'], ['Tue', 'Run'], ['Wed', 'Yoga'], ['Thu', 'Swim']].map(function (r) { return '<div class="rw"><span class="cb" style="width:16px;height:16px">' + CHECK + '</span><span class="d">' + r[0] + '</span><small>' + r[1] + '</small></div>'; }).join('') + '</div>',
    css: boxCss + '& .ds{position:relative;width:200px;padding:6px;border-radius:14px;background:var(--d-bg);box-shadow:0 0 0 1px var(--d-soft);touch-action:none;user-select:none;cursor:pointer}' +
      '& .rw{position:relative;display:flex;align-items:center;gap:10px;height:32px;padding:0 10px;font-size:10.5px}& .rw small{margin-left:auto;color:var(--d-mid);font-size:9px}& .d{transition:color .15s;color:var(--d-mid)}& .rw.on .d{color:var(--d-fg)}' +
      '& .band{position:absolute;left:6px;right:6px;top:6px;height:32px;border-radius:9px;background:var(--d-accent);opacity:0;transform-origin:top;transition:opacity .2s}& .ds.drag .band{opacity:.16}',
    js: function (root, api) {
      var ds = root.querySelector('.ds'), band = root.querySelector('.band'), rows = root.querySelectorAll('.rw'), start = -1, mode = true, t = [];
      function idx(y) { var r = ds.getBoundingClientRect(); return Math.max(0, Math.min(3, Math.floor((y - r.top - 6) / 32))); }
      function set(i, on) {
        var r = rows[i], cb = r.querySelector('.cb'); if (r.classList.contains('on') === on) return;
        r.classList.toggle('on', on); cb.classList.toggle('on', on);
        if (on && !api.reduce) cb.animate([{ transform: 'scale(.8)' }, { transform: 'scale(1.15)' }, { transform: 'none' }], { duration: 200 });
      }
      function paint(i) {
        var a = Math.min(start, i), b = Math.max(start, i);
        for (var j = a; j <= b; j++) set(j, mode);
        band.style.transform = 'translateY(' + a * 32 + 'px) scaleY(' + (b - a + 1) + ')';
      }
      ds.addEventListener('pointerdown', function (e) { start = idx(e.clientY); mode = !rows[start].classList.contains('on'); ds.classList.add('drag'); ds.setPointerCapture(e.pointerId); paint(start); });
      ds.addEventListener('pointermove', function (e) { if (start >= 0) paint(idx(e.clientY)); });
      function up() { start = -1; ds.classList.remove('drag'); }
      ds.addEventListener('pointerup', up); ds.addEventListener('pointercancel', up);
      // autoplay: drag from Mon to Thu, then clear
      t.push(setTimeout(function () { start = 0; mode = true; ds.classList.add('drag'); paint(0); }, 600));
      [1, 2, 3].forEach(function (i) { t.push(setTimeout(function () { paint(i); }, 600 + i * 160)); });
      t.push(setTimeout(up, 1250), setTimeout(function () { for (var i = 0; i < 4; i++) set(i, false); }, 2600));
      return function () { t.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'checkbox-hand-drawn-tick', cat: cat, name: 'Hand-drawn Tick', source: src, trigger: 'tap', allowColor: true,
    motion: 'Ketuk: ikon pensil bergerak ke kotak bergaya sketsa dan menelusuri tanda ✓ tulisan tangan (stroke-dashoffset 1 → 0): goresan pendek turun, lalu goresan panjang naik melewati tepi kanan-atas kotak. Pensil kembali ke posisi semula dan teks "Call the dentist" meredup jadi abu (selesai). Ketuk lagi: centang terhapus mundur dan teks kembali terang.',
    timing: 'gores ≈450ms cubic-bezier(.6,0,.4,1) · pensil mengikuti 450ms + kembali 250ms · hapus 250ms',
    use: 'daftar tugas/pengingat pribadi (to-do perawat, catatan kontrol) yang ingin terasa manusiawi',
    tags: 'checkbox hand drawn tick pencil sketch stroke draw todo',
    html: '<button type="button" class="hd"><svg viewBox="0 0 60 44" width="78" height="57" aria-hidden="true"><rect x="12" y="10" width="28" height="28" rx="3" class="bx"/><path class="ck" pathLength="1" d="M17 23 C20 26 22 29 24 32 C29 22 38 10 50 2"/></svg><i class="pen"></i><span class="tx">Call the dentist</span></button>',
    css: '& .hd{position:relative;display:flex;align-items:center;gap:6px;border:0;background:none;color:var(--d-fg);cursor:pointer;padding:8px}' +
      '& .bx{fill:none;stroke:var(--d-fg);stroke-width:1.6;stroke-dasharray:60 2 40 3;opacity:.8}& .ck{fill:none;stroke:var(--d-accent);stroke-width:3.2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1;stroke-dashoffset:1}' +
      '& .pen{position:absolute;left:-12px;top:38px;width:26px;height:5px;border-radius:1px 3px 3px 1px;background:linear-gradient(90deg,#ff8fb0 0 18%,#8a6bff 18%);transform:rotate(45deg);transform-origin:100% 50%}' +
      '& .pen::after{content:"";position:absolute;right:-6px;top:0;border:2.5px solid transparent;border-left:6px solid #f3d2a8}' +
      '& .tx{font:italic 13px/1 "Segoe Print","Bradley Hand",cursive;transition:color .3s,opacity .3s}& .hd.on .tx{color:var(--d-mid);opacity:.7}',
    js: function (root, api) {
      var hd = root.querySelector('.hd'), ck = root.querySelector('.ck'), pen = root.querySelector('.pen'), on = false, t = [], k = api.reduce ? 0.01 : 1;
      function tog() {
        on = !on; hd.classList.toggle('on', on);
        ck.getAnimations().forEach(function (a) { a.cancel(); });
        ck.style.strokeDashoffset = on ? 0 : 1;
        ck.animate([{ strokeDashoffset: on ? 1 : 0 }, { strokeDashoffset: on ? 0 : 1 }], { duration: (on ? 450 : 250) * k, easing: 'cubic-bezier(.6,0,.4,1)' });
        if (on) pen.animate([ // tip follows the tick path: start → bottom → top-right, then back
          { transform: 'rotate(45deg)' }, { transform: 'translate(36px,-8px) rotate(45deg)', offset: .15 },
          { transform: 'translate(43px,1px) rotate(45deg)', offset: .4 }, { transform: 'translate(70px,-30px) rotate(45deg)', offset: .75 },
          { transform: 'rotate(45deg)' }], { duration: 700 * k, easing: 'ease-in-out' });
      }
      hd.onclick = tog;
      t.push(setTimeout(tog, 600), setTimeout(tog, 2300));
      return function () { t.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'checkbox-flip-tick', cat: cat, name: 'Flip Tick', source: src, trigger: 'tap', allowColor: true,
    motion: 'Ketuk: kotak terangkat (scale 1.12 dengan bayangan), berputar 180° pada sumbu Y dengan perspektif 300px, dan sisi belakangnya berupa kotak biru bergradasi berisi ✓ putih; lalu turun kembali ke scale 1. Subjudul berganti "Off" → "On · back in stock". Ketuk lagi untuk membalik kembali.',
    timing: '≈460ms cubic-bezier(.4,0,.2,1) · angkat 0–30%, putar 15–85%, turun 70–100%',
    use: 'toggle langganan/pengingat (mis. "ingatkan saat stok obat tersedia")',
    tags: 'checkbox flip 3d rotateY card turn tick toggle',
    html: '<button type="button" class="ft"><span class="cd"><span class="fa fr"></span><span class="fa bk">' + CHECK + '</span></span><span class="tx"><b>Notify me</b><small>Off</small></span></button>',
    css: '& .ft{display:flex;align-items:center;gap:12px;border:0;background:none;color:var(--d-fg);cursor:pointer;padding:8px;text-align:left}' +
      '& .cd{position:relative;width:40px;height:40px;transform-style:preserve-3d}& .fa{position:absolute;inset:0;border-radius:10px;backface-visibility:hidden}' +
      '& .fr{box-shadow:inset 0 0 0 2px var(--d-mid);background:var(--d-soft)}& .bk{transform:rotateY(180deg);background:linear-gradient(135deg,#6f8cff,#4f5cff);padding:6px;box-sizing:border-box}' +
      '& .bk .tk{fill:none;stroke:#fff;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}& .tx{display:grid}& .tx b{font-size:12px}& .tx small{color:var(--d-mid);font-size:9.5px}',
    js: function (root, api) {
      var cd = root.querySelector('.cd'), sm = root.querySelector('.tx small'), on = false, t = [];
      function tog() {
        on = !on; var a = on ? 0 : 180, b = on ? 180 : 0;
        cd.style.transform = 'perspective(300px) rotateY(' + b + 'deg)';
        cd.animate([
          { transform: 'perspective(300px) rotateY(' + a + 'deg)', filter: 'drop-shadow(0 0 0 transparent)' },
          { transform: 'perspective(300px) rotateY(' + a + 'deg) scale(1.12)', filter: 'drop-shadow(0 6px 8px rgba(0,0,0,.3))', offset: .2 },
          { transform: 'perspective(300px) rotateY(' + b + 'deg) scale(1.12)', filter: 'drop-shadow(0 6px 8px rgba(0,0,0,.3))', offset: .75 },
          { transform: 'perspective(300px) rotateY(' + b + 'deg)', filter: 'drop-shadow(0 0 0 transparent)' }
        ], { duration: api.reduce ? 1 : 460, easing: 'cubic-bezier(.4,0,.2,1)' });
        sm.textContent = on ? 'On · back in stock' : 'Off';
      }
      root.querySelector('.ft').onclick = tog;
      t.push(setTimeout(tog, 600), setTimeout(tog, 2200));
      return function () { t.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'checkbox-progress-ring', cat: cat, name: 'Progress Ring', source: src, trigger: 'tap', allowColor: true,
    motion: 'Setiap tugas yang dicentang menambah busur cincin progres sepertiga (stroke-dashoffset) dan angka "n/3" di tengah bergulir. Saat 3/3, angka berubah menjadi lingkaran biru penuh berisi ✓ yang pop (scale 0.5 → 1.15 → 1) dengan cahaya, dan 6 kilau kecil memancar keluar. Menghapus centang mengurangi cincin lagi.',
    timing: 'busur ≈420ms cubic-bezier(.2,.8,.2,1) · angka 200ms · pop selesai 320ms spring · kilau 500ms',
    use: 'checklist harian (mis. persiapan pasien pra-operasi) dengan indikator kemajuan',
    tags: 'checkbox progress ring checklist complete celebrate counter',
    html: '<div class="pr"><div class="rg"><svg viewBox="0 0 44 44" width="64" height="64"><circle cx="22" cy="22" r="18" class="bg"/><circle cx="22" cy="22" r="18" class="fg" pathLength="3"/></svg><b class="n">0<small>/3</small></b><span class="dn">' + CHECK + '</span></div>' +
      '<div class="ls">' + ['Stretch', 'Read 10 pages', 'Drink water'].map(function (s) { return '<button type="button" class="it"><span class="cb" style="width:15px;height:15px">' + CHECK + '</span>' + s + '</button>'; }).join('') + '</div></div>',
    css: boxCss + '& .pr{display:flex;align-items:center;gap:16px}& .rg{position:relative;width:64px;height:64px;display:grid;place-items:center}& .rg svg{position:absolute;inset:0;transform:rotate(-90deg)}' +
      '& .bg,& .fg{fill:none;stroke-width:4}& .bg{stroke:var(--d-soft)}& .fg{stroke:var(--d-accent);stroke-linecap:round;stroke-dasharray:3;stroke-dashoffset:3;transition:stroke-dashoffset 420ms cubic-bezier(.2,.8,.2,1)}' +
      '& .n{font-size:15px}& .n small{font-size:9px;color:var(--d-mid)}& .dn{position:absolute;inset:10px;border-radius:50%;background:linear-gradient(135deg,#6f8cff,#4f5cff);box-shadow:0 0 16px rgba(90,110,255,.6);padding:9px;box-sizing:border-box;opacity:0}& .dn .tk{fill:none;stroke:#fff;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}' +
      '& .ls{display:grid;gap:4px}& .it{display:flex;align-items:center;gap:8px;border:0;background:none;color:var(--d-fg);font:inherit;font-size:10.5px;padding:5px 0;cursor:pointer}' +
      '& .sk{position:absolute;left:50%;top:50%;width:4px;height:4px;margin:-2px;border-radius:50%;background:var(--d-accent);pointer-events:none}',
    js: function (root, api) {
      var its = root.querySelectorAll('.it'), fg = root.querySelector('.fg'), n = root.querySelector('.n'), dn = root.querySelector('.dn'), rg = root.querySelector('.rg'), t = [], k = api.reduce ? 0.01 : 1, was = 0;
      function update() {
        var c = root.querySelectorAll('.cb.on').length;
        fg.style.strokeDashoffset = 3 - c;
        n.firstChild.textContent = c;
        if (c !== was) n.animate([{ transform: 'translateY(' + (c > was ? 8 : -8) + 'px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 200 * k });
        if (c === 3) {
          dn.animate([{ opacity: 0, transform: 'scale(.5)' }, { opacity: 1, transform: 'scale(1.15)' }, { opacity: 1, transform: 'none' }], { duration: 320 * k, delay: 300 * k, fill: 'forwards', easing: 'ease-out' });
          for (var i = 0; i < 6; i++) {
            var s = document.createElement('i'), a = i / 6 * Math.PI * 2; s.className = 'sk'; rg.appendChild(s);
            s.animate([{ transform: 'none', opacity: 0 }, { transform: 'translate(' + Math.cos(a) * 26 + 'px,' + Math.sin(a) * 26 + 'px)', opacity: 1, offset: .5 }, { transform: 'translate(' + Math.cos(a) * 40 + 'px,' + Math.sin(a) * 40 + 'px) scale(.3)', opacity: 0 }],
              { duration: 500 * k, delay: 350 * k }).onfinish = function () { this.effect.target.remove(); };
          }
        } else if (was === 3) dn.getAnimations().forEach(function (a) { a.cancel(); });
        was = c;
      }
      its.forEach(function (it) { it.onclick = function () { it.querySelector('.cb').classList.toggle('on'); update(); }; });
      [0, 1, 2].forEach(function (i) { t.push(setTimeout(function () { its[i].click(); }, 600 + i * 450)); });
      t.push(setTimeout(function () { its[1].click(); its[2].click(); }, 3000));
      return function () { t.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'checkbox-tri-state', cat: cat, name: 'Tri-state', source: src, trigger: 'tap', allowColor: true,
    motion: 'Ketuk berulang: kosong → strip "–" (Some) → ✓ (All) → kosong. Dari kosong, kotak terisi biru (scale 0.85 → 1) dan strip muncul. Dari strip ke ✓, ujung kiri strip menekuk turun membentuk centang (morph path d). Dari ✓ ke kosong, isi memudar. Chip status ikut crossfade: None / Some / All.',
    timing: 'isi 180ms ease-out · morph strip → ✓ 300ms cubic-bezier(.34,1.56,.64,1) · chip 150ms',
    use: 'checkbox induk "pilih semua" pada daftar (mis. pilih semua hasil lab untuk dicetak)',
    tags: 'checkbox tri-state indeterminate dash morph select all',
    html: '<button type="button" class="ts"><span class="bx3"><svg viewBox="0 0 24 24" width="100%" height="100%"><path class="mk" d="M6 12 L12 12 L18 12"/></svg></span><span class="tx"><b>Sync folders</b><small class="chip">None</small></span></button>',
    css: '& .ts{display:flex;align-items:center;gap:12px;border:0;background:none;color:var(--d-fg);cursor:pointer;padding:8px;text-align:left}' +
      '& .bx3{width:36px;height:36px;border-radius:9px;box-shadow:inset 0 0 0 2px var(--d-mid);padding:6px;box-sizing:border-box;transition:background .18s,box-shadow .18s}& .ts[data-s="1"] .bx3,& .ts[data-s="2"] .bx3{background:linear-gradient(135deg,#6f8cff,#4f5cff);box-shadow:none}' +
      '& .mk{fill:none;stroke:#fff;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;opacity:0;transition:d 300ms cubic-bezier(.34,1.56,.64,1),opacity .15s}& .ts[data-s="1"] .mk{opacity:1}& .ts[data-s="2"] .mk{opacity:1;d:path("M5 12.5 L9.5 17 L19 7.5")}' +
      '& .tx{display:grid;justify-items:start;gap:3px}& .tx b{font-size:12px}& .chip{font-size:9px;padding:2px 8px;border-radius:99px;background:var(--d-soft);color:var(--d-mid)}& .ts[data-s="2"] .chip{background:var(--d-accent);color:var(--d-bg)}',
    js: function (root, api) {
      var ts = root.querySelector('.ts'), box = root.querySelector('.bx3'), chip = root.querySelector('.chip'), s = 0, t = [], k = api.reduce ? 0.01 : 1;
      if (api.reduce) root.querySelector('.mk').style.transition = 'none';
      function next() {
        s = (s + 1) % 3; ts.dataset.s = s;
        if (s === 1) box.animate([{ transform: 'scale(.85)' }, { transform: 'none' }], { duration: 180 * k, easing: 'ease-out' });
        chip.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150 * k }); chip.textContent = ['None', 'Some', 'All'][s];
      }
      ts.dataset.s = 0; ts.onclick = next;
      t.push(setTimeout(next, 600), setTimeout(next, 1300), setTimeout(next, 2400));
      return function () { t.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'checkbox-pop-burst', cat: cat, name: 'Pop Burst', source: src, trigger: 'tap', allowColor: true,
    motion: 'Ketuk: kotak kosong tertekan (scale 0.85), lalu pop ke 1.15 sambil terisi biru dan ✓ tergambar; bersamaan sebuah cincin mengembang (scale 1 → 1.8, memudar) dan 8 titik warna-warni terlempar radial 24px lalu hilang. Kotak kembali ke 1 dan subjudul berganti "Early access" → "You\'re in!". Ketuk lagi: kotak kosong tanpa efek.',
    timing: 'tekan 100ms · pop 260ms cubic-bezier(.34,1.8,.64,1) · cincin & titik 500ms ease-out',
    use: 'persetujuan atau pendaftaran penting yang pantas dirayakan (mis. ikut program, setuju consent)',
    tags: 'checkbox pop burst confetti ring celebrate squish',
    html: '<button type="button" class="pb"><span class="cb" style="width:36px;height:36px;border-radius:10px">' + CHECK + '<i class="ring"></i></span><span class="tx"><b>Join the beta</b><small>Early access</small></span></button>',
    css: boxCss + '& .pb{display:flex;align-items:center;gap:12px;border:0;background:none;color:var(--d-fg);cursor:pointer;padding:8px;text-align:left}& .pb .cb svg{padding:6px;box-sizing:border-box}' +
      '& .ring{position:absolute;inset:0;border-radius:12px;border:2px solid var(--d-accent);opacity:0;pointer-events:none}& .tx{display:grid}& .tx b{font-size:12px}& .tx small{color:var(--d-mid);font-size:9.5px}' +
      '& .bd{position:absolute;left:50%;top:50%;width:5px;height:5px;margin:-2.5px;border-radius:50%;pointer-events:none}',
    js: function (root, api) {
      var pb = root.querySelector('.pb'), cb = root.querySelector('.cb'), ring = root.querySelector('.ring'), sm = root.querySelector('.tx small'), t = [], k = api.reduce ? 0.01 : 1;
      var C = ['#ff6b9a', '#ffc53d', '#3fa9ff', '#2fbf8f'];
      function tog() {
        var on = !cb.classList.contains('on');
        if (!on) { cb.classList.remove('on'); sm.textContent = 'Early access'; return; }
        cb.animate([{ transform: 'none' }, { transform: 'scale(.85)', offset: .28 }, { transform: 'scale(1.15)', offset: .65 }, { transform: 'none' }], { duration: 360 * k, easing: 'cubic-bezier(.34,1.8,.64,1)' });
        t.push(setTimeout(function () {
          cb.classList.add('on'); sm.textContent = "You're in!";
          ring.animate([{ opacity: .9, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(1.8)' }], { duration: 500 * k, easing: 'ease-out' });
          for (var i = 0; i < 8; i++) {
            var d = document.createElement('i'), a = i / 8 * Math.PI * 2 + 0.3; d.className = 'bd'; d.style.background = C[i % 4]; cb.appendChild(d);
            d.animate([{ transform: 'none', opacity: 1 }, { transform: 'translate(' + Math.cos(a) * 30 + 'px,' + Math.sin(a) * 30 + 'px) scale(.4)', opacity: 0 }], { duration: 500 * k, easing: 'ease-out' }).onfinish = function () { this.effect.target.remove(); };
          }
        }, 100 * k));
      }
      pb.onclick = tog;
      t.push(setTimeout(tog, 600), setTimeout(tog, 2200));
      return function () { t.forEach(clearTimeout); };
    }
  });
})();
