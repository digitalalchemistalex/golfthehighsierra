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
          400: "#2D5E42",  // --pine-lt
          500: "#1A3C2A",  // --pine (primary)
          600: "#1A3C2A",
          700: "#153222",
          800: "#0F2118",  // --pine-dk
          900: "#0A1610",
          950: "#050B08",
        },
        sage: {
          DEFAULT: "#7B9E87", // --sage
        },
        gold: {
          50: "#FDF8EB",
          100: "#F9EDCC",
          200: "#F2D999",
          300: "#EBC466",
          400: "#D4AD4A",  // --gold-h (hover)
          500: "#B8963E",  // --gold (primary)
          600: "#9A7D34",
          700: "#7C5A07",
          800: "#5E4405",
          900: "#402E04",
          soft: "rgba(184,150,62,.12)", // --gold-soft
        },
        cream: {
          50: "#FFFFFF",
          100: "#FAFAF5",  // --cream (primary bg)
          200: "#F4F1EA",  // --cream-w (warm)
          300: "#EDE5D0",
          400: "#E4E0D8",  // --border
          500: "#D5CFC3",
        },
        charcoal: {
          DEFAULT: "#2C2C2C",  // --text
          light: "#4A4A4A",
          lighter: "#6B6B6B",  // --text2
        },
        red: {
          DEFAULT: "#ff1053",  // --red (CTA)
          hover: "#e60d48",
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
