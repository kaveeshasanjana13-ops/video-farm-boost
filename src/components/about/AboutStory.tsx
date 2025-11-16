import { Users, Target, Award } from 'lucide-react';
const AboutStory = () => {
  const teamStats = [{
    icon: Users,
    number: "5+",
    label: "Team Members"
  }, {
    icon: Target,
    number: "200+",
    label: "Projects Completed"
  }, {
    icon: Award,
    number: "50+",
    label: "Happy Clients"
  }];
  return <section className="py-20 cinematic-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto mb-16">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
                <span className="cinematic-gradient-text cinematic-text-shadow">
                  Videos That Convert Viewers Into Revenue
                </span>
              </h2>
              <p className="text-xl font-semibold text-gray-200">We don't just create content — we create growth engines for SaaS companies</p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-yellow-400">Our Story</h3>
              <p className="text-gray-300 leading-relaxed">
                Founded in 2024 in the city of Lisbon, Portugal, ContentFarm was born from a simple observation: SaaS companies were struggling to communicate their value proposition through traditional marketing methods.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-yellow-400">Our Mission</h3>
              <p className="text-gray-300 leading-relaxed">
                Every SaaS startup deserves video content that doesn't just look professional, but actually drives measurable business results. We transform complex software into compelling stories that turn prospects into paying customers and customers into brand advocates.
              </p>
            </div>
          </div>
        </div>

        {/* By the Numbers */}
        
      </div>
    </section>;
};
export default AboutStory;