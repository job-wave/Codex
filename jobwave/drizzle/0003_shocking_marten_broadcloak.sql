CREATE TABLE `editorial_articles` (
	`slug` text PRIMARY KEY NOT NULL,
	`payload` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `editorial_state` (
	`id` text PRIMARY KEY NOT NULL,
	`payload` text NOT NULL,
	`version` integer NOT NULL,
	`revision_id` text,
	`request_hash` text,
	`updated_at` text NOT NULL
);
