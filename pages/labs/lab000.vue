<script setup>
  import { ref } from "vue";
  import { Vector3, Color3, Color4, MeshBuilder, StandardMaterial } from "babylonjs";
  import { AdvancedDynamicTexture, TextBlock } from "babylonjs-gui";

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
  const createLabContent = async (scene) => {
    // Lab 001 only. Move the camera to a better position for the initial scene.
    const cam = scene.getCameraByName("camera");
    cam.position = new Vector3(0, 1.4, -4);

    // make the camera move back and forth along it's orbit path, but stay in front of the lab content
    scene.registerBeforeRender(() => {
      cam.alpha += 0.005;
    });

    const material = new StandardMaterial("background-material", scene);
    material.diffuseColor = new Color3.FromHexString(labColors.slate2);
    material.alpha = 1;

    const background = MeshBuilder.CreateBox("background", { width: 3, height: 1, depth: 0.1 });
    background.material = material;
    background.position.y = 1.1;
    background.enableEdgesRendering();
    background.edgesWidth = 1.5;
    background.edgesColor = new Color4.FromHexString(labColors.slate7);

    const guiPlane = MeshBuilder.CreatePlane("gui-plane");
    guiPlane.parent = background;
    guiPlane.position.y = 0.14;
    guiPlane.position.z = -0.08;

    const advancedTexture = AdvancedDynamicTexture.CreateForMesh(guiPlane);
    advancedTexture.name = "card-texture";

    const cardText = new TextBlock("card-text");
    cardText.text = "Canvatorium";
    cardText.color = labColors.slate8;
    cardText.fontSize = 64;

    const subtitleText = new TextBlock("subtitle-text");
    subtitleText.text = "(revamped)";
    subtitleText.color = labColors.slate7;
    subtitleText.fontSize = 32;
    subtitleText.top = 60;

    advancedTexture.addControl(cardText);
    advancedTexture.addControl(subtitleText);
    guiPlane.scaling = new Vector3(5, 5, 5);

    // Create a second plane with a different texture to show on the back of the card
    const guiPlane2 = MeshBuilder.CreatePlane("gui-plane2");
    guiPlane2.parent = background;
    guiPlane2.position.y = 0.14;
    guiPlane2.position.z = 0.08;
    guiPlane2.rotation.y = Math.PI;
    guiPlane2.scaling = new Vector3(5, 5, 5);

    const advancedTexture2 = AdvancedDynamicTexture.CreateForMesh(guiPlane2);
    advancedTexture2.name = "card-texture2";

    const cardText2 = new TextBlock("card-text2");
    cardText2.text = "An experimental design lab for";
    cardText2.color = labColors.slate8;
    cardText2.fontSize = 32;

    const subtitleText2 = new TextBlock("subtitle-text2");

    subtitleText2.text = "Spatial Computing";
    subtitleText2.color = labColors.slate8;
    subtitleText2.fontSize = 32;
    subtitleText2.top = 60;

    advancedTexture2.addControl(cardText2);
    advancedTexture2.addControl(subtitleText2);
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
