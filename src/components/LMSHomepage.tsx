import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import ModernNavigation from "./ModernNavigation";
import { useState } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import LMSCharacter from "./LMSCharacter";
import WhiteboardSection from "./WhiteboardSection";
import TextToVideoSections from "./TextToVideoSections";
import CircularFeaturesSection from "./CircularFeaturesSection";
import MessagingAppsSection from "./MessagingAppsSection";
import WebsitePreviewSection from "./WebsitePreviewSection";
import AwardsSection from "./AwardsSection";
import Footer from "./Footer";
import SmartNFCSection from "./SmartNFCSection";
import PartnersSection from "./PartnersSection";
import VideoShowcaseSection from "./VideoShowcaseSection";
import ContactForm from "./ContactForm";
const LMSHomepage = () => {
  const [isTransformed, setIsTransformed] = useState(false);
  const { elementRef: heroRef, isVisible: heroVisible } = useIntersectionObserver();

  const handleLMSClick = () => {
    setIsTransformed(true);
    setTimeout(() => setIsTransformed(false), 4000);
  };
  return <>
      {/* Modern Navigation */}
      <ModernNavigation />
      
      {/* Main LMS Homepage Section */}
      <div ref={heroRef} className="min-h-screen bg-background relative overflow-hidden pt-24">
        {/* Subtle Dotted Circles Background */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          {/* Large dotted circles */}
          <div className="absolute top-20 left-10 w-64 h-64 border-2 border-dashed border-primary/20 rounded-full"></div>
          <div className="absolute top-40 right-20 w-48 h-48 border-2 border-dashed border-primary/15 rounded-full"></div>
          <div className="absolute bottom-32 left-1/4 w-56 h-56 border-2 border-dashed border-primary/20 rounded-full"></div>
          <div className="absolute bottom-20 right-1/3 w-40 h-40 border border-dashed border-primary/15 rounded-full"></div>
        </div>

        {/* Subtle Decorative Icons */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          {/* Top left area */}
          <div className="absolute top-32 left-20 text-primary/30">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
            </svg>
          </div>
          <div className="absolute top-48 left-40 text-primary/25">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          
          {/* Top right area */}
          <div className="absolute top-24 right-32 text-primary/30">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <div className="absolute top-56 right-20 text-primary/20">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"/>
            </svg>
          </div>

          {/* Bottom left area */}
          <div className="absolute bottom-40 left-32 text-primary/25">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>

          {/* Bottom right area */}
          <div className="absolute bottom-48 right-40 text-primary/30">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
        </div>

        {/* Floating Small Dots */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(40)].map((_, i) => <div key={i} className="absolute w-1.5 h-1.5 bg-primary/15 rounded-full" style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }} />)}
        </div>


        {/* Blue Characters Moving Toward LMS */}
        <LMSCharacter type="student" color="blue" position="top-left" isMovingToward={!isTransformed} />
        <LMSCharacter type="teacher" color="blue" position="top-right" isMovingToward={!isTransformed} />
        <LMSCharacter type="institute" color="blue" position="top-center" isMovingToward={!isTransformed} />

        {/* Central LMS Portal */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          {/* Security Icons Around Main Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Lock icon - top left */}
            <div className="absolute -translate-x-64 -translate-y-32 text-primary/20">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            
            {/* Shield icon - top right */}
            <div className="absolute translate-x-64 -translate-y-32 text-primary/20">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            
            {/* Eye icon - left */}
            <div className="absolute -translate-x-80 text-primary/20">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
            
            {/* Fingerprint icon - right */}
            <div className="absolute translate-x-80 text-primary/20">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4"/>
                <path d="M5 19.5C5.5 18 6 15 6 12c0-.7.12-1.37.34-2"/>
                <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02"/>
                <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4"/>
                <path d="M8.65 22c.21-.66.45-1.32.57-2"/>
                <path d="M14 13.12c0 2.38 0 6.38-1 8.88"/>
                <path d="M2 16h.01"/>
                <path d="M21.8 16c.2-2 .131-5.354 0-6"/>
                <path d="M9 6.8a6 6 0 0 1 9 5.2c0 .47 0 1.17-.02 2"/>
              </svg>
            </div>
            
            {/* Sparkles - bottom left */}
            <div className="absolute -translate-x-64 translate-y-40 text-primary/20">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3v18M3 12h18M5.636 5.636l12.728 12.728M18.364 5.636L5.636 18.364"/>
              </svg>
            </div>
            
            {/* User check - bottom right */}
            <div className="absolute translate-x-64 translate-y-40 text-primary/20">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <polyline points="16 11 18 13 22 9"/>
              </svg>
            </div>
          </div>

          {/* Mission Statement */}
          <div className={`text-center mb-8 z-10 relative transition-all duration-1000 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <img 
              alt="SurakshaLMS - Leading Learning Management System in Sri Lanka" 
              className="h-12 sm:h-16 md:h-20 lg:h-24 w-auto mb-4 mx-auto transition-transform duration-500 hover:scale-105" 
              src="/assets/logos/surakshalms-main-logo.png"
              loading="eager"
            />
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold bg-gradient-to-r from-primary-dark to-primary bg-clip-text text-transparent mb-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              One LMS. One Nation. One Future
            </h1>
            <Button 
              className="bg-gradient-to-r from-primary to-primary-dark text-primary-foreground hover:from-primary-dark hover:to-primary rounded-full px-8 py-6 text-lg font-semibold shadow-2xl hover:shadow-primary/50 transition-all duration-500 transform hover:scale-105 animate-fade-in group"
              onClick={() => window.location.href = '/register/student'}
              style={{ animationDelay: '0.6s' }}
              aria-label="Get started with SurakshaLMS"
            >
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>

        </div>

        {/* Evolution Characters Moving Away from LMS */}
        <LMSCharacter type="student" color="evolution" position="bottom-left" isMovingToward={isTransformed} />
        <LMSCharacter type="teacher" color="evolution" position="bottom-right" isMovingToward={isTransformed} />
        <LMSCharacter type="institute" color="evolution" position="bottom-center" isMovingToward={isTransformed} />

        {/* Connecting Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          <defs>
            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--lms-blue))" stopOpacity="0.8" />
              <stop offset="100%" stopColor="hsl(var(--lms-blue))" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="evolutionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--evolution-dark))" stopOpacity="0.8" />
              <stop offset="100%" stopColor="hsl(var(--evolution-dark))" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          
          {/* Lines from top corners to center */}
          <line x1="10%" y1="20%" x2="50%" y2="50%" stroke="url(#blueGradient)" strokeWidth="2" strokeDasharray="5,5">
            <animate attributeName="stroke-dashoffset" values="0;-10" dur="2s" repeatCount="indefinite" />
          </line>
          <line x1="90%" y1="20%" x2="50%" y2="50%" stroke="url(#blueGradient)" strokeWidth="2" strokeDasharray="5,5">
            <animate attributeName="stroke-dashoffset" values="0;-10" dur="2s" repeatCount="indefinite" />
          </line>
          
          {/* Lines from center to bottom corners */}
          <line x1="50%" y1="50%" x2="10%" y2="80%" stroke="url(#evolutionGradient)" strokeWidth="2" strokeDasharray="5,5">
            <animate attributeName="stroke-dashoffset" values="0;-10" dur="2s" repeatCount="indefinite" />
          </line>
          <line x1="50%" y1="50%" x2="90%" y2="80%" stroke="url(#evolutionGradient)" strokeWidth="2" strokeDasharray="5,5">
            <animate attributeName="stroke-dashoffset" values="0;-10" dur="2s" repeatCount="indefinite" />
          </line>
        </svg>

        {/* Floating Chatbot */}
        

        {/* Footer Stats */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-8 md:gap-12 text-xs text-muted-foreground" role="region" aria-label="Platform statistics">
          <div className="text-center transform hover:scale-110 transition-all duration-300 cursor-default">
            <div className="font-bold text-2xl md:text-3xl bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">430+</div>
            <div className="mt-1 text-foreground/70">Students</div>
          </div>
          <div className="text-center transform hover:scale-110 transition-all duration-300 cursor-default">
            <div className="font-bold text-2xl md:text-3xl bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">30+</div>
            <div className="mt-1 text-foreground/70">Teachers</div>
          </div>
          <div className="text-center transform hover:scale-110 transition-all duration-300 cursor-default">
            <div className="font-bold text-2xl md:text-3xl bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">6+</div>
            <div className="mt-1 text-foreground/70">Institutes</div>
          </div>
        </div>
      </div>

      {/* Partners Section */}
      <PartnersSection />

      {/* Video Showcase Section */}
      <VideoShowcaseSection />

      {/* Whiteboard Animation Section */}
      <WhiteboardSection />

      {/* Circular Features Section */}
      <CircularFeaturesSection />

      {/* Text to Video Sections */}
      <TextToVideoSections />

      {/* Smart NFC ID Section */}
      <SmartNFCSection />

      {/* Messaging Apps Section */}
      <MessagingAppsSection />

      {/* Awards Section */}
      {/* <AwardsSection /> */}

      {/* Website Preview Section */}
      <WebsitePreviewSection />

      {/* Contact Form Section */}
      <ContactForm />

      {/* Footer */}
      <Footer />
    </>;
};
export default LMSHomepage;