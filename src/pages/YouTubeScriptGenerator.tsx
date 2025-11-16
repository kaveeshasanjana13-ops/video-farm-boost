import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import ModernHeader from '@/components/ModernHeader';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Copy, Download, Video, Clock, Users, Target, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const YouTubeScriptGenerator = () => {
  const [formData, setFormData] = useState({
    topic: '',
    videoType: '',
    duration: '',
    audience: '',
    tone: '',
    keyPoints: ''
  });
  const [generatedScript, setGeneratedScript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '' });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateScript = () => {
    if (!formData.topic || !formData.videoType || !formData.duration) {
      toast({
        title: "Missing Information",
        description: "Please fill in the topic, video type, and duration fields.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate script generation (replace with actual AI integration)
    setTimeout(() => {
      const script = generateBasicScript(formData);
      setGeneratedScript(script);
      setIsGenerating(false);
      toast({
        title: "Script Generated!",
        description: "Your YouTube script has been created successfully.",
      });
    }, 2000);
  };

  const generateBasicScript = (data: typeof formData) => {
    const hooks = [
      `What if I told you that ${data.topic} could change everything you know about...`,
      `In the next ${data.duration} minutes, you'll discover ${data.topic} secrets that...`,
      `Stop! Before you scroll away, this ${data.topic} revelation will...`,
      `I've spent years studying ${data.topic}, and what I found will shock you...`
    ];

    const hook = hooks[Math.floor(Math.random() * hooks.length)];

    return `# ${data.topic} - YouTube Script

## Hook (0-15 seconds)
${hook}

## Introduction (15-30 seconds)
Hey everyone! Welcome back to the channel. Today we're diving deep into ${data.topic}, and by the end of this video, you'll have a complete understanding of how to ${data.topic.toLowerCase()} effectively.

${data.audience ? `This video is especially valuable for ${data.audience} who want to...` : ''}

Don't forget to hit that subscribe button and ring the notification bell if you find this valuable!

## Main Content
${data.keyPoints ? `Key points we'll cover:
${data.keyPoints.split('\n').map(point => `• ${point.trim()}`).join('\n')}` : ''}

### Section 1: Understanding ${data.topic}
[Explain the fundamentals and why it matters]

### Section 2: Practical Steps
[Provide actionable advice and strategies]

### Section 3: Common Mistakes to Avoid
[Address potential pitfalls and how to overcome them]

### Section 4: Pro Tips
[Share advanced insights and insider knowledge]

## Call to Action
If you found this helpful, smash that like button and let me know in the comments what your biggest takeaway was about ${data.topic}.

## Outro
Thanks for watching! Don't forget to subscribe for more content about ${data.topic} and related topics. I'll see you in the next video!

---
**Video Length:** ${data.duration}
**Target Audience:** ${data.audience || 'General audience'}
**Tone:** ${data.tone || 'Professional and engaging'}`;
  };

  const copyToClipboard = () => {
    setShowCopyModal(true);
  };

  const submitToGoogleScript = async (name: string, email: string) => {
    try {
      const formData = new FormData();
      formData.append('Name', name);
      formData.append('Email', email);
      
      await fetch('https://script.google.com/macros/s/AKfycbylGn_kow8ZFkBFgkpueMibwbbYxCqx_3Badn8kGXdJyBAn-F-m6BpzLEE3S7Z0g0zVwA/exec', {
        method: 'POST',
        body: formData
      });
    } catch (error) {
      console.error('Error submitting to Google Script:', error);
    }
  };

  const handleCopyWithInfo = async () => {
    if (!customerInfo.name || !customerInfo.email) {
      toast({
        title: "Missing Information",
        description: "Please enter your name and email to copy the script.",
        variant: "destructive"
      });
      return;
    }

    await submitToGoogleScript(customerInfo.name, customerInfo.email);
    navigator.clipboard.writeText(generatedScript);
    setShowCopyModal(false);
    setCustomerInfo({ name: '', email: '' });
    toast({
      title: "Script Copied!",
      description: `Thank you ${customerInfo.name}! The script has been copied to your clipboard.`,
    });
  };

  const downloadScript = () => {
    setShowDownloadModal(true);
  };

  const handleDownloadWithInfo = async () => {
    if (!customerInfo.name || !customerInfo.email) {
      toast({
        title: "Missing Information",
        description: "Please enter your name and email to download the script.",
        variant: "destructive"
      });
      return;
    }

    await submitToGoogleScript(customerInfo.name, customerInfo.email);
    const element = document.createElement('a');
    const file = new Blob([generatedScript], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `youtube-script-${formData.topic.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    setShowDownloadModal(false);
    setCustomerInfo({ name: '', email: '' });
    toast({
      title: "Download Started!",
      description: `Thank you ${customerInfo.name}! Your script is downloading now.`,
    });
  };

  return (
    <div className="min-h-screen cinematic-section">
      <SEO 
        title="YouTube Script Generator - Create Engaging Video Scripts | ContentFarm"
        description="Generate professional YouTube scripts instantly. Create engaging video content with our free script generator tool. Perfect for content creators and marketers."
        keywords="YouTube script generator, video script creator, content creation, YouTube video scripts, video marketing"
        url="https://contentfarm.club/youtube-script-generator"
      />
      
      <ModernHeader />
      
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 cinematic-grain opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-8 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl shadow-cinematic">
              <Video className="h-8 w-8 text-black" />
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold font-display text-white mb-6 tracking-tight cinematic-text-shadow">
              YouTube Script
              <span className="block cinematic-gradient-text">
                Generator
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-200 font-light leading-relaxed max-w-3xl mx-auto">
              Create engaging, professional YouTube scripts in minutes. Our AI-powered tool helps you structure content that captivates viewers and drives engagement.
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <div className="inline-flex items-center text-sm text-gray-300 cinematic-card px-4 py-2 border border-white/20">
                <Clock className="h-4 w-4 mr-2 text-yellow-400" />
                Generate in 2 minutes
              </div>
              <div className="inline-flex items-center text-sm text-gray-300 cinematic-card px-4 py-2 border border-white/20">
                <Target className="h-4 w-4 mr-2 text-yellow-400" />
                Professional structure
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Input Form */}
            <div className="lg:sticky lg:top-8 h-fit">
              <Card className="border-0 shadow-cinematic cinematic-card backdrop-blur-xl rounded-3xl overflow-hidden border border-white/20">
                <CardHeader className="bg-gradient-to-br from-white/5 to-white/10 border-b border-white/10 pb-8">
                  <CardTitle className="flex items-center gap-3 text-2xl font-semibold text-white">
                    <div className="p-2 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl">
                      <Target className="h-5 w-5 text-black" />
                    </div>
                    Script Configuration
                  </CardTitle>
                  <CardDescription className="text-gray-300 text-base">
                    Configure your video details to generate a professional script
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-8">
                  <div className="space-y-3">
                    <Label htmlFor="topic" className="text-sm font-medium text-gray-200">Video Topic *</Label>
                    <Input
                      id="topic"
                      placeholder="e.g., How to Start a YouTube Channel"
                      value={formData.topic}
                      onChange={(e) => handleInputChange('topic', e.target.value)}
                      className="h-12 bg-white/10 border-white/20 focus:border-yellow-400 text-white placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="videoType" className="text-sm font-medium text-gray-200">Video Type *</Label>
                    <Select value={formData.videoType} onValueChange={(value) => handleInputChange('videoType', value)}>
                      <SelectTrigger className="h-12 bg-white/10 border-white/20 focus:border-yellow-400 text-white">
                        <SelectValue placeholder="Select video type" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl cinematic-section border-white/20">
                        <SelectItem value="tutorial" className="text-white">Tutorial/How-to</SelectItem>
                        <SelectItem value="educational" className="text-white">Educational</SelectItem>
                        <SelectItem value="review" className="text-white">Review</SelectItem>
                        <SelectItem value="entertainment" className="text-white">Entertainment</SelectItem>
                        <SelectItem value="vlog" className="text-white">Vlog</SelectItem>
                        <SelectItem value="interview" className="text-white">Interview</SelectItem>
                        <SelectItem value="listicle" className="text-white">Top 10/Listicle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="duration" className="text-sm font-medium text-gray-200">Video Duration *</Label>
                    <Select value={formData.duration} onValueChange={(value) => handleInputChange('duration', value)}>
                      <SelectTrigger className="h-12 bg-white/10 border-white/20 focus:border-yellow-400 text-white">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl cinematic-section border-white/20">
                        <SelectItem value="3-5 minutes" className="text-white">3-5 minutes</SelectItem>
                        <SelectItem value="5-8 minutes" className="text-white">5-8 minutes</SelectItem>
                        <SelectItem value="8-12 minutes" className="text-white">8-12 minutes</SelectItem>
                        <SelectItem value="12-15 minutes" className="text-white">12-15 minutes</SelectItem>
                        <SelectItem value="15+ minutes" className="text-white">15+ minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="audience" className="text-sm font-medium text-gray-200">Target Audience</Label>
                    <Input
                      id="audience"
                      placeholder="e.g., Beginner entrepreneurs, Tech enthusiasts"
                      value={formData.audience}
                      onChange={(e) => handleInputChange('audience', e.target.value)}
                      className="h-12 bg-white/10 border-white/20 focus:border-yellow-400 text-white placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="tone" className="text-sm font-medium text-gray-200">Tone</Label>
                    <Select value={formData.tone} onValueChange={(value) => handleInputChange('tone', value)}>
                      <SelectTrigger className="h-12 bg-white/10 border-white/20 focus:border-yellow-400 text-white">
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl cinematic-section border-white/20">
                        <SelectItem value="professional" className="text-white">Professional</SelectItem>
                        <SelectItem value="casual" className="text-white">Casual & Friendly</SelectItem>
                        <SelectItem value="energetic" className="text-white">Energetic & Upbeat</SelectItem>
                        <SelectItem value="educational" className="text-white">Educational</SelectItem>
                        <SelectItem value="conversational" className="text-white">Conversational</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="keyPoints" className="text-sm font-medium text-gray-200">Key Points to Cover</Label>
                    <Textarea
                      id="keyPoints"
                      placeholder="Enter each key point on a new line..."
                      rows={4}
                      value={formData.keyPoints}
                      onChange={(e) => handleInputChange('keyPoints', e.target.value)}
                      className="bg-white/10 border-white/20 focus:border-yellow-400 text-white placeholder:text-gray-400 resize-none"
                    />
                  </div>

                  <Button 
                    onClick={generateScript} 
                    disabled={isGenerating}
                    className="w-full h-14 cinematic-cta font-semibold transition-all duration-300 transform hover:scale-[1.02]"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-black/30 border-t-black mr-3"></div>
                        Generating Your Script...
                      </>
                    ) : (
                      <>
                        <Zap className="h-5 w-5 mr-3" />
                        Generate Script
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Generated Script */}
            <div>
              <Card className="border-0 shadow-cinematic cinematic-card backdrop-blur-xl rounded-3xl overflow-hidden border border-white/20">
                <CardHeader className="bg-gradient-to-br from-white/5 to-white/10 border-b border-white/10 pb-6">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-3 text-2xl font-semibold text-white">
                      <div className="p-2 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl">
                        <Clock className="h-5 w-5 text-black" />
                      </div>
                      Generated Script
                    </span>
                    {generatedScript && (
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={copyToClipboard}
                          className="h-10 px-4 bg-white/10 border-white/20 hover:bg-white/20 text-white"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={downloadScript}
                          className="h-10 px-4 bg-white/10 border-white/20 hover:bg-white/20 text-white"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    )}
                  </CardTitle>
                  <CardDescription className="text-gray-300 text-base">
                    Your professional YouTube script will appear here
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  {generatedScript ? (
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                      <pre className="whitespace-pre-wrap text-sm text-gray-200 font-mono leading-relaxed">
                        {generatedScript}
                      </pre>
                    </div>
                  ) : (
                    <div className="text-center py-16 text-gray-300">
                      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl flex items-center justify-center">
                        <Video className="h-10 w-10 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-white mb-2">Ready to Generate</h3>
                      <p className="text-gray-300 max-w-sm mx-auto">Fill out the form and click &quot;Generate Script&quot; to create your professional YouTube script</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 cinematic-section relative overflow-hidden">
        <div className="absolute inset-0 cinematic-grain opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold font-display text-white mb-6 cinematic-text-shadow">
              Why creators choose our 
              <span className="block cinematic-gradient-text">
                script generator
              </span>
            </h2>
            <p className="text-xl text-gray-200 font-light">
              Join thousands of content creators who trust our platform for professional script generation
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="group">
              <div className="relative p-8 cinematic-card border border-white/20 rounded-3xl shadow-cinematic hover:shadow-glow transition-all duration-500 hover:-translate-y-2">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center mb-6 shadow-cinematic group-hover:shadow-glow transition-all duration-300">
                  <Clock className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 text-center">Lightning Fast</h3>
                <p className="text-gray-300 text-center leading-relaxed">
                  Generate professional scripts in under 2 minutes. No more spending hours planning and structuring your content.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="relative p-8 cinematic-card border border-white/20 rounded-3xl shadow-cinematic hover:shadow-glow transition-all duration-500 hover:-translate-y-2">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center mb-6 shadow-cinematic group-hover:shadow-glow transition-all duration-300">
                  <Users className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 text-center">Engage Viewers</h3>
                <p className="text-gray-300 text-center leading-relaxed">
                  Scripts designed with proven engagement techniques that hook viewers early and keep them watching.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="relative p-8 cinematic-card border border-white/20 rounded-3xl shadow-cinematic hover:shadow-glow transition-all duration-500 hover:-translate-y-2">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center mb-6 shadow-cinematic group-hover:shadow-glow transition-all duration-300">
                  <Target className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 text-center">Optimized Structure</h3>
                <p className="text-gray-300 text-center leading-relaxed">
                  Follow proven YouTube script structures that maximize retention and drive subscriber growth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Copy Modal */}
      <Dialog open={showCopyModal} onOpenChange={setShowCopyModal}>
        <DialogContent className="sm:max-w-md cinematic-section border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white">Get Your Script Copy</DialogTitle>
            <DialogDescription className="text-gray-300">
              Please provide your details to copy the script to your clipboard.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="copy-name" className="text-gray-200">Name *</Label>
              <Input
                id="copy-name"
                placeholder="Enter your full name"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="copy-email" className="text-gray-200">Email *</Label>
              <Input
                id="copy-email"
                type="email"
                placeholder="Enter your email address"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowCopyModal(false)} className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20">
                Cancel
              </Button>
              <Button onClick={handleCopyWithInfo} className="flex-1 cinematic-cta">
                <Copy className="h-4 w-4 mr-2" />
                Copy Script
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Download Modal */}
      <Dialog open={showDownloadModal} onOpenChange={setShowDownloadModal}>
        <DialogContent className="sm:max-w-md cinematic-section border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white">Download Your Script</DialogTitle>
            <DialogDescription className="text-gray-300">
              Please provide your details to download the script as a text file.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="download-name" className="text-gray-200">Name *</Label>
              <Input
                id="download-name"
                placeholder="Enter your full name"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="download-email" className="text-gray-200">Email *</Label>
              <Input
                id="download-email"
                type="email"
                placeholder="Enter your email address"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowDownloadModal(false)} className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20">
                Cancel
              </Button>
              <Button onClick={handleDownloadWithInfo} className="flex-1 cinematic-cta">
                <Download className="h-4 w-4 mr-2" />
                Download Script
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default YouTubeScriptGenerator;