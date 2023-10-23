<script lang="ts" setup>
  import { Scene, Vector3, SixDofDragBehavior } from "babylonjs";
  import { TextBlock } from "babylonjs-gui";

  definePageMeta({
    featured: true,
    title: "Lab 057 - Adding regular controls to GUI3DManager",
    description: "Can I add regular controls to a GUI3DManager instead of MeshButton3D?",
    labNotes: `I'd like to create a mesh that has an ADT, then add the mesh to a control to be able add it to a GUI3DManager.`
  });

  const createLabContent = async (scene: Scene) => {
    for (let i = 0; i < 10; i++) {
      const card = generateCard(scene);
      card.position.x = Math.random() * 10 - 5;
      card.position.z = Math.random() * 10 - 5;
      card.position.y = Math.random() * 2 - 2 + 2.5; // ¯\_(ツ)_/¯
    }
  };

  const generateCard = (scene: Scene) => {
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

    const sixDofDragBehavior = new SixDofDragBehavior();
    sixDofDragBehavior.allowMultiPointer = true;
    plane.addBehavior(sixDofDragBehavior);

    return plane;
  };

  const bjsCanvas = ref(null);
  useCanvatoriumScene(bjsCanvas, createLabContent);
</script>

<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
