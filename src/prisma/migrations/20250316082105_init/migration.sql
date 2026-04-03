/*
  Warnings:

  - You are about to drop the column `milageBeforeNotif` on the `bus` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `bus` DROP COLUMN `milageBeforeNotif`,
    ADD COLUMN `mileageBeforeNotif` INTEGER NOT NULL DEFAULT 0;
