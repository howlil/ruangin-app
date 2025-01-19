/*
  Warnings:

  - You are about to drop the column `tanggal` on the `peminjaman` table. All the data in the column will be lost.
  - Added the required column `tanggal_mulai` to the `Peminjaman` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tanggal_selesai` to the `Peminjaman` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `absensi` DROP FOREIGN KEY `Absensi_peminjaman_id_fkey`;

-- DropForeignKey
ALTER TABLE `detailpengguna` DROP FOREIGN KEY `DetailPengguna_pengguna_id_fkey`;

-- DropForeignKey
ALTER TABLE `detailpengguna` DROP FOREIGN KEY `DetailPengguna_tim_kerja_id_fkey`;

-- DropForeignKey
ALTER TABLE `listabsensi` DROP FOREIGN KEY `ListAbsensi_absensi_id_fkey`;

-- DropForeignKey
ALTER TABLE `peminjaman` DROP FOREIGN KEY `Peminjaman_pengguna_id_fkey`;

-- DropForeignKey
ALTER TABLE `peminjaman` DROP FOREIGN KEY `Peminjaman_ruang_rapat_id_fkey`;

-- DropForeignKey
ALTER TABLE `token` DROP FOREIGN KEY `Token_pengguna_id_fkey`;

-- AlterTable
ALTER TABLE `peminjaman` DROP COLUMN `tanggal`,
    ADD COLUMN `tanggal_mulai` VARCHAR(191) NOT NULL,
    ADD COLUMN `tanggal_selesai` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Peminjaman` ADD CONSTRAINT `Peminjaman_pengguna_id_fkey` FOREIGN KEY (`pengguna_id`) REFERENCES `Pengguna`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Peminjaman` ADD CONSTRAINT `Peminjaman_ruang_rapat_id_fkey` FOREIGN KEY (`ruang_rapat_id`) REFERENCES `RuangRapat`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Absensi` ADD CONSTRAINT `Absensi_peminjaman_id_fkey` FOREIGN KEY (`peminjaman_id`) REFERENCES `Peminjaman`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ListAbsensi` ADD CONSTRAINT `ListAbsensi_absensi_id_fkey` FOREIGN KEY (`absensi_id`) REFERENCES `Absensi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailPengguna` ADD CONSTRAINT `DetailPengguna_pengguna_id_fkey` FOREIGN KEY (`pengguna_id`) REFERENCES `Pengguna`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailPengguna` ADD CONSTRAINT `DetailPengguna_tim_kerja_id_fkey` FOREIGN KEY (`tim_kerja_id`) REFERENCES `TimKerja`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Token` ADD CONSTRAINT `Token_pengguna_id_fkey` FOREIGN KEY (`pengguna_id`) REFERENCES `Pengguna`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
