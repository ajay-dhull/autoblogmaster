import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Shield, Eye, Lock, Database, Globe, ArrowLeft } from "lucide-react";

export default function Privacy() {
  const sections = [
    {
      title: "Information We Collect",
      icon: Database,
      content: [
        "Personal Information: When you subscribe to our newsletter or contact us, we may collect your name, email address, and any information you voluntarily provide.",
        "Usage Data: We automatically collect information about how you interact with our website, including pages visited, time spent, and browser information.",
        "Cookies: We use cookies and similar technologies to enhance your browsing experience and analyze website traffic."
      ]
    },
    {
      title: "How We Use Your Information",
      icon: Eye,
      content: [
        "To provide and improve our news services and content delivery",
        "To send you newsletters and updates if you have subscribed",
        "To respond to your inquiries and provide customer support",
        "To analyze website usage and improve user experience",
        "To comply with legal obligations and protect our rights"
      ]
    },
    {
      title: "Information Sharing",
      icon: Globe,
      content: [
        "We do not sell, trade, or rent your personal information to third parties",
        "We may share information with trusted service providers who assist in website operation",
        "We may disclose information when required by law or to protect our rights",
        "Anonymous, aggregated data may be shared for analytical purposes"
      ]
    },
    {
      title: "Data Security",
      icon: Lock,
      content: [
        "We implement appropriate security measures to protect your personal information",
        "Data is encrypted during transmission using SSL technology",
        "Access to personal information is restricted to authorized personnel only",
        "We regularly review and update our security practices"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50/30 pt-16">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-slate-600/10 via-gray-600/10 to-zinc-700/10 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-slate-400/20 to-gray-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-gray-400/20 to-zinc-400/20 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-slate-800 via-slate-900 to-black mb-8 shadow-2xl">
            <Shield className="h-8 w-8 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-slate-900 to-black bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            We are committed to protecting your privacy and ensuring the security of your personal information. 
            This policy explains how we collect, use, and safeguard your data.
          </p>

          <div className="flex justify-center">
            <Link href="/">
              <Button variant="outline" className="border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-800">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Last Updated */}
        <div className="text-center mb-12">
          <p className="text-gray-600">
            <strong>Last Updated:</strong> January 2025
          </p>
        </div>

        {/* Privacy Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => {
            const IconComponent = section.icon;
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-xl">
                    <div className="bg-slate-100 p-3 rounded-lg group-hover:bg-slate-200 transition-colors duration-300">
                      <IconComponent className="h-6 w-6 text-slate-700" />
                    </div>
                    <span className="text-gray-900">{section.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-slate-600 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-600 leading-relaxed">{item}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Information */}
        <div className="mt-16 space-y-8">
          <Card className="border-0 bg-slate-50">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Your Rights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2 text-gray-800">Access & Correction</h4>
                  <p className="text-gray-600 text-sm">You have the right to access and correct your personal information.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-gray-800">Data Portability</h4>
                  <p className="text-gray-600 text-sm">You can request a copy of your personal data in a portable format.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-gray-800">Deletion</h4>
                  <p className="text-gray-600 text-sm">You can request deletion of your personal information, subject to legal requirements.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-gray-800">Opt-out</h4>
                  <p className="text-gray-600 text-sm">You can unsubscribe from our communications at any time.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-r from-slate-800 to-slate-900 text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-bold mb-4">Questions About Privacy?</h3>
              <p className="mb-6 text-slate-200">
                If you have any questions about this Privacy Policy or how we handle your data, please contact us.
              </p>
              <Link href="/contact">
                <Button className="bg-white text-slate-800 hover:bg-gray-100">
                  Contact Us
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}