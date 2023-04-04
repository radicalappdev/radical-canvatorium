<script setup>
import { MeshBuilder, Vector3 } from "babylonjs";

definePageMeta({
  featured: true,
  title: "Lab 003",
  description: "Default XR Experience"
});

const createLabContent = async (scene) => {
  MeshBuilder.CreateBox("box", { size: 1 }, scene).position.y = 0.5;

  // Create a cylinder
  const landing = MeshBuilder.CreateCylinder("cylinder", { diameter: 1, height: 0.2 }, scene);
  landing.position = new Vector3(2, 0, 2);

  // get mesh by name 'ground' to use for teleportation - this is created by the labCreateRoom function in useCanvatoriumScene
  const ground = scene.getMeshByName("ground");
  console.log("ground", ground);

  const xr = await scene.createDefaultXRExperienceAsync({
    floorMeshes: ground
  });

  // Move the player when thet enter immersive mode
  xr.baseExperience.onInitialXRPoseSetObservable.add((xrCamera) => {
    console.log("Entering Immersive Mode with camera", xrCamera);
    xrCamera.position.z = landing.position.z;
    xrCamera.position.x = landing.position.x;
  });

  console.log("xr player created", xr);
};

// Omit the scene options to use the default XR experience from useCanvatoriumScene
const labSceneOptions = {
  useWebXRPlayer: false
};

const bjsCanvas = ref(null);
// With scene options
useCanvatoriumScene(bjsCanvas, createLabContent, labSceneOptions);
</script>

<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
