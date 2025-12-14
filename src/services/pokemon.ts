import axios from "axios";
import type {
  PokemonListResponse,
  PokemonDetailsResponse,
  PokemonListItem,
  TypeResponse,
} from "@/types/pokemon";

const BASE_URL = "https://pokeapi.co/api/v2";

// Extract Pokemon ID from URL
const extractIdFromUrl = (url: string): number => {
  const matches = url.match(/\/(\d+)\/$/);
  return matches ? parseInt(matches[1], 10) : 0;
};

// Fetch Pokemon details by ID
const fetchPokemonDetails = async (
  id: number
): Promise<PokemonDetailsResponse> => {
  const response = await axios.get<PokemonDetailsResponse>(
    `${BASE_URL}/pokemon/${id}`
  );
  return response.data;
};

// Get paginated Pokemon list
export const getPokemonList = async (
  offset: number = 0,
  limit: number = 20
): Promise<{
  pokemon: PokemonDetailsResponse[];
  total: number;
  next: string | null;
  previous: string | null;
}> => {
  try {
    // First, get the list of Pokemon
    const listResponse = await axios.get<PokemonListResponse>(
      `${BASE_URL}/pokemon`,
      {
        params: { offset, limit },
      }
    );

    const { results, count, next, previous } = listResponse.data;

    // Fetch details for each Pokemon in parallel
    const pokemonDetails = await Promise.all(
      results.map(async (item: PokemonListItem) => {
        const id = extractIdFromUrl(item.url);
        return fetchPokemonDetails(id);
      })
    );

    return {
      pokemon: pokemonDetails,
      total: count,
      next,
      previous,
    };
  } catch (error) {
    console.error("Error fetching Pokemon list:", error);
    throw error;
  }
};

// Get individual Pokemon details by ID
export const getPokemonDetails = async (
  id: number
): Promise<PokemonDetailsResponse> => {
  try {
    const response = await axios.get<PokemonDetailsResponse>(
      `${BASE_URL}/pokemon/${id}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching Pokemon ${id}:`, error);
    throw error;
  }
};

// Get Pokemon image URL
export const getPokemonImageUrl = (id: number): string => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
};

// Fallback image URL
export const getPokemonImageUrlFallback = (id: number): string => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
};

// Get Pokemon by type
export const getPokemonByType = async (
  type: string,
  offset: number = 0,
  limit: number = 20
): Promise<{
  pokemon: PokemonDetailsResponse[];
  total: number;
  next: string | null;
  previous: string | null;
}> => {
  try {
    // Fetch type information
    const typeResponse = await axios.get<TypeResponse>(
      `${BASE_URL}/type/${type}`
    );

    const { pokemon: typePokemonList } = typeResponse.data;
    const total = typePokemonList.length;

    // Apply pagination
    const paginatedList = typePokemonList.slice(offset, offset + limit);
    const next = offset + limit < total ? "has-next" : null;
    const previous = offset > 0 ? "has-previous" : null;

    // Fetch details for each Pokemon in parallel
    const pokemonDetails = await Promise.all(
      paginatedList.map(async (item) => {
        const id = extractIdFromUrl(item.pokemon.url);
        return fetchPokemonDetails(id);
      })
    );

    return {
      pokemon: pokemonDetails,
      total,
      next,
      previous,
    };
  } catch (error) {
    console.error(`Error fetching Pokemon by type ${type}:`, error);
    throw error;
  }
};

// Search Pokemon by name
export const searchPokemonByName = async (
  searchQuery: string
): Promise<{
  pokemon: PokemonDetailsResponse[];
  total: number;
  next: string | null;
  previous: string | null;
}> => {
  try {
    if (!searchQuery.trim()) {
      return {
        pokemon: [],
        total: 0,
        next: null,
        previous: null,
      };
    }

    const query = searchQuery.toLowerCase().trim();

    // Try exact match first
    try {
      const exactMatch = await axios.get<PokemonDetailsResponse>(
        `${BASE_URL}/pokemon/${query}`
      );
      return {
        pokemon: [exactMatch.data],
        total: 1,
        next: null,
        previous: null,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (exactError) {
      // If exact match fails, search through a large list
      // Fetch a larger list to search through (up to 1000 Pokemon)
      const searchLimit = 1000;
      const listResponse = await axios.get<PokemonListResponse>(
        `${BASE_URL}/pokemon`,
        {
          params: { offset: 0, limit: searchLimit },
        }
      );

      const { results } = listResponse.data;

      // Filter results by name
      const matchingResults = results.filter((item) =>
        item.name.toLowerCase().includes(query)
      );

      if (matchingResults.length === 0) {
        return {
          pokemon: [],
          total: 0,
          next: null,
          previous: null,
        };
      }

      // Fetch details for matching Pokemon (limit to 50 for performance)
      const limitedResults = matchingResults.slice(0, 50);
      const pokemonDetails = await Promise.all(
        limitedResults.map(async (item) => {
          const id = extractIdFromUrl(item.url);
          return fetchPokemonDetails(id);
        })
      );

      return {
        pokemon: pokemonDetails,
        total: matchingResults.length,
        next: matchingResults.length > 50 ? "has-next" : null,
        previous: null,
      };
    }
  } catch (error) {
    console.error(`Error searching Pokemon by name ${searchQuery}:`, error);
    throw error;
  }
};
