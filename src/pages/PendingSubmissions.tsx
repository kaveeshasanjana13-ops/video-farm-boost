import React, { useState, useEffect, useMemo } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, RefreshCw, Search, CheckCircle, Clock, XCircle, 
  Eye, CreditCard, AlertCircle 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useInstituteRole } from '@/hooks/useInstituteRole';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { institutePaymentsApi, PaymentSubmission, PendingSubmissionsResponse } from '@/api/institutePayments.api';
import VerifySubmissionDialog from '@/components/forms/VerifySubmissionDialog';
import { getImageUrl } from '@/utils/imageUrlHelper';
import { Skeleton } from '@/components/ui/skeleton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

const PendingSubmissions = () => {
  const { selectedInstitute } = useAuth();
  const role = useInstituteRole();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [data, setData] = useState<PendingSubmissionsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<PaymentSubmission | null>(null);

  const canVerify = role === 'InstituteAdmin' || role === 'Teacher';

  const loadPendingSubmissions = async (forceRefresh = false) => {
    if (!selectedInstitute?.id) return;
    setLoading(true);
    try {
      const response = await institutePaymentsApi.getPendingSubmissions(selectedInstitute.id, {
        page: page + 1,
        limit: rowsPerPage,
        search: searchQuery || undefined,
      });
      setData(response);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load pending submissions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedInstitute?.id && canVerify) {
      loadPendingSubmissions();
    }
  }, [selectedInstitute?.id, page, rowsPerPage]);

  const submissions = data?.data?.submissions || [];
  const totalCount = data?.data?.pagination?.totalItems || 0;

  const filteredSubmissions = useMemo(() => {
    if (!searchQuery.trim()) return submissions;
    const q = searchQuery.toLowerCase();
    return submissions.filter(s => 
      s.username?.toLowerCase().includes(q) ||
      s.transactionId?.toLowerCase().includes(q) ||
      s.id?.toString().includes(q)
    );
  }, [submissions, searchQuery]);

  const handleVerify = (submission: PaymentSubmission) => {
    setSelectedSubmission(submission);
    setVerifyDialogOpen(true);
  };

  const handleViewReceipt = (url: string) => {
    if (url) window.open(getImageUrl(url), '_blank');
  };

  if (!canVerify) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-lg font-medium">Access Denied</p>
          <p className="text-muted-foreground">Only admins and teachers can review submissions.</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)} size="sm">
            <ArrowLeft className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              Pending Submissions
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Review and verify payment submissions
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-sm self-start sm:self-auto">
          <Clock className="h-3 w-3 mr-1" />
          {totalCount} pending
        </Badge>
      </div>

      {/* Search & Refresh */}
      <Card>
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by student name or transaction ID..." 
                className="pl-10 text-sm"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => loadPendingSubmissions(true)} 
              disabled={loading}
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loading */}
      {loading && !data && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </CardContent>
        </Card>
      )}

      {/* Table */}
      {!loading || data ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="h-5 w-5 text-primary" />
              Pending Review Queue
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer sx={{ minHeight: 400 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, bgcolor: 'hsl(var(--muted))', color: 'hsl(var(--foreground))' }}>Student</TableCell>
                      <TableCell sx={{ fontWeight: 600, bgcolor: 'hsl(var(--muted))', color: 'hsl(var(--foreground))' }} align="right">Amount</TableCell>
                      <TableCell sx={{ fontWeight: 600, bgcolor: 'hsl(var(--muted))', color: 'hsl(var(--foreground))' }}>Transaction Ref</TableCell>
                      <TableCell sx={{ fontWeight: 600, bgcolor: 'hsl(var(--muted))', color: 'hsl(var(--foreground))' }}>Payment Date</TableCell>
                      <TableCell sx={{ fontWeight: 600, bgcolor: 'hsl(var(--muted))', color: 'hsl(var(--foreground))' }}>Submitted</TableCell>
                      <TableCell sx={{ fontWeight: 600, bgcolor: 'hsl(var(--muted))', color: 'hsl(var(--foreground))' }} align="center">Receipt</TableCell>
                      <TableCell sx={{ fontWeight: 600, bgcolor: 'hsl(var(--muted))', color: 'hsl(var(--foreground))' }} align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredSubmissions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          <div className="py-12">
                            <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground text-lg">
                              {searchQuery ? 'No matching submissions' : 'No pending submissions'}
                            </p>
                            <p className="text-muted-foreground text-sm">
                              {searchQuery ? 'Try a different search' : 'All submissions have been reviewed!'}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSubmissions.map(submission => (
                        <TableRow hover key={submission.id}>
                          <TableCell>
                            <div className="font-medium text-foreground">{submission.username || 'Unknown'}</div>
                            <div className="text-xs text-muted-foreground">ID: {submission.userId}</div>
                          </TableCell>
                          <TableCell align="right">
                            <span className="font-semibold text-primary">
                              Rs {parseFloat(submission.submittedAmount || '0').toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="font-mono text-xs">{submission.transactionId || '-'}</span>
                          </TableCell>
                          <TableCell>
                            {submission.paymentDate ? new Date(submission.paymentDate).toLocaleDateString() : '-'}
                          </TableCell>
                          <TableCell>
                            {submission.uploadedAt ? new Date(submission.uploadedAt).toLocaleDateString() : '-'}
                          </TableCell>
                          <TableCell align="center">
                            {submission.receiptUrl ? (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewReceipt(submission.receiptUrl)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            ) : '-'}
                          </TableCell>
                          <TableCell align="center">
                            <Button 
                              size="sm" 
                              onClick={() => handleVerify(submission)}
                            >
                              Verify
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={totalCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                onRowsPerPageChange={e => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
              />
            </Paper>
          </CardContent>
        </Card>
      ) : null}

      {/* Verify Dialog */}
      {selectedInstitute && (
        <VerifySubmissionDialog
          open={verifyDialogOpen}
          onOpenChange={setVerifyDialogOpen}
          submission={selectedSubmission}
          instituteId={selectedInstitute.id}
          onSuccess={() => {
            setVerifyDialogOpen(false);
            setSelectedSubmission(null);
            loadPendingSubmissions();
          }}
        />
      )}
    </PageContainer>
  );
};

export default PendingSubmissions;
