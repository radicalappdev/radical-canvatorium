<script lang="ts" setup>
  import { Vector3, Scene, MeshBuilder, StandardMaterial, Color3, ActionManager, ExecuteCodeAction } from "@babylonjs/core";
  import { AdvancedDynamicTexture, TextBlock } from "@babylonjs/gui";

  definePageMeta({
    featured: true,
    title: "Lab 057 – Universal Input with Babylon.js",
    description: ""
  });

  const createLabContent = async (scene: Scene) => {
    // Set count as a reactive value
    const scaler = ref(5);
    const color = ref(labColors.purple);

    // Create a material and a cube
    const material = new StandardMaterial("material", scene);
    material.diffuseColor = Color3.FromHexString(color.value);

    const cube = MeshBuilder.CreateBox("cube", { size: 1 }, scene);
    cube.position = new Vector3(1, 1.3, 0);
    cube.scaling = new Vector3(scaler.value / 10, scaler.value / 10, scaler.value / 10);
    cube.material = material;

    // Tap on the cube to change the color
    cube.actionManager = new ActionManager(scene);
    cube.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnPickTrigger, (evt) => {
        if (color.value === labColors.purple) {
          color.value = labColors.blue;
        } else if (color.value === labColors.blue) {
          color.value = labColors.green;
        } else {
          color.value = labColors.purple;
        }
      })
    );

    const { plane, advancedTexture } = canLabCardSimple(8, 4.4, scene);
    plane.position = new Vector3(-1, 1.3, 0);
    plane.scaling = new Vector3(0.3, 0.3, 0.3);

    const titleText = new TextBlock("title-text");
    titleText.text = "Universal Input with Babylon.js";
    titleText.color = "black";
    titleText.fontSize = 36;
    titleText.width = 0.9;
    titleText.top = -80;
    advancedTexture.addControl(titleText);

    const counterText = new TextBlock("couter-text");
    counterText.text = scaler.value / 10;
    counterText.color = "black";
    counterText.fontSize = 72;
    advancedTexture.addControl(counterText);

    const buttonIncrement = canLabButtonSimple("button-Increment", "+");
    buttonIncrement.top = 80;
    buttonIncrement.left = "100px";
    buttonIncrement.fontSize = 48;
    buttonIncrement.onPointerUpObservable.add(() => {
      scaler.value++;
    });
    advancedTexture.addControl(buttonIncrement);

    const buttonDecrement = canLabButtonSimple("button-decrement", "-");
    buttonDecrement.top = 80;
    buttonDecrement.left = "-100px";
    buttonDecrement.fontSize = 48;
    buttonDecrement.onPointerUpObservable.add(() => {
      scaler.value--;
    });
    advancedTexture.addControl(buttonDecrement);

    // watch() the count value and update the counterText control
    watch(scaler, (newValue) => {
      const counterTexture = scene.getTextureByName("lab-card-rect-texture") as AdvancedDynamicTexture;
      if (counterTexture) {
        const counterControl = counterTexture.getControlByName("couter-text") as TextBlock;
        if (counterControl) {
          newValue = Math.min(10, Math.max(1, newValue));

          counterControl.text = newValue / 10;

          cube.scaling = new Vector3(newValue / 10, newValue / 10, newValue / 10);
        }
      }
    });

    // watch() the color value and update the cube material
    watch(color, (newValue) => {
      material.diffuseColor = Color3.FromHexString(newValue);
    });
  };

  const bjsCanvas = ref(null);
  useCanvatoriumScene(bjsCanvas, createLabContent);
</script>
<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
