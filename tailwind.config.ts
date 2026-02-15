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
        pine: { 50:"#E8F0EB",100:"#C5D9CC",200:"#9FBFAB",300:"#78A589",400:"#2D5E42",500:"#1A3C2A",600:"#1A3C2A",700:"#153222",800:"#0F2118",900:"#0A1610",950:"#050B08" },
        sage: { DEFAULT:"#7B9E87" },
        gold: { 50:"#FDF8EB",100:"#F9EDCC",200:"#F2D999",300:"#EBC466",400:"#D4AD4A",500:"#B8963E",600:"#9A7D34",700:"#7C5A07",800:"#5E4405",900:"#402E04",soft:"rgba(184,150,62,.12)" },
        cream: { 50:"#FFFFFF",100:"#FAFAF5",200:"#F4F1EA",300:"#EDE5D0",400:"#E4E0D8",500:"#D5CFC3" },
        charcoal: { DEFAULT:"#2C2C2C",light:"#4A4A4A",lighter:"#6B6B6B" },
        red: { DEFAULT:"#ff1053",hover:"#e60d48" },
        ink: { DEFAULT:"#0a0a0a","2":"#2a2a2a","3":"#6e6e6e","4":"#a0a0a0" },
        silk: "#ffffff",
        pearl: "#f9f8f6",
        bone: "#f1efec",
        linen: "#e5e2dc",
        mist: "#d8d4cd",
        accent: { DEFAULT:"#6b5a3e",light:"#8d7b5a",soft:"rgba(107,90,62,.06)" },
        teal: { DEFAULT:"#3a7d7e",soft:"rgba(58,125,126,.06)" },
        warm: { DEFAULT:"#c4a265",soft:"rgba(196,162,101,.08)" },
      },
      fontFamily: {
        heading: ['"Playfair Display"',"Georgia","serif"],
        display: ['"Playfair Display"',"Georgia","serif"],
        body: ["Inter","system-ui","sans-serif"],
        serif: ['"Cormorant Garamond"',"Georgia","serif"],
        sans: ['"Outfit"',"system-ui","sans-serif"],
      },
      borderRadius: { "2xl":"16px","3xl":"24px","4xl":"32px",pill:"100px" },
      animation: {
        "fade-in":"fadeIn 0.6s ease-out","slide-up":"slideUp 0.6s ease-out",
        "slide-left":"slideLeft 0.6s ease-out","slide-right":"slideRight 0.6s ease-out",
        "hero-kb":"heroKB 22s ease-in-out infinite alternate",
        "pulse-dot":"pulseDot 2s infinite","scroll-line":"scrollPulse 2.5s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { "0%":{opacity:"0"},"100%":{opacity:"1"} },
        slideUp: { "0%":{opacity:"0",transform:"translateY(20px)"},"100%":{opacity:"1",transform:"translateY(0)"} },
        slideLeft: { "0%":{opacity:"0",transform:"translateX(30px)"},"100%":{opacity:"1",transform:"translateX(0)"} },
        slideRight: { "0%":{opacity:"0",transform:"translateX(-30px)"},"100%":{opacity:"1",transform:"translateX(0)"} },
        heroKB: { "0%":{transform:"scale(1.06) translate(0,0)"},"100%":{transform:"scale(1.12) translate(-1%,-1%)"} },
        pulseDot: { "0%,100%":{opacity:"1",transform:"scale(1)"},"50%":{opacity:"0.4",transform:"scale(1.6)"} },
        scrollPulse: { "0%,100%":{opacity:"0.3",transform:"scaleY(0.6)"},"50%":{opacity:"1",transform:"scaleY(1)"} },
      },
    },
  },
  plugins: [],
};
export default config;
