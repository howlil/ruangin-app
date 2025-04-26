# Dokumentasi API Sistem Peminjaman Ruang Rapat

## Ikhtisar

Dokumentasi ini mencakup semua endpoint API yang tersedia di Sistem Peminjaman Ruang Rapat pusat data kementerian. API ini dibangun dengan arsitektur RESTful dan menggunakan format JSON untuk pertukaran data.

## Versi API

API ini menyediakan dua versi endpoint:
- `/api/v1/...` - Versi utama saat ini
- `/api/v2/...` - Endpoint yang ditingkatkan dengan fitur tambahan

## Autentikasi

Mayoritas endpoint memerlukan autentikasi menggunakan token JWT. Token diperoleh melalui endpoint login dan harus disertakan di header permintaan:

```
Authorization: Bearer {token}
```

Token valid selama 24 jam, setelah itu perlu login kembali untuk mendapatkan token baru.

## Kontrol Akses Berbasis Peran (RBAC)

Sistem mengimplementasikan kontrol akses berbasis peran dengan tiga tingkat akses:
- **SUPERADMIN**: Akses penuh ke semua fitur dan kemampuan administratif
- **ADMIN**: Akses untuk mengelola peminjaman, menyetujui/menolak permintaan, dan melihat laporan
- **PEMINJAM**: Akses terbatas untuk membuat dan melihat peminjaman sendiri

## Struktur Respons

### Respons Sukses

```json
{
  "status": true,
  "message": "Pesan sukses",
  "data": {
    // Data respons...
  }
}
```

Untuk respons dengan pagination:

```json
{
  "status": true,
  "message": "Pesan sukses",
  "data": [
    // Data respons...
  ],
  "pagination": {
    "page": 1,
    "size": 10,
    "total_rows": 25,
    "total_pages": 3
  }
}
```

### Respons Error

```json
{
  "error": true,
  "message": "Pesan error",
  "errors": {
    // Detail error (opsional)
  }
}
```

## Validasi

API menggunakan Joi untuk validasi data masukan. Error validasi dikembalikan dengan kode status 400 dan pesan error spesifik untuk setiap field yang bermasalah.

## Kategori Endpoint

Dokumentasi API dibagi menjadi beberapa kategori:

1. [Autentikasi](autentikasi.md) - Endpoint untuk login, logout, dan manajemen sesi
2. [Manajemen Pengguna](manajemen_pengguna.md) - Endpoint untuk mengelola pengguna
3. [Tim Kerja](tim_kerja.md) - Endpoint untuk mengelola tim kerja
4. [Manajemen Ruangan](manajemen_ruangan.md) - Endpoint untuk mengelola ruang rapat
5. [Pengelolaan Peminjaman](pengelolaan_peminjaman.md) - Endpoint untuk mengelola peminjaman ruang
6. [Sistem Absensi](sistem_absensi.md) - Endpoint untuk sistem absensi kehadiran rapat
7. [Penanganan Error](penanganan_error.md) - Informasi tentang penanganan dan format error

## Rate Limiting

API tidak menerapkan rate limiting secara ketat, namun sebaiknya klien membatasi jumlah permintaan untuk mencegah beban server yang berlebihan.

## Pedoman Praktis Terbaik

1. **Pagination**: Gunakan parameter `page` dan `size` untuk permintaan yang mengembalikan banyak data
2. **Validasi Data**: Validasi data sebelum mengirimkan permintaan ke API
3. **Penanganan Error**: Buat penanganan error yang komprehensif di sisi klien
4. **Caching**: Gunakan caching di sisi klien untuk data yang jarang berubah
5. **Autentikasi**: Perbarui token sebelum kedaluwarsa untuk menjaga sesi pengguna

## Format Tanggal dan Waktu

- Format tanggal: `YYYY-MM-DD` (contoh: 2025-04-28)
- Format waktu: `HH:MM` (contoh: 09:00)
- Waktu menggunakan sistem 24 jam

## Dukungan dan Kontak

Untuk pertanyaan atau dukungan terkait API, silakan hubungi:
- Administrator Sistem Pusdatin
- Email: support@pusdatin.id
- Telepon: (021) 1234567