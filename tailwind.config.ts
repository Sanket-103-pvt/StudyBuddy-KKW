import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // The old blue and indigo accents now resolve to the orange brand colour.
        blue: {
          50: "#fff4ea", 100: "#fde5cd", 200: "#f9cc9f", 300: "#f5ae6a", 400: "#ef9340",
          500: "#e8832a", 600: "#c96a14", 700: "#a2530f", 800: "#7e4112", 900: "#653612", 950: "#2b1505",
        },
        indigo: {
          50: "#fff4ea", 100: "#fde5cd", 200: "#f9cc9f", 300: "#f5ae6a", 400: "#ef9340",
          500: "#e8832a", 600: "#c96a14", 700: "#a2530f", 800: "#7e4112", 900: "#653612", 950: "#2b1505",
        },
        "primary-fixed": "#fde5cd",
        "text-secondary-dark": "#9CA3AF",
        "tertiary": "#943700",
        "surface-container-highest": "#e6e6e2",
        "secondary-fixed": "#ffddb8",
        "surface-tint": "#e8832a",
        "primary-fixed-dim": "#f5ae6a",
        "bg-light": "#FAFAFA",
        "border-light": "#E5E7EB",
        "outline": "#77776f",
        "on-primary-fixed-variant": "#003ea8",
        "secondary": "#855300",
        "text-primary-dark": "#F3F4F6",
        "on-primary": "#ffffff",
        "tertiary-fixed-dim": "#ffb596",
        "on-tertiary-container": "#ffede6",
        "background": "#fafaf8",
        "text-primary-light": "#111827",
        "secondary-container": "#fea619",
        "tertiary-fixed": "#ffdbcd",
        "on-secondary-fixed-variant": "#653e00",
        "inverse-surface": "#1d1d1b",
        "error-container": "#ffdad6",
        "text-secondary-light": "#6B7280",
        "border-dark": "#1F2937",
        "on-primary-fixed": "#00174b",
        "surface-container": "#efefec",
        "on-background": "#0e0e0e",
        "surface-bright": "#fafaf8",
        "tertiary-container": "#bc4800",
        "on-error": "#ffffff",
        "on-tertiary": "#ffffff",
        "surface-container-low": "#f6f6f3",
        "inverse-on-surface": "#f1f1ee",
        "on-primary-container": "#eeefff",
        "error": "#ba1a1a",
        "surface-dim": "#dcdcd7",
        "on-tertiary-fixed-variant": "#7d2d00",
        "on-secondary-fixed": "#2a1700",
        "on-error-container": "#93000a",
        "surface-variant": "#e6e6e2",
        "on-tertiary-fixed": "#360f00",
        "surface": "#fafaf8",
        "primary-container": "#0e0e0e",
        "on-secondary-container": "#684000",
        "outline-variant": "#d4d4cf",
        "bg-dark": "#0F1115",
        "surface-container-lowest": "#ffffff",
        "secondary-fixed-dim": "#ffb95f",
        "on-secondary": "#ffffff",
        "inverse-primary": "#b4c5ff",
        "surface-container-high": "#e9e9e5",
        "on-surface-variant": "#434655",
        "on-surface": "#0e0e0e",
        "primary": "#0e0e0e"
      },
      borderRadius: {
        // Sharp edges everywhere (rounded-full is kept for dots and avatars).
        "none": "0",
        "sm": "0",
        "DEFAULT": "0",
        "md": "0",
        "lg": "0",
        "xl": "0",
        "2xl": "0",
        "3xl": "0",
        "xl-12": "0",
        "full": "9999px"
      },
      spacing: {
        "margin-desktop": "48px",
        "gutter": "24px",
        "container-max": "1280px",
        "unit": "4px",
        "margin-mobile": "16px"
      },
      fontFamily: {
        sora: ["var(--font-tight)", "var(--font-inter)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        tight: ["var(--font-tight)", "var(--font-inter)", "sans-serif"]
      }
    },
  },
  plugins: [],
};
export default config;
