import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, GraduationCap, User, UserCheck, Clock } from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { ImageSkeleton } from "./SkeletonLoader";
import parentDashboard from "@/assets/dashboards/parent-dashboard.png";
import attendanceDashboard from "@/assets/dashboards/attendance-dashboard.png";
import adminDashboard from "@/assets/dashboards/admin-dashboard.png";
import studentDashboard from "@/assets/dashboards/student-dashboard.png";
import teacherDashboard from "@/assets/dashboards/teacher-dashboard.jpg";
const WebsitePreviewSection = () => {
  const [activeTab, setActiveTab] = useState("parent");
  const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({});
  const isMobile = useIsMobile();
  const { elementRef, isVisible } = useIntersectionObserver();
  const categories = [{
    id: "parent",
    label: "Parent",
    icon: Users
  }, {
    id: "attendance",
    label: "Attendance Marker",
    icon: UserCheck
  }, {
    id: "admin",
    label: "Institute Admin",
    icon: Clock
  }, {
    id: "student",
    label: "Student",
    icon: GraduationCap
  }, {
    id: "teacher",
    label: "Teacher",
    icon: User
  }];
  
  const dashboardImages = {
    parent: parentDashboard,
    attendance: attendanceDashboard,
    admin: adminDashboard,
    student: studentDashboard,
    teacher: teacherDashboard
  };
  return <div ref={elementRef} className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-8 md:mb-12 lg:mb-16 max-w-4xl lg:max-w-6xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-4 md:mb-6 lg:mb-8 leading-tight">
            Trusted by Educators Worldwide
          </h2>
          <p className="text-muted-foreground text-base md:text-lg lg:text-xl xl:text-2xl leading-relaxed">
            Comprehensive learning management system designed for every role in the education ecosystem
          </p>
        </div>

        <Tabs defaultValue="parent" onValueChange={setActiveTab} className="w-full max-w-5xl md:max-w-7xl mx-auto">
          <div className="overflow-x-auto mb-4 md:mb-8">
            <TabsList className="flex w-full bg-muted/50 p-2 rounded-lg h-auto">
              {categories.map(category => <TabsTrigger key={category.id} value={category.id} className={`flex items-center justify-center gap-2 py-4 px-2 text-xs md:text-sm h-auto transition-all duration-300 ${
                  isMobile 
                    ? (activeTab === category.id ? 'flex-grow bg-primary text-primary-foreground' : 'flex-shrink-0 w-12') 
                    : 'flex-1'
                }`}>
                  <category.icon className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                  <span className={`leading-tight transition-all duration-300 ${
                    isMobile 
                      ? (activeTab === category.id ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden')
                      : 'opacity-100 block'
                  }`}>
                    {category.label}
                  </span>
                </TabsTrigger>)}
            </TabsList>
          </div>
          
          {/* Mobile active tab label */}
          <div className="sm:hidden text-center mb-6">
            
          </div>

          {categories.map(category => <TabsContent key={category.id} value={category.id} className="space-y-6 md:space-y-8">
              <div className="text-center max-w-full mx-auto">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 border border-primary/20 hover:border-primary/40 transition-all duration-500 hover:shadow-xl group">
                  {!imageLoaded[category.id] && <ImageSkeleton aspectRatio="16/9" />}
                  <img 
                    src={dashboardImages[category.id as keyof typeof dashboardImages]} 
                    alt={`${category.label} Dashboard - View comprehensive analytics and management tools`}
                    className={`w-full h-auto rounded-lg shadow-lg max-h-[600px] object-contain mx-auto transition-all duration-700 group-hover:scale-[1.02] ${imageLoaded[category.id] ? 'opacity-100' : 'opacity-0 absolute'}`}
                    onLoad={() => setImageLoaded(prev => ({ ...prev, [category.id]: true }))}
                    loading="lazy"
                  />
                </div>
              </div>
            </TabsContent>)}
        </Tabs>
      </div>
    </div>;
};
export default WebsitePreviewSection;