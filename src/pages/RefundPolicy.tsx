import ModernNavigation from "@/components/ModernNavigation";
import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
const RefundPolicy = () => {
  const [activeSection, setActiveSection] = useState("");
  const sections = [{
    id: "general-rule",
    title: "General Refund Rule",
    level: 1
  }, {
    id: "subscriptions",
    title: "Subscription Payments",
    level: 1
  }, {
    id: "monthly-subs",
    title: "Monthly Subscriptions",
    level: 2
  }, {
    id: "yearly-subs",
    title: "Yearly Subscriptions",
    level: 2
  }, {
    id: "ads-custom",
    title: "Advertisements & Custom Services",
    level: 1
  }, {
    id: "humanitarian",
    title: "Humanitarian Exceptions",
    level: 1
  }, {
    id: "eligible-situations",
    title: "Eligible Situations",
    level: 2
  }, {
    id: "requirements",
    title: "Requirements",
    level: 2
  }, {
    id: "management-decision",
    title: "Management Decision Authority",
    level: 1
  }, {
    id: "payment-security",
    title: "Payment Security & Official Channels",
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
              <h1 className="text-3xl font-bold text-foreground mb-2">Refund Policy</h1>
              <p className="text-muted-foreground">Clear guidelines for payments and refund procedures</p>
              <p className="text-sm text-muted-foreground mt-2">Last Updated: July 1, 2025</p>
            </header>

                {/* Content */}
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <p className="text-lg leading-relaxed text-muted-foreground mb-8">
                    At <strong>SurakshaLMS</strong> (operated by <strong>SURAKSHA LEARNING MANAGEMENT SYSTEM (PVT) LTD</strong>), we value transparency in our financial practices. Please read our Refund Policy carefully before making any payments.
                  </p>

                   <div className="bg-gray-100 border border-gray-300 p-4 rounded-lg mb-8">
                     <p className="text-black font-medium m-0">
                       <strong>Important:</strong> All payments made to SURAKSHA LEARNING MANAGEMENT SYSTEM (PVT) LTD are generally non-refundable. Please review this policy before completing any transaction.
                     </p>
                   </div>

                  <div className="space-y-12">
                    <section id="general-rule" className="scroll-mt-24">
                      <h2 className="text-2xl font-bold text-foreground mb-6 pb-2 border-b">1. General Refund Rule</h2>
                      <div className="space-y-6">
                        <p className="text-gray-700">All payments made to SURAKSHA LEARNING MANAGEMENT SYSTEM (PVT) LTD are <strong className="text-black">non-refundable</strong>, including:</p>
                        
                        <div className="grid md:grid-cols-3 gap-6">
                           <div className="text-center p-6 bg-gray-100 rounded-lg">
                             <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                               <span className="text-black font-bold">💳</span>
                             </div>
                             <h3 className="font-semibold text-black mb-2">Subscriptions</h3>
                             <p className="text-sm text-gray-700">Monthly and yearly subscription fees</p>
                           </div>

                           <div className="text-center p-6 bg-gray-100 rounded-lg">
                             <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                               <span className="text-black font-bold">📢</span>
                             </div>
                             <h3 className="font-semibold text-black mb-2">Advertising</h3>
                             <p className="text-sm text-gray-700">Advertisement placement fees</p>
                           </div>

                           <div className="text-center p-6 bg-gray-100 rounded-lg">
                             <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                               <span className="text-black font-bold">⚙</span>
                             </div>
                             <h3 className="font-semibold text-black mb-2">Custom Services</h3>
                             <p className="text-sm text-gray-700">Special requirements and customizations</p>
                           </div>
                        </div>
                      </div>
                    </section>

                    <section id="subscriptions" className="scroll-mt-24">
                      <h2 className="text-2xl font-bold text-foreground mb-6 pb-2 border-b">2. Subscription Payments</h2>
                      
                      <div className="grid md:grid-cols-2 gap-8">
                        <div id="monthly-subs" className="scroll-mt-24">
                          <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Subscriptions</h3>
                           <div className="bg-gray-100 border-l-4 border-black rounded-r-lg p-4">
                             <div className="space-y-3">
                               <div className="flex items-start gap-3">
                                 <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                                 <span className="text-sm text-gray-700">Once payment is processed, cannot be refunded</span>
                               </div>
                               <div className="flex items-start gap-3">
                                 <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                                 <span className="text-sm text-gray-700">Cannot be canceled mid-cycle</span>
                               </div>
                               <div className="flex items-start gap-3">
                                 <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                                 <span className="text-sm text-gray-700">Cannot be transferred to other accounts</span>
                               </div>
                               <div className="flex items-start gap-3">
                                 <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                                 <span className="text-sm text-gray-700">Service continues until end of billing period</span>
                               </div>
                             </div>
                           </div>
                        </div>

                        <div id="yearly-subs" className="scroll-mt-24">
                          <h3 className="text-lg font-semibold text-foreground mb-4">Yearly Subscriptions</h3>
                           <div className="bg-gray-100 border-l-4 border-black rounded-r-lg p-4">
                             <div className="space-y-3">
                               <div className="flex items-start gap-3">
                                 <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                                 <span className="text-sm text-gray-700">Annual payments are strictly non-refundable</span>
                               </div>
                               <div className="flex items-start gap-3">
                                 <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                                 <span className="text-sm text-gray-700">No pro-rated refunds for early cancellation</span>
                               </div>
                               <div className="flex items-start gap-3">
                                 <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                                 <span className="text-sm text-gray-700">Cannot be downgraded to monthly mid-term</span>
                               </div>
                               <div className="flex items-start gap-3">
                                 <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                                 <span className="text-sm text-gray-700">Full year access provided regardless</span>
                               </div>
                             </div>
                           </div>
                        </div>
                      </div>

                       <div className="mt-6 p-4 bg-gray-100 border border-gray-300 rounded-lg">
                         <p className="text-sm text-gray-700 m-0">
                           <strong className="text-black">Subscription Tip:</strong> Consider starting with a monthly subscription to test our services before committing to an annual plan.
                         </p>
                       </div>
                    </section>

                    <section id="ads-custom" className="scroll-mt-24">
                      <h2 className="text-2xl font-bold text-foreground mb-6 pb-2 border-b">3. Advertisements & Custom Services</h2>
                      
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-4">📢 Advertisement Payments</h3>
                          <div className="space-y-3">
                             <div className="flex items-start gap-3 p-3 bg-gray-100 rounded-lg">
                               <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                               <span className="text-sm text-gray-700">All advertising fees are non-refundable</span>
                             </div>
                             <div className="flex items-start gap-3 p-3 bg-gray-100 rounded-lg">
                               <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                               <span className="text-sm text-gray-700">Payments cover placement and promotion costs</span>
                             </div>
                             <div className="flex items-start gap-3 p-3 bg-gray-100 rounded-lg">
                               <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                               <span className="text-sm text-gray-700">No refunds for campaign performance</span>
                             </div>
                             <div className="flex items-start gap-3 p-3 bg-gray-100 rounded-lg">
                               <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                               <span className="text-sm text-gray-700">Changes to ads may incur additional charges</span>
                             </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-4">⚙️ Custom Development</h3>
                          <div className="space-y-3">
                             <div className="flex items-start gap-3 p-3 bg-gray-100 rounded-lg">
                               <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                               <span className="text-sm text-gray-700">Custom feature development is non-refundable</span>
                             </div>
                             <div className="flex items-start gap-3 p-3 bg-gray-100 rounded-lg">
                               <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                               <span className="text-sm text-gray-700">Includes special integrations and modifications</span>
                             </div>
                             <div className="flex items-start gap-3 p-3 bg-gray-100 rounded-lg">
                               <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                               <span className="text-sm text-gray-700">Work begins immediately upon payment</span>
                             </div>
                             <div className="flex items-start gap-3 p-3 bg-gray-100 rounded-lg">
                               <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                               <span className="text-sm text-gray-700">Covers development time and resources</span>
                             </div>
                          </div>
                        </div>
                      </div>

                       <div className="mt-6 p-4 bg-gray-100 border-l-4 border-black rounded-r-lg">
                         <p className="text-sm text-gray-700 m-0">
                           <strong className="text-black">Why No Refunds?</strong> These services involve immediate resource allocation, development work, and third-party costs that cannot be recovered.
                         </p>
                       </div>
                    </section>

                    <section id="humanitarian" className="scroll-mt-24">
                      <h2 className="text-2xl font-bold text-foreground mb-6 pb-2 border-b">4. Humanitarian Exceptions</h2>
                      
                      <div className="space-y-6">
                        <p className="text-muted-foreground">
                          In rare, exceptional circumstances, refund requests may be considered at the sole discretion of Suraksha LMS management:
                        </p>

                        <div className="grid md:grid-cols-2 gap-8">
                          <div id="eligible-situations" className="scroll-mt-24">
                            <h3 className="text-lg font-semibold text-foreground mb-4">✓ Eligible Situations</h3>
                             <div className="bg-gray-100 border-l-4 border-black rounded-r-lg p-4">
                               <div className="space-y-3">
                                 <div className="flex items-start gap-3">
                                   <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                                   <span className="text-sm text-gray-700">Severe medical emergencies</span>
                                 </div>
                                 <div className="flex items-start gap-3">
                                   <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                                   <span className="text-sm text-gray-700">Accidental duplicate payments</span>
                                 </div>
                                 <div className="flex items-start gap-3">
                                   <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                                   <span className="text-sm text-gray-700">Technical errors on our end</span>
                                 </div>
                                 <div className="flex items-start gap-3">
                                   <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                                   <span className="text-sm text-gray-700">Family financial hardship</span>
                                 </div>
                               </div>
                             </div>
                          </div>

                          <div id="requirements" className="scroll-mt-24">
                            <h3 className="text-lg font-semibold text-foreground mb-4">⚠ Requirements</h3>
                             <div className="bg-gray-100 border-l-4 border-black rounded-r-lg p-4">
                               <div className="space-y-3">
                                 <div className="flex items-start gap-3">
                                   <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                                   <span className="text-sm text-gray-700">Written request with documentation</span>
                                 </div>
                                 <div className="flex items-start gap-3">
                                   <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                                   <span className="text-sm text-gray-700">Proof of circumstances (medical, etc.)</span>
                                 </div>
                                 <div className="flex items-start gap-3">
                                   <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                                   <span className="text-sm text-gray-700">Request within 30 days of payment</span>
                                 </div>
                                 <div className="flex items-start gap-3">
                                   <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                                   <span className="text-sm text-gray-700">Subject to management approval</span>
                                 </div>
                               </div>
                             </div>
                          </div>
                        </div>

                        <div className="p-4 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm text-muted-foreground">✉️</span>
                            <strong className="text-foreground">Contact for Humanitarian Requests</strong>
                          </div>
                           <p className="text-sm text-muted-foreground m-0">
                             Send detailed requests to: <strong>financialsupport@suraksha.lk</strong>
                           </p>
                        </div>
                      </div>
                    </section>

                    <section id="management-decision" className="scroll-mt-24">
                      <h2 className="text-2xl font-bold text-foreground mb-6 pb-2 border-b">5. Management Decision Authority</h2>
                      
                      <div className="space-y-6">
                        <div className="bg-secondary/10 rounded-lg p-6">
                          <h3 className="font-semibold text-foreground mb-3">Final Authority</h3>
                          <p className="text-muted-foreground m-0">
                            SURAKSHA LEARNING MANAGEMENT SYSTEM (PVT) LTD reserves the absolute right to approve or reject any refund request. Our decision is final and not subject to appeal.
                          </p>
                        </div>

                         <div className="bg-gray-100 rounded-lg p-6">
                           <h3 className="font-semibold text-foreground mb-3">Refund Calculation</h3>
                           <p className="text-gray-700 mb-3">If granted, refund amounts will be determined based on:</p>
                           <div className="space-y-2 ml-4">
                             <div className="flex items-start gap-3">
                               <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                               <span className="text-sm text-gray-700">System operational costs incurred</span>
                             </div>
                             <div className="flex items-start gap-3">
                               <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                               <span className="text-sm text-gray-700">Service usage and resource consumption</span>
                             </div>
                             <div className="flex items-start gap-3">
                               <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                               <span className="text-sm text-gray-700">Administrative processing fees</span>
                             </div>
                             <div className="flex items-start gap-3">
                               <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                               <span className="text-sm text-gray-700">Case-specific evaluation</span>
                             </div>
                           </div>
                         </div>

                         <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg">
                           <p className="text-sm text-gray-700 m-0">
                             <strong className="text-black">Processing Time:</strong> Approved refunds will be processed within 7-14 business days to the original payment method.
                           </p>
                         </div>
                      </div>
                    </section>

                    <section id="payment-security" className="scroll-mt-24">
                      <h2 className="text-2xl font-bold text-foreground mb-6 pb-2 border-b">Payment Security & Official Channels</h2>
                      
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-4">✓ Official Payment Methods</h3>
                           <div className="space-y-3">
                             <div className="flex items-start gap-3 p-3 bg-gray-100 rounded-lg">
                               <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                               <span className="text-sm text-gray-700">Bank transfers to official Suraksha accounts</span>
                             </div>
                             <div className="flex items-start gap-3 p-3 bg-gray-100 rounded-lg">
                               <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                               <span className="text-sm text-gray-700">Authorized payment gateways (Helapay)</span>
                             </div>
                             <div className="flex items-start gap-3 p-3 bg-gray-100 rounded-lg">
                               <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                               <span className="text-sm text-gray-700">Official invoice-based payments</span>
                             </div>
                             <div className="flex items-start gap-3 p-3 bg-gray-100 rounded-lg">
                               <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                               <span className="text-sm text-gray-700">Platform-integrated payment systems</span>
                             </div>
                           </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-4">✗ Unofficial Channels</h3>
                           <div className="space-y-3">
                             <div className="flex items-start gap-3 p-3 bg-gray-200 rounded-lg">
                               <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                               <span className="text-sm text-gray-700">Personal accounts or unofficial methods</span>
                             </div>
                             <div className="flex items-start gap-3 p-3 bg-gray-200 rounded-lg">
                               <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                               <span className="text-sm text-gray-700">Third-party intermediaries</span>
                             </div>
                             <div className="flex items-start gap-3 p-3 bg-gray-200 rounded-lg">
                               <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                               <span className="text-sm text-gray-700">Cash payments to individuals</span>
                             </div>
                             <div className="flex items-start gap-3 p-3 bg-gray-200 rounded-lg">
                               <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                               <span className="text-sm text-gray-700">Unverified payment platforms</span>
                             </div>
                           </div>
                        </div>
                      </div>

                       <div className="mt-6 p-4 bg-gray-200 border border-gray-400 rounded-lg">
                         <p className="text-sm text-gray-700 m-0">
                           <strong className="text-black">Warning:</strong> Payments made through unofficial channels are entirely at your own risk. SURAKSHA LEARNING MANAGEMENT SYSTEM (PVT) LTD cannot guarantee service delivery or provide refunds for such transactions.
                         </p>
                       </div>
                    </section>

                    <section id="contact" className="scroll-mt-24">
                      <h2 className="text-2xl font-bold text-foreground mb-6 pb-2 border-b">Contact Information</h2>
                       <div className="bg-gray-100 rounded-lg p-6">
                         <p className="text-gray-700 mb-4">For payment or refund inquiries, contact:</p>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <span className="text-sm text-gray-700 min-w-[140px]">Company:</span>
                            <strong className="text-black">SURAKSHA LEARNING MANAGEMENT SYSTEM (PVT) LTD</strong>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="text-sm text-gray-700 min-w-[140px]">Reg. No:</span>
                            <strong className="text-black">PV 00342747</strong>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="text-sm text-gray-700 min-w-[140px]">Address:</span>
                            <span className="text-gray-700">188/79 The Finans Waththa, Wilimbula, Henegama</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="text-sm text-gray-700 min-w-[140px]">Phone:</span>
                            <strong className="text-black">+94 70 330 0524</strong>
                          </div>
                           <div className="flex items-start gap-3">
                             <span className="text-sm text-gray-700 min-w-[140px]">Financial Support:</span>
                             <strong className="text-foreground">financialsupport@suraksha.lk</strong>
                           </div>
                           <div className="flex items-start gap-3">
                             <span className="text-sm text-gray-700 min-w-[140px]">General Support:</span>
                             <strong className="text-foreground">service@suraksha.lk</strong>
                           </div>
                        </div>
                      </div>
                    </section>
                  </div>

                  <div className="mt-12 pt-8 border-t text-center">
                    <p className="text-sm text-muted-foreground">
                      © 2025 SURAKSHA LEARNING MANAGEMENT SYSTEM (PVT) LTD. Transparent financial policies.<br />
                      PV 00342747 | +94 70 330 0524<br />
                      🇱🇰 Sri Lankan registered education services
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
export default RefundPolicy;