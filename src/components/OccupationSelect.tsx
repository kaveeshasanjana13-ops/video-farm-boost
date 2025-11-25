import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const occupations = [
  // Education & Training
  { value: "TEACHER", label: "Teacher" },
  { value: "LECTURER", label: "Lecturer" },
  { value: "PRINCIPAL", label: "Principal" },
  { value: "TUITION_TEACHER", label: "Tuition Teacher" },
  { value: "SCHOOL_COUNSELOR", label: "School Counselor" },
  { value: "TUITION_INSTITUTE_OWNER", label: "Tuition Institute Owner" },
  { value: "LIBRARIAN", label: "Librarian" },
  
  // Healthcare & Medical
  { value: "NURSE", label: "Nurse" },
  { value: "DOCTOR", label: "Doctor" },
  { value: "PHARMACIST", label: "Pharmacist" },
  { value: "LABORATORY_TECHNICIAN", label: "Laboratory Technician" },
  { value: "MIDWIFE", label: "Midwife" },
  { value: "DENTIST", label: "Dentist" },
  { value: "VETERINARY_DOCTOR", label: "Veterinary Doctor" },
  { value: "PHARMACIST_ASSISTANT", label: "Pharmacist Assistant" },
  { value: "MEDICAL_REPRESENTATIVE", label: "Medical Representative" },
  
  // Engineering & Technical
  { value: "ENGINEER", label: "Engineer" },
  { value: "CIVIL_ENGINEER", label: "Civil Engineer" },
  { value: "ARCHITECT", label: "Architect" },
  { value: "QUANTITY_SURVEYOR", label: "Quantity Surveyor" },
  { value: "SURVEYOR", label: "Surveyor" },
  { value: "DRAFTSMAN", label: "Draftsman" },
  { value: "TECHNICIAN", label: "Technician" },
  { value: "AIR_CONDITIONING_TECHNICIAN", label: "Air Conditioning Technician" },
  { value: "AUTO_ELECTRICIAN", label: "Auto Electrician" },
  { value: "MOBILE_TECHNICIAN", label: "Mobile Technician" },
  { value: "COMPUTER_TECHNICIAN", label: "Computer Technician" },
  { value: "CCTV_INSTALLER", label: "CCTV Installer" },
  
  // IT & Technology
  { value: "IT_OFFICER", label: "IT Officer" },
  { value: "SOFTWARE_DEVELOPER", label: "Software Developer" },
  { value: "WEB_DEVELOPER", label: "Web Developer" },
  { value: "GRAPHIC_DESIGNER", label: "Graphic Designer" },
  { value: "CONTENT_CREATOR", label: "Content Creator" },
  { value: "YOUTUBER", label: "YouTuber" },
  { value: "DATA_ENTRY_OPERATOR", label: "Data Entry Operator" },
  { value: "SOCIAL_MEDIA_MARKETER", label: "Social Media Marketer" },
  
  // Business & Finance
  { value: "ACCOUNTANT", label: "Accountant" },
  { value: "BANK_OFFICER", label: "Bank Officer" },
  { value: "INSURANCE_AGENT", label: "Insurance Agent" },
  { value: "MARKETING_EXECUTIVE", label: "Marketing Executive" },
  { value: "ENTREPRENEUR", label: "Entrepreneur" },
  { value: "BUSINESS_OWNER", label: "Business Owner" },
  { value: "SHOP_OWNER", label: "Shop Owner" },
  { value: "BOUTIQUE_OWNER", label: "Boutique Owner" },
  { value: "GROCERY_SHOP_OWNER", label: "Grocery Shop Owner" },
  { value: "TAILORING_SHOP_OWNER", label: "Tailoring Shop Owner" },
  { value: "BEAUTY_SALON_OWNER", label: "Beauty Salon Owner" },
  { value: "BARBER_SHOP_OWNER", label: "Barber Shop Owner" },
  { value: "CONSULTANT", label: "Consultant" },
  { value: "MANAGER", label: "Manager" },
  { value: "SUPERVISOR", label: "Supervisor" },
  { value: "HR_OFFICER", label: "HR Officer" },
  { value: "HR_EXECUTIVE", label: "HR Executive" },
  { value: "PROCUREMENT_OFFICER", label: "Procurement Officer" },
  
  // Administrative & Clerical
  { value: "CLERK", label: "Clerk" },
  { value: "CASHIER", label: "Cashier" },
  { value: "RECEPTIONIST", label: "Receptionist" },
  { value: "CASH_COLLECTOR", label: "Cash Collector" },
  { value: "STORE_KEEPER", label: "Store Keeper" },
  { value: "STORE_MANAGER", label: "Store Manager" },
  { value: "WAREHOUSE_ASSISTANT", label: "Warehouse Assistant" },
  
  // Sales & Customer Service
  { value: "SALES_EXECUTIVE", label: "Sales Executive" },
  { value: "SALESMAN", label: "Salesman" },
  { value: "SHOP_ASSISTANT", label: "Shop Assistant" },
  { value: "CALL_CENTER_AGENT", label: "Call Center Agent" },
  { value: "CALL_CENTER_SUPERVISOR", label: "Call Center Supervisor" },
  
  // Transportation & Logistics
  { value: "DRIVER", label: "Driver" },
  { value: "BUS_DRIVER", label: "Bus Driver" },
  { value: "TUK_TUK_DRIVER", label: "Tuk Tuk Driver" },
  { value: "TAXI_DRIVER", label: "Taxi Driver" },
  { value: "HEAVY_VEHICLE_DRIVER", label: "Heavy Vehicle Driver" },
  { value: "DELIVERY_RIDER", label: "Delivery Rider" },
  { value: "DELIVERY_PARTNER", label: "Delivery Partner" },
  { value: "DELIVERY_HELPER", label: "Delivery Helper" },
  { value: "DELIVERY_DISPATCHER", label: "Delivery Dispatcher" },
  { value: "BUS_CONDUCTOR", label: "Bus Conductor" },
  { value: "DRIVER_ASSISTANT", label: "Driver Assistant" },
  { value: "CRANE_OPERATOR", label: "Crane Operator" },
  { value: "FORKLIFT_OPERATOR", label: "Forklift Operator" },
  { value: "BUS_OWNER", label: "Bus Owner" },
  { value: "VEHICLE_INSPECTOR", label: "Vehicle Inspector" },
  { value: "BOATMAN", label: "Boatman" },
  { value: "FERRY_OPERATOR", label: "Ferry Operator" },
  
  // Agriculture & Farming
  { value: "FARMER", label: "Farmer" },
  { value: "TEA_ESTATE_WORKER", label: "Tea Estate Worker" },
  { value: "RUBBER_TAPPER", label: "Rubber Tapper" },
  { value: "COCONUT_FARMER", label: "Coconut Farmer" },
  { value: "PADDY_FARMER", label: "Paddy Farmer" },
  { value: "SPICE_CULTIVATOR", label: "Spice Cultivator" },
  { value: "VEGETABLE_CULTIVATOR", label: "Vegetable Cultivator" },
  { value: "POULTRY_FARMER", label: "Poultry Farmer" },
  { value: "LIVESTOCK_FARMER", label: "Livestock Farmer" },
  { value: "DAIRY_FARMER", label: "Dairy Farmer" },
  
  // Fishing & Marine
  { value: "FISHERMAN", label: "Fisherman" },
  { value: "FISHER", label: "Fisher" },
  { value: "NET_REPAIRER", label: "Net Repairer" },
  { value: "FISH_SELLER", label: "Fish Seller" },
  
  // Security & Defense
  { value: "POLICE_OFFICER", label: "Police Officer" },
  { value: "SOLDIER", label: "Soldier" },
  { value: "NAVY", label: "Navy" },
  { value: "AIR_FORCE", label: "Air Force" },
  { value: "SECURITY_GUARD", label: "Security Guard" },
  { value: "SECURITY_SUPERVISOR", label: "Security Supervisor" },
  { value: "WATCHMAN", label: "Watchman" },
  
  // Construction & Skilled Trades
  { value: "MECHANIC", label: "Mechanic" },
  { value: "BUS_MECHANIC", label: "Bus Mechanic" },
  { value: "LIGHT_VEHICLE_MECHANIC", label: "Light Vehicle Mechanic" },
  { value: "ELECTRICIAN", label: "Electrician" },
  { value: "PLUMBER", label: "Plumber" },
  { value: "CARPENTER", label: "Carpenter" },
  { value: "MASON", label: "Mason" },
  { value: "WELDER", label: "Welder" },
  { value: "PAINTER_BUILDING", label: "Painter (Building)" },
  { value: "PAINTER_VEHICLE", label: "Painter (Vehicle)" },
  { value: "CONSTRUCTION_WORKER", label: "Construction Worker" },
  
  // Fashion & Beauty
  { value: "TAILOR", label: "Tailor" },
  { value: "DRESSMAKER", label: "Dressmaker" },
  { value: "FASHION_DESIGNER", label: "Fashion Designer" },
  { value: "TAILORING_ASSISTANT", label: "Tailoring Assistant" },
  { value: "HAIRDRESSER", label: "Hairdresser" },
  { value: "BEAUTICIAN", label: "Beautician" },
  { value: "BARBER", label: "Barber" },
  
  // Food & Hospitality
  { value: "CHEF", label: "Chef" },
  { value: "COOK", label: "Cook" },
  { value: "BAKER", label: "Baker" },
  { value: "PASTRY_CHEF", label: "Pastry Chef" },
  { value: "WAITER", label: "Waiter" },
  { value: "WAITRESS", label: "Waitress" },
  { value: "HOTEL_STAFF", label: "Hotel Staff" },
  { value: "TOUR_GUIDE", label: "Tour Guide" },
  
  // Arts & Entertainment
  { value: "ARTIST", label: "Artist" },
  { value: "MUSICIAN", label: "Musician" },
  { value: "DANCER", label: "Dancer" },
  { value: "PHOTOGRAPHER", label: "Photographer" },
  { value: "VIDEOGRAPHER", label: "Videographer" },
  { value: "PHOTOGRAPHER_ASSISTANT", label: "Photographer Assistant" },
  { value: "CAMERAMAN", label: "Cameraman" },
  { value: "ACTOR", label: "Actor" },
  { value: "ACTRESS", label: "Actress" },
  { value: "SINGER", label: "Singer" },
  { value: "MUSIC_TEACHER", label: "Music Teacher" },
  { value: "PAINTER_ARTIST", label: "Painter (Artist)" },
  
  // Fitness & Sports
  { value: "GYM_INSTRUCTOR", label: "Gym Instructor" },
  { value: "SPORTS_COACH", label: "Sports Coach" },
  { value: "FITNESS_TRAINER", label: "Fitness Trainer" },
  
  // Domestic & Personal Services
  { value: "HOUSEWIFE", label: "Housewife" },
  { value: "HOUSEMAID", label: "Housemaid" },
  { value: "DOMESTIC_WORKER", label: "Domestic Worker" },
  { value: "GARDENER", label: "Gardener" },
  { value: "CLEANER", label: "Cleaner" },
  { value: "JANITOR", label: "Janitor" },
  
  // Manual Labor & General Work
  { value: "FACTORY_WORKER", label: "Factory Worker" },
  { value: "LABOURER", label: "Labourer" },
  { value: "FRUIT_SELLER", label: "Fruit Seller" },
  { value: "STREET_VENDOR", label: "Street Vendor" },
  { value: "SMALL_BUSINESS_VENDOR", label: "Small Business Vendor" },
  
  // Government & Public Service
  { value: "CIVIL_SERVANT", label: "Civil Servant" },
  { value: "GOVERNMENT_OFFICER", label: "Government Officer" },
  { value: "GRAMA_NILADHARI", label: "Grama Niladhari" },
  { value: "POSTMAN", label: "Postman" },
  
  // Legal & Professional Services
  { value: "LAWYER", label: "Lawyer" },
  { value: "LEGAL_OFFICER", label: "Legal Officer" },
  
  // Research & Academia
  { value: "RESEARCHER", label: "Researcher" },
  { value: "SCIENTIST", label: "Scientist" },
  
  // Social & Community Services
  { value: "SOCIAL_WORKER", label: "Social Worker" },
  { value: "NGO_WORKER", label: "NGO Worker" },
  { value: "NGO_FIELD_OFFICER", label: "NGO Field Officer" },
  { value: "VOLUNTEER_WORKER", label: "Volunteer Worker" },
  
  // Religious & Spiritual
  { value: "PRIEST", label: "Priest" },
  { value: "MONK", label: "Monk" },
  { value: "IMAM", label: "Imam" },
  { value: "RELIGIOUS_LEADER", label: "Religious Leader" },
  
  // Media & Communication
  { value: "JOURNALIST", label: "Journalist" },
  { value: "REPORTER", label: "Reporter" },
  
  // Property & Real Estate
  { value: "LANDLORD", label: "Landlord" },
  { value: "LANDLADY", label: "Landlady" },
  
  // Student & Employment Status
  { value: "STUDENT_SCHOOL", label: "Student (School)" },
  { value: "STUDENT_UNIVERSITY", label: "Student (University)" },
  { value: "RETIRED_PERSON", label: "Retired Person" },
  { value: "UNEMPLOYED", label: "Unemployed" },
];

interface OccupationSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function OccupationSelect({ value, onChange }: OccupationSelectProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-background/50 border-border/50"
        >
          {value
            ? occupations.find((occupation) => occupation.value === value)?.label
            : "Select occupation..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 z-[100]" align="start">
        <Command>
          <CommandInput placeholder="Search occupation..." />
          <CommandList>
            <CommandEmpty>No occupation found.</CommandEmpty>
            <CommandGroup>
              {occupations.map((occupation) => (
                <CommandItem
                  key={occupation.value}
                  value={occupation.label}
                  onSelect={() => {
                    onChange(occupation.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === occupation.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {occupation.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
