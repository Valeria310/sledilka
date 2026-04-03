/*
  Warnings:

  - Added the required column `isBus` to the `Bus` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `bus` ADD COLUMN `isBus` INTEGER NOT NULL;
