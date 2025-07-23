import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
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

export default function About() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const toggleReadMore = () => setShowMore(!showMore);

  // Auto-rotate demo images
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      title: "🔍 Real‑Time Alerts",
      description: "Instant notifications on major breaking events.",
      icon: Clock,
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "🌐 Global Perspective",
      description: "Dedicated correspondents in 25+ countries.",
      icon: Globe,
      color: "bg-purple-50 text-purple-600"
    },
    {
      title: "🛡️ Verified Sources",
      description: "All articles rigorously fact‑checked.",
      icon: Shield,
      color: "bg-green-50 text-green-600"
    },
    {
      title: "📊 In‑Depth Analysis",
      description: "Expert commentary and data‑backed insights.",
      icon: Award,
      color: "bg-orange-50 text-orange-600"
    },
    {
      title: "💡 Tech‑Driven",
      description: "AI‑powered curation for the freshest stories.",
      icon: Zap,
      color: "bg-red-50 text-red-600"
    },
    {
      title: "🤝 Diverse Voices",
      description: "Multiple viewpoints to complete the picture.",
      icon: Users,
      color: "bg-indigo-50 text-indigo-600"
    }
  ];

  const values = [
    {
      title: "Accuracy",
      description: "We hold ourselves to the highest standards of fact‑checking and source verification.",
      icon: Target
    },
    {
      title: "Transparency",
      description: "Open about our methods, corrections, and editorial policies.",
      icon: CheckCircle
    },
    {
      title: "Independence",
      description: "Committed to unbiased reporting, free from outside influence.",
      icon: Shield
    },
    {
      title: "Innovation",
      description: "Leveraging the latest technologies to deliver news in engaging, accessible formats.",
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
      role: "Editor‑in‑Chief",
      bio: "15+ years in global reporting; award‑winning investigative journalist.",
      expertise: ["Global Politics", "International Relations"]
    },
    {
      name: "Michael Chen",
      role: "Technology Editor",
      bio: "Veteran tech commentator covering AI, startups, and digital transformation.",
      expertise: ["AI & Technology", "Startups", "Digital Trends"]
    },
    {
      name: "Dr. Priya Sharma",
      role: "Education Correspondent",
      bio: "Academic specialist in education policy, research, and learning technologies.",
      expertise: ["Education Policy", "Research", "Academic Trends"]
    },
    {
      name: "David Rodriguez",
      role: "Business Analyst",
      bio: "Market strategist with deep expertise in economics and financial trends.",
      expertise: ["Market Analysis", "Economics", "Business Strategy"]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>About - NewsHubNow</title>
        <meta name="description" content="Know more about NewsHubNow – India's fastest-growing AI news site trusted by millions." />
        <meta name="keywords" content="NewsHubNow, digital journalism, news platform, AI news curation, global news coverage, professional journalism" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://newshubnow.in/about" />

        {/* Open Graph Tags */}
        <meta property="og:title" content="About NewsHubNow" />
        <meta property="og:description" content="We deliver news with speed, accuracy and AI power." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://newshubnow.in/about" />
        <meta property="og:image" content="https://newshubnow.in/logo.svg" />

        {/* Twitter Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About NewsHubNow" />
        <meta name="twitter:description" content="We deliver news with speed, accuracy and AI power." />
        <meta name="twitter:image" content="https://newshubnow.in/logo.svg" />
      </Helmet>

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "NewsHubNow",
          "url": "https://newshubnow.in",
          "logo": "https://newshubnow.in/logo.svg",
          "description": "AI-powered news trusted by millions.",
          "sameAs": [
            "https://facebook.com/newshubnow",
            "https://twitter.com/newshubnow"
          ]
        })}
      </script>

      <div className="pt-16">
        {/* Hero Section with Image */}
        <section className="relative min-h-screen lg:min-h-[80vh] overflow-hidden">
          {/* Hero Background Image */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-gray-900/85 to-black/85 z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-600/10 via-gray-600/10 to-zinc-700/10">
              {/* Enhanced Professional Elements with lazy loading */}
              <div
                className="absolute top-10 sm:top-20 left-10 sm:left-20 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"
                style={{ willChange: 'transform' }}
              ></div>
              <div
                className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-48 h-48 sm:w-80 sm:h-80 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"
                style={{ animationDelay: '2s', willChange: 'transform' }}
              ></div>
            </div>
          </div>

          {/* Hero Content */}
          <div className="relative z-20 min-h-screen lg:min-h-full flex items-start lg:items-center py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start lg:items-center">

                {/* Left Side - Text Content */}
                <div className={`text-white transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'} flex flex-col justify-start`}>
                   <div className="flex items-center bg-gradient-to-r from-slate-700 to-slate-800 text-white px-4 py-2 rounded-full text-sm font-bold mb-6 animate-pulse w-fit">
                    <Globe className="h-4 w-4 mr-2" />
                    ABOUT US
                  </div>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
                    Who We Are
                    <span className="block bg-gradient-to-r from-slate-200 via-white to-slate-100 bg-clip-text text-transparent">
                      NewsHub Digital Journalism
                    </span>
                  </h1>

                  <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-6 sm:mb-8 leading-relaxed max-w-4xl transition-all duration-500 ease-in-out">
                    {showMore
                      ? "Founded in 2023, NewsHubNow is redefining digital journalism by fusing artificial intelligence with traditional editorial excellence. We serve over 2 million monthly readers across 150+ countries, delivering breaking news, in-depth analysis, and expert commentary with a 99.9% accuracy rate. Our global team of experienced journalists, powered by advanced AI curation technology, ensures you receive the most important stories as they unfold. From political developments and market trends to technological breakthroughs and social movements, we connect you to the stories that shape our world—accurately, comprehensively, and in real time."
                      : "Founded in 2023, NewsHubNow is redefining digital journalism by fusing artificial intelligence with traditional editorial excellence. We serve over 2 million monthly readers across 150+ countries..."}
                  </p>

                  <button
                    onClick={toggleReadMore}
                      className="group flex items-center gap-2 px-3 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full text-white font-medium transition-all duration-300 mb-6 shadow-md hover:shadow-lg hover:scale-105 transform w-fit"
                  >
                    <span className="text-sm font-medium">
                      {showMore ? "Read Less" : "Read More"}
                    </span>
                    <div className={`transition-transform duration-300 ${showMore ? 'rotate-180' : 'rotate-0'}`}>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  <dl className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 max-w-4xl">
                    <div className="text-center">
                      <dt className="text-3xl font-bold text-white mb-1">24/7</dt>
                      <dd className="text-sm text-gray-400">Live Global Coverage</dd>
                    </div>
                    <div className="text-center">
                      <dt className="text-3xl font-bold text-white mb-1">150+</dt>
                      <dd className="text-sm text-gray-400">Verified Sources</dd>
                    </div>
                    <div className="text-center">
                      <dt className="text-3xl font-bold text-white mb-1">2M+</dt>
                      <dd className="text-sm text-gray-400">Monthly Readers</dd>
                    </div>
                    <div className="text-center">
                      <dt className="text-3xl font-bold text-white mb-1">99.9%</dt>
                      <dd className="text-sm text-gray-400">Fact‑Check Accuracy</dd>
                    </div>
                  </dl>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Link href="/">
                      <Button size="lg" className="bg-white text-slate-900 hover:bg-gray-100 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 w-full sm:w-auto">
                        <BookOpen className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                        📰 Read Our Stories
                        <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Right Side - Enhanced News Platform Demo */}
                <div className={`relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-2xl">
                    {/* Main Platform Display */}
                    <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-xl p-4 sm:p-6 relative overflow-hidden h-80 sm:h-96" style={{ willChange: 'transform' }}>
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
                            className={`flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-white rounded-lg shadow-sm transition-all duration-500 hover:shadow-md ${currentImageIndex === index ? 'ring-1 sm:ring-2 ring-blue-500' : ''
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Our Mission Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-bold mb-6">
                <Target className="h-5 w-5 mr-2" />
                OUR MISSION
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Our Mission & Commitment
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Delivering trusted journalism that empowers informed communities worldwide
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {/* Mission Card 1 */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Global Coverage</h3>
                <p className="text-gray-600 leading-relaxed">
                  At NewsHubNow, we deliver live global coverage 24/7, drawing on 150+ verified sources across multiple continents. Every month, over 2 million readers rely on our fact‑checked accuracy rate of 99.9%. Our dedicated team of professional journalists and correspondents work around the clock to ensure you receive the most important news as it happens, backed by thorough research and expert analysis.
                </p>
              </div>

              {/* Mission Card 2 */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Community Focus</h3>
                <p className="text-gray-600 leading-relaxed">
                  We believe in the power of informed communities and democratic discourse. From breaking international developments to local stories that shape daily life, our comprehensive coverage spans politics, technology, business, education, health, and social issues. Our AI‑powered curation system ensures you never miss critical updates while our human editorial team maintains the highest journalistic standards and ethical practices.
                </p>
              </div>

              {/* Mission Card 3 */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Expert Analysis</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our commitment to excellence extends beyond just reporting the news. We provide in‑depth analysis, expert commentary, and diverse perspectives to help our readers understand the complex world around them. Whether you're a business professional staying updated on market trends, a student researching current events, or a citizen seeking to stay informed about your community and the world, NewsHubNow serves as your trusted source for reliable, timely, and comprehensive journalism.
                </p>
              </div>
            </div>

            {/* Bottom Stats Bar */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8">
              <dl className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                <div>
                  <dt className="text-3xl font-bold text-white mb-2">24/7</dt>
                  <dd className="text-blue-100 font-medium">Global Coverage</dd>
                </div>
                <div>
                  <dt className="text-3xl font-bold text-white mb-2">150+</dt>
                  <dd className="text-blue-100 font-medium">Verified Sources</dd>
                </div>
                <div>
                  <dt className="text-3xl font-bold text-white mb-2">2M+</dt>
                  <dd className="text-blue-100 font-medium">Monthly Readers</dd>
                </div>
                <div>
                  <dt className="text-3xl font-bold text-white mb-2">99.9%</dt>
                  <dd className="text-blue-100 font-medium">Accuracy Rate</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* What Sets Us Apart Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">What Sets Us Apart</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Combining the best of AI technology with human expertise for unparalleled journalism
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-blue-200">
                    <CardContent className="p-6">
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                The principles that guide every story we tell and every decision we make
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <CardContent className="p-8">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
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
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experienced journalists and industry experts dedicated to delivering quality news
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 text-center">
                  <CardContent className="p-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Users className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                    <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{member.bio}</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {member.expertise.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="secondary" className="text-xs">
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

        {/* Call to Action Section */}
        <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Join Our Community
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Stay connected with NewsHubNow and be part of an informed community that values truth, accuracy, and comprehensive coverage. Follow us for real-time updates, subscribe to our newsletters for daily briefings, and engage with our content to help shape the future of digital journalism. Together, we can build a more informed and connected world.
            </p>
            <div className="flex justify-center">
              <Link href="/">
                <Button size="lg" className="bg-white text-slate-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Start Reading Today
                </Button>
              </Link>
            </div>
            <div className="mt-6 text-center">
              <Link href="/contact">
                <button className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-white/10 to-gray-100/10 hover:from-white/20 hover:to-gray-100/20 border border-white/30 hover:border-white/50 rounded-full text-white hover:text-blue-100 transition-all duration-300 backdrop-blur-sm hover:scale-105 hover:shadow-lg hover:shadow-white/25 font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Contact Us</span>
                  <div className="transition-transform duration-300 group-hover:translate-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}