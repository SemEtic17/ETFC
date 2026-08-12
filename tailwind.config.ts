import type { Config } from "tailwindcss";

/**
 * ETFC — ADWA FIGHT NIGHT — strict brand palette.
 *
 * These are the ONLY brand colors. Do not add colors outside this set.
 *
 *   primary  #D20A0A  Primary Red
 *   deep     #0B0B0B  Deep Black      (global background)
 *   pure     #FFFFFF  Pure White      (default text)
 *   steel    #8A8D91  Cool Steel Gray
 *   electric #2779A7  Electric Blue
 *   warning  #FF9A00  Warning Amber
 *   surface  #1A1D20  Surface Dark Gray
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#D20A0A",
        deep: "#0B0B0B",
        pure: "#FFFFFF",
        steel: "#8A8D91",
        electric: "#2779A7",
        warning: "#FF9A00",
        surface: "#1A1D20",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
