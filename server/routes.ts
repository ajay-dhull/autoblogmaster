import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema } from "@shared/schema";
import { contentGenerator } from "./lib/content-generators";

export async function registerRoutes(app: Express): Promise<Server> {
  // Articles API
  app.get("/api/articles", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      const category = req.query.category as string;
      
      const articles = await storage.getArticles(limit, offset, category);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  });

  app.get("/api/articles/featured", async (req, res) => {
    try {
      const articles = await storage.getFeaturedArticles();
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch featured articles" });
    }
  });

  app.get("/api/articles/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: "Search query is required" });
      }
      
      const articles = await storage.searchArticles(query);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: "Failed to search articles" });
    }
  });

  app.get("/api/articles/:slug", async (req, res) => {
    try {
      const article = await storage.getArticleBySlug(req.params.slug);
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch article" });
    }
  });

  app.get("/api/categories/:category", async (req, res) => {
    try {
      const articles = await storage.getArticlesByCategory(req.params.category);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch articles by category" });
    }
  });

  // Contact API
  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      res.status(201).json(contact);
    } catch (error) {
      res.status(400).json({ error: "Invalid contact data" });
    }
  });

  // Content Generation API
  app.post("/api/generate-content", async (req, res) => {
    try {
      const { source } = req.body;
      
      let articles: any[] = [];
      
      switch (source) {
        case "newsapi":
          articles = await contentGenerator.generateFromNewsAPI();
          break;
        case "gnews":
          articles = await contentGenerator.generateFromGNews();
          break;
        case "reddit":
          articles = await contentGenerator.generateFromReddit();
          break;
        case "serpapi":
          articles = await contentGenerator.generateFromSerpAPI();
          break;
        case "groq":
          articles = await contentGenerator.generateEducationalContent();
          break;
        case "all":
          await contentGenerator.generateAllContent();
          articles = await storage.getArticles(10, 0);
          break;
        default:
          return res.status(400).json({ error: "Invalid source" });
      }
      
      for (const article of articles) {
        await storage.createArticle(article);
      }
      
      res.json({ message: `Generated ${articles.length} articles`, articles });
    } catch (error) {
      console.error("Content generation error:", error);
      res.status(500).json({ error: "Failed to generate content" });
    }
  });

  // Admin API
  app.get("/api/admin/contacts", async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  app.patch("/api/admin/contacts/:id/read", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.markContactAsRead(id);
      
      if (success) {
        res.json({ message: "Contact marked as read" });
      } else {
        res.status(404).json({ error: "Contact not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to mark contact as read" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
