<script setup>
  import { Vector3, Color3, Color4, MeshBuilder, StandardMaterial } from "babylonjs";
  import { AdvancedDynamicTexture, TextBlock } from "babylonjs-gui";

  definePageMeta({
    featured: true,
    title: "Lab 005 - Nav Test A",
    description: "Just a navigation test in Nuxt and WebXR"
  });

  const createLabContent = async (scene) => {
    const material = new StandardMaterial("background-material", scene);
    material.diffuseColor = new Color3.FromHexString(labColors.slate2);
    material.alpha = 0.8;

    const background = MeshBuilder.CreateBox("background", { width: 3, height: 1, depth: 0.1 });
    background.material = material;
    background.position.y = 1.1;
    background.enableEdgesRendering();
    background.edgesWidth = 1.5;
    background.edgesColor = new Color4.FromHexString(labColors.slate7);
    background.position = new Vector3(0, 2, 9.8);

    const guiPlane = MeshBuilder.CreatePlane("gui-plane");
    guiPlane.parent = background;
    guiPlane.position.y = 0.14;
    guiPlane.position.z = -0.08;

    const advancedTexture = AdvancedDynamicTexture.CreateForMesh(guiPlane);
    advancedTexture.name = "card-texture";

    const cardText = new TextBlock("card-text");
    cardText.text = "Lab 005";
    cardText.color = labColors.slate8;
    cardText.fontSize = 64;

    const subtitleText = new TextBlock("subtitle-text");
    subtitleText.text = "Nav Test A";
    subtitleText.color = labColors.slate7;
    subtitleText.fontSize = 48;
    subtitleText.top = 70;

    advancedTexture.addControl(cardText);
    advancedTexture.addControl(subtitleText);
    guiPlane.scaling = new Vector3(5, 5, 5);

    const box = MeshBuilder.CreateBox("box", { size: 1 }, scene);
    box.position.y = 0.5;

    // when clicked, go to lab 006
    box.actionManager = new BABYLON.ActionManager(scene);
    box.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, () => {
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
