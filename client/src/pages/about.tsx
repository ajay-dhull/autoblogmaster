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
  ArrowRight
} from "lucide-react";
import { Link } from "wouter";

export default function About() {
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
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-slate-600/10 via-gray-600/10 to-zinc-700/10 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-slate-400/20 to-gray-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-gray-400/20 to-zinc-400/20 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-slate-800 via-slate-900 to-black mb-8 shadow-2xl">
            <Globe className="h-10 w-10 text-white" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-slate-900 to-black bg-clip-text text-transparent">
            About NewsHub
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            Your trusted partner in staying informed about the world around you. We deliver comprehensive, 
            accurate, and timely news coverage from verified sources across the globe.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/blog">
              <Button size="lg" className="bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <BookOpen className="mr-2 h-5 w-5" />
                Read Our Stories
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-2 border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-800 px-8 py-4 text-lg bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-105">
                Get In Touch
              </Button>
            </Link>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white border-0 overflow-hidden">
                  <CardContent className="p-8">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
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
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold hover:scale-105 transition-all duration-300">
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