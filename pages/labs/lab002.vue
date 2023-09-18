<script lang="ts" setup>
  import { Vector3, Scene } from "babylonjs";
  import { AdvancedDynamicTexture, TextBlock } from "babylonjs-gui";

  definePageMeta({
    featured: true,
    title: "Lab 002 – Reactivity with Babylon.js GUI",
    description: "Using Vue Watch to increment a count with Babylon.js GUI."
  });

  const createLabContent = async (scene: Scene) => {
    // Set count as a reactive value
    const count = ref(0);

    const { plane, advancedTexture } = canLabCardSimple(6, 4.4, scene);
    plane.position.y = 1.3;
    plane.scaling = new Vector3(0.3, 0.3, 0.3);

    console.log("advancedTexture", advancedTexture.getSize());

    // Add a title text block
    const titleText = new TextBlock("title-text");
    titleText.text = "Modify a count with Vue watch()";
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

    // Create a 2d button to increment the count
    // const buttonIncrement = Button.CreateSimpleButton("button", "+");
    const buttonIncrement = canLabButtonSimple("button-Increment", "+");
    buttonIncrement.top = 80;
    buttonIncrement.left = "80px";
    buttonIncrement.fontSize = 48;
    buttonIncrement.onPointerUpObservable.add(() => {
      // We can modify the count directly instead of editing the value of the counterText control.
      count.value++;
    });
    advancedTexture.addControl(buttonIncrement);

    // Create a 2d button to decrement the count
    const buttonDecrement = canLabButtonSimple("button-decrement", "-");
    buttonDecrement.top = 80;
    buttonDecrement.left = "-80px";
    buttonDecrement.fontSize = 48;
    buttonDecrement.onPointerUpObservable.add(() => {
      // We can modify the count directly instead of editing the value of the counterText control.
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
