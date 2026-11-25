# Katalog Luz Motion

198 animasi. Sebut ID-nya di prompt, mis. "pakai `menu-circle-reveal` untuk menu di header".

## Menu & Navigasi

### `menu2-push-back` — Push Back
- Sumber: Menu · Part 2
- Pemicu: tap
- Gerak: Halaman depan mundur: bergeser 120px ke kanan, mengecil ke 0.78, dan miring 3D (rotateY −14°), memperlihatkan menu di belakangnya. Item menu (Home, Explore, Library, Settings) masuk dari kiri 14px sambil memudar dengan stagger 40ms. Ikon ≡ berubah jadi X. Tutup membalik semuanya.
- Durasi & easing: halaman 420ms cubic-bezier(.3,.8,.3,1) · item 300ms, delay 80–200ms (stagger 40ms) · ikon 300ms
- Cocok untuk: Menu navigasi utama aplikasi mobile yang ingin terasa berlapis, misalnya menu samping aplikasi klinik.
- Kode: `gallery/demos/menu-2.js`

### `menu2-kebab-popover` — Kebab Popover
- Sumber: Menu · Part 2
- Pemicu: tap
- Gerak: Tiga titik tombol ⋮ terbang keluar (masing-masing ke kiri-bawah 78px, turun 44/64/84px, stagger 40ms) dan menjadi ikon titik di depan tiap baris menu (Edit, Share, Delete). Bersamaan panel popover membesar dari pojok kanan-atas (scale 0.5→1) dan label baris muncul berurutan. Tutup: titik terbang kembali menjadi ⋮.
- Durasi & easing: titik 380ms cubic-bezier(.3,1.4,.5,1), stagger 40ms · panel 300ms ease-out · label 200ms delay 150/190/230ms
- Cocok untuk: Menu aksi per item (lebih banyak/opsi), misalnya kartu pasien atau baris tabel dengan Edit, Bagikan, Hapus.
- Kode: `gallery/demos/menu-2.js`

### `menu2-gooey-menu` — Gooey Menu
- Sumber: Menu · Part 2
- Pemicu: tap
- Gerak: Empat tombol bulat 32px (kamera, galeri, bintang, kalender) memisah dari tombol utama 44px seperti tetesan: tiap tetes meregang (scale 1.5×0.7) saat lepas, meluncur ke kanan 52/92/132/172px, melewati posisi 4px lalu membulat. Stagger 50ms. Ikon ≡ jadi X. Tutup: tetesan meregang lagi dan tersedot kembali ke tombol utama, urutan terbalik.
- Durasi & easing: buka 480ms ease-out per tetes, stagger 50ms · tutup 320ms ease-in, stagger 40ms terbalik
- Cocok untuk: Tombol aksi cepat (FAB) yang membuka beberapa pilihan, misalnya unggah foto, catatan, atau jadwal.
- Kode: `gallery/demos/menu-2.js`

### `menu2-fold-down` — Fold Down
- Sumber: Menu · Part 2
- Pemicu: tap
- Gerak: Baris-baris dropdown (Design, Motion, Code, Sound) terlipat terbuka satu per satu seperti kertas: tiap baris berputar dari rotateX(−90°) ke 0 dengan engsel di tepi atas, stagger 70ms, sementara wadah daftar membuka dari atas ke bawah (clip-path) seolah mendorong baris berikutnya. Chevron berputar 180°. Tutup: baris terlipat kembali dari bawah ke atas.
- Durasi & easing: tiap baris 300ms ease-out, stagger 70ms (total ≈510ms) · tutup stagger 50ms terbalik · chevron 300ms
- Cocok untuk: Dropdown filter atau kategori, misalnya pilih poli, kategori obat, atau jenis laporan.
- Juga mewakili: `search-paper-unfold` (baris membuka rotateX -90° beruntun)
- Kode: `gallery/demos/menu-2.js`

### `menu2-command-palette` — Command Palette
- Sumber: Menu · Part 2
- Pemicu: tap
- Gerak: Ketuk ikon cari: latar halaman meredup, palet perintah jatuh dari 14px di atas (scale 0.96→1) dengan pegas kecil. Kueri "set" mengetik sendiri satu huruf per 110ms dengan kursor berkedip, lalu hasil (Settings, Set status, Setup guide) masuk naik 6px berurutan dengan stagger 60ms; baris pertama tersorot. Ketuk lagi untuk menutup (palet memudar ke atas).
- Durasi & easing: palet 280ms cubic-bezier(.3,1.3,.5,1) · ketik 3×110ms · hasil 220ms, stagger 60ms · tutup 200ms
- Cocok untuk: Pencarian cepat/perintah di dashboard atau aplikasi web (⌘K), misalnya cari pasien, menu, atau pengaturan.
- Kode: `gallery/demos/menu-2.js`

### `menu5-swing-hinge` — Swing Hinge
- Sumber: Menu · Part 5
- Pemicu: tap
- Gerak: Panel menu tergantung pada pin engsel di sudut kiri atasnya. Saat dibuka, panel berayun turun dari rotate(35°) ke 0, melewati sampai −6°, balik 3°, lalu diam seperti bandul teredam. Saat item dipilih, panel cepat berayun pergi (rotate 25°) sambil memudar.
- Durasi & easing: buka 500ms ease-out (ζ ≈ 0.4) · tutup 160ms ease-in
- Cocok untuk: Dropdown yang ingin terasa fisik/menyenangkan, misalnya pengganti tampilan di dashboard.
- Kode: `gallery/demos/menu-5.js`

### `menu5-double-doors` — Double Doors
- Sumber: Menu · Part 5
- Pemicu: tap
- Gerak: Menu dibelah dua: separuh kiri berengsel di tepi kiri dan separuh kanan di tepi kanan. Saat dibuka, kedua daun pintu berayun menutup ke tengah (rotateY ±90° → 0) dan membentuk panel utuh. Saat item dipilih, kedua daun berayun membuka keluar (0 → ±100°) sambil memudar.
- Durasi & easing: tutup pintu (buka menu) 220ms ease-out · buka pintu (tutup menu) 220ms ease-in
- Cocok untuk: Menu pilihan yang ingin terasa seperti membuka/menutup lemari, misalnya filter kategori produk.
- Kode: `gallery/demos/menu-5.js`

### `menu5-liquid-fill` — Liquid Fill
- Sumber: Menu · Part 5
- Pemicu: tap
- Gerak: Menu terisi dari bawah ke atas seperti cairan: tepi clip-path polygon berbentuk gelombang (amplitudo ±6%, berganti arah tiap langkah) naik dari bawah sampai menutupi seluruh panel. Saat item dipilih, cairan surut turun dengan tepi bergelombang yang sama.
- Durasi & easing: isi 260ms ease-out · surut 200ms ease-in
- Cocok untuk: Menu di aplikasi bertema cair/kesehatan, misalnya pilihan jenis cairan infus atau target minum.
- Kode: `gallery/demos/menu-5.js`

### `menu5-zipper-rows` — Zipper Rows
- Sumber: Menu · Part 5
- Pemicu: tap
- Gerak: Baris-baris menu meluncur masuk dari sisi yang bergantian seperti ritsleting: baris 1 dari kanan, baris 2 dari kiri, baris 3 dari kanan, dan seterusnya (translateX ±40px + opacity), berurutan dari atas. Saat item dipilih, baris meluncur keluar ke sisi yang bergantian.
- Durasi & easing: baris 240ms ease-out, stagger 40ms · panel 120ms · keluar 160ms ease-in, stagger 30ms
- Cocok untuk: Menu pendek yang ingin terasa dinamis, misalnya pilihan urutan atau tampilan daftar pasien.
- Kode: `gallery/demos/menu-5.js`

### `menu5-scroll-unroll` — Scroll Unroll
- Sumber: Menu · Part 5
- Pemicu: tap
- Gerak: Sebuah "rol" tebal berwarna aksen (batang bulat 8px, sedikit lebih lebar dari menu) bergerak dari tepi atas ke bawah dan membuka item-item di atasnya seperti gulungan kertas dibuka (clip-path inset dari bawah). Saat item dipilih, rol menggulung kembali ke atas dan menutup menu.
- Durasi & easing: buka 260ms ease-out · gulung 200ms ease-in · rol memudar di 15% terakhir
- Cocok untuk: Menu bertema dokumen/arsip, misalnya pilihan format laporan atau riwayat kunjungan.
- Kode: `gallery/demos/menu-5.js`

### `menu-hamburger-morph` — Hamburger Morph
- Sumber: Menu · Part 6
- Pemicu: tap
- Gerak: Dua tahap ikon: tiga garis menyatu ke garis tengah (“−”, 150ms) lalu berputar menjadi X (200ms); saat menutup urutannya dibalik. Garis pemisah vertikal tergambar dari atas, lalu HOME/EXPLORE/LIBRARY muncul bergiliran atas→bawah (fade + geser 6px, jeda 60ms) sementara konten meredup.
- Durasi & easing: ikon 150ms + 200ms · garis 250ms · item 200ms stagger 60ms
- Cocok untuk: Menu utama aplikasi mobile/web responsif di header.
- Kode: `gallery/demos/menu-6.js`

### `menu-side-drawer` — Side Drawer
- Sumber: Menu · Part 6
- Pemicu: tap
- Gerak: Panel selebar ±46% meluncur masuk dari kiri (translateX −100%→0) dengan garis tepi kanan tebal 2px; isinya avatar + daftar HOME/EXPLORE/LIBRARY, item aktif bertitik. Konten di belakang meredup. Memilih item menutup laci kembali ke kiri.
- Durasi & easing: buka 350ms ease-out (cubic-bezier .2,.8,.2,1) · tutup 300ms ease-in
- Cocok untuk: Navigasi samping aplikasi dengan banyak bagian, misalnya modul EMR (pasien, jadwal, laporan).
- Kode: `gallery/demos/menu-6.js`

### `menu-fab-fan` — FAB Fan
- Sumber: Menu · Part 6
- Pemicu: tap
- Gerak: Tiga tombol ikon bulat keluar dari tombol menu dan menyebar diagonal ke kiri-bawah (HOME paling jauh, EXPLORE tengah, LIBRARY terdekat), dihubungkan garis tipis yang tergambar. Tiap tombol tumbuh dari scale 0 dengan pegas, bergiliran 50ms; ikon menu menjadi ×. Item terpilih terisi hitam, lalu semua kembali masuk ke tombol dengan urutan terbalik.
- Durasi & easing: buka 300ms pegas (cubic-bezier .34,1.56,.64,1) stagger 50ms · tutup 200ms ease-in
- Cocok untuk: Aksi cepat dari tombol mengambang, misalnya tambah pasien / jadwal / catatan.
- Kode: `gallery/demos/menu-6.js`

### `menu-staggered-dropdown` — Staggered Dropdown
- Sumber: Menu · Part 6
- Pemicu: tap
- Gerak: Kartu berbingkai jatuh di bawah tombol (fade + translateY −6px→0). Item muncul satu per satu atas→bawah (HOME, EXPLORE, LIBRARY, jeda ±90ms, fade + turun 4px); bilah vertikal pendek menandai item aktif. Saat menutup, item memudar terbalik (bawah dulu) lalu kartunya hilang.
- Durasi & easing: kartu 200ms · item 150ms stagger 90ms · tutup terbalik, kartu menyusul 270ms
- Cocok untuk: Dropdown akun/profil atau menu filter di header desktop.
- Kode: `gallery/demos/menu-6.js`

### `menu-circle-reveal` — Circle Reveal
- Sumber: Menu · Part 6
- Pemicu: tap
- Gerak: Lapisan menu penuh terbuka lewat lingkaran yang membesar dari pusat tombol (clip-path circle 0→300px); tepi lingkaran tampak sebagai busur garis tipis yang menyapu ke kiri. Isinya daftar besar bertipe tipis HOME/EXPLORE/LIBRARY, item aktif bergaris bawah. Memilih item menyusutkan lingkaran kembali ke tombol.
- Durasi & easing: 500ms · ease-in-out (cubic-bezier .65,0,.35,1), tutup dengan kurva sama
- Cocok untuk: Menu layar penuh untuk situs portofolio/landing atau aplikasi dengan sedikit tujuan utama.
- Juga mewakili: `search-circle-reveal` (lingkaran clip-path dari tombol, dipakai di search bar); `toast-circle-reveal` (lingkaran clip-path dari tombol, dipakai di toast)
- Kode: `gallery/demos/menu-6.js`

### `pagination-arc-hop` — Arc Hop
- Sumber: Pagination · Part 1
- Pemicu: tap
- Gerak: Sorotan mengecil menjadi bola (scale 0.35), melompat dalam busur 18px di atas deretan nomor ke nomor baru, lalu membesar lagi menjadi kotak. Kartu lama memudar dan kartu baru jatuh dari atas satu per satu (−14px→0, jeda 80ms) dengan sedikit pantulan.
- Durasi & easing: lompat 500ms ease-in-out · kartu 300ms pegas (cubic-bezier .34,1.4,.64,1) stagger 80ms
- Cocok untuk: Paginasi carousel atau onboarding yang ingin terasa ringan dan ceria.
- Kode: `gallery/demos/pagination-1.js`

### `pagination-squeeze-line` — Squeeze Line
- Sumber: Pagination · Part 1
- Pemicu: tap
- Gerak: Sorotan memipih menjadi garis bawah tipis di bawah nomornya (scaleY 0.15, turun 11px), garis itu memanjang sambil menyeberang ke nomor baru, lalu tumbuh kembali menjadi kotak. Kartu lama tenggelam (turun 8px + memudar) dan kartu baru naik dari bawah bergiliran.
- Durasi & easing: sorotan 450ms ease-in-out · kartu lama 200ms · kartu baru 300ms ease-out stagger 70ms
- Cocok untuk: Paginasi bergaya minimal di tabel atau daftar dokumen.
- Kode: `gallery/demos/pagination-1.js`

### `pagination-bloom-reveal` — Bloom Reveal
- Sumber: Pagination · Part 1
- Pemicu: tap
- Gerak: Sorotan langsung pindah ke nomor baru dan mekar dari tengahnya (scale 0→1, lingkaran → kotak membulat). Kumpulan kartu baru terbuka lewat lingkaran clip-path yang mengembang dari arah nomor yang diketuk, menutupi kartu lama.
- Durasi & easing: mekar 300ms ease-out · buka lingkaran 500ms ease-in-out
- Cocok untuk: Pergantian halaman/tab konten yang ingin terasa “membuka”, misalnya kategori produk.
- Kode: `gallery/demos/pagination-1.js`

### `pagination-page-turn` — Page Turn
- Sumber: Pagination · Part 1
- Pemicu: tap
- Gerak: Panel kartu berputar 3D seperti halaman buku (rotateY 0→90° dengan perspektif, kartu tampak memipih), isinya berganti, lalu berputar masuk −90°→0. Sorotan nomor ikut membalik di sumbu vertikal saat berpindah ke nomor baru.
- Durasi & easing: putar keluar 200ms ease-in + masuk 250ms ease-out · sorotan 400ms
- Cocok untuk: Pergantian halaman katalog, majalah, atau laporan yang dibaca per halaman.
- Kode: `gallery/demos/pagination-1.js`

### `tabbar18-sliding-pill` — Sliding Pill
- Sumber: Tab Bar · Part 18
- Pemicu: tap
- Gerak: Pil aksen (46×34px) di belakang ikon aktif meluncur ke tab yang diketuk. Di tengah jalan pil meregang (scaleX hingga ±1.9 untuk lompatan 1 tab, lebih panjang untuk lompatan jauh) sehingga menutupi dua ikon sekaligus, lalu menyusut kembali dengan overshoot 4px seperti pegas. Ikon di dalam pil berganti warna ke warna permukaan.
- Durasi & easing: ≈480ms cubic-bezier(.3,.7,.4,1) · regangan puncak di 45% · overshoot 4px di 80% · warna ikon 200ms
- Cocok untuk: Bottom navigation aplikasi mobile, misalnya pindah Beranda ↔ Jadwal ↔ Pasien ↔ Profil.
- Juga mewakili: `pagination-elastic-glide` (penanda aktif merentang ke tujuan lalu menyusut); `segment-outline-glide` (penanda aktif merentang ke tujuan; versi garis tepi saja)
- Kode: `gallery/demos/tab-bar-18.js`

### `tabbar18-liquid-bulge` — Liquid Bulge
- Sumber: Tab Bar · Part 18
- Pemicu: tap
- Gerak: Permukaan bar punya tonjolan (bukit 60×28px) di atas tab aktif. Saat tab lain diketuk, tonjolan memipih dan melebar (scale 1.9×0.45) sambil mengalir ke tab tujuan, lalu menggembung lagi. Ikon aktif naik 10px ke dalam tonjolan dan berubah warna aksen; ikon lama turun kembali.
- Durasi & easing: tonjolan 500ms cubic-bezier(.4,0,.3,1), pipih di 50% · ikon naik 350ms cubic-bezier(.3,1.5,.5,1) (overshoot kecil)
- Cocok untuk: Bottom navigation dengan gaya organik/lembut, misalnya aplikasi kesehatan atau wellness.
- Kode: `gallery/demos/tab-bar-18.js`

### `tabbar18-floating-notch` — Floating Notch
- Sumber: Tab Bar · Part 18
- Pemicu: tap
- Gerak: Bola aksen 38px berisi ikon aktif melayang di atas bar, duduk di lekukan (notch) berjari-jari 25px yang dipotong dari tepi atas bar. Saat tab lain diketuk, bola melompat dalam busur (naik 14px di tengah) ke tab tujuan dan lekukan ikut bergeser bersamanya; ikon di bola berganti di puncak lompatan. Di slot aktif, ikon bar disembunyikan dan diganti label huruf kapital kecil (HOME, SEARCH…).
- Durasi & easing: lompatan 450ms ease-in-out (busur sinus) · label pudar 200ms
- Cocok untuk: Bottom navigation dengan tombol aktif yang menonjol, misalnya aplikasi booking atau dompet digital.
- Kode: `gallery/demos/tab-bar-18.js`

### `tabbar18-icon-fill` — Icon Fill
- Sumber: Tab Bar · Part 18
- Pemicu: tap
- Gerak: Ikon yang diketuk ditekan dulu (scale 0.7), lalu terisi warna aksen dan memantul ke 1.25 sebelum kembali 1. Dua cincin aksen memancar dari ikon (scale 0.6→2, pudar) berjarak 120ms, dan garis bawah 12px tumbuh dari tengah (scaleX 0→1). Ikon lama kehilangan isinya dan sedikit mengecil (0.85) lalu normal.
- Durasi & easing: ikon 450ms ease-out (0.7 → 1.25 → 1) · cincin 500ms, jeda 120ms · garis bawah 250ms delay 100ms
- Cocok untuk: Tab bar yang ingin memberi umpan balik jelas tanpa indikator bergerak, misalnya menu favorit/notifikasi.
- Kode: `gallery/demos/tab-bar-18.js`

