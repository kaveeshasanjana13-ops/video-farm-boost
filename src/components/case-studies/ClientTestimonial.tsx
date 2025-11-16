import { Quote } from 'lucide-react';

interface ClientTestimonialProps {
  mainTestimonialVideo: string;
  pullQuote: string;
}

const ClientTestimonial = ({
  mainTestimonialVideo,
  pullQuote
}: ClientTestimonialProps) => {
  return (
    <section className="py-16 cinematic-section border-t border-white/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="relative">
            <Quote className="h-12 w-12 text-yellow-400 mx-auto mb-6 opacity-50" />
            <blockquote className="text-2xl md:text-3xl font-bold text-white leading-relaxed animate-fade-in cinematic-text-shadow">
              "{pullQuote}"
            </blockquote>
            <div className="mt-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <p className="text-gray-300 font-semibold">— Josh Martow, Co-founder & CEO of Chaser</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientTestimonial;