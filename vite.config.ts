import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/glm-project/", // Replace 'glm-project' with your actual GitHub repository name
});
