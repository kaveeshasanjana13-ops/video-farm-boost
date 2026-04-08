import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, XCircle, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { institutePaymentsApi, VerifySubmissionRequest, PaymentSubmission } from '@/api/institutePayments.api';

interface VerifySubmissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submission: PaymentSubmission | null;
  instituteId: string;
  onSuccess?: () => void;
}

const VerifySubmissionDialog = ({ open, onOpenChange, submission, instituteId, onSuccess }: VerifySubmissionDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<VerifySubmissionRequest>({
    status: 'VERIFIED',
    rejectionReason: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submission) return;

    if (formData.status === 'REJECTED' && !formData.rejectionReason) {
      toast({
        title: "Error",
        description: "Rejection reason is required when rejecting a submission",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Call the specific institute payment verification API
      const response = await institutePaymentsApi.verifySubmissionDetailed(instituteId, submission.id, {
        status: formData.status,
        rejectionReason: formData.rejectionReason || undefined,
        notes: formData.notes || undefined
      });
      
      toast({
        title: "Success",
        description: `Payment submission ${formData.status.toLowerCase()} successfully`,
      });
      onOpenChange(false);
      onSuccess?.();
      // Reset form
      setFormData({
        status: 'VERIFIED',
        rejectionReason: '',
        notes: ''
      });
    } catch (error: any) {
      console.error('Failed to verify submission:', error);
      toast({
        title: "Verification Failed",
        description: (error as any).message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!submission) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-3xl max-h-[88vh] overflow-y-auto mx-auto">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-bold text-base leading-tight">Verify Payment Submission</p>
              <p className="text-xs text-muted-foreground font-normal">Review and approve or reject the submission</p>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        {/* Submission Details */}
        <div className="space-y-5 mb-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Submission Details</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
              <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-primary/5 border border-primary/15">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-primary/60">Submission ID</span>
                <span className="text-xs font-mono font-bold text-primary break-all">{submission.id}</span>
              </div>
              <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-muted/60 border border-border/50">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Amount</span>
                <span className="text-xs font-medium">Rs {parseFloat((submission as any).paymentAmount || (submission as any).submittedAmount || '0').toLocaleString()}</span>
              </div>
              <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-muted/60 border border-border/50">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Student</span>
                <span className="text-xs font-medium">{(submission as any).studentName || (submission as any).username || '-'}</span>
              </div>
              <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-muted/60 border border-border/50 col-span-2 sm:col-span-1">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Transaction Ref</span>
                <span className="text-xs font-mono font-medium break-all">{(submission as any).transactionRef || (submission as any).transactionId || '-'}</span>
              </div>
              <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-muted/60 border border-border/50">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Payment Method</span>
                <span className="text-xs font-medium">{(submission as any).paymentMethod || '-'}</span>
              </div>
              <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-muted/60 border border-border/50">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Payment Date</span>
                <span className="text-xs font-medium">{new Date(submission.paymentDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {((submission as any).remarks || (submission as any).notes) && (
            <div className="p-3 rounded-xl bg-muted/60 border border-border/50">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">Remarks</p>
              <p className="text-sm">{(submission as any).remarks || (submission as any).notes}</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="status">Verification Decision *</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value: 'VERIFIED' | 'REJECTED') => {
                setFormData(prev => ({ ...prev, status: value }));
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VERIFIED">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Verified</span>
                  </div>
                </SelectItem>
                <SelectItem value="REJECTED">
                  <div className="flex items-center space-x-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span>Rejected</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.status === 'REJECTED' && (
            <div>
              <Label htmlFor="rejectionReason">Rejection Reason *</Label>
              <Textarea
                id="rejectionReason"
                value={formData.rejectionReason}
                onChange={(e) => setFormData(prev => ({ ...prev, rejectionReason: e.target.value }))}
                placeholder="Please provide a reason for rejection..."
                required
              className={`${fieldErrors.rejectionReason ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />

              {fieldErrors.rejectionReason && <p className="text-xs text-red-500 mt-1">{fieldErrors.rejectionReason}</p>}
            </div>
          )}

          <div>
            <Label htmlFor="notes">Admin Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes (visible to the submitter)..."
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              variant={formData.status === 'VERIFIED' ? 'default' : 'destructive'}
            >
              {loading ? 'Processing...' : formData.status === 'VERIFIED' ? 'Verify Submission' : 'Reject Submission'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VerifySubmissionDialog;