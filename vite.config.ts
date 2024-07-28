import path from "node:path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/audioworklet-keyboard/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
