-- Listing fees by type (Room / Hostel / Space), matching listing-pricing.js.
-- The existing single fee becomes the Room fee; history rows keep their old single fee in all three.

-- website_settings
ALTER TABLE `website_settings` DROP CONSTRAINT `website_settings_fee_chk`;
ALTER TABLE `website_settings`
    ADD COLUMN `room_fee_pesewas` INTEGER UNSIGNED NOT NULL DEFAULT 3000,
    ADD COLUMN `hostel_fee_pesewas` INTEGER UNSIGNED NOT NULL DEFAULT 3500,
    ADD COLUMN `space_fee_pesewas` INTEGER UNSIGNED NOT NULL DEFAULT 4000;
UPDATE `website_settings` SET `room_fee_pesewas` = `listing_fee_pesewas`;
ALTER TABLE `website_settings` DROP COLUMN `listing_fee_pesewas`;
ALTER TABLE `website_settings`
  ADD CONSTRAINT `website_settings_fees_chk` CHECK (`room_fee_pesewas` > 0 AND `hostel_fee_pesewas` > 0 AND `space_fee_pesewas` > 0);

-- website_settings_history
ALTER TABLE `website_settings_history` DROP CONSTRAINT `settings_history_fee_chk`;
ALTER TABLE `website_settings_history`
    ADD COLUMN `room_fee_pesewas` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    ADD COLUMN `hostel_fee_pesewas` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    ADD COLUMN `space_fee_pesewas` INTEGER UNSIGNED NOT NULL DEFAULT 0;
UPDATE `website_settings_history`
  SET `room_fee_pesewas` = `listing_fee_pesewas`, `hostel_fee_pesewas` = `listing_fee_pesewas`, `space_fee_pesewas` = `listing_fee_pesewas`;
ALTER TABLE `website_settings_history`
    ALTER COLUMN `room_fee_pesewas` DROP DEFAULT,
    ALTER COLUMN `hostel_fee_pesewas` DROP DEFAULT,
    ALTER COLUMN `space_fee_pesewas` DROP DEFAULT,
    DROP COLUMN `listing_fee_pesewas`;
ALTER TABLE `website_settings_history`
  ADD CONSTRAINT `settings_history_fees_chk` CHECK (`room_fee_pesewas` > 0 AND `hostel_fee_pesewas` > 0 AND `space_fee_pesewas` > 0);

-- payments: which fee type was charged
ALTER TABLE `payments` ADD COLUMN `listing_type` ENUM('ROOM', 'HOSTEL', 'SPACE') NOT NULL;
