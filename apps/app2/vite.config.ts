import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

export default defineConfig(({ command }) => ({
  base: command === "build" ? "/remotes/app2/" : "/",
  server: {
    port: 5172,
    strictPort: true,
    origin: "http://localhost:5172",
    cors: true,
  },
  build: {
    target: "esnext",
    outDir: "../../dist/remotes/app2",
    emptyOutDir: true,
    rolldownOptions: { input: "./src/App.tsx" },
  },
  plugins: [
    react(),
    federation({
      name: "app2",
      filename: "remoteEntry.js",
      dts: false,
      exposes: {
        "./App": "./src/App.tsx",
      },
      shared: {
        react: { singleton: true },
        "react-dom": { singleton: true },
        "react-router": { singleton: true },
        "@mfe/contracts": { singleton: true },
      },
    }),
  ],
}));
