<script setup>
  import { Vector3 } from "babylonjs";
  import { TextBlock, Image, Control, Rectangle, Button } from "babylonjs-gui";
  import computingData from "@/data/computing.json";

  definePageMeta({
    featured: false,
    title: "Lab 046 - A main window",
    description: "Building a main window that will be used across a series of labs."
  });

  const createLabContent = async (scene) => {
    const activeIndex = ref(0);
    let activeRecord = reactive(computingData[activeIndex.value]);
    console.log(activeRecord.value);

    // Position the non-VR camera to better see the card
    const cam = scene.getCameraByName("camera");
    cam.position = new Vector3(0, 1.4, -2);

    const { plane, advancedTexture } = canLabCardSimple(8, 4.2, scene);
    plane.name = "parent-plane";
    plane.position = new Vector3(0, 1.2, 0);
    plane.scaling = new Vector3(0.2, 0.2, 0.2);

    const imageContainer = new Rectangle("masker");
    imageContainer.width = "100px";
    imageContainer.height = "100px";
    imageContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    imageContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    imageContainer.left = "30px";
    imageContainer.top = "30px";
    imageContainer.thickness = 0;
    imageContainer.cornerRadius = 20;
    advancedTexture.addControl(imageContainer);

    // load an image on the GUI
    const image = new Image("image", activeRecord.imageUrl);
    imageContainer.addControl(image);

    const cardText = new TextBlock("name");
    cardText.text = activeRecord.name;
    cardText.color = labColors.slate8;
    cardText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    cardText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    cardText.top = 40;
    cardText.left = 150;
    cardText.fontSize = 48;
    advancedTexture.addControl(cardText);

    const knownFor = new TextBlock("knownFor");
    knownFor.text = `Known for: ${activeRecord.knownFor}`;
    knownFor.color = labColors.slate8;
    knownFor.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    knownFor.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    knownFor.top = 100;
    knownFor.left = 150;
    knownFor.fontSize = 18;
    advancedTexture.addControl(knownFor);

    const shortDescription = Button.CreateSimpleButton("shortDescription", activeRecord.shortDescription);
    shortDescription.color = labColors.slate8;
    shortDescription.background = labColors.slate3 + "80";
    shortDescription.textWrapping = true;
    shortDescription.paddingLeft = "30px";
    shortDescription.paddingRight = "30px";
    shortDescription.paddingTop = "10px";
    shortDescription.paddingBottom = "10px";
    shortDescription.heightInPixels = 146;
    shortDescription.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    shortDescription.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    shortDescription.cornerRadius = 20;
    shortDescription.thickness = 0;

    shortDescription.textBlock.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    shortDescription.textBlock.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    shortDescription.textBlock.fontSize = 22;
    shortDescription.textBlock.paddingLeft = "10px";
    shortDescription.textBlock.paddingRight = "10px";
    shortDescription.textBlock.paddingTop = "10px";
    shortDescription.textBlock.paddingBottom = "10px";

    // shortDescription.pointerEnterAnimation = () => {};
    shortDescription.pointerDownAnimation = () => {};
    shortDescription.pointerUpAnimation = () => {};

    // add a hover effect to the text
    shortDescription.onPointerEnterObservable.add(() => {
      shortDescription.background = labColors.slate3 + "ff";
    });
    shortDescription.onPointerOutObservable.add(() => {
      shortDescription.background = labColors.slate3 + "80";
    });
    advancedTexture.addControl(shortDescription);

    window.addEventListener("keydown", (e) => {
      if (e.key === "=") {
        activeIndex.value++;
      }
      if (e.key === "-") {
        activeIndex.value--;
      }
      if (activeIndex.value < 0) {
        activeIndex.value = computingData.length - 1;
      }
      if (activeIndex.value > computingData.length - 1) {
        activeIndex.value = 0;
      }
    });

    watch(activeIndex, (newValue) => {
      const texture = scene.getTextureByName("lab-card-rect-texture");
      activeRecord = computingData[newValue];
      texture.getControlByName("name").text = activeRecord.name;
      texture.getControlByName("image").source = activeRecord.imageUrl;
      texture.getControlByName("knownFor").text = `Known for: ${activeRecord.knownFor}`;
      texture.getControlByName("shortDescription").textBlock.text = activeRecord.shortDescription;
    });
  };

  const bjsCanvas = ref(null);
  useCanvatoriumScene(bjsCanvas, createLabContent);
</script>

<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
