<script setup>
  import { Vector3, Animation } from "babylonjs";
  import { TextBlock, Control } from "babylonjs-gui";
  import computingData from "@/data/computing.json";

  definePageMeta({
    featured: false,
    title: "Lab 051 - Main Window + Tooltip",
    description: "Adding a simple tooltip to the image in the main window. "
  });

  const createLabContent = async (scene) => {
    // Data and state at parent scope
    const activeIndex = ref(4);
    const activeRecord = computed(() => computingData[activeIndex.value]);

    const showTip = ref(false);

    const cam = scene.getCameraByName("camera");
    cam.position = new Vector3(0, 1.4, -2);

    // Use the window group from the lab uikit
    const windowGroupMesh = canLabWindowGroup(scene);

    // Use the content mesh from lab examples
    let { contentMesh, contentTexture } = exampleContent(activeRecord, scene);
    contentMesh.parent = windowGroupMesh;
    contentMesh.position = new Vector3(0, 2.7, 0);

    // Get the shortDescription button from the contentTexture
    const image = contentTexture.getControlByName("image");
    image?.onPointerEnterObservable.add(() => {
      showTip.value = true;
    });
    image?.onPointerOutObservable.add(() => {
      showTip.value = false;
    });

    const { modalMesh } = lab047_example_1(activeRecord, showTip, scene);
    modalMesh.parent = windowGroupMesh;
    modalMesh.position = new Vector3(-2.2, 5.2, -0.2);
    modalMesh.scaling = new Vector3(0.5, 0.5, 0.5);
    modalMesh.isPickable = false;

    watch(showTip, (newValue) => {
      if (newValue) {
        // Show the tooltip
      } else {
        // Hide the tooltop
      }
    });
  };

  // Create a card with a long description
  const lab047_example_1 = (activeRecord, showModal, scene) => {
    const { plane: tipMesh, advancedTexture: tipTexture } = canLabCardSimple(6, 2, scene);

    const paragraph = new TextBlock();
    paragraph.text = activeRecord.value.imageAttribution;
    paragraph.color = labColors.slate8;
    paragraph.fontSize = 28;
    paragraph.textWrapping = true;
    paragraph.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    paragraph.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    paragraph.paddingBottom = "20px";
    paragraph.paddingLeft = "20px";
    paragraph.paddingRight = "20px";
    paragraph.paddingTop = "20px";
    tipTexture.addControl(paragraph);

    return { modalMesh: tipMesh, modalTexture: tipTexture };
  };

  const bjsCanvas = ref(null);
  useCanvatoriumScene(bjsCanvas, createLabContent);
</script>

<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
