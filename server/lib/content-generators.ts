import dotenv from "dotenv";
dotenv.config();

import { db } from "./supabase";
import { articles, type InsertArticle } from "@shared/schema";

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

class ContentGenerator {
  private config: ContentGeneratorConfig;

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
    
    // Add timestamp to ensure uniqueness
    const timestamp = Date.now().toString(36);
    return `${baseSlug}-${timestamp}`;
  }

  private async enhanceWithGroq(content: string, title: string, category: string = ""): Promise<string> {
    try {
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
              content: `You are an expert professional journalist and content writer with 15+ years of experience. Your task is to transform the given content into a comprehensive, highly engaging, and SEO-optimized article that provides maximum value to readers.

CONTENT REQUIREMENTS:
- PRESERVE ALL FACTUAL INFORMATION from the original content
- Maintain all specific details, statistics, quotes, and data points
- Expand on existing information with context and analysis
- Write in a professional yet engaging journalistic style
- Create compelling introductions while preserving original facts
- Add relevant background information without changing core facts
- Include all names, dates, locations, and numbers from original
- Provide expert analysis while keeping original information intact
- Structure content for optimal readability and SEO

FORMATTING REQUIREMENTS:
- Use proper HTML structure with semantic tags
- Create engaging headings that improve readability (h2, h3)
- Format lists for better scanability (ul, li, ol)
- Use strong tags for emphasis on key points
- Add proper paragraph breaks for better flow
- Include relevant subheadings to break up long sections

CONTENT STRUCTURE:
1. Compelling introduction with original context preserved
2. Main content with ALL original details expanded and enhanced
3. Key facts and statistics clearly highlighted
4. Professional conclusion that ties everything together

TARGET LENGTH: 800-1200 words minimum
TONE: Professional, authoritative, yet accessible journalism
FOCUS: Rewrite for better readability while preserving ALL original information`
            },
            {
              role: "user",
              content: `Category: ${category || "General"}
Title: ${title}

Original Content: ${content}

Please rewrite this into a comprehensive, professional article that expands on all key points, provides context and background information, includes expert analysis, and ensures readers get complete understanding of the topic. Make it engaging and informative while maintaining journalistic integrity.`
            }
          ],
          max_tokens: 4000,
          temperature: 0.6
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
      // Fetch from multiple categories for better content variety
      const categories = ['general', 'technology', 'business', 'health', 'science'];
      const allArticles: InsertArticle[] = [];

      for (const category of categories.slice(0, 2)) {
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?category=${category}&language=en&pageSize=10&apiKey=${this.config.newsApiKey}`
        );

        if (!response.ok) {
          console.error(`NewsAPI error for category ${category}:`, response.statusText);
          continue;
        }

        const data = await response.json();

        for (const article of data.articles.slice(0, 2)) {
          if (!article.title || !article.description || article.title.includes('[Removed]')) continue;

          // Fetch full article content from the original URL
          let fullArticleContent = article.description;
          
          try {
            if (article.url) {
              // Try to fetch more content from the original source
              const articleResponse = await fetch(article.url, {
                headers: {
                  'User-Agent': 'Mozilla/5.0 (compatible; AutoBlog/1.0)'
                }
              });
              
              if (articleResponse.ok) {
                const htmlContent = await articleResponse.text();
                // Extract meaningful content from HTML (basic extraction)
                const textContent = htmlContent
                  .replace(/<script[^>]*>.*?<\/script>/gi, '')
                  .replace(/<style[^>]*>.*?<\/style>/gi, '')
                  .replace(/<[^>]*>/g, ' ')
                  .replace(/\s+/g, ' ')
                  .trim();
                
                // Get first 1000 characters of meaningful content
                if (textContent.length > 500) {
                  fullArticleContent = textContent.substring(0, 1000);
                }
              }
            }
          } catch (error) {
            console.log(`Could not fetch full content from ${article.url}`);
          }

          // Combine all available content for better context
          const fullContent = [
            `Title: ${article.title}`,
            `Description: ${article.description}`,
            `Full Content: ${fullArticleContent}`,
            article.content ? `Original Content: ${article.content}` : "",
            `Source: ${article.source?.name || 'Unknown'}`,
            `Published: ${article.publishedAt || 'Unknown'}`,
            article.author ? `Author: ${article.author}` : "",
            `URL: ${article.url || 'Unknown'}`,
          ].filter(Boolean).join('\n\n');

          const enhancedContent = await this.enhanceWithGroq(
            fullContent,
            article.title,
            this.getCategoryFromNewsAPI(category)
          );

          const featuredImage = await this.getImage(article.title + " " + category);

          allArticles.push({
            title: article.title,
            slug: this.generateSlug(article.title),
            content: enhancedContent,
            excerpt: article.description.substring(0, 200) + "...",
            metaDescription: article.description.substring(0, 160),
            category: this.getCategoryFromNewsAPI(category),
            source: "NewsAPI",
            sourceUrl: article.url,
            featuredImage,
            tags: this.generateTags(article.title, category),
            isPublished: true,
            publishedAt: new Date(article.publishedAt || new Date()),
          });
        }
      }

      return allArticles;
    } catch (error) {
      console.error("Error generating from NewsAPI:", error);
      return [];
    }
  }

  private getCategoryFromNewsAPI(apiCategory: string): string {
    const categoryMap: { [key: string]: string } = {
      'general': 'World News',
      'technology': 'Technology',
      'business': 'World News',
      'health': 'Educational',
      'science': 'Educational',
      'sports': 'Trending'
    };
    return categoryMap[apiCategory] || 'World News';
  }

  private generateTags(title: string, category: string): string[] {
    const baseTags = ['news', category.toLowerCase()];
    const titleWords = title.toLowerCase().split(' ');
    
    // Add relevant keywords as tags
    const relevantWords = titleWords.filter(word => 
      word.length > 4 && 
      !['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during'].includes(word)
    ).slice(0, 3);
    
    return [...baseTags, ...relevantWords];
  }

  async generateFromGNews(): Promise<InsertArticle[]> {
    try {
      // Fetch from multiple Indian news topics for comprehensive coverage
      const topics = ['nation', 'business', 'technology', 'sports', 'health'];
      const allArticles: InsertArticle[] = [];

      for (const topic of topics.slice(0, 2)) {
        const response = await fetch(
          `https://gnews.io/api/v4/search?q=${topic}&country=in&lang=en&max=8&apikey=${this.config.gnewsApiKey}`
        );

        if (!response.ok) {
          console.error(`GNews error for topic ${topic}:`, response.statusText);
          continue;
        }

        const data = await response.json();

        for (const article of data.articles.slice(0, 2)) {
          if (!article.title || !article.description) continue;

          // Fetch full article content from the original URL
          let fullArticleContent = article.description;
          
          try {
            if (article.url) {
              const articleResponse = await fetch(article.url, {
                headers: {
                  'User-Agent': 'Mozilla/5.0 (compatible; AutoBlog/1.0)'
                }
              });
              
              if (articleResponse.ok) {
                const htmlContent = await articleResponse.text();
                const textContent = htmlContent
                  .replace(/<script[^>]*>.*?<\/script>/gi, '')
                  .replace(/<style[^>]*>.*?<\/style>/gi, '')
                  .replace(/<[^>]*>/g, ' ')
                  .replace(/\s+/g, ' ')
                  .trim();
                
                if (textContent.length > 500) {
                  fullArticleContent = textContent.substring(0, 1200);
                }
              }
            }
          } catch (error) {
            console.log(`Could not fetch full content from ${article.url}`);
          }

          // Combine comprehensive content from GNews
          const fullContent = [
            `Title: ${article.title}`,
            `Description: ${article.description}`,
            `Full Article Content: ${fullArticleContent}`,
            article.content ? `Original Content: ${article.content}` : "",
            `Published by: ${article.source?.name || 'Unknown Source'}`,
            `Location: India`,
            `Topic: ${topic}`,
            `Published: ${article.publishedAt || 'Unknown'}`,
            article.author ? `Author: ${article.author}` : "",
            `Source URL: ${article.url || 'Unknown'}`,
          ].filter(Boolean).join('\n\n');

          const enhancedContent = await this.enhanceWithGroq(
            fullContent,
            article.title,
            "India News"
          );

          const featuredImage = await this.getImage(article.title + " India news");

          allArticles.push({
            title: article.title,
            slug: this.generateSlug(article.title),
            content: enhancedContent,
            excerpt: article.description.substring(0, 200) + "...",
            metaDescription: article.description.substring(0, 160),
            category: "India News",
            source: "GNews",
            sourceUrl: article.url,
            featuredImage,
            tags: this.generateTagsForIndia(article.title, topic),
            isPublished: true,
            publishedAt: new Date(article.publishedAt || new Date()),
          });
        }
      }

      return allArticles;
    } catch (error) {
      console.error("Error generating from GNews:", error);
      return [];
    }
  }

  private generateTagsForIndia(title: string, topic: string): string[] {
    const baseTags = ['india', 'news', topic];
    const titleWords = title.toLowerCase().split(' ');
    
    // Add Indian context tags
    const indiaKeywords = ['delhi', 'mumbai', 'bangalore', 'chennai', 'kolkata', 'hyderabad', 'modi', 'government', 'bjp', 'congress'];
    const foundIndiaKeywords = titleWords.filter(word => indiaKeywords.includes(word));
    
    const relevantWords = titleWords.filter(word => 
      word.length > 4 && 
      !['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from'].includes(word)
    ).slice(0, 2);
    
    return [...baseTags, ...foundIndiaKeywords, ...relevantWords];
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

      // Fetch from multiple popular subreddits for diverse content
      const subreddits = ['todayilearned', 'technology', 'worldnews', 'science', 'askscience'];
      const allArticles: InsertArticle[] = [];

      for (const subreddit of subreddits.slice(0, 2)) {
        const postsResponse = await fetch(`https://oauth.reddit.com/r/${subreddit}/hot?limit=10`, {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "User-Agent": "AutoBlog/1.0",
          },
        });

        if (!postsResponse.ok) {
          console.error(`Reddit posts error for r/${subreddit}:`, postsResponse.statusText);
          continue;
        }

        const postsData = await postsResponse.json();

        for (const post of postsData.data.children.slice(0, 1)) {
          const postData = post.data;
          if (!postData.title || postData.over_18 || postData.removed_by_category) continue;

          // Combine comprehensive Reddit content
          const fullContent = [
            postData.selftext || postData.title,
            `Subreddit: r/${postData.subreddit}`,
            `Score: ${postData.score} upvotes`,
            `Comments: ${postData.num_comments}`,
            postData.author ? `Posted by: u/${postData.author}` : "",
            postData.link_flair_text ? `Flair: ${postData.link_flair_text}` : "",
          ].filter(Boolean).join('\n\n');

          const enhancedContent = await this.enhanceWithGroq(
            fullContent,
            postData.title,
            this.getCategoryFromSubreddit(postData.subreddit)
          );

          const featuredImage = await this.getImage(postData.title + " " + subreddit);

          allArticles.push({
            title: postData.title,
            slug: this.generateSlug(postData.title),
            content: enhancedContent,
            excerpt: (postData.selftext || postData.title).substring(0, 200) + "...",
            metaDescription: (postData.selftext || postData.title).substring(0, 160),
            category: this.getCategoryFromSubreddit(postData.subreddit),
            source: "Reddit",
            sourceUrl: `https://reddit.com${postData.permalink}`,
            featuredImage,
            tags: this.generateTagsFromReddit(postData.title, postData.subreddit),
            isPublished: true,
            publishedAt: new Date(postData.created_utc * 1000),
          });
        }
      }

      return allArticles;
    } catch (error) {
      console.error("Error generating from Reddit:", error);
      return [];
    }
  }

  private getCategoryFromSubreddit(subreddit: string): string {
    const categoryMap: { [key: string]: string } = {
      'todayilearned': 'Educational',
      'technology': 'Technology',
      'worldnews': 'World News',
      'science': 'Educational',
      'askscience': 'Educational',
      'funny': 'Viral',
      'memes': 'Viral',
      'politics': 'World News'
    };
    return categoryMap[subreddit.toLowerCase()] || 'Trending';
  }

  private generateTagsFromReddit(title: string, subreddit: string): string[] {
    const baseTags = ['reddit', subreddit.toLowerCase(), 'viral'];
    const titleWords = title.toLowerCase().split(' ');
    
    // Add subreddit-specific tags
    const subredditTags: { [key: string]: string[] } = {
      'todayilearned': ['education', 'facts', 'learning'],
      'technology': ['tech', 'innovation', 'digital'],
      'science': ['research', 'discovery', 'facts'],
      'worldnews': ['global', 'politics', 'current-events']
    };
    
    const contextTags = subredditTags[subreddit.toLowerCase()] || ['trending'];
    const relevantWords = titleWords.filter(word => 
      word.length > 4 && 
      !['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from'].includes(word)
    ).slice(0, 2);
    
    return [...baseTags, ...contextTags, ...relevantWords];
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
    const educationalTopics = [
      {
        title: "How to Make Money Online: Complete Guide for 2025",
        keywords: "online earning, digital income, remote work, freelancing",
        category: "Educational"
      },
      {
        title: "What is ChatGPT? Understanding AI Language Models",
        keywords: "artificial intelligence, machine learning, chatbot, language model",
        category: "Technology"
      },
      {
        title: "Who is MrBeast? The YouTube Empire Behind Philanthropic Content",
        keywords: "youtube creator, content creator, philanthropy, viral videos",
        category: "Trending"
      },
      {
        title: "Best AI Tools 2025: Revolutionary Platforms Transforming Industries",
        keywords: "AI tools, automation, productivity, technology trends",
        category: "Technology"
      },
      {
        title: "Digital Marketing Strategies That Actually Work in 2025",
        keywords: "digital marketing, SEO, social media, content marketing",
        category: "Educational"
      },
      {
        title: "Complete Guide to Cryptocurrency Investment for Beginners",
        keywords: "cryptocurrency, bitcoin, investment, blockchain technology",
        category: "Educational"
      }
    ];

    const articles: InsertArticle[] = [];

    for (const topicData of educationalTopics.slice(0, 3)) {
      try {
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
                content: `You are an expert educational content writer and subject matter expert with deep knowledge across multiple domains. Create comprehensive, authoritative, and highly engaging articles that provide exceptional value to readers.

CONTENT REQUIREMENTS:
- Write 1200-1500 words minimum for comprehensive coverage
- Start with compelling introduction that hooks readers immediately
- Provide step-by-step guidance with practical examples
- Include current statistics, trends, and expert insights
- Add actionable tips and real-world applications
- Cover common challenges and solutions
- Conclude with key takeaways and next steps

STRUCTURE REQUIREMENTS:
- Use proper HTML formatting with semantic tags
- Create engaging subheadings (h2, h3) that improve readability
- Format lists for better scanability (ul, li, ol)
- Use strong tags for emphasis on important points
- Include relevant examples and case studies
- Add practical tips in formatted lists

TONE: Professional, authoritative, yet accessible and engaging
TARGET: Comprehensive educational content that establishes expertise and trust`
              },
              {
                role: "user",
                content: `Write a comprehensive educational article about: "${topicData.title}"

Keywords to naturally incorporate: ${topicData.keywords}

Create an in-depth, valuable resource that covers:
1. Complete introduction to the topic
2. Detailed explanations with examples
3. Step-by-step guides where applicable
4. Current trends and statistics
5. Practical tips and best practices
6. Common mistakes to avoid
7. Future outlook and predictions
8. Actionable next steps for readers

Make this the most comprehensive and valuable article on this topic that readers will want to bookmark and share.`
              }
            ],
            max_tokens: 4000,
            temperature: 0.6
          })
        });

        if (!response.ok) {
          throw new Error(`Groq API error: ${response.statusText}`);
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content || "";

        const featuredImage = await this.getImage(topicData.keywords);

        // Generate comprehensive excerpt from content
        const textContent = content.replace(/<[^>]*>/g, '').substring(0, 300);
        const excerpt = textContent + "...";
        const metaDescription = textContent.substring(0, 160);

        articles.push({
          title: topicData.title,
          slug: this.generateSlug(topicData.title),
          content,
          excerpt,
          metaDescription,
          category: topicData.category,
          source: "Groq AI Educational",
          sourceUrl: null,
          featuredImage,
          tags: this.generateEducationalTags(topicData.title, topicData.keywords),
          isPublished: true,
          publishedAt: new Date(),
        });
      } catch (error) {
        console.error(`Error generating educational content for ${topicData.title}:`, error);
      }
    }

    return articles;
  }

  private generateEducationalTags(title: string, keywords: string): string[] {
    const baseTags = ['education', 'guide', 'tutorial'];
    const keywordTags = keywords.split(', ').map(k => k.trim().toLowerCase());
    const titleWords = title.toLowerCase().split(' ').filter(word => 
      word.length > 4 && 
      !['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'complete', 'guide'].includes(word)
    ).slice(0, 2);
    
    return [...baseTags, ...keywordTags.slice(0, 3), ...titleWords];
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
