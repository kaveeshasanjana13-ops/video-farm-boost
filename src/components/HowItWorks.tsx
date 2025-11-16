import { MessageSquare, Lightbulb, Video, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import ContactFormDialog from '@/components/ContactFormDialog';

const HowItWorks = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const steps = [
    {
      icon: MessageSquare,
      title: "Discovery Call",
      description: "We dive deep into your goals, audience, and success metrics in a 30-minute strategy session.",
      timeline: "Day 1",
      proof: "Over 150 SaaS founders started here",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Lightbulb,
      title: "Strategy & Script",
      description: "Our team creates a data-driven video strategy and compelling script tailored to your audience.",
      timeline: "Days 2-4",
      proof: "92% script approval on first draft",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Video,
      title: "Production & Edit",
      description: "We bring your vision to life with professional production, animation, and post-production.",
      timeline: "Days 5-12",
      proof: "Cinema-quality output every time",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Rocket,
      title: "Launch & Optimize",
      description: "We help you deploy and track performance, making data-driven optimizations for maximum ROI.",
      timeline: "Days 13-14",
      proof: "Average 3.4x conversion increase",
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <section id="how-it-works" className="relative py-32 cinematic-section overflow-hidden border-t border-primary/10">
      {/* Premium background with gradient mesh */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black"></div>
      <div className="absolute top-0 left-0 w-full h-full opacity-30">
        <div className="absolute top-20 left-[10%] w-96 h-96 bg-primary/20 blob-organic blur-3xl animate-blob"></div>
        <div className="absolute bottom-20 right-[10%] w-[500px] h-[500px] bg-primary/15 blob-shape blur-3xl animate-blob-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/10 blob-soft blur-3xl animate-blob-breathe" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Premium header */}
        <div className="text-center space-y-6 mb-24">
          <div className="inline-block">
            <span className="text-sm font-medium tracking-[0.2em] uppercase text-primary/80 mb-4 block">The Process</span>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight">
              How It Works
            </h2>
          </div>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light">
            Our proven 14-day process takes you from initial brief to high-converting video content. 
            <span className="text-white font-normal"> No surprises, just results.</span>
          </p>
        </div>

        <div className="relative">
          {/* Premium animated connection line */}
          <div className="hidden lg:block absolute top-32 left-1/2 transform -translate-x-1/2 h-[calc(100%-8rem)]">
            <div className="absolute inset-0 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent"></div>
            <div className="absolute inset-0 w-px bg-gradient-to-b from-primary/0 via-primary/50 to-primary/0 animate-pulse" style={{ left: '0.5px' }}></div>
          </div>
          
          <div className="space-y-32 lg:space-y-40">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;
              
              return (
                <div key={index} className={`flex items-center justify-center ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} flex-col lg:gap-24 gap-12 animate-fade-in`} style={{ animationDelay: `${index * 0.15}s` }}>
                  {/* Content side */}
                  <div className={`lg:w-[45%] space-y-6 ${isEven ? 'lg:text-right lg:pr-8' : 'lg:text-left lg:pl-8'} text-center`}>
                    {/* Glass morphism card */}
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      <div className="relative backdrop-blur-sm bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 md:p-10 transition-all duration-500 hover:bg-white/[0.04] hover:border-white/[0.1]">
                        <div className="space-y-5">
                          <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/20 to-primary-glow/20 border border-primary/30 text-sm font-semibold text-primary tracking-wide`}>
                            <span>{step.timeline}</span>
                          </div>
                          <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight tracking-tight">
                            {step.title}
                          </h3>
                          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-lg mx-auto lg:mx-0 font-light">
                            {step.description}
                          </p>
                          <div className={`flex items-center gap-2 ${isEven ? 'lg:justify-end' : 'lg:justify-start'} justify-center pt-3`}>
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                            <p className="text-sm text-primary/90 font-medium">
                              {step.proof}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Icon side */}
                  <div className="lg:w-auto flex-shrink-0 relative">
                    {/* Connector dots */}
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-full left-1/2 transform -translate-x-1/2 mt-12 space-y-3">
                        <div className="w-2 h-2 bg-primary/70 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
                        <div className="w-2 h-2 bg-primary/50 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        <div className="w-2 h-2 bg-primary/30 rounded-full animate-pulse" style={{ animationDelay: '0.8s' }}></div>
                      </div>
                    )}
                    
                    {/* Premium icon container */}
                    <div className="group relative">
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-glow to-primary rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-700 animate-pulse"></div>
                      
                      {/* Icon */}
                      <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-primary via-primary-glow to-primary flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:rotate-12 cursor-pointer">
                        <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-black/50 to-black/30 backdrop-blur-sm"></div>
                        <Icon className="relative h-16 w-16 text-primary transition-all duration-700 group-hover:scale-110 group-hover:-rotate-12" strokeWidth={1.5} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:w-[45%] hidden lg:block"></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Premium CTA */}
        <div className="text-center mt-32">
          <div className="relative group max-w-3xl mx-auto">
            {/* Ambient glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary-glow/10 to-transparent rounded-[2.5rem] blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            {/* Glass card */}
            <div className="relative backdrop-blur-xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/[0.1] rounded-[2.5rem] p-12 md:p-14 transition-all duration-500 hover:border-white/[0.15]">
              <div className="space-y-6">
                <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                  Ready to Get Started?
                </h3>
                <p className="text-lg md:text-xl text-gray-300 font-light max-w-xl mx-auto leading-relaxed">
                  Book a free strategy call and we'll create a custom video roadmap for your SaaS in just 30 minutes.
                </p>
                <div className="pt-4">
                <Button 
                  size="lg" 
                  className="cinematic-cta text-base md:text-lg px-10 py-6 font-semibold shadow-glow hover:shadow-glow hover:scale-105 transition-all duration-500"
                  onClick={() => setIsDialogOpen(true)}
                >
                  Get Your Free Video Growth Plan →
                </Button>
                <ContactFormDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
