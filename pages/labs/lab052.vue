<script lang="ts" setup>
  import { Scene, Vector3 } from "babylonjs";
  import { TextBlock, Image, Ellipse, Control } from "babylonjs-gui";

  definePageMeta({
    featured: false,
    title: "Lab 052 - Custom Fonts",
    description: "Working with fonts on an AdvancedDynamicTexture requires a bit of work.",
    labNotes: `
    Using a font in Babylon JS is not enough to tell the browser to load it. We have to import it in CSS and use it somewhere in the HRML. I'm using a hidden div to load the fonts in the detault.vue template file shared by all labs.
    `
  });

  const createLabContent = async (scene: Scene) => {
    // Position the non-VR camera to better see the card
    const cam = scene.getCameraByName("camera");
    if (cam) {
      cam.position = new Vector3(0, 1.4, -2);
    }

    const lab052_example_1 = (scene: Scene, useCustom: boolean) => {
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
      advancedTexture.addControl(cardText);

      const paragraph = new TextBlock();
      paragraph.text = "Developer General working with a variety of technology to solve real problems. I focus on UI/UX, Workflow, and Spatial Computing.";
      paragraph.color = labColors.slate8;
      paragraph.fontSize = 28;
      paragraph.textWrapping = true;
      paragraph.width = 0.9;
      paragraph.height = 0.36;
      paragraph.top = 60;
      paragraph.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
      paragraph.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;

      if (useCustom) {
        console.log("Using custom fonts", "NotoSans-Bold", "NotoSans-Medium");
        cardText.fontFamily = "NotoSans-Bold";
        paragraph.fontFamily = "NotoSans-Medium";
      }

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

<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
