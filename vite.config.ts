import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig(({ command, mode }) => {
  const rootList = <Record<string, string>>{
    development: "/",
    demo: "./examples",
  };
  return {
    root: rootList[mode],
    plugins: [vue()],
    build: {
      outDir: "dist",
      minify: true,
      rollupOptions: {
        external: ["vue", "tdesign-vue-next"],
        output: [
          {
            format: "es",
            entryFileNames: "[name].js",
            dir: "dist/es",
            globals: {
              vue: "Vue",
            },
          },
          {
            format: "cjs",
            entryFileNames: "[name].js",
            dir: "dist/lib",
            globals: {
              vue: "Vue",
            },
          },
        ],
      },
      lib: {
        entry: "./packages/index.ts",
        fileName: "w-schema-form",
      },
    },
  };
});
