import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { typeColors } from "@/constants/pokemon";
import { cn } from "@/lib/utils";
import { X, Filter, ChevronDown } from "lucide-react";

interface TypeFilterProps {
  selectedType: string | null;
  onTypeChange: (type: string | null) => void;
}

const allTypes = Object.keys(typeColors).sort();

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 20,
    },
  },
  hover: {
    scale: 1.1,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 17,
    },
  },
};

export function TypeFilter({ selectedType, onTypeChange }: TypeFilterProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-11 px-4 gap-2 font-display tracking-wide transition-all duration-300 border-2",
            selectedType
              ? "border-primary/50 bg-primary/10 hover:bg-primary/20"
              : "border-border/50 bg-card/50 hover:bg-card/70"
          )}
        >
          <Filter className="h-4 w-4" />
          <span className="capitalize">
            {selectedType ? (
              <>
                <span
                  className={cn(
                    "inline-block w-3 h-3 rounded-full mr-2",
                    typeColors[selectedType]?.bg || "bg-gray-400/20"
                  )}
                />
                {selectedType}
              </>
            ) : (
              "Filter by Type"
            )}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0 bg-card/95 backdrop-blur-sm border-2 border-border/50 shadow-[0_8px_32px_var(--depth-shadow)]"
        align="start"
      >
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <motion.h3
              className="text-lg font-bold font-display tracking-wide"
              style={{
                background:
                  "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Filter by Type
            </motion.h3>
            {selectedType && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => onTypeChange(null)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border-2 border-border/30 hover:border-primary/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:bg-primary/10"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="h-4 w-4" />
                Clear
              </motion.button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 max-h-[400px] overflow-y-auto">
            {/* All Types Button */}
            <motion.div
              variants={badgeVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.button
                onClick={() => onTypeChange(null)}
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium font-display tracking-wide capitalize transition-all duration-300 border-2",
                  selectedType === null
                    ? "bg-primary/20 border-primary text-primary shadow-[0_4px_12px_var(--glow-vermilion)]"
                    : "bg-card/50 border-border/30 text-muted-foreground hover:border-primary/30 hover:bg-primary/5"
                )}
              >
                All
              </motion.button>
            </motion.div>

            {/* Type Buttons */}
            <AnimatePresence>
              {allTypes.map((type) => {
                const typeColor = typeColors[type];
                const isSelected = selectedType === type;

                return (
                  <motion.div
                    key={type}
                    variants={badgeVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.button
                      onClick={() => onTypeChange(isSelected ? null : type)}
                      whileHover="hover"
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "px-4 py-2 rounded-lg font-medium font-display tracking-wide capitalize transition-all duration-300 border-2",
                        isSelected
                          ? cn(
                              typeColor.bg,
                              typeColor.text,
                              "border-current/60 shadow-[0_4px_12px_var(--depth-shadow)]"
                            )
                          : cn(
                              "bg-card/50 border-border/30 text-muted-foreground hover:border-current/30",
                              typeColor.bg,
                              "hover:bg-opacity-30"
                            )
                      )}
                    >
                      {type}
                    </motion.button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
