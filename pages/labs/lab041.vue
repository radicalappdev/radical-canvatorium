<script lang="ts" setup>
  import { Scene, Camera, MeshBuilder, Tools } from "@babylonjs/core";

  definePageMeta({
    featured: true,
    title: "Lab 041 - Screenshots with Babylon.js",
    description: "Press the S key to take a screenshot with Babylon.js"
  });

  const createLabContent = async (scene: Scene) => {
    const engine = scene.getEngine();
    const camera = scene.activeCamera;

    const box = MeshBuilder.CreateBox("box", { size: 1 }, scene);
    box.position.y = 0.5;

    // For the purposes of this lab, we'll use the keyboard observable to take a screenshot
    // When I add this to the useCanvatoriumScene composable, I'll call it from a button on the GUI
    // Take a screenshot of the scene when I press the 's' key
    scene.onKeyboardObservable.add((kbInfo) => {
      if (kbInfo.type === BABYLON.KeyboardEventTypes.KEYDOWN && kbInfo.event.key === "s") {
        const size = {
          width: engine.getRenderWidth(),
          height: engine.getRenderHeight()
        };
        const screenshot = Tools.CreateScreenshot(engine, camera as Camera, size);
        console.log("screenshot created", screenshot);
      }
    });
  };

  const bjsCanvas = ref(null);
  useCanvatoriumScene(bjsCanvas, createLabContent);
</script>

<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
