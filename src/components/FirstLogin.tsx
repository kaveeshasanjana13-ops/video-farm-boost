import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Phone, Mail, CheckCircle2, ArrowLeft, User, Shield, Lock, ChevronRight, Loader2, Hash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { tokenStorageService } from '@/services/tokenStorageService';
import {
  type AnnotatedField,
  type VerifyOtpResponse,
  initiateFirstLogin,
  verifyFirstLoginOtp,
  requestPhoneOtp,
  verifyPhoneInFlow,
  requestEmailOtp,
  verifyEmailOtp,
  completeFirstLogin,
  storeFirstLoginTokens,
} from '@/api/firstLogin.api';

// ============= TYPES =============

type FlowStep =
  | 'identifier'           // Step 1: enter phone / email / ID
  | 'verify-otp'           // Step 2: verify initial OTP
  | 'additional-verify'    // Step 3: verify remaining contact (phone or email)
  | 'complete-profile';    // Step 4: profile + password

interface FirstLoginProps {
  onBack: () => void;
  onComplete: (user: any) => void;
}

// ============= COMPONENT =============

const FirstLogin: React.FC<FirstLoginProps> = ({ onBack, onComplete }) => {
  // ── Flow state ──
  const [step, setStep] = useState<FlowStep>('identifier');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // ── Step 1 ──
  const [identifier, setIdentifier] = useState('');
  const [otpChannel, setOtpChannel] = useState<'phone' | 'email'>('phone');
  const [maskedDest, setMaskedDest] = useState('');
  const [verificationsRequired, setVerificationsRequired] = useState({ phone: false, email: false });
  const [userHasPhone, setUserHasPhone] = useState(false);
  const [userHasEmail, setUserHasEmail] = useState(false);

  // ── Step 2 ──
  const [otp, setOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [firstLoginToken, setFirstLoginToken] = useState('');

  // ── Step 2 response data ──
  const [verificationsStillRequired, setVerificationsStillRequired] = useState({ phone: false, email: false });
  const [profile, setProfile] = useState<Record<string, AnnotatedField>>({});
  const [studentFields, setStudentFields] = useState<Record<string, AnnotatedField> | null>(null);
  const [parentFields, setParentFields] = useState<Record<string, AnnotatedField> | null>(null);

  // ── Step 3: additional verification ──
  const [additionalType, setAdditionalType] = useState<'phone' | 'email'>('email');
  const [additionalInput, setAdditionalInput] = useState(''); // new phone or email value
  const [additionalOtp, setAdditionalOtp] = useState('');
  const [additionalOtpSent, setAdditionalOtpSent] = useState(false);
  const [additionalOtpTimer, setAdditionalOtpTimer] = useState(0);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // ── Step 4: profile form ──
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ── Inline email verification on profile step (when email exists but unverified) ──
  const [inlineEmailOtp, setInlineEmailOtp] = useState('');
  const [inlineEmailOtpSent, setInlineEmailOtpSent] = useState(false);
  const [inlineEmailOtpTimer, setInlineEmailOtpTimer] = useState(0);

  // ── Inline phone verification on profile step ──
  const [inlinePhoneOtp, setInlinePhoneOtp] = useState('');
  const [inlinePhoneOtpSent, setInlinePhoneOtpSent] = useState(false);
  const [inlinePhoneOtpTimer, setInlinePhoneOtpTimer] = useState(0);

  const { toast } = useToast();

  // ============= TIMERS =============

  useEffect(() => {
    if (otpTimer > 0) {
      const t = setTimeout(() => setOtpTimer(prev => prev - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [otpTimer]);

  useEffect(() => {
    if (additionalOtpTimer > 0) {
      const t = setTimeout(() => setAdditionalOtpTimer(prev => prev - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [additionalOtpTimer]);

  useEffect(() => {
    if (inlineEmailOtpTimer > 0) {
      const t = setTimeout(() => setInlineEmailOtpTimer(prev => prev - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [inlineEmailOtpTimer]);

  useEffect(() => {
    if (inlinePhoneOtpTimer > 0) {
      const t = setTimeout(() => setInlinePhoneOtpTimer(prev => prev - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [inlinePhoneOtpTimer]);

  // ============= STEP 1: INITIATE =============

  const handleInitiate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const data = await initiateFirstLogin(identifier.trim());
      setOtpChannel(data.otpSentVia);
      setMaskedDest(data.maskedDestination);
      setVerificationsRequired(data.verificationsRequired);
      setUserHasPhone(data.userHasPhone);
      setUserHasEmail(data.userHasEmail);
      setOtpTimer(data.expiresInMinutes ? data.expiresInMinutes * 60 : 900);
      toast({
        title: 'OTP Sent',
        description: `Code sent via ${data.otpSentVia === 'phone' ? 'SMS' : 'email'} to ${data.maskedDestination}`,
      });
      setStep('verify-otp');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendInitiateOtp = async () => {
    setError('');
    setIsLoading(true);
    try {
      const data = await initiateFirstLogin(identifier.trim());
      setOtp('');
      setOtpTimer(data.expiresInMinutes ? data.expiresInMinutes * 60 : 900);
      toast({ title: 'OTP Resent', description: `New code sent to ${data.maskedDestination}` });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ============= STEP 2: VERIFY INITIAL OTP =============

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const data: VerifyOtpResponse = await verifyFirstLoginOtp(
        identifier.trim(),
        otp,
        otpChannel
      );

      setFirstLoginToken(data.access_token);
      setProfile(data.profile || {});
      setStudentFields(data.studentFields || null);
      setParentFields(data.parentFields || null);
      setIsPhoneVerified(data.isPhoneVerified);
      setIsEmailVerified(data.isEmailVerified);
      setUserHasPhone(data.userHasPhone);
      setUserHasEmail(data.userHasEmail);
      setVerificationsStillRequired(data.verificationsStillRequired);

      // Pre-fill form with existing values
      const initial: Record<string, any> = {};
      if (data.profile) {
        Object.entries(data.profile).forEach(([key, field]) => {
          if (field.value != null) initial[key] = field.value;
        });
      }
      if (data.studentFields) {
        Object.entries(data.studentFields).forEach(([key, field]) => {
          if (field.value != null) initial[key] = field.value;
        });
      }
      if (data.parentFields) {
        Object.entries(data.parentFields).forEach(([key, field]) => {
          if (field.value != null) initial[key] = field.value;
        });
      }
      setFormData(initial);

      // Pre-fill inline inputs
      if (data.profile?.email?.value) {
        setAdditionalInput(data.profile.email.value);
      }
      if (data.profile?.phoneNumber?.value) {
        setAdditionalInput(prev => prev || data.profile.phoneNumber.value);
      }

      // Decide next step
      const still = data.verificationsStillRequired;
      if (still.phone || still.email) {
        // Determine which type of additional verification is needed
        if (still.email) {
          setAdditionalType('email');
          if (data.profile?.email?.value) {
            setAdditionalInput(data.profile.email.value);
          } else {
            setAdditionalInput('');
          }
        } else if (still.phone) {
          setAdditionalType('phone');
          if (data.profile?.phoneNumber?.value) {
            setAdditionalInput(data.profile.phoneNumber.value);
          } else {
            setAdditionalInput('');
          }
        }
        setStep('additional-verify');
      } else {
        setStep('complete-profile');
      }

      toast({ title: 'Verified!', description: data.message });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ============= STEP 3: ADDITIONAL VERIFICATION =============

  const handleRequestAdditionalOtp = async () => {
    if (!additionalInput.trim()) return;
    setError('');
    setIsLoading(true);
    try {
      if (additionalType === 'email') {
        const data = await requestEmailOtp(additionalInput.trim(), firstLoginToken);
        setAdditionalOtpTimer(data.expiresInMinutes ? data.expiresInMinutes * 60 : 900);
      } else {
        const data = await requestPhoneOtp(additionalInput.trim(), firstLoginToken);
        setAdditionalOtpTimer(data.expiresInMinutes ? data.expiresInMinutes * 60 : 900);
      }
      setAdditionalOtpSent(true);
      setAdditionalOtp('');
      toast({
        title: 'OTP Sent',
        description: `Verification code sent via ${additionalType === 'phone' ? 'SMS' : 'email'}`,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAdditionalOtp = async () => {
    if (additionalOtp.length !== 6) return;
    setError('');
    setIsLoading(true);
    try {
      if (additionalType === 'email') {
        await verifyEmailOtp(additionalInput.trim(), additionalOtp, firstLoginToken);
        setIsEmailVerified(true);
        setFormData(prev => ({ ...prev, email: additionalInput.trim() }));
        toast({ title: 'Email Verified!', description: `${additionalInput} has been verified.` });
      } else {
        await verifyPhoneInFlow(additionalInput.trim(), additionalOtp, firstLoginToken);
        setIsPhoneVerified(true);
        toast({ title: 'Phone Verified!', description: `${additionalInput} has been verified.` });
      }

      // Check if there's another verification still needed
      const updatedStill = { ...verificationsStillRequired };
      if (additionalType === 'email') updatedStill.email = false;
      if (additionalType === 'phone') updatedStill.phone = false;
      setVerificationsStillRequired(updatedStill);

      if (updatedStill.phone || updatedStill.email) {
        // Switch to the other verification
        const nextType = updatedStill.phone ? 'phone' : 'email';
        setAdditionalType(nextType);
        setAdditionalInput(
          nextType === 'email' ? (profile?.email?.value || '') : (profile?.phoneNumber?.value || '')
        );
        setAdditionalOtp('');
        setAdditionalOtpSent(false);
        setAdditionalOtpTimer(0);
      } else {
        setStep('complete-profile');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ============= INLINE VERIFICATION (on profile step) =============

  const handleInlineEmailRequestOtp = async (emailValue: string) => {
    setError('');
    setIsLoading(true);
    try {
      const data = await requestEmailOtp(emailValue, firstLoginToken);
      setInlineEmailOtpSent(true);
      setInlineEmailOtp('');
      setInlineEmailOtpTimer(data.expiresInMinutes ? data.expiresInMinutes * 60 : 900);
      toast({ title: 'Email OTP Sent', description: data.message });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInlineEmailVerifyOtp = async (emailValue: string) => {
    if (inlineEmailOtp.length !== 6) return;
    setError('');
    setIsLoading(true);
    try {
      await verifyEmailOtp(emailValue, inlineEmailOtp, firstLoginToken);
      setIsEmailVerified(true);
      setFormData(prev => ({ ...prev, email: emailValue }));
      toast({ title: 'Email Verified!', description: `${emailValue} has been verified.` });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInlinePhoneRequestOtp = async (phoneValue: string) => {
    setError('');
    setIsLoading(true);
    try {
      const data = await requestPhoneOtp(phoneValue, firstLoginToken);
      setInlinePhoneOtpSent(true);
      setInlinePhoneOtp('');
      setInlinePhoneOtpTimer(data.expiresInMinutes ? data.expiresInMinutes * 60 : 900);
      toast({ title: 'Phone OTP Sent', description: data.message });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInlinePhoneVerifyOtp = async (phoneValue: string) => {
    if (inlinePhoneOtp.length !== 6) return;
    setError('');
    setIsLoading(true);
    try {
      await verifyPhoneInFlow(phoneValue, inlinePhoneOtp, firstLoginToken);
      setIsPhoneVerified(true);
      toast({ title: 'Phone Verified!', description: `${phoneValue} has been verified.` });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ============= STEP 4: COMPLETE PROFILE =============

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.firstName || !formData.lastName) {
      setError('First name and last name are required');
      return;
    }
    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError('Password must contain at least one uppercase letter');
      return;
    }
    if (!/[a-z]/.test(password)) {
      setError('Password must contain at least one lowercase letter');
      return;
    }
    if (!/[0-9]/.test(password)) {
      setError('Password must contain at least one number');
      return;
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      setError('Password must contain at least one special character');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const submitData = { ...formData, password, confirmPassword };
      const data = await completeFirstLogin(submitData, firstLoginToken);

      // Store real tokens
      await storeFirstLoginTokens(data.access_token, data.refresh_token, data.expires_in);

      // Store user data
      await tokenStorageService.setUserData({
        id: data.user.id,
        email: data.user.email,
        nameWithInitials: data.user.nameWithInitials || `${data.user.firstName} ${data.user.lastName}`,
        userType: data.user.userType,
        imageUrl: data.user.imageUrl || '',
      });

      toast({ title: 'Welcome!', description: 'Your account has been set up successfully.' });
      onComplete(data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ============= FORM HELPERS =============

  const updateField = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const formatTimer = (seconds: number) =>
    `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

  // ============= DETECT IDENTIFIER TYPE (for UI hint) =============

  const detectType = (val: string): 'phone' | 'email' | 'id' => {
    const trimmed = val.trim();
    if (trimmed.includes('@')) return 'email';
    if (/^(\+?94|0)\d+$/.test(trimmed.replace(/\s+/g, ''))) return 'phone';
    return 'id';
  };

  const identifierType = detectType(identifier);

  // ============= RENDER ANNOTATED FIELD =============

  const renderAnnotatedField = (
    key: string,
    field: AnnotatedField,
    section: 'profile' | 'student' | 'parent'
  ) => {
    if (key === 'id') return null;

    const label = key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, s => s.toUpperCase())
      .trim();

    // ── Email with verification ──
    if (key === 'email' && field.needsVerification !== undefined) {
      const emailValue = formData.email || field.value || '';
      const verified = isEmailVerified || field.isVerified;
      return (
        <div key={`${section}-${key}`} className="space-y-2 col-span-full">
          <Label className="text-sm font-medium flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" />
            Email {field.required && <span className="text-destructive">*</span>}
            {verified && (
              <Badge variant="outline" className="text-xs text-green-600 border-green-200 bg-green-50 ml-1">
                <CheckCircle2 className="h-3 w-3 mr-0.5" /> Verified
              </Badge>
            )}
          </Label>
          {verified ? (
            <Input value={emailValue} disabled className="bg-muted/50" />
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  type="email"
                  value={emailValue}
                  onChange={e => {
                    if (field.editable) updateField('email', e.target.value);
                  }}
                  placeholder="Enter your email"
                  className="flex-1 h-10"
                  disabled={!field.editable}
                />
                {!inlineEmailOtpSent && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleInlineEmailRequestOtp(emailValue)}
                    disabled={!emailValue || isLoading}
                    className="h-10 whitespace-nowrap"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send Code'}
                  </Button>
                )}
              </div>
              {inlineEmailOtpSent && !verified && (
                <div className="space-y-2 bg-muted/30 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Enter the 6-digit code sent to {emailValue}</p>
                  <div className="flex gap-2 items-center">
                    <InputOTP maxLength={6} value={inlineEmailOtp} onChange={setInlineEmailOtp} className="gap-1">
                      <InputOTPGroup className="gap-1">
                        {[0, 1, 2, 3, 4, 5].map(i => (
                          <InputOTPSlot key={i} index={i} className="w-9 h-10 text-base" />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleInlineEmailVerifyOtp(emailValue)}
                      disabled={inlineEmailOtp.length !== 6 || isLoading}
                      className="h-10"
                    >
                      Verify
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {inlineEmailOtpTimer > 0 ? (
                      <p className="text-xs text-muted-foreground">Resend in {formatTimer(inlineEmailOtpTimer)}</p>
                    ) : (
                      <Button type="button" variant="ghost" size="sm"
                        onClick={() => handleInlineEmailRequestOtp(emailValue)} disabled={isLoading}
                        className="text-xs h-7 px-2">
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

    // ── Phone with verification ──
    if (key === 'phoneNumber' && field.needsVerification !== undefined) {
      const phoneValue = formData.phoneNumber || field.value || '';
      const verified = isPhoneVerified || field.isVerified;
      return (
        <div key={`${section}-${key}`} className="space-y-2 col-span-full">
          <Label className="text-sm font-medium flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5" />
            Phone Number {field.required && <span className="text-destructive">*</span>}
            {verified && (
              <Badge variant="outline" className="text-xs text-green-600 border-green-200 bg-green-50 ml-1">
                <CheckCircle2 className="h-3 w-3 mr-0.5" /> Verified
              </Badge>
            )}
          </Label>
          {verified ? (
            <Input value={phoneValue} disabled className="bg-muted/50" />
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  type="tel"
                  value={phoneValue}
                  onChange={e => {
                    if (field.editable) updateField('phoneNumber', e.target.value);
                  }}
                  placeholder="077XXXXXXX"
                  className="flex-1 h-10"
                  disabled={!field.editable}
                />
                {!inlinePhoneOtpSent && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleInlinePhoneRequestOtp(phoneValue)}
                    disabled={!phoneValue || isLoading}
                    className="h-10 whitespace-nowrap"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send Code'}
                  </Button>
                )}
              </div>
              {inlinePhoneOtpSent && !verified && (
                <div className="space-y-2 bg-muted/30 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Enter the 6-digit code sent to {phoneValue}</p>
                  <div className="flex gap-2 items-center">
                    <InputOTP maxLength={6} value={inlinePhoneOtp} onChange={setInlinePhoneOtp} className="gap-1">
                      <InputOTPGroup className="gap-1">
                        {[0, 1, 2, 3, 4, 5].map(i => (
                          <InputOTPSlot key={i} index={i} className="w-9 h-10 text-base" />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleInlinePhoneVerifyOtp(phoneValue)}
                      disabled={inlinePhoneOtp.length !== 6 || isLoading}
                      className="h-10"
                    >
                      Verify
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {inlinePhoneOtpTimer > 0 ? (
                      <p className="text-xs text-muted-foreground">Resend in {formatTimer(inlinePhoneOtpTimer)}</p>
                    ) : (
                      <Button type="button" variant="ghost" size="sm"
                        onClick={() => handleInlinePhoneRequestOtp(phoneValue)} disabled={isLoading}
                        className="text-xs h-7 px-2">
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

    // ── Phone (read-only, already verified, no needsVerification flag) ──
    if (key === 'phoneNumber' && !field.editable) {
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

    // ── Non-editable field ──
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

    // ── Dropdown (options) ──
    if (field.options) {
      return (
        <div key={`${section}-${key}`} className="space-y-1.5">
          <Label className="text-sm">
            {label} {field.required && <span className="text-destructive">*</span>}
          </Label>
          <Select value={formData[key] ?? ''} onValueChange={val => updateField(key, val)}>
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

    // ── Date ──
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

    // ── Regular text input ──
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

  // ============= CONDITIONAL SECTIONS =============

  const selectedUserType = formData.userType || 'USER';
  const showStudentFields = studentFields && (selectedUserType === 'USER' || selectedUserType === 'USER_WITHOUT_PARENT');
  const showParentFields = parentFields && (selectedUserType === 'USER' || selectedUserType === 'USER_WITHOUT_STUDENT');

  // ============= PASSWORD STRENGTH INDICATOR =============

  const getPasswordStrength = () => {
    if (!password) return { level: 0, label: '', color: '' };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 2) return { level: score, label: 'Weak', color: 'bg-red-500' };
    if (score <= 3) return { level: score, label: 'Fair', color: 'bg-yellow-500' };
    if (score <= 4) return { level: score, label: 'Good', color: 'bg-blue-500' };
    return { level: score, label: 'Strong', color: 'bg-green-500' };
  };
  const pwStrength = getPasswordStrength();

  // ============= CAN SUBMIT =============

  const canSubmit = !isLoading &&
    formData.firstName &&
    formData.lastName &&
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password) &&
    password === confirmPassword;

  // ============= STEP CONFIGURATION =============

  const steps: { key: FlowStep; label: string }[] = [
    { key: 'identifier', label: 'Identify' },
    { key: 'verify-otp', label: 'Verify' },
    { key: 'additional-verify', label: 'Confirm' },
    { key: 'complete-profile', label: 'Profile' },
  ];

  // If no additional verification needed, skip step 3 in the indicator
  const activeSteps = verificationsStillRequired.phone || verificationsStillRequired.email
    ? steps
    : steps.filter(s => s.key !== 'additional-verify');

  const stepIndex = activeSteps.findIndex(s => s.key === step);

  const handleBack = () => {
    setError('');
    if (step === 'identifier') {
      onBack();
    } else if (step === 'verify-otp') {
      setStep('identifier');
      setOtp('');
    } else if (step === 'additional-verify') {
      // Don't go back from additional verify — would lose the JWT
      setStep('verify-otp');
    } else if (step === 'complete-profile') {
      // Don't go back — too much state
      onBack();
    }
  };

  // ============= RENDER =============

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-start bg-background px-4 py-6 md:py-10">
      <div className="w-full max-w-lg space-y-4">

        {/* ── Header ── */}
        <div className="flex items-center gap-3">
          <Button type="button" variant="ghost" size="icon" onClick={handleBack} className="h-9 w-9">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg md:text-xl font-bold">Activate Your Account</h1>
            <p className="text-xs text-muted-foreground">
              {step === 'identifier' && 'Enter your registered phone, email, or student ID'}
              {step === 'verify-otp' && `Verify your ${otpChannel === 'phone' ? 'phone' : 'email'}`}
              {step === 'additional-verify' && `Verify your ${additionalType}`}
              {step === 'complete-profile' && 'Complete your profile'}
            </p>
          </div>
        </div>

        {/* ── Step indicator ── */}
        <div className="flex items-center gap-2">
          {activeSteps.map((s, i) => (
            <React.Fragment key={s.key}>
              {i > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
              <StepBadge
                number={i + 1}
                label={s.label}
                active={step === s.key}
                done={i < stepIndex}
              />
            </React.Fragment>
          ))}
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="text-xs md:text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* =============== STEP 1: IDENTIFIER INPUT =============== */}
        {step === 'identifier' && (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="text-center space-y-2 mb-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  {identifierType === 'phone' && <Phone className="h-6 w-6 text-primary" />}
                  {identifierType === 'email' && <Mail className="h-6 w-6 text-primary" />}
                  {identifierType === 'id' && <Hash className="h-6 w-6 text-primary" />}
                </div>
                <p className="text-sm text-muted-foreground">
                  Enter the phone, email, or ID that your institute used when they registered you.
                </p>
              </div>

              <form onSubmit={handleInitiate} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="identifier" className="text-sm font-medium">
                    Phone, Email, or Student ID
                  </Label>
                  <Input
                    id="identifier"
                    type={identifierType === 'email' ? 'email' : 'text'}
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    placeholder="077XXXXXXX, student@school.lk, or STU-0001"
                    required
                    className="h-11 text-base"
                    autoComplete="username"
                    autoFocus
                  />
                  <div className="flex items-center gap-1.5 mt-1">
                    {identifier.trim() && (
                      <Badge variant="secondary" className="text-[10px]">
                        {identifierType === 'phone' && 'Phone number detected'}
                        {identifierType === 'email' && 'Email detected'}
                        {identifierType === 'id' && 'Student/System ID detected'}
                      </Badge>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 text-base touch-manipulation"
                  disabled={!identifier.trim() || isLoading}
                >
                  {isLoading ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending verification code...</>
                  ) : (
                    'Send Verification Code'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* =============== STEP 2: VERIFY INITIAL OTP =============== */}
        {step === 'verify-otp' && (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="text-center space-y-2 mb-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit code sent via{' '}
                  <strong>{otpChannel === 'phone' ? 'SMS' : 'email'}</strong> to{' '}
                  <strong>{maskedDest}</strong>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="flex justify-center py-2">
                  <InputOTP maxLength={6} value={otp} onChange={setOtp} className="gap-1.5 md:gap-2">
                    <InputOTPGroup className="gap-1.5 md:gap-2">
                      {[0, 1, 2, 3, 4, 5].map(i => (
                        <InputOTPSlot key={i} index={i} className="w-10 h-12 md:w-12 md:h-14 text-lg md:text-xl" />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 text-base touch-manipulation"
                  disabled={otp.length !== 6 || isLoading}
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
                      Resend code in {formatTimer(otpTimer)}
                    </p>
                  ) : (
                    <Button type="button" variant="ghost" onClick={handleResendInitiateOtp}
                      disabled={isLoading} className="text-xs md:text-sm h-9">
                      Resend OTP
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* =============== STEP 3: ADDITIONAL VERIFICATION =============== */}
        {step === 'additional-verify' && (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="text-center space-y-2 mb-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  {additionalType === 'email' ? (
                    <Mail className="h-6 w-6 text-primary" />
                  ) : (
                    <Phone className="h-6 w-6 text-primary" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {additionalType === 'email'
                    ? 'Verify your email address to continue.'
                    : 'Verify your phone number to continue.'}
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">
                    {additionalType === 'email' ? 'Email Address' : 'Phone Number'}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type={additionalType === 'email' ? 'email' : 'tel'}
                      value={additionalInput}
                      onChange={e => setAdditionalInput(e.target.value)}
                      placeholder={additionalType === 'email' ? 'your@email.com' : '077XXXXXXX'}
                      className="flex-1 h-11 text-base"
                      disabled={
                        additionalType === 'email'
                          ? (!!profile?.email?.value && !profile.email.editable)
                          : (!!profile?.phoneNumber?.value && !profile.phoneNumber.editable)
                      }
                    />
                    {!additionalOtpSent && (
                      <Button
                        type="button"
                        onClick={handleRequestAdditionalOtp}
                        disabled={!additionalInput.trim() || isLoading}
                        className="h-11"
                      >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send Code'}
                      </Button>
                    )}
                  </div>
                </div>

                {additionalOtpSent && (
                  <div className="space-y-3 bg-muted/30 p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground">
                      Enter the 6-digit code sent to <strong>{additionalInput}</strong>
                    </p>
                    <div className="flex justify-center">
                      <InputOTP maxLength={6} value={additionalOtp} onChange={setAdditionalOtp} className="gap-1.5">
                        <InputOTPGroup className="gap-1.5">
                          {[0, 1, 2, 3, 4, 5].map(i => (
                            <InputOTPSlot key={i} index={i} className="w-10 h-12 text-lg" />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    <Button
                      type="button"
                      className="w-full h-11"
                      onClick={handleVerifyAdditionalOtp}
                      disabled={additionalOtp.length !== 6 || isLoading}
                    >
                      {isLoading ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Verifying...</>
                      ) : (
                        'Verify'
                      )}
                    </Button>
                    <div className="text-center">
                      {additionalOtpTimer > 0 ? (
                        <p className="text-xs text-muted-foreground">
                          Resend in {formatTimer(additionalOtpTimer)}
                        </p>
                      ) : (
                        <Button type="button" variant="ghost" size="sm"
                          onClick={handleRequestAdditionalOtp} disabled={isLoading}
                          className="text-xs h-7">
                          Resend Code
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* =============== STEP 4: COMPLETE PROFILE =============== */}
        {step === 'complete-profile' && (
          <form onSubmit={handleCompleteProfile} className="space-y-4">

            {/* Verifiable contacts */}
            {(profile.email?.needsVerification !== undefined || profile.phoneNumber?.needsVerification !== undefined) && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Shield className="h-4 w-4" /> Contact Verification
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  {profile.email?.needsVerification !== undefined &&
                    renderAnnotatedField('email', profile.email, 'profile')}
                  {profile.phoneNumber?.needsVerification !== undefined &&
                    renderAnnotatedField('phoneNumber', profile.phoneNumber, 'profile')}
                </CardContent>
              </Card>
            )}

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
                    .filter(([key]) => key !== 'id' && key !== 'email' && key !== 'phoneNumber')
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
                  <Label htmlFor="newPwd" className="text-sm">
                    Password <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPwd"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Min 8 chars, upper, lower, number, special"
                      required
                      className="h-10 pr-12"
                      autoComplete="new-password"
                    />
                    <Button type="button" variant="ghost" size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {/* Strength indicator */}
                  {password && (
                    <div className="space-y-1">
                      <div className="flex gap-1 h-1">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div key={i} className={`flex-1 rounded-full ${i <= pwStrength.level ? pwStrength.color : 'bg-muted'}`} />
                        ))}
                      </div>
                      <p className={`text-[10px] ${pwStrength.level <= 2 ? 'text-red-500' : pwStrength.level <= 3 ? 'text-yellow-500' : 'text-green-500'}`}>
                        {pwStrength.label}
                      </p>
                    </div>
                  )}
                  <ul className="text-[10px] text-muted-foreground space-y-0.5 mt-1">
                    <li className={password.length >= 8 ? 'text-green-600' : ''}>
                      {password.length >= 8 ? '✓' : '○'} At least 8 characters
                    </li>
                    <li className={/[A-Z]/.test(password) ? 'text-green-600' : ''}>
                      {/[A-Z]/.test(password) ? '✓' : '○'} Uppercase letter
                    </li>
                    <li className={/[a-z]/.test(password) ? 'text-green-600' : ''}>
                      {/[a-z]/.test(password) ? '✓' : '○'} Lowercase letter
                    </li>
                    <li className={/[0-9]/.test(password) ? 'text-green-600' : ''}>
                      {/[0-9]/.test(password) ? '✓' : '○'} Number
                    </li>
                    <li className={/[^A-Za-z0-9]/.test(password) ? 'text-green-600' : ''}>
                      {/[^A-Za-z0-9]/.test(password) ? '✓' : '○'} Special character
                    </li>
                  </ul>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPwd" className="text-sm">
                    Confirm Password <span className="text-destructive">*</span>
                  </Label>
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
                    <Button type="button" variant="ghost" size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {password && confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-destructive">Passwords do not match</p>
                  )}
                  {password && confirmPassword && password === confirmPassword && (
                    <p className="text-xs text-green-600">✓ Passwords match</p>
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
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Activating account...</>
              ) : (
                'Activate Account'
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

export default FirstLogin;
