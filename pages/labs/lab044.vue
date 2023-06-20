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
    const numberOfCards = 50;
    // Create a reactive array of objects: title and index
    const titles = ref([]);
    for (let i = 0; i < numberOfCards; i++) {
      titles.value.push(ref({ title: "I'm Sparticus!", index: i }));
    }

    for (let i = 0; i < numberOfCards; i++) {
      const titleObject = titles.value[i];
      const card = generateCard(scene, titleObject);
      card.position.x = Math.random() * 10 - 5;
      card.position.z = Math.random() * 10 - 5;
      card.position.y = Math.random() + 0.5;
    }
  };

  const generateCard = (scene, titleObject) => {
    // use the index to get the title from the reactive array
    const title = titleObject.value.title;
    const index = titleObject.value.index;

    const plane = MeshBuilder.CreatePlane("plane", { width: 0.3, height: 0.3 }, scene);
    plane.name = `card-${index}`;

    const advancedTexture = AdvancedDynamicTexture.CreateForMesh(plane);
    advancedTexture.name = `card-texture-${index}`;
    advancedTexture.background = labColors.slate8;

    const titleText = new TextBlock("title-text");
    titleText.name = `title-text-${index}`;
    titleText.text = title;
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
      // toggle the title value and include the index in the new title
      titleObject.value.title = titleObject.value.title === `I'm Sparticus!` ? `I'm not Sparticus!` : `I'm Sparticus!`;
      console.log(`Title changed to ${titleObject.value.title}`);
    });
    advancedTexture.addControl(button);

    const sixDofDragBehavior = new BABYLON.SixDofDragBehavior();
    sixDofDragBehavior.allowMultiPointers = true;
    plane.addBehavior(sixDofDragBehavior);

    // Watch the title value for changes and update the text block
    watch(titleObject.value, (newValue, oldValue) => {
      console.log(`Title changed from ${oldValue.title} to ${newValue.title}`);
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
