<script setup>
  import { AbstractMesh, Vector3 } from "babylonjs";
  import { TextBlock, Image, Control, Rectangle } from "babylonjs-gui";
  import computingData from "@/data/computing.json";

  definePageMeta({
    featured: false,
    title: "Lab 050 - Collection View",
    description: "A small Collection view as an alternative to a list views."
  });

  const createLabContent = async (scene) => {
    // Data and state at parent scope
    const activeIndex = ref(0);
    const collectionData = reactive(computingData);
    const activeRecord = computed(() => computingData[activeIndex.value]);

    // Position the non-VR camera to better see the card
    const cam = scene.getCameraByName("camera");
    cam.position = new Vector3(0, 1.4, -2);

    // Create a window group object. This is a parent object that will contain the window and toolbar planes, and any other objects we want to add to the window. This can be found in lab-uikit.ts
    const windowGroupMesh = canLabWindowGroup(scene);

    const collection = createCollection(collectionData, scene);
    collection.parent = windowGroupMesh;
    collection.position = new Vector3(0, 2.9, 0);

    // Create the main content card. This can be found in lab-examples.js
    const { contentMesh } = exampleContent(activeRecord, scene);
    contentMesh.parent = windowGroupMesh;
    contentMesh.position = new Vector3(0, 2.7, 0);
    contentMesh.isPickable = false;
    contentMesh.visibility = 0;
  };

  const lab050_example_1 = (activeRecord, scene) => {
    const { plane: detailMesh, advancedTexture: detailTexture } = canLabCardSimple(4, 4.6, scene);

    const cardTextureName = "content-texture-" + activeRecord.id;
    detailTexture.name = cardTextureName;

    const imageContainer = new Rectangle("masker");
    imageContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    imageContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    imageContainer.thickness = 0;
    imageContainer.cornerRadius = 20;
    imageContainer.paddingTop = 20;
    imageContainer.paddingBottom = 20;
    imageContainer.paddingLeft = 20;
    imageContainer.paddingRight = 20;
    imageContainer.width = `${1024 * (4 / 10) - 0}px`;
    imageContainer.height = `${1024 * (4 / 10) - 0}px`;

    detailTexture.addControl(imageContainer);

    const image = new Image("image", activeRecord.imageUrl);
    image.alpha = 1;
    imageContainer.addControl(image);

    // Add a text block for the name, in front of the image
    const cardText = new TextBlock("name");
    cardText.text = "";
    cardText.color = labColors.slate8;
    cardText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    cardText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    cardText.paddingBottom = 28;
    cardText.fontSize = 32;
    cardText.zIndex = 5;
    cardText.isPointerBlocker = false;
    detailTexture.addControl(cardText);

    watch(
      activeRecord,
      (newValue) => {
        console.log("card texture name", cardTextureName);
        const texture = scene.getTextureByName(cardTextureName);
        texture.getControlByName("name").text = newValue.name;
        texture.getControlByName("image").source = newValue.imageUrl;
      },
      { immediate: true }
    );

    return { smallMesh: detailMesh, smallTexture: detailTexture };
  };

  const createCollection = (collectionData, scene) => {
    const numberToChunk = 4;
    const spacing = 1.4;

    const startPosition = new Vector3((-(numberToChunk - 1) * spacing) / 2, 0, 0);
    const collectionContainer = new AbstractMesh("collection-container");

    const chunks = chunk(collectionData, numberToChunk);
    chunks.forEach((chunk, rowIndex) => {
      const rowContainer = new AbstractMesh(`row-${rowIndex}`);
      rowContainer.position = new Vector3(0, rowIndex * -1.6, 0);
      rowContainer.parent = collectionContainer;

      chunk.forEach((record, colIndex) => {
        const offsetX = colIndex * spacing;
        const offsetPosition = startPosition.add(new Vector3(offsetX, 0, 0));
        const { smallMesh, smallTexture } = lab050_example_1(record, scene);
        smallMesh.parent = rowContainer;
        smallMesh.position = offsetPosition;
        smallMesh.scaling = new Vector3(0.3, 0.3, 0.3);
      });
    });

    return collectionContainer;
  };

  function chunk(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  const bjsCanvas = ref(null);
  useCanvatoriumScene(bjsCanvas, createLabContent);
</script>

<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
