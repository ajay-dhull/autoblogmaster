import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ArticleCard from "@/components/article-card";
import { api } from "@/lib/api";
import { Search, Filter } from "lucide-react";

const categories = [
  "All",
  "World News",
  "India News", 
  "Technology",
  "Educational",
  "Viral",
  "Trending",
];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const articlesPerPage = 12;

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full mb-6">
          <span className="text-sm font-medium text-gray-600">🚀 AI-Powered Content</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
          Latest Articles
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
          Discover comprehensive, AI-enhanced content from trusted news sources, educational insights, and trending discussions
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Filter className="h-4 w-4 text-gray-500 flex-shrink-0" />
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`cursor-pointer whitespace-nowrap ${
                selectedCategory === category
                  ? "bg-primary text-white"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => {
                setSelectedCategory(category);
                setSearchQuery(""); // Clear search when changing categories
              }}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Search Results Info */}
      {searchQuery.length > 2 && (
        <div className="mb-6">
          <p className="text-gray-600">
            {isSearching ? (
              "Searching..."
            ) : searchResults ? (
              `Found ${searchResults.length} articles for "${searchQuery}"`
            ) : (
              "No results found"
            )}
          </p>
        </div>
      )}

      {/* Articles Grid */}
      {isLoading || isSearching ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl h-96 animate-pulse shadow-sm" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">Failed to load articles</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      ) : displayArticles && displayArticles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayArticles.map((article, index) => (
              <div
                key={article.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ArticleCard article={article} />
              </div>
            ))}
          </div>

          {/* Load More Button (only for non-search results) */}
          {searchQuery.length <= 2 && articles && articles.length === articlesPerPage && (
            <div className="text-center mt-12">
              <Button
                onClick={() => setPage(page + 1)}
                size="lg"
              >
                Load More Articles
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-16 w-16 mx-auto mb-4" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Articles Found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery.length > 2
              ? `No articles match your search for "${searchQuery}"`
              : `No articles available in the ${selectedCategory} category yet.`}
          </p>
          {searchQuery.length > 2 && (
            <Button
              variant="outline"
              onClick={() => setSearchQuery("")}
            >
              Clear Search
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
