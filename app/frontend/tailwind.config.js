/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
    colors: {
      "custom-primary": "#3B31A8",
      "custom-secondary": "#EFEEF8",
      white: "#ffffff",
      black: "#000000",
    },
  },
  plugins: [require("daisyui")],
};
