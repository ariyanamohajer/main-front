import { useQuery } from "@tanstack/react-query";
import { getOperators, getOperator, getAllOperators } from "@/services/sim";
import type { OperatorsQueryParams, Country } from "@/types";

export const useOperators = (params?: OperatorsQueryParams) => {
  return useQuery({
    queryKey: ["operators", params],
    queryFn: () => getOperators(params!),
    enabled: !!params?.countryId, // Only fetch when countryId is provided
    staleTime: 10 * 60 * 1000, // 10 minutes - operators don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useOperator = (operatorId: number | null) => {
  return useQuery({
    queryKey: ["operator", operatorId],
    queryFn: () => getOperator(operatorId!),
    enabled: !!operatorId,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useAllOperators = (countries: Country[]) => {
  return useQuery({
    queryKey: ["all-operators", countries.length],
    queryFn: () => getAllOperators(countries),
    enabled: countries.length > 0,
    staleTime: 20 * 60 * 1000, // 20 minutes - don't refetch too often
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};
