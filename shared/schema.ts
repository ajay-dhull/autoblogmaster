import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  metaDescription: text("meta_description").notNull(),
  category: text("category").notNull(),
  source: text("source").notNull(), // NewsAPI, GNews, Reddit, SerpAPI, Groq
  sourceUrl: text("source_url"),
  featuredImage: text("featured_image"),
  tags: text("tags").array(),
  isPublished: boolean("is_published").default(true),
  publishedAt: timestamp("published_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const contentSources = pgTable("content_sources", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // news_api, gnews, reddit, serp_api, groq
  schedule: text("schedule").notNull(), // cron expression
  isActive: boolean("is_active").default(true),
  lastRun: timestamp("last_run"),
  config: jsonb("config"), // API specific configuration
  createdAt: timestamp("created_at").defaultNow(),
});

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  isRead: true,
  createdAt: true,
});

export const insertContentSourceSchema = createInsertSchema(contentSources).omit({
  id: true,
  lastRun: true,
  createdAt: true,
});

export type Article = typeof articles.$inferSelect;
export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type ContentSource = typeof contentSources.$inferSelect;
export type InsertContentSource = z.infer<typeof insertContentSourceSchema>;
