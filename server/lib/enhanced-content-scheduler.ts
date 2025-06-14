import { db } from "./supabase";
import { articles, type InsertArticle } from "@shared/schema";
import { sql } from "drizzle-orm";

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

class EnhancedContentScheduler {
  private config: ContentGeneratorConfig;
  private usedTopics: Set<string> = new Set();
  private generatedToday: Set<string> = new Set();

  constructor() {
    this.config = {
      newsApiKey: process.env.NEWS_API_KEY || "",
      gnewsApiKey: process.env.GNEWS_API_KEY || "",
      redditClientId: process.env.REDDIT_CLIENT_ID || "",
      redditClientSecret: process.env.REDDIT_CLIENT_SECRET || "",
      serpApiKey: process.env.SERP_API_KEY || "",
      groqApiKey: process.env.GROQ_API_KEY || "",
      unsplashAccessKey: process.env.UNSPLASH_ACCESS_KEY || "",
      pexelsApiKey: process.env.PEXELS_API_KEY || "",
    };
  }

  private generateSlug(title: string): string {
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    
    const timestamp = Date.now().toString(36);
    return `${baseSlug}-${timestamp}`;
  }

  private async checkForDuplicate(title: string): Promise<boolean> {
    try {
      const titleWords = title.toLowerCase().split(' ').slice(0, 4).join(' ');
      const existing = await db.select().from(articles).where(
        sql`LOWER(title) LIKE ${`%${titleWords}%`}`
      ).limit(1);
      
      return existing.length > 0;
    } catch (error) {
      console.error("Error checking duplicates:", error);
      return false;
    }
  }

