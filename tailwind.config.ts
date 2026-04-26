import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#202320",
        muted: "#6d746d",
        line: "#e6ddd1",
        brand: "#4d8b72",
        brandDark: "#2f6652",
        gold: "#e8a93a",
        cream: "#fbf6ee",
        sage: "#dce9df",
        coral: "#d97856"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(13, 23, 32, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
