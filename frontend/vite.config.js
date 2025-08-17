import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path";

const PORT = 3030;
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: { port: PORT, host: true }
})
