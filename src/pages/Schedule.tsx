import { Button } from "@/components/ui/button";
import { Calendar, Clock, CheckCircle, ArrowRight, Calculator, BadgeDollarSign, ShieldCheck } from "lucide-react";
import ModernHeader from "@/components/ModernHeader";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
const Schedule = () => {
  return <>
      <SEO title="Schedule a Call - Start Your Video Growth Journey | ContentFarm" description="Book a free 15-minute discovery call to discuss your video content strategy. Get a custom projection and implementation timeline for your SaaS growth." keywords="schedule call, video strategy consultation, content marketing consultation, saas growth call" />
      <div className="min-h-screen bg-background">
        <ModernHeader />
        
        {/* Hero Section */}
        <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6
          }}>
              <div className="inline-block bg-primary/10 border-2 border-primary rounded-lg px-6 py-3 mb-6">
                <p className="text-base sm:text-lg font-bold text-primary uppercase tracking-wide">
                  If You're Done Waiting For Users To "Discover" You
                </p>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 gradient-text leading-tight">
                Let's Build Your Video Content Engine
              </h1>
              
            </motion.div>
          </div>
        </section>

        {/* What to Expect Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-accent/5">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">What to Expect on the Call</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6,
              delay: 0.1
            }} className="bg-card rounded-lg p-6 border border-border">
                <div className="bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center font-bold mb-4 text-xl">1</div>
                <h3 className="text-xl font-bold mb-3">Get Instant Visibility From Dozens of Creators</h3>
                <p className="text-muted-foreground">
                  So your SaaS is finally everywhere your buyers hang out — without you lifting a finger or filming anything.
                </p>
              </motion.div>

              <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6,
              delay: 0.2
            }} className="bg-card rounded-lg p-6 border border-border">
                <div className="bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center font-bold mb-4 text-xl">2</div>
                <h3 className="text-xl font-bold mb-3">Turn Short-Form Attention Into Real Pipeline</h3>
                <p className="text-muted-foreground">So views become clicks, trials, demos, and predictable MRR instead of "nice" vanity metrics.</p>
              </motion.div>

              <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6,
              delay: 0.3
            }} className="bg-card rounded-lg p-6 border border-border">
                <div className="bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center font-bold mb-4 text-xl">3</div>
                <h3 className="text-xl font-bold mb-3">Stop Relying on Luck, Virality, or Algorithm Miracles</h3>
                <p className="text-muted-foreground">
                  So you don't depend on one post, one ad, or one random spike to move your growth graph.
                </p>
              </motion.div>

              <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6,
              delay: 0.4
            }} className="bg-card rounded-lg p-6 border border-border">
                <div className="bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center font-bold mb-4 text-xl">4</div>
                <h3 className="text-xl font-bold mb-3">Quit Pouring Money Into Ads That Get More Expensive Every Month</h3>
                <p className="text-muted-foreground">
                  So you stop spending $5,000+ just to "test" campaigns while creators deliver views for $1–$3 per 1,000.
                </p>
              </motion.div>

              <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6,
              delay: 0.5
            }} className="bg-card rounded-lg p-6 border border-border">
                <div className="bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center font-bold mb-4 text-xl">5</div>
                <h3 className="text-xl font-bold mb-3">Scale Exposure Without Hiring Creators, Editors, or Growth Teams</h3>
                <p className="text-muted-foreground">
                  So you avoid in-house content bottlenecks and plug straight into a fully managed creator-led growth engine.
                </p>
              </motion.div>

              <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6,
              delay: 0.6
            }} className="bg-card rounded-lg p-6 border border-border">
                <div className="bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center font-bold mb-4 text-xl">6</div>
                <h3 className="text-xl font-bold mb-3">Finally Use a System That Delivers Users — Not Just Content</h3>
                <p className="text-muted-foreground">
                  So every view is tracked, every creator is performance-based, and every month adds real revenue to your MRR.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Calendly Embed Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
              <div className="p-8 bg-gradient-to-br from-primary/10 to-accent/10 border-b border-border">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Calendar className="w-8 h-8 text-primary" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-center">Choose Your Time</h2>
                </div>
                <p className="text-center text-muted-foreground">
                  Select a time that works best for you. All times are shown in your local timezone.
                </p>
              </div>
              
              {/* Calendly Embed */}
              <div className="calendly-embed-container" style={{
              minHeight: '630px'
            }}>
                <iframe src="https://calendly.com/kvit/15-minutes-discovery-call" width="100%" height="630" frameBorder="0" title="Schedule a call with ContentFarm" style={{
                border: 0
              }} />
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-accent/5">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">Why Schedule Now?</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card rounded-lg p-6 border border-border text-center">
                <Calculator className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Calculate Your Cost Per Customer (Before You Commit)</h3>
                <p className="text-muted-foreground">
                  We'll show you the exact math: If creators generate 500,000 views at $2 per 1,000 views, your total cost is $1,000. If that produces 25 new customers, your customer acquisition cost drops to $40. Compare that to your current $700 CAC from paid ads. You'll see the ROI before signing anything.
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 border border-border text-center">
                <BadgeDollarSign className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Pay Only for Performance (Not Promises)</h3>
                <p className="text-muted-foreground">
                  No upfront influencer fees. No monthly retainers. No wasted ad spend on unqualified traffic. You pay $1-3 per 1,000 verified views—only after creators post and generate results. If they don't perform, you don't pay. It's the only truly performance-based growth channel for B2B SaaS.
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 border border-border text-center">
                <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">See If Your SaaS Qualifies for Performance Pricing</h3>
                <p className="text-muted-foreground">
                  Not every SaaS can succeed with performance-based affiliates. We'll assess your product's visual appeal, use case clarity, and target audience to determine if video content will convert. If you don't qualify, we'll explain why and what growth channel will work better for your business model.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                
                
              </div>
              
              <div>
                <div className="text-4xl font-bold gradient-text mb-2">40%</div>
                <p className="text-muted-foreground">Average CAC Reduction</p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>;
};
export default Schedule;