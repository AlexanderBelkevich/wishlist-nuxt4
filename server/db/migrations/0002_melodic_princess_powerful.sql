CREATE TABLE `gifts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`wishlist_id` integer NOT NULL,
	`title` text NOT NULL,
	`url` text,
	`price` integer,
	`note` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`wishlist_id`) REFERENCES `wishlists`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `gidts_wishlist_id_idx` ON `gifts` (`wishlist_id`);