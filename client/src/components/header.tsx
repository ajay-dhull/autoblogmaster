import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";

export default function Header() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top when navigating to a new page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

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
                <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-black text-white p-2.5 rounded-xl font-bold shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <Globe className="h-6 w-6" />
                </div>
                <div className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full p-1 animate-pulse">
                  <TrendingUp className="h-3 w-3" />
                </div>
              </div>
              <div className="group-hover:scale-105 transition-transform duration-300">
                <span className="text-2xl font-bold bg-gradient-to-r from-slate-800 via-slate-900 to-black bg-clip-text text-transparent">
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
                      ? "text-slate-800 bg-slate-50"
                      : "text-gray-700 hover:text-slate-800 hover:bg-gray-50"
                  }`}
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    animation: 'slideInDown 0.5s ease-out forwards'
                  }}
                >
                  {item.name}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-slate-800 to-black transition-all duration-300 ${
                    isActiveLink(item.href) ? "w-full" : "w-0 group-hover:w-full"
                  }`}></span>
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-800/0 to-black/0 group-hover:from-slate-800/5 group-hover:to-black/5 transition-all duration-300"></div>
                </div>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Button 
              variant="default" 
              size="sm" 
              className="bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
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
                <div
                  className={`block px-4 py-3 text-sm font-medium transition-all duration-300 rounded-lg cursor-pointer ${
                    isActiveLink(item.href)
                      ? "text-slate-800 bg-slate-50 border-l-4 border-slate-800"
                      : "text-gray-700 hover:text-slate-800 hover:bg-gray-50"
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
                </div>
              </Link>
            ))}

            <div className="pt-2 px-2">
              <Button className="w-full bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white">
                Subscribe Now
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}