import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function Header() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['/api/articles/search', searchQuery],
    queryFn: () => api.searchArticles(searchQuery),
    enabled: searchQuery.length > 2,
  });

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isActiveLink = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-2xl font-bold text-primary cursor-pointer">AutoBlog Pro</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <a
                  className={`font-medium transition-colors ${
                    isActiveLink(item.href)
                      ? "text-primary"
                      : "text-gray-600 hover:text-primary"
                  }`}
                >
                  {item.name}
                </a>
              </Link>
            ))}
          </nav>

          {/* Search & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block relative">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4"
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </div>
              
              {/* Search Results Dropdown */}
              {searchQuery.length > 2 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                  {isSearching ? (
                    <div className="p-4 text-center text-gray-500">Searching...</div>
                  ) : searchResults && searchResults.length > 0 ? (
                    searchResults.map((article) => (
                      <Link key={article.id} href={`/article/${article.slug}`}>
                        <div className="p-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer">
                          <h4 className="font-medium text-sm">{article.title}</h4>
                          <p className="text-xs text-gray-500 mt-1">{article.category}</p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">No articles found</div>
                  )}
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 pb-4">
            <nav className="flex flex-col space-y-2 pt-4">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <a
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActiveLink(item.href)
                        ? "text-primary bg-blue-50"
                        : "text-gray-600 hover:text-primary hover:bg-gray-50"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                </Link>
              ))}
            </nav>
            
            {/* Mobile Search */}
            <div className="mt-4 px-3">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4"
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
