# Sistem API Peminjaman Ruang Rapat

## Deskripsi

Ini adalah API backend untuk Sistem Peminjaman Ruang Rapat pusat data kementerian. Sistem ini memungkinkan pengguna untuk memesan ruang rapat, mengelola peminjaman, melacak kehadiran, dan melakukan berbagai fungsi administratif.

## Fitur Utama

- Manajemen pengguna dengan kontrol akses berbasis peran (SUPERADMIN, ADMIN, PEMINJAM)
- Manajemen ruang rapat
- Pengelolaan peminjaman dengan status (DIPROSES, DISETUJUI, DITOLAK, SELESAI)
- Sistem absensi dengan integrasi kode QR
- Ekspor laporan kehadiran dalam format PDF dan Excel
- Pembaruan status otomatis melalui cron job
- Unggah gambar untuk foto ruangan
- Validasi hari kerja dan pengecekan hari libur

## Teknologi yang Digunakan

- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: Prisma
- **Autentikasi**: JWT
- **Unggah File**: Multer
- **Validasi**: Joi
- **Penjadwalan**: node-cron
- **Dokumentasi**: Tersedia di direktori `/docs`

## Arsitektur

Aplikasi ini mengikuti prinsip arsitektur bersih (clean architecture) dengan struktur sebagai berikut:

- **Controllers**: Menangani permintaan dan respons HTTP
- **Services**: Berisi logika bisnis
- **Validations**: Memvalidasi data permintaan
- **Middlewares**: Menangani masalah lintas fungsi seperti autentikasi, logging, dan penanganan kesalahan
- **Routes**: Mendefinisikan endpoint API
- **Utils**: Fungsi utilitas untuk JWT, hash kata sandi, dll.
- **Configs**: Konfigurasi aplikasi

## Versi API

API menggunakan versi dalam URL:
- `/api/v1/...` - Versi saat ini
- `/api/v2/...` - Endpoint yang ditingkatkan dengan fitur tambahan

## Dokumentasi

Untuk dokumentasi detail tentang endpoint API, silakan merujuk ke dokumentasi di direktori `docs`:

- [Autentikasi](docs/autentikasi.md)
- [Manajemen Pengguna](docs/manajemen_pengguna.md)
- [Tim Kerja](docs/tim_kerja.md)
- [Manajemen Ruangan](docs/manajemen_ruangan.md)
- [Pengelolaan Peminjaman](docs/pengelolaan_peminjaman.md)
- [Sistem Absensi](docs/sistem_absensi.md)
- [Penanganan Error](docs/penanganan_error.md)

## Memulai

### Prasyarat

- Node.js (v14 atau lebih tinggi)
- Database MySQL
- npm atau yarn

### Instalasi

1. Clone repositori
2. Instal dependensi
```bash
npm install
```

3. Siapkan variabel lingkungan di file `.env`
```env
DATABASE_URL="mysql://username:password@localhost:3306/booking_system"
SECRET_KEY="your_secret_key_for_jwt"
PORT=3000
FRONTEND_URL="http://localhost:3001"
API_DAY_OFF="http://holiday-api-endpoint.com/api"
```

4. Jalankan migrasi database
```bash
npx prisma migrate dev
```

5. Lakukan seeding database
```bash
npm run seed
```

6. Mulai server pengembangan
```bash
npm run dev
```

7. Server akan berjalan di http://localhost:3000

## Akses Admin Default

Setelah melakukan seeding database, Anda dapat mengakses sistem dengan:
- Email: superadmin@pusdatin.id
- Kata Sandi: @Test123!

