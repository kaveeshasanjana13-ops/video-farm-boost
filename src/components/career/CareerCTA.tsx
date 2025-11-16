
import { Button } from '@/components/ui/button';

const CareerCTA = () => {
  return (
    <section className="py-20 cinematic-cta">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 cinematic-text-shadow">
          Don't See Your Role?
        </h2>
        <p className="text-xl text-gray-300 mb-8">
          We're always looking for talented people. Send us your portfolio and let's talk!
        </p>
        <a href="mailto:kvit@contentfarm.club?subject=General Inquiry">
          <Button size="lg" className="bg-yellow-400 text-black hover:bg-yellow-500 font-semibold">
            Get Your Free Video Growth Plan →
          </Button>
        </a>
      </div>
    </section>
  );
};

export default CareerCTA;
