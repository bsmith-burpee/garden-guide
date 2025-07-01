import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'brand-green': '#046A38',
        'faded-green': '#E5EFE4',
        'brand-gray': '#F9FAFB',
      },
      fontFamily: {
        'reckless': ['RecklessNeue', 'serif'],
        'geograph': ['Geograph', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;