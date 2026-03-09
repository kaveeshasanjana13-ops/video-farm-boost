import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft, ChevronRight, Loader2, CheckCircle2, Check,
  Users, GraduationCap, Shield, UserPlus, SkipForward, X,
} from 'lucide-react';
import surakshaLogo from '@/assets/suraksha-logo.png';
import loginIllustration from '@/assets/login-illustration.png';
import { useToast } from '@/hooks/use-toast';
import {
  registerUser,
  DISTRICT_TO_PROVINCE,
  type CreateUserRequest,
  type Gender,
} from '@/api/registration.api';
import OtpVerificationStep from '@/components/registration/OtpVerificationStep';
import PersonForm, { type PersonFormData, emptyPersonForm } from '@/components/registration/PersonForm';
import StudentForm, { type StudentFormData, emptyStudentForm } from '@/components/registration/StudentForm';

// ============= TYPES =============

type AccountType = 'student-with-parent' | 'teacher' | 'institute-admin';
type ParentRole = 'father' | 'mother' | 'guardian';

interface ParentEntry {
  role: ParentRole;
  skipped: boolean;
  skipReason: string;
  verified: boolean;
  email: string;
  phone: string;
  formData: PersonFormData;
  formSection: 'personal' | 'address' | 'parent-extra';
  registeredId?: string;
}

type FlowStep =
  | 'select-type'
  | 'parent-overview'
  | `parent-verify-${ParentRole}`
  | `parent-form-${ParentRole}-${'personal' | 'address' | 'parent-extra'}`
  | `parent-skip-${ParentRole}`
  | 'student-verify'
  | 'student-personal'
  | 'student-address'
  | 'student-info'
  | 'simple-verify'
  | 'simple-personal'
  | 'simple-address'
  | 'review'
  | 'submitting'
  | 'success';

interface RegistrationProps {
  onBack: () => void;
  onComplete: () => void;
}

