/*
  Warnings:

  - You are about to drop the `lisabsensi` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `lisabsensi` DROP FOREIGN KEY `LisAbsensi_absensi_id_fkey`;

-- DropTable
DROP TABLE `lisabsensi`;

-- CreateTable
CREATE TABLE `ListAbsensi` (
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
ALTER TABLE `ListAbsensi` ADD CONSTRAINT `ListAbsensi_absensi_id_fkey` FOREIGN KEY (`absensi_id`) REFERENCES `Absensi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
