import { db } from "./lib/supabase";
import {
  articles,
  contacts,
  type Article,
  type InsertArticle,
  type Contact,
  type InsertContact,
} from "@shared/schema";
import { eq, desc, and, like } from "drizzle-orm";

export interface IStorage {
  // Articles
  getArticles(limit?: number, offset?: number, category?: string): Promise<Article[]>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  getArticleById(id: number): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: number, article: Partial<InsertArticle>): Promise<Article | undefined>;
  deleteArticle(id: number): Promise<boolean>;
  searchArticles(query: string): Promise<Article[]>;
  getFeaturedArticles(): Promise<Article[]>;
  getArticlesByCategory(category: string): Promise<Article[]>;

  // Contacts
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
  markContactAsRead(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getArticles(limit = 20, offset = 0, category?: string): Promise<Article[]> {
    try {
      const result = await db
        .select()
        .from(articles)
        .where(
          category && category !== "all"
            ? and(eq(articles.isPublished, true), eq(articles.category, category))
            : eq(articles.isPublished, true)
        )
        .orderBy(desc(articles.publishedAt))
        .limit(limit)
        .offset(offset);

      return result;
    } catch (error) {
      console.error("Error fetching articles:", error);
      return [];
    }
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    try {
      const result = await db
        .select()
        .from(articles)
        .where(and(eq(articles.slug, slug), eq(articles.isPublished, true)))
        .limit(1);

      return result[0];
    } catch (error) {
      console.error("Error fetching article by slug:", error);
      return undefined;
    }
  }

  async getArticleById(id: number): Promise<Article | undefined> {
    try {
      const result = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error fetching article by id:", error);
      return undefined;
    }
  }

  async createArticle(article: InsertArticle): Promise<Article> {
    try {
      const result = await db
        .insert(articles)
        .values({
          ...article,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return result[0];
    } catch (error) {
      console.error("Error creating article:", error);
      throw error;
    }
  }

  async updateArticle(id: number, article: Partial<InsertArticle>): Promise<Article | undefined> {
    try {
      const result = await db
        .update(articles)
        .set({ ...article, updatedAt: new Date() })
        .where(eq(articles.id, id))
        .returning();

      return result[0];
    } catch (error) {
      console.error("Error updating article:", error);
      return undefined;
    }
  }

  async deleteArticle(id: number): Promise<boolean> {
    try {
      await db.delete(articles).where(eq(articles.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting article:", error);
      return false;
    }
  }

  async searchArticles(query: string): Promise<Article[]> {
    try {
      const result = await db
        .select()
        .from(articles)
        .where(
          and(
            eq(articles.isPublished, true),
            like(articles.title, `%${query}%`)
          )
        )
        .orderBy(desc(articles.publishedAt))
        .limit(20);

      return result;
    } catch (error) {
      console.error("Error searching articles:", error);
      return [];
    }
  }

  async getFeaturedArticles(): Promise<Article[]> {
    try {
      const result = await db
        .select()
        .from(articles)
        .where(eq(articles.isPublished, true))
        .orderBy(desc(articles.publishedAt))
        .limit(3);

      return result;
    } catch (error) {
      console.error("Error fetching featured articles:", error);
      return [];
    }
  }

  async getArticlesByCategory(category: string): Promise<Article[]> {
    try {
      const result = await db
        .select()
        .from(articles)
        .where(and(eq(articles.category, category), eq(articles.isPublished, true)))
        .orderBy(desc(articles.publishedAt))
        .limit(10);

      return result;
    } catch (error) {
      console.error("Error fetching articles by category:", error);
      return [];
    }
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    try {
      const result = await db
        .insert(contacts)
        .values({
          ...contact,
          createdAt: new Date(),
        })
        .returning();

      return result[0];
    } catch (error) {
      console.error("Error creating contact:", error);
      throw error;
    }
  }

  async getContacts(): Promise<Contact[]> {
    try {
      const result = await db.select().from(contacts).orderBy(desc(contacts.createdAt));
      return result;
    } catch (error) {
      console.error("Error fetching contacts:", error);
      return [];
    }
  }

  async markContactAsRead(id: number): Promise<boolean> {
    try {
      await db.update(contacts).set({ isRead: true }).where(eq(contacts.id, id));
      return true;
    } catch (error) {
      console.error("Error marking contact as read:", error);
      return false;
    }
  }
}

export const storage = new DatabaseStorage();
