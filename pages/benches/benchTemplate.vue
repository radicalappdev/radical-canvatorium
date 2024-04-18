<script lang="ts" setup>
  import { Scene, ArcRotateCamera, Vector3 } from "@babylonjs/core";

  definePageMeta({
    featured: false,
    title: "Bench TEMPLATE",
    description: "",
    labNotes: ``
  });

  const createLabContent = async (scene: Scene) => {
    // Implement the lab/bench here

    const targetPos = new Vector3(0, 0, 0);
    const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 8, targetPos, scene);
    camera.wheelDeltaPercentage = 0.01;
    camera.upperBetaLimit = Math.PI / 1.5;
    camera.lowerRadiusLimit = 2;
    camera.upperRadiusLimit = 20;
    camera.attachControl(bjsCanvas, true);
  };

  const labSceneOptions = {
    useCamera: false,
    useLight: true,
    useRoom: true,
    useWebXRPlayer: false
  };

  const bjsCanvas = ref(null);

  useCanvatoriumScene(bjsCanvas, createLabContent, labSceneOptions);
</script>
<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
