-- Phase 1 listing trust metadata (frontend-data-contract.md): availability label, confirmed contact
-- type, and price/availability checks plus a NestGH site-visit date.
-- AlterTable
ALTER TABLE `listing_verifications` ADD COLUMN `availability_verified_at` DATETIME(3) NULL,
    ADD COLUMN `availability_verified_by` CHAR(36) NULL,
    ADD COLUMN `price_verified_at` DATETIME(3) NULL,
    ADD COLUMN `price_verified_by` CHAR(36) NULL,
    ADD COLUMN `visited_by` CHAR(36) NULL,
    ADD COLUMN `visited_on` DATE NULL;

-- AlterTable
ALTER TABLE `listings` ADD COLUMN `availability_label` ENUM('AVAILABLE', 'ALMOST_TAKEN', 'RESERVED', 'RENTED') NULL,
    ADD COLUMN `contact_type` ENUM('DIRECT_OWNER', 'VERIFIED_AGENT', 'VERIFIED_PROPERTY_MANAGER', 'CARETAKER') NULL;

-- AddForeignKey
ALTER TABLE `listing_verifications` ADD CONSTRAINT `listing_verifications_price_verified_by_fkey` FOREIGN KEY (`price_verified_by`) REFERENCES `admin_users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `listing_verifications` ADD CONSTRAINT `listing_verifications_availability_verified_by_fkey` FOREIGN KEY (`availability_verified_by`) REFERENCES `admin_users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `listing_verifications` ADD CONSTRAINT `listing_verifications_visited_by_fkey` FOREIGN KEY (`visited_by`) REFERENCES `admin_users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;


