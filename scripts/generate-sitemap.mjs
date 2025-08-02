import fs from "fs";
import fetch from "node-fetch";
import { SitemapStream } from "sitemap";
import { createWriteStream } from "fs";
import { pipeline } from "stream";
import { promisify } from "util";
import path from "path";

const API_URL = "https://autoblogmaster.onrender.com/api/articles";
const BASE_URL = "https://newshubnow.in";

// List out all your blog categories here:
const categories = [
  "All",
  "World News",
  "India News",
  "Technology",
  "Educational",
  "Viral",
  "Trending",
];

const publicDir = path.resolve("client", "public");
const sitemapPath = path.resolve(publicDir, "sitemap.xml");

const pipe = promisify(pipeline);

function ensurePublicDir() {
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
    console.log(`Created directory: ${publicDir}`);
  }
}

async function generateSitemap() {
  try {
    ensurePublicDir();

    // Fetch all articles
    const res = await fetch(API_URL);
    const articles = await res.json();
    if (!Array.isArray(articles)) {
      throw new Error("API did not return an array of articles.");
    }

    // Create the sitemap stream
    const sitemapStream = new SitemapStream({ hostname: BASE_URL });
    const writeStream = createWriteStream(sitemapPath);

    // 1) Home page
    sitemapStream.write({
      url: "/",
      changefreq: "daily",
      priority: 1.0,
    });

    // 2) Blog main page
    sitemapStream.write({
      url: "/blog",
      changefreq: "daily",
      priority: 0.8,
    });

    // 3) Each category page
    for (const name of categories) {
      const url =
        name === "All"
          ? "/blog"
          : `/blog?category=${encodeURIComponent(name)}`;

      sitemapStream.write({
        url,
        changefreq: "daily",
        priority: 0.7,
      });
    }

    // 4) Individual article pages
    for (const art of articles) {
      sitemapStream.write({
        url: `/article/${art.slug}`,
        lastmod: art.updatedAt || art.publishedAt,
        changefreq: "weekly",
        priority: 0.8,
        img: art.image
          ? [
              {
                url: art.image,
                title: art.title,
              },
            ]
          : [],
      });
    }

    // Finalize and write to file
    sitemapStream.end();
    await pipe(sitemapStream, writeStream);

    console.log(`✅ sitemap.xml generated at: ${sitemapPath}`);
  } catch (err) {
    console.error("❌ Error generating sitemap:", err);
  }
}

generateSitemap();
