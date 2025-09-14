import { useQuery } from "@tanstack/react-query";
import { getCountries } from "@/services/sim";

export const useCountries = () => {
  return useQuery({
    queryKey: ["countries"],
    queryFn: getCountries,
    staleTime: 60 * 60 * 1000, // 1 hour - countries rarely change
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};