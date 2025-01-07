/*
  Warnings:

  - You are about to drop the column `divisi_id` on the `detailpengguna` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tim_kerja_id]` on the table `DetailPengguna` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tim_kerja_id` to the `DetailPengguna` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `detailpengguna` DROP FOREIGN KEY `DetailPengguna_divisi_id_fkey`;

-- DropIndex
DROP INDEX `DetailPengguna_divisi_id_key` ON `detailpengguna`;

-- AlterTable
ALTER TABLE `detailpengguna` DROP COLUMN `divisi_id`,
    ADD COLUMN `tim_kerja_id` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `DetailPengguna_tim_kerja_id_key` ON `DetailPengguna`(`tim_kerja_id`);

-- AddForeignKey
ALTER TABLE `DetailPengguna` ADD CONSTRAINT `DetailPengguna_tim_kerja_id_fkey` FOREIGN KEY (`tim_kerja_id`) REFERENCES `TimKerja`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
