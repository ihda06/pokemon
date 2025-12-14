import { useQuery } from "@tanstack/react-query";
import { getPokemonDetails } from "@/services/pokemon";
import type { PokemonDetailsResponse } from "@/types/pokemon";

interface UsePokemonDetailsReturn {
  data: PokemonDetailsResponse | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const usePokemonDetails = (
  id: number | null
): UsePokemonDetailsReturn => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["pokemon-details", id],
    queryFn: () => getPokemonDetails(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  return {
    data,
    isLoading,
    error: error as Error | null,
    refetch,
  };
};
