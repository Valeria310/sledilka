-- CreateTable
CREATE TABLE `Bus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `number` VARCHAR(191) NOT NULL,
    `mileage` INTEGER NOT NULL,
    `totalMileage` INTEGER NOT NULL,
    `oilChangeDate` DATETIME(3) NOT NULL,
    `milageBeforeNotif` INTEGER NOT NULL,

    UNIQUE INDEX `Bus_number_key`(`number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
