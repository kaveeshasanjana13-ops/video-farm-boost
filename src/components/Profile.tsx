import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth, type UserRole } from '@/contexts/AuthContext';
import { AccessControl } from '@/utils/permissions';
import ProfileImageUpload from '@/components/ProfileImageUpload';
import { enhancedCachedClient } from '@/api/enhancedCachedClient';
import { apiClient } from '@/api/client'; // For POST operations
import { CACHE_TTL } from '@/config/cacheTTL';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit, Save, X, Lock, Download, FileText, CreditCard, Eye, EyeOff } from 'lucide-react';
import { useInstituteRole } from '@/hooks/useInstituteRole';
interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  userType: string;
  dateOfBirth: string;
  gender: string;
  imageUrl: string;
}
const Profile = () => {
  const {
    user
  } = useAuth();
  const instituteRole = useInstituteRole();
  const {
    toast
  } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '123 Main Street, City, State 12345',
    bio: 'Experienced educator with a passion for student success.',
    joinDate: '',
    dateOfBirth: '',
    gender: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState({
    currentPassword: false,
    newPassword: false,
    confirmNewPassword: false
  });
  const [activeProfileTab, setActiveProfileTab] = useState('details');
  const userPermissions = AccessControl.getPermissions(instituteRole);

  // Remove automatic loading - set default values instead
  const loadUserData = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      console.log('Fetching user data for ID:', user.id);
      const response = await enhancedCachedClient.get<UserData>(
        `/users/${user.id}`,
        {},
        {
          ttl: CACHE_TTL.USER_PROFILE,
          forceRefresh: false,
          userId: user.id
        }
      );
      console.log('User data response:', response);
      setUserData(response);

      // Update form data with API response
      setFormData({
        name: `${response.firstName} ${response.lastName}`,
        email: response.email,
        phone: response.phone,
        address: '123 Main Street, City, State 12345',
        bio: 'Experienced educator with a passion for student success.',
        joinDate: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '2023-01-15',
        dateOfBirth: response.dateOfBirth,
        gender: response.gender
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Error",
        description: "Failed to load user profile data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Initialize with default values
  React.useEffect(() => {
    if (user) {
      setFormData({
        name: `${user.firstName || ''} ${user.lastName || ''}`,
        email: user.email || '',
        phone: user.phone || '',
        address: '123 Main Street, City, State 12345',
        bio: 'Experienced educator with a passion for student success.',
        joinDate: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '2023-01-15',
        dateOfBirth: '',
        gender: ''
      });
    }
    setLoading(false);
  }, [user]);
  const handleSave = () => {
    // Save logic would go here
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };
  const handleCancel = () => {
    if (userData) {
      setFormData({
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        phone: userData.phone,
        address: '123 Main Street, City, State 12345',
        bio: 'Experienced educator with a passion for student success.',
        joinDate: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '2023-01-15',
        dateOfBirth: userData.dateOfBirth,
        gender: userData.gender
      });
    }
    setIsEditing(false);
  };
  const handleImageUpdate = (newImageUrl: string) => {
    if (userData) {
      setUserData({
        ...userData,
        imageUrl: newImageUrl
      });
    }
    console.log('Profile image updated:', newImageUrl);
  };

  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmNewPassword) {
      toast({
        title: "Error",
        description: "All password fields are required.",
        variant: "destructive"
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast({
        title: "Error", 
        description: "New passwords do not match.",
        variant: "destructive"
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long.",
        variant: "destructive"
      });
      return;
    }

    setPasswordLoading(true);
    try {
      const response = await apiClient.post('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmNewPassword: passwordData.confirmNewPassword
      });

      if (response.success) {
        toast({
          title: "Success",
          description: response.message || "Password changed successfully"
        });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        });
      }
    } catch (error: any) {
      console.error('Password change error:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to change password. Please try again.",
        variant: "destructive"
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  // Use the imageUrl from API response
  const currentImageUrl = userData?.imageUrl || '';
  const userTypeDisplay = userData?.userType || user?.userType || 'USER';
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-background to-background/80 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            <ProfileImageUpload currentImageUrl={currentImageUrl} onImageUpdate={handleImageUpdate} />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
              {formData.name || "Welcome"}
            </h1>
            <p className="text-muted-foreground text-lg">
              {userTypeDisplay} • Member since {formData.joinDate}
            </p>
          </div>
          <div className="flex items-center justify-center gap-4">
            <Badge variant="secondary" className="text-sm">
              <Shield className="h-3 w-3 mr-1" />
              {userTypeDisplay}
            </Badge>
            <div className="flex gap-2">
              {!isEditing ? <>
                  <Button variant="outline" size="sm" onClick={loadUserData} disabled={loading}>
                    Load Data
                  </Button>
                  
                </> : <>
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-1" />
                    Save Changes
                  </Button>
                </>}
            </div>
          </div>
        </div>

        {/* Main Content - Centered */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Personal Information - Centered */}
          <div className="lg:col-start-3 lg:col-span-8 space-y-6">
            <Tabs value={activeProfileTab} onValueChange={setActiveProfileTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-muted/50">
                <TabsTrigger 
                  value="details" 
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium transition-all"
                >
                  <span className="hidden sm:inline">Details</span>
                  <span className="sm:hidden">De</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="change-password" 
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium transition-all"
                >
                  <span className="hidden sm:inline">Change Password</span>
                  <span className="sm:hidden">Change Pa</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="user-id" 
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium transition-all"
                >
                  <span className="hidden sm:inline">User ID</span>
                  <span className="sm:hidden">Us</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-6">
                {/* Basic Information Card */}
                <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <User className="h-5 w-5 text-primary" />
                      Basic Information
                    </CardTitle>
                    <CardDescription>
                      Your fundamental personal details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                        {isEditing ? <Input id="name" value={formData.name} onChange={e => setFormData({
                        ...formData,
                        name: e.target.value
                      })} className="transition-all duration-200 focus:ring-2 focus:ring-primary/20" /> : <div className="p-3 rounded-md bg-muted/50 border">
                            <p className="font-medium">{formData.name}</p>
                          </div>}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                        {isEditing ? <Input id="email" type="email" value={formData.email} onChange={e => setFormData({
                        ...formData,
                        email: e.target.value
                      })} className="transition-all duration-200 focus:ring-2 focus:ring-primary/20" /> : <div className="p-3 rounded-md bg-muted/50 border flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <p className="font-medium">{formData.email}</p>
                          </div>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                         {isEditing ? <Input id="phone" value={formData.phone} onChange={e => setFormData({
                        ...formData,
                        phone: e.target.value
                      })} placeholder="+1 (555) 123-4567" className="transition-all duration-200 focus:ring-2 focus:ring-primary/20" /> : <div className="p-3 rounded-md bg-muted/50 border flex items-center gap-2">
                             <Phone className="h-4 w-4 text-muted-foreground" />
                             <p className="font-medium">{formData.phone || 'No phone number added'}</p>
                           </div>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth" className="text-sm font-medium">Date of Birth</Label>
                        {isEditing ? <Input id="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={e => setFormData({
                        ...formData,
                        dateOfBirth: e.target.value
                      })} className="transition-all duration-200 focus:ring-2 focus:ring-primary/20" /> : <div className="p-3 rounded-md bg-muted/50 border flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <p className="font-medium">{formData.dateOfBirth}</p>
                          </div>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gender" className="text-sm font-medium">Gender</Label>
                        {isEditing ? <Input id="gender" value={formData.gender} onChange={e => setFormData({
                        ...formData,
                        gender: e.target.value
                      })} className="transition-all duration-200 focus:ring-2 focus:ring-primary/20" /> : <div className="p-3 rounded-md bg-muted/50 border">
                            <p className="font-medium">{formData.gender}</p>
                          </div>}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Join Date</Label>
                        <div className="p-3 rounded-md bg-muted/50 border flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <p className="font-medium">{formData.joinDate}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">User Type</Label>
                        <div className="p-3 rounded-md bg-muted/50 border flex items-center gap-2">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          <p className="font-medium">{userData?.userType || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm font-medium">Address</Label>
                      {isEditing ? <Input id="address" value={formData.address} onChange={e => setFormData({
                      ...formData,
                      address: e.target.value
                    })} className="transition-all duration-200 focus:ring-2 focus:ring-primary/20" /> : <div className="p-3 rounded-md bg-muted/50 border flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <p className="font-medium">{formData.address}</p>
                        </div>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-sm font-medium">Biography</Label>
                      {isEditing ? <Textarea id="bio" rows={4} value={formData.bio} onChange={e => setFormData({
                      ...formData,
                      bio: e.target.value
                    })} className="transition-all duration-200 focus:ring-2 focus:ring-primary/20" placeholder="Tell us about yourself..." /> : <div className="p-4 rounded-md bg-muted/50 border">
                          <p className="text-sm leading-relaxed">{formData.bio}</p>
                        </div>}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="change-password" className="space-y-6">
                <Card className="border-0 shadow-xl bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-md">
                  <CardHeader className="pb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Lock className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-semibold">Change Password</CardTitle>
                        <CardDescription className="text-base mt-1">
                          Update your account password to keep your account secure
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="space-y-6">
                      <div className="relative">
                        <Label htmlFor="currentPassword" className="text-sm font-semibold text-foreground/80">
                          Current Password
                        </Label>
                        <div className="mt-2 relative">
                          <Input 
                            id="currentPassword" 
                            type={passwordVisibility.currentPassword ? "text" : "password"} 
                            placeholder="Enter your current password" 
                            value={passwordData.currentPassword} 
                            onChange={e => setPasswordData({
                              ...passwordData,
                              currentPassword: e.target.value
                            })} 
                            className="pr-10 h-12 bg-background/50 border-2 border-border/50 focus:border-primary/50 focus:bg-background transition-all duration-300 rounded-lg" 
                          />
                          <button
                            type="button"
                            onClick={() => setPasswordVisibility({
                              ...passwordVisibility,
                              currentPassword: !passwordVisibility.currentPassword
                            })}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors p-1"
                          >
                            {passwordVisibility.currentPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <Label htmlFor="newPassword" className="text-sm font-semibold text-foreground/80">
                          New Password
                        </Label>
                        <div className="mt-2 relative">
                          <Input 
                            id="newPassword" 
                            type={passwordVisibility.newPassword ? "text" : "password"} 
                            placeholder="Enter your new password" 
                            value={passwordData.newPassword} 
                            onChange={e => setPasswordData({
                              ...passwordData,
                              newPassword: e.target.value
                            })} 
                            className="pr-10 h-12 bg-background/50 border-2 border-border/50 focus:border-primary/50 focus:bg-background transition-all duration-300 rounded-lg" 
                          />
                          <button
                            type="button"
                            onClick={() => setPasswordVisibility({
                              ...passwordVisibility,
                              newPassword: !passwordVisibility.newPassword
                            })}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors p-1"
                          >
                            {passwordVisibility.newPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Password must be at least 8 characters long
                        </p>
                      </div>
                      
                      <div className="relative">
                        <Label htmlFor="confirmPassword" className="text-sm font-semibold text-foreground/80">
                          Confirm New Password
                        </Label>
                        <div className="mt-2 relative">
                          <Input 
                            id="confirmPassword" 
                            type={passwordVisibility.confirmNewPassword ? "text" : "password"} 
                            placeholder="Confirm your new password" 
                            value={passwordData.confirmNewPassword} 
                            onChange={e => setPasswordData({
                              ...passwordData,
                              confirmNewPassword: e.target.value
                            })}
                            className="pr-10 h-12 bg-background/50 border-2 border-border/50 focus:border-primary/50 focus:bg-background transition-all duration-300 rounded-lg" 
                          />
                          <button
                            type="button"
                            onClick={() => setPasswordVisibility({
                              ...passwordVisibility,
                              confirmNewPassword: !passwordVisibility.confirmNewPassword
                            })}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors p-1"
                          >
                            {passwordVisibility.confirmNewPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <Button 
                          onClick={handlePasswordChange}
                          disabled={passwordLoading}
                          className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                        >
                          <Lock className="h-4 w-4 mr-2" />
                          {passwordLoading ? "Updating..." : "Update Password"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="user-id" className="space-y-6">
                <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                  <CardHeader className="pb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-primary/10">
                        <CreditCard className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold">User ID Management</CardTitle>
                        <CardDescription className="text-sm mt-1">
                          Manage identification documents and digital credentials
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3">
                      <Button variant="outline" className="h-auto w-full justify-start p-4 border hover:border-primary/30 hover:bg-accent/50 transition-all duration-200 group">
                        <div className="flex items-center gap-3 w-full">
                          <div className="p-2.5 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors">
                            <Download className="h-5 w-5 text-primary" />
                          </div>
                          <div className="text-left flex-1">
                            <div className="font-semibold text-sm">Download ID Card</div>
                            <div className="text-xs text-muted-foreground">Get your official ID document</div>
                          </div>
                        </div>
                      </Button>
                      
                      <Button variant="outline" className="h-auto w-full justify-start p-4 border hover:border-primary/30 hover:bg-accent/50 transition-all duration-200 group">
                        <div className="flex items-center gap-3 w-full">
                          <div className="p-2.5 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div className="text-left flex-1">
                            <div className="font-semibold text-sm">Request Physical ID Card</div>
                            <div className="text-xs text-muted-foreground">Apply for a new ID document</div>
                          </div>
                        </div>
                      </Button>
                      
                      <Button variant="outline" className="h-auto w-full justify-start p-4 border hover:border-primary/30 hover:bg-accent/50 transition-all duration-200 group">
                        <div className="flex items-center gap-3 w-full">
                          <div className="p-2.5 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors">
                            <CreditCard className="h-5 w-5 text-primary" />
                          </div>
                          <div className="text-left flex-1">
                            <div className="font-semibold text-sm">Virtual ID Card</div>
                            <div className="text-xs text-muted-foreground">Access your digital ID card</div>
                          </div>
                        </div>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>;
};
export default Profile;