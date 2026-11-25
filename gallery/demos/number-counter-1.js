/* Number Counter · Part 1 — one step count, six ways to change it (tap a day). */
(function () {
  var SRC = 'Number Counter · Part 1';
  var HTML = '<div class="nc"><div class="tabs"><i class="hl"></i><button type="button" class="on">Mon</button><button type="button">Tue</button><button type="button">Wed</button><button type="button">Thu</button></div>' +
    '<div class="big"><span class="arw"></span><span class="num">6,482</span><small>steps</small></div><div class="prog"><i></i></div></div>';
  var CSS =
    '& .nc{width:236px;padding:12px 14px 14px;border-radius:16px;background:var(--d-bg);border:1px solid var(--d-soft);color:var(--d-fg)}' +
    '& .tabs{position:relative;display:grid;grid-template-columns:repeat(4,1fr);padding:3px;border-radius:99px;border:1px solid var(--d-soft)}' +
    '& .tabs button{position:relative;z-index:1;height:26px;padding:0;border:0;background:none;font:inherit;font-size:10.5px;font-weight:600;color:var(--d-mid);cursor:pointer;transition:color .2s}' +
    '& .tabs button.on{color:var(--d-bg)}' +
    '& .hl{position:absolute;left:3px;top:3px;bottom:3px;width:calc((100% - 6px) / 4);border-radius:99px;background:var(--d-accent)}' +
    '& .big{display:flex;align-items:baseline;gap:6px;margin:12px 0 10px;height:48px}' +
    '& .num{position:relative;display:inline-flex;font-size:40px;font-weight:700;line-height:48px;font-variant-numeric:tabular-nums;white-space:pre}' +
    '& .big small{font-size:11px;color:var(--d-mid)}' +
    '& .arw{width:0;overflow:hidden;font-size:11px;align-self:center}' +
    '& .prog{height:4px;border-radius:2px;background:var(--d-soft);overflow:hidden}' +
    '& .prog i{display:block;height:100%;background:var(--d-accent);transform-origin:left;transform:scaleX(.648);transition:transform .5s cubic-bezier(.2,.8,.2,1)}';
  function entry(o) {
    LUZ.add({
      id: o.id, cat: 'Teks & Angka', name: o.name, source: SRC, trigger: 'tap',
      motion: o.motion, timing: o.timing, use: o.use, tags: o.tags, allowColor: o.allowColor,
      html: HTML, css: CSS + (o.css || ''), js: o.js
    });
  }

  entry({
    id: 'counter-odometer-roll',
    name: 'Odometer Roll',
    motion: 'Setiap digit adalah pita vertikal 0–9 yang berputar melewati angka-angka di antaranya (dengan blur gerak tipis) seperti odometer mobil. Digit berhenti bergiliran dari kiri (jeda 40ms); koma diam. Sorotan hari meregang ke tab baru dan bilah progres ikut berubah.',
    timing: '≈600ms · ease-out (cubic-bezier .2,.8,.2,1) · stagger 40ms · sorotan tab 300ms pegas',
    use: 'Statistik harian (langkah, kalori), saldo, atau jumlah pasien hari ini.',
    tags: 'odometer rolling digits counter number strip',
    css: '& .col{display:inline-block;height:48px;overflow:hidden}& .strip{display:flex;flex-direction:column;transition:transform .6s cubic-bezier(.2,.8,.2,1)}& .strip b{height:48px}',
    js: function (root, api) {
      var num = root.querySelector('.num');
      num.innerHTML = '6,482'.split('').map(function (c) {
        return c === ',' ? '<span>,</span>' : '<span class="col"><span class="strip"><b>0</b><b>1</b><b>2</b><b>3</b><b>4</b><b>5</b><b>6</b><b>7</b><b>8</b><b>9</b></span></span>';
      }).join('');
      var strips = num.querySelectorAll('.strip');
      function show(n, anim) {
        String(n).split('').forEach(function (d, i) {
          strips[i].style.transitionDelay = i * 40 + 'ms';
          strips[i].style.transitionDuration = anim && !api.reduce ? '' : '0s';
          strips[i].style.transform = 'translateY(' + -d * 48 + 'px)';
          if (anim && !api.reduce) strips[i].animate([{ filter: 'blur(0)' }, { filter: 'blur(1.5px)', offset: 0.3 }, { filter: 'blur(0)' }], { duration: 600, delay: i * 40 });
        });
      }
      show(6482, false);
      var t = (function wire(root, change) {
        var V = [6482, 9105, 7348, 8917], cur = 0, tabs = root.querySelectorAll('.tabs button'), hl = root.querySelector('.hl');
        function go(i) {
          if (i === cur) return;
          var w = tabs[0].offsetWidth, a = cur * w, b = i * w, old = V[cur]; cur = i;
          tabs.forEach(function (t, j) { t.classList.toggle('on', j === i); });
          hl.animate([{ transform: 'translateX(' + a + 'px)' }, { transform: 'translateX(' + (a + b) / 2 + 'px) scaleX(1.6)' }, { transform: 'translateX(' + b + 'px)' }],
            { duration: 300, easing: 'cubic-bezier(.3,1.3,.5,1)', fill: 'forwards' });
          root.querySelector('.prog i').style.transform = 'scaleX(' + V[i] / 10000 + ')';
          change(old, V[i]);
        }
        tabs.forEach(function (t, i) { t.onclick = function () { go(i); }; });
        return setTimeout(function () { go(1); }, 600);
      })(root, function (a, b) { show(b, true); });
      return function () { clearTimeout(t); };
    }
  });

  entry({
    id: 'counter-split-flap',
    name: 'Split Flap',
    motion: 'Setiap digit yang berubah membalik ke bawah seperti papan bandara: garis belah horizontal melintang di tengah angka, digit lama berputar rotateX 0→90°, digit baru masuk −90°→0. Digit bergiliran 50ms dari kiri.',
    timing: '200ms ease-in + 200ms ease-out per digit · stagger 50ms',
    use: 'Angka yang berganti jarang tapi penting, misalnya nomor antrean atau jam keberangkatan.',
    tags: 'split flap board flip digits rotateX airport counter',
    css: '& .num{perspective:200px}& .num::after{content:"";position:absolute;left:0;right:0;top:50%;height:1.5px;background:var(--d-bg)}& .dg{display:inline-block}',
    js: function (root, api) {
      var num = root.querySelector('.num');
      num.innerHTML = '6,482'.split('').map(function (c) { return '<span class="dg">' + c + '</span>'; }).join('');
      var dg = num.querySelectorAll('.dg');
      var t = (function wire(root, change) {
        var V = [6482, 9105, 7348, 8917], cur = 0, tabs = root.querySelectorAll('.tabs button'), hl = root.querySelector('.hl');
        function go(i) {
          if (i === cur) return;
          var w = tabs[0].offsetWidth, a = cur * w, b = i * w, old = V[cur]; cur = i;
          tabs.forEach(function (t, j) { t.classList.toggle('on', j === i); });
          hl.animate([{ transform: 'translateX(' + a + 'px)' }, { transform: 'translateX(' + (a + b) / 2 + 'px) scaleX(1.6)' }, { transform: 'translateX(' + b + 'px)' }],
            { duration: 300, easing: 'cubic-bezier(.3,1.3,.5,1)', fill: 'forwards' });
          root.querySelector('.prog i').style.transform = 'scaleX(' + V[i] / 10000 + ')';
          change(old, V[i]);
        }
        tabs.forEach(function (t, i) { t.onclick = function () { go(i); }; });
        return setTimeout(function () { go(1); }, 600);
      })(root, function (a, b) {
        var s = b.toLocaleString('en-US'), k = 0;
        s.split('').forEach(function (c, i) {
          if (dg[i].textContent === c) return;
          if (api.reduce) { dg[i].textContent = c; return; }
          dg[i].animate([{ transform: 'rotateX(0)' }, { transform: 'rotateX(90deg)' }], { duration: 200, delay: k++ * 50, easing: 'ease-in', fill: 'forwards' }).onfinish = function () {
            dg[i].textContent = c;
            dg[i].animate([{ transform: 'rotateX(-90deg)' }, { transform: 'rotateX(0)' }], { duration: 200, easing: 'ease-out', fill: 'forwards' });
          };
        });
      });
      return function () { clearTimeout(t); };
    }
  });

  entry({
    id: 'counter-blur-slide',
    name: 'Blur Slide',
    motion: 'Seluruh angka meluncur vertikal dengan blur gerak kuat: angka lama keluar ke atas (naik) atau ke bawah (turun) sambil kabur 4px dan memudar, angka baru masuk dari sisi berlawanan lalu tajam kembali.',
    timing: '≈350ms · ease-out · geser 60% tinggi angka',
    use: 'Ringkasan angka di dasbor yang berganti saat memilih periode/hari.',
    tags: 'blur slide number vertical motion blur swap counter',
    css: '& .num span{display:block}& .num .old{position:absolute;left:0;top:0}',
    js: function (root, api) {
      var num = root.querySelector('.num');
      num.innerHTML = '<span>6,482</span>';
      var t = (function wire(root, change) {
        var V = [6482, 9105, 7348, 8917], cur = 0, tabs = root.querySelectorAll('.tabs button'), hl = root.querySelector('.hl');
        function go(i) {
          if (i === cur) return;
          var w = tabs[0].offsetWidth, a = cur * w, b = i * w, old = V[cur]; cur = i;
          tabs.forEach(function (t, j) { t.classList.toggle('on', j === i); });
          hl.animate([{ transform: 'translateX(' + a + 'px)' }, { transform: 'translateX(' + (a + b) / 2 + 'px) scaleX(1.6)' }, { transform: 'translateX(' + b + 'px)' }],
            { duration: 300, easing: 'cubic-bezier(.3,1.3,.5,1)', fill: 'forwards' });
          root.querySelector('.prog i').style.transform = 'scaleX(' + V[i] / 10000 + ')';
          change(old, V[i]);
        }
        tabs.forEach(function (t, i) { t.onclick = function () { go(i); }; });
        return setTimeout(function () { go(1); }, 600);
      })(root, function (a, b) {
        num.querySelectorAll('.old').forEach(function (x) { x.remove(); });
        var cur = num.firstElementChild, old = cur.cloneNode(true), dir = b > a ? -1 : 1;
        old.className = 'old'; num.appendChild(old); cur.textContent = b.toLocaleString('en-US');
        var o = { duration: api.reduce ? 120 : 350, easing: 'ease-out' }, y = api.reduce ? 0 : 60;
        old.animate([{ transform: 'none', filter: 'blur(0)', opacity: 1 }, { transform: 'translateY(' + dir * y + '%)', filter: 'blur(4px)', opacity: 0 }], o).onfinish = function () { old.remove(); };
        cur.animate([{ transform: 'translateY(' + -dir * y + '%)', filter: 'blur(4px)', opacity: 0 }, { transform: 'none', filter: 'blur(0)', opacity: 1 }], o);
      });
      return function () { clearTimeout(t); };
    }
  });

  entry({
    id: 'counter-spring-stagger',
    name: 'Spring Stagger',
    motion: 'Digit berganti satu per satu dari kiri (jeda 60ms): digit lama jatuh keluar ke bawah, digit baru turun dari atas dan memantul ke tempatnya dengan pegas; selama transisi digit berwarna aksen lalu kembali ke warna teks.',
    timing: '400ms per digit · pegas (cubic-bezier .34,1.56,.64,1) · stagger 60ms',
    use: 'Angka ringkasan yang ingin terasa ramah, misalnya poin, skor, atau jumlah langkah.',
    tags: 'spring stagger digits drop bounce counter number',
    css: '& .dg{position:relative;display:inline-block}& .dg i{position:absolute;inset:0;font-style:normal}',
    js: function (root, api) {
      var num = root.querySelector('.num');
      num.innerHTML = '6,482'.split('').map(function (c) { return '<span class="dg"><b>' + c + '</b></span>'; }).join('');
      var dg = num.querySelectorAll('.dg');
      var t = (function wire(root, change) {
        var V = [6482, 9105, 7348, 8917], cur = 0, tabs = root.querySelectorAll('.tabs button'), hl = root.querySelector('.hl');
        function go(i) {
          if (i === cur) return;
          var w = tabs[0].offsetWidth, a = cur * w, b = i * w, old = V[cur]; cur = i;
          tabs.forEach(function (t, j) { t.classList.toggle('on', j === i); });
          hl.animate([{ transform: 'translateX(' + a + 'px)' }, { transform: 'translateX(' + (a + b) / 2 + 'px) scaleX(1.6)' }, { transform: 'translateX(' + b + 'px)' }],
            { duration: 300, easing: 'cubic-bezier(.3,1.3,.5,1)', fill: 'forwards' });
          root.querySelector('.prog i').style.transform = 'scaleX(' + V[i] / 10000 + ')';
          change(old, V[i]);
        }
        tabs.forEach(function (t, i) { t.onclick = function () { go(i); }; });
        return setTimeout(function () { go(1); }, 600);
      })(root, function (a, b) {
        var k = 0;
        b.toLocaleString('en-US').split('').forEach(function (c, i) {
          var cur = dg[i].firstChild; if (cur.textContent === c) return;
          var out = document.createElement('i'); out.textContent = cur.textContent; dg[i].appendChild(out); cur.textContent = c;
          if (api.reduce) { out.remove(); return; }
          var d = k++ * 60;
          out.animate([{ transform: 'none', opacity: 1 }, { transform: 'translateY(.6em)', opacity: 0 }], { duration: 250, delay: d, easing: 'ease-in', fill: 'both' }).onfinish = function () { out.remove(); };
          cur.animate([{ transform: 'translateY(-.8em)', opacity: 0, color: 'var(--d-accent)' }, { transform: 'translateY(0)', opacity: 1, color: 'var(--d-accent)', offset: 0.6 }, { transform: 'none', color: 'var(--d-fg)' }],
            { duration: 400, delay: d, easing: 'cubic-bezier(.34,1.56,.64,1)', fill: 'backwards' });
        });
      });
      return function () { clearTimeout(t); };
    }
  });

  entry({
    id: 'counter-decode-lock',
    name: 'Decode Lock',
    motion: 'Semua digit diacak menjadi angka acak berwarna aksen (berganti tiap 40ms), lalu terkunci ke nilai sebenarnya satu per satu dari kiri ke kanan (mulai 400ms, jeda 80ms); digit yang sudah terkunci kembali ke warna teks.',
    timing: 'acak 40ms/tik · kunci pertama 400ms · stagger 80ms · total ≈650ms',
    use: 'Angka hasil perhitungan/sinkronisasi, misalnya hasil skor risiko atau total tagihan.',
    tags: 'decode scramble random digits lock reveal counter',
    css: '& .dg{display:inline-block;transition:color .15s}& .dg.scr{color:var(--d-accent)}',
    js: function (root, api) {
      var num = root.querySelector('.num'), iv = null;
      num.innerHTML = '6,482'.split('').map(function (c) { return '<span class="dg">' + c + '</span>'; }).join('');
      var dg = [].filter.call(num.querySelectorAll('.dg'), function (d) { return d.textContent !== ','; });
      var t = (function wire(root, change) {
        var V = [6482, 9105, 7348, 8917], cur = 0, tabs = root.querySelectorAll('.tabs button'), hl = root.querySelector('.hl');
        function go(i) {
          if (i === cur) return;
          var w = tabs[0].offsetWidth, a = cur * w, b = i * w, old = V[cur]; cur = i;
          tabs.forEach(function (t, j) { t.classList.toggle('on', j === i); });
          hl.animate([{ transform: 'translateX(' + a + 'px)' }, { transform: 'translateX(' + (a + b) / 2 + 'px) scaleX(1.6)' }, { transform: 'translateX(' + b + 'px)' }],
            { duration: 300, easing: 'cubic-bezier(.3,1.3,.5,1)', fill: 'forwards' });
          root.querySelector('.prog i').style.transform = 'scaleX(' + V[i] / 10000 + ')';
          change(old, V[i]);
        }
        tabs.forEach(function (t, i) { t.onclick = function () { go(i); }; });
        return setTimeout(function () { go(1); }, 600);
      })(root, function (a, b) {
        var real = String(b).split(''), t0 = performance.now();
        clearInterval(iv);
        if (api.reduce) { dg.forEach(function (d, i) { d.textContent = real[i]; }); return; }
        iv = setInterval(function () {
          var el = performance.now() - t0, done = 0;
          dg.forEach(function (d, i) {
            var locked = el > 400 + i * 80;
            d.textContent = locked ? real[i] : Math.floor(Math.random() * 10);
            d.classList.toggle('scr', !locked); done += locked;
          });
          if (done === dg.length) clearInterval(iv);
        }, 40);
      });
      return function () { clearTimeout(t); clearInterval(iv); };
    }
  });

  entry({
    id: 'counter-smooth-count',
    name: 'Smooth Count',
    allowColor: true,
    motion: 'Nilai dihitung naik/turun secara numerik ke total baru (cepat di awal, melambat di akhir). Selama menghitung angka berwarna mint dengan ▲ bila naik, atau merah muda dengan ▼ bila turun, lalu warnanya memudar kembali ke warna teks dan panahnya hilang.',
    timing: 'hitung 700ms easeOutCubic · tahan 500ms · warna pudar 400ms',
    use: 'Nilai yang naik-turun dan arahnya penting, misalnya saldo, tekanan darah rata-rata, atau stok.',
    tags: 'count up tween number increase decrease color arrow counter',
    css: '& .num,& .arw{transition:color .4s}& .arw{transition:color .4s,width .2s}& .up .num,& .up .arw{color:#1fbf8f}& .down .num,& .down .arw{color:#ef4f6a}& .up .arw,& .down .arw{width:10px}',
    js: function (root, api) {
      var num = root.querySelector('.num'), big = root.querySelector('.big'), arw = root.querySelector('.arw'), raf = 0, hold = 0;
      var t = (function wire(root, change) {
        var V = [6482, 9105, 7348, 8917], cur = 0, tabs = root.querySelectorAll('.tabs button'), hl = root.querySelector('.hl');
        function go(i) {
          if (i === cur) return;
          var w = tabs[0].offsetWidth, a = cur * w, b = i * w, old = V[cur]; cur = i;
          tabs.forEach(function (t, j) { t.classList.toggle('on', j === i); });
          hl.animate([{ transform: 'translateX(' + a + 'px)' }, { transform: 'translateX(' + (a + b) / 2 + 'px) scaleX(1.6)' }, { transform: 'translateX(' + b + 'px)' }],
            { duration: 300, easing: 'cubic-bezier(.3,1.3,.5,1)', fill: 'forwards' });
          root.querySelector('.prog i').style.transform = 'scaleX(' + V[i] / 10000 + ')';
          change(old, V[i]);
        }
        tabs.forEach(function (t, i) { t.onclick = function () { go(i); }; });
        return setTimeout(function () { go(1); }, 600);
      })(root, function (a, b) {
        cancelAnimationFrame(raf); clearTimeout(hold);
        big.className = 'big ' + (b > a ? 'up' : 'down'); arw.textContent = b > a ? '▲' : '▼';
        var t0 = performance.now(), D = api.reduce ? 1 : 700;
        (function tick(now) {
          var p = Math.min(1, (now - t0) / D), e = 1 - Math.pow(1 - p, 3);
          num.textContent = Math.round(a + (b - a) * e).toLocaleString('en-US');
          if (p < 1) raf = requestAnimationFrame(tick);
          else hold = setTimeout(function () { big.className = 'big'; }, 500);
        })(t0);
      });
      return function () { clearTimeout(t); cancelAnimationFrame(raf); clearTimeout(hold); };
    }
  });
})();
