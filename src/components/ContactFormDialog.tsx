import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import React from 'react';

interface ContactFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ContactFormDialog = ({ isOpen, onOpenChange }: ContactFormDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Get Your Free Video Growth Plan</DialogTitle>
        </DialogHeader>
        <form 
          name="submit-to-google-sheet"
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            if (isSubmitting) return;
            
            setIsSubmitting(true);
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);
            
            try {
              await fetch('https://script.google.com/macros/s/AKfycbyJEtAJpsEUV17m4uN7snecrUc9LlN0JPiDWDyHLQ39E0XsZtjuIKuDaPYlDmIC_is/exec', {
                method: 'POST',
                body: formData,
              });
              form.reset();
              onOpenChange(false);
              toast({
                title: "Success!",
                description: "Thank you! We'll be in touch soon.",
              });
            } catch (error) {
              toast({
                title: "Error",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
              });
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="firstName"
              type="text"
              placeholder="First Name"
            />
            <Input
              name="lastName"
              type="text"
              placeholder="Last Name"
            />
          </div>
          <Input
            name="email"
            type="email"
            placeholder="Email"
            required
          />
          <Input
            name="companyWebsite"
            type="text"
            placeholder="Company Website"
          />
          <Button type="submit" size="lg" className="w-full cinematic-cta" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactFormDialog;
