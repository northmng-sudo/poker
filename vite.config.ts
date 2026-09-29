import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// GitHub Pages project site (username.github.io/<repo>/) шаарддаг base path-ийг
// VITE_APP_BASE_PATH орчны хувьсагчаар удирдана. Root/custom domain дээр "/" гэж
// орхино (docs/deployment.md харах).
export default defineConfig(({ mode }) => {
  const base = process.env.VITE_APP_BASE_PATH || "/";
  return {
    base,
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: "dist",
      sourcemap: mode !== "production",
    },
  };
});
