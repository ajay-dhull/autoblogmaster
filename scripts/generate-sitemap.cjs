// scripts/generate-sitemap.js

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const dayjs = require('dayjs');

// ✅ Base site URL
const BASE_URL = 'https://newshubnow.in';

// ✅ Your articles API
const ARTICLES_API = `${BASE_URL}/api/articles`;

// 🔁 Fetch all articles
async function fetchArticles() {
  const res = await axios.get(ARTICLES_API);
  return res.data;
}

// 🌐 Normal Sitemap Entry
function urlEntry(loc, lastmod, priority = '0.80') {
  return `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>${priority}</priority>
  </url>`;
}

// 📰 Google News Sitemap Entry
function newsEntry(article) {
  const pubDate = dayjs(article.publishedAt).toISOString();
  return `
  <url>
    <loc>${BASE_URL}/article/${article.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>NewsHubNow</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${article.title}</news:title>
    </news:news>
  </url>`;
}

// 🏗️ Build and write both sitemaps
async function buildSitemaps() {
  const articles = await fetchArticles();

  // ✅ Normal sitemap
  const urls = [];
  urls.push(urlEntry(`${BASE_URL}/`, dayjs().format('YYYY-MM-DD'), '1.00'));

  for (const art of articles) {
    const loc = `${BASE_URL}/article/${art.slug}`;
    const lastmod = dayjs(art.publishedAt).format('YYYY-MM-DD');
    urls.push(urlEntry(loc, lastmod));
  }

  const normalXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  const normalDest = path.join(__dirname, '..', 'client', 'public', 'sitemap.xml');
  fs.writeFileSync(normalDest, normalXml.trim());
  console.log(`✅ sitemap.xml generated with ${articles.length + 1} URLs`);

  // ✅ Google News sitemap
  const newsUrls = [];
  for (const art of articles) {
    newsUrls.push(newsEntry(art));
  }

  const newsXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${newsUrls.join('\n')}
</urlset>`;

  const newsDest = path.join(__dirname, '..', 'client', 'public', 'news-sitemap.xml');
  fs.writeFileSync(newsDest, newsXml.trim());
  console.log(`✅ news-sitemap.xml generated with ${articles.length} news articles`);
}

// ✅ Run the script
buildSitemaps().catch(err => {
  console.error(err);
  process.exit(1);
});
