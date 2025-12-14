import { useState } from "react";
import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search Pokemon by name...",
  className,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onChange("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("relative w-full", className)}
    >
      <div
        className={cn(
          "relative flex items-center transition-all duration-300",
          isFocused && "scale-[1.02]"
        )}
      >
        <Search
          className={cn(
            "absolute left-4 h-5 w-5 transition-colors duration-200 z-10",
            isFocused ? "text-primary" : "text-muted-foreground"
          )}
        />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={cn(
            "pl-12 pr-12 h-12 text-base font-medium",
            "border-2 border-border/50 focus:border-primary/50",
            "bg-card/80 backdrop-blur-sm",
            "shadow-[0_4px_16px_var(--depth-shadow)]",
            "focus-visible:ring-2 focus-visible:ring-primary/20",
            "transition-all duration-300"
          )}
        />
        {value && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute right-3 z-10"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="h-8 w-8 rounded-full hover:bg-primary/10"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
