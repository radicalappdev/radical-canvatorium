<script lang="ts" setup>
  import { Scene, Vector3 } from "@babylonjs/core";
  import { TextBlock, Rectangle, AdvancedDynamicTexture } from "@babylonjs/gui";

  definePageMeta({
    featured: false,
    title: "Title Card Generator",
    description: ""
  });

  const title = ref("Enter a title");
  const subtitle = ref("Subtitle with a longer text string");

  const createLabContent = async (scene: Scene) => {
    const cam = scene.getCameraByName("camera");
    if (cam) {
      cam.position = new Vector3(2, 1.8, -3);
    }

    createLabCard(scene);
  };

  const createLabCard = (scene: Scene) => {
    const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("lab-overlay", true, scene);

    advancedTexture.name = "can-texture";

    // Create a background rectangle
    const rect = new Rectangle();
    rect.width = 0.7;
    rect.height = 0.7;
    rect.cornerRadius = 28;
    rect.color = labColors.slate8;
    rect.thickness = 6;
    rect.background = labColors.slate2;
    rect.alpha = 0.8;
    advancedTexture.addControl(rect);

    const cardText = new TextBlock("card-text");
    cardText.text = title.value;
    cardText.fontFamily = "Verdana";
    cardText.color = labColors.slate8;
    cardText.fontSize = 70;
    cardText.top = -40;
    cardText.textWrapping = true;
    rect.addControl(cardText);

    const cardText2 = new TextBlock("card-text2");
    cardText2.text = subtitle.value;
    cardText2.color = labColors.slate8;
    cardText2.fontSize = 28;
    cardText2.fontFamily = "Verdana";
    cardText2.top = 60;
    rect.addControl(cardText2);

    // watch for changes to the title and subtitle
    watch(title, (newVal) => {
      cardText.text = newVal;
    });

    watch(subtitle, (newVal) => {
      cardText2.text = newVal;
    });

    return;
  };

  // If a lab uses the default options, you can just call useBabylonScene() with the bjsCanvas ref and the createLabContent function.
  // Otherwise, you can pass in an options object with the following properties:
  const labSceneOptions = {
    useCamera: true,
    useLight: true,
    useRoom: true,
    useWebXRPlayer: false
  };

  const bjsCanvas = ref(null);
  // With scene options
  useCanvatoriumScene(bjsCanvas, createLabContent, labSceneOptions);

  // Without scene options (see lab001 for an example)
  // useCanvatoriumScene(bjsCanvas, createLabContent);
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

  /* Add some css to style the inputs and parent div  */
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
