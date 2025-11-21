import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Heart, 
  AlertCircle,
  Briefcase,
  Building,
  Users
} from 'lucide-react';

interface ParentInfo {
  id: string;
  name: string;
  email?: string;
  occupation?: string;
  workPlace?: string;
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={student.imageUrl} alt={student.name} />
              <AvatarFallback>
                {student.name.split(' ').map(n => n.charAt(0)).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-xl font-bold">{student.name}</div>
              <div className="text-sm text-muted-foreground font-normal">
                {student.studentId || student.userIdByInstitute || student.id}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {student.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{student.email}</p>
                    </div>
                  </div>
                )}
                {student.phoneNumber && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{student.phoneNumber}</p>
                    </div>
                  </div>
                )}
                {student.dateOfBirth && (
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Date of Birth</p>
                      <p className="font-medium">
                        {new Date(student.dateOfBirth).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}
                {student.emergencyContact && (
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Emergency Contact</p>
                      <p className="font-medium">{student.emergencyContact}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          {(student.addressLine1 || student.addressLine2) && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Address
                </h3>
                <div className="space-y-1">
                  {student.addressLine1 && (
                    <p className="text-foreground">{student.addressLine1}</p>
                  )}
                  {student.addressLine2 && (
                    <p className="text-muted-foreground">{student.addressLine2}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Medical Information */}
          {(student.medicalConditions || student.allergies) && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Medical Information
                </h3>
                <div className="space-y-3">
                  {student.medicalConditions && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Medical Conditions</p>
                      <Badge variant="outline" className="text-sm">
                        {student.medicalConditions}
                      </Badge>
                    </div>
                  )}
                  {student.allergies && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Allergies</p>
                      <Badge variant="outline" className="text-sm">
                        {student.allergies}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Parent/Father Information */}
          {student.father && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Parent Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Father's Name</p>
                      <p className="font-medium">{student.father.name}</p>
                    </div>
                  </div>
                  {student.father.email && (
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Father's Email</p>
                        <p className="font-medium">{student.father.email}</p>
                      </div>
                    </div>
                  )}
                  {student.father.occupation && (
                    <div className="flex items-start gap-3">
                      <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Occupation</p>
                        <p className="font-medium">{student.father.occupation}</p>
                      </div>
                    </div>
                  )}
                  {student.father.workPlace && (
                    <div className="flex items-start gap-3">
                      <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Work Place</p>
                        <p className="font-medium">{student.father.workPlace}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentDetailsDialog;
