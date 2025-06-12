import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ArticleCard from "@/components/article-card";
import { api } from "@/lib/api";
import { 
  Globe, 
  TrendingUp, 
  Users, 
  Clock, 
  Star, 
  ArrowRight, 
  BookOpen,
  Zap,
  Shield,
  Award,
  Eye,
  Calendar
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const { data: featuredArticles, isLoading: featuredLoading } = useQuery({
    queryKey: ['/api/articles/featured'],
    queryFn: api.getFeaturedArticles,
  });

  const { data: recentArticles, isLoading: articlesLoading } = useQuery({
    queryKey: ['/api/articles'],
    queryFn: () => api.getArticles(8, 0),
  });

  const stats = [
    { label: "Daily Readers", value: "50K+", icon: Users, color: "text-slate-600" },
    { label: "Articles Published", value: "2K+", icon: BookOpen, color: "text-slate-700" },
    { label: "Countries Covered", value: "25+", icon: Globe, color: "text-slate-800" },
    { label: "Expert Contributors", value: "100+", icon: Star, color: "text-slate-900" },
  ];

  const features = [
    {
      title: "Real-Time Updates",
      description: "Get the latest news as it happens with our real-time content delivery system",
      icon: Clock,
      color: "bg-slate-50 text-slate-700",
      gradient: "from-slate-100 to-slate-50"
    },
    {
      title: "Expert Analysis", 
      description: "Professional insights and comprehensive analysis on every major story",
      icon: Award,
      color: "bg-gray-50 text-gray-700", 
      gradient: "from-gray-100 to-gray-50"
    },
    {
      title: "Global Coverage",
      description: "Comprehensive news coverage from around the world in multiple categories",
      icon: Globe,
      color: "bg-zinc-50 text-zinc-700",
      gradient: "from-zinc-100 to-zinc-50"
    },
    {
      title: "Verified Sources",
      description: "All content is sourced from verified, trusted news outlets and publications",
      icon: Shield,
      color: "bg-stone-50 text-stone-700",
      gradient: "from-stone-100 to-stone-50"
    }
  ];

  const categories = [
    { name: "World News", count: "150+", color: "bg-slate-600", icon: Globe },
    { name: "Technology", count: "120+", color: "bg-slate-700", icon: Zap },
    { name: "Education", count: "80+", color: "bg-slate-800", icon: BookOpen },
    { name: "Trending", count: "200+", color: "bg-slate-900", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50/30 pt-16">
      {/* Hero Section with Latest Articles */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-600/10 via-gray-600/10 to-zinc-700/10">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-slate-200/20 to-gray-200/20 animate-pulse"></div>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Hero Content */}
            <div className="mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-slate-800 via-slate-900 to-black mb-8 shadow-2xl">
                <Globe className="h-10 w-10 text-white" />
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-slate-900 to-black bg-clip-text text-transparent">
                Latest Breaking News
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Stay informed with real-time updates, expert analysis, and comprehensive coverage of global events from trusted sources worldwide.
              </p>
            </div>

            {/* Latest Articles Display */}
            {featuredLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : featuredArticles && featuredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {featuredArticles.slice(0, 3).map((article, index) => (
                  <div 
                    key={article.id}
                    className="animate-in slide-in-from-bottom-4 duration-500"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <Card className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white border-0 overflow-hidden">
                      <div className="relative">
                        {article.featuredImage ? (
                          <img 
                            src={article.featuredImage} 
                            alt={article.title}
                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gradient-to-br from-slate-100 to-gray-100 flex items-center justify-center">
                            <BookOpen className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                        <Badge className="absolute top-3 left-3 bg-slate-800 text-white">
                          {article.category}
                        </Badge>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold mb-3 text-gray-900 group-hover:text-slate-800 transition-colors duration-300 line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {article.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-gray-500 text-xs">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(article.publishedAt).toLocaleDateString()}
                          </div>
                          <Link href={`/article/${article.slug}`}>
                            <Button variant="ghost" size="sm" className="text-slate-800 hover:text-slate-900">
                              Read More
                              <ArrowRight className="h-3 w-3 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mb-12">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl p-8">
                  <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Latest articles will appear here</p>
                </Card>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/blog">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Read All News
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-800 px-8 py-4 text-lg bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-105"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-slate-400/20 to-gray-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-gray-400/20 to-zinc-400/20 rounded-full blur-3xl animate-pulse" 
          style={{ animationDelay: '2s' }}
        ></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div 
                  key={index}
                  className="text-center group hover:scale-105 transition-all duration-300"
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4 group-hover:bg-white shadow-lg group-hover:shadow-xl transition-all duration-300 ${stat.color}`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-slate-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text text-transparent">
              Why Choose NewsHub?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We deliver the most comprehensive and reliable news experience with cutting-edge technology and expert curation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card 
                  key={index}
                  className={`group hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-gradient-to-br ${feature.gradient} border-0 overflow-hidden`}
                >
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4">
                      <div className={`p-4 rounded-xl ${feature.color} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <IconComponent className="h-8 w-8" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-slate-700 transition-colors duration-300">{feature.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Explore by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover news and insights across various topics that matter to you
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Link key={index} href={`/blog?category=${encodeURIComponent(category.name)}`}>
                  <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50">
                    <CardContent className="p-6 text-center">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${category.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <IconComponent className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-slate-700 transition-colors duration-300">{category.name}</h3>
                      <p className="text-gray-600 font-medium">{category.count} articles</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Articles */}
      <section className="py-20 bg-gradient-to-br from-slate-50/30 to-gray-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text text-transparent">
              Recent Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Stay updated with our latest news coverage and analysis
            </p>
          </div>

          {articlesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="overflow-hidden animate-pulse">
                  <div className="h-32 bg-gray-200"></div>
                  <CardContent className="p-4">
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2 w-2/3"></div>
                    <div className="h-2 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : recentArticles && recentArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentArticles.slice(0, 4).map((article, index) => (
                <Link key={article.id} href={`/article/${article.slug}`}>
                  <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden border-0 bg-white">
                    <div className="relative">
                      {article.imageUrl ? (
                        <img 
                          src={article.imageUrl} 
                          alt={article.title}
                          className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-32 bg-gradient-to-br from-slate-100 to-gray-100 flex items-center justify-center">
                          <BookOpen className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      <Badge className="absolute top-2 left-2 text-xs bg-slate-800 text-white">
                        {article.category}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-sm font-bold mb-2 text-gray-900 group-hover:text-slate-800 transition-colors duration-300 line-clamp-2">
                        {article.title}
                      </h3>
                      <div className="flex items-center text-gray-500 text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No recent articles available</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/blog">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-slate-200 text-slate-600 hover:bg-slate-50 px-8 py-4 text-lg hover:scale-105 transition-all duration-300"
              >
                View All Articles
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}