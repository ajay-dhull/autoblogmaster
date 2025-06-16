import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ArticleCard from "@/components/article-card";
import { api } from "@/lib/api";
import { 
  Calendar, 
  Clock, 
  Tag, 
  Share2, 
  ArrowLeft, 
  ExternalLink,
  Facebook,
  Twitter,
  Linkedin
} from "lucide-react";

export default function Article() {
  const [, params] = useRoute("/article/:slug");
  const slug = params?.slug;

  const { data: article, isLoading, error } = useQuery({
    queryKey: ['/api/articles', slug],
    queryFn: () => api.getArticleBySlug(slug!),
    enabled: !!slug,
  });

  const { data: relatedArticles } = useQuery({
    queryKey: ['/api/categories', article?.category],
    queryFn: () => api.getArticlesByCategory(article!.category),
    enabled: !!article?.category,
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <Link href="/blog">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "World News": return "bg-green-500";
      case "India News": return "bg-orange-500";
      case "Educational": return "bg-yellow-500";
      case "Viral": return "bg-red-500";
      case "Trending": return "bg-blue-500";
      case "Technology": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "NewsAPI": return "📰";
      case "GNews": return "🇮🇳";
      case "Reddit": return "🔴";
      case "SerpAPI": return "🔍";
      case "Groq AI": return "🤖";
      default: return "📄";
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(" ").length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const shareUrl = window.location.href;
  const shareText = `Check out this article: ${article.title}`;

  const handleShare = (platform: string) => {
    let url = "";
    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
    }
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/blog">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>
      </div>

      {/* Article Header */}
      <article className="mb-12">
        <header className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <Badge className={`${getCategoryColor(article.category)} text-white px-3 py-1`}>
              {article.category}
            </Badge>
            <div className="flex items-center text-gray-500 text-sm">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(article.publishedAt || new Date())}
            </div>
            <div className="flex items-center text-gray-500 text-sm">
              <Clock className="h-4 w-4 mr-1" />
              {estimateReadTime(article.content)} min read
            </div>
          </div>

          <h1 className="text-2xl md:text-4xl font-bold leading-tight mb-4 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600 bg-clip-text text-transparent">
            {article.title}
          </h1>

          <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-6 font-light">
            {article.excerpt}
          </p>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getSourceIcon(article.source)}</span>
              <div>
                <p className="font-medium">{article.source}</p>
                {article.sourceUrl && (
                  <a 
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center"
                  >
                    View Original <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 mr-2">Share:</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare("twitter")}
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare("facebook")}
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare("linkedin")}
              >
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {article.featuredImage && (
          <div className="mb-12">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={article.featuredImage}
                alt={article.title}
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        )}

        {/* Article Content */}
        <div className="article-content bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-12">
            <div 
              className="prose prose-lg prose-slate max-w-none
                       prose-headings:font-bold prose-headings:text-gray-900 prose-headings:tracking-tight prose-headings:scroll-mt-16
                       prose-h1:text-3xl prose-h1:mb-4 prose-h1:leading-tight prose-h1:bg-gradient-to-r prose-h1:from-gray-900 prose-h1:to-gray-700 prose-h1:bg-clip-text prose-h1:text-transparent
                       prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-gray-800 prose-h2:border-b-2 prose-h2:border-blue-200 prose-h2:pb-2 prose-h2:relative prose-h2:before:absolute prose-h2:before:left-0 prose-h2:before:top-0 prose-h2:before:w-1 prose-h2:before:h-full prose-h2:before:bg-blue-500 prose-h2:before:rounded-full prose-h2:pl-4
                       prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-gray-700 prose-h3:font-semibold prose-h3:border-l-4 prose-h3:border-orange-400 prose-h3:pl-4 prose-h3:py-1 prose-h3:bg-orange-50
                       prose-h4:text-lg prose-h4:mt-5 prose-h4:mb-2 prose-h4:text-gray-600 prose-h4:font-medium
                       prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4 prose-p:text-base prose-p:font-normal prose-p:tracking-normal
                       prose-strong:text-gray-900 prose-strong:font-bold prose-strong:bg-yellow-100 prose-strong:px-1 prose-strong:py-0.5 prose-strong:rounded
                       prose-ul:my-4 prose-ul:space-y-2 prose-ul:bg-gray-50 prose-ul:p-4 prose-ul:rounded-lg prose-ul:border-l-4 prose-ul:border-green-400
                       prose-li:text-gray-700 prose-li:leading-relaxed prose-li:relative prose-li:pl-1
                       prose-ol:my-4 prose-ol:space-y-2 prose-ol:bg-blue-50 prose-ol:p-4 prose-ol:rounded-lg prose-ol:border-l-4 prose-ol:border-blue-400
                       prose-blockquote:border-l-4 prose-blockquote:border-purple-500 prose-blockquote:bg-purple-50 prose-blockquote:border-r-4 prose-blockquote:border-r-purple-200
                       prose-blockquote:pl-6 prose-blockquote:pr-6 prose-blockquote:py-4 prose-blockquote:italic prose-blockquote:text-purple-900 prose-blockquote:rounded-r-lg prose-blockquote:shadow-sm prose-blockquote:my-4
                       prose-code:bg-gray-800 prose-code:text-yellow-300 prose-code:px-2 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm prose-code:font-mono prose-code:font-semibold
                       prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl prose-pre:p-4 prose-pre:shadow-lg prose-pre:border prose-pre:border-gray-700
                       prose-a:text-blue-600 prose-a:no-underline prose-a:font-semibold prose-a:border-b-2 prose-a:border-blue-200 hover:prose-a:border-blue-600 hover:prose-a:text-blue-800 prose-a:transition-all prose-a:duration-200
                       prose-img:rounded-xl prose-img:shadow-lg prose-img:border prose-img:border-gray-200 prose-img:my-4
                       prose-hr:border-gray-300 prose-hr:my-8 prose-hr:border-2
                       prose-table:border-collapse prose-table:w-full prose-table:shadow-sm prose-table:rounded-lg prose-table:overflow-hidden
                       prose-th:bg-gray-100 prose-th:font-bold prose-th:text-gray-900 prose-th:p-3 prose-th:text-left
                       prose-td:border prose-td:border-gray-200 prose-td:p-3 prose-td:text-gray-700"
              style={{
                fontSize: '16px',
                lineHeight: '1.6',
                fontFamily: '"Inter", "Segoe UI", "Noto Sans Devanagari", sans-serif'
              }}
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center flex-wrap gap-2">
              <Tag className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500 mr-2">Tags:</span>
              {article.tags.map((tag, index) => (
                <Badge key={`${tag}-${index}`} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </article>

      <Separator className="my-12" />

      {/* Related Articles */}
      {relatedArticles && relatedArticles.length > 1 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedArticles
              .filter((related) => related.id !== article.id)
              .slice(0, 3)
              .map((relatedArticle) => (
                <ArticleCard key={relatedArticle.id} article={relatedArticle} />
              ))}
          </div>
        </section>
      )}
    </div>
  );
}
