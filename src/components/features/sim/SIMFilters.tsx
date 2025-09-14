import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Search, X, Filter } from "lucide-react";
import { CountrySelector } from "./CountrySelector";
import type { Country, Operator, SIMFilters as SIMFiltersType } from "@/types";

interface SIMFiltersProps {
  countries: Country[];
  operators: Operator[];
  filters: SIMFiltersType;
  onFiltersChange: (filters: SIMFiltersType) => void;
  onReset: () => void;
  loading?: boolean;
}

export const SIMFilters: React.FC<SIMFiltersProps> = ({
  countries,
  operators,
  filters,
  onFiltersChange,
  onReset,
  loading = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const selectedCountry = filters.countryId
    ? countries.find((c) => c.id === filters.countryId)
    : null;

  const filteredOperators = filters.countryId
    ? operators.filter((op) => op.country.id === filters.countryId)
    : operators;

  const selectedOperator = filters.operatorId
    ? operators.find((op) => op.id === filters.operatorId)
    : null;

  const updateFilters = (updates: Partial<SIMFiltersType>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== null && value !== ""
  );

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="w-5 h-5" />
            فیلترها
          </CardTitle>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="text-xs"
              >
                <X className="w-4 h-4 mr-1" />
                پاک کردن
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="lg:hidden"
            >
              {isExpanded ? "بستن" : "نمایش"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent
        className={`space-y-6 ${!isExpanded ? "hidden lg:block" : ""}`}
      >
        {/* Search */}
        <div className="space-y-2">
          <Label>جستجو</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="نام محصول یا توضیحات..."
              value={filters.searchTerm || ""}
              onChange={(e) => updateFilters({ searchTerm: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        <Separator />

        {/* Country Selection */}
        <div className="space-y-2">
          <Label>کشور</Label>
          <CountrySelector
            countries={countries}
            selectedCountry={selectedCountry}
            onCountrySelect={(country) => {
              updateFilters({
                countryId: country?.id,
                operatorId: undefined, // Reset operator when country changes
              });
            }}
            loading={loading}
            variant="select"
          />
        </div>

        {/* Operator Selection */}
        {filteredOperators.length > 0 && (
          <div className="space-y-2">
            <Label>اپراتور</Label>
            <div className="space-y-2">
              {selectedOperator && (
                <Badge variant="default" className="mr-2">
                  {selectedOperator.name.trim()}
                  <X
                    className="w-3 h-3 ml-1 cursor-pointer"
                    onClick={() => updateFilters({ operatorId: undefined })}
                  />
                </Badge>
              )}
              <div className="grid gap-2 max-h-32 overflow-y-auto">
                {filteredOperators
                  .filter((op) => op.isActive)
                  .map((operator) => (
                    <Button
                      key={operator.id}
                      variant={
                        filters.operatorId === operator.id
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        updateFilters({
                          operatorId:
                            operator.id === filters.operatorId
                              ? undefined
                              : operator.id,
                        })
                      }
                      className="justify-start text-right h-auto py-2"
                    >
                      <div className="text-right">
                        <div className="font-medium">
                          {operator.name.trim()}
                        </div>
                        <div className="text-xs opacity-75">
                          {operator.currency} • {operator.min}-{operator.max}
                        </div>
                      </div>
                    </Button>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* <Separator /> */}

        {/* Price Range */}
        {/* <div className="space-y-3">
          <Label>محدوده قیمت</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">حداقل</Label>
              <Input
                type="number"
                placeholder="0"
                value={filters.minPrice || ""}
                onChange={(e) =>
                  updateFilters({
                    minPrice: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
              />
            </div>
            <div>
              <Label className="text-xs">حداکثر</Label>
              <Input
                type="number"
                placeholder="∞"
                value={filters.maxPrice || ""}
                onChange={(e) =>
                  updateFilters({
                    maxPrice: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
              />
            </div>
          </div>
        </div> */}

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="pt-2">
            <div className="text-xs text-muted-foreground mb-2">
              فیلترهای فعال:
            </div>
            <div className="flex flex-wrap gap-1">
              {filters.searchTerm && (
                <Badge variant="secondary" className="text-xs">
                  جستجو: {filters.searchTerm}
                </Badge>
              )}
              {selectedCountry && (
                <Badge variant="secondary" className="text-xs">
                  کشور: {selectedCountry.name}
                </Badge>
              )}
              {selectedOperator && (
                <Badge variant="secondary" className="text-xs">
                  اپراتور: {selectedOperator.name.trim()}
                </Badge>
              )}
              {(filters.minPrice || filters.maxPrice) && (
                <Badge variant="secondary" className="text-xs">
                  قیمت: {filters.minPrice || 0} - {filters.maxPrice || "∞"}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
