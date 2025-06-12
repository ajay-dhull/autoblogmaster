import { Link } from "wouter";
import { Globe, Mail, Phone, MapPin, Twitter, Linkedin, Github, Facebook, Instagram, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "News", href: "/blog" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const categories = [
    "World News",
    "Technology", 
    "Education",
    "Trending Topics",
  ];

  const socialLinks = [
    { icon: Twitter, href: "#", color: "hover:text-blue-400" },
    { icon: Facebook, href: "#", color: "hover:text-blue-600" },
    { icon: Instagram, href: "#", color: "hover:text-pink-500" },
    { icon: Linkedin, href: "#", color: "hover:text-blue-700" },
    { icon: Github, href: "#", color: "hover:text-gray-600" }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Newsletter Section */}
        <div className="border-b border-gray-700/50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Stay Informed
              </h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Get the latest news and insights delivered to your inbox. Join thousands of readers worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 font-semibold">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              
              {/* Company Info */}
              <div className="lg:col-span-1">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white p-2.5 rounded-xl shadow-lg">
                    <Globe className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                      NewsHub
                    </span>
                    <div className="text-xs text-gray-400 font-medium">Premium News Portal</div>
                  </div>
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Your trusted source for global news, expert analysis, and trending topics. 
                  Delivering comprehensive coverage from verified sources worldwide.
                </p>
                
                {/* Contact Info */}
                <div className="space-y-3">
                  <div className="flex items-center text-gray-300">
                    <Mail className="h-4 w-4 mr-3 text-blue-400" />
                    <span className="text-sm">contact@newshub.com</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Phone className="h-4 w-4 mr-3 text-blue-400" />
                    <span className="text-sm">+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <MapPin className="h-4 w-4 mr-3 text-blue-400" />
                    <span className="text-sm">Global Headquarters</span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-lg font-bold mb-6 text-white">Quick Links</h4>
                <ul className="space-y-3">
                  {quickLinks.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href}>
                        <div className="text-gray-300 hover:text-blue-400 transition-colors duration-300 cursor-pointer group">
                          <span className="relative">
                            {link.name}
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                  <li>
                    <div className="text-gray-300 hover:text-blue-400 transition-colors duration-300 cursor-pointer group">
                      <span className="relative">
                        Privacy Policy
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                      </span>
                    </div>
                  </li>
                  <li>
                    <div className="text-gray-300 hover:text-blue-400 transition-colors duration-300 cursor-pointer group">
                      <span className="relative">
                        Terms of Service
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                      </span>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-lg font-bold mb-6 text-white">Categories</h4>
                <ul className="space-y-3">
                  {categories.map((category) => (
                    <li key={category}>
                      <Link href={`/blog?category=${encodeURIComponent(category)}`}>
                        <div className="text-gray-300 hover:text-blue-400 transition-colors duration-300 cursor-pointer group">
                          <span className="relative">
                            {category}
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Social & Connect */}
              <div>
                <h4 className="text-lg font-bold mb-6 text-white">Connect With Us</h4>
                <p className="text-gray-300 mb-6 text-sm">
                  Follow us on social media for real-time updates and breaking news.
                </p>
                
                {/* Social Links */}
                <div className="flex space-x-4 mb-6">
                  {socialLinks.map((social, index) => {
                    const IconComponent = social.icon;
                    return (
                      <a
                        key={index}
                        href={social.href}
                        className={`p-3 bg-white/10 backdrop-blur-sm rounded-lg transition-all duration-300 hover:scale-110 hover:bg-white/20 ${social.color}`}
                      >
                        <IconComponent className="h-5 w-5" />
                      </a>
                    );
                  })}
                </div>

                {/* Mobile App */}
                <div className="space-y-3">
                  <p className="text-sm font-medium text-white">Download Our App</p>
                  <div className="space-y-2">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 cursor-pointer hover:bg-white/20 transition-all duration-300">
                      <div className="text-xs text-gray-300">Available on</div>
                      <div className="text-sm font-semibold text-white">App Store & Google Play</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700/50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2025 NewsHub. All rights reserved. Powered by cutting-edge journalism.
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="text-gray-400 text-sm">
                  Made with ❤️ for informed readers
                </div>
                <Button
                  onClick={scrollToTop}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white hover:bg-white/10 p-2"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}