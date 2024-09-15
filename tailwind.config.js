/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        deep_blue: "#000814",
        marine_blue: "#001D3D",
        blue: "003566",
        yellow: "#FFC300",
        light_yellow: "#FFD60A",
      },
    },
  },
  plugins: [],
};
