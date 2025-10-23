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
    server: {
      // Permite subdominios de ngrok-free.dev (ej. adelina-sumption-calvin.ngrok-free.dev)
      allowedHosts: ['.ngrok-free.dev'],
      // opcional: acepta conexiones desde la red local
      
      host: true,
      proxy: {
        '/api': {
          target: 'http://10.0.0.138:8000',
          changeOrigin: true,
          secure: false,
        }
      },
    },
  },
});

