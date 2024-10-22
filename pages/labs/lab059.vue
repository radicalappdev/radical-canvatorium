<script lang="ts" setup>
  import { Scene, TransformNode, Vector3, Animation, WebXRFeatureName, WebXRSessionManager } from "@babylonjs/core";
  import { AdvancedDynamicTexture, TextBlock, Image, Control, Rectangle, MeshButton3D, GUI3DManager, PlanePanel, Container3D, Control3D } from "@babylonjs/gui";
  import computingData from "@/data/computing.json";

  definePageMeta({
    featured: false,
    title: "Lab 059 - MX Ink as a super-simple input",
    description: "Using MX Ink as a laser pointer with next and previous buttons."
  });

  type ComputingRecord = (typeof computingData)[0];

  const createLabContent = async (scene: Scene) => {
    // Data and state at parent scope
    const activeIndex = ref(0);
    const collectionData = reactive(computingData);
    const maxIndex = collectionData.length - 1;
    const activeRecord = computed(() => computingData[activeIndex.value] as ComputingRecord);

    // Position the non-VR camera to better see the card
    const cam = scene.getCameraByName("camera");
    if (cam) {
      cam.position = new Vector3(0, 1.4, -2);
    }

    // Create a window group object
    const windowGroupMesh = canLabWindowGroup(scene);

    // Create the main window and hide it
    const { contentMesh } = exampleContent(activeRecord, scene);
    contentMesh.parent = windowGroupMesh;
    contentMesh.position = new Vector3(0, 2.7, 0);
    contentMesh.isPickable = false;
    contentMesh.visibility = 1;

    // WebXR
    const vrSupported = await WebXRSessionManager.IsSessionSupportedAsync("immersive-vr");
    if (vrSupported) {
      const xr = await scene.createDefaultXRExperienceAsync({
        floorMeshes: [] // pass an empty array to disable teleportation for this demo
      });

      // enable hand tracking
      const featureManager = xr.baseExperience.featuresManager;
      featureManager.enableFeature(WebXRFeatureName.HAND_TRACKING, "latest", {
        xrInput: xr.input
      });

      //   xr.baseExperience.onInitialXRPoseSetObservable.add((xrCamera) => {
      //     xrCamera.position = new Vector3(0, 0, -0.6);
      //   });

      xr.input.onControllerAddedObservable.add((controller: { onMotionControllerInitObservable: { add: (arg0: (motionController: any) => void) => void } }) => {
        controller.onMotionControllerInitObservable.add((motionController: { handness: string; getComponentIds: () => any; getComponent: (arg0: any) => any }) => {
          console.log("Available inputs: ", motionController.getComponentIds());

          // Using the Meta Quest Trigger button (decrement with rollover)
          let button2 = motionController.getComponent("xr-standard-trigger");
          button2.onButtonStateChangedObservable.add(() => {
            if (button2.pressed) {
              console.log("xr-standard-trigger pressed");
              activeIndex.value = (activeIndex.value - 1 + collectionData.length) % collectionData.length;
              console.log(`Active Index: ${activeIndex.value}`);
            }
          });

          // Using the Meta Quest Grip button (increment with rollover)
          let button3 = motionController.getComponent("xr-standard-squeeze");
          button3.onButtonStateChangedObservable.add(() => {
            if (button3.pressed) {
              console.log("xr-standard-squeeze pressed");
              activeIndex.value = (activeIndex.value + 1) % collectionData.length;
              console.log(`Active Index: ${activeIndex.value}`);
            }
          });
        });
      });
    }
  };

  const bjsCanvas = ref(null);
  useCanvatoriumScene(bjsCanvas, createLabContent);
</script>

<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
