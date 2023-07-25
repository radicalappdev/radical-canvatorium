<script setup>
  import { AbstractMesh, MeshBuilder, TransformNode, Vector3, Animation } from "babylonjs";
  import { TextBlock, Image, Control, Rectangle, MeshButton3D, GUI3DManager, PlanePanel } from "babylonjs-gui";
  import computingData from "@/data/computing.json";

  definePageMeta({
    featured: false,
    title: "Lab 050 - Collection View",
    description: "A small Collection view as an alternative to a list views."
  });

  const createLabContent = async (scene) => {
    // Data and state at parent scope
    const showMain = ref(false);
    const activeIndex = ref(0);
    const collectionData = reactive(computingData);
    const activeRecord = computed(() => computingData[activeIndex.value]);

    // Position the non-VR camera to better see the card
    const cam = scene.getCameraByName("camera");
    cam.position = new Vector3(0, 1.4, -2);

    // Create a window group object. This is a parent object that will contain the window and toolbar planes, and any other objects we want to add to the window. This can be found in lab-uikit.ts
    const windowGroupMesh = canLabWindowGroup(scene);

    const anchor = new TransformNode("anchor");
    const manager = new GUI3DManager(scene);
    const plainPanel = new PlanePanel();
    plainPanel.margin = 0.1;
    plainPanel.columns = 4;
    manager.addControl(plainPanel);
    plainPanel.linkToTransformNode(anchor);

    // create a card for each record and add them to the plainPanel
    collectionData.forEach((record, index) => {
      const { smallMesh, smallTexture } = lab050_example_1(record, scene);
      smallMesh.parent = anchor;
      smallMesh.position = new Vector3(0, 0, 0);
      smallMesh.scaling = new Vector3(0.45, 0.45, 0.45);

      const button = new MeshButton3D(smallMesh, "button");
      button.scaling = new Vector3(0.3, 0.3, 0.3);

      button.onPointerUpObservable.add(() => {
        console.log("Clicked on button");
        activeIndex.value = index;
        showMain.value = true;
      });

      plainPanel.addControl(button);
    });

    anchor.parent = windowGroupMesh;
    anchor.position = new Vector3(0, 2.7, 0);

    // Create the main content card. This can be found in lab-examples.js
    const { contentMesh } = exampleContent(activeRecord, scene);
    contentMesh.parent = windowGroupMesh;
    contentMesh.position = new Vector3(0, 2.7, 0);
    contentMesh.isPickable = false;
    contentMesh.visibility = 0;

    watch(showMain, (newValue) => {
      if (newValue) {
        Animation.CreateAndStartAnimation("open-modal", contentMesh, "visibility", 60, 6, 0, 1, 0);
        contentMesh.isPickable = true;

        // scale the anchor down to 0
        Animation.CreateAndStartAnimation("open-modal", anchor, "scaling", 60, 6, anchor.scaling, new Vector3(0, 0, 0), 0);
      } else {
        Animation.CreateAndStartAnimation("open-modal", contentMesh, "visibility", 60, 6, 1, 0, 0);

        // scale the anchor up to 1
        Animation.CreateAndStartAnimation("open-modal", anchor, "scaling", 60, 6, anchor.scaling, new Vector3(1, 1, 1), 0);
      }
    });
  };

  const lab050_example_1 = (record, scene) => {
    const { plane: detailMesh, advancedTexture: detailTexture } = canLabCardSimple(4, 4.6, scene);

    const cardTextureName = "content-texture-" + record.id;
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

    const image = new Image("image", record.imageUrl);
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

    detailMesh.isPickable = false;
    // detailTexture.isPickable = false;

    watch(
      record,
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

  const bjsCanvas = ref(null);
  useCanvatoriumScene(bjsCanvas, createLabContent);
</script>

<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
