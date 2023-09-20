<script lang="ts" setup>
  import { Scene, Vector3, Animation } from "babylonjs";
  import { TextBlock, Control } from "babylonjs-gui";
  import computingData from "@/data/computing.json";

  definePageMeta({
    featured: false,
    title: "Lab 048 - Main Window + Replace",
    description: "Replace the main content with another window of the same size and shape. Useful for navigation stacks."
  });

  type ComputingRecord = (typeof computingData)[0];

  const createLabContent = async (scene: Scene) => {
    // Data and state at parent scope
    const activeIndex = ref(2);
    const activeRecord = computed(() => computingData[activeIndex.value] as ComputingRecord);
    const showReplace = ref(false);

    const cam = scene.getCameraByName("camera");
    if (cam) {
      cam.position = new Vector3(0, 1.4, -2);
    }

    // Use the window group from the lab uikit
    const windowGroupMesh = canLabWindowGroup(scene);

    // Use the content mesh from lab examples
    let { contentMesh, contentTexture } = exampleContent(activeRecord, scene);
    contentMesh.parent = windowGroupMesh;
    contentMesh.position = new Vector3(0, 2.7, 0);

    // Get the shortDescription button from the contentTexture
    const sdc = contentTexture.getControlByName("short-description-container");
    sdc?.onPointerUpObservable.add(() => {
      console.log("Replace Main with Description");
      // manually trigger the onPointerOutObservable to remove the hover effect
      sdc.onPointerOutObservable.notifyObservers(sdc);
      showReplace.value = true;
    });

    const { replaceMesh: replaceMesh } = lab048_example_1(activeRecord, showReplace, scene);
    replaceMesh.parent = windowGroupMesh;
    replaceMesh.position = new Vector3(0, 2.7, 0);
    replaceMesh.isPickable = false;

    watch(showReplace, (newValue) => {
      if (newValue) {
        Animation.CreateAndStartAnimation("close-main", contentMesh, "visibility", 60, 6, 1, 0.0, 0);
        contentMesh.isPickable = false;

        Animation.CreateAndStartAnimation("open-replace", replaceMesh, "visibility", 60, 6, 0, 1, 0);
        replaceMesh.isPickable = true;
      } else {
        Animation.CreateAndStartAnimation("open-main", contentMesh, "visibility", 60, 6, 0.5, 1, 0);
        contentMesh.isPickable = true;

        Animation.CreateAndStartAnimation("close-replace", replaceMesh, "visibility", 60, 6, 1, 0, 0);
        replaceMesh.isPickable = false;
      }
    });

    // press the space bar to toggle the replace window
    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        showReplace.value = !showReplace.value;
      }
    });
  };

  // Create a card with a long description
  const lab048_example_1 = (activeRecord: Ref, showReplace: Ref, scene: Scene) => {
    const { plane: replaceMesh, advancedTexture: replaceTexture } = canLabCardSimple(8, 4.6, scene);

    const paragraph = new TextBlock();
    paragraph.text = activeRecord.value.longDescription;
    paragraph.color = labColors.slate8;
    paragraph.fontSize = 22;
    paragraph.textWrapping = true;
    paragraph.width = 0.9;
    paragraph.height = 0.9;
    paragraph.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    paragraph.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    paragraph.top = 80;
    replaceTexture.addControl(paragraph);

    // Add a Close button to the bottom of the card
    const button1 = canLabButtonSimple("replace-close", "< Back");
    button1.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    button1.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    button1.top = "30px";
    button1.left = "30px";
    button1.zIndex = 1;
    button1.onPointerUpObservable.add(() => {
      console.log("Replace Description with Main");
      showReplace.value = false;
    });
    replaceTexture.addControl(button1);

    replaceMesh.visibility = 0;
    replaceMesh.isPickable = false;

    return { replaceMesh: replaceMesh, replaceTexture: replaceTexture };
  };

  const bjsCanvas = ref(null);
  useCanvatoriumScene(bjsCanvas, createLabContent);
</script>

<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
