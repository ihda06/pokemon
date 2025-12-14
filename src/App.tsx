import { motion } from "motion/react";
import { PokemonList } from "@/components/PokemonList";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useState, lazy, Suspense } from "react";

const PokemonDetailModal = lazy(() =>
  import("@/components/PokemonDetailModal").then((module) => ({
    default: module.PokemonDetailModal,
  }))
);

function App() {
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePokemonClick = (pokemonId: number) => {
    setSelectedPokemonId(pokemonId);
    setIsModalOpen(true);
  };

  const handleOpenChange = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      // Keep the selectedPokemonId for smooth exit animation
      setTimeout(() => setSelectedPokemonId(null), 300);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Atmospheric background with geometric pattern */}
      <div className="fixed inset-0 geometric-bg -z-10" />
      <div className="fixed inset-0 bg-linear-to-br from-background via-background/95 to-background -z-10" />

      {/* Scanning line effect */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="absolute inset-x-0 h-px bg-linear-to-r from-transparent via-accent/50 to-transparent"
          animate={{
            y: ["0vh", "100vh"],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 3,
          }}
        />
      </motion.div>

      {/* Creative Editorial-Style Header */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <PokemonList onPokemonClick={handlePokemonClick} />
        </motion.div>
      </main>

      {/* Pokemon Detail Modal */}
      <Suspense fallback={null}>
        <PokemonDetailModal
          pokemonId={selectedPokemonId}
          open={isModalOpen}
          onOpenChange={handleOpenChange}
        />
      </Suspense>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
