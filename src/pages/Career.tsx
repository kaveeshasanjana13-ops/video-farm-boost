
import ModernHeader from '@/components/ModernHeader';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import Breadcrumb from '@/components/Breadcrumb';
import CareerHero from '@/components/career/CareerHero';
import CareerPositions from '@/components/career/CareerPositions';
import CareerBenefits from '@/components/career/CareerBenefits';
import CareerCTA from '@/components/career/CareerCTA';

const Career = () => {
  return (
    <div className="min-h-screen cinematic-section">
      <SEO 
        title="Careers at ContentFarm - Join Our Video Production Team"
        description="Join ContentFarm's creative team! We're hiring video editors and content strategists for remote positions. Help create amazing video content for SaaS companies worldwide."
        keywords="ContentFarm careers, video editor jobs, content strategist jobs, remote video production jobs, SaaS marketing jobs"
        url="https://contentfarm.club/career"
      />
      
      <ModernHeader />
      <Breadcrumb />
      
      <main className="pt-16">
        <CareerHero />
        <CareerPositions />
        <CareerBenefits />
        <CareerCTA />
      </main>

      <Footer />
    </div>
  );
};

export default Career;
