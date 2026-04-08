import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/api/client';
import { useAuth } from '@/contexts/AuthContext';
import { Building2, Calendar, Shield, AlertCircle } from 'lucide-react';
import { getErrorMessage } from '@/api/apiError';

interface Organization {
  organizationId: string;
  name: string;
}

interface OrganizationEnrollment {
  organization: Organization;
  role: string;
  status: string;
  enrolledDate: string;
}

interface UserOrganizationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userName: string;
}

export default function UserOrganizationsDialog({
  open,
  onOpenChange,
  userId,
  userName,
}: UserOrganizationsDialogProps) {
  const { toast } = useToast();
  const { currentInstituteId } = useAuth();
  const [organizations, setOrganizations] = useState<OrganizationEnrollment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && userId && currentInstituteId) {
      fetchOrganizations();
    }
  }, [open, userId, currentInstituteId]);

  const fetchOrganizations = async () => {
    if (!currentInstituteId || !userId) return;

    setLoading(true);
    try {
      const response = await apiClient.get<OrganizationEnrollment[]>(
        `/organizations/institute/${currentInstituteId}/student/${userId}`
      );
      setOrganizations(response || []);
    } catch (error: any) {
      console.error('Error fetching organizations:', error);
      toast({
        title: 'Error',
        description: getErrorMessage(error, 'Failed to load organizations'),
        variant: 'destructive',
        duration: 2000,
      });
      setOrganizations([]);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role.toUpperCase()) {
      case 'ADMIN':
        return 'default';
      case 'MEMBER':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'verified':
        return 'default';
      case 'unverified':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-3xl max-h-[88vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-bold text-base leading-tight">Organizations</p>
              <p className="text-xs text-muted-foreground font-normal">{userName}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {loading ? (
            <div className="py-8 text-center text-muted-foreground">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              Loading organizations...
            </div>
          ) : organizations.length === 0 ? (
            <div className="py-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No organizations found</p>
              <p className="text-sm text-muted-foreground mt-1">
                This user is not enrolled in any organizations
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Organization Enrollments</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-primary/5 border border-primary/15">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-primary/60">Total</span>
                    <span className="text-lg font-bold text-primary">{organizations.length}</span>
                  </div>
                  <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-green-50 border border-green-200 dark:bg-green-950/30 dark:border-green-800">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-green-600 dark:text-green-400">Verified</span>
                    <span className="text-lg font-bold text-green-700 dark:text-green-300">{organizations.filter((item) => item.status.toLowerCase() === 'verified').length}</span>
                  </div>
                  <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-muted/60 border border-border/50">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Roles</span>
                    <span className="text-lg font-bold">{new Set(organizations.map((item) => item.role)).size}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
              {organizations.map((enrollment, index) => (
                <div
                  key={index}
                  className="rounded-xl border bg-muted/20 p-3.5 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-base leading-tight">{enrollment.organization.name}</p>
                      <p className="text-xs font-mono text-muted-foreground mt-0.5 break-all">{enrollment.organization.organizationId}</p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(enrollment.status)}>{enrollment.status}</Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-muted/60 border border-border/50">
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1"><Shield className="h-2.5 w-2.5" />Role</span>
                      <span className="mt-0.5"><Badge variant={getRoleBadgeVariant(enrollment.role)}>{enrollment.role}</Badge></span>
                    </div>
                    <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-muted/60 border border-border/50">
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Organization</span>
                      <span className="text-xs font-medium">{enrollment.organization.name}</span>
                    </div>
                    <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-muted/60 border border-border/50">
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1"><Calendar className="h-2.5 w-2.5" />Enrolled</span>
                      <span className="text-xs font-medium">
                        {new Date(enrollment.enrolledDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
