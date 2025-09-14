import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SIMProduct } from "@/types";
import { formatPrice } from "@/lib/utils";

interface SIMCardProps {
  product: SIMProduct;
  onSelect?: (product: SIMProduct) => void;
  onViewDetails?: (product: SIMProduct) => void;
}

export const SIMCard: React.FC<SIMCardProps> = ({
  product,
  // onSelect,
  onViewDetails,
}) => {
  // const handleSelect = () => {
  //   onSelect?.(product);
  // };

  const handleViewDetails = () => {
    onViewDetails?.(product);
  };

  return (
    <Card className="sim-card group hover:shadow-lg transition-all duration-300 border border-border/50 hover:border-primary/30 bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {product.description}
            </p>
          </div>
          {product.image && (
            <div className="ml-3 flex-shrink-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-12 h-12 rounded-lg object-cover border border-border"
              />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Operator and Country Info */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-xs">
              {product.operator.name.trim()}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {product.country.name} (+{product.country.callingCode})
            </Badge>
          </div>

          {/* Pricing */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-primary">
                {formatPrice(product.price)} تومان
              </span>
              <span className="text-sm text-muted-foreground">
                {product.operator.currency}
              </span>
            </div>

            {/* Exchange Rate Info */}
            {/* <div className="text-right text-xs text-muted-foreground">
              <div>نرخ: {formatPrice(product.operator.priceRate)}</div>
              <div>
                حد: {product.operator.min}-{product.operator.max}
              </div>
            </div> */}
          </div>

          {/* Action Buttons */}
          {/* <div className="flex gap-2 pt-2"> */}
            <Button onClick={handleViewDetails} size="sm" className="w-full flex-1 cursor-pointer">
              جزئیات
            </Button>
            {/* <Button
              onClick={handleViewDetails}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              جزئیات
            </Button> */}
          {/* </div> */}
        </div>
      </CardContent>
    </Card>
  );
};
