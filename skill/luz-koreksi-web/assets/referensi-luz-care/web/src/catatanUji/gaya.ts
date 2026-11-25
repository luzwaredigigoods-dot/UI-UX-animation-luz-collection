// Gaya Catatan uji. Panel ada di dalam shadow DOM, jadi gaya aplikasi tidak mengenainya dan sebaliknya.
// Warna teks diuji kontras >= 4,5:1 terhadap latarnya (uji kontras di uji alur peramban).

/** Gaya di halaman (di luar shadow DOM): selama Mode catatan, tekan lama di HP tidak memilih teks atau membuka menu tautan. */
export const GAYA_HALAMAN = `
html.cu-aktif body *:not(#cu-akar):not(input):not(textarea):not([contenteditable]) {
  -webkit-touch-callout: none; -webkit-user-select: none; user-select: none;
}`;

export const GAYA = `
:host { all: initial; }
* { box-sizing: border-box; }
[hidden] { display: none !important; }
.akar { font-family: Nunito, system-ui, -apple-system, "Segoe UI", sans-serif; font-size: 14px; line-height: 1.4; color: #2d2118; }
button, input, select, textarea { font: inherit; color: inherit; }
button { cursor: pointer; }
:focus-visible { outline: 3px solid #1d4ed8; outline-offset: 2px; }

.bingkai { position: fixed; inset: 0; pointer-events: none; box-shadow: inset 0 0 0 3px #ea580c; z-index: 1; }
.pita { position: fixed; top: max(6px, env(safe-area-inset-top)); left: 50%; transform: translateX(-50%); z-index: 4;
  display: flex; align-items: center; gap: 8px; max-width: calc(100vw - 16px); padding: 4px 4px 4px 12px; border-radius: 999px;
  background: #9a3412; color: #fff; font-size: 13px; font-weight: 700; box-shadow: 0 4px 14px rgba(0,0,0,.25); }
.pita span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pita .pendek { display: none; }
@media (max-width: 719px) { .pita .panjang { display: none; } .pita .pendek { display: inline; } }
.pita button { border: 0; border-radius: 999px; padding: 4px 10px; background: #fff; color: #7c2d12; font-weight: 800; font-size: 12px; min-height: 28px; }

.sorot { position: fixed; pointer-events: none; z-index: 2; border: 2px dashed #ea580c; border-radius: 4px; background: rgba(234, 88, 12, .08); }
.sorot-label { position: fixed; pointer-events: none; z-index: 3; max-width: 70vw; padding: 2px 8px; border-radius: 6px;
  background: #7c2d12; color: #fff; font-size: 12px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tanda { position: fixed; pointer-events: none; z-index: 2; border: 3px solid #c2410c; border-radius: 4px; }
.tanda b { position: absolute; top: -12px; left: -12px; width: 22px; height: 22px; border-radius: 50%; background: #c2410c; color: #fff;
  font-size: 12px; display: grid; place-items: center; }
.kilat { position: fixed; pointer-events: none; z-index: 2; border: 3px solid #1d4ed8; border-radius: 4px; background: rgba(29, 78, 216, .12);
  animation: kilat 1.6s ease-out forwards; }
@keyframes kilat { 0%, 70% { opacity: 1; } 100% { opacity: 0; } }

.apung { position: fixed; right: 12px; bottom: var(--bawah, 16px); z-index: 5; display: flex; align-items: center; gap: 6px;
  min-height: 44px; min-width: 44px; padding: 0 14px 0 12px; border-radius: 999px; border: 2px solid #fff; background: #9a3412; color: #fff;
  font-weight: 800; box-shadow: 0 6px 18px rgba(0,0,0,.28); }
.apung[aria-pressed="true"] { background: #fff; color: #7c2d12; border-color: #c2410c; }
.apung svg { width: 20px; height: 20px; flex: none; }
.apung .angka { min-width: 20px; height: 20px; padding: 0 5px; border-radius: 10px; background: #b42318; color: #fff; font-size: 12px; display: grid; place-items: center; }
.apung[aria-pressed="true"] .angka { background: #b42318; color: #fff; }
@media (max-width: 719px) { .apung .teks { display: none; } .apung { padding: 0 10px; } }

.panel { position: fixed; z-index: 6; background: #fffdf9; border: 1px solid #e3cfb8; box-shadow: 0 12px 40px rgba(45, 33, 24, .28);
  display: flex; flex-direction: column; overflow: hidden; }
.panel.kanan { top: 8px; right: 8px; bottom: 8px; width: min(380px, calc(100vw - 16px)); border-radius: 14px; }
.panel.kiri { top: 8px; left: 8px; bottom: 8px; width: min(380px, calc(100vw - 16px)); border-radius: 14px; }
@media (max-width: 719px) {
  .panel.kanan, .panel.kiri { top: auto; left: 8px; right: 8px; bottom: 8px; width: auto; max-height: min(62vh, calc(100vh - 56px)); border-radius: 14px; }
}
.panel.kecil { top: auto !important; bottom: 8px; height: auto; max-height: none; }
/* Di HP panel kecil pindah ke atas (di bawah pita) agar menu bawah aplikasi tetap bisa ditekan. */
@media (max-width: 719px) { .panel.kecil { top: calc(max(6px, env(safe-area-inset-top)) + 42px) !important; bottom: auto; } }
.kepala .jumlah { font-weight: 700; font-size: 12px; color: #5c4332; }
.panel.kecil .isi, .panel.kecil .tab { display: none; }

.kepala { display: flex; align-items: center; gap: 6px; padding: 10px 10px 8px 14px; border-bottom: 1px solid #efe1d0; background: #fbf1e4; }
.kepala h2 { margin: 0; flex: 1; font-size: 15px; font-weight: 800; }
.ikon { border: 1px solid #d9c2a7; background: #fff; border-radius: 8px; min-width: 32px; min-height: 32px; padding: 0 8px; font-size: 12px; font-weight: 700; color: #4a3424; }
.tab { display: flex; gap: 4px; padding: 8px 10px 0; background: #fbf1e4; border-bottom: 1px solid #efe1d0; }
.tab button { border: 0; background: transparent; padding: 7px 12px; border-radius: 8px 8px 0 0; font-weight: 800; color: #5c4332; }
.tab button[aria-selected="true"] { background: #fffdf9; color: #2d2118; box-shadow: 0 -2px 0 #c2410c inset; }
.isi { overflow-y: auto; padding: 12px 14px 16px; flex: 1; overscroll-behavior: contain; }

.petunjuk { padding: 10px 12px; border-radius: 10px; background: #fff4e6; border: 1px dashed #e3a76f; color: #4a3424; font-size: 13px; }
.objek { border: 1px solid #ead8c3; border-radius: 10px; padding: 8px 10px; margin-bottom: 8px; background: #fff; }
.objek .baris { display: flex; align-items: flex-start; gap: 8px; }
.nomor { flex: none; width: 22px; height: 22px; border-radius: 50%; background: #c2410c; color: #fff; font-size: 12px; font-weight: 800; display: grid; place-items: center; margin-top: 1px; }
.objek .nama { flex: 1; font-weight: 800; word-break: break-word; }
.objek .jejak { color: #6b5444; font-size: 12px; margin: 2px 0 0 30px; word-break: break-word; }
.objek .kecil-aksi { display: flex; gap: 4px; }
.wadah { display: flex; flex-wrap: wrap; gap: 4px; margin: 6px 0 0 30px; }
.wadah span { font-size: 12px; color: #6b5444; align-self: center; }
.wadah button { border: 1px solid #d9c2a7; background: #fff; border-radius: 999px; padding: 2px 9px; font-size: 12px; color: #4a3424; min-height: 26px; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.wadah button[aria-pressed="true"] { background: #9a3412; border-color: #9a3412; color: #fff; }

label.judul, .judul { display: block; font-weight: 800; font-size: 13px; margin: 12px 0 4px; }
textarea { width: 100%; min-height: 110px; resize: vertical; border: 1px solid #c9ad8f; border-radius: 10px; padding: 8px 10px; background: #fff; }
.sebut { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px; align-items: center; }
.sebut button { border: 1px solid #d9c2a7; background: #fff; border-radius: 6px; padding: 2px 8px; font-size: 12px; font-weight: 800; color: #7c2d12; min-height: 26px; }
.hitung { margin-left: auto; font-size: 12px; color: #6b5444; }
.pilih { display: flex; flex-wrap: wrap; gap: 4px; }
.pilih button { border: 1px solid #d9c2a7; background: #fff; border-radius: 999px; padding: 4px 12px; font-weight: 700; color: #4a3424; min-height: 32px; }
.pilih button[aria-pressed="true"] { background: #9a3412; border-color: #9a3412; color: #fff; }
.centang { display: flex; gap: 8px; align-items: center; margin-top: 10px; font-size: 13px; }
.centang input { width: 18px; height: 18px; accent-color: #9a3412; }
.info { margin-top: 10px; font-size: 12px; color: #6b5444; word-break: break-word; }
.aksi { display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap; }
.utama { border: 0; border-radius: 10px; padding: 9px 18px; background: #9a3412; color: #fff; font-weight: 800; min-height: 40px; }
.utama:disabled { background: #b79a84; color: #2d2118; cursor: wait; }
.kedua { border: 1px solid #c9ad8f; border-radius: 10px; padding: 8px 14px; background: #fff; color: #4a3424; font-weight: 700; min-height: 40px; }
.bahaya { border: 1px solid #b42318; color: #8a1c12; }
.pesan { margin-top: 10px; font-size: 13px; font-weight: 700; color: #14532d; }
.pesan.galat { color: #8a1c12; }

.saring { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
.saring label { font-size: 12px; font-weight: 700; color: #5c4332; display: flex; flex-direction: column; gap: 2px; }
.saring select { border: 1px solid #c9ad8f; border-radius: 8px; padding: 5px 6px; background: #fff; min-height: 32px; }
.saring .centang { grid-column: 1 / -1; margin-top: 2px; }
.daftar { list-style: none; padding: 0; margin: 10px 0 0; display: flex; flex-direction: column; gap: 6px; }
.daftar button { width: 100%; text-align: left; border: 1px solid #ead8c3; border-radius: 10px; background: #fff; padding: 8px 10px; }
.daftar .atas { display: flex; gap: 6px; align-items: center; font-size: 12px; font-weight: 800; color: #5c4332; flex-wrap: wrap; }
.daftar .ringkas { margin-top: 3px; font-size: 13px; color: #2d2118; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.daftar .bawah { margin-top: 3px; font-size: 12px; color: #6b5444; }
.status { border-radius: 999px; padding: 1px 8px; font-size: 11px; font-weight: 800; }
.st-baru { background: #fde2cc; color: #7c2d12; }
.st-dikerjakan { background: #dbeafe; color: #1e3a8a; }
.st-selesai { background: #fef3c7; color: #713f12; }
.st-diterima { background: #dcfce7; color: #14532d; }
.st-dibuka-lagi { background: #fee2e2; color: #7f1d1d; }
.kosong { margin-top: 12px; color: #6b5444; font-size: 13px; }
.detail h3 { margin: 4px 0 6px; font-size: 15px; }
.detail .teks { white-space: pre-wrap; word-break: break-word; background: #fff; border: 1px solid #ead8c3; border-radius: 10px; padding: 8px 10px; }
.detail mark { background: #fde2cc; color: #7c2d12; font-weight: 800; border-radius: 4px; padding: 0 3px; }
.detail img { width: 100%; border: 1px solid #ead8c3; border-radius: 10px; margin-top: 8px; display: block; }
.detail dl { display: grid; grid-template-columns: auto 1fr; gap: 2px 10px; font-size: 12px; margin: 8px 0 0; }
.detail dt { color: #6b5444; font-weight: 700; }
.detail dd { margin: 0; word-break: break-word; }
.detail code { font-size: 11px; background: #f5ece1; border-radius: 4px; padding: 0 3px; word-break: break-all; }
.riwayat { list-style: none; padding: 0; margin: 4px 0 0; font-size: 12px; color: #4a3424; }
.riwayat li { padding: 3px 0; border-top: 1px dashed #ead8c3; }
input.ket { width: 100%; border: 1px solid #c9ad8f; border-radius: 8px; padding: 6px 8px; background: #fff; min-height: 34px; }
.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
`;
