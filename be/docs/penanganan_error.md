# Dokumentasi API: Penanganan Error

Dokumentasi ini menjelaskan bagaimana API menangani berbagai jenis error dan format respons error yang digunakan.

## Daftar Isi

- [Format Respons Error](#format-respons-error)
- [Kode Status HTTP](#kode-status-http)
- [Jenis-jenis Error](#jenis-jenis-error)
- [Logging Error](#logging-error)

## Format Respons Error

Semua respons error menggunakan format JSON yang konsisten:

```json
{
  "error": true,
  "message": "Pesan error yang menjelaskan apa yang salah",
  "errors": {
    "field1": "Pesan error spesifik untuk field1",
    "field2": "Pesan error spesifik untuk field2"
  }
}
```

Di mana:
- `error`: Selalu `true` untuk respons error
- `message`: Deskripsi umum error yang terjadi
- `errors`: (opsional) Object yang berisi detail error untuk field spesifik, biasanya untuk error validasi

Untuk respons sukses, format yang digunakan adalah:

```json
{
  "status": true,
  "message": "Pesan sukses",
  "data": {
    // Data respons...
  }
}
```

## Kode Status HTTP

API menggunakan kode status HTTP standar untuk mengindikasikan hasil permintaan:

- **200 OK**: Permintaan berhasil
- **201 Created**: Resource berhasil dibuat
- **400 Bad Request**: Permintaan tidak valid (error validasi, data tidak sesuai, dll.)
- **401 Unauthorized**: Autentikasi diperlukan atau token tidak valid
- **403 Forbidden**: Pengguna tidak memiliki izin untuk mengakses resource
- **404 Not Found**: Resource tidak ditemukan
- **500 Internal Server Error**: Error server yang tidak terduga

## Jenis-jenis Error

### Error Validasi (400 Bad Request)

Error validasi terjadi ketika data yang dikirimkan tidak valid atau tidak sesuai dengan skema yang diharapkan.

```json
{
  "error": true,
  "message": "Validation failed",
  "errors": {
    "nama_ruangan": "nama_ruangan is required",
    "kapasitas": "kapasitas must be a number"
  }
}
```

### Error Autentikasi (401 Unauthorized)

Error autentikasi terjadi ketika pengguna tidak login atau token tidak valid/kedaluwarsa.

```json
{
  "error": true,
  "message": "You are unauthorized, please login first"
}
```

atau

```json
{
  "error": true,
  "message": "Invalid or expired token"
}
```

### Error Izin (403 Forbidden)

Error izin terjadi ketika pengguna tidak memiliki hak akses yang diperlukan untuk operasi tertentu.

```json
{
  "error": true,
  "message": "You do not have permission to perform this action"
}
```

### Error Resource Tidak Ditemukan (404 Not Found)

Error ini terjadi ketika resource yang diminta tidak ditemukan.

```json
{
  "error": true,
  "message": "Resource not found"
}
```

atau spesifik untuk jenis resource:

```json
{
  "error": true,
  "message": "Ruang rapat tidak ditemukan"
}
```

### Error Server (500 Internal Server Error)

Error server terjadi ketika terjadi kesalahan yang tidak terduga di server.

```json
{
  "error": true,
  "message": "Internal Server Error"
}
```

Dalam mode pengembangan, detail tambahan mungkin disertakan:

```json
{
  "error": true,
  "message": "Database connection failed",
  "stack": "Error: Database connection failed\n    at ..."
}
```

### Error Database

Error terkait database ditangani khusus dan memberikan informasi spesifik tentang masalah.

```json
{
  "error": true,
  "message": "Database error",
  "errors": {
    "code": "P2002",
    "details": "Unique constraint failed on the fields: (`email`)"
  }
}
```

## Logging Error

Semua error dicatat (log) untuk tujuan debugging dan monitoring. Log error mencakup:

- Nama dan pesan error
- Stack trace
- URL permintaan
- Metode permintaan
- Waktu
- Body permintaan
- Parameter permintaan
- Query permintaan
- ID pengguna (jika terautentikasi)

### Format Log Error

```
{
  "name": "ValidationError",
  "message": "Validation failed",
  "stack": "ValidationError: Validation failed\n    at validate (/app/src/utils/validation.js:15:11)\n    ...",
  "path": "/api/v1/ruang-rapat",
  "method": "POST",
  "timestamp": "2025-04-27T10:00:00.000Z",
  "requestBody": {
    "nama_ruangan": "",
    "deskripsi": "Ruang konferensi"
  },
  "requestParams": {},
  "requestQuery": {},
  "userId": "uuid-string"
}
```

### Catatan

- Log error sensitif hanya tersedia untuk administrator sistem
- Di lingkungan produksi, detail error internal tidak dikembalikan ke klien untuk alasan keamanan
- Semua log disimpan dalam file terpisah berdasarkan tingkat keparahan (info, warning, error)

## Tips Penanganan Error untuk Pengembang

1. **Selalu periksa kode status HTTP respons** untuk menentukan apakah permintaan berhasil atau gagal.
2. **Baca pesan error dengan seksama** untuk memahami masalah dan cara mengatasinya.
3. **Periksa field `errors` untuk validasi** untuk mendapatkan informasi spesifik tentang field mana yang bermasalah.
4. **Implementasikan penanganan error global** di aplikasi klien untuk menangani error secara konsisten.
5. **Tangani status 401 dengan logout otomatis** di sisi klien untuk mengarahkan pengguna ke halaman login ketika token kedaluwarsa.