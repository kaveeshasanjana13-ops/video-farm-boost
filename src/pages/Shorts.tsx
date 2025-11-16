import ModernHeader from '@/components/ModernHeader';
import Footer from '@/components/Footer';
import { ArrowLeft, Play, Clock, TrendingUp, Target, Zap, Users, MessageCircle, Figma, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

const Shorts = () => {
  useEffect(() => {
    // Load Wistia scripts for first video
    const script1 = document.createElement('script');
    script1.src = 'https://fast.wistia.com/player.js';
    script1.async = true;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.src = 'https://fast.wistia.com/embed/3vtylti14n.js';
    script2.async = true;
    script2.type = 'module';
    document.head.appendChild(script2);

    // Load Wistia scripts for second video
    const script3 = document.createElement('script');
    script3.src = 'https://fast.wistia.com/embed/kq9etreglc.js';
    script3.async = true;
    script3.type = 'module';
    document.head.appendChild(script3);

    // Load Wistia scripts for third video
    const script4 = document.createElement('script');
    script4.src = 'https://fast.wistia.com/embed/c5tw2tz3av.js';
    script4.async = true;
    script4.type = 'module';
    document.head.appendChild(script4);

    // Add Wistia styles
    const style = document.createElement('style');
    style.textContent = `
      wistia-player[media-id='3vtylti14n']:not(:defined) { 
        background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/3vtylti14n/swatch'); 
        display: block; 
        filter: blur(5px); 
        padding-top:177.78%; 
      }
      wistia-player[media-id='kq9etreglc']:not(:defined) { 
        background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/kq9etreglc/swatch'); 
        display: block; 
        filter: blur(5px); 
        padding-top:177.78%; 
      }
      wistia-player[media-id='c5tw2tz3av']:not(:defined) { 
        background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/c5tw2tz3av/swatch'); 
        display: block; 
        filter: blur(5px); 
        padding-top:177.78%; 
      }
    `;
    document.head.appendChild(style);

    return () => {
      // Cleanup scripts on unmount
      document.head.removeChild(script1);
      document.head.removeChild(script2);
      document.head.removeChild(script3);
      document.head.removeChild(script4);
      document.head.removeChild(style);
    };
  }, []);

  const shortVideos = [
    {
      id: 1,
      title: "Quick Feature Highlight",
      company: "TechFlow",
      thumbnail: "bg-gradient-to-br from-red-500 to-orange-500",
      duration: "0:30",
      hasVideo: true,
      mediaId: "3vtylti14n"
    },
    {
      id: 2,
      title: "Problem-Solution Story",
      company: "SaaS Pro",
      thumbnail: "bg-gradient-to-br from-blue-500 to-cyan-500",
      duration: "0:45",
      hasVideo: true,
      mediaId: "kq9etreglc"
    },
    {
      id: 3,
      title: "Customer Success Story",
      company: "Growth Metrics",
      thumbnail: "bg-gradient-to-br from-purple-500 to-pink-500",
      duration: "0:35",
      hasVideo: true,
      mediaId: "c5tw2tz3av"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <ModernHeader />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-orange-50 via-white to-red-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-8">
              <a href="/" className="flex items-center gap-2 text-orange-600 hover:text-orange-700 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </a>
            </div>
            
            <div className="text-center space-y-6 max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
                Short-Form Videos
                <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  {" "}That Go Viral
                </span>
              </h1>
              <p className="text-xl text-gray-600">
                Bite-sized animated content perfect for social media, capturing attention in seconds and driving massive engagement for your SaaS product.
              </p>
              
              <div className="flex items-center justify-center gap-8 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">15-60s</div>
                  <div className="text-gray-600">Video Length</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">3-5 Days</div>
                  <div className="text-gray-600">Delivery Time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">10x</div>
                  <div className="text-gray-600">Higher Engagement</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Short Videos Gallery */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Short Videos That Get Results
              </h2>
              <p className="text-xl text-gray-600">
                Perfect for social media, email campaigns, and quick product introductions
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {shortVideos.map((video) => (
                <div key={video.id} className="group cursor-pointer">
                  <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl mb-6">
                    <div className={`aspect-[9/16] ${video.thumbnail} flex items-center justify-center relative`}>
                      {video.hasVideo ? (
                        <wistia-player media-id={video.mediaId} aspect="0.5625" seo="false"></wistia-player>
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                          <div className="relative z-10">
                            <div className="w-16 h-16 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
                              <Play className="h-8 w-8 text-white ml-1" fill="white" />
                            </div>
                          </div>
                        </>
                      )}
                      
                      <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white/90">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm font-medium">{video.duration}</span>
                      </div>
                      
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-600 to-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        SHORT
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                        {video.title}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Short-Form Content Works
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Higher Engagement</h3>
                <p className="text-gray-600">Short videos get 10x more engagement than long-form content on social platforms</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Quick Consumption</h3>
                <p className="text-gray-600">Perfect for busy audiences who want information fast and digestible</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Play className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Viral Potential</h3>
                <p className="text-gray-600">Optimized for sharing and algorithmic distribution across all platforms</p>
              </div>
            </div>
          </div>
        </section>

        {/* Best Practices Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Best Practices for Short Videos
              </h2>
              <p className="text-xl text-gray-600">
                Key strategies to maximize impact and engagement with your short-form content
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Hook Within 3 Seconds</h3>
                <p className="text-gray-600">Capture attention immediately with compelling visuals or intriguing questions to prevent scrolling past your content.</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Fast-Paced Editing</h3>
                <p className="text-gray-600">Use quick cuts, smooth transitions, and dynamic motion graphics to maintain viewer interest throughout the video.</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Clear Value Proposition</h3>
                <p className="text-gray-600">Communicate your SaaS benefit clearly and concisely - viewers should understand your value within seconds.</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Play className="h-6 w-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Strong Call-to-Action</h3>
                <p className="text-gray-600">End with a clear next step - whether it's visiting your website, signing up for a trial, or following for more content.</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Platform Optimization</h3>
                <p className="text-gray-600">Tailor aspect ratios, captions, and posting times for each platform's unique algorithm and audience behavior.</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Optimal Length</h3>
                <p className="text-gray-600">Keep videos between 15-60 seconds for maximum retention, with the sweet spot being 30-45 seconds for most platforms.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Specific Tips Section */}
        <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-red-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Platform-Specific Strategies
              </h2>
              <p className="text-xl text-gray-600">
                Maximize your reach with tailored approaches for each social platform
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3">TikTok</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>• Vertical 9:16 aspect ratio</li>
                  <li>• Use trending sounds/music</li>
                  <li>• Post 1-4 times daily</li>
                  <li>• Leverage hashtag challenges</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Instagram Reels</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>• 9:16 vertical format</li>
                  <li>• Use Instagram's music library</li>
                  <li>• Add captions for accessibility</li>
                  <li>• Cross-post to Stories</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3">YouTube Shorts</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>• Maximum 60 seconds</li>
                  <li>• Add #Shorts in title/description</li>
                  <li>• Use eye-catching thumbnails</li>
                  <li>• Include strong CTAs</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3">LinkedIn</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>• Square 1:1 or vertical format</li>
                  <li>• Professional tone</li>
                  <li>• Focus on business value</li>
                  <li>• Add captions for silent viewing</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-gray-900 to-orange-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Create Viral Shorts?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Let's create engaging short-form videos that capture attention and drive results for your SaaS product.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://calendly.com/kvit/15-minutes-discovery-call" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-lg px-8 py-4">
                  Get Your Shorts Package
                </Button>
              </a>
            </div>
            <p className="text-gray-400 text-sm mt-4">
              Free consultation • Custom strategy • Fast delivery
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Shorts;
