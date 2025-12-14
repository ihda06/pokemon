import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { usePokemonList } from "@/hooks/usePokemonList";
import { PokemonCard } from "@/components/PokemonCard";
import { PokemonCardSkeleton } from "@/components/PokemonCardSkeleton";
import { TypeFilter } from "@/components/TypeFilter";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getPokemonImageUrl } from "@/services/pokemon";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const pageVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
    },
  },
};

// Preload images for better performance
const preloadImages = (pokemonIds: number[]) => {
  pokemonIds.forEach((id) => {
    const img = new Image();
    img.src = getPokemonImageUrl(id);
  });
};

interface PokemonListProps {
  onPokemonClick?: (pokemonId: number) => void;
}

export function PokemonList({ onPokemonClick }: PokemonListProps) {
  const [page, setPage] = useState(1);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const limit = 20;
  const { data, isLoading, error, hasNextPage, hasPreviousPage, total } =
    usePokemonList({ page, limit, type: selectedType, searchQuery });

  // Preload images for current page
  useEffect(() => {
    if (data && data.length > 0) {
      const ids = data.map((p) => p.id);
      preloadImages(ids);
    }
  }, [data]);

  // Preload images for next page in background (only for non-filtered lists)
  useEffect(() => {
    if (hasNextPage && !isLoading && !selectedType) {
      const nextPageIds: number[] = [];
      const startId = page * limit + 1;
      for (let i = 0; i < limit; i++) {
        nextPageIds.push(startId + i);
      }
      // Preload next page images in background
      setTimeout(() => {
        preloadImages(nextPageIds);
      }, 1000);
    }
  }, [page, hasNextPage, isLoading, limit, selectedType]);

  const handleNextPage = () => {
    if (hasNextPage) {
      setPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePreviousPage = () => {
    if (hasPreviousPage) {
      setPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <p className="text-destructive text-lg font-medium">
          Error loading Pokemon. Please try again later.
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="mt-4"
          variant="outline"
        >
          Reload Page
        </Button>
      </motion.div>
    );
  }

  // Handle search change and reset page
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPage(1);
    // Clear type filter when searching
    if (query.trim()) {
      setSelectedType(null);
    }
  };

  // Handle type change and reset page
  const handleTypeChange = (type: string | null) => {
    setSelectedType(type);
    setPage(1);
    // Clear search when filtering by type
    if (type !== null) {
      setSearchQuery("");
    }
  };

  const isSearching = searchQuery.trim().length > 0;
  const displayData = data;
  const displayCount = displayData?.length || 0;

  return (
    <div className="space-y-8">
      {/* Search Bar and Filter */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-card/50 backdrop-blur-sm border-2 border-border/30 rounded-xl p-6 shadow-[0_4px_16px_var(--depth-shadow)]"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar value={searchQuery} onChange={handleSearchChange} />
          </div>
          <div className="shrink-0">
            <TypeFilter
              selectedType={selectedType}
              onTypeChange={handleTypeChange}
            />
          </div>
        </div>
      </motion.div>

      {/* Results Count */}
      {!isLoading && data && total !== undefined && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-muted-foreground font-medium"
        >
          {isSearching ? (
            <span>
              Found{" "}
              <span className="text-primary font-bold">{displayCount}</span>{" "}
              {displayCount === 1 ? "Pokemon" : "Pokemon"}
              {displayCount > 0 && (
                <>
                  {" "}
                  matching{" "}
                  <span className="text-primary font-bold">
                    &quot;{searchQuery}&quot;
                  </span>
                </>
              )}
            </span>
          ) : selectedType ? (
            <span>
              Showing{" "}
              <span className="text-primary font-bold">{displayCount}</span> of{" "}
              <span className="text-primary font-bold">{total}</span>{" "}
              {total === 1 ? "Pokemon" : "Pokemon"} of type{" "}
              <span className="text-primary font-bold capitalize">
                {selectedType}
              </span>
            </span>
          ) : (
            <span>
              Showing{" "}
              <span className="text-primary font-bold">{displayCount}</span>{" "}
              {total !== undefined && (
                <>
                  of <span className="text-primary font-bold">{total}</span>{" "}
                </>
              )}
              {displayCount === 1 ? "Pokemon" : "Pokemon"}
            </span>
          )}
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          >
            {Array.from({ length: limit }).map((_, index) => (
              <PokemonCardSkeleton key={index} />
            ))}
          </motion.div>
        ) : displayData && displayData.length > 0 ? (
          <motion.div
            key={`page-${page}-filter-${selectedType}-search-${searchQuery}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          >
            {displayData.map((pokemon, index) => (
              <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                index={index}
                onClick={() => onPokemonClick?.(pokemon.id)}
              />
            ))}
          </motion.div>
        ) : displayData && displayData.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            {isSearching ? (
              <>
                <p className="text-muted-foreground text-lg font-medium">
                  No Pokemon found matching{" "}
                  <span className="text-primary font-bold">
                    &quot;{searchQuery}&quot;
                  </span>
                </p>
                <Button
                  onClick={() => handleSearchChange("")}
                  className="mt-4"
                  variant="outline"
                >
                  Clear Search
                </Button>
              </>
            ) : (
              <>
                <p className="text-muted-foreground text-lg font-medium">
                  No Pokemon found for type{" "}
                  <span className="text-primary font-bold capitalize">
                    {selectedType}
                  </span>
                </p>
                <Button
                  onClick={() => handleTypeChange(null)}
                  className="mt-4"
                  variant="outline"
                >
                  Clear Filter
                </Button>
              </>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Pagination - Hide when searching */}
      {!isSearching && (hasNextPage || hasPreviousPage) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-4"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handlePreviousPage}
              disabled={!hasPreviousPage || isLoading}
              variant="outline"
              size="lg"
              className="gap-2 border-2 border-primary/30 hover:border-primary hover:bg-primary/10 font-display tracking-wide transition-all duration-300 disabled:opacity-50"
              style={{
                boxShadow: "0 4px 12px var(--depth-shadow)",
              }}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
          </motion.div>

          <motion.span
            className="text-sm font-bold font-display tracking-wider text-primary min-w-[80px] text-center px-4 py-2 rounded-lg border-2 border-border/30 bg-card/50 backdrop-blur-sm"
            key={page}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            Page {page}
          </motion.span>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleNextPage}
              disabled={!hasNextPage || isLoading}
              variant="outline"
              size="lg"
              className="gap-2 border-2 border-accent/30 hover:border-accent hover:bg-accent/10 font-display tracking-wide transition-all duration-300 disabled:opacity-50"
              style={{
                boxShadow: "0 4px 12px var(--depth-shadow)",
              }}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
