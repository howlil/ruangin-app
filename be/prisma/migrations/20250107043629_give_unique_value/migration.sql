/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `TimKerja` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `TimKerja_code_key` ON `TimKerja`(`code`);
