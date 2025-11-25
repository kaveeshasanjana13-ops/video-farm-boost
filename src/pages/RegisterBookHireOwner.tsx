import ModernNavigation from "@/components/ModernNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Mail, Phone, MapPin, Building2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const RegisterBookHireOwner = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    ownerName: "",
    phoneNumber: "",
    businessName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    businessLicense: ""
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <ModernNavigation />
      
      <div className="pt-24 pb-12 px-4 max-w-4xl mx-auto">
        {/* Official Notice Alert */}
        <Alert className="mb-6 border-red-500 bg-red-50 dark:bg-red-950/20">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <AlertTitle className="text-red-800 dark:text-red-400 font-bold">Book Hire Owner Registration - Contact Required</AlertTitle>
        </Alert>

        <Card className="backdrop-blur-xl bg-card/95 border border-border/50 shadow-2xl opacity-75">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Book Hire Owner Registration
            </CardTitle>
            <CardDescription className="text-base sm:text-lg text-muted-foreground">
              Partner with us to provide educational resources to students
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            <form className="space-y-6">
              {/* Owner Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Owner Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ownerName">Owner Name</Label>
                    <Input
                      id="ownerName"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                      className="bg-background/50 border-border/50"
                      placeholder="Kamal Perera"
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="bg-background/50 border-border/50"
                      placeholder="owner@example.com"
                    />
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
              </div>

              {/* Business Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Business Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                      className="bg-background/50 border-border/50"
                      placeholder="Perera Book Hire"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="businessLicense">Business License</Label>
                    <Input
                      id="businessLicense"
                      value={formData.businessLicense}
                      onChange={(e) => setFormData({...formData, businessLicense: e.target.value})}
                      className="bg-background/50 border-border/50"
                      placeholder="LIC-2025-BOOK-001"
                    />
                  </div>
                </div>
              </div>

              {/* Business Address */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Business Address
                </h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Business Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="bg-background/50 border-border/50"
                      placeholder="123 Main Street"
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
                        placeholder="Colombo"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => setFormData({...formData, state: e.target.value})}
                        className="bg-background/50 border-border/50"
                        placeholder="Western Province"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pin Code</Label>
                      <Input
                        id="pincode"
                        value={formData.pincode}
                        onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                        className="bg-background/50 border-border/50"
                        placeholder="10100"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-muted/20 rounded-lg p-6 space-y-3">
                <h4 className="font-semibold text-foreground">Business Partnership Benefits:</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Reach thousands of students and educational institutions</li>
                  <li>• Manage your book inventory digitally</li>
                  <li>• Track rentals and returns efficiently</li>
                  <li>• Get detailed analytics and reports</li>
                  <li>• Secure payment processing</li>
                </ul>
              </div>

              <div className="flex justify-end pt-6">
                <Button 
                  size="lg" 
                  className="px-8 py-3 text-lg" 
                  disabled
                  title="Registration requires business verification - Contact official support"
                >
                  Register As Book Hire Owner (Disabled)
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterBookHireOwner;