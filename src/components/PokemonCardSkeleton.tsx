import { motion } from "motion/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function PokemonCardSkeleton() {
  return (
    <Card className={cn("overflow-hidden")}>
      <CardHeader className="pb-4">
        <motion.div
          className="h-32 w-full bg-muted rounded-lg"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </CardHeader>
      <CardContent className="space-y-3">
        <motion.div
          className="h-6 w-24 bg-muted rounded"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2,
          }}
        />
        <div className="flex gap-2">
          <motion.div
            className="h-5 w-16 bg-muted rounded-full"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.4,
            }}
          />
          <motion.div
            className="h-5 w-16 bg-muted rounded-full"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.6,
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
