import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Phone, Mail, CheckCircle2, ArrowLeft, User, Shield, Lock, ChevronRight, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { tokenStorageService, isNativePlatform } from '@/services/tokenStorageService';
import surakshaLogo from '@/assets/suraksha-logo.png';
import {
  type FieldAnnotation,
  type PhoneVerifyResponse,
  initiatePhoneFirstLogin,
  verifyPhoneOtp,
  requestEmailOtp,
  verifyEmailOtp,
  completeFirstLogin,
  storeFirstLoginTokens,
} from '@/api/firstLogin.api';

// ============= TYPES =============

type FlowStep = 'phone' | 'verify-phone-otp' | 'complete-profile';

interface PhoneFirstLoginProps {
  onBack: () => void;
  onComplete: (user: any) => void;
}

// ============= COMPONENT =============

const PhoneFirstLogin: React.FC<PhoneFirstLoginProps> = ({ onBack, onComplete }) => {
  // Flow state
  const [step, setStep] = useState<FlowStep>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Step 1: Phone
  const [phone, setPhone] = useState('');
  
  // Step 2: OTP
  const [phoneOtp, setPhoneOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  
  // JWT from step 2
  const [firstLoginToken, setFirstLoginToken] = useState('');
  
  // Step 2 response: annotated profile
  const [profile, setProfile] = useState<Record<string, FieldAnnotation>>({});
  const [studentFields, setStudentFields] = useState<Record<string, FieldAnnotation> | null>(null);
  const [parentFields, setParentFields] = useState<Record<string, FieldAnnotation> | null>(null);
  
  // Steps 3-4: Email verification
  const [email, setEmail] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showEmailOtpInput, setShowEmailOtpInput] = useState(false);
  const [emailOtpTimer, setEmailOtpTimer] = useState(0);
  
  // Step 5: Profile form data + password
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { toast } = useToast();

  // ============= OTP TIMERS =============
  
  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  useEffect(() => {
    if (emailOtpTimer > 0) {
      const timer = setTimeout(() => setEmailOtpTimer(emailOtpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [emailOtpTimer]);

  // ============= STEP 1: INITIATE =============

  const handleInitiatePhone = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const cleanedPhone = phone.replace(/\s+/g, '').replace(/^\+/, '');
      const data = await initiatePhoneFirstLogin(cleanedPhone);
      toast({
        title: 'OTP Sent',
        description: data.message || 'Check your phone for the SMS code.',
      });
      setStep('verify-phone-otp');
      setOtpTimer(data.expiresInMinutes ? data.expiresInMinutes * 60 : 60);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ============= STEP 2: VERIFY PHONE OTP =============

  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const cleanedPhone = phone.replace(/\s+/g, '').replace(/^\+/, '');
      const data = await verifyPhoneOtp(cleanedPhone, phoneOtp);
      
      // Store the temporary JWT
      setFirstLoginToken(data.access_token);
      
      // Store annotated profile
      setProfile(data.profile || {});
      setStudentFields(data.studentFields || null);
      setParentFields(data.parentFields || null);
      setIsEmailVerified(data.isEmailVerified);
      
      // Pre-fill form with existing values
      const initial: Record<string, any> = {};
      if (data.profile) {
        Object.entries(data.profile).forEach(([key, field]) => {
          if (field.value !== null && field.value !== undefined) initial[key] = field.value;
        });
      }
      if (data.studentFields) {
        Object.entries(data.studentFields).forEach(([key, field]) => {
          if (field.value !== null && field.value !== undefined) initial[key] = field.value;
        });
      }
      if (data.parentFields) {
        Object.entries(data.parentFields).forEach(([key, field]) => {
          if (field.value !== null && field.value !== undefined) initial[key] = field.value;
        });
      }
      setFormData(initial);
      
      // If email is already set and editable=false, pre-fill it
      if (data.profile?.email?.value) {
        setEmail(data.profile.email.value);
      }
      
      toast({
        title: 'Phone Verified!',
        description: 'Please complete your profile.',
      });
      setStep('complete-profile');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendPhoneOtp = async () => {
    setError('');
    setIsLoading(true);
    try {
      const cleanedPhone = phone.replace(/\s+/g, '').replace(/^\+/, '');
      await initiatePhoneFirstLogin(cleanedPhone);
      setPhoneOtp('');
      setOtpTimer(60);
      toast({ title: 'OTP Resent', description: 'Check your phone for the new SMS code.' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ============= STEPS 3-4: EMAIL VERIFICATION =============

  const handleRequestEmailOtp = async () => {
    if (!email) return;
    setError('');
    setIsLoading(true);
    try {
      const data = await requestEmailOtp(email, firstLoginToken);
      setShowEmailOtpInput(true);
      setEmailOtpTimer(data.expiresInMinutes ? data.expiresInMinutes * 60 : 60);
      toast({ title: 'Email OTP Sent', description: data.message });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    if (emailOtp.length !== 6) return;
    setError('');
    setIsLoading(true);
    try {
      await verifyEmailOtp(email, emailOtp, firstLoginToken);
      setIsEmailVerified(true);
      setFormData(prev => ({ ...prev, email }));
      toast({ title: 'Email Verified!', description: `${email} has been verified.` });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ============= STEP 5: COMPLETE PROFILE =============

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (!formData.firstName || !formData.lastName) {
      setError('First name and last name are required');
      return;
    }
    if (!isEmailVerified) {
      setError('Please verify your email before completing registration');
      return;
    }

    setIsLoading(true);
    try {
      const submitData = { ...formData, password, confirmPassword };
      const data = await completeFirstLogin(submitData, firstLoginToken);
      
      // Store real login tokens securely
      await storeFirstLoginTokens(
        data.access_token,
        data.refresh_token,
        data.expires_in
      );
      
      // Store user data
      await tokenStorageService.setUserData({
        id: data.user.id,
        email: data.user.email,
        nameWithInitials: data.user.nameWithInitials || `${data.user.firstName} ${data.user.lastName}`,
        userType: data.user.userType,
        imageUrl: data.user.imageUrl || '',
      });
      
      toast({
        title: 'Welcome!',
        description: 'Your account has been set up successfully.',
      });
      
      // Notify parent to refresh auth state
      onComplete(data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ============= FORM FIELD UPDATE =============

  const updateField = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // ============= RENDER ANNOTATED FIELD =============

  const renderAnnotatedField = (
    key: string,
    field: FieldAnnotation,
    section: 'profile' | 'student' | 'parent'
  ) => {
    // Skip ID field
    if (key === 'id') return null;

    const label = key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, s => s.toUpperCase())
      .trim();

    // Email field — special handling with verification
    if (key === 'email' && field.needsVerification) {
      return (
        <div key={`${section}-${key}`} className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" />
            Email <span className="text-destructive">*</span>
            {isEmailVerified && (
              <Badge variant="outline" className="text-xs text-green-600 border-green-200 bg-green-50 ml-1">
                <CheckCircle2 className="h-3 w-3 mr-0.5" /> Verified
              </Badge>
            )}
          </Label>
          {isEmailVerified ? (
            <Input value={email} disabled className="bg-muted/50" />
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 h-10"
                  disabled={!field.editable}
                />
                {!showEmailOtpInput && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRequestEmailOtp}
                    disabled={!email || isLoading}
                    className="h-10 whitespace-nowrap"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send Code'}
                  </Button>
                )}
              </div>
              {showEmailOtpInput && !isEmailVerified && (
                <div className="space-y-2 bg-muted/30 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Enter the 6-digit code sent to {email}</p>
                  <div className="flex gap-2 items-center">
                    <InputOTP maxLength={6} value={emailOtp} onChange={setEmailOtp} className="gap-1">
                      <InputOTPGroup className="gap-1">
                        <InputOTPSlot index={0} className="w-9 h-10 text-base" />
                        <InputOTPSlot index={1} className="w-9 h-10 text-base" />
                        <InputOTPSlot index={2} className="w-9 h-10 text-base" />
                        <InputOTPSlot index={3} className="w-9 h-10 text-base" />
                        <InputOTPSlot index={4} className="w-9 h-10 text-base" />
                        <InputOTPSlot index={5} className="w-9 h-10 text-base" />
                      </InputOTPGroup>
                    </InputOTP>
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleVerifyEmailOtp}
                      disabled={emailOtp.length !== 6 || isLoading}
                      className="h-10"
                    >
                      Verify
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {emailOtpTimer > 0 ? (
                      <p className="text-xs text-muted-foreground">Resend in {Math.floor(emailOtpTimer / 60)}:{String(emailOtpTimer % 60).padStart(2, '0')}</p>
                    ) : (
                      <Button type="button" variant="ghost" size="sm" onClick={handleRequestEmailOtp} disabled={isLoading} className="text-xs h-7 px-2">
                        Resend Code
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    // Non-editable field
    if (!field.editable) {
      return (
        <div key={`${section}-${key}`} className="space-y-1.5">
          <Label className="text-sm text-muted-foreground flex items-center gap-1">
            {label}
            <Lock className="h-3 w-3 text-muted-foreground" />
          </Label>
          <Input value={field.value ?? '—'} disabled className="bg-muted/50 text-muted-foreground h-10" />
        </div>
      );
    }

    // Dropdown field (has options)
    if (field.options) {
      return (
        <div key={`${section}-${key}`} className="space-y-1.5">
          <Label className="text-sm">
            {label} {field.required && <span className="text-destructive">*</span>}
          </Label>
          <Select
            value={formData[key] ?? ''}
            onValueChange={val => updateField(key, val)}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options.map(opt => (
                <SelectItem key={opt} value={opt}>
                  {opt.replace(/_/g, ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    // Date field
    if (key === 'dateOfBirth') {
      return (
        <div key={`${section}-${key}`} className="space-y-1.5">
          <Label className="text-sm">
            {label} {field.required && <span className="text-destructive">*</span>}
          </Label>
          <Input
            type="date"
            value={formData[key] ?? ''}
            onChange={e => updateField(key, e.target.value)}
            className="h-10"
          />
        </div>
      );
    }

    // Phone number field
    if (key === 'phoneNumber') {
      return (
        <div key={`${section}-${key}`} className="space-y-1.5">
          <Label className="text-sm text-muted-foreground flex items-center gap-1">
            <Phone className="h-3.5 w-3.5" /> {label}
            <Lock className="h-3 w-3 text-muted-foreground" />
          </Label>
          <Input value={field.value ?? '—'} disabled className="bg-muted/50 text-muted-foreground h-10" />
        </div>
      );
    }

    // Regular text input
    return (
      <div key={`${section}-${key}`} className="space-y-1.5">
        <Label className="text-sm">
          {label} {field.required && <span className="text-destructive">*</span>}
        </Label>
        <Input
          value={formData[key] ?? ''}
          onChange={e => updateField(key, e.target.value)}
          placeholder={`Enter ${label.toLowerCase()}`}
          className="h-10"
        />
      </div>
    );
  };

  // ============= SHOULD SHOW FIELDS BASED ON USER TYPE =============

  const selectedUserType = formData.userType || 'USER';
  const showStudentFields = studentFields && (selectedUserType === 'USER' || selectedUserType === 'USER_WITHOUT_PARENT');
  const showParentFields = parentFields && (selectedUserType === 'USER' || selectedUserType === 'USER_WITHOUT_STUDENT');

  // ============= CAN SUBMIT =============

  const canSubmit = !isLoading &&
    formData.firstName &&
    formData.lastName &&
    password &&
    password.length >= 6 &&
    password === confirmPassword &&
    isEmailVerified;

  // ============= RENDER =============

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-start bg-background px-4 py-6 md:py-10">
      <div className="w-full max-w-lg space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={step === 'phone' ? onBack : () => {
              if (step === 'verify-phone-otp') setStep('phone');
              else if (step === 'complete-profile') {
                // Don't go back from profile — too much state to lose
                onBack();
              }
            }}
            className="h-9 w-9"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg md:text-xl font-bold">First Time Login</h1>
            <p className="text-xs text-muted-foreground">
              {step === 'phone' && 'Enter your phone number to get started'}
              {step === 'verify-phone-otp' && 'Verify your phone number'}
              {step === 'complete-profile' && 'Complete your profile'}
            </p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2">
          <StepBadge number={1} label="Phone" active={step === 'phone'} done={step !== 'phone'} />
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <StepBadge number={2} label="Verify" active={step === 'verify-phone-otp'} done={step === 'complete-profile'} />
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <StepBadge number={3} label="Profile" active={step === 'complete-profile'} done={false} />
        </div>

        {/* Error */}
        {error && (
          <div className="text-xs md:text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* =============== STEP 1: PHONE INPUT =============== */}
        {step === 'phone' && (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="text-center space-y-2 mb-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Enter the phone number your institute registered you with. We'll send an SMS verification code.
                </p>
              </div>

              <form onSubmit={handleInitiatePhone} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="077XXXXXXX or +94XXXXXXXXX"
                    required
                    className="h-11 text-base font-mono"
                    autoComplete="tel"
                    autoFocus
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Formats: 077XXXXXXX, 94XXXXXXXXX, or +94XXXXXXXXX
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 text-base touch-manipulation"
                  disabled={!phone || isLoading}
                >
                  {isLoading ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending OTP...</>
                  ) : (
                    'Send OTP via SMS'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* =============== STEP 2: VERIFY PHONE OTP =============== */}
        {step === 'verify-phone-otp' && (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="text-center space-y-2 mb-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit code sent to <strong>{phone}</strong>
                </p>
              </div>

              <form onSubmit={handleVerifyPhoneOtp} className="space-y-4">
                <div className="flex justify-center py-2">
                  <InputOTP maxLength={6} value={phoneOtp} onChange={setPhoneOtp} className="gap-1.5 md:gap-2">
                    <InputOTPGroup className="gap-1.5 md:gap-2">
                      <InputOTPSlot index={0} className="w-10 h-12 md:w-12 md:h-14 text-lg md:text-xl" />
                      <InputOTPSlot index={1} className="w-10 h-12 md:w-12 md:h-14 text-lg md:text-xl" />
                      <InputOTPSlot index={2} className="w-10 h-12 md:w-12 md:h-14 text-lg md:text-xl" />
                      <InputOTPSlot index={3} className="w-10 h-12 md:w-12 md:h-14 text-lg md:text-xl" />
                      <InputOTPSlot index={4} className="w-10 h-12 md:w-12 md:h-14 text-lg md:text-xl" />
                      <InputOTPSlot index={5} className="w-10 h-12 md:w-12 md:h-14 text-lg md:text-xl" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 text-base touch-manipulation"
                  disabled={phoneOtp.length !== 6 || isLoading}
                >
                  {isLoading ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Verifying...</>
                  ) : (
                    'Verify Code'
                  )}
                </Button>

                <div className="text-center">
                  {otpTimer > 0 ? (
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Resend code in {Math.floor(otpTimer / 60)}:{String(otpTimer % 60).padStart(2, '0')}
                    </p>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleResendPhoneOtp}
                      disabled={isLoading}
                      className="text-xs md:text-sm h-9"
                    >
                      Resend OTP
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* =============== STEPS 3-5: COMPLETE PROFILE =============== */}
        {step === 'complete-profile' && (
          <form onSubmit={handleCompleteProfile} className="space-y-4">
            {/* Email Verification Section */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Email Verification
                  {isEmailVerified && (
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 text-[10px]">
                      <CheckCircle2 className="h-3 w-3 mr-0.5" /> Verified
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {profile.email && renderAnnotatedField('email', profile.email, 'profile')}
                {!profile.email && (
                  <div className="space-y-2">
                    <Label className="text-sm">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    {isEmailVerified ? (
                      <div className="flex items-center gap-2">
                        <Input value={email} disabled className="bg-muted/50" />
                        <Badge variant="outline" className="text-green-600 whitespace-nowrap"><CheckCircle2 className="h-3 w-3 mr-1" />Verified</Badge>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="flex-1 h-10"
                          />
                          {!showEmailOtpInput && (
                            <Button type="button" variant="outline" size="sm" onClick={handleRequestEmailOtp} disabled={!email || isLoading} className="h-10">
                              Send Code
                            </Button>
                          )}
                        </div>
                        {showEmailOtpInput && (
                          <div className="space-y-2 bg-muted/30 p-3 rounded-lg">
                            <p className="text-xs text-muted-foreground">Enter the 6-digit code sent to {email}</p>
                            <div className="flex gap-2 items-center">
                              <InputOTP maxLength={6} value={emailOtp} onChange={setEmailOtp} className="gap-1">
                                <InputOTPGroup className="gap-1">
                                  <InputOTPSlot index={0} className="w-9 h-10 text-base" />
                                  <InputOTPSlot index={1} className="w-9 h-10 text-base" />
                                  <InputOTPSlot index={2} className="w-9 h-10 text-base" />
                                  <InputOTPSlot index={3} className="w-9 h-10 text-base" />
                                  <InputOTPSlot index={4} className="w-9 h-10 text-base" />
                                  <InputOTPSlot index={5} className="w-9 h-10 text-base" />
                                </InputOTPGroup>
                              </InputOTP>
                              <Button type="button" size="sm" onClick={handleVerifyEmailOtp} disabled={emailOtp.length !== 6 || isLoading} className="h-10">
                                Verify
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <User className="h-4 w-4" /> Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(profile)
                    .filter(([key]) => key !== 'id' && key !== 'email')
                    .map(([key, field]) => renderAnnotatedField(key, field, 'profile'))}
                </div>
              </CardContent>
            </Card>

            {/* Student Information */}
            {showStudentFields && Object.keys(studentFields!).length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    📚 Student Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(studentFields!).map(([key, field]) =>
                      renderAnnotatedField(key, field, 'student')
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Parent Information */}
            {showParentFields && Object.keys(parentFields!).length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    👨‍👩‍👧 Parent Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(parentFields!).map(([key, field]) =>
                      renderAnnotatedField(key, field, 'parent')
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Password */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Lock className="h-4 w-4" /> Set Password
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="newPwd" className="text-sm">Password <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <Input
                      id="newPwd"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      required
                      className="h-10 pr-12"
                      autoComplete="new-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPwd" className="text-sm">Confirm Password <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <Input
                      id="confirmPwd"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      required
                      className="h-10 pr-12"
                      autoComplete="new-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {password && confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-destructive">Passwords do not match</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-11 text-base touch-manipulation"
              disabled={!canSubmit}
            >
              {isLoading ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Completing Registration...</>
              ) : (
                'Complete Registration'
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

// ============= STEP BADGE COMPONENT =============

const StepBadge: React.FC<{
  number: number;
  label: string;
  active: boolean;
  done: boolean;
}> = ({ number, label, active, done }) => (
  <div className={`flex items-center gap-1.5 ${active ? 'text-primary' : done ? 'text-green-600' : 'text-muted-foreground'}`}>
    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
      active ? 'bg-primary text-primary-foreground' :
      done ? 'bg-green-100 text-green-700' :
      'bg-muted text-muted-foreground'
    }`}>
      {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : number}
    </div>
    <span className="text-xs font-medium hidden sm:inline">{label}</span>
  </div>
);

export default PhoneFirstLogin;
