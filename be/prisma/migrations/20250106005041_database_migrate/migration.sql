-- CreateTable
CREATE TABLE `Pengguna` (
    `id` VARCHAR(191) NOT NULL,
    `nama_lengkap` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `kata_sandi` VARCHAR(191) NOT NULL,
    `role` ENUM('SUPERADMIN', 'ADMIN', 'PEMINJAM') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Peminjaman` (
    `id` VARCHAR(191) NOT NULL,
    `pengguna_id` VARCHAR(191) NOT NULL,
    `ruang_rapat_id` VARCHAR(191) NOT NULL,
    `nama_kegiatan` VARCHAR(191) NOT NULL,
    `tanggal` VARCHAR(191) NOT NULL,
    `jam_mulai` VARCHAR(191) NOT NULL,
    `jam_selesai` VARCHAR(191) NOT NULL,
    `no_surat_peminjaman` VARCHAR(191) NOT NULL,
    `status` ENUM('DIPROSES', 'DISETUJUI', 'DITOLAK', 'SELESAI') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RuangRapat` (
    `id` VARCHAR(191) NOT NULL,
    `nama_ruangan` VARCHAR(191) NOT NULL,
    `deskripsi` VARCHAR(191) NOT NULL,
    `lokasi_ruangan` VARCHAR(191) NOT NULL,
    `foto_ruangan` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DetailPengguna` (
    `id` VARCHAR(191) NOT NULL,
    `pengguna_id` VARCHAR(191) NOT NULL,
    `kontak` VARCHAR(191) NOT NULL,
    `jabatan_id` VARCHAR(191) NOT NULL,
    `divisi_id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `DetailPengguna_pengguna_id_key`(`pengguna_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Divisi` (
    `id` VARCHAR(191) NOT NULL,
    `nama_divisi` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Jabatan` (
    `id` VARCHAR(191) NOT NULL,
    `nama_jabatan` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Token` (
    `id` VARCHAR(191) NOT NULL,
    `token` TEXT NOT NULL,
    `pengguna_id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Peminjaman` ADD CONSTRAINT `Peminjaman_pengguna_id_fkey` FOREIGN KEY (`pengguna_id`) REFERENCES `Pengguna`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Peminjaman` ADD CONSTRAINT `Peminjaman_ruang_rapat_id_fkey` FOREIGN KEY (`ruang_rapat_id`) REFERENCES `RuangRapat`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailPengguna` ADD CONSTRAINT `DetailPengguna_pengguna_id_fkey` FOREIGN KEY (`pengguna_id`) REFERENCES `Pengguna`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailPengguna` ADD CONSTRAINT `DetailPengguna_divisi_id_fkey` FOREIGN KEY (`divisi_id`) REFERENCES `Divisi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailPengguna` ADD CONSTRAINT `DetailPengguna_jabatan_id_fkey` FOREIGN KEY (`jabatan_id`) REFERENCES `Jabatan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Token` ADD CONSTRAINT `Token_pengguna_id_fkey` FOREIGN KEY (`pengguna_id`) REFERENCES `Pengguna`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
