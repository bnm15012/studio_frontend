import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import checker from "vite-plugin-checker";
import path from "node:path";
import tsconfigPaths from "vite-tsconfig-paths";
import { visualizer } from "rollup-plugin-visualizer";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
    checker({
      typescript: true,
      eslint: false, // { lintCommand: 'eslint "./src/**/*.{ts,tsx,js,jsx}"' },
    }),
  ],
  server: {
    port: 3000,
    open: true,
    allowedHosts: ["interposingly-unmartial-rohan.ngrok-free.dev"]
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: "/",
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === "UNRESOLVED_IMPORT") {
          throw new Error(`Build failed due to unresolved import: ${warning.source}`);
        }
        warn(warning);
      },
    },
  },
});

