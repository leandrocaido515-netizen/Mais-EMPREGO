/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        verde: "#16241C",
        verdeDeep: "#0E1712",
        ouro: "#D9A441",
        brick: "#B23A2E",
        paper: "#F4F2ED",
        ink: "#17201A",
        musgo: "#7C8B7A",
        musgoLine: "#DAD6C8",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
