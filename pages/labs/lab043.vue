<script setup>
  import { MeshBuilder } from "babylonjs";
  import { AdvancedDynamicTexture, Button, TextBlock } from "babylonjs-gui";

  definePageMeta({
    featured: false,
    title: "Lab 043",
    description: "Lots of UI, too much UI?"
  });

  const createLabContent = async (scene) => {
    const sparticus = generateCard(scene);
    sparticus.position.x = Math.random() * 10 - 5;
    sparticus.position.z = Math.random() * 10 - 5;
    sparticus.position.y = Math.random() + 1.5;

    for (let i = 0; i < 99; i++) {
      const card = generateCard(scene);
      card.position.x = Math.random() * 10 - 5;
      card.position.z = Math.random() * 10 - 5;
      card.position.y = Math.random() + 1.5;
    }
  };

  const generateCard = (scene) => {
    const plane = MeshBuilder.CreatePlane("plane", { width: 0.5, height: 0.5 }, scene);

    const advancedTexture = AdvancedDynamicTexture.CreateForMesh(plane);
    advancedTexture.name = "card-texture";
    advancedTexture.background = labColors.slate8;

    const titleText = new TextBlock("title-text");

    titleText.text = "I'm Sparticus!";
    titleText.color = "white";
    titleText.fontSize = 96;

    advancedTexture.addControl(titleText);

    return plane;
  };

  const bjsCanvas = ref(null);
  useCanvatoriumScene(bjsCanvas, createLabContent);
</script>

<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
