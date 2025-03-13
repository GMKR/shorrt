CREATE TABLE `activities` (
	`id` integer PRIMARY KEY NOT NULL,
	`linkId` integer NOT NULL,
	`timestamp` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`ip` text,
	`asOrg` text,
	`country` text,
	`region` text,
	`city` text,
	`continent` text,
	`latitude` text,
	`longitude` text,
	`postalCode` text,
	`userAgent` text,
	`referrer` text,
	`device` text,
	`os` text,
	`browser` text,
	FOREIGN KEY (`linkId`) REFERENCES `links`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `activity_link_idx` ON `activities` (`linkId`);--> statement-breakpoint
CREATE INDEX `activity_timestamp_idx` ON `activities` (`timestamp`);--> statement-breakpoint
CREATE TABLE `links` (
	`id` integer PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`url` text NOT NULL,
	`title` text,
	`description` text,
	`isActive` integer DEFAULT true NOT NULL,
	`config` text,
	`visits` integer DEFAULT 0 NOT NULL,
	`lastVisit` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `links_slug_unique` ON `links` (`slug`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`firstName` text,
	`lastName` text,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`isActive` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);