import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { enhancedCachedClient } from '@/api/enhancedCachedClient';
import { CACHE_TTL } from '@/config/cacheTTL';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  IdCard,
  CheckCircle,
  Shield,
  Building
} from 'lucide-react';

interface InstituteProfileData {
  userId: string;
  instituteId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userType: string;
  status: string;
  userIdByInstitute: string;
  instituteUserImageUrl: string | null;
  instituteCardId: string | null;
  imageVerificationStatus: string;
  imageVerifiedBy: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const InstituteProfile = () => {
  const { currentInstituteId } = useAuth();
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<InstituteProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfileData();
  }, [currentInstituteId]);

  const loadProfileData = async () => {
    if (!currentInstituteId) {
      toast({
        title: "Error",
        description: "No institute selected.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await enhancedCachedClient.get<InstituteProfileData>(
        `/institute-users/institute/${currentInstituteId}/me`,
        {},
        {
          ttl: CACHE_TTL.INSTITUTE_PROFILE,
          forceRefresh: false,
          userId: currentInstituteId
        }
      );
      setProfileData(response);
    } catch (error: any) {
      console.error('Error fetching institute profile:', error);
      toast({
        title: "Error",
        description: "Failed to load institute profile data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No profile data available.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      ACTIVE: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      INACTIVE: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
      PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
    };

    return (
      <Badge className={statusColors[status] || statusColors.PENDING}>
        {status}
      </Badge>
    );
  };

  const getVerificationBadge = (status: string) => {
    const verificationColors: Record<string, string> = {
      VERIFIED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    };

    return (
      <Badge className={verificationColors[status] || verificationColors.PENDING}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            <Avatar className="relative h-32 w-32 border-4 border-background shadow-xl">
              <AvatarImage src={profileData.instituteUserImageUrl || ''} />
              <AvatarFallback className="text-3xl">
                {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
              {profileData.firstName} {profileData.lastName}
            </h1>
            <p className="text-muted-foreground text-lg">
              {profileData.userType}
            </p>
          </div>
          <div className="flex items-center justify-center gap-4">
            {getStatusBadge(profileData.status)}
            {getVerificationBadge(profileData.imageVerificationStatus)}
          </div>
        </div>

        {/* Profile Information Card */}
        <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <User className="h-5 w-5 text-primary" />
              Institute Profile Information
            </CardTitle>
            <CardDescription>
              Your profile details within the institute
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User ID */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <IdCard className="h-4 w-4" />
                  User ID
                </div>
                <div className="p-3 rounded-md bg-muted/50 border">
                  <p className="font-medium">{profileData.userId}</p>
                </div>
              </div>

              {/* Institute User ID */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <IdCard className="h-4 w-4" />
                  Institute User ID
                </div>
                <div className="p-3 rounded-md bg-muted/50 border">
                  <p className="font-medium">{profileData.userIdByInstitute}</p>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  Email Address
                </div>
                <div className="p-3 rounded-md bg-muted/50 border">
                  <p className="font-medium">{profileData.email}</p>
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </div>
                <div className="p-3 rounded-md bg-muted/50 border">
                  <p className="font-medium">{profileData.phoneNumber}</p>
                </div>
              </div>

              {/* Institute ID */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Building className="h-4 w-4" />
                  Institute ID
                </div>
                <div className="p-3 rounded-md bg-muted/50 border">
                  <p className="font-medium">{profileData.instituteId}</p>
                </div>
              </div>

              {/* Institute Card ID */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <IdCard className="h-4 w-4" />
                  Institute Card ID
                </div>
                <div className="p-3 rounded-md bg-muted/50 border">
                  <p className="font-medium">{profileData.instituteCardId || 'Not assigned'}</p>
                </div>
              </div>

              {/* User Type */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  User Type
                </div>
                <div className="p-3 rounded-md bg-muted/50 border">
                  <p className="font-medium">{profileData.userType}</p>
                </div>
              </div>

              {/* Image Verified By */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <CheckCircle className="h-4 w-4" />
                  Image Verified By
                </div>
                <div className="p-3 rounded-md bg-muted/50 border">
                  <p className="font-medium">{profileData.imageVerifiedBy || 'Not verified yet'}</p>
                </div>
              </div>

              {/* Created At */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Member Since
                </div>
                <div className="p-3 rounded-md bg-muted/50 border">
                  <p className="font-medium">
                    {new Date(profileData.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Updated At */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Last Updated
                </div>
                <div className="p-3 rounded-md bg-muted/50 border">
                  <p className="font-medium">
                    {new Date(profileData.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Active Status */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <CheckCircle className="h-4 w-4" />
                  Active Status
                </div>
                <div className="p-3 rounded-md bg-muted/50 border">
                  <p className="font-medium">{profileData.isActive ? 'Active' : 'Inactive'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InstituteProfile;
