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
import { ref } from "vue";

const bjsCanvas = ref(null);

// Add lab-specific content here using the provided 'scene' instance
const createLabContent = () => {

  // Add a box
    const box = BABYLON.MeshBuilder.CreateBox("box", {});
    box.position.y = 0.5;

};



// If a lab uses the default options, you can just call useBabylonScene() with the bjsCanvas ref and the createLabContent function.
// Otherwise, you can pass in an options object with the following properties:
const labSceneOptions = {
  useCamera: true,
  useLight: true,
  useRoom: true,
};

// With scene options
useBabylonScene(bjsCanvas, createLabContent, labSceneOptions);

// Without scene options (see lab002 for an example)
useBabylonScene(bjsCanvas, createLabContent);

</script>
