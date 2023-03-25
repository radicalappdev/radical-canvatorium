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
// Add lab-specific content here using the provided 'scene' instance
const createLabContent = () => {

  // Add a box
    const box = BABYLON.MeshBuilder.CreateBox("box", {});
    box.position.y = 0.5;

};

onMounted(() => {
  if (bjsCanvas.value) {
    const { engine: createdEngine, scene: createdScene } = createLabScene(bjsCanvas.value, createLabContent);
    engine = createdEngine;
  }
});

onUnmounted(() => {
  engine.dispose();
  window.removeEventListener("resize", () => {
    engine.resize();
  });
});
</script>
