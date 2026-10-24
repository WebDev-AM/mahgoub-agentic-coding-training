import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    include: [
      "src/__hidden__/**/*.test.{js,jsx}",
      "src/__hidden__ new/**/*.test.{js,jsx}",
      "tests/__hidden__/**/*.test.{js,jsx}",
    ],
    setupFiles: ["src/__hidden__/setup.js"],
  },
});
