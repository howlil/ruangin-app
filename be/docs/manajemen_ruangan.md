# Dokumentasi API: Manajemen Ruangan

Dokumentasi ini menjelaskan endpoint API yang berhubungan dengan manajemen ruang rapat di sistem peminjaman ruang rapat.

## Daftar Isi

- [Membuat Ruang Rapat](#membuat-ruang-rapat)
- [Mendapatkan Semua Ruang Rapat](#mendapatkan-semua-ruang-rapat)
- [Mendapatkan Ruang Rapat berdasarkan ID](#mendapatkan-ruang-rapat-berdasarkan-id)
- [Memperbarui Ruang Rapat](#memperbarui-ruang-rapat)
- [Menghapus Ruang Rapat](#menghapus-ruang-rapat)
- [Mendapatkan Jadwal Ruangan Hari Ini](#mendapatkan-jadwal-ruangan-hari-ini)

## Membuat Ruang Rapat

Membuat ruang rapat baru.

- **URL**: `/api/v1/ruang-rapat`
- **Metode**: `POST`
- **Autentikasi**: Ya
- **Hak Akses**: SUPERADMIN
- **Content-Type**: `multipart/form-data`

**Headers**:

```
Authorization: Bearer {token}
```

**Request Body**:

```
nama_ruangan: "Ruang Rapat A"
deskripsi: "Ruang konferensi besar dengan proyektor"
lokasi_ruangan: "Gedung A, Lantai 2"
kapasitas: "20"
foto_ruangan: [file upload]
```

**Respon Sukses (201)**:

```json
{
  "status": true,
  "message": "Room created successfully",
  "data": {
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
```

**Respon Error**:

- **400 Bad Request**:
  ```json
  {
    "error": true,
    "message": "Room name already exists"
  }
  ```
  
  atau
  
  ```json
  {
    "error": true,
    "message": "Room image is required"
  }
  ```

### Catatan

- Field `foto_ruangan` harus berupa file gambar (JPG, JPEG, atau PNG)
- Ukuran file maksimum adalah 5 MB
- `nama_ruangan` harus unik di seluruh sistem
- `kapasitas` disimpan sebagai string, meskipun merepresentasikan angka

## Mendapatkan Semua Ruang Rapat

Mengembalikan daftar semua ruang rapat dengan pagination.

- **URL**: `/api/v1/ruang-rapat`
- **Metode**: `GET`
- **Autentikasi**: Tidak
- **Hak Akses**: Tidak ada
- **Parameter Query**:
  - `page` (opsional, default=1): Nomor halaman
  - `size` (opsional, default=10): Jumlah item per halaman
  - `status` (opsional): Filter berdasarkan status peminjaman
  - `month` (opsional): Filter berdasarkan bulan (YYYY-MM)

**Respon Sukses (200)**:

```json
{
  "status": true,
  "message": "Get all rooms successful",
  "data": [
    {
      "id": "uuid-string",
      "nama_ruangan": "Ruang Rapat A",
      "deskripsi": "Ruang konferensi besar dengan proyektor",
      "lokasi_ruangan": "Gedung A, Lantai 2",
      "kapasitas": "20",
      "foto_ruangan": "/images/1682599154782.jpg",
      "createdAt": "2025-04-27T10:00:00.000Z",
      "updatedAt": "2025-04-27T10:00:00.000Z",
      "peminjaman": [
        {
          "id": "uuid-string",
          "nama_kegiatan": "Rapat Direksi",
          "no_surat_peminjaman": "REF/2025/04/123",
          "tanggal_mulai": "2025-04-28",
          "tanggal_selesai": "2025-04-28",
          "jam_mulai": "09:00",
          "jam_selesai": "12:00",
          "status": "DISETUJUI",
          "Pengguna": {
            "nama_lengkap": "Nama Pengguna",
            "email": "user@example.com",
            "DetailPengguna": {
              "tim_kerja": {
                "code": "TM01",
                "nama_tim_kerja": "Nama Tim"
              }
            }
          }
        }
      ]
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

- Endpoint ini dapat diakses tanpa autentikasi, berguna untuk menampilkan informasi ruangan di halaman publik
- Parameter `month` harus dalam format `YYYY-MM` (contoh: 2025-04)
- Parameter `status` dapat berupa salah satu dari: `DIPROSES`, `DISETUJUI`, `DITOLAK`, `SELESAI`
- Jika `status` atau `month` ditentukan, hanya ruangan dengan peminjaman yang cocok yang akan dikembalikan

## Mendapatkan Ruang Rapat berdasarkan ID

Mengembalikan ruang rapat tertentu berdasarkan ID.

- **URL**: `/api/v1/ruang-rapat/:id`
- **Metode**: `GET`
- **Autentikasi**: Tidak
- **Hak Akses**: Tidak ada

**Respon Sukses (200)**:

```json
{
  "status": true,
  "message": "Get room successful",
  "data": {
    "id": "uuid-string",
    "nama_ruangan": "Ruang Rapat A",
    "deskripsi": "Ruang konferensi besar dengan proyektor",
    "lokasi_ruangan": "Gedung A, Lantai 2",
    "kapasitas": "20",
    "foto_ruangan": "/images/1682599154782.jpg",
    "createdAt": "2025-04-27T10:00:00.000Z",
    "updatedAt": "2025-04-27T10:00:00.000Z",
    "peminjaman": [
      {
        "id": "uuid-string",
        "nama_kegiatan": "Rapat Direksi",
        "tanggal_mulai": "2025-04-28",
        "tanggal_selesai": "2025-04-28",
        "jam_mulai": "09:00",
        "jam_selesai": "12:00",
        "status": "DISETUJUI",
        "Pengguna": {
          "nama_lengkap": "Nama Pengguna",
          "email": "user@example.com"
        }
      }
    ]
  }
}
```

**Respon Error**:

- **404 Not Found**:
  ```json
  {
    "error": true,
    "message": "Room not found"
  }
  ```

### Catatan

- Respon menyertakan daftar peminjaman untuk ruangan tersebut
- Peminjaman diurutkan berdasarkan tanggal pembuatan (terbaru lebih dulu)

## Memperbarui Ruang Rapat

Memperbarui ruang rapat yang ada.

- **URL**: `/api/v1/ruang-rapat/:id`
- **Metode**: `PATCH`
- **Autentikasi**: Ya
- **Hak Akses**: SUPERADMIN
- **Content-Type**: `multipart/form-data`

**Headers**:

```
Authorization: Bearer {token}
```

**Request Body** (semua field bersifat opsional):

```
nama_ruangan: "Ruang Rapat Diperbarui"
deskripsi: "Deskripsi diperbarui"
lokasi_ruangan: "Gedung B, Lantai 1"
kapasitas: "15"
foto_ruangan: [file upload]
```

**Respon Sukses (200)**:

```json
{
  "status": true,
  "message": "Room updated successfully",
  "data": {
    "id": "uuid-string",
    "nama_ruangan": "Ruang Rapat Diperbarui",
    "deskripsi": "Deskripsi diperbarui",
    "lokasi_ruangan": "Gedung B, Lantai 1",
    "kapasitas": "15",
    "foto_ruangan": "/images/1682599987654.jpg",
    "createdAt": "2025-04-27T10:00:00.000Z",
    "updatedAt": "2025-04-27T11:00:00.000Z"
  }
}
```

**Respon Error**:

- **400 Bad Request**:
  ```json
  {
    "error": true,
    "message": "Room name already exists"
  }
  ```

- **404 Not Found**:
  ```json
  {
    "error": true,
    "message": "Room not found"
  }
  ```

### Catatan

- Jika foto baru diunggah, foto lama akan dihapus dari server
- Field yang tidak disertakan dalam request akan mempertahankan nilai yang ada
- `nama_ruangan` harus unik di seluruh sistem (jika diubah)

## Menghapus Ruang Rapat

Menghapus ruang rapat dari sistem.

- **URL**: `/api/v1/ruang-rapat/:id`
- **Metode**: `DELETE`
- **Autentikasi**: Ya
- **Hak Akses**: SUPERADMIN

**Headers**:

```
Authorization: Bearer {token}
```

**Respon Sukses (200)**:

```json
{
  "status": true,
  "message": "Room deleted successfully"
}
```

**Respon Error**:

- **400 Bad Request**:
  ```json
  {
    "error": true,
    "message": "Cannot delete room with active bookings"
  }
  ```

- **404 Not Found**:
  ```json
  {
    "error": true,
    "message": "Room not found"
  }
  ```

### Catatan

- Ruangan dengan peminjaman aktif (status `DIPROSES` atau `DISETUJUI`) tidak dapat dihapus
- Setelah menghapus ruangan, foto ruangan juga akan dihapus dari server
- Menghapus ruangan akan menghapus semua data peminjaman terkait

## Mendapatkan Jadwal Ruangan Hari Ini

Mengembalikan daftar peminjaman yang disetujui untuk hari ini, berguna untuk displai informasi.

- **URL**: `/api/v1/display`
- **Metode**: `GET`
- **Autentikasi**: Tidak
- **Hak Akses**: Tidak ada

**Respon Sukses (200)**:

```json
{
  "error": false,
  "message": "Get today's bookings successful",
  "data": [
    {
      "ruang_rapat": "Ruang Rapat A",
      "jadwal": [
        {
          "nama_kegiatan": "Rapat Direksi",
          "jam_mulai": "09:00",
          "jam_selesai": "12:00",
          "tim_kerja": {
            "code": "TM01",
            "nama": "Nama Tim"
          }
        }
      ]
    }
  ]
}
```

### Catatan

- Menampilkan hanya ruangan yang memiliki jadwal peminjaman untuk hari ini dengan status `DISETUJUI`
- Jadwal diurutkan berdasarkan jam mulai (paling awal lebih dulu)
- Berguna untuk menampilkan di layar informasi atau dashboard