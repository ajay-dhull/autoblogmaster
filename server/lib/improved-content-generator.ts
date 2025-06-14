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

class ImprovedContentGenerator {
  private config: ContentGeneratorConfig;
  private usedTopics: Set<string> = new Set();

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
              content: `You are a professional journalist writing engaging, comprehensive articles. Transform the provided content into a well-structured, informative article with:

1. Compelling introduction that hooks readers
2. Detailed main content with all original information expanded
3. Expert analysis and context
4. Real-world implications and significance
5. Strong conclusion

TARGET: 1000-1500 words
TONE: Professional yet engaging journalism
FOCUS: Make it valuable and interesting for readers`
            },
            {
              role: "user",
              content: `Category: ${category || "General"}
Title: ${title}

Original Content: ${content}

Transform this into a comprehensive, engaging article that provides real value to readers.`
            }
          ],
          max_tokens: 4000,
          temperature: 0.7
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
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(keywords)}&per_page=1&orientation=landscape`,
        {
          headers: {
            "Authorization": `Client-ID ${this.config.unsplashAccessKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          return data.results[0].urls.regular;
        }
      }

      return "https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=800&h=400&fit=crop";
    } catch (error) {
      return "https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=800&h=400&fit=crop";
    }
  }

  private generateTags(title: string, category: string): string[] {
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'a', 'an'];
    const titleWords = title.toLowerCase().split(' ').filter(word => 
      word.length > 3 && !commonWords.includes(word)
    ).slice(0, 3);
    
    const categoryTags: Record<string, string[]> = {
      'Technology': ['tech', 'innovation', 'digital'],
      'World News': ['global', 'international', 'breaking'],
      'India News': ['india', 'indian', 'regional'],
      'Educational': ['learning', 'education', 'tutorial'],
      'Trending': ['viral', 'popular', 'trending']
    };
    
    return [...titleWords, ...(categoryTags[category] || [])].slice(0, 5);
  }

  async generateFromNewsAPI(): Promise<InsertArticle[]> {
    try {
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?language=en&pageSize=1&sortBy=popularity&apiKey=${this.config.newsApiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`NewsAPI error: ${response.status}`);
      }

      const data = await response.json();
      const articles: InsertArticle[] = [];
      
      if (data.articles && data.articles.length > 0) {
        const apiArticle = data.articles[0];
        
        if (apiArticle.title && apiArticle.description && !apiArticle.title.includes('[Removed]')) {
          const isDuplicate = await this.checkForDuplicate(apiArticle.title);
          
          if (!isDuplicate) {
            const enhancedContent = await this.enhanceWithGroq(
              apiArticle.description + "\n\n" + (apiArticle.content || ""),
              apiArticle.title,
              "World News"
            );
            
            const imageUrl = await this.getImage(apiArticle.title);
            
            const article: InsertArticle = {
              title: apiArticle.title,
              content: enhancedContent,
              excerpt: apiArticle.description || apiArticle.title.substring(0, 200),
              metaDescription: apiArticle.description || apiArticle.title.substring(0, 160),
              slug: this.generateSlug(apiArticle.title),
              category: "World News",
              tags: this.generateTags(apiArticle.title, "World News"),
              featuredImage: imageUrl || apiArticle.urlToImage || "",
              source: "NewsAPI",
              sourceUrl: apiArticle.url || "",
              isPublished: true,
              publishedAt: new Date(apiArticle.publishedAt || new Date()),
            };
            
            articles.push(article);
          }
        }
      }
      
      return articles;
    } catch (error) {
      console.error("NewsAPI generation error:", error);
      return [];
    }
  }

  async generateFromGNews(): Promise<InsertArticle[]> {
    try {
      const response = await fetch(
        `https://gnews.io/api/v4/top-headlines?country=in&max=1&apikey=${this.config.gnewsApiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`GNews error: ${response.status}`);
      }

      const data = await response.json();
      const articles: InsertArticle[] = [];
      
      if (data.articles && data.articles.length > 0) {
        const apiArticle = data.articles[0];
        
        if (apiArticle.title && apiArticle.description) {
          const isDuplicate = await this.checkForDuplicate(apiArticle.title);
          
          if (!isDuplicate) {
            const enhancedContent = await this.enhanceWithGroq(
              apiArticle.description + "\n\n" + (apiArticle.content || ""),
              apiArticle.title,
              "India News"
            );
            
            const imageUrl = await this.getImage(apiArticle.title);
            
            const article: InsertArticle = {
              title: apiArticle.title,
              content: enhancedContent,
              excerpt: apiArticle.description || apiArticle.title.substring(0, 200),
              metaDescription: apiArticle.description || apiArticle.title.substring(0, 160),
              slug: this.generateSlug(apiArticle.title),
              category: "India News",
              tags: this.generateTags(apiArticle.title, "India News"),
              featuredImage: imageUrl || apiArticle.image || "",
              source: "GNews",
              sourceUrl: apiArticle.url || "",
              isPublished: true,
              publishedAt: new Date(apiArticle.publishedAt || new Date()),
            };
            
            articles.push(article);
          }
        }
      }
      
      return articles;
    } catch (error) {
      console.error("GNews generation error:", error);
      return [];
    }
  }

  async generateFromReddit(): Promise<InsertArticle[]> {
    try {
      const subreddits = ['technology', 'todayilearned', 'science'];
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
        throw new Error(`Reddit error: ${response.status}`);
      }

      const data = await response.json();
      const articles: InsertArticle[] = [];
      
      if (data.data && data.data.children && data.data.children.length > 0) {
        const post = data.data.children[0].data;
        
        if (post.title && post.selftext) {
          const isDuplicate = await this.checkForDuplicate(post.title);
          
          if (!isDuplicate) {
            const enhancedContent = await this.enhanceWithGroq(
              post.selftext,
              post.title,
              "Trending"
            );
            
            const imageUrl = await this.getImage(post.title);
            
            const article: InsertArticle = {
              title: post.title,
              content: enhancedContent,
              excerpt: post.selftext.substring(0, 200) + "...",
              metaDescription: post.selftext.substring(0, 160) + "...",
              slug: this.generateSlug(post.title),
              category: "Trending",
              tags: this.generateTags(post.title, "Trending"),
              featuredImage: imageUrl,
              source: "Reddit",
              sourceUrl: `https://reddit.com${post.permalink}`,
              isPublished: true,
              publishedAt: new Date(),
            };
            
            articles.push(article);
          }
        }
      }
      
      return articles;
    } catch (error) {
      console.error("Reddit generation error:", error);
      return [];
    }
  }

  async generateFromSerpAPI(): Promise<InsertArticle[]> {
    try {
      const queries = ['latest technology trends', 'breaking news today', 'trending topics'];
      const randomQuery = queries[Math.floor(Math.random() * queries.length)];
      
      const response = await fetch(
        `https://serpapi.com/search.json?q=${encodeURIComponent(randomQuery)}&tbm=nws&num=1&api_key=${this.config.serpApiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`SerpAPI error: ${response.status}`);
      }

      const data = await response.json();
      const articles: InsertArticle[] = [];
      
      if (data.news_results && data.news_results.length > 0) {
        const result = data.news_results[0];
        
        if (result.title && result.snippet) {
          const isDuplicate = await this.checkForDuplicate(result.title);
          
          if (!isDuplicate) {
            const enhancedContent = await this.enhanceWithGroq(
              result.snippet,
              result.title,
              "World News"
            );
            
            const imageUrl = await this.getImage(result.title);
            
            const article: InsertArticle = {
              title: result.title,
              content: enhancedContent,
              excerpt: result.snippet || result.title.substring(0, 200),
              slug: this.generateSlug(result.title),
              category: "World News",
              tags: this.generateTags(result.title, "World News"),
              featuredImage: imageUrl || result.thumbnail || "",
              source: "SerpAPI",
              sourceUrl: result.link || "",
              isPublished: true,
              publishedAt: new Date(),
            };
            
            articles.push(article);
          }
        }
      }
      
      return articles;
    } catch (error) {
      console.error("SerpAPI generation error:", error);
      return [];
    }
  }

  async generateEducationalContent(): Promise<InsertArticle[]> {
    try {
      if (!this.config.groqApiKey) {
        return [];
      }

      // Diverse, trending educational topics
      const topics = [
        "How to Build Passive Income Streams in 2024",
        "Complete Guide to Cryptocurrency for Beginners",
        "Master Digital Marketing: SEO, Social Media & Content Strategy", 
        "Python Programming: From Zero to Job-Ready in 90 Days",
        "Personal Finance: Budget, Invest, and Build Wealth",
        "AI Tools Every Professional Should Know",
        "Remote Work: Productivity Hacks and Best Practices",
        "E-commerce Business: Start to Scale",
        "Data Science Career Path: Skills and Opportunities",
        "Freelancing Success: Finding Clients and Growing Your Business",
        "Web Development Roadmap: Frontend to Fullstack",
        "Investment Strategies for Young Professionals",
        "Social Media Influence: Build Your Personal Brand",
        "Cloud Computing Fundamentals: AWS, Azure, Google Cloud",
        "Video Content Creation: YouTube, TikTok, Instagram"
      ];

      // Get current date to ensure variety
      const currentHour = new Date().getHours();
      const topicIndex = currentHour % topics.length;
      const selectedTopic = topics[topicIndex];

      // Check if we've used this topic recently
      const isDuplicate = await this.checkForDuplicate(selectedTopic);
      
      if (isDuplicate) {
        return [];
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
              content: `You are an expert educator and content creator. Create a comprehensive, actionable educational article that provides real value. Include:

1. Engaging introduction explaining why this topic matters now
2. Step-by-step practical guide with specific actions
3. Real-world examples and case studies
4. Common mistakes to avoid
5. Resources and next steps
6. Expert tips and insider knowledge

Make it practical, actionable, and valuable for readers looking to improve their skills or income.`
            },
            {
              role: "user",
              content: `Create a detailed educational article about: "${selectedTopic}"

Make it comprehensive (1500+ words), practical, and full of actionable advice that readers can implement immediately. Include specific examples, tools, and strategies.`
            }
          ],
          max_tokens: 4000,
          temperature: 0.8
        })
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        return [];
      }

      const imageUrl = await this.getImage(selectedTopic);
      const excerpt = content.substring(0, 250) + "...";

      const article: InsertArticle = {
        title: selectedTopic,
        content: content,
        excerpt: excerpt,
        slug: this.generateSlug(selectedTopic),
        category: "Educational",
        tags: this.generateTags(selectedTopic, "Educational"),
        featuredImage: imageUrl,
        source: "AI Generated",
        sourceUrl: "",
        isPublished: true,
        publishedAt: new Date(),
      };

      return [article];
    } catch (error) {
      console.error("Educational content generation error:", error);
      return [];
    }
  }

  async generateAllFreshContent(): Promise<void> {
    try {
      console.log("Starting fresh content generation...");
      
      // Generate one article from each source
      const [newsApiArticles, gnewsArticles, redditArticles, serpApiArticles, educationalArticles] = await Promise.all([
        this.generateFromNewsAPI(),
        this.generateFromGNews(), 
        this.generateFromReddit(),
        this.generateFromSerpAPI(),
        this.generateEducationalContent()
      ]);

      const allArticles = [
        ...newsApiArticles,
        ...gnewsArticles, 
        ...redditArticles,
        ...serpApiArticles,
        ...educationalArticles
      ];

      console.log(`Generated ${allArticles.length} fresh articles`);

      // Save articles to database
      for (const article of allArticles) {
        try {
          await db.insert(articles).values({
            ...article,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          console.log(`Saved article: ${article.title}`);
        } catch (error) {
          console.error(`Error saving article "${article.title}":`, error);
        }
      }

      console.log("Fresh content generation completed");
    } catch (error) {
      console.error("Error in generateAllFreshContent:", error);
    }
  }
}

export const improvedContentGenerator = new ImprovedContentGenerator();