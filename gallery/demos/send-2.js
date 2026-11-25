/* Send · Part 2 — mailbox flag, swipe up send, photo upload, dissolve up, genie outbox, undo send. */
(function () {
  var src = 'Send · Part 2';
  var cat = 'Feedback & Notifikasi';
  var comp = '& .cp{display:flex;align-items:center;gap:8px;width:220px;height:34px;padding:0 4px 0 12px;border-radius:99px;background:var(--d-soft);font-size:10.5px;color:var(--d-fg);box-sizing:border-box}' +
    '& .cp .tx{flex:1;white-space:nowrap;overflow:hidden}& .ph{color:var(--d-mid)}' +
    '& .snd{flex:none;width:26px;height:26px;border-radius:50%;border:0;background:var(--d-accent);color:var(--d-bg);font-weight:700;cursor:pointer}';

  LUZ.add({
    id: 'send-mailbox-flag', cat: cat, name: 'Mailbox Flag', source: src, trigger: 'tap', allowColor: true,
    motion: 'Ketuk amplop: amplop miring dan melayang di busur menuju celah kotak surat (naik 20px lalu turun), mengecil ke 0.3 dan hilang di celah. Kotak surat memantul kecil (scaleY 0.94), lalu bendera merah muda berputar naik −90° dengan overshoot dan dua kilau bintang muncul. Setelah 1.2 detik semuanya kembali.',
    timing: 'amplop ≈420ms ease-in · pantul 200ms · bendera ≈360ms cubic-bezier(.34,1.8,.64,1) · kilau 400ms',
    use: 'konfirmasi pesan/rujukan terkirim yang ingin terasa menyenangkan',
    tags: 'send mailbox flag envelope success delight confirm',
    html: '<div class="mb"><button type="button" class="env" aria-label="Send letter"><i></i></button><div class="box"><span class="slot"></span><i class="flag"></i><i class="sp s1">✦</i><i class="sp s2">✦</i></div><i class="post"></i></div>',
    css: '& .mb{position:relative;width:200px;height:150px}' +
      '& .env{position:absolute;left:8px;top:48px;width:44px;height:30px;border:0;border-radius:4px;background:#f1eff8;cursor:pointer;padding:0}' +
      '& .env i{position:absolute;left:50%;top:50%;width:10px;height:10px;margin:-5px;border-radius:50%;background:#ff6b9a}' +
      '& .env::before{content:"";position:absolute;inset:0;background:linear-gradient(160deg,transparent 48%,rgba(0,0,0,.12) 50%,transparent 52%),linear-gradient(20deg,transparent 48%,rgba(0,0,0,.12) 50%,transparent 52%)}' +
      '& .box{position:absolute;left:96px;top:30px;width:72px;height:62px;border-radius:36px 36px 6px 6px;background:linear-gradient(#7d6bff,#5b4be0);transform-origin:bottom}' +
      '& .slot{position:absolute;left:16px;right:16px;top:28px;height:5px;border-radius:3px;background:#2a1f6a}' +
      '& .flag{position:absolute;right:-22px;top:30px;width:24px;height:3px;background:#ff6b9a;transform-origin:0 50%}& .flag::after{content:"";position:absolute;right:0;top:0;width:8px;height:12px;background:#ff6b9a;border-radius:2px}' +
      '& .sp{position:absolute;right:-30px;top:-2px;color:#ffd24a;font-style:normal;font-size:11px;opacity:0}& .s2{right:-40px;top:14px;font-size:8px}' +
      '& .post{position:absolute;left:128px;top:92px;width:8px;height:50px;background:var(--d-mid)}',
    js: function (root, api) {
      var env = root.querySelector('.env'), box = root.querySelector('.box'), flag = root.querySelector('.flag'), sps = root.querySelectorAll('.sp'), busy = false, t = [], k = api.reduce ? 0.01 : 1;
      function send() {
        if (busy) return; busy = true;
        env.animate([{ transform: 'none', opacity: 1 }, { transform: 'translate(50px,-28px) rotate(-14deg)', opacity: 1, offset: .5 }, { transform: 'translate(108px,-12px) rotate(-4deg) scale(.3)', opacity: 0 }], { duration: 420 * k, easing: 'ease-in', fill: 'forwards' });
        t.push(setTimeout(function () {
          box.animate([{ transform: 'none' }, { transform: 'scaleY(.94)' }, { transform: 'none' }], { duration: 200 * k });
          flag.animate([{ transform: 'none' }, { transform: 'rotate(-90deg)' }], { duration: 360 * k, easing: 'cubic-bezier(.34,1.8,.64,1)', fill: 'forwards' });
          sps.forEach(function (s, i) { s.animate([{ opacity: 0, transform: 'scale(.3)' }, { opacity: 1, transform: 'scale(1.2)' }, { opacity: 0, transform: 'scale(.8)' }], { duration: 400 * k, delay: (120 + i * 80) * k }); });
        }, 400 * k), setTimeout(function () {
          flag.getAnimations().forEach(function (a) { a.reverse(); });
          env.getAnimations().forEach(function (a) { a.cancel(); });
          env.animate([{ opacity: 0, transform: 'scale(.8)' }, { opacity: 1, transform: 'none' }], { duration: 250 * k });
          busy = false;
        }, 1600 * k));
      }
      env.onclick = send;
      t.push(setTimeout(send, 600));
      return function () { t.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'send-swipe-up-send', cat: cat, name: 'Swipe Up Send', source: src, trigger: 'drag', allowColor: true,
    motion: 'Kartu pos bisa diseret ke atas (ikut jari, dengan hambatan saat ditarik ke bawah). Lepas lewat 50px: kartu melesat ke atas keluar bingkai sambil mengecil ke 0.8, meninggalkan jejak titik yang memudar, lalu pill "✓ Sent" pop di tengah (scale 0.6 → 1.08 → 1). Kurang dari 50px: kartu memantul kembali.',
    timing: 'ikut jari · lempar ≈280ms cubic-bezier(.5,0,.9,.4) · pill 320ms spring · reset setelah 1.4 detik',
    use: 'kirim kartu ucapan, laporan, atau persetujuan dengan gestur yang disengaja',
    tags: 'send swipe up gesture fling throw sent confirm drag',
    html: '<div class="su"><div class="pc"><i class="pic"></i><div><small>Wish you<br>were here!</small><i class="stp"></i></div></div><i class="dt d1"></i><i class="dt d2"></i><i class="dt d3"></i><span class="ok">✓ Sent</span><small class="hint">↑ Swipe up to send</small></div>',
    css: '& .su{position:relative;width:236px;height:200px;overflow:hidden}' +
      '& .pc{position:absolute;left:58px;top:56px;width:120px;height:76px;display:flex;gap:6px;padding:6px;box-sizing:border-box;border-radius:8px;background:#f6f4fb;box-shadow:0 8px 20px rgba(0,0,0,.25);cursor:grab;touch-action:none}' +
      '& .pic{flex:none;width:56px;border-radius:4px;background:radial-gradient(circle at 30% 30%,#fff 0 6%,transparent 7%),linear-gradient(#1b2f7a,#2f6fe0)}' +
      '& .pc small{font:italic 8px/1.3 Georgia,serif;color:#333}& .stp{display:block;width:10px;height:12px;margin:-28px 0 0 34px;background:#ff6b9a;border-radius:1px}' +
      '& .dt{position:absolute;left:118px;top:150px;width:4px;height:4px;border-radius:50%;background:var(--d-mid);opacity:0}& .d2{left:108px;top:162px}& .d3{left:126px;top:172px}' +
      '& .ok{position:absolute;left:68px;top:84px;width:100px;height:28px;border-radius:99px;background:linear-gradient(90deg,#3f8cff,#6f5cff);color:#fff;font-size:11px;font-weight:600;display:grid;place-items:center;opacity:0}' +
      '& .hint{position:absolute;left:0;right:0;bottom:14px;text-align:center;color:var(--d-mid);font-size:9px}',
    js: function (root, api) {
      var pc = root.querySelector('.pc'), ok = root.querySelector('.ok'), dots = root.querySelectorAll('.dt'), y0 = null, dy = 0, t = [], k = api.reduce ? 0.01 : 1;
      function fly() {
        pc.animate([{ transform: 'translateY(' + dy + 'px)' }, { transform: 'translateY(-220px) scale(.8)', opacity: 0 }], { duration: 280 * k, easing: 'cubic-bezier(.5,0,.9,.4)', fill: 'forwards' });
        dots.forEach(function (d, i) { d.animate([{ opacity: 0, transform: 'none' }, { opacity: 1 }, { opacity: 0, transform: 'translateY(-30px)' }], { duration: 500 * k, delay: i * 60 * k }); });
        ok.animate([{ opacity: 0, transform: 'scale(.6)' }, { opacity: 1, transform: 'scale(1.08)', offset: .6 }, { opacity: 1, transform: 'none' }], { duration: 320 * k, delay: 220 * k, fill: 'forwards', easing: 'ease-out' });
        t.push(setTimeout(function () {
          ok.getAnimations().forEach(function (a) { a.cancel(); }); pc.getAnimations().forEach(function (a) { a.cancel(); }); pc.style.transform = '';
          pc.animate([{ opacity: 0, transform: 'translateY(20px)' }, { opacity: 1, transform: 'none' }], { duration: 300 * k, easing: 'ease-out' });
        }, 1400 * k));
      }
      pc.addEventListener('pointerdown', function (e) { y0 = e.clientY; pc.setPointerCapture(e.pointerId); });
      pc.addEventListener('pointermove', function (e) { if (y0 === null) return; dy = e.clientY - y0; if (dy > 0) dy *= 0.3; pc.style.transform = 'translateY(' + dy + 'px)'; });
      pc.addEventListener('pointerup', function () {
        if (y0 === null) return; y0 = null;
        if (dy < -50 || Math.abs(dy) < 4) { if (Math.abs(dy) < 4) dy = 0; fly(); }
        else pc.animate([{ transform: 'translateY(' + dy + 'px)' }, { transform: 'none' }], { duration: 300 * k, easing: 'cubic-bezier(.34,1.56,.64,1)' });
        pc.style.transform = ''; dy = 0;
      });
      t.push(setTimeout(function () {
        dy = 0; pc.animate([{ transform: 'none' }, { transform: 'translateY(-36px)' }], { duration: 300 * k, easing: 'ease-out' }).onfinish = function () { dy = -36; fly(); dy = 0; };
      }, 600));
      return function () { t.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'send-photo-upload', cat: cat, name: 'Photo Upload', source: src, trigger: 'tap', allowColor: true,
    motion: 'Ketuk kirim: thumbnail di composer melompat di busur ke area chat dan membesar jadi gambar pesan (scale 0.35 → 1). Gambar meredup dan cincin progres melingkar di tengahnya menghitung 0% → 100%, lalu berubah jadi lencana ✓ hijau yang pop (scale 0.5 → 1.15 → 1), kemudian gambar kembali terang.',
    timing: 'lompat ≈380ms cubic-bezier(.34,1.3,.64,1) · progres 1200ms ease-in-out · ✓ pop 260ms',
    use: 'unggah foto (mis. foto luka, hasil lab) dengan status progres yang jelas',
    tags: 'send photo upload progress ring percent image chat',
    html: '<div class="pu"><div class="msg"><i class="ov"></i><svg class="rg" viewBox="0 0 36 36" width="40" height="40"><circle cx="18" cy="18" r="15"/><circle class="arc" cx="18" cy="18" r="15" pathLength="100"/></svg><b class="pct">0%</b><i class="ck">✓</i></div>' +
      '<div class="cp"><i class="th"></i><span class="tx ph">Add a caption…</span><button type="button" class="snd">↑</button></div></div>',
    css: comp + '& .pu{position:relative;width:220px;height:200px;display:grid;align-content:end}' +
      '& .msg,& .th{background:radial-gradient(circle at 35% 58%,#ff6b9a 0 8%,transparent 9%),radial-gradient(circle at 66% 40%,#ffd24a 0 10%,transparent 11%),linear-gradient(#17493a,#1f7a55)}' +
      '& .th{flex:none;width:22px;height:22px;border-radius:5px;margin-left:-6px}' +
      '& .msg{position:absolute;right:6px;top:14px;width:96px;height:96px;border-radius:14px;overflow:hidden;opacity:0;display:grid;place-items:center}' +
      '& .ov{position:absolute;inset:0;background:rgba(0,0,0,.45)}& .rg{position:absolute;transform:rotate(-90deg)}& .rg circle{fill:none;stroke:rgba(255,255,255,.3);stroke-width:3}& .rg .arc{stroke:#fff;stroke-dasharray:100;stroke-dashoffset:100;stroke-linecap:round}' +
      '& .pct{position:relative;color:#fff;font-size:9px}& .ck{position:absolute;width:30px;height:30px;border-radius:50%;background:#2fbf8f;color:#fff;display:grid;place-items:center;font-style:normal;font-weight:700;opacity:0}',
    js: function (root, api) {
      var msg = root.querySelector('.msg'), th = root.querySelector('.th'), ov = root.querySelector('.ov'), arc = root.querySelector('.arc'), pct = root.querySelector('.pct'), ck = root.querySelector('.ck'), rg = root.querySelector('.rg');
      var busy = false, raf, t = [], k = api.reduce ? 0.01 : 1;
      function send() {
        if (busy) return; busy = true;
        [ov, rg, pct].forEach(function (e) { e.style.opacity = 1; }); ck.style.opacity = 0; th.style.opacity = 0;
        msg.animate([{ opacity: 1, transform: 'translate(-118px,96px) scale(.35)' }, { opacity: 1, transform: 'translate(-50px,-20px) scale(.7)', offset: .5 }, { opacity: 1, transform: 'none' }], { duration: 380 * k, easing: 'cubic-bezier(.34,1.3,.64,1)', fill: 'forwards' });
        var t0 = performance.now() + 380 * k, D = 1200 * k;
        (function f(now) {
          var p = Math.max(0, Math.min(1, (now - t0) / D)), e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
          arc.style.strokeDashoffset = 100 - 100 * e; pct.textContent = Math.round(100 * e) + '%';
          if (p < 1) { raf = requestAnimationFrame(f); return; }
          [rg, pct].forEach(function (e) { e.style.opacity = 0; });
          ck.animate([{ opacity: 0, transform: 'scale(.5)' }, { opacity: 1, transform: 'scale(1.15)' }, { opacity: 1, transform: 'none' }], { duration: 260 * k, fill: 'forwards' });
          ov.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300 * k, delay: 500 * k, fill: 'forwards' });
          ck.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300 * k, delay: 800 * k, fill: 'forwards', composite: 'replace' });
          t.push(setTimeout(function () {
            msg.getAnimations().forEach(function (a) { a.cancel(); }); ov.getAnimations().forEach(function (a) { a.cancel(); }); ck.getAnimations().forEach(function (a) { a.cancel(); });
            th.style.opacity = 1; busy = false;
          }, 1800 * k));
        })(performance.now());
      }
      root.querySelector('.snd').onclick = send;
      t.push(setTimeout(send, 600));
      return function () { t.forEach(clearTimeout); cancelAnimationFrame(raf); };
    }
  });

  LUZ.add({
    id: 'send-dissolve-up', cat: cat, name: 'Dissolve Up', source: src, trigger: 'tap', allowColor: true,
    motion: 'Ketuk kirim: teks "Good night!" pecah menjadi ±24 titik kecil mulai dari huruf kiri; titik-titik mengalir diagonal ke kanan atas (stagger 15ms) menuju posisi pesan. Di sana gelembung biru melebar (scaleX 0.2 → 1) dan teks terbentuk kembali di dalamnya; input kembali ke placeholder.',
    timing: 'partikel ≈500ms cubic-bezier(.4,0,.2,1) stagger 15ms · gelembung 300ms spring · total ≈850ms',
    use: 'kirim pesan chat dengan efek khas (mis. pesan ucapan, bukan chat klinis rutin)',
    tags: 'send dissolve particles text disintegrate bubble chat message',
    html: '<div class="du"><span class="bub">Good night!</span><div class="cp"><span class="tx">Good night!</span><button type="button" class="snd">↑</button></div></div>',
    css: comp + '& .du{position:relative;width:220px;height:190px;display:grid;align-content:end}' +
      '& .bub{position:absolute;right:4px;top:30px;padding:7px 12px;border-radius:14px 14px 4px 14px;background:linear-gradient(90deg,#3f8cff,#6f5cff);color:#fff;font-size:10.5px;transform-origin:right;opacity:0}' +
      '& .pt{position:absolute;width:3px;height:3px;border-radius:50%;background:var(--d-accent);pointer-events:none}',
    js: function (root, api) {
      var du = root.querySelector('.du'), tx = root.querySelector('.tx'), bub = root.querySelector('.bub'), busy = false, t = [], k = api.reduce ? 0.01 : 1;
      function send() {
        if (busy) return; busy = true;
        var r0 = du.getBoundingClientRect(), r = tx.getBoundingClientRect(), b = bub.getBoundingClientRect(), w = Math.min(r.width, 60);
        tx.animate([{ clipPath: 'inset(0 0 0 0)' }, { clipPath: 'inset(0 0 0 100%)' }], { duration: 360 * k, fill: 'forwards' });
        for (var i = 0; i < 24; i++) {
          var p = document.createElement('i'); p.className = 'pt'; du.appendChild(p);
          var x = r.left - r0.left + (i / 24) * w, y = r.top - r0.top + 4 + Math.random() * 8;
          var tx2 = b.left - r0.left + Math.random() * b.width, ty2 = b.top - r0.top + Math.random() * b.height;
          p.style.left = x + 'px'; p.style.top = y + 'px';
          p.animate([{ transform: 'none', opacity: 1 }, { transform: 'translate(' + ((tx2 - x) * .5 + 10) + 'px,' + (ty2 - y) * .6 + 'px)', opacity: 1, offset: .6 }, { transform: 'translate(' + (tx2 - x) + 'px,' + (ty2 - y) + 'px) scale(.5)', opacity: 0 }],
            { duration: 500 * k, delay: i * 15 * k, easing: 'cubic-bezier(.4,0,.2,1)' }).onfinish = function () { this.effect.target.remove(); };
        }
        bub.animate([{ opacity: 0, transform: 'scaleX(.2)' }, { opacity: 1, transform: 'scaleX(1.04)' }, { opacity: 1, transform: 'none' }], { duration: 300 * k, delay: 520 * k, fill: 'forwards', easing: 'ease-out' });
        t.push(setTimeout(function () { tx.textContent = 'Message'; tx.classList.add('ph'); tx.getAnimations().forEach(function (a) { a.cancel(); }); }, 380 * k),
          setTimeout(function () { bub.getAnimations().forEach(function (a) { a.cancel(); }); tx.textContent = 'Good night!'; tx.classList.remove('ph'); busy = false; }, 2000 * k));
      }
      root.querySelector('.snd').onclick = send;
      t.push(setTimeout(send, 600));
      return function () { t.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'send-genie-outbox', cat: cat, name: 'Genie Outbox', source: src, trigger: 'tap', allowColor: true,
    motion: 'Ketuk Send: kartu draf tersedot ke ikon outbox di kanan bawah seperti efek genie macOS: bagian bawah menyempit lebih dulu (clip-path trapesium), kartu mengecil ke 0.1 dan meluncur ke tray sambil blur. Tray memantul turun 3px dan lencana merah muda "1" pop.',
    timing: 'genie ≈450ms cubic-bezier(.55,0,.75,.3) (ease-in) · tray bump 200ms · lencana 280ms spring',
    use: 'kirim email/surat rujukan ke kotak keluar, memberi kesan "masuk antrean kirim"',
    tags: 'send genie outbox suck minimize email draft badge',
    html: '<div class="go"><div class="dr"><small>To: Sam</small><small>Subject: Weekend plans</small><i></i><i></i><i class="s"></i><button type="button" class="sb">Send</button></div><div class="tray"><svg viewBox="0 0 24 20" width="30" height="26"><path d="M2 11l4-9h12l4 9v7H2z M2 11h6l2 3h4l2-3h6"/></svg><b class="bd">1</b></div></div>',
    css: '& .go{position:relative;width:230px;height:190px}' +
      '& .dr{position:absolute;left:8px;top:14px;width:150px;padding:10px;box-sizing:border-box;border-radius:10px;background:var(--d-bg);box-shadow:0 0 0 1px var(--d-soft),0 8px 20px rgba(0,0,0,.15);display:grid;gap:4px;transform-origin:100% 100%}' +
      '& .dr small{font-size:8.5px;color:var(--d-mid)}& .dr i{height:4px;border-radius:2px;background:var(--d-soft)}& .dr i.s{width:60%}' +
      '& .sb{justify-self:end;border:0;border-radius:99px;padding:6px 14px;background:linear-gradient(90deg,#3f8cff,#6f5cff);color:#fff;font:600 9.5px inherit;cursor:pointer;margin-top:4px}' +
      '& .tray{position:absolute;right:10px;bottom:16px}& .tray svg{fill:none;stroke:var(--d-fg);stroke-width:1.6;stroke-linejoin:round}' +
      '& .bd{position:absolute;right:-6px;top:-6px;width:15px;height:15px;border-radius:50%;background:#ff4f8a;color:#fff;font-size:8.5px;display:grid;place-items:center;opacity:0}',
    js: function (root, api) {
      var dr = root.querySelector('.dr'), tray = root.querySelector('.tray'), bd = root.querySelector('.bd'), busy = false, t = [], k = api.reduce ? 0.01 : 1;
      function send() {
        if (busy) return; busy = true;
        dr.animate([
          { transform: 'none', clipPath: 'polygon(0 0,100% 0,100% 100%,0 100%)', filter: 'blur(0)', opacity: 1 },
          { transform: 'translate(20px,20px) scale(.75,.85)', clipPath: 'polygon(0 0,100% 0,100% 100%,62% 100%)', filter: 'blur(.5px)', opacity: 1, offset: .4 },
          { transform: 'translate(66px,118px) scale(.1)', clipPath: 'polygon(40% 0,100% 0,100% 100%,95% 100%)', filter: 'blur(2px)', opacity: 0 }
        ], { duration: 450 * k, easing: 'cubic-bezier(.55,0,.75,.3)', fill: 'forwards' });
        t.push(setTimeout(function () {
          tray.animate([{ transform: 'none' }, { transform: 'translateY(3px)' }, { transform: 'none' }], { duration: 200 * k });
          bd.animate([{ opacity: 0, transform: 'scale(.3)' }, { opacity: 1, transform: 'scale(1.25)' }, { opacity: 1, transform: 'none' }], { duration: 280 * k, fill: 'forwards' });
        }, 420 * k), setTimeout(function () {
          bd.getAnimations().forEach(function (a) { a.cancel(); }); dr.getAnimations().forEach(function (a) { a.cancel(); });
          dr.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250 * k }); busy = false;
        }, 1900 * k));
      }
      root.querySelector('.sb').onclick = send;
      t.push(setTimeout(send, 600));
      return function () { t.forEach(clearTimeout); };
    }
  });

  LUZ.add({
    id: 'send-undo-send', cat: cat, name: 'Undo Send', source: src, trigger: 'tap', allowColor: true,
    motion: 'Ketuk kirim: teks naik dari input menjadi gelembung biru di kanan, dan toast "Sending… | Undo" muncul di atas dengan garis progres yang menyusut linear selama 2.5 detik. Ketuk Undo: toast berubah "Unsent", gelembung turun kembali ke input sambil mengecil dan memudar, lalu teks muncul lagi di input. Jika tidak di-undo, toast hilang dan pesan tetap.',
    timing: 'gelembung naik ≈320ms cubic-bezier(.2,.8,.2,1) · jendela undo 2500ms linear · turun kembali ≈300ms ease-in',
    use: 'pesan/instruksi yang masih bisa dibatalkan sesaat setelah dikirim (mis. kirim resep)',
    tags: 'send undo toast unsend cancel grace period bubble chat',
    html: '<div class="us"><div class="ts"><span class="tl">Sending…</span><button type="button" class="ub">Undo</button><i class="pg"></i></div><span class="bub">Running late, sorry</span>' +
      '<div class="cp"><span class="tx">Running late, sorry</span><button type="button" class="snd">↑</button></div></div>',
    css: comp + '& .us{position:relative;width:220px;height:190px;display:grid;align-content:end}' +
      '& .ts{position:absolute;left:24px;right:24px;top:8px;height:28px;display:flex;align-items:center;justify-content:space-between;padding:0 4px 0 12px;border-radius:99px;background:var(--d-soft);font-size:9.5px;overflow:hidden;opacity:0;pointer-events:none}' +
      '& .ts.on{opacity:1;pointer-events:auto;transition:opacity .2s}& .ub{border:0;background:none;color:var(--d-accent);font:600 9.5px inherit;cursor:pointer;padding:6px 10px}' +
      '& .pg{position:absolute;left:12px;right:60px;bottom:4px;height:2px;border-radius:1px;background:var(--d-accent);transform-origin:left}' +
      '& .bub{position:absolute;right:4px;top:72px;padding:7px 12px;border-radius:14px 14px 4px 14px;background:linear-gradient(90deg,#6f5cff,#3f8cff);color:#fff;font-size:10.5px;opacity:0}',
    js: function (root, api) {
      var ts = root.querySelector('.ts'), tl = root.querySelector('.tl'), pg = root.querySelector('.pg'), bub = root.querySelector('.bub'), tx = root.querySelector('.tx'), win = null, t = [], k = api.reduce ? 0.01 : 1;
      function send() {
        if (win || tx.classList.contains('ph')) return;
        tx.textContent = 'Message'; tx.classList.add('ph');
        bub.animate([{ opacity: 0, transform: 'translate(-60px,96px) scale(.8)' }, { opacity: 1, transform: 'none' }], { duration: 320 * k, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' });
        tl.textContent = 'Sending…'; ts.classList.add('on');
        win = pg.animate([{ transform: 'scaleX(1)' }, { transform: 'scaleX(0)' }], { duration: 2500, easing: 'linear', fill: 'forwards' });
        win.onfinish = function () { win = null; ts.classList.remove('on'); t.push(setTimeout(reset, 1200)); };
      }
      function undo() {
        if (!win) return; win.onfinish = null; win.pause(); win = null; tl.textContent = 'Unsent';
        bub.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translate(-60px,96px) scale(.8)' }], { duration: 300 * k, easing: 'ease-in', fill: 'forwards' });
        t.push(setTimeout(function () { tx.textContent = 'Running late, sorry'; tx.classList.remove('ph'); tx.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150 * k }); }, 300 * k),
          setTimeout(function () { ts.classList.remove('on'); }, 1000 * k));
      }
      function reset() { bub.getAnimations().forEach(function (a) { a.cancel(); }); tx.textContent = 'Running late, sorry'; tx.classList.remove('ph'); }
      root.querySelector('.snd').onclick = send;
      root.querySelector('.ub').onclick = undo;
      t.push(setTimeout(send, 600), setTimeout(undo, 1700));
      return function () { t.forEach(clearTimeout); if (win) win.onfinish = null; };
    }
  });
})();
