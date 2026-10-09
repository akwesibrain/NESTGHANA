-- CreateTable
CREATE TABLE `notifications` (
    `id` CHAR(36) NOT NULL,
    `listing_id` CHAR(36) NULL,
    `channel` ENUM('WHATSAPP', 'EMAIL') NOT NULL,
    `recipient` VARCHAR(254) NOT NULL,
    `template` VARCHAR(60) NOT NULL,
    `message` TEXT NOT NULL,
    `status` ENUM('PENDING', 'SENT', 'FAILED', 'DISMISSED') NOT NULL DEFAULT 'PENDING',
    `sent_by` CHAR(36) NULL,
    `sent_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `notifications_status_created_at_idx`(`status`, `created_at`),
    INDEX `notifications_listing_id_created_at_idx`(`listing_id`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_listing_id_fkey` FOREIGN KEY (`listing_id`) REFERENCES `listings`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_sent_by_fkey` FOREIGN KEY (`sent_by`) REFERENCES `admin_users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

