-- AlterTable
ALTER TABLE `listabsensi` MODIFY `tanda_tangan` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `timkerja` ALTER COLUMN `is_aktif` DROP DEFAULT;
