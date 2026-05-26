import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#3b82f6", // Açık mavi
          DEFAULT: "#2563eb", // Mavi
          dark: "#1d4ed8", // Koyu mavi
        },
        background: {
          light: "#f3f4f6", // Açık gri
          dark: "#1f2937", // Koyu gri
        },
        surface: {
          light: "#ffffff",
          dark: "#374151",
        }
      },
    },
  },
  plugins: [],
};
export default config;
