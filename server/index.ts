import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
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

  // NewsAPI: Every hour - 2-3 articles
  setInterval(async () => {
    try {
      console.log(`Hourly NewsAPI content generation`);
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
          console.log(`Hourly NewsAPI save: ${article.title}`);
        } catch (error) {
          console.error(`Error saving hourly NewsAPI article: ${error}`);
        }
      }
    } catch (error) {
      console.error("Error in hourly NewsAPI generation:", error);
    }
  }, 3600000); // Every hour

  // GNews India: Every hour - 2-3 articles
  setInterval(async () => {
    try {
      console.log(`Hourly GNews content generation`);
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
          console.log(`Hourly GNews save: ${article.title}`);
        } catch (error) {
          console.error(`Error saving hourly GNews article: ${error}`);
        }
      }
    } catch (error) {
      console.error("Error in hourly GNews generation:", error);
    }
  }, 3600000); // Every hour

  // SerpAPI: 3 times daily (9 AM, 12 PM, 5 PM) - 1 article each
  setInterval(async () => {
    try {
      const hour = new Date().getHours();
      if (hour === 9 || hour === 12 || hour === 17) {
        console.log(`Scheduled SerpAPI content generation at ${hour}:00`);
        const { improvedContentGenerator } = await import("./lib/improved-content-generator");
        const articles = await improvedContentGenerator.generateFromSerpAPI();
        
        // Save articles
        for (const article of articles.slice(0, 1)) { // Only save 1 article per scheduled time
          try {
            const { db } = await import("./lib/supabase");
            const { articles: articlesTable } = await import("@shared/schema");
            await db.insert(articlesTable).values({
              ...article,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
            console.log(`SerpAPI scheduled save: ${article.title}`);
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
        for (const article of articles.slice(0, 1)) { // Only save 1 article per scheduled time
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
      // Generate at 11 AM and 8 PM daily
      if (hour === 11 || hour === 20) {
        console.log(`Scheduled Reddit content generation at ${hour}:00`);
        const { improvedContentGenerator } = await import("./lib/improved-content-generator");
        const articles = await improvedContentGenerator.generateFromReddit();
        
        // Save articles
        for (const article of articles.slice(0, 1)) { // Only save 1 article per scheduled time
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
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
