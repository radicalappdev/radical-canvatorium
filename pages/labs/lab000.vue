<script lang="ts" setup>
  // import { Scene, Vector3 } from "@babylonjs/core";
  // import { TextBlock } from "@babylonjs/gui";

  import { Scene, Vector3 } from "@babylonjs/core";
  import { TextBlock } from "@babylonjs/gui";

  definePageMeta({
    featured: false,
    title: "Lab 000 – Hello Canvatorium",
    description: "This is a recreation of the original Canvatorium Lab 000 where I set up some shared lab resources.",
    labNotes: `Welcome to Canvatorium Lab 000.
  This is a recreation of the original Canvatorium Lab 000 where I can set up and test some shared lab resources.

  ### Done
  - Camera
  - Lights
  - Room and teleport mesh
  - WebXR helper

  ### To do
  - VR Controlelr input
  - VR Navigation system
  - VR Menu
      - Lab info page
      - Console log
  `
  });

  // Add lab-specific content here using the provided 'scene' instance
  const createLabContent = async (scene: Scene) => {
    // Lab 001 only. Move the camera to a better position for the initial scene.
    const cam = scene.getCameraByName("camera");
    if (cam) {
      cam.position = new Vector3(0, 1.4, -4);
    }

    const { plane } = createLabCard(scene);

    scene.registerBeforeRender(() => {
      plane.rotation.y += 0.005;
    });
  };

  const createLabCard = (scene: Scene) => {
    const { plane, advancedTexture } = canLabCardSimple(6, 3.6, scene);

    plane.name = "can-plane";
    plane.position = new Vector3(0, 1.2, 0);
    plane.scaling = new Vector3(0.3, 0.3, 0.3);
    advancedTexture.name = "can-texture";

    const cardText = new TextBlock("card-text");
    cardText.text = "Canvatorium";
    cardText.fontFamily = "Verdana";
    cardText.color = labColors.slate8;
    cardText.fontSize = 70;
    cardText.top = -40;
    advancedTexture.addControl(cardText);

    const subtitleText = new TextBlock("subtitle-text");
    subtitleText.text = "(revamped)";
    subtitleText.color = labColors.slate7;
    subtitleText.fontSize = 28;
    subtitleText.top = -90;
    subtitleText.left = 190;
    advancedTexture.addControl(subtitleText);

    const cardText2 = new TextBlock("card-text2");
    cardText2.text = "An experimental design lab for";
    cardText2.color = labColors.slate8;
    cardText2.fontSize = 28;
    cardText2.fontFamily = "Verdana";
    cardText2.top = 60;
    advancedTexture.addControl(cardText2);

    const subtitleText2 = new TextBlock("subtitle-text2");
    subtitleText2.text = "Spatial Computing";
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
    useRoom: true
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
