import { motion } from "motion/react";
import { Ruler, Weight, Zap, Heart, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { usePokemonDetails } from "@/hooks/usePokemonDetails";
import {
  getPokemonImageUrl,
  getPokemonImageUrlFallback,
} from "@/services/pokemon";
import { typeColors, statNames } from "@/constants/pokemon";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

type SpriteVariantKey =
  | "regular-male"
  | "regular-female"
  | "shiny-male"
  | "shiny-female";

interface SpriteVariant {
  key: SpriteVariantKey;
  url: string | null;
  label: string;
}

interface PokemonDetailModalProps {
  pokemonId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PokemonDetailModal({
  pokemonId,
  open,
  onOpenChange,
}: PokemonDetailModalProps) {
  const { data: pokemon, isLoading } = usePokemonDetails(pokemonId);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [selectedVariant, setSelectedVariant] =
    useState<SpriteVariantKey>("regular-male");

  // Extract sprite variants from API response
  const getSpriteVariants = (): SpriteVariant[] => {
    if (!pokemon?.sprites) return [];

    const animated =
      pokemon.sprites.versions?.["generation-v"]?.["black-white"]?.animated;
    const variants: SpriteVariant[] = [];

    // Regular Male
    if (animated?.front_default) {
      variants.push({
        key: "regular-male",
        url: animated.front_default,
        label: "Regular Male",
      });
    }

    // Regular Female
    if (animated?.front_female) {
      variants.push({
        key: "regular-female",
        url: animated.front_female,
        label: "Regular Female",
      });
    }

    // Shiny Male
    if (animated?.front_shiny) {
      variants.push({
        key: "shiny-male",
        url: animated.front_shiny,
        label: "Shiny Male",
      });
    }

    // Shiny Female
    if (animated?.front_shiny_female) {
      variants.push({
        key: "shiny-female",
        url: animated.front_shiny_female,
        label: "Shiny Female",
      });
    }

    return variants;
  };

  const spriteVariants = getSpriteVariants();

  // Get current selected sprite URL
  const getCurrentSpriteUrl = (): string | null => {
    const variant = spriteVariants.find((v) => v.key === selectedVariant);
    return variant?.url || null;
  };

  const currentSpriteUrl = getCurrentSpriteUrl();

  // Reset variant when pokemon changes
  useEffect(() => {
    if (pokemon && spriteVariants.length > 0) {
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => {
        setSelectedVariant(spriteVariants[0].key);
        setImageError(false);
        setImageLoaded(false);
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pokemon?.id]);

  // Preload sprite when variant changes
  useEffect(() => {
    if (!pokemon || !open || !currentSpriteUrl) return;

    let isMounted = true;
    const img = new Image();

    img.onload = () => {
      if (isMounted) {
        setImageError(false);
        setImageLoaded(true);
      }
    };
    img.onerror = () => {
      // Try fallback static image
      const fallbackUrl = getPokemonImageUrl(pokemon.id);
      const fallbackImg = new Image();
      fallbackImg.onload = () => {
        if (isMounted) {
          setImageError(true);
          setImageLoaded(true);
        }
      };
      fallbackImg.onerror = () => {
        if (isMounted) {
          setImageError(true);
          setImageLoaded(true);
        }
      };
      fallbackImg.src = fallbackUrl;
    };
    img.src = currentSpriteUrl;

    return () => {
      isMounted = false;
    };
  }, [pokemon, open, currentSpriteUrl]);

  if (!pokemonId) return null;

  const primaryType = pokemon?.types[0]?.type.name || "normal";
  const typeColor = typeColors[primaryType] || typeColors.normal;

  // Fallback to static images if animated sprites fail
  const getFallbackImageUrl = (): string => {
    if (!pokemon) return "";
    return imageError
      ? getPokemonImageUrlFallback(pokemon.id)
      : getPokemonImageUrl(pokemon.id);
  };

  const fallbackImageUrl = getFallbackImageUrl();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={true}
        className={cn(
          "min-w-[200px] sm:min-w-[900px] md:min-w-[1000px]",
          "max-w-6xl w-[95vw] sm:w-[90vw] md:w-[85vw]",
          "max-h-[90vh] overflow-y-auto md:overflow-hidden p-0",
          "bg-linear-to-br from-card/95 to-card/90",
          "border-2 border-border/50",
          "backdrop-blur-xl",
          "shadow-[0_16px_64px_var(--depth-shadow)]",
          typeColor.bg
        )}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        ) : pokemon ? (
          <div className="flex flex-col md:flex-row max-h-[90vh] overflow-y-auto md:overflow-hidden">
            {/* Left Section - Image */}
            <div
              className={cn(
                "flex flex-col items-center justify-center p-4 md:p-12 relative",
                "bg-linear-to-br from-background/90 via-background/70 to-background/50",
                "md:w-2/5 md:border-r-2 border-border/50",
                "min-h-[200px] md:min-h-0",
                "shrink-0"
              )}
            >
              {/* Subtle geometric pattern overlay */}
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 2px 2px, var(--foreground) 1px, transparent 0)",
                  backgroundSize: "40px 40px",
                }}
              />
              {/* Main Image */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0, x: -20 }}
                animate={{ scale: 1, opacity: 1, x: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="relative mb-3 md:mb-6"
              >
                {imageLoaded && currentSpriteUrl ? (
                  <motion.div
                    className="relative"
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    key={selectedVariant}
                  >
                    <motion.img
                      src={imageError ? fallbackImageUrl : currentSpriteUrl}
                      alt={`${pokemon.name} ${selectedVariant}`}
                      className="h-32 w-32 sm:h-40 sm:w-40 md:h-80 md:w-80 object-contain relative z-10"
                      style={{
                        filter:
                          selectedVariant.includes("shiny") && !imageError
                            ? "drop-shadow(0 12px 32px rgba(250,204,21,0.6)) drop-shadow(0 8px 16px rgba(250,204,21,0.4))"
                            : "drop-shadow(0 12px 32px var(--glow-cyan)) drop-shadow(0 8px 16px var(--glow-vermilion))",
                      }}
                      initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                      }}
                      onError={() => {
                        // Fallback to static image if animated sprite fails
                        if (!imageError) {
                          setImageError(true);
                        }
                      }}
                    />
                    {/* Animated glow rings */}
                    <motion.div
                      className="absolute inset-0 rounded-full blur-3xl opacity-40"
                      style={{
                        background:
                          selectedVariant.includes("shiny") && !imageError
                            ? "radial-gradient(circle, rgba(250,204,21,0.6), transparent 70%)"
                            : `radial-gradient(circle, ${typeColor.text.replace(
                                "text-",
                                ""
                              )}, transparent 70%)`,
                      }}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </motion.div>
                ) : (
                  <div className="h-32 w-32 sm:h-40 sm:w-40 md:h-80 md:w-80 bg-muted rounded-full animate-pulse" />
                )}
              </motion.div>

              {/* Variant Thumbnails */}
              {spriteVariants.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex gap-1.5 md:gap-2 flex-wrap justify-center mb-2 md:mb-0"
                >
                  {spriteVariants.map((variant) => (
                    <motion.button
                      key={variant.key}
                      onClick={() => setSelectedVariant(variant.key)}
                      className={cn(
                        "relative flex flex-col items-center gap-1 p-1.5 rounded-lg border-2 transition-all duration-300",
                        "hover:scale-105 hover:shadow-md bg-background/50",
                        selectedVariant === variant.key
                          ? "border-primary shadow-[0_2px_8px_var(--glow-vermilion)] scale-105 bg-primary/10"
                          : "border-border/50 hover:border-primary/50"
                      )}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="relative">
                        <img
                          src={variant.url || ""}
                          alt={variant.label}
                          className="h-8 w-8 md:h-12 md:w-12 object-contain"
                          onError={(e) => {
                            // Hide broken images
                            e.currentTarget.style.display = "none";
                          }}
                        />
                        {selectedVariant === variant.key && (
                          <motion.div
                            className="absolute inset-0 bg-primary/20 pointer-events-none rounded"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          />
                        )}
                      </div>
                      <span
                        className={cn(
                          "text-[10px] font-medium font-display tracking-wide capitalize leading-tight",
                          selectedVariant === variant.key
                            ? "text-primary"
                            : "text-muted-foreground"
                        )}
                      >
                        {variant.label}
                      </span>
                    </motion.button>
                  ))}
                </motion.div>
              )}

              {/* Pokemon Name with High Contrast */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-2 md:mt-6 text-center"
              >
                <motion.h2
                  className={cn(
                    "text-xl sm:text-2xl md:text-4xl font-display font-bold capitalize mb-2 md:mb-3 tracking-wider",
                    "relative inline-block"
                  )}
                >
                  {/* Glowing text shadow */}
                  <span
                    className={cn(
                      "absolute inset-0 blur-lg opacity-60",
                      typeColor.text
                    )}
                    aria-hidden="true"
                    style={{
                      filter: "blur(12px)",
                      textShadow: `0 0 20px var(--glow-vermilion), 0 0 40px var(--glow-cyan)`,
                    }}
                  >
                    {pokemon.name}
                  </span>
                  <span
                    className="relative bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        "linear-gradient(135deg, var(--primary), var(--accent), var(--chart-3))",
                      WebkitBackgroundClip: "text",
                      filter: "drop-shadow(0 2px 8px var(--glow-vermilion))",
                    }}
                  >
                    {pokemon.name}
                  </span>
                </motion.h2>

                {/* ID Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mb-2 md:mb-4"
                >
                  <span className="text-sm font-semibold text-muted-foreground bg-background/80 px-3 py-1 rounded-full">
                    #{String(pokemon.id).padStart(4, "0")}
                  </span>
                </motion.div>

                {/* Type Badges */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center justify-center gap-2 flex-wrap"
                >
                  {pokemon.types.map((type) => {
                    const typeName = type.type.name;
                    const typeColor = typeColors[typeName] || typeColors.normal;
                    return (
                      <Badge
                        key={type.slot}
                        variant="outline"
                        className={cn(
                          "capitalize font-medium font-display tracking-wide px-3 py-1 text-sm",
                          typeColor.bg,
                          typeColor.text,
                          "border-2 border-current/30",
                          "shadow-[0_2px_8px_var(--depth-shadow)]"
                        )}
                      >
                        {typeName}
                      </Badge>
                    );
                  })}
                </motion.div>
              </motion.div>
            </div>

            {/* Right Section - Stats and Info */}
            <div className="flex-1 md:overflow-y-auto md:max-h-[90vh] bg-background/50 backdrop-blur-sm">
              <DialogHeader className="px-6 pt-6 pb-4 border-b-2 border-border/50">
                <h3 className="text-xl font-bold font-display tracking-wide text-primary">
                  Pokemon Details
                </h3>
              </DialogHeader>
              <div className="px-6 py-6 space-y-6">
                {/* Basic Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <motion.div
                    className="flex items-center gap-3 p-4 rounded-lg border-2 border-border/30 bg-muted/30 hover:bg-muted/50 hover:border-primary/30 transition-all duration-300"
                    whileHover={{ scale: 1.02, x: 4 }}
                  >
                    <Ruler
                      className="h-5 w-5 text-primary"
                      style={{
                        filter: "drop-shadow(0 0 4px var(--glow-vermilion))",
                      }}
                    />
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">
                        Height
                      </p>
                      <p className="font-bold text-primary">
                        {(pokemon.height / 10).toFixed(1)} m
                      </p>
                    </div>
                  </motion.div>
                  <motion.div
                    className="flex items-center gap-3 p-4 rounded-lg border-2 border-border/30 bg-muted/30 hover:bg-muted/50 hover:border-primary/30 transition-all duration-300"
                    whileHover={{ scale: 1.02, x: 4 }}
                  >
                    <Weight
                      className="h-5 w-5 text-primary"
                      style={{
                        filter: "drop-shadow(0 0 4px var(--glow-cyan))",
                      }}
                    />
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">
                        Weight
                      </p>
                      <p className="font-bold text-accent">
                        {(pokemon.weight / 10).toFixed(1)} kg
                      </p>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Abilities */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-lg font-semibold font-display tracking-wide mb-3 flex items-center gap-2 text-primary">
                    <Zap
                      className="h-5 w-5 text-primary"
                      style={{
                        filter: "drop-shadow(0 0 4px var(--glow-vermilion))",
                      }}
                    />
                    Abilities
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {pokemon.abilities.map((ability) => (
                      <Badge
                        key={ability.slot}
                        variant="secondary"
                        className="capitalize"
                      >
                        {ability.ability.name.replace("-", " ")}
                        {ability.is_hidden && (
                          <span className="ml-1 text-xs opacity-70">
                            (Hidden)
                          </span>
                        )}
                      </Badge>
                    ))}
                  </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h3 className="text-lg font-semibold font-display tracking-wide mb-3 flex items-center gap-2 text-primary">
                    <TrendingUp
                      className="h-5 w-5 text-primary"
                      style={{
                        filter: "drop-shadow(0 0 4px var(--glow-cyan))",
                      }}
                    />
                    Base Stats
                  </h3>
                  <div className="space-y-3">
                    {pokemon.stats.map((stat) => {
                      const statName =
                        statNames[stat.stat.name] || stat.stat.name;
                      const percentage = (stat.base_stat / 255) * 100;
                      return (
                        <div key={stat.stat.name} className="space-y-1">
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-medium capitalize">
                              {statName}
                            </span>
                            <span className="text-muted-foreground">
                              {stat.base_stat}
                            </span>
                          </div>
                          <div className="w-full h-3 bg-muted/50 rounded-full overflow-hidden border border-border/30 relative">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{
                                delay: 0.6,
                                duration: 1,
                                ease: "easeOut",
                              }}
                              className={cn(
                                "h-full rounded-full relative",
                                `bg-linear-to-r ${typeColor.gradient}`,
                                "shadow-[0_0_12px_var(--glow-vermilion)]"
                              )}
                            >
                              {/* Animated shimmer on progress bar */}
                              <motion.div
                                className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent"
                                animate={{
                                  x: ["-100%", "200%"],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "linear",
                                  repeatDelay: 1,
                                }}
                              />
                            </motion.div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Base Experience */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-border/30 bg-muted/30 hover:bg-muted/50 hover:border-primary/30 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  <Heart
                    className="h-5 w-5 text-primary animate-pulse"
                    style={{
                      filter: "drop-shadow(0 0 8px var(--glow-vermilion))",
                    }}
                  />
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground font-medium">
                      Base Experience
                    </p>
                    <p className="font-bold text-lg text-primary">
                      {pokemon.base_experience} XP
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
