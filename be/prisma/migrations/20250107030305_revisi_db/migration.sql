/*
  Warnings:

  - You are about to drop the `divisi` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `jabatan` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[divisi_id]` on the table `DetailPengguna` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `detailpengguna` DROP FOREIGN KEY `DetailPengguna_divisi_id_fkey`;

-- DropForeignKey
ALTER TABLE `detailpengguna` DROP FOREIGN KEY `DetailPengguna_jabatan_id_fkey`;

-- DropIndex
DROP INDEX `DetailPengguna_divisi_id_fkey` ON `detailpengguna`;

-- DropIndex
DROP INDEX `DetailPengguna_jabatan_id_fkey` ON `detailpengguna`;

-- DropTable
DROP TABLE `divisi`;

-- DropTable
DROP TABLE `jabatan`;

-- CreateTable
CREATE TABLE `TimKerja` (
    `id` VARCHAR(191) NOT NULL,
    `nama_tim_kerja` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `DetailPengguna_divisi_id_key` ON `DetailPengguna`(`divisi_id`);

-- AddForeignKey
ALTER TABLE `DetailPengguna` ADD CONSTRAINT `DetailPengguna_divisi_id_fkey` FOREIGN KEY (`divisi_id`) REFERENCES `TimKerja`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