### `tabbar18-expanding-label` — Expanding Label
- Sumber: Tab Bar · Part 18
- Pemicu: tap
- Gerak: Tab aktif berupa pil aksen 88px berisi ikon + label (Home, Search, Likes, Profile); tab lain hanya ikon 40px. Saat tab lain diketuk, pil lama menutup (clip-path dari kanan, pudar) dan pil baru membuka ke kanan dari ikonnya, label muncul menyusul. Ikon-ikon lain bergeser (translateX) memberi ruang dengan pegas ringan.
- Durasi & easing: geser & buka pil 400ms cubic-bezier(.3,1.3,.5,1) (overshoot kecil) · label pudar 200ms delay 120ms
- Cocok untuk: Bottom navigation yang menampilkan nama halaman aktif, misalnya aplikasi dengan banyak ikon yang kurang jelas.
- Kode: `gallery/demos/tab-bar-18.js`

### `tabbar18-bubble-float` — Bubble Float
- Sumber: Tab Bar · Part 18
- Pemicu: tap
- Gerak: Saat tab diketuk, 8 titik tinta (6 aksen, 2 warna teks, diameter 4–11px) muncul dari ikon dan naik 40–80px sambil melayang ke kanan (−12…+30px), membesar dari 0.3 ke 1, lalu pecah (scale 1.5) dan pudar. Ikon aktif berubah warna aksen dan titik kecil 4px muncul di bawahnya.
- Durasi & easing: tiap gelembung 900–1100ms ease-out · stagger 25ms · warna ikon 200ms
- Cocok untuk: Tab bar yang ingin terasa playful, misalnya tab Favorit/Suka atau aplikasi sosial.
- Kode: `gallery/demos/tab-bar-18.js`

## Tombol & Toggle

### `button5-soft-inset` — Soft Inset
- Sumber: Button · Part 5
- Pemicu: tap
- Gerak: Bayangan timbul di bawah tombol hilang dan berganti bayangan dalam (inner shadow) sehingga pil terlihat tenggelam: scale 0.96, kecerahan turun ke 0.8. Label dan gradien berganti saat paling dalam, lalu tombol muncul kembali ke 1 dengan bayangan luar.
- Durasi & easing: tenggelam 150ms ease-out · tahan ≈100ms · muncul 300ms ease-out · total ≈550ms
- Cocok untuk: Tombol aksi utama bergaya neumorphism/soft UI, misalnya tombol Mulai/Selesai sesi.
- Kode: `gallery/demos/button-5.js`

### `button5-finger-dent` — Finger Dent
- Sumber: Button · Part 5
- Pemicu: tap
- Gerak: Permukaan pil penyok tepat di bawah jari: sisi yang ditekan memipih (scaleY 0.86 dengan titik tumpu di posisi jari) dan muncul bayangan cekung bulat di titik sentuh. Setelah dilepas, pil bergoyang seperti karet (scaleX/scaleY 1.05/0.95 → 0.98/1.02 → 1) sebelum diam. Label berganti saat penyok paling dalam.
- Durasi & easing: penyok 120ms ease-out · goyangan karet ≈500ms (3 osilasi mengecil) · total ≈620ms
- Cocok untuk: Tombol yang ingin terasa fisik dan kenyal, misalnya tombol mulai latihan atau rekam.
- Kode: `gallery/demos/button-5.js`

### `button5-tilt-press` — Tilt Press
- Sumber: Button · Part 5
- Pemicu: tap
- Gerak: Tombol miring 3D ke arah sisi yang ditekan: rotateY ±14° (perspective 400px) sehingga sisi itu terdorong ke belakang dan sisi seberang terangkat, scale 0.97. Lalu tombol bergoyang kembali datar (−5° → 2° → 0°) seperti papan jungkat-jungkit. Label berganti di titik miring terdalam.
- Durasi & easing: miring 140ms ease-out · kembali ≈460ms dengan 2 ayunan mengecil · total ≈600ms
- Cocok untuk: Tombol kartu/aksi yang ingin terasa responsif terhadap posisi jari, misalnya tombol bayar atau konfirmasi.
- Kode: `gallery/demos/button-5.js`

### `button5-haptic-buzz` — Haptic Buzz
- Sumber: Button · Part 5
- Pemicu: tap
- Gerak: Getaran pendek seperti HP: tombol bergeser kiri-kanan ±3px sebanyak 6 kali sambil sedikit mengecil (0.97). Bersamaan, dua pasang busur getar "((  ))" muncul di kedua sisi tombol, bergerak 4px menjauh lalu pudar. Label berganti di awal getaran.
- Durasi & easing: getar 320ms linear (6 siklus ≈53ms) · busur 450ms ease-out, busur luar +60ms
- Cocok untuk: Umpan balik tekan yang meniru haptic di web, misalnya tombol panggil/darurat atau konfirmasi penting.
- Kode: `gallery/demos/button-5.js`

### `button5-pogo-bounce` — Pogo Bounce
- Sumber: Button · Part 5
- Pemicu: tap
- Gerak: Tombol ditekan turun 4px (scale 0.96), lalu melambung ke atas 16px seperti bola, mendarat, memantul lagi 6px, dan mendarat kedua kali. Bayangan menipis saat tombol di udara. Label berganti saat tekanan pertama.
- Durasi & easing: ≈800ms · tekan 100ms · lambung 1 (16px) ≈300ms · lambung 2 (6px) ≈250ms · ease-in-out per segmen
- Cocok untuk: Tombol yang ingin terasa riang, misalnya tombol mulai permainan, Selesai tugas, atau hadiah.
- Kode: `gallery/demos/button-5.js`

### `button5-spring-pop` — Spring Pop
- Sumber: Button · Part 5
- Pemicu: tap
- Gerak: Tombol menyusut ke 0.85 di bawah jari, lalu memegas kembali lebih besar dari semula (1.12), turun ke 0.97, dan mengendap di 1. Label dan gradien berganti saat ukuran paling kecil.
- Durasi & easing: susut 120ms ease-in · pegas ≈480ms (1.12 → 0.97 → 1) · total ≈600ms
- Cocok untuk: Tombol aksi utama serbaguna yang butuh konfirmasi tekan yang jelas, misalnya Simpan, Kirim, atau Selesai.
- Kode: `gallery/demos/button-5.js`

### `checkbox-drag-select` — Drag Select
- Sumber: Checkbox · Part 2
- Pemicu: drag
- Gerak: Tekan kotak pertama lalu seret ke bawah: setiap baris yang dilewati jari langsung tercentang (✓ tergambar 220ms, kotak pop scale 1.15) dan pita sorotan bulat di belakang baris memanjang mengikuti seretan. Jika seretan dimulai dari kotak yang sudah tercentang, semua yang dilewati justru dicentang-hapus.
- Durasi & easing: per kotak: isi 150ms + tick 220ms ease-out · pop 200ms · pita ikut jari
- Cocok untuk: pilih banyak item sekaligus, mis. tandai beberapa jadwal minum obat atau hari praktik
- Kode: `gallery/demos/checkbox-2.js`

### `checkbox-hand-drawn-tick` — Hand-drawn Tick
- Sumber: Checkbox · Part 2
- Pemicu: tap
- Gerak: Ketuk: ikon pensil bergerak ke kotak bergaya sketsa dan menelusuri tanda ✓ tulisan tangan (stroke-dashoffset 1 → 0): goresan pendek turun, lalu goresan panjang naik melewati tepi kanan-atas kotak. Pensil kembali ke posisi semula dan teks "Call the dentist" meredup jadi abu (selesai). Ketuk lagi: centang terhapus mundur dan teks kembali terang.
- Durasi & easing: gores ≈450ms cubic-bezier(.6,0,.4,1) · pensil mengikuti 450ms + kembali 250ms · hapus 250ms
- Cocok untuk: daftar tugas/pengingat pribadi (to-do perawat, catatan kontrol) yang ingin terasa manusiawi
- Kode: `gallery/demos/checkbox-2.js`

### `checkbox-flip-tick` — Flip Tick
- Sumber: Checkbox · Part 2
- Pemicu: tap
- Gerak: Ketuk: kotak terangkat (scale 1.12 dengan bayangan), berputar 180° pada sumbu Y dengan perspektif 300px, dan sisi belakangnya berupa kotak biru bergradasi berisi ✓ putih; lalu turun kembali ke scale 1. Subjudul berganti "Off" → "On · back in stock". Ketuk lagi untuk membalik kembali.
- Durasi & easing: ≈460ms cubic-bezier(.4,0,.2,1) · angkat 0–30%, putar 15–85%, turun 70–100%
- Cocok untuk: toggle langganan/pengingat (mis. "ingatkan saat stok obat tersedia")
- Juga mewakili: `badge-coin-flip` (balik 3D rotateY ke sisi belakang, dipakai di badge)
- Kode: `gallery/demos/checkbox-2.js`

### `checkbox-progress-ring` — Progress Ring
- Sumber: Checkbox · Part 2
- Pemicu: tap
- Gerak: Setiap tugas yang dicentang menambah busur cincin progres sepertiga (stroke-dashoffset) dan angka "n/3" di tengah bergulir. Saat 3/3, angka berubah menjadi lingkaran biru penuh berisi ✓ yang pop (scale 0.5 → 1.15 → 1) dengan cahaya, dan 6 kilau kecil memancar keluar. Menghapus centang mengurangi cincin lagi.
- Durasi & easing: busur ≈420ms cubic-bezier(.2,.8,.2,1) · angka 200ms · pop selesai 320ms spring · kilau 500ms
- Cocok untuk: checklist harian (mis. persiapan pasien pra-operasi) dengan indikator kemajuan
- Kode: `gallery/demos/checkbox-2.js`

### `checkbox-tri-state` — Tri-state
- Sumber: Checkbox · Part 2
- Pemicu: tap
- Gerak: Ketuk berulang: kosong → strip "–" (Some) → ✓ (All) → kosong. Dari kosong, kotak terisi biru (scale 0.85 → 1) dan strip muncul. Dari strip ke ✓, ujung kiri strip menekuk turun membentuk centang (morph path d). Dari ✓ ke kosong, isi memudar. Chip status ikut crossfade: None / Some / All.
- Durasi & easing: isi 180ms ease-out · morph strip → ✓ 300ms cubic-bezier(.34,1.56,.64,1) · chip 150ms
- Cocok untuk: checkbox induk "pilih semua" pada daftar (mis. pilih semua hasil lab untuk dicetak)
- Kode: `gallery/demos/checkbox-2.js`

### `checkbox-pop-burst` — Pop Burst
- Sumber: Checkbox · Part 2
- Pemicu: tap
- Gerak: Ketuk: kotak kosong tertekan (scale 0.85), lalu pop ke 1.15 sambil terisi biru dan ✓ tergambar; bersamaan sebuah cincin mengembang (scale 1 → 1.8, memudar) dan 8 titik warna-warni terlempar radial 24px lalu hilang. Kotak kembali ke 1 dan subjudul berganti "Early access" → "You're in!". Ketuk lagi: kotak kosong tanpa efek.
- Durasi & easing: tekan 100ms · pop 260ms cubic-bezier(.34,1.8,.64,1) · cincin & titik 500ms ease-out
- Cocok untuk: persetujuan atau pendaftaran penting yang pantas dirayakan (mis. ikut program, setuju consent)
- Juga mewakili: `inerr-alert-pop` (ikon meletup dengan percikan; warna merah untuk error)
- Kode: `gallery/demos/checkbox-2.js`

### `iconmorph1-stroke-morph` — Stroke Morph
- Sumber: Icon Morph · Part 1
- Pemicu: tap
- Gerak: Garis-garis ikon sendiri yang berpindah: 3 garis menu berputar ±45° jadi X (garis tengah menyusut ke 0), segitiga Play terbelah dua lalu tiap potongan (clip-path polygon) berubah jadi batang Pause, dan dua garis tanda + berputar dan memendek jadi centang. Semua dengan pegas yang sedikit melewati posisi akhir. Lingkaran latar terisi aksen (scale 0.7→1).
- Durasi & easing: 450ms cubic-bezier(.3,1.6,.5,1) (overshoot) · isi lingkaran 350ms
- Cocok untuk: Tombol ikon dua keadaan yang sering dipakai: buka/tutup menu, putar/jeda media, tambah ke daftar.
- Kode: `gallery/demos/icon-morph-1.js`

### `iconmorph1-spin-swap` — Spin Swap
- Sumber: Icon Morph · Part 1
- Pemicu: tap
- Gerak: Ikon lama berputar −180° sambil mengecil ke 0.3 dan memudar; ikon baru masuk berputar dari 180° ke 0° dan membesar dari 0.3 ke 1 dengan pegas, mulai 100ms setelah ikon lama.
- Durasi & easing: keluar 300ms ease-in · masuk 350ms cubic-bezier(.3,1.4,.5,1) delay 100ms
- Cocok untuk: Ganti ikon status yang ingin terasa hidup, misalnya tombol putar/jeda atau simpan ke favorit.
- Juga mewakili: `stepper-glyph-spin` (ikon berputar 180° sambil berganti)
- Kode: `gallery/demos/icon-morph-1.js`

### `iconmorph1-pen-redraw` — Pen Redraw
- Sumber: Icon Morph · Part 1
- Pemicu: tap
- Gerak: Ikon lama dihapus goresan demi goresan (stroke-dashoffset 0→1), lalu ikon baru digambar ulang oleh "pena" bercahaya: tiap goresan ditarik bergantian berjarak 80ms dengan glow drop-shadow 4px yang memudar, dan isi bentuk padat (Play/Pause) muncul di akhir.
- Durasi & easing: hapus 220ms ease-in · gambar 380ms ease-out per goresan, mulai 200ms, stagger 80ms · glow 600ms
- Cocok untuk: Konfirmasi yang ingin terasa "ditulis tangan", misalnya tanda tangan selesai, tugas ditambahkan, atau langkah onboarding.
- Kode: `gallery/demos/icon-morph-1.js`

### `iconmorph1-melt-drop` — Melt & Drop
- Sumber: Icon Morph · Part 1
- Pemicu: tap
- Gerak: Ikon lama meleleh: memanjang ke bawah (scale 0.8×1.5, turun 6px), kabur (blur 3px), lalu hilang. Ikon baru jatuh dari 16px di atas, mendarat dengan squash (scale 1.2×0.75), memantul kecil (0.95×1.05), lalu diam.
- Durasi & easing: leleh 380ms ease-in · jatuh 420ms ease-out delay 160ms (squash di 60%)
- Cocok untuk: Toggle yang playful atau bertema cairan, misalnya pengingat minum, mode tidur, atau tombol di aplikasi anak.
- Kode: `gallery/demos/icon-morph-1.js`

### `iconmorph1-slice-shift` — Slice Shift
- Sumber: Icon Morph · Part 1
- Pemicu: tap
- Gerak: Ikon dipotong jadi 3 strip horizontal (clip-path). Strip ikon lama bergeser ±12px bergantian kiri/kanan sambil memudar dengan stagger 40ms; strip ikon baru masuk dari arah berlawanan dan menyatu kembali di tengah.
- Durasi & easing: keluar 260ms ease-in, stagger 40ms · masuk 300ms ease-out mulai 140ms, stagger 40ms
- Cocok untuk: Ganti ikon bergaya digital/glitch, misalnya mode privasi, enkripsi, atau aplikasi bertema teknologi.
- Kode: `gallery/demos/icon-morph-1.js`

### `segment-vertical-stack` — Vertical Stack
- Sumber: Segmented Control · Part 2
- Pemicu: tap
- Gerak: Kontrol segmen vertikal di sisi kiri: pill biru meluncur naik/turun ke ukuran terpilih. Panel di kanan ikut: isi lama keluar 10px searah gerak sambil blur 3px dan memudar, isi baru masuk dari sisi berlawanan; bar "Fit" memanjang/memendek ke nilai baru.
- Durasi & easing: pill ≈300ms cubic-bezier(.34,1.56,.64,1) · isi keluar 120ms + masuk 200ms ease-out · bar 300ms
- Cocok untuk: pemilih varian dengan pratinjau detail, mis. pilih dosis dan lihat keterangannya
- Kode: `gallery/demos/segmented-2.js`

### `segment-pressed-keys` — Pressed Keys
- Sumber: Segmented Control · Part 2
- Pemicu: tap
- Gerak: Setiap segmen adalah tombol 3D dengan alas 3px di bawahnya. Tombol yang dipilih turun 3px (menempel ke alas) dan terisi warna aksen, lalu tetap tertekan; tombol sebelumnya naik kembali dengan pantulan kecil.
- Durasi & easing: tekan ≈120ms ease-out · lepas ≈240ms cubic-bezier(.34,1.56,.64,1)
- Cocok untuk: pilihan yang ingin terasa fisik/taktil, mis. pilih shift jaga atau ruang
- Kode: `gallery/demos/segmented-2.js`

### `segment-price-roll` — Price Roll
- Sumber: Segmented Control · Part 2
- Pemicu: tap
- Gerak: Pill isian meluncur ke ukuran terpilih. Harga bergulir seperti odometer: angka lama naik keluar (translateY −100%, blur 2px), angka baru masuk dari bawah. Label "Save %" ikut bergulir lalu pop scale 1 → 1.15 → 1.
- Durasi & easing: pill ≈280ms spring · gulir harga ≈320ms cubic-bezier(.2,.8,.2,1) · pop tag 260ms
- Cocok untuk: harga atau biaya yang berubah karena pilihan, mis. tarif paket pemeriksaan
- Kode: `gallery/demos/segmented-2.js`

### `segment-size-picker` — Size Picker
- Sumber: Segmented Control · Part 2
- Pemicu: tap
- Gerak: Ikon kaus membesar/mengecil sesuai ukuran (S 0.78, M 0.9, L 1.02, XL 1.14) dengan pantulan pegas, huruf ukurannya ikut berganti; pill isian segmen meluncur ke pilihan.
- Durasi & easing: kaus ≈420ms cubic-bezier(.34,1.8,.64,1) · pill ≈280ms spring
- Cocok untuk: pemilih ukuran produk atau skala (mis. ukuran manset tensimeter) yang perlu umpan balik visual
- Kode: `gallery/demos/segmented-2.js`

### `segment-drag-thumb` — Drag Thumb
- Sumber: Segmented Control · Part 2
- Pemicu: drag
- Gerak: Thumb biru bisa diseret di sepanjang trek. Jika ditarik melewati ujung kiri/kanan, thumb meregang seperti karet (scaleX bertambah dengan hambatan 0.4× dari jarak tarik, berjangkar di sisi dalam). Saat dilepas, thumb memantul ke segmen terdekat.
- Durasi & easing: ikut jari (tanpa delay) · snap ≈380ms cubic-bezier(.34,1.56,.64,1)
- Cocok untuk: slider bertahap atau segmen yang bisa digeser, mis. skala nyeri 4 tingkat
- Kode: `gallery/demos/segmented-2.js`

