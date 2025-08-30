import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
// import checker from "vite-plugin-checker";

export default defineConfig({
  plugins: [
    react(),
    // checker({
    //   typescript: true,
    //   eslint: false, // { lintCommand: 'eslint "./src/**/*.{ts,tsx,js,jsx}"' },
    // }),
  ],
  server: {
    port: 3000,
    open: true,
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
