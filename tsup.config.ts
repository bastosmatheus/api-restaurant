import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src"],
  format: ["esm"],
  outDir: "dist",
});
