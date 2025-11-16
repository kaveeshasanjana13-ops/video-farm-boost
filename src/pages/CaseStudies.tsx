import ModernHeader from '@/components/ModernHeader';
import Footer from '@/components/Footer';
import { BarChart3, Eye, MousePointer, DollarSign, Target, Award } from 'lucide-react';
import { useEffect } from 'react';
import CaseStudyHero from '@/components/case-studies/CaseStudyHero';
import ClientTestimonial from '@/components/case-studies/ClientTestimonial';
import BeforeAfterShowcase from '@/components/case-studies/BeforeAfterShowcase';
import GifShowcase from '@/components/case-studies/GifShowcase';

import CaseStudyCTA from '@/components/case-studies/CaseStudyCTA';

const CaseStudies = () => {
  useEffect(() => {
    // Add Wistia scripts to head
    const script1 = document.createElement('script');
    script1.src = 'https://fast.wistia.com/player.js';
    script1.async = true;
    document.head.appendChild(script1);

    // Multiple Wistia embed scripts for different videos
    const videoIds = ['8gywrfd4p3', 'uv0619hth3', 'wuikfu07dd', '1b2pvbr0d0'];
    const scripts: HTMLScriptElement[] = [];
    videoIds.forEach(id => {
      const script = document.createElement('script');
      script.src = `https://fast.wistia.com/embed/${id}.js`;
      script.async = true;
      script.type = 'module';
      document.head.appendChild(script);
      scripts.push(script);
    });

    // Add Wistia styles to head
    const style = document.createElement('style');
    style.textContent = videoIds.map(id => `
      wistia-player[media-id='${id}']:not(:defined) { 
        background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/${id}/swatch'); 
        display: block; 
        filter: blur(5px); 
        padding-top:56.25%; 
      }
    `).join('');
    document.head.appendChild(style);

    // Cleanup function
    return () => {
      document.head.removeChild(script1);
      scripts.forEach(script => document.head.removeChild(script));
      document.head.removeChild(style);
    };
  }, []);

  // Sample data - replace with real project data
  const caseStudyData = {
    client: "TechFlow Solutions",
    project: "SaaS Platform Launch Campaign",
    mainTestimonialVideo: "8gywrfd4p3",
    pullQuote: "ContentFarm team is creative, fast and affective.",
    beforeAfterVideos: {
      testimonials: {
        before: "uv0619hth3",
        after: "wuikfu07dd"
      },
      tutorials: {
        before: "wuikfu07dd",
        after: "youtube:RoGfkuUksFg"
      },
      verticalAds: {
        before: "f0xwww5mdf",
        after: "c5tw2tz3av"
      }
    },
    gif: {
      id: 1,
      title: "Animated Explainer",
      thumbnail: "/public/lovable-uploads/279b69c3-727e-44b2-8758-b80bef592572.png"
    },
    results: [{
      icon: BarChart3,
      metric: "340%",
      description: "Increase in conversions",
      color: "text-green-600"
    }, {
      icon: Eye,
      metric: "2.3M",
      description: "Video views generated",
      color: "text-blue-600"
    }, {
      icon: MousePointer,
      metric: "67%",
      description: "Trial signup rate",
      color: "text-purple-600"
    }, {
      icon: DollarSign,
      metric: "$127K",
      description: "Revenue attributed to videos",
      color: "text-emerald-600"
    }, {
      icon: Target,
      metric: "89%",
      description: "Customer retention rate",
      color: "text-orange-600"
    }, {
      icon: Award,
      metric: "4.9/5",
      description: "Client satisfaction score",
      color: "text-pink-600"
    }]
  };

  return (
    <div className="min-h-screen bg-black">
      <ModernHeader />
      
      <main className="pt-24">
        <CaseStudyHero mainTestimonialVideo={caseStudyData.mainTestimonialVideo} />
        <ClientTestimonial 
          mainTestimonialVideo={caseStudyData.mainTestimonialVideo}
          pullQuote={caseStudyData.pullQuote}
        />
        <BeforeAfterShowcase beforeAfterVideos={caseStudyData.beforeAfterVideos} />
        <GifShowcase gif={caseStudyData.gif} />
        
        <CaseStudyCTA />
      </main>

      <Footer />
    </div>
  );
};

export default CaseStudies;