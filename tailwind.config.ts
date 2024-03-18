import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      "cscol-100": "#DCDADF",
      "cscol-200": "#3E8CC2",
      "cscol-300": "#83B1D8",
      "cscol-400": "#5C648D",
      "cscol-500": "#254F7F",
      "errcol-100": "#FF204E",
      "appcol-100": "#FF204E",
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