### `stepper-soft-press` — Soft Press
- Sumber: Stepper · Part 1
- Pemicu: tap
- Gerak: Tombol yang diketuk mengempis lembut (scale 1→0.88→1.04→1). Angka lama hilang, angka baru muncul dari kecil (scale 0.3, opacity 0) ke 1.08 lalu 1.
- Durasi & easing: tombol 280ms · angka 300ms ease-out, overshoot 1.08
- Cocok untuk: Stepper jumlah barang di keranjang, jumlah dosis, atau jumlah tamu.
- Kode: `gallery/demos/stepper-1.js`

### `stepper-side-slide` — Side Slide
- Sumber: Stepper · Part 1
- Pemicu: tap
- Gerak: Pil bergeser 3px ke arah tombol. Angka baru meluncur masuk dari sisi tombol yang diketuk (+ dari kanan, − dari kiri) sementara angka lama keluar ke sisi berlawanan; keduanya sempat terlihat bersamaan.
- Durasi & easing: ≈300ms · ease-out (cubic-bezier .2,.8,.2,1) · geser 22px + crossfade
- Cocok untuk: Stepper yang arah perubahannya perlu terasa jelas (tambah vs kurang).
- Kode: `gallery/demos/stepper-1.js`

### `stepper-ripple-reveal` — Ripple Reveal
- Sumber: Stepper · Part 1
- Pemicu: tap
- Gerak: Gelombang berwarna (teal untuk +, violet untuk −) menyebar melingkar dari tombol yang diketuk melintasi seluruh pil (clip-path circle 0→240px). Angka baru terungkap saat tepi gelombang melewatinya, lalu warna gelombang memudar.
- Durasi & easing: gelombang 350ms ease-out · pudar 300ms
- Cocok untuk: Stepper atau pemilih jumlah yang ingin memberi tanda arah lewat warna.
- Kode: `gallery/demos/stepper-1.js`

### `stepper-stretch-pill` — Stretch Pill
- Sumber: Stepper · Part 1
- Pemicu: tap
- Gerak: Pil meregang ke arah tombol yang diketuk (scaleX 1→1.06→0.98→1, titik tumpu di sisi berlawanan) lalu memantul kembali. Angka baru bergoyang seperti jeli (skewX −12°→8°→−4°→0).
- Durasi & easing: ≈450ms · pegas teredam (ease-out)
- Cocok untuk: Stepper di aplikasi yang bernuansa ramah/playful, misalnya jumlah gelas air harian.
- Kode: `gallery/demos/stepper-1.js`

### `stepper-halo-burst` — Halo Burst
- Sumber: Stepper · Part 1
- Pemicu: tap
- Gerak: Cincin bercahaya meledak dari tombol (garis + cincin titik-titik, scale 1→1.7 sambil memudar). Angka baru muncul besar dan buram (scale 1.5, blur 4px, opacity 0.3) lalu mengecil tajam ke ukuran normal.
- Durasi & easing: cincin 450ms ease-out · angka 300ms ease-out
- Cocok untuk: Stepper untuk aksi yang ingin dirayakan, misalnya menambah tiket atau poin.
- Kode: `gallery/demos/stepper-1.js`

### `switch-ghost-trail` — Ghost Trail
- Sumber: Switch · Part 3
- Pemicu: tap
- Gerak: Knob melesat ke sisi lain dan meninggalkan 3 bayangan (afterimage) knob di sepanjang lintasan dengan opacity 0.5/0.35/0.2 yang tertinggal 35ms satu sama lain lalu memudar. Warna track berganti bersamaan.
- Durasi & easing: knob 250ms cubic-bezier(.2,.8,.2,1) · bayangan +35ms bertahap, pudar ≈200ms · warna 250ms
- Cocok untuk: Toggle pengaturan yang ingin terasa cepat dan bertenaga, misalnya mode fokus atau notifikasi.
- Juga mewakili: `pagination-comet-trail` (bayangan sisa (afterimage) di sepanjang lintasan)
- Kode: `gallery/demos/switch-3.js`

### `switch-pixel-teleport` — Pixel Teleport
- Sumber: Switch · Part 3
- Pemicu: tap
- Gerak: Knob pecah menjadi grid piksel 4×4. Piksel-piksel terbang menyeberangi track sebagai awan acak (tiap piksel punya offset dan jeda sendiri), berkumpul lagi di tujuan, lalu menyatu kembali menjadi knob utuh. Warna track berganti di tengah perjalanan.
- Durasi & easing: pecah 80ms · terbang ≈350ms dengan jeda acak 0–60ms · menyatu 100ms · total ≈550ms
- Cocok untuk: Toggle bertema digital/teknologi, misalnya mengaktifkan sinkronisasi atau mode privasi.
- Kode: `gallery/demos/switch-3.js`

### `switch-water-fill` — Water Fill
- Sumber: Switch · Part 3
- Pemicu: tap
- Gerak: Saat On, gelembung kecil naik lalu warna aksen naik dari dasar track seperti air dengan permukaan bergelombang yang terus bergoyang (kotak bersudut bulat 42% yang berputar). Saat Off, air surut ke bawah. Knob meluncur ke sisi tujuan.
- Durasi & easing: air naik/surut 380ms cubic-bezier(.3,.7,.4,1) · gelombang berputar 2.4s linear terus · knob 260ms ease-out · gelembung 400ms
- Cocok untuk: Toggle yang berkaitan dengan cairan/level, misalnya pengingat minum atau infus, atau sekadar toggle yang ramah.
- Kode: `gallery/demos/switch-3.js`

### `switch-tilt-roll` — Tilt & Roll
- Sumber: Switch · Part 3
- Pemicu: tap
- Gerak: Track miring 7° dengan sisi tujuan lebih rendah, knob menggelinding turun (translateX + rotate 360°) sambil makin cepat. Sampai di ujung, knob tergencet ke dinding (scale 0.82 × 1.12) lalu memantul bulat lagi, dan track kembali datar.
- Durasi & easing: miring 120ms · gelinding 340ms ease-in · gencet 60ms + pantul 120ms · total ≈520ms
- Cocok untuk: Toggle yang ingin terasa fisik dan main-main, misalnya di aplikasi kebiasaan/game kecil.
- Kode: `gallery/demos/switch-3.js`

### `switch-glitch-snap` — Glitch Snap
- Sumber: Switch · Part 3
- Pemicu: tap
- Gerak: Knob melompat ke sisi lain dalam 4 langkah patah (steps), selama bergerak tampil RGB split (salinan merah dan cyan bergeser ±3px) dan irisan horizontal yang terpotong (clip-path inset berganti-ganti). Di akhir knob mendarat bersih, warna track berganti tanpa transisi.
- Durasi & easing: total 240ms steps(4) · RGB split + irisan selama gerak · track ganti seketika
- Cocok untuk: Toggle untuk produk bertema cyber/gaming, atau mode developer/debug.
- Kode: `gallery/demos/switch-3.js`

### `switch-confetti-pop` — Confetti Pop
- Sumber: Switch · Part 3
- Pemicu: tap
- Gerak: Saat On, knob meluncur ke kanan lalu 14 potongan konfeti warna-warni menyembur dari knob ke atas dan samping sambil berputar, lalu jatuh dan memudar. Saat Off, knob meluncur ke kiri dan muncul "kepulan debu": cincin 10 titik abu-abu yang mengembang dari knob lalu hilang.
- Durasi & easing: knob 250ms ease-out · konfeti ≈900ms ease-out · debu 350ms ease-out
- Cocok untuk: Toggle yang menandai pencapaian, misalnya mengaktifkan target harian atau menyelesaikan pengaturan.
- Kode: `gallery/demos/switch-3.js`

## Input & Form

### `datepick-halo-trace` — Halo Trace
- Sumber: Date Picker · Part 1
- Pemicu: tap
- Gerak: Kapsul lama memudar. Cincin garis bercahaya menelusuri keliling hari yang diketuk (stroke-dashoffset 1→0, kepala komet terang di ujungnya), lalu kapsul biru terisi dari dalam cincin (fade + scale 0.85→1) dan cincin memudar.
- Durasi & easing: lama pudar 150ms · telusur 350ms ease-in-out · isi 200ms ease-out
- Cocok untuk: Pemilih tanggal janji temu atau jadwal kontrol pasien.
- Kode: `gallery/demos/date-picker-1.js`

### `datepick-rise-land` — Rise & Land
- Sumber: Date Picker · Part 1
- Pemicu: tap
- Gerak: Kapsul hari yang diketuk terangkat 8px dengan bayangan dalam dan sedikit membesar (scale 1.06), lalu mendarat kembali dengan efek gepeng (scaleY 0.92 → 1). Kapsul lama memudar turun di saat yang sama.
- Durasi & easing: naik 180ms ease-out · turun 200ms ease-in · gepeng 120ms · lama pudar 200ms
- Cocok untuk: Pemilih hari pada kalender mingguan aplikasi jadwal atau kebiasaan.
- Kode: `gallery/demos/date-picker-1.js`

### `datepick-side-wipe` — Side Wipe
- Sumber: Date Picker · Part 1
- Pemicu: tap
- Gerak: Warna kapsul lama tersapu keluar ke arah hari baru (clip-path dari sisi berlawanan), lalu warna menyapu masuk ke kapsul baru dari sisi yang sama, sehingga seolah warnanya mengalir searah perpindahan.
- Durasi & easing: sapu keluar 175ms ease-in · sapu masuk 175ms ease-out (total ≈350ms)
- Cocok untuk: Pemilih tanggal atau tab yang perlu menunjukkan arah maju/mundur.
- Kode: `gallery/demos/date-picker-1.js`

### `datepick-dot-swell` — Dot Swell
- Sumber: Date Picker · Part 1
- Pemicu: tap
- Gerak: Titik kecil di bawah tanggal yang diketuk membengkak ke atas menjadi kapsul penuh (scale 0.15×0.08 → 1 dari tepi bawah, ujung tetap membulat). Kapsul lama menyusut kembali menjadi titik dan hilang.
- Durasi & easing: bengkak 350ms ease-out (cubic-bezier .2,.8,.2,1) · susut 250ms ease-in
- Cocok untuk: Kalender mingguan yang menandai hari berjadwal dengan titik, misalnya jadwal minum obat.
- Kode: `gallery/demos/date-picker-1.js`

### `datepick-twist-in` — Twist In
- Sumber: Date Picker · Part 1
- Pemicu: tap
- Gerak: Kapsul baru berputar masuk dari seperempat putaran (rotate 90°→0, scale 0.6→1) dengan pegas, sementara kapsul lama berputar pergi ke arah lain (rotate −90°, scale 0.6) sambil memudar.
- Durasi & easing: masuk 350ms pegas (cubic-bezier .34,1.4,.64,1) · keluar 250ms ease-in
- Cocok untuk: Pemilih tanggal di aplikasi yang bernuansa playful, atau penanda pilihan pada grid kecil.
- Kode: `gallery/demos/date-picker-1.js`

### `inerr-zigzag-underline` — Zigzag Underline
- Sumber: Input Error · Part 3
- Pemicu: tap
- Gerak: Garis bawah merah zigzag tergambar di bawah teks dari kiri ke kanan dengan amplitudo besar, lalu “berdengung”: amplitudonya berayun bolak-balik dan meluruh (scaleY 1→−0.7→0.5→−0.3→0.08) hingga menjadi garis lurus tipis merah. Border dan label ikut merah, pesan galat muncul.
- Durasi & easing: gambar 200ms · dengung 400ms meluruh · ulang: Continue → galat → benar → reset
- Cocok untuk: Validasi field email/NIK/nomor HP saat tombol kirim ditekan.
- Kode: `gallery/demos/input-error-3.js`

### `inerr-message-drop` — Message Drop
- Sumber: Input Error · Part 3
- Pemicu: tap
- Gerak: Pesan galat merah jatuh dari bawah field (translateY −10px→0) lalu berayun seperti bandul dengan tumpuan di kiri (rotate −6°→4°→−2.5°→1°→0) sampai diam. Border field berubah merah.
- Durasi & easing: ≈600ms · ayunan teredam, ease-out
- Cocok untuk: Pesan bantuan/galat di bawah field form yang ingin terasa ringan dan ramah.
- Kode: `gallery/demos/input-error-3.js`

### `inerr-red-echo` — Red Echo
- Sumber: Input Error · Part 3
- Pemicu: tap
- Gerak: Border field berkedip merah bercahaya dua kali; setiap kedipan melepaskan garis gema (outline) yang mengembang keluar (scale 1→1.05×1.35) sambil memudar.
- Durasi & easing: dua kedip @150ms (total 600ms) · gema 450ms ease-out, jeda 300ms
- Cocok untuk: Galat yang muncul berulang atau field kritis, misalnya kata sandi salah saat login.
- Juga mewakili: `copy-outline-echo` (garis tepi beriak keluar; warna hijau untuk sukses, merah untuk error)
- Kode: `gallery/demos/input-error-3.js`

### `inerr-letter-jitter` — Letter Jitter
- Sumber: Input Error · Part 3
- Pemicu: tap
- Gerak: Setiap huruf melompat (translateY −5px) dan bergetar miring (±6°) sambil memerah, bergiliran dari kiri ke kanan seperti gelombang, lalu kembali ke posisi dan warnanya semula.
- Durasi & easing: tiap huruf 350ms · stagger 30ms · total ±600ms
- Cocok untuk: Galat format teks (email, kode promo) di form yang ingin terasa hidup.
- Juga mewakili: `copy-char-wave` (huruf meloncat beruntun dan berganti warna)
- Kode: `gallery/demos/input-error-3.js`

### `inerr-tilt-wobble` — Tilt Wobble
- Sumber: Input Error · Part 3
- Pemicu: tap
- Gerak: Seluruh field bergoyang miring kiri-kanan seperti jeli (rotate +3° → −2.5° → +1.5° → −0.5° → 0) lalu diam, sementara border dan pesan berubah merah.
- Durasi & easing: ≈600ms · pegas teredam, ease-out
- Cocok untuk: Alternatif “shake” yang lebih lembut untuk galat login atau PIN salah.
- Kode: `gallery/demos/input-error-3.js`

### `pwstr-flow-fill` — Flow Fill
- Sumber: Password Strength · Part 1
- Pemicu: ketik
- Gerak: Satu isian cair dengan kepala bercahaya meluncur sepanjang bilah, melewati celah antar-segmen, lalu berhenti di segmen terakhir level baru; warnanya berbaur ke warna kekuatan baru (merah → oranye → biru → teal). Saat dikosongkan, isian mundur.
- Durasi & easing: ≈400ms per segmen · ease-in-out · warna 400ms
- Cocok untuk: Indikator kekuatan kata sandi di form daftar/ganti sandi.
- Kode: `gallery/demos/password-strength-1.js`

### `pwstr-spark-feed` — Spark Feed
- Sumber: Password Strength · Part 1
- Pemicu: ketik
- Gerak: Setiap kali huruf diketik, percikan putih kecil melompat dari kursor di field, melengkung turun ke segmen berikutnya (±300ms), dan segmen itu baru terisi (scaleX 0→1) saat percikan tiba. Segmen yang sudah terisi berganti warna mengikuti level.
- Durasi & easing: percikan 300ms ease-in-out (lintasan busur) · jeda 120ms antarpercikan · isi segmen 150ms
- Cocok untuk: Meter sandi yang ingin menunjukkan hubungan sebab-akibat antara ketikan dan kekuatan.
- Kode: `gallery/demos/password-strength-1.js`

### `pwstr-chain-light` — Chain Light
- Sumber: Password Strength · Part 1
- Pemicu: ketik
- Gerak: Setiap kali level berubah, semua segmen terisi menyala ulang satu per satu dari kiri ke kanan seperti rantai lampu: tiap segmen berkilat putih terang (brightness 2.2 + glow) lalu turun ke warna kekuatannya.
- Durasi & easing: tiap segmen 260ms ease-out · stagger 70ms
- Cocok untuk: Meter kekuatan sandi, atau indikator langkah yang ingin menegaskan perubahan level.
- Kode: `gallery/demos/password-strength-1.js`

### `pwstr-liquid-link` — Liquid Link
- Sumber: Password Strength · Part 1
- Pemicu: ketik
- Gerak: Isian merambat seperti cairan: “leher” tipis keluar dari segmen terisi menyeberangi celah (scaleX 0→1), segmen berikutnya terisi dari kiri dengan sedikit menggembung (scaleY 1.3→1), lalu lehernya putus (menipis ke 0). Saat dihapus, segmen menyusut menjadi titik dan hilang.
- Durasi & easing: per segmen 300ms (leher 150ms, isi 200ms, putus 120ms) · hapus 300ms ease-in
- Cocok untuk: Progres bertahap yang ingin terasa organik, misalnya kekuatan sandi atau langkah onboarding.
- Kode: `gallery/demos/password-strength-1.js`

### `rating-star-bounce` — Star Bounce
- Sumber: Rating · Part 2
- Pemicu: tap
- Gerak: Ketuk bintang ke-5: bintang terisi kuning dari kiri ke kanan dengan jeda 70ms; tiap bintang melompat (translateY −8px, scale 1.25) saat terisi. Bintang terakhir juga berputar 360° dan memancarkan 10 titik confetti warna-warni ke segala arah, lalu label "Amazing!" pop di atas.
- Durasi & easing: tiap hop 320ms cubic-bezier(.34,1.56,.64,1) · stagger 70ms · confetti 600ms ease-out · total ≈900ms
- Cocok untuk: rating kepuasan layanan setelah kunjungan, memberi rasa senang saat memberi 5 bintang
- Kode: `gallery/demos/rating-2.js`

### `rating-score-pill` — Score Pill
- Sumber: Rating · Part 2
- Pemicu: tap
- Gerak: Deret angka 0–10. Ketuk satu angka: sorotan berbentuk pill meluncur ke angka itu dengan pegas, warnanya berubah sesuai suasana (0–6 merah muda, 7–8 kuning "Good", 9–10 hijau toska "Love it!"), dan label di atasnya ikut meluncur serta berganti teks.
- Durasi & easing: pill ≈340ms cubic-bezier(.34,1.56,.64,1) · warna 250ms
- Cocok untuk: survei NPS / kemungkinan merekomendasikan klinik (0–10)
- Kode: `gallery/demos/rating-2.js`

### `rating-mood-gauge` — Mood Gauge
- Sumber: Rating · Part 2
- Pemicu: drag
- Gerak: Gauge setengah lingkaran berwarna ungu → toska → kuning. Seret ujung jarum di sepanjang busur: jarum berputar mengikuti jari (−90° sampai +90°), warna wajah di tengah berubah, mulutnya melengkung dari cemberut ke senyum (path morph), dan label berganti Awful / Bad / Okay / Good / Love it!.
- Durasi & easing: ikut jari tanpa delay · autoplay sapuan 900ms ease-in-out · label crossfade saat berganti zona
- Cocok untuk: skala nyeri, suasana hati, atau kepuasan pasien yang diisi dengan menggeser
- Kode: `gallery/demos/rating-2.js`

