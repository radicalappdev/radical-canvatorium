# radical-canvatorium

### Using this proejct

Using npm version 19 with nvm installed
`nvm use 19`

Install
`npm install`

Running in development mode
`npm run dev -- -o`

### Using self-signed certs with localhost

WebXR scenes need to be served over HTTPS. While working on the project locally, I often need to test the scene on another device such as an Oculus Quest 2. I followed the steps in the article linked below and configured the project with some self-signed certs that will work for local network testing. The browser may still warn or block these certs, but you can click past the warning and access the scene. If you are working with a VR headset attached to your PC, then you can remove the https object from `nuxt.config.js` and/or remove reset the dev script from `"dev": "nuxt dev --https --ssl-cert cert.pem --ssl-key key.pem",` to `"dev": "nuxt dev`

Alternative: you can use ngrok to forward your local dev server to a URL. I found this to be really slow and prone to errors...

Using mkdir to create the certs at the project root

```
mkcert -key-file key.pem -cert-file cert.pem "localhost"
```

Update `nuxt.config.ts` to use the server object with https

```ts
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
```

Update the dev script in `package.json` to `"dev": "nuxt dev --https --ssl-cert cert.pem --ssl-key key.pem",`

### Troubleshooting an issue with Vite / Nuxt

When setting up a new Windows machine I was unable to get the project to run. I came to the mac to document the node and npm versions.
macOS is using node v19.8.1 and npm v 9.5.1

I tried to server the mac version and it generated the same error. I looked at the recent commits and the only major change was the inclusion of the babylon-loaders. I commented out the loaders and launched a new terminal window. The project launched successfully.
