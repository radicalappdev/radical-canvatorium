// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss"],

  css: [
    // ...
    "@/assets/fonts.css"
  ],

  routeRules: {
    "/sidequests/passion": { ssr: false },
    "/labs/lab054": { ssr: false },
    "/labs/lab055": { ssr: false }
  },

  devServer: {
    https: true
  },

  compatibilityDate: "2024-10-22"
});