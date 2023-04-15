import path from "path";
import fs from "fs";
const options = require("./generate-cert");

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss"],
  server: {
    https: {
      key: options.key,
      cert: options.cert
    }
    // https: {
    //   key: fs.readFileSync(path.resolve(__dirname, "key.pem")),
    //   cert: fs.readFileSync(path.resolve(__dirname, "cert.pem"))
    // }
  }
});
