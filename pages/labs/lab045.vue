<script setup>
  import { MeshBuilder, SceneLoader } from "babylonjs";

  definePageMeta({
    featured: false,
    title: "Lab 045",
    description: "Prototype UI Cards"
  });

  const createLabContent = async (scene) => {
    // Load some assets
    SceneLoader.LoadAssetContainer("/assets/", "glass_card_rect.glb", scene, function (container) {
      const meshes = container.meshes;
      const card = meshes[0];
      card.name = "card";
      card.position = new BABYLON.Vector3(0, 1, 0);
      card.scaling = new BABYLON.Vector3(0.4, 0.4, 0.4);

      const magerials = container.materials;
      const material = magerials[0];

      // material.alpha = 0.9; // Adjust the transparency level as needed
      // material.alphaMode = BABYLON.Engine.ALPHA_COMBINE;
      // material.transparencyMode = BABYLON.Material.MATERIAL_ALPHABLEND;

      card.material = material;

      //   createGUI(card);

      // Adds all elements to the scene
      container.addAllToScene();
    });
  };

  const bjsCanvas = ref(null);
  useCanvatoriumScene(bjsCanvas, createLabContent);
</script>

<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
