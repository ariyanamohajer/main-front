import { useState } from "react";
import { Package } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const LazyImage = ({ src, alt, className }: { src: string; alt: string, className?: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full  bg-muted rounded-lg overflow-hidden">
      {isLoading && <Skeleton className="absolute inset-0 w-full h-full" />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`w-full h-full object-cover transition-opacity duration-300 ${className} ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <Package className="h-12 w-12 text-muted-foreground" />
        </div>
      )}
    </div>
  );
};
