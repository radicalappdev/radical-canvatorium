<script setup>
  import { TransformNode, Vector3, Animation, Color4 } from "babylonjs";
  import { TextBlock, Image, Control, Rectangle, MeshButton3D, GUI3DManager, PlanePanel } from "babylonjs-gui";
  import computingData from "@/data/computing.json";

  definePageMeta({
    featured: false,
    title: "Lab 054 - MR Plane Detection",
    description: ""
  });

  const createLabContent = async (scene) => {
    // Data and state at parent scope
    const activeIndex = ref(0);
    const activeRecord = computed(() => computingData[activeIndex.value]);

    // Position the non-VR camera to better see the card
    const cam = scene.getCameraByName("camera");
    cam.position = new Vector3(0, 1.4, -2);
    scene.clearColor = Color4.FromHexString(labColors.slate1);

    // Create a window group object
    const windowGroupMesh = canLabWindowGroup(scene);
    // windowGroupMesh.scaling = new Vector3(0.06, 0.06, 0.06);

    // Create a toolbar for the window. This can be found in lab-examples.js
    const toolbarMesh = exampleToolbar(activeIndex, computingData, scene);
    toolbarMesh.parent = windowGroupMesh;
    toolbarMesh.position = new Vector3(3, 0, -0.05);

    // Create the main content card. This can be found in lab-examples.js
    const { contentMesh } = exampleContent(activeRecord, scene);
    contentMesh.parent = windowGroupMesh;
    contentMesh.position = new Vector3(0, 2.7, 0);

    // Add  a custom XR player for AR/MR
    const xr = await scene.createDefaultXRExperienceAsync({
      uiOptions: {
        sessionMode: "immersive-ar"
      }
    });

    console.log("xr player created by lab 053", xr);

    xr.baseExperience.onInitialXRPoseSetObservable.add((xrCamera) => {
      console.log("Entering Immersive Mode with camera", xrCamera.position, windowGroupMesh);
      windowGroupMesh.position = new Vector3(0, 1.1, 0.5);
      windowGroupMesh.scaling = new Vector3(0.06, 0.06, 0.06);
    });
  };

  const bjsCanvas = ref(null);

  const labSceneOptions = {
    useRoom: false,
    useWebXRPlayer: false
  };

  useCanvatoriumScene(bjsCanvas, createLabContent, labSceneOptions);
</script>

<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
