import { Check, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const TwentyOneSteps = () => {
  const [expandedPhase, setExpandedPhase] = useState<number | null>(0);

  const phases = [
    {
      num: 1,
      title: "FOUNDATION & STRATEGIC SETUP",
      timeline: "Days 1-14",
      color: "from-blue-500/20 to-blue-600/20",
      borderColor: "border-blue-500/30",
      steps: [
        {
          num: 1,
          title: "SaaS Product Deep Dive & ICP Mapping",
          desc: "We analyze your product features, ideal customer profile, core use cases, competitive positioning, onboarding friction points, and market differentiation to extract your unique value proposition."
        },
        {
          num: 2,
          title: "Messaging Extraction & Hook Development",
          desc: "We identify your strongest hooks, value propositions, emotional triggers, pain points, and viral storylines that resonate with your target audience and drive conversions."
        },
        {
          num: 3,
          title: "Creative Strategy Blueprint & Content Angles",
          desc: "We craft your short-form content strategy across multiple angles: toolkit videos, pain-based narratives, demo-style walkthroughs, meme-style content, comparison videos, founder POV stories, and trend remixes."
        },
        {
          num: 4,
          title: "Platform Strategy Mapping & Format Optimization",
          desc: "We tailor content formats specifically for TikTok (9:16 vertical, trending sounds), YouTube Shorts (hook-first structure), Instagram Reels (aesthetic-driven), and X Video (conversation-starting), ensuring each platform's algorithm and audience preferences are optimized."
        },
        {
          num: 5,
          title: "Conversion Path Engineering & Funnel Design",
          desc: "We engineer the complete customer journey from initial view → profile click → link click → landing page → trial signup → product demo → paid customer, with optimized touchpoints at each stage."
        },
        {
          num: 6,
          title: "Brand Safety Framework & Compliance Guidelines",
          desc: "We establish clear guidelines for language, visual identity, allowed claims, prohibited statements, and compliance rules to ensure all creator content stays on-brand and legally compliant."
        }
      ]
    },
    {
      num: 2,
      title: "CONTENT CREATION & ASSET PRODUCTION",
      timeline: "Days 7-21 (overlaps with Phase 1)",
      color: "from-purple-500/20 to-purple-600/20",
      borderColor: "border-purple-500/30",
      steps: [
        {
          num: 7,
          title: "Core Video Production for Official Channels",
          desc: "We produce a complete batch of 10-50 professionally filmed or animated short-form videos for your official brand channels, establishing content quality standards and brand voice."
        },
        {
          num: 8,
          title: "Creator Video Kit Creation & Template Library",
          desc: "We build ready-to-use video templates for creators including B-roll footage libraries, text overlay templates, hook variations, transition effects, background music options, and CTA ending sequences."
        },
        {
          num: 9,
          title: "Script Packs & Hook Libraries Development",
          desc: "We create done-for-them scripts, storyboards, opening hooks, value propositions, objection handlers, and closing punchlines that remove all creative friction and ensure consistent messaging."
        },
        {
          num: 10,
          title: "Trend-Adaptive Content Versions",
          desc: "We prepare multiple content versions aligned with active platform trends, viral sounds, popular formats, and cultural moments to maximize organic reach and engagement."
        },
        {
          num: 11,
          title: "Monthly Content Refresh System Setup",
          desc: "We establish an ongoing content production pipeline that delivers new videos, updated scripts, and fresh angles each month to keep content relevant and virality potential high."
        }
      ]
    },
    {
      num: 3,
      title: "CREATOR RECRUITMENT & TRAINING",
      timeline: "Days 15-30",
      color: "from-green-500/20 to-green-600/20",
      borderColor: "border-green-500/30",
      steps: [
        {
          num: 12,
          title: "Multi-Platform Creator Sourcing Campaigns",
          desc: "We launch targeted outreach campaigns across TikTok, YouTube, Instagram, and X to attract video creators who match your niche, audience, and content style requirements."
        },
        {
          num: 13,
          title: "Creator Vetting & Quality Scoring System",
          desc: "We evaluate each applicant using our proprietary scoring system: posting consistency analysis, niche alignment verification, audience engagement quality assessment, content tone evaluation, and performance history review."
        },
        {
          num: 14,
          title: "Selective Approval & Dashboard Onboarding",
          desc: "Approved creators join your exclusive performance affiliate system, agree to program rules and brand guidelines, and gain access to their personalized creator dashboard with all resources and tracking tools."
        },
        {
          num: 15,
          title: "Comprehensive Product Training & Demo Access",
          desc: "We teach creators exactly how your SaaS works, who it helps, what problems it solves, key features to highlight, common use cases, and how to address typical objections from potential customers."
        },
        {
          num: 16,
          title: "Content Creation Training & Best Practices",
          desc: "Creators learn how to effectively use your video kit, customize scripts for their voice, optimize hashtags and captions, implement CTAs naturally, and follow platform-specific best practices for maximum reach."
        },
        {
          num: 17,
          title: "Posting Guidelines & Publishing Rules",
          desc: "We provide clear instructions on posting frequency requirements, content angle rotation, format specifications, prohibited content, attribution requirements, and performance expectations to ensure consistency and quality."
        }
      ]
    },
    {
      num: 4,
      title: "LAUNCH & EXECUTION",
      timeline: "Days 31-90",
      color: "from-orange-500/20 to-orange-600/20",
      borderColor: "border-orange-500/30",
      steps: [
        {
          num: 18,
          title: "Coordinated Creator Activation & Launch",
          desc: "All 50+ trained creators begin posting content simultaneously across all major platforms, creating immediate market presence and generating daily awareness for your SaaS product."
        },
        {
          num: 19,
          title: "Viral Angle Testing & Hook Optimization",
          desc: "We systematically test multiple hook variants, content angles, and messaging approaches across different creators to identify the highest-performing patterns and double down on what works."
        },
        {
          num: 20,
          title: "Performance-Based Tracking Infrastructure",
          desc: "Every view, post, link click, profile visit, trial signup, and conversion is recorded in real-time inside our attribution system, providing complete transparency and accurate ROI measurement."
        },
        {
          num: 21,
          title: "Live Optimization & Weekly Feedback Loops",
          desc: "We analyze performance data continuously and provide creators with weekly micro-feedback on what's working, what to improve, and which content angles to prioritize for better results."
        },
        {
          num: 22,
          title: "Automated Pay-Per-View Commission System",
          desc: "Creators receive automated payments of $1-3 per 1,000 verified views within 24-48 hours, ensuring motivation stays high and creators remain actively engaged in promoting your product."
        }
      ]
    },
    {
      num: 5,
      title: "SCALING & GROWTH OPTIMIZATION",
      timeline: "Month 4+",
      color: "from-red-500/20 to-red-600/20",
      borderColor: "border-red-500/30",
      steps: [
        {
          num: 23,
          title: "Strategic Creator Network Expansion",
          desc: "We systematically scale your creator army from 50 to 100+ monthly active creators as performance data validates the model and ROI justifies increased investment."
        },
        {
          num: 24,
          title: "Top Creator Amplification & VIP Support",
          desc: "High-performing creators receive enhanced support including priority access to new content, custom scripts tailored to their style, faster response times, and bonus incentive opportunities."
        },
        {
          num: 25,
          title: "Low Performer Filtering & Quality Control",
          desc: "Underperforming creators who fail to meet minimum posting frequency or engagement standards are removed from the program to maintain overall quality and ensure cost efficiency."
        },
        {
          num: 26,
          title: "Monthly Analytics & MRR Impact Reporting",
          desc: "You receive a comprehensive monthly report showing total views generated, creator performance rankings, top-performing videos, new trial signups, new paying customers, and estimated monthly recurring revenue impact."
        },
        {
          num: 27,
          title: "Long-Term Compounding Growth Engine",
          desc: "Your creator network becomes a self-fueling growth machine that continuously produces daily videos, builds constant brand awareness, generates steady trial flow, and delivers predictable new monthly recurring revenue — all without ad spend or internal content teams."
        }
      ]
    }
  ];

  return (
    <section className="pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 gradient-text">
              THE 27-STEP PERFORMANCE VIDEO AFFILIATE SYSTEM™
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
              A fully done-for-you system that transforms 50+ video creators into a predictable growth engine for your SaaS — without ad spend or in-house content teams.
            </p>
          </motion.div>
        </div>

        <div className="space-y-6">
          {phases.map((phase, phaseIndex) => (
            <motion.div
              key={phase.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: phaseIndex * 0.1 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl border border-border overflow-hidden shadow-lg"
            >
              {/* Phase Header */}
              <button
                onClick={() => setExpandedPhase(expandedPhase === phaseIndex ? null : phaseIndex)}
                className={`w-full p-6 sm:p-8 flex items-center justify-between bg-gradient-to-r ${phase.color} border-l-4 ${phase.borderColor} hover:opacity-80 transition-all duration-300`}
              >
                <div className="flex items-center gap-4 sm:gap-6 text-left">
                  <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary text-primary-foreground font-bold text-xl sm:text-2xl flex-shrink-0">
                    {phase.num}
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-1">
                      🔷 PHASE {phase.num}: {phase.title}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground font-semibold">
                      {phase.timeline}
                    </p>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: expandedPhase === phaseIndex ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-6 h-6 sm:w-8 sm:h-8" />
                </motion.div>
              </button>

              {/* Phase Steps */}
              <AnimatePresence>
                {expandedPhase === phaseIndex && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 sm:p-8 space-y-4 bg-accent/5">
                      {phase.steps.map((step, stepIndex) => (
                        <motion.div
                          key={step.num}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: stepIndex * 0.1 }}
                          className="bg-card rounded-xl p-5 sm:p-6 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-md"
                        >
                          <div className="flex gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="font-bold text-primary text-sm sm:text-base">
                                  {step.num}
                                </span>
                              </div>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-base sm:text-lg font-bold mb-2 text-foreground">
                                {step.title}
                              </h4>
                              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                                {step.desc}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Summary Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 text-center bg-primary/10 border-2 border-primary rounded-2xl p-8"
        >
          <p className="text-lg sm:text-xl font-semibold text-foreground">
            All 27 steps = Your done-for-you creator army
          </p>
          <p className="text-base sm:text-lg text-muted-foreground mt-2">
            From day one strategy to month six scaling—we handle everything while you focus on closing customers
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default TwentyOneSteps;
