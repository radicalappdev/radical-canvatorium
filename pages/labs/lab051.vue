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

    const toolbarMesh = exampleToolbar(activeIndex, computingData, scene);
    toolbarMesh.parent = windowGroupMesh;
    toolbarMesh.position = new Vector3(3, 0, -0.05);

    // Get the shortDescription button from the contentTexture
    const image = contentTexture.getControlByName("image");
    image?.onPointerEnterObservable.add(() => {
      showTip.value = true;
    });
    image?.onPointerOutObservable.add(() => {
      showTip.value = false;
    });

    const { modalMesh: tipMesh } = lab047_example_1(activeRecord, showTip, scene);
    tipMesh.parent = windowGroupMesh;
    tipMesh.position = new Vector3(-2.3, 5.3, -0.25);
    tipMesh.scaling = new Vector3(0.5, 0.5, 0.5);
    tipMesh.isPickable = false;
    tipMesh.visibility = 0;

    watch(showTip, (newValue) => {
      if (newValue) {
        // Show the tooltip
        Animation.CreateAndStartAnimation("fade-modal", tipMesh, "visibility", 60, 6, 0, 1, 0);
      } else {
        // Hide the tooltop
        Animation.CreateAndStartAnimation("fade-modal", tipMesh, "visibility", 60, 6, 1, 0, 0);
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
