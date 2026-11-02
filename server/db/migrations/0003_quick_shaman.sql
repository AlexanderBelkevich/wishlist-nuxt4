ALTER TABLE `gifts` ADD `reservation_token` text;--> statement-breakpoint
ALTER TABLE `wishlists` ADD `slug` text NOT NULL DEFAULT '';--> statement-breakpoint
UPDATE `wishlists` SET `slug` = lower(hex(randomblob(9)));--> statement-breakpoint
CREATE UNIQUE INDEX `wishlists_slug_unique` ON `wishlists` (`slug`);