import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
import colors from "tailwindcss/colors";
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "100ch", // add required value here
          },
        },
      },
      colors: {
        ...colors,
        background: "var(--background)",
        foreground: "var(--foreground)",
        "festive-red": "#e82f30",
        "festive-green": "#6f9175",
      },
    },
  },
  plugins: [typography()],
} satisfies Config;
