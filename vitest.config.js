import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.js"],
    globalSetup: ["./tests/global-setup.js"],
    hookTimeout: 120_000,
  },
});
