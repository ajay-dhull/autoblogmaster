import dotenv from "dotenv";
dotenv.config();

import { db } from "./supabase";
import { articles, type InsertArticle } from "@shared/schema";
import { lt, sql } from "drizzle-orm";

interface ContentGeneratorConfig {
  newsApiKey: string;
  gnewsApiKey: string;
  redditClientId: string;
  redditClientSecret: string;
  serpApiKey: string;
  serpApiKey2: string;
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
      serpApiKey2: process.env.SERPAPI_KEY_2 || "",
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

  private async makeSerpAPIRequest(url: string): Promise<Response> {
    // Try first API key
    const urlWithKey1 = `${url}&api_key=${this.config.serpApiKey}`;
    console.log("Trying SerpAPI with primary key...");
    
    try {
      const response1 = await fetch(urlWithKey1);
      
      // If successful (status 200), return the response
      if (response1.ok) {
        console.log("Primary SerpAPI key worked successfully");
        return response1;
      }
      
      // If we get 403 or other limit-related errors, try second key
      if (response1.status === 403 || response1.status === 429) {
        console.log("Primary SerpAPI key limit reached, trying backup key...");
        
        const urlWithKey2 = `${url}&api_key=${this.config.serpApiKey2}`;
        const response2 = await fetch(urlWithKey2);
        
        if (response2.ok) {
          console.log("Backup SerpAPI key worked successfully");
          return response2;
        } else {
          console.error("Both SerpAPI keys failed");
          throw new Error(`Both SerpAPI keys failed. Primary: ${response1.status}, Backup: ${response2.status}`);
        }
      }
      
      // For other errors, just return the first response
      return response1;
      
    } catch (error) {
      console.error("Error with primary SerpAPI key, trying backup...");
      
      // Fallback to second key on any network error
      const urlWithKey2 = `${url}&api_key=${this.config.serpApiKey2}`;
      const response2 = await fetch(urlWithKey2);
      
      if (response2.ok) {
        console.log("Backup SerpAPI key worked after primary failed");
        return response2;
      } else {
        throw new Error(`Both SerpAPI keys failed due to network/other errors`);
      }
    }
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

      // Special handling for India News to ensure Hindi language
      const isIndiaNews = category === "India News";
      const languageInstruction = isIndiaNews ? 
        "CRITICAL: Write ONLY in pure, standard Hindi using Devanagari script. STRICTLY AVOID Marathi words. Use common Hindi words like: 'के लिए' (not 'साठी'), 'की तरह' (not 'सारखे'), 'में' (not 'मध्ये'), 'से' (not 'पासून'), 'और' (not 'आणि'), 'है' (not 'आहे'). Write for all Hindi speakers across India, not regional audiences." : 
        "Write in clear, simple English that is easy to read and understand.";

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
- PRESERVE ALL FACTUAL INFORMATION from the original content exactly as provided
- Maintain all specific details, statistics, quotes, and data points
- Expand content to 1200-1800 words with rich, informative details
- Create compelling, SEO-friendly headlines and subheadings
- Use proper HTML structure with semantic tags (h2, h3, p, ul, li, strong)
- Write in professional journalistic style that's engaging and accessible
- Include relevant background context and expert analysis
- Structure content for optimal readability and SEO performance
- ${languageInstruction}

FORMATTING STRUCTURE (MANDATORY):
1. Always start with <h1>Main Title</h1>
2. Use <h2>Section Headers</h2> for major sections (minimum 3-4 sections)
3. Use <h3>Sub-headers</h3> for subsections
4. Wrap all paragraphs in <p> tags
5. Use <strong>text</strong> for important highlights
6. Create <ul><li>bullet points</li></ul> for lists
7. Use <blockquote> for quotes if any
8. End with compelling conclusion in <p> tags

CRITICAL: EVERY article must follow this HTML structure exactly. No plain text articles allowed.
TARGET: 1200-1800 words, fully SEO optimized, professional journalism quality
TONE: Authoritative yet accessible, engaging and informative
IMPORTANT: Keep all original facts and information unchanged`
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
      // Create category-specific search terms for better image diversity
      const keywordVariations = [
        keywords,
        keywords.split(' ')[0],
        keywords.includes('technology') ? 'artificial intelligence' : 'global news',
        keywords.includes('business') ? 'finance market' : 'world events',
        keywords.includes('education') ? 'learning development' : 'breaking news'
      ];

      // Try multiple search attempts with different terms
      for (const searchTerm of keywordVariations) {
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchTerm)}&per_page=10&orientation=landscape&order_by=relevant`,
          {
            headers: {
              "Authorization": `Client-ID ${this.config.unsplashAccessKey}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.results && data.results.length > 0) {
            // Use timestamp to ensure different images for each article
            const timeBasedIndex = (Date.now() + Math.random() * 1000) % data.results.length;
            const selectedIndex = Math.floor(timeBasedIndex);
            return data.results[selectedIndex].urls.regular;
          }
        }
        
        // Add delay between API calls to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Category-specific diverse fallback images with timestamp-based selection
      const categoryImages: Record<string, string[]> = {
        technology: [
          "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop",
          "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=400&fit=crop",
          "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop"
        ],
        business: [
          "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop",
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
          "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=400&fit=crop"
        ],
        news: [
          "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop",
          "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&h=400&fit=crop",
          "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop"
        ],
        education: [
          "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop",
          "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=400&fit=crop",
          "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=400&fit=crop"
        ]
      };

      // Determine category from keywords
      let category: keyof typeof categoryImages = 'news';
      if (keywords.toLowerCase().includes('tech') || keywords.toLowerCase().includes('ai')) category = 'technology';
      if (keywords.toLowerCase().includes('business') || keywords.toLowerCase().includes('market')) category = 'business';
      if (keywords.toLowerCase().includes('education') || keywords.toLowerCase().includes('learn')) category = 'education';

      const images = categoryImages[category] || categoryImages.news;
      const timeBasedIndex = (Date.now() + Math.random() * 1000) % images.length;
      return images[Math.floor(timeBasedIndex)];

    } catch (error) {
      // Fallback with timestamp-based selection
      const emergencyFallbacks = [
        "https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=800&h=400&fit=crop",
        "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop",
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop",
        "https://images.unsplash.com/photo-1444653614773-995cb1ef5bce?w=800&h=400&fit=crop",
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop"
      ];
      const timeBasedIndex = (Date.now() + Math.random() * 1000) % emergencyFallbacks.length;
      return emergencyFallbacks[Math.floor(timeBasedIndex)];
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
      console.log("Starting NewsAPI content generation - 3 different topics per day...");
      
      // 3 different categories for world news coverage
      const categories = ['general', 'technology', 'business'];
      const countries = ['us', 'gb', 'ca']; // Different countries for variety
      const articles: InsertArticle[] = [];

      for (let i = 0; i < 3; i++) {
        const category = categories[i];
        const country = countries[i % countries.length];
        
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?category=${category}&country=${country}&language=en&pageSize=5&apiKey=${this.config.newsApiKey}`
        );

        if (!response.ok) {
          console.error(`NewsAPI error for ${category}:`, response.statusText);
          continue;
        }

        const data = await response.json();
        
        if (data.articles && data.articles.length > 0) {
          // Try multiple articles from this category to find a non-duplicate
          for (const apiArticle of data.articles) {
            if (apiArticle.title && apiArticle.description && !apiArticle.title.includes('[Removed]')) {
              const isDuplicate = await this.checkForDuplicate(apiArticle.title);
              
              if (!isDuplicate) {
                const fullContent = `${apiArticle.description}\n\n${apiArticle.content || ''}`;
                const enhancedContent = await this.enhanceWithGroq(
                  fullContent,
                  apiArticle.title,
                  "World News"
                );
                
                const imageUrl = await this.getImage(apiArticle.title + " news");
                
                const article: InsertArticle = {
                  title: apiArticle.title,
                  content: enhancedContent,
                  excerpt: apiArticle.description?.substring(0, 200) + "..." || "",
                  metaDescription: apiArticle.description?.substring(0, 160) || "",
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
                console.log(`Generated NewsAPI article (${category}): ${apiArticle.title}`);
                break; // Move to next category after finding one valid article
              }
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

  async generateFromGNews(): Promise<InsertArticle[]> {
    try {
      console.log("Starting GNews content generation - 2-3 latest India news (Hindi/English)...");
      
      // Different trending topics for India coverage
      const indiaTopics = [
        'india breaking news',
        'india trending today',
        'indian politics latest'
      ];
      const articles: InsertArticle[] = [];

      for (const topic of indiaTopics) {
        const response = await fetch(
          `https://gnews.io/api/v4/search?q=${encodeURIComponent(topic)}&country=in&max=5&token=${this.config.gnewsApiKey}`
        );

        if (!response.ok) {
          console.error(`GNews error for ${topic}:`, response.statusText);
          continue;
        }

        const data = await response.json();
        
        if (data.articles && data.articles.length > 0) {
          // Try multiple articles from this topic to find a non-duplicate
          for (const apiArticle of data.articles) {
            if (apiArticle.title && apiArticle.description) {
              const isDuplicate = await this.checkForDuplicate(apiArticle.title);
              
              if (!isDuplicate) {
                const enhancedContent = await this.enhanceWithGroq(
                  apiArticle.description + "\n\n" + (apiArticle.content || ""),
                  apiArticle.title,
                  "India News"
                );
                
                const imageUrl = await this.getImage(apiArticle.title + " india");
                
                const article: InsertArticle = {
                  title: apiArticle.title,
                  content: enhancedContent,
                  excerpt: apiArticle.description?.substring(0, 200) + "..." || "",
                  metaDescription: apiArticle.description?.substring(0, 160) || "",
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
                console.log(`Generated GNews article (${topic}): ${apiArticle.title}`);
                break; // Move to next topic after finding one valid article
              }
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
      console.log("Starting SerpAPI content generation - 3 articles per day (world news, AI tech, trending topics)...");
      
      const searchQueries = [
        'world breaking news today',
        'artificial intelligence technology news latest',
        'trending tech innovations 2024'
      ];
      const articles: InsertArticle[] = [];

      for (const query of searchQueries) {
        const response = await this.makeSerpAPIRequest(
          `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&tbm=nws&num=3`
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`SerpAPI error for ${query}:`, response.status, errorText);
          continue;
        }

        const data = await response.json();
        
        if (data.news_results && data.news_results.length > 0) {
          // Try multiple results to find a non-duplicate
          for (const result of data.news_results) {
            if (result.title && result.snippet) {
              const isDuplicate = await this.checkForDuplicate(result.title);
              
              if (!isDuplicate) {
                // Ensure we have substantial content to enhance
                const contentToEnhance = result.snippet && result.snippet.length > 50 
                  ? result.snippet 
                  : `${result.title}. This is a breaking news story that requires detailed coverage and analysis.`;
                
                const enhancedContent = await this.enhanceWithGroq(
                  contentToEnhance,
                  result.title,
                  "Technology"
                );
                
                // Fallback content if Groq fails
                const finalContent = enhancedContent && enhancedContent.length > 200 
                  ? enhancedContent 
                  : `<h1>${result.title}</h1><p>${contentToEnhance}</p><p>This story is developing and more details will be added as they become available.</p>`;
                
                const imageUrl = await this.getImage(result.title + " technology");
                
                const article: InsertArticle = {
                  title: result.title,
                  content: finalContent,
                  excerpt: result.snippet?.substring(0, 200) + "..." || result.title.substring(0, 200) + "...",
                  metaDescription: result.snippet?.substring(0, 160) || result.title.substring(0, 160),
                  slug: this.generateSlug(result.title),
                  category: "Technology",
                  tags: this.generateTags(result.title, "Technology"),
                  featuredImage: imageUrl || result.thumbnail || "",
                  source: "SerpAPI",
                  sourceUrl: result.link || "",
                  isPublished: true,
                  publishedAt: new Date(),
                };
                
                articles.push(article);
                console.log(`Generated SerpAPI article (${query}): ${result.title}`);
                break; // Move to next query after finding one valid article
              }
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
        metaDescription: excerpt.substring(0, 160),
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

  async deleteOldArticles(): Promise<void> {
    try {
      // Delete articles older than 2 months (60 days)
      const twoMonthsAgo = new Date();
      twoMonthsAgo.setDate(twoMonthsAgo.getDate() - 60);
      
      const deletedArticles = await db
        .delete(articles)
        .where(lt(articles.createdAt, twoMonthsAgo))
        .returning({ id: articles.id, title: articles.title });
      
      if (deletedArticles.length > 0) {
        console.log(`🗑️ Deleted ${deletedArticles.length} articles older than 2 months:`);
        deletedArticles.forEach(article => {
          console.log(`  - ${article.title} (ID: ${article.id})`);
        });
      } else {
        console.log("✅ No old articles to delete (all articles are less than 2 months old)");
      }
    } catch (error) {
      console.error("❌ Error deleting old articles:", error);
    }
  }

  async generateAllFreshContent(): Promise<void> {
    try {
      console.log("Starting fresh content generation...");
      
      // First, delete old articles (1+ month old)
      await this.deleteOldArticles();
      
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