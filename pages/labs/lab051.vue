<script setup>
  import { Vector3, Animation } from "babylonjs";
  import { TextBlock, Control } from "babylonjs-gui";
  import computingData from "@/data/computing.json";

  definePageMeta({
    featured: false,
    title: "Lab 051 - Main Window + Tooltip",
    description: "Adding a simple tooltip for the image on the main window. The tooltip will appear above the window on hover."
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

    const { tipMesh: tipMesh } = lab051_example_1(activeRecord, scene);
    tipMesh.parent = windowGroupMesh;
    tipMesh.position = new Vector3(-2.25, 5.6, 0);
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

    // press left and right arrow keys to move through the list
    window.addEventListener("keydown", (e) => {
      if (e.code === "ArrowLeft") {
        let newIndex = activeIndex.value - 1;
        if (newIndex < 0) {
          newIndex = computingData.length - 1;
        }
        activeIndex.value = newIndex;
      }
      if (e.code === "ArrowRight") {
        let newIndex = activeIndex.value + 1;
        if (newIndex > computingData.length - 1) {
          newIndex = 0;
        }
        activeIndex.value = newIndex;
      }
    });
  };

  // Create a card with a long description
  const lab051_example_1 = (activeRecord, scene) => {
    const { plane: tipMesh, advancedTexture: tipTexture } = canLabCardSimple(6, 2, scene);

    const rect = tipTexture.getControlByName("rect");
    if (rect) {
      rect.background = labColors.slate8;
      rect.alpha = 1;
    }

    const paragraph = new TextBlock();
    paragraph.text = activeRecord.value.imageAttribution;
    paragraph.color = labColors.slate1;
    paragraph.fontSize = 24;
    paragraph.textWrapping = true;
    paragraph.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    paragraph.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    paragraph.paddingBottom = "20px";
    paragraph.paddingLeft = "20px";
    paragraph.paddingRight = "20px";
    paragraph.paddingTop = "20px";
    tipTexture.addControl(paragraph);

    watch(
      activeRecord,
      (newValue) => {
        paragraph.text = newValue.imageAttribution;
      },
      { immediate: true }
    );

    return { tipMesh: tipMesh, modalTexture: tipTexture };
  };

  const bjsCanvas = ref(null);
  useCanvatoriumScene(bjsCanvas, createLabContent);
</script>

<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
