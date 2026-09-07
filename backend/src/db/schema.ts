import { pgTable, uuid, text, timestamp, boolean, integer, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const apiKeys = pgTable('api_keys', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  keyPrefix: text('key_prefix').notNull(), // e.g. lm_live_a1b2
  keyHash: text('key_hash').notNull(), // SHA-256
  status: text('status').default('active').notNull(), // active, revoked
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastUsedAt: timestamp('last_used_at'),
});

export const providerCredentials = pgTable('provider_credentials', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }), // null if global system provider
  providerType: text('provider_type').notNull(), // 'resend', 'brevo', 'mailersend', 'gmail_smtp', 'custom_smtp'
  name: text('name').notNull(),
  encryptedConfig: text('encrypted_config').notNull(), // AES-256 encrypted JSON string
  dailyLimit: integer('daily_limit').default(300).notNull(),
  currentDailyUsage: integer('current_daily_usage').default(0).notNull(),
  priority: integer('priority').default(1).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  lastResetAt: timestamp('last_reset_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const emailTemplates = pgTable('email_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  subject: text('subject').notNull(),
  bodyHtml: text('body_html').notNull(),
  bodyText: text('body_text'),
  variables: jsonb('variables').default([]).notNull(), // string array e.g. ["name", "code"]
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const emailLogs = pgTable('email_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  apiKeyId: uuid('api_key_id').references(() => apiKeys.id, { onDelete: 'set null' }),
  providerUsed: text('provider_used').notNull(),
  recipient: text('recipient').notNull(),
  subject: text('subject').notNull(),
  status: text('status').notNull(), // 'queued', 'sent', 'failed', 'retrying'
  errorMessage: text('error_message'),
  attemptCount: integer('attempt_count').default(1).notNull(),
  sentAt: timestamp('sent_at').defaultNow().notNull(),
});
