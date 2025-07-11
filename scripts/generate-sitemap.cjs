// scripts/generate-sitemap.js

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const dayjs = require('dayjs');

// 1️⃣ Change this to your site’s base URL
const BASE_URL = 'https://newshubnow.in';
// 2️⃣ This should return [{ slug, publishedAt }, ...]
const ARTICLES_API = `${BASE_URL}/api/articles`;

// Fetch all articles from your API
async function fetchArticles() {
  const res = await axios.get(ARTICLES_API);
  return res.data;
}

// Helper to build each <url> entry
function urlEntry(loc, lastmod, priority = '0.80') {
  return `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>${priority}</priority>
  </url>`;
}

async function buildSitemap() {
  const articles = await fetchArticles();
  const urls = [];

  // Homepage entry
  urls.push(
    urlEntry(
      `${BASE_URL}/`,
      dayjs().format('YYYY-MM-DD'),
      '1.00'
    )
  );

  // One entry per article
  for (const art of articles) {
    const loc = `${BASE_URL}/article/${art.slug}`;
    const lastmod = dayjs(art.publishedAt).format('YYYY-MM-DD');
    urls.push(urlEntry(loc, lastmod));
  }

  // Wrap it all up
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  // Write to public/sitemap.xml
  const dest = path.join(__dirname, '..', 'client', 'public', 'sitemap.xml');
  fs.writeFileSync(dest, xml.trim());
  console.log(`✅ sitemap.xml generated with ${articles.length + 1} URLs`);
}

buildSitemap().catch(err => {
  console.error(err);
  process.exit(1);
});
