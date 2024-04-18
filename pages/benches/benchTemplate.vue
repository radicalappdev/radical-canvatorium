<script lang="ts" setup>
  import { Scene, ArcRotateCamera, Vector3 } from "@babylonjs/core";

  definePageMeta({
    featured: false,
    title: "Bench 005 – Orthographic Camera Damping",
    description: "",
    labNotes: ``
  });

  const createLabContent = async (scene: Scene) => {
    // Implement the lab/bench here

    // Create a target position
    const targetPos = new Vector3(0, 0, 0);
    const targetPosBack = new Vector3(targetPos.x, targetPos.y, targetPos.z + 12);

    // Create a camera
    const camera = new ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2, 15, targetPos, scene);
    camera.setPosition(targetPosBack);
    camera.attachControl(scene.getEngine().getRenderingCanvas(), true, false);
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
