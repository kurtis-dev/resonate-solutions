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
        ink: "#0d1720",
        muted: "#617082",
        line: "#dbe3ea",
        brand: "#0f9f8f",
        brandDark: "#087567",
        gold: "#f5b84b"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(13, 23, 32, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
