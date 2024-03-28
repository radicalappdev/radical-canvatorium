<script lang="ts" setup>
  import { Scene, Vector3, SixDofDragBehavior } from "@babylonjs/core";
  import { TextBlock, Button } from "@babylonjs/gui";

  definePageMeta({
    featured: true,
    title: "Lab 044 - Independent Reactive Texture Cards",
    description: "Expanding on the previous lab, I want to see if I coucanld make each AdvancedDynamicTexture an independent reactive element.",
    labNotes: `Expanding on the previous lab, I want to see if I coucanld make each AdvancedDynamicTexture an independent reactive element. I expored several ways of doing this incuding a simple local ref(), a reactive array of titles, and a reactive array of objects.`
  });

  type Item = {
    title?: string;
    index?: number;
  };

  const createLabContent = async (scene: Scene) => {
    const numberOfCards = 50;

    const data = reactive([] as Array<Item>);
    for (let i = 0; i < numberOfCards; i++) {
      const newItem: Item = { title: `I'm Sparticus! (${i})`, index: i };
      data.push(newItem as Item);
    }

    // Create a card for each title object
    for (let i = 0; i < numberOfCards; i++) {
      const item = data[i];
      const card = generateCard(scene, item);
      card.position.x = Math.random() * 10 - 5;
      card.position.z = Math.random() * 10 - 5;
      card.position.y = Math.random() + 1;
    }
  };

  const generateCard = (scene: Scene, item: Item) => {
    // use the index to get the title from the reactive array
    const index = item.index; // just used for naming for now

    const { plane, advancedTexture } = canLabCardSimple(7.4, 3, scene);
    plane.name = "plane";
    plane.position = new Vector3(0, 1.2, 0);
    plane.scaling = new Vector3(0.15, 0.15, 0.15);
    advancedTexture.name = `card-texture-${index}`;

    // advancedTexture.addControl(titleText);
    const titleText = new TextBlock("title-text");
    titleText.text = `I'm Sparticus! (${index})`;
    titleText.color = "black";
    titleText.fontSize = 72;
    titleText.top = -50;
    advancedTexture.addControl(titleText);

    // Add a button to change the title value
    const button = Button.CreateSimpleButton("button", "Acuse me?");
    button.width = 0.35;
    button.height = "90px";
    button.fontSize = "36px";
    button.color = labColors.slate8;
    button.background = labColors.slate8;
    button.cornerRadius = 20;
    button.thickness = 2;
    button.top = 70;
    if (button.textBlock) {
      button.textBlock.color = labColors.slate1;
    }

    button.onPointerUpObservable.add(() => {
      item.title = item.title === `I'm Sparticus! (${index})` ? `I'm not Sparticus! (${index})` : `I'm Sparticus! (${index})`;
    });
    advancedTexture.addControl(button);

    const sixDofDragBehavior = new SixDofDragBehavior();
    sixDofDragBehavior.allowMultiPointer = true;
    plane.addBehavior(sixDofDragBehavior);

    // Watch the title value for changes and update the text block
    watch(item, (newValue, oldValue) => {
      console.log(`item ${index} changed from ${oldValue.title} to ${newValue.title}`);
      titleText.text = newValue.title || "";
    });

    return plane;
  };

  const bjsCanvas = ref(null);
  useCanvatoriumScene(bjsCanvas, createLabContent);
</script>

<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
