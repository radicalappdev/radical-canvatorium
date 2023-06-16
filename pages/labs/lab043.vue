<script setup>
  import { MeshBuilder } from "babylonjs";
  import { AdvancedDynamicTexture, TextBlock } from "babylonjs-gui";

  definePageMeta({
    featured: true,
    title: "Lab 043",
    description: "Lots of UI, too much UI?",
    labNotes: `How many AdvancedDynamicTextures can I load in a WebXR scene on an Meta Quest 2? It seems like 30 to 50 is a safe bet for now. These cards only have a single text block and a SixDofDragBehavior. When I make more advanced cards with more controls, I may have to reduce the number of cards in a scene.`
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
