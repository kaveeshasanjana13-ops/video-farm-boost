import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// Province enum
export enum Province {
  WESTERN = "WESTERN",
  CENTRAL = "CENTRAL", 
  SOUTHERN = "SOUTHERN",
  NORTHERN = "NORTHERN",
  EASTERN = "EASTERN",
  NORTH_WESTERN = "NORTH_WESTERN",
  NORTH_CENTRAL = "NORTH_CENTRAL",
  UVA = "UVA",
  SABARAGAMUWA = "SABARAGAMUWA",
}

// District enum
export enum District {
  // Western Province
  COLOMBO = "COLOMBO",
  GAMPAHA = "GAMPAHA",
  KALUTARA = "KALUTARA",

  // Central Province
  KANDY = "KANDY",
  MATALE = "MATALE",
  NUWARA_ELIYA = "NUWARA_ELIYA",

  // Southern Province
  GALLE = "GALLE",
  MATARA = "MATARA",
  HAMBANTOTA = "HAMBANTOTA",

  // Northern Province
  JAFFNA = "JAFFNA",
  KILINOCHCHI = "KILINOCHCHI",
  MANNAR = "MANNAR",
  MULLAITIVU = "MULLAITIVU",
  VAVUNIYA = "VAVUNIYA",

  // Eastern Province
  TRINCOMALEE = "TRINCOMALEE",
  BATTICALOA = "BATTICALOA",
  AMPARA = "AMPARA",

  // North Western Province
  KURUNEGALA = "KURUNEGALA",
  PUTTALAM = "PUTTALAM",

  // North Central Province
  ANURADHAPURA = "ANURADHAPURA",
  POLONNARUWA = "POLONNARUWA",

  // Uva Province
  BADULLA = "BADULLA",
  MONARAGALA = "MONARAGALA",

  // Sabaragamuwa Province
  RATNAPURA = "RATNAPURA",
  KEGALLE = "KEGALLE",
}

// Display names for provinces
const provinceDisplayNames: Record<Province, string> = {
  [Province.WESTERN]: "Western",
  [Province.CENTRAL]: "Central",
  [Province.SOUTHERN]: "Southern",
  [Province.NORTHERN]: "Northern",
  [Province.EASTERN]: "Eastern",
  [Province.NORTH_WESTERN]: "North Western",
  [Province.NORTH_CENTRAL]: "North Central",
  [Province.UVA]: "Uva",
  [Province.SABARAGAMUWA]: "Sabaragamuwa",
};

// Display names for districts
const districtDisplayNames: Record<District, string> = {
  [District.COLOMBO]: "Colombo",
  [District.GAMPAHA]: "Gampaha",
  [District.KALUTARA]: "Kalutara",
  [District.KANDY]: "Kandy",
  [District.MATALE]: "Matale",
  [District.NUWARA_ELIYA]: "Nuwara Eliya",
  [District.GALLE]: "Galle",
  [District.MATARA]: "Matara",
  [District.HAMBANTOTA]: "Hambantota",
  [District.JAFFNA]: "Jaffna",
  [District.KILINOCHCHI]: "Kilinochchi",
  [District.MANNAR]: "Mannar",
  [District.MULLAITIVU]: "Mullaitivu",
  [District.VAVUNIYA]: "Vavuniya",
  [District.TRINCOMALEE]: "Trincomalee",
  [District.BATTICALOA]: "Batticaloa",
  [District.AMPARA]: "Ampara",
  [District.KURUNEGALA]: "Kurunegala",
  [District.PUTTALAM]: "Puttalam",
  [District.ANURADHAPURA]: "Anuradhapura",
  [District.POLONNARUWA]: "Polonnaruwa",
  [District.BADULLA]: "Badulla",
  [District.MONARAGALA]: "Monaragala",
  [District.RATNAPURA]: "Ratnapura",
  [District.KEGALLE]: "Kegalle",
};

interface SimpleLocationSelectorProps {
  province: string;
  district: string;
  city: string;
  postalCode: string;
  onProvinceChange: (value: string) => void;
  onDistrictChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onPostalCodeChange: (value: string) => void;
  disabled?: boolean;
}

export const SimpleLocationSelector = ({
  province,
  district,
  city,
  postalCode,
  onProvinceChange,
  onDistrictChange,
  onCityChange,
  onPostalCodeChange,
  disabled = false
}: SimpleLocationSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="province">Province</Label>
        <Select 
          value={province} 
          onValueChange={onProvinceChange}
          disabled={disabled}
        >
          <SelectTrigger className="bg-background/50 border-border/50">
            <SelectValue placeholder="Select province" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            {Object.values(Province).map((prov) => (
              <SelectItem key={prov} value={prov}>
                {provinceDisplayNames[prov]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="district">District</Label>
        <Select 
          value={district} 
          onValueChange={onDistrictChange}
          disabled={disabled}
        >
          <SelectTrigger className="bg-background/50 border-border/50">
            <SelectValue placeholder="Select district" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            {Object.values(District).map((dist) => (
              <SelectItem key={dist} value={dist}>
                {districtDisplayNames[dist]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
          className="bg-background/50 border-border/50"
          placeholder="Enter city name"
          disabled={disabled}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="postalCode">Postal Code</Label>
        <Input
          id="postalCode"
          value={postalCode}
          onChange={(e) => onPostalCodeChange(e.target.value)}
          className="bg-background/50 border-border/50"
          placeholder="Enter postal code"
          disabled={disabled}
        />
      </div>
    </div>
  );
};
