import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getImageUrl } from '@/utils/imageUrlHelper';
import {
  Mail,
  Phone,
  Calendar,
  Heart,
  AlertCircle,
  Hash
} from 'lucide-react';

interface ParentInfo {
  id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  imageUrl?: string;
  occupation?: string;
  workPlace?: string;
  workplace?: string;
  children?: any[];
}

interface StudentDetails {
  id: string;
  name: string;
  email?: string;
  addressLine1?: string;
  addressLine2?: string;
  phoneNumber?: string;
  imageUrl?: string;
  dateOfBirth?: string;
  userIdByInstitute?: string;
  studentId?: string;
  fatherId?: string;
  emergencyContact?: string;
  medicalConditions?: string;
  allergies?: string;
  father?: ParentInfo;
  mother?: ParentInfo;
  parentDetails?: {
    father?: ParentInfo;
    mother?: ParentInfo;
  };
}

interface StudentDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: StudentDetails | null;
}

const StudentDetailsDialog: React.FC<StudentDetailsDialogProps> = ({
  open,
  onOpenChange,
  student
}) => {
  if (!student) return null;

  // Shows all words except the last as initials, last word in full
  // e.g. "HEENKENDA MUDIYANSELAGE KAVEESHA KARUNARATHNA" → "H. M. K. Karunarathna"
  const formatNameWithInitials = (name: string): string => {
    const parts = name.trim().split(/\s+/);
    if (parts.length <= 1) return name;
    const initials = parts.slice(0, -1).map(p => p.charAt(0).toUpperCase() + '.').join(' ');
    const last = parts[parts.length - 1].charAt(0).toUpperCase() + parts[parts.length - 1].slice(1).toLowerCase();
    return `${initials} ${last}`;
  };

  // Debug logging to see what parent data we're actually receiving
  React.useEffect(() => {
    if (student) {
      console.log('📋 Student data:', student);
      console.log('👨 Father data:', student.father || student.parentDetails?.father);
      console.log('👩 Mother data:', student.mother || student.parentDetails?.mother);
    }
  }, [student]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-14 w-14 ring-4 ring-primary/10">
              <AvatarImage src={getImageUrl(student.imageUrl)} alt={student.name} />
              <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
                {student.name.split(' ').map(n => n.charAt(0)).join('').slice(0,2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-base font-bold leading-tight">{student.name}</div>
              <div className="text-xs text-muted-foreground font-mono mt-0.5">
                {student.studentId || student.userIdByInstitute || student.id}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Personal Information */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Personal Information</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-primary/5 border border-primary/15 col-span-2 sm:col-span-1">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-primary/60 flex items-center gap-1"><Hash className="h-2.5 w-2.5" />System ID</span>
                <span className="text-xs font-bold font-mono text-primary">{student.id}</span>
              </div>
              {student.userIdByInstitute && (
                <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-muted/60 border border-border/50">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1"><Hash className="h-2.5 w-2.5" />Institute ID</span>
                  <span className="text-xs font-medium font-mono">{student.userIdByInstitute}</span>
                </div>
              )}
              {student.studentId && (
                <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-muted/60 border border-border/50">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1"><Hash className="h-2.5 w-2.5" />Student ID</span>
                  <span className="text-xs font-medium font-mono">{student.studentId}</span>
                </div>
              )}
              {student.email && (
                <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-muted/60 border border-border/50 col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1"><Mail className="h-2.5 w-2.5" />Email</span>
                  <span className="text-xs font-medium break-all">{student.email}</span>
                </div>
              )}
              {student.phoneNumber && (
                <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-muted/60 border border-border/50">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1"><Phone className="h-2.5 w-2.5" />Phone</span>
                  <span className="text-xs font-medium">{student.phoneNumber}</span>
                </div>
              )}
              {student.dateOfBirth && (
                <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-muted/60 border border-border/50">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1"><Calendar className="h-2.5 w-2.5" />Date of Birth</span>
                  <span className="text-xs font-medium">{new Date(student.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>
              )}
              {student.emergencyContact && (
                <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-red-50 border border-red-200 dark:bg-red-950/30 dark:border-red-800">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-red-600 dark:text-red-400 flex items-center gap-1"><AlertCircle className="h-2.5 w-2.5" />Emergency</span>
                  <span className="text-xs font-medium text-red-700 dark:text-red-300">{student.emergencyContact}</span>
                </div>
              )}
            </div>
          </div>

          {/* Address */}
          {(student.addressLine1 || student.addressLine2) && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Address</p>
              <div className="p-3 rounded-xl bg-muted/60 border border-border/50">
                {student.addressLine1 && <p className="text-sm font-medium">{student.addressLine1}</p>}
                {student.addressLine2 && <p className="text-xs text-muted-foreground mt-0.5">{student.addressLine2}</p>}
              </div>
            </div>
          )}

          {/* Medical */}
          {(student.medicalConditions || student.allergies) && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Medical Information</p>
              <div className="grid grid-cols-2 gap-2">
                {student.medicalConditions && (
                  <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-orange-50 border border-orange-200 dark:bg-orange-950/30 dark:border-orange-800">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-orange-600 dark:text-orange-400 flex items-center gap-1"><Heart className="h-2.5 w-2.5" />Medical Conditions</span>
                    <span className="text-xs font-medium text-orange-700 dark:text-orange-300">{student.medicalConditions}</span>
                  </div>
                )}
                {student.allergies && (
                  <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-red-50 border border-red-200 dark:bg-red-950/30 dark:border-red-800">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-red-600 dark:text-red-400 flex items-center gap-1"><AlertCircle className="h-2.5 w-2.5" />Allergies</span>
                    <span className="text-xs font-medium text-red-700 dark:text-red-300">{student.allergies}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Parents */}
          {(student.father || student.mother || student.parentDetails) && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Parent Information</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { data: student.father || student.parentDetails?.father, label: 'Father' },
                  { data: student.mother || student.parentDetails?.mother, label: 'Mother' },
                ].filter(p => p.data).map(({ data: parent, label }) => (
                  <div key={label} className="p-3 rounded-xl border bg-muted/30 space-y-2">
                    <div className="flex items-center gap-2.5 pb-2 border-b">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={getImageUrl(parent?.imageUrl)} alt={label} />
                        <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                          {parent?.name?.split(' ').map((n: string) => n.charAt(0)).join('').slice(0,2) || label[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
                        <p className="text-sm font-semibold leading-tight">{formatNameWithInitials(parent?.name || '')}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-1.5">
                      {parent?.email && (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Email</span>
                          <span className="text-xs font-medium break-all">{parent.email}</span>
                        </div>
                      )}
                      {parent?.phoneNumber && (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Phone</span>
                          <span className="text-xs font-medium">{parent.phoneNumber}</span>
                        </div>
                      )}
                      {parent?.occupation && (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Occupation</span>
                          <span className="text-xs font-medium">{parent.occupation}</span>
                        </div>
                      )}
                      {(parent?.workPlace || parent?.workplace) && (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Workplace</span>
                          <span className="text-xs font-medium">{parent.workPlace || parent.workplace}</span>
                        </div>
                      )}
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
};

export default StudentDetailsDialog;
