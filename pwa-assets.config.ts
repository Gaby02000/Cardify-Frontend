import { defineConfig } from "@vite-pwa/assets-generator/config";

// Genera favicon + iconos PWA + apple-touch-icon a partir de un único SVG.
// Fondo oscuro de marca para el maskable y el icono de iOS (en vez del blanco por defecto).
export default defineConfig({
  headLinkOptions: { preset: "2023" },
  preset: {
    transparent: {
      sizes: [64, 192, 512],
      favicons: [[48, "favicon.ico"]],
    },
    maskable: {
      sizes: [512],
      padding: 0.3,
      resizeOptions: { background: "#0a0a0e" },
    },
    apple: {
      sizes: [180],
      padding: 0.3,
      resizeOptions: { background: "#0a0a0e" },
    },
  },
  images: ["public/logo.svg"],
});
