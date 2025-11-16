import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface Result {
  icon: LucideIcon;
  metric: string;
  description: string;
  color: string;
}

interface ResultsSectionProps {
  results: Result[];
}

const ResultsSection = ({ results }: ResultsSectionProps) => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 animate-fade-in">
            Results & Impact
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Measurable success across all key performance indicators
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map((result, index) => {
            const IconComponent = result.icon;
            return (
              <Card 
                key={index} 
                className="text-center p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg animate-scale-in hover-scale group"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <CardContent className="space-y-6">
                  <div className={`mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-white to-gray-100 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 ${result.color} group-hover:scale-110`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <div className="text-5xl font-bold text-gray-900 group-hover:scale-105 transition-transform duration-300">
                    {result.metric}
                  </div>
                  <p className="text-gray-600 font-medium text-lg leading-relaxed">
                    {result.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional visual element */}
        <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="inline-flex items-center justify-center w-32 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;