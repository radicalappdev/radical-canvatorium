<script setup>
  import { MeshBuilder } from "babylonjs";
  import { AdvancedDynamicTexture, TextBlock, Button } from "babylonjs-gui";

  definePageMeta({
    featured: true,
    title: "Lab 044 - Independent reactive AdvancedDynamicTextures",
    description: "Expanding on the previous lab, I want to see if I coucanld make each AdvancedDynamicTexture an independent reactive element.",
    labNotes: `Expanding on the previous lab, I want to see if I coucanld make each AdvancedDynamicTexture an independent reactive element.`
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
    // An internal reactive value for the title
    // In a future lab, I'll make this a reactive object with more properties and move outside the generateCard function
    const title = ref("I'm Sparticus!");

    const plane = MeshBuilder.CreatePlane("plane", { width: 0.3, height: 0.3 }, scene);

    const advancedTexture = AdvancedDynamicTexture.CreateForMesh(plane);
    advancedTexture.name = "card-texture";
    advancedTexture.background = labColors.slate8;

    const titleText = new TextBlock("title-text");

    titleText.text = title.value;
    titleText.color = "white";
    titleText.fontSize = 96;
    titleText.top = -100;

    advancedTexture.addControl(titleText);

    // Add a button to change the title value
    const button = Button.CreateSimpleButton("button", "Change Title");
    button.width = "250px";
    button.height = "150px";
    button.color = "white";
    button.background = "purple";
    button.fontSize = 48;
    button.cornerRadius = 20;
    button.top = 100;

    button.onPointerUpObservable.add(() => {
      title.value = title.value === "I'm Sparticus!" ? "No, I'm Sparticus!" : "I'm Sparticus!";
    });
    advancedTexture.addControl(button);

    const sixDofDragBehavior = new BABYLON.SixDofDragBehavior();
    sixDofDragBehavior.allowMultiPointers = true;
    plane.addBehavior(sixDofDragBehavior);

    // Watch the title value for changes and update the text block
    watch(title, (newValue, oldValue) => {
      console.log(`Title changed from ${oldValue} to ${newValue}`);
      titleText.text = newValue;
    });

    return plane;
  };

  const bjsCanvas = ref(null);
  useCanvatoriumScene(bjsCanvas, createLabContent);
</script>

<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
