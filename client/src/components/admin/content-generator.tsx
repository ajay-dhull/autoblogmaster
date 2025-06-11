import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Globe, Flag, GraduationCap, TrendingUp, Search, Zap } from "lucide-react";

const contentSources = [
  {
    id: "newsapi",
    name: "World News",
    description: "2 articles from NewsAPI covering global leaders and trending topics",
    icon: Globe,
    color: "bg-blue-100 text-blue-600",
    schedule: "8:00 AM",
  },
  {
    id: "gnews",
    name: "Indian News", 
    description: "3 articles about India trends, government updates, and major events",
    icon: Flag,
    color: "bg-orange-100 text-orange-600",
    schedule: "12:00 PM",
  },
  {
    id: "groq",
    name: "Educational Content",
    description: "2 informative articles on AI tools, online earning, and inspiration",
    icon: GraduationCap,
    color: "bg-green-100 text-green-600",
    schedule: "3:00 PM",
  },
  {
    id: "reddit",
    name: "Viral Content",
    description: "1 article based on top trending Reddit discussions",
    icon: TrendingUp,
    color: "bg-red-100 text-red-600",
    schedule: "6:00 PM",
  },
  {
    id: "serpapi",
    name: "Trending Topics",
    description: "2 articles based on search trends and latest technology",
    icon: Search,
    color: "bg-purple-100 text-purple-600",
    schedule: "9:00 PM",
  },
];

export default function ContentGenerator() {
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const generateMutation = useMutation({
    mutationFn: (source: string) => api.generateContent(source),
    onSuccess: (data, source) => {
      toast({
        title: "Content Generated Successfully",
        description: `Generated ${data.articles.length} articles from ${source}`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
      queryClient.invalidateQueries({ queryKey: ['/api/articles/featured'] });
    },
    onError: (error, source) => {
      toast({
        title: "Generation Failed",
        description: `Failed to generate content from ${source}. Please try again.`,
        variant: "destructive",
      });
    },
  });

  const handleGenerateAll = async () => {
    setIsGeneratingAll(true);
    try {
      await generateMutation.mutateAsync("all");
      toast({
        title: "All Content Generated",
        description: "Successfully generated content from all sources",
      });
    } catch (error) {
      toast({
        title: "Generation Failed", 
        description: "Failed to generate all content. Please try individual sources.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingAll(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Content Generator</h2>
          <p className="text-gray-600">Generate fresh content from multiple sources</p>
        </div>
        <Button
          onClick={handleGenerateAll}
          disabled={isGeneratingAll || generateMutation.isPending}
          className="bg-gradient-to-r from-primary to-blue-600"
        >
          {isGeneratingAll ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating All...
            </>
          ) : (
            <>
              <Zap className="mr-2 h-4 w-4" />
              Generate All Content
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contentSources.map((source) => {
          const Icon = source.icon;
          const isLoading = generateMutation.isPending && generateMutation.variables === source.id;

          return (
            <Card key={source.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg ${source.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <Badge variant="outline">{source.schedule}</Badge>
                </div>
                <CardTitle className="text-lg">{source.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 text-sm">{source.description}</p>
                <Button
                  onClick={() => generateMutation.mutate(source.id)}
                  disabled={generateMutation.isPending || isGeneratingAll}
                  variant="outline"
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    `Generate ${source.name}`
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Automation Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Content Generation Status</span>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">API Services</span>
              <Badge className="bg-green-100 text-green-800">Operational</Badge>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">Last Update</span>
              <span className="text-gray-500 text-sm">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
