<script setup>
  import { MeshBuilder } from "babylonjs";
  import { AdvancedDynamicTexture, TextBlock } from "babylonjs-gui";

  definePageMeta({
    featured: true,
    title: "Lab 044 - Independent reactive AdvancedDynamicTextures",
    description: "Expanding on the previous lab, I want to see if I coucanld make each AdvancedDynamicTexture an independent reactive element.",
    labNotes: `Expanding on the previous lab, I want to see if I coucanld make each AdvancedDynamicTexture an independent reactive element.`
  });

  const createLabContent = async (scene) => {
    for (let i = 0; i < 50; i++) {
      const card = generateCard(scene);
      card.position.x = Math.random() * 10 - 5;
      card.position.z = Math.random() * 10 - 5;
      card.position.y = Math.random() + 0.5;
    }
  };

  const generateCard = (scene) => {
    const plane = MeshBuilder.CreatePlane("plane", { width: 0.3, height: 0.3 }, scene);

    const advancedTexture = AdvancedDynamicTexture.CreateForMesh(plane);
    advancedTexture.name = "card-texture";
    advancedTexture.background = labColors.slate8;

    const titleText = new TextBlock("title-text");

    titleText.text = "I'm Sparticus!";
    titleText.color = "white";
    titleText.fontSize = 96;

    advancedTexture.addControl(titleText);

    const sixDofDragBehavior = new BABYLON.SixDofDragBehavior();
    sixDofDragBehavior.allowMultiPointers = true;
    plane.addBehavior(sixDofDragBehavior);

    return plane;
  };

  const bjsCanvas = ref(null);
  useCanvatoriumScene(bjsCanvas, createLabContent);
</script>

<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
