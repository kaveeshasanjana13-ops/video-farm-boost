import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import ContactFormDialog from '@/components/ContactFormDialog';

const PricingPlans = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const plans = [
    {
      name: "Professional",
      price: "Price on demand",
      period: "",
      description: "Comprehensive video solutions tailored to your specific needs",
      features: [
        "Product Demo Videos",
        "Explainer Videos",
        "Onboarding Videos",
        "Webinar Repurposing",
        "YouTube Content Strategy",
        "Social Media Shorts",
        "Advanced animations & transitions",
        "Unlimited revisions",
        "4K quality available",
        "Priority support",
        "Fast delivery (3-5 days)",
        "Script writing included"
      ],
      popular: true
    }
  ];

  return (
    <section className="py-20 cinematic-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative cinematic-card border backdrop-blur-xl ${plan.popular ? 'border-yellow-400/50 shadow-glow' : 'border-white/20 shadow-cinematic'}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center pb-6 border-b border-white/10">
                <CardTitle className="text-3xl font-bold text-white mb-4">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-5xl font-bold cinematic-gradient-text">{plan.price}</span>
                  {plan.period && <span className="text-gray-300 ml-2 text-lg">{plan.period}</span>}
                </div>
                <CardDescription className="mt-6 text-gray-200 text-base leading-relaxed">{plan.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="pt-8">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-200 text-base leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  onClick={() => setIsDialogOpen(true)}
                  className={`w-full text-lg py-6 font-semibold transition-all duration-300 ${plan.popular 
                    ? 'cinematic-cta' 
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  }`}
                >
                  Get Your Free Video Growth Plan →
                </Button>
                <ContactFormDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;
