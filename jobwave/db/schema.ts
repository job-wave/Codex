import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
export const memberState = sqliteTable('member_state', {userId:text('user_id').primaryKey(),payload:text('payload').notNull(),version:integer('version').notNull().default(1),updatedAt:text('updated_at').notNull()});
export const aiUsage = sqliteTable('ai_usage',{id:text('id').primaryKey(),count:integer('count').notNull().default(0)});
export const feedSources=sqliteTable('feed_sources',{id:text('id').primaryKey(),payload:text('payload').notNull(),successAt:text('success_at'),attemptAt:text('attempt_at').notNull(),error:text('error')});
export const editorialState=sqliteTable('editorial_state',{id:text('id').primaryKey(),payload:text('payload').notNull(),version:integer('version').notNull(),revisionId:text('revision_id'),requestHash:text('request_hash'),updatedAt:text('updated_at').notNull()});
export const editorialArticles=sqliteTable('editorial_articles',{slug:text('slug').primaryKey(),payload:text('payload').notNull(),updatedAt:text('updated_at').notNull()});

export const consultationRequests=sqliteTable('consultation_requests',{id:text('id').primaryKey(),userId:text('user_id').notNull(),payload:text('payload').notNull(),status:text('status').notNull().default('requested'),createdAt:text('created_at').notNull()},t=>[index('consultation_user_idx').on(t.userId,t.createdAt)]);
