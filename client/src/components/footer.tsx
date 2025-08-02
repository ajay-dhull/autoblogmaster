import { Link } from "wouter";
import {
  Globe,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
  ArrowUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "News", href: "/blog" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  // 🔄 Updated to match Blog.tsx exactly:
  const categories = [
    "World News",
    "Technology",
    "Educational",
    "Trending",
  ];

  const socialLinks = [
    {
      icon: Twitter,
      href: "https://x.com/NeuraXon_?t=K4WvDQ4sHvGYnCLA2ahrPg&s=09",
      color: "hover:text-blue-400",
    },
    {
      icon: Facebook,
      href: "https://www.facebook.com/share/1LCDmzvD3U/",
      color: "hover:text-blue-600",
    },
    {
      icon: Instagram,
      href: "https://www.instagram.com/haryanvi__jaat_22/",
      color: "hover:text-pink-500",
    },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/ajay-dhull-872746255/",
      color: "hover:text-blue-700",
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-slate-500 to-gray-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-gray-500 to-zinc-500 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Company Info */}
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 text-white p-2.5 rounded-xl shadow-lg">
                    <Globe className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-slate-300 via-gray-300 to-zinc-300 bg-clip-text text-transparent">
                      NewsHub
                    </span>
                    <div className="text-xs text-gray-400 font-medium">
                      Premium News Portal
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Your trusted source for global news, expert analysis, and
                  trending topics. Delivering comprehensive coverage from
                  verified sources worldwide.
                </p>
                {/* Contact Info */}
                <div className="space-y-3 text-gray-300">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-3 text-slate-400" />
                    contact.neuraxon@gmail.com
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-3 text-slate-400" />
                    +91 8708327670 (WhatsApp only)
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-3 text-slate-400" />
                    Kaithal, Haryana 136027, India
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-lg font-bold mb-6">Quick Links</h4>
                <ul className="space-y-3 text-gray-300">
                  {quickLinks.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href}>
                        <div className="group cursor-pointer">
                          <span className="relative hover:text-slate-300 transition-colors duration-300">
                            {link.name}
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-slate-400 group-hover:w-full transition-all duration-300" />
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-lg font-bold mb-6">Categories</h4>
                <ul className="space-y-3 text-gray-300">
                  {categories.map((cat) => (
                    <li key={cat}>
                      <Link href={`/blog?category=${encodeURIComponent(cat)}`}>
                        <div className="group cursor-pointer">
                          <span className="relative hover:text-slate-300 transition-colors duration-300">
                            {cat}
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-slate-400 group-hover:w-full transition-all duration-300" />
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Social & Connect */}
              <div>
                <h4 className="text-lg font-bold mb-6">Connect With Us</h4>
                <p className="text-sm text-gray-300 mb-6">
                  Follow us on social media for real-time updates and breaking
                  news.
                </p>
                <div className="flex space-x-4 mb-6">
                  {socialLinks.map((social, i) => (
                    <a
                      key={i}
                      href={social.href}
                      className={`p-3 bg-white/10 backdrop-blur-sm rounded-lg transition-transform duration-300 hover:scale-110 hover:bg-white/20 ${social.color}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <social.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700/50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 NewsHub. All rights reserved.
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/privacy">
                <div className="text-gray-400 hover:text-slate-300 text-sm transition-colors duration-300 cursor-pointer">
                  Privacy Policy
                </div>
              </Link>
              <Link href="/terms">
                <div className="text-gray-400 hover:text-slate-300 text-sm transition-colors duration-300 cursor-pointer">
                  Terms of Service
                </div>
              </Link>
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
    </footer>
  );
}
