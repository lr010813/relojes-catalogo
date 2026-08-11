import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FBF8F3", // fondo cálido casi blanco
        panel: "#FFFFFF", // tarjetas / vitrina
        ink: "#211A12", // texto principal
        amber: "#B9852E", // acento dorado mostaza
        amberLight: "#D6A24C",
        taupe: "#8C7A63", // texto secundario
        line: "#E8DFD0", // bordes finos
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      letterSpacing: {
        widest2: "0.3em",
      },
    },
  },
  plugins: [],
};
export default config;
