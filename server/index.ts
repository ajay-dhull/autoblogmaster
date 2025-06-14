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

  // Start generating content immediately on server startup
  setTimeout(async () => {
    try {
      console.log("Starting automatic content generation...");
      const { improvedContentGenerator } = await import("./lib/improved-content-generator");
      await improvedContentGenerator.generateAllFreshContent();
      console.log("Initial content generation completed!");
    } catch (error) {
      console.error("Error in automatic content generation:", error);
    }
  }, 5000); // Wait 5 seconds for server to fully start

  // Set up scheduled content generation
  // NewsAPI: Every 8 hours (8 AM, 4 PM, 12 AM)
  setInterval(async () => {
    try {
      const hour = new Date().getHours();
      if (hour === 8 || hour === 16 || hour === 0) {
        console.log(`Scheduled NewsAPI content generation at ${hour}:00`);
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
            console.log(`Scheduled save: ${article.title}`);
          } catch (error) {
            console.error(`Error saving scheduled article: ${error}`);
          }
        }
      }
    } catch (error) {
      console.error("Error in scheduled NewsAPI generation:", error);
    }
  }, 3600000); // Check every hour

  // GNews India: Every 6 hours (12 PM, 6 PM, 12 AM, 6 AM)
  setInterval(async () => {
    try {
      const hour = new Date().getHours();
      if (hour === 12 || hour === 18 || hour === 0 || hour === 6) {
        console.log(`Scheduled GNews content generation at ${hour}:00`);
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
            console.log(`Scheduled save: ${article.title}`);
          } catch (error) {
            console.error(`Error saving scheduled article: ${error}`);
          }
        }
      }
    } catch (error) {
      console.error("Error in scheduled GNews generation:", error);
    }
  }, 3600000); // Check every hour

  // Educational content: Once daily at 10 AM
  setInterval(async () => {
    try {
      const hour = new Date().getHours();
      if (hour === 10) {
        console.log(`Scheduled Educational content generation at ${hour}:00`);
        const { improvedContentGenerator } = await import("./lib/improved-content-generator");
        const articles = await improvedContentGenerator.generateEducationalContent();
        
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
            console.log(`Scheduled save: ${article.title}`);
          } catch (error) {
            console.error(`Error saving scheduled article: ${error}`);
          }
        }
      }
    } catch (error) {
      console.error("Error in scheduled Educational generation:", error);
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
