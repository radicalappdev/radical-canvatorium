<script setup>
  import { Vector3, Animation } from "babylonjs";
  import { TextBlock, Control } from "babylonjs-gui";
  import computingData from "@/data/computing.json";

  definePageMeta({
    featured: false,
    title: "Lab 047 - Modals, Dialogs, and Sheets",
    description: "Exploring modal, dialog, and sheet patterns."
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

    // get the shortDescription button from the contentTexture
    const sdc = contentTexture.getControlByName("short-description-container");
    sdc.onPointerUpObservable.add(() => {
      console.log("Modal Open");
      showModal.value = true;

      // This control never fires the onPointerOutObservable because another object is in front of it
      // So we need to manually reset the state of the control
      // mark as dirty does not work
      contentTexture.markAsDirty();
      sdc.markAsDirty();
    });

    const lab047_example_1 = (scene) => {
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

    const { modalMesh, modalTexture } = lab047_example_1(scene);
    modalMesh.parent = windowGroupMesh;
    modalMesh.position = new Vector3(0, 2.5, 1);

    watch(showModal, (newValue) => {
      if (newValue) {
        Animation.CreateAndStartAnimation("move-main", contentMesh, "position.z", 60, 6, contentMesh.position.z, 0.4, 0);
        Animation.CreateAndStartAnimation("fade-main", contentMesh, "visibility", 60, 6, 1, 0.5, 0);

        Animation.CreateAndStartAnimation("open-modal", modalMesh, "position.z", 60, 6, modalMesh.position.z, 0, 0);
        Animation.CreateAndStartAnimation("open-modal", modalMesh, "visibility", 60, 6, 0, 1, 0);

        modalMesh.isPickable = true;
      } else {
        Animation.CreateAndStartAnimation("open-modal", contentMesh, "position.z", 60, 6, 0.4, 0, 0);
        Animation.CreateAndStartAnimation("open-modal", contentMesh, "visibility", 60, 6, 0.5, 1, 0);

        Animation.CreateAndStartAnimation("open-modal", modalMesh, "position.z", 60, 6, modalMesh.position.z, 1, 0);
        Animation.CreateAndStartAnimation("open-modal", modalMesh, "visibility", 60, 6, 1, 0, 0);

        modalMesh.isPickable = false;
      }
    });
  };

  const bjsCanvas = ref(null);
  useCanvatoriumScene(bjsCanvas, createLabContent);
</script>

<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
