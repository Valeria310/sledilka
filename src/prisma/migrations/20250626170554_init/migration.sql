-- AlterTable
ALTER TABLE `detail` ADD COLUMN `quantity` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `detailsjournal` ADD COLUMN `quantity` INTEGER NOT NULL DEFAULT 1;
