
import { Card, CardContent } from '@/components/ui/card';
import { Users, Clock, MapPin } from 'lucide-react';

const CareerBenefits = () => {
  return (
    <section className="py-20 cinematic-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4 cinematic-text-shadow">Why Join ContentFarm?</h2>
          <p className="text-xl text-gray-300">What makes us a great place to work</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Users className="h-8 w-8 text-yellow-400" />,
              title: "Remote-First Culture",
              description: "Work from anywhere with flexible hours and a focus on results, not time spent online."
            },
            {
              icon: <Clock className="h-8 w-8 text-yellow-400" />,
              title: "Growth Opportunities",
              description: "Develop your skills with challenging projects and continuous learning opportunities."
            },
            {
              icon: <MapPin className="h-8 w-8 text-yellow-400" />,
              title: "Creative Freedom",
              description: "Express your creativity while working on innovative video projects for exciting SaaS companies."
            }
          ].map((benefit, index) => (
            <Card key={index} className="text-center cinematic-card border-white/10">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{benefit.title}</h3>
                <p className="text-gray-300">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CareerBenefits;