### `rating-rating-tags` — Rating Tags
- Sumber: Rating · Part 2
- Pemicu: tap
- Gerak: Setelah memberi bintang, judul "What went well?" muncul dan chip Fast, Friendly, Clean, Tasty pop satu per satu dari kiri (scale 0.6 → 1, jeda 70ms). Ketuk chip: chip terisi aksen dan ikon ✓ masuk dari kiri (lebar 0 → 10px) sehingga chip melebar.
- Durasi & easing: chip pop 260ms cubic-bezier(.34,1.56,.64,1) · stagger 70ms · ✓ 220ms ease-out
- Cocok untuk: umpan balik cepat setelah rating (mis. "dokter ramah", "antrean cepat")
- Kode: `gallery/demos/rating-2.js`

### `rating-score-wheel` — Score Wheel
- Sumber: Rating · Part 2
- Pemicu: drag
- Gerak: Picker angka 1–10 berbentuk drum 3D: angka di atas/bawah kotak pilihan rotateX ±25° per langkah, mengecil dan memudar. Seret atau flick vertikal: drum berputar mengikuti jari dengan momentum lalu menempel ke angka terdekat dengan pegas kecil. Warna kotak dan label berubah: Poor (merah muda) → Fair (oranye) → Good (biru) → Great! (toska).
- Durasi & easing: ikut jari · snap ≈420ms cubic-bezier(.25,1.3,.5,1) · autoplay flick 3 → 9
- Cocok untuk: pemilih skor atau angka (skala nyeri 1–10, jumlah dosis) dengan gestur roda
- Kode: `gallery/demos/rating-2.js`

### `search-spotlight-dim` — Spotlight Dim
- Sumber: Search · Part 3
- Pemicu: tap
- Gerak: Saat pencarian aktif, konten halaman (kartu) meredup ke opacity 0.3 dan bar terangkat 3px dengan bayangan lebih tebal. Daftar saran meluncur turun dari balik bar (translateY −24px → 0 dengan clip-path terbuka dari atas). Saat memilih, baris lain meredup, daftar meluncur naik kembali ke balik bar dan halaman terang lagi.
- Durasi & easing: redup 200ms · angkat bar 200ms ease-out · daftar 260ms ease-out · tutup 200ms ease-in
- Cocok untuk: Pencarian global yang perlu memusatkan perhatian, misalnya cari pasien di atas daftar jadwal.
- Kode: `gallery/demos/search-3.js`

### `field3-corner-lock` — Corner Lock
- Sumber: Text Field · Part 3
- Pemicu: tap
- Gerak: Di setiap ketukan (fokus dan kirim), empat siku sudut berbentuk L terbang masuk dari 8px di luar tiap sudut lalu "mengunci" pas di sudut kolom dengan sedikit overshoot. Siku bercahaya sebentar lalu memudar ke border.
- Durasi & easing: masuk 220ms cubic-bezier(.3,1.5,.5,1) · tahan 300ms · pudar 250ms
- Cocok untuk: Menandai fokus/konfirmasi di kolom penting, misalnya input NIK atau nomor rekam medis.
- Juga mewakili: `datepick-snap-brackets` (empat siku sudut terbang lalu mengunci)
- Kode: `gallery/demos/text-field-3.js`

### `field3-rubber-border` — Rubber Border
- Sumber: Text Field · Part 3
- Pemicu: tap
- Gerak: Border kolom penyok ke dalam tepat di titik ketuk (tepi atas melengkung ±7px dengan lembah di posisi x ketukan), lalu bergoyang balik seperti karet dalam 2–3 osilasi yang meredam. Terjadi saat ketuk kolom dan saat ketuk tombol kirim.
- Durasi & easing: ≈500ms · pegas teredam (amplitudo 7px · e^(−t/120ms) · periode ≈280ms)
- Cocok untuk: Kolom input yang ingin terasa lentur dan responsif terhadap sentuhan, misalnya form di aplikasi mobile.
- Kode: `gallery/demos/text-field-3.js`

### `field3-key-pop` — Key Pop
- Sumber: Text Field · Part 3
- Pemicu: ketik
- Gerak: Setiap huruf yang diketik memunculkan "gelembung tuts" kotak bulat biru berisi huruf itu di bawah caret: scale 0.3 → 1.1 → 1 sambil naik 6px, lalu memudar. Saat kirim, ikon centang melompat masuk ke tombol (turun dari −16px dengan pantulan kecil) dan tombol berubah mint.
- Durasi & easing: gelembung 380ms ease-out per huruf (huruf tiap 60ms) · centang 320ms dengan pantulan
- Cocok untuk: Input PIN/OTP atau kolom pendek di layar sentuh, agar pengguna yakin hurufnya masuk.
- Kode: `gallery/demos/text-field-3.js`

### `field3-spark-keys` — Spark Keys
- Sumber: Text Field · Part 3
- Pemicu: ketik
- Gerak: Setiap huruf yang diketik melempar 5 percikan kecil warna-warni ke atas dari caret; percikan melayang ±10px lalu hilang. Saat verifikasi, ledakan konfeti 10 garis radial memancar dari tombol yang berubah menjadi centang mint.
- Durasi & easing: percikan 280ms ease-out per huruf · ledakan 420ms ease-out
- Cocok untuk: Form yang ingin terasa menyenangkan, misalnya pendaftaran akun atau input kode undangan.
- Kode: `gallery/demos/text-field-3.js`

### `field3-flip-verify` — Flip Verify
- Sumber: Text Field · Part 3
- Pemicu: tap
- Gerak: Saat verifikasi, seluruh kolom berbalik pada sumbu horizontal (rotateX 0 → 90°, tepat di tengah terlihat tipis seperti garis) dan muncul sisi belakangnya yang mint "terverifikasi". Mengetuk kolom yang sudah terverifikasi membaliknya lagi ke sisi biru yang kosong untuk mengetik ulang.
- Durasi & easing: setengah pertama 130ms ease-in · setengah kedua 140ms ease-out · total ≈270ms
- Cocok untuk: Konfirmasi status yang tegas, misalnya kolom email/telepon yang sudah diverifikasi OTP.
- Juga mewakili: `iconmorph1-tumble-flip` (balik 3D rotateX menukar keadaan, dipakai di tombol ikon)
- Kode: `gallery/demos/text-field-3.js`

### `field3-scan-sweep` — Scan Sweep
- Sumber: Text Field · Part 3
- Pemicu: tap
- Gerak: Batang cahaya vertikal menyapu kolom dari kiri ke kanan. Di belakang batang (sebelah kiri) kolom sudah dicat dengan status baru, di depannya masih status lama (salinan status lama dipotong clip-path inset dari kiri). Dipakai saat kosongkan untuk mengetik dan saat terverifikasi.
- Durasi & easing: sapuan 280ms cubic-bezier(.4,0,.2,1) · batang cahaya 14px
- Cocok untuk: Perubahan status yang ingin terlihat "dipindai", misalnya verifikasi kartu BPJS atau kode voucher.
- Kode: `gallery/demos/text-field-3.js`

### `field-floating-label` — Floating Label
- Sumber: Text Field · Part 4
- Pemicu: fokus
- Gerak: Saat fokus, placeholder "PASSWORD" mengecil ke 0.78 dan naik ke garis border atas, border terputus di belakang label (notch) dan menebal serta menggelap. Saat kosong dan blur, label turun lagi ke dalam field.
- Durasi & easing: label 150ms cubic-bezier(.2,.8,.2,1) · border 150ms · ketik 60ms/huruf
- Cocok untuk: Field login atau form data pasien yang ringkas tanpa label terpisah di atasnya.
- Kode: `gallery/demos/text-field-4.js`

### `field-underline-grow` — Underline Grow
- Sumber: Text Field · Part 4
- Pemicu: fokus
- Gerak: Saat fokus, placeholder menghilang dan garis bawah gelap 2px di dalam tepi bawah field tumbuh dari tengah ke kedua sisi (scaleX 0 → 1). Saat blur, garis menyusut kembali ke titik tengah. Border tetap tipis dan terang.
- Durasi & easing: garis 200ms ease-out (masuk) · 160ms ease-in (keluar)
- Cocok untuk: Penanda fokus yang halus untuk form panjang, misalnya formulir pendaftaran pasien.
- Kode: `gallery/demos/text-field-4.js`

### `field-glow-border` — Glow Border
- Sumber: Text Field · Part 4
- Pemicu: fokus
- Gerak: Selama field fokus, segmen terang sepanjang ±20% keliling berjalan searah jarum jam mengitari border bulat (atas kiri→kanan, turun, bawah kanan→kiri) seperti komet, berulang terus. Segmen hilang saat blur.
- Durasi & easing: 1 putaran 1,1 dtk linear, berulang · muncul/hilang 150ms
- Cocok untuk: Menarik perhatian ke field yang sedang aktif, misalnya field PIN atau kode OTP.
- Kode: `gallery/demos/text-field-4.js`

### `field-live-validation` — Live Validation
- Sumber: Text Field · Part 4
- Pemicu: ketik
- Gerak: Saat isian kurang dari 8 karakter, border berubah putus-putus, lencana "!" hitam meletup (scale 0 → 1.15 → 1) dan teks bantu "8+ CHARACTERS" muncul di bawah. Begitu mencapai 8 karakter, border jadi utuh dan gelap, lencana berputar berganti tanda centang, teks bantu menjadi "LOOKS GOOD".
- Durasi & easing: lencana pop 200ms spring · putar ganti ikon 250ms · teks bantu fade+geser 150ms
- Cocok untuk: Validasi kata sandi atau NIK saat diketik, tanpa menunggu tombol kirim.
- Kode: `gallery/demos/text-field-4.js`

### `field-password-reveal` — Password Reveal
- Sumber: Text Field · Part 4
- Pemicu: tap
- Gerak: Ketuk ikon mata: garis coret pada ikon tertarik keluar, lalu titik-titik berubah menjadi huruf satu per satu dari kiri ke kanan, tiap karakter berputar/naik ke tempatnya (rotateX). Ketuk lagi untuk menyembunyikan dengan urutan yang sama.
- Durasi & easing: ikon 150ms · stagger 50ms per karakter · flip tiap karakter 100ms ease-out
- Cocok untuk: Tombol lihat/sembunyikan kata sandi pada halaman login.
- Kode: `gallery/demos/text-field-4.js`

### `field-char-counter` — Char Counter
- Sumber: Text Field · Part 4
- Pemicu: ketik
- Gerak: Cincin progres kecil di bawah kanan field terisi searah jarum jam setiap karakter diketik (maks 12). Saat sisa ≤ 3, cincin membesar 1.4× dan angka sisa (3, 2, 1) muncul di kirinya; karakter melebihi batas ditolak dengan field bergetar.
- Durasi & easing: isi cincin 150ms ease-out per karakter · membesar 200ms spring · getar 240ms
- Cocok untuk: Batas panjang isian, misalnya catatan singkat, judul, atau kode dengan panjang tetap.
- Kode: `gallery/demos/text-field-4.js`

## List & Gesture

### `accordion-expand-all` — Expand All
- Sumber: Accordion · Part 2
- Pemicu: tap
- Gerak: Tombol "Expand all" membuka baris Overview, Ingredients, Steps satu per satu dari atas ke bawah (jeda 80ms), chevron berputar 180° dan teks isi turun 4px sambil muncul. "Collapse all" menutup dengan urutan terbalik, dari bawah ke atas.
- Durasi & easing: tiap baris ≈280ms cubic-bezier(.2,.8,.2,1) · stagger 80ms
- Cocok untuk: buka/tutup semua bagian rekam medis atau FAQ sekaligus
- Kode: `gallery/demos/accordion-2.js`

### `accordion-side-panels` — Side Panels
- Sumber: Accordion · Part 2
- Pemicu: tap
- Gerak: Empat panel berdiri berdampingan. Panel yang diketuk melebar (flex-grow 1 → 6) sementara panel yang tadinya terbuka melipat jadi strip tipis dengan label vertikal. Judul dan "n trails" muncul setelah lebar hampir selesai.
- Durasi & easing: lebar ≈460ms cubic-bezier(.65,0,.35,1) · teks fade 200ms delay 200ms
- Cocok untuk: memilih satu kategori dari beberapa dengan pratinjau, mis. pilih poli/klinik
- Kode: `gallery/demos/accordion-2.js`

### `accordion-step-timeline` — Step Timeline
- Sumber: Accordion · Part 2
- Pemicu: tap
- Gerak: Stepper vertikal: tekan "Continue" → isi langkah aktif menutup, lingkarannya terisi dan muncul ✓ dengan pop (scale 0.4 → 1.15 → 1), garis penghubung terisi dari atas ke bawah, lalu langkah berikut aktif (cincin aksen) dan isinya terbuka. "Back" membalik urutan.
- Durasi & easing: tutup 280ms · ✓ pop 260ms · garis 240ms · buka langkah berikut 280ms (total ≈600ms)
- Cocok untuk: alur checkout atau pendaftaran pasien bertahap (data diri → jadwal → pembayaran)
- Kode: `gallery/demos/accordion-2.js`

### `accordion-accent-bar` — Accent Bar
- Sumber: Accordion · Part 2
- Pemicu: tap
- Gerak: Membuka baris memunculkan bar aksen 3px di sisi kirinya yang tumbuh dari atas ke bawah (scaleY 0 → 1), nomor baris "02" berubah warna aksen, latar baris menerang, chevron berputar 180°, dan isi terbuka. Menutup = bar menyusut ke atas.
- Durasi & easing: bar & isi ≈300ms cubic-bezier(.2,.8,.2,1)
- Cocok untuk: daftar tahapan proyek atau protokol klinis bernomor yang bisa dibuka satu per satu
- Kode: `gallery/demos/accordion-2.js`

### `accordion-price-breakdown` — Price Breakdown
- Sumber: Accordion · Part 2
- Pemicu: tap
- Gerak: Ketuk baris Total: kartu terbuka, baris Subtotal, Shipping, Tax, Discount turun 6px dan muncul berurutan (jeda 50ms), lalu tiap nominal menghitung naik dari $0 ke nilainya. Chevron berputar. Ketuk lagi untuk menutup.
- Durasi & easing: buka 280ms · stagger 50ms · hitung naik ≈550ms ease-out (cubic)
- Cocok untuk: rincian tagihan pasien atau biaya tindakan yang bisa dibuka dari total
- Kode: `gallery/demos/accordion-2.js`

### `accordion-chart-reveal` — Chart Reveal
- Sumber: Accordion · Part 2
- Pemicu: tap
- Gerak: Baris statistik "Views this week 4.2k ▲12%" terbuka menjadi grafik batang: 7 batang (M–S) tumbuh dari garis dasar (scaleY 0 → 1) berurutan kiri ke kanan dengan jeda 60ms dan overshoot kecil; batang tertinggi (Sabtu) bergradasi aksen. Menutup = batang menyusut lalu baris menutup.
- Durasi & easing: buka 280ms · tiap batang 320ms cubic-bezier(.34,1.56,.64,1) · stagger 60ms
- Cocok untuk: ringkasan statistik di dasbor yang bisa dibuka, mis. kunjungan pasien per hari
- Kode: `gallery/demos/accordion-2.js`

### `swipe-card-swipe` — Card Swipe
- Sumber: Swipe Actions · Part 4
- Pemicu: drag
- Gerak: Baris teratas terangkat (scale 1.02 + bayangan), lalu digeser ke kanan 40px sambil berputar 7° dan cap "LIKE" mengecil dari 1.3 ke 1. Setelah itu kartu terlempar keluar ke kanan sambil memudar, baris di bawahnya naik satu baris.
- Durasi & easing: angkat 60ms · geser 270ms ease-out · lempar 130ms ease-in · baris naik 200ms
- Cocok untuk: Swipe untuk menyukai/menyetujui item, misalnya menandai jadwal pasien sudah dikonfirmasi.
- Kode: `gallery/demos/swipe-actions-4.js`

### `swipe-swipe-to-pin` — Swipe to Pin
- Sumber: Swipe Actions · Part 4
- Pemicu: drag
- Gerak: Baris digeser ke kanan 56px dan membuka panel arsir di kiri berisi ikon pin yang membesar dari 0.4. Baris memantul kembali ke 0, ikon pin kecil muncul di samping jam, lalu baris naik keluar sambil blur dan memudar.
- Durasi & easing: geser 250ms ease-out · balik 300ms spring (overshoot) · keluar 220ms ease-in
- Cocok untuk: Menyematkan percakapan atau pasien prioritas ke atas daftar.
- Kode: `gallery/demos/swipe-actions-4.js`

### `swipe-peek-hint` — Peek Hint
- Sumber: Swipe Actions · Part 4
- Pemicu: tap
- Gerak: Baris bergeser ke kiri 48px dengan sedikit pantulan dan mengintipkan panel arsir berisi ikon tempat sampah yang bergoyang ±12°. Lalu isi baris memudar sehingga seluruh baris jadi arsir (hapus), dan baris di bawahnya naik.
- Durasi & easing: intip 220ms spring · tahan 250ms · pudar 120ms · baris naik 200ms
- Cocok untuk: Memberi petunjuk bahwa baris bisa digeser untuk dihapus, misalnya saat pertama kali membuka daftar.
- Kode: `gallery/demos/swipe-actions-4.js`

### `swipe-liquid-delete` — Liquid Delete
- Sumber: Swipe Actions · Part 4
- Pemicu: drag
- Gerak: Baris bergeser ke kiri 70px dan dari tepi kanannya keluar gumpalan cairan gelap: titik kecil memanjang jadi kapsul berleher tipis berisi ikon tempat sampah. Leher menipis lalu putus, baris lenyap, kapsul mengecil jadi titik lalu pecah jadi 8 partikel melingkar.
- Durasi & easing: geser + gumpalan 300ms ease-out · leher putus 80ms · pecah partikel 300ms ease-out
- Cocok untuk: Hapus item dengan umpan balik yang terasa "fisik", misalnya menghapus draf catatan.
- Kode: `gallery/demos/swipe-actions-4.js`

### `swipe-snooze-clock` — Snooze Clock
- Sumber: Swipe Actions · Part 4
- Pemicu: drag
- Gerak: Baris bergeser ke kiri 72px membuka panel arsir berisi jam kecil berlabel "6 PM"; jarum jam berputar dua putaran saat panel terbuka. Isi baris lalu memudar dan baris dihapus, baris di bawahnya naik.
- Durasi & easing: geser 260ms ease-out · jarum 720° 600ms ease-out · pudar 120ms · baris naik 200ms
- Cocok untuk: Tunda pengingat atau tugas sampai jam tertentu, misalnya "ingatkan kontrol pasien jam 6 sore".
- Kode: `gallery/demos/swipe-actions-4.js`

