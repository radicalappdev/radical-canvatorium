# radical-canvatorium

This is the main codebase for the Radical Canvatorium project. It uses Nuxt and Vue JS to create labs and benches built with Babylon JS.

- Labs are used to explore concepts for Spatial Computing, VR, AR, WebXR, etc. Labs will nearly always be intended to be viewed in VR or AR
- Benches are used to explore simple 3D concepts that may be used in the labs. Benches will not have VR or AR support.

## Using this project

Using npm version 19 with nvm installed
`nvm use 19`

Install
`npm install`

Running in development mode
`npm run dev` // standard Vite server
or
`npm run dev-winows` // to use the self-signed certs on Windows
or
`npm run dev-mac` // to use the self-signed certs on macOS

### Using WebXR with self-signed certs

WebXR scenes need to be served over HTTPS. While working on the project locally, I often need to test the scene on another device such as an Oculus Quest 2.

#### Setup certs

- Install mkcert `npm install -g mkcert`
- Run this command to create local certs `mkcert -key-file ./.certs/key.pem -cert-file ./.certs/cert.pem "localhost"`
- Update package.json to use the local certs. This example works on mac.
  `"dev-mac": "NODE_ENV=development nuxt dev --https --ssl-cert ./.certs/cert.pem --ssl-key ./.certs/key.pem --host --port=5555",`

Note: The browser may still warn or block these certs, but you can click past the warning and access the scene.

Alternative: you can use ngrok to forward your local dev server to a URL. I found this to be really slow and prone to errors...

---

## Licenses

- SVG Maps in `public/assets/maps/` are licensed under the [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/)
- I made the following change to the [Ohio map](https://mapsvg.com/maps/usa-oh) (`usa-oh.svg`) to make it work with the project:

Error: L command and subsequent coordinates.

```svg
m 10.883377,8.7409263 2.924,-0.496 2.885,1.0279998 -2.325,0.386 -1.47,0.217 -1.171,1.6780009 -0.261,0.486 -0.934,0.798 -0.279,0.036 -0.117,-0.942 L 9.7743771,8.9349261 10.883377,8.7409263
```

Fixed: removed the L command and updated the coordinates to be relative.

```svg
m 10.8834 8.7409 l 2.924 -0.496 l 2.885 1.028 l -2.325 0.386 l -1.47 0.217 l -1.171 1.678 l -0.261 0.486 l -0.934 0.798 l -0.279 0.036 l -0.117 -0.942 l -0.3734 -2.9239 l 1.1214 -0.2671
```
