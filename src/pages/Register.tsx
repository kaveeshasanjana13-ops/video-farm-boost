import { env } from "@/config/env";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, BookOpen } from "lucide-react";
import ModernNavigation from "@/components/ModernNavigation";
import Footer from "@/components/Footer";

const Register = () => {
  const registrationOptions = [
    {
      title: "Institute Admin",
      description: "Register your educational institution and manage all operations",
      icon: BookOpen,
      href: "/register/institute-admin",
      gradient: "from-primary/20 to-primary-dark/20"
    },
    {
      title: "Teacher",
      description: "Join as an educator and start teaching students",
      icon: Users,
      href: "/register/teacher",
      gradient: "from-accent/20 to-accent-dark/20"
    },
    {
      title: "Student",
      description: "Begin your learning journey and enroll in courses",
      icon: GraduationCap,
      href: "/register/student",
      gradient: "from-secondary/20 to-secondary-dark/20"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <ModernNavigation />
      
      <main className="container mx-auto px-4 pt-32 pb-20">
        <div className="text-center mb-16 space-y-4">
          <div className="flex justify-center mb-8">
            <img 
              src={env.logoUrl} 
              alt="SurakshaLMS Logo" 
              className="h-20 md:h-24 object-contain"
            />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary-dark to-accent bg-clip-text text-transparent">
            Registration
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Begin your educational journey with us
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {registrationOptions.map((option) => (
            <Card 
              key={option.title}
              className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl cursor-pointer group"
              onClick={() => window.location.href = option.href}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              
              <CardHeader className="relative z-10 text-center pt-8">
                <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-2xl w-fit">
                  <option.icon className="w-12 h-12 text-primary" />
                </div>
                <CardTitle className="text-2xl">{option.title}</CardTitle>
                <CardDescription className="text-base mt-2">
                  {option.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="relative z-10 text-center pb-8">
                <Button 
                  className="w-full bg-primary hover:bg-primary-dark transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = option.href;
                  }}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Register;