### `swipe-inline-undo` — Inline Undo
- Sumber: Swipe Actions · Part 4
- Pemicu: tap
- Gerak: Baris digeser ke kiri 48px memperlihatkan tempat sampah, lalu berganti menjadi bar "DELETED … UNDO" dengan garis hitung mundur di bawah yang menyusut dari kanan ke kiri. Ketuk UNDO untuk mengembalikan baris; bila waktu habis baris dihapus dan baris lain naik.
- Durasi & easing: geser 220ms ease-out · bar masuk 180ms · hitung mundur 2,5 dtk linear (di video dipercepat) · kolaps 200ms
- Cocok untuk: Hapus yang bisa dibatalkan tanpa dialog konfirmasi, misalnya menghapus jadwal atau obat dari resep.
- Kode: `gallery/demos/swipe-actions-4.js`

### `swipedel-bin-lid-flip` — Bin Lid Flip
- Sumber: Swipe to Delete · Part 3
- Pemicu: drag
- Gerak: Menggeser baris ke kiri membuka area merah berikon tempat sampah di kanan. Saat dilepas, baris meluncur keluar ke kiri, bilah merah memenuhi baris dengan ikon bergeser ke tengah dan tutupnya terbuka (rotate −30°), lalu bilah merah menutup ke atas menjadi garis tipis dan hilang; baris di bawahnya naik mengisi.
- Durasi & easing: keluar 200ms ease-in · tutup sampah 150ms · bilah menutup 300ms · baris lain naik 300ms ease-out
- Cocok untuk: Hapus item di daftar pesan, notifikasi, atau daftar antrean pasien.
- Kode: `gallery/demos/swipe-delete-3.js`

### `swipedel-pop-to-dot` — Pop to Dot
- Sumber: Swipe to Delete · Part 3
- Pemicu: drag
- Gerak: Baris yang digeser berubah merah muda. Saat dilepas, isinya memudar dan baris menyusut menjadi pil merah lalu titik (scale 0.4×0.5 → 0.05, sudut membulat), kemudian titik itu pecah menjadi cincin 8 percikan yang memudar; baris lain naik.
- Durasi & easing: menyusut 300ms ease-in · percikan 250ms ease-out · naik 300ms
- Cocok untuk: Hapus item kecil seperti notifikasi, tag, atau item checklist.
- Kode: `gallery/demos/swipe-delete-3.js`

### `swipedel-blade-slice` — Blade Slice
- Sumber: Swipe to Delete · Part 3
- Pemicu: drag
- Gerak: Garis “pisau” merah muda bercahaya mengikuti jari dari kanan ke kiri tepat di tengah baris. Saat dilepas, garis menuntaskan potongan, lalu baris terbelah dua: separuh atas naik 6px dan separuh bawah turun 6px sambil memudar; baris lain naik.
- Durasi & easing: potong 150ms · belah 300ms ease-out · naik 300ms
- Cocok untuk: Hapus item dengan nuansa tegas, misalnya membatalkan janji atau tugas.
- Kode: `gallery/demos/swipe-delete-3.js`

### `swipedel-elastic-snap` — Elastic Snap
- Sumber: Swipe to Delete · Part 3
- Pemicu: drag
- Gerak: Saat digeser, baris meregang seperti karet (scaleX naik hingga ±1.25 dengan tumpuan di kanan, teks sedikit kabur). Saat dilepas, baris lepas dan melesat ke kiri (translateX −110%, scaleX 1.35, blur 2px) dalam sekejap; baris lain naik.
- Durasi & easing: regang mengikuti jari · lepas 150ms ease-in · naik 300ms
- Cocok untuk: Hapus cepat di daftar yang sering dibersihkan, misalnya kotak masuk atau keranjang.
- Kode: `gallery/demos/swipe-delete-3.js`

### `swipedel-genie-bin` — Genie Bin
- Sumber: Swipe to Delete · Part 3
- Pemicu: drag
- Gerak: Lingkaran merah kecil berikon sampah muncul di kiri baris (scale 0→1). Baris lalu tersedot ke dalamnya seperti efek genie: bentuknya menyempit menjadi trapesium (clip-path polygon) sambil mengecil ke arah kiri (scale 1→0.04) dan memudar, lalu ikon sampah ikut hilang.
- Durasi & easing: ikon muncul 150ms · sedot 400ms ease-in · ikon hilang 150ms · naik 300ms
- Cocok untuk: Pindahkan item ke tempat sampah/arsip dengan jejak visual ke mana item pergi.
- Juga mewakili: `send-genie-outbox` (efek genie tersedot ke ikon, dipakai saat kirim surel)
- Kode: `gallery/demos/swipe-delete-3.js`

## Kartu & Konten

### `carousel1-pill-dots` — Pill Dots
- Sumber: Carousel · Part 1
- Pemicu: tap
- Gerak: Kartu bergeser horizontal satu langkah (180px) dengan tetangga mengintip. Pada indikator, titik aktif melebar dari 6px menjadi pill 18px (clip-path) dan berwarna aksen, sementara pill sebelumnya menyusut kembali menjadi titik abu.
- Durasi & easing: kartu ≈400ms cubic-bezier(.2,.8,.2,1) · titik ≈300ms ease
- Cocok untuk: carousel banner atau tips kesehatan di beranda aplikasi
- Kode: `gallery/demos/carousel-1.js`

### `carousel1-snap-peek` — Snap Peek
- Sumber: Carousel · Part 1
- Pemicu: drag
- Gerak: Kartu tengah ukuran penuh, kartu tetangga mengintip di sisi dengan scale 0.9 dan redup. Seret: jalur mengikuti jari; lepas lewat 40px maka menempel ke kartu berikut dengan pegas yang lewat ±8px lalu diam, kartu baru membesar ke 1 dan terang.
- Durasi & easing: ikut jari · snap ≈480ms cubic-bezier(.34,1.35,.64,1)
- Cocok untuk: pemilih kartu (mis. paket layanan atau dokter) yang digeser satu per satu
- Kode: `gallery/demos/carousel-1.js`

### `carousel1-cover-scale` — Cover Scale
- Sumber: Carousel · Part 1
- Pemicu: tap
- Gerak: Gaya coverflow: kartu tengah besar dan terang; kartu samping scale 0.78, rotateY ±28° menghadap ke dalam, bergeser ±78px dan redup 50%. Ketuk kanan/kiri: semua kartu bergeser bersama, kartu baru tegak, membesar dan terang.
- Durasi & easing: ≈460ms cubic-bezier(.65,0,.35,1) · perspektif 600px
- Cocok untuk: pemilih album, template laporan, atau sampul dengan fokus pada satu item
- Kode: `gallery/demos/carousel-1.js`

### `carousel1-story-bars` — Story Bars
- Sumber: Carousel · Part 1
- Pemicu: tap
- Gerak: Cerita penuh dengan bar progres bersegmen di atas. Bar aktif terisi linear dari kiri ke kanan (scaleX 0 → 1) lalu otomatis pindah ke cerita berikut. Ketuk kanan = maju (bar sekarang langsung penuh), ketuk kiri = mundur (bar dikosongkan). Gambar baru masuk dengan crossfade + scale 1.04 → 1.
- Durasi & easing: bar 3000ms linear per cerita · ganti gambar 260ms ease-out
- Cocok untuk: pengumuman/edukasi pasien berformat story, atau tur fitur baru
- Kode: `gallery/demos/carousel-1.js`

### `carousel1-parallax` — Parallax
- Sumber: Carousel · Part 1
- Pemicu: tap
- Gerak: Saat kartu bergeser satu langkah, gambar di dalam kartu digeser balik 50% dari gerak bingkainya (maks ±90px), sehingga gambar tertinggal dan terasa punya kedalaman. Label "n of 4" ikut berganti.
- Durasi & easing: ≈520ms cubic-bezier(.2,.8,.2,1) · faktor paralaks 0.5
- Cocok untuk: galeri hero atau kartu destinasi/fasilitas yang ingin terasa premium
- Kode: `gallery/demos/carousel-1.js`

### `carousel1-page-counter` — Page Counter
- Sumber: Carousel · Part 1
- Pemicu: tap
- Gerak: Kartu bergeser ke slide berikut; di sampingnya angka halaman besar bergulir vertikal (angka lama naik keluar, baru masuk dari bawah; mundur = arah terbalik), nama slide crossfade, dan garis progres biru memanjang ke n/4 (scaleX).
- Durasi & easing: kartu ≈420ms · gulir angka ≈320ms cubic-bezier(.2,.8,.2,1) · garis 320ms ease-out
- Cocok untuk: galeri bernomor atau langkah panduan yang perlu menunjukkan posisi (2/4)
- Kode: `gallery/demos/carousel-1.js`

### `carousel2-cube-turn` — Cube Turn
- Sumber: Carousel · Part 2
- Pemicu: tap
- Gerak: Halaman berputar seperti sisi kubus: kartu sekarang rotateY 0 → −90° berporos di tepi kanan sambil bergeser −100%, kartu berikut masuk dari rotateY 90° berporos di tepi kiri. Sisi yang menjauh menggelap (brightness 1 → 0.4).
- Durasi & easing: ≈520ms cubic-bezier(.65,0,.35,1) · perspektif 600px
- Cocok untuk: galeri atau langkah onboarding yang ingin terasa 3D dan berbobot
- Kode: `gallery/demos/carousel-2.js`

### `carousel2-thumbnail-strip` — Thumbnail Strip
- Sumber: Carousel · Part 2
- Pemicu: tap
- Gerak: Ketuk thumbnail: gambar besar bergeser horizontal ke slide yang sesuai (translateX −i×100%), dan cincin biru pada deretan thumbnail meluncur ke thumbnail yang diketuk dengan pantulan kecil.
- Durasi & easing: slide ≈420ms cubic-bezier(.2,.8,.2,1) · cincin ≈320ms cubic-bezier(.34,1.56,.64,1)
- Cocok untuk: galeri foto produk atau foto luka/rontgen dengan pratinjau kecil
- Kode: `gallery/demos/carousel-2.js`

### `carousel2-onboarding` — Onboarding
- Sumber: Carousel · Part 2
- Pemicu: tap
- Gerak: Isi langkah lama keluar ke kiri 24px sambil memudar, isi baru masuk dari kanan 24px dengan blur 2px; indikator titik aktif memanjang jadi pill. Di langkah terakhir tombol kecil "Next" melebar jadi "Get started" (clip-path), labelnya crossfade. Back membalik arah.
- Durasi & easing: isi keluar 150ms ease-in + masuk 240ms ease-out · tombol melebar 320ms cubic-bezier(.34,1.3,.64,1)
- Cocok untuk: alur onboarding atau panduan pertama kali membuka aplikasi klinik
- Kode: `gallery/demos/carousel-2.js`

### `carousel2-infinite-loop` — Infinite Loop
- Sumber: Carousel · Part 2
- Pemicu: drag
- Gerak: Kartu "Day 1–6" berjajar dengan tetangga mengintip di kiri-kanan. Tiap geser (atau ketuk) jalur bergeser satu kartu (130px); setelah Day 6 langsung muncul Day 1 tanpa lompatan karena kartu terdepan dipindah ke belakang saat animasi selesai.
- Durasi & easing: ≈420ms cubic-bezier(.2,.8,.2,1)
- Cocok untuk: carousel promo atau jadwal mingguan yang berputar tanpa ujung
- Kode: `gallery/demos/carousel-2.js`

### `carousel2-stack-slide` — Stack Slide
- Sumber: Carousel · Part 2
- Pemicu: tap
- Gerak: Tumpukan kartu: kartu teratas meluncur keluar ke kiri (translateX −120%, rotate −8°, memudar), kartu di bawahnya naik ke depan dari scale 0.94 / geser 12px ke posisi penuh, kartu ketiga ikut maju satu tingkat. Kartu yang keluar kembali ke belakang tumpukan.
- Durasi & easing: keluar ≈340ms ease-in · naik ≈360ms cubic-bezier(.34,1.4,.64,1)
- Cocok untuk: kartu rekomendasi atau antrean pasien yang diproses satu per satu
- Kode: `gallery/demos/carousel-2.js`

### `carousel2-circular-wheel` — Circular Wheel
- Sumber: Carousel · Part 2
- Pemicu: tap
- Gerak: Item lingkaran duduk di roda besar (radius 140px, jarak 45°). Ketuk/geser memutar seluruh roda sehingga item berikut menggelinding ke puncak: item terpilih membesar ke 1.3× dengan cincin biru, item lain turun mengikuti busur dan meredup. Label dan "n/4" di bawah ikut berganti.
- Durasi & easing: ≈560ms cubic-bezier(.65,0,.35,1) dengan settle kecil
- Cocok untuk: pemilih kategori atau mode yang ingin terasa playful, mis. pilih jenis layanan
- Kode: `gallery/demos/carousel-2.js`

## Modal, Sheet & Tooltip

### `sheet-stacked-sheets` — Stacked Sheets
- Sumber: Bottom Sheet · Part 2
- Pemicu: tap
- Gerak: Ketuk "Notifications": sheet kedua naik dari bawah (translateY 100% → 0) dengan pegas, sementara sheet pertama mundur ke scale 0.94, naik 8px dan meredup ke 60% sehingga mengintip di atasnya. Tombol ‹ membalik: sheet kedua turun, sheet pertama kembali normal.
- Durasi & easing: ≈420ms cubic-bezier(.32,1.25,.5,1) (overshoot kecil)
- Cocok untuk: pengaturan bertingkat di mobile, mis. Pengaturan → Notifikasi pengingat obat
- Kode: `gallery/demos/bottom-sheet-2.js`

### `sheet-map-peek` — Map Peek
- Sumber: Bottom Sheet · Part 2
- Pemicu: drag
- Gerak: Sheet di atas peta mula-mula hanya mengintip 48px ("3 cafés nearby"). Seret pegangannya ke atas: sheet mengikuti jari lalu menempel ke posisi terbuka dengan pegas, dan baris daftar (Moon Café, Leaf & Bean, Corner Brew) naik 12px dan muncul satu per satu. Seret turun untuk kembali mengintip.
- Durasi & easing: ikut jari · snap ≈420ms cubic-bezier(.32,1.2,.5,1) · baris stagger 80ms, 260ms ease-out
- Cocok untuk: peta lokasi klinik/apotek terdekat dengan daftar yang bisa ditarik
- Kode: `gallery/demos/bottom-sheet-2.js`

### `sheet-full-screen` — Full Screen
- Sumber: Bottom Sheet · Part 2
- Pemicu: drag
- Gerak: Tarik sheet "Reviews" ke puncak: sheet naik mengisi layar, sudut atas radius 16px menjadi 0 (persegi), pegangan memudar dan muncul header dengan tombol "Done". Done atau tarik turun mengembalikannya menjadi sheet bersudut bulat.
- Durasi & easing: ikut jari · snap ≈400ms cubic-bezier(.32,1.15,.5,1) · radius & header ikut progres
- Cocok untuk: daftar ulasan, riwayat, atau catatan panjang yang bisa dibuka penuh
- Kode: `gallery/demos/bottom-sheet-2.js`

### `sheet-resize-steps` — Resize Steps
- Sumber: Bottom Sheet · Part 2
- Pemicu: tap
- Gerak: Satu sheet melewati tiga langkah: "Pick a size" (pendek) → "Pick a color" + tombol Add to bag (lebih tinggi) → "✓ Added to bag" (pendek). Tiap langkah isi lama memudar 120ms, isi baru masuk, dan tinggi sheet menyesuaikan dengan pegas (overshoot ±6px).
- Durasi & easing: isi keluar 120ms + masuk 200ms · tinggi ≈440ms cubic-bezier(.32,1.3,.5,1)
- Cocok untuk: alur pemesanan/registrasi singkat di sheet, mis. pilih jadwal → konfirmasi → selesai
- Kode: `gallery/demos/bottom-sheet-2.js`

### `sheet-backdrop-blur` — Backdrop Blur
- Sumber: Bottom Sheet · Part 2
- Pemicu: drag
- Gerak: Saat sheet "Filters" ditarik naik, layar galeri di belakangnya makin blur (0 → 8px) dan meredup (brightness 1 → 0.65) sebanding dengan progres tarikan. Turunkan sheet dan latar kembali tajam.
- Durasi & easing: ikut jari · snap ≈400ms cubic-bezier(.32,1.2,.5,1) · blur mengikuti posisi sheet
- Cocok untuk: panel filter atau aksi yang perlu fokus di atas konten, mis. filter daftar pasien
- Kode: `gallery/demos/bottom-sheet-2.js`

### `sheet-scroll-inside` — Scroll Inside
- Sumber: Bottom Sheet · Part 2
- Pemicu: scroll
- Gerak: Gulir daftar di dalam sheet: judul besar "Messages" (rata kiri) mengecil ke 0.6× dan memudar sementara judul kecil di tengah header muncul, mengikuti 40px pertama guliran. Gulir kembali ke atas dan judul besar muncul lagi.
- Durasi & easing: langsung mengikuti scroll (scroll-linked) · autoplay gulir 700ms ease-in-out
- Cocok untuk: sheet berisi daftar panjang (pesan, riwayat obat) dengan header yang menghemat ruang
- Kode: `gallery/demos/bottom-sheet-2.js`

### `dialog-scale-pop` — Scale Pop
- Sumber: Dialog · Part 1
- Pemicu: tap
- Gerak: Dialog muncul dari scale 0.72 ke 1 dengan overshoot lembut (±1.04) sambil fade-in, scrim gelap memudar di belakang. Saat ditutup dialog mengecil ke 0.9 dan memudar.
- Durasi & easing: masuk ≈320ms cubic-bezier(.34,1.56,.64,1) · keluar ≈180ms ease-in
- Cocok untuk: konfirmasi hapus data (mis. hapus berkas hasil lab atau jadwal pasien)
- Kode: `gallery/demos/dialog-1.js`

### `dialog-spring-drop` — Spring Drop
- Sumber: Dialog · Part 1
- Pemicu: tap
- Gerak: Dialog jatuh dari atas (translateY −160px ke 0) dengan pegas: lewat 8px ke bawah lalu memantul −3px dan diam. Cancel mengangkatnya kembali ke atas, Delete menjatuhkannya ke bawah sambil miring 6°.
- Durasi & easing: masuk ≈450ms ease-out pegas · keluar ≈260ms ease-in
- Cocok untuk: konfirmasi hapus data (mis. hapus berkas hasil lab atau jadwal pasien)
- Kode: `gallery/demos/dialog-1.js`

### `dialog-hinge-swing` — Hinge Swing
- Sumber: Dialog · Part 1
- Pemicu: tap
- Gerak: Dialog berengsel di tepi atas (transform-origin atas): berayun turun 3D dari rotateX −90° ke 0 dengan perspektif 500px, lewat sedikit ke +8° lalu diam. Saat ditutup berayun naik lagi ke −90°.
- Durasi & easing: masuk ≈450ms ease-out · keluar ≈260ms ease-in
- Cocok untuk: konfirmasi hapus data (mis. hapus berkas hasil lab atau jadwal pasien)
- Kode: `gallery/demos/dialog-1.js`

### `dialog-line-unfold` — Line Unfold
- Sumber: Dialog · Part 1
- Pemicu: tap
- Gerak: Sebuah garis aksen bercahaya 2px melebar dari tengah (scaleX 0→1), lalu dialog terbuka vertikal dari garis itu (clip-path inset 50%→0) sementara garisnya memudar. Penutupan memutar urutan: dialog menyempit jadi garis, garis mengecil hilang.
- Durasi & easing: garis ≈160ms · buka ≈240ms ease-out (total ≈400ms) · tutup ≈300ms ease-in
- Cocok untuk: konfirmasi hapus data (mis. hapus berkas hasil lab atau jadwal pasien)
- Juga mewakili: `menu5-line-expand` (garis memanjang lalu membuka jadi panel, dipakai di dropdown); `tooltip-fold-open` (garis memanjang lalu membuka jadi panel, dipakai di tooltip)
- Kode: `gallery/demos/dialog-1.js`

### `dialog-soft-focus` — Soft Focus
- Sumber: Dialog · Part 1
- Pemicu: tap
- Gerak: Dialog datang dari blur 12px, scale 1.06 dan opacity 0 menjadi tajam, sementara aplikasi di belakangnya ikut blur 3px dan meredup. Saat ditutup dialog kembali kabur lalu hilang dan latar menajam lagi.
- Durasi & easing: masuk ≈320ms ease-out · keluar ≈220ms ease-in · blur latar transisi 300ms
- Cocok untuk: konfirmasi hapus data (mis. hapus berkas hasil lab atau jadwal pasien)
- Juga mewakili: `search-blur-focus` (masuk dari blur ke tajam, dipakai di search bar)
- Kode: `gallery/demos/dialog-1.js`

### `dialog-wobble-in` — Wobble In
- Sumber: Dialog · Part 1
- Pemicu: tap
- Gerak: Dialog tumbuh dari scale 0.3 dengan goyangan jeli: scale (1.08, 0.92) → (0.95, 1.05) → (1.02, 0.98) → 1. Saat ditutup ia gepeng (scaleY 0.6 lalu 0, scaleX 1.2) dan menghilang.
- Durasi & easing: masuk ≈560ms bouncy · keluar ≈240ms ease-in
- Cocok untuk: konfirmasi hapus data (mis. hapus berkas hasil lab atau jadwal pasien)
- Juga mewakili: `search-jelly-pop` (muncul membesar dengan goyang jelly)
- Kode: `gallery/demos/dialog-1.js`

### `menu-bottom-sheet` — Bottom Sheet
- Sumber: Menu · Part 6
- Pemicu: tap
- Gerak: Lembar bawah setinggi ±62% naik dari tepi bawah dengan tepi atas melengkung bergaris 2px dan pegangan kecil, lalu sedikit mengendap. Isinya tiga tab ikon (HOME/EXPLORE/LIBRARY); ikon yang diketuk terisi hitam, kemudian lembar turun lagi.
- Durasi & easing: naik 380ms ease-out dengan overshoot kecil (cubic-bezier .2,.9,.25,1.08) · turun 280ms ease-in
- Cocok untuk: Menu aksi atau navigasi di layar ponsel yang mudah dijangkau jempol.
- Kode: `gallery/demos/menu-6.js`

### `tooltip-arrow-grow` — Arrow Grow
- Sumber: Tooltip · Part 1
- Pemicu: tap
- Gerak: Gelembung lama memudar, blur 4px dan mengecil. Gelembung baru tumbuh dari ujung panahnya (transform-origin di bawah tengah): scale 0.2 → 1.06 → 1 dengan opacity 0 → 1, latar tombol aktif ikut berpindah.
- Durasi & easing: keluar 100ms · masuk 250ms spring overshoot 6%
- Cocok untuk: Tooltip label ikon di toolbar editor atau aksi baris tabel.
- Kode: `gallery/demos/tooltip-1.js`

### `tooltip-glide-follow` — Glide Follow
- Sumber: Tooltip · Part 1
- Pemicu: tap
- Gerak: Hanya ada satu gelembung yang meluncur mendatar ke tombol berikutnya. Panah bergerak lebih dulu (220ms), badan gelembung menyusul lebih lambat (320ms) dengan sedikit overshoot, dan teks label crossfade di tengah jalan.
- Durasi & easing: panah 220ms ease-out · badan 320ms spring · teks crossfade 160ms
- Cocok untuk: Petunjuk yang mengikuti pilihan aktif, misalnya penanda langkah di tab atau segmented control.
- Kode: `gallery/demos/tooltip-1.js`

### `tooltip-type-on` — Type On
- Sumber: Tooltip · Part 1
- Pemicu: tap
- Gerak: Label lama dihapus huruf demi huruf (backspace) dengan caret berkedip, lalu gelembungnya blur keluar. Gelembung baru muncul dengan blur-in berisi caret kosong, kemudian label baru diketik satu huruf per 60ms.
- Durasi & easing: hapus 33ms/huruf · blur keluar-masuk 100ms · ketik 60ms/huruf · caret kedip 1s
- Cocok untuk: Tooltip atau label status yang berganti teks, misalnya status simpan "Menyimpan… / Tersimpan".
- Kode: `gallery/demos/tooltip-1.js`

### `tooltip-elastic-drop` — Elastic Drop
- Sumber: Tooltip · Part 1
- Pemicu: tap
- Gerak: Gelembung baru jatuh dari 20px di atas dalam keadaan memanjang (scale 0.9×1.15) dan blur, lalu gepeng saat mendarat (scale 1.12×0.8) dan memantul kembali ke 1. Gelembung lama turun sedikit sambil memudar.
- Durasi & easing: masuk 380ms elastis (squash & stretch) · keluar 150ms
- Cocok untuk: Tooltip atau badge yang ingin terasa playful, misalnya hint onboarding atau notifikasi poin.
- Juga mewakili: `pwstr-block-drop` (jatuh lalu memipih saat mendarat)
- Kode: `gallery/demos/tooltip-1.js`

### `tooltip-ink-bloom` — Ink Bloom
- Sumber: Tooltip · Part 1
- Pemicu: tap
- Gerak: Tetes tinta kecil naik dari tombol (translateY 34px → 0, scale 0.35 → 1) menjadi lingkaran, lalu mekar mendatar menjadi gelembung persegi bulat (clip-path inset membuka). Teks muncul terakhir; gelembung lama menyusut jadi tetes dan tenggelam ke tombolnya.
- Durasi & easing: naik 120ms ease-out · mekar 150ms · teks 100ms · keluar 200ms ease-in
- Cocok untuk: Tooltip yang terasa "lahir" dari tombol, misalnya bantuan pada tombol aksi utama (FAB).
- Kode: `gallery/demos/tooltip-1.js`

## Loading & Skeleton

### `progress-liquid-wave` — Liquid Wave
- Sumber: Progress · Part 1
- Pemicu: load/loop
- Gerak: Bar terisi seperti cairan: ujung depannya berupa gelembung elips yang bergoyang (scaleX 1 → 1.6 → 0.8 → 1.3 → 1) saat bergerak, dan 3 gelembung kecil naik di dalam isian lalu pecah. Setelah berhenti, ujungnya mendatar kembali.
- Durasi & easing: isi 420ms ease-out per langkah · goyangan ujung 600ms · gelembung 500ms
- Cocok untuk: Progres unggah/unduh yang ingin terasa hidup, misalnya mengunggah hasil lab atau foto pasien.
- Kode: `gallery/demos/progress-1.js`

### `progress-block-build` — Block Build
- Sumber: Progress · Part 1
- Pemicu: load/loop
- Gerak: Untuk tiap kenaikan, 5 balok kecil bersudut bulat muncul satu per satu di kanan isian (scale 0 → 1, jeda 50ms), lalu menyatu menjadi bar mulus: celah tertutup saat isian utama menyusul dan balok memudar.
- Durasi & easing: balok 140ms ease-out, stagger 50ms · menyatu 150ms · total ≈550ms
- Cocok untuk: Progres bertahap yang jelas per bagian, misalnya proses unggah beberapa berkas berkas klaim.
- Kode: `gallery/demos/progress-1.js`

### `progress-candy-stripes` — Candy Stripes
- Sumber: Progress · Part 1
- Pemicu: load/loop
- Gerak: Saat bar mengisi, garis-garis diagonal 45° muncul di atas isian dan berlari melintasinya (background-position bergerak terus). Setelah isian berhenti, garis memudar dalam ≈300ms dan bar kembali polos.
- Durasi & easing: isi 420ms ease-out · garis berlari 0.6s linear berulang · muncul 70ms, pudar 300ms
- Cocok untuk: Progres yang sedang aktif bekerja, misalnya sinkronisasi data rekam medis.
- Kode: `gallery/demos/progress-1.js`

### `progress-spring-overshoot` — Spring Overshoot
- Sumber: Progress · Part 1
- Pemicu: load/loop
- Gerak: Isian bar memegas melewati targetnya sekitar 9% lebar track, mundur ke −3%, maju lagi +1%, lalu diam di nilai yang benar, seperti pegas teredam (ζ ≈ 0.45).
- Durasi & easing: ≈550ms · overshoot +9% → −3% → +1% → target
- Cocok untuk: Progres yang ingin terasa energik, misalnya langkah onboarding atau skor kelengkapan profil.
- Kode: `gallery/demos/progress-1.js`

### `progress-comet-glow` — Comet Glow
- Sumber: Progress · Part 1
- Pemicu: load/loop
- Gerak: Kepala bercahaya putih (radial glow 22px, lebih besar dari tinggi bar) melesat di ujung isian ke nilai baru sambil menebar 4 percikan kecil di belakangnya, lalu kepala meredup setelah sampai.
- Durasi & easing: melesat 400ms ease-out · kepala pudar 200ms · percikan 350ms · total ≈600ms
- Cocok untuk: Progres singkat yang perlu menarik mata, misalnya pengiriman resep atau rujukan.
- Kode: `gallery/demos/progress-1.js`

### `pullrefresh-top-line` — Top Line
- Sumber: Pull to Refresh · Part 3
- Pemicu: drag
- Gerak: Garis tipis di atas daftar tumbuh dari tengah ke dua sisi sebanding jarak tarik (scaleX 0→1). Saat dilepas, kilau cahaya berlari di sepanjang garis selama memuat; setelah selesai garis berubah teal lalu memudar, daftar memantul kembali dan pos baru muncul di atas dengan sorotan.
- Durasi & easing: tarik mengikuti jari · kilau 600ms linear berulang · memuat ≈700ms · selesai 300ms · daftar kembali 300ms ease-out
- Cocok untuk: Muat ulang feed, daftar pasien, atau kotak masuk di aplikasi mobile.
- Kode: `gallery/demos/pull-refresh-3.js`

### `pullrefresh-spring-coil` — Spring Coil
- Sumber: Pull to Refresh · Part 3
- Pemicu: drag
- Gerak: Pegas zigzag biru menggantung di atas daftar dan meregang vertikal mengikuti tarikan (scaleY 0.25→1). Saat dilepas, pegas memantul (memendek–memanjang ±2 kali, teredam) selama memuat, lalu memudar; pos baru muncul di atas.
- Durasi & easing: regang mengikuti jari · pantul 600ms teredam · memuat ≈700ms · pudar 300ms
- Cocok untuk: Pull-to-refresh bergaya playful untuk aplikasi konsumen atau gamifikasi.
- Kode: `gallery/demos/pull-refresh-3.js`

### `pullrefresh-sync-spin` — Sync Spin
- Sumber: Pull to Refresh · Part 3
- Pemicu: drag
- Gerak: Ikon refresh muncul dan berputar sebanding tarikan (0→270°, opacity 0→1). Saat dilepas, ikon berputar terus selama memuat, lalu berganti menjadi lingkaran hijau bercentang yang meletup (scale 0→1.2→1) sebelum memudar; pos baru muncul di atas.
- Durasi & easing: putar 600ms/putaran linear · memuat ≈700ms · centang 300ms pegas
- Cocok untuk: Sinkronisasi data (rekam medis, jadwal) yang perlu konfirmasi “berhasil”.
- Kode: `gallery/demos/pull-refresh-3.js`

### `pullrefresh-chevron-stack` — Chevron Stack
- Sumber: Pull to Refresh · Part 3
- Pemicu: drag
- Gerak: Tiga chevron bertumpuk menyala satu per satu dari atas ke bawah seiring tarikan (abu-abu → aksen). Saat dilepas, cahaya berlari turun melewati ketiganya dua kali; setelah selesai, ketiganya merapat menjadi satu chevron lalu memudar.
- Durasi & easing: nyala per ⅓ tarikan · lari cahaya 2× (300ms, stagger 100ms) · rapat 300ms
- Cocok untuk: Petunjuk arah tarik yang jelas untuk pengguna baru, misalnya daftar antrean.
- Kode: `gallery/demos/pull-refresh-3.js`

### `pullrefresh-avatar-drop` — Avatar Drop
- Sumber: Pull to Refresh · Part 3
- Pemicu: drag
- Gerak: Avatar penulis pos berikutnya (lingkaran berwarna + titik hijau) mengintip turun dari atas seiring tarikan (translateY −24px→0, opacity 0→1). Saat dilepas avatar berdenyut selama memuat, lalu jatuh ke baris barunya yang meluncur masuk di puncak daftar.
- Durasi & easing: intip mengikuti jari · denyut 600ms · jatuh 300ms ease-in · baris baru 300ms ease-out
- Cocok untuk: Feed sosial atau chat: memberi petunjuk siapa yang punya kabar baru.
- Kode: `gallery/demos/pull-refresh-3.js`

### `pullrefresh-logo-trace` — Logo Trace
- Sumber: Pull to Refresh · Part 3
- Pemicu: drag
- Gerak: Garis luar logo heksagon tergambar sedikit demi sedikit seiring tarikan (stroke-dashoffset 1→0). Saat dilepas, logo terisi warna aksen dengan titik putih di tengah dan berputar 60°, lalu mengecil dan hilang ketika pos baru masuk.
- Durasi & easing: gambar mengikuti jari · isi + putar 500ms ease-in-out · kecil 250ms ease-in
- Cocok untuk: Pull-to-refresh bermerek: logo klinik/aplikasi sebagai indikator.
- Kode: `gallery/demos/pull-refresh-3.js`

### `skeleton-blur-focus` — Blur Focus
- Sumber: Skeleton Loading · Part 1
- Pemicu: tap
- Gerak: Kiriman lama blur (0 → 8px) sambil memudar menjadi blok abu-abu lembut. Setelah jeda, kiriman baru muncul dalam keadaan blur 8px dan opacity 0.3, lalu menajam ke fokus penuh.
- Durasi & easing: keluar 150ms · tahan skeleton 300ms · fokus masuk 320ms ease-out
- Cocok untuk: Memuat ulang kartu atau feed (refresh data pasien, ganti halaman daftar) tanpa kedipan kosong.
- Kode: `gallery/demos/skeleton-1.js`

### `skeleton-bar-morph` — Bar Morph
- Sumber: Skeleton Loading · Part 1
- Pemicu: tap
- Gerak: Saat memuat, garis bawah berwarna muncul di bawah setiap teks lalu menebal menjadi bar abu-abu. Saat data datang, avatar dan gambar muncul dulu, bar abu-abu menyusut tingginya menjadi garis bawah 2px bergradien, teks naik keluar dari garis (translateY 6px → 0), lalu garis memudar.
- Durasi & easing: bar ↔ garis 200ms ease-out · teks naik 180ms · garis pudar 200ms
- Cocok untuk: Memuat daftar atau detail berisi banyak teks, misalnya ringkasan rekam medis atau feed artikel.
- Kode: `gallery/demos/skeleton-1.js`

### `skeleton-type-reveal` — Type Reveal
- Sumber: Skeleton Loading · Part 1
- Pemicu: tap
- Gerak: Kiriman meredup menjadi skeleton. Avatar dan gambar muncul lebih dulu, lalu setiap baris diketik bergantian dari atas ke bawah (nama, waktu, judul, deskripsi, statistik): caret berjalan di depan dan bar abu-abu di kanannya terpotong habis seiring huruf terisi.
- Durasi & easing: pudar 150ms · ketik ±14ms/huruf, baris berurutan · total ±1 dtk
- Cocok untuk: Konten hasil AI atau ringkasan otomatis yang "ditulis" ke layar, misalnya ringkasan kunjungan pasien.
- Kode: `gallery/demos/skeleton-1.js`

### `skeleton-mosaic-resolve` — Mosaic Resolve
- Sumber: Skeleton Loading · Part 1
- Pemicu: tap
- Gerak: Kiriman lama memecah menjadi piksel kasar (4 → 8 → 12px) lalu menjadi blok skeleton berpiksel yang berkilau. Kiriman baru muncul dalam piksel 12px dan menajam bertahap 12 → 6 → 3px → tajam, bertangga (bukan halus).
- Durasi & easing: 3 langkah × 80ms keluar · kilau 600ms · 3 langkah × 80ms masuk (steps)
- Cocok untuk: Memuat gambar atau kartu bergambar dengan kesan retro/digital, misalnya galeri hasil pemindaian.
- Kode: `gallery/demos/skeleton-1.js`

### `skeleton-flip-tiles` — Flip Tiles
- Sumber: Skeleton Loading · Part 1
- Pemicu: tap
- Gerak: Setiap blok berputar seperti kartu pada sumbu horizontal (rotateX 0 → 90°, ganti sisi, 90° → 0): saat memuat sisi konten berganti ke sisi abu-abu dari atas ke bawah, lalu kiriman baru membalik kembali berurutan avatar → nama → gambar → waktu → judul → deskripsi → statistik.
- Durasi & easing: flip tiap blok 100ms · stagger 35ms atas → bawah · tahan skeleton 330ms
- Cocok untuk: Memuat dasbor berisi banyak kartu atau ubin angka, misalnya ubin statistik harian klinik.
- Kode: `gallery/demos/skeleton-1.js`

### `skeleton-comet-outline` — Comet Outline
- Sumber: Skeleton Loading · Part 1
- Pemicu: tap
- Gerak: Kiriman memudar ke skeleton, lalu pada semua blok sekaligus seberkas cahaya aksen menelusuri garis tepinya (stroke-dashoffset, mulai dari tepi kanan) sampai lingkarannya tertutup dan berpendar. Konten baru lalu mengisi dari dalam dan garis tepi memudar.
- Durasi & easing: pudar 150ms · telusur 400ms ease-in-out · isi 200ms · garis pudar 250ms
- Cocok untuk: Status "sedang menyiapkan" yang terasa aktif, misalnya saat sistem menyusun laporan atau hasil lab.
- Kode: `gallery/demos/skeleton-1.js`

## Feedback & Notifikasi

### `copy-select-sweep` — Select Sweep
- Sumber: Copy to Clipboard · Part 1
- Pemicu: tap
- Gerak: Sorotan seleksi teks biru lengkap dengan dua pegangan menyapu teks tautan dari kiri ke kanan (clip-path), seolah teks dipilih; setelah itu tombol berubah hijau “✓ Copied”. Setelah ±1.4 detik seleksi hilang dan tombol kembali ke “Copy”.
- Durasi & easing: sapuan 300ms ease-out · tahan 1400ms · kembali 200ms
- Cocok untuk: Tombol salin tautan undangan, nomor rekam medis, atau kode referensi.
- Kode: `gallery/demos/copy-clipboard-1.js`

### `copy-ghost-fly` — Ghost Fly
- Sumber: Copy to Clipboard · Part 1
- Pemicu: tap
- Gerak: Salinan transparan teks tautan (chip “hantu”) terangkat dari field dan terbang melengkung ke tombol (naik 22px di tengah lintasan, mengecil ke 0.3 sambil memudar). Saat tiba, tombol meletup (scale 1→1.12→1) dengan 4 percikan dan berubah hijau “✓ Copied”.
- Durasi & easing: terbang 350ms ease-in-out · letup 300ms pegas · tahan 1400ms
- Cocok untuk: Salin kode/ID ke clipboard dengan jejak visual “isi ini masuk ke clipboard”.
- Juga mewakili: `rating-score-fly` (salinan terbang melengkung ke target lalu target meletup)
- Kode: `gallery/demos/copy-clipboard-1.js`

### `copy-pill-stretch` — Pill Stretch
- Sumber: Copy to Clipboard · Part 1
- Pemicu: tap
- Gerak: Tombol meregang ke kiri menutupi seluruh field menjadi bilah hijau lebar bertuliskan “✓ Link copied” (clip-path dari posisi tombol ke lebar penuh), dan centangnya tergambar. Setelah ±1.4 detik bilah menyusut kembali menjadi tombol “Copy”.
- Durasi & easing: regang 350ms ease-out (cubic-bezier .2,.8,.2,1) · centang 200ms · tahan 1400ms · susut 250ms ease-in
- Cocok untuk: Konfirmasi salin yang paling jelas di layar ponsel, misalnya tautan pembayaran.
- Kode: `gallery/demos/copy-clipboard-1.js`

### `badge-spring-scale` — Spring Scale
- Sumber: Notification Badge · Part 1
- Pemicu: tap
- Gerak: Badge muncul dengan pegas: scale 0 → 1.3 → 0.92 → 1. Tiap hitungan baru membuat badge menggembung ke 1.25 lalu memantul kembali ke 1. Saat dikosongkan, badge mengecil ke 0.
- Durasi & easing: muncul 350ms spring · gembung 300ms · hilang 150ms ease-in
- Cocok untuk: Badge jumlah pesan atau tugas baru, misalnya hasil lab baru di aplikasi dokter.
- Kode: `gallery/demos/notif-badge-1.js`

### `badge-gooey-drip` — Gooey Drip
- Sumber: Notification Badge · Part 1
- Pemicu: tap
- Gerak: Badge keluar dari tengah ikon seperti cairan kental: titik kecil di pusat ikon meluncur ke sudut kanan atas sambil memanjang (scale 0.9 × 1.25), lalu memipih (1.15 × 0.85) dan membulat, diikuti tetesan kecil yang menyusul. Tiap hitungan baru, tetesan mengalir dari pusat ikon ke badge dan badge menggembung. Saat dikosongkan, badge tersedot kembali ke pusat ikon.
- Durasi & easing: keluar 450ms ease-out · tetesan 300ms (jeda 80ms) · tersedot 380ms ease-in
- Cocok untuk: Badge di ikon aplikasi bernuansa organik/lembut, misalnya aplikasi kesehatan ibu dan anak.
- Kode: `gallery/demos/notif-badge-1.js`

### `badge-sonar-ring` — Sonar Ring
- Sumber: Notification Badge · Part 1
- Pemicu: tap
- Gerak: Setiap hitungan baru memancarkan cincin outline merah muda dari badge yang mengembang (scale 1 → 2.2) sambil memudar, seperti sonar; badge sendiri berdenyut 1 → 1.15 → 1. Saat dikosongkan, cincin "jatuh kembali": mengecil dari 2.2 ke 1 ke arah badge, lalu badge menyusut hilang.
- Durasi & easing: cincin keluar 400ms ease-out · denyut 250ms · cincin masuk 300ms + badge hilang 250ms
- Cocok untuk: Notifikasi yang butuh perhatian, misalnya panggilan darurat atau pesan dari perawat jaga.
- Kode: `gallery/demos/notif-badge-1.js`

### `badge-stretch-slide` — Stretch Slide
- Sumber: Notification Badge · Part 1
- Pemicu: tap
- Gerak: Badge muncul dari titik kecil (scale 0.3) yang tumbuh menjadi lingkaran. Saat angka berubah, latar badge meregang menjadi pil (scaleX 1 → 1.8 → 1) sementara angka lama bergeser keluar ke kiri dan angka baru masuk dari kanan. Saat dikosongkan, badge menyusut ke titik, diam sebentar, lalu memudar.
- Durasi & easing: muncul 220ms ease-out · regang + geser 260ms ease-in-out · menyusut 160ms, pudar 150ms (jeda 250ms)
- Cocok untuk: Penghitung yang naik beruntun, misalnya jumlah pasien menunggu di poli.
- Kode: `gallery/demos/notif-badge-1.js`

### `send-mailbox-flag` — Mailbox Flag
- Sumber: Send · Part 2
- Pemicu: tap
- Gerak: Ketuk amplop: amplop miring dan melayang di busur menuju celah kotak surat (naik 20px lalu turun), mengecil ke 0.3 dan hilang di celah. Kotak surat memantul kecil (scaleY 0.94), lalu bendera merah muda berputar naik −90° dengan overshoot dan dua kilau bintang muncul. Setelah 1.2 detik semuanya kembali.
- Durasi & easing: amplop ≈420ms ease-in · pantul 200ms · bendera ≈360ms cubic-bezier(.34,1.8,.64,1) · kilau 400ms
- Cocok untuk: konfirmasi pesan/rujukan terkirim yang ingin terasa menyenangkan
- Kode: `gallery/demos/send-2.js`

### `send-swipe-up-send` — Swipe Up Send
- Sumber: Send · Part 2
- Pemicu: drag
- Gerak: Kartu pos bisa diseret ke atas (ikut jari, dengan hambatan saat ditarik ke bawah). Lepas lewat 50px: kartu melesat ke atas keluar bingkai sambil mengecil ke 0.8, meninggalkan jejak titik yang memudar, lalu pill "✓ Sent" pop di tengah (scale 0.6 → 1.08 → 1). Kurang dari 50px: kartu memantul kembali.
- Durasi & easing: ikut jari · lempar ≈280ms cubic-bezier(.5,0,.9,.4) · pill 320ms spring · reset setelah 1.4 detik
- Cocok untuk: kirim kartu ucapan, laporan, atau persetujuan dengan gestur yang disengaja
- Kode: `gallery/demos/send-2.js`

### `send-photo-upload` — Photo Upload
- Sumber: Send · Part 2
- Pemicu: tap
- Gerak: Ketuk kirim: thumbnail di composer melompat di busur ke area chat dan membesar jadi gambar pesan (scale 0.35 → 1). Gambar meredup dan cincin progres melingkar di tengahnya menghitung 0% → 100%, lalu berubah jadi lencana ✓ hijau yang pop (scale 0.5 → 1.15 → 1), kemudian gambar kembali terang.
- Durasi & easing: lompat ≈380ms cubic-bezier(.34,1.3,.64,1) · progres 1200ms ease-in-out · ✓ pop 260ms
- Cocok untuk: unggah foto (mis. foto luka, hasil lab) dengan status progres yang jelas
- Kode: `gallery/demos/send-2.js`

### `send-dissolve-up` — Dissolve Up
- Sumber: Send · Part 2
- Pemicu: tap
- Gerak: Ketuk kirim: teks "Good night!" pecah menjadi ±24 titik kecil mulai dari huruf kiri; titik-titik mengalir diagonal ke kanan atas (stagger 15ms) menuju posisi pesan. Di sana gelembung biru melebar (scaleX 0.2 → 1) dan teks terbentuk kembali di dalamnya; input kembali ke placeholder.
- Durasi & easing: partikel ≈500ms cubic-bezier(.4,0,.2,1) stagger 15ms · gelembung 300ms spring · total ≈850ms
- Cocok untuk: kirim pesan chat dengan efek khas (mis. pesan ucapan, bukan chat klinis rutin)
- Kode: `gallery/demos/send-2.js`

### `send-undo-send` — Undo Send
- Sumber: Send · Part 2
- Pemicu: tap
- Gerak: Ketuk kirim: teks naik dari input menjadi gelembung biru di kanan, dan toast "Sending… | Undo" muncul di atas dengan garis progres yang menyusut linear selama 2.5 detik. Ketuk Undo: toast berubah "Unsent", gelembung turun kembali ke input sambil mengecil dan memudar, lalu teks muncul lagi di input. Jika tidak di-undo, toast hilang dan pesan tetap.
- Durasi & easing: gelembung naik ≈320ms cubic-bezier(.2,.8,.2,1) · jendela undo 2500ms linear · turun kembali ≈300ms ease-in
- Cocok untuk: pesan/instruksi yang masih bisa dibatalkan sesaat setelah dikirim (mis. kirim resep)
- Kode: `gallery/demos/send-2.js`

### `toast-button-morph` — Button Morph
- Sumber: Notifications · Part 3
- Pemicu: tap
- Gerak: Tombol Notify meregang ke atas menjadi gumpalan biru (shared element: translate + scale dari kotak tombol ke kotak toast), lalu isi toast memudar masuk saat gumpalan memudar. Saat ditutup, isi memudar kembali ke gumpalan biru yang menyusut turun dan menyatu dengan tombol.
- Durasi & easing: morph 300ms ease-out · isi masuk 150ms (mulai 250ms) · kembali 420ms ease-in
- Cocok untuk: Konfirmasi yang lahir dari tombol yang ditekan, misalnya "Pengingat dibuat" setelah tombol jadwalkan.
- Juga mewakili: `menu2-button-to-panel` (tombol tumbuh menjadi panel (shared element), dipakai di menu Create)
- Kode: `gallery/demos/toast-3.js`

### `toast-outline-draw` — Outline Draw
- Sumber: Notifications · Part 3
- Pemicu: tap
- Gerak: Garis biru bercahaya menggambar keliling kotak searah jarum jam dari kiri atas (stroke-dashoffset 100 → 0), lalu isi toast tersapu masuk dari kiri ke kanan (clip-path inset) dan garis meredup menjadi border tipis. Saat ditutup, isi tersapu keluar ke kiri lalu garisnya dihapus kembali.
- Durasi & easing: garis 300ms ease-in-out · sapuan isi 250ms ease-out (mulai 280ms) · tutup 200ms + 250ms
- Cocok untuk: Notifikasi di tema gelap/teknis, misalnya status sinkronisasi data atau unggahan selesai.
- Juga mewakili: `search-border-trace` (garis bercahaya menelusuri tepi lalu isi menyapu masuk)
- Kode: `gallery/demos/toast-3.js`

### `toast-pixel-dissolve` — Pixel Dissolve
- Sumber: Notifications · Part 3
- Pemicu: tap
- Gerak: Toast dirakit dari 24 ubin piksel (8×3) yang terbang dari posisi acak (±40px, berputar) lalu menempel di tempatnya, kolom kiri lebih dulu; setelah lengkap isi toast muncul dan ubin hilang. Saat ditutup, toast remuk menjadi ubin yang melayang naik dan memudar dari kiri ke kanan.
- Durasi & easing: ubin 300ms ease-out, stagger 30ms per kolom · isi 100ms · remuk 400ms, stagger 25ms
- Cocok untuk: Notifikasi bergaya digital/game, atau saat ingin menegaskan sesuatu "dibangun", misalnya laporan selesai dibuat.
- Juga mewakili: `progress-pixel-dissolve` (piksel berkumpul jadi solid, dipakai di ujung progress bar); `swipedel-dust-crumble` (remuk jadi partikel lalu melayang, dipakai saat hapus baris)
- Kode: `gallery/demos/toast-3.js`

### `toast-depth-focus` — Depth Focus
- Sumber: Notifications · Part 3
- Pemicu: tap
- Gerak: Toast melesat dari kejauhan: dari scale 0.7, blur(8px), opacity 0 menjadi scale 1.03 lalu 1, tajam dan penuh. Saat ditutup, toast terus mendekat melewati mata (scale 1 → 1.3) sambil kabur dan memudar.
- Durasi & easing: masuk 260ms ease-out (overshoot 3%) · keluar 300ms ease-in
- Cocok untuk: Toast yang perlu terasa penting tapi tetap halus, misalnya "Pembayaran berhasil".
- Kode: `gallery/demos/toast-3.js`

## Teks & Angka

### `counter-odometer-roll` — Odometer Roll
- Sumber: Number Counter · Part 1
- Pemicu: tap
- Gerak: Setiap digit adalah pita vertikal 0–9 yang berputar melewati angka-angka di antaranya (dengan blur gerak tipis) seperti odometer mobil. Digit berhenti bergiliran dari kiri (jeda 40ms); koma diam. Sorotan hari meregang ke tab baru dan bilah progres ikut berubah.
- Durasi & easing: ≈600ms · ease-out (cubic-bezier .2,.8,.2,1) · stagger 40ms · sorotan tab 300ms pegas
- Cocok untuk: Statistik harian (langkah, kalori), saldo, atau jumlah pasien hari ini.
- Juga mewakili: `badge-slot-roll` (digit bergulir vertikal, dipakai di badge)
- Kode: `gallery/demos/number-counter-1.js`

### `counter-split-flap` — Split Flap
- Sumber: Number Counter · Part 1
- Pemicu: tap
- Gerak: Setiap digit yang berubah membalik ke bawah seperti papan bandara: garis belah horizontal melintang di tengah angka, digit lama berputar rotateX 0→90°, digit baru masuk −90°→0. Digit bergiliran 50ms dari kiri.
- Durasi & easing: 200ms ease-in + 200ms ease-out per digit · stagger 50ms
- Cocok untuk: Angka yang berganti jarang tapi penting, misalnya nomor antrean atau jam keberangkatan.
- Juga mewakili: `copy-flip-board` (papan split-flap, dipakai di label tombol Copy); `pwstr-flap-label` (papan split-flap, dipakai di label kekuatan sandi)
- Kode: `gallery/demos/number-counter-1.js`

### `counter-blur-slide` — Blur Slide
- Sumber: Number Counter · Part 1
- Pemicu: tap
- Gerak: Seluruh angka meluncur vertikal dengan blur gerak kuat: angka lama keluar ke atas (naik) atau ke bawah (turun) sambil kabur 4px dan memudar, angka baru masuk dari sisi berlawanan lalu tajam kembali.
- Durasi & easing: ≈350ms · ease-out · geser 60% tinggi angka
- Cocok untuk: Ringkasan angka di dasbor yang berganti saat memilih periode/hari.
- Kode: `gallery/demos/number-counter-1.js`

### `counter-spring-stagger` — Spring Stagger
- Sumber: Number Counter · Part 1
- Pemicu: tap
- Gerak: Digit berganti satu per satu dari kiri (jeda 60ms): digit lama jatuh keluar ke bawah, digit baru turun dari atas dan memantul ke tempatnya dengan pegas; selama transisi digit berwarna aksen lalu kembali ke warna teks.
- Durasi & easing: 400ms per digit · pegas (cubic-bezier .34,1.56,.64,1) · stagger 60ms
- Cocok untuk: Angka ringkasan yang ingin terasa ramah, misalnya poin, skor, atau jumlah langkah.
- Kode: `gallery/demos/number-counter-1.js`

### `counter-decode-lock` — Decode Lock
- Sumber: Number Counter · Part 1
- Pemicu: tap
- Gerak: Semua digit diacak menjadi angka acak berwarna aksen (berganti tiap 40ms), lalu terkunci ke nilai sebenarnya satu per satu dari kiri ke kanan (mulai 400ms, jeda 80ms); digit yang sudah terkunci kembali ke warna teks.
- Durasi & easing: acak 40ms/tik · kunci pertama 400ms · stagger 80ms · total ≈650ms
- Cocok untuk: Angka hasil perhitungan/sinkronisasi, misalnya hasil skor risiko atau total tagihan.
- Kode: `gallery/demos/number-counter-1.js`

### `counter-smooth-count` — Smooth Count
- Sumber: Number Counter · Part 1
- Pemicu: tap
- Gerak: Nilai dihitung naik/turun secara numerik ke total baru (cepat di awal, melambat di akhir). Selama menghitung angka berwarna mint dengan ▲ bila naik, atau merah muda dengan ▼ bila turun, lalu warnanya memudar kembali ke warna teks dan panahnya hilang.
- Durasi & easing: hitung 700ms easeOutCubic · tahan 500ms · warna pudar 400ms
- Cocok untuk: Nilai yang naik-turun dan arahnya penting, misalnya saldo, tekanan darah rata-rata, atau stok.
- Kode: `gallery/demos/number-counter-1.js`

### `text-word-burst` — Word Burst
- Sumber: Text Effects · Part 1
- Pemicu: tap
- Gerak: Huruf kata lama merenggang, memudar abu-abu dan blur. Huruf kata baru berangkat bertumpuk di titik tengah (scale 0.3, sedikit berputar acak) lalu memantul keluar ke posisinya, diiringi 12 garis sinar warna-warni yang memancar dari tengah dan memudar.
- Durasi & easing: keluar 150ms · huruf masuk 250ms spring overshoot · sinar 300ms ease-out · warna → teks 300ms
- Cocok untuk: Momen perayaan singkat, misalnya "SELESAI" setelah pasien menyelesaikan semua langkah.
- Kode: `gallery/demos/text-effects-1.js`

### `text-stamp` — Text Stamp
- Sumber: Text Effects · Part 1
- Pemicu: tap
- Gerak: Kata baru (merah muda) jatuh dari scale 1.6 dan blur seperti stempel, menghantam ke 1.0, sedikit tenggelam ke 0.93 lalu kembali 1. Saat menghantam muncul 3 garis kecepatan di tiap sisi dan seluruh kartu bergetar mendatar ±4px.
- Durasi & easing: hantam 100ms ease-in · pantul 150ms · getar kartu 250ms · warna → teks 300ms
- Cocok untuk: Konfirmasi tegas, misalnya cap "LUNAS" atau "DISETUJUI" pada tagihan atau resep.
- Kode: `gallery/demos/text-effects-1.js`

### `text-punch-zoom` — Punch Zoom
- Sumber: Text Effects · Part 1
- Pemicu: tap
- Gerak: Kata baru (biru muda) melesat dari ukuran besar (scale 1.7) ke normal dengan jejak zoom: dua salinan bayangan pada scale 1.45 dan 1.2 ikut mengecil sambil memudar. Kata lama memudar di bawahnya, warna biru muda pudar ke warna teks.
- Durasi & easing: zoom 130ms ease-out · jejak 180ms · warna → teks 500ms
- Cocok untuk: Menonjolkan angka atau status penting yang baru berubah, misalnya hasil lab "NORMAL".
- Kode: `gallery/demos/text-effects-1.js`

