import ModernNavigation from "@/components/ModernNavigation";
import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState("");
  const sections = [{
    id: "data-collection",
    title: "Data We Collect",
    level: 1
  }, {
    id: "personal-data",
    title: "Personal Data",
    level: 2
  }, {
    id: "educational-data",
    title: "Educational Data",
    level: 2
  }, {
    id: "security-data",
    title: "Security Data",
    level: 2
  }, {
    id: "usage-data",
    title: "Usage Data",
    level: 2
  }, {
    id: "data-usage",
    title: "How We Use Your Data",
    level: 1
  }, {
    id: "primary-uses",
    title: "Primary Uses",
    level: 2
  }, {
    id: "secondary-uses",
    title: "Secondary Uses",
    level: 2
  }, {
    id: "data-sharing",
    title: "Data Sharing & Third Parties",
    level: 1
  }, {
    id: "trusted-partners",
    title: "Trusted Partners",
    level: 2
  }, {
    id: "educational-access",
    title: "Educational Access",
    level: 2
  }, {
    id: "data-retention",
    title: "Data Retention & Deletion",
    level: 1
  }, {
    id: "security-measures",
    title: "Security Measures",
    level: 1
  }, {
    id: "user-rights",
    title: "Your Rights & Controls",
    level: 1
  }, {
    id: "governing-law",
    title: "Governing Law",
    level: 1
  }, {
    id: "contact",
    title: "Contact Information",
    level: 1
  }];
  const scrollToSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth"
    });
  };
  const navigateSection = (direction: "up" | "down") => {
    const currentIndex = sections.findIndex(s => s.id === activeSection);
    if (direction === "up" && currentIndex > 0) {
      scrollToSection(sections[currentIndex - 1].id);
    } else if (direction === "down" && currentIndex < sections.length - 1) {
      scrollToSection(sections[currentIndex + 1].id);
    }
  };
  return <>
      <ModernNavigation />
      
      <div className="min-h-screen bg-background pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex gap-8">
            {/* Table of Contents Sidebar */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-36 bg-card rounded-lg shadow-sm border p-6">
                <h3 className="font-semibold text-foreground mb-4">Table of Contents</h3>
                <nav className="space-y-1">
                  {sections.map(section => <button key={section.id} onClick={() => scrollToSection(section.id)} className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${activeSection === section.id ? "bg-gray-100 text-black font-medium" : "text-gray-600 hover:text-black hover:bg-gray-50"} ${section.level === 2 ? "ml-4" : ""}`}>
                      {section.title}
                    </button>)}
                </nav>
                
                {/* Navigation Controls */}
                <div className="mt-6 pt-4 border-t">
                  <div className="flex gap-2">
                    <button onClick={() => navigateSection("up")} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-muted hover:bg-muted/70 rounded-md transition-colors">
                      <ChevronUp className="w-4 h-4" />
                      Previous
                    </button>
                    <button onClick={() => navigateSection("down")} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-muted hover:bg-muted/70 rounded-md transition-colors">
                      Next
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="bg-card rounded-lg shadow-sm border p-8">
            {/* Header */}
            <header className="mb-8 pb-6 border-b">
              <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
              <p className="text-muted-foreground">How we protect and handle your personal information</p>
              <p className="text-sm text-muted-foreground mt-2">Last Updated: July 1, 2025</p>
            </header>

                {/* Content */}
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <p className="text-lg leading-relaxed text-muted-foreground mb-8">
                    At <strong>SurakshaLMS</strong> (operated by <strong>SURAKSHA LEARNING MANAGEMENT SYSTEM (PVT) LTD</strong>), protecting your privacy and data security is our top priority. This policy explains how we collect, use, and safeguard your information.
                  </p>

                  <div className="space-y-12">
                    <section id="data-collection" className="scroll-mt-24">
                      <h2 className="text-2xl font-bold text-foreground mb-6 pb-2 border-b">1. Data We Collect</h2>
                      
                      <div className="grid md:grid-cols-2 gap-8">
                        <div id="personal-data" className="scroll-mt-24">
                          <h3 className="text-lg font-semibold text-foreground mb-4">Personal Data</h3>
                           <div className="bg-gray-100 rounded-lg p-4">
                             <ul className="space-y-2 text-gray-700">
                               <li>• Name, NIC, Date of Birth</li>
                               <li>• Email address, Phone number</li>
                               <li>• Residential address</li>
                             </ul>
                           </div>
                        </div>

                        <div id="educational-data" className="scroll-mt-24">
                          <h3 className="text-lg font-semibold text-foreground mb-4">Educational Data</h3>
                           <div className="bg-gray-100 rounded-lg p-4">
                             <ul className="space-y-2 text-gray-700">
                               <li>• Student IDs, Academic results</li>
                               <li>• Attendance records</li>
                               <li>• Certificates & achievements</li>
                             </ul>
                           </div>
                        </div>

                        <div id="security-data" className="scroll-mt-24">
                          <h3 className="text-lg font-semibold text-foreground mb-4">Security Data</h3>
                           <div className="bg-gray-100 rounded-lg p-4">
                             <ul className="space-y-2 text-gray-700">
                               <li>• IP address, Device details</li>
                               <li>• Browser information</li>
                               <li>• Location logs for security</li>
                             </ul>
                           </div>
                        </div>

                        <div id="usage-data" className="scroll-mt-24">
                          <h3 className="text-lg font-semibold text-foreground mb-4">Usage Data</h3>
                           <div className="bg-gray-100 rounded-lg p-4">
                             <ul className="space-y-2 text-gray-700">
                               <li>• Login history, Platform activity</li>
                               <li>• Cookies & analytics data</li>
                               <li>• Feature usage patterns</li>
                             </ul>
                           </div>
                        </div>
                      </div>
                    </section>

                    <section id="data-usage" className="scroll-mt-24">
                      <h2 className="text-2xl font-bold text-foreground mb-6 pb-2 border-b">2. How We Use Your Data</h2>
                      <p className="text-muted-foreground mb-6">Your data is used exclusively for legitimate educational and platform purposes:</p>
                      
                      <div className="grid md:grid-cols-2 gap-8">
                        <div id="primary-uses" className="scroll-mt-24">
                          <h3 className="text-lg font-semibold text-foreground mb-4">Primary Uses</h3>
                           <div className="bg-gray-100 border-l-4 border-black rounded-r-lg p-4">
                             <ul className="space-y-2 text-gray-700">
                               <li>• Running LMS features (classes, exams, attendance)</li>
                               <li>• Processing payments and advertisements</li>
                               <li>• Student progress tracking</li>
                               <li>• Sending important notifications</li>
                             </ul>
                           </div>
                        </div>

                        <div id="secondary-uses" className="scroll-mt-24">
                          <h3 className="text-lg font-semibold text-foreground mb-4">Secondary Uses</h3>
                           <div className="bg-gray-100 rounded-lg p-4">
                             <ul className="space-y-2 text-gray-700">
                               <li>• Security monitoring & fraud detection</li>
                               <li>• System analytics & improvements</li>
                               <li>• AI-powered recommendations</li>
                               <li>• Performance analysis</li>
                             </ul>
                           </div>
                        </div>
                      </div>

                       <div className="mt-6 p-4 bg-gray-100 border border-gray-300 rounded-lg">
                         <p className="text-sm text-gray-700 m-0">
                           <strong className="text-black">Important:</strong> Sensitive data (NIC numbers, birth certificate details) will never be shared with third parties, except when required by legal authorities.
                         </p>
                       </div>
                    </section>

                    <section id="data-sharing" className="scroll-mt-24">
                      <h2 className="text-2xl font-bold text-foreground mb-6 pb-2 border-b">3. Data Sharing & Third Parties</h2>
                      <p className="text-muted-foreground mb-6">We may share data only with trusted service providers necessary for platform operation:</p>

                      <div className="grid md:grid-cols-2 gap-8">
                        <div id="trusted-partners" className="scroll-mt-24">
                          <h3 className="text-lg font-semibold text-foreground mb-4">Trusted Partners</h3>
                           <div className="bg-gray-100 border-l-4 border-black rounded-r-lg p-4">
                             <ul className="space-y-3 text-gray-700">
                               <li><strong className="text-black">AWS & Google Cloud</strong><br />Hosting & storage services</li>
                               <li><strong className="text-black">Dialog</strong><br />SMS delivery services</li>
                               <li><strong className="text-black">Helapay</strong><br />Payment processing</li>
                               <li><strong className="text-black">OpenAI</strong><br />AI features (when enabled)</li>
                             </ul>
                           </div>
                        </div>

                        <div id="educational-access" className="scroll-mt-24">
                          <h3 className="text-lg font-semibold text-foreground mb-4">Educational Access</h3>
                           <div className="bg-gray-100 rounded-lg p-4">
                             <ul className="space-y-3 text-gray-700">
                               <li><strong className="text-black">Teachers/Admins</strong><br />Access only their students' data</li>
                               <li><strong className="text-black">Parents</strong><br />Access only their children's data</li>
                               <li><strong className="text-black">Institutes</strong><br />Access only their enrolled students</li>
                             </ul>
                           </div>
                        </div>
                      </div>

                       <div className="mt-6 p-4 bg-gray-100 border border-gray-300 rounded-lg">
                         <p className="text-sm text-gray-700 m-0">
                           <strong className="text-black">Privacy Guarantee:</strong> We do not sell, trade, or commercially exploit your personal data. All sharing is strictly functional and necessary for service delivery.
                         </p>
                       </div>
                    </section>

                    <section id="data-retention" className="scroll-mt-24">
                      <h2 className="text-2xl font-bold text-foreground mb-6 pb-2 border-b">4. Data Retention & Deletion</h2>
                      
                      <div className="overflow-hidden rounded-lg border">
                        <table className="w-full">
                           <thead className="bg-gray-100">
                             <tr>
                               <th className="px-6 py-3 text-left text-sm font-medium text-black">Account Type</th>
                               <th className="px-6 py-3 text-left text-sm font-medium text-black">Retention Policy</th>
                             </tr>
                           </thead>
                          <tbody className="divide-y divide-border">
                             <tr>
                               <td className="px-6 py-4 text-sm font-medium text-black">Active Accounts</td>
                               <td className="px-6 py-4 text-sm text-gray-700">Data retained while account is active and in use</td>
                             </tr>
                             <tr>
                               <td className="px-6 py-4 text-sm font-medium text-black">Inactive Accounts</td>
                               <td className="px-6 py-4 text-sm text-gray-700">May be removed after extended inactivity</td>
                             </tr>
                             <tr>
                               <td className="px-6 py-4 text-sm font-medium text-black">Deletion Requests</td>
                               <td className="px-6 py-4 text-sm text-gray-700">Contact support for account deletion</td>
                             </tr>
                          </tbody>
                        </table>
                      </div>

                       <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                          <p className="text-sm text-gray-700 m-0">
                            Backup copies may remain for audit, legal compliance, and security purposes. Contact <strong>service@suraksha.lk</strong> for deletion requests.
                          </p>
                       </div>
                    </section>

                    <section id="security-measures" className="scroll-mt-24">
                      <h2 className="text-2xl font-bold text-foreground mb-6 pb-2 border-b">5. Security Measures</h2>
                      
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-4">🔒 Technical Security</h3>
                          <div className="space-y-3">
                             <div className="flex items-start gap-3 p-3 bg-gray-100 rounded-lg">
                               <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                               <span className="text-sm text-gray-700">End-to-end encryption for sensitive data</span>
                             </div>
                             <div className="flex items-start gap-3 p-3 bg-gray-100 rounded-lg">
                               <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                               <span className="text-sm text-gray-700">Secure server infrastructure (AWS/Google)</span>
                             </div>
                             <div className="flex items-start gap-3 p-3 bg-gray-100 rounded-lg">
                               <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                               <span className="text-sm text-gray-700">Regular security audits and monitoring</span>
                             </div>
                             <div className="flex items-start gap-3 p-3 bg-gray-100 rounded-lg">
                               <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                               <span className="text-sm text-gray-700">Multi-factor authentication support</span>
                             </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-4">👤 User Responsibility</h3>
                          <div className="space-y-3">
                             <div className="flex items-start gap-3 p-3 bg-gray-100 rounded-lg">
                               <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                               <span className="text-sm text-gray-700">Keep login credentials secure</span>
                             </div>
                             <div className="flex items-start gap-3 p-3 bg-gray-100 rounded-lg">
                               <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                               <span className="text-sm text-gray-700">Report suspicious activities immediately</span>
                             </div>
                             <div className="flex items-start gap-3 p-3 bg-gray-100 rounded-lg">
                               <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                               <span className="text-sm text-gray-700">Use strong, unique passwords</span>
                             </div>
                             <div className="flex items-start gap-3 p-3 bg-gray-100 rounded-lg">
                               <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                               <span className="text-sm text-gray-700">Log out from shared devices</span>
                             </div>
                          </div>
                        </div>
                      </div>

                       <div className="mt-6 p-4 bg-gray-100 border border-gray-300 rounded-lg">
                         <p className="text-sm text-gray-700 m-0">
                           <strong className="text-black">Security Disclaimer:</strong> While we implement industry-standard security measures, no system is 100% secure. Users also bear responsibility for maintaining account security.
                         </p>
                       </div>
                    </section>

                    <section id="user-rights" className="scroll-mt-24">
                      <h2 className="text-2xl font-bold text-foreground mb-6 pb-2 border-b">6. Your Rights & Controls</h2>
                      
                      <div className="grid md:grid-cols-3 gap-6">
                         <div className="text-center p-6 bg-gray-100 rounded-lg">
                           <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                             <span className="text-black font-bold">👁</span>
                           </div>
                           <h3 className="font-semibold text-black mb-2">Access Rights</h3>
                           <p className="text-sm text-gray-700">Request to view all data we have about you</p>
                         </div>

                         <div className="text-center p-6 bg-gray-100 rounded-lg">
                           <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                             <span className="text-black font-bold">✏</span>
                           </div>
                           <h3 className="font-semibold text-black mb-2">Update Rights</h3>
                           <p className="text-sm text-gray-700">Correct or update your personal details</p>
                         </div>

                         <div className="text-center p-6 bg-gray-100 rounded-lg">
                           <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                             <span className="text-black font-bold">🗑</span>
                           </div>
                           <h3 className="font-semibold text-black mb-2">Deletion Rights</h3>
                           <p className="text-sm text-gray-700">Request removal of your account and data</p>
                         </div>
                      </div>

                       <div className="mt-6 p-4 bg-gray-100 rounded-lg text-center">
                          <p className="text-sm text-gray-700 m-0">
                            To exercise any of these rights, contact our support team at <strong>service@suraksha.lk</strong>
                          </p>
                       </div>
                    </section>

                    <section id="governing-law" className="scroll-mt-24">
                      <h2 className="text-2xl font-bold text-foreground mb-6 pb-2 border-b">7. Governing Law</h2>
                       <div className="bg-gray-100 rounded-lg p-6">
                         <p className="text-gray-700 mb-4">This Privacy Policy is governed by the <strong>laws of Sri Lanka</strong>. Any disputes must be resolved exclusively in the courts of <strong>Colombo, Sri Lanka</strong>.</p>
                         <p className="text-sm text-gray-700 m-0">
                           <strong>Jurisdiction Agreement:</strong> By using Suraksha LMS, you agree not to challenge this jurisdiction and accept Sri Lankan law as governing this policy.
                         </p>
                       </div>
                    </section>

                    <section id="contact" className="scroll-mt-24">
                      <h2 className="text-2xl font-bold text-foreground mb-6 pb-2 border-b">Contact Information</h2>
                       <div className="bg-gray-100 rounded-lg p-6">
                         <p className="text-gray-700 mb-4">For privacy-related questions or concerns, contact:</p>
                         <div className="space-y-3">
                           <div className="flex items-start gap-3">
                             <span className="text-sm text-gray-700 min-w-[120px]">Company:</span>
                             <strong className="text-black">SURAKSHA LEARNING MANAGEMENT SYSTEM (PVT) LTD</strong>
                           </div>
                           <div className="flex items-start gap-3">
                             <span className="text-sm text-gray-700 min-w-[120px]">Reg. No:</span>
                             <strong className="text-black">PV 00342747</strong>
                           </div>
                           <div className="flex items-start gap-3">
                             <span className="text-sm text-gray-700 min-w-[120px]">Address:</span>
                             <span className="text-gray-700">188/79 The Finans Waththa, Wilimbula, Henegama</span>
                           </div>
                           <div className="flex items-start gap-3">
                             <span className="text-sm text-gray-700 min-w-[120px]">Phone:</span>
                             <strong className="text-black">+94 70 330 0524</strong>
                           </div>
                            <div className="flex items-start gap-3">
                              <span className="text-sm text-gray-700 min-w-[120px]">General Support:</span>
                              <strong className="text-black">service@suraksha.lk</strong>
                            </div>
                            <div className="flex items-start gap-3">
                              <span className="text-sm text-gray-700 min-w-[120px]">Privacy Officer:</span>
                              <strong className="text-black">privacy@suraksha.lk</strong>
                            </div>
                         </div>
                       </div>
                    </section>
                  </div>

                  <div className="mt-12 pt-8 border-t text-center">
                    <p className="text-sm text-muted-foreground">
                      © 2025 SURAKSHA LEARNING MANAGEMENT SYSTEM (PVT) LTD. All rights reserved.<br />
                      PV 00342747 | +94 70 330 0524<br />
                      🇱🇰 Proudly serving Sri Lankan education
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>;
};
export default PrivacyPolicy;