/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#1677ff",
          600: "#1266d6",
          700: "#0f4fa8",
          800: "#123b73",
          900: "#102f59",
        },

        cyan: {
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
        },

        surface: {
          DEFAULT: "#ffffff",
          soft: "#f8fbff",
          blue: "#f2f7ff",
          muted: "#eef5ff",
        },

        ink: {
          900: "#12315B",
          800: "#1B4275",
          700: "#315985",
          600: "#55749B",
          500: "#7188A5",
        },
      },

      boxShadow: {
        soft: "0 8px 30px rgba(37, 99, 235, 0.08)",
        card: "0 4px 20px rgba(30, 64, 175, 0.07)",
        blue: "0 8px 24px rgba(22, 119, 255, 0.18)",
      },

      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },

  plugins: [],
};