// Step indicator
const StepIndicator: React.FC<{ steps: string[]; current: number }> = ({ steps, current }) => (
  <div className="flex items-center justify-center gap-0 w-full max-w-sm mx-auto">
    {steps.map((label, i) => (
      <React.Fragment key={i}>
        <div className="flex flex-col items-center gap-1">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-colors ${
            i < current ? 'bg-primary border-primary text-primary-foreground'
              : i === current ? 'bg-primary border-primary text-primary-foreground'
              : 'bg-background border-muted-foreground/30 text-muted-foreground'
          }`}>
            {i < current ? <Check className="h-3.5 w-3.5" /> : i + 1}
          </div>
          <span className={`text-[10px] font-medium whitespace-nowrap ${i <= current ? 'text-primary' : 'text-muted-foreground'}`}>
            {label}
          </span>
        </div>
        {i < steps.length - 1 && (
          <div className={`flex-1 h-0.5 mx-1 mt-[-16px] min-w-[20px] ${i < current ? 'bg-primary' : 'bg-muted-foreground/20'}`} />
        )}
      </React.Fragment>
    ))}
  </div>
);

// ============= MAIN COMPONENT =============

const Registration: React.FC<RegistrationProps> = ({ onBack, onComplete }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [flowStep, setFlowStep] = useState<FlowStep>('select-type');
  const [accountType, setAccountType] = useState<AccountType>('student-with-parent');

  // Parent entries for student-with-parent flow
  const [parents, setParents] = useState<ParentEntry[]>([
    { role: 'father', skipped: false, skipReason: '', verified: false, email: '', phone: '', formData: emptyPersonForm(), formSection: 'personal' },
    { role: 'mother', skipped: false, skipReason: '', verified: false, email: '', phone: '', formData: emptyPersonForm(), formSection: 'personal' },
    { role: 'guardian', skipped: false, skipReason: '', verified: false, email: '', phone: '', formData: emptyPersonForm(), formSection: 'personal' },
  ]);

  // Student form data
  const [studentVerified, setStudentVerified] = useState(false);
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentPersonal, setStudentPersonal] = useState<PersonFormData>(emptyPersonForm());
  const [studentInfo, setStudentInfo] = useState<StudentFormData>(emptyStudentForm());

  // Simple flow (teacher/admin)
  const [simpleVerified, setSimpleVerified] = useState(false);
  const [simpleEmail, setSimpleEmail] = useState('');
  const [simplePhone, setSimplePhone] = useState('');
  const [simplePersonal, setSimplePersonal] = useState<PersonFormData>(emptyPersonForm());

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ============= URL SYNC =============

  useEffect(() => {
    const routeMap: Record<string, string> = {
      'select-type': '/register/step1',
      'parent-overview': '/register/parents',
      'student-verify': '/register/verify',
      'student-personal': '/register/student',
      'student-address': '/register/student',
      'student-info': '/register/student',
      'simple-verify': '/register/verify',
      'simple-personal': '/register/details/personal-information',
      'simple-address': '/register/details/address',
      'review': '/register/review',
      'success': '/register/review',
    };

    // Handle dynamic parent steps
    let route = routeMap[flowStep];
    if (!route) {
      if (flowStep.startsWith('parent-verify-') || flowStep.startsWith('parent-skip-')) {
        route = '/register/verify';
      } else if (flowStep.startsWith('parent-form-')) {
        const match = flowStep.match(/-(personal|address|parent-extra)$/);
        if (match) {
          route = match[1] === 'personal' ? '/register/details/personal-information'
            : match[1] === 'address' ? '/register/details/address'
            : '/register/details/additional';
        }
      }
    }

    if (route) {
      navigate(route, { replace: true });
    }
  }, [flowStep, navigate]);

  // ============= HELPERS =============

  const updateParent = (role: ParentRole, updates: Partial<ParentEntry>) => {
    setParents(prev => prev.map(p => p.role === role ? { ...p, ...updates } : p));
  };

  const getParent = (role: ParentRole) => parents.find(p => p.role === role)!;

  const hasAtLeastOneParent = () => parents.some(p => !p.skipped && p.verified);
  const allParentsHandled = () => parents.every(p => p.skipped || p.registeredId);

  const parentRoles: ParentRole[] = ['father', 'mother', 'guardian'];
  const parentLabels: Record<ParentRole, string> = { father: 'Father', mother: 'Mother', guardian: 'Guardian' };

  // ============= STEP INDICATOR LOGIC =============

  const getStepInfo = (): { steps: string[]; current: number } => {
    if (accountType === 'student-with-parent') {
      const steps = ['Type', 'Parents', 'Student', 'Review'];
      if (flowStep === 'select-type') return { steps, current: 0 };
      if (flowStep === 'parent-overview' || flowStep.startsWith('parent-')) return { steps, current: 1 };
      if (flowStep.startsWith('student-')) return { steps, current: 2 };
      return { steps, current: 3 };
    }
    const steps = ['Type', 'Verify', 'Details', 'Review'];
    if (flowStep === 'select-type') return { steps, current: 0 };
    if (flowStep === 'simple-verify') return { steps, current: 1 };
    if (flowStep === 'simple-personal' || flowStep === 'simple-address') return { steps, current: 2 };
    return { steps, current: 3 };
  };

  // ============= PARENT FLOW NAVIGATION =============

  const nextParentFormSection = (role: ParentRole, currentSection: 'personal' | 'address' | 'parent-extra'): FlowStep | null => {
    if (currentSection === 'personal') return `parent-form-${role}-address`;
    if (currentSection === 'address') return `parent-form-${role}-parent-extra`;
    return null; // done with this parent
  };

  const getNextParentStep = (currentRole: ParentRole): FlowStep => {
    const idx = parentRoles.indexOf(currentRole);
    if (idx < parentRoles.length - 1) {
      const nextRole = parentRoles[idx + 1];
      return `parent-verify-${nextRole}`;
    }
    // All parents done, go to student
    return 'student-verify';
  };

  const finishParentForm = (role: ParentRole) => {
    // Register this parent, then move to next
    registerParent(role);
  };

  // ============= API: Register Parent =============

  const registerParent = async (role: ParentRole) => {
    const parent = getParent(role);
    const fd = parent.formData;
    setIsLoading(true);
    setError('');

    const province = DISTRICT_TO_PROVINCE[fd.district] || '';
    const payload: CreateUserRequest = {
      firstName: fd.firstName,
      lastName: fd.lastName,
      nameWithInitials: fd.nameWithInitials || undefined,
      email: parent.email,
      userType: 'USER_WITHOUT_STUDENT',
      gender: (fd.gender || 'OTHER') as Gender,
      district: fd.district,
      province,
      country: 'Sri Lanka',
      phoneNumber: parent.phone || undefined,
      dateOfBirth: fd.dateOfBirth || undefined,
      nic: fd.nic || undefined,
      addressLine1: fd.addressLine1 || undefined,
      city: fd.city || undefined,
      postalCode: fd.postalCode || undefined,
      language: fd.language,
      parentData: {
        occupation: fd.occupation || undefined,
        workplace: fd.workplace || undefined,
        workPhone: fd.workPhone || undefined,
        educationLevel: fd.educationLevel || undefined,
      },
    };

    try {
      const result = await registerUser(payload);
      updateParent(role, { registeredId: result.user.id });
      toast({ title: `${parentLabels[role]} Registered`, description: `${fd.firstName} has been registered successfully.` });
      setFlowStep(getNextParentStep(role));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      toast({ title: 'Registration Failed', description: err instanceof Error ? err.message : 'Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  // ============= API: Register Student =============

  const registerStudent = async () => {
    setIsLoading(true);
    setError('');

    const fd = studentPersonal;
    const province = DISTRICT_TO_PROVINCE[fd.district] || '';
    const father = getParent('father');
    const mother = getParent('mother');
    const guardian = getParent('guardian');

    const payload: CreateUserRequest = {
      firstName: fd.firstName,
      lastName: fd.lastName,
      nameWithInitials: fd.nameWithInitials || undefined,
      email: studentEmail,
      userType: 'USER',
      gender: (fd.gender || 'OTHER') as Gender,
      district: fd.district,
      province,
      country: 'Sri Lanka',
      phoneNumber: studentPhone || undefined,
      dateOfBirth: fd.dateOfBirth || undefined,
      nic: fd.nic || undefined,
      addressLine1: fd.addressLine1 || undefined,
      city: fd.city || undefined,
      postalCode: fd.postalCode || undefined,
      language: fd.language,
      studentData: {
        emergencyContact: studentInfo.emergencyContact || undefined,
        bloodGroup: studentInfo.bloodGroup || undefined,
        medicalConditions: studentInfo.medicalConditions || undefined,
        allergies: studentInfo.allergies || undefined,
        fatherId: father.registeredId || undefined,
        fatherPhoneNumber: father.phone || undefined,
        motherId: mother.registeredId || undefined,
        motherPhoneNumber: mother.phone || undefined,
        guardianId: guardian.registeredId || undefined,
        guardianPhoneNumber: guardian.phone || undefined,
        fatherSkipReason: father.skipped ? father.skipReason : undefined,
        motherSkipReason: mother.skipped ? mother.skipReason : undefined,
        guardianSkipReason: guardian.skipped ? guardian.skipReason : undefined,
      },
    };

    if (fd.instituteCode) {
      payload.institute = { instituteCode: fd.instituteCode };
    }

    try {
      const result = await registerUser(payload);
      toast({ title: 'Account Created!', description: `Welcome ${result.user.firstName}!` });
      setFlowStep('success');
      setTimeout(() => onComplete(), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      toast({ title: 'Registration Failed', description: err instanceof Error ? err.message : 'Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  // ============= API: Register Teacher/Admin =============

  const registerSimple = async () => {
    setIsLoading(true);
    setError('');

    const fd = simplePersonal;
    const province = DISTRICT_TO_PROVINCE[fd.district] || '';
    const payload: CreateUserRequest = {
      firstName: fd.firstName,
      lastName: fd.lastName,
      nameWithInitials: fd.nameWithInitials || undefined,
      email: simpleEmail,
      userType: 'USER_WITHOUT_STUDENT',
      gender: (fd.gender || 'OTHER') as Gender,
      district: fd.district,
      province,
      country: 'Sri Lanka',
      phoneNumber: simplePhone || undefined,
      dateOfBirth: fd.dateOfBirth || undefined,
      nic: fd.nic || undefined,
      addressLine1: fd.addressLine1 || undefined,
      city: fd.city || undefined,
      postalCode: fd.postalCode || undefined,
      language: fd.language,
    };

    if (fd.instituteCode) {
      payload.institute = { instituteCode: fd.instituteCode };
    }

    try {
      const result = await registerUser(payload);
      toast({ title: 'Account Created!', description: `Welcome ${result.user.firstName}!` });
      setFlowStep('success');
      setTimeout(() => onComplete(), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      toast({ title: 'Registration Failed', description: err instanceof Error ? err.message : 'Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  // ============= VALIDATION =============

  const isPersonalValid = (d: PersonFormData) => !!d.firstName && !!d.lastName && !!d.nameWithInitials && !!d.gender;
  const isAddressValid = (d: PersonFormData) => !!d.district;

  // ============= BACK NAVIGATION =============

  const handleBack = () => {
    switch (flowStep) {
      case 'select-type': onBack(); break;

      // Student-with-parent flow
      case 'parent-overview': setFlowStep('select-type'); break;
      case 'parent-verify-father': setFlowStep('parent-overview'); break;
      case 'parent-skip-father': setFlowStep('parent-overview'); break;
      case 'parent-form-father-personal': setFlowStep(`parent-verify-father`); break;
      case 'parent-form-father-address': setFlowStep(`parent-form-father-personal`); break;
      case 'parent-form-father-parent-extra': setFlowStep(`parent-form-father-address`); break;

      case 'parent-verify-mother': {
        const f = getParent('father');
        setFlowStep(f.skipped ? 'parent-overview' : (f.registeredId ? 'parent-overview' : 'parent-verify-father'));
        break;
      }
      case 'parent-skip-mother': setFlowStep('parent-verify-mother'); break;
      case 'parent-form-mother-personal': setFlowStep('parent-verify-mother'); break;
      case 'parent-form-mother-address': setFlowStep('parent-form-mother-personal'); break;
      case 'parent-form-mother-parent-extra': setFlowStep('parent-form-mother-address'); break;

      case 'parent-verify-guardian': {
        const m = getParent('mother');
        setFlowStep(m.skipped ? 'parent-verify-mother' : (m.registeredId ? 'parent-verify-mother' : 'parent-verify-mother'));
        break;
      }
      case 'parent-skip-guardian': setFlowStep('parent-verify-guardian'); break;
      case 'parent-form-guardian-personal': setFlowStep('parent-verify-guardian'); break;
      case 'parent-form-guardian-address': setFlowStep('parent-form-guardian-personal'); break;
      case 'parent-form-guardian-parent-extra': setFlowStep('parent-form-guardian-address'); break;

      case 'student-verify': setFlowStep('parent-overview'); break;
      case 'student-personal': setFlowStep('student-verify'); break;
      case 'student-address': setFlowStep('student-personal'); break;
      case 'student-info': setFlowStep('student-address'); break;

      // Simple flow
      case 'simple-verify': setFlowStep('select-type'); break;
      case 'simple-personal': setFlowStep('simple-verify'); break;
      case 'simple-address': setFlowStep('simple-personal'); break;

      case 'review': {
        if (accountType === 'student-with-parent') setFlowStep('student-info');
        else setFlowStep('simple-address');
        break;
      }
      default: setFlowStep('select-type');
    }
  };

  // ============= SUCCESS SCREEN =============

  if (flowStep === 'success') {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background p-5">
        <Card className="w-full max-w-md border-border/50 shadow-lg">
          <CardContent className="p-8 text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 text-primary mx-auto" />
            <h2 className="text-2xl font-bold text-foreground">Account Created!</h2>
            <p className="text-muted-foreground">
              Your account has been created successfully. You can now activate your account using the "Activate your account" option on the login page.
            </p>
            <Button onClick={onComplete} className="w-full h-11">Go to Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { steps: stepLabels, current: currentStepIdx } = getStepInfo();

  // ============= RENDER FLOW CONTENT =============

  const renderContent = () => {
    // ---- SELECT TYPE ----
    if (flowStep === 'select-type') {
      return (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Select the type of account you want to create:</p>
          {([
            { value: 'student-with-parent' as AccountType, label: 'Student with Parent', desc: 'Register student with father/mother/guardian accounts', icon: GraduationCap },
            { value: 'teacher' as AccountType, label: 'Teacher', desc: 'Register as a teacher', icon: Users },
            { value: 'institute-admin' as AccountType, label: 'Institute Admin', desc: 'Register as an institute administrator', icon: Shield },
          ]).map(opt => (
            <button
              key={opt.value}
              onClick={() => setAccountType(opt.value)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                accountType === opt.value
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border hover:border-primary/40'
              }`}
            >
              <opt.icon className={`h-6 w-6 shrink-0 ${accountType === opt.value ? 'text-primary' : 'text-muted-foreground'}`} />
              <div className="flex-1">
                <div className="font-medium text-foreground">{opt.label}</div>
                <div className="text-xs text-muted-foreground">{opt.desc}</div>
              </div>
              {accountType === opt.value && <ChevronRight className="h-5 w-5 text-primary" />}
            </button>
          ))}
          <div className="flex gap-3 mt-2">
            <Button variant="outline" className="h-11" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <Button
              className="flex-1 h-11"
              onClick={() => {
                if (accountType === 'student-with-parent') setFlowStep('parent-overview');
                else setFlowStep('simple-verify');
              }}
            >
              Continue <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      );
    }

    // ---- PARENT OVERVIEW ----
    if (flowStep === 'parent-overview') {
      const anyCreated = parents.some(p => p.registeredId);
      const canGoToStudent = parents.some(p => p.registeredId) && parents.every(p => p.skipped || p.registeredId);

      return (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-foreground text-base">Parent / Guardian Registration</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Register at least one parent or guardian. You can skip the others with a reason.
            </p>
          </div>

          {parentRoles.map(role => {
            const p = getParent(role);
            return (
              <div
                key={role}
                className={`p-4 rounded-xl border-2 transition-all ${
                  p.registeredId ? 'border-green-500/50 bg-green-50/50 dark:bg-green-950/20'
                  : p.skipped ? 'border-muted bg-muted/30 opacity-60'
                  : 'border-border'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <UserPlus className={`h-5 w-5 ${p.registeredId ? 'text-green-500' : p.skipped ? 'text-muted-foreground' : 'text-primary'}`} />
                    <div>
                      <div className="font-medium text-foreground">{parentLabels[role]}</div>
                      {p.registeredId && <div className="text-xs text-green-600">{p.formData.firstName} {p.formData.lastName} — Registered ✓</div>}
                      {p.skipped && <div className="text-xs text-muted-foreground">Skipped: {p.skipReason}</div>}
                    </div>
                  </div>
                  {!p.registeredId && !p.skipped && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setFlowStep(`parent-skip-${role}`)}>
                        <SkipForward className="h-3 w-3 mr-1" /> Skip
                      </Button>
                      <Button size="sm" className="h-8 text-xs" onClick={() => setFlowStep(`parent-verify-${role}`)}>
                        <UserPlus className="h-3 w-3 mr-1" /> Create
                      </Button>
                    </div>
                  )}
                  {p.skipped && (
                    <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => updateParent(role, { skipped: false, skipReason: '' })}>
                      Undo
                    </Button>
                  )}
                </div>
              </div>
            );
          })}

          {!parents.some(p => p.registeredId) && parents.every(p => !p.skipped) && (
            <div className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg">
              You must register at least one parent/guardian before creating the student account.
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 h-11" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            {canGoToStudent && (
              <Button className="flex-1 h-11" onClick={() => setFlowStep('student-verify')}>
                Continue to Student <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      );
    }

    // ---- PARENT SKIP ----
    if (flowStep.startsWith('parent-skip-')) {
      const role = flowStep.replace('parent-skip-', '') as ParentRole;
      const parent = getParent(role);

      return (
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground text-base">Skip {parentLabels[role]}</h3>
          <p className="text-sm text-muted-foreground">Please provide a reason for skipping the {parentLabels[role].toLowerCase()} registration:</p>
          <div className="space-y-1.5">
            <Label className="text-xs">Reason *</Label>
            <Textarea
              value={parent.skipReason}
              onChange={e => updateParent(role, { skipReason: e.target.value })}
              placeholder={`Why is the ${parentLabels[role].toLowerCase()} not being registered?`}
              className="min-h-[80px]"
            />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 h-10" onClick={() => setFlowStep('parent-overview')}>
              <X className="h-4 w-4 mr-2" /> Cancel
            </Button>
            <Button
              className="flex-1 h-10"
              disabled={!parent.skipReason.trim()}
              onClick={() => {
                updateParent(role, { skipped: true });
                setFlowStep('parent-overview');
              }}
            >
              Confirm Skip
            </Button>
          </div>
        </div>
      );
    }

    // ---- PARENT VERIFY ----
    if (flowStep.startsWith('parent-verify-')) {
      const role = flowStep.replace('parent-verify-', '') as ParentRole;
      return (
        <OtpVerificationStep
          title={`Verify ${parentLabels[role]}'s Contact`}
          subtitle={`Verify the email for the ${parentLabels[role].toLowerCase()}.`}
          emailRequired={true}
          phoneRequired={false}
          showPhone={false}
          onBack={handleBack}
          onVerified={({ email, phone }) => {
            updateParent(role, {
              verified: true,
              email,
              phone,
              formData: { ...getParent(role).formData, email, phoneNumber: phone },
            });
            setFlowStep(`parent-form-${role}-personal`);
          }}
        />
      );
    }

    // ---- PARENT FORM ----
    if (flowStep.startsWith('parent-form-')) {
      const match = flowStep.match(/^parent-form-(father|mother|guardian)-(personal|address|parent-extra)$/);
      if (!match) return null;
      const role = match[1] as ParentRole;
      const section = match[2] as 'personal' | 'address' | 'parent-extra';
      const parent = getParent(role);

      const sectionLabel = section === 'personal' ? 'Personal Information' : section === 'address' ? 'Address Details' : 'Additional Details';

      const canNext = section === 'personal' ? isPersonalValid(parent.formData) : section === 'address' ? isAddressValid(parent.formData) : true;

      return (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-foreground text-base">{parentLabels[role]} — {sectionLabel}</h3>
            <div className="flex gap-1 mt-2">
              {['personal', 'address', 'parent-extra'].map((s, i) => (
                <div key={s} className={`h-1.5 flex-1 rounded-full ${
                  ['personal', 'address', 'parent-extra'].indexOf(section) >= i ? 'bg-primary' : 'bg-muted'
                }`} />
              ))}
            </div>
          </div>

          <PersonForm
            data={parent.formData}
            onChange={fd => updateParent(role, { formData: fd })}
            section={section}
            emailLocked={true}
            phoneLocked={!!parent.phone && parent.phone.replace(/\D/g, '').length > 2}
            showParentFields={true}
            showInstituteCode={false}
          />

          {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</div>}

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 h-10" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            {section === 'parent-extra' ? (
              <Button className="flex-1 h-10" onClick={() => finishParentForm(role)} disabled={isLoading}>
                {isLoading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Registering...</> : <>Register {parentLabels[role]} <ChevronRight className="h-4 w-4 ml-2" /></>}
              </Button>
            ) : (
              <Button className="flex-1 h-10" onClick={() => {
                const next = nextParentFormSection(role, section);
                if (next) setFlowStep(next);
              }} disabled={!canNext}>
                Next <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      );
    }

    // ---- STUDENT VERIFY ----
    if (flowStep === 'student-verify') {
      return (
        <OtpVerificationStep
          title="Verify Student's Contact"
          subtitle="Email is required. Phone number is optional."
          emailRequired={true}
          phoneRequired={false}
          showPhone={true}
          onBack={handleBack}
          onVerified={({ email, phone }) => {
            setStudentEmail(email);
            setStudentPhone(phone);
            setStudentVerified(true);
            setStudentPersonal(prev => ({ ...prev, email, phoneNumber: phone }));
            setFlowStep('student-personal');
          }}
        />
      );
    }

    // ---- STUDENT PERSONAL / ADDRESS / INFO ----
    if (flowStep === 'student-personal') {
      return (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-foreground text-base">Student — Personal Information</h3>
            <div className="flex gap-1 mt-2">
              {[0, 1, 2].map(i => (
                <div key={i} className={`h-1.5 flex-1 rounded-full ${i === 0 ? 'bg-primary' : 'bg-muted'}`} />
              ))}
            </div>
          </div>
          <PersonForm
            data={studentPersonal}
            onChange={setStudentPersonal}
            section="personal"
            emailLocked={true}
            phoneLocked={!!studentPhone && studentPhone.replace(/\D/g, '').length > 2}
          />
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 h-10" onClick={handleBack}><ArrowLeft className="h-4 w-4 mr-2" /> Back</Button>
            <Button className="flex-1 h-10" onClick={() => setFlowStep('student-address')} disabled={!isPersonalValid(studentPersonal)}>
              Next <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      );
    }

    if (flowStep === 'student-address') {
      return (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-foreground text-base">Student — Address Details</h3>
            <div className="flex gap-1 mt-2">
              {[0, 1, 2].map(i => (
                <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= 1 ? 'bg-primary' : 'bg-muted'}`} />
              ))}
            </div>
          </div>
          <PersonForm data={studentPersonal} onChange={setStudentPersonal} section="address" showInstituteCode={true} />
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 h-10" onClick={handleBack}><ArrowLeft className="h-4 w-4 mr-2" /> Back</Button>
            <Button className="flex-1 h-10" onClick={() => setFlowStep('student-info')} disabled={!isAddressValid(studentPersonal)}>
              Next <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      );
    }

    if (flowStep === 'student-info') {
      return (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-foreground text-base">Student — Additional Information</h3>
            <div className="flex gap-1 mt-2">
              {[0, 1, 2].map(i => (
                <div key={i} className={`h-1.5 flex-1 rounded-full bg-primary`} />
              ))}
            </div>
          </div>
          <StudentForm data={studentInfo} onChange={setStudentInfo} />
          {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</div>}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 h-10" onClick={handleBack}><ArrowLeft className="h-4 w-4 mr-2" /> Back</Button>
            <Button className="flex-1 h-10" onClick={() => setFlowStep('review')}>
              Review <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      );
    }

    // ---- SIMPLE VERIFY (Teacher/Admin) ----
    if (flowStep === 'simple-verify') {
      return (
        <OtpVerificationStep
          title={`Verify Your Contact — ${accountType === 'teacher' ? 'Teacher' : 'Institute Admin'}`}
          subtitle="Email is required."
          emailRequired={true}
          phoneRequired={false}
          showPhone={false}
          onBack={handleBack}
          onVerified={({ email, phone }) => {
            setSimpleEmail(email);
            setSimplePhone(phone);
            setSimpleVerified(true);
            setSimplePersonal(prev => ({ ...prev, email, phoneNumber: phone }));
            setFlowStep('simple-personal');
          }}
        />
      );
    }

    // ---- SIMPLE PERSONAL ----
    if (flowStep === 'simple-personal') {
      return (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-foreground text-base">
              {accountType === 'teacher' ? 'Teacher' : 'Institute Admin'} — Personal Information
            </h3>
            <div className="flex gap-1 mt-2">
              {[0, 1].map(i => (
                <div key={i} className={`h-1.5 flex-1 rounded-full ${i === 0 ? 'bg-primary' : 'bg-muted'}`} />
              ))}
            </div>
          </div>
          <PersonForm
            data={simplePersonal}
            onChange={setSimplePersonal}
            section="personal"
            emailLocked={true}
            phoneLocked={!!simplePhone && simplePhone.replace(/\D/g, '').length > 2}
          />
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 h-10" onClick={handleBack}><ArrowLeft className="h-4 w-4 mr-2" /> Back</Button>
            <Button className="flex-1 h-10" onClick={() => setFlowStep('simple-address')} disabled={!isPersonalValid(simplePersonal)}>
              Next <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      );
    }

    // ---- SIMPLE ADDRESS ----
    if (flowStep === 'simple-address') {
      return (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-foreground text-base">
              {accountType === 'teacher' ? 'Teacher' : 'Institute Admin'} — Address Details
            </h3>
            <div className="flex gap-1 mt-2">
              {[0, 1].map(i => (
                <div key={i} className={`h-1.5 flex-1 rounded-full bg-primary`} />
              ))}
            </div>
          </div>
          <PersonForm data={simplePersonal} onChange={setSimplePersonal} section="address" showInstituteCode={true} />
          {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</div>}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 h-10" onClick={handleBack}><ArrowLeft className="h-4 w-4 mr-2" /> Back</Button>
            <Button className="flex-1 h-10" onClick={() => setFlowStep('review')} disabled={!isAddressValid(simplePersonal)}>
              Review <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      );
    }

    // ---- REVIEW ----
    if (flowStep === 'review') {
      if (accountType === 'student-with-parent') {
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground text-base">Review Registration</h3>

            {/* Parents summary */}
            {parentRoles.map(role => {
              const p = getParent(role);
              if (p.skipped) return (
                <div key={role} className="p-3 rounded-lg bg-muted/50 border border-border/50">
                  <div className="text-sm font-medium text-muted-foreground">{parentLabels[role]} — Skipped</div>
                  <div className="text-xs text-muted-foreground">{p.skipReason}</div>
                </div>
              );
              if (!p.registeredId) return null;
              return (
                <div key={role} className="p-3 rounded-lg bg-green-50/50 dark:bg-green-950/20 border border-green-500/30">
                  <div className="text-sm font-medium text-foreground flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    {parentLabels[role]} — {p.formData.firstName} {p.formData.lastName}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{p.email}</div>
                </div>
              );
            })}

            {/* Student summary */}
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/30">
              <div className="text-sm font-medium text-foreground">Student</div>
              <div className="space-y-1 mt-2 text-sm">
                {[
                  ['Name', `${studentPersonal.firstName} ${studentPersonal.lastName}`],
                  ['Email', studentEmail],
                  ['Phone', studentPhone],
                  ['Gender', studentPersonal.gender],
                  ['District', studentPersonal.district?.replace(/_/g, ' ')],
                ].filter(([, v]) => v).map(([label, value]) => (
                  <div key={label} className="flex justify-between py-1 border-b border-border/30">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-xs text-muted-foreground bg-primary/10 p-3 rounded-lg">
              By creating an account, you agree to the terms of service. After registration, you'll need to activate your account.
            </div>

            {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</div>}

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 h-10" onClick={handleBack}><ArrowLeft className="h-4 w-4 mr-2" /> Back</Button>
              <Button className="flex-1 h-10" onClick={registerStudent} disabled={isLoading}>
                {isLoading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating...</> : 'Create Student Account'}
              </Button>
            </div>
          </div>
        );
      }

      // Teacher / Admin review
      return (
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground text-base">Review — {accountType === 'teacher' ? 'Teacher' : 'Institute Admin'}</h3>
          <div className="space-y-2 text-sm">
            {[
              ['Name', `${simplePersonal.firstName} ${simplePersonal.lastName}`],
              ['Email', simpleEmail],
              ['Phone', simplePhone],
              ['Gender', simplePersonal.gender],
              ['District', simplePersonal.district?.replace(/_/g, ' ')],
              ...(simplePersonal.instituteCode ? [['Institute Code', simplePersonal.instituteCode]] : []),
            ].filter(([, v]) => v).map(([label, value]) => (
              <div key={label} className="flex justify-between py-1.5 border-b border-border/50">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium text-foreground">{value}</span>
              </div>
            ))}
          </div>

          <div className="text-xs text-muted-foreground bg-primary/10 p-3 rounded-lg">
            By creating an account, you agree to the terms of service. After registration, you'll need to activate your account.
          </div>

          {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</div>}

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 h-10" onClick={handleBack}><ArrowLeft className="h-4 w-4 mr-2" /> Back</Button>
            <Button className="flex-1 h-10" onClick={registerSimple} disabled={isLoading}>
              {isLoading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating...</> : 'Create Account'}
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
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">Create Account</h1>
          </div>

          {/* Step Indicator */}
          <StepIndicator steps={stepLabels} current={currentStepIdx} />

          {/* Card */}
          <Card className="border-border/50 shadow-md">
            <CardContent className="p-5 md:p-8">
              {renderContent()}
            </CardContent>
          </Card>

          {/* Back to Login link */}
          {flowStep === 'select-type' && (
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

export default Registration;
