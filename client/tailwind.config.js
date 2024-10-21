/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sky: {
          100: "#D2E0FB",
          200: "#8EACCD",
          300: "#131635",
        },
        cream: {
          100: "#FEF9D9",
          200: "#DEE5D4",
        },
      },
    
    },
  },
  plugins: [],
};

