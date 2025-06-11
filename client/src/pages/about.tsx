import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Zap, Clock, Search, Database, Globe, Flag, GraduationCap, TrendingUp, Search as SearchIcon } from "lucide-react";

export default function About() {
  const features = [
    {
      icon: Zap,
      title: "AI-Powered Content Generation",
      description: "Using Groq API for intelligent content creation and rewriting with human-like emotion and clarity.",
    },
    {
      icon: Clock,
      title: "Automated Scheduling",
      description: "8 articles published daily at optimized times across different categories and topics.",
    },
    {
      icon: Search,
      title: "SEO Optimized",
      description: "Every article includes meta descriptions, clean URLs, keyword optimization, and proper structure.",
    },
    {
      icon: Database,
      title: "Multiple Data Sources",
      description: "NewsAPI, GNews, Reddit, SerpAPI, and custom AI generation for diverse content.",
    },
  ];

  const techSpecs = [
    "Supabase Database Integration",
    "Responsive Design Framework",
    "Image Auto-sourcing (Unsplash/Pexels)",
    "Advanced SEO Implementation",
    "Category-based Content Organization",
    "Real-time Content Generation",
    "Clean URL Structure",
    "Professional Typography",
  ];

  const scheduleCards = [
    {
      time: "8:00 AM",
      title: "World News",
      description: "Global leaders, international companies, and trending world topics",
      icon: Globe,
      color: "bg-blue-100 text-blue-600",
      source: "NewsAPI",
      count: 2,
    },
    {
      time: "12:00 PM",
      title: "Indian News",
      description: "Trending India topics, government updates, sports, and major events",
      icon: Flag,
      color: "bg-orange-100 text-orange-600",
      source: "GNews",
      count: 3,
    },
    {
      time: "3:00 PM",
      title: "Educational Content",
      description: "Informative articles on AI tools, online earning, and inspiration",
      icon: GraduationCap,
      color: "bg-green-100 text-green-600",
      source: "Groq AI",
      count: 2,
    },
    {
      time: "6:00 PM",
      title: "Viral Content",
      description: "Top trending Reddit discussions rewritten with AI enhancement",
      icon: TrendingUp,
      color: "bg-red-100 text-red-600",
      source: "Reddit + Groq AI",
      count: 1,
    },
    {
      time: "9:00 PM",
      title: "Trending Topics",
      description: "Search trends, events, festivals, and latest technology",
      icon: SearchIcon,
      color: "bg-purple-100 text-purple-600",
      source: "SerpAPI + Groq AI",
      count: 2,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">About AutoBlog Pro</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Professional-grade automated blog platform that generates unique, SEO-optimized content 
          24/7 using advanced AI and multiple reliable data sources.
        </p>
      </div>

      {/* Main Features */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary p-3 rounded-lg">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Content Schedule */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Automated Content Schedule</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our AI system generates fresh, unique content throughout the day from multiple reliable sources
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
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{card.time}</div>
                      <Badge variant="outline">{card.count} articles</Badge>
                    </div>
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
      </section>

      {/* Technical Specifications */}
      <section className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">How It Works</h2>
            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">1. Data Collection</h3>
                <p className="text-blue-800">
                  Our system continuously monitors NewsAPI, GNews, Reddit, and SerpAPI for trending topics and breaking news.
                </p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">2. AI Enhancement</h3>
                <p className="text-green-800">
                  Groq AI processes and rewrites content to be unique, engaging, and SEO-optimized with proper structure.
                </p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-2">3. Automated Publishing</h3>
                <p className="text-purple-800">
                  Articles are automatically published with featured images, meta descriptions, and clean URLs.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-xl">
            <img
              src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&w=600&h=400&fit=crop"
              alt="Modern AI-powered content creation workspace"
              className="w-full h-64 object-cover rounded-lg mb-6"
            />

            <h3 className="text-xl font-bold mb-4">Technical Specifications</h3>
            <ul className="space-y-2">
              {techSpecs.map((spec, index) => (
                <li key={index} className="flex items-center text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  {spec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Content Quality */}
      <section className="mb-16 bg-gradient-to-r from-primary to-blue-600 text-white rounded-2xl p-8 md:p-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Content Quality Guarantee</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-blue-100">Unique Content</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">SEO</div>
              <div className="text-blue-100">Optimized</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Automated</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="text-center">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              To democratize content creation by providing an automated, AI-powered platform that delivers 
              high-quality, SEO-optimized articles around the clock. We believe in the power of artificial 
              intelligence to transform how content is created, ensuring every article is unique, engaging, 
              and valuable to our readers.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
