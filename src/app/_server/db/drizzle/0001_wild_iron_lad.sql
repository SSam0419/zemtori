CREATE TABLE `activities` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text,
	`content` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE TABLE `order_record` (
	`id` text PRIMARY KEY NOT NULL,
	`order_status` text NOT NULL,
	`customer_id` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text,
	`stripe_payment_intent_id` text,
	`stripe_checkout_session_id` text,
	`payment_status` text
);
--> statement-breakpoint
CREATE TABLE `order_record_product` (
	`order_record_id` text NOT NULL,
	`product_pricing_id` text NOT NULL,
	`quantity` integer NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text,
	PRIMARY KEY(`order_record_id`, `product_pricing_id`),
	FOREIGN KEY (`order_record_id`) REFERENCES `order_record`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`product_pricing_id`) REFERENCES `product_pricing`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `product_pricing_images` (
	`product_image_id` text NOT NULL,
	`product_pricing_id` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	`created_by` text,
	`updated_by` text,
	PRIMARY KEY(`product_image_id`, `product_pricing_id`),
	FOREIGN KEY (`product_image_id`) REFERENCES `product_image`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`product_pricing_id`) REFERENCES `product_pricing`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
DROP INDEX IF EXISTS `product_pricing_product_id_is_default_unique`;--> statement-breakpoint
ALTER TABLE `product_pricing` ADD `is_archived` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `shop` ADD `currency` text;--> statement-breakpoint
ALTER TABLE `shop` ADD `stripe_account_id` text;