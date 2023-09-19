<script lang="ts" setup>
  import { Scene, Vector3, ActionManager, ExecuteCodeAction } from "babylonjs";
  import { TextBlock } from "babylonjs-gui";

  definePageMeta({
    featured: true,
    title: "Lab 005 - Nav Test A",
    description: "Just a navigation test in Nuxt and WebXR"
  });

  const createLabContent = async (scene: Scene) => {
    const cam = scene.getCameraByName("camera");
    if (cam) {
      cam.position = new Vector3(0, 2.6, -8);
    }

    const { plane, advancedTexture } = canLabCardSimple(9, 4, scene);
    plane.position = new Vector3(0, 2.4, 0);
    plane.scaling = new Vector3(0.4, 0.4, 0.4);

    const cardText = new TextBlock("card-text");
    cardText.text = "Lab 005";
    cardText.fontFamily = "Verdana";
    cardText.color = labColors.slate8;
    cardText.fontSize = 120;
    cardText.top = -50;
    advancedTexture.addControl(cardText);

    const subtitleText = new TextBlock("subtitle-text");
    subtitleText.text = "Nav Test A";
    subtitleText.fontFamily = "Verdana";
    subtitleText.color = labColors.slate7;
    subtitleText.fontSize = 84;
    subtitleText.top = 80;
    advancedTexture.addControl(subtitleText);

    const { plane: planeNav, advancedTexture: advancedTextureNav } = canLabCardSimple(9, 4, scene);
    planeNav.position = new Vector3(0, 1, 0);
    planeNav.scaling = new Vector3(0.2, 0.2, 0.2);

    const cardTextNav = new TextBlock("card-text");
    cardTextNav.text = "Go to Lab 006";
    cardTextNav.fontFamily = "Verdana";
    cardTextNav.color = labColors.slate8;
    cardTextNav.fontSize = 96;
    advancedTextureNav.addControl(cardTextNav);

    // when clicked, go to lab 006
    planeNav.actionManager = new ActionManager(scene);
    planeNav.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnPointerOverTrigger, () => {
        planeNav.scaling = new Vector3(0.22, 0.22, 0.22);
      })
    );
    planeNav.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnPointerOutTrigger, () => {
        planeNav.scaling = new Vector3(0.2, 0.2, 0.2);
      })
    );
    planeNav.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
        // navigate to lab 006 using Nuxt 3 router - failed in WebXR
        // navigateTo("/labs/lab006");

        // use window location to navigate to lab 006 - works in WebXR, but freezes the current scene while loading the new page
        window.location.href = "/labs/lab006";
      })
    );
  };

  const bjsCanvas = ref(null);
  useCanvatoriumScene(bjsCanvas, createLabContent);
</script>

<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
