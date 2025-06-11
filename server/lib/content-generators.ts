import { db } from "./supabase";
import { articles, type InsertArticle } from "@shared/schema";

interface ContentGeneratorConfig {
  newsApiKey: string;
  gnewsApiKey: string;
  redditClientId: string;
  redditClientSecret: string;
  serpApiKey: string;
  groqApiKey: string;
  unsplashAccessKey: string;
  pexelsApiKey: string;
}

class ContentGenerator {
  private config: ContentGeneratorConfig;

  constructor() {
    this.config = {
      newsApiKey: process.env.NEWS_API_KEY || "",
      gnewsApiKey: process.env.GNEWS_API_KEY || "",
      redditClientId: process.env.REDDIT_CLIENT_ID || "",
      redditClientSecret: process.env.REDDIT_CLIENT_SECRET || "",
      serpApiKey: process.env.SERPAPI_KEY || "",
      groqApiKey: process.env.GROQ_API_KEY || "",
      unsplashAccessKey: process.env.UNSPLASH_ACCESS_KEY || "",
      pexelsApiKey: process.env.PEXELS_API_KEY || "",
    };
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }

  private async enhanceWithGroq(content: string, title: string): Promise<string> {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.config.groqApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            {
              role: "system",
              content: "You are a professional blog writer. Rewrite the given content to be engaging, SEO-optimized, and well-structured with proper headings. Make it unique and add human emotion, curiosity, and clarity. Format with HTML tags (h2, h3, p, ul, li)."
            },
            {
              role: "user",
              content: `Title: ${title}\n\nContent: ${content}`
            }
          ],
          max_tokens: 2000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Groq API error response:", errorText);
        throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || content;
    } catch (error) {
      console.error("Error enhancing content with Groq:", error);
      return content;
    }
  }

  private async getImage(keywords: string): Promise<string> {
    try {
      // Try Unsplash first
      const unsplashResponse = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(keywords)}&per_page=1&orientation=landscape`,
        {
          headers: {
            "Authorization": `Client-ID ${this.config.unsplashAccessKey}`,
          },
        }
      );

      if (unsplashResponse.ok) {
        const unsplashData = await unsplashResponse.json();
        if (unsplashData.results && unsplashData.results.length > 0) {
          return unsplashData.results[0].urls.regular;
        }
      }

      // Fallback to Pexels
      const pexelsResponse = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(keywords)}&per_page=1&orientation=landscape`,
        {
          headers: {
            "Authorization": this.config.pexelsApiKey,
          },
        }
      );

      if (pexelsResponse.ok) {
        const pexelsData = await pexelsResponse.json();
        if (pexelsData.photos && pexelsData.photos.length > 0) {
          return pexelsData.photos[0].src.large;
        }
      }

      return "https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=800&h=400&fit=crop";
    } catch (error) {
      console.error("Error fetching image:", error);
      return "https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=800&h=400&fit=crop";
    }
  }

  async generateFromNewsAPI(): Promise<InsertArticle[]> {
    try {
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?category=general&language=en&pageSize=5&apiKey=${this.config.newsApiKey}`
      );

      if (!response.ok) {
        throw new Error(`NewsAPI error: ${response.statusText}`);
      }

      const data = await response.json();
      const articles: InsertArticle[] = [];

      for (const article of data.articles.slice(0, 2)) {
        if (!article.title || !article.description) continue;

        const enhancedContent = await this.enhanceWithGroq(
          article.description + (article.content || ""),
          article.title
        );

        const featuredImage = await this.getImage(article.title);

        articles.push({
          title: article.title,
          slug: this.generateSlug(article.title),
          content: enhancedContent,
          excerpt: article.description.substring(0, 200) + "...",
          metaDescription: article.description.substring(0, 160),
          category: "World News",
          source: "NewsAPI",
          sourceUrl: article.url,
          featuredImage,
          tags: ["news", "world", "global"],
          isPublished: true,
          publishedAt: new Date(),
        });
      }

      return articles;
    } catch (error) {
      console.error("Error generating from NewsAPI:", error);
      return [];
    }
  }

  async generateFromGNews(): Promise<InsertArticle[]> {
    try {
      const response = await fetch(
        `https://gnews.io/api/v4/top-headlines?country=in&lang=en&max=5&apikey=${this.config.gnewsApiKey}`
      );

      if (!response.ok) {
        throw new Error(`GNews error: ${response.statusText}`);
      }

      const data = await response.json();
      const articles: InsertArticle[] = [];

      for (const article of data.articles.slice(0, 3)) {
        if (!article.title || !article.description) continue;

        const enhancedContent = await this.enhanceWithGroq(
          article.description + (article.content || ""),
          article.title
        );

        const featuredImage = await this.getImage(article.title);

        articles.push({
          title: article.title,
          slug: this.generateSlug(article.title),
          content: enhancedContent,
          excerpt: article.description.substring(0, 200) + "...",
          metaDescription: article.description.substring(0, 160),
          category: "India News",
          source: "GNews",
          sourceUrl: article.url,
          featuredImage,
          tags: ["india", "news", "local"],
          isPublished: true,
          publishedAt: new Date(),
        });
      }

      return articles;
    } catch (error) {
      console.error("Error generating from GNews:", error);
      return [];
    }
  }

  async generateFromReddit(): Promise<InsertArticle[]> {
    try {
      // Get Reddit access token
      const authResponse = await fetch("https://www.reddit.com/api/v1/access_token", {
        method: "POST",
        headers: {
          "Authorization": `Basic ${Buffer.from(`${this.config.redditClientId}:${this.config.redditClientSecret}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      });

      if (!authResponse.ok) {
        throw new Error(`Reddit auth error: ${authResponse.statusText}`);
      }

      const authData = await authResponse.json();
      const accessToken = authData.access_token;

      // Get hot posts
      const postsResponse = await fetch("https://oauth.reddit.com/hot?limit=5", {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "User-Agent": "AutoBlog/1.0",
        },
      });

      if (!postsResponse.ok) {
        throw new Error(`Reddit posts error: ${postsResponse.statusText}`);
      }

      const postsData = await postsResponse.json();
      const articles: InsertArticle[] = [];

      for (const post of postsData.data.children.slice(0, 1)) {
        const postData = post.data;
        if (!postData.title || !postData.selftext) continue;

        const enhancedContent = await this.enhanceWithGroq(
          postData.selftext,
          postData.title
        );

        const featuredImage = await this.getImage(postData.title);

        articles.push({
          title: postData.title,
          slug: this.generateSlug(postData.title),
          content: enhancedContent,
          excerpt: postData.selftext.substring(0, 200) + "...",
          metaDescription: postData.selftext.substring(0, 160),
          category: "Viral",
          source: "Reddit",
          sourceUrl: `https://reddit.com${postData.permalink}`,
          featuredImage,
          tags: ["viral", "reddit", "trending"],
          isPublished: true,
          publishedAt: new Date(),
        });
      }

      return articles;
    } catch (error) {
      console.error("Error generating from Reddit:", error);
      return [];
    }
  }

  async generateFromSerpAPI(): Promise<InsertArticle[]> {
    try {
      const searches = ["AI tools 2025", "latest technology trends"];
      const articles: InsertArticle[] = [];

      for (const query of searches.slice(0, 2)) {
        const response = await fetch(
          `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${this.config.serpApiKey}`
        );

        if (!response.ok) {
          throw new Error(`SerpAPI error: ${response.statusText}`);
        }

        const data = await response.json();
        const organicResults = data.organic_results || [];

        for (const result of organicResults.slice(0, 1)) {
          if (!result.title || !result.snippet) continue;

          const enhancedContent = await this.enhanceWithGroq(
            result.snippet,
            result.title
          );

          const featuredImage = await this.getImage(result.title);

          articles.push({
            title: result.title,
            slug: this.generateSlug(result.title),
            content: enhancedContent,
            excerpt: result.snippet.substring(0, 200) + "...",
            metaDescription: result.snippet.substring(0, 160),
            category: "Trending",
            source: "SerpAPI",
            sourceUrl: result.link,
            featuredImage,
            tags: ["trending", "search", "tech"],
            isPublished: true,
            publishedAt: new Date(),
          });
        }
      }

      return articles;
    } catch (error) {
      console.error("Error generating from SerpAPI:", error);
      return [];
    }
  }

  async generateEducationalContent(): Promise<InsertArticle[]> {
    const topics = [
      "How to Make Money Online: Complete Guide for 2025",
      "What is ChatGPT? Understanding AI Language Models",
      "Who is MrBeast? The YouTube Empire Behind Philanthropic Content",
      "Best AI Tools 2025: Revolutionary Platforms Transforming Industries"
    ];

    const articles: InsertArticle[] = [];

    for (const topic of topics.slice(0, 2)) {
      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${this.config.groqApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama3-8b-8192",
            messages: [
              {
                role: "system",
                content: "You are a professional educational content writer. Create comprehensive, engaging, and informative articles with proper structure. Use HTML tags for formatting (h2, h3, p, ul, li). Make the content unique, valuable, and SEO-optimized."
              },
              {
                role: "user",
                content: `Write a comprehensive article about: ${topic}`
              }
            ],
            max_tokens: 2500,
            temperature: 0.7
          })
        });

        if (!response.ok) {
          throw new Error(`Groq API error: ${response.statusText}`);
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content || "";

        const featuredImage = await this.getImage(topic);

        articles.push({
          title: topic,
          slug: this.generateSlug(topic),
          content,
          excerpt: content.substring(0, 200) + "...",
          metaDescription: content.substring(0, 160),
          category: "Educational",
          source: "Groq AI",
          sourceUrl: null,
          featuredImage,
          tags: ["education", "ai", "guide"],
          isPublished: true,
          publishedAt: new Date(),
        });
      } catch (error) {
        console.error(`Error generating educational content for ${topic}:`, error);
      }
    }

    return articles;
  }

  async generateAllContent(): Promise<void> {
    try {
      const allArticles = [
        ...(await this.generateFromNewsAPI()),
        ...(await this.generateFromGNews()),
        ...(await this.generateFromReddit()),
        ...(await this.generateFromSerpAPI()),
        ...(await this.generateEducationalContent()),
      ];

      for (const article of allArticles) {
        try {
          await db.insert(articles).values(article);
          console.log(`Created article: ${article.title}`);
        } catch (error) {
          console.error(`Error saving article ${article.title}:`, error);
        }
      }
    } catch (error) {
      console.error("Error generating all content:", error);
    }
  }
}

export const contentGenerator = new ContentGenerator();
