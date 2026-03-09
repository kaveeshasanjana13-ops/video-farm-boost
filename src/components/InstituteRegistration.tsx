import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PhoneInput } from '@/components/ui/phone-input';
import {
  ArrowLeft, ChevronRight, Loader2, CheckCircle2, Building2, MapPin, Globe, Mail,
} from 'lucide-react';
import surakshaLogo from '@/assets/suraksha-logo.png';
import loginIllustration from '@/assets/login-illustration.png';
import { useToast } from '@/hooks/use-toast';
import {
  registerInstitute,
  isValidSriLankanPhone,
  type CreatePublicInstituteRequest,
} from '@/api/instituteRegistration.api';
import { DISTRICTS, DISTRICT_TO_PROVINCE } from '@/api/registration.api';

// ============= TYPES =============

type FlowStep = 'basic' | 'contact' | 'location' | 'additional' | 'review';

const STEPS: { key: FlowStep; label: string }[] = [
  { key: 'basic', label: 'Basic Info' },
  { key: 'contact', label: 'Contact' },
  { key: 'location', label: 'Location' },
  { key: 'additional', label: 'Additional' },
  { key: 'review', label: 'Review' },
];

interface InstituteRegistrationProps {
  onBack: () => void;
  onComplete: (data: any) => void;
}

// ============= STEP INDICATOR =============

