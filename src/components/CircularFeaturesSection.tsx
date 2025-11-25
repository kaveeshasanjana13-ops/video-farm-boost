import React from "react";
import { Building2, Users, Brain, Bell, CreditCard, FileCheck, BookOpen, Settings, PenTool, GraduationCap, DollarSign, UserCheck, Trophy, Database, UsersRound, Zap } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
interface FeatureItem {
  iconUrl: JSX.Element;
  secondIconUrl?: JSX.Element;
  secondItemBGColor: string;
  title: string;
}
const CircularFeaturesSection = () => {
  const isMobile = useIsMobile();
  const features: FeatureItem[] = [{
    iconUrl: <Building2 className="w-8 h-8 text-white" />,
    secondItemBGColor: "from-blue-500 to-blue-600",
    title: "Multi Institute"
  }, {
    iconUrl: <Users className="w-8 h-8 text-white" />,
    secondItemBGColor: "from-green-500 to-green-600",
    title: "User Management"
  }, {
    iconUrl: <Brain className="w-8 h-8 text-white" />,
    secondItemBGColor: "from-purple-500 to-purple-600",
    title: "Suraksha AI"
  }, {
    iconUrl: <Bell className="w-8 h-8 text-white" />,
    secondItemBGColor: "from-orange-500 to-orange-600",
    title: "Attendance"
  }, {
    iconUrl: <CreditCard className="w-8 h-8 text-white" />,
    secondItemBGColor: "from-red-500 to-red-600",
    title: "Smart IDs"
  }, {
    iconUrl: <FileCheck className="w-8 h-8 text-white" />,
    secondItemBGColor: "from-indigo-500 to-indigo-600",
    title: "Exam & Result"
  }, {
    iconUrl: <BookOpen className="w-8 h-8 text-white" />,
    secondItemBGColor: "from-teal-500 to-teal-600",
    title: "Lectures"
  }, {
    iconUrl: <Settings className="w-8 h-8 text-white" />,
    secondItemBGColor: "from-pink-500 to-pink-600",
    title: "Organizations"
  }];
  const outerFeatures: FeatureItem[] = [{
    iconUrl: <PenTool className="w-6 h-6 text-white" />,
    secondItemBGColor: "from-emerald-500 to-emerald-600",
    title: "Homework"
  }, {
    iconUrl: <GraduationCap className="w-6 h-6 text-white" />,
    secondItemBGColor: "from-violet-500 to-violet-600",
    title: "Courses"
  }, {
    iconUrl: <DollarSign className="w-6 h-6 text-white" />,
    secondItemBGColor: "from-amber-500 to-amber-600",
    title: "Payments"
  }, {
    iconUrl: <UserCheck className="w-6 h-6 text-white" />,
    secondItemBGColor: "from-cyan-500 to-cyan-600",
    title: "Parent Interface"
  }, {
    iconUrl: <Trophy className="w-6 h-6 text-white" />,
    secondItemBGColor: "from-rose-500 to-rose-600",
    title: "Results"
  }, {
    iconUrl: <Database className="w-6 h-6 text-white" />,
    secondItemBGColor: "from-slate-500 to-slate-600",
    title: "Unlimited Storage"
  }, {
    iconUrl: <UsersRound className="w-6 h-6 text-white" />,
    secondItemBGColor: "from-lime-500 to-lime-600",
    title: "Unlimited Users"
  }, {
    iconUrl: <Zap className="w-6 h-6 text-white" />,
    secondItemBGColor: "from-yellow-500 to-yellow-600",
    title: "Zero Downtime"
  }];
  return <section className="py-20 bg-gradient-to-br from-background via-muted/10 to-primary/5 relative overflow-hidden">
      {/* Background Elements */}
      

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
            Powerful LMS Features
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover the comprehensive features that make SurakshaLMS the perfect solution for modern educational institutions
          </p>
        </div>

        {/* Circular Features Container */}
        <div className={`relative w-full mx-auto flex items-center justify-center ${isMobile ? 'h-[400px] max-w-sm' : 'h-[600px] max-w-4xl'}`}>
          {/* Center Logo */}
          <div className={`absolute z-20 rounded-full bg-white shadow-2xl flex items-center justify-center border-4 border-primary/20 ${isMobile ? 'w-20 h-20' : 'w-32 h-32'}`}>
            <img src="/assets/logos/surakshalms-logo.png" alt="SurakshaLMS Logo" className={`object-contain ${isMobile ? 'w-12 h-12' : 'w-20 h-20'}`} />
          </div>

          {/* Circular Orbit Paths */}
          <div className={`absolute border-2 border-dashed border-primary/20 rounded-full ${isMobile ? 'w-48 h-48' : 'w-80 h-80'}`}></div>
          <div className={`absolute border-2 border-dashed border-primary/15 rounded-full ${isMobile ? 'w-80 h-80' : 'w-[600px] h-[600px]'}`}></div>

          {/* Inner Rotating Features Container */}
          <div className={`absolute animate-spin ${isMobile ? 'w-48 h-48' : 'w-80 h-80'}`} style={{
          animationDuration: '60s'
        }}>
            {features.map((feature, index) => {
            const angle = index * 360 / features.length;
            const radius = isMobile ? 96 : 160; // Mobile: 96px, Desktop: 160px
            const x = Math.cos((angle - 90) * (Math.PI / 180)) * radius;
            const y = Math.sin((angle - 90) * (Math.PI / 180)) * radius;
            return <div key={index} className="absolute" style={{
              transform: `translate(${x}px, ${y}px)`,
              left: '50%',
              top: '50%',
              marginLeft: isMobile ? '-20px' : '-40px',
              marginTop: isMobile ? '-20px' : '-40px'
            }}>
                  <div className={`bg-gradient-to-br ${feature.secondItemBGColor} rounded-full flex items-center justify-center shadow-lg transition-all duration-300 cursor-pointer group animate-spin relative ${isMobile ? 'w-10 h-10 hover:shadow-lg' : 'w-20 h-20 hover:shadow-xl hover:scale-110'}`} style={{
                animationDuration: '60s',
                animationDirection: 'reverse'
              }}>
                    <div className={`transition-transform duration-300 ${isMobile ? '' : 'group-hover:scale-110'}`}>
                      {isMobile ? <div className="w-4 h-4 text-white flex items-center justify-center">
                          {React.cloneElement(feature.iconUrl, {
                      className: 'w-4 h-4 text-white'
                    })}
                        </div> : feature.iconUrl}
                    </div>
                    
                    {/* Label - Always visible above circles */}
                    <div className={`absolute bottom-full left-1/2 -translate-x-1/2 text-primary font-medium whitespace-nowrap z-30 pointer-events-none ${isMobile ? 'mb-1 text-[8px]' : 'mb-2 text-xs'}`} style={{
                  minWidth: 'max-content'
                }}>
                      {feature.title}
                    </div>
                  </div>
                </div>;
          })}
          </div>

          {/* Outer Rotating Features Container - Opposite Direction */}
          <div className={`absolute animate-spin ${isMobile ? 'w-80 h-80' : 'w-[600px] h-[600px]'}`} style={{
          animationDuration: '80s',
          animationDirection: 'reverse'
        }}>
            {outerFeatures.map((feature, index) => {
            const angle = index * 360 / outerFeatures.length;
            const radius = isMobile ? 160 : 300; // Mobile: 160px, Desktop: 300px
            const x = Math.cos((angle - 90) * (Math.PI / 180)) * radius;
            const y = Math.sin((angle - 90) * (Math.PI / 180)) * radius;
            return <div key={index} className="absolute" style={{
              transform: `translate(${x}px, ${y}px)`,
              left: '50%',
              top: '50%',
              marginLeft: isMobile ? '-16px' : '-30px',
              marginTop: isMobile ? '-16px' : '-30px'
            }}>
                  <div className={`bg-gradient-to-br ${feature.secondItemBGColor} rounded-full flex items-center justify-center shadow-lg transition-all duration-300 cursor-pointer group animate-spin relative ${isMobile ? 'w-8 h-8 hover:shadow-lg' : 'w-16 h-16 hover:shadow-xl hover:scale-110'}`} style={{
                animationDuration: '80s',
                animationDirection: 'normal'
              }}>
                    <div className={`transition-transform duration-300 ${isMobile ? '' : 'group-hover:scale-110'}`}>
                      {isMobile ? <div className="w-3 h-3 text-white flex items-center justify-center">
                          {React.cloneElement(feature.iconUrl, {
                      className: 'w-3 h-3 text-white'
                    })}
                        </div> : feature.iconUrl}
                    </div>
                    
                    {/* Label - Always visible above circles */}
                    <div className={`absolute bottom-full left-1/2 -translate-x-1/2 text-primary font-medium whitespace-nowrap z-30 pointer-events-none ${isMobile ? 'mb-1 text-[8px]' : 'mb-2 text-xs'}`} style={{
                  minWidth: 'max-content'
                }}>
                      {feature.title}
                    </div>
                  </div>
                </div>;
          })}
          </div>

          {/* Connecting Lines Animation */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
            <defs>
              <linearGradient id="featureGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            
            {/* Animated connecting lines */}
            {features.map((_, index) => {
            const angle = index * 360 / features.length;
            const radius = 200;
            const x = Math.cos((angle - 90) * (Math.PI / 180)) * radius + 300;
            const y = Math.sin((angle - 90) * (Math.PI / 180)) * radius + 300;
            return <line key={index} x1="300" y1="300" x2={x} y2={y} stroke="url(#featureGradient)" strokeWidth="1" strokeDasharray="3,3">
                  <animate attributeName="stroke-dashoffset" values="0;-6" dur="2s" repeatCount="indefinite" />
                </line>;
          })}
          </svg>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-6">
            Experience the power of comprehensive learning management
          </p>
          
        </div>
      </div>
    </section>;
};
export default CircularFeaturesSection;