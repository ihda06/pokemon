import { motion } from "motion/react";
import { Zap } from "lucide-react";
import { useState, useEffect } from "react";
import pokemonIcon from "@/assets/pokemon-icon.webp";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`
        sticky top-0 z-50 w-full transition-all duration-700
        ${
          scrolled
            ? "border-b-2 border-border/50 bg-background/98 backdrop-blur-2xl shadow-[0_4px_32px_var(--depth-shadow)]"
            : "bg-transparent"
        }
        relative overflow-visible
      `}
    >
      {/* Diagonal accent line */}
      <motion.div
        className="absolute top-0 left-0 w-full h-1"
        style={{
          background: "linear-gradient(90deg, var(--primary), transparent 60%)",
          transform: "skewY(-0.5deg)",
          transformOrigin: "left top",
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Asymmetric layout with overlapping elements */}
        <div className="relative py-6 md:py-8">
          {/* Main title - split and offset */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="flex items-baseline gap-3 md:gap-4"
            >
              {/* Pokemon Logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 150 }}
                className="relative"
              >
                <motion.img
                  src={pokemonIcon}
                  alt="Pokemon Logo"
                  className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  style={{
                    filter: "drop-shadow(0 4px 12px var(--glow-vermilion))",
                  }}
                />
              </motion.div>
              {/* First word - larger, offset */}
              <motion.h1
                className="text-4xl sm:text-5xl md:text-7xl font-display font-black leading-none tracking-tighter"
                style={{
                  background:
                    "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 4px 12px var(--glow-vermilion))",
                }}
              >
                POKÉMON
              </motion.h1>

              {/* Small accent badge */}
              <motion.div
                initial={{ scale: 0, rotate: -12 }}
                animate={{ scale: 1, rotate: -12 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                className="hidden sm:block relative -top-2 -left-2"
              >
                <div
                  className="px-2 py-0.5 text-xs font-bold font-display tracking-widest uppercase border-2"
                  style={{
                    background: "var(--background)",
                    borderColor: "var(--primary)",
                    color: "var(--primary)",
                    transform: "rotate(-12deg)",
                    boxShadow: "0 0 12px var(--glow-cyan)",
                  }}
                >
                  <span className="relative z-10">EXPLORE</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Second word - smaller, offset below */}
            <motion.div
              initial={{ opacity: 0, y: 20, x: 20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
              className="relative -mt-2 md:-mt-3 ml-8 md:ml-12"
            >
              <h2
                className="text-2xl sm:text-3xl md:text-5xl font-display font-extrabold tracking-[0.15em] uppercase"
                style={{
                  color: "var(--accent)",
                  filter: "drop-shadow(0 2px 8px var(--glow-cyan))",
                  letterSpacing: "0.2em",
                }}
              >
                EXPLORER
              </h2>

              {/* Decorative line accent */}
              <motion.div
                className="absolute -bottom-2 left-0 h-0.5"
                style={{
                  background:
                    "linear-gradient(90deg, var(--primary), transparent)",
                  width: "120%",
                }}
                initial={{ width: 0 }}
                animate={{ width: "120%" }}
                transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
              />
            </motion.div>
          </div>

          {/* Right side - floating icon with interesting positioning */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 150 }}
            className="absolute top-2 right-0 md:right-4 lg:right-8"
          >
            <motion.div
              className="relative group"
              whileHover={{ scale: 1.15, rotate: 12 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {/* Icon with geometric background */}
              <div
                className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center"
                style={{
                  clipPath:
                    "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
                  background:
                    "linear-gradient(135deg, var(--primary) 0%, var(--accent) 50%, var(--chart-3) 100%)",
                  filter:
                    "drop-shadow(0 8px 24px var(--glow-vermilion)) drop-shadow(0 4px 12px var(--glow-cyan))",
                }}
              >
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Zap
                    className="w-8 h-8 md:w-10 md:h-10 text-foreground relative z-10"
                    fill="currentColor"
                    style={{
                      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                    }}
                  />
                </motion.div>

                {/* Animated border glow */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    clipPath:
                      "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
                    border: "2px solid var(--accent)",
                    filter: "blur(2px)",
                  }}
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>

              {/* Floating particles around icon */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    background:
                      i === 0
                        ? "var(--primary)"
                        : i === 1
                        ? "var(--accent)"
                        : "var(--chart-3)",
                    filter: `blur(${i * 2}px)`,
                    boxShadow: `0 0 ${4 + i * 2}px ${
                      i === 0
                        ? "var(--glow-vermilion)"
                        : i === 1
                        ? "var(--glow-cyan)"
                        : "var(--glow-gold)"
                    }`,
                  }}
                  animate={{
                    x: [
                      i === 0 ? 0 : i === 1 ? 30 : -25,
                      i === 0 ? 20 : i === 1 ? 45 : -10,
                      i === 0 ? 0 : i === 1 ? 30 : -25,
                    ],
                    y: [
                      i === 0 ? 0 : i === 1 ? -30 : 25,
                      i === 0 ? -20 : i === 1 ? -45 : 10,
                      i === 0 ? 0 : i === 1 ? -30 : 25,
                    ],
                    opacity: [0.3, 1, 0.3],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.3,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>

          {/* Bottom accent - subtle underline with offset */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "60%", opacity: 1 }}
            transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
            className="absolute bottom-0 left-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, var(--primary), var(--accent), transparent)",
              transform: "skewX(-15deg)",
            }}
          />
        </div>
      </div>

      {/* Subtle background texture */}
      {!scrolled && (
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                var(--foreground) 10px,
                var(--foreground) 11px
              )`,
            }}
          />
        </div>
      )}
    </motion.header>
  );
}
