# Kajian Quantum Banking

Proyek React dan Vite yang memecah prototipe HTML menjadi halaman, komponen, aset, dan modul data. Homepage memuat hero, Evident AI, carousel Eksplorasi, peta, timeline, serta grafik perkembangan riset. Halaman pengantar kuantum menggunakan navigasi hash agar dapat dibuka pada hosting statis.

## Menjalankan di VS Code

Ekstrak ZIP, buka folder `quantum-banking`, lalu jalankan dari terminal folder itu. Gunakan Node.js 20.19+ atau 22.12+.

```bash
npm ci
npm run dev
```

Buka URL localhost yang dicetak Vite. Untuk memeriksa rilis produksi, gunakan `npm run build` lalu `npm run preview`. Untuk hosting statis, unggah isi `dist/`. Base path relatif membantu saat aplikasi berada di subfolder.

## Menghubungkan grafik ke Google Sheets

1. Siapkan tab sumber dengan baris header `Tahun` dan `Kelompok`. Tab **Research Mapping** pada workbook sumber sudah memakai format ini. Kolom tambahan diabaikan.
2. Tinjau isi tab sebelum dipublikasikan. Jika tab asli memuat materi terbatas, buat tab khusus untuk grafik yang hanya berisi dua kolom tersebut.
3. Di Google Sheets, gunakan **File → Share → Publish to web**. Pilih tab sumber, pilih **Comma-separated values (.csv)**, lalu salin tautan yang dihasilkan. Aktifkan publikasi ulang otomatis saat sheet berubah. [Panduan Google](https://support.google.com/docs/answer/183965?hl=en)
4. Salin `.env.example` ke `.env.local` dan isi `VITE_RESEARCH_SHEET_CSV_URL`. Mulai ulang Vite saat mengganti konfigurasi. Pada hosting statis, pasang konfigurasi sebelum build.
5. Aplikasi memeriksa ulang CSV setiap 60 detik secara default, saat tab kembali terlihat, dan saat **Muat ulang data** dipilih. Data berubah setelah versi baru tersedia pada tautan CSV publik. Google dapat menerbitkan perubahan dengan jeda.

Contoh bentuk tautan:

```dotenv
VITE_RESEARCH_SHEET_CSV_URL=https://docs.google.com/spreadsheets/d/e/ID_PUBLIKASI/pub?gid=0&single=true&output=csv
VITE_RESEARCH_REFRESH_MS=60000
```

Browser harus dapat mengambil CSV dari origin aplikasi. Tautan berbagi yang membuka editor, tab privat, halaman login, dan sumber yang diblokir CORS tidak bisa digunakan sebagai input CSV langsung. Jika pembacaan setelah sinkronisasi berhasil kemudian gagal, aplikasi mempertahankan hasil terakhir di tab dan menampilkan pesan error. Konfigurasi Vite tersedia di sisi klien, jadi simpan hanya URL yang boleh diakses publik.

Tanpa URL yang dikonfigurasi, aplikasi membaca `public/data/research-snapshot.csv`, berisi 369 baris aktual dari tab **Research Mapping** dengan hanya tahun dan kategori. Snapshot lokal bisa diganti dengan CSV berstruktur sama.

## Definisi grafik

| Kode | Kelompok pada workbook |
|---|---|
| A | Financial Markets and Investment |
| B | Banking Operations |
| C | Financial Infrastructure |
| D | Cybersecurity |

Satu baris valid dihitung sekali per kategori yang tercantum. Format seperti `A/B — metode hybrid` dan `A — topik; B — topik` dihitung pada kedua seri. Entri bertanda potensi mirip tetap dihitung, sehingga metrik berarti **jumlah entri katalog**, bukan kontribusi unik atau estimasi cakupan global. Nol pada suatu tahun berarti tidak ada baris yang tercatat untuk seri tersebut. Grafik mini menampilkan selisih jumlah tahun terakhir dan tahun sebelumnya, bukan persentase perubahan.

## Struktur

| Lokasi | Tanggung jawab |
|---|---|
| `src/App.jsx`, `src/pages/` | Navigasi dan komposisi halaman |
| `src/components/` | Bagian homepage dan kontrol interaktif |
| `src/features/research/` | CSV, agregasi, penyegaran, grafik, dan tabel |
| `src/data/homeContent.json` | Konten hero, carousel, dan timeline |
| `src/data/googleLinks.json` | Tautan referensi Docs, Sheets, Slides, dan Colab |
| `src/assets/`, `src/styles/` | Foto, peta, dan CSS per bagian |
| `test/` | Uji format CSV, kategori, snapshot, dan pembacaan ulang |

Isi nilai kosong di `googleLinks.json` dengan tautan dokumen yang sesuai. Tautan tersebut tampil sebagai rujukan. Grafik membaca satu tab Google Sheets lewat CSV publik. Sistem ini tidak memerlukan Google API, API key, atau backend.

```bash
npm test
```
