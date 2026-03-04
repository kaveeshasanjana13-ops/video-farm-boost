import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { PhoneInput } from '@/components/ui/phone-input';
import { useToast } from '@/hooks/use-toast';
import { contactChangeApi } from '@/api/contact-change.api';
import { Mail, Phone, ArrowLeft, CheckCircle2, Loader2, Send } from 'lucide-react';

type ContactType = 'phone' | 'email';

interface ContactChangeDialogProps {
  open: boolean;
  onClose: () => void;
  type: ContactType;
  currentValue: string;
  onSuccess: (newValue: string) => void;
}

const ContactChangeDialog: React.FC<ContactChangeDialogProps> = ({
  open, onClose, type, currentValue, onSuccess,
}) => {
  const { toast } = useToast();
  const [step, setStep] = useState<'input' | 'otp' | 'success'>('input');
  const [newValue, setNewValue] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (!open) {
      setStep('input');
      setNewValue('');
      setOtpCode('');
      setLoading(false);
      setResendCooldown(0);
      setRemainingAttempts(null);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [open]);

  useEffect(() => {
    if (resendCooldown > 0) {
      timerRef.current = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [resendCooldown]);

  const getCleanPhone = (val: string) => val.replace(/\s/g, '').replace(/^\+94/, '0');

  const handleRequestOtp = async () => {
    const value = type === 'phone' ? getCleanPhone(newValue) : newValue.trim().toLowerCase();
    
    if (type === 'email' && !value.includes('@')) {
      toast({ title: 'Invalid email', description: 'Please enter a valid email address.', variant: 'destructive' });
      return;
    }
    if (type === 'phone' && value.replace(/\D/g, '').length < 9) {
      toast({ title: 'Invalid phone', description: 'Please enter a valid phone number.', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const res = type === 'phone'
        ? await contactChangeApi.requestPhoneOtp(value)
        : await contactChangeApi.requestEmailOtp(value);
      
      setRemainingAttempts(res.remainingAttempts);
      setStep('otp');
      setResendCooldown(60);
      toast({ title: 'OTP Sent', description: res.message });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to send OTP.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otpCode.length !== 6) {
      toast({ title: 'Invalid OTP', description: 'Please enter the 6-digit code.', variant: 'destructive' });
      return;
    }

    const value = type === 'phone' ? getCleanPhone(newValue) : newValue.trim().toLowerCase();
    setLoading(true);
    try {
      const res = type === 'phone'
        ? await contactChangeApi.verifyPhoneOtp(value, otpCode)
        : await contactChangeApi.verifyEmailOtp(value, otpCode);

      setStep('success');
      const updatedValue = type === 'phone' ? (res.newPhoneNumber || value) : (res.newEmail || value);
      toast({ title: 'Success', description: res.message });
      onSuccess(updatedValue);
    } catch (error: any) {
      toast({ title: 'Verification Failed', description: error.message || 'Invalid or expired OTP.', variant: 'destructive' });
      setOtpCode('');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setOtpCode('');
    await handleRequestOtp();
  };

  const isPhone = type === 'phone';
  const Icon = isPhone ? Phone : Mail;
  const title = isPhone ? 'Change Phone Number' : 'Change Email Address';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Icon className="h-5 w-5 text-primary" />
            {title}
          </DialogTitle>
          <DialogDescription>
            {step === 'input' && `Enter your new ${isPhone ? 'phone number' : 'email address'}. We'll send a verification code.`}
            {step === 'otp' && `Enter the 6-digit code sent to your new ${isPhone ? 'phone number' : 'email'}.`}
            {step === 'success' && `Your ${isPhone ? 'phone number' : 'email'} has been updated successfully.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {step === 'input' && (
            <>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Current {isPhone ? 'Phone' : 'Email'}</Label>
                <p className="text-sm font-medium text-foreground bg-muted/50 rounded-md px-3 py-2">{currentValue || '—'}</p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="new-contact">New {isPhone ? 'Phone Number' : 'Email Address'}</Label>
                {isPhone ? (
                  <PhoneInput
                    id="new-contact"
                    value={newValue}
                    onChange={setNewValue}
                  />
                ) : (
                  <Input
                    id="new-contact"
                    type="email"
                    placeholder="newaddress@example.com"
                    value={newValue}
                    onChange={e => setNewValue(e.target.value)}
                  />
                )}
              </div>
              <Button onClick={handleRequestOtp} disabled={loading} className="w-full">
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                {loading ? 'Sending...' : 'Send Verification Code'}
              </Button>
            </>
          )}

          {step === 'otp' && (
            <>
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-primary/10 rounded-full p-3">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Code sent to <span className="font-medium text-foreground">{isPhone ? newValue : newValue.trim().toLowerCase()}</span>
                </p>
                <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                {remainingAttempts !== null && (
                  <p className="text-xs text-muted-foreground">{remainingAttempts} OTP requests remaining today</p>
                )}
              </div>
              <div className="space-y-2">
                <Button onClick={handleVerifyOtp} disabled={loading || otpCode.length !== 6} className="w-full">
                  {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                  {loading ? 'Verifying...' : 'Confirm Change'}
                </Button>
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="sm" onClick={() => { setStep('input'); setOtpCode(''); }}>
                    <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleResend} disabled={resendCooldown > 0 || loading}>
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                  </Button>
                </div>
              </div>
            </>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center space-y-4 py-4">
              <div className="bg-green-500/10 rounded-full p-4">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-sm font-medium text-center">
                Your {isPhone ? 'phone number' : 'email'} has been updated.
              </p>
              <Button onClick={onClose} className="w-full">Done</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactChangeDialog;
