import { Button } from "@/components/ui/button";
import { Check, Clock, Shield, Target, TrendingUp, Users, Zap, Award, BarChart3, Rocket } from "lucide-react";
import ModernHeader from "@/components/ModernHeader";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TwentyOneSteps from "@/components/TwentyOneSteps";
import completeSystemBg from "@/assets/complete-system-bg.jpg";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
const ContentMachine = () => {
  return <>
      <SEO title="Content Machine - Automated Video Content at Scale | ContentFarm" description="Transform your content production with our Content Machine. Automated, scalable video creation system designed to grow your SaaS business." keywords="content machine, automated video production, video content at scale, saas video content, content automation" />
      <div className="min-h-screen bg-background">
        <ModernHeader />
        
        {/* Hero Section */}
        <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-block bg-primary/10 border-2 border-primary rounded-lg px-6 py-3 mb-6">
              <p className="text-base sm:text-lg font-bold text-primary uppercase tracking-wide">
                We Build Your Performance-Based Video Affiliate Program. You Only Pay When It Works
              </p>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 gradient-text leading-tight">In 30 Days We'll Bring You 50+ Creators Posting Videos About Your SaaS — Fully Done-For-You (You Only Pay for Views, and All New MRR Is Yours)</h1>
            <div className="max-w-4xl mx-auto mb-12 space-y-8">
              {/* Problem Statement */}
              <div className="space-y-3">
                <p className="text-lg sm:text-xl text-foreground/90 leading-relaxed">
                  Your customer acquisition cost is rising. Your churn is accelerating. Your competitors are building video armies while you're stuck vetting unqualified affiliates.
                </p>
              </div>

              {/* Solution Statement */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 space-y-4">
                <p className="text-xl sm:text-2xl text-foreground font-semibold leading-relaxed">
                  We fix that in 30 days: 50+ vetted creators promoting your product across TikTok, YouTube, Instagram and X.
                </p>
              </div>

              {/* Value Propositions */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-card border border-border rounded-lg p-5">
                  <p className="text-base sm:text-lg text-foreground leading-relaxed">
                    <span className="font-bold text-primary">You pay $1-3 per 1,000 views.</span> You keep 100% of revenue from every new customer.
                  </p>
                </div>
                <div className="bg-card border border-border rounded-lg p-5">
                  <p className="text-base sm:text-lg text-foreground leading-relaxed">
                    <span className="font-bold text-primary">No upfront influencer fees.</span> No wasted ad spend. Just predictable, performance-based growth.
                  </p>
                </div>
              </div>
            </div>
            <Link to="/schedule">
              <Button className="btn-gradient font-bold shadow-2xl hover:shadow-glow transition-all duration-300 hover:scale-105 text-xl sm:text-2xl px-16 sm:px-24 py-8 sm:py-10 rounded-2xl min-w-[300px] sm:min-w-[400px]">
                Schedule a Call
              </Button>
            </Link>
          </div>
        </section>

        {/* Problem-Agitate-Solution Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-accent/5">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="bg-card rounded-lg p-8 border border-border">
                <h3 className="text-2xl font-bold mb-4 text-destructive">The Problem</h3>
                <p className="text-muted-foreground">Your customer acquisition cost is crushing your margins. $700+ per customer and rising. You're stuck in an endless loop: recruit affiliates → they ghost → recruit again → they produce garbage → repeat. You're burning cash and time with zero return.
              </p>
              </div>
              <div className="bg-card rounded-lg p-8 border border-border">
                <h3 className="text-2xl font-bold mb-4 text-destructive">The Reality</h3>
                <p className="text-muted-foreground">Your competitors aren't wasting time vetting affiliates. They've already built 50+ creators posting daily across TikTok, YouTube, and Instagram. They're dominating your market with authentic content that converts 4X better than your paid ads. While you're stuck with underperforming affiliates, they're scaling.</p>
              </div>
              <div className="bg-card rounded-lg p-8 border border-primary shadow-lg">
                <h3 className="text-2xl font-bold mb-4 text-primary">The Solution</h3>
                <p className="text-muted-foreground">
                  We build you a performance-based video creator team in 30 days. 50+ vetted creators. Daily content across all platforms. You pay $1-3 per 1,000 views (only for results). You keep 100% of customer revenue. Cut your customer acquisition cost by 40-50%. No upfront fees. No wasted time. Just predictable, scalable growth.
                </p>
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link to="/schedule">
              <Button className="btn-gradient font-bold shadow-2xl hover:shadow-glow transition-all duration-300 hover:scale-105 text-xl sm:text-2xl px-16 sm:px-24 py-8 sm:py-10 rounded-2xl min-w-[300px] sm:min-w-[400px]">
                Schedule A Call
              </Button>
            </Link>
          </div>
        </section>

        {/* The Problem Section (Agitation) */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center">The Real Cost of DIY Affiliate Management</h2>
            <p className="text-xl text-muted-foreground text-center mb-16 max-w-3xl mx-auto">
              While you're stuck in manual processes, here's what it's actually costing your business
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card rounded-lg p-8 border border-border">
                <Clock className="w-12 h-12 text-destructive mb-4" />
                <h3 className="text-xl font-bold mb-4">The Hidden Cost</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="text-destructive mr-2">•</span>
                    <span>20+ hours/week vetting unqualified applicants</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-destructive mr-2">•</span>
                    <span>70% of recruited affiliates never produce content</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-destructive mr-2">•</span>
                    <span>Brand safety concerns with unvetted creators</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-destructive mr-2">•</span>
                    <span>Inconsistent content quality damaging reputation</span>
                  </li>
                </ul>
              </div>

              <div className="bg-card rounded-lg p-8 border border-border">
                <TrendingUp className="w-12 h-12 text-destructive mb-4" />
                <h3 className="text-xl font-bold mb-4">The Competitive Threat</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="text-destructive mr-2">•</span>
                    <span>Competitors using UGC achieving 79% higher conversion rates</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-destructive mr-2">•</span>
                    <span>Market share erosion while you're stuck in manual processes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-destructive mr-2">•</span>
                    <span>First-mover advantage in your niche is disappearing</span>
                  </li>
                </ul>
              </div>

              <div className="bg-destructive/10 rounded-lg p-8 border border-destructive">
                <BarChart3 className="w-12 h-12 text-destructive mb-4" />
                <h3 className="text-xl font-bold mb-4 text-destructive">Calculate The Real Cost</h3>
                <div className="space-y-3 text-muted-foreground">
                  <p className="font-semibold text-foreground">20 hours × $200/hour founder time = <span className="text-destructive">$4,000/week wasted</span></p>
                  <p><span className="font-semibold text-foreground">Opportunity cost:</span> Lost customers going to competitors with better social proof</p>
                  <p><span className="font-semibold text-foreground">CAC increasing</span> while competitors' is dropping 50%</p>
                </div>
              </div>
            </div>
          </div>
          
        </section>

        {/* Unique Mechanism Section */}
        <section className="relative py-12 px-4 sm:px-6 lg:px-8 bg-accent/5 overflow-hidden">
          {/* Animated background image with slow zoom */}
          <motion.div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" style={{
          backgroundImage: `url(${completeSystemBg})`
        }} animate={{
          scale: [1, 1.1, 1]
        }} transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }} />
          {/* Animated gradient overlays */}
          
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16">
              
              
            </div>

            

            
          </div>
          <div className="text-center mt-8">
            <Link to="/schedule">
              <Button className="btn-gradient font-bold shadow-2xl hover:shadow-glow transition-all duration-300 hover:scale-105 text-xl sm:text-2xl px-16 sm:px-24 py-8 sm:py-10 rounded-2xl min-w-[300px] sm:min-w-[400px]">
                Schedule A Call
              </Button>
            </Link>
          </div>
        </section>

        {/* 21 Steps Visual */}
        <TwentyOneSteps />

        {/* Transformation Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-16 text-center">The Transformation</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-destructive/10 rounded-lg p-8 border border-destructive">
                <h3 className="text-2xl font-bold mb-6 text-destructive">BEFORE (Current State)</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="text-destructive mr-2">✗</span>
                    <span>Spending 20+ hours/week manually vetting unqualified affiliates</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-destructive mr-2">✗</span>
                    <span>Unpredictable content flow (feast or famine)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-destructive mr-2">✗</span>
                    <span>Constant brand safety concerns</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-destructive mr-2">✗</span>
                    <span>Rising customer acquisition costs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-destructive mr-2">✗</span>
                    <span>Watching competitors gain market share with authentic UGC</span>
                  </li>
                </ul>
              </div>

              <div className="bg-primary/10 rounded-lg p-8 border-2 border-primary shadow-lg">
                <div className="text-center mb-4">
                  <Rocket className="w-16 h-16 text-primary mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-primary">THE BRIDGE</h3>
                  
                </div>
                <p className="text-muted-foreground text-center">
                  We handle everything from recruitment to management to optimization so you can focus on closing deals, not vetting TikTokers.
                </p>
              </div>

              <div className="bg-primary/10 rounded-lg p-8 border border-primary">
                <h3 className="text-2xl font-bold mb-6 text-primary">AFTER (Desired State)</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span>50+ high-quality video clips per month on autopilot</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span>Predictable content pipeline (scheduled releases)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span>Pre-vetted, brand-safe creators (90% qualification rate)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span>79% higher conversion rates from UGC-powered campaigns</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span>60% increase in qualified leads within 90 days</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span>50% reduction in cost-per-click on paid ads</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link to="/schedule">
              <Button className="btn-gradient font-bold shadow-2xl hover:shadow-glow transition-all duration-300 hover:scale-105 text-xl sm:text-2xl px-16 sm:px-24 py-8 sm:py-10 rounded-2xl min-w-[300px] sm:min-w-[400px]">
                Schedule A Call
              </Button>
            </Link>
          </div>
        </section>

        {/* Urgency & Scarcity */}
        

        {/* FAQ / Objection Handling */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground text-center mb-12">
              Everything you need to know before getting started
            </p>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">This is too expensive. How do I justify the investment?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground mb-4">
                    Let's look at the real cost. You're currently spending 20+ hours per week on affiliate management—that's $16,000/month of founder time at a conservative $200/hour. Plus, your CAC is likely 40-50% higher than it could be without authentic social proof.
                  </p>
                  <p className="text-muted-foreground">
                    The real question isn't "Can I afford this?"—it's "Can I afford NOT to do this while my competitors scale with UGC?" Our average client sees a 3.8X ROI within 6 months. This isn't an expense; it's the highest-leverage investment you can make in predictable growth.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">I'm worried about content quality and brand safety</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground mb-4">
                    That's exactly why we built the Clipper Vetting System™. Unlike generic affiliate programs where anyone can join, we use a proprietary 5-stage qualification process that ensures 90% of recruited clippers produce brand-safe, high-quality content.
                  </p>
                  <p className="text-muted-foreground">
                    Every clip goes through our 24-hour review process before approval. You have final say on every piece of content. Plus, we provide pre-written scripts and brand guidelines to ensure consistency.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">We're already working with another agency</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground mb-4">
                    That's great—it means you understand the value of UGC. The question is: are they using a proprietary vetting system that guarantees 90% clipper activation? Are they providing 24-48 hour payouts to keep creators motivated? Are they offering performance guarantees?
                  </p>
                  <p className="text-muted-foreground">
                    Most agencies treat affiliate management as a side service. We've built our entire business around the Clipper Vetting System™ because we've seen the 79% conversion increases and 60% lead growth it delivers.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left">I don't have time to manage this</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground mb-4">
                    That's precisely why this is a done-for-you service. You're not managing anything—we are. We handle recruitment, vetting, onboarding, training, content review, payout approval, ongoing motivation, performance optimization, and budget management.
                  </p>
                  <p className="text-muted-foreground">
                    Your only involvement is a 30-minute weekly check-in call to review performance and approve strategic decisions. Compare that to the 20+ hours per week you're currently spending on manual affiliate management.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left">I need to see results before committing long-term</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground mb-4">
                    Completely reasonable. That's why we offer the Pilot Program—a 3-month engagement designed specifically for SaaS founders who want to test the system before scaling.
                  </p>
                  <p className="text-muted-foreground">
                    You'll get 25-50 vetted clippers and 25+ clips per month with a performance guarantee: if we don't deliver the promised clips, we work for free until we do. Most Pilot clients see measurable improvements in lead volume within 60 days and convert to the Growth Accelerator program.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          
        </section>

        {/* Final CTA */}
        

        <Footer />
      </div>
    </>;
};
export default ContentMachine;