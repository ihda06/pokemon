import { motion } from "motion/react";
import { Github } from "lucide-react";

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="border-t border-border/50 py-8 mt-12 relative"
    >
      {/* Subtle background effect */}
      <div className="absolute inset-0 bg-linear-to-t from-background/50 to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col items-center gap-4">
          <p className="text-center text-sm text-muted-foreground">
            Powered by{" "}
            <a
              href="https://pokeapi.co"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:text-accent transition-colors duration-300 relative group"
            >
              <span className="relative z-10">PokeAPI</span>
              <span
                className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                style={{
                  background:
                    "linear-gradient(90deg, var(--primary), var(--accent))",
                }}
              />
            </a>
          </p>
          <a
            href="https://github.com/ihda06"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-300 relative group"
          >
            <Github className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
            <span className="relative z-10">GitHub</span>
            <span
              className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
              style={{
                background:
                  "linear-gradient(90deg, var(--primary), var(--accent))",
              }}
            />
          </a>
        </div>
      </div>
    </motion.footer>
  );
}
