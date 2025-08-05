import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["apps/backend/src/**/*.ts", "domain/src/**/*.ts"],
      exclude: [
        "apps/backend/src/**/*.interface.ts",
        "apps/backend/src/**/*.type.ts",
        "apps/backend/src/**/*.dto.ts",
        "apps/backend/src/**/index.ts",
        "apps/backend/src/config/**",
        "apps/backend/src/routes/**",
      ],
    },
  },
  resolve: {
    alias: {
      "@domain": path.resolve(__dirname, "./domain/src"),
      "@": path.resolve(__dirname, "./apps/backend/src"),
    },
  },
});
