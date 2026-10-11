-- Buy Data (/buy-data): data bundle packages and orders, moved from the separate Supabase project.
-- CreateTable
CREATE TABLE `data_packages` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `network` ENUM('MTN', 'TELECEL', 'AIRTELTIGO') NOT NULL,
    `package_name` VARCHAR(80) NOT NULL,
    `data_amount` VARCHAR(20) NOT NULL,
    `price_pesewas` INTEGER UNSIGNED NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `data_packages_active_network_idx`(`active`, `network`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `data_orders` (
    `id` CHAR(36) NOT NULL,
    `package_id` INTEGER UNSIGNED NOT NULL,
    `network` ENUM('MTN', 'TELECEL', 'AIRTELTIGO') NOT NULL,
    `package_name` VARCHAR(80) NOT NULL,
    `data_amount` VARCHAR(20) NOT NULL,
    `amount_pesewas` INTEGER UNSIGNED NOT NULL,
    `currency` CHAR(3) NOT NULL DEFAULT 'GHS',
    `customer_phone_e164` VARCHAR(16) NOT NULL,
    `customer_email` VARCHAR(254) NOT NULL,
    `status` ENUM('PENDING', 'PAID', 'DELIVERED', 'FAILED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `reference` VARCHAR(80) NOT NULL,
    `paystack_transaction_id` VARCHAR(100) NULL,
    `paid_at` DATETIME(3) NULL,
    `delivered_at` DATETIME(3) NULL,
    `delivered_by` CHAR(36) NULL,
    `note` VARCHAR(500) NULL,
    `ip_hash` BINARY(32) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `data_orders_reference_key`(`reference`),
    UNIQUE INDEX `data_orders_paystack_transaction_id_key`(`paystack_transaction_id`),
    INDEX `data_orders_status_created_at_idx`(`status`, `created_at`),
    INDEX `data_orders_customer_phone_e164_idx`(`customer_phone_e164`),
    INDEX `data_orders_paid_at_idx`(`paid_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `data_orders` ADD CONSTRAINT `data_orders_package_id_fkey` FOREIGN KEY (`package_id`) REFERENCES `data_packages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `data_orders` ADD CONSTRAINT `data_orders_delivered_by_fkey` FOREIGN KEY (`delivered_by`) REFERENCES `admin_users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;


-- Rules Prisma cannot model.
ALTER TABLE `data_packages`
  ADD CONSTRAINT `data_packages_price_chk` CHECK (`price_pesewas` > 0),
  ADD CONSTRAINT `data_packages_name_chk` CHECK (CHAR_LENGTH(`package_name`) >= 1 AND CHAR_LENGTH(`data_amount`) >= 1);

ALTER TABLE `data_orders`
  ADD CONSTRAINT `data_orders_amount_chk` CHECK (`amount_pesewas` > 0),
  ADD CONSTRAINT `data_orders_currency_chk` CHECK (`currency` = 'GHS'),
  ADD CONSTRAINT `data_orders_phone_chk` CHECK (`customer_phone_e164` REGEXP '^[+]233[235][0-9]{8}$'),
  ADD CONSTRAINT `data_orders_email_chk` CHECK (LOCATE('@', `customer_email`) > 1),
  -- A paid, delivered or cancelled order always has its payment time; a delivered one its delivery time.
  ADD CONSTRAINT `data_orders_paid_chk` CHECK (`status` NOT IN ('PAID', 'DELIVERED') OR `paid_at` IS NOT NULL),
  ADD CONSTRAINT `data_orders_delivered_chk` CHECK ((`status` = 'DELIVERED') = (`delivered_at` IS NOT NULL));

-- The packages on sale when the page moved off Supabase (same ids, names and prices).
INSERT INTO `data_packages` (`id`, `network`, `package_name`, `data_amount`, `price_pesewas`, `active`, `updated_at`) VALUES
  (1, 'MTN', 'MTN 2GB', '2GB', 1000, 1, UTC_TIMESTAMP(3)),
  (2, 'MTN', 'MTN 5GB', '5GB', 2000, 1, UTC_TIMESTAMP(3)),
  (3, 'TELECEL', 'Telecel 2GB', '2GB', 1000, 1, UTC_TIMESTAMP(3)),
  (4, 'AIRTELTIGO', 'AirtelTigo 2GB', '2GB', 1000, 1, UTC_TIMESTAMP(3)),
  (5, 'MTN', '1GB', '1GB', 450, 1, UTC_TIMESTAMP(3)),
  (6, 'MTN', '3GB', '3GB', 1300, 1, UTC_TIMESTAMP(3));
