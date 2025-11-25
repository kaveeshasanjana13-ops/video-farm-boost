import ModernNavigation from "@/components/ModernNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ValidatedInput } from "@/components/ValidatedInput";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PhoneInput } from "@/components/ui/phone-input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Mail, Phone, MapPin, FileText, Upload, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const RegisterTeacher = () => {
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
    imageUrl: "",
    idUrl: ""
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <ModernNavigation />
      
      <div className="pt-24 pb-12 px-4 max-w-4xl mx-auto">
        {/* Official Notice Alert */}
        <Alert className="mb-6 border-red-500 bg-red-50 dark:bg-red-950/20">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <AlertTitle className="text-red-800 dark:text-red-400 font-bold">Teacher Registration - Contact Institute Required</AlertTitle>
        </Alert>

        <Card className="backdrop-blur-xl bg-card/95 border border-border/50 shadow-2xl opacity-75">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Teacher Registration
            </CardTitle>
            <CardDescription className="text-base sm:text-lg text-muted-foreground">
              Join as an educator and inspire the next generation of learners
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            <form className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
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
                    <PhoneInput
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(value) => setFormData({...formData, phoneNumber: value})}
                      className="bg-background/50 border-border/50"
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

              {/* Documents */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Documents
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Profile Image</Label>
                    <div className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Click to upload profile image</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>ID Document</Label>
                    <div className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Click to upload ID document</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <Button 
                  size="lg" 
                  className="px-8 py-3 text-lg" 
                  disabled
                  title="Registration currently disabled - Contact your institute or support"
                >
                  Register As a Teacher (Disabled)
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterTeacher;