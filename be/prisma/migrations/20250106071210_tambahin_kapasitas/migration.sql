/*
  Warnings:

  - Added the required column `kapasitas` to the `RuangRapat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ruangrapat` ADD COLUMN `kapasitas` INTEGER NOT NULL;
