import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";
import { fileURLToPath, URL } from "url";
const __dirname = path.dirname(fileURLToPath(new URL(import.meta.url)));
export default defineConfig(() => {
  return {
    plugins: [
      react({
        jsxImportSource: '@emotion/react',
        babel: {
          plugins: ['@emotion/babel-plugin']
        }
      })
    ],    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        '@emotion/styled': '@emotion/styled/base',
        "date-fns/_lib/format/longFormatters":
          "date-fns/esm/_lib/format/longFormatters/index.js",
      },
    },
  };
});