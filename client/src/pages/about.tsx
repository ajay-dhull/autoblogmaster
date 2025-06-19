import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, 
  Award, 
  Users, 
  Clock, 
  Shield, 
  Target, 
  Heart,
  TrendingUp,
  BookOpen,
  Zap,
  CheckCircle,
  Star,
  ArrowRight,
  Monitor,
  Smartphone,
  Play
} from "lucide-react";
import { Link } from "wouter";
import aboutHeroSvg from "../assets/about-hero.svg";

export default function About() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Auto-rotate demo images
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(timer);
  }, []);
  const features = [
    {
      title: "Global News Coverage",
      description: "Comprehensive reporting from every corner of the world with real-time updates and breaking news alerts.",
      icon: Globe,
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "Expert Journalism",
      description: "Our team of seasoned journalists and analysts provide in-depth coverage and professional commentary.",
      icon: Award,
      color: "bg-purple-50 text-purple-600"
    },
    {
      title: "Real-Time Updates",
      description: "Stay ahead with instant notifications and live coverage of major events as they unfold.",
      icon: Clock,
      color: "bg-green-50 text-green-600"
    },
    {
      title: "Verified Sources",
      description: "All content is fact-checked and sourced from trusted, verified news outlets and official channels.",
      icon: Shield,
      color: "bg-orange-50 text-orange-600"
    },
    {
      title: "Diverse Perspectives",
      description: "Multiple viewpoints and comprehensive analysis to help you understand the complete picture.",
      icon: Users,
      color: "bg-red-50 text-red-600"
    },
    {
      title: "Technology Focus",
      description: "Dedicated coverage of tech trends, innovations, and their impact on society and business.",
      icon: Zap,
      color: "bg-indigo-50 text-indigo-600"
    }
  ];

  const values = [
    {
      title: "Accuracy",
      description: "We prioritize factual reporting and rigorous fact-checking in every story we publish.",
      icon: Target
    },
    {
      title: "Transparency",
      description: "Open about our sources, methodology, and editorial processes to maintain reader trust.",
      icon: CheckCircle
    },
    {
      title: "Independence",
      description: "Editorial independence ensures unbiased reporting free from external influence.",
      icon: Shield
    },
    {
      title: "Innovation",
      description: "Leveraging cutting-edge technology to deliver news in engaging and accessible formats.",
      icon: Zap
    }
  ];

  const stats = [
    { value: "50K+", label: "Daily Readers", icon: Users },
    { value: "25+", label: "Countries Covered", icon: Globe },
    { value: "100+", label: "Expert Contributors", icon: Star },
    { value: "2K+", label: "Articles Published", icon: BookOpen }
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "Editor-in-Chief",
      bio: "Award-winning journalist with 15+ years in international reporting",
      expertise: ["Global Politics", "International Relations"]
    },
    {
      name: "Michael Chen",
      role: "Technology Editor",
      bio: "Tech industry veteran covering innovation and digital transformation",
      expertise: ["AI & Technology", "Startups", "Digital Trends"]
    },
    {
      name: "Dr. Priya Sharma",
      role: "Education Correspondent", 
      bio: "Former academic with expertise in education policy and research",
      expertise: ["Education Policy", "Research", "Academic Trends"]
    },
    {
      name: "David Rodriguez",
      role: "Business Analyst",
      bio: "Financial journalist specializing in market analysis and economic trends",
      expertise: ["Market Analysis", "Economics", "Business Strategy"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 pt-16">
      {/* Hero Section with Image */}
      <section className="relative min-h-screen lg:h-[80vh] overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-gray-900/85 to-black/85 z-10"></div>
          <img 
            src={aboutHeroSvg} 
            alt="Professional News Platform" 
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-600/10 via-gray-600/10 to-zinc-700/10">
            {/* Enhanced Professional Elements */}
            <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-48 h-48 sm:w-80 sm:h-80 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-20 min-h-screen lg:h-full flex items-center py-20 lg:py-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              
              {/* Left Side - Text Content */}
              <div className={`text-white transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                <div className="inline-flex items-center bg-gradient-to-r from-slate-700 to-slate-800 text-white px-4 py-2 rounded-full text-sm font-bold mb-6 animate-pulse">
                  <Globe className="h-4 w-4 mr-2" />
                  ABOUT US
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
                  Excellence in
                  <span className="block bg-gradient-to-r from-slate-200 via-white to-slate-100 bg-clip-text text-transparent">
                    Digital Journalism
                  </span>
                </h1>
                
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-6 sm:mb-8 leading-relaxed max-w-4xl">
                  Delivering world-class journalism through cutting-edge technology and uncompromising editorial standards. 
                  We connect millions of readers to the stories that matter most, backed by rigorous fact-checking and 
                  real-time global coverage.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 max-w-4xl">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">24/7</div>
                    <div className="text-sm text-gray-400">Live Coverage</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">150+</div>
                    <div className="text-sm text-gray-400">Global Sources</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">2M+</div>
                    <div className="text-sm text-gray-400">Monthly Readers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">99.9%</div>
                    <div className="text-sm text-gray-400">Accuracy Rate</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Link href="/blog">
                    <Button size="lg" className="bg-white text-slate-900 hover:bg-gray-100 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 w-full sm:w-auto">
                      <BookOpen className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      Read Our Stories
                      <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-slate-900 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold transition-all duration-300 w-full sm:w-auto bg-transparent">
                      Get In Touch
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Side - Enhanced News Platform Demo */}
              <div className={`relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-2xl">
                  {/* Main Platform Display */}
                  <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-xl p-4 sm:p-6 relative overflow-hidden h-80 sm:h-96">
                    {/* Platform Header */}
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                          <Globe className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
                        </div>
                        <span className="font-bold text-gray-900 text-sm sm:text-base">NewsHub</span>
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                      </div>
                    </div>

                    {/* Navigation Bar */}
                    <div className="flex flex-wrap gap-2 sm:gap-4 mb-4 sm:mb-6 text-xs sm:text-sm">
                      <span className="bg-blue-600 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-lg">Breaking</span>
                      <span className="text-gray-600 hover:text-blue-600 cursor-pointer">World</span>
                      <span className="text-gray-600 hover:text-blue-600 cursor-pointer">Tech</span>
                      <span className="text-gray-600 hover:text-blue-600 cursor-pointer hidden sm:inline">Sports</span>
                    </div>

                    {/* Demo Articles Grid */}
                    <div className="space-y-2 sm:space-y-3">
                      {[
                        { title: "Breaking: Global News Update", category: "World", time: "2 min ago" },
                        { title: "Technology Innovation Report", category: "Tech", time: "5 min ago" },
                        { title: "Economic Markets Analysis", category: "Business", time: "8 min ago" },
                      ].map((article, index) => (
                        <div 
                          key={index}
                          className={`flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-white rounded-lg shadow-sm transition-all duration-500 hover:shadow-md ${
                            currentImageIndex === index ? 'ring-1 sm:ring-2 ring-blue-500' : ''
                          }`}
                          style={{ animationDelay: `${index * 0.2}s` }}
                        >
                          <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            {index === 0 && <Globe className="h-4 w-4 sm:h-6 sm:w-6 text-white" />}
                            {index === 1 && <Zap className="h-4 w-4 sm:h-6 sm:w-6 text-white" />}
                            {index === 2 && <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-white" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 text-xs sm:text-sm truncate">{article.title}</h4>
                            <div className="flex items-center space-x-1 sm:space-x-2 text-xs text-gray-500">
                              <span className="truncate">{article.category}</span>
                              <span>•</span>
                              <span className="whitespace-nowrap">{article.time}</span>
                            </div>
                          </div>
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
                        </div>
                      ))}
                    </div>

                    {/* Device Showcase Icons */}
                    <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 flex space-x-1 sm:space-x-2">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                        <Monitor className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                      </div>
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                        <Smartphone className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Floating Elements */}
                  <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-bold animate-pulse shadow-lg">
                    <div className="flex items-center space-x-1">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-ping"></div>
                      <span className="text-xs">LIVE</span>
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -left-2 sm:-bottom-3 sm:-left-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium shadow-lg">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      <span className="text-xs">24/7</span>
                    </div>
                  </div>
                  <div className="absolute top-3 -left-2 sm:top-4 sm:-left-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium shadow-lg">
                    <div className="flex items-center space-x-1">
                      <Users className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      <span className="text-xs hidden sm:inline">2M+ Readers</span>
                      <span className="text-xs sm:hidden">2M+</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center group hover:scale-105 transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-4 group-hover:shadow-xl transition-all duration-300">
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
              Our Mission
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                To empower informed decision-making by delivering accurate, comprehensive, and timely news coverage 
                that helps our readers understand and navigate an increasingly complex world.
              </p>
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="flex items-center justify-center mb-6">
                    <Heart className="h-12 w-12 text-red-500" />
                  </div>
                  <p className="text-lg text-gray-700 italic">
                    "In an era of information overload, we believe in the power of quality journalism 
                    to cut through the noise and deliver what matters most to our readers."
                  </p>
                  <p className="text-sm text-gray-500 mt-4 font-medium">- NewsHub Editorial Team</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
              What Sets Us Apart
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the features and principles that make NewsHub your go-to source for reliable news and insights.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="animate-in slide-in-from-bottom-4 duration-700"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <Card className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white border-0 overflow-hidden h-full">
                    <CardContent className="p-6 lg:p-8">
                      <div className={`inline-flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 rounded-xl ${feature.color} mb-4 lg:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <IconComponent className="h-6 w-6 lg:h-8 lg:w-8" />
                      </div>
                      <h3 className="text-lg lg:text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-sm lg:text-base text-gray-600 leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do, from editorial decisions to reader engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-gray-50 border-0">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4">
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <IconComponent className="h-8 w-8" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                          {value.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">{value.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50/30 to-purple-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
              Meet Our Editorial Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experienced journalists and analysts dedicated to bringing you accurate, insightful news coverage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white border-0 text-center">
                <CardContent className="p-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold group-hover:scale-110 transition-transform duration-300">
                    {member.name.charAt(0)}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{member.name}</h3>
                  <p className="text-blue-600 font-semibold mb-4">{member.role}</p>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{member.bio}</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.expertise.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Join Our Community
          </h2>
          <p className="text-xl mb-8 text-blue-100 leading-relaxed">
            Become part of a growing community of informed readers who value quality journalism and in-depth analysis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/blog">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold hover:scale-105 transition-all duration-300">
                <TrendingUp className="mr-2 h-5 w-5" />
                Start Reading
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold hover:scale-105 transition-all duration-300 bg-transparent">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-white/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
      </section>
    </div>
  );
}