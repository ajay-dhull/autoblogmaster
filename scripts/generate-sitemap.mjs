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

    // ========= 🔵 News Sitemap Generation (Manual XML) =========
    const now = new Date();
    const cutoff = new Date(now.getTime() - 48 * 60 * 60 * 1000); // last 48 hours
    const newsItems = [];

    for (const article of articles) {
      const publishedDate = new Date(article.publishedAt);
      if (publishedDate >= cutoff) {
        newsItems.push(`
  <url>
    <loc>${BASE_URL}/article/${article.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>NewsHubNow</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${article.publishedAt}</news:publication_date>
      <news:title><![CDATA[${article.title}]]></news:title>
    </news:news>
  </url>`);
      }
    }

    const newsSitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${newsItems.join("\n")}
</urlset>`;

    fs.writeFileSync(newsSitemapPath, newsSitemapXML, "utf8");
    console.log("✅ news-sitemap.xml generated with", newsItems.length, "items at:", newsSitemapPath);
  } catch (error) {
    console.error("❌ Error generating sitemaps:", error.message);
  }
};

generateSitemap();
