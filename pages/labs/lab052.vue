<script setup>
  import { Vector3, Animation } from "babylonjs";
  import { TextBlock, Image, Ellipse, Control } from "babylonjs-gui";

  definePageMeta({
    featured: false,
    title: "Lab 052 - Fonts",
    description: "Working with fonts on an AdvancedDynamicTexture."
  });

  const createLabContent = async (scene) => {
    // Position the non-VR camera to better see the card
    const cam = scene.getCameraByName("camera");
    cam.position = new Vector3(0, 1.4, -2);

    const lab052_example_1 = (scene, useCustom) => {
      const { plane, advancedTexture } = canLabCardSimple(8, 3.2, scene);
      plane.name = "parent-plane";
      plane.position = new Vector3(0, 1.2, 0);
      plane.scaling = new Vector3(0.2, 0.2, 0.2);

      const ellipseContainer = new Ellipse("masker");
      ellipseContainer.width = "100px";
      ellipseContainer.height = "100px";
      ellipseContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
      ellipseContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
      ellipseContainer.left = "30px";
      ellipseContainer.top = "30px";
      ellipseContainer.thickness = 0;
      advancedTexture.addControl(ellipseContainer);

      // load an image on the GUI
      const image = new Image("but", "/assets/vrhermit-2023.jpg");
      ellipseContainer.addControl(image);

      const cardText = new TextBlock("card-text");
      cardText.text = "vrhermit";
      cardText.color = labColors.slate8;
      cardText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
      cardText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
      cardText.top = 40;
      cardText.left = 150;
      cardText.fontSize = 64;
      if (useCustom) {
        console.log("Using custom font", useCustom);
        cardText.fontFamily = "Atkinson Hyperlegible Bold";
      }
      advancedTexture.addControl(cardText);

      const paragraph = new TextBlock();
      paragraph.text = "Developer General working with a variety of technology to solve real problems. I focus on UI/UX, Workflow, and Spatial Computing.";
      paragraph.color = labColors.slate8;
      paragraph.background = "white";
      paragraph.fontSize = 28;
      if (useCustom) {
        paragraph.fontFamily = "Atkinson Hyperlegible";
      }
      paragraph.textWrapping = true;
      paragraph.width = 0.9;
      paragraph.height = 0.36;
      paragraph.top = 60;
      paragraph.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
      paragraph.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
      advancedTexture.addControl(paragraph);

      return { plane, advancedTexture };
    };

    const { plane: example1 } = lab052_example_1(scene, true);
    example1.position = new Vector3(0, 1.4, 0);

    const { plane: example2 } = lab052_example_1(scene, false);
    example2.position = new Vector3(0, 0.7, 0);
  };

  const bjsCanvas = ref(null);
  useCanvatoriumScene(bjsCanvas, createLabContent);
</script>

<style scoped>
  .ah-font {
    font-family: "Atkinson Hyperlegible", sans-serif;
  }
  .ahb-font {
    font-family: "Atkinson Hyperlegible Bold", sans-serif;
  }
  .ahi-font {
    font-family: "Atkinson Hyperlegible Italic", sans-serif;
  }
  .ahbi-font {
    font-family: "Atkinson Hyperlegible Bold Italic", sans-serif;
  }

  .noto-font {
    font-family: "NotoSans-Regular", sans-serif;
  }

  .noto-medium-font {
    font-family: "NotoSans-Medium", sans-serif;
  }
</style>

<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
  <!-- Using a font in Babylon JS is not enough to tell the browser to load it -->
  <!-- Use the font on an off-screen element to force the browser to load it -->
  <!-- TODO: Creating a component where I can specify the fonts that I need for a lab. -->
  <div style="opacity: 0; z-index: -100">
    <!-- <div style="padding-top: calc(100vh * 2)"> -->
    <p class="ah-font">Loading font Atkinson-Hyperlegible-Regular</p>
    <p class="ahb-font">Loading font Atkinson-Hyperlegible-Bold</p>
    <p class="ahi-font">Loading font Atkinson-Hyperlegible-Italic</p>
    <p class="ahbi-font">Loading font Atkinson-Hyperlegible-Bold-Italic</p>
    <p class="noto-font">Loading font NotoSans-Regular</p>
    <p class="noto-medium-font">Loading font NotoSans-Medium</p>
  </div>
</template>
