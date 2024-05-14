
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: '1180px'
      },
      container: {
        center: true,
        padding: '0',
        screens: {
          lg: '2400px',
          xl: '2400px',
          '2xl': '2400px',
        },
      },
      visibility: {
        hidden: 'hidden',
      }
    },
  },  
  plugins: [],
};
export default config;
