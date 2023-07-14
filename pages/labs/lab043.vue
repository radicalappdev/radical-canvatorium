<script setup>
  import { Vector3 } from "babylonjs";
  import { TextBlock } from "babylonjs-gui";

  definePageMeta({
    featured: true,
    title: "Lab 043 - Lots of UI, too much UI?",
    description: "How many AdvancedDynamicTextures can I load in a WebXR scene on an Meta Quest 2?",
    labNotes: `How many AdvancedDynamicTextures can I load in a WebXR scene on an Meta Quest 2? It seems like 30 to 50 is a safe bet for now. These cards only have a single text block and a SixDofDragBehavior. When I make more advanced cards with more controls, I may have to reduce the number of cards in a scene.`
  });

  const createLabContent = async (scene) => {
    for (let i = 0; i < 50; i++) {
      const card = generateCard(scene);
      card.position.x = Math.random() * 10 - 5;
      card.position.z = Math.random() * 10 - 5;
      card.position.y = Math.random() * 2 - 2 + 2.5; // ¯\_(ツ)_/¯
    }
  };

  const generateCard = (scene) => {
    const { plane, advancedTexture } = canLabCardSimple(7.4, 3, scene);
    plane.name = "plane";
    plane.position = new Vector3(0, 1.2, 0);
    plane.scaling = new Vector3(0.15, 0.15, 0.15);
    advancedTexture.name = "card-texture";

    const titleText = new TextBlock("title-text");
    titleText.text = "I'm Sparticus!";
    titleText.color = "black";
    titleText.fontSize = 84;
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
