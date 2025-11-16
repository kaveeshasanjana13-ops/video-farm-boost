import SEO from '@/components/SEO';
import ModernHeader from '@/components/ModernHeader';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Play, TrendingUp, Users } from 'lucide-react';

const YouTubeStrategy = () => {
  return (
    <>
      <SEO 
        title="SaaS Brands Crushing YouTube in 2025 | Marketing Strategy Guide"
        description="Discover how top SaaS brands like HubSpot, Salesforce, and Ahrefs are building powerful YouTube strategies that drive awareness, education, and user trust in 2025."
        keywords="saas youtube marketing, youtube content strategy, saas case studies, video marketing examples, youtube for b2b"
        url="/youtube-strategy"
      />
      
      <ModernHeader />
      
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-primary/5 to-background py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 animate-fade-in">
              <Badge variant="outline" className="mb-6 text-sm font-medium border-primary/20">
                YouTube Strategy
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                SaaS Brands (2025) Crushing It on YouTube
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                YouTube isn't just for gamers and beauty vloggers anymore. In 2025, SaaS brands—especially those in marketing, sales, and AI—are building strong YouTube strategies that drive awareness, education, and user trust.
              </p>

              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground mb-8">
                <div className="flex items-center gap-2">
                  <Play className="h-4 w-4 text-primary" />
                  <span>Video Marketing</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span>2025 Strategy</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span>SaaS Brands</span>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="aspect-video overflow-hidden rounded-xl border border-border/50 shadow-lg mb-12 animate-scale-in">
              <img 
                src="/lovable-uploads/cbeca23c-c3fa-47a7-a435-9558de8f14b1.png" 
                alt="SaaS Brands on YouTube" 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* Introduction */}
          <div className="mb-16 animate-fade-in delay-200">
            <p className="text-lg text-foreground/90 leading-relaxed mb-8">
              Here's a breakdown of how some of the best are doing it.
            </p>
          </div>

          {/* Company Sections */}
          <div className="space-y-12">
            {/* HubSpot */}
            <div className="company-section animate-fade-in delay-300">
              <div className="section-divider mb-8"></div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground flex items-center gap-3 animate-slide-in-right">
                <span className="section-number text-primary">1.</span>
                <span>HubSpot: Turning Education into Engagement</span>
              </h2>
              
              <div className="strategy-label mb-4 animate-scale-in">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
                  Strategy
                </span>
              </div>
              <p className="mb-6 text-foreground/90 leading-relaxed">
                HubSpot uses YouTube as a content marketing engine. Its channel is packed with inbound marketing guides, CRM setup tutorials, and sales best practices.
              </p>
              
              <div className="strategy-label mb-4 animate-scale-in delay-100">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/10 text-green-600 border border-green-500/20">
                  Why it works
                </span>
              </div>
              <p className="mb-6 text-foreground/90 leading-relaxed">
                HubSpot isn't selling in every video—they're teaching. Viewers learn real skills first and naturally become more curious about HubSpot's tools.
              </p>
              
              <div className="strategy-label mb-4 animate-scale-in delay-200">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/10 text-blue-600 border border-blue-500/20">
                  Top Content Types
                </span>
              </div>
              <ul className="space-y-3 ml-6">
                <li className="text-foreground/90 leading-relaxed">Educational tutorials</li>
                <li className="text-foreground/90 leading-relaxed">Marketing strategy explainers</li>
                <li className="text-foreground/90 leading-relaxed">Founder tips and sales enablement insights</li>
              </ul>
            </div>

            {/* Salesforce */}
            <div className="company-section animate-fade-in delay-400">
              <div className="section-divider mb-8"></div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground flex items-center gap-3 animate-slide-in-right">
                <span className="section-number text-primary">2.</span>
                <span>Salesforce: Customer Playlists & Product Updates</span>
              </h2>
              
              <div className="strategy-label mb-4 animate-scale-in">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
                  Strategy
                </span>
              </div>
              <p className="mb-6 text-foreground/90 leading-relaxed">
                Salesforce's channel features highly organized playlists: customer stories, "What's New" updates, and product feature deep-dives.
              </p>
              
              <div className="strategy-label mb-4 animate-scale-in delay-100">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/10 text-green-600 border border-green-500/20">
                  Why it works
                </span>
              </div>
              <p className="mb-6 text-foreground/90 leading-relaxed">
                The playlists keep viewers engaged while addressing different buyer stages. Testimonials offer credibility, while update videos show Salesforce is continuously improving.
              </p>
              
              <div className="strategy-label mb-4 animate-scale-in delay-200">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/10 text-blue-600 border border-blue-500/20">
                  Top Content Types
                </span>
              </div>
              <ul className="space-y-3 ml-6">
                <li className="text-foreground/90 leading-relaxed">Customer success stories</li>
                <li className="text-foreground/90 leading-relaxed">Monthly product updates</li>
                <li className="text-foreground/90 leading-relaxed">Workflow walkthroughs</li>
              </ul>
            </div>

            {/* Hootsuite */}
            <div className="company-section animate-fade-in delay-500">
              <div className="section-divider mb-8"></div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground flex items-center gap-3 animate-slide-in-right">
                <span className="section-number text-primary">3.</span>
                <span>Hootsuite: Blog-to-Video Brilliance</span>
              </h2>
              
              <div className="strategy-label mb-4 animate-scale-in">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
                  Strategy
                </span>
              </div>
              <p className="mb-6 text-foreground/90 leading-relaxed">
                Hootsuite excels at repurposing blog content into YouTube videos. Their viral video based on a blog post—"264 Instagram Captions"—shows just how effective this can be.
              </p>
              
              <div className="strategy-label mb-4 animate-scale-in delay-100">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/10 text-green-600 border border-green-500/20">
                  Why it works
                </span>
              </div>
              <p className="mb-6 text-foreground/90 leading-relaxed">
                Evergreen content performs well on YouTube, and visual learners prefer watching tips to reading them. SEO optimization of titles and descriptions helps too.
              </p>
              
              <div className="strategy-label mb-4 animate-scale-in delay-200">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/10 text-blue-600 border border-blue-500/20">
                  Top Content Types
                </span>
              </div>
              <ul className="space-y-3 ml-6">
                <li className="text-foreground/90 leading-relaxed">Social media how-tos</li>
                <li className="text-foreground/90 leading-relaxed">Tips for content creators</li>
                <li className="text-foreground/90 leading-relaxed">Evergreen strategy videos</li>
              </ul>
            </div>

            {/* Ahrefs */}
            <div className="company-section animate-fade-in delay-600">
              <div className="section-divider mb-8"></div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground flex items-center gap-3 animate-slide-in-right">
                <span className="section-number text-primary">4.</span>
                <span>Ahrefs: Consistency + Authentic Education</span>
              </h2>
              
              <div className="strategy-label mb-4 animate-scale-in">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
                  Strategy
                </span>
              </div>
              <p className="mb-6 text-foreground/90 leading-relaxed">
                Ahrefs treats its YouTube channel like a product—posting consistently with the same presenter and delivering high-value SEO education.
              </p>
              
              <div className="strategy-label mb-4 animate-scale-in delay-100">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/10 text-green-600 border border-green-500/20">
                  Why it works
                </span>
              </div>
              <p className="mb-6 text-foreground/90 leading-relaxed">
                Their content solves real user problems, with just the right amount of product placement. Viewers come to learn and stay to convert.
              </p>
              
              <div className="strategy-label mb-4 animate-scale-in delay-200">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/10 text-blue-600 border border-blue-500/20">
                  Top Content Types
                </span>
              </div>
              <ul className="space-y-3 ml-6">
                <li className="text-foreground/90 leading-relaxed">SEO masterclasses</li>
                <li className="text-foreground/90 leading-relaxed">Keyword research walkthroughs</li>
                <li className="text-foreground/90 leading-relaxed">Long-form, actionable tutorials</li>
              </ul>
            </div>

            {/* Synthesia */}
            <div className="company-section animate-fade-in delay-700">
              <div className="section-divider mb-8"></div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground flex items-center gap-3 animate-slide-in-right">
                <span className="section-number text-primary">5.</span>
                <span>Synthesia: Show, Don't Tell (with AI Demos)</span>
              </h2>
              
              <div className="strategy-label mb-4 animate-scale-in">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
                  Strategy
                </span>
              </div>
              <p className="mb-6 text-foreground/90 leading-relaxed">
                Synthesia, an AI video creation tool, showcases its features through real demos, use cases, and how-tos.
              </p>
              
              <div className="strategy-label mb-4 animate-scale-in delay-100">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/10 text-green-600 border border-green-500/20">
                  Why it works
                </span>
              </div>
              <p className="mb-6 text-foreground/90 leading-relaxed">
                When the product is innovative or complex, seeing it in action builds trust. Synthesia's tutorials are simple, visual, and results-driven.
              </p>
              
              <div className="strategy-label mb-4 animate-scale-in delay-200">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/10 text-blue-600 border border-blue-500/20">
                  Top Content Types
                </span>
              </div>
              <ul className="space-y-3 ml-6">
                <li className="text-foreground/90 leading-relaxed">Step-by-step product demos</li>
                <li className="text-foreground/90 leading-relaxed">Multi-language video use cases</li>
                <li className="text-foreground/90 leading-relaxed">Customer spotlight videos</li>
              </ul>
            </div>
          </div>

          {/* Final Thoughts */}
          <div className="mt-16 animate-fade-in delay-800">
            <div className="section-divider mb-8"></div>
            <h2 className="text-3xl font-bold mb-8 text-foreground animate-slide-in-right">
              Final Thoughts
            </h2>
            
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 rounded-2xl p-8 border border-border">
              <p className="text-lg text-foreground/90 leading-relaxed mb-6">
                In 2025, the best SaaS brands on YouTube aren't just uploading product pitches—they're creating video content that educates, entertains, and builds long-term relationships. Whether it's turning a blog into a binge-worthy tutorial or showcasing a happy customer, these companies are proving that YouTube is one of the most powerful (and underused) tools in the SaaS marketing toolkit.
              </p>
              
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-6">
                <p className="font-semibold text-foreground mb-2">TL;DR:</p>
                <p className="text-foreground/90 leading-relaxed">
                  If you're a SaaS founder, it might be time to grab a mic, hit record, and start turning your knowledge into video gold.
                </p>
              </div>
              
              <p className="text-sm text-muted-foreground italic">
                Inspired by recent case studies and observations from top-performing SaaS YouTube channels in 2025.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center animate-fade-in delay-900">
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 border border-primary/20">
              <h3 className="text-2xl font-bold mb-4">Ready to Build Your YouTube Strategy?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Learn how to create videos that convert prospects into customers with our proven video marketing strategies.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/pricing">
                  <Button size="lg" className="w-full sm:w-auto hover-scale">
                    Get Your Free Video Growth Plan →
                  </Button>
                </Link>
                <Link to="/case-studies">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto hover-scale">
                    View Case Studies
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default YouTubeStrategy;