### `text-split-slice` — Split Slice
- Sumber: Text Effects · Part 1
- Pemicu: tap
- Gerak: Garis sayatan bercahaya (miring ±10°) menyapu kata lama dan kata itu terbelah lalu memudar. Kata baru dipotong diagonal menjadi dua: separuh atas meluncur dari kanan, separuh bawah dari kiri (clip-path polygon), bertemu tepat dan mengunci; garis sayatan memudar sesudahnya.
- Durasi & easing: sayatan 100ms · dua belahan 200ms ease-out · garis pudar 300ms · warna → teks 400ms
- Cocok untuk: Pergantian judul atau status yang tegas, misalnya label tahap "MENUNGGU → DIPROSES".
- Kode: `gallery/demos/text-effects-1.js`

### `text-letter-cascade` — Letter Cascade
- Sumber: Text Effects · Part 1
- Pemicu: tap
- Gerak: Huruf kata lama jatuh ke bawah sambil berputar, blur dan memudar dari kiri ke kanan. Huruf kata baru jatuh dari 40px di atas satu per satu dari kiri ke kanan, sedikit miring, melewati garis dasar 7px lalu memantul kembali.
- Durasi & easing: tiap huruf 320ms bouncy · stagger 50ms kiri → kanan · keluar 220ms stagger 40ms
- Cocok untuk: Judul atau angka yang tampil playful, misalnya ucapan selamat datang di aplikasi pasien.
- Kode: `gallery/demos/text-effects-1.js`

### `text-outline-fill` — Outline Fill
- Sumber: Text Effects · Part 1
- Pemicu: tap
- Gerak: Isi putih kata lama terkuras dari atas ke bawah sampai tinggal garis tepinya, lalu hilang. Garis tepi kata baru tergambar sendiri (stroke-dashoffset pada teks SVG), ditahan sebentar, lalu isi warna teks naik dari bawah ke atas di dalamnya (clip-path inset).
- Durasi & easing: kuras 150ms · gambar garis 120ms · tahan 300ms · isi naik 130ms ease-out
- Cocok untuk: Judul atau angka besar yang "terisi" sebagai tanda selesai, misalnya target harian tercapai.
- Kode: `gallery/demos/text-effects-1.js`

## Transisi Halaman

### `screen-swipe-back` — Swipe Back
- Sumber: Screen Transition · Part 2
- Pemicu: drag
- Gerak: Detail masuk dari kanan (translateX 100% → 0) sementara daftar bergeser −30% dan meredup (paralaks). Untuk kembali, seret layar detail ke kanan: progres mengikuti jari; lepas lewat 35% lebar maka selesai kembali, kurang dari itu memantul ke posisi semula.
- Durasi & easing: ≈380ms cubic-bezier(.2,.8,.2,1) · daftar bergerak 30% dari jarak detail
- Cocok untuk: navigasi daftar pasien → detail pasien di app mobile, kembali dengan gesture tepi kiri
- Kode: `gallery/demos/screen-transition-2.js`

### `screen-split-doors` — Split Doors
- Sumber: Screen Transition · Part 2
- Pemicu: tap
- Gerak: Layar lama dibelah vertikal di tengah: belahan kiri meluncur ke kiri −100%, belahan kanan ke kanan +100% seperti pintu geser, memperlihatkan detail di belakangnya yang membesar dari scale 0.92. Kembali = kedua pintu menutup dan bertemu di tengah.
- Durasi & easing: ≈450ms cubic-bezier(.65,0,.35,1) (ease-in-out)
- Cocok untuk: membuka halaman detail atau ringkasan yang terasa "dibuka", mis. hasil pemeriksaan
- Kode: `gallery/demos/screen-transition-2.js`

### `screen-blinds` — Blinds
- Sumber: Screen Transition · Part 2
- Pemicu: tap
- Gerak: Layar baru dipotong jadi 6 bilah horizontal; tiap bilah berputar masuk dari rotateX −90° ke 0 (perspektif 400px) berurutan dari atas ke bawah dengan jeda 45ms. Kembali = bilah berputar keluar dari bawah ke atas.
- Durasi & easing: tiap bilah ≈260ms ease-out · stagger 45ms · total ≈490ms
- Cocok untuk: pergantian tampilan dasbor atau laporan yang ingin terasa "berganti panel"
- Juga mewakili: `toast-blinds` (bilah tirai beruntun, dipakai di toast)
- Kode: `gallery/demos/screen-transition-2.js`

### `screen-depth-stack` — Depth Stack
- Sumber: Screen Transition · Part 2
- Pemicu: tap
- Gerak: Layar lama mundur dalam 3D: scale 0.88, rotateX 12° (perspektif 600px), naik 6px dan meredup ke 50%. Layar baru naik dari bawah (translateY 100% → 0) di atasnya. Kembali = layar baru turun, layar lama tegak dan terang lagi.
- Durasi & easing: ≈420ms cubic-bezier(.2,.8,.2,1)
- Cocok untuk: membuka form atau detail di atas daftar, mis. tambah catatan kunjungan
- Kode: `gallery/demos/screen-transition-2.js`

### `screen-blur-dissolve` — Blur Dissolve
- Sumber: Screen Transition · Part 2
- Pemicu: tap
- Gerak: Crossfade berbasis blur: layar lama blur 0 → 16px sambil memudar, layar baru dari blur 16px dan opacity 0 menjadi tajam. Keduanya bertumpuk di tengah transisi. Kembali memakai efek yang sama terbalik.
- Durasi & easing: ≈420ms ease-in-out
- Cocok untuk: perpindahan tab atau halaman yang tidak punya arah ruang (mis. ganti mode tampilan)
- Kode: `gallery/demos/screen-transition-2.js`

### `screen-liquid-wipe` — Liquid Wipe
- Sumber: Screen Transition · Part 2
- Pemicu: tap
- Gerak: Layar baru terungkap oleh clip-path polygon bertepi gelombang sinus (amplitudo 6%) yang bergerak dari kanan ke kiri; tepinya diberi pita aksen bercahaya 3% yang ikut bergerak. Kembali = gelombang menyapu ke arah sebaliknya (kiri → kanan).
- Durasi & easing: ≈520ms cubic-bezier(.65,0,.35,1)
- Cocok untuk: transisi yang ingin terasa hidup, mis. layar sukses atau onboarding
- Kode: `gallery/demos/screen-transition-2.js`

## Prinsip Gerak

### `principle-glass-blur` — Frosted Glass Blur 0 / 20 / 48px
- Sumber: Change one number · Glass · Frosted
- Pemicu: load/loop
- Gerak: Tiga tab bar kaca yang sama melayang di atas latar ramai (garis diagonal, lingkaran, cincin, garis hitam, "Aa") yang terus bergulir ke atas. Semua lapisan kaca sama (saturate 160%, tint putih, tepi 1px, kilap, bayangan); hanya backdrop blur yang beda. blur 0 "Clear": latar terbaca tajam dan berisik. blur 20px "Frosted ✓": bentuk di belakang jadi gumpalan lembut. blur 48px "Milky": tinggal rona warna. Pil merah muda pindah antar tab dengan pegas: sedikit melewati tujuan dan bar ikut terdorong 3px ke arah gerak.
- Durasi & easing: pil ≈300ms pegas (ω0 20, ζ 0.45, overshoot kecil) · dorongan bar 300ms · latar bergulir 4s linear terus · pindah tab otomatis tiap 1.4s
- Cocok untuk: Memilih blur untuk tab bar/header kaca di atas konten bergambar: ≈20px membuat ikon tetap terbaca tanpa menghapus kesan kaca.
- Kode: `gallery/demos/glass-blur-compare.js`

### `principle-gooey-blur` — Gooey Blur 0 / 9 / 20px
- Sumber: Change one number · Menu · Gooey
- Pemicu: load/loop
- Gerak: Tombol FAB "+" berputar 45° menjadi "×" dan 4 item bulat keluar ke kanan berurutan (jeda 50ms), seolah tiap item terlepas dari item sebelumnya, digerakkan pegas ω0 12, ζ 0.5. Bentuk bulatnya melewati filter SVG gooey (blur lalu alpha × 24 − 10.5). blur 0 = "No goo": lingkaran keras tanpa sambungan. blur 9px = "Gooey": lingkaran menyatu dengan jembatan cair lalu putus. blur 20px = "Melted": semua meleleh, item kecil nyaris hilang.
- Durasi & easing: pegas ω0 12 rad/s, ζ 0.5 · ≈600ms · stagger 50ms · rotasi + 200ms · filter alpha 24 / −10.5 (blur demo diskalakan 0.55× sesuai ukuran)
- Cocok untuk: Menentukan blur untuk menu FAB bergaya gooey: pakai ≈ seperempat diameter item (di sini 9px untuk item 24–34px); terlalu besar membuat ikon dan item kecil hilang.
- Kode: `gallery/demos/gooey-blur-compare.js`

### `principle-spring-damping` — Spring Damping ζ 0.3 / 0.6 / 1.0
- Sumber: Change one number · Toast · Island
- Pemicu: load/loop
- Gerak: Tiga toast "pulau" (pil 128×36 → kartu 410×124) dengan kekakuan pegas sama, ω0 = 13; hanya rasio redaman ζ yang berbeda. ζ 0.3 "Wobbly": melewati target +37% dan berayun ±2 kali; saat menutup sempat lebih kecil dari pil. ζ 0.6 "Bouncy": satu overshoot kecil +9%. ζ 1.0 "Stiff": teredam kritis tanpa overshoot. Isi kartu (avatar, nama, gelombang suara) memudar masuk setelah ukuran hampir penuh.
- Durasi & easing: pegas ω0 13 rad/s · ζ 0.3 settle ≈1s · ζ 0.6 ≈0.45s · ζ 1.0 ≈0.4s · isi masuk 250ms (jeda 120ms), keluar 120ms
- Cocok untuk: Memilih "rasa" pegas untuk notifikasi/kartu yang membesar: ζ ≈ 0.6 untuk pop yang hidup tapi tidak norak, ζ 1.0 untuk UI klinis yang serius.
- Kode: `gallery/demos/spring-damping-compare.js`

### `stagger-compare-menu` — Change one number (Stagger)
- Sumber: Change one number · Menu Stagger (×½ slow-mo)
- Pemicu: load/loop
- Gerak: Tiga dropdown identik dibuka bersamaan: tombol Menu terisi warna aksen dan chevron berputar 180°, kartu memantul terbuka dari atas (spring ω₀16 ζ0.62, overshoot ±8%), lalu 4 baris muncul (fade + turun 6px) dengan jeda antarbaris 0, 65, atau 200ms. Garis waktu di bawah menunjukkan kapan tiap baris jalan dan kapan baris terakhir selesai: 360, 555, 960ms.
- Durasi & easing: kartu spring ω₀16 ζ0.62 (±500ms) · tiap baris 260ms ease-out mulai 100ms · stagger 0 / 65 / 200ms · tutup 150ms · demo diputar ×½
- Cocok untuk: Patokan memilih stagger untuk menu, daftar, atau kartu: ±65ms terasa halus, 0ms terasa serentak/kaku, 200ms terasa lambat.
- Kode: `gallery/demos/stagger-compare.js`

## Latar & Efek

### `bg-mesh-gradient` — Mesh Gradient
- Sumber: Backgrounds · Part 1
- Pemicu: tap
- Gerak: Tiga gumpalan warna (violet, cyan, pink) diblur ±26px di belakang teks. Setiap ketukan menggeser dan mengubah ukuran semua gumpalan ke posisi acak baru (translate ±80px, scale 0.8–1.4); pink bergerak paling jauh. Tidak kembali, cukup diam di posisi baru.
- Durasi & easing: ≈1100ms · ease-in-out lembut (cubic-bezier .45,0,.55,1)
- Cocok untuk: Latar hero landing page atau kartu promosi yang terasa hidup tanpa mengganggu teks.
- Kode: `gallery/demos/backgrounds-1.js`

### `bg-aurora` — Aurora Background
- Sumber: Backgrounds · Part 1
- Pemicu: tap
- Gerak: Pita aurora horizontal (cyan/biru/violet, blur) bergoyang kiri-kanan terus-menerus dalam loop 6–8 detik, ditambah titik bintang. Saat diketuk pita “melonjak”: kecerahan naik ±1.7× dan pita meninggi (scaleY 1.3) lalu turun pelan.
- Durasi & easing: goyang 6–8s ease-in-out bolak-balik · lonjakan naik 300ms, turun 800ms ease-out
- Cocok untuk: Latar hero aplikasi bertema malam atau layar sambutan; ketukan memberi rasa responsif.
- Kode: `gallery/demos/backgrounds-1.js`

### `bg-noise-texture` — Noise Texture
- Sumber: Backgrounds · Part 1
- Pemicu: tap
- Gerak: Lapisan butir film (noise) bergetar di atas cahaya lembut di sudut kartu. Setiap ketukan membuat butir berdenyut (opasitas 0.14→0.4→0.14), cahaya membesar (scale 1→1.25) dan warnanya berganti pink → teal → biru.
- Durasi & easing: denyut ≈700ms ease-out · pergantian warna 600ms
- Cocok untuk: Latar kartu premium atau header profil yang butuh tekstur analog.
- Kode: `gallery/demos/backgrounds-1.js`

### `bg-dot-grid` — Dot Grid
- Sumber: Backgrounds · Part 1
- Pemicu: tap
- Gerak: Grid titik yang memudar ke tepi (mask radial). Ketukan mengirim riak berbentuk cincin dari titik sentuh: tiap titik yang dilewati cincin membesar 1.8× dan menyala, lalu redup lagi; jeda tiap titik sebanding jaraknya ke titik sentuh.
- Durasi & easing: cincin menyebar ≈800ms · tiap titik 450ms ease-out · jeda 2.2ms/px
- Cocok untuk: Latar hero teknis/developer, atau umpan balik ketukan pada area kosong yang luas.
- Kode: `gallery/demos/backgrounds-1.js`

### `bg-spotlight` — Spotlight Effect
- Sumber: Backgrounds · Part 1
- Pemicu: tap
- Gerak: Grid garis redup menutupi kartu. Sorot cahaya lembut berdiameter ±140px menerangi garis di sekitarnya. Saat diketuk, sorot meluncur dari posisinya sekarang ke titik sentuh (sedikit tertinggal) dan garis di sana ikut menyala.
- Durasi & easing: ≈700ms · ease-out (cubic-bezier .2,.8,.2,1)
- Cocok untuk: Latar section fitur atau kartu harga yang mengikuti kursor/sentuhan.
- Kode: `gallery/demos/backgrounds-1.js`

### `bg-animated-gradient` — Animated Gradient
- Sumber: Backgrounds · Part 1
- Pemicu: tap
- Gerak: Gradien linear besar mengalir pelan terus-menerus (lapisan 3× ukuran kartu digeser bolak-balik). Setiap ketukan memutar sudut gradien +60° dan menggeser hue ke palet berikutnya (ungu/pink → biru/teal → violet/magenta) dengan crossfade halus.
- Durasi & easing: alir 10s loop · putar & hue 800ms ease-in-out
- Cocok untuk: Latar hero, kartu CTA, atau layar login yang ingin terasa hidup.
- Kode: `gallery/demos/backgrounds-1.js`

## ID lama yang digabung

ID berikut gerak intinya sama dengan animasi lain, jadi tidak ditampilkan terpisah. Bila prompt menyebut ID kiri, pakai ID kanan (sesuaikan warna/konteksnya).

| ID lama | Pakai | Catatan |
|---|---|---|
| `search-circle-reveal` | `menu-circle-reveal` | lingkaran clip-path dari tombol, dipakai di search bar |
| `toast-circle-reveal` | `menu-circle-reveal` | lingkaran clip-path dari tombol, dipakai di toast |
| `progress-pixel-dissolve` | `toast-pixel-dissolve` | piksel berkumpul jadi solid, dipakai di ujung progress bar |
| `swipedel-dust-crumble` | `toast-pixel-dissolve` | remuk jadi partikel lalu melayang, dipakai saat hapus baris |
| `toast-blinds` | `screen-blinds` | bilah tirai beruntun, dipakai di toast |
| `search-blur-focus` | `dialog-soft-focus` | masuk dari blur ke tajam, dipakai di search bar |
| `menu5-line-expand` | `dialog-line-unfold` | garis memanjang lalu membuka jadi panel, dipakai di dropdown |
| `tooltip-fold-open` | `dialog-line-unfold` | garis memanjang lalu membuka jadi panel, dipakai di tooltip |
| `send-genie-outbox` | `swipedel-genie-bin` | efek genie tersedot ke ikon, dipakai saat kirim surel |
| `menu2-button-to-panel` | `toast-button-morph` | tombol tumbuh menjadi panel (shared element), dipakai di menu Create |
| `badge-slot-roll` | `counter-odometer-roll` | digit bergulir vertikal, dipakai di badge |
| `copy-flip-board` | `counter-split-flap` | papan split-flap, dipakai di label tombol Copy |
| `pwstr-flap-label` | `counter-split-flap` | papan split-flap, dipakai di label kekuatan sandi |
| `badge-coin-flip` | `checkbox-flip-tick` | balik 3D rotateY ke sisi belakang, dipakai di badge |
| `iconmorph1-tumble-flip` | `field3-flip-verify` | balik 3D rotateX menukar keadaan, dipakai di tombol ikon |
| `copy-outline-echo` | `inerr-red-echo` | garis tepi beriak keluar; warna hijau untuk sukses, merah untuk error |
| `search-border-trace` | `toast-outline-draw` | garis bercahaya menelusuri tepi lalu isi menyapu masuk |
| `copy-char-wave` | `inerr-letter-jitter` | huruf meloncat beruntun dan berganti warna |
| `pwstr-block-drop` | `tooltip-elastic-drop` | jatuh lalu memipih saat mendarat |
| `inerr-alert-pop` | `checkbox-pop-burst` | ikon meletup dengan percikan; warna merah untuk error |
| `search-jelly-pop` | `dialog-wobble-in` | muncul membesar dengan goyang jelly |
| `search-paper-unfold` | `menu2-fold-down` | baris membuka rotateX -90° beruntun |
| `pagination-elastic-glide` | `tabbar18-sliding-pill` | penanda aktif merentang ke tujuan lalu menyusut |
| `segment-outline-glide` | `tabbar18-sliding-pill` | penanda aktif merentang ke tujuan; versi garis tepi saja |
| `pagination-comet-trail` | `switch-ghost-trail` | bayangan sisa (afterimage) di sepanjang lintasan |
| `rating-score-fly` | `copy-ghost-fly` | salinan terbang melengkung ke target lalu target meletup |
| `stepper-glyph-spin` | `iconmorph1-spin-swap` | ikon berputar 180° sambil berganti |
| `datepick-snap-brackets` | `field3-corner-lock` | empat siku sudut terbang lalu mengunci |
