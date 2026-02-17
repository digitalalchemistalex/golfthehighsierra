import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#111111", "2": "#2a2a2a", "3": "#6e6e6e", "4": "#8a857e" },
        accent: { DEFAULT: "#C9A24D", light: "#D4B76A", soft: "rgba(201,162,77,.08)" },
        dim: "#8a857e",
        warm: { DEFAULT: "#C9A24D", soft: "rgba(201,162,77,.08)" },
        pine: { 50:"#E8F0EB",100:"#C5D9CC",200:"#9FBFAB",300:"#6B8E7F",400:"#3A6B57",500:"#1E3A2F",600:"#1E3A2F",700:"#163026",800:"#132A22",900:"#0A1610",950:"#050B08" },
        gold: { 50:"#FDF8EB",100:"#F9EDCC",200:"#F2D999",300:"#E8C466",400:"#C9A24D",500:"#B08C3A",600:"#9A7D34",700:"#7C5A07",800:"#5E4405",900:"#402E04",soft:"rgba(201,162,77,.12)" },
        cream: { 50:"#FFFFFF",100:"#FAFAF5",200:"#F4F1EA",300:"#EDE5D0",400:"#E4E0D8",500:"#D5CFC3" },
        charcoal: { DEFAULT:"#2C2C2C",light:"#4A4A4A",lighter:"#6B6B6B" },
        silk: "#ffffff",
        pearl: "#f9f8f6",
        bone: "#f1efec",
        linen: "#e5e2dc",
        mist: "#d8d4cd",
        teal: { DEFAULT:"#3a7d7e",soft:"rgba(58,125,126,.06)" },
        forest: "#1E3A2F",
        mountain: "#6B8E7F",
      },
      fontFamily: {
        display: ['"Playfair Display"', "Georgia", "serif"],
        heading: ['"Playfair Display"', "Georgia", "serif"],
        body: ['"DM Sans"', "system-ui", "sans-serif"],
        serif: ['"Playfair Display"', "Georgia", "serif"],
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
      },
      borderRadius: { "2xl": "16px", "3xl": "24px", "4xl": "32px", pill: "100px" },
      animation: {
        "pulse-dot": "pulseDot 2s infinite",
        "scroll-drop": "scrollDrop 2s ease-in-out infinite",
      },
      keyframes: {
        pulseDot: { "0%,100%": { opacity: "1", transform: "scale(1)" }, "50%": { opacity: "0.3", transform: "scale(2)" } },
        scrollDrop: { "0%": { top: "-48px" }, "100%": { top: "48px" } },
      },
    },
  },
  plugins: [],
};
export default config;