  private async enhanceWithGroq(content: string, title: string, category: string = ""): Promise<string> {
    try {
      if (!this.config.groqApiKey) {
        return content;
      }

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.config.groqApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [
            {
              role: "system",
              content: `You are a professional SEO content writer and journalist with expertise in creating engaging, comprehensive articles. Transform the provided content into a well-structured, SEO-optimized article that provides maximum value to readers.

REQUIREMENTS:
- PRESERVE ALL FACTUAL INFORMATION from the original content
- Maintain all specific details, statistics, quotes, and data points exactly as provided
- Expand content to 1200-1800 words with rich, informative details
- Create compelling, SEO-friendly headlines and subheadings
- Use proper HTML structure with semantic tags (h2, h3, p, ul, li, strong)
- Write in professional journalistic style that's engaging and accessible
- Include relevant background context and expert analysis
- Structure content for optimal readability and SEO performance

FORMATTING STRUCTURE:
1. Compelling introduction that hooks readers immediately
2. Well-organized main content with logical flow using H2 and H3 headings
3. Key facts and statistics clearly highlighted with strong tags
4. Bullet points or numbered lists where appropriate
5. Expert analysis and implications explained in detail
6. Strong conclusion that summarizes key takeaways

TARGET: 1200-1800 words, fully SEO optimized, professional journalism quality
TONE: Authoritative yet accessible, engaging and informative`
            },
            {
              role: "user",
              content: `Category: ${category || "General"}
Title: ${title}

Original Content: ${content}

Transform this into a comprehensive, SEO-optimized article that expands on all key points, provides expert analysis, and ensures readers get complete understanding while preserving all original facts and information.`
            }
          ],
          max_tokens: 4000,
          temperature: 0.6
        })
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || content;
    } catch (error) {
      console.error("Error enhancing content:", error);
      return content;
    }
  }

  private async getImage(keywords: string): Promise<string> {
    try {
      // Try Unsplash first
      if (this.config.unsplashAccessKey) {
        const unsplashResponse = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(keywords)}&per_page=1&orientation=landscape`,
          {
            headers: {
              "Authorization": `Client-ID ${this.config.unsplashAccessKey}`,
            },
          }
        );

        if (unsplashResponse.ok) {
          const data = await unsplashResponse.json();
          if (data.results && data.results.length > 0) {
            return data.results[0].urls.regular;
          }
        }
      }

      // Fallback to Pexels
      if (this.config.pexelsApiKey) {
        const pexelsResponse = await fetch(
          `https://api.pexels.com/v1/search?query=${encodeURIComponent(keywords)}&per_page=1&orientation=landscape`,
          {
            headers: {
              "Authorization": this.config.pexelsApiKey,
            },
          }
        );

        if (pexelsResponse.ok) {
          const data = await pexelsResponse.json();
          if (data.photos && data.photos.length > 0) {
            return data.photos[0].src.large;
          }
        }
      }

      return "https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=800&h=400&fit=crop";
    } catch (error) {
      console.error("Error fetching image:", error);
      return "https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=800&h=400&fit=crop";
    }
  }

  private generateTags(title: string, category: string): string[] {
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'a', 'an'];
    const titleWords = title.toLowerCase().split(' ').filter(word => 
      word.length > 3 && !commonWords.includes(word)
    ).slice(0, 3);
    
    const categoryTags: Record<string, string[]> = {
      'Technology': ['tech', 'innovation', 'digital', 'ai', 'software'],
      'World News': ['global', 'international', 'breaking', 'news', 'world'],
      'India News': ['india', 'indian', 'regional', 'delhi', 'mumbai'],
      'Educational': ['learning', 'education', 'tutorial', 'guide', 'tips'],
      'Trending': ['viral', 'popular', 'trending', 'hot', 'latest']
    };
    
    return [...titleWords, ...(categoryTags[category] || [])].slice(0, 5);
  }

  // NewsAPI: 3 topics per day, all different, latest world news
  async generateFromNewsAPI(): Promise<InsertArticle[]> {
    try {
      console.log("Starting NewsAPI content generation...");
      
      const categories = ['general', 'technology', 'business'];
      const countries = ['us', 'gb', 'ca'];
      const articles: InsertArticle[] = [];

      for (let i = 0; i < 3; i++) {
        const category = categories[i % categories.length];
        const country = countries[i % countries.length];
        
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?category=${category}&country=${country}&language=en&pageSize=1&apiKey=${this.config.newsApiKey}`
        );

        if (!response.ok) {
          console.error(`NewsAPI error for ${category}:`, response.statusText);
          continue;
        }

        const data = await response.json();
        
        if (data.articles && data.articles.length > 0) {
          const article = data.articles[0];
          
          if (article.title && article.description && !article.title.includes('[Removed]')) {
            const isDuplicate = await this.checkForDuplicate(article.title);
            
            if (!isDuplicate) {
              const fullContent = `${article.description}\n\n${article.content || ''}`;
              const enhancedContent = await this.enhanceWithGroq(
                fullContent,
                article.title,
                "World News"
              );
              
              const imageUrl = await this.getImage(article.title + " news");
              
              articles.push({
                title: article.title,
                content: enhancedContent,
                excerpt: article.description?.substring(0, 200) + "..." || "",
                metaDescription: article.description?.substring(0, 160) || "",
                slug: this.generateSlug(article.title),
                category: "World News",
                tags: this.generateTags(article.title, "World News"),
                featuredImage: imageUrl || article.urlToImage || "",
                source: "NewsAPI",
                sourceUrl: article.url || "",
                isPublished: true,
                publishedAt: new Date(),
              });
              
              console.log(`Generated NewsAPI article: ${article.title}`);
            }
          }
        }
      }
      
      return articles;
    } catch (error) {
      console.error("NewsAPI generation error:", error);
      return [];
    }
  }

  // GNews: 2-3 latest India news (Hindi/English based on trends)
  async generateFromGNews(): Promise<InsertArticle[]> {
    try {
      console.log("Starting GNews India content generation...");
      
      const topics = ['india breaking news', 'india trending', 'india politics'];
      const articles: InsertArticle[] = [];

      for (let i = 0; i < 3; i++) {
        const topic = topics[i % topics.length];
        
        const response = await fetch(
          `https://gnews.io/api/v4/search?q=${encodeURIComponent(topic)}&country=in&max=1&apikey=${this.config.gnewsApiKey}`
        );

        if (!response.ok) {
          console.error(`GNews error for ${topic}:`, response.statusText);
          continue;
        }

        const data = await response.json();
        
        if (data.articles && data.articles.length > 0) {
          const article = data.articles[0];
          
          if (article.title && article.description) {
            const isDuplicate = await this.checkForDuplicate(article.title);
            
            if (!isDuplicate) {
              const enhancedContent = await this.enhanceWithGroq(
                article.description + "\n\n" + (article.content || ""),
                article.title,
                "India News"
              );
              
              const imageUrl = await this.getImage(article.title + " india");
              
              articles.push({
                title: article.title,
                content: enhancedContent,
                excerpt: article.description?.substring(0, 200) + "..." || "",
                metaDescription: article.description?.substring(0, 160) || "",
                slug: this.generateSlug(article.title),
                category: "India News",
                tags: this.generateTags(article.title, "India News"),
                featuredImage: imageUrl || article.image || "",
                source: "GNews",
                sourceUrl: article.url || "",
                isPublished: true,
                publishedAt: new Date(),
              });
              
              console.log(`Generated GNews article: ${article.title}`);
            }
          }
        }
      }
      
      return articles;
    } catch (error) {
      console.error("GNews generation error:", error);
      return [];
    }
  }

  // Reddit: 1 trending topic per day
  async generateFromReddit(): Promise<InsertArticle[]> {
    try {
      console.log("Starting Reddit content generation...");
      
      const subreddits = ['worldnews', 'technology', 'todayilearned', 'science'];
      const randomSubreddit = subreddits[Math.floor(Math.random() * subreddits.length)];
      
      const response = await fetch(
        `https://www.reddit.com/r/${randomSubreddit}/hot.json?limit=1`,
        {
          headers: {
            'User-Agent': 'AutoBlog/1.0'
          }
        }
      );

      if (!response.ok) {
        console.error(`Reddit error:`, response.statusText);
        return [];
      }

      const data = await response.json();
      const articles: InsertArticle[] = [];
      
      if (data.data && data.data.children && data.data.children.length > 0) {
        const post = data.data.children[0].data;
        
        if (post.title && (post.selftext || post.url)) {
          const isDuplicate = await this.checkForDuplicate(post.title);
          
          if (!isDuplicate) {
            const content = post.selftext || `Original post: ${post.url}`;
            const enhancedContent = await this.enhanceWithGroq(
              content,
              post.title,
              "Trending"
            );
            
            const imageUrl = await this.getImage(post.title + " reddit trending");
            
            articles.push({
              title: post.title,
              content: enhancedContent,
              excerpt: content.substring(0, 200) + "...",
              metaDescription: content.substring(0, 160),
              slug: this.generateSlug(post.title),
              category: "Trending",
              tags: this.generateTags(post.title, "Trending"),
              featuredImage: imageUrl,
              source: "Reddit",
              sourceUrl: `https://reddit.com${post.permalink}`,
              isPublished: true,
              publishedAt: new Date(),
            });
            
            console.log(`Generated Reddit article: ${post.title}`);
          }
        }
      }
      
      return articles;
    } catch (error) {
      console.error("Reddit generation error:", error);
      return [];
    }
  }

  // SerpAPI: 3 articles per day (world big news, AI & tech news, trending topics)
  async generateFromSerpAPI(): Promise<InsertArticle[]> {
    try {
      console.log("Starting SerpAPI content generation...");
      
      const searchQueries = [
        'world breaking news today',
        'artificial intelligence technology news',
        'trending tech innovations 2024'
      ];
      const articles: InsertArticle[] = [];

      for (const query of searchQueries) {
        const response = await fetch(
          `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(query)}&api_key=${this.config.serpApiKey}&num=1`
        );

        if (!response.ok) {
          console.error(`SerpAPI error for ${query}:`, response.statusText);
          continue;
        }

        const data = await response.json();
        
        if (data.organic_results && data.organic_results.length > 0) {
          const result = data.organic_results[0];
          
          if (result.title && result.snippet) {
            const isDuplicate = await this.checkForDuplicate(result.title);
            
            if (!isDuplicate) {
              const enhancedContent = await this.enhanceWithGroq(
                result.snippet,
                result.title,
                "Technology"
              );
              
              const imageUrl = await this.getImage(result.title + " technology");
              
              articles.push({
                title: result.title,
                content: enhancedContent,
                excerpt: result.snippet?.substring(0, 200) + "..." || "",
                metaDescription: result.snippet?.substring(0, 160) || "",
                slug: this.generateSlug(result.title),
                category: "Technology",
                tags: this.generateTags(result.title, "Technology"),
                featuredImage: imageUrl,
                source: "SerpAPI",
                sourceUrl: result.link || "",
                isPublished: true,
                publishedAt: new Date(),
              });
              
              console.log(`Generated SerpAPI article: ${result.title}`);
            }
          }
        }
      }
      
      return articles;
    } catch (error) {
      console.error("SerpAPI generation error:", error);
      return [];
    }
  }

  // Educational content generation
  async generateEducationalContent(): Promise<InsertArticle[]> {
    try {
      console.log("Starting Educational content generation...");
      
      const educationalTopics = [
        {
          title: "Complete Guide to Machine Learning in 2024",
          keywords: "machine learning tutorial guide 2024",
          category: "Educational"
        },
        {
          title: "Digital Marketing Strategies for Small Businesses",
          keywords: "digital marketing strategies small business",
          category: "Educational"
        }
      ];

      const articles: InsertArticle[] = [];

      for (const topicData of educationalTopics.slice(0, 1)) {
        const enhancedContent = await this.enhanceWithGroq(
          `Comprehensive guide about ${topicData.title}. This should cover all essential aspects, practical tips, step-by-step instructions, and real-world examples.`,
          topicData.title,
          topicData.category
        );

        const imageUrl = await this.getImage(topicData.keywords);

        articles.push({
          title: topicData.title,
          content: enhancedContent,
          excerpt: `Comprehensive guide covering everything you need to know about ${topicData.title.toLowerCase()}.`,
          metaDescription: `Learn ${topicData.title.toLowerCase()} with our comprehensive guide. Step-by-step instructions and practical tips included.`,
          slug: this.generateSlug(topicData.title),
          category: topicData.category,
          tags: this.generateTags(topicData.title, topicData.category),
          featuredImage: imageUrl,
          source: "Educational AI",
          sourceUrl: "",
          isPublished: true,
          publishedAt: new Date(),
        });
        
        console.log(`Generated Educational article: ${topicData.title}`);
      }

      return articles;
    } catch (error) {
      console.error("Educational content generation error:", error);
      return [];
    }
  }

  async saveArticles(articles: InsertArticle[]): Promise<void> {
    try {
      if (articles.length === 0) {
        console.log("No articles to save");
        return;
      }

      for (const article of articles) {
        await db.insert(articles).values({
          ...article,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log(`Saved article: ${article.title}`);
      }
    } catch (error) {
      console.error("Error saving articles:", error);
    }
  }

  async generateAllContent(): Promise<void> {
    console.log("Starting comprehensive content generation...");
    
    try {
      // Generate content from all sources
      const [newsApiArticles, gnewsArticles, redditArticles, serpApiArticles, educationalArticles] = await Promise.all([
        this.generateFromNewsAPI(),
        this.generateFromGNews(),
        this.generateFromReddit(),
        this.generateFromSerpAPI(),
        this.generateEducationalContent()
      ]);

      // Combine all articles
      const allArticles = [
        ...newsApiArticles,
        ...gnewsArticles,
        ...redditArticles,
        ...serpApiArticles,
        ...educationalArticles
      ];

      console.log(`Generated ${allArticles.length} articles total`);

      // Save all articles to database
      await this.saveArticles(allArticles);
      
      console.log("Content generation completed successfully!");
    } catch (error) {
      console.error("Error in generateAllContent:", error);
    }
  }
}

export const enhancedContentScheduler = new EnhancedContentScheduler();