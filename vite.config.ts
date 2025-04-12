import { sentryVitePlugin } from "@sentry/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths(), sentryVitePlugin({
    org: "videoboxd",
    project: "videoboxd"
  }), sentryVitePlugin({
    org: "videoboxd",
    project: "videoboxd"
  })],

  build: {
    sourcemap: true
  }
});