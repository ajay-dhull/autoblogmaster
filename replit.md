# NewsHub - Modern News Aggregation Platform

## Overview

NewsHub is a full-stack news aggregation platform that combines automated content generation with modern web technologies. The application fetches, enhances, and presents news content from multiple sources while providing a clean, responsive user interface for readers.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with structured error handling
- **Content Generation**: Automated content creation using multiple external APIs
- **File Serving**: Vite integration for development, static file serving for production

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL (configured for Neon Database)
- **Schema Management**: Code-first approach with TypeScript schema definitions
- **Migrations**: Drizzle Kit for database migrations

## Key Components

### Data Models
- **Articles**: Core content with metadata (title, slug, content, category, source, etc.)
- **Content Sources**: Configuration for automated content generation
- **Contacts**: User inquiries and feedback management

### Content Generation System
- **Multi-Source Integration**: NewsAPI, GNews, Reddit, SerpAPI integrations
- **AI Enhancement**: Groq API for content improvement and summarization
- **Image Integration**: Unsplash and Pexels for featured images
- **Duplicate Prevention**: Advanced checking to avoid content duplication

### UI Components
- **Component System**: Comprehensive shadcn/ui component library
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Interactive Elements**: Cards, modals, forms with proper accessibility
- **Navigation**: Fixed header with smooth scrolling and active states

## Data Flow

### Content Creation Flow
1. External APIs fetch raw news data
2. Groq AI enhances content quality and creates summaries
3. Image services provide relevant featured images
4. Content is processed, deduplicated, and stored in PostgreSQL
5. Frontend fetches and displays processed articles

### User Interaction Flow
1. Users browse articles through category filters and search
2. TanStack Query manages caching and background updates
3. Responsive UI adapts to different screen sizes
4. Contact forms submit user inquiries to the backend

### Development Flow
1. Vite provides hot module replacement in development
2. TypeScript ensures type safety across the stack
3. Shared schema definitions maintain consistency
4. Express serves API routes with proper error handling

## External Dependencies

### Content APIs
- **NewsAPI**: Global news aggregation
- **GNews**: Alternative news source
- **Reddit API**: Social media content
- **SerpAPI**: Search engine results
- **Groq API**: AI-powered content enhancement

### Media Services
- **Unsplash**: High-quality stock photography
- **Pexels**: Additional image resources

### Development Tools
- **Replit Environment**: Cloud development platform
- **PostgreSQL**: Production database
- **Tailwind CSS**: Utility-first styling
- **Radix UI**: Accessible component primitives

## Deployment Strategy

### Development Environment
- **Hot Reloading**: Vite development server with HMR
- **Database**: PostgreSQL via Neon Database connection
- **Port Configuration**: Frontend on 5000, API routes under `/api`

### Production Build
- **Frontend**: Vite builds optimized static assets
- **Backend**: esbuild bundles Node.js application
- **Deployment**: Replit autoscale deployment target
- **Environment**: Production mode with optimized settings

### Database Management
- **Schema Sync**: `npm run db:push` for development
- **Migrations**: Drizzle Kit generates and applies migrations
- **Connection**: Environment variable-based database URL

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

**June 21, 2025 - Environment Configuration Migration:**
✅ Successfully migrated all API key configuration from Replit secrets to local `.env` file
✅ Added dotenv package and configuration across all server files
✅ Created comprehensive `.env` file with all required API keys:
  - DATABASE_URL for PostgreSQL connection
  - NEWS_API_KEY, GNEWS_API_KEY for news sources
  - REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET for Reddit API
  - SERPAPI_KEY for search results
  - GROQ_API_KEY for AI content enhancement
  - UNSPLASH_ACCESS_KEY, PEXELS_API_KEY for images
✅ Updated server/index.ts, server/lib/supabase.ts, and content generator files to load environment variables from `.env`
✅ Verified system functionality - all APIs working correctly from local environment file
✅ Content generation system continues to work seamlessly with new configuration

**June 14, 2025 - Content Generation System Implementation:**
✅ Fixed all critical issues and implemented comprehensive content automation
✅ Enhanced improved-content-generator.ts with multi-source content generation:
  - NewsAPI: 3 different topics per day (general, technology, business from US/UK/CA)
  - GNews: 2-3 latest India news in Hindi/English based on trending topics
  - Reddit: 1 trending topic per day (currently has API access limitations)
  - SerpAPI: 3 articles per day for world news, AI tech, and trending topics
  - Educational AI: Generated comprehensive guides and tutorials
✅ Integrated Groq AI for professional content enhancement and SEO optimization
✅ Added automatic content scheduling system:
  - NewsAPI: Every 4 hours (optimized frequency for balanced content flow)
  - GNews India: Every 4 hours (optimized frequency for balanced content flow)
  - SerpAPI: 3 times daily (9 AM, 12 PM, 5 PM)
  - Educational content: 3 times daily (10 AM, 1 PM, 7 PM)
  - Reddit: 2 times daily (11 AM, 8 PM)
✅ Implemented duplicate prevention system to avoid repeated content
✅ Added featured image integration with Unsplash and Pexels APIs
✅ Database now populated with 9+ articles from multiple sources
✅ Homepage and blog sections now display real content with auto-refreshing hero section
✅ All API endpoints functioning correctly with proper error handling
✅ Optimized article typography - reduced heading sizes and improved spacing for better readability
✅ Enhanced content layout - articles now display with compact, professional formatting

**Content Generation Status:**
- ✅ NewsAPI (World News): Active every 4 hours - generates 3 articles (general, tech, business)
- ✅ GNews (India News): Active every 4 hours - generates 2-3 Hindi/English articles
- ⚠️ Reddit API: Access limited (403 errors) - requires API credentials for authentication
- ✅ SerpAPI: Active 3 times daily (9 AM, 12 PM, 5 PM) - 1 article per session
- ✅ Educational AI: Active 3 times daily (10 AM, 1 PM, 7 PM) - 1 article per session
- ✅ Groq AI Enhancement: Fully functional with enhanced SEO prompts
- ✅ Image Services: Enhanced with category-specific diversity and timestamp-based selection

**System Performance:**
- Database: 20+ articles with diverse, category-specific images
- Frontend: Fully responsive design optimized for all devices (mobile, tablet, desktop)
- API Response Times: 15-50ms average for content serving
- Content Quality: Professional, SEO-optimized articles 1200-1800 words
- Article Display: Mobile-first responsive design with adaptive layouts
- Image Diversity: Fixed same-image issue with category-specific fallbacks and timestamp selection

## Changelog

Changelog:
- June 14, 2025. Initial setup
- June 14, 2025. Complete content generation system implementation and automation