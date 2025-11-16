
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock } from 'lucide-react';

const CareerPositions = () => {
  const positions = [
    {
      title: "Video Editor",
      type: "Full-time",
      location: "Remote",
      description: "Join our creative team to produce high-quality video content for SaaS companies. Experience with After Effects, Premiere Pro, and motion graphics required.",
      requirements: [
        "3+ years of video editing experience",
        "Proficiency in Adobe Creative Suite",
        "Motion graphics and animation skills",
        "Portfolio showcasing SaaS/tech content"
      ]
    },
    {
      title: "Content Strategist",
      type: "Part-time",
      location: "Remote",
      description: "Help develop content strategies for our clients and create compelling narratives for video projects.",
      requirements: [
        "Experience in content marketing",
        "Understanding of SaaS industry",
        "Strong writing and storytelling skills",
        "Experience with video content planning"
      ]
    }
  ];

  return (
    <section className="py-20 cinematic-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4 cinematic-text-shadow">Open Positions</h2>
          <p className="text-xl text-gray-300">Discover exciting opportunities to grow your career</p>
        </div>
        
        <div className="space-y-8 max-w-4xl mx-auto">
          {positions.map((position, index) => (
            <Card key={index} className="cinematic-card border-white/10">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-2xl font-bold text-white">{position.title}</CardTitle>
                    <CardDescription className="mt-2 text-gray-300">{position.description}</CardDescription>
                  </div>
                  <div className="flex flex-col gap-2 text-sm text-gray-300 md:text-right">
                    <div className="flex items-center gap-2 md:justify-end">
                      <Clock className="h-4 w-4 text-yellow-400" />
                      <span>{position.type}</span>
                    </div>
                    <div className="flex items-center gap-2 md:justify-end">
                      <MapPin className="h-4 w-4 text-yellow-400" />
                      <span>{position.location}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="mb-6">
                  <h4 className="font-semibold text-white mb-3">Requirements:</h4>
                  <ul className="space-y-2">
                    {position.requirements.map((req, reqIndex) => (
                      <li key={reqIndex} className="flex items-start gap-2 text-gray-300">
                        <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <a href={`mailto:kvit@contentfarm.club?subject=Application for ${position.title}`}>
                  <Button className="bg-yellow-400 text-black hover:bg-yellow-500 font-semibold">
                    Apply Now
                  </Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CareerPositions;
