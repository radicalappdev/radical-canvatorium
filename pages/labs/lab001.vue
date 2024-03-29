<script lang="ts" setup>
  import { ref } from "vue";
  import { MeshBuilder, StandardMaterial, Color3, Vector3, Mesh, Scene } from "@babylonjs/core";

  definePageMeta({
    featured: false,
    title: "Lab 001 – Picking Colors",
    description: "This is a recreation of the original Canvatorium Lab 001. I picked out some colors to use throughout the labs in the future."
  });

  // Add lab-specific content here using the provided 'scene' instance
  const createLabContent = (scene: Scene) => {
    // Make some boxes to test out the colors in VR
    const group = new Mesh("color-group");
    group.position = new Vector3(-3.5, 0.5, 0);

    // Add color boxes
    makeBox("purple", group, scene).position = new Vector3(0, 0, 0);
    makeBox("blue", group, scene).position = new Vector3(1, 0, 0);
    makeBox("teal", group, scene).position = new Vector3(2, 0, 0);
    makeBox("cyan", group, scene).position = new Vector3(3, 0, 0);
    makeBox("green", group, scene).position = new Vector3(4, 0, 0);
    makeBox("yellow", group, scene).position = new Vector3(5, 0, 0);
    makeBox("orange", group, scene).position = new Vector3(6, 0, 0);
    makeBox("red", group, scene).position = new Vector3(7, 0, 0);

    // Add slate boxes
    makeBox("slate1", group, scene).position = new Vector3(0, 1, 0);
    makeBox("slate2", group, scene).position = new Vector3(1, 1, 0);
    makeBox("slate3", group, scene).position = new Vector3(2, 1, 0);
    makeBox("slate4", group, scene).position = new Vector3(3, 1, 0);
    makeBox("slate5", group, scene).position = new Vector3(4, 1, 0);
    makeBox("slate6", group, scene).position = new Vector3(5, 1, 0);
    makeBox("slate7", group, scene).position = new Vector3(6, 1, 0);
    makeBox("slate8", group, scene).position = new Vector3(7, 1, 0);
  };

  const makeBox = (colorName: keyof typeof labColors, parent: Mesh, scene: Scene) => {
    // Create a colored box from using a string to get the color from the Brand object
    const mat = new StandardMaterial(`${colorName}-material`, scene);
    mat.diffuseColor = Color3.FromHexString(labColors[colorName]);
    mat.specularColor = new Color3(0.1, 0.1, 0.1);
    const mesh = MeshBuilder.CreateBox(`${colorName}-box`, { size: 1 }, scene);
    mesh.material = mat;
    mesh.parent = parent;

    return mesh;
  };

  const bjsCanvas = ref(null);
  // Without scene options (see lab001 for an example)
  useCanvatoriumScene(bjsCanvas, createLabContent);
</script>
<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
