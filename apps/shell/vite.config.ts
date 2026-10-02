import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

export default defineConfig(({ command }) => {
  const remoteEntry = (name: string, devPort: number) =>
    command === "build"
      ? `/remotes/${name}/remoteEntry.js`
      : `http://localhost:${devPort}/remoteEntry.js`;

  return {
    server: { port: 5170, strictPort: true, origin: "http://localhost:5170" },
    preview: { port: 5180, strictPort: true },
    build: { target: "esnext", outDir: "../../dist", emptyOutDir: true },
    plugins: [
      react(),
      federation({
        name: "shell",
        dts: false,
        remotes: {
          app1: {
            type: "module",
            name: "app1",
            entry: remoteEntry("app1", 5171),
          },
          app2: {
            type: "module",
            name: "app2",
            entry: remoteEntry("app2", 5172),
          },
        },
        shared: {
          react: { singleton: true },
          "react-dom": { singleton: true },
          "react-router": { singleton: true },
          "@mfe/contracts": { singleton: true },
        },
      }),
    ],
  };
});
