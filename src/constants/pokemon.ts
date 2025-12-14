// Pokemon type colors with background, text, and gradient
export const typeColors: Record<
  string,
  { bg: string; text: string; gradient: string }
> = {
  normal: {
    bg: "bg-gray-400/20",
    text: "text-gray-100 dark:text-gray-200",
    gradient: "from-gray-400 to-gray-600",
  },
  fire: {
    bg: "bg-red-400/20",
    text: "text-red-200 dark:text-red-300",
    gradient: "from-red-400 to-red-600",
  },
  water: {
    bg: "bg-blue-400/20",
    text: "text-blue-200 dark:text-blue-300",
    gradient: "from-blue-400 to-blue-600",
  },
  electric: {
    bg: "bg-yellow-400/20",
    text: "text-yellow-200 dark:text-yellow-300",
    gradient: "from-yellow-400 to-yellow-600",
  },
  grass: {
    bg: "bg-green-400/20",
    text: "text-green-200 dark:text-green-300",
    gradient: "from-green-400 to-green-600",
  },
  ice: {
    bg: "bg-cyan-400/20",
    text: "text-cyan-200 dark:text-cyan-300",
    gradient: "from-cyan-400 to-cyan-600",
  },
  fighting: {
    bg: "bg-orange-400/20",
    text: "text-orange-200 dark:text-orange-300",
    gradient: "from-orange-400 to-orange-600",
  },
  poison: {
    bg: "bg-purple-400/20",
    text: "text-purple-200 dark:text-purple-300",
    gradient: "from-purple-400 to-purple-600",
  },
  ground: {
    bg: "bg-amber-400/20",
    text: "text-amber-200 dark:text-amber-300",
    gradient: "from-amber-400 to-amber-600",
  },
  flying: {
    bg: "bg-indigo-400/20",
    text: "text-indigo-200 dark:text-indigo-300",
    gradient: "from-indigo-400 to-indigo-600",
  },
  psychic: {
    bg: "bg-pink-400/20",
    text: "text-pink-200 dark:text-pink-300",
    gradient: "from-pink-400 to-pink-600",
  },
  bug: {
    bg: "bg-lime-400/20",
    text: "text-lime-200 dark:text-lime-300",
    gradient: "from-lime-400 to-lime-600",
  },
  rock: {
    bg: "bg-stone-400/20",
    text: "text-stone-200 dark:text-stone-300",
    gradient: "from-stone-400 to-stone-600",
  },
  ghost: {
    bg: "bg-violet-400/20",
    text: "text-violet-200 dark:text-violet-300",
    gradient: "from-violet-400 to-violet-600",
  },
  dragon: {
    bg: "bg-indigo-500/20",
    text: "text-indigo-200 dark:text-indigo-300",
    gradient: "from-indigo-500 to-indigo-700",
  },
  dark: {
    bg: "bg-slate-400/20",
    text: "text-slate-200 dark:text-slate-300",
    gradient: "from-slate-400 to-slate-600",
  },
  steel: {
    bg: "bg-zinc-400/20",
    text: "text-zinc-200 dark:text-zinc-300",
    gradient: "from-zinc-400 to-zinc-600",
  },
  fairy: {
    bg: "bg-rose-400/20",
    text: "text-rose-200 dark:text-rose-300",
    gradient: "from-rose-400 to-rose-600",
  },
};

// Pokemon stat name mappings
export const statNames: Record<string, string> = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Atk",
  "special-defense": "Sp. Def",
  speed: "Speed",
};
