import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import ContactFormDialog from '@/components/ContactFormDialog';

const CaseStudyCTA = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return <section className="py-16 cinematic-section border-t border-white/10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-yellow-400/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-yellow-400/5 rounded-full blur-2xl animate-pulse" style={{
        animationDelay: '1s'
      }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 cinematic-text-shadow">
            Ready to Be Our Next Success Story?
          </h2>
          
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in" style={{
        animationDelay: '0.2s'
      }}>
          <Button
            size="lg"
            className="cinematic-cta text-lg px-8 py-4 font-semibold shadow-2xl hover:shadow-glow"
            onClick={() => setIsDialogOpen(true)}
          >
            Get Your Free Video Growth Plan →
          </Button>
          <ContactFormDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />
          <a href="/pricing" className="inline-block border-2 border-yellow-400 text-yellow-400 font-bold text-lg px-8 py-4 rounded-full hover:bg-yellow-400 hover:text-black transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl">
            View Pricing
          </a>
        </div>
        
        <div className="mt-8 animate-fade-in" style={{
        animationDelay: '0.4s'
      }}>
          <p className="text-sm text-gray-300 opacity-75 mb-4">
            Free consultation • Custom strategy • Proven results
          </p>
          <div className="flex items-center justify-center gap-4 text-gray-300">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Available now</span>
            </div>
            <div className="w-1 h-4 bg-gray-500 opacity-50"></div>
            <div className="flex items-center gap-2">
              <span className="text-sm">⚡ Quick turnaround</span>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default CaseStudyCTA;