import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/spleetify/",     // nodig voor GitHub Pages (subfolder)
  build: {
    outDir: "docs",        // <<< HIER: build direct naar /docs
  },
});
