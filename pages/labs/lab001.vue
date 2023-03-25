<template>
  <div>
    <h3 class="text-lg font-bold">Lab 001</h3>
    <p>
      This lab is just the starting point of the app. I'm using this as a place
      where I can work on the shared labtools and work out the layout of the labs page.
    </p>
    <div>
      <canvas id="bjsCanvas" ref="bjsCanvas" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const bjsCanvas = ref(null);
let engine;
let scene;

const createLabContent = (scene) => {
  // Add your lab-specific content here using the provided 'scene' instance

  // Add a box
    const box = BABYLON.MeshBuilder.CreateBox("box", {}, scene);
    box.position.y = 1;
    box.position.z = 2;
    box.position.x = 1;
};

onMounted(() => {
  if (bjsCanvas.value) {
    const { engine: createdEngine, scene: createdScene } = createLabScene(bjsCanvas.value, createLabContent);
    engine = createdEngine;
    scene = createdScene;
  }
});

onUnmounted(() => {
  engine.dispose();
  window.removeEventListener("resize", () => {
    engine.resize();
  });
});
</script>
