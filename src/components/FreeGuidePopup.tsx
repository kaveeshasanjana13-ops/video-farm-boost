import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from '@/hooks/use-toast';
import saasFounderImage from '@/assets/saas-founder-guide.jpg';

const formSchema = z.object({
  name: z.string().trim().min(2, { message: "Name must be at least 2 characters" }).max(100, { message: "Name must be less than 100 characters" }),
  email: z.string().trim().email({ message: "Please enter a valid email address" }).max(255, { message: "Email must be less than 255 characters" }),
});

type FormData = z.infer<typeof formSchema>;

const FreeGuidePopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    // Show popup after 15 seconds, only once per session
    const timer = setTimeout(() => {
      if (!hasShown) {
        setIsOpen(true);
        setHasShown(true);
      }
    }, 15000);

    return () => clearTimeout(timer);
  }, [hasShown]);

  const onSubmit = async (data: FormData) => {
    try {
      // Here you would typically send the data to your backend or email service
      // For now, we'll just show a success message and trigger the download
      
      toast({
        title: "Success!",
        description: "Your free guide is downloading now. Check your email for more resources!",
      });

      // Trigger PDF download (you'll need to add your actual PDF file)
      const link = document.createElement('a');
      link.href = '/path-to-your-guide.pdf'; // Replace with actual PDF path
      link.download = 'Video-Funnels-That-Sell-SaaS.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      reset();
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-gradient-to-br from-gray-900 to-black border-yellow-400/20">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-10"
        >
          <X className="h-4 w-4 text-white" />
          <span className="sr-only">Close</span>
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Section */}
          <div className="relative h-64 md:h-auto overflow-hidden">
            <img 
              src={saasFounderImage} 
              alt="SaaS Founder - Video Funnels Guide"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>

          {/* Form Section */}
          <div className="p-8">
            <DialogHeader className="mb-6">
              <div className="inline-flex items-center gap-2 bg-yellow-400/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-semibold mb-4 w-fit">
                <Download className="h-4 w-4" />
                FREE GUIDE
              </div>
              <DialogTitle className="text-2xl font-bold text-white mb-3 cinematic-text-shadow">
                Video Funnels That Sell SaaS
              </DialogTitle>
              <p className="text-gray-300 text-sm">
                Learn how top startups use video to drive growth. Get the exact strategies we use to double trial-to-paid conversions.
              </p>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">
                  Your Name *
                </Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="John Doe"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-yellow-400"
                />
                {errors.name && (
                  <p className="text-red-400 text-sm">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Work Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="john@company.com"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-yellow-400"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm">{errors.email.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full cinematic-cta font-semibold"
              >
                {isSubmitting ? (
                  "Downloading..."
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download Free PDF
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-400 text-center">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FreeGuidePopup;
