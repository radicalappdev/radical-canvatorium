<template>
    <div><h3>Lab 001</h3>
    <canvas style="overflow: hidden" id="bjsCanvas" ref="bjsCanvas" /></div>
</template>

<script setup>
import * as BABYLON from "babylonjs";

const bjsCanvas = ref(null);

const createScene = async (canvas) => {
  // Create and customize the scene
  const engine = new BABYLON.Engine(canvas);
  const scene = new BABYLON.Scene(engine);

    // Create a camera
    const camera = new BABYLON.ArcRotateCamera(
      "camera",
      Math.PI / 2,
      Math.PI / 2,
      2,
      BABYLON.Vector3.Zero(),
      scene
    );

    // Create a light
    const light = new BABYLON.HemisphericLight(
      "light",
      new BABYLON.Vector3(1, 1, 0),
      scene
    );

    // Create a sphere
    const sphere = BABYLON.MeshBuilder.CreateSphere(
      "sphere",
      { diameter: 1 },
      scene
    );

    // Create a ground
    const ground = BABYLON.MeshBuilder.CreateGround(
      "ground",
      { width: 6, height: 6 },
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