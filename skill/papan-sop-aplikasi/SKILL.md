---
name: "papan-sop-aplikasi"
description: "Buat atau perbarui papan SOP per aplikasi/web dok Luz sebagai artifact: checklist seluruh rantai skill (rancang sampai pensiun), penilaian skill mana yang wajib/disarankan/pilihan untuk app itu, status dan putusan terakhir tiap skill, serta tombol salin perintah untuk memanggil skill. Pakai saat dok minta papan SOP, checklist aplikasi, peta skill, status/progres sebuah app, atau tanya skill apa yang perlu untuk app tertentu."
---

# Papan SOP aplikasi

Satu halaman artifact per aplikasi yang menjawab tiga hal: **skill apa saja yang perlu untuk app ini, sudah sampai mana, dan apa langkah berikutnya**, dengan tombol untuk memanggil tiap skill. Skill ini tidak menjalankan skill lain; ia memetakan, mencatat status, dan memudahkan pemanggilan.

Sapa pengguna "dok Luz". Jawab dalam Bahasa Indonesia. Gaya penasihat: kekosongan paling berisiko di kalimat pertama, tanpa pujian pembuka, tandai klaim penting dengan [Certain] / [Likely] / [Guessing].

## Aturan keras

- **Satu papan per app.** Sebelum membuat, cari papan yang sudah ada (daftar artifact dengan judul "SOP <nama app>"). Bila ada, perbarui; jangan membuat kembaran.
- **Tombol tidak menjalankan skill.** Halaman artifact tidak bisa mengirim perintah ke chat. Tombolnya menyalin teks perintah; dok menempelkannya di chat. Jangan menulis UI yang seolah-olah menjalankan sesuatu, dan jangan menampilkan "sedang berjalan" palsu.
- **Status berdasarkan bukti.** Sebuah skill ditandai Selesai hanya bila sudah benar-benar dijalankan untuk app itu dan ada putusannya (mis. "LULUS DENGAN CATATAN", tanggal). Centang yang dok buat sendiri di papan dihormati, tapi dibedakan dari hasil yang tercatat.
- **Tanpa rahasia, tanpa data pasien** di papan: tidak ada kata sandi, token, IP internal, isi temuan keamanan terperinci, atau nama pasien. Putusan dan tanggal saja; rincian tetap di laporan skill masing-masing.
- **Penilaian relevansi adalah usulan.** Dok Luz boleh mengubah golongan sebuah skill; simpan pilihannya dan jangan menimpanya pada pembaruan berikut tanpa bertanya.
- **Skill yang tidak terkait langsung tetap ditampilkan** sebagai pilihan, tidak disembunyikan.
- Ikuti panduan artifact sesi ini sebelum menerbitkan (baca panduan halaman dan desain lebih dulu). Papan bersifat pribadi; membagikannya adalah keputusan dok.

## Langkah

### 1. Kenali app dan profilnya
Ambil dari percakapan, `CLAUDE.md` / `docs/` proyek, dan yang sudah diketahui tentang app itu. Tanyakan hanya yang belum jelas, sekaligus dalam satu giliran:
- **Tahap**: ide / sedang dibangun / uji coba / sudah dipakai / mau ditutup.
- **Data**: menyimpan data orang lain? data pasien/kesehatan? uang?
- **Paparan**: bisa diakses dari internet? ada login dan peran?
- **Tempat jalan**: VPS/server sendiri, Apps Script + Sheets, web statis, lokal saja.
- **Pemakai**: dok sendiri, staf poli, pasien, pembeli.
- **Kekritisan**: kalau mati sehari, kerja klinis terganggu?

### 2. Kumpulkan daftar skill
Pakai **daftar skill yang tersedia di sesi ini**, bukan daftar hafalan, supaya skill baru ikut terbaca. Untuk tiap skill buatan dok Luz, baca SKILL.md-nya (nama, deskripsi, langkah) agar ringkasan checklist diambil dari isinya, bukan dikarang. Skill bawaan Claude (dokumen, browser, dsb.) hanya masuk bila ada gunanya untuk app ini (mis. desain antarmuka, visualisasi data), dan ditaruh di grup pilihan.

### 3. Nilai relevansi tiap skill
Tiga golongan, masing-masing dengan **alasan satu kalimat** yang merujuk ke profil app:
- **Wajib**: melewatkannya membahayakan data, pemakai, atau kelangsungan app ini.
- **Disarankan**: bermanfaat nyata, tapi app masih bisa jalan tanpanya.
- **Pilihan**: tidak terkait langsung dengan app ini; tetap ditampilkan.

Pedoman awal untuk rantai inti (sesuaikan dengan profil; sebut bila [Guessing]):
| Skill | Wajib bila | Cukup Disarankan/Pilihan bila |
|---|---|---|
| luz-blueprint | app baru atau perubahan besar | alat kecil pribadi (versi ringkas) |
| kelola-perubahan | app sudah dipakai orang lain | masih dibangun sendiri |
| kaji-kode-lokal | ada kode yang akan dirilis | tanpa kode sendiri |
| uji-fungsional | dipakai orang selain dok | alat pribadi |
| uji-serangan-keamanan | terbuka ke internet atau ada login/data orang | lokal saja, tanpa data orang |
| deploy-rilis | ada server/produksi | lokal saja |
| backup-restore | ada data yang tak bisa dibuat ulang | tanpa data tersimpan |
| perawatan-aplikasi | sudah live | belum rilis |
| tanggap-insiden | data orang/pasien atau dipakai kerja klinis | alat pribadi |
| kepatuhan-data-pasien | menyimpan data pribadi/pasien | tanpa data orang |
| dokumentasi-serah-terima | ada pemakai selain dok | dipakai sendiri |
| pensiun-aplikasi | app akan ditutup/diganti/pindah | selain itu: Pilihan |
| luz-motion | app punya antarmuka yang dipakai orang lain (web/app dengan tombol, menu, form, daftar) | tanpa antarmuka, atau alat pribadi sekali pakai (Pilihan) |

