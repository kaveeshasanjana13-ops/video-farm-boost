import ModernNavigation from "@/components/ModernNavigation";
import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
const TermsConditions = () => {
  const [activeSection, setActiveSection] = useState("");
  const sections = [{
    id: "ownership",
    title: "Ownership & Operation",
    level: 1
  }, {
    id: "eligibility",
    title: "Eligibility & Access",
    level: 1
  }, {
    id: "user-responsibilities",
    title: "User Responsibilities",
    level: 1
  }, {
    id: "required-conduct",
    title: "Required Conduct",
    level: 2
  }, {
    id: "prohibited-activities",
    title: "Prohibited Activities",
    level: 2
  }, {
    id: "termination",
    title: "Termination & Liability",
    level: 1
  }, {
    id: "account-termination",
    title: "Account Termination",
    level: 2
  }, {
    id: "data-breach",
    title: "Data Breach Penalties",
    level: 2
  }, {
    id: "limitation",
    title: "Limitation of Liability",
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
              <h1 className="text-3xl font-bold text-foreground mb-2">Terms & Conditions</h1>
              <p className="text-muted-foreground">Legal agreement for Suraksha LMS platform usage</p>
              <p className="text-sm text-muted-foreground mt-2">Last Updated: July 1, 2025</p>
            </header>

                {/* Content */}
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <p className="text-lg leading-relaxed text-muted-foreground mb-8">
                    Welcome to <strong>Suraksha LMS</strong>. By registering, accessing, or using our platform (lms.suraksha.lk), you agree to the following terms and conditions. Please read carefully.
                  </p>

                  <div className="space-y-12">
                    <section id="ownership" className="scroll-mt-24">
                      <h2 className="text-2xl font-bold text-foreground mb-6 pb-2 border-b">1. Ownership & Operation</h2>
                         <div className="bg-gray-50 rounded-lg p-6">
                           <p className="text-gray-700 mb-3">
                          This platform is owned and operated by <strong className="text-black">SURAKSHA LEARNING MANAGEMENT SYSTEM (PVT) LTD</strong>, Sri Lanka.
                        </p>
                        <div className="space-y-2 mt-4">
                          <div className="flex items-start gap-3">
                            <span className="text-sm text-gray-600 min-w-[140px]">Registration No:</span>
                            <strong className="text-black">PV 00342747</strong>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="text-sm text-gray-600 min-w-[140px]">Registered Address:</span>
                            <span className="text-gray-700">188/79 The Finans Waththa, Wilimbula, Henegama</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="text-sm text-gray-600 min-w-[140px]">Contact:</span>
                            <strong className="text-black">+94 70 330 0524</strong>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section id="eligibility" className="scroll-mt-24">
                      <h2 className="text-2xl font-bold text-foreground mb-6 pb-2 border-b">2. Eligibility & Access</h2>
                      <div className="space-y-4">
                         <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                           <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                           <p className="text-gray-700 m-0">Only registered users (students, parents, teachers, institute admins, advertisers, and attendance markers) may access the platform.</p>
                         </div>
                         <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                           <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                           <p className="text-gray-700 m-0">The system is not publicly accessible; entry is limited to registered accounts only.</p>
                         </div>
                      </div>
                    </section>

                    <section id="user-responsibilities" className="scroll-mt-24">
                      <h2 className="text-2xl font-bold text-foreground mb-6 pb-2 border-b">3. User Responsibilities</h2>
                      
                      <div className="space-y-8">
                        <div id="required-conduct" className="scroll-mt-24">
                          <h3 className="text-lg font-semibold text-foreground mb-4">✓ Required Conduct</h3>
                           <div className="bg-gray-100 border-l-4 border-black rounded-r-lg p-4">
                             <div className="space-y-3">
                               <div className="flex items-start gap-3">
                                 <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                                 <span className="text-sm text-gray-700">Provide only correct and accurate details during registration and usage</span>
                               </div>
                               <div className="flex items-start gap-3">
                                 <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                                 <span className="text-sm text-gray-700">Maintain confidentiality of login credentials</span>
                               </div>
                               <div className="flex items-start gap-3">
                                 <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                                 <span className="text-sm text-gray-700">Use the platform for educational purposes only</span>
                               </div>
                             </div>
                           </div>
                        </div>

                        <div id="prohibited-activities" className="scroll-mt-24">
                          <h3 className="text-lg font-semibold text-foreground mb-4">✗ Prohibited Activities</h3>
                           <div className="bg-gray-100 border-l-4 border-black rounded-r-lg p-4">
                             <div className="space-y-3">
                               <div className="flex items-start gap-3">
                                 <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                                 <span className="text-sm text-gray-700">Manipulating advertisements, messages, or system features</span>
                               </div>
                               <div className="flex items-start gap-3">
                                 <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                                 <span className="text-sm text-gray-700">Attempting to hack, bypass, or misuse the system</span>
                               </div>
                               <div className="flex items-start gap-3">
                                 <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                                 <span className="text-sm text-gray-700">Sharing login credentials with unauthorized persons</span>
                               </div>
                               <div className="flex items-start gap-3">
                                 <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                                 <span className="text-sm text-gray-700">Using the platform for commercial purposes without permission</span>
                               </div>
                             </div>
                           </div>
                        </div>
                      </div>
                    </section>

                    <section id="termination" className="scroll-mt-24">
                      <h2 className="text-2xl font-bold text-foreground mb-6 pb-2 border-b">4. Termination & Liability</h2>
                      
                      <div className="space-y-8">
                        <div id="account-termination" className="scroll-mt-24">
                          <h3 className="text-lg font-semibold text-foreground mb-4">Account Termination</h3>
                           <div className="bg-gray-100 rounded-lg p-6">
                             <p className="text-gray-700 mb-4">
                               Accounts violating these terms will be terminated immediately. Recovery of accounts is at the sole discretion of Suraksha LMS, and users may be required to:
                             </p>
                             <div className="space-y-2 ml-4">
                               <div className="flex items-start gap-3">
                                 <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                                 <span className="text-sm text-gray-700">Accept all updated policies</span>
                               </div>
                               <div className="flex items-start gap-3">
                                 <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                                 <span className="text-sm text-gray-700">Pay compensation for system losses (including server, developer, and recovery costs)</span>
                               </div>
                             </div>
                           </div>
                        </div>

                        <div id="data-breach" className="scroll-mt-24">
                          <h3 className="text-lg font-semibold text-foreground mb-4">Data Breach Penalties</h3>
                           <div className="bg-gray-100 border border-gray-300 rounded-lg p-6">
                             <p className="text-gray-700 m-0">
                               In cases of data breach caused by user negligence, penalties may be calculated as: 
                               <span className="font-semibold text-black"> Value of one student's data × number of affected students</span>
                             </p>
                           </div>
                        </div>

                         <div className="p-4 bg-gray-100 rounded-lg">
                           <p className="text-sm text-gray-700 m-0">
                             <strong>Important:</strong> Users cannot bring legal action against the Suraksha LMS security team for measures taken to protect or recover system access.
                           </p>
                         </div>
                      </div>
                    </section>

                    <section id="limitation" className="scroll-mt-24">
                      <h2 className="text-2xl font-bold text-foreground mb-6 pb-2 border-b">5. Limitation of Liability</h2>
                      <div className="space-y-6">
                        <p className="text-muted-foreground">
                          Suraksha LMS is provided <strong>"as-is"</strong>. While we strive for strong security and reliability, we are not responsible for:
                        </p>
                        
                         <div className="grid md:grid-cols-2 gap-4">
                           <div className="space-y-3">
                             <div className="flex items-start gap-3 p-3 bg-gray-100 rounded-lg">
                               <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                               <span className="text-sm text-gray-700">Indirect, incidental, or consequential damages</span>
                             </div>
                             <div className="flex items-start gap-3 p-3 bg-gray-100 rounded-lg">
                               <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                               <span className="text-sm text-gray-700">Data loss due to technical issues</span>
                             </div>
                             <div className="flex items-start gap-3 p-3 bg-gray-100 rounded-lg">
                               <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                               <span className="text-sm text-gray-700">System downtime or maintenance periods</span>
                             </div>
                           </div>
                           <div className="space-y-3">
                             <div className="flex items-start gap-3 p-3 bg-gray-100 rounded-lg">
                               <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                               <span className="text-sm text-gray-700">Losses from unauthorized access attempts</span>
                             </div>
                             <div className="flex items-start gap-3 p-3 bg-gray-100 rounded-lg">
                               <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                               <span className="text-sm text-gray-700">Third-party service disruptions</span>
                             </div>
                           </div>
                         </div>

                         <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg">
                           <p className="text-sm text-gray-700 m-0">
                             <strong>Exception:</strong> We maintain full responsibility for payments made to our official bank accounts and refund policies as stated in our Refund Policy.
                           </p>
                         </div>
                      </div>
                    </section>

                    <section id="governing-law" className="scroll-mt-24">
                      <h2 className="text-2xl font-bold text-foreground mb-6 pb-2 border-b">6. Governing Law</h2>
                       <div className="bg-gray-100 rounded-lg p-6">
                         <p className="text-gray-700 mb-4">These Terms are governed by the <strong>laws of Sri Lanka</strong>. Any disputes must be resolved exclusively in the courts of <strong>Colombo, Sri Lanka</strong>.</p>
                         <p className="text-sm text-gray-700 m-0">
                           <strong>Jurisdiction Agreement:</strong> By using Suraksha LMS, you agree not to challenge this jurisdiction and accept Sri Lankan law as governing these terms.
                         </p>
                       </div>
                    </section>

                    <section id="contact" className="scroll-mt-24">
                      <h2 className="text-2xl font-bold text-foreground mb-6 pb-2 border-b">Contact Information</h2>
                       <div className="bg-gray-100 rounded-lg p-6">
                         <p className="text-gray-700 mb-4">For questions about our Terms & Conditions, contact our legal team:</p>
                         <div className="space-y-3">
                           <div className="flex items-start gap-3">
                             <span className="text-sm text-gray-700 min-w-[100px]">Company:</span>
                             <strong className="text-black">SURAKSHA LEARNING MANAGEMENT SYSTEM (PVT) LTD</strong>
                           </div>
                           <div className="flex items-start gap-3">
                             <span className="text-sm text-gray-700 min-w-[100px]">Reg. No:</span>
                             <strong className="text-black">PV 00342747</strong>
                           </div>
                           <div className="flex items-start gap-3">
                             <span className="text-sm text-gray-700 min-w-[100px]">Address:</span>
                             <span className="text-gray-700">188/79 The Finans Waththa, Wilimbula, Henegama</span>
                           </div>
                           <div className="flex items-start gap-3">
                             <span className="text-sm text-gray-700 min-w-[100px]">Phone:</span>
                             <strong className="text-black">+94 70 330 0524</strong>
                           </div>
                            <div className="flex items-start gap-3">
                              <span className="text-sm text-gray-700 min-w-[100px]">Email:</span>
                              <strong className="text-black">legal@suraksha.lk</strong>
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
export default TermsConditions;