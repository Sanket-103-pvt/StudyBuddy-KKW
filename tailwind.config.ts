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
        "primary-fixed": "#dbe1ff",
        "text-secondary-dark": "#9CA3AF",
        "tertiary": "#943700",
        "surface-container-highest": "#dce2f3",
        "secondary-fixed": "#ffddb8",
        "surface-tint": "#0053db",
        "primary-fixed-dim": "#b4c5ff",
        "bg-light": "#FAFAFA",
        "border-light": "#E5E7EB",
        "outline": "#737686",
        "on-primary-fixed-variant": "#003ea8",
        "secondary": "#855300",
        "text-primary-dark": "#F3F4F6",
        "on-primary": "#ffffff",
        "tertiary-fixed-dim": "#ffb596",
        "on-tertiary-container": "#ffede6",
        "background": "#f9f9ff",
        "text-primary-light": "#111827",
        "secondary-container": "#fea619",
        "tertiary-fixed": "#ffdbcd",
        "on-secondary-fixed-variant": "#653e00",
        "inverse-surface": "#2a313d",
        "error-container": "#ffdad6",
        "text-secondary-light": "#6B7280",
        "border-dark": "#1F2937",
        "on-primary-fixed": "#00174b",
        "surface-container": "#e7eefe",
        "on-background": "#151c27",
        "surface-bright": "#f9f9ff",
        "tertiary-container": "#bc4800",
        "on-error": "#ffffff",
        "on-tertiary": "#ffffff",
        "surface-container-low": "#f0f3ff",
        "inverse-on-surface": "#ebf1ff",
        "on-primary-container": "#eeefff",
        "error": "#ba1a1a",
        "surface-dim": "#d3daea",
        "on-tertiary-fixed-variant": "#7d2d00",
        "on-secondary-fixed": "#2a1700",
        "on-error-container": "#93000a",
        "surface-variant": "#dce2f3",
        "on-tertiary-fixed": "#360f00",
        "surface": "#f9f9ff",
        "primary-container": "#2563eb",
        "on-secondary-container": "#684000",
        "outline-variant": "#c3c6d7",
        "bg-dark": "#0F1115",
        "surface-container-lowest": "#ffffff",
        "secondary-fixed-dim": "#ffb95f",
        "on-secondary": "#ffffff",
        "inverse-primary": "#b4c5ff",
        "surface-container-high": "#e2e8f8",
        "on-surface-variant": "#434655",
        "on-surface": "#151c27",
        "primary": "#004ac6"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "xl-12": "12px", // user custom 12px for subject cards
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
        sora: ["var(--font-sora)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        tight: ["var(--font-tight)", "var(--font-inter)", "sans-serif"]
      }
    },
  },
  plugins: [],
};
export default config;
