<script lang="ts" setup>
  import { Scene, Vector3, MeshBuilder, StandardMaterial, Color3, Color4, HemisphericLight, Texture } from "@babylonjs/core";
  // import the inspector module
  // import "@babylonjs/core/Debug/debugLayer";
  // import "@babylonjs/inspector";

  definePageMeta({
    featured: false,
    title: "3D Database",
    description: "Just a quick sidequest to make a 3D database with Babylon JS."
  });

  // Add lab-specific content here using the provided 'scene' instance
  const createLabContent = (scene: Scene) => {
    scene.clearColor = new Color4(0, 0, 0, 1);

    // enable the inspector
    scene.debugLayer.show();

    const texture = new Texture("../assets/matcaps/28292A_D3DAE5_A3ACB8_818183-256px.png", scene);
    texture.coordinatesMode = Texture.SPHERICAL_MODE; // SPHERICAL_MODE is used to make the texture wrap around the mesh

    const matcapMaterial = new StandardMaterial("matcap", scene);
    // matcapMaterial.disableLighting = true; // disable lighting to make the texture visible
    matcapMaterial.reflectionTexture = texture; // add the texture to the material instead of the diffuse texture

    const material = new StandardMaterial("material", scene);
    material.diffuseColor = new Color3(1, 1, 1);
    material.specularColor = new Color3(0.5, 0.6, 0.87);
    const cylinder = MeshBuilder.CreateCylinder("cylinder", { diameterTop: 1, diameterBottom: 1, height: 0.2, tessellation: 64 }, scene);
    cylinder.position = new Vector3(0, 0.5, 0);
    cylinder.material = matcapMaterial;

    const cylinder2 = cylinder.clone("cylinder2");
    cylinder2.position = new Vector3(0, 0.75, 0);

    const cylinder3 = cylinder.clone("cylinder3");
    cylinder3.position = new Vector3(0, 1, 0);

    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.5;
    light.diffuse = new Color3(0.8, 0.8, 0.8);
    light.groundColor = new Color3(0.4, 0.4, 0.4);

    // const light2 = new HemisphericLight("light2", new Vector3(0, 1, 0), scene);
    // light2.intensity = 1;
    // light2.diffuse = new Color3(0.8, 0.8, 0.8);
  };

  const bjsCanvas = ref(null);
  const labSceneOptions = {
    useCamera: true,
    useLights: false,
    useRoom: false
  };
  useCanvatoriumScene(bjsCanvas, createLabContent, labSceneOptions);
</script>
<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
