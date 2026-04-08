import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { enrollmentApi, ApiError, SelfEnrollResponse } from '@/api/enrollment.api';
import { Loader2, Key, CheckCircle, Gift, CreditCard, AlertTriangle } from 'lucide-react';

interface SelfEnrollFormData {
  enrollmentKey: string;
}

const SelfEnrollmentForm = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [enrollmentResult, setEnrollmentResult] = useState<SelfEnrollResponse | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimDone, setClaimDone] = useState(false);
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<SelfEnrollFormData>();

  const onSubmit = async (data: SelfEnrollFormData) => {
    setIsLoading(true);
    setEnrollmentResult(null);
    
    try {
      const result = await enrollmentApi.selfEnroll(data.enrollmentKey);
      setEnrollmentResult(result);
      
      // Show alert for teacher verification if needed
      if (result.message && result.message.toLowerCase().includes('verification')) {
        toast({
          title: "Waiting for Teacher Verification",
          description: result.message,
        });
      } else {
        toast({
          title: "Enrollment Successful",
          description: result.message,
        });
      }
      reset();
    } catch (error: any) {
      handleEnrollmentError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnrollmentError = (error: any) => {
    console.error('Enrollment error:', error);
    // Show teacher verification message instead of error
    toast({
      title: "Waiting for Teacher Verification",
      description: "Your enrollment request has been submitted and is waiting for teacher verification.",
    });
  };

  const handleEnrollAnother = () => {
    setEnrollmentResult(null);
    setClaimDone(false);
  };

  const handleClaimFreeCard = async () => {
    if (!enrollmentResult) return;
    setIsClaiming(true);
    try {
      await enrollmentApi.claimFreeCard(
        enrollmentResult.instituteId,
        enrollmentResult.classId,
        enrollmentResult.subjectId,
        { userId: user?.id }
      );
      setClaimDone(true);
      toast({
        title: 'Free Card Verified',
        description: 'You are now fully enrolled. No payment required.',
      });
    } catch (error: any) {
      toast({
        title: 'Free Card Claim Failed',
        description: error.message || 'Could not claim free card. Please contact your teacher.',
        variant: 'destructive',
      });
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Subject Enrollment
          </CardTitle>
          <CardDescription>
            Enter an enrollment key provided by your teacher to enroll in a subject
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!enrollmentResult ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="enrollmentKey">Enrollment Key</Label>
                <Input
                  id="enrollmentKey"
                  type="text"
                  placeholder="Enter enrollment key (e.g., MATH-ABC123)"
                  {...register('enrollmentKey', {
                    required: 'Enrollment key is required',
                    minLength: { 
                      value: 5, 
                      message: 'Key must be at least 5 characters' 
                    },
                    maxLength: { 
                      value: 50, 
                      message: 'Key must not exceed 50 characters' 
                    },
                    pattern: {
                      value: /^[A-Z0-9-]+$/,
                      message: 'Key should contain only uppercase letters, numbers, and hyphens'
                    }
                  })}
                  disabled={isLoading}
                />
                {errors.enrollmentKey && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      {errors.enrollmentKey.message}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enrolling...
                  </>
                ) : (
                  <>
                    <Key className="h-4 w-4 mr-2" />
                    Enroll in Subject
                  </>
                )}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              {claimDone ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="font-medium text-green-700">
                    Free card verified — you are fully enrolled!
                  </AlertDescription>
                </Alert>
              ) : enrollmentResult.studentType === 'free_card' ? (
                <Alert variant="success">
                  <Gift className="h-4 w-4" />
                  <AlertDescription className="font-medium text-green-700">
                    Enrolled Free! Your teacher pre-approved you — no payment required.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="success">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="font-medium">
                    {enrollmentResult.verificationStatus === 'pending_payment'
                      ? 'Enrolled — payment verification pending'
                      : 'Enrollment Successful!'}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2 p-4 bg-muted rounded-lg">
                <div className="flex justify-between">
                  <span className="font-medium">Subject:</span>
                  <span>{enrollmentResult.subjectName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Class:</span>
                  <span>{enrollmentResult.className}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Status:</span>
                  <Badge variant="outline" className={
                    claimDone || enrollmentResult.studentType === 'free_card'
                      ? 'text-green-600 border-green-300'
                      : enrollmentResult.studentType === 'half_paid'
                        ? 'text-amber-600 border-amber-300'
                        : enrollmentResult.studentType === 'quarter_paid'
                          ? 'text-sky-600 border-sky-300'
                          : enrollmentResult.verificationStatus === 'pending_payment'
                            ? 'text-orange-600 border-orange-300'
                            : 'text-green-600 border-green-300'
                  }>
                    {claimDone || enrollmentResult.studentType === 'free_card'
                      ? 'Enrolled Free'
                      : enrollmentResult.studentType === 'half_paid'
                        ? 'Half Paid'
                        : enrollmentResult.studentType === 'quarter_paid'
                          ? 'Quarter Paid'
                          : enrollmentResult.verificationStatus.replace(/_/g, ' ')}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Enrolled At:</span>
                  <span>{new Date(enrollmentResult.enrolledAt).toLocaleString()}</span>
                </div>
                {enrollmentResult.paymentRequired && enrollmentResult.feeAmount && !claimDone && (
                  <div className="flex justify-between">
                    <span className="font-medium">Fee Required:</span>
                    <span className="text-orange-600 font-semibold">Rs. {enrollmentResult.feeAmount.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Payment required — offer free card claim (only when not pre-approved) */}
              {enrollmentResult.verificationStatus === 'pending_payment' && enrollmentResult.studentType !== 'free_card' && !claimDone && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800 p-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Payment Required</p>
                      <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                        Upload a payment slip through the payments section, or claim a free card if your teacher has approved you for fee waiver.
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-purple-300 text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950 gap-2"
                    onClick={handleClaimFreeCard}
                    disabled={isClaiming}
                  >
                    {isClaiming ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Gift className="h-4 w-4" />
                    )}
                    {isClaiming ? 'Claiming...' : 'Claim Free Card (Fee Waiver)'}
                  </Button>
                </div>
              )}

              {claimDone && (
                <div className="rounded-lg border border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800 p-3">
                  <p className="text-xs text-green-700 dark:text-green-300 flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                    You are now fully enrolled and can attend classes in this subject.
                  </p>
                </div>
              )}

              <Button onClick={handleEnrollAnother} variant="outline" className="w-full">
                Enroll in Another Subject
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SelfEnrollmentForm;