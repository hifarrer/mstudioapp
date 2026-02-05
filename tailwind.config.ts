import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        cadenze: "1060px",
      },
      borderRadius: {
        cadenze: "18px",
        "cadenze-lg": "22px",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "template-text": "var(--text)",
        "template-muted": "var(--muted)",
        "template-orange1": "#d17b50",
        "template-orange2": "#b8623d",
        neutral: {
          black: "#0E0E0E",
          white: "#efe8e4",
          900: "#1C1C1C",
          700: "#2A2A2A",
          500: "#6E6E6E",
          300: "#9A9A9A",
        },
        accent: {
          clay: {
            500: "#d17b50",
            300: "#e2a08a",
            100: "#f3d6cb",
          },
          olive: {
            500: "#6F7A4F",
            300: "#9DA88A",
            100: "#D9DDCF",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;




