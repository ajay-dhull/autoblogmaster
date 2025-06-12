import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Globe, 
  MapPin, 
  MessageCircle, 
  Search, 
  Brain, 
  RefreshCw, 
  Zap,
  TrendingUp,
  BookOpen,
  Newspaper
} from "lucide-react";

interface ContentSource {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  estimatedArticles: string;
  apiStatus: "active" | "inactive";
}

const contentSources: ContentSource[] = [
  {
    id: "newsapi",
    name: "NewsAPI",
    description: "Global news headlines from trusted sources worldwide",
    icon: Globe,
    category: "World News",
    estimatedArticles: "2-4 articles",
    apiStatus: "active"
  },
  {
    id: "gnews",
    name: "GNews",
    description: "Indian news and regional updates with local context",
    icon: MapPin,
    category: "India News", 
    estimatedArticles: "2-4 articles",
    apiStatus: "active"
  },
  {
    id: "reddit",
    name: "Reddit",
    description: "Viral content and trending discussions from popular subreddits",
    icon: MessageCircle,
    category: "Viral/Trending",
    estimatedArticles: "1-2 articles",
    apiStatus: "active"
  },
  {
    id: "serpapi",
    name: "SerpAPI",
    description: "Search trends and technology insights from Google results",
    icon: Search,
    category: "Technology",
    estimatedArticles: "1-2 articles", 
    apiStatus: "inactive"
  },
  {
    id: "groq",
    name: "AI Educational",
    description: "Comprehensive educational content on trending topics",
    icon: Brain,
    category: "Educational",
    estimatedArticles: "2-3 articles",
    apiStatus: "active"
  }
];

export default function ContentGenerator() {
  const [generatingSource, setGeneratingSource] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const generateContentMutation = useMutation({
    mutationFn: async (source: string) => {
      const response = await fetch(`/api/generate-content`, {
        method: "POST",
        body: JSON.stringify({ source }),
        headers: { "Content-Type": "application/json" }
      });
      return response.json();
    },
    onSuccess: (data, source) => {
      toast({
        title: "Content Generated Successfully!",
        description: `Generated ${data.articles?.length || 0} new articles from ${contentSources.find(s => s.id === source)?.name}`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
      setGeneratingSource(null);
    },
    onError: (error, source) => {
      toast({
        title: "Generation Failed",
        description: `Failed to generate content from ${contentSources.find(s => s.id === source)?.name}. Please try again.`,
        variant: "destructive",
      });
      setGeneratingSource(null);
    },
  });

  const generateAllMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/generate-content`, {
        method: "POST",
        body: JSON.stringify({ source: "all" }),
        headers: { "Content-Type": "application/json" }
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Bulk Generation Complete!",
        description: `Successfully generated content from all active sources`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
    },
    onError: () => {
      toast({
        title: "Bulk Generation Failed",
        description: "Some sources may have failed. Check individual sources.",
        variant: "destructive",
      });
    },
  });

  const handleGenerateContent = (sourceId: string) => {
    setGeneratingSource(sourceId);
    generateContentMutation.mutate(sourceId);
  };

  const handleGenerateAll = () => {
    generateAllMutation.mutate();
  };

  const isGenerating = generatingSource !== null || generateAllMutation.isPending;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Content Generator</h1>
        <p className="text-gray-600">
          Generate high-quality articles from multiple sources using AI enhancement
        </p>
      </div>

      {/* Bulk Actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Bulk Actions
          </CardTitle>
          <CardDescription>
            Generate content from all active sources at once
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleGenerateAll}
            disabled={isGenerating}
            size="lg"
            className="w-full sm:w-auto"
          >
            {generateAllMutation.isPending ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating from All Sources...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate from All Active Sources
              </>
            )}
          </Button>
          <p className="text-sm text-gray-500 mt-2">
            This will generate content from NewsAPI, GNews, Reddit, and AI Educational sources
          </p>
        </CardContent>
      </Card>

      <Separator className="mb-8" />

      {/* Individual Sources */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Individual Sources</h2>
        <p className="text-gray-600 mb-6">
          Generate content from specific sources with detailed control
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contentSources.map((source) => {
          const Icon = source.icon;
          const isCurrentlyGenerating = generatingSource === source.id;
          const isDisabled = isGenerating || source.apiStatus === "inactive";

          return (
            <Card 
              key={source.id} 
              className={`transition-all duration-200 ${
                source.apiStatus === "inactive" 
                  ? "opacity-60" 
                  : "hover:shadow-md"
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      source.apiStatus === "active" 
                        ? "bg-primary text-white" 
                        : "bg-gray-200 text-gray-500"
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{source.name}</CardTitle>
                      <Badge 
                        variant={source.apiStatus === "active" ? "default" : "secondary"}
                        className="mt-1"
                      >
                        {source.apiStatus === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 text-sm">
                  {source.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Category:</span>
                    <span className="text-gray-600">{source.category}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4 text-green-500" />
                    <span className="font-medium">Output:</span>
                    <span className="text-gray-600">{source.estimatedArticles}</span>
                  </div>
                </div>

                <Button
                  onClick={() => handleGenerateContent(source.id)}
                  disabled={isDisabled}
                  className="w-full"
                  variant={source.apiStatus === "active" ? "default" : "outline"}
                >
                  {isCurrentlyGenerating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Newspaper className="mr-2 h-4 w-4" />
                      {source.apiStatus === "active" ? "Generate Content" : "API Inactive"}
                    </>
                  )}
                </Button>

                {source.apiStatus === "inactive" && source.id === "serpapi" && (
                  <p className="text-xs text-orange-600 mt-2">
                    SerpAPI key required for activation
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Info Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Content Generation Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">How it works:</h4>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>Each source fetches latest content from their respective APIs</li>
              <li>Raw content is enhanced using advanced AI for better readability</li>
              <li>Articles are automatically categorized and tagged</li>
              <li>SEO-optimized titles and meta descriptions are generated</li>
              <li>High-quality images are sourced from Unsplash/Pexels</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Content Quality Features:</h4>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>Professional AI rewriting with 800-1200 word articles</li>
              <li>Proper HTML formatting with headings and lists</li>
              <li>Contextual information and background details</li>
              <li>Expert analysis and actionable insights</li>
              <li>SEO optimization for better search rankings</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}