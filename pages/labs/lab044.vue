<script setup>
  import { MeshBuilder } from "babylonjs";
  import { AdvancedDynamicTexture, TextBlock, Button } from "babylonjs-gui";

  definePageMeta({
    featured: true,
    title: "Lab 044 - Independent Reactive Texture Cards",
    description: "Expanding on the previous lab, I want to see if I coucanld make each AdvancedDynamicTexture an independent reactive element.",
    labNotes: `Expanding on the previous lab, I want to see if I coucanld make each AdvancedDynamicTexture an independent reactive element. I expored several ways of doing this incuding a simple local ref(), a reactive array of titles, and a reactive array of objects.`
  });

  const createLabContent = async (scene) => {
    const numberOfCards = 50;
    // Create a reactive array of objects: title and index
    const titles = ref([]);
    for (let i = 0; i < numberOfCards; i++) {
      titles.value.push(ref({ title: "I'm Sparticus!", index: i }));
    }

    // Create a card for each title object
    for (let i = 0; i < numberOfCards; i++) {
      const titleObject = titles.value[i];
      const card = generateCard(scene, titleObject);
      card.position.x = Math.random() * 10 - 5;
      card.position.z = Math.random() * 10 - 5;
      card.position.y = Math.random() + 1;
    }
  };

  const generateCard = (scene, titleObject) => {
    // use the index to get the title from the reactive array
    const index = titleObject.value.index; // just used for naming for now
    const title = titleObject.value.title; // used for the text block

    const cardWidth = 0.3;
    const cardHeight = 0.15;
    const cardResolution = 1024;

    const plane = MeshBuilder.CreatePlane("plane", { width: cardWidth, height: cardHeight }, scene);
    plane.name = `card-${index}`;

    const advancedTexture = AdvancedDynamicTexture.CreateForMesh(plane, cardResolution * cardWidth, cardResolution * cardHeight);

    advancedTexture.name = `card-texture-${index}`;
    advancedTexture.background = labColors.slate8;

    const titleText = new TextBlock("title-text");
    titleText.name = `title-text-${index}`;
    titleText.text = title;
    titleText.color = "white";
    titleText.fontSize = 36;
    titleText.top = -30;

    advancedTexture.addControl(titleText);

    // Add a button to change the title value
    const button = Button.CreateSimpleButton("button", "Change Title");
    button.height = "40px";
    button.color = "white";
    button.background = labColors.slate6;
    button.fontSize = 32;
    button.paddingLeft = "10px";
    button.paddingRight = "10px";
    button.top = 50;

    button.onPointerUpObservable.add(() => {
      titleObject.value.title = titleObject.value.title === `I'm Sparticus!` ? `I'm not Sparticus!` : `I'm Sparticus!`;
    });
    advancedTexture.addControl(button);

    const sixDofDragBehavior = new BABYLON.SixDofDragBehavior();
    sixDofDragBehavior.allowMultiPointers = true;
    plane.addBehavior(sixDofDragBehavior);

    // Watch the title value for changes and update the text block
    watch(titleObject.value, (newValue, oldValue) => {
      titleText.text = newValue.title;
    });

    return plane;
  };

  const bjsCanvas = ref(null);
  useCanvatoriumScene(bjsCanvas, createLabContent);
</script>

<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
