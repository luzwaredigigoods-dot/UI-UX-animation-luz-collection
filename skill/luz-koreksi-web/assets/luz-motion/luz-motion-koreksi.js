/* Luz Motion × luz-koreksi-web
   Animation recommendations for a captured page object + an approximate live preview
   played on the real element. No dependencies. Needs luz-motion-data.js loaded first
   (window.LUZ_MOTION_DATA). Exposes window.LuzMotionKoreksi.

   The preview is an approximation by "family" (press, pop, slide, stagger, ...), because a
   real page element is not the mini-UI from the gallery. The exact version is in the gallery. */
(function () {
  'use strict';
  var DATA = window.LUZ_MOTION_DATA || [];
  var BY_ID = {};
  DATA.forEach(function (d) { BY_ID[d.id] = d; });
  var ALIAS = window.LUZ_MOTION_ALIAS || {};
  function asli(id) { return BY_ID[id] ? id : (ALIAS[id] && BY_ID[ALIAS[id]] ? ALIAS[id] : null); }
  var GALERI = 'https://claude.ai/artifact/EjJai6hXs5Pjr35QcJgjYU';

  /* ---------- 1. What kind of object is this? ---------- */
  var JENIS = [
    // [kind, label, test(el) -> Element|null]  — first match wins, tested on el and its ancestors
    ['toggle', 'Checkbox / saklar', function (e) { return e.closest('input[type=checkbox],input[type=radio],[role=switch],[role=checkbox],[role=radio]'); }],
    ['isian', 'Kotak isian', function (e) { return e.closest('input:not([type=checkbox]):not([type=radio]):not([type=button]):not([type=submit]),textarea,select,[contenteditable=""],[contenteditable=true],label'); }],
    ['tab', 'Tab / segmen', function (e) { return e.closest('[role=tab],[role=tablist],[aria-current=page]'); }],
    ['ikon', 'Tombol ikon', function (e) { var b = e.closest('button,[role=button]'); return b && !b.textContent.trim() && b.querySelector('svg,img,i') ? b : null; }],
    ['badge', 'Badge / jumlah', function (e) { return e.closest('.badge,[class*=badge],[data-badge]'); }],
    ['tombol', 'Tombol', function (e) { return e.closest('button,[role=button],input[type=button],input[type=submit],a.btn,a[class*=button],a[class*=btn]'); }],
    ['notifikasi', 'Notifikasi / toast', function (e) { return e.closest('[role=status],[role=alert],.toast,[class*=toast],[class*=snackbar],[class*=alert]'); }],
    ['dialog', 'Dialog / sheet', function (e) { return e.closest('dialog,[role=dialog],[role=alertdialog],.modal,[class*=modal],[class*=sheet],[class*=drawer]'); }],
    ['menu', 'Menu / navigasi', function (e) { return e.closest('nav,[role=menu],[role=menubar],[role=navigation],[class*=menu],[class*=dropdown]'); }],
    ['progress', 'Progress', function (e) { return e.closest('progress,[role=progressbar],meter,[class*=progress]'); }],
    ['daftar', 'Daftar / baris', function (e) { return e.closest('li,tr,[role=listitem],[role=row],[role=option]'); }],
    ['angka', 'Angka', function (e) { var t = (e.textContent || '').trim(); return t && t.length < 24 && /\d/.test(t) && /^[\s\d.,:%+\-–$€Rp/]+[a-zA-Z%]{0,6}$/.test(t) ? e : null; }],
    ['judul', 'Judul / teks', function (e) { return e.closest('h1,h2,h3,h4,h5,h6,p,blockquote,[class*=title],[class*=heading]'); }],
    ['kartu', 'Kartu / gambar', function (e) { return e.closest('article,figure,img,picture,video,[class*=card],[class*=tile]'); }],
    ['halaman', 'Bagian halaman', function (e) { return e.closest('main,section,header,footer,aside') || e; }]
  ];

  // Calm picks first (fit for work/clinical apps), expressive later.
  var PILIHAN = {
    toggle: ['switch-ghost-trail', 'checkbox-pop-burst', 'checkbox-flip-tick', 'checkbox-tri-state', 'switch-tilt-roll', 'switch-confetti-pop'],
    isian: ['field-floating-label', 'field-underline-grow', 'inerr-message-drop', 'inerr-red-echo', 'field-live-validation', 'field3-corner-lock'],
    tab: ['tabbar18-sliding-pill', 'segment-outline-glide', 'tabbar18-expanding-label', 'pagination-elastic-glide', 'segment-pressed-keys'],
    ikon: ['iconmorph1-spin-swap', 'iconmorph1-stroke-morph', 'menu-hamburger-morph', 'iconmorph1-tumble-flip', 'button5-spring-pop'],
    badge: ['badge-spring-scale', 'badge-slot-roll', 'badge-sonar-ring', 'badge-stretch-slide', 'badge-coin-flip'],
    tombol: ['button5-spring-pop', 'button5-soft-inset', 'stepper-soft-press', 'copy-pill-stretch', 'button5-pogo-bounce', 'button5-haptic-buzz'],
    notifikasi: ['toast-depth-focus', 'toast-circle-reveal', 'toast-button-morph', 'toast-outline-draw', 'toast-blinds', 'send-undo-send'],
    dialog: ['dialog-scale-pop', 'dialog-soft-focus', 'sheet-backdrop-blur', 'dialog-spring-drop', 'menu-bottom-sheet', 'dialog-line-unfold'],
    menu: ['menu-staggered-dropdown', 'menu5-zipper-rows', 'menu-side-drawer', 'menu-circle-reveal', 'menu2-fold-down', 'menu-hamburger-morph'],
    progress: ['progress-spring-overshoot', 'progress-candy-stripes', 'progress-liquid-wave', 'checkbox-progress-ring', 'progress-comet-glow'],
    daftar: ['accordion-expand-all', 'swipe-inline-undo', 'swipe-peek-hint', 'swipedel-genie-bin', 'pullrefresh-top-line', 'checkbox-drag-select'],
    angka: ['counter-smooth-count', 'counter-odometer-roll', 'counter-split-flap', 'counter-blur-slide', 'counter-spring-stagger'],
    judul: ['text-letter-cascade', 'skeleton-blur-focus', 'text-punch-zoom', 'text-outline-fill', 'skeleton-type-reveal'],
    kartu: ['skeleton-blur-focus', 'carousel1-snap-peek', 'skeleton-flip-tiles', 'carousel2-stack-slide', 'carousel1-pill-dots', 'screen-blur-dissolve'],
    halaman: ['screen-blur-dissolve', 'screen-swipe-back', 'screen-depth-stack', 'skeleton-blur-focus', 'bg-mesh-gradient']
  };
  var KATEGORI = {
    toggle: 'Tombol & Toggle', isian: 'Input & Form', tab: 'Menu & Navigasi', ikon: 'Tombol & Toggle', badge: 'Feedback & Notifikasi',
    tombol: 'Tombol & Toggle', notifikasi: 'Feedback & Notifikasi', dialog: 'Modal, Sheet & Tooltip', menu: 'Menu & Navigasi',
    progress: 'Loading & Skeleton', daftar: 'List & Gesture', angka: 'Teks & Angka', judul: 'Teks & Angka', kartu: 'Kartu & Konten',
    halaman: 'Transisi Halaman'
  };

  function jenisObjek(el) {
    for (var i = 0; i < JENIS.length; i++) {
      var hit = null;
      try { hit = JENIS[i][2](el); } catch (x) {}
      if (hit) return { jenis: JENIS[i][0], label: JENIS[i][1], el: hit };
    }
    return { jenis: 'halaman', label: 'Bagian halaman', el: el };
  }

  function rekomendasi(el, n) {
    n = n || 6;
    var j = jenisObjek(el);
    var ids = [];
    (PILIHAN[j.jenis] || []).forEach(function (id) { var a = asli(id); if (a && ids.indexOf(a) < 0) ids.push(a); });
    DATA.forEach(function (d) { if (ids.length < n && d.c === KATEGORI[j.jenis] && ids.indexOf(d.id) < 0) ids.push(d.id); });
    return { jenis: j.jenis, label: j.label, target: j.el, daftar: ids.slice(0, n).map(function (id) { return BY_ID[id]; }) };
  }

  function cari(q, n) {
    q = (q || '').toLowerCase().trim();
    if (!q) return [];
    return DATA.filter(function (d) { return (d.id + ' ' + d.n + ' ' + d.c + ' ' + d.u).toLowerCase().indexOf(q) >= 0; }).slice(0, n || 12);
  }

  /* ---------- 2. Preview on the real element ---------- */
  var SPRING = 'cubic-bezier(.34,1.56,.64,1)';
  var OUT = 'cubic-bezier(.2,.8,.2,1)';
  function kf(frames, ms, ease, origin) {
    return { frames: frames.map(function (f) { if (origin) f.transformOrigin = origin; return f; }), opt: { duration: ms, easing: ease || OUT } };
  }
  var KELUARGA = {
    tekan: function () { return kf([{ transform: 'scale(1)' }, { transform: 'scale(.9)', offset: .3 }, { transform: 'scale(1.06)', offset: .65 }, { transform: 'scale(1)' }], 420, 'ease-out'); },
    muncul: function () { return kf([{ opacity: 0, transform: 'scale(.72)' }, { opacity: 1, transform: 'scale(1.03)', offset: .7 }, { opacity: 1, transform: 'scale(1)' }], 320, OUT); },
    jatuh: function () { return kf([{ opacity: 0, transform: 'translateY(-28px) scale(1,1.08)' }, { opacity: 1, transform: 'translateY(0) scale(1.08,.88)', offset: .6 }, { transform: 'translateY(-3px) scale(.98,1.02)', offset: .8 }, { opacity: 1, transform: 'none' }], 480, 'ease-in'); },
    kabur: function () { return kf([{ opacity: 0, filter: 'blur(12px)', transform: 'scale(1.05)' }, { opacity: 1, filter: 'blur(0)', transform: 'scale(1)' }], 320, OUT); },
    geser: function () { return kf([{ opacity: 0, transform: 'translateX(32px)' }, { opacity: 1, transform: 'none' }], 340, OUT); },
    engsel: function () { return kf([{ opacity: 0, transform: 'perspective(600px) rotateX(-90deg)' }, { opacity: 1, transform: 'perspective(600px) rotateX(8deg)', offset: .7 }, { opacity: 1, transform: 'perspective(600px) rotateX(0)' }], 400, OUT, 'top center'); },
    balik: function () { return kf([{ transform: 'perspective(600px) rotateY(0)' }, { transform: 'perspective(600px) rotateY(90deg)', offset: .5 }, { transform: 'perspective(600px) rotateY(0)' }], 420, 'ease-in-out'); },
    goyang: function () { return kf([{ transform: 'rotate(0)' }, { transform: 'rotate(3deg)' }, { transform: 'rotate(-2.5deg)' }, { transform: 'rotate(1.5deg)' }, { transform: 'rotate(-.5deg)' }, { transform: 'rotate(0)' }], 600, 'ease-out'); },
    getar: function () { return kf([{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(5px)' }, { transform: 'translateX(-3px)' }, { transform: 'translateX(2px)' }, { transform: 'translateX(0)' }], 360, 'linear'); },
    kenyal: function () { return kf([{ transform: 'scale(.3)', opacity: 0 }, { transform: 'scale(1.1,.9)', opacity: 1, offset: .45 }, { transform: 'scale(.95,1.05)', offset: .7 }, { transform: 'scale(1.02,.98)', offset: .85 }, { transform: 'scale(1)' }], 520, 'ease-out'); },
    lingkar: function () { return kf([{ clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(75% at 50% 50%)' }], 480, 'cubic-bezier(.65,0,.35,1)'); },
    sapu: function () { return kf([{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], 400, 'ease-in-out'); },
    garis: function () { return kf([{ transform: 'scale(.02,.06)', opacity: .6 }, { transform: 'scale(1,.06)', opacity: 1, offset: .4 }, { transform: 'scale(1,1)' }], 380, OUT); },
    gulir: function () { return kf([{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(-60%)', opacity: 0, filter: 'blur(2px)', offset: .45 }, { transform: 'translateY(60%)', opacity: 0, offset: .46 }, { transform: 'translateY(0)', opacity: 1, filter: 'blur(0)' }], 420, 'ease-out'); },
    denyar: function () { return kf([{ transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(31,75,216,.55)' }, { transform: 'scale(1.06)', boxShadow: '0 0 0 10px rgba(31,75,216,.15)', offset: .4 }, { transform: 'scale(1)', boxShadow: '0 0 0 18px rgba(31,75,216,0)' }], 600, 'ease-out'); },
    beruntun: null // handled separately: children stagger
  };
  var NAMA_KELUARGA = {
    tekan: 'tekan & pantul', muncul: 'muncul membesar', jatuh: 'jatuh & mendarat', kabur: 'fokus dari kabur', geser: 'geser masuk',
    engsel: 'engsel 3D', balik: 'balik 3D', goyang: 'goyang', getar: 'getar', kenyal: 'kenyal (jelly)', lingkar: 'buka lingkaran',
    sapu: 'sapuan', garis: 'garis lalu membuka', gulir: 'gulir angka/teks', denyar: 'denyar cincin', beruntun: 'beruntun per anak'
  };

  var jalan = new WeakMap();
  function hentikan(el) {
    var list = jalan.get(el);
    if (list) { list.forEach(function (a) { try { a.cancel(); } catch (x) {} }); jalan.delete(el); }
    if (el.__luzDisplay != null) { el.style.display = el.__luzDisplay; el.__luzDisplay = null; }
  }

  function pratinjau(el, id) {
    var d = BY_ID[asli(id)];
    if (!el || !d || !el.animate) return Promise.resolve(false);
    hentikan(el);
    // transforms do nothing on display:inline; use inline-block for the preview only
    if (getComputedStyle(el).display === 'inline') { el.__luzDisplay = el.style.display; el.style.display = 'inline-block'; }
    var anims = [];
    if (d.g === 'beruntun') {
      var kids = [].slice.call(el.children).filter(function (c) { return c.getBoundingClientRect().height > 0; }).slice(0, 12);
      if (kids.length < 2) kids = [el];
      kids.forEach(function (c, i) {
        anims.push(c.animate([{ opacity: 0, transform: 'translateY(-8px)' }, { opacity: 1, transform: 'none' }],
          { duration: 260, delay: i * 65, easing: 'ease-out', fill: 'backwards' }));
      });
    } else {
      var k = KELUARGA[d.g]();
      anims.push(el.animate(k.frames, k.opt));
    }
    jalan.set(el, anims);
    return Promise.all(anims.map(function (a) { return a.finished.catch(function () {}); })).then(function () { hentikan(el); return true; });
  }

  /* ---------- 3. Text for the note ---------- */
  function baris(id, nomorObjek) {
    var d = BY_ID[asli(id)];
    if (!d) return '';
    return (nomorObjek ? '@' + nomorObjek + ' ' : '') + 'animasi: `' + d.id + '` (' + d.n + ' · ' + d.d + ')';
  }
  function tautanGaleri(id) { return GALERI + '#c-' + id; }

  window.LuzMotionKoreksi = {
    data: DATA, get: function (id) { return BY_ID[asli(id)]; },
    jenisObjek: jenisObjek, rekomendasi: rekomendasi, cari: cari,
    pratinjau: pratinjau, hentikan: hentikan, namaKeluarga: function (g) { return NAMA_KELUARGA[g] || g; },
    baris: baris, tautanGaleri: tautanGaleri, GALERI: GALERI
  };
})();
