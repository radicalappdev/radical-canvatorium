<script lang="ts" setup>
  import { Scene, Vector3 } from "babylonjs";
  import computingData from "@/data/computing.json";

  definePageMeta({
    featured: false,
    title: "Lab 046 - A Main Window",
    description: "Building a main window that will be used across a series of labs."
  });

  const createLabContent = async (scene: Scene) => {
    // Data and state at parent scope
    const activeIndex = ref(0);
    const activeRecord = computed(() => computingData[activeIndex.value]);

    // Position the non-VR camera to better see the card
    const cam = scene.getCameraByName("camera");
    if (cam) {
      cam.position = new Vector3(0, 1.4, -2);
    }

    // Create a window group object. This is a parent object that will contain the window and toolbar planes, and any other objects we want to add to the window. This can be found in lab-uikit.ts
    const windowGroupMesh = canLabWindowGroup(scene);

    // Create a toolbar for the window. This can be found in lab-examples.js
    const toolbarMesh = exampleToolbar(activeIndex, computingData, scene);
    toolbarMesh.parent = windowGroupMesh;
    toolbarMesh.position = new Vector3(3, 0, -0.05);

    // Create the main content card. This can be found in lab-examples.js
    const { contentMesh } = exampleContent(activeRecord, scene);
    contentMesh.parent = windowGroupMesh;
    contentMesh.position = new Vector3(0, 2.7, 0);
  };

  const bjsCanvas = ref(null);
  useCanvatoriumScene(bjsCanvas, createLabContent);
</script>

<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
