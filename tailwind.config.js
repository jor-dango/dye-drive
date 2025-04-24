/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        accent: "#6663A6",
        bglight: "#F9FBF9",
        bgdark: "#212223",
        textlight: "#F4FDF7",
        textdark: "#0F172A",
        textsecondary: "#737A8D"
      }
    },
  },
  plugins: [],
}