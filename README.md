# radical-canvatorium

### Using this proejct

Using npm version 19
`nvm use 19`

Install
`npm install`

Running in development mode
`npm run dev -- -o`

### To Do

- [ ] Get the local dev server working with self-signed ssl certs (https is required for WebXR)
- [ ] Resolve the issue with tsconfig.json. This happened as soon as I created the project using `npx nuxi init radical-canvatorium`

```
Cannot find type definition file for 'node'.
  The file is in the program because:
    Entry point of type library 'node' specified in compilerOptions
```

- [ ] Build lab notes in markdown.
- [ ] Add an overlay to the labs instead of additional elements around the scene: Title, notes, etc.
