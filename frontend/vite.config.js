import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

import { cloudflare } from "@cloudflare/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
   plugins: [react(), tailwindcss(), cloudflare()],
   resolve: {
      alias: {
         "@": path.resolve(__dirname, "./src"),
      },
   },
   build: {
      rolldownOptions: {
         output: {
            codeSplitting: {
               groups: [
                  {
                     name: "vendor",
                     test: /node_modules\/(react|react-dom)/,
                  },
                  {
                     name: "ui",
                     test: /node_modules\/(@radix-ui|lucide-react|react-router-dom)/,
                  },
               ],
            },
         },
      },
      chunkSizeWarningLimit: 500,
   },
});