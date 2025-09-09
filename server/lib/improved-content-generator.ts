// Load environment variables from .env file
import * as fs from 'fs';
import * as path from 'path';

// Custom .env loader for better compatibility
const loadEnvFile = () => {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');

    envContent.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#') && trimmedLine.includes('=')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        const value = valueParts.join('=');
        if (key && value) {
          process.env[key.trim()] = value.trim();
        }
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log('Warning: Could not load .env file:', error.message);
    } else {
      console.log('Warning: Could not load .env file:', error);
    }
  }
};

loadEnvFile();

import { db } from "./supabase";
import { articles, type InsertArticle } from "@shared/schema";
import { lt, sql, eq } from "drizzle-orm";

interface ContentGeneratorConfig {
  newsApiKey: string;
  gnewsApiKey: string;
  redditClientId: string;
  redditClientSecret: string;
  serpApiKey: string;
  serpApiKey2: string;
  groqApiKey: string;
  groqApiKey2: string;
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
      groqApiKey2: process.env.GROQ_API_KEY_2 || "",
      unsplashAccessKey: process.env.UNSPLASH_ACCESS_KEY || "",
      pexelsApiKey: process.env.PEXELS_API_KEY || "",
    };

    console.log("Content generator initialized with working API keys");
    console.log("Environment check - NODE_ENV:", process.env.NODE_ENV);
    console.log("Environment check - CWD:", process.cwd());
    console.log("NewsAPI Key loaded:", this.config.newsApiKey ? `${this.config.newsApiKey.substring(0, 10)}...` : "NOT FOUND");
    console.log("GNews Key loaded:", this.config.gnewsApiKey ? `${this.config.gnewsApiKey.substring(0, 10)}...` : "NOT FOUND");
    console.log("SerpAPI Key 1 loaded:", this.config.serpApiKey ? `${this.config.serpApiKey.substring(0, 15)}...` : "NOT FOUND");
    console.log("SerpAPI Key 2 loaded:", this.config.serpApiKey2 ? `${this.config.serpApiKey2.substring(0, 15)}...` : "NOT FOUND");
    console.log("Groq API Key 1 loaded:", this.config.groqApiKey ? `${this.config.groqApiKey.substring(0, 15)}...` : "NOT FOUND");
    console.log("Groq API Key 2 loaded:", this.config.groqApiKey2 ? `${this.config.groqApiKey2.substring(0, 15)}...` : "NOT FOUND");
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

  // SIMPLE duplicate check using DB (no embeddings)
  private async checkForDuplicate(title: string, contentSnippet?: string): Promise<boolean> {
    try {
      const normalizedTitle = title.trim().toLowerCase();

      // 1) Exact title match
      const exact = await db.select().from(articles).where(sql`LOWER(title) = ${normalizedTitle}`).limit(1);
      if (exact.length > 0) return true;

      // 2) Partial match - first 6 words
      const titleWords = normalizedTitle.split(/\s+/).slice(0, 6).join(' ');
      const partial = await db.select().from(articles).where(sql`LOWER(title) LIKE ${`%${titleWords}%`}`).limit(1);
      if (partial.length > 0) return true;

      // 3) Snippet match if provided
      if (contentSnippet && contentSnippet.length > 50) {
        const snippet = contentSnippet.toLowerCase().slice(0, 120);
        const snippetMatch = await db.select().from(articles).where(sql`LOWER(content) LIKE ${`%${snippet}%`}`).limit(1);
        if (snippetMatch.length > 0) return true;
      }

      return false;
    } catch (error) {
      console.error("Error checking duplicates:", error);
      // On error, consider not duplicate so we don't block content generation
      return false;
    }
  }

  // ✅ FIXED: Enhanced error logging for better debugging
  private async makeGroqAPIRequest(url: string, body: any): Promise<Response> {
    // Try primary Groq API key first
    try {
      console.log("Trying Groq with primary key...");
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.config.groqApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
      });

      // ✅ FIXED: Added detailed error logging for debugging
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Groq API Error Response:");
        console.error("Status:", response.status);
        console.error("Status Text:", response.statusText);
        console.error("Error Body:", errorText);
        
        // Try to parse error JSON if possible
        try {
          const errorJson = JSON.parse(errorText);
          console.error("Parsed Error:", errorJson);
        } catch (parseError) {
          console.error("Could not parse error response as JSON");
        }
      }

      if (response.ok) {
        console.log("Primary Groq key worked successfully");
        return response;
      }

      if (response.status === 429 || response.status === 401 || response.status === 400) {
        console.log("Primary Groq key error, trying backup key...");
        throw new Error(`Primary Groq API error: ${response.status}`);
      }

      return response;
    } catch (error) {
      console.error("❌ Primary Groq API request failed:", error);
      
      // Try backup Groq API key
      if (this.config.groqApiKey2) {
        console.log("Using backup Groq API key...");
        try {
          const backupResponse = await fetch(url, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${this.config.groqApiKey2}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
          });

          if (!backupResponse.ok) {
            const backupErrorText = await backupResponse.text();
            console.error("❌ Backup Groq API Error Response:");
            console.error("Status:", backupResponse.status);
            console.error("Error Body:", backupErrorText);
          }

          if (backupResponse.ok) {
            console.log("Backup Groq key worked successfully");
            return backupResponse;
          }
        } catch (backupError) {
          console.error("❌ Backup Groq API request also failed:", backupError);
        }
      }

      throw error;
    }
  }

  private async enhanceWithGroq(content: string, title: string, category: string = ""): Promise<string> {
    try {
      if (!this.config.groqApiKey) {
        console.log("No Groq API key available, creating expanded content manually");
        return this.expandContentManually(content, title, category);
      }

      // Special handling for India News to ensure Hindi language
      const isIndiaNews = category === "India News";
      const languageInstruction = isIndiaNews ?
        "CRITICAL: Write ONLY in pure, standard Hindi using Devanagari script. STRICTLY AVOID Marathi words. Use common Hindi words like: 'के लिए' (not 'साठी'), 'की तरह' (not 'सारखे'), 'में' (not 'मध्ये'), 'से' (not 'पासून'), 'और' (not 'आणि'), 'है' (not 'आहे'). Write for all Hindi speakers across India, not regional audiences." :
        "Write in clear, simple English that is easy to read and understand.";

      const requestBody = {
       model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are a professional SEO content writer and journalist with expertise in creating engaging, comprehensive articles. You will be given a news headline and brief description/summary. Your task is to create a complete, well-researched article based on this information.

CRITICAL INSTRUCTIONS:
- If given only a short snippet or description, EXPAND it into a full comprehensive article
- Research and add relevant background information, context, and expert analysis
- Include implications, causes, effects, and broader significance of the news
- Add industry insights, historical context, and future outlook where relevant
- Maintain journalistic integrity - don't fabricate specific quotes or statistics not provided
- Focus on providing value through analysis, context, and comprehensive coverage
- ${languageInstruction}

CONTENT EXPANSION STRATEGY:
1. Start with the core facts from the provided information
2. Add relevant background and context about the topic/industry
3. Explain the significance and implications
4. Include multiple perspectives and expert viewpoints
5. Discuss potential impacts and future developments
6. Provide actionable insights for readers

FORMATTING STRUCTURE (MANDATORY):
1. Always start with <h1>Main Title</h1>
2. Use <h2>Section Headers</h2> for major sections (minimum 4-5 sections)
3. Use <h3>Sub-headers</h3> for subsections
4. Wrap all paragraphs in <p> tags
5. Use <strong>text</strong> for important highlights
6. Create <ul><li>bullet points</li></ul> for lists
7. Use <blockquote> for expert insights or key quotes
8. End with compelling conclusion in <p> tags

TARGET: 1200-1800 words minimum, fully comprehensive coverage
TONE: Professional, authoritative, engaging and informative
QUALITY: High-level journalism with deep analysis and context`
          },
          {
            role: "user",
            content: `Category: ${category || "General"}
Title: ${title}

Brief Summary/Description: ${content}

TASK: Create a complete, comprehensive 1200-1800 word article based on this headline and brief description. 

IMPORTANT: The provided content is just a SHORT SUMMARY or SNIPPET. You need to:
1. Expand this into a full-length, detailed article
2. Add comprehensive background information and context
3. Include industry analysis and expert perspectives
4. Explain the broader implications and significance
5. Discuss causes, effects, and future outlook
6. Make it a complete, standalone article that fully covers the topic

Write a professional, engaging article that provides complete coverage of this news story, not just a summary. Use the brief description as your starting point but expand it significantly with relevant context, analysis, and comprehensive coverage.`
          }
        ],
        max_tokens: 4000, // ✅ FIXED: Reduced from 8000 to 4000 to prevent 400 error
        temperature: 0.7
      };

      const response = await this.makeGroqAPIRequest("https://api.groq.com/openai/v1/chat/completions", requestBody);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Groq API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const enhancedContent = data.choices[0]?.message?.content || content;

      if (enhancedContent === content) {
        console.warn("Groq returned original content - no enhancement occurred");
      } else {
        console.log(`Groq enhancement successful - expanded from ${content.length} to ${enhancedContent.length} characters`);
      }

      return enhancedContent;
    } catch (error) {
      console.error("Error enhancing content with Groq:", error);
      console.error("Groq API Key available:", !!this.config.groqApiKey);
      console.log("Falling back to manual content expansion");
      return this.expandContentManually(content, title, category);
    }
  }

  private expandContentManually(content: string, title: string, category: string = "", source = "NewsHubNow"): string {
    // Create comprehensive article content when Groq API is not available
    const isHindi = category === "India News" && /[\u0900-\u097F]/.test(content);

    if (isHindi) {
      return this.createHindiArticle(content, title, source);
    } else {
      return this.createEnglishArticle(content, title, category);
    }
  }

  private createHindiArticle(content: string, title: string, source = "NewsHubNow"): string {
    const now = new Date();
    const publishedDate = now.toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    return `<h1>${title}</h1>

<p><strong>सार:</strong> ${content}</p>

<h2>प्रमुख बिंदु</h2>
<p>(${publishedDate}) — इस रिपोर्ट में निम्नलिखित महत्वपूर्ण बिंदु हैं जो पाठकों के लिए जानना आवश्यक है। यह घटना न केवल वर्तमान परिस्थितियों को दर्शाती है बल्कि भविष्य की संभावनाओं पर भी प्रकाश डालती है।</p>

<h2>पृष्ठभूमि और संदर्भ</h2>
<p>इस मामले की जड़ें गहरी हैं और इसे समझने के लिए हमें पिछली घटनाओं और नीतियों पर नज़र डालनी होगी। विशेषज्ञों का मानना है कि यह विकास कई कारकों का परिणाम है।</p>

<h2>प्रभाव और महत्व</h2>
<p>इस घटना के व्यापक प्रभाव होने की संभावना है। समाज, राजनीति और अर्थव्यवस्था पर इसके दूरगामी परिणाम हो सकते हैं। विभिन्न हितधारकों की अलग-अलग प्रतिक्रियाएं इसकी जटिलता को दर्शाती हैं।</p>

<h2>आगे की राह</h2>
<p>भविष्य में इस मामले का क्या होगा, यह देखना दिलचस्प होगा। नीति निर्माताओं और संबंधित अधिकारियों को इस पर गंभीरता से विचार करना होगा और उचित कदम उठाने होंगे।</p>

<h2>निष्कर्ष</h2>
<p>यह घटना हमारे समय की चुनौतियों और अवसरों को दर्शाती है। जैसे-जैसे स्थिति विकसित होती है, हमें इसपर कड़ी नज़र रखनी होगी और समुदाय के हितों को ध्यान में रखकर आगे बढ़ना होगा।</p>`;
  }

  private createEnglishArticle(content: string, title: string, category: string): string {
    const categoryContext = this.getCategoryContext(category);

    return `<h1>${title}</h1>

<p><strong>Executive Summary:</strong> ${content}</p>

<h2>Key Developments</h2>
<p>This story represents significant developments in ${categoryContext.field}. The implications extend beyond immediate circumstances, affecting stakeholders across multiple sectors and regions.</p>

<h2>Background and Context</h2>
<p>To understand the full scope of this development, it's essential to examine the underlying factors and historical context. Industry experts have been monitoring similar trends, and this latest development fits into a broader pattern of change in ${categoryContext.field}.</p>

<p>The circumstances leading to this situation have been building over time, influenced by various economic, political, and social factors. Recent policy changes and market dynamics have created conditions that made this outcome increasingly likely.</p>

<h2>Analysis and Expert Perspectives</h2>
<p>Leading analysts in ${categoryContext.field} suggest that this development could have far-reaching consequences. The immediate effects are already becoming apparent, but the long-term implications may be even more significant.</p>

<p><strong>Key factors at play include:</strong></p>
<ul>
<li>Economic pressures and market dynamics</li>
<li>Regulatory environment and policy frameworks</li>
<li>Technological advancements and innovation trends</li>
<li>Social and cultural shifts affecting public opinion</li>
<li>International relations and global market conditions</li>
</ul>

<h2>Impact Assessment</h2>
<p>The ripple effects of this development are expected to be felt across multiple dimensions. Economic implications include potential changes in market valuations, investment patterns, and consumer behavior.</p>

<p>From a policy perspective, this may prompt lawmakers and regulators to reassess current frameworks and consider new approaches. The timing is particularly significant given ongoing debates about ${categoryContext.relevantIssues}.</p>

<h2>Stakeholder Reactions</h2>
<p>Various stakeholders have responded to this development with mixed reactions. While some view it as a positive step forward, others express concerns about potential negative consequences.</p>

<p>Industry leaders are closely monitoring the situation, with many companies reassessing their strategies and risk management approaches. Consumer advocacy groups have also weighed in, emphasizing the need for transparency and accountability.</p>

<h2>Future Outlook</h2>
<p>Looking ahead, several scenarios are possible depending on how various factors evolve. The most likely outcome involves gradual adaptation and adjustment across affected sectors.</p>

<p>However, the potential for more dramatic changes cannot be ruled out, particularly if additional developments occur in the coming months. Monitoring key indicators will be crucial for understanding the trajectory of this story.</p>

<h2>Conclusion</h2>
<p>This development represents a significant moment in ${categoryContext.field}, with implications that extend well beyond the immediate circumstances. As the situation continues to evolve, stakeholders across all sectors will need to remain vigilant and adaptable.</p>

<p>The coming weeks and months will be critical in determining the ultimate impact and legacy of these events. Continued monitoring and analysis will be essential for understanding the full scope of changes underway.</p>`;
  }

  private getCategoryContext(category: string): { field: string; relevantIssues: string } {
    const contexts = {
      'World News': { field: 'international affairs', relevantIssues: 'global governance and diplomatic relations' },
      'Technology': { field: 'technology and innovation', relevantIssues: 'digital transformation and emerging technologies' },
      'Business': { field: 'business and economics', relevantIssues: 'market regulation and economic policy' },
      'India News': { field: 'Indian politics and society', relevantIssues: 'governance and social development' },
      'Trending': { field: 'contemporary affairs', relevantIssues: 'social media and public discourse' },
      'Educational': { field: 'education and professional development', relevantIssues: 'skill development and career advancement' }
    };

    return contexts[category as keyof typeof contexts] || { field: 'current affairs', relevantIssues: 'policy and social change' };
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
                // Use description as the base content for expansion
                const baseContent = apiArticle.description || apiArticle.title;
                console.log(`NewsAPI - Enhancing article with Groq: ${apiArticle.title.substring(0, 50)}...`);
                console.log(`NewsAPI - Base content length: ${baseContent.length} characters`);

                const enhancedContent = await this.enhanceWithGroq(
                  baseContent,
                  apiArticle.title,
                  "World News"
                );

                console.log(`NewsAPI - Enhanced content length: ${enhancedContent.length} characters`);

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

      // Simple India queries that work with GNews API
      const indiaTopics = [
        'india',
        'indian'
      ];
      const articles: InsertArticle[] = [];

      for (const topic of indiaTopics) {
        const response = await fetch(
          `https://gnews.io/api/v4/search?q=${encodeURIComponent(topic)}&country=in&max=5&token=${this.config.gnewsApiKey}`
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`GNews error for ${topic}:`, response.status, errorText);
          continue;
        }

        const data = await response.json();

        if (data.articles && data.articles.length > 0) {
          // Try multiple articles from this topic to find a non-duplicate
          for (const apiArticle of data.articles) {
            if (apiArticle.title && apiArticle.description) {
              const isDuplicate = await this.checkForDuplicate(apiArticle.title);

              if (!isDuplicate) {
                // Use description as the base content for expansion
                const baseContent = apiArticle.description || apiArticle.title;
                console.log(`GNews - Enhancing article with Groq: ${apiArticle.title.substring(0, 50)}...`);
                console.log(`GNews - Base content length: ${baseContent.length} characters`);

                const enhancedContent = await this.enhanceWithGroq(
                  baseContent,
                  apiArticle.title,
                  "India News"
                );

                console.log(`GNews - Enhanced content length: ${enhancedContent.length} characters`);

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
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: `You are an expert educator, researcher, and professional content creator. 
Your role is to create comprehensive, engaging, and actionable educational articles that deliver real value to readers. 
Every article should feel like it was written by a top industry expert and designed to attract, engage, and inspire readers.

Requirements:
1. Start with a powerful and engaging introduction that clearly explains why the topic matters today, connecting it to real-world trends and urgency.
2. Provide a clear, step-by-step practical guide with specific, actionable steps that readers can immediately apply.
3. Include real-world examples, case studies, or success stories that make the content relatable and credible.
4. Highlight common mistakes or misconceptions to help readers avoid pitfalls.
5. Provide useful resources, tools, or next steps for deeper learning or skill growth.
6. Share expert tips, insider knowledge, or advanced strategies that make the article feel premium and worth saving.
7. Maintain a professional yet conversational tone: informative, motivational, and easy to read.
8. Structure the article with engaging subheadings, bullet points, and short paragraphs for maximum clarity and readability.
9. Ensure the content feels fresh, practical, and directly helpful for readers looking to improve their skills, career, or income.

Goal: Produce top-quality, engaging, and professional articles that readers find so valuable they want to share and revisit.
`
            },
            {
              role: "user",
              content: `Create a detailed educational article about: "${selectedTopic}"

Make it comprehensive (1500+ words), practical, and full of actionable advice that readers can implement immediately. Include specific examples, tools, and strategies.`
            }
          ],
          max_tokens: 4000, // ✅ FIXED: Reduced from 8000 to 4000 to prevent 400 error
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

      // Remove duplicates based on title
      const uniqueArticles = allArticles.filter((article, index, self) =>
        index === self.findIndex(a => a.title === article.title)
      );

      console.log(`Generated ${allArticles.length} articles, ${uniqueArticles.length} unique after deduplication`);

      // Save unique articles to database
      for (const article of uniqueArticles) {
        try {
          // Double check for existing article in database
          const existingArticle = await db.select().from(articles).where(sql`title = ${article.title}`).limit(1);

          if (existingArticle.length === 0) {
            await db.insert(articles).values({
              ...article,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
            console.log(`Saved unique article: ${article.title}`);
          } else {
            console.log(`Skipped duplicate article: ${article.title}`);
          }
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