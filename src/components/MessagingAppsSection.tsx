import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Send, Users, Bell, Zap, MessageSquare, Phone, Video } from "lucide-react";
import whatsappLogo from "@/assets/whatsapp-logo.png";
import telegramLogo from "@/assets/telegram-logo.png";
import messagingApps1 from "@/assets/messaging-apps-1.png";
import messagingApps2 from "@/assets/messaging-apps-2.png";
const MessagingAppsSection = () => {
  const [clickedButton, setClickedButton] = useState<string | null>(null);
  const handleButtonClick = (platform: string) => {
    setClickedButton(platform);
    setTimeout(() => setClickedButton(null), 800);
  };
  const images = [{
    src: whatsappLogo,
    alt: "WhatsApp Logo"
  }, {
    src: telegramLogo,
    alt: "Telegram Logo"
  }, {
    src: messagingApps1,
    alt: "Messaging Apps Integration"
  }, {
    src: messagingApps2,
    alt: "Combined Platform Features"
  }];
  return <section className="py-20 bg-gradient-to-br from-background via-muted/5 to-primary/5 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated connecting lines */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
              <stop offset="100%" stopColor="hsl(var(--primary-dark))" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="lineGradient2" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity="0.1" />
              <stop offset="100%" stopColor="hsl(var(--info))" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          
          {/* Connecting Lines */}
          <path
            d="M 50 50 Q 300 100 550 80 T 900 120"
            stroke="url(#lineGradient1)"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
            style={{ animationDuration: '4s' }}
          />
          <path
            d="M 100 200 Q 400 150 700 180 T 950 160"
            stroke="url(#lineGradient2)"
            strokeWidth="1.5"
            fill="none"
            className="animate-pulse"
            style={{ animationDuration: '6s', animationDelay: '2s' }}
          />
          <path
            d="M 80 350 Q 350 300 600 340 T 850 320"
            stroke="url(#lineGradient1)"
            strokeWidth="1"
            fill="none"
            className="animate-pulse"
            style={{ animationDuration: '5s', animationDelay: '1s' }}
          />
        </svg>

        {/* Floating WhatsApp Icons */}
        <div className="absolute top-16 left-16 animate-pulse" style={{ animationDuration: '3s' }}>
          <div className="p-4 rounded-full bg-green-500/10 backdrop-blur-sm float-animation">
            <MessageCircle className="w-8 h-8 text-green-600/60" />
          </div>
        </div>
        
        <div className="absolute top-32 right-20 animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }}>
          <div className="p-3 rounded-full bg-green-500/10 backdrop-blur-sm float-animation">
            <Send className="w-6 h-6 text-green-600/50" />
          </div>
        </div>

        {/* Floating Telegram Icons */}
        <div className="absolute bottom-24 left-24 animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }}>
          <div className="p-4 rounded-full bg-blue-500/10 backdrop-blur-sm float-animation">
            <MessageSquare className="w-8 h-8 text-blue-600/60" />
          </div>
        </div>
        
        <div className="absolute bottom-40 right-16 animate-pulse" style={{ animationDuration: '3.5s' }}>
          <div className="p-3 rounded-full bg-blue-500/10 backdrop-blur-sm float-animation">
            <Bell className="w-6 h-6 text-blue-600/50" />
          </div>
        </div>

        {/* Additional Messaging Icons */}
        <div className="absolute top-1/2 left-8 animate-pulse" style={{ animationDuration: '4.5s', animationDelay: '0.5s' }}>
          <div className="p-3 rounded-full bg-purple-500/10 backdrop-blur-sm float-animation">
            <Users className="w-6 h-6 text-purple-600/50" />
          </div>
        </div>
        
        <div className="absolute top-1/3 right-32 animate-pulse" style={{ animationDuration: '6s', animationDelay: '1.5s' }}>
          <div className="p-4 rounded-full bg-orange-500/10 backdrop-blur-sm float-animation">
            <Zap className="w-8 h-8 text-orange-600/60" />
          </div>
        </div>

        <div className="absolute bottom-1/3 left-1/3 animate-pulse" style={{ animationDuration: '5.5s', animationDelay: '2.5s' }}>
          <div className="p-3 rounded-full bg-pink-500/10 backdrop-blur-sm float-animation">
            <Phone className="w-6 h-6 text-pink-600/50" />
          </div>
        </div>

        <div className="absolute top-20 left-1/2 animate-pulse" style={{ animationDuration: '4s', animationDelay: '3s' }}>
          <div className="p-3 rounded-full bg-indigo-500/10 backdrop-blur-sm float-animation">
            <Video className="w-6 h-6 text-indigo-600/50" />
          </div>
        </div>

        {/* Glowing orbs for ambient effect */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-xl animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-10 left-10 w-16 h-16 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-lg animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
            AI-Powered LMS in Messaging Apps
          </h2>
          
          {/* 4 Images Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
            {images.map((image, index) => <div key={index} className="relative group">
                
                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 to-primary-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
              </div>)}
          </div>

          <p className="text-muted-foreground text-lg max-w-4xl mx-auto leading-relaxed">
            For the first time in Sri Lanka, empower students, parents, and educational teams with instant LMS access via WhatsApp and Telegram bots. Receive real-time notifications, updates on causes, and AI-powered assistance directly on your favorite messaging platform. Perfect for academic communities looking to stay connected and engaged without needing to access a separate portal.
          </p>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <p className="text-lg font-medium text-primary mb-8">
            Choose your favorite platform and experience
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            {/* WhatsApp Button */}
            <Button onClick={() => handleButtonClick('whatsapp')} className={`
                group relative px-8 py-4 text-lg font-semibold rounded-xl
                bg-green-500 hover:bg-green-600 text-white
                shadow-lg hover:shadow-xl
                transform transition-all duration-300
                ${clickedButton === 'whatsapp' ? 'scale-95 animate-pulse' : 'hover:scale-105'}
                overflow-hidden
              `}>
              {/* Button background animation */}
              <div className={`
                absolute inset-0 bg-gradient-to-r from-green-400 to-green-600
                transition-opacity duration-300
                ${clickedButton === 'whatsapp' ? 'opacity-100 animate-pulse' : 'opacity-0 group-hover:opacity-100'}
              `}></div>
              
              <div className="relative flex items-center gap-3">
                <MessageCircle className="w-6 h-6" />
                <span>Join with WhatsApp</span>
              </div>
              
              {/* Click animation ripple */}
              {clickedButton === 'whatsapp' && <div className="absolute inset-0 rounded-xl bg-white/30 animate-ping"></div>}
            </Button>

            {/* Telegram Button */}
            <Button onClick={() => {
              handleButtonClick('telegram');
              window.open('https://t.me/SurakshaLMS_Bot', '_blank');
            }} className={`
                group relative px-8 py-4 text-lg font-semibold rounded-xl
                bg-blue-500 hover:bg-blue-600 text-white
                shadow-lg hover:shadow-xl
                transform transition-all duration-300
                ${clickedButton === 'telegram' ? 'scale-95 animate-pulse' : 'hover:scale-105'}
                overflow-hidden
              `}>
              {/* Button background animation */}
              <div className={`
                absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600
                transition-opacity duration-300
                ${clickedButton === 'telegram' ? 'opacity-100 animate-pulse' : 'opacity-0 group-hover:opacity-100'}
              `}></div>
              
              <div className="relative flex items-center gap-3">
                <MessageCircle className="w-6 h-6" />
                <span>Join with Telegram</span>
              </div>
              
              {/* Click animation ripple */}
              {clickedButton === 'telegram' && <div className="absolute inset-0 rounded-xl bg-white/30 animate-ping"></div>}
            </Button>
          </div>
        </div>
      </div>
    </section>;
};
export default MessagingAppsSection;