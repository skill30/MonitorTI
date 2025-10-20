// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  integrations: [react(), tailwind()],
  vite: {
    optimizeDeps: {
      include: ["react-router-dom"],
    },
    ssr: {
      noExternal: ["react-router-dom"], // Asegura que react-router-dom se incluya en el bundle SSR
    },
  },
});

