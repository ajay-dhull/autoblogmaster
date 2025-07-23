import { Link } from "wouter";
import { Calendar, Clock, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Article } from "@shared/schema";

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  // ✅ Fix: If slug is missing or "undefined", don't render the card
  if (!article.slug || article.slug === "undefined") return null;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "World News":
        return "bg-green-500";
      case "India News":
        return "bg-orange-500";
      case "Educational":
        return "bg-yellow-500";
      case "Viral":
        return "bg-red-500";
      case "Trending":
        return "bg-blue-500";
      case "Technology":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "NewsAPI":
        return "📰";
      case "GNews":
        return "🇮🇳";
      case "Reddit":
        return "🔴";
      case "SerpAPI":
        return "🔍";
      case "Groq AI":
        return "🤖";
      default:
        return "📄";
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(" ").length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-500 h-full border-0 shadow-md hover:shadow-2xl hover:scale-105 transform">
      <Link href={`/article/${article.slug}`}>
        <div className="cursor-pointer h-full flex flex-col">
          {article.featuredImage && (
            <div className="aspect-[16/10] sm:aspect-[16/9] overflow-hidden relative">
              <img
                src={article.featuredImage}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Badge
                className={`absolute top-3 left-3 sm:top-4 sm:left-4 ${getCategoryColor(article.category)} text-white px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-semibold shadow-lg`}
              >
                {article.category}
              </Badge>
            </div>
          )}

          <CardContent className="p-4 sm:p-6 flex-1 flex flex-col">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
              <div className="flex items-center text-gray-500 text-xs sm:text-sm">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
                {formatDate(article.publishedAt || new Date())}
              </div>
              <div className="flex items-center text-gray-500 text-xs sm:text-sm">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
                {estimateReadTime(article.content)} min read
              </div>
            </div>

            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 group-hover:text-primary transition-colors duration-200 line-clamp-2 leading-tight">
              {article.title}
            </h3>

            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-3 flex-1 leading-relaxed">
              {article.excerpt}
            </p>

            <div className="mt-auto">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <span className="text-lg sm:text-xl">{getSourceIcon(article.source)}</span>
                  <span className="text-xs sm:text-sm font-medium text-gray-700">
                    {article.source}
                  </span>
                </div>
              </div>

              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 sm:gap-1.5">
                  {article.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center text-xs text-gray-600 bg-gray-50 hover:bg-gray-100 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border transition-colors duration-200"
                    >
                      <Tag className="h-2 w-2 sm:h-2.5 sm:w-2.5 mr-0.5 sm:mr-1" />
                      {tag}
                    </span>
                  ))}
                  {article.tags.length > 3 && (
                    <span className="text-xs text-gray-400 px-1.5 sm:px-2 py-0.5 sm:py-1">
                      +{article.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </div>
      </Link>
    </Card>
  );
}
