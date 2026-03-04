/**
 * SubmitPaymentDialog - Submit payment with Cloud Storage or Google Drive upload
 */

import React, { useState, useCallback, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import {
  Upload,
  CreditCard,
  Loader2,
  Receipt,
  CloudUpload,
  HardDrive,
  FileImage,
  X,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { UserIdCardOrder, PaymentType, userCardApi } from '@/api/userCard.api';
import { formatPrice } from '@/utils/cardHelpers';
import { toast } from '@/hooks/use-toast';
import { useDriveUpload } from '@/hooks/useDriveUpload';
import { checkDriveConnection } from '@/services/driveService';

type UploadMethodType = 'cloud' | 'drive';
type UploadState = 'idle' | 'uploading' | 'success' | 'error';

const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface SubmitPaymentDialogProps {
  order: UserIdCardOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loadingOrder?: boolean;
  onSuccess: () => void;
}

const SubmitPaymentDialog: React.FC<SubmitPaymentDialogProps> = ({
  order,
  open,
  onOpenChange,
  loadingOrder = false,
  onSuccess,
}) => {
  const [paymentType, setPaymentType] = useState<PaymentType>(PaymentType.BANK_TRANSFER);
  const [uploadMethod, setUploadMethod] = useState<UploadMethodType>('cloud');
  const [paymentReference, setPaymentReference] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedRelativePath, setUploadedRelativePath] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [driveConnected, setDriveConnected] = useState<boolean | null>(null);
  const [checkingDrive, setCheckingDrive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const driveUpload = useDriveUpload();

  const resetForm = useCallback(() => {
    setPaymentType(PaymentType.BANK_TRANSFER);
    setUploadMethod('cloud');
    setPaymentReference('');
    setNotes('');
    setSelectedFile(null);
    setUploadState('idle');
    setUploadProgress(0);
    setUploadedRelativePath(null);
    setSubmitting(false);
    setDriveConnected(null);
    setError(null);
    driveUpload.reset();
  }, [driveUpload]);

  const handleOpenChange = (open: boolean) => {
    if (!open) resetForm();
    onOpenChange(open);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Only JPEG, PNG, WebP images and PDF files are accepted.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('File size must be under 10MB.');
      return;
    }

    setSelectedFile(file);
    setUploadState('idle');
    setUploadedRelativePath(null);
    setError(null);
    driveUpload.reset();
  };

  const removeFile = () => {
    setSelectedFile(null);
    setUploadState('idle');
    setUploadProgress(0);
    setUploadedRelativePath(null);
    setError(null);
    driveUpload.reset();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Cloud Storage Upload
  const uploadToCloud = async () => {
    if (!selectedFile || !order) return;

    setUploadState('uploading');
    setUploadProgress(10);
    setError(null);

    try {
      // Step 1: Get signed URL
      const uploadData = await userCardApi.getPaymentSlipUploadUrl(order.id, {
        fileName: selectedFile.name,
        contentType: selectedFile.type,
      });
      setUploadProgress(30);

      // Step 2: Upload file directly
      if (uploadData.fields) {
        // AWS S3 presigned POST
        const formData = new FormData();
        Object.entries(uploadData.fields).forEach(([k, v]) => formData.append(k, v as string));
        formData.append('file', selectedFile);
        await fetch(uploadData.uploadUrl, { method: 'POST', body: formData });
      } else {
        // GCS signed PUT
        await fetch(uploadData.uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': selectedFile.type },
          body: selectedFile,
        });
      }
      setUploadProgress(80);

      // Step 3: Verify upload (optional)
      try {
        await userCardApi.verifyPaymentSlipUpload(order.id, uploadData.relativePath);
      } catch {
        // Non-critical, continue
      }
      setUploadProgress(100);
      setUploadedRelativePath(uploadData.relativePath);
      setUploadState('success');
    } catch (err: any) {
      console.error('Cloud upload failed:', err);
      setError(err.message || 'Upload failed. Please try again.');
      setUploadState('error');
    }
  };

  // Google Drive Upload
  const uploadToDrive = async () => {
    if (!selectedFile || !order) return;

    setUploadState('uploading');
    setError(null);

    try {
      const result = await driveUpload.upload(selectedFile, {
        purpose: 'ID_CARD_PAYMENT',
        referenceType: 'ID_CARD_ORDER',
        referenceId: String(order.id),
      });

      if (result) {
        setUploadState('success');
        setUploadProgress(100);
      } else if (driveUpload.error) {
        setError(driveUpload.error);
        setUploadState('error');
      }
    } catch (err: any) {
      setError(err.message || 'Drive upload failed.');
      setUploadState('error');
    }
  };

  const handleUpload = () => {
    if (uploadMethod === 'cloud') {
      uploadToCloud();
    } else {
      uploadToDrive();
    }
  };

  const handleCheckDrive = async () => {
    setCheckingDrive(true);
    try {
      const status = await checkDriveConnection();
      setDriveConnected(status.isConnected && !status.needsReauthorization);
      if (!status.isConnected || status.needsReauthorization) {
        setError('Google Drive is not connected. Please connect it from your profile settings first.');
      }
    } catch {
      setDriveConnected(false);
      setError('Could not check Drive connection.');
    } finally {
      setCheckingDrive(false);
    }
  };

  const handleMethodChange = (method: UploadMethodType) => {
    setUploadMethod(method);
    setError(null);
    removeFile();
    if (method === 'drive' && driveConnected === null) {
      handleCheckDrive();
    }
  };

  const handleSubmit = async () => {
    if (!order) return;

    const paymentAmount = order.card?.price;
    if (!paymentAmount || paymentAmount <= 0) {
      toast({ title: 'Order not ready', description: 'Order details are still loading.', variant: 'destructive' });
      return;
    }

    if (uploadMethod === 'cloud' && !uploadedRelativePath) {
      setError('Please upload your payment slip first.');
      return;
    }

    if (uploadMethod === 'drive' && !driveUpload.uploadedFile) {
      setError('Please upload your payment slip to Google Drive first.');
      return;
    }

    try {
      setSubmitting(true);

      if (uploadMethod === 'cloud') {
        await userCardApi.submitPayment(order.id, {
          submissionUrl: uploadedRelativePath!,
          paymentType,
          paymentAmount,
          paymentReference: paymentReference.trim() || undefined,
          notes: notes.trim() || undefined,
        });
      } else {
        const driveFile = driveUpload.uploadedFile!;
        await userCardApi.submitDrivePayment(order.id, {
          driveFileId: driveFile.driveFileId,
          driveWebViewLink: driveFile.viewUrl,
          driveFileName: driveFile.fileName,
          paymentType,
          paymentAmount,
          paymentReference: paymentReference.trim() || undefined,
          notes: notes.trim() || undefined,
        });
      }

      toast({ title: 'Payment Submitted', description: 'Your payment has been submitted for verification.' });
      resetForm();
      onSuccess();
    } catch (err: any) {
      console.error('Payment submission failed:', err);
      toast({ title: 'Error', description: err.message || 'Failed to submit payment', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  if (!order) return null;

  const isFileUploaded = uploadState === 'success';
  const isUploading = uploadState === 'uploading';
  const effectiveProgress = uploadMethod === 'drive' ? driveUpload.progress : uploadProgress;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Submit Payment
          </DialogTitle>
          <DialogDescription>
            Upload your payment proof for order #{order.id}
          </DialogDescription>
        </DialogHeader>

        {/* Order Summary */}
        <div className="p-3 bg-muted/50 rounded-lg space-y-1.5">
          {loadingOrder ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Card</span>
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Amount Due</span>
                <Skeleton className="h-7 w-24" />
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Card</span>
                <span className="font-medium text-sm">{order.card?.cardName || '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Amount Due</span>
                <span className="text-lg font-bold text-primary">
                  {order.card ? formatPrice(order.card.price) : '-'}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="space-y-4">
          {/* Payment Type */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Payment Method</Label>
            <RadioGroup
              value={paymentType}
              onValueChange={(v) => setPaymentType(v as PaymentType)}
              className="grid grid-cols-2 gap-2"
            >
              <div>
                <RadioGroupItem value={PaymentType.BANK_TRANSFER} id="bank" className="peer sr-only" />
                <Label
                  htmlFor="bank"
                  className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-colors"
                >
                  <Receipt className="mb-1.5 h-5 w-5" />
                  <span className="text-xs font-medium">Bank Transfer</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value={PaymentType.VISA_MASTER} id="card" className="peer sr-only" />
                <Label
                  htmlFor="card"
                  className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-colors"
                >
                  <CreditCard className="mb-1.5 h-5 w-5" />
                  <span className="text-xs font-medium">Card Payment</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Upload Method */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Upload Method</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={uploadMethod === 'cloud' ? 'default' : 'outline'}
                size="sm"
                className="flex items-center gap-1.5 h-9"
                onClick={() => handleMethodChange('cloud')}
                disabled={isUploading}
              >
                <CloudUpload className="h-4 w-4" />
                <span className="text-xs">Cloud Storage</span>
              </Button>
              <Button
                type="button"
                variant={uploadMethod === 'drive' ? 'default' : 'outline'}
                size="sm"
                className="flex items-center gap-1.5 h-9"
                onClick={() => handleMethodChange('drive')}
                disabled={isUploading}
              >
                <HardDrive className="h-4 w-4" />
                <span className="text-xs">Google Drive</span>
              </Button>
            </div>
          </div>

          {/* Drive Connection Check */}
          {uploadMethod === 'drive' && checkingDrive && (
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Checking Google Drive connection...
            </div>
          )}

          {uploadMethod === 'drive' && driveConnected === false && (
            <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>Google Drive is not connected. Please connect it from your profile → Connected Apps first.</span>
            </div>
          )}

          {/* File Upload Area */}
          {(uploadMethod === 'cloud' || (uploadMethod === 'drive' && driveConnected)) && (
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Payment Slip</Label>

              {!selectedFile ? (
                <label
                  htmlFor="payment-file"
                  className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-primary/50 hover:bg-accent/30 transition-colors"
                >
                  <FileImage className="h-8 w-8 text-muted-foreground/50" />
                  <div className="text-center">
                    <p className="text-sm font-medium">Tap to select file</p>
                    <p className="text-xs text-muted-foreground mt-0.5">JPEG, PNG, WebP, or PDF (max 10MB)</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    id="payment-file"
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.pdf"
                    className="sr-only"
                    onChange={handleFileSelect}
                  />
                </label>
              ) : (
                <div className="space-y-2">
                  {/* File Info */}
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    {selectedFile.type === 'application/pdf' ? (
                      <FileText className="h-8 w-8 text-destructive shrink-0" />
                    ) : (
                      <FileImage className="h-8 w-8 text-primary shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(selectedFile.size / 1024).toFixed(0)} KB
                      </p>
                    </div>
                    {isFileUploaded ? (
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    ) : !isUploading ? (
                      <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={removeFile}>
                        <X className="h-4 w-4" />
                      </Button>
                    ) : null}
                  </div>

                  {/* Progress */}
                  {isUploading && (
                    <div className="space-y-1.5">
                      <Progress value={effectiveProgress} className="h-2" />
                      <p className="text-xs text-muted-foreground text-center">
                        {effectiveProgress < 30 ? 'Preparing...' :
                          effectiveProgress < 80 ? 'Uploading...' :
                            effectiveProgress < 100 ? 'Verifying...' : 'Done!'}
                      </p>
                    </div>
                  )}

                  {/* Upload Button */}
                  {!isFileUploaded && !isUploading && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="w-full"
                      onClick={handleUpload}
                    >
                      <CloudUpload className="h-4 w-4 mr-1.5" />
                      Upload {uploadMethod === 'drive' ? 'to Google Drive' : 'to Cloud'}
                    </Button>
                  )}

                  {isFileUploaded && (
                    <p className="text-xs text-primary flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      File uploaded successfully
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 p-2.5 bg-destructive/10 border border-destructive/20 rounded-lg text-xs text-destructive">
              <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Reference Number */}
          <div className="space-y-1.5">
            <Label htmlFor="paymentReference" className="text-xs">
              Reference Number <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <Input
              id="paymentReference"
              placeholder="TXN-2025-001234"
              value={paymentReference}
              onChange={(e) => setPaymentReference(e.target.value)}
              className="h-9 text-sm"
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-xs">
              Notes <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <Input
              id="notes"
              placeholder="Add a note..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="h-9 text-sm"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" size="sm" onClick={() => handleOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={submitting || loadingOrder || !order.card?.price || !isFileUploaded}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Payment'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubmitPaymentDialog;
