-- CreateTable
CREATE TABLE `Patient` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `date_of_birth` DATETIME(3) NOT NULL,
    `last_visit` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Biomarker` (
    `id` VARCHAR(191) NOT NULL,
    `patient_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `value` DOUBLE NOT NULL,
    `unit` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `rangeMin` DOUBLE NOT NULL,
    `rangeMax` DOUBLE NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `measured_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Biomarker` ADD CONSTRAINT `Biomarker_patient_id_fkey` FOREIGN KEY (`patient_id`) REFERENCES `Patient`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
