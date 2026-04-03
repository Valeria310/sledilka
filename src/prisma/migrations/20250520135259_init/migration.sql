/*
  Warnings:

  - You are about to drop the column `number` on the `detail` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `detail` DROP COLUMN `number`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL DEFAULT ' ';
