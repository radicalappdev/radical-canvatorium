<script setup>
  import { MeshBuilder } from "babylonjs";

  definePageMeta({
    featured: true,
    title: "Lab 005 - Nav Test A",
    description: "Just a navigation test in Nuxt and WebXR"
  });

  const createLabContent = async (scene) => {
    const box = MeshBuilder.CreateBox("box", { size: 1 }, scene);
    box.position.y = 0.5;

    // when clicked, go to lab 006
    box.actionManager = new BABYLON.ActionManager(scene);
    box.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, () => {
        // navigate to lab 006 using Nuxt 3 router - failed in WebXR
        // navigateTo("/labs/lab006");

        // use window location to navigate to lab 006 - works in WebXR, but freezes the current scene while loading the new page
        window.location.href = "/labs/lab006";
      })
    );
  };

  const bjsCanvas = ref(null);
  useCanvatoriumScene(bjsCanvas, createLabContent);
</script>

<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
