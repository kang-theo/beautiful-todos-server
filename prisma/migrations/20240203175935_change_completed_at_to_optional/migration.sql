-- CreateTable
CREATE TABLE `Todo` (
    `id` VARCHAR(191) NOT NULL,
    `title` CHAR(255) NOT NULL,
    `status` ENUM('Open', 'Completed') NOT NULL,
    `createdAt` VARCHAR(191) NOT NULL,
    `lastUpdatedAt` VARCHAR(191) NOT NULL,
    `completedAt` VARCHAR(191) NULL,
    `creator` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
