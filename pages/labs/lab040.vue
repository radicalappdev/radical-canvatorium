<script lang="ts" setup>
  import { Scene } from "babylonjs";
  import { AdvancedDynamicTexture, TextBlock, StackPanel, Control, Rectangle } from "babylonjs-gui";

  const route = useRoute();

  definePageMeta({
    featured: false,
    title: "Lab 040 – Lab Data Overlay with Babylon.js GUI",
    description: "Using Babylon.js GUI to overlay lab data on the scene instead of using the DOM."
  });

  // Add lab-specific content here using the provided 'scene' instance
  const createLabContent = async (scene: Scene) => {
    // Create a BABYLON GUI AdvancedDynamicTexture
    const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");

    const rect = new Rectangle("rect");
    rect.background = labColors.slate2;
    rect.alpha = 0.9;
    rect.color = labColors.slate8;
    rect.thickness = 2;
    rect.zIndex = -10;
    rect.width = "320px";
    rect.height = "180px";
    rect.top = "50px";
    rect.left = "10px";
    rect.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    rect.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    advancedTexture.addControl(rect);

    // Create an inner panel to contain the card content. This has no background and is used to add padding to the card content.
    const innerPanel = new StackPanel();
    innerPanel.width = "320px";
    innerPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    innerPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    innerPanel.paddingTop = "50px";
    innerPanel.paddingLeft = "20px";
    innerPanel.paddingRight = "20px";
    advancedTexture.addControl(innerPanel);

    // Add a header
    const title = new TextBlock();
    title.text = route.meta.title as string;
    title.fontFamily = "Verdana";
    title.height = "60px";
    title.color = "black";
    title.paddingTop = "10px";
    title.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    title.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    title.fontSize = "20px";
    title.textWrapping = true;
    innerPanel.addControl(title);

    // Add a description
    const description = new TextBlock();
    description.text = route.meta.description as string;
    description.fontFamily = "Verdana";
    description.height = "100px";
    description.color = "black";
    description.paddingTop = "10px";
    description.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    description.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    description.fontSize = "14px";
    description.textWrapping = true;
    innerPanel.addControl(description);
  };

  const bjsCanvas = ref(null);

  // We don't want to use the lab overlay here since we are building one in this file
  const labSceneOptions = {
    useOverlay: true
  };

  useCanvatoriumScene(bjsCanvas, createLabContent, labSceneOptions);
</script>

<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
