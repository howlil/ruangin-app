-- AlterTable
ALTER TABLE `timkerja` ADD COLUMN `is_aktif` BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE `Absensi` (
    `id` VARCHAR(191) NOT NULL,
    `link_absensi` VARCHAR(191) NOT NULL,
    `peminjaman_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Absensi_peminjaman_id_key`(`peminjaman_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LisAbsensi` (
    `id` VARCHAR(191) NOT NULL,
    `absensi_id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `unit_kerja` VARCHAR(191) NOT NULL,
    `golongan` VARCHAR(191) NOT NULL,
    `jabatan` VARCHAR(191) NOT NULL,
    `tanda_tangan` VARCHAR(191) NOT NULL,
    `jenis_kelamin` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Absensi` ADD CONSTRAINT `Absensi_peminjaman_id_fkey` FOREIGN KEY (`peminjaman_id`) REFERENCES `Peminjaman`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LisAbsensi` ADD CONSTRAINT `LisAbsensi_absensi_id_fkey` FOREIGN KEY (`absensi_id`) REFERENCES `Absensi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
