import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  build: {
    outDir: "dist",
    lib: {
      entry: "src/main.ts",
      formats: ["cjs"],
      fileName: () => "main.cjs"
    },
    rollupOptions: {
      external: ["express", "cors", "bcryptjs", "better-sqlite3", "jsonwebtoken", "zod"],
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].cjs",
        chunkFileNames: "[name].cjs",
        assetFileNames: "[name].cjs"
      }
    }
  }
});