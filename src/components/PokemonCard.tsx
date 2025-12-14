import { motion } from "motion/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getPokemonImageUrl,
  getPokemonImageUrlFallback,
} from "@/services/pokemon";
import { typeColors } from "@/constants/pokemon";
import type { PokemonDetailsResponse } from "@/types/pokemon";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";

interface PokemonCardProps {
  pokemon: PokemonDetailsResponse;
  index?: number;
  onClick?: () => void;
}

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.9,
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: index * 0.1,
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  }),
  hover: {
    scale: 1.05,
    y: -8,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 17,
    },
  },
};

const imageVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.2,
      duration: 0.5,
    },
  },
};

const badgeVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: (index: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.3 + index * 0.1,
      duration: 0.3,
    },
  }),
};

// Preload image function
const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject();
    img.src = src;
  });
};

export function PokemonCard({ pokemon, index = 0, onClick }: PokemonCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const primaryType = pokemon.types[0]?.type.name || "normal";
  const typeColor = typeColors[primaryType] || typeColors.normal;

  const primaryImageUrl = getPokemonImageUrl(pokemon.id);
  const fallbackImageUrl = getPokemonImageUrlFallback(pokemon.id);

  // Preload image before showing
  useEffect(() => {
    let isMounted = true;

    const loadImage = async () => {
      try {
        // Try to preload primary image
        await preloadImage(primaryImageUrl);
        if (isMounted) {
          setImageSrc(primaryImageUrl);
          setImageLoaded(true);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // If primary fails, try fallback
        try {
          await preloadImage(fallbackImageUrl);
          if (isMounted) {
            setImageSrc(fallbackImageUrl);
            setImageLoaded(true);
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (fallbackError) {
          if (isMounted) {
            setImageLoaded(true); // Show error state
          }
        }
      }
    };

    loadImage();

    return () => {
      isMounted = false;
    };
  }, [primaryImageUrl, fallbackImageUrl]);

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      custom={index}
      className="h-full"
    >
      <Card
        onClick={onClick}
        className={cn(
          "h-full overflow-hidden transition-all duration-500 group",
          "hover:shadow-[0_8px_32px_var(--depth-shadow)]",
          "cursor-pointer active:scale-[0.98]",
          "border-2 border-border/50 hover:border-primary/50",
          "bg-linear-to-br from-card/90 to-card/70",
          "backdrop-blur-sm",
          typeColor.bg
        )}
      >
        <CardHeader className="pb-4 pt-6">
          <motion.div
            className="relative flex items-center justify-center h-40"
            variants={imageVariants}
            initial="hidden"
            animate={imageLoaded ? "visible" : "hidden"}
          >
            {imageLoaded && imageSrc ? (
              <motion.div
                className="relative"
                whileHover={{ scale: 1.15, rotate: [0, -5, 5, -5, 0] }}
                transition={{
                  scale: { type: "spring", stiffness: 300, damping: 20 },
                  rotate: { duration: 0.5, ease: "easeInOut" },
                }}
              >
                <motion.img
                  ref={imgRef}
                  src={imageSrc}
                  alt={pokemon.name}
                  className="h-full w-auto object-contain relative z-10 drop-shadow-[0_8px_24px_var(--glow-cyan)]"
                  width={160}
                  height={160}
                  loading="eager"
                  decoding="sync"
                  fetchPriority={index < 10 ? "high" : "auto"}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    opacity: { duration: 0.4, ease: "easeOut" },
                    scale: {
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                      delay: 0.1,
                    },
                  }}
                />
                {/* Glow effect behind image */}
                <motion.div
                  className="absolute inset-0 blur-2xl opacity-50"
                  style={{
                    background: `radial-gradient(circle, ${typeColor.text.replace(
                      "text-",
                      ""
                    )}, transparent 70%)`,
                  }}
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <div className="h-24 w-24 bg-muted rounded-full animate-pulse" />
              </div>
            )}
          </motion.div>
        </CardHeader>
        <CardContent className="space-y-3 relative z-10">
          <motion.h3
            className={cn(
              "text-xl font-bold capitalize font-display tracking-wide",
              typeColor.text,
              "group-hover:text-primary transition-colors duration-300"
            )}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            style={{
              textShadow: "0 2px 8px var(--glow-vermilion)",
            }}
          >
            {pokemon.name}
          </motion.h3>
          <div className="flex flex-wrap gap-2">
            {pokemon.types.map((type, typeIndex) => {
              const typeName = type.type.name;
              const typeColor = typeColors[typeName] || typeColors.normal;
              return (
                <motion.div
                  key={type.slot}
                  variants={badgeVariants}
                  initial="hidden"
                  animate="visible"
                  custom={typeIndex}
                  whileHover={{ scale: 1.1 }}
                >
                  <Badge
                    variant="outline"
                    className={cn(
                      "capitalize font-medium font-display tracking-wide",
                      typeColor.bg,
                      typeColor.text,
                      "border-2 border-current/30 hover:border-current/60",
                      "transition-all duration-300",
                      "shadow-[0_2px_8px_var(--depth-shadow)]"
                    )}
                  >
                    {typeName}
                  </Badge>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
