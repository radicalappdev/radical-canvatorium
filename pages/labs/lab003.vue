<script setup>
import { MeshBuilder } from "babylonjs";

definePageMeta({
  featured: true,
  title: "Lab 003",
  description: "Default XR Experience"
});

const createLabContent = async (scene) => {
  MeshBuilder.CreateBox("box", { size: 1 }, scene).position.y = 0.5;

  // get mesh by name 'ground' to use for teleportation - this is created by the labCreateRoom function in useCanvatoriumScene
  const ground = scene.getMeshByName("ground");
  console.log("ground", ground);

  const xr = await scene.createDefaultXRExperienceAsync({
    floorMeshes: ground
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
