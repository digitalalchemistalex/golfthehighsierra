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
        pine: {
          50: "#E8F0EB",
          100: "#C5D9CC",
          200: "#9FBFAB",
          300: "#78A589",
          400: "#5A9170",
          500: "#3C7D57",
          600: "#2D6B45",
          700: "#1F5735",
          800: "#1B4332",
          900: "#0F2A1E",
          950: "#081A12",
        },
        gold: {
          50: "#FDF8EB",
          100: "#F9EDCC",
          200: "#F2D999",
          300: "#EBC466",
          400: "#D4A843",
          500: "#B8860B",
          600: "#9A7009",
          700: "#7C5A07",
          800: "#5E4405",
          900: "#402E04",
        },
        cream: {
          50: "#FEFDFB",
          100: "#FBF9F3",
          200: "#FAF8F0",
          300: "#F5F0E3",
          400: "#EDE5D0",
          500: "#E0D5B8",
        },
        charcoal: {
          DEFAULT: "#1A1A2E",
          light: "#374151",
          lighter: "#6B7280",
        },
      },
      fontFamily: {
        heading: ['"Playfair Display"', "Georgia", "serif"],
        display: ['"Playfair Display"', "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
        "slide-left": "slideLeft 0.6s ease-out",
        "slide-right": "slideRight 0.6s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideLeft: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideRight: {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
