import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

export default defineConfig(({ command }) => ({
  base: command === "build" ? "/remotes/app1/" : "/",
  server: {
    port: 5171,
    strictPort: true,
    origin: "http://localhost:5171",
    cors: true,
  },
  build: {
    target: "esnext",
    outDir: "../../dist/remotes/app1",
    emptyOutDir: true,
    rolldownOptions: { input: "./src/App.tsx" },
  },
  plugins: [
    react(),
    federation({
      name: "app1",
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
