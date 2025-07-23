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
  Calendar,
  ChevronLeft,
  ChevronRight,
  Play
} from "lucide-react";
import { useState, useEffect } from "react";

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  featuredImage?: string;
  publishedAt?: string;
  slug: string;
  description?: string;
  views?: number;
}

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

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

  // Latest articles for hero section - real-time updates
  const { data: latestArticles, isLoading: latestLoading } = useQuery({
    queryKey: ['/api/articles', 'latest', 5],
    queryFn: () => api.getArticles(5, 0),
    refetchInterval: 10000, // Auto-refresh every 10 seconds for real-time updates
    staleTime: 0, // Always refetch
    refetchOnWindowFocus: true, // Refetch when window gains focus
  });

  // Auto-slide effect for hero section
  useEffect(() => {
    if (latestArticles && latestArticles.length > 0) {
      const maxSlides = Math.min(latestArticles.length, 5);
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % maxSlides);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [latestArticles]);

  const stats = [
    { label: "Active Readers", value: "50K+", description: "Engaged community members every day", icon: Users, color: "text-slate-600" },
    { label: "Articles Published", value: "2K+", description: "High‑quality stories and analyses", icon: BookOpen, color: "text-slate-700" },
    { label: "Global Reach", value: "25+", description: "Countries covered with localized reporting", icon: Globe, color: "text-slate-800" },
    { label: "Expert Contributors", value: "100+", description: "Industry leaders and subject‑matter experts", icon: Star, color: "text-slate-900" },
  ];

  const features = [
    {
      title: "Real‑Time AI Curation",
      description: "Automatically sift through hundreds of sources and surface the most important developments as they happen—no delay, no noise.",
      icon: Clock,
      color: "bg-slate-50 text-slate-700",
      gradient: "from-slate-100 to-slate-50"
    },
    {
      title: "In‑Depth Analysis", 
      description: "Go beyond headlines with expertly generated context, background, and forward‑looking insight on every major topic.",
      icon: Award,
      color: "bg-gray-50 text-gray-700", 
      gradient: "from-gray-100 to-gray-50"
    },
    {
      title: "Global Perspectives",
      description: "Access localized reporting from around the world, in one unified feed—covering politics, technology, education, culture, and more.",
      icon: Globe,
      color: "bg-zinc-50 text-zinc-700",
      gradient: "from-zinc-100 to-zinc-50"
    },
    {
      title: "Rock‑Solid Accuracy",
      description: "Our AI cross‑verifies each story against trusted outlets and primary sources, so you can read with confidence.",
      icon: Shield,
      color: "bg-stone-50 text-stone-700",
      gradient: "from-stone-100 to-stone-50"
    }
  ];

  const categories = [
    { name: "World News", description: "Stay informed on international affairs, geopolitics, and breaking events shaping our planet.", count: "150+", color: "bg-slate-600", icon: Globe },
    { name: "Technology", description: "Deep dives on emerging innovations, AI breakthroughs, cybersecurity, and the digital economy.", count: "120+", color: "bg-slate-700", icon: Zap },
    { name: "Education", description: "Thoughtful guidance on learning trends, study tips, policy updates, and groundbreaking research.", count: "80+", color: "bg-slate-800", icon: BookOpen },
    { name: "Trending", description: "Curated highlights of viral stories, social movements, and must‑read commentary making waves right now.", count: "200+", color: "bg-slate-900", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50/30 pt-16">

      {/* Hero Section with Sliding Latest Articles */}
      <section className="relative min-h-screen lg:h-screen overflow-hidden">
        {/* Background with Images */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-gray-900/90 to-black/90"></div>
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/5 to-transparent"></div>
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-pulse"></div>
            <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>
        </div>

        {/* Hero Content with Sliding Articles */}
        <div className="relative z-10 min-h-screen lg:h-full flex items-center py-20 lg:py-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              
              {/* Left Side - Hero Text */}
              <div className={`text-white transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                <div className="inline-flex items-center bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-6 animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full mr-2 animate-ping"></div>
                  LIVE UPDATES
                </div>
                
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                  Latest News Headlines,
                  <span className="block bg-gradient-to-r from-slate-200 to-white bg-clip-text text-transparent">
                    Stay Updated Worldwide
                  </span>
                </h1>
                
                <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed max-w-2xl">
                  Stay updated with the most recent news from around the world. Explore top stories across categories including world news, technology, education, and trending topics.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Link href="/blog">
                    <Button size="lg" className="bg-white text-slate-900 hover:bg-gray-100 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 w-full sm:w-auto">
                      <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      Discover Now
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-slate-900 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold transition-all duration-300 w-full sm:w-auto">
                      Contact Us
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Side - Latest Articles Slider */}
              <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                {latestLoading ? (
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 animate-pulse">
                    <div className="h-48 sm:h-64 bg-gray-300 rounded-xl mb-4"></div>
                    <div className="h-4 sm:h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 sm:h-4 bg-gray-300 rounded w-2/3"></div>
                  </div>
                ) : latestArticles && latestArticles.length > 0 ? (
                  <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
                    {/* Latest Articles Slider */}
                    <div className="relative overflow-hidden rounded-xl lg:rounded-2xl shadow-2xl h-[400px] sm:h-[420px] lg:h-[440px]">
                      {latestArticles.slice(0, 5).map((article: Article, index: number) => (
                        <div
                          key={article.id}
                          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                            index === currentSlide 
                              ? 'opacity-100 transform translate-x-0' 
                              : index < currentSlide 
                                ? 'opacity-0 transform -translate-x-full' 
                                : 'opacity-0 transform translate-x-full'
                          }`}
                        >
                          <Card className="bg-white border-0 shadow-2xl overflow-hidden h-full flex flex-col">
                            <div className="relative flex-shrink-0">
                              {article.featuredImage ? (
                                <img 
                                  src={article.featuredImage} 
                                  alt={article.title || "Latest news article"}
                                  className="w-full h-48 sm:h-52 lg:h-56 object-cover"
                                />
                              ) : (
                                <div className="w-full h-48 sm:h-52 lg:h-56 bg-gradient-to-br from-slate-100 to-gray-200 flex items-center justify-center">
                                  <BookOpen className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400" />
                                </div>
                              )}
                              <div className="absolute top-3 left-3">
                                <Badge className="bg-slate-900 text-white px-3 py-1 text-xs font-medium">
                                  {article.category}
                                </Badge>
                              </div>
                              <div className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium">
                                {index + 1} / {Math.min(latestArticles.length, 5)}
                              </div>
                              <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                                LATEST
                              </div>
                            </div>
                            <CardContent className="p-4 sm:p-6 flex flex-col flex-1">
                              <div className="flex-1">
                                <h3 className="text-base sm:text-lg font-bold mb-2 text-gray-900 line-clamp-2 leading-tight">
                                  {article.title}
                                </h3>
                                {article.description ? (
                                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                                    {article.description}
                                  </p>
                                ) : (
                                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                                    {article.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                <div className="flex items-center text-gray-500 text-xs">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Recent'}
                                </div>
                                <Link href={`/article/${article.slug}`}>
                                  <Button size="sm" className="bg-slate-900 text-white hover:bg-black text-xs px-4 py-2">
                                    Read More
                                  </Button>
                                </Link>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </div>

                    {/* Navigation Arrows */}
                    <button
                      onClick={() => {
                        const articlesToShow = latestArticles || recentArticles;
                        const maxSlides = Math.min(articlesToShow?.length || 0, 5);
                        setCurrentSlide((prev) => prev === 0 ? maxSlides - 1 : prev - 1);
                      }}
                      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-900 p-2 sm:p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
                    >
                      <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                    <button
                      onClick={() => {
                        const articlesToShow = latestArticles || recentArticles;
                        const maxSlides = Math.min(articlesToShow?.length || 0, 5);
                        setCurrentSlide((prev) => (prev + 1) % maxSlides);
                      }}
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-900 p-2 sm:p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
                    >
                      <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>

                    {/* Dots Indicator */}
                    <div className="flex justify-center mt-3 space-x-2">
                      {(latestArticles || recentArticles)?.slice(0, 5).map((_: Article, slide: number) => (
                        <button
                          key={slide}
                          onClick={() => setCurrentSlide(slide)}
                          className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                            slide === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ) : recentArticles && recentArticles.length > 0 ? (
                  <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
                    {/* Fallback to recent articles if latest articles aren't available */}
                    <div className="relative overflow-hidden rounded-xl lg:rounded-2xl shadow-2xl h-[400px] sm:h-[420px] lg:h-[440px]">
                      {recentArticles.slice(0, 5).map((article: Article, index: number) => (
                        <div
                          key={article.id}
                          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                            index === currentSlide 
                              ? 'opacity-100 transform translate-x-0' 
                              : index < currentSlide 
                                ? 'opacity-0 transform -translate-x-full' 
                                : 'opacity-0 transform translate-x-full'
                          }`}
                        >
                          <Card className="bg-white border-0 shadow-2xl overflow-hidden h-full flex flex-col">
                            <div className="relative flex-shrink-0">
                              {article.featuredImage ? (
                                <img 
                                  src={article.featuredImage} 
                                  alt={article.title || "Recent news article"}
                                  className="w-full h-48 sm:h-52 lg:h-56 object-cover"
                                />
                              ) : (
                                <div className="w-full h-48 sm:h-52 lg:h-56 bg-gradient-to-br from-slate-100 to-gray-200 flex items-center justify-center">
                                  <BookOpen className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400" />
                                </div>
                              )}
                              <div className="absolute top-3 left-3">
                                <Badge className="bg-slate-900 text-white px-3 py-1 text-xs font-medium">
                                  {article.category}
                                </Badge>
                              </div>
                              <div className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium">
                                {index + 1} / {Math.min(recentArticles.length, 5)}
                              </div>
                            </div>
                            <CardContent className="p-4 sm:p-6 flex flex-col flex-1">
                              <div className="flex-1">
                                <h3 className="text-base sm:text-lg font-bold mb-2 text-gray-900 line-clamp-2 leading-tight">
                                  {article.title}
                                </h3>
                                {article.description ? (
                                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                                    {article.description}
                                  </p>
                                ) : (
                                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                                    {article.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                <div className="flex items-center text-gray-500 text-xs">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Recent'}
                                </div>
                                <Link href={`/article/${article.slug}`}>
                                  <Button size="sm" className="bg-slate-900 text-white hover:bg-black text-xs px-4 py-2">
                                    Read More
                                  </Button>
                                </Link>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
                    <BookOpen className="h-16 w-16 text-white/50 mx-auto mb-4" />
                    <p className="text-white/70 text-lg">No articles found at the moment. Please check back later.</p>
                  </div>
                )}
                
                {/* Static fallback for crawlers */}
                <noscript>
                  <ul className="list-disc list-inside text-gray-800 bg-white p-4 rounded-lg">
                    <li><a href="/article/breaking-world-news-today">Breaking World News: Major Global Updates Today</a></li>
                    <li><a href="/article/latest-technology-breakthroughs">Latest Technology Breakthroughs and Innovations</a></li>
                    <li><a href="/article/educational-reforms-worldwide">Educational Reforms and Changes Worldwide</a></li>
                  </ul>
                </noscript>
              </div>
            </div>
          </div>
        </div>
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
                  <div className="text-xs text-gray-500 mt-1">{stat.description}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text text-transparent">
              Why Choose NewsHub?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the features and principles that make NewsHub your go-to source for reliable news and insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card 
                  key={index}
                  className={`group hover:shadow-xl transition-all duration-500 hover:scale-105 border-0 overflow-hidden bg-gradient-to-br ${feature.gradient}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-8 text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text text-transparent">
              Explore Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Browse our comprehensive coverage across multiple categories and stay informed about what matters most to you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Link key={index} href={`/blog?category=${category.name}`}>
                  <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border-0 overflow-hidden">
                    <CardContent className="p-8 text-center relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50 group-hover:to-gray-100 transition-all duration-300"></div>
                      <div className="relative z-10">
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${category.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                          <IconComponent className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-600 mb-3 leading-relaxed">{category.description}</p>
                        <p className="text-xs text-gray-500 mb-4 font-medium">{category.count} articles</p>
                        <div className="inline-flex items-center text-slate-700 font-medium group-hover:text-slate-900 transition-colors duration-300">
                          Explore
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Articles Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-slate-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text text-transparent">
                Latest Insights & Stories
              </h2>
              <p className="text-xl text-gray-600">
                Explore the freshest articles hand‑picked by our AI for timeliness and relevance. From urgent breaking news to expert tutorials, each story is crafted to keep you informed and inspired.
              </p>
            </div>
            <Link href="/blog">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                View All Articles
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {articlesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
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
          ) : recentArticles && recentArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {recentArticles.slice(0, 4).map((article: Article, index: number) => (
                <div 
                  key={article.id}
                  className="animate-in slide-in-from-bottom-4 duration-700 hover:scale-105 transition-transform duration-300"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>
          ) : (
            <Card className="p-16 text-center bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Articles Available</h3>
              <p className="text-gray-500">No articles found at the moment. Please check back later for the latest news and insights.</p>
            </Card>
          )}
          
          {/* Static fallback for crawlers */}
          <noscript>
            <ul className="list-disc list-inside text-gray-800 bg-white p-4 rounded-lg">
              <li><a href="/article/trending-stories-today">Trending Stories and Viral News Today</a></li>
              <li><a href="/article/in-depth-analysis-current-events">In-Depth Analysis of Current Global Events</a></li>
              <li><a href="/article/expert-insights-industry-news">Expert Insights on Industry News and Updates</a></li>
            </ul>
          </noscript>
        </div>
      </section>
    </div>
  );
}
