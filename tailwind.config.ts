import type { Config } from "tailwindcss";

// KHAN POKER visual direction — cinematic, premium, dark felt + gold.
const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#07110D",
        surface: "#0D1D16",
        felt: {
          DEFAULT: "#075E43",
          deep: "#043C2B",
        },
        gold: {
          DEFAULT: "#D6A84B",
          bright: "#F1CD73",
        },
        danger: "#D84A4A",
        ink: {
          DEFAULT: "#F7F3E8",
          muted: "#91A69B",
        },
      },
      fontFamily: {
        sans: ["Noto Sans", "Segoe UI", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "0.75rem",
      },
      boxShadow: {
        felt: "inset 0 0 80px rgba(0,0,0,0.55), 0 24px 60px rgba(0,0,0,0.55)",
        "gold-glow": "0 0 18px rgba(214,168,75,0.45)",
      },
      keyframes: {
        "deal-in": {
          "0%": { opacity: "0", transform: "translateY(-12px) scale(0.9)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "chip-slide": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "gold-pulse": {
          "0%, 100%": { boxShadow: "0 0 0 rgba(214,168,75,0)" },
          "50%": { boxShadow: "0 0 24px rgba(214,168,75,0.55)" },
        },
      },
      animation: {
        "deal-in": "deal-in 220ms ease-out",
        "chip-slide": "chip-slide 260ms ease-out",
        "gold-pulse": "gold-pulse 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
