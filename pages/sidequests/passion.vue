<script setup>
  import * as earcut from "earcut";
  import { Vector3, MeshBuilder, DirectionalLight } from "babylonjs";
  import { SkyMaterial } from "babylonjs-materials";
  //   import { TextBlock } from "babylonjs-gui";

  // Fonts from https://www.kenney.nl/assets/kenney-fonts
  // Converted with http://gero3.github.io/facetype.js/

  console.log(earcut);

  definePageMeta({
    featured: false,
    title: "3D Graphics is my Passion",
    description: "lol"
  });

  // Add lab-specific content here using the provided 'scene' instance
  const createLabContent = async (scene) => {
    // Lab 001 only. Move the camera to a better position for the initial scene.
    const cam = scene.getCameraByName("camera");
    cam.position = new Vector3(0, 2.6, -15);

    var sunPos = new Vector3(-100, 2, 100);

    var skyMaterial = new SkyMaterial("skyMaterial", scene);
    skyMaterial.backFaceCulling = false;
    skyMaterial.turbidity = 0.3;
    skyMaterial.luminance = 0.25;
    skyMaterial.useSunPosition = true; // Do not set sun position from azimuth and inclination
    skyMaterial.sunPosition = sunPos;
    skyMaterial.cameraOffset.y = 200;

    var skybox = MeshBuilder.CreateBox("skyBox", { size: 2000 }, scene);
    skybox.material = skyMaterial;

    const daylight = new DirectionalLight("daylight", new BABYLON.Vector3(sunPos.x - sunPos.x * 2, sunPos.y, sunPos.z - sunPos.z * 2), scene);
    daylight.intensity = 1;

    var fontBlocks = await (await fetch("../../assets/3d-fonts/Kenney_Blocks_Regular.json")).json();
    var fontFuture = await (await fetch("../../assets/3d-fonts/Kenney_Future_Regular.json")).json();

    var myText = MeshBuilder.CreateText(
      "myText",
      "3D Graphics",
      fontFuture,
      {
        size: 16,
        resolution: 64,
        depth: 10
      },
      scene,
      earcut
    );
    console.log(myText);
    myText.scaling = new Vector3(0.1, 0.1, 0.1);
    myText.position = new Vector3(-6, 5, 10);
    myText.rotation = new Vector3(0, Math.PI / -5, 0);
  };

  // If a lab uses the default options, you can just call useBabylonScene() with the bjsCanvas ref and the createLabContent function.
  // Otherwise, you can pass in an options object with the following properties:
  const labSceneOptions = {
    useCamera: true,
    useLight: true,
    useRoom: false
  };

  const bjsCanvas = ref(null);
  // With scene options
  useCanvatoriumScene(bjsCanvas, createLabContent, labSceneOptions);

  // Without scene options (see lab001 for an example)
  // useCanvatoriumScene(bjsCanvas, createLabContent);
</script>
<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
