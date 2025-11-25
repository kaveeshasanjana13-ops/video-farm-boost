import ModernNavigation from "@/components/ModernNavigation";
import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

const BotPrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState("");

  const sections = [
    { id: "introduction", title: "Introduction", level: 1 },
    { id: "information-collect", title: "Information We Collect", level: 1 },
    { id: "basic-account", title: "Basic Account Information", level: 2 },
    { id: "message-usage", title: "Message and Usage Data", level: 2 },
    { id: "linked-lms", title: "Linked LMS Account Data", level: 2 },
    { id: "data-usage", title: "Purpose of Data Usage", level: 1 },
    { id: "data-sharing", title: "Data Sharing", level: 1 },
    { id: "data-retention", title: "Data Retention", level: 1 },
    { id: "user-rights", title: "User Rights", level: 1 },
    { id: "security", title: "Security and Protection", level: 1 },
    { id: "legal-compliance", title: "Legal Compliance and Consent", level: 1 },
    { id: "policy-updates", title: "Policy Updates", level: 1 },
    { id: "contact", title: "Contact Us", level: 1 },
  ];

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

  return (
    <>
      <ModernNavigation />
      
      <div className="min-h-screen bg-background pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex gap-8">
            {/* Table of Contents Sidebar */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-36 bg-card rounded-lg shadow-sm border p-6">
                <h3 className="font-semibold text-foreground mb-4">Table of Contents</h3>
                <nav className="space-y-1">
                  {sections.map(section => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        activeSection === section.id
                          ? "bg-gray-100 text-black font-medium"
                          : "text-gray-600 hover:text-black hover:bg-gray-50"
                      } ${section.level === 2 ? "ml-4" : ""}`}
                    >
                      {section.title}
                    </button>
                  ))}
                </nav>
                
                {/* Navigation Controls */}
                <div className="mt-6 pt-4 border-t">
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigateSection("up")}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-muted hover:bg-muted/70 rounded-md transition-colors"
                    >
                      <ChevronUp className="w-4 h-4" />
                      Previous
                    </button>
                    <button
                      onClick={() => navigateSection("down")}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-muted hover:bg-muted/70 rounded-md transition-colors"
                    >
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
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    🛡️ Suraksha LMS – WhatsApp & Telegram Bot Privacy Policy
                  </h1>
                  <p className="text-muted-foreground">
                    How we protect your data when using our messaging bots
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">Last Updated: October 2025</p>
                </header>

                {/* Content */}
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <div className="space-y-12">
                    {/* Section 1: Introduction */}
                    <section id="introduction" className="scroll-mt-24">
                      <h2 className="text-2xl font-bold text-foreground mb-6 pb-2 border-b">
                        1. Introduction
                      </h2>
                      <p className="text-muted-foreground leading-relaxed">
                        Suraksha LMS ("we," "our," or "us") is a multi-institute educational platform providing 
                        digital learning, attendance, communication, and management services across Sri Lanka. 
                        To enhance communication and automation, we operate official <strong>WhatsApp</strong> and{" "}
                        <strong>Telegram Bots</strong> (collectively, "the Bots") that deliver notifications, 
                        attendance confirmations, payment reminders, and support messages.
                      </p>
                      <p className="text-muted-foreground leading-relaxed mt-4">
                        This Privacy Policy explains how we collect, use, store, and protect personal information 
                        when users interact with our Bots.
                      </p>
                    </section>

                    {/* Section 2: Information We Collect */}
                    <section id="information-collect" className="scroll-mt-24">
                      <h2 className="text-2xl font-bold text-foreground mb-6 pb-2 border-b">
                        2. Information We Collect
                      </h2>
                      <p className="text-muted-foreground mb-6">
                        When you communicate with our WhatsApp or Telegram Bots, we may collect the following:
                      </p>

                      <div className="space-y-8">
                        <div id="basic-account" className="scroll-mt-24">
                          <h3 className="text-lg font-semibold text-foreground mb-4">
                            2.1 Basic Account Information
                          </h3>
                          <div className="bg-gray-100 rounded-lg p-4">
                            <ul className="space-y-2 text-gray-700">
                              <li>• <strong className="text-black">WhatsApp:</strong> Phone number, profile name, and display picture (if visible).</li>
                              <li>• <strong className="text-black">Telegram:</strong> Username, user ID, profile name, and chat ID.</li>
                            </ul>
                          </div>
                        </div>

                        <div id="message-usage" className="scroll-mt-24">
                          <h3 className="text-lg font-semibold text-foreground mb-4">
                            2.2 Message and Usage Data
                          </h3>
                          <div className="bg-gray-100 rounded-lg p-4">
                            <ul className="space-y-2 text-gray-700">
                              <li>• The messages, commands, or attachments you send.</li>
                              <li>• Automated metadata such as timestamps, message type, and delivery or read status.</li>
                              <li>• System logs for monitoring service quality.</li>
                            </ul>
                          </div>
                        </div>

                        <div id="linked-lms" className="scroll-mt-24">
                          <h3 className="text-lg font-semibold text-foreground mb-4">
                            2.3 Linked LMS Account Data
                          </h3>
                          <div className="bg-gray-100 rounded-lg p-4">
                            <p className="text-gray-700 mb-3">
                              If your chat account is linked with your Suraksha LMS profile, we may access limited details such as:
                            </p>
                            <ul className="space-y-2 text-gray-700">
                              <li>• Full name, institute, class, or role (teacher, student, or admin).</li>
                              <li>• Attendance or payment information relevant to notifications.</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Section 3: Purpose of Data Usage */}
                    <section id="data-usage" className="scroll-mt-24">
                      <h2 className="text-2xl font-bold text-foreground mb-6 pb-2 border-b">
                        3. Purpose of Data Usage
                      </h2>
                      <p className="text-muted-foreground mb-4">We process this data only to:</p>
                      <div className="bg-gray-100 border-l-4 border-black rounded-r-lg p-6">
                        <ul className="space-y-3 text-gray-700">
                          <li>• Authenticate and verify users.</li>
                          <li>• Deliver personalized notifications, reminders, and updates.</li>
                          <li>• Provide interactive support (e.g., attendance status, results, or payment info).</li>
                          <li>• Improve system reliability and detect misuse or spam.</li>
                          <li>• Analyze usage trends to enhance educational communication efficiency.</li>
                        </ul>
                      </div>
                      <div className="mt-6 p-4 bg-gray-100 border border-gray-300 rounded-lg">
                        <p className="text-sm text-gray-700 m-0">
                          <strong className="text-black">Important:</strong> We <strong>never</strong> sell, rent, 
                          or share user data with advertisers or unrelated third parties.
                        </p>
                      </div>
                    </section>

                    {/* Section 4: Data Sharing */}
                    <section id="data-sharing" className="scroll-mt-24">
                      <h2 className="text-2xl font-bold text-foreground mb-6 pb-2 border-b">
                        4. Data Sharing
                      </h2>
                      <p className="text-muted-foreground mb-6">Your data is shared only with:</p>
                      <div className="space-y-4">
                        <div className="bg-gray-100 rounded-lg p-4">
                          <p className="text-gray-700">
                            <strong className="text-black">• Authorized Institute Administrators</strong> – for 
                            educational and operational needs.
                          </p>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-4">
                          <p className="text-gray-700">
                            <strong className="text-black">• Platform Providers</strong> – Meta (for WhatsApp), 
                            Telegram FZ-LLC, and secure cloud infrastructure providers (AWS / Google Cloud).
                          </p>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-4">
                          <p className="text-gray-700">
                            <strong className="text-black">• Communication Partners</strong> – limited only to 
                            ensure reliable message delivery (e.g., API gateways).
                          </p>
                        </div>
                      </div>
                      <div className="mt-6 p-4 bg-gray-100 border border-gray-300 rounded-lg">
                        <p className="text-sm text-gray-700 m-0">
                          All parties are bound by strict confidentiality and compliance obligations.
                        </p>
                      </div>
                    </section>

                    {/* Section 5: Data Retention */}
                    <section id="data-retention" className="scroll-mt-24">
                      <h2 className="text-2xl font-bold text-foreground mb-6 pb-2 border-b">
                        5. Data Retention
                      </h2>
                      <div className="space-y-4">
                        <div className="bg-gray-100 rounded-lg p-4">
                          <p className="text-gray-700">
                            • Chat history and logs are retained only as long as necessary for operational or legal purposes.
                          </p>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-4">
                          <p className="text-gray-700">
                            • Critical event data (attendance or payment confirmation) is stored securely in your 
                            Suraksha LMS account.
                          </p>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-4">
                          <p className="text-gray-700">
                            • You may request deletion of your bot-related data anytime by contacting support or 
                            sending <strong className="text-black">"STOP"</strong> to the Bot.
                          </p>
                        </div>
                      </div>
                    </section>

                    {/* Section 6: User Rights */}
                    <section id="user-rights" className="scroll-mt-24">
                      <h2 className="text-2xl font-bold text-foreground mb-6 pb-2 border-b">
                        6. User Rights
                      </h2>
                      <p className="text-muted-foreground mb-4">You have the right to:</p>
                      <div className="bg-gray-100 border-l-4 border-black rounded-r-lg p-6">
                        <ul className="space-y-3 text-gray-700">
                          <li>• Request access to your personal data held through the Bots.</li>
                          <li>• Request correction or deletion of inaccurate or outdated information.</li>
                          <li>
                            • Withdraw consent for communication via WhatsApp or Telegram by sending{" "}
                            <strong className="text-black">"STOP"</strong> or contacting our support team.
                          </li>
                        </ul>
                      </div>
                    </section>

                    {/* Section 7: Security and Protection */}
                    <section id="security" className="scroll-mt-24">
                      <h2 className="text-2xl font-bold text-foreground mb-6 pb-2 border-b">
                        7. Security and Protection
                      </h2>
                      <p className="text-muted-foreground mb-6">
                        We apply multiple layers of protection including:
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-gray-100 rounded-lg">
                          <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">
                            End-to-end encrypted communication between the Bot platforms and our servers.
                          </span>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-gray-100 rounded-lg">
                          <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">
                            Enforced secure access controls within our LMS infrastructure.
                          </span>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-gray-100 rounded-lg">
                          <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">
                            Regular monitoring, auditing, and encrypted data storage practices.
                          </span>
                        </div>
                      </div>
                    </section>

                    {/* Section 8: Legal Compliance and Consent */}
                    <section id="legal-compliance" className="scroll-mt-24">
                      <h2 className="text-2xl font-bold text-foreground mb-6 pb-2 border-b">
                        8. Legal Compliance and Consent
                      </h2>
                      <p className="text-muted-foreground mb-4">
                        By interacting with the Suraksha LMS Bots, you consent to:
                      </p>
                      <div className="bg-gray-100 rounded-lg p-6">
                        <ul className="space-y-3 text-gray-700">
                          <li>• The collection and use of your data as described in this policy.</li>
                          <li>
                            • Compliance with the <strong className="text-black">Sri Lankan Personal Data Protection 
                            Act, No. 9 of 2022</strong>, and relevant platform policies (Meta / Telegram).
                          </li>
                        </ul>
                      </div>
                      <div className="mt-6 p-4 bg-gray-100 border border-gray-300 rounded-lg">
                        <p className="text-sm text-gray-700 m-0">
                          <strong className="text-black">Note:</strong> Users under the age of 18 must obtain consent 
                          from a parent, guardian, or authorized school representative before using the Bots.
                        </p>
                      </div>
                    </section>

                    {/* Section 9: Policy Updates */}
                    <section id="policy-updates" className="scroll-mt-24">
                      <h2 className="text-2xl font-bold text-foreground mb-6 pb-2 border-b">
                        9. Policy Updates
                      </h2>
                      <p className="text-muted-foreground">
                        We may update this policy periodically to reflect new regulations or service improvements. 
                        The "Last Updated" date at the top will indicate the most recent version.
                      </p>
                    </section>

                    {/* Section 10: Contact Us */}
                    <section id="contact" className="scroll-mt-24">
                      <h2 className="text-2xl font-bold text-foreground mb-6 pb-2 border-b">
                        10. Contact Us
                      </h2>
                      <p className="text-muted-foreground mb-6">
                        For any data-related requests or inquiries:
                      </p>
                      <div className="bg-gray-100 rounded-lg p-6 space-y-3">
                        <p className="text-gray-700 m-0">
                          📧 <strong className="text-black">Email:</strong>{" "}
                          <a href="mailto:privacy@suraksha.lk" className="text-black hover:underline">
                            privacy@suraksha.lk
                          </a>
                        </p>
                        <p className="text-gray-700 m-0">
                          🌐 <strong className="text-black">Website:</strong>{" "}
                          <a href="https://www.suraksha.lk" className="text-black hover:underline" target="_blank" rel="noopener noreferrer">
                            www.suraksha.lk
                          </a>
                        </p>
                        <p className="text-gray-700 m-0">
                          🏢 <strong className="text-black">Address:</strong> Suraksha LMS (Pvt) Ltd, Colombo, Sri Lanka
                        </p>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BotPrivacyPolicy;
