<script setup>
  import * as earcut from "earcut";
  import { Vector3, MeshBuilder, DirectionalLight, StandardMaterial } from "babylonjs";
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
    cam.position = new Vector3(-20, 8.6, -65);

    var sunPos = new Vector3(-100, 20, 100);

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
    myText.position = new Vector3(-6, 15, 10);
    myText.rotation = new Vector3(0, Math.PI / -5, 0);

    createBase(scene);
    createRoof(scene);
    createCeilingBlock(scene);
    createCeiling(scene);
    createRails(scene);
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

  const createBase = (scene) => {
    const blockMat = new BABYLON.StandardMaterial("base-mat", scene);

    const floor = BABYLON.MeshBuilder.CreateBox("floor", { height: 0.2, width: 36.5, depth: 15 }, scene);
    floor.material = blockMat;
    floor.position = new BABYLON.Vector3(0, 0, -7);

    const step1 = BABYLON.MeshBuilder.CreateBox("step1", { height: 0.2, width: 37.3, depth: 15.8 }, scene);
    step1.material = blockMat;
    step1.position = new BABYLON.Vector3(0, -0.2, -7);

    const step2 = BABYLON.MeshBuilder.CreateBox("step2", { height: 0.2, width: 38.1, depth: 16.6 }, scene);
    step2.material = blockMat;
    step2.position = new BABYLON.Vector3(0, -0.4, -7);

    return [floor, step1, step2];
  };

  const createRoof = (scene) => {
    const blockMat = new BABYLON.StandardMaterial("base-mat", scene);

    const roofCap1 = BABYLON.MeshBuilder.CreateCylinder("roofCap1", {
      tessellation: 3
    });
    roofCap1.convertToFlatShadedMesh();
    roofCap1.rotation = new BABYLON.Vector3(0, 0, Math.PI / 2);
    roofCap1.scaling = new BABYLON.Vector3(3, 0.5, 17);
    roofCap1.position = new BABYLON.Vector3(-17.6, 7.85, -7);
    roofCap1.material = blockMat;

    const roofCap2 = roofCap1.clone("roofCap2");
    roofCap2.position = new BABYLON.Vector3(17.6, 7.85, -7);

    const roofCenterMat = new BABYLON.StandardMaterial("base-mat", scene);

    const roofCenter = BABYLON.MeshBuilder.CreateCylinder("roofCenter", {
      tessellation: 3
    });
    roofCenter.convertToFlatShadedMesh();
    roofCenter.rotation = new BABYLON.Vector3(0, 0, Math.PI / 2);
    roofCenter.scaling = new BABYLON.Vector3(3, 17.4, 17);
    roofCenter.position = new BABYLON.Vector3(0, 7.8, -7);
    roofCenter.material = roofCenterMat;
  };

  const createCeilingBlock = (scene) => {
    const blockMat = new BABYLON.StandardMaterial("ceiling-mat", scene);

    const ceiling = BABYLON.MeshBuilder.CreateBox("ceiling", { height: 1.1, width: 36.5, depth: 15 }, scene);
    ceiling.material = blockMat;
    ceiling.position = new BABYLON.Vector3(0, 6.55, -7);
  };

  const createCeiling = (scene) => {
    const blockMat = new BABYLON.StandardMaterial("ceiling-mat", scene);

    const ceilingPlane = BABYLON.MeshBuilder.CreatePlane("ceiling-plane", { width: 36.2, height: 14 }, scene);
    ceilingPlane.material = blockMat;
    ceilingPlane.position = new BABYLON.Vector3(0, 5.9, -7);
    ceilingPlane.rotation = new BABYLON.Vector3(-Math.PI / 2, 0, 0);
  };

  const createRails = (scene) => {
    const railMat = new BABYLON.StandardMaterial("rail-mat", scene);

    const rail1 = BABYLON.MeshBuilder.CreateBox("rail", { height: 0.6, width: 36.3, depth: 0.8 }, scene);
    rail1.material = railMat;
    rail1.position = new BABYLON.Vector3(0, 5.76, 0);

    const rail2 = rail1.clone();
    rail2.position = new BABYLON.Vector3(0, 5.76, -14);

    const rail3 = BABYLON.MeshBuilder.CreateBox("rail", { height: 0.56, width: 0.75, depth: 14 }, scene);
    rail3.material = railMat;
    rail3.position = new BABYLON.Vector3(17.75, 5.76, -7);

    const rail4 = rail3.clone();
    rail4.position = new BABYLON.Vector3(-17.75, 5.76, -7);
  };
</script>
<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
