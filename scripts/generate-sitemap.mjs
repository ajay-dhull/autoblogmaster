import fs from "fs";
import fetch from "node-fetch";
import { SitemapStream, streamToPromise } from "sitemap";
import { createWriteStream } from "fs";
import { pipeline } from "stream";
import { promisify } from "util";
import path from "path";

const API_URL = "https://autoblogmaster-production.up.railway.app/api/articles";
const BASE_URL = "https://newshubnow.in";

const sitemapPath = path.resolve("public", "sitemap.xml");
const newsSitemapPath = path.resolve("public", "news-sitemap.xml");

const pipe = promisify(pipeline);

const ensurePublicDir = () => {
  const dir = path.resolve("public");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    console.log("📁 Created 'public' directory.");
  }
};

const generateSitemap = async () => {
  try {
    ensurePublicDir();

    const response = await fetch(API_URL);
    const articles = await response.json();

    if (!Array.isArray(articles)) throw new Error("API response is not an array");

    // ========= 🔵 Main Sitemap Generation =========
    const sitemapStream = new SitemapStream({ hostname: BASE_URL });
    const sitemapWriteStream = createWriteStream(sitemapPath);

    sitemapStream.write({ url: "/", changefreq: "daily", priority: 1.0 });

    for (const article of articles) {
      sitemapStream.write({
        url: `/article/${article.slug}`,
        lastmod: article.updatedAt || article.publishedAt,
        changefreq: "weekly",
        priority: 0.8,
        img: article.image
          ? [
              {
                url: article.image,
                title: article.title,
              },
            ]
          : [],
      });
    }

    sitemapStream.end();
    await pipe(sitemapStream, sitemapWriteStream);
    console.log("✅ sitemap.xml generated at:", sitemapPath);

    // ========= 🔵 News Sitemap Generation =========
    const newsStream = new SitemapStream({ hostname: BASE_URL });
    const newsWriteStream = createWriteStream(newsSitemapPath);

    const now = new Date();
    const cutoff = new Date(now.getTime() - 48 * 60 * 60 * 1000); // last 48 hours

    for (const article of articles) {
      const publishedDate = new Date(article.publishedAt);
      if (publishedDate >= cutoff) {
        newsStream.write({
          url: `/article/${article.slug}`,
          news: {
            publication: {
              name: "NewsHubNow",
              language: "en",
            },
            publication_date: article.publishedAt,
            title: article.title,
          },
          lastmod: article.updatedAt || article.publishedAt,
        });
      }
    }

    newsStream.end();
    await pipe(newsStream, newsWriteStream);
    console.log("✅ news-sitemap.xml generated at:", newsSitemapPath);
  } catch (error) {
    console.error("❌ Error generating sitemaps:", error.message);
  }
};

generateSitemap();
