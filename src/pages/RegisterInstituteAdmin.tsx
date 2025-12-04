import ModernNavigation from "@/components/ModernNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ValidatedInput } from "@/components/ValidatedInput";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User, Mail, MapPin, Upload, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { generateSignedUrl, uploadFileToSignedUrl, updateProfileImage } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const RegisterInstituteAdmin = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    nic: "",
    birthCertificateNo: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    district: "",
    province: "",
    postalCode: "",
    country: "Sri Lanka",
  });
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage || !userId) return;

    setIsUploading(true);
    try {
      // Step 1: Get signed URL
      const signedUrlResponse = await generateSignedUrl(selectedImage, 'profile');
      
      // Step 2: Upload file to S3 using POST with FormData
      await uploadFileToSignedUrl(selectedImage, signedUrlResponse);
      
      // Step 3: Update profile image with relative path
      await updateProfileImage({
        userId: userId,
        imageUrl: signedUrlResponse.relativePath
      });

      toast({
        title: "Success",
        description: "Profile image uploaded successfully!",
      });

      setShowImageDialog(false);
      window.location.href = '/';
    } catch (error) {
      console.error('Image upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload profile image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate successful registration
    // In real implementation, call your registration API here
    const mockUserId = "123"; // This should come from actual API response
    setUserId(mockUserId);
    setShowImageDialog(true);
    
    toast({
      title: "Registration Successful",
      description: "Please upload your profile image to complete registration.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <ModernNavigation />
      
      <div className="pt-24 pb-12 px-4 max-w-4xl mx-auto">
        <Alert className="mb-6 border-red-500 bg-red-50 dark:bg-red-950/20">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <AlertTitle className="text-red-800 dark:text-red-400 font-bold">Institute Admin Registration - Contact Required</AlertTitle>
        </Alert>

        <Card className="backdrop-blur-xl bg-card/95 border border-border/50 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Institute Admin Registration
            </CardTitle>
            <CardDescription className="text-base sm:text-lg text-muted-foreground">
              Create your administrator account to manage your educational institution
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="bg-background/50 border-border/50"
                      placeholder="Enter your first name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="bg-background/50 border-border/50"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                      className="bg-background/50 border-border/50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select onValueChange={(value) => setFormData({...formData, gender: value})}>
                      <SelectTrigger className="bg-background/50 border-border/50">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nic">NIC Number</Label>
                    <Input
                      id="nic"
                      value={formData.nic}
                      onChange={(e) => setFormData({...formData, nic: e.target.value})}
                      className="bg-background/50 border-border/50"
                      placeholder="Enter NIC number"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="birthCertificateNo">Birth Certificate No</Label>
                    <Input
                      id="birthCertificateNo"
                      value={formData.birthCertificateNo}
                      onChange={(e) => setFormData({...formData, birthCertificateNo: e.target.value})}
                      className="bg-background/50 border-border/50"
                      placeholder="Enter birth certificate number"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Contact Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="bg-background/50 border-border/50"
                      placeholder="Enter email address"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                      className="bg-background/50 border-border/50"
                      placeholder="+94771234567"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="bg-background/50 border-border/50"
                    placeholder="Enter secure password"
                  />
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Address Information
                </h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="addressLine1">Address Line 1</Label>
                    <Input
                      id="addressLine1"
                      value={formData.addressLine1}
                      onChange={(e) => setFormData({...formData, addressLine1: e.target.value})}
                      className="bg-background/50 border-border/50"
                      placeholder="Enter street address"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                    <Input
                      id="addressLine2"
                      value={formData.addressLine2}
                      onChange={(e) => setFormData({...formData, addressLine2: e.target.value})}
                      className="bg-background/50 border-border/50"
                      placeholder="Apartment, suite, etc."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="bg-background/50 border-border/50"
                        placeholder="Enter city"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="district">District</Label>
                      <Select onValueChange={(value) => setFormData({...formData, district: value})}>
                        <SelectTrigger className="bg-background/50 border-border/50">
                          <SelectValue placeholder="Select district" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="COLOMBO">Colombo</SelectItem>
                          <SelectItem value="GAMPAHA">Gampaha</SelectItem>
                          <SelectItem value="KALUTARA">Kalutara</SelectItem>
                          <SelectItem value="KANDY">Kandy</SelectItem>
                          <SelectItem value="MATALE">Matale</SelectItem>
                          <SelectItem value="NUWARA_ELIYA">Nuwara Eliya</SelectItem>
                          <SelectItem value="GALLE">Galle</SelectItem>
                          <SelectItem value="MATARA">Matara</SelectItem>
                          <SelectItem value="HAMBANTOTA">Hambantota</SelectItem>
                          <SelectItem value="JAFFNA">Jaffna</SelectItem>
                          <SelectItem value="KILINOCHCHI">Kilinochchi</SelectItem>
                          <SelectItem value="MANNAR">Mannar</SelectItem>
                          <SelectItem value="MULLAITIVU">Mullaitivu</SelectItem>
                          <SelectItem value="VAVUNIYA">Vavuniya</SelectItem>
                          <SelectItem value="TRINCOMALEE">Trincomalee</SelectItem>
                          <SelectItem value="BATTICALOA">Batticaloa</SelectItem>
                          <SelectItem value="AMPARA">Ampara</SelectItem>
                          <SelectItem value="KURUNEGALA">Kurunegala</SelectItem>
                          <SelectItem value="PUTTALAM">Puttalam</SelectItem>
                          <SelectItem value="ANURADHAPURA">Anuradhapura</SelectItem>
                          <SelectItem value="POLONNARUWA">Polonnaruwa</SelectItem>
                          <SelectItem value="BADULLA">Badulla</SelectItem>
                          <SelectItem value="MONARAGALA">Monaragala</SelectItem>
                          <SelectItem value="RATNAPURA">Ratnapura</SelectItem>
                          <SelectItem value="KEGALLE">Kegalle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="province">Province</Label>
                      <Select onValueChange={(value) => setFormData({...formData, province: value})}>
                        <SelectTrigger className="bg-background/50 border-border/50">
                          <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="WESTERN">Western</SelectItem>
                          <SelectItem value="CENTRAL">Central</SelectItem>
                          <SelectItem value="SOUTHERN">Southern</SelectItem>
                          <SelectItem value="NORTHERN">Northern</SelectItem>
                          <SelectItem value="EASTERN">Eastern</SelectItem>
                          <SelectItem value="NORTH_WESTERN">North Western</SelectItem>
                          <SelectItem value="NORTH_CENTRAL">North Central</SelectItem>
                          <SelectItem value="UVA">Uva</SelectItem>
                          <SelectItem value="SABARAGAMUWA">Sabaragamuwa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                        className="bg-background/50 border-border/50"
                        placeholder="Enter postal code"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={(e) => setFormData({...formData, country: e.target.value})}
                        className="bg-background/50 border-border/50"
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <Button 
                  type="submit"
                  size="lg" 
                  className="px-8 py-3 text-lg"
                >
                  Next
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Image Upload Dialog */}
        <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Profile Image</DialogTitle>
              <DialogDescription>
                Complete your registration by uploading a profile image
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {imagePreview ? (
                <div className="relative w-48 h-48 mx-auto">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover rounded-lg border-2 border-border"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview("");
                    }}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <label className="block border-2 border-dashed border-border/50 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-base font-medium text-foreground mb-1">Click to upload</p>
                  <p className="text-sm text-muted-foreground">JPG, PNG, WEBP</p>
                </label>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowImageDialog(false);
                    window.location.href = '/';
                  }}
                >
                  Skip
                </Button>
                <Button
                  type="button"
                  className="flex-1"
                  onClick={handleImageUpload}
                  disabled={!selectedImage || isUploading}
                >
                  {isUploading ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default RegisterInstituteAdmin;