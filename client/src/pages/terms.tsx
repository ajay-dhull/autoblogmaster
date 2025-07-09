import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { FileText, Scale, Users, AlertTriangle, ArrowLeft } from "lucide-react";

export default function Terms() {
  const sections = [
    {
      title: "Acceptance of Terms",
      icon: Scale,
      content: [
        "By accessing or using NewsHubNow (https://newshubnow.in), you agree to these Terms of Service.",
        "If you disagree with any part of these terms, please discontinue use immediately.",
        "We reserve the right to modify these terms at any time; changes will be effective upon posting.",
        "Continued use after modifications constitutes your acceptance of the updated terms."
      ]
    },
    {
      title: "Use of Service",
      icon: Users,
      content: [
        "NewsHubNow is for personal, non-commercial use only; you may read and share news content responsibly.",
        "Unauthorized reproduction, distribution, or commercial exploitation of content is strictly prohibited.",
        "You may not use our platform for unlawful activities or to infringe on others’ rights.",
        "We reserve the right to suspend or terminate accounts for violations without prior notice."
      ]
    },
    {
      title: "Content and Intellectual Property",
      icon: FileText,
      content: [
        "All text, graphics, and multimedia on NewsHubNow are protected by copyright and related laws.",
        "Content sources are accredited; we respect original authors and outlets.",
        "You may quote or link to our content with proper attribution.",
        "User-submitted content remains your property, but you grant us a license to use, modify, and display it."
      ]
    },
    {
      title: "Disclaimers and Limitations of Liability",
      icon: AlertTriangle,
      content: [
        "NewsHubNow provides information \"as is\" without any warranties, express or implied.",
        "We strive for accuracy but make no guarantees regarding completeness or timeliness.",
        "Under no circumstances will we be liable for any direct, indirect, or consequential damages arising from use.",
        "External links are provided for convenience; we are not responsible for third-party content."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50/30 pt-16">
      <section className="py-16 bg-gradient-to-br from-slate-600/10 via-gray-600/10 to-zinc-700/10 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-slate-400/20 to-gray-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-gray-400/20 to-zinc-400/20 rounded-full blur-3xl animate-pulse"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-slate-800 via-slate-900 to-black mb-8 shadow-2xl">
            <Scale className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-slate-900 to-black bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Please review these terms carefully before using NewsHubNow. They govern your access to our platform and services.
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
        <div className="text-center mb-12">
          <p className="text-gray-600">
            <strong>Last Updated:</strong> July 2025
          </p>
        </div>

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
                    {section.content.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
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

        <div className="mt-16 space-y-8">
          <Card className="border-0 bg-slate-50">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-6 text-gray-900">Additional Terms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-3 text-gray-800">Account Termination</h4>
                  <p className="text-gray-600 text-sm mb-4">We may suspend or terminate access for any violations of these terms without prior notice.</p>
                  <h4 className="font-semibold mb-3 text-gray-800">Governing Law</h4>
                  <p className="text-gray-600 text-sm">These terms are governed by Indian laws. Disputes will be resolved in the courts of Haryana, India.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-gray-800">Changes to Service</h4>
                  <p className="text-gray-600 text-sm mb-4">We reserve the right to modify or discontinue services with reasonable notice.</p>
                  <h4 className="font-semibold mb-3 text-gray-800">Contact Information</h4>
                  <p className="text-gray-600 text-sm">For questions about these Terms, contact us at contact.neuraxon@gmail.com.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-r from-slate-800 to-slate-900 text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-bold mb-4">Need Clarification?</h3>
              <p className="mb-6 text-slate-200">
                Reach out if you have any questions about these Terms of Service or require further assistance.
              </p>
              <Link href="/contact">
                <Button className="bg-white text-slate-800 hover:bg-gray-100">
                  Contact Support
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
