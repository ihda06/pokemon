import { useQuery } from "@tanstack/react-query";
import {
  getPokemonList,
  getPokemonByType,
  searchPokemonByName,
} from "@/services/pokemon";
import type { PokemonDetailsResponse } from "@/types/pokemon";

interface UsePokemonListParams {
  page?: number;
  limit?: number;
  type?: string | null;
  searchQuery?: string;
}

interface UsePokemonListReturn {
  data: PokemonDetailsResponse[] | undefined;
  total: number | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const usePokemonList = ({
  page = 1,
  limit = 20,
  type = null,
  searchQuery = "",
}: UsePokemonListParams = {}): UsePokemonListReturn => {
  const offset = (page - 1) * limit;
  const isSearching = searchQuery.trim().length > 0;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["pokemon-list", page, limit, type, searchQuery],
    queryFn: () => {
      if (isSearching) {
        return searchPokemonByName(searchQuery);
      }
      if (type) {
        return getPokemonByType(type, offset, limit);
      }
      return getPokemonList(offset, limit);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: true,
  });

  return {
    data: data?.pokemon,
    total: data?.total,
    isLoading,
    error: error as Error | null,
    refetch,
    hasNextPage: !!data?.next,
    hasPreviousPage: !!data?.previous,
  };
};
