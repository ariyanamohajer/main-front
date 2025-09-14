import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Operator } from "@/types";
import { formatPrice } from "@/lib/utils";

interface OperatorCardProps {
  operator: Operator;
  onSelect?: (operator: Operator) => void;
  onViewProducts?: (operator: Operator) => void;
  isSelected?: boolean;
}

export const OperatorCard: React.FC<OperatorCardProps> = ({
  operator,
  onSelect,
  onViewProducts,
  isSelected = false,
}) => {
  const handleSelect = () => {
    onSelect?.(operator);
  };

  const handleViewProducts = () => {
    onViewProducts?.(operator);
  };

  return (
    <Card
      className={`group hover:shadow-lg transition-all duration-300 cursor-pointer ${
        isSelected
          ? "ring-2 ring-primary border-primary bg-primary/5"
          : "border border-border/50 hover:border-primary/30 bg-card"
      }`}
      onClick={handleSelect}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                {operator.name.trim()}
              </h3>
              {operator.isActive ? (
                <Badge
                  variant="default"
                  className="text-xs bg-green-500 hover:bg-green-600"
                >
                  فعال
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">
                  غیرفعال
                </Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {operator.country.name} (+{operator.country.callingCode})
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Currency and Rate */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">ارز:</span>
              <span className="font-medium ml-2">{operator.currency}</span>
            </div>
            <div>
              <span className="text-muted-foreground">نرخ:</span>
              <span className="font-medium ml-2">
                {formatPrice(operator.priceRate)}
              </span>
            </div>
          </div>

          {/* Min/Max Range */}
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="text-xs text-muted-foreground mb-1">
              محدوده قیمت
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">
                حداقل: {formatPrice(operator.min)}
              </span>
              <span className="text-sm">
                حداکثر: {formatPrice(operator.max)}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleViewProducts();
            }}
            variant={isSelected ? "default" : "outline"}
            size="sm"
            className="w-full"
            disabled={!operator.isActive}
          >
            مشاهده محصولات
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
