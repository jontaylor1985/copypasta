import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      'sans-title': ['BrunoAce'],
      'sans': ['Verdana', 'sans-serif']
    },
    extend: {
      colors: {
        primary: "#BEF992",
        secondary: "#5FB9B0"
      }
    },
  },
  plugins: [],
} satisfies Config;
