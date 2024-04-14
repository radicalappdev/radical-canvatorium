<script lang="ts" setup>
  import { Vector3, Scene, MeshBuilder, StandardMaterial, Color3 } from "@babylonjs/core";
  import { AdvancedDynamicTexture, TextBlock } from "@babylonjs/gui";

  definePageMeta({
    featured: true,
    title: "Lab 057 – Universal Input with Babylon.js",
    description: ""
  });

  const createLabContent = async (scene: Scene) => {
    // Set count as a reactive value
    const count = ref(0);

    // Create a material and a cube
    const material = new StandardMaterial("material", scene);
    material.diffuseColor = Color3.FromHexString(labColors.purple);

    const cube = MeshBuilder.CreateBox("cube", { size: 1 }, scene);
    cube.position.y = 0.5;
    cube.material = material;

    const { plane, advancedTexture } = canLabCardSimple(8, 4.4, scene);
    plane.position.y = 1.3;
    plane.scaling = new Vector3(0.3, 0.3, 0.3);

    const titleText = new TextBlock("title-text");
    titleText.text = "Universal Input with Babylon.js";
    titleText.color = "black";
    titleText.fontSize = 36;
    titleText.width = 0.9;
    titleText.top = -80;
    advancedTexture.addControl(titleText);

    const counterText = new TextBlock("couter-text");
    counterText.text = "0";
    counterText.color = "black";
    counterText.fontSize = 72;
    advancedTexture.addControl(counterText);

    const buttonIncrement = canLabButtonSimple("button-Increment", "+");
    buttonIncrement.top = 80;
    buttonIncrement.left = "100px";
    buttonIncrement.fontSize = 48;
    buttonIncrement.onPointerUpObservable.add(() => {
      count.value++;
    });
    advancedTexture.addControl(buttonIncrement);

    const buttonDecrement = canLabButtonSimple("button-decrement", "-");
    buttonDecrement.top = 80;
    buttonDecrement.left = "-100px";
    buttonDecrement.fontSize = 48;
    buttonDecrement.onPointerUpObservable.add(() => {
      count.value--;
    });
    advancedTexture.addControl(buttonDecrement);

    // watch() the count value and update the counterText control
    watch(count, (newValue) => {
      const counterTexture = scene.getTextureByName("lab-card-rect-texture") as AdvancedDynamicTexture;
      if (counterTexture) {
        const counterControl = counterTexture.getControlByName("couter-text") as TextBlock;
        if (counterControl) {
          counterControl.text = newValue.toString();
        }
      }
    });
  };

  const bjsCanvas = ref(null);
  useCanvatoriumScene(bjsCanvas, createLabContent);
</script>
<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
