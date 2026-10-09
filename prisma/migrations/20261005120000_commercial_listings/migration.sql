-- Shops & Spaces (commercial listings). Ported from
-- supabase/migrations/20261005000100_commercial_listing_form.sql, using typed columns instead of a
-- commercial_details JSON blob so the public filters (size, parking, water, ...) are indexable.

-- AlterTable
ALTER TABLE `listings`
    MODIFY `room_type` ENUM('Single Room', 'Chamber & Hall', 'Self-Contained', '1-in-a-Room', '2-in-a-Room', '4-in-a-Room', 'Student Hostel', 'Shop', 'Store', 'Office', 'Showroom', 'Warehouse', 'Salon', 'Restaurant', 'Commercial Space', 'Other') NOT NULL,
    MODIFY `furnished` ENUM('Furnished', 'Unfurnished', 'Not Applicable') NOT NULL,
    MODIFY `bedrooms` SMALLINT UNSIGNED NULL,
    ADD COLUMN `property_category` ENUM('ROOM', 'COMMERCIAL') NOT NULL DEFAULT 'ROOM',
    ADD COLUMN `advance_amount_pesewas` INTEGER UNSIGNED NULL,
    ADD COLUMN `commercial_type_other` VARCHAR(80) NULL,
    ADD COLUMN `size_sqm` DECIMAL(10, 2) NULL,
    ADD COLUMN `road_visibility` BOOLEAN NULL,
    ADD COLUMN `parking` BOOLEAN NULL,
    ADD COLUMN `electricity` BOOLEAN NULL,
    ADD COLUMN `water` BOOLEAN NULL,
    ADD COLUMN `estimated_move_in_cost_pesewas` INTEGER UNSIGNED NULL;

-- AlterTable. Rebuilding listing_images re-checks listing_images_path_chk, whose CHAR(92) took the
-- connection collation; recreate it with an explicit collation so it works on any connection.
ALTER TABLE `listing_images` DROP CONSTRAINT `listing_images_path_chk`;
ALTER TABLE `listing_images`
    MODIFY `category` ENUM('Exterior', 'Bedroom', 'Bathroom', 'Kitchen', 'Compound or common area', 'Interior', 'Frontage', 'Facilities', 'Surrounding area', 'Extra', 'Profile') NOT NULL;
ALTER TABLE `listing_images`
  ADD CONSTRAINT `listing_images_path_chk` CHECK (
    `storage_path` NOT LIKE '/%'
    AND LOCATE('..' COLLATE utf8mb4_unicode_ci, `storage_path`) = 0
    AND LOCATE(CONVERT(CHAR(92) USING utf8mb4) COLLATE utf8mb4_unicode_ci, `storage_path`) = 0
  );

-- CreateIndex (MariaDB 10.4 has no descending indexes; an ascending one is scanned backwards.)
CREATE INDEX `listings_property_category_status_created_at_idx` ON `listings`(`property_category`, `status`, `created_at`);

-- Rooms and commercial listings each carry only their own fields, with matching types.
ALTER TABLE `listings`
  ADD CONSTRAINT `listings_category_fields_chk` CHECK (
    (
      `property_category` = 'ROOM'
      AND `room_type` IN ('Single Room', 'Chamber & Hall', 'Self-Contained', '1-in-a-Room', '2-in-a-Room', '4-in-a-Room', 'Student Hostel')
      AND `bedrooms` IS NOT NULL
      AND `advance_amount_pesewas` IS NULL AND `commercial_type_other` IS NULL AND `size_sqm` IS NULL
      AND `road_visibility` IS NULL AND `parking` IS NULL AND `electricity` IS NULL AND `water` IS NULL
      AND `estimated_move_in_cost_pesewas` IS NULL
    )
    OR (
      `property_category` = 'COMMERCIAL'
      AND `room_type` IN ('Shop', 'Store', 'Office', 'Showroom', 'Warehouse', 'Salon', 'Restaurant', 'Commercial Space', 'Other')
      AND `bedrooms` IS NULL
      AND `advance_amount_pesewas` IS NOT NULL AND `size_sqm` IS NOT NULL
      AND `road_visibility` IS NOT NULL AND `parking` IS NOT NULL AND `electricity` IS NOT NULL AND `water` IS NOT NULL
      AND `estimated_move_in_cost_pesewas` IS NOT NULL
    )
  ),
  ADD CONSTRAINT `listings_type_other_chk` CHECK ((`room_type` = 'Other') = (`commercial_type_other` IS NOT NULL)),
  ADD CONSTRAINT `listings_size_chk` CHECK (`size_sqm` IS NULL OR `size_sqm` > 0);
