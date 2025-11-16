
const AboutWhyChoose = () => {
  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-3"></div>
      <div className="absolute top-32 right-32 w-56 h-56 bg-primary/5 blob-fluid blur-3xl animate-blob-breathe"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            <span className="gradient-text">Why Choose ContentFarm</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We're not just another video agency. Here's what sets us apart in the crowded video production landscape.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="liquid-card bg-card/80 backdrop-blur-sm p-10 border border-border/50 hover-lift group">
            <div className="space-y-6">
              <div className="inline-flex items-center px-6 py-3 bg-primary/10 rounded-full border border-primary/20">
                <span className="text-sm font-semibold text-primary">Specialization</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                <span className="gradient-text">SaaS-Focused Expertise</span>
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Unlike generic video agencies, we specialize exclusively in SaaS. We understand your industry, your challenges, and what resonates with your audience.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="w-3 h-3 bg-primary rounded-full mt-2 shadow-lg"></div>
                  <span className="text-muted-foreground text-lg">Deep understanding of SaaS business models</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-3 h-3 bg-primary rounded-full mt-2 shadow-lg"></div>
                  <span className="text-muted-foreground text-lg">Experience with technical product explanations</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-3 h-3 bg-primary rounded-full mt-2 shadow-lg"></div>
                  <span className="text-muted-foreground text-lg">Knowledge of SaaS marketing funnels</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="liquid-card bg-card/80 backdrop-blur-sm p-10 border border-border/50 hover-lift group">
            <div className="space-y-6">
              <div className="inline-flex items-center px-6 py-3 bg-success/10 rounded-full border border-success/20">
                <span className="text-sm font-semibold text-success">Guarantee</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                <span className="gradient-text">Guaranteed Results</span>
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                We're so confident in our approach that we offer guarantees that other agencies won't. Your success is our reputation.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="w-3 h-3 bg-success rounded-full mt-2 shadow-lg"></div>
                  <span className="text-muted-foreground text-lg">30-day results guarantee</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-3 h-3 bg-success rounded-full mt-2 shadow-lg"></div>
                  <span className="text-muted-foreground text-lg">14-day turnaround for most projects</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-3 h-3 bg-success rounded-full mt-2 shadow-lg"></div>
                  <span className="text-muted-foreground text-lg">Unlimited revisions until you're satisfied</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutWhyChoose;
