import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ArticleCard from "@/components/article-card";
import { api } from "@/lib/api";
import SpinWheel from "@/components/SpinWheel";
import Seo from "@/components/Seo";

import {
  Calendar,
  Clock,
  Tag,
  ArrowLeft,
  ExternalLink,
  Facebook,
  Twitter,
  Linkedin
} from "lucide-react";

export default function Article() {
  const [, params] = useRoute("/article/:slug");
  const slug = params?.slug;

  // ❌ Prevent invalid-slug pages (fix Soft 404)
  if (!slug || slug === "undefined") {
    return (
      <>
        {/* Mark invalid pages as noindex so search engines don't treat them as soft-404 */}
        <Seo
          title="Invalid Article | NewsHubNow"
          description="The article link is invalid."
          noindex={true}
          canonical="https://newshubnow.in/blog"
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Invalid Article Link</h1>
            <p className="text-gray-600 mb-6">
              The article you're looking for is invalid or does not exist.
            </p>
            <Link href="/blog">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  const { data: article, isLoading, error } = useQuery({
    queryKey: ["/api/articles", slug],
    queryFn: () => api.getArticleBySlug(slug!),
    enabled: !!slug,
  });

  const { data: relatedArticles } = useQuery({
    queryKey: ["/api/categories", article?.category],
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

        {/* Static fallback for crawlers */}
        <noscript>
          <article>
            <h1 className="text-2xl font-bold">Sample Article Title</h1>
            <p className="mt-2 text-gray-700">
              This is a static excerpt or first paragraph to ensure crawlers see real content.
            </p>
          </article>
        </noscript>
      </div>
    );
  }

  if (error || !article) {
    return (
      <>
        {/* If article not found, mark noindex — prevents soft 404 indexing */}
        <Seo
          title="Article Not Found | NewsHubNow"
          description="The requested article was not found."
          noindex={true}
          canonical="https://newshubnow.in/blog"
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-6">
              The article you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/blog">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

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

  const formatDate = (date: Date | string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(" ").length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  // Safe share values
  const shareUrl = typeof window !== "undefined" ? window.location.href : `https://newshubnow.in/article/${article.slug}`;
  const shareText = article?.title ? `Check out this article: ${article.title}` : "Check out this article";

  const handleShare = (platform: string) => {
    let url = "";
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);
    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
    }
    if (url) window.open(url, '_blank', 'width=600,height=400');
  };

  // Render article page with Seo component
  return (
    <>
      <Seo
        title={`${article.title} | NewsHubNow`}
        description={article.excerpt || article.title}
        canonical={`https://newshubnow.in/article/${article.slug}`}
        ogUrl={shareUrl}
      />

      {/* JSON-LD structured data for NewsArticle */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": shareUrl
          },
          "headline": article.title,
          "description": article.excerpt,
          "image": article.featuredImage ? [article.featuredImage] : (article.image ? [article.image] : []),
          "datePublished": new Date(article.publishedAt).toISOString(),
          "dateModified": new Date(article.updatedAt || article.publishedAt).toISOString(),
          "author": { "@type": "Person", "name": article.author || "NewsHubNow" },
          "publisher": {
            "@type": "Organization",
            "name": "NewsHubNow",
            "logo": {
              "@type": "ImageObject",
              "url": "https://newshubnow.in/assets/icon.png"
            }
          }
        }, null, 2)
      }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/blog">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>

        <article className="mb-12">
          <header className="mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <Badge
                className={`${getCategoryColor(article.category)} text-white px-3 py-1`}
              >
                {article.category}
              </Badge>
              <time
                dateTime={new Date(article.publishedAt).toISOString()}
                className="flex items-center text-gray-500 text-sm"
              >
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(article.publishedAt)}
              </time>
              <div className="flex items-center text-gray-500 text-sm">
                <Clock className="h-4 w-4 mr-1" />
                {estimateReadTime(article.content)} min read
              </div>
            </div>

            <h1 className="text-2xl md:text-4xl font-bold leading-tight mb-4 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600 bg-clip-text text-transparent text-gray-900">{article.title}</h1>

            <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-6 font-light">
              {article.excerpt}
            </p>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl" />
                <div>
                  <p className="font-medium">{article.source}</p>
                  {article.sourceUrl && (
                    <a
                      href={article.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center"
                      aria-label="View original article on source website"
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
                  aria-label="Share on Twitter"
                  onClick={() => handleShare("twitter")}
                >
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  aria-label="Share on Facebook"
                  onClick={() => handleShare("facebook")}
                >
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  aria-label="Share on LinkedIn"
                  onClick={() => handleShare("linkedin")}
                >
                  <Linkedin className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>

          {article.featuredImage && (
            <div className="mb-12">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src={article.featuredImage}
                  alt={article.title}
                  loading="lazy"
                  className="w-full h-[500px] object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>
          )}

          <div className="article-content bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-8 md:p-12">
              <div
                className="prose prose-lg prose-slate max-w-none"
                style={{ fontSize: '16px', lineHeight: '1.6', fontFamily: '"Inter", "Segoe UI", "Noto Sans Devanagari", sans-serif' }}
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>
          </div>

          {article.tags?.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center flex-wrap gap-2">
                <Tag className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500 mr-2">Tags:</span>
                {article.tags.map((tag, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </article>

        <Separator className="my-12" />

        {/* Related Articles */}
        {relatedArticles?.length > 1 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles
                .filter((r) => r.id !== article.id)
                .slice(0, 4)
                .map((r) => (
                  <ArticleCard key={r.id} article={r} />
                ))}
            </div>
            <Link href={`/blog?category=${encodeURIComponent(article.category)}`}>
              <Button className="mt-6">View All in {article.category}</Button>
            </Link>
          </section>
        )}

        {/* SPIN WHEEL after related stories */}
        <div className="mt-12">
          <SpinWheel />
        </div>
      </div>
    </>
  );
}
