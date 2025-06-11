import { apiRequest } from "./queryClient";
import type { Article, Contact, InsertContact } from "@shared/schema";

export const api = {
  // Articles
  getArticles: async (limit = 20, offset = 0, category?: string): Promise<Article[]> => {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });
    
    if (category && category !== 'all') {
      params.append('category', category);
    }
    
    const response = await apiRequest('GET', `/api/articles?${params}`);
    return response.json();
  },

  getFeaturedArticles: async (): Promise<Article[]> => {
    const response = await apiRequest('GET', '/api/articles/featured');
    return response.json();
  },

  getArticleBySlug: async (slug: string): Promise<Article> => {
    const response = await apiRequest('GET', `/api/articles/${slug}`);
    return response.json();
  },

  searchArticles: async (query: string): Promise<Article[]> => {
    const response = await apiRequest('GET', `/api/articles/search?q=${encodeURIComponent(query)}`);
    return response.json();
  },

  getArticlesByCategory: async (category: string): Promise<Article[]> => {
    const response = await apiRequest('GET', `/api/categories/${category}`);
    return response.json();
  },

  // Contact
  submitContact: async (contact: InsertContact): Promise<Contact> => {
    const response = await apiRequest('POST', '/api/contact', contact);
    return response.json();
  },

  // Content Generation
  generateContent: async (source: string): Promise<{ articles: Article[]; message: string }> => {
    const response = await apiRequest('POST', '/api/generate-content', { source });
    return response.json();
  },
};
