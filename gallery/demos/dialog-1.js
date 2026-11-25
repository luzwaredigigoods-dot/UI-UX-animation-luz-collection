/* Dialog · Part 1 — six ways to open/close a confirm dialog ("Delete file?").
   All six share the same markup + JS; only the CSS keyframes differ. */
(function () {
  var html =
    '<div class="w">' +
      '<div class="app">' +
        '<div class="hd"><b>Files</b><span>Recent</span></div>' +
        '<div class="row"><i class="ic"></i><div><b class="nm">Trip notes.pdf</b><small>2.4 MB · Edited today</small></div></div>' +
        '<button class="del" type="button">Delete file</button>' +
      '</div>' +
      '<div class="scrim"></div>' +
      '<i class="ln"></i>' +
      '<div class="dlg" role="dialog" aria-label="Delete file?">' +
        '<b>Delete file?</b><p>"<span class="dn">Trip notes.pdf</span>" will be removed.</p>' +
        '<div class="bt"><button class="cn" type="button">Cancel</button><button class="ok" type="button">Delete</button></div>' +
      '</div>' +
    '</div>';

  var base =
    '& .w{position:relative;width:240px;height:196px;border-radius:16px;background:var(--d-bg);overflow:hidden;font-size:11px;color:var(--d-fg)}' +
    '& .app{padding:14px;display:grid;gap:12px;transition:filter .3s}' +
    '& .hd{display:flex;justify-content:space-between}& .hd span{color:var(--d-mid)}' +
    '& .row{display:flex;gap:10px;align-items:center;padding:10px;border-radius:10px;background:var(--d-soft)}' +
    '& .ic{width:26px;height:26px;border-radius:7px;background:var(--d-accent)}' +
    '& .row small{display:block;color:var(--d-mid);font-size:9.5px}' +
    '& .del{justify-self:center;border:1.5px solid #e8457a;color:#e8457a;background:none;border-radius:99px;padding:9px 20px;font-weight:600;cursor:pointer;font-size:11px}' +
    '& .scrim{position:absolute;inset:0;background:rgba(0,0,0,.35);opacity:0;pointer-events:none;transition:opacity .25s}' +
    '& .w.open .scrim{opacity:1}' +
    '& .dlg{position:absolute;left:22px;right:22px;top:46px;height:104px;box-sizing:border-box;padding:14px;border-radius:14px;background:var(--d-bg);border:1px solid var(--d-soft);box-shadow:0 12px 30px rgba(0,0,0,.28);text-align:center;visibility:hidden}' +
    '& .dlg p{margin:4px 0 10px;color:var(--d-mid);font-size:9.5px}' +
    '& .bt{display:flex;gap:8px}& .bt button{flex:1;border:0;border-radius:9px;padding:8px;font-weight:600;cursor:pointer;font-size:11px}' +
    '& .cn{background:var(--d-soft);color:var(--d-fg)}& .ok{background:#e8457a;color:#fff}' +
    '& .w.open .dlg,& .w.closing .dlg{visibility:visible}' +
    '& .ln{position:absolute;left:22px;right:22px;top:97px;height:2px;border-radius:2px;background:var(--d-accent);box-shadow:0 0 10px var(--d-accent);opacity:0;pointer-events:none}' +
    '& .w.rm .dlg,& .w.rm .ln,& .w.rm .app,& .w.rm .scrim{animation-duration:1ms!important;transition-duration:1ms!important}';

  // Same JS for every dialog: .open plays the enter keyframes, .closing the exit ones.
  function js(root, api) {
    var w = root.querySelector('.w'), t = [], ct, i = 0;
    var files = ['Trip notes.pdf', 'Budget plan.xlsx', 'Beach photo.jpg'];
    if (api.reduce) w.classList.add('rm');
    function open() { clearTimeout(ct); w.classList.remove('closing'); w.classList.add('open'); }
    function close(del) {
      if (!w.classList.contains('open')) return;
      w.dataset.how = del ? 'del' : 'cancel';
      w.classList.replace('open', 'closing');
      ct = setTimeout(function () {
        w.classList.remove('closing');
        if (del) { i = (i + 1) % files.length; root.querySelector('.nm').textContent = root.querySelector('.dn').textContent = files[i]; }
      }, 400);
    }
    root.querySelector('.del').onclick = open;
    root.querySelector('.cn').onclick = function () { close(false); };
    root.querySelector('.ok').onclick = function () { close(true); };
    t.push(setTimeout(open, 600), setTimeout(function () { close(true); }, 2100));
    return function () { t.forEach(clearTimeout); clearTimeout(ct); };
  }

  var src = 'Dialog · Part 1';
  var use = 'konfirmasi hapus data (mis. hapus berkas hasil lab atau jadwal pasien)';

  LUZ.add({
    id: 'dialog-scale-pop', cat: 'Modal, Sheet & Tooltip', name: 'Scale Pop', source: src, trigger: 'tap', allowColor: true,
    motion: 'Dialog muncul dari scale 0.72 ke 1 dengan overshoot lembut (±1.04) sambil fade-in, scrim gelap memudar di belakang. Saat ditutup dialog mengecil ke 0.9 dan memudar.',
    timing: 'masuk ≈320ms cubic-bezier(.34,1.56,.64,1) · keluar ≈180ms ease-in',
    use: use, tags: 'dialog modal scale pop overshoot confirm delete',
    html: html, js: js,
    css: base +
      '& .w.open .dlg{animation:dialog-pop-in 320ms cubic-bezier(.34,1.56,.64,1) both}' +
      '& .w.closing .dlg{animation:dialog-pop-out 180ms ease-in both}' +
      '@keyframes dialog-pop-in{from{opacity:0;transform:scale(.72)}to{opacity:1;transform:none}}' +
      '@keyframes dialog-pop-out{from{opacity:1;transform:none}to{opacity:0;transform:scale(.9)}}'
  });

  LUZ.add({
    id: 'dialog-spring-drop', cat: 'Modal, Sheet & Tooltip', name: 'Spring Drop', source: src, trigger: 'tap', allowColor: true,
    motion: 'Dialog jatuh dari atas (translateY −160px ke 0) dengan pegas: lewat 8px ke bawah lalu memantul −3px dan diam. Cancel mengangkatnya kembali ke atas, Delete menjatuhkannya ke bawah sambil miring 6°.',
    timing: 'masuk ≈450ms ease-out pegas · keluar ≈260ms ease-in',
    use: use, tags: 'dialog modal drop spring bounce fall',
    html: html, js: js,
    css: base +
      '& .w.open .dlg{animation:dialog-drop-in 450ms ease-out both}' +
      '& .w.closing .dlg{animation:dialog-drop-up 260ms ease-in both}' +
      '& .w.closing[data-how=del] .dlg{animation-name:dialog-drop-down}' +
      '@keyframes dialog-drop-in{0%{opacity:0;transform:translateY(-160px)}60%{opacity:1;transform:translateY(8px)}80%{transform:translateY(-3px)}100%{opacity:1;transform:none}}' +
      '@keyframes dialog-drop-up{to{opacity:0;transform:translateY(-150px)}}' +
      '@keyframes dialog-drop-down{to{opacity:0;transform:translateY(170px) rotate(6deg)}}'
  });

  LUZ.add({
    id: 'dialog-hinge-swing', cat: 'Modal, Sheet & Tooltip', name: 'Hinge Swing', source: src, trigger: 'tap', allowColor: true,
    motion: 'Dialog berengsel di tepi atas (transform-origin atas): berayun turun 3D dari rotateX −90° ke 0 dengan perspektif 500px, lewat sedikit ke +8° lalu diam. Saat ditutup berayun naik lagi ke −90°.',
    timing: 'masuk ≈450ms ease-out · keluar ≈260ms ease-in',
    use: use, tags: 'dialog modal hinge 3d rotateX swing flip',
    html: html, js: js,
    css: base +
      '& .dlg{transform-origin:50% 0}' +
      '& .w.open .dlg{animation:dialog-hinge-in 450ms ease-out both}' +
      '& .w.closing .dlg{animation:dialog-hinge-out 260ms ease-in both}' +
      '@keyframes dialog-hinge-in{0%{opacity:0;transform:perspective(500px) rotateX(-90deg)}65%{opacity:1;transform:perspective(500px) rotateX(8deg)}100%{opacity:1;transform:perspective(500px) rotateX(0)}}' +
      '@keyframes dialog-hinge-out{from{transform:perspective(500px) rotateX(0)}to{opacity:0;transform:perspective(500px) rotateX(-90deg)}}'
  });

  LUZ.add({
    id: 'dialog-line-unfold', cat: 'Modal, Sheet & Tooltip', name: 'Line Unfold', source: src, trigger: 'tap', allowColor: true,
    motion: 'Sebuah garis aksen bercahaya 2px melebar dari tengah (scaleX 0→1), lalu dialog terbuka vertikal dari garis itu (clip-path inset 50%→0) sementara garisnya memudar. Penutupan memutar urutan: dialog menyempit jadi garis, garis mengecil hilang.',
    timing: 'garis ≈160ms · buka ≈240ms ease-out (total ≈400ms) · tutup ≈300ms ease-in',
    use: use, tags: 'dialog modal line unfold clip-path glow reveal',
    html: html, js: js,
    css: base +
      '& .w.open .dlg{animation:dialog-unfold 400ms ease-out both}' +
      '& .w.open .ln{animation:dialog-line 440ms ease-out both}' +
      '& .w.closing .dlg{animation:dialog-unfold 300ms ease-in reverse both}' +
      '& .w.closing .ln{animation:dialog-line 320ms ease-in reverse both}' +
      '@keyframes dialog-unfold{0%{opacity:0;clip-path:inset(50% 0 50% 0 round 14px)}40%{opacity:1;clip-path:inset(50% 0 50% 0 round 14px)}100%{opacity:1;clip-path:inset(0 0 0 0 round 14px)}}' +
      '@keyframes dialog-line{0%{opacity:1;transform:scaleX(0)}40%{opacity:1;transform:scaleX(1)}100%{opacity:0;transform:scaleX(1)}}'
  });

  LUZ.add({
    id: 'dialog-soft-focus', cat: 'Modal, Sheet & Tooltip', name: 'Soft Focus', source: src, trigger: 'tap', allowColor: true,
    motion: 'Dialog datang dari blur 12px, scale 1.06 dan opacity 0 menjadi tajam, sementara aplikasi di belakangnya ikut blur 3px dan meredup. Saat ditutup dialog kembali kabur lalu hilang dan latar menajam lagi.',
    timing: 'masuk ≈320ms ease-out · keluar ≈220ms ease-in · blur latar transisi 300ms',
    use: use, tags: 'dialog modal blur focus depth backdrop',
    html: html, js: js,
    css: base +
      '& .w.open .app{filter:blur(3px)}' +
      '& .w.open .dlg{animation:dialog-focus-in 320ms ease-out both}' +
      '& .w.closing .dlg{animation:dialog-focus-out 220ms ease-in both}' +
      '@keyframes dialog-focus-in{from{opacity:0;filter:blur(12px);transform:scale(1.06)}to{opacity:1;filter:blur(0);transform:none}}' +
      '@keyframes dialog-focus-out{from{opacity:1;filter:blur(0)}to{opacity:0;filter:blur(10px);transform:scale(.97)}}'
  });

  LUZ.add({
    id: 'dialog-wobble-in', cat: 'Modal, Sheet & Tooltip', name: 'Wobble In', source: src, trigger: 'tap', allowColor: true,
    motion: 'Dialog tumbuh dari scale 0.3 dengan goyangan jeli: scale (1.08, 0.92) → (0.95, 1.05) → (1.02, 0.98) → 1. Saat ditutup ia gepeng (scaleY 0.6 lalu 0, scaleX 1.2) dan menghilang.',
    timing: 'masuk ≈560ms bouncy · keluar ≈240ms ease-in',
    use: use, tags: 'dialog modal wobble jelly squash stretch bounce',
    html: html, js: js,
    css: base +
      '& .w.open .dlg{animation:dialog-wob-in 560ms ease-out both}' +
      '& .w.closing .dlg{animation:dialog-wob-out 240ms ease-in both}' +
      '@keyframes dialog-wob-in{0%{opacity:0;transform:scale(.3)}40%{opacity:1;transform:scale(1.08,.92)}60%{transform:scale(.95,1.05)}80%{transform:scale(1.02,.98)}100%{opacity:1;transform:none}}' +
      '@keyframes dialog-wob-out{0%{transform:none}40%{transform:scale(1.1,.6)}100%{opacity:0;transform:scale(1.2,0)}}'
  });
})();
