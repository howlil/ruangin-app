# Dokumentasi API: Tim Kerja

Dokumentasi ini menjelaskan endpoint API yang berhubungan dengan manajemen tim kerja di sistem peminjaman ruang rapat.

## Daftar Isi

- [Membuat Tim Kerja](#membuat-tim-kerja)
- [Mendapatkan Semua Tim Kerja](#mendapatkan-semua-tim-kerja)
- [Mendapatkan Tim Kerja berdasarkan ID](#mendapatkan-tim-kerja-berdasarkan-id)
- [Memperbarui Tim Kerja](#memperbarui-tim-kerja)
- [Menghapus Tim Kerja](#menghapus-tim-kerja)

## Membuat Tim Kerja

Membuat tim kerja baru.

- **URL**: `/api/v1/tim-kerja`
- **Metode**: `POST`
- **Autentikasi**: Ya
- **Hak Akses**: SUPERADMIN

**Headers**:

```
Authorization: Bearer {token}
```

**Request Body**:

```json
{
  "nama_tim_kerja": "Tim Baru",
  "code": "TB01",
  "is_aktif": "true"
}
```

**Respon Sukses (201)**:

```json
{
  "status": true,
  "message": "TimKerja created successfully",
  "data": {
    "id": "uuid-string",
    "nama_tim_kerja": "Tim Baru",
    "code": "TB01",
    "is_aktif": true,
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
    "message": "Data Sudah Ada"
  }
  ```
  
  atau
  
  ```json
  {
    "error": true,
    "message": "Kode Tim Kerja Sudah Digunakan"
  }
  ```

### Catatan

- Field `is_aktif` dapat berupa string (`"true"` atau `"false"`) dan akan dikonversi ke boolean
- `code` harus unik di seluruh sistem
- `nama_tim_kerja` juga harus unik di seluruh sistem

## Mendapatkan Semua Tim Kerja

Mengembalikan daftar semua tim kerja dengan pagination.

- **URL**: `/api/v1/tim-kerja`
- **Metode**: `GET`
- **Autentikasi**: Ya
- **Hak Akses**: Semua pengguna terautentikasi
- **Parameter Query**:
  - `page` (opsional, default=1): Nomor halaman
  - `size` (opsional, default=10): Jumlah item per halaman

**Headers**:

```
Authorization: Bearer {token}
```

**Respon Sukses (200)**:

```json
{
  "status": true,
  "message": "Get all divisi successful",
  "data": [
    {
      "id": "uuid-string",
      "nama_tim_kerja": "Nama Tim",
      "code": "TM01",
      "is_aktif": true,
      "createdAt": "2025-04-27T10:00:00.000Z",
      "updatedAt": "2025-04-27T10:00:00.000Z",
      "detail_pengguna": {
        "Pengguna": {
          "nama_lengkap": "Nama Pengguna",
          "email": "user@example.com",
          "role": "PEMINJAM"
        }
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

- Respon juga menyertakan informasi tentang pengguna yang terkait dengan tim kerja (jika ada)

## Mendapatkan Tim Kerja berdasarkan ID

Mengembalikan tim kerja tertentu berdasarkan ID.

- **URL**: `/api/v1/tim-kerja/:id`
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
  "message": "Get divisi successful",
  "data": {
    "id": "uuid-string",
    "nama_tim_kerja": "Nama Tim",
    "code": "TM01",
    "is_aktif": true,
    "createdAt": "2025-04-27T10:00:00.000Z",
    "updatedAt": "2025-04-27T10:00:00.000Z",
    "detail_pengguna": {
      "Pengguna": {
        "nama_lengkap": "Nama Pengguna",
        "email": "user@example.com",
        "role": "PEMINJAM"
      }
    }
  }
}
```

**Respon Error**:

- **404 Not Found**:
  ```json
  {
    "error": true,
    "message": "Data Tidak Ditemukan"
  }
  ```

## Memperbarui Tim Kerja

Memperbarui tim kerja yang ada.

- **URL**: `/api/v1/tim-kerja/:id`
- **Metode**: `PATCH`
- **Autentikasi**: Ya
- **Hak Akses**: SUPERADMIN

**Headers**:

```
Authorization: Bearer {token}
```

**Request Body** (semua field bersifat opsional):

```json
{
  "nama_tim_kerja": "Tim Diperbarui",
  "code": "TD01",
  "is_aktif": "false"
}
```

**Respon Sukses (200)**:

```json
{
  "status": true,
  "message": "TimKerja updated successfully",
  "data": {
    "id": "uuid-string",
    "nama_tim_kerja": "Tim Diperbarui",
    "code": "TD01",
    "is_aktif": false,
    "createdAt": "2025-04-27T10:00:00.000Z",
    "updatedAt": "2025-04-27T10:30:00.000Z"
  }
}
```

**Respon Error**:

- **400 Bad Request**:
  ```json
  {
    "error": true,
    "message": "Nama Tim Kerja Sudah Digunakan"
  }
  ```
  
  atau
  
  ```json
  {
    "error": true,
    "message": "Kode Tim Kerja Sudah Digunakan"
  }
  ```

- **404 Not Found**:
  ```json
  {
    "error": true,
    "message": "Data Tidak Ditemukan"
  }
  ```

### Catatan

- Pembaruan hanya untuk status aktif (is_aktif) dapat dilakukan dengan hanya mengirimkan field `is_aktif`
- Field `is_aktif` dapat berupa string (`"true"` atau `"false"`) dan akan dikonversi ke boolean
- Jika `nama_tim_kerja` atau `code` diubah, sistem akan memeriksa apakah nilai baru sudah digunakan oleh tim kerja lain

## Menghapus Tim Kerja

Menghapus tim kerja dari sistem.

- **URL**: `/api/v1/tim-kerja/:id`
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
  "message": "Data deleted successfully"
}
```

**Respon Error**:

- **400 Bad Request**:
  ```json
  {
    "error": true,
    "message": "Cannot delete timKerja with active users"
  }
  ```

- **404 Not Found**:
  ```json
  {
    "error": true,
    "message": "Data not found"
  }
  ```

### Catatan

- Tim kerja yang memiliki pengguna aktif tidak dapat dihapus
- Hapus terlebih dahulu pengguna yang terkait dengan tim kerja sebelum menghapus tim kerja