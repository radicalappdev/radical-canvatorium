<script setup>
  import { Vector3 } from "babylonjs";
  import { TextBlock } from "babylonjs-gui";

  definePageMeta({
    featured: false,
    title: "Bench 000 – SVG to Babylon JS",
    description: "Loading an SVG file and converting it to 3D objects in Babylon JS."
  });

  // Add lab-specific content here using the provided 'scene' instance
  const createLabContent = async (scene) => {
    // Lab 001 only. Move the camera to a better position for the initial scene.
    const cam = scene.getCameraByName("camera");
    cam.position = new Vector3(0, 1.4, -4);

    const ohioSVG = await fetch("/assets/usa-oh.svg").then((res) => res.text());
    // console.log("SVG", ohioSVG);

    // TODO: Create an array of paths from the SVG data
    // Convert each path to an object that can be extruded
  };

  // If a lab uses the default options, you can just call useBabylonScene() with the bjsCanvas ref and the createLabContent function.
  // Otherwise, you can pass in an options object with the following properties:
  const labSceneOptions = {
    useCamera: true,
    useLight: true,
    useRoom: true,
    useOverlay: false,
    useWebXRPlayer: false
  };

  const bjsCanvas = ref(null);
  // With scene options
  useCanvatoriumScene(bjsCanvas, createLabContent, labSceneOptions);

  // Without scene options (see lab001 for an example)
  // useCanvatoriumScene(bjsCanvas, createLabContent);
</script>
<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
