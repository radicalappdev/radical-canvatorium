import path from "path";
import fs from "fs";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss"],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, "key.pem")),
      cert: fs.readFileSync(path.resolve(__dirname, "cert.pem"))
    }
  }
});
