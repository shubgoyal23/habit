import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
   plugins: [react(), tailwindcss()],
   resolve: {
      alias: {
         "@": path.resolve(__dirname, "./src"),
      },
   },
   build: {
      rollupOptions: {
         output: {
            manualChunks: {
               react: ["react", "react-dom"],
               ui: ["react-router-dom"],
            },
         },
      },
      chunkSizeWarningLimit: 500,
   },
});
