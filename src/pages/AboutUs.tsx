
import ModernHeader from '@/components/ModernHeader';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import StructuredData from '@/components/StructuredData';
import Breadcrumb from '@/components/Breadcrumb';
import AboutHero from '@/components/about/AboutHero';
import AboutStory from '@/components/about/AboutStory';
import AboutFounders from '@/components/about/AboutFounders';
import AboutMission from '@/components/about/AboutMission';
import AboutWhyChoose from '@/components/about/AboutWhyChoose';


const AboutUs = () => {
  const faqs = [
    {
      question: "Where is ContentFarm located?",
      answer: "ContentFarm is based in Lisbon, Portugal, but we work with SaaS companies worldwide through our remote-first approach."
    },
    {
      question: "What makes ContentFarm different from other video agencies?",
      answer: "We specialize exclusively in SaaS companies and offer a 30-day results guarantee with unlimited revisions and 14-day turnaround times."
    },
    {
      question: "Who are the founders of ContentFarm?",
      answer: "ContentFarm was co-founded by Vady Kvitey (Creative Director with 8 years of video production experience) and Julia Yuvchenko (CEO with 12 years of IT startup experience)."
    }
  ];

  return (
    <div className="min-h-screen">
      <SEO 
        title="About ContentFarm - SaaS Video Production Experts | Lisbon, Portugal"
        description="Learn about ContentFarm's story, mission, and team. Founded in 2024 in Lisbon, we're dedicated to helping SaaS companies scale through high-converting video content."
        keywords="ContentFarm about, video production team, SaaS marketing experts, Lisbon video agency, Vady Kvitey, Julia Yuvchenko"
        url="https://contentfarm.club/about"
      />
      
      <StructuredData type="faq" faqs={faqs} />
      
      <ModernHeader />
      <Breadcrumb />
      
      <AboutHero />
      
      <AboutStory />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AboutFounders />
      </div>
      
      <AboutMission />
      
      <AboutWhyChoose />
      <Footer />
    </div>
  );
};

export default AboutUs;
