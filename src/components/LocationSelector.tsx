import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { sriLankaLocations, Province, District, City } from "@/data/sriLankaLocations";
import { useEffect, useState } from "react";

interface LocationSelectorProps {
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

export const LocationSelector = ({
  province,
  district,
  city,
  postalCode,
  onProvinceChange,
  onDistrictChange,
  onCityChange,
  onPostalCodeChange,
  disabled = false
}: LocationSelectorProps) => {
  const [availableDistricts, setAvailableDistricts] = useState<District[]>([]);
  const [availableCities, setAvailableCities] = useState<City[]>([]);

  // Update available districts when province changes
  useEffect(() => {
    if (province) {
      const selectedProvince = sriLankaLocations.find(p => p.value === province);
      if (selectedProvince) {
        setAvailableDistricts(selectedProvince.districts);
      } else {
        setAvailableDistricts([]);
      }
      // Reset district, city, and postal code when province changes
      onDistrictChange("");
      onCityChange("");
      onPostalCodeChange("");
    } else {
      setAvailableDistricts([]);
    }
  }, [province]);

  // Update available cities when district changes
  useEffect(() => {
    if (district && availableDistricts.length > 0) {
      const selectedDistrict = availableDistricts.find(d => d.value === district);
      if (selectedDistrict) {
        setAvailableCities(selectedDistrict.cities);
      } else {
        setAvailableCities([]);
      }
      // Reset city and postal code when district changes
      onCityChange("");
      onPostalCodeChange("");
    } else {
      setAvailableCities([]);
    }
  }, [district, availableDistricts]);

  // Auto-set postal code when city is selected
  const handleCityChange = (selectedCity: string) => {
    onCityChange(selectedCity);
    const cityData = availableCities.find(c => c.name === selectedCity);
    if (cityData) {
      onPostalCodeChange(cityData.postalCode);
    }
  };

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
            {sriLankaLocations.map((prov) => (
              <SelectItem key={prov.value} value={prov.value}>
                {prov.name}
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
          disabled={disabled || !province || availableDistricts.length === 0}
        >
          <SelectTrigger className="bg-background/50 border-border/50">
            <SelectValue placeholder={province ? "Select district" : "Select province first"} />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            {availableDistricts.map((dist) => (
              <SelectItem key={dist.value} value={dist.value}>
                {dist.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        <Select 
          value={city} 
          onValueChange={handleCityChange}
          disabled={disabled || !district || availableCities.length === 0}
        >
          <SelectTrigger className="bg-background/50 border-border/50">
            <SelectValue placeholder={district ? "Select city" : "Select district first"} />
          </SelectTrigger>
          <SelectContent className="bg-popover max-h-[300px]">
            {availableCities.map((cityItem) => (
              <SelectItem key={cityItem.name} value={cityItem.name}>
                {cityItem.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="postalCode">Postal Code</Label>
        <Input
          id="postalCode"
          value={postalCode}
          onChange={(e) => onPostalCodeChange(e.target.value)}
          className="bg-background/50 border-border/50"
          placeholder="Auto-filled"
          disabled={disabled}
          readOnly
        />
      </div>
    </div>
  );
};
