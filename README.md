# NewsHub - Modern News Aggregation Platform

A full-stack AI-powered news aggregation platform that combines automated content generation with modern web technologies.

## Quick Start Guide

### Prerequisites
- Node.js 18+ (recommended: Node.js 20)
- npm, pnpm, or yarn package manager
- PostgreSQL database (or use provided Supabase connection)

### Installation

1. **Clone or download the project**
   ```bash
   git clone <your-repo-url>
   cd newshub
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Environment Setup**
   The project includes a `.env` file with all necessary API keys pre-configured. No additional setup required.

### Running the Project

#### Option 1: Using npm scripts (Recommended for all platforms)
```bash
npm run dev
```

#### Option 2: Windows-specific commands
If you're on Windows and the npm script doesn't work:

**Command Prompt:**
```cmd
dev.bat
```

**PowerShell:**
```powershell
.\dev.ps1
```

**Git Bash/WSL:**
```bash
./dev.sh
```

#### Option 3: Manual command
```bash
# Set environment variable and run
NODE_ENV=development npx tsx server/index.ts
```

### Accessing the Application

Once running, open your browser and go to:
- **Local development:** http://localhost:5000
- The application serves both frontend and backend on the same port

### Features

- **Multi-source Content:** Aggregates news from NewsAPI, GNews, Reddit, and SerpAPI
- **AI Enhancement:** Uses Groq AI for content improvement and summarization
- **Responsive Design:** Works perfectly on desktop, tablet, and mobile
- **Real-time Updates:** Automatic content generation every few hours
- **Search & Filter:** Find articles by category or search terms
- **Contact Form:** EmailJS-powered contact system

### Project Structure

```
├── client/           # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Route pages
│   │   └── lib/         # Utilities and API
├── server/           # Express backend
│   ├── lib/             # Content generators
│   └── routes.ts        # API endpoints
├── shared/           # Shared types and schemas
├── .env              # Environment variables
├── dev.bat           # Windows batch file
├── dev.ps1           # PowerShell script
└── dev.sh            # Unix shell script
```

### Troubleshooting

#### Windows Issues
If you get `'NODE_ENV' is not recognized` error:
1. Use one of the Windows-specific scripts (dev.bat or dev.ps1)
2. Or install cross-env globally: `npm install -g cross-env`

#### Database Issues
If you see database connection errors:
1. Check that the DATABASE_URL in .env is correct
2. Run `npm run db:push` to sync the database schema

#### Port Issues
If port 5000 is in use:
1. Kill any process using port 5000
2. Or modify the port in server/index.ts

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Sync database schema
- `npm run check` - Type checking

### API Keys

All API keys are pre-configured in the .env file. The application includes:
- NewsAPI for global news
- GNews for India-specific content
- Reddit API for social content
- SerpAPI for search results
- Groq AI for content enhancement
- Unsplash & Pexels for images
- EmailJS for contact forms

### Content Generation

The system automatically generates fresh content:
- **NewsAPI:** Every 4 hours (3 articles per run)
- **GNews:** Every 4 hours (2-3 India news articles)
- **SerpAPI:** 3 times daily (9 AM, 12 PM, 5 PM)
- **Educational AI:** 3 times daily (10 AM, 1 PM, 7 PM)
- **Old articles:** Automatically deleted after 60 days

### Support

For technical issues or questions, contact: contact.neuraxon@gmail.com

---

**Made with ❤️ using React, Node.js, PostgreSQL, and AI**