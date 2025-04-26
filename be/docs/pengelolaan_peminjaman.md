# Dokumentasi API: Pengelolaan Peminjaman

Dokumentasi ini menjelaskan endpoint API yang berhubungan dengan pengelolaan peminjaman ruang rapat di sistem.

## Daftar Isi

- [Membuat Peminjaman](#membuat-peminjaman)
- [Memperbarui Status Peminjaman](#memperbarui-status-peminjaman)
- [Mendapatkan Semua Peminjaman Pengguna](#mendapatkan-semua-peminjaman-pengguna)
- [Mendapatkan Riwayat Peminjaman](#mendapatkan-riwayat-peminjaman)
- [Mendapatkan Ajuan Peminjaman](#mendapatkan-ajuan-peminjaman)
- [Mendapatkan Peminjaman berdasarkan ID](#mendapatkan-peminjaman-berdasarkan-id)
- [Mendapatkan Statistik Ruangan](#mendapatkan-statistik-ruangan)
- [Memeriksa Ketersediaan Ruangan](#memeriksa-ketersediaan-ruangan)
- [Menghitung Peminjaman berdasarkan Status](#menghitung-peminjaman-berdasarkan-status)

## Membuat Peminjaman

Membuat peminjaman ruang rapat baru.

- **URL**: `/api/v1/peminjaman`
- **Metode**: `POST`
- **Autentikasi**: Ya
- **Hak Akses**: PEMINJAM atau ADMIN

**Headers**:

```
Authorization: Bearer {token}
```

**Request Body**:

```json
{
  "ruang_rapat_id": "uuid-string",
  "nama_kegiatan": "Rapat Direksi",
  "tanggal_mulai": "2025-04-28",
  "tanggal_selesai": "2025-04-28",
  "jam_mulai": "09:00",
  "jam_selesai": "12:00",
  "no_surat_peminjaman": "REF/2025/04/123"
}
```

**Respon Sukses (201)**:

```json
{
  "status": true,
  "message": "Booking created successfully",
  "data": {
    "id": "uuid-string",
    "pengguna_id": "uuid-string",
    "ruang_rapat_id": "uuid-string",
    "nama_kegiatan": "Rapat Direksi",
    "tanggal_mulai": "2025-04-28",
    "tanggal_selesai": "2025-04-28",
    "jam_mulai": "09:00",
    "jam_selesai": "12:00",
    "no_surat_peminjaman": "REF/2025/04/123",
    "status": "DIPROSES",
    "createdAt": "2025-04-27T10:00:00.000Z",
    "updatedAt": "2025-04-27T10:00:00.000Z",
    "Pengguna": {
      "nama_lengkap": "Nama Pengguna",
      "email": "user@example.com"
    },
    "RuangRapat": {
      "id": "uuid-string",
      "nama_ruangan": "Ruang Rapat A",
      "deskripsi": "Ruang konferensi besar dengan proyektor",
      "lokasi_ruangan": "Gedung A, Lantai 2",
      "kapasitas": "20",
      "foto_ruangan": "/images/1682599154782.jpg",
      "createdAt": "2025-04-27T10:00:00.000Z",
      "updatedAt": "2025-04-27T10:00:00.000Z"
    }
  }
}
```

**Respon Error**:

- **400 Bad Request**:
  ```json
  {
    "error": true,
    "message": "Ruangan sudah dipinjam pada waktu ini"
  }
  ```
  
  atau
  
  ```json
  {
    "error": true,
    "message": "Tidak bisa melakukan peminjaman pada cuti bersama: Hari Raya Idul Fitri"
  }
  ```
  
  atau
  
  ```json
  {
    "error": true,
    "message": "Tanggal Peminjaman harus dihari kerja (Senin - Jumat)"
  }
  ```

- **403 Forbidden**:
  ```json
  {
    "error": true,
    "message": "hanya peminjam and admin yang melakukan peminjaman"
  }
  ```

- **404 Not Found**:
  ```json
  {
    "error": true,
    "message": "ruang rapat tidak ditemukan"
  }
  ```

### Validasi dan Catatan

- `tanggal_mulai` dan `tanggal_selesai` harus dalam format `YYYY-MM-DD`
- `tanggal_selesai` opsional untuk peminjaman satu hari, jika tidak disediakan akan menggunakan `tanggal_mulai`
- `jam_mulai` dan `jam_selesai` harus dalam format `HH:MM` dan dalam rentang jam kerja (07:00-17:00)
- Peminjaman hanya dapat dilakukan pada hari kerja (Senin-Jumat)
- Peminjaman tidak dapat dilakukan pada hari libur atau cuti bersama
- Sistem mengecek ketersediaan ruangan untuk mencegah konflik jadwal
- Pengguna harus terkait dengan tim kerja yang aktif
- Status awal peminjaman adalah `DIPROSES`

## Memperbarui Status Peminjaman

Memperbarui status dan informasi peminjaman ruang rapat.

- **URL**: `/api/v1/peminjaman/:peminjamanId/status`
- **Metode**: `PATCH`
- **Autentikasi**: Ya
- **Hak Akses**: ADMIN

**Headers**:

```
Authorization: Bearer {token}
```

**Request Body** (semua field bersifat opsional kecuali field yang diperlukan untuk status tertentu):

```json
{
  "ruang_rapat_id": "uuid-string",
  "nama_kegiatan": "Rapat Direksi (Diperbarui)",
  "tanggal_mulai": "2025-04-29",
  "tanggal_selesai": "2025-04-29",
  "jam_mulai": "10:00",
  "jam_selesai": "13:00",
  "no_surat_peminjaman": "REF/2025/04/123-UPD",
  "status": "DISETUJUI",
  "alasan_penolakan": "Alasan jika status DITOLAK"
}
```

**Respon Sukses (200)**:

```json
{
  "status": true,
  "message": "Booking disetujui successfully",
  "data": {
    "id": "uuid-string",
    "pengguna_id": "uuid-string",
    "ruang_rapat_id": "uuid-string",
    "nama_kegiatan": "Rapat Direksi (Diperbarui)",
    "tanggal_mulai": "2025-04-29",
    "tanggal_selesai": "2025-04-29",
    "jam_mulai": "10:00",
    "jam_selesai": "13:00",
    "no_surat_peminjaman": "REF/2025/04/123-UPD",
    "status": "DISETUJUI",
    "alasan_penolakan": null,
    "createdAt": "2025-04-27T10:00:00.000Z",
    "updatedAt": "2025-04-27T11:00:00.000Z",
    "Pengguna": {
      "nama_lengkap": "Nama Pengguna",
      "email": "user@example.com",
      "DetailPengguna": {
        "tim_kerja": {
          "code": "TM01",
          "nama_tim_kerja": "Nama Tim"
        }
      }
    },
    "RuangRapat": {
      "id": "uuid-string",
      "nama_ruangan": "Ruang Rapat A",
      "deskripsi": "Ruang konferensi besar dengan proyektor",
      "lokasi_ruangan": "Gedung A, Lantai 2",
      "kapasitas": "20",
      "foto_ruangan": "/images/1682599154782.jpg"
    },
    "Absensi": {
      "link_absensi": "http://frontend-url.com/absensi?u=a1b2c3d4e5f6"
    },
    "absensi_link": "http://frontend-url.com/absensi?u=a1b2c3d4e5f6"
  }
}
```

**Respon Error**:

- **400 Bad Request**:
  ```json
  {
    "error": true,
    "message": "Room is already booked for this time period"
  }
  ```
  
  atau
  
  ```json
  {
    "error": true,
    "message": "Alasan penolakan harus diisi ketika menolak peminjaman"
  }
  ```
  
  atau
  
  ```json
  {
    "error": true,
    "message": "Cannot update booking with status DITOLAK. Only DIPROSES and DISETUJUI status can be updated"
  }
  ```

- **403 Forbidden**:
  ```json
  {
    "error": true,
    "message": "Only ADMIN can update bookings"
  }
  ```

- **404 Not Found**:
  ```json
  {
    "error": true,
    "message": "Booking not found"
  }
  ```

### Catatan

- Hanya admin yang dapat memperbarui status peminjaman
- Jika status diperbarui menjadi `DISETUJUI`, tautan absensi akan dibuat secara otomatis
- Jika status diperbarui menjadi `DITOLAK`, alasan penolakan wajib diisi
- Hanya peminjaman dengan status `DIPROSES` atau `DISETUJUI` yang dapat diperbarui
- Ketika memperbarui ruangan atau waktu, sistem akan memeriksa konflik jadwal
- Validasi tanggal dan jam sama seperti pada pembuatan peminjaman

## Mendapatkan Semua Peminjaman Pengguna

Mengembalikan daftar semua peminjaman untuk pengguna yang sedang login.

- **URL**: `/api/v1/peminjaman`
- **Metode**: `GET`
- **Autentikasi**: Ya
- **Hak Akses**: Semua pengguna terautentikasi
- **Parameter Query**:
  - `page` (opsional, default=1): Nomor halaman
  - `size` (opsional, default=10): Jumlah item per halaman
  - `status` (opsional): Filter berdasarkan status

**Headers**:

```
Authorization: Bearer {token}
```

**Respon Sukses (200)**:

```json
{
  "status": true,
  "message": "Get all bookings successful",
  "data": [
    {
      "id": "uuid-string",
      "pengguna_id": "uuid-string",
      "ruang_rapat_id": "uuid-string",
      "nama_kegiatan": "Rapat Direksi",
      "tanggal_mulai": "2025-04-28",
      "tanggal_selesai": "2025-04-28",
      "jam_mulai": "09:00",
      "jam_selesai": "12:00",
      "no_surat_peminjaman": "REF/2025/04/123",
      "status": "DIPROSES",
      "alasan_penolakan": null,
      "createdAt": "2025-04-27T10:00:00.000Z",
      "updatedAt": "2025-04-27T10:00:00.000Z",
      "Pengguna": {
        "nama_lengkap": "Nama Pengguna",
        "email": "user@example.com",
        "DetailPengguna": {
          "tim_kerja": {
            "code": "TM01",
            "nama_tim_kerja": "Nama Tim"
          }
        }
      },
      "RuangRapat": {
        "id": "uuid-string",
        "nama_ruangan": "Ruang Rapat A",
        "deskripsi": "Ruang konferensi besar dengan proyektor",
        "lokasi_ruangan": "Gedung A, Lantai 2",
        "kapasitas": "20",
        "foto_ruangan": "/images/1682599154782.jpg"
      },
      "Absensi": {
        "link_absensi": "http://frontend-url.com/absensi?u=a1b2c3d4e5f6"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "size": 10,
    "total_rows": 5,
    "total_pages": 1
  }
}
```

### Catatan

- Endpoint ini hanya mengembalikan peminjaman yang dibuat oleh pengguna yang sedang login
- Peminjaman diurutkan berdasarkan tanggal pembuatan (terbaru lebih dulu)
- Parameter `status` dapat berupa salah satu dari: `DIPROSES`, `DISETUJUI`, `DITOLAK`, `SELESAI`

## Mendapatkan Riwayat Peminjaman

Mengembalikan daftar riwayat peminjaman (untuk admin).

- **URL**: `/api/v2/peminjaman`
- **Metode**: `GET`
- **Autentikasi**: Ya
- **Hak Akses**: Semua pengguna terautentikasi
- **Parameter Query**:
  - `page` (opsional, default=1): Nomor halaman
  - `size` (opsional, default=10): Jumlah item per halaman
  - `status` (opsional): Filter berdasarkan status
  - `ruangRapatId` (opsional): Filter berdasarkan ID ruang rapat
  - `tanggalMulai` (opsional): Filter berdasarkan tanggal mulai
  - `tanggalAkhir` (opsional): Filter berdasarkan tanggal akhir

**Headers**:

```
Authorization: Bearer {token}
```

**Respon Sukses (200)**:

```json
{
  "status": true,
  "message": "Get peminjaman diproses successful",
  "data": [
    {
      "id": "uuid-string",
      "pengguna_id": "uuid-string",
      "ruang_rapat_id": "uuid-string",
      "nama_kegiatan": "Rapat Direksi",
      "tanggal_mulai": "2025-04-28",
      "tanggal_selesai": "2025-04-28",
      "jam_mulai": "09:00",
      "jam_selesai": "12:00",
      "no_surat_peminjaman": "REF/2025/04/123",
      "status": "DISETUJUI",
      "alasan_penolakan": null,
      "createdAt": "2025-04-27T10:00:00.000Z",
      "updatedAt": "2025-04-27T10:00:00.000Z",
      "Pengguna": {
        "id": "uuid-string",
        "nama_lengkap": "Nama Pengguna",
        "email": "user@example.com",
        "DetailPengguna": {
          "tim_kerja": {
            "id": "uuid-string",
            "nama_tim_kerja": "Nama Tim",
            "code": "TM01",
            "is_aktif": true
          }
        }
      },
      "RuangRapat": {
        "id": "uuid-string",
        "nama_ruangan": "Ruang Rapat A",
        "deskripsi": "Ruang konferensi besar dengan proyektor",
        "lokasi_ruangan": "Gedung A, Lantai 2",
        "kapasitas": "20",
        "foto_ruangan": "/images/1682599154782.jpg"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "size": 10,
    "total_rows": 5,
    "total_pages": 1
  }
}
```

### Catatan

- Endpoint ini mengembalikan peminjaman dengan status selain `DIPROSES` jika parameter `status` tidak ditentukan
- Peminjaman diurutkan berdasarkan tanggal pembaruan (terbaru lebih dulu)
- Parameter `tanggalMulai` dan `tanggalAkhir` harus dalam format `YYYY-MM-DD`

## Mendapatkan Ajuan Peminjaman

Mengembalikan daftar ajuan peminjaman yang sedang diproses (untuk admin).

- **URL**: `/api/v2/peminjaman/diproses`
- **Metode**: `GET`
- **Autentikasi**: Ya
- **Hak Akses**: Semua pengguna terautentikasi
- **Parameter Query**:
  - `page` (opsional, default=1): Nomor halaman
  - `size` (opsional, default=10): Jumlah item per halaman
  - `ruangRapatId` (opsional): Filter berdasarkan ID ruang rapat
  - `tanggalMulai` (opsional): Filter berdasarkan tanggal mulai
  - `tanggalAkhir` (opsional): Filter berdasarkan tanggal akhir

**Headers**:

```
Authorization: Bearer {token}
```

**Respon Sukses (200)**:

```json
{
  "status": true,
  "message": "Get peminjaman diproses successful",
  "data": [
    {
      "id": "uuid-string",
      "pengguna_id": "uuid-string",
      "ruang_rapat_id": "uuid-string",
      "nama_kegiatan": "Rapat Direksi",
      "tanggal_mulai": "2025-04-28",
      "tanggal_selesai": "2025-04-28",
      "jam_mulai": "09:00",
      "jam_selesai": "12:00",
      "no_surat_peminjaman": "REF/2025/04/123",
      "status": "DIPROSES",
      "alasan_penolakan": null,
      "createdAt": "2025-04-27T10:00:00.000Z",
      "updatedAt": "2025-04-27T10:00:00.000Z",
      "Pengguna": {
        "id": "uuid-string",
        "nama_lengkap": "Nama Pengguna",
        "email": "user@example.com",
        "DetailPengguna": {
          "tim_kerja": {
            "id": "uuid-string",
            "nama_tim_kerja": "Nama Tim",
            "code": "TM01",
            "is_aktif": true
          }
        }
      },
      "RuangRapat": {
        "id": "uuid-string",
        "nama_ruangan": "Ruang Rapat A",
        "deskripsi": "Ruang konferensi besar dengan proyektor",
        "lokasi_ruangan": "Gedung A, Lantai 2",
        "kapasitas": "20",
        "foto_ruangan": "/images/1682599154782.jpg"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "size": 10,
    "total_rows": 5,
    "total_pages": 1
  }
}
```

### Catatan

- Endpoint ini selalu mengembalikan peminjaman dengan status `DIPROSES`
- Peminjaman diurutkan berdasarkan tanggal pembuatan (terbaru lebih dulu)
- Parameter `tanggalMulai` dan `tanggalAkhir` harus dalam format `YYYY-MM-DD`

## Mendapatkan Peminjaman berdasarkan ID

Mengembalikan detail peminjaman berdasarkan ID.

- **URL**: `/api/v1/peminjaman/:peminjamanId`
- **Metode**: `GET`
- **Autentikasi**: Ya
- **Hak Akses**: Semua pengguna terautentikasi (dengan batasan)

**Headers**:

```
Authorization: Bearer {token}
```

**Respon Sukses (200)**:

```json
{
  "status": true,
  "message": "Get booking successful",
  "data": {
    "id": "uuid-string",
    "pengguna_id": "uuid-string",
    "ruang_rapat_id": "uuid-string",
    "nama_kegiatan": "Rapat Direksi",
    "tanggal_mulai": "2025-04-28",
    "tanggal_selesai": "2025-04-28",
    "jam_mulai": "09:00",
    "jam_selesai": "12:00",
    "no_surat_peminjaman": "REF/2025/04/123",
    "status": "DIPROSES",
    "alasan_penolakan": null,
    "createdAt": "2025-04-27T10:00:00.000Z",
    "updatedAt": "2025-04-27T10:00:00.000Z",
    "Pengguna": {
      "nama_lengkap": "Nama Pengguna",
      "email": "user@example.com",
      "DetailPengguna": {
        "tim_kerja": {
          "id": "uuid-string",
          "nama_tim_kerja": "Nama Tim",
          "code": "TM01",
          "is_aktif": true
        }
      }
    },
    "RuangRapat": {
      "id": "uuid-string",
      "nama_ruangan": "Ruang Rapat A",
      "deskripsi": "Ruang konferensi besar dengan proyektor",
      "lokasi_ruangan": "Gedung A, Lantai 2",
      "kapasitas": "20",
      "foto_ruangan": "/images/1682599154782.jpg"
    }
  }
}
```

**Respon Error**:

- **403 Forbidden**:
  ```json
  {
    "error": true,
    "message": "Access denied"
  }
  ```

- **404 Not Found**:
  ```json
  {
    "error": true,
    "message": "Booking not found"
  }
  ```

### Catatan

- Pengguna dengan peran `PEMINJAM` hanya dapat melihat peminjaman yang mereka buat
- Pengguna dengan peran `ADMIN` atau `SUPERADMIN` dapat melihat semua peminjaman

## Mendapatkan Statistik Ruangan

Mengembalikan statistik penggunaan ruangan.

- **URL**: `/api/v1/statistik`
- **Metode**: `GET`
- **Autentikasi**: Ya
- **Hak Akses**: Semua pengguna terautentikasi
- **Parameter Query**:
  - `tanggalMulai` (opsional): Filter berdasarkan tanggal mulai
  - `tanggalAkhir` (opsional): Filter berdasarkan tanggal akhir

**Headers**:

```
Authorization: Bearer {token}
```

**Respon Sukses (200)**:

```json
{
  "status": true,
  "message": "Statistics data retrieved successfully",
  "data": [
    {
      "ruangan": "Ruang Rapat A",
      "jumlah_peminjaman": 12
    },
    {
      "ruangan": "Ruang Rapat B",
      "jumlah_peminjaman": 8
    }
  ]
}
```

### Catatan

- Statistik hanya menghitung peminjaman dengan status `SELESAI`
- Parameter `tanggalMulai` dan `tanggalAkhir` harus dalam format `YYYY-MM-DD`
- Jika parameter tidak ditentukan, statistik akan mencakup semua peminjaman yang selesai

## Memeriksa Ketersediaan Ruangan

Memeriksa ketersediaan ruangan pada tanggal dan jam tertentu.

- **URL**: `/api/v1/check`
- **Metode**: `POST`
- **Autentikasi**: Tidak
- **Hak Akses**: Tidak ada

**Request Body**:

```json
{
  "tanggal": "2025-04-28",
  "jam": "09:00"
}
```

**Respon Sukses (200)**:

```json
{
  "status": true,
  "message": "Berhasil mengecek ketersediaan ruangan",
  "data": {
    "tanggal": "2025-04-28",
    "jam": "09:00",
    "jumlah_ruangan_tersedia": 3,
    "ruangan_tersedia": [
      {
        "id": "uuid-string",
        "nama_ruangan": "Ruang Rapat B",
        "kapasitas": "15",
        "lokasi": "Gedung A, Lantai 1",
        "deskripsi": "Ruang rapat kecil dengan whiteboard",
        "foto_ruangan": "/images/1682599154783.jpg"
      },
      {
        "id": "uuid-string",
        "nama_ruangan": "Ruang Rapat C",
        "kapasitas": "30",
        "lokasi": "Gedung B, Lantai 2",
        "deskripsi": "Ruang konferensi besar dengan proyektor dan sistem audio",
        "foto_ruangan": "/images/1682599154784.jpg"
      },
      {
        "id": "uuid-string",
        "nama_ruangan": "Ruang Rapat D",
        "kapasitas": "10",
        "lokasi": "Gedung A, Lantai 3",
        "deskripsi": "Ruang rapat kecil untuk diskusi",
        "foto_ruangan": "/images/1682599154785.jpg"
      }
    ]
  }
}
```

**Respon Error**:

- **400 Bad Request**:
  ```json
  {
    "error": true,
    "message": "Tidak bisa melakukan peminjaman pada cuti bersama: Hari Raya Idul Fitri"
  }
  ```
  
  atau
  
  ```json
  {
    "error": true,
    "message": "Tanggal Peminjaman harus dihari kerja (Senin - Jumat)"
  }
  ```

### Validasi dan Catatan

- `tanggal` harus dalam format `YYYY-MM-DD`
- `jam` harus dalam format `HH:MM`
- Pemeriksaan hanya dapat dilakukan untuk hari kerja (Senin-Jumat)
- Pemeriksaan tidak dapat dilakukan untuk hari libur atau cuti bersama
- Hasil menampilkan ruangan yang tersedia pada waktu yang ditentukan
- Ruangan diurutkan berdasarkan nama ruangan (A-Z)
- Jika tanggal dan jam sudah lewat, tidak ada ruangan yang akan ditampilkan

## Menghitung Peminjaman berdasarkan Status

Mengembalikan jumlah peminjaman untuk masing-masing status.

- **URL**: `/api/v2/statistik`
- **Metode**: `GET`
- **Autentikasi**: Ya
- **Hak Akses**: Semua pengguna terautentikasi

**Headers**:

```
Authorization: Bearer {token}
```

**Respon Sukses (200)**:

```json
{
  "status": true,
  "message": "Berhasil Mengambil data dashboard",
  "data": {
    "DIPROSES": 5,
    "DISETUJUI": 8,
    "DITOLAK": 2,
    "SELESAI": 15
  }
}
```

### Catatan

- Endpoint ini berguna untuk dashboard administrator
- Menghitung total peminjaman untuk masing-masing status
- Tidak ada parameter filter yang tersedia untuk endpoint ini