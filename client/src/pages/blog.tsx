import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ArticleCard from "@/components/article-card";
import { api } from "@/lib/api";
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  TrendingUp, 
  Clock, 
  Globe,
  BookOpen,
  ArrowRight,
  Zap
} from "lucide-react";

const categories = [
  { name: "All", icon: Grid3X3, color: "bg-gray-500" },
  { name: "World News", icon: Globe, color: "bg-blue-500" },
  { name: "India News", icon: Globe, color: "bg-orange-500" }, 
  { name: "Technology", icon: Zap, color: "bg-purple-500" },
  { name: "Educational", icon: BookOpen, color: "bg-green-500" },
  { name: "Viral", icon: TrendingUp, color: "bg-pink-500" },
  { name: "Trending", icon: TrendingUp, color: "bg-red-500" },
];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isVisible, setIsVisible] = useState(false);
  const articlesPerPage = 12;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const { data: articles, isLoading, error } = useQuery({
    queryKey: ['/api/articles', page, selectedCategory],
    queryFn: () => api.getArticles(
      articlesPerPage, 
      page * articlesPerPage, 
      selectedCategory === "All" ? undefined : selectedCategory
    ),
  });

  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['/api/articles/search', searchQuery],
    queryFn: () => api.searchArticles(searchQuery),
    enabled: searchQuery.length > 2,
  });

  // Reset page when category changes
  useEffect(() => {
    setPage(0);
  }, [selectedCategory]);

  const displayArticles = searchQuery.length > 2 ? searchResults : articles;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-slate-600/10 via-gray-600/10 to-zinc-700/10 relative overflow-hidden">
        {/* Background with Images */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-slate-400/20 to-gray-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-r from-gray-400/20 to-zinc-400/20 rounded-full blur-3xl animate-pulse"></div>
          {/* News Pattern Overlay */}
          <div className="absolute inset-0 opacity-5">
            <div className="grid grid-cols-12 gap-4 h-full p-8">
              {[...Array(24)].map((_, i) => (
                <div key={i} className="bg-slate-600 rounded-lg animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Hero Icon and Badge */}
            <div className="relative inline-block mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-slate-800 via-slate-900 to-black shadow-2xl">
                <BookOpen className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                LIVE
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-slate-900 to-black bg-clip-text text-transparent">
              Breaking News Hub
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12">
              Discover comprehensive coverage of global events, technology innovations, and educational insights from verified sources worldwide. Stay ahead with real-time updates and expert analysis.
            </p>

            {/* Professional Search Bar */}
            <div className="max-w-3xl mx-auto mb-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-200 to-gray-300 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                  <Input
                    type="text"
                    placeholder="Search latest news, topics, or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-16 pr-32 py-6 text-lg bg-transparent border-0 focus:ring-0 focus:outline-none placeholder:text-gray-400"
                  />
                  <div className="absolute left-5 top-6">
                    <Search className="h-6 w-6 text-slate-500" />
                  </div>
                  {isSearching && (
                    <div className="absolute right-24 top-6">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-600"></div>
                    </div>
                  )}
                  <div className="absolute right-2 top-2 bottom-2 flex items-center">
                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-slate-900 hover:to-black transition-all duration-300 cursor-pointer">
                      Search
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center group">
                <div className="text-2xl font-bold text-slate-800 group-hover:text-slate-900 transition-colors duration-300">2K+</div>
                <div className="text-sm text-gray-600">Articles</div>
              </div>
              <div className="text-center group">
                <div className="text-2xl font-bold text-slate-800 group-hover:text-slate-900 transition-colors duration-300">25+</div>
                <div className="text-sm text-gray-600">Countries</div>
              </div>
              <div className="text-center group">
                <div className="text-2xl font-bold text-slate-800 group-hover:text-slate-900 transition-colors duration-300">Live</div>
                <div className="text-sm text-gray-600">Updates</div>
              </div>
              <div className="text-center group">
                <div className="text-2xl font-bold text-slate-800 group-hover:text-slate-900 transition-colors duration-300">24/7</div>
                <div className="text-sm text-gray-600">Coverage</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls Section */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Category Filter */}
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Filter className="h-5 w-5 mr-2 text-blue-600" />
                Categories
              </h2>
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <Button
                      key={category.name}
                      onClick={() => setSelectedCategory(category.name)}
                      variant={selectedCategory === category.name ? "default" : "outline"}
                      className={`transition-all duration-300 hover:scale-105 ${
                        selectedCategory === category.name
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                          : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                      }`}
                    >
                      <IconComponent className="h-4 w-4 mr-2" />
                      {category.name}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 font-medium">View:</span>
              <div className="flex rounded-lg border border-gray-200 bg-white p-1">
                <Button
                  onClick={() => setViewMode("grid")}
                  variant="ghost"
                  size="sm"
                  className={`transition-all duration-200 ${
                    viewMode === "grid" 
                      ? "bg-blue-600 text-white hover:bg-blue-700" 
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => setViewMode("list")}
                  variant="ghost"
                  size="sm"
                  className={`transition-all duration-200 ${
                    viewMode === "list" 
                      ? "bg-blue-600 text-white hover:bg-blue-700" 
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Articles Section */}
        <div className="mb-12">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {searchQuery.length > 2 ? "Search Results" : selectedCategory === "All" ? "All Articles" : selectedCategory}
              </h2>
              <p className="text-gray-600 mt-1">
                {displayArticles ? `${displayArticles.length} articles found` : "Loading articles..."}
              </p>
            </div>
            
            {searchQuery.length > 2 && (
              <Button
                onClick={() => setSearchQuery("")}
                variant="outline"
                size="sm"
                className="border-gray-200 hover:border-red-300 hover:bg-red-50 hover:text-red-600"
              >
                Clear Search
              </Button>
            )}
          </div>

          {/* Loading State */}
          {(isLoading || isSearching) && (
            <div className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-8`}>
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
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Articles</h3>
                <p className="text-red-600">Please try again later or contact support if the problem persists.</p>
              </div>
            </div>
          )}

          {/* Articles Grid/List */}
          {!isLoading && !isSearching && !error && displayArticles && (
            <>
              {displayArticles.length > 0 ? (
                <div className={`grid gap-8 ${
                  viewMode === "grid" 
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                    : "grid-cols-1 max-w-4xl mx-auto"
                }`}>
                  {displayArticles.map((article, index) => (
                    <div 
                      key={article.id}
                      className="animate-in slide-in-from-bottom-4 duration-500"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <ArticleCard article={article} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Articles Found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchQuery.length > 2 
                      ? "Try adjusting your search terms or browse our categories." 
                      : "No articles available in this category at the moment."
                    }
                  </p>
                  <Button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("All");
                    }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    View All Articles
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Pagination */}
        {!searchQuery && displayArticles && displayArticles.length === articlesPerPage && (
          <div className="flex justify-center items-center space-x-4 py-8">
            <Button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              variant="outline"
              className="border-gray-200 hover:border-blue-300 hover:bg-blue-50"
            >
              Previous
            </Button>
            
            <span className="text-gray-600 font-medium">
              Page {page + 1}
            </span>
            
            <Button
              onClick={() => setPage(page + 1)}
              disabled={!displayArticles || displayArticles.length < articlesPerPage}
              variant="outline"
              className="border-gray-200 hover:border-blue-300 hover:bg-blue-50"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Newsletter CTA */}
        <section className="mt-20 py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-2xl text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 text-center px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Never Miss Important News
            </h2>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              Get the latest articles and breaking news delivered to your inbox. Join thousands of informed readers.
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
          </div>
          
          {/* Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          </div>
        </section>
      </div>
    </div>
  );
}