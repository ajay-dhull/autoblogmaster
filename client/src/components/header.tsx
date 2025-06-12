import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, X, Globe, TrendingUp, Search, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function Header() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['/api/articles/search', searchQuery],
    queryFn: () => api.searchArticles(searchQuery),
    enabled: searchQuery.length > 2,
  });

  const navigation = [
    { name: "Home", href: "/" },
    { name: "News", href: "/blog" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isActiveLink = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      scrolled 
        ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50" 
        : "bg-white/90 backdrop-blur-sm"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer group">
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white p-2.5 rounded-xl font-bold shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <Globe className="h-6 w-6" />
                </div>
                <div className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full p-1 animate-pulse">
                  <TrendingUp className="h-3 w-3" />
                </div>
              </div>
              <div className="group-hover:scale-105 transition-transform duration-300">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">
                  NewsHub
                </span>
                <div className="text-xs text-gray-500 font-medium -mt-1">Premium News Portal</div>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navigation.map((item, index) => (
              <Link key={item.name} href={item.href}>
                <div
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg group overflow-hidden cursor-pointer ${
                    isActiveLink(item.href)
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    animation: 'slideInDown 0.5s ease-out forwards'
                  }}
                >
                  {item.name}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 ${
                    isActiveLink(item.href) ? "w-full" : "w-0 group-hover:w-full"
                  }`}></span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-purple-600/0 group-hover:from-blue-600/5 group-hover:to-purple-600/5 transition-all duration-300"></div>
                </div>
              </Link>
            ))}
          </nav>

          {/* Search & Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="relative">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-300"
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 transition-colors duration-300" />
              </div>
              
              {/* Search Results Dropdown */}
              {searchQuery.length > 2 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-96 overflow-y-auto z-50 animate-in slide-in-from-top-2 duration-300">
                  {isSearching ? (
                    <div className="p-4 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2">Searching...</p>
                    </div>
                  ) : searchResults && searchResults.length > 0 ? (
                    searchResults.map((article, index) => (
                      <Link key={article.id} href={`/article/${article.slug}`}>
                        <div 
                          className="p-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer transition-all duration-200 hover:translate-x-1"
                          style={{ animationDelay: `${index * 0.05}s` }}
                        >
                          <h4 className="font-medium text-sm text-gray-900">{article.title}</h4>
                          <p className="text-xs text-blue-600 mt-1 font-medium">{article.category}</p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">No articles found</div>
                  )}
                </div>
              )}
            </div>

            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
            </Button>

            <Button 
              variant="default" 
              size="sm" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Subscribe
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative"
            >
              <div className={`transition-all duration-300 ${isMenuOpen ? 'rotate-180' : ''}`}>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </div>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-500 overflow-hidden ${
          isMenuOpen ? 'max-h-96 pb-4' : 'max-h-0'
        }`}>
          <nav className="flex flex-col space-y-1 pt-4">
            {navigation.map((item, index) => (
              <Link key={item.name} href={item.href}>
                <a
                  className={`block px-4 py-3 text-sm font-medium transition-all duration-300 rounded-lg ${
                    isActiveLink(item.href)
                      ? "text-blue-600 bg-blue-50 border-l-4 border-blue-600"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    transform: isMenuOpen ? 'translateX(0)' : 'translateX(-20px)',
                    opacity: isMenuOpen ? 1 : 0,
                    transition: 'all 0.3s ease-out'
                  }}
                >
                  {item.name}
                </a>
              </Link>
            ))}
            
            {/* Mobile Search */}
            <div className="pt-4 px-2">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 bg-gray-50"
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="pt-2 px-2">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                Subscribe Now
              </Button>
            </div>
          </nav>
        </div>
      </div>


    </header>
  );
}