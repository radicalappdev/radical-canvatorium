<script setup>
  import { MeshBuilder, StandardMaterial, Color3, Vector3 } from "babylonjs";

  definePageMeta({
    featured: true,
    title: "Lab 006 - Nav Test B",
    description: "Just a navigation test in Nuxt and WebXR"
  });

  const createLabContent = async (scene) => {
    const sphere = MeshBuilder.CreateSphere("sphere", { size: 1 }, scene);
    sphere.position.y = 0.5;

    // when clicked, go to lab 005
    sphere.actionManager = new BABYLON.ActionManager(scene);
    sphere.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, () => {
        // navigate to lab 005 using Nuxt 3 router
        // navigateTo("/labs/lab005");

        // use window location to navigate to lab 005
        window.location.href = "/labs/lab005";
      })
    );
  };

  const bjsCanvas = ref(null);
  useCanvatoriumScene(bjsCanvas, createLabContent);
</script>

<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
