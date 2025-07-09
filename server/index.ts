import dotenv from "dotenv";
dotenv.config();

import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";  // <-- cors import kiya

import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// CORS middleware setup - apna frontend URL yahan daalna
app.use(
  cors({
    origin: "https://newshubnow.in/",
    credentials: true,
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Start generating content immediately on server startup - ONLY ONCE
  let initialContentGenerated = false;
  setTimeout(async () => {
    try {
      if (!initialContentGenerated) {
        console.log("Starting one-time automatic content generation...");
        const { improvedContentGenerator } = await import("./lib/improved-content-generator");
        await improvedContentGenerator.generateAllFreshContent();
        initialContentGenerated = true;
        console.log("Initial content generation completed!");
      }
    } catch (error) {
      console.error("Error in automatic content generation:", error);
    }
  }, 5000); // Wait 5 seconds for server to fully start

  // Daily cleanup: Delete articles older than 2 months (runs every 24 hours)
  setInterval(async () => {
    try {
      console.log("🗑️ Starting daily cleanup - deleting articles older than 2 months...");
      const { improvedContentGenerator } = await import("./lib/improved-content-generator");
      await improvedContentGenerator.deleteOldArticles();
      console.log("✅ Daily cleanup completed");
    } catch (error) {
      console.error("❌ Error in daily cleanup:", error);
    }
  }, 86400000); // Every 24 hours (24 * 60 * 60 * 1000)

  // NewsAPI: Every 4 hours - 2-3 articles
  setInterval(async () => {
    try {
      console.log(`4-hourly NewsAPI content generation`);
      const { improvedContentGenerator } = await import("./lib/improved-content-generator");
      const articles = await improvedContentGenerator.generateFromNewsAPI();

      // Save articles
      for (const article of articles) {
        try {
          const { db } = await import("./lib/supabase");
          const { articles: articlesTable } = await import("@shared/schema");
          await db.insert(articlesTable).values({
            ...article,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          console.log(`4-hourly NewsAPI save: ${article.title}`);
        } catch (error) {
          console.error(`Error saving 4-hourly NewsAPI article: ${error}`);
        }
      }
    } catch (error) {
      console.error("Error in 4-hourly NewsAPI generation:", error);
    }
  }, 14400000); // Every 4 hours (4 * 60 * 60 * 1000)

  // GNews India: Every 4 hours - 2-3 articles
  setInterval(async () => {
    try {
      console.log(`4-hourly GNews content generation`);
      const { improvedContentGenerator } = await import("./lib/improved-content-generator");
      const articles = await improvedContentGenerator.generateFromGNews();

      // Save articles
      for (const article of articles) {
        try {
          const { db } = await import("./lib/supabase");
          const { articles: articlesTable } = await import("@shared/schema");
          await db.insert(articlesTable).values({
            ...article,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          console.log(`4-hourly GNews save: ${article.title}`);
        } catch (error) {
          console.error(`Error saving 4-hourly GNews article: ${error}`);
        }
      }
    } catch (error) {
      console.error("Error in 4-hourly GNews generation:", error);
    }
  }, 14400000); // Every 4 hours (4 * 60 * 60 * 1000)

  // SerpAPI: 3 times daily (Morning 9 AM, Afternoon 1 PM, Evening 6 PM) - 2 articles each = 6 articles per day
  // Total: 6 calls/day × 30 days = 180 calls/month (within 200 limit for 2 API keys)
  setInterval(async () => {
    try {
      const hour = new Date().getHours();
      if (hour === 9 || hour === 13 || hour === 18) {
        const timeOfDay = hour === 9 ? 'Morning' : hour === 13 ? 'Afternoon' : 'Evening';
        console.log(`${timeOfDay} SerpAPI content generation at ${hour}:00 - generating 2 articles`);
        const { improvedContentGenerator } = await import("./lib/improved-content-generator");
        const articles = await improvedContentGenerator.generateFromSerpAPI();
        
        // Save articles - limit to 2 per session (Morning: 2, Afternoon: 2, Evening: 2)
        for (const article of articles.slice(0, 2)) {
          try {
            const { db } = await import("./lib/supabase");
            const { articles: articlesTable } = await import("@shared/schema");
            await db.insert(articlesTable).values({
              ...article,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
            console.log(`${timeOfDay} SerpAPI save: ${article.title}`);
          } catch (error) {
            console.error(`Error saving SerpAPI article: ${error}`);
          }
        }
      }
    } catch (error) {
      console.error("Error in SerpAPI generation:", error);
    }
  }, 3600000); // Check every hour

  // AI Educational content: 3 times daily (10 AM, 1 PM, 7 PM)
  setInterval(async () => {
    try {
      const hour = new Date().getHours();
      if (hour === 10 || hour === 13 || hour === 19) {
        console.log(`Scheduled AI Educational content generation at ${hour}:00`);
        const { improvedContentGenerator } = await import("./lib/improved-content-generator");
        const articles = await improvedContentGenerator.generateEducationalContent();

        // Save articles
        for (const article of articles.slice(0, 1)) {
          try {
            const { db } = await import("./lib/supabase");
            const { articles: articlesTable } = await import("@shared/schema");
            await db.insert(articlesTable).values({
              ...article,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
            console.log(`Educational scheduled save: ${article.title}`);
          } catch (error) {
            console.error(`Error saving educational article: ${error}`);
          }
        }
      }
    } catch (error) {
      console.error("Error in Educational generation:", error);
    }
  }, 3600000); // Check every hour

  // Reddit: 2 articles daily (random times)
  setInterval(async () => {
    try {
      const hour = new Date().getHours();
      if (hour === 11 || hour === 20) {
        console.log(`Scheduled Reddit content generation at ${hour}:00`);
        const { improvedContentGenerator } = await import("./lib/improved-content-generator");
        const articles = await improvedContentGenerator.generateFromReddit();

        // Save articles
        for (const article of articles.slice(0, 1)) {
          try {
            const { db } = await import("./lib/supabase");
            const { articles: articlesTable } = await import("@shared/schema");
            await db.insert(articlesTable).values({
              ...article,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
            console.log(`Reddit scheduled save: ${article.title}`);
          } catch (error) {
            console.error(`Error saving Reddit article: ${error}`);
          }
        }
      }
    } catch (error) {
      console.error("Error in Reddit generation:", error);
    }
  }, 3600000); // Check every hour

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    }
  );
})();
