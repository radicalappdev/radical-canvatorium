<script setup>
  import { Vector3, Animation } from "babylonjs";
  import { TextBlock, Control } from "babylonjs-gui";
  import computingData from "@/data/computing.json";

  definePageMeta({
    featured: false,
    title: "Lab 047 - Main Window + Replace",
    description: "Replacing windows with other windows."
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

    const { modalMesh } = lab048_example_1(activeRecord, showModal, scene);
    modalMesh.parent = windowGroupMesh;
    modalMesh.position = new Vector3(0, 2.7, 0);
    modalMesh.isPickable = false;

    watch(showModal, (newValue) => {
      if (newValue) {
        Animation.CreateAndStartAnimation("fade-main", contentMesh, "visibility", 60, 6, 1, 0.0, 0);
        contentMesh.isPickable = false;

        Animation.CreateAndStartAnimation("open-modal", modalMesh, "visibility", 60, 6, 0, 1, 0);
        modalMesh.isPickable = true;
      } else {
        Animation.CreateAndStartAnimation("open-modal", contentMesh, "visibility", 60, 6, 0.5, 1, 0);
        contentMesh.isPickable = true;

        Animation.CreateAndStartAnimation("open-modal", modalMesh, "visibility", 60, 6, 1, 0, 0);
        modalMesh.isPickable = false;
      }
    });
  };

  // Create a card with a long description
  const lab048_example_1 = (activeRecord, showModal, scene) => {
    const { plane: modalMesh, advancedTexture: modalTexture } = canLabCardSimple(8, 4.6, scene);

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
