<script lang="ts" setup>
  import { Scene, Vector3 } from "@babylonjs/core";
  import { TextBlock, Rectangle, AdvancedDynamicTexture } from "@babylonjs/gui";

  definePageMeta({
    featured: false,
    title: "Title Card Generator",
    description: "Just a quick sidequest to generate a title card some blog posts."
  });

  const title = ref("Text Image Card");
  const subtitle = ref("With a title, subtitle and background. Rendered with Babylon JS.");

  const createLabContent = async (scene: Scene) => {
    const cam = scene.getCameraByName("camera");
    if (cam) {
      cam.position = new Vector3(2, 1.8, -3);
    }

    createLabCard(scene);
  };

  const createLabCard = (scene: Scene) => {
    const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("lab-overlay", true, scene);
    // increase the render scale to improve text quality
    advancedTexture.renderScale = 2;

    advancedTexture.name = "can-texture";

    // Create a background rectangle
    const rect = new Rectangle();
    rect.width = 0.7;
    rect.height = 0.7;
    rect.cornerRadius = 96;
    rect.color = labColors.slate8;
    rect.thickness = 12;
    rect.background = labColors.slate2;

    advancedTexture.addControl(rect);

    const cardText = new TextBlock("card-text");
    cardText.text = title.value;
    cardText.fontFamily = "Verdana";
    cardText.color = labColors.slate8;
    cardText.fontSize = 144;
    cardText.top = -100;
    cardText.textWrapping = true;
    cardText.verticalAlignment = 2;
    rect.addControl(cardText);

    const cardText2 = new TextBlock("card-text2");
    cardText2.text = subtitle.value;
    cardText2.color = labColors.slate8;
    cardText2.fontSize = 52;
    cardText2.fontFamily = "Verdana";
    cardText2.top = 140;
    cardText2.width = 0.8;
    cardText2.textWrapping = true;
    rect.addControl(cardText2);

    watch(title, (newVal) => {
      cardText.text = newVal;
    });

    watch(subtitle, (newVal) => {
      cardText2.text = newVal;
    });

    return;
  };

  const labSceneOptions = {
    useCamera: true,
    useLight: true,
    useRoom: true,
    useWebXRPlayer: false
  };
  const bjsCanvas = ref(null);
  useCanvatoriumScene(bjsCanvas, createLabContent, labSceneOptions);
</script>
<template>
  <canvas id="bjsCanvasLocal" ref="bjsCanvas"></canvas>
  <br />
  <div>
    <input v-model="title" placeholder="Title" />

    <input v-model="subtitle" placeholder="Subtitle" />
  </div>
</template>

<style scoped>
  #bjsCanvasLocal {
    width: 1280px;
    height: 720px;
    touch-action: none;
    margin: 0 auto;
    display: block;
  }

  input {
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
    box-sizing: border-box;
    border-radius: 8px;
  }

  label {
    font-size: 1.2em;
    font-weight: bold;
  }

  div {
    margin: 0 auto;
    width: 50%;
  }
</style>
