# DIPA Inhouse - Technical Test: Pokemon API Integration

Proyek ini merupakan technical test untuk DIPA Inhouse yang fokus pada integrasi API. Aplikasi ini menampilkan daftar Pokemon dengan detail lengkap menggunakan PokeAPI sebagai sumber data.

## Tech Stack

### Core Framework

- **React 19** - Library UI modern dengan performa tinggi dan developer experience yang baik
- **TypeScript** - Type safety untuk mengurangi bug dan meningkatkan maintainability code
- **Vite** - Build tool yang ringan dan cepat, dipilih karena kebutuhan utama proyek adalah integrasi API. Vite memberikan HMR (Hot Module Replacement) yang sangat cepat dan build time yang minimal, sehingga sangat cocok untuk development yang fokus pada API integration

### State Management & Data Fetching

- **TanStack React Query** - Library untuk data fetching, caching, dan state management yang efisien. Memudahkan handling loading states, error handling, dan caching untuk API responses
- **Axios** - HTTP client untuk melakukan request ke API dengan konfigurasi yang fleksibel

### Styling & UI Components

- **shadcn/ui** - Komponen UI yang dapat dikustomisasi dan accessible, dibangun di atas Radix UI dan Tailwind CSS. Menggunakan pendekatan copy-paste components yang memberikan fleksibilitas penuh untuk modifikasi
- **Tailwind CSS** - Utility-first CSS framework untuk styling yang cepat dan konsisten
- **Radix UI** - Headless UI components (Dialog, Popover, Slot) yang accessible dan customizable, digunakan sebagai base untuk shadcn/ui components
- **Lucide React** - Icon library yang modern dan ringan
- **Motion (Framer Motion)** - Library animasi untuk memberikan pengalaman pengguna yang lebih interaktif

### Development Tools

- **ESLint** - Code linting untuk menjaga kualitas code
- **Husky** - Git hooks untuk pre-commit checks
- **TypeScript ESLint** - Type-aware linting rules

## Alasan Pemilihan Tech Stack

1. **Vite** - Dipilih karena ringan dan cepat, sangat cocok untuk proyek yang fokus pada integrasi API. Development server yang cepat memungkinkan iterasi yang lebih cepat saat bekerja dengan API endpoints.

2. **React Query** - Memudahkan management state untuk data dari API, termasuk caching, refetching, dan error handling yang built-in.

3. **TypeScript** - Memberikan type safety untuk response dari API, mengurangi kemungkinan error saat handling data.

4. **shadcn/ui** - Menyediakan komponen UI yang siap pakai dan dapat dikustomisasi. Pendekatan copy-paste components memungkinkan full control terhadap kode komponen, berbeda dengan library komponen tradisional yang locked-in.

5. **Tailwind CSS** - Mempercepat development UI tanpa perlu menulis CSS custom yang banyak.

6. **Axios** - Lebih mudah dikonfigurasi dibanding fetch native, dengan interceptors dan error handling yang lebih baik.

## Fitur

- 📋 Daftar Pokemon dengan pagination
- 🔍 Pencarian Pokemon berdasarkan nama
- 🎯 Filter berdasarkan tipe Pokemon
- 📱 Responsive design
- ⚡ Fast loading dengan React Query caching
- 🎨 Modern UI dengan animasi smooth

## Getting Started

### Prerequisites

- Node.js (v18 atau lebih baru)
- npm atau yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## API Integration

Proyek ini mengintegrasikan dengan [PokeAPI](https://pokeapi.co/) untuk mendapatkan data Pokemon. Semua API calls dihandle melalui service layer di `src/services/pokemon.ts` dengan menggunakan Axios dan React Query untuk caching.
