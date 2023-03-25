<template>
    <div>
        <h3 class="text-lg font-bold">Lab 001</h3>
        <p>This lab is just the starting point of the app. I'm using this as a place where I can work on the shared labtools and work out the layout of the labs page.</p>
        <div>
            <canvas id="bjsCanvas" ref="bjsCanvas" />
        </div>
    </div>
</template>

<script setup>
import * as BABYLON from "babylonjs";

const bjsCanvas = ref(null);

const createScene = async (canvas) => {
  // Create and customize the scene
  const engine = new BABYLON.Engine(canvas);
  const scene = new BABYLON.Scene(engine);

    // Create a camera
    labCreateCamera(scene);

    // Create a ground
    labCreateRoom(scene);

    // Create a light
    labCreateLights(scene);

    // Create a sphere
    const sphere = BABYLON.MeshBuilder.CreateSphere(
      "sphere",
      { diameter: 1 },
      scene
    );




  engine.runRenderLoop(() => {
    scene.render();
  });
  window.addEventListener("resize", function () {
    engine.resize();
  });


};

onMounted(() => {
  if (bjsCanvas.value) {
    createScene(bjsCanvas.value);
  }
});

</script>