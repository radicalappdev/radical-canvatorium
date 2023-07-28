<script setup>
  import * as earcut from "earcut";
  import { Vector3, MeshBuilder } from "babylonjs";
  import { SkyMaterial } from "babylonjs-materials";
  import { TextBlock } from "babylonjs-gui";

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
    cam.position = new Vector3(0, 1.4, -4);

    var sunPos = new Vector3(8, 4, 20);

    var skyMaterial = new SkyMaterial("skyMaterial", scene);
    skyMaterial.backFaceCulling = false;
    skyMaterial.turbidity = 0.1;
    skyMaterial.luminance = 0.25;
    skyMaterial.useSunPosition = true; // Do not set sun position from azimuth and inclination
    skyMaterial.sunPosition = sunPos;
    skyMaterial.cameraOffset.y = 64;

    var skybox = MeshBuilder.CreateBox("skyBox", { size: 1000 }, scene);
    skybox.material = skyMaterial;

    var fontData = await (await fetch("../../assets/3d-fonts/Kenney_Future_Regular.json")).json();
    console.log(fontData);
    var myText = MeshBuilder.CreateText(
      "myText",
      "3D Graphics",
      fontData,
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

    const { plane } = createLabCard();

    scene.registerBeforeRender(() => {
      plane.rotation.y += 0.005;
    });
  };

  const createLabCard = (scene) => {
    const { plane, advancedTexture } = canLabCardSimple(6, 3.6, scene);

    plane.name = "can-plane";
    plane.position = new Vector3(0, 1.2, 0);
    plane.scaling = new Vector3(0.3, 0.3, 0.3);
    advancedTexture.name = "can-texture";

    const cardText = new TextBlock("card-text");
    cardText.text = "3D";
    // font sometimg modern and clean and sans
    cardText.fontFamily = "Verdana";
    cardText.color = labColors.slate8;
    cardText.fontSize = 70;
    cardText.top = -40;
    advancedTexture.addControl(cardText);

    const subtitleText = new TextBlock("subtitle-text");
    subtitleText.text = "Graphics";
    subtitleText.color = labColors.slate7;
    subtitleText.fontSize = 28;
    subtitleText.top = -90;
    subtitleText.left = 190;
    advancedTexture.addControl(subtitleText);

    const cardText2 = new TextBlock("card-text2");
    cardText2.text = "is my";
    cardText2.color = labColors.slate8;
    cardText2.fontSize = 28;
    cardText2.fontFamily = "Verdana";
    cardText2.top = 60;
    advancedTexture.addControl(cardText2);

    const subtitleText2 = new TextBlock("subtitle-text2");
    subtitleText2.text = "Passion";
    subtitleText2.color = labColors.slate8;
    subtitleText2.fontSize = 28;
    subtitleText2.fontFamily = "Verdana";
    subtitleText2.top = 100;
    advancedTexture.addControl(subtitleText2);

    return { plane, advancedTexture };
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
