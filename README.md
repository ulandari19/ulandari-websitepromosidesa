# ulandari-websitepromosidesa

## Fitur Aduan & Admin
- Form aduan sekarang berada di halaman **Lokasi & Kontak**.
- Halaman **admin.html** menampilkan aduan dari Google Sheets dan menyediakan kolom untuk menjawab.
- PIN demo admin: **123456** (ubah di `script.js`).
- File `Code.gs` berisi backend Google Apps Script agar status dan jawaban dapat disimpan kembali ke Google Sheets.

### Penting untuk fitur balasan
Setelah mengganti backend dengan `Code.gs`, deploy ulang Google Apps Script sebagai Web App dan gunakan URL `/exec` yang sama pada `ADUAN_SCRIPT_URL` di `script.js`. Untuk sheet, pastikan baris pertama memakai header: `timestamp, id, nama, kategori, judul, isi_aduan, status, jawaban`.
