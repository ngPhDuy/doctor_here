/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        blueText: "#131C55", 
        blueTitle: "#0000FF", 

        blueButton: "#0000AC",
        blueButtonHover: "#3232D1",
        yellowButton: "#E2B93B",
        yellowButtonHover: "#F0C756",
        redButton: "#F52524",
        redButtonHover: "#FF514F",
      },
    },
  },
  plugins: [],
}
