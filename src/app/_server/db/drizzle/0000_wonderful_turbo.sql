CREATE TABLE `admin` (
	`id` text PRIMARY KEY NOT NULL,
	`clerk_user_id` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE TABLE `category` (
	`id` text PRIMARY KEY NOT NULL,
	`category_name` text NOT NULL,
	`description` text NOT NULL,
	`parent_category_id` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	`created_by` text,
	`updated_by` text,
	FOREIGN KEY (`parent_category_id`) REFERENCES `category`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `product_image` (
	`id` text PRIMARY KEY NOT NULL,
	`url` text(300) NOT NULL,
	`product_id` text NOT NULL,
	`display_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	`created_by` text,
	`updated_by` text,
	FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `product_pricing` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`is_default` integer DEFAULT true,
	`price` real NOT NULL,
	`stock` integer NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	`created_by` text,
	`updated_by` text,
	FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `product_pricing_product_id_is_default_unique` ON `product_pricing` (`product_id`,`is_default`);--> statement-breakpoint
CREATE TABLE `product_pricing_value` (
	`variant_value_id` text NOT NULL,
	`product_pricing_id` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	`created_by` text,
	`updated_by` text,
	PRIMARY KEY(`variant_value_id`, `product_pricing_id`),
	FOREIGN KEY (`variant_value_id`) REFERENCES `variant_value`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`product_pricing_id`) REFERENCES `product_pricing`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `product_status` (
	`id` text PRIMARY KEY NOT NULL,
	`status` text(50) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `product_status_status_unique` ON `product_status` (`status`);--> statement-breakpoint
CREATE TABLE `product` (
	`id` text PRIMARY KEY NOT NULL,
	`product_name` text NOT NULL,
	`description` text NOT NULL,
	`has_variants` integer DEFAULT false,
	`product_status_id` text DEFAULT '1',
	`category_id` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	`created_by` text,
	`updated_by` text,
	FOREIGN KEY (`product_status_id`) REFERENCES `product_status`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `shopping_cart` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`variant_pricing_id` text,
	`quantity` integer NOT NULL,
	`customer_id` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	`created_by` text,
	`updated_by` text,
	FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`variant_pricing_id`) REFERENCES `product_pricing`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `shop` (
	`id` text PRIMARY KEY NOT NULL,
	`shop_name` text NOT NULL,
	`description` text NOT NULL,
	`social_url_facebook` text,
	`social_url_instagram` text,
	`social_url_linkedin` text,
	`address` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	`created_by` text,
	`updated_by` text
);
--> statement-breakpoint
CREATE TABLE `tag_product` (
	`tag_id` text NOT NULL,
	`product_id` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	`created_by` text,
	`updated_by` text,
	PRIMARY KEY(`tag_id`, `product_id`),
	FOREIGN KEY (`tag_id`) REFERENCES `tag`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tag` (
	`id` text PRIMARY KEY NOT NULL,
	`tag_name` text NOT NULL,
	`description` text NOT NULL,
	`status` text(50) DEFAULT 'not_valid' NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	`created_by` text,
	`updated_by` text
);
--> statement-breakpoint
CREATE TABLE `variant_type` (
	`id` text PRIMARY KEY NOT NULL,
	`variant_type_name` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	`created_by` text,
	`updated_by` text
);
--> statement-breakpoint
CREATE TABLE `variant_value` (
	`id` text PRIMARY KEY NOT NULL,
	`variant_value_name` text NOT NULL,
	`variant_type_id` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	`created_by` text,
	`updated_by` text,
	FOREIGN KEY (`variant_type_id`) REFERENCES `variant_type`(`id`) ON UPDATE no action ON DELETE cascade
);