const StepIndicator: React.FC<{ steps: string[]; current: number }> = ({ steps, current }) => (
  <div className="flex items-center justify-between w-full max-w-md mx-auto">
    {steps.map((label, i) => (
      <React.Fragment key={label}>
        <div className="flex flex-col items-center gap-1">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
            i < current ? 'bg-primary text-primary-foreground' :
            i === current ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' :
            'bg-muted text-muted-foreground'
          }`}>
            {i < current ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
          </div>
          <span className={`text-[10px] font-medium ${i <= current ? 'text-primary' : 'text-muted-foreground'}`}>
            {label}
          </span>
        </div>
        {i < steps.length - 1 && (
          <div className={`flex-1 h-0.5 mx-1 mb-5 ${i < current ? 'bg-primary' : 'bg-muted'}`} />
        )}
      </React.Fragment>
    ))}
  </div>
);

// ============= COMPONENT =============

const InstituteRegistration: React.FC<InstituteRegistrationProps> = ({ onBack, onComplete }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState<FlowStep>('basic');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form data
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [systemContactPhone, setSystemContactPhone] = useState('+94');
  const [systemContactEmail, setSystemContactEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [description, setDescription] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');

  const currentStepIdx = STEPS.findIndex(s => s.key === step);

  // ============= VALIDATION =============

  const validateBasic = (): boolean => {
    if (!name.trim()) { toast({ title: 'Institute name is required', variant: 'destructive' }); return false; }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast({ title: 'Valid email is required', variant: 'destructive' }); return false; }
    return true;
  };

  const validateContact = (): boolean => {
    const cleanPhone = systemContactPhone.replace(/\s/g, '');
    if (!cleanPhone || !isValidSriLankanPhone(cleanPhone)) {
      toast({ title: 'Valid contact phone required (+947XXXXXXXX)', variant: 'destructive' }); return false;
    }
    if (!systemContactEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(systemContactEmail)) {
      toast({ title: 'Valid system contact email required', variant: 'destructive' }); return false;
    }
    return true;
  };

  // ============= NAVIGATION =============

  const handleNext = () => {
    switch (step) {
      case 'basic':
        if (validateBasic()) setStep('contact');
        break;
      case 'contact':
        if (validateContact()) setStep('location');
        break;
      case 'location':
        setStep('additional');
        break;
      case 'additional':
        setStep('review');
        break;
    }
  };

  const handleBack = () => {
    switch (step) {
      case 'basic': onBack(); break;
      case 'contact': setStep('basic'); break;
      case 'location': setStep('contact'); break;
      case 'additional': setStep('location'); break;
      case 'review': setStep('additional'); break;
    }
  };

  // ============= SUBMIT =============

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    const payload: CreatePublicInstituteRequest = {
      name: name.trim(),
      email: email.trim(),
      systemContactPhoneNumber: systemContactPhone.replace(/\s/g, ''),
      systemContactEmail: systemContactEmail.trim(),
      ...(shortName && { shortName: shortName.trim() }),
      ...(phone && { phone: phone.trim() }),
      ...(address && { address: address.trim() }),
      ...(city && { city: city.trim() }),
      ...(district && { district }),
      ...(district && DISTRICT_TO_PROVINCE[district] && { province: DISTRICT_TO_PROVINCE[district] }),
      ...(pinCode && { pinCode: pinCode.trim() }),
      ...(description && { description: description.trim() }),
      ...(websiteUrl && { websiteUrl: websiteUrl.trim() }),
      country: 'Sri Lanka',
    };

    try {
      const result = await registerInstitute(payload);
      toast({
        title: 'Institute registered successfully!',
        description: `Institute code: ${result.data.code}`,
      });
      onComplete(result);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      toast({ title: 'Registration failed', description: err.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  // ============= RENDER STEPS =============

  const renderContent = () => {
    if (step === 'basic') {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-1 border-b border-border/50">
            <Building2 className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm text-foreground">Institute Information</h3>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Institute Name *</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Cambridge International School" className="h-9" maxLength={255} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Short Name</Label>
            <Input value={shortName} onChange={e => setShortName(e.target.value)} placeholder="CIS" className="h-9" maxLength={50} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Institute Email *</Label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@school.edu" className="h-9" maxLength={255} />
          </div>
          <div className="flex gap-3 mt-2">
            <Button variant="outline" className="h-11" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <Button className="flex-1 h-11" onClick={handleNext}>
              Continue <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      );
    }

    if (step === 'contact') {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-1 border-b border-border/50">
            <Mail className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm text-foreground">Contact Details</h3>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">System Contact Phone * (+947XXXXXXXX)</Label>
            <PhoneInput value={systemContactPhone} onChange={v => setSystemContactPhone(v)} className="h-9" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">System Contact Email *</Label>
            <Input type="email" value={systemContactEmail} onChange={e => setSystemContactEmail(e.target.value)} placeholder="system@school.edu" className="h-9" maxLength={255} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Institute Phone</Label>
            <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+94112345678" className="h-9" maxLength={20} />
          </div>
          <div className="flex gap-3 mt-2">
            <Button variant="outline" className="h-11" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <Button className="flex-1 h-11" onClick={handleNext}>
              Continue <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      );
    }

    if (step === 'location') {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-1 border-b border-border/50">
            <MapPin className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm text-foreground">Location Details</h3>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Address</Label>
            <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="123 Education Street" className="h-9" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">District</Label>
              <Select value={district} onValueChange={v => setDistrict(v)}>
                <SelectTrigger className="h-9"><SelectValue placeholder="Select district" /></SelectTrigger>
                <SelectContent>
                  {DISTRICTS.map(d => (
                    <SelectItem key={d} value={d}>{d.replace(/_/g, ' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">City</Label>
              <Input value={city} onChange={e => setCity(e.target.value)} placeholder="Colombo" className="h-9" maxLength={100} />
            </div>
          </div>
          {district && (
            <div className="text-xs text-muted-foreground bg-primary/10 p-2 rounded-lg">
              Province: {(DISTRICT_TO_PROVINCE[district] || '').replace(/_/g, ' ')}
            </div>
          )}
          <div className="space-y-1.5">
            <Label className="text-xs">Postal Code</Label>
            <Input value={pinCode} onChange={e => setPinCode(e.target.value)} placeholder="00100" className="h-9" maxLength={20} />
          </div>
          <div className="flex gap-3 mt-2">
            <Button variant="outline" className="h-11" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <Button className="flex-1 h-11" onClick={handleNext}>
              Continue <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      );
    }

    if (step === 'additional') {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-1 border-b border-border/50">
            <Globe className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm text-foreground">Additional Information</h3>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Description</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description of your institute..." className="min-h-[80px]" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Website URL</Label>
            <Input value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} placeholder="https://school.edu" className="h-9" maxLength={255} />
          </div>
          <div className="flex gap-3 mt-2">
            <Button variant="outline" className="h-11" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <Button className="flex-1 h-11" onClick={handleNext}>
              Review <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      );
    }

    if (step === 'review') {
      return (
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground text-base">Review — Institute Registration</h3>
          <div className="space-y-2 text-sm">
            {[
              ['Institute Name', name],
              ['Short Name', shortName],
              ['Email', email],
              ['System Contact Phone', systemContactPhone],
              ['System Contact Email', systemContactEmail],
              ['Phone', phone],
              ['Address', address],
              ['City', city],
              ['District', district?.replace(/_/g, ' ')],
              ['Province', district ? (DISTRICT_TO_PROVINCE[district] || '').replace(/_/g, ' ') : ''],
              ['Postal Code', pinCode],
              ['Website', websiteUrl],
              ['Description', description],
            ].filter(([, v]) => v).map(([label, value]) => (
              <div key={label} className="flex justify-between py-1.5 border-b border-border/50">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium text-foreground text-right max-w-[60%] truncate">{value}</span>
              </div>
            ))}
          </div>

          <div className="text-xs text-muted-foreground bg-primary/10 p-3 rounded-lg">
            By registering, you agree to the terms of service. Your institute code will be auto-generated upon successful registration.
          </div>

          {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</div>}

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 h-10" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <Button className="flex-1 h-10" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Registering...</> : 'Register Institute'}
            </Button>
          </div>
        </div>
      );
    }

    return null;
  };

  // ============= LAYOUT =============

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row overflow-x-hidden bg-background">
      {/* Top Illustration - Mobile Only */}
      <div className="block md:hidden w-full relative h-[18vh] shrink-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
        <img src={loginIllustration} alt="Registration" className="absolute inset-0 w-full h-full object-cover" loading="lazy" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
      </div>

      {/* Form Area */}
      <div className="w-full md:w-3/5 lg:w-1/2 flex flex-col items-center justify-start px-5 py-6 sm:p-7 md:p-10 bg-background -mt-8 md:mt-0 rounded-t-[3rem] md:rounded-none relative z-10 flex-1 md:min-h-screen overflow-y-auto">
        <div className="w-full max-w-md md:max-w-lg space-y-5">
          {/* Header */}
          <div className="text-center space-y-1">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden">
                <img src={surakshaLogo} alt="SurakshaLMS" className="w-full h-full object-contain" loading="lazy" />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">Register Institute</h1>
          </div>

          {/* Step Indicator */}
          <StepIndicator steps={STEPS.map(s => s.label)} current={currentStepIdx} />

          {/* Card */}
          <Card className="border-border/50 shadow-md">
            <CardContent className="p-5 md:p-8">
              {renderContent()}
            </CardContent>
          </Card>

          {/* Back to Login link */}
          {step === 'basic' && (
            <div className="text-center">
              <Button variant="link" onClick={onBack} className="text-sm text-muted-foreground">
                Already have an account? Go to Login
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Illustration (Desktop) */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 relative min-h-[300px] md:min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5" />
        <img src={loginIllustration} alt="Registration illustration" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply" loading="lazy" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
      </div>
    </div>
  );
};

export default InstituteRegistration;
