import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
const PricingFAQ = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const faqs = [{
    question: "What's included in the revision process?",
    answer: "Starter plan includes 2 revisions where you can request changes to content, timing, animations, or messaging. Professional plan includes unlimited revisions to ensure your video is perfect."
  }, {
    question: "How long does it take to create a video?",
    answer: "Starter plan videos are delivered in 7-10 days, while Professional plan videos are delivered in 3-5 days with priority support. Rush delivery options are available for urgent projects."
  }, {
    question: "Do you provide the script and storyboard?",
    answer: "Professional plan includes complete script writing and storyboarding services. Starter plan customers can provide their own script or upgrade to include our script writing services."
  }, {
    question: "What video formats and quality do you deliver?",
    answer: "All videos are delivered in MP4 format optimized for web, social media, and presentations. Starter plan includes 1080p HD quality, while Professional plan offers 4K quality and multiple format exports (MOV, AVI, and platform-specific optimizations)."
  }, {
    question: "Can I upgrade from Starter to Professional?",
    answer: "Yes! You can upgrade at any time during your project. We'll adjust the scope, add unlimited revisions, and include all Professional plan benefits like script writing and priority delivery."
  }];
  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };
  return <section className="py-20 cinematic-section relative overflow-hidden">
      <div className="absolute inset-0 cinematic-grain opacity-20"></div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 cinematic-text-shadow">
            Frequently Asked 
            <span className="cinematic-gradient-text block"> Questions</span>
          </h2>
            
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => <Card key={index} className="cinematic-card border border-white/20 hover:border-yellow-400/50 transition-all duration-200">
              <button onClick={() => toggleFAQ(index)} className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-yellow-400/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white pr-4">{faq.question}</h3>
                  <div className="flex-shrink-0">
                    {openFAQ === index ? <Minus className="h-5 w-5 text-yellow-400" /> : <Plus className="h-5 w-5 text-gray-400" />}
                  </div>
                </div>
              </button>
              {openFAQ === index && <div className="px-6 pb-6">
                  <div className="border-t border-white/10 pt-4">
                    <p className="text-gray-200 leading-relaxed text-base">{faq.answer}</p>
                  </div>
                </div>}
            </Card>)}
        </div>

        {/* Additional Help Section */}
        <div className="mt-12 text-center">
          <Card className="cinematic-card border border-white/20 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-yellow-500/10"></div>
            <CardContent className="p-8 relative">
              <h3 className="text-3xl font-bold mb-4 cinematic-gradient-text">Still have questions?</h3>
              <p className="text-gray-200 mb-6 text-lg leading-relaxed">
                Our team is here to help you choose the right plan and answer any questions about our video production process.
              </p>
              <a href="https://calendly.com/kvit/15-minutes-discovery-call" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="cinematic-cta text-lg px-8 py-6">
                  Schedule a Free Consultation
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>;
};
export default PricingFAQ;