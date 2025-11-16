import { Target, Users, Award } from 'lucide-react';
import missionImage from '@/assets/mission-video-production.jpg';
const AboutMission = () => {
  return <section className="py-20 cinematic-section relative overflow-hidden">
      <div className="absolute inset-0 cinematic-grain opacity-20"></div>
      <div className="absolute top-20 left-20 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl cinematic-flare"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-yellow-400/20 rounded-full blur-2xl cinematic-flare"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        
        <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center px-6 py-3 cinematic-card border border-white/20">
                <span className="text-sm font-semibold text-yellow-400">Our Mission</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight cinematic-text-shadow">
                Empowering SaaS Growth Through <span className="cinematic-gradient-text">Video Excellence</span>
              </h3>
            </div>
            <p className="text-gray-300 leading-relaxed text-xl">
              To empower SaaS startups and scale-ups with video content that doesn't just look good, but drives real business outcomes. We believe every SaaS company deserves professional video content that converts visitors into customers and customers into advocates.
            </p>
          </div>
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative">
              <img src={missionImage} alt="Professional video production team creating SaaS content" className="rounded-2xl shadow-cinematic hover-scale border border-white/20" />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          <div className="text-center group">
            <div className="relative">
              <div className="w-20 h-20 cinematic-card flex items-center justify-center mx-auto mb-6 border border-white/20 group-hover:bg-yellow-400/10 transition-all duration-300 hover-scale">
                <Target className="w-10 h-10 text-yellow-400" />
              </div>
            </div>
            <h4 className="text-2xl font-bold text-white mb-4 cinematic-gradient-text">Results-Driven</h4>
            <p className="text-gray-300 text-lg leading-relaxed">Every video we create is designed with specific business outcomes in mind, not just aesthetics.</p>
          </div>
          <div className="text-center group">
            <div className="relative">
              <div className="w-20 h-20 cinematic-card flex items-center justify-center mx-auto mb-6 border border-white/20 group-hover:bg-yellow-400/10 transition-all duration-300 hover-scale">
                <Users className="w-10 h-10 text-yellow-400" />
              </div>
            </div>
            <h4 className="text-2xl font-bold text-white mb-4 cinematic-gradient-text">Client-Centric</h4>
            <p className="text-gray-300 text-lg leading-relaxed">Your success is our success. We work as an extension of your team to achieve your goals.</p>
          </div>
          <div className="text-center group">
            <div className="relative">
              <div className="w-20 h-20 cinematic-card flex items-center justify-center mx-auto mb-6 border border-white/20 group-hover:bg-yellow-400/10 transition-all duration-300 hover-scale">
                <Award className="w-10 h-10 text-yellow-400" />
              </div>
            </div>
            <h4 className="text-2xl font-bold text-white mb-4 cinematic-gradient-text">Excellence</h4>
            <p className="text-gray-300 text-lg leading-relaxed">We maintain the highest standards in every project, from concept to final delivery.</p>
          </div>
        </div>
      </div>
    </section>;
};
export default AboutMission;