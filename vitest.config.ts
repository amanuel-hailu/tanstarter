import react from "@vitejs/plugin-react";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vitest/config";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./src/lib/test/setup.ts"],
    include: ["src/__tests__/**/*.test.{ts,tsx}", "src/lib/test/**/*.test.{ts,tsx}"],
    exclude: ["**/node_modules/**", "**/dist/**"],
  },
  resolve: {
    alias: {
      "~": resolve(__dirname, "./src"),
    },
  },
});
