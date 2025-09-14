import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Globe } from "lucide-react";
import type { Country } from "@/types";

interface CountrySelectorProps {
  countries: Country[];
  selectedCountry?: Country | null;
  onCountrySelect: (country: Country | null) => void;
  loading?: boolean;
  variant?: "select" | "grid" | "compact";
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  countries,
  selectedCountry,
  onCountrySelect,
  loading = false,
  variant = "select",
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.callingCode.includes(searchTerm)
  );

  if (variant === "select") {
    return (
      <Select
        value={selectedCountry?.id.toString() || "all"}
        onValueChange={(value) => {
          if (value === "all") {
            onCountrySelect(null);
          } else {
            const country = countries.find((c) => c.id.toString() === value);
            onCountrySelect(country || null);
          }
        }}
        disabled={loading}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="انتخاب کشور..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">همه کشورها</SelectItem>
          {countries.map((country) => (
            <SelectItem key={country.id} value={country.id.toString()}>
              <div className="flex items-center gap-2">
                <span>{country.name}</span>
                <Badge variant="outline" className="text-xs">
                  +{country.callingCode}
                </Badge>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-2">
        <Globe className="w-4 h-4 text-muted-foreground" />
        <Select
          value={selectedCountry?.id.toString() || "all"}
          onValueChange={(value) => {
            if (value === "all") {
              onCountrySelect(null);
            } else {
              const country = countries.find((c) => c.id.toString() === value);
              onCountrySelect(country || null);
            }
          }}
          disabled={loading}
        >
          <SelectTrigger className="w-[200px] h-8">
            <SelectValue placeholder="کشور..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه</SelectItem>
            {countries.map((country) => (
              <SelectItem key={country.id} value={country.id.toString()}>
                {country.name} (+{country.callingCode})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  // Grid variant
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="جستجو کشور یا کد..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Clear Selection */}
      {selectedCountry && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">انتخاب شده:</span>
            <Badge variant="default">
              {selectedCountry.name} (+{selectedCountry.callingCode})
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCountrySelect(null)}
          >
            پاک کردن
          </Button>
        </div>
      )}

      {/* Countries Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
        {filteredCountries.map((country) => (
          <Card
            key={country.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedCountry?.id === country.id
                ? "ring-2 ring-primary border-primary bg-primary/5"
                : "hover:border-primary/30"
            }`}
            onClick={() => onCountrySelect(country)}
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{country.name}</span>
                <Badge variant="outline" className="text-xs">
                  +{country.callingCode}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCountries.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Globe className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>کشوری یافت نشد</p>
        </div>
      )}
    </div>
  );
};
