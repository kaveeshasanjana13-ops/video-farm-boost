import { env } from "@/config/env";
import ModernNavigation from "@/components/ModernNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ValidatedInput } from "@/components/ValidatedInput";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PhoneInput } from "@/components/ui/phone-input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Mail, Phone, MapPin, Briefcase, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SimpleLocationSelector } from "@/components/SimpleLocationSelector";

const RegisterParent = () => {
  const [formData, setFormData] = useState({
    // User info
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    nic: "",
    addressLine1: "",
    city: "",
    district: "",
    province: "",
    postalCode: "",
    country: "Sri Lanka",
    // Parent info
    occupation: "",
    workplace: "",
    workPhone: "",
    educationLevel: ""
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <ModernNavigation />
      
      <div className="pt-24 pb-12 px-4 max-w-4xl mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img 
            src={env.logoUrl} 
            alt="SurakshaLMS Logo" 
            className="h-20 md:h-24 object-contain"
          />
        </div>

        {/* Official Notice Alert */}
        <Alert className="mb-6 border-red-500 bg-red-50 dark:bg-red-950/20">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <AlertTitle className="text-red-800 dark:text-red-400 font-bold">Parent Registration - Contact Institute Required</AlertTitle>
        </Alert>

        <Card className="backdrop-blur-xl bg-card/95 border border-border/50 shadow-2xl opacity-75">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Parent Registration
            </CardTitle>
            <CardDescription className="text-base sm:text-lg text-muted-foreground">
              Join our community to support your child's educational journey
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            <form className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Users className="w-5 h-5" />
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
                      placeholder="Michael"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="bg-background/50 border-border/50"
                      placeholder="Fernando"
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

                <div className="space-y-2">
                  <Label htmlFor="nic">NIC Number</Label>
                  <Input
                    id="nic"
                    value={formData.nic}
                    onChange={(e) => setFormData({...formData, nic: e.target.value})}
                    className="bg-background/50 border-border/50"
                    placeholder="801234567V"
                  />
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
                      placeholder="michael.fernando@example.com"
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
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Professional Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input
                      id="occupation"
                      value={formData.occupation}
                      onChange={(e) => setFormData({...formData, occupation: e.target.value})}
                      className="bg-background/50 border-border/50"
                      placeholder="Software Engineer"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="workplace">Workplace</Label>
                    <Input
                      id="workplace"
                      value={formData.workplace}
                      onChange={(e) => setFormData({...formData, workplace: e.target.value})}
                      className="bg-background/50 border-border/50"
                      placeholder="Tech Solutions Pvt Ltd"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="workPhone">Work Phone</Label>
                    <PhoneInput
                      id="workPhone"
                      value={formData.workPhone}
                      onChange={(value) => setFormData({...formData, workPhone: value})}
                      className="bg-background/50 border-border/50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="educationLevel">Education Level</Label>
                    <Select onValueChange={(value) => setFormData({...formData, educationLevel: value})}>
                      <SelectTrigger className="bg-background/50 border-border/50">
                        <SelectValue placeholder="Select education level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High School">High School</SelectItem>
                        <SelectItem value="Diploma">Diploma</SelectItem>
                        <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
                        <SelectItem value="Master's Degree">Master's Degree</SelectItem>
                        <SelectItem value="Doctorate">Doctorate</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                      placeholder="45 Flower Road"
                    />
                  </div>

                <SimpleLocationSelector
                  province={formData.province}
                  district={formData.district}
                  city={formData.city}
                  postalCode={formData.postalCode}
                  onProvinceChange={(value) => setFormData({ ...formData, province: value })}
                  onDistrictChange={(value) => setFormData({ ...formData, district: value })}
                  onCityChange={(value) => setFormData({ ...formData, city: value })}
                  onPostalCodeChange={(value) => setFormData({ ...formData, postalCode: value })}
                />

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

              <div className="flex justify-end pt-6">
                <Button 
                  size="lg" 
                  className="px-8 py-3 text-lg" 
                  disabled
                  title="Registration currently disabled - Contact your child's institute or support"
                >
                  Register As a Parent (Disabled)
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterParent;