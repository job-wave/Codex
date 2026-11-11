CREATE TABLE `feed_sources` (
	`id` text PRIMARY KEY NOT NULL,
	`payload` text NOT NULL,
	`success_at` text,
	`attempt_at` text NOT NULL,
	`error` text
);
