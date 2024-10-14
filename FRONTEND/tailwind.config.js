// tailwind.config.js
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        typewriter: 'typewriter 2s steps(11) forwards',  // Duración de 2 segundos
        caret: 'blink 1s steps(1) infinite',             // Cursor parpadeante
      },
      keyframes: {
        typewriter: {
          'from': { width: '0' },      // Empieza desde 0
          'to': { width: '100%' },     // Finaliza en 100%
        },
        blink: {
          '50%': { opacity: '0' },     // Alterna entre opaco y transparente
        },
      },
    },
  },
  plugins: [],
}
