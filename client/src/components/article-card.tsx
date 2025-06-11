import { Link } from "wouter";
import { Calendar, Clock, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Article } from "@shared/schema";

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
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
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
      <Link href={`/article/${article.slug}`}>
        <div className="cursor-pointer">
          {article.featuredImage && (
            <div className="aspect-video overflow-hidden">
              <img
                src={article.featuredImage}
                alt={article.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-3">
              <Badge
                className={`${getCategoryColor(article.category)} text-white px-3 py-1 text-sm font-medium`}
              >
                {article.category}
              </Badge>
              <div className="flex items-center text-gray-500 text-sm">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(article.publishedAt)}
              </div>
            </div>

            <h3 className="text-xl font-bold mb-3 hover:text-primary transition-colors line-clamp-2">
              {article.title}
            </h3>

            <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getSourceIcon(article.source)}</span>
                <span className="text-sm text-gray-600">{article.source}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                {estimateReadTime(article.content)} min read
              </div>
            </div>

            {article.tags && article.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1">
                {article.tags.slice(0, 3).map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full"
                  >
                    <Tag className="h-2 w-2 mr-1" />
                    {tag}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </div>
      </Link>
    </Card>
  );
}