Untuk **luz-motion**, checklist ringkasnya: (1) pilih animasi dari galeri Luz Motion atau lewat panel luz-koreksi-web; (2) salin prompt dari galeri / catatan; (3) terapkan dengan aturan tetap (transform/opacity, reduced-motion, bisa diinterupsi); (4) uji di HP dan PC. Perintah salin: `Jalankan skill luz-motion untuk <nama app>`.
Skill buatan dok lain yang tidak masuk rantai (alat koreksi tampilan, rekam medis RS, video, dan yang baru dibuat kemudian) dinilai dari deskripsinya; bila tidak terkait, golongkan Pilihan.

### 4. Susun isi papan
Kelompokkan per tahap, urut kerja:
**Rancang → Bangun → Uji → Rilis → Jalan & rawat → Ubah → Darurat → Lintas tahap → Tutup → Pilihan lain**
("Bangun" adalah tahap menulis kode; tampilkan sebagai langkah tanpa skill agar urutannya utuh. Di tahap Bangun, letakkan skill tampilan berurutan bila tersedia: pondasi-ui → poles-tampilan → luz-motion (animasi dari koleksi Luz Motion, setelah tampilan rapi), lalu luz-koreksi-web di tahap Uji untuk koreksi tampilan dan pemilihan animasi langsung pada objek.)

Tiap butir skill memuat:
- nama skill + satu kalimat gunanya (bahasa awam);
- lencana golongan (Wajib / Disarankan / Pilihan) + alasan;
- **checklist ringkas 3-6 langkah** yang disarikan dari SKILL.md skill itu (gerbang dan putusannya, bukan seluruh isi);
- status: Belum / Sedang / Selesai / Dilewati (dengan alasan);
- putusan terakhir + tanggal bila pernah dijalankan;
- irama ulang bila ada (mis. perawatan bulanan, uji-pulih bulanan, uji serang triwulan);
- tombol **Salin perintah** dan teks perintahnya terlihat, mis. `Jalankan skill deploy-rilis untuk Paddoc Host`.

Bagian atas papan: nama app, profil singkat, tanggal diperbarui, ringkasan angka (wajib selesai x dari y), dan **"Langkah berikutnya"**: satu skill yang paling masuk akal dijalankan sekarang beserta tombolnya. Urutan prioritas: Wajib yang belum pernah dijalankan pada tahap sekarang, lalu yang jatuh tempo ulang, lalu Disarankan.

### 5. Bangun halamannya
- Satu dokumen HTML mandiri, **utamakan layar HP** (dok sering membuka dari ponsel): satu kolom, tombol besar, grup tahap bisa dilipat, grup "Pilihan lain" terlipat secara bawaan.
- **Keadaan disimpan sebagai data JSON di dalam halaman** (profil app, daftar skill, golongan, langkah, status, putusan, tanggal) dan tampilan dirender dari data itu. Jangan menaruh keadaan hanya di DOM.
- **Menyimpan centang**: periksa kemampuan halaman yang tersedia di sesi ini sebelum menulis kode. Bila ada kemampuan agar halaman menyimpan dirinya, pakai itu: perbarui data, bangun ulang dokumen, simpan setelah dok bertindak (gabungkan beberapa ketukan cepat jadi satu simpan, jangan menyimpan saat halaman dibuka). Bila tidak tersedia atau pembaca hanya-lihat, tampilkan papan hanya-baca dan katakan terus terang bahwa centang tidak tersimpan; jangan berpura-pura tersimpan.
- **Tombol salin**: menyalin dari penangan klik dan menangani penolakan; bila gagal, teks perintah tetap terlihat dan bisa dipilih manual. Beri tanda singkat "Tersalin, tempel di chat".
- Tanpa pustaka luar yang tidak perlu, tanpa data dari luar, tanpa tautan berisi rahasia.
- Judul artifact: `SOP <nama app>`.

### 6. Terbitkan dan laporkan
Terbitkan (atau perbarui papan yang ada), lalu jawab singkat: putusan satu baris, skill Wajib yang belum dijalankan, dan langkah berikutnya. Jangan mengulang seluruh isi papan di chat.

### 7. Jaga papan tetap benar
- **Setiap kali sebuah skill rantai dijalankan untuk app yang punya papan**, perbarui papannya: status, putusan, tanggal. Baca dulu keadaan terbaru papan (dok mungkin sudah mencentang sesuatu) dan gabungkan, jangan menimpa.
- Bila profil app berubah (mulai menyimpan data pasien, dibuka ke internet, mulai dipakai staf), nilai ulang golongan dan beri tahu dok apa yang naik menjadi Wajib.
- Bila ada skill baru buatan dok, tambahkan ke papan pada pembaruan berikutnya.
- Bila dok bertanya "sudah sampai mana app X", baca papan dan jawab dari sana.

## Format jawaban di chat

```
<Nama app> — tahap: <...>. Wajib: x dari y selesai.
Belum dijalankan (Wajib): ...
Langkah berikutnya: <skill> — alasan satu kalimat.
```
Tambahkan catatan bila ada golongan yang masih [Guessing] karena profil app belum lengkap.

Batas: papan ini mencatat bahwa sebuah skill sudah dijalankan dan putusannya, bukan menjamin app aman atau patuh; penilaian relevansi dibuat model bahasa dan perlu dikoreksi dok bila keliru.