import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ArticleCard from "@/components/article-card";
import ContentGenerator from "@/components/admin/content-generator";
import { api } from "@/lib/api";
import { Globe, Flag, GraduationCap, TrendingUp, Search, Clock, Database, CheckCircle, Zap } from "lucide-react";

export default function Home() {
  const { data: featuredArticles, isLoading: featuredLoading } = useQuery({
    queryKey: ['/api/articles/featured'],
    queryFn: api.getFeaturedArticles,
  });

  const { data: recentArticles, isLoading: articlesLoading } = useQuery({
    queryKey: ['/api/articles'],
    queryFn: () => api.getArticles(6, 0),
  });

  const stats = [
    { label: "Daily Articles", value: "8", icon: "📄" },
    { label: "Data Sources", value: "5", icon: "🔗" },
    { label: "Automation", value: "100%", icon: "⚡" },
    { label: "SEO Optimized", value: "SEO", icon: "🎯" },
  ];

  const scheduleCards = [
    {
      time: "8:00 AM",
      title: "World News",
      description: "2 articles from NewsAPI covering global leaders, international companies, and trending world topics",
      icon: Globe,
      color: "bg-blue-100 text-blue-600",
      source: "NewsAPI Source",
    },
    {
      time: "12:00 PM", 
      title: "Indian News",
      description: "3 articles about India trends, government updates, sports, and major news events",
      icon: Flag,
      color: "bg-orange-100 text-orange-600",
      source: "GNews Source",
    },
    {
      time: "3:00 PM",
      title: "Educational Content",
      description: "2 informative articles on topics like AI tools, online earning, and inspiring content",
      icon: GraduationCap,
      color: "bg-green-100 text-green-600",
      source: "Groq AI Generated",
    },
    {
      time: "6:00 PM",
      title: "Viral Content", 
      description: "1 article based on top trending Reddit discussions rewritten with AI enhancement",
      icon: TrendingUp,
      color: "bg-red-100 text-red-600",
      source: "Reddit + Groq AI",
    },
    {
      time: "9:00 PM",
      title: "Trending Topics",
      description: "2 articles based on search trends, events, festivals, and latest technology",
      icon: Search,
      color: "bg-purple-100 text-purple-600",
      source: "SerpAPI + Groq AI",
    },
  ];

  const features = [
    {
      icon: Zap,
      title: "AI-Powered Content Generation",
      description: "Using Groq API for intelligent content creation and rewriting",
    },
    {
      icon: Clock,
      title: "Automated Scheduling",
      description: "8 articles published daily at optimized times",
    },
    {
      icon: Search,
      title: "SEO Optimized",
      description: "Every article includes meta descriptions, clean URLs, and keyword optimization",
    },
    {
      icon: Database,
      title: "Multiple Data Sources",
      description: "NewsAPI, GNews, Reddit, SerpAPI, and custom AI generation",
    },
  ];

  const techSpecs = [
    "Supabase Database Integration",
    "Responsive Design Framework", 
    "Image Auto-sourcing (Unsplash/Pexels)",
    "Advanced SEO Implementation",
    "Category-based Content Organization",
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Professional AI-Powered Content
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Automated blog platform generating unique, SEO-optimized articles from trending news, 
              Reddit discussions, and global events - 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/blog">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                  Explore Articles
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl">
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Articles</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Latest AI-generated content from trending global news, Reddit discussions, and educational topics.
            </p>
          </div>

          {featuredLoading ? (
            <div className="text-center py-8">Loading featured articles...</div>
          ) : featuredArticles && featuredArticles.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {featuredArticles.slice(0, 2).map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No featured articles available yet.</p>
              <ContentGenerator />
            </div>
          )}
        </div>
      </section>

      {/* Latest Articles Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Articles</h2>
              <p className="text-xl text-gray-600">Automated content generation from multiple sources, updated daily</p>
            </div>
            <div className="mt-6 md:mt-0">
              <Link href="/blog">
                <Button>View All Articles</Button>
              </Link>
            </div>
          </div>

          {articlesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-xl h-96 animate-pulse" />
              ))}
            </div>
          ) : recentArticles && recentArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No articles available yet.</p>
              <ContentGenerator />
            </div>
          )}
        </div>
      </section>

      {/* Automation Schedule */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Automated Content Schedule</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI system generates fresh content throughout the day from multiple reliable sources
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scheduleCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg ${card.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-2xl font-bold text-primary">{card.time}</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                    <p className="text-gray-600 mb-3 text-sm">{card.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Database className="h-4 w-4 mr-2" />
                      <span>{card.source}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">About AutoBlog Pro</h2>
              <p className="text-xl text-gray-600 mb-6">
                Professional-grade automated blog platform that generates unique, SEO-optimized content 
                24/7 using advanced AI and multiple data sources.
              </p>

              <div className="space-y-4">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="bg-primary p-2 rounded-lg">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{feature.title}</h3>
                        <p className="text-gray-600 text-sm">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl">
              <img
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&w=600&h=400&fit=crop"
                alt="Modern AI-powered content creation workspace"
                className="w-full h-64 object-cover rounded-lg mb-6"
              />

              <h3 className="text-xl font-bold mb-4">Technical Specifications</h3>
              <ul className="space-y-2 text-gray-600">
                {techSpecs.map((spec, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    {spec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
