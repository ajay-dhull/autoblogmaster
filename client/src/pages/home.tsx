import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ArticleCard from "@/components/article-card";
import { api } from "@/lib/api";
import { 
  Globe, 
  TrendingUp, 
  Users, 
  Clock, 
  Star, 
  ArrowRight, 
  Play,
  BookOpen,
  Zap,
  Shield,
  Award
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const { data: featuredArticles, isLoading: featuredLoading } = useQuery({
    queryKey: ['/api/articles/featured'],
    queryFn: api.getFeaturedArticles,
  });

  const { data: recentArticles, isLoading: articlesLoading } = useQuery({
    queryKey: ['/api/articles'],
    queryFn: () => api.getArticles(6, 0),
  });

  const heroSlides = [
    {
      title: "Stay Ahead with Latest News",
      subtitle: "Get the most important updates from around the world",
      gradient: "from-blue-600 via-purple-600 to-indigo-700",
      icon: Globe
    },
    {
      title: "Trending Topics Daily",
      subtitle: "Discover what's trending in technology, education, and lifestyle",
      gradient: "from-purple-600 via-pink-600 to-red-600",
      icon: TrendingUp
    },
    {
      title: "Expert Analysis & Insights",
      subtitle: "In-depth coverage with professional commentary and analysis",
      gradient: "from-green-600 via-teal-600 to-blue-600",
      icon: BookOpen
    }
  ];

  const stats = [
    { label: "Daily Readers", value: "50K+", icon: Users, color: "text-blue-600" },
    { label: "Articles Published", value: "2K+", icon: BookOpen, color: "text-purple-600" },
    { label: "Countries Covered", value: "25+", icon: Globe, color: "text-green-600" },
    { label: "Expert Contributors", value: "100+", icon: Star, color: "text-orange-600" },
  ];

  const features = [
    {
      title: "Real-Time Updates",
      description: "Get the latest news as it happens with our real-time content delivery system",
      icon: Clock,
      color: "bg-blue-50 text-blue-600",
      gradient: "from-blue-100 to-blue-50"
    },
    {
      title: "Expert Analysis",
      description: "Professional insights and comprehensive analysis on every major story",
      icon: Award,
      color: "bg-purple-50 text-purple-600",
      gradient: "from-purple-100 to-purple-50"
    },
    {
      title: "Global Coverage",
      description: "Comprehensive news coverage from around the world in multiple categories",
      icon: Globe,
      color: "bg-green-50 text-green-600",
      gradient: "from-green-100 to-green-50"
    },
    {
      title: "Verified Sources",
      description: "All content is sourced from verified, trusted news outlets and publications",
      icon: Shield,
      color: "bg-orange-50 text-orange-600",
      gradient: "from-orange-100 to-orange-50"
    }
  ];

  const categories = [
    { name: "World News", count: "150+", color: "bg-blue-500", icon: Globe },
    { name: "Technology", count: "120+", color: "bg-purple-500", icon: Zap },
    { name: "Education", count: "80+", color: "bg-green-500", icon: BookOpen },
    { name: "Trending", count: "200+", color: "bg-orange-500", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 pt-16">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-indigo-700/10">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-200/20 to-purple-200/20 animate-pulse"></div>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Hero Slides */}
            <div className="mb-8 relative h-96">
              {heroSlides.map((slide, index) => {
                const IconComponent = slide.icon;
                return (
                  <div
                    key={index}
                    className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ${
                      currentSlide === index ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    }`}
                  >
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r ${slide.gradient} mb-6 shadow-2xl`}>
                      <IconComponent className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                      {slide.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                      {slide.subtitle}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/blog">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Explore News
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-gray-300 hover:border-blue-400 text-gray-700 hover:text-blue-600 px-8 py-4 text-lg bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-105"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Slide Indicators */}
            <div className="flex justify-center space-x-2">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentSlide === index 
                      ? 'bg-blue-600 w-8' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" 
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
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
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
                        <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-blue-700 transition-colors duration-300">{feature.title}</h3>
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
                      <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{category.name}</h3>
                      <p className="text-gray-600 font-medium">{category.count} articles</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-20 bg-gradient-to-br from-blue-50/30 to-purple-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
              Featured Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hand-picked articles and breaking stories from our editorial team
            </p>
          </div>

          {featuredLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredArticles.slice(0, 6).map((article, index) => (
                <div key={article.id}>
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No featured articles available</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/blog">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg hover:scale-105 transition-all duration-300"
              >
                View All Articles
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Stay Updated
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Get the latest news and insights delivered directly to your inbox every morning
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-lg text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-white/30"
            />
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold hover:scale-105 transition-all duration-300"
            >
              Subscribe
            </Button>
          </div>
          <p className="text-sm text-blue-200 mt-4">
            Join 50,000+ readers. No spam, unsubscribe anytime.
          </p>
        </div>
        
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div 
            className="absolute bottom-20 right-20 w-48 h-48 bg-white/10 rounded-full blur-xl animate-pulse" 
            style={{ animationDelay: '1s' }}
          ></div>
        </div>
      </section>
    </div>
  );
}