/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        discord: {
          bg: '#36393f',       // Main background
          dark: '#2f3136',     // Sidebar/Darker background
          darker: '#202225',   // Deepest background
          light: '#40444b',    // Hover states/Inputs
          accent: '#5865F2',   // Blurple (Discord Blue)
          green: '#3BA55C',    // Success
          red: '#ED4245',      // Error
          text: '#dcddde',     // Standard text
          muted: '#72767d'     // Gray text
        }
      }
    },
  },
  plugins: [],
}
