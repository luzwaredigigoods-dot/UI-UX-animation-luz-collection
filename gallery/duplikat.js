/* Animations whose core motion is the same as another one in the collection.
   Format: 'removed-id': ['kept-id', 'why / what differs (Indonesian, short)'].
   The removed one is hidden from the gallery, catalog and recommendations; its ID still
   resolves to the kept one, so old prompts keep working. Delete a line to restore it. */
window.LUZ_DUPLIKAT = {
  'search-circle-reveal': ['menu-circle-reveal', 'lingkaran clip-path dari tombol, dipakai di search bar'],
  'toast-circle-reveal': ['menu-circle-reveal', 'lingkaran clip-path dari tombol, dipakai di toast'],
  'progress-pixel-dissolve': ['toast-pixel-dissolve', 'piksel berkumpul jadi solid, dipakai di ujung progress bar'],
  'swipedel-dust-crumble': ['toast-pixel-dissolve', 'remuk jadi partikel lalu melayang, dipakai saat hapus baris'],
  'toast-blinds': ['screen-blinds', 'bilah tirai beruntun, dipakai di toast'],
  'search-blur-focus': ['dialog-soft-focus', 'masuk dari blur ke tajam, dipakai di search bar'],
  'menu5-line-expand': ['dialog-line-unfold', 'garis memanjang lalu membuka jadi panel, dipakai di dropdown'],
  'tooltip-fold-open': ['dialog-line-unfold', 'garis memanjang lalu membuka jadi panel, dipakai di tooltip'],
  'send-genie-outbox': ['swipedel-genie-bin', 'efek genie tersedot ke ikon, dipakai saat kirim surel'],
  'menu2-button-to-panel': ['toast-button-morph', 'tombol tumbuh menjadi panel (shared element), dipakai di menu Create'],
  'badge-slot-roll': ['counter-odometer-roll', 'digit bergulir vertikal, dipakai di badge'],
  'copy-flip-board': ['counter-split-flap', 'papan split-flap, dipakai di label tombol Copy'],
  'pwstr-flap-label': ['counter-split-flap', 'papan split-flap, dipakai di label kekuatan sandi'],
  'badge-coin-flip': ['checkbox-flip-tick', 'balik 3D rotateY ke sisi belakang, dipakai di badge'],
  'iconmorph1-tumble-flip': ['field3-flip-verify', 'balik 3D rotateX menukar keadaan, dipakai di tombol ikon'],
  'copy-outline-echo': ['inerr-red-echo', 'garis tepi beriak keluar; warna hijau untuk sukses, merah untuk error'],
  'search-border-trace': ['toast-outline-draw', 'garis bercahaya menelusuri tepi lalu isi menyapu masuk'],
  'copy-char-wave': ['inerr-letter-jitter', 'huruf meloncat beruntun dan berganti warna'],
  'pwstr-block-drop': ['tooltip-elastic-drop', 'jatuh lalu memipih saat mendarat'],
  'inerr-alert-pop': ['checkbox-pop-burst', 'ikon meletup dengan percikan; warna merah untuk error'],
  'search-jelly-pop': ['dialog-wobble-in', 'muncul membesar dengan goyang jelly'],
  'search-paper-unfold': ['menu2-fold-down', 'baris membuka rotateX -90° beruntun'],
  'pagination-elastic-glide': ['tabbar18-sliding-pill', 'penanda aktif merentang ke tujuan lalu menyusut'],
  'segment-outline-glide': ['tabbar18-sliding-pill', 'penanda aktif merentang ke tujuan; versi garis tepi saja'],
  'pagination-comet-trail': ['switch-ghost-trail', 'bayangan sisa (afterimage) di sepanjang lintasan'],
  'rating-score-fly': ['copy-ghost-fly', 'salinan terbang melengkung ke target lalu target meletup'],
  'stepper-glyph-spin': ['iconmorph1-spin-swap', 'ikon berputar 180° sambil berganti'],
  'datepick-snap-brackets': ['field3-corner-lock', 'empat siku sudut terbang lalu mengunci']
};
