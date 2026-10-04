-- CreateTable
CREATE TABLE `admin_users` (
    `id` CHAR(36) NOT NULL,
    `email` VARCHAR(254) NOT NULL,
    `display_name` VARCHAR(120) NOT NULL DEFAULT '',
    `password_hash` VARCHAR(255) NOT NULL,
    `mfa_secret_enc` VARCHAR(512) NULL,
    `mfa_enabled_at` DATETIME(3) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `failed_login_count` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    `locked_until` DATETIME(3) NULL,
    `last_login_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `admin_users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admin_roles` (
    `user_id` CHAR(36) NOT NULL,
    `role` ENUM('SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'SUPPORT') NOT NULL,
    `granted_by` CHAR(36) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `admin_roles_role_user_id_idx`(`role`, `user_id`),
    PRIMARY KEY (`user_id`, `role`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admin_sessions` (
    `id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `token_sha256` BINARY(32) NOT NULL,
    `mfa_verified_at` DATETIME(3) NULL,
    `ip_hash` BINARY(32) NULL,
    `user_agent` VARCHAR(255) NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `last_seen_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `revoked_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `admin_sessions_token_sha256_key`(`token_sha256`),
    INDEX `admin_sessions_user_id_expires_at_idx`(`user_id`, `expires_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admin_activity_logs` (
    `id` CHAR(36) NOT NULL,
    `admin_user_id` CHAR(36) NULL,
    `action` VARCHAR(120) NOT NULL,
    `resource_type` VARCHAR(80) NOT NULL,
    `resource_id` CHAR(36) NULL,
    `previous_state` JSON NULL,
    `new_state` JSON NULL,
    `reason` TEXT NULL,
    `source` VARCHAR(100) NOT NULL,
    `metadata` JSON NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `admin_activity_logs_admin_user_id_created_at_idx`(`admin_user_id`, `created_at` DESC),
    INDEX `admin_activity_logs_resource_type_resource_id_created_at_idx`(`resource_type`, `resource_id`, `created_at` DESC),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rate_limit_counters` (
    `endpoint` VARCHAR(80) NOT NULL,
    `key_sha256` BINARY(32) NOT NULL,
    `window_started_at` DATETIME(3) NOT NULL,
    `request_count` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `rate_limit_counters_window_started_at_idx`(`window_started_at`),
    PRIMARY KEY (`endpoint`, `key_sha256`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `security_events` (
    `id` CHAR(36) NOT NULL,
    `event_type` VARCHAR(100) NOT NULL,
    `severity` ENUM('INFO', 'WARN', 'ERROR') NOT NULL,
    `ip_hash` BINARY(32) NULL,
    `actor_id` CHAR(36) NULL,
    `resource_type` VARCHAR(80) NULL,
    `resource_id` CHAR(36) NULL,
    `safe_metadata` JSON NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `security_events_event_type_created_at_idx`(`event_type`, `created_at` DESC),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `locations` (
    `id` CHAR(36) NOT NULL,
    `kind` ENUM('REGION', 'TOWN', 'AREA') NOT NULL,
    `parent_id` CHAR(36) NULL,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(110) NOT NULL,
    `path` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `locations_path_key`(`path`),
    INDEX `locations_parent_id_kind_idx`(`parent_id`, `kind`),
    INDEX `locations_kind_name_idx`(`kind`, `name`),
    UNIQUE INDEX `locations_parent_id_slug_key`(`parent_id`, `slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `location_aliases` (
    `id` CHAR(36) NOT NULL,
    `location_id` CHAR(36) NOT NULL,
    `alias` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `location_aliases_alias_idx`(`alias`),
    UNIQUE INDEX `location_aliases_location_id_alias_key`(`location_id`, `alias`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `location_neighbors` (
    `location_id` CHAR(36) NOT NULL,
    `neighbor_id` CHAR(36) NOT NULL,
    `estimated_km` DECIMAL(7, 2) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`location_id`, `neighbor_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `owners` (
    `id` CHAR(36) NOT NULL,
    `full_name` VARCHAR(120) NOT NULL,
    `phone_e164` VARCHAR(16) NOT NULL,
    `whatsapp_e164` VARCHAR(16) NOT NULL,
    `email` VARCHAR(254) NOT NULL,
    `relationship` VARCHAR(250) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `owners_phone_e164_idx`(`phone_e164`),
    INDEX `owners_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `website_settings` (
    `id` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `listing_fee_pesewas` INTEGER UNSIGNED NOT NULL,
    `currency` CHAR(3) NOT NULL DEFAULT 'GHS',
    `confirmation_days` SMALLINT UNSIGNED NOT NULL DEFAULT 30,
    `privacy_policy_version` VARCHAR(40) NOT NULL,
    `terms_version` VARCHAR(40) NOT NULL,
    `updated_by` CHAR(36) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `website_settings_history` (
    `id` CHAR(36) NOT NULL,
    `setting_id` TINYINT UNSIGNED NOT NULL,
    `listing_fee_pesewas` INTEGER UNSIGNED NOT NULL,
    `currency` CHAR(3) NOT NULL,
    `confirmation_days` SMALLINT UNSIGNED NOT NULL,
    `changed_by` CHAR(36) NULL,
    `reason` VARCHAR(1000) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `listings` (
    `id` CHAR(36) NOT NULL,
    `submission_id` CHAR(36) NOT NULL,
    `status` ENUM('DRAFT', 'PAYMENT_PENDING', 'PENDING_APPROVAL', 'CHANGES_REQUESTED', 'LIVE', 'NEEDS_CONFIRMATION', 'UNAVAILABLE', 'REJECTED', 'REMOVED') NOT NULL DEFAULT 'DRAFT',
    `owner_id` CHAR(36) NOT NULL,
    `area_id` CHAR(36) NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `description` TEXT NOT NULL,
    `room_type` ENUM('Single Room', 'Chamber & Hall', 'Self-Contained', '1-in-a-Room', '2-in-a-Room', '4-in-a-Room', 'Student Hostel') NOT NULL,
    `condition` ENUM('New', 'Newly Renovated', 'Good Condition', 'Fair Condition') NOT NULL,
    `furnished` ENUM('Furnished', 'Unfurnished') NOT NULL,
    `units_total` SMALLINT UNSIGNED NOT NULL,
    `bedrooms` SMALLINT UNSIGNED NOT NULL,
    `rent_amount_pesewas` INTEGER UNSIGNED NOT NULL,
    `rent_period` ENUM('MONTH', 'THREE_MONTHS', 'SIX_MONTHS', 'YEAR', 'SEMESTER', 'OTHER') NOT NULL,
    `rent_period_other` VARCHAR(80) NULL,
    `advance_payments` SMALLINT UNSIGNED NOT NULL,
    `deposit_pesewas` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `agency_fee_pesewas` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `other_charges_pesewas` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `facilities` JSON NOT NULL,
    `rules` JSON NOT NULL,
    `landmark` VARCHAR(200) NOT NULL DEFAULT '',
    `availability_date` DATE NOT NULL,
    `units_available` SMALLINT UNSIGNED NOT NULL,
    `approved_by` CHAR(36) NULL,
    `approved_at` DATETIME(3) NULL,
    `last_confirmed_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `listings_submission_id_key`(`submission_id`),
    INDEX `listings_status_created_at_idx`(`status`, `created_at` DESC),
    INDEX `listings_area_id_status_idx`(`area_id`, `status`),
    INDEX `listings_owner_id_idx`(`owner_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `listing_private` (
    `listing_id` CHAR(36) NOT NULL,
    `exact_address` VARCHAR(1000) NOT NULL,
    `directions` VARCHAR(2000) NULL,
    `exact_latitude` DECIMAL(9, 6) NULL,
    `exact_longitude` DECIMAL(9, 6) NULL,
    `map_url` VARCHAR(2048) NULL,
    `moderation_notes` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`listing_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `listing_verifications` (
    `listing_id` CHAR(36) NOT NULL,
    `phone_verified_at` DATETIME(3) NULL,
    `phone_verified_by` CHAR(36) NULL,
    `identity_verified_at` DATETIME(3) NULL,
    `identity_verified_by` CHAR(36) NULL,
    `property_verified_at` DATETIME(3) NULL,
    `property_verified_by` CHAR(36) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`listing_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `listing_images` (
    `id` CHAR(36) NOT NULL,
    `listing_id` CHAR(36) NOT NULL,
    `category` ENUM('Exterior', 'Bedroom', 'Bathroom', 'Kitchen', 'Compound or common area', 'Extra', 'Profile') NOT NULL,
    `storage_path` VARCHAR(255) NOT NULL,
    `display_order` TINYINT UNSIGNED NOT NULL,
    `approved_for_public` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `listing_images_storage_path_key`(`storage_path`),
    INDEX `listing_images_listing_id_display_order_idx`(`listing_id`, `display_order`),
    UNIQUE INDEX `listing_images_listing_id_category_display_order_key`(`listing_id`, `category`, `display_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `listing_revisions` (
    `id` CHAR(36) NOT NULL,
    `listing_id` CHAR(36) NOT NULL,
    `proposed_public_data` JSON NOT NULL,
    `reason` VARCHAR(1000) NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `reviewed_by` CHAR(36) NULL,
    `reviewed_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `listing_revisions_listing_id_status_created_at_idx`(`listing_id`, `status`, `created_at` DESC),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `listing_status_history` (
    `id` CHAR(36) NOT NULL,
    `listing_id` CHAR(36) NOT NULL,
    `previous_status` ENUM('DRAFT', 'PAYMENT_PENDING', 'PENDING_APPROVAL', 'CHANGES_REQUESTED', 'LIVE', 'NEEDS_CONFIRMATION', 'UNAVAILABLE', 'REJECTED', 'REMOVED') NULL,
    `new_status` ENUM('DRAFT', 'PAYMENT_PENDING', 'PENDING_APPROVAL', 'CHANGES_REQUESTED', 'LIVE', 'NEEDS_CONFIRMATION', 'UNAVAILABLE', 'REJECTED', 'REMOVED') NOT NULL,
    `actor_type` ENUM('SYSTEM', 'ADMIN', 'OWNER') NOT NULL,
    `actor_id` CHAR(36) NULL,
    `reason` TEXT NULL,
    `source` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `listing_status_history_listing_id_created_at_idx`(`listing_id`, `created_at` DESC),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `listing_availability` (
    `listing_id` CHAR(36) NOT NULL,
    `last_confirmed_at` DATETIME(3) NULL,
    `confirmed_by` ENUM('SYSTEM', 'ADMIN', 'OWNER') NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`listing_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payments` (
    `id` CHAR(36) NOT NULL,
    `listing_id` CHAR(36) NOT NULL,
    `paid_listing_id` CHAR(36) NULL,
    `reference` VARCHAR(80) NOT NULL,
    `amount_pesewas` INTEGER UNSIGNED NOT NULL,
    `currency` CHAR(3) NOT NULL,
    `status` ENUM('PENDING', 'PROCESSING', 'PAID', 'FAILED', 'ABANDONED', 'REFUNDED', 'PARTIALLY_REFUNDED') NOT NULL DEFAULT 'PENDING',
    `paystack_transaction_id` VARCHAR(100) NULL,
    `refund_amount_pesewas` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `paid_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `payments_paid_listing_id_key`(`paid_listing_id`),
    UNIQUE INDEX `payments_reference_key`(`reference`),
    UNIQUE INDEX `payments_paystack_transaction_id_key`(`paystack_transaction_id`),
    INDEX `payments_listing_id_created_at_idx`(`listing_id`, `created_at` DESC),
    INDEX `payments_status_created_at_idx`(`status`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_events` (
    `id` CHAR(36) NOT NULL,
    `payment_reference` VARCHAR(80) NOT NULL,
    `event_type` VARCHAR(100) NOT NULL,
    `body_sha256` BINARY(32) NOT NULL,
    `raw_payload` JSON NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `payment_events_payment_reference_created_at_idx`(`payment_reference`, `created_at` DESC),
    UNIQUE INDEX `payment_events_payment_reference_event_type_body_sha256_key`(`payment_reference`, `event_type`, `body_sha256`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reports` (
    `id` CHAR(36) NOT NULL,
    `listing_id` CHAR(36) NOT NULL,
    `reason` VARCHAR(1000) NOT NULL,
    `reporter_contact` VARCHAR(254) NULL,
    `status` ENUM('OPEN', 'REVIEWING', 'RESOLVED', 'DISMISSED') NOT NULL DEFAULT 'OPEN',
    `reviewed_by` CHAR(36) NULL,
    `reviewed_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `reports_status_created_at_idx`(`status`, `created_at` DESC),
    INDEX `reports_listing_id_created_at_idx`(`listing_id`, `created_at` DESC),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inquiries` (
    `id` CHAR(36) NOT NULL,
    `listing_id` CHAR(36) NOT NULL,
    `channel` ENUM('PHONE', 'WHATSAPP') NOT NULL,
    `visitor_ip_hash` BINARY(32) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `inquiries_listing_id_created_at_idx`(`listing_id`, `created_at` DESC),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `consents` (
    `id` CHAR(36) NOT NULL,
    `listing_id` CHAR(36) NOT NULL,
    `privacy_policy_version` VARCHAR(40) NOT NULL,
    `terms_version` VARCHAR(40) NOT NULL,
    `checkbox_values` JSON NOT NULL,
    `consented_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `consents_listing_id_idx`(`listing_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `manage_link_tokens` (
    `id` CHAR(36) NOT NULL,
    `listing_id` CHAR(36) NOT NULL,
    `token_sha256` BINARY(32) NOT NULL,
    `purpose` ENUM('MANAGE_LISTING') NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `revoked_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `manage_link_tokens_token_sha256_key`(`token_sha256`),
    INDEX `manage_link_tokens_listing_id_expires_at_idx`(`listing_id`, `expires_at` DESC),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `manage_link_usage` (
    `id` CHAR(36) NOT NULL,
    `token_id` CHAR(36) NULL,
    `listing_id` CHAR(36) NULL,
    `action` VARCHAR(80) NOT NULL,
    `succeeded` BOOLEAN NOT NULL,
    `ip_hash` BINARY(32) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `manage_link_usage_token_id_created_at_idx`(`token_id`, `created_at` DESC),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `admin_roles` ADD CONSTRAINT `admin_roles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `admin_users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `admin_roles` ADD CONSTRAINT `admin_roles_granted_by_fkey` FOREIGN KEY (`granted_by`) REFERENCES `admin_users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `admin_sessions` ADD CONSTRAINT `admin_sessions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `admin_users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `admin_activity_logs` ADD CONSTRAINT `admin_activity_logs_admin_user_id_fkey` FOREIGN KEY (`admin_user_id`) REFERENCES `admin_users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `locations` ADD CONSTRAINT `locations_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `locations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `location_aliases` ADD CONSTRAINT `location_aliases_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `location_neighbors` ADD CONSTRAINT `location_neighbors_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `location_neighbors` ADD CONSTRAINT `location_neighbors_neighbor_id_fkey` FOREIGN KEY (`neighbor_id`) REFERENCES `locations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `website_settings` ADD CONSTRAINT `website_settings_updated_by_fkey` FOREIGN KEY (`updated_by`) REFERENCES `admin_users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `website_settings_history` ADD CONSTRAINT `website_settings_history_setting_id_fkey` FOREIGN KEY (`setting_id`) REFERENCES `website_settings`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `website_settings_history` ADD CONSTRAINT `website_settings_history_changed_by_fkey` FOREIGN KEY (`changed_by`) REFERENCES `admin_users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `listings` ADD CONSTRAINT `listings_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `owners`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `listings` ADD CONSTRAINT `listings_area_id_fkey` FOREIGN KEY (`area_id`) REFERENCES `locations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `listings` ADD CONSTRAINT `listings_approved_by_fkey` FOREIGN KEY (`approved_by`) REFERENCES `admin_users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `listing_private` ADD CONSTRAINT `listing_private_listing_id_fkey` FOREIGN KEY (`listing_id`) REFERENCES `listings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `listing_verifications` ADD CONSTRAINT `listing_verifications_listing_id_fkey` FOREIGN KEY (`listing_id`) REFERENCES `listings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `listing_verifications` ADD CONSTRAINT `listing_verifications_phone_verified_by_fkey` FOREIGN KEY (`phone_verified_by`) REFERENCES `admin_users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `listing_verifications` ADD CONSTRAINT `listing_verifications_identity_verified_by_fkey` FOREIGN KEY (`identity_verified_by`) REFERENCES `admin_users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `listing_verifications` ADD CONSTRAINT `listing_verifications_property_verified_by_fkey` FOREIGN KEY (`property_verified_by`) REFERENCES `admin_users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `listing_images` ADD CONSTRAINT `listing_images_listing_id_fkey` FOREIGN KEY (`listing_id`) REFERENCES `listings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `listing_revisions` ADD CONSTRAINT `listing_revisions_listing_id_fkey` FOREIGN KEY (`listing_id`) REFERENCES `listings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `listing_revisions` ADD CONSTRAINT `listing_revisions_reviewed_by_fkey` FOREIGN KEY (`reviewed_by`) REFERENCES `admin_users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `listing_status_history` ADD CONSTRAINT `listing_status_history_listing_id_fkey` FOREIGN KEY (`listing_id`) REFERENCES `listings`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `listing_availability` ADD CONSTRAINT `listing_availability_listing_id_fkey` FOREIGN KEY (`listing_id`) REFERENCES `listings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_listing_id_fkey` FOREIGN KEY (`listing_id`) REFERENCES `listings`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reports` ADD CONSTRAINT `reports_listing_id_fkey` FOREIGN KEY (`listing_id`) REFERENCES `listings`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reports` ADD CONSTRAINT `reports_reviewed_by_fkey` FOREIGN KEY (`reviewed_by`) REFERENCES `admin_users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inquiries` ADD CONSTRAINT `inquiries_listing_id_fkey` FOREIGN KEY (`listing_id`) REFERENCES `listings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `consents` ADD CONSTRAINT `consents_listing_id_fkey` FOREIGN KEY (`listing_id`) REFERENCES `listings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `manage_link_tokens` ADD CONSTRAINT `manage_link_tokens_listing_id_fkey` FOREIGN KEY (`listing_id`) REFERENCES `listings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `manage_link_usage` ADD CONSTRAINT `manage_link_usage_token_id_fkey` FOREIGN KEY (`token_id`) REFERENCES `manage_link_tokens`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `manage_link_usage` ADD CONSTRAINT `manage_link_usage_listing_id_fkey` FOREIGN KEY (`listing_id`) REFERENCES `listings`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- ═════════════════════════════════════════════════════════════════════════════
-- Integrity rules Prisma cannot model (ported from the Supabase migration).
-- ═════════════════════════════════════════════════════════════════════════════

-- CHECK constraints
ALTER TABLE `admin_users`
  ADD CONSTRAINT `admin_users_email_chk` CHECK (LOCATE('@', `email`) > 1);

ALTER TABLE `locations`
  ADD CONSTRAINT `locations_name_chk` CHECK (CHAR_LENGTH(`name`) BETWEEN 1 AND 100),
  ADD CONSTRAINT `locations_slug_chk` CHECK (`slug` REGEXP '(?-i)^[a-z0-9]+(-[a-z0-9]+)*$'),
  ADD CONSTRAINT `locations_root_chk` CHECK ((`kind` = 'REGION') = (`parent_id` IS NULL));

ALTER TABLE `location_aliases`
  ADD CONSTRAINT `location_aliases_alias_chk` CHECK (CHAR_LENGTH(`alias`) BETWEEN 1 AND 100);

ALTER TABLE `location_neighbors`
  ADD CONSTRAINT `location_neighbors_self_chk` CHECK (`location_id` <> `neighbor_id`),
  ADD CONSTRAINT `location_neighbors_km_chk` CHECK (`estimated_km` >= 0);

ALTER TABLE `owners`
  ADD CONSTRAINT `owners_full_name_chk` CHECK (CHAR_LENGTH(`full_name`) BETWEEN 2 AND 120),
  ADD CONSTRAINT `owners_phone_chk` CHECK (`phone_e164` REGEXP '^[+]233[235][0-9]{8}$'),
  ADD CONSTRAINT `owners_whatsapp_chk` CHECK (`whatsapp_e164` REGEXP '^[+]233[235][0-9]{8}$'),
  ADD CONSTRAINT `owners_email_chk` CHECK (LOCATE('@', `email`) > 1),
  ADD CONSTRAINT `owners_relationship_chk` CHECK (CHAR_LENGTH(`relationship`) BETWEEN 2 AND 250);

ALTER TABLE `website_settings`
  ADD CONSTRAINT `website_settings_singleton_chk` CHECK (`id` = 1),
  ADD CONSTRAINT `website_settings_fee_chk` CHECK (`listing_fee_pesewas` > 0),
  ADD CONSTRAINT `website_settings_currency_chk` CHECK (`currency` = 'GHS'),
  ADD CONSTRAINT `website_settings_days_chk` CHECK (`confirmation_days` BETWEEN 1 AND 365),
  ADD CONSTRAINT `website_settings_versions_chk` CHECK (CHAR_LENGTH(`privacy_policy_version`) >= 1 AND CHAR_LENGTH(`terms_version`) >= 1);

ALTER TABLE `website_settings_history`
  ADD CONSTRAINT `settings_history_fee_chk` CHECK (`listing_fee_pesewas` > 0),
  ADD CONSTRAINT `settings_history_currency_chk` CHECK (`currency` = 'GHS'),
  ADD CONSTRAINT `settings_history_days_chk` CHECK (`confirmation_days` BETWEEN 1 AND 365),
  ADD CONSTRAINT `settings_history_reason_chk` CHECK (CHAR_LENGTH(`reason`) BETWEEN 3 AND 1000);

ALTER TABLE `listings`
  ADD CONSTRAINT `listings_title_chk` CHECK (CHAR_LENGTH(`title`) BETWEEN 8 AND 100),
  ADD CONSTRAINT `listings_description_chk` CHECK (CHAR_LENGTH(`description`) BETWEEN 100 AND 5000),
  ADD CONSTRAINT `listings_units_total_chk` CHECK (`units_total` BETWEEN 1 AND 500),
  ADD CONSTRAINT `listings_bedrooms_chk` CHECK (`bedrooms` <= 100),
  ADD CONSTRAINT `listings_rent_chk` CHECK (`rent_amount_pesewas` > 0),
  ADD CONSTRAINT `listings_advance_chk` CHECK (`advance_payments` <= 120),
  ADD CONSTRAINT `listings_units_available_chk` CHECK (`units_available` <= `units_total`),
  ADD CONSTRAINT `listings_rent_period_other_chk` CHECK ((`rent_period` = 'OTHER') = (`rent_period_other` IS NOT NULL)),
  ADD CONSTRAINT `listings_rent_period_other_len_chk` CHECK (`rent_period_other` IS NULL OR CHAR_LENGTH(`rent_period_other`) BETWEEN 2 AND 80),
  ADD CONSTRAINT `listings_facilities_chk` CHECK (JSON_TYPE(`facilities`) = 'OBJECT'),
  ADD CONSTRAINT `listings_rules_chk` CHECK (JSON_TYPE(`rules`) = 'OBJECT');

ALTER TABLE `listing_private`
  ADD CONSTRAINT `listing_private_address_chk` CHECK (CHAR_LENGTH(`exact_address`) BETWEEN 5 AND 1000),
  ADD CONSTRAINT `listing_private_lat_chk` CHECK (`exact_latitude` IS NULL OR `exact_latitude` BETWEEN -90 AND 90),
  ADD CONSTRAINT `listing_private_lng_chk` CHECK (`exact_longitude` IS NULL OR `exact_longitude` BETWEEN -180 AND 180);

ALTER TABLE `listing_images`
  ADD CONSTRAINT `listing_images_path_chk` CHECK (
    `storage_path` NOT LIKE '/%' AND LOCATE('..', `storage_path`) = 0 AND LOCATE(CHAR(92), `storage_path`) = 0
  ),
  ADD CONSTRAINT `listing_images_order_chk` CHECK (`display_order` <= 20);

ALTER TABLE `listing_revisions`
  ADD CONSTRAINT `listing_revisions_data_chk` CHECK (JSON_TYPE(`proposed_public_data`) = 'OBJECT'),
  ADD CONSTRAINT `listing_revisions_reason_chk` CHECK (CHAR_LENGTH(`reason`) BETWEEN 3 AND 1000);

ALTER TABLE `listing_status_history`
  ADD CONSTRAINT `status_history_source_chk` CHECK (CHAR_LENGTH(`source`) BETWEEN 1 AND 100);

ALTER TABLE `payments`
  ADD CONSTRAINT `payments_reference_chk` CHECK (`reference` REGEXP '(?-i)^NGH-[A-Z0-9]{20,64}$'),
  ADD CONSTRAINT `payments_amount_chk` CHECK (`amount_pesewas` > 0),
  ADD CONSTRAINT `payments_currency_chk` CHECK (`currency` = 'GHS'),
  ADD CONSTRAINT `payments_refund_chk` CHECK (`refund_amount_pesewas` <= `amount_pesewas`),
  ADD CONSTRAINT `payments_paid_marker_chk` CHECK (
    (`status` = 'PAID') = (`paid_listing_id` IS NOT NULL)
    AND (`paid_listing_id` IS NULL OR `paid_listing_id` = `listing_id`)
  ),
  ADD CONSTRAINT `payments_paid_at_chk` CHECK (`status` <> 'PAID' OR `paid_at` IS NOT NULL);

ALTER TABLE `payment_events`
  ADD CONSTRAINT `payment_events_type_chk` CHECK (CHAR_LENGTH(`event_type`) BETWEEN 1 AND 100),
  ADD CONSTRAINT `payment_events_payload_chk` CHECK (JSON_TYPE(`raw_payload`) = 'OBJECT');

ALTER TABLE `admin_activity_logs`
  ADD CONSTRAINT `activity_action_chk` CHECK (CHAR_LENGTH(`action`) BETWEEN 1 AND 120),
  ADD CONSTRAINT `activity_resource_chk` CHECK (CHAR_LENGTH(`resource_type`) BETWEEN 1 AND 80),
  ADD CONSTRAINT `activity_source_chk` CHECK (CHAR_LENGTH(`source`) BETWEEN 1 AND 100),
  ADD CONSTRAINT `activity_metadata_chk` CHECK (JSON_TYPE(`metadata`) = 'OBJECT'),
  ADD CONSTRAINT `activity_previous_chk` CHECK (`previous_state` IS NULL OR JSON_TYPE(`previous_state`) = 'OBJECT'),
  ADD CONSTRAINT `activity_new_chk` CHECK (`new_state` IS NULL OR JSON_TYPE(`new_state`) = 'OBJECT');

ALTER TABLE `reports`
  ADD CONSTRAINT `reports_reason_chk` CHECK (CHAR_LENGTH(`reason`) BETWEEN 3 AND 1000);

ALTER TABLE `consents`
  ADD CONSTRAINT `consents_checkbox_chk` CHECK (JSON_TYPE(`checkbox_values`) = 'OBJECT');

ALTER TABLE `manage_link_tokens`
  ADD CONSTRAINT `manage_link_tokens_expiry_chk` CHECK (`expires_at` > `created_at`);

ALTER TABLE `manage_link_usage`
  ADD CONSTRAINT `manage_link_usage_action_chk` CHECK (CHAR_LENGTH(`action`) BETWEEN 1 AND 80);

ALTER TABLE `security_events`
  ADD CONSTRAINT `security_events_type_chk` CHECK (CHAR_LENGTH(`event_type`) BETWEEN 1 AND 100),
  ADD CONSTRAINT `security_events_metadata_chk` CHECK (JSON_TYPE(`safe_metadata`) = 'OBJECT');

-- Location hierarchy: REGION → TOWN → AREA
CREATE TRIGGER `locations_validate_parent_ins` BEFORE INSERT ON `locations` FOR EACH ROW
BEGIN
  DECLARE parent_kind VARCHAR(10);
  IF NEW.kind <> 'REGION' THEN
    SELECT `kind` INTO parent_kind FROM `locations` WHERE `id` = NEW.parent_id;
    IF (NEW.kind = 'TOWN' AND IFNULL(parent_kind, '') <> 'REGION') OR (NEW.kind = 'AREA' AND IFNULL(parent_kind, '') <> 'TOWN') THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'A town must belong to a region and an area to a town';
    END IF;
  END IF;
END;

CREATE TRIGGER `locations_validate_parent_upd` BEFORE UPDATE ON `locations` FOR EACH ROW
BEGIN
  DECLARE parent_kind VARCHAR(10);
  IF NEW.kind <> 'REGION' AND (NEW.kind <> OLD.kind OR NOT (NEW.parent_id <=> OLD.parent_id)) THEN
    SELECT `kind` INTO parent_kind FROM `locations` WHERE `id` = NEW.parent_id;
    IF (NEW.kind = 'TOWN' AND IFNULL(parent_kind, '') <> 'REGION') OR (NEW.kind = 'AREA' AND IFNULL(parent_kind, '') <> 'TOWN') THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'A town must belong to a region and an area to a town';
    END IF;
  END IF;
END;

-- Listing status guard. Status changes must go through lib/server/listing-status.ts, which sets
-- @nestgh_status_transition = 1 inside its transaction. LIVE always needs approval and a PAID fee.
CREATE TRIGGER `listings_guard_status_ins` BEFORE INSERT ON `listings` FOR EACH ROW
BEGIN
  IF NEW.status <> 'DRAFT' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Listings must begin in DRAFT';
  END IF;
END;

CREATE TRIGGER `listings_guard_status_upd` BEFORE UPDATE ON `listings` FOR EACH ROW
BEGIN
  IF NEW.status <> OLD.status AND IFNULL(@nestgh_status_transition, 0) <> 1 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Listing status changes must use the approved transition function';
  END IF;
  IF NEW.status = 'LIVE' THEN
    IF NEW.approved_at IS NULL THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'A listing requires admin approval before becoming LIVE';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM `payments` p WHERE p.listing_id = NEW.id AND p.status = 'PAID') THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'A listing requires a PAID listing fee before becoming LIVE';
    END IF;
  END IF;
END;

-- Append-only audit tables
CREATE TRIGGER `listing_status_history_no_update` BEFORE UPDATE ON `listing_status_history` FOR EACH ROW
  SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Audit history is append-only';
CREATE TRIGGER `listing_status_history_no_delete` BEFORE DELETE ON `listing_status_history` FOR EACH ROW
  SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Audit history is append-only';
CREATE TRIGGER `payment_events_no_update` BEFORE UPDATE ON `payment_events` FOR EACH ROW
  SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Audit history is append-only';
CREATE TRIGGER `payment_events_no_delete` BEFORE DELETE ON `payment_events` FOR EACH ROW
  SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Audit history is append-only';
CREATE TRIGGER `admin_activity_logs_no_update` BEFORE UPDATE ON `admin_activity_logs` FOR EACH ROW
  SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Audit history is append-only';
CREATE TRIGGER `admin_activity_logs_no_delete` BEFORE DELETE ON `admin_activity_logs` FOR EACH ROW
  SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Audit history is append-only';

-- Initial settings: listing fee GH₵30 (3,000 pesewas).
INSERT INTO `website_settings` (`id`, `listing_fee_pesewas`, `currency`, `confirmation_days`, `privacy_policy_version`, `terms_version`, `updated_at`)
VALUES (1, 3000, 'GHS', 30, '2026-10-01', '2026-10-01', CURRENT_TIMESTAMP(3));
