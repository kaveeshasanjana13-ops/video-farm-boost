import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ModernHeader from '@/components/ModernHeader';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Copy, Download, FileText, Clock, Target, Zap } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const ScriptGenerator = () => {
  const [formData, setFormData] = useState({
    title: '',
    scriptType: '',
    duration: '',
    audience: '',
    tone: '',
    objective: '',
    keyPoints: '',
    callToAction: ''
  });
  const [generatedScript, setGeneratedScript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateScript = () => {
    if (!formData.title || !formData.scriptType || !formData.duration) {
      toast({
        title: "Missing Information",
        description: "Please fill in the title, script type, and duration fields.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    setTimeout(() => {
      const script = generateCustomScript(formData);
      setGeneratedScript(script);
      setIsGenerating(false);
      toast({
        title: "Script Generated!",
        description: "Your script has been created successfully.",
      });
    }, 2000);
  };

  const generateCustomScript = (data: typeof formData) => {
    const scriptTemplates = {
      presentation: {
        structure: ['Opening Hook', 'Introduction', 'Main Points', 'Conclusion', 'Call to Action'],
        hooks: [
          `Imagine if ${data.title.toLowerCase()} could transform your entire approach...`,
          `What if I told you that ${data.title.toLowerCase()} is the key to...`,
          `Today, we're going to explore ${data.title.toLowerCase()} in a way you've never seen before...`
        ]
      },
      sales: {
        structure: ['Attention Grabber', 'Problem Identification', 'Solution Presentation', 'Benefits', 'Objection Handling', 'Close'],
        hooks: [
          `Are you tired of struggling with ${data.title.toLowerCase()}?`,
          `What if there was a better way to handle ${data.title.toLowerCase()}?`,
          `Let me show you how ${data.title.toLowerCase()} can solve your biggest challenge...`
        ]
      },
      educational: {
        structure: ['Introduction', 'Learning Objectives', 'Main Content', 'Examples', 'Summary', 'Next Steps'],
        hooks: [
          `Welcome to this comprehensive guide on ${data.title.toLowerCase()}...`,
          `By the end of this session, you'll master ${data.title.toLowerCase()}...`,
          `Let's dive into the essential concepts of ${data.title.toLowerCase()}...`
        ]
      },
      webinar: {
        structure: ['Welcome & Introductions', 'Agenda Overview', 'Main Content', 'Q&A Preparation', 'Wrap-up'],
        hooks: [
          `Thank you for joining us today to explore ${data.title.toLowerCase()}...`,
          `Welcome everyone! Today's session on ${data.title.toLowerCase()} will...`,
          `Great to see everyone here for our discussion on ${data.title.toLowerCase()}...`
        ]
      }
    };

    const template = scriptTemplates[data.scriptType as keyof typeof scriptTemplates] || scriptTemplates.presentation;
    const hook = template.hooks[Math.floor(Math.random() * template.hooks.length)];

    return `# ${data.title} - ${data.scriptType.charAt(0).toUpperCase() + data.scriptType.slice(1)} Script

## Opening Hook
${hook}

## Introduction
${data.audience ? `This ${data.scriptType} is designed specifically for ${data.audience} who want to` : 'This session will help you'} understand and apply the key concepts we'll be covering today.

${data.objective ? `Our main objective: ${data.objective}` : ''}

## Main Content
${data.keyPoints ? `Key points we'll cover:
${data.keyPoints.split('\n').map(point => `• ${point.trim()}`).join('\n')}` : ''}

### Section 1: Foundation
[Establish the core concepts and why they matter]

### Section 2: Application
[Show practical implementation and real-world examples]

### Section 3: Advanced Insights
[Share deeper knowledge and best practices]

## Summary
Let's recap the key takeaways from today's session on ${data.title.toLowerCase()}:
- [Summarize main points]
- [Highlight key benefits]
- [Reinforce core message]

## Call to Action
${data.callToAction || `Take action on what you've learned about ${data.title.toLowerCase()} today.`}

---
**Script Details:**
- **Type:** ${data.scriptType.charAt(0).toUpperCase() + data.scriptType.slice(1)}
- **Duration:** ${data.duration}
- **Target Audience:** ${data.audience || 'General audience'}
- **Tone:** ${data.tone || 'Professional and engaging'}
- **Objective:** ${data.objective || 'Inform and engage audience'}`;
  };

  const [showCopyModal, setShowCopyModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '' });

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

  const copyToClipboard = () => {
    setShowCopyModal(true);
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
      title: "Copied!",
      description: "Script copied to clipboard.",
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
    element.download = `script-${formData.title.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    setShowDownloadModal(false);
    setCustomerInfo({ name: '', email: '' });
    toast({
      title: "Downloaded!",
      description: "Script downloaded as a text file.",
    });
  };

  return (
    <div className="min-h-screen">
      <SEO 
        title="Script Generator - Create Professional Scripts for Any Purpose | ContentFarm"
        description="Generate professional scripts for presentations, sales pitches, webinars, and educational content. Free script generator tool for content creators and professionals."
        keywords="script generator, presentation scripts, sales scripts, webinar scripts, content creation, script writing"
        url="https://contentfarm.club/script-generator"
      />
      
      <ModernHeader />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FileText className="h-16 w-16 mx-auto text-purple-600 mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Professional Script Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create compelling scripts for presentations, sales pitches, webinars, and educational content. Generate professional, structured scripts in minutes.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Script Configuration
                </CardTitle>
                <CardDescription>
                  Configure your script details below to generate a professional script
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="title">Title/Topic *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Digital Marketing Strategy"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="scriptType">Script Type *</Label>
                  <Select value={formData.scriptType} onValueChange={(value) => handleInputChange('scriptType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select script type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="presentation">Presentation</SelectItem>
                      <SelectItem value="sales">Sales Pitch</SelectItem>
                      <SelectItem value="webinar">Webinar</SelectItem>
                      <SelectItem value="educational">Educational Content</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="duration">Duration *</Label>
                  <Select value={formData.duration} onValueChange={(value) => handleInputChange('duration', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5-10 minutes">5-10 minutes</SelectItem>
                      <SelectItem value="10-15 minutes">10-15 minutes</SelectItem>
                      <SelectItem value="15-30 minutes">15-30 minutes</SelectItem>
                      <SelectItem value="30-45 minutes">30-45 minutes</SelectItem>
                      <SelectItem value="45-60 minutes">45-60 minutes</SelectItem>
                      <SelectItem value="60+ minutes">60+ minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="audience">Target Audience</Label>
                  <Input
                    id="audience"
                    placeholder="e.g., Business professionals, Students, General public"
                    value={formData.audience}
                    onChange={(e) => handleInputChange('audience', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="tone">Tone</Label>
                  <Select value={formData.tone} onValueChange={(value) => handleInputChange('tone', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual & Friendly</SelectItem>
                      <SelectItem value="authoritative">Authoritative</SelectItem>
                      <SelectItem value="conversational">Conversational</SelectItem>
                      <SelectItem value="inspiring">Inspiring & Motivational</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="objective">Main Objective</Label>
                  <Input
                    id="objective"
                    placeholder="e.g., Educate audience about digital marketing trends"
                    value={formData.objective}
                    onChange={(e) => handleInputChange('objective', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="keyPoints">Key Points to Cover</Label>
                  <Textarea
                    id="keyPoints"
                    placeholder="Enter each key point on a new line..."
                    rows={4}
                    value={formData.keyPoints}
                    onChange={(e) => handleInputChange('keyPoints', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="callToAction">Call to Action</Label>
                  <Input
                    id="callToAction"
                    placeholder="e.g., Contact us for a free consultation"
                    value={formData.callToAction}
                    onChange={(e) => handleInputChange('callToAction', e.target.value)}
                  />
                </div>

                <Button 
                  onClick={generateScript} 
                  disabled={isGenerating}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating Script...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Generate Script
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Generated Script */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Generated Script
                  </span>
                  {generatedScript && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={copyToClipboard}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={downloadScript}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardTitle>
                <CardDescription>
                  Your custom script will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generatedScript ? (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                      {generatedScript}
                    </pre>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Configure your script settings and click "Generate Script" to create your professional script</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Use Our Script Generator?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Save Time</h3>
              <p className="text-gray-600">
                Generate professional scripts in minutes instead of hours of writing and planning.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional Structure</h3>
              <p className="text-gray-600">
                Follow proven script structures that engage audiences and deliver results.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Versatile Use</h3>
              <p className="text-gray-600">
                Perfect for presentations, sales pitches, webinars, and educational content.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Copy Modal */}
      <Dialog open={showCopyModal} onOpenChange={setShowCopyModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Copy Script</DialogTitle>
            <DialogDescription>
              Please provide your information to copy the script to your clipboard.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="copy-name">Full Name</Label>
              <Input
                id="copy-name"
                placeholder="Enter your full name"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="copy-email">Email Address</Label>
              <Input
                id="copy-email"
                type="email"
                placeholder="Enter your email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowCopyModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleCopyWithInfo} className="flex-1">
                Copy Script
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Download Modal */}
      <Dialog open={showDownloadModal} onOpenChange={setShowDownloadModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Download Script</DialogTitle>
            <DialogDescription>
              Please provide your information to download the script file.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="download-name">Full Name</Label>
              <Input
                id="download-name"
                placeholder="Enter your full name"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="download-email">Email Address</Label>
              <Input
                id="download-email"
                type="email"
                placeholder="Enter your email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowDownloadModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleDownloadWithInfo} className="flex-1">
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

export default ScriptGenerator;