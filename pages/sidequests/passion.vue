<script setup>
  import { Vector3 } from "babylonjs";
  import { TextBlock } from "babylonjs-gui";

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
    cardText.text = "3D Graphics";
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
