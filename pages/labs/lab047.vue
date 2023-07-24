<script setup>
  import { Vector3, Animation } from "babylonjs";
  import { TextBlock, Control } from "babylonjs-gui";
  import computingData from "@/data/computing.json";

  definePageMeta({
    featured: false,
    title: "Lab 047 - Main Window + Modal",
    description: "This lab builds on Lab 046 by adding a modal window when the user clicks on the short description. "
  });

  const createLabContent = async (scene) => {
    // Data and state at parent scope
    const activeIndex = ref(1);
    const activeRecord = computed(() => computingData[activeIndex.value]);

    const showModal = ref(false);

    const cam = scene.getCameraByName("camera");
    cam.position = new Vector3(0, 1.4, -2);

    // Use the window group from the lab uikit
    const windowGroupMesh = canLabWindowGroup(scene);

    // Use the content mesh from lab examples
    let { contentMesh, contentTexture } = exampleContent(activeRecord, scene);
    contentMesh.parent = windowGroupMesh;
    contentMesh.position = new Vector3(0, 2.7, 0);

    // Get the shortDescription button from the contentTexture
    const sdc = contentTexture.getControlByName("short-description-container");
    sdc?.onPointerUpObservable.add(() => {
      console.log("Modal Open");
      // Because a new object appears in front of the control, we need to manually trigger the onPointerOutObservable
      sdc.onPointerOutObservable.notifyObservers(sdc);
      showModal.value = true;
    });

    const { modalMesh } = lab047_example_1(activeRecord, showModal, scene);
    modalMesh.parent = windowGroupMesh;
    modalMesh.position = new Vector3(0, 2.5, 1);
    modalMesh.isPickable = false;

    watch(showModal, (newValue) => {
      if (newValue) {
        // Move the main window back in z-space and fade it out
        Animation.CreateAndStartAnimation("move-main", contentMesh, "position.z", 60, 6, contentMesh.position.z, 0.4, 0);
        Animation.CreateAndStartAnimation("fade-main", contentMesh, "visibility", 60, 6, 1, 0.5, 0);

        // Move the modal window forward in z-space and fade it in
        Animation.CreateAndStartAnimation("move-modal", modalMesh, "position.z", 60, 6, modalMesh.position.z, 0, 0);
        Animation.CreateAndStartAnimation("fade-modal", modalMesh, "visibility", 60, 6, 0, 1, 0);
        modalMesh.isPickable = true;
      } else {
        // Move the main window forward in z-space and fade it in
        Animation.CreateAndStartAnimation("move-main", contentMesh, "position.z", 60, 6, 0.4, 0, 0);
        Animation.CreateAndStartAnimation("fade-main", contentMesh, "visibility", 60, 6, 0.5, 1, 0);

        // Move the modal window back in z-space and fade it out
        Animation.CreateAndStartAnimation("move-modal", modalMesh, "position.z", 60, 6, modalMesh.position.z, 1, 0);
        Animation.CreateAndStartAnimation("fade-modal", modalMesh, "visibility", 60, 6, 1, 0, 0);
        modalMesh.isPickable = false;
      }
    });
  };

  // Create a card with a long description
  const lab047_example_1 = (activeRecord, showModal, scene) => {
    const { plane: modalMesh, advancedTexture: modalTexture } = canLabCardSimple(7.2, 3.4, scene);

    const paragraph = new TextBlock();
    paragraph.text = activeRecord.value.longDescription;
    paragraph.color = labColors.slate8;
    paragraph.fontSize = 22;
    paragraph.textWrapping = true;
    paragraph.width = 0.9;
    paragraph.height = 0.9;
    paragraph.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    paragraph.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    paragraph.top = 30;
    modalTexture.addControl(paragraph);

    // Add a Close button to the bottom of the card
    const button1 = canLabButtonSimple("modal-close", "Close");
    button1.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    button1.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    button1.top = "-20px";
    button1.zIndex = 1;
    button1.onPointerUpObservable.add(() => {
      console.log("Modal Close");
      showModal.value = false;
    });
    modalTexture.addControl(button1);

    modalMesh.visibility = 0;
    modalMesh.isPickable = false;

    return { modalMesh, modalTexture };
  };

  const bjsCanvas = ref(null);
  useCanvatoriumScene(bjsCanvas, createLabContent);
</script>

<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
