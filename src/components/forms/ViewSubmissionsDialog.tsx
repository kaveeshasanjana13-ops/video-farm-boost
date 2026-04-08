import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, CheckCircle, AlertCircle, Calendar, DollarSign, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { institutePaymentsApi, PaymentSubmissionsResponse, PaymentSubmission, InstitutePayment } from '@/api/institutePayments.api';
import { useToast } from '@/hooks/use-toast';
import { getImageUrl } from '@/utils/imageUrlHelper';

interface ViewSubmissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: InstitutePayment | null;
  instituteId: string;
}

const ViewSubmissionsDialog = ({ open, onOpenChange, payment, instituteId }: ViewSubmissionsDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [submissionsData, setSubmissionsData] = useState<PaymentSubmissionsResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const loadSubmissions = async () => {
    if (!payment) return;
    
    setLoading(true);
    try {
      const response = await institutePaymentsApi.getPaymentSubmissions(
        instituteId, 
        payment.id, 
        { page: 1, limit: 50, sortBy: 'submissionDate', sortOrder: 'DESC' }
      );
      setSubmissionsData(response);
    } catch (error: any) {
      console.error('Failed to load submissions:', error);
      toast({
        title: "Error",
        description: "Failed to load payment submissions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load submissions when dialog opens and payment is available
  useEffect(() => {
    if (open && payment) {
      loadSubmissions();
    }
  }, [open, payment]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return <CheckCircle className="h-4 w-4" />;
      case 'PENDING':
        return <AlertCircle className="h-4 w-4" />;
      case 'REJECTED':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-bold text-base leading-tight">Payment Submissions</p>
              {payment && (
                <p className="text-xs text-muted-foreground font-normal">{payment.paymentType}</p>
              )}
            </div>
            <Button
              onClick={loadSubmissions}
              disabled={loading}
              variant="outline"
              size="sm"
              className="ml-auto"
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
          </DialogTitle>
        </DialogHeader>

        {payment && (
          <div className="grid grid-cols-3 gap-2 mb-1">
            <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-primary/5 border border-primary/15">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-primary/60">Amount</span>
              <span className="text-xs font-bold text-primary">Rs {payment.amount.toLocaleString()}</span>
            </div>
            <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-amber-50 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-800">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">Due Date</span>
              <span className="text-xs font-bold text-amber-700 dark:text-amber-300">{new Date(payment.dueDate).toLocaleDateString()}</span>
            </div>
            <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-muted/60 border border-border/50">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Type</span>
              <span className="text-xs font-medium">{payment.paymentType}</span>
            </div>
          </div>
        )}

        <ScrollArea className="max-h-[65vh] pr-4">
          <div className="space-y-4">
            {/* Summary Stats */}
            {submissionsData && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Summary</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-muted/60 border border-border/50">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Total</span>
                    <span className="text-lg font-bold">{submissionsData.data.pagination.totalItems}</span>
                  </div>
                  <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-green-50 border border-green-200 dark:bg-green-950/30 dark:border-green-800">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-green-600 dark:text-green-400">Verified</span>
                    <span className="text-lg font-bold text-green-700 dark:text-green-300">
                      {submissionsData.data.submissions.filter(s => s.status === 'VERIFIED').length}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-amber-50 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-800">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">Pending</span>
                    <span className="text-lg font-bold text-amber-700 dark:text-amber-300">
                      {submissionsData.data.submissions.filter(s => s.status === 'PENDING').length}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Submissions List */}
            {!submissionsData ? (
              <div className="text-center py-12">
                <FileText className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  {loading ? 'Loading payment submissions...' : 'Click refresh to load submissions'}
                </p>
              </div>
            ) : submissionsData.data.submissions.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No submissions found for this payment yet.</p>
              </div>
            ) : (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Submissions</p>
                <div className="space-y-3">
                  {submissionsData.data.submissions.map((submission) => (
                    <div key={submission.id} className="rounded-xl border bg-muted/20 p-3 space-y-3">
                      {/* Header row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className={`px-2 py-0.5 text-[10px] font-semibold flex items-center gap-1 ${getStatusColor(submission.status)}`}>
                            {getStatusIcon(submission.status)}
                            {submission.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">by <span className="font-medium text-foreground">{submission.username}</span></span>
                        </div>
                        <div className="flex flex-col gap-0.5 p-2 rounded-lg bg-primary/5 border border-primary/15 text-right">
                          <span className="text-[10px] font-semibold uppercase tracking-wide text-primary/60">Amount</span>
                          <span className="text-sm font-bold text-primary">Rs {submission.submittedAmount.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Details grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                        <div className="flex flex-col gap-0.5 p-2 rounded-lg bg-muted/60 border border-border/50">
                          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1"><DollarSign className="h-2.5 w-2.5" />Transaction</span>
                          <span className="text-xs font-mono font-medium">{submission.transactionId}</span>
                        </div>
                        <div className="flex flex-col gap-0.5 p-2 rounded-lg bg-muted/60 border border-border/50">
                          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1"><FileText className="h-2.5 w-2.5" />User Type</span>
                          <span className="text-xs font-medium">{submission.userType}</span>
                        </div>
                        <div className="flex flex-col gap-0.5 p-2 rounded-lg bg-muted/60 border border-border/50">
                          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1"><Calendar className="h-2.5 w-2.5" />Payment Date</span>
                          <span className="text-xs font-medium">{new Date(submission.paymentDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex flex-col gap-0.5 p-2 rounded-lg bg-muted/60 border border-border/50">
                          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1"><Calendar className="h-2.5 w-2.5" />Uploaded</span>
                          <span className="text-xs font-medium">{new Date(submission.uploadedAt).toLocaleDateString()}</span>
                        </div>
                        {submission.verifiedAt && (
                          <div className="flex flex-col gap-0.5 p-2 rounded-lg bg-green-50 border border-green-200 dark:bg-green-950/30 dark:border-green-800">
                            <span className="text-[10px] font-semibold uppercase tracking-wide text-green-600 dark:text-green-400 flex items-center gap-1"><CheckCircle className="h-2.5 w-2.5" />Verified</span>
                            <span className="text-xs font-medium text-green-700 dark:text-green-300">{new Date(submission.verifiedAt).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      {submission.notes && (
                        <div className="p-2.5 rounded-lg bg-muted/60 border border-border/50">
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">Notes</p>
                          <p className="text-xs">{submission.notes}</p>
                        </div>
                      )}

                      {submission.rejectionReason && (
                        <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 dark:bg-red-950/30 dark:border-red-800">
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-red-600 dark:text-red-400 mb-1">Rejection Reason</p>
                          <p className="text-xs text-red-700 dark:text-red-300">{submission.rejectionReason}</p>
                        </div>
                      )}

                      {submission.receiptUrl && (
                        <button
                          onClick={() => window.open(getImageUrl(submission.receiptUrl), '_blank')}
                          className="text-xs text-primary hover:underline font-medium"
                        >
                          View Receipt →
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ViewSubmissionsDialog;