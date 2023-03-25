<template>
  <div>
    <h3 class="text-lg font-bold">Lab 002</h3>
    <p>
      This is a temporary lab for testing the use of the new labtools.
    </p>
    <div>
      <canvas id="bjsCanvas" ref="bjsCanvas" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const bjsCanvas = ref(null);

// Add lab-specific content here using the provided 'scene' instance
const createLabContent = () => {

  // Add a box
    const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {});
    sphere.position.y = 0.5;

};


// Without scene options (see lab001.vue for an example)
useBabylonScene(bjsCanvas, createLabContent);

</script>
