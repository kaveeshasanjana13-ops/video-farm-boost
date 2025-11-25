import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ValidatedInput } from "@/components/ValidatedInput";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PhoneInput } from "@/components/ui/phone-input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { requestPhoneOTP, verifyPhoneOTP, requestEmailOTP, verifyEmailOTP } from "@/lib/api";
import { toast } from "sonner";

interface ParentExistsFormProps {
  parentType: "Father" | "Mother" | "Guardian";
  onExistingParent: (id: string, phoneNumber: string) => void;
  onNewParent: (phoneNumber: string, email: string) => void;
  onSkip?: () => void;
  canSkip?: boolean;
  isStudentForm?: boolean;
}

export const ParentExistsForm = ({
  parentType,
  onExistingParent,
  onNewParent,
  onSkip,
  canSkip = true,
  isStudentForm = false,
}: ParentExistsFormProps) => {
  const [exists, setExists] = useState<string>("");
  const [parentId, setParentId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [skipChecked, setSkipChecked] = useState(false);
  
  // OTP states
  const [phoneOTPSent, setPhoneOTPSent] = useState(false);
  const [phoneOTPCode, setPhoneOTPCode] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [sendingPhoneOTP, setSendingPhoneOTP] = useState(false);
  const [verifyingPhoneOTP, setVerifyingPhoneOTP] = useState(false);
  
  const [emailOTPSent, setEmailOTPSent] = useState(false);
  const [emailOTPCode, setEmailOTPCode] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [sendingEmailOTP, setSendingEmailOTP] = useState(false);
  const [verifyingEmailOTP, setVerifyingEmailOTP] = useState(false);
  
  // Error dialog states
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorUserId, setErrorUserId] = useState("");

  const handleSendPhoneOTP = async () => {
    if (!phoneNumber) {
      toast.error("Please enter a phone number");
      return;
    }
    
    setSendingPhoneOTP(true);
    try {
      const response = await requestPhoneOTP(phoneNumber);
      toast.success(response.message);
      setPhoneOTPSent(true);
    } catch (error: any) {
      const message = error?.message || "Failed to send OTP";
      
      // Handle 409 conflict - phone already registered
      if (error?.statusCode === 409) {
        // Always show dialog for 409 errors
        setErrorMessage(message);
        setErrorUserId(error?.userId || '');
        setShowErrorDialog(true);
      } else {
        toast.error(message);
      }
    } finally {
      setSendingPhoneOTP(false);
    }
  };

  const handleVerifyPhoneOTP = async () => {
    if (phoneOTPCode.length !== 6) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }
    
    setVerifyingPhoneOTP(true);
    try {
      const response = await verifyPhoneOTP(phoneNumber, phoneOTPCode);
      toast.success(response.message);
      setPhoneVerified(true);
    } catch (error) {
      toast.error("Invalid OTP code");
    } finally {
      setVerifyingPhoneOTP(false);
    }
  };

  const handleSendEmailOTP = async () => {
    if (!email) {
      toast.error("Please enter an email");
      return;
    }
    
    setSendingEmailOTP(true);
    try {
      const response = await requestEmailOTP(email);
      toast.success(response.message);
      setEmailOTPSent(true);
    } catch (error: any) {
      const message = error?.message || "Failed to send OTP";
      
      // Handle 409 conflict - email already registered
      if (error?.statusCode === 409) {
        // Always show dialog for 409 errors
        setErrorMessage(message);
        setErrorUserId(error?.userId || '');
        setShowErrorDialog(true);
      } else {
        toast.error(message);
      }
    } finally {
      setSendingEmailOTP(false);
    }
  };
  
  const handleUseExistingUser = () => {
    setExists("yes");
    setParentId(errorUserId);
    setPhoneNumber("");
    setEmail("");
    setPhoneOTPSent(false);
    setPhoneOTPCode("");
    setPhoneVerified(false);
    setEmailOTPSent(false);
    setEmailOTPCode("");
    setEmailVerified(false);
    setShowErrorDialog(false);
    setErrorMessage("");
    setErrorUserId("");
  };

  const handleVerifyEmailOTP = async () => {
    if (emailOTPCode.length !== 6) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }
    
    setVerifyingEmailOTP(true);
    try {
      const response = await verifyEmailOTP(email, emailOTPCode);
      toast.success(response.message);
      setEmailVerified(true);
    } catch (error) {
      toast.error("Invalid OTP code");
    } finally {
      setVerifyingEmailOTP(false);
    }
  };

  const handleSave = () => {
    if (exists === "yes" && parentId) {
      onExistingParent(parentId, "");
      // Reset form
      setParentId("");
      setExists("");
    } else if (exists === "no") {
      // Validate based on form type
      if (!isStudentForm && !phoneNumber) {
        toast.error("Phone number is required for parents");
        return;
      }
      if (!email) {
        toast.error("Email is required");
        return;
      }
      if (phoneNumber && !phoneVerified) {
        toast.error("Please verify phone number with OTP");
        return;
      }
      if (email && !emailVerified) {
        toast.error("Please verify email with OTP");
        return;
      }
      onNewParent(phoneNumber, email);
      // Reset form
      setPhoneNumber("");
      setEmail("");
      setExists("");
      setPhoneOTPSent(false);
      setPhoneOTPCode("");
      setPhoneVerified(false);
      setEmailOTPSent(false);
      setEmailOTPCode("");
      setEmailVerified(false);
    }
  };

  return (
    <>
      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Already Registered</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2">
                <div>{errorMessage}</div>
                {errorUserId && errorUserId !== '' && (
                  <div className="font-semibold text-foreground">User ID: {errorUserId}</div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            {errorUserId && errorUserId !== '' && (
              <AlertDialogAction onClick={handleUseExistingUser}>
                Use Now
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 bg-muted/50 rounded-lg border">
      <div>
        <h3 className="text-base sm:text-lg font-semibold mb-2">Is {parentType} Already Registered?</h3>
        <p className="text-xs sm:text-sm text-muted-foreground">Select an option to continue</p>
      </div>
      
      {onSkip && canSkip && (
        <div className="flex items-start space-x-2 p-3 bg-background rounded-md border">
          <Checkbox 
            id={`${parentType}-skip`}
            checked={skipChecked}
            onCheckedChange={(checked) => setSkipChecked(checked as boolean)}
          />
          <div className="flex-1">
            <Label htmlFor={`${parentType}-skip`} className="font-normal cursor-pointer text-sm">
              I don't need to enter {parentType.toLowerCase()} details
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              Skip this section and continue to the next step
            </p>
          </div>
        </div>
      )}
      
      {skipChecked && onSkip && canSkip ? (
        <Button 
          onClick={onSkip} 
          className="w-full"
          size="lg"
        >
          Skip {parentType}
        </Button>
      ) : (
        <>
          <RadioGroup value={exists} onValueChange={setExists} disabled={skipChecked}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id={`${parentType}-yes`} disabled={skipChecked} />
              <Label htmlFor={`${parentType}-yes`} className="font-normal cursor-pointer text-sm sm:text-base">
                Yes, {parentType.toLowerCase()} is already registered
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id={`${parentType}-no`} disabled={skipChecked} />
              <Label htmlFor={`${parentType}-no`} className="font-normal cursor-pointer text-sm sm:text-base">
                No, create new {parentType.toLowerCase()} profile
              </Label>
            </div>
          </RadioGroup>

          {exists === "yes" && (
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor={`${parentType}-id`} className="text-sm sm:text-base">{parentType} ID</Label>
                <ValidatedInput
                  id={`${parentType}-id`}
                  type="number"
                  placeholder={`Enter ${parentType.toLowerCase()} ID`}
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  className="text-sm sm:text-base"
                  onKeyDown={(e) => {
                    if (e.key === '.' || e.key === '-' || e.key === 'e' || e.key === 'E') {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
              <Button 
                onClick={handleSave} 
                disabled={!parentId}
                className="w-full"
                size="lg"
              >
                Continue with Existing {parentType}
              </Button>
            </div>
          )}

          {exists === "no" && (
            <div className="space-y-4 pt-4 border-t">
              <p className="text-xs sm:text-sm text-muted-foreground">
                {isStudentForm 
                  ? "Email is required. Phone number is optional." 
                  : "Both phone number and email are required."}
              </p>
              <div className="space-y-2">
                <Label htmlFor={`${parentType}-new-phone`} className="text-sm sm:text-base">
                  Phone Number {isStudentForm ? "(Optional)" : "(Required)"}
                </Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <PhoneInput
                    id={`${parentType}-new-phone`}
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    disabled={phoneVerified}
                    className="flex-1"
                  />
                  {!phoneVerified && (
                  <Button
                    type="button"
                    onClick={handleSendPhoneOTP}
                    disabled={!phoneNumber || phoneNumber === '+94' || phoneNumber.replace(/\D/g, '').length < 11 || sendingPhoneOTP || phoneOTPSent}
                    variant="outline"
                    className="sm:w-auto w-full text-xs sm:text-sm"
                  >
                    {sendingPhoneOTP ? "Sending..." : phoneOTPSent ? "Sent" : "Send OTP"}
                  </Button>
                  )}
                  {phoneVerified && (
                    <Button type="button" disabled variant="outline" className="text-green-600 sm:w-auto w-full text-xs sm:text-sm">
                      Verified ✓
                    </Button>
                  )}
                </div>
                {phoneOTPSent && !phoneVerified && (
                  <div className="space-y-2">
                    <Label className="text-sm">Enter OTP</Label>
                    <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                      <InputOTP
                        maxLength={6}
                        value={phoneOTPCode}
                        onChange={setPhoneOTPCode}
                        className="flex-1"
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                      <Button
                        type="button"
                        onClick={handleVerifyPhoneOTP}
                        disabled={phoneOTPCode.length !== 6 || verifyingPhoneOTP}
                        size="sm"
                        className="sm:w-auto w-full"
                      >
                        {verifyingPhoneOTP ? "Verifying..." : "Verify"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${parentType}-new-email`} className="text-sm sm:text-base">Email (Required)</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <ValidatedInput
                    id={`${parentType}-new-email`}
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={emailVerified}
                    className="flex-1 text-sm sm:text-base"
                  />
                  {!emailVerified && (
                    <Button
                      type="button"
                      onClick={handleSendEmailOTP}
                      disabled={!email || sendingEmailOTP || emailOTPSent}
                      variant="outline"
                      className="sm:w-auto w-full text-xs sm:text-sm"
                    >
                      {sendingEmailOTP ? "Sending..." : emailOTPSent ? "Sent" : "Send OTP"}
                    </Button>
                  )}
                  {emailVerified && (
                    <Button type="button" disabled variant="outline" className="text-green-600 sm:w-auto w-full text-xs sm:text-sm">
                      Verified ✓
                    </Button>
                  )}
                </div>
                {emailOTPSent && !emailVerified && (
                  <div className="space-y-2">
                    <Label className="text-sm">Enter OTP</Label>
                    <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                      <InputOTP
                        maxLength={6}
                        value={emailOTPCode}
                        onChange={setEmailOTPCode}
                        className="flex-1"
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                      <Button
                        type="button"
                        onClick={handleVerifyEmailOTP}
                        disabled={emailOTPCode.length !== 6 || verifyingEmailOTP}
                        size="sm"
                        className="sm:w-auto w-full"
                      >
                        {verifyingEmailOTP ? "Verifying..." : "Verify"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <Button 
                onClick={handleSave} 
                disabled={!email || (!isStudentForm && !phoneNumber)}
                className="w-full"
                size="lg"
              >
                Continue to {parentType} Form
              </Button>
            </div>
          )}
        </>
      )}
    </div>
    </>
  );
};
