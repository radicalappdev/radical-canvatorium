<script setup>
  import { Vector3, MeshBuilder } from "babylonjs";
  import { AdvancedDynamicTexture, TextBlock, Image, Ellipse, Control, Rectangle, Button, Container } from "babylonjs-gui";

  definePageMeta({
    featured: false,
    title: "Lab 045",
    description: "Prototype UI Cards"
  });

  const createLabContent = async (scene) => {
    lab045_example_1(scene);
  };

  // This will be a reusable asset that I can use in other labs
  const createLabCardRect = (width, height, scene) => {
    const plane = MeshBuilder.CreatePlane("lab-card-rect-mesh", { width: width, height: height }, scene);

    const advancedTexture = AdvancedDynamicTexture.CreateForMesh(plane, 1024 * (width / 10), 1024 * (height / 10));
    advancedTexture.name = "lab-card-rect-texture";

    const rect = new Rectangle("rect");
    rect.width = 1;
    rect.height = 1;
    rect.cornerRadius = 50;
    rect.color = labColors.slate8;
    rect.background = labColors.slate2;
    rect.thickness = 2;
    rect.borderColor = labColors.slate8;
    rect.alpha = 0.9;
    rect.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    rect.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    // rect.zIndex = -10; // always behind other controls
    advancedTexture.addControl(rect);

    return {
      plane,
      advancedTexture
    };
  };

  // Examples of using the createLabCardRect
  const lab045_example_1 = (scene) => {
    const { plane, advancedTexture } = createLabCardRect(8, 4.2, scene);

    plane.position = new Vector3(0, 1.2, 0);
    plane.scaling = new Vector3(0.2, 0.2, 0.2);

    const ellipseContainer = new Ellipse("masker");
    ellipseContainer.width = "100px";
    ellipseContainer.height = "100px";

    // position the ellipse ellipseContainer in the top left corner
    ellipseContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    ellipseContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    ellipseContainer.left = "30px";
    ellipseContainer.top = "30px";
    ellipseContainer.thickness = 0;

    advancedTexture.addControl(ellipseContainer);

    // load an image on the GUI
    const image = new Image("but", "/assets/vrhermit-2023.jpg");
    ellipseContainer.addControl(image);

    const cardText = new TextBlock("card-text");
    cardText.text = "vrhermit";
    cardText.color = labColors.slate8;
    cardText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    cardText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    cardText.top = 40;
    cardText.left = 150;
    cardText.fontSize = 64;

    const paragraph = new TextBlock();
    paragraph.text = "Developer General working with a variety of technology to solve real problems. I focus on UI/UX, Workflow, and Spatial Computing.";
    paragraph.color = labColors.slate8;
    paragraph.fontSize = 28;
    paragraph.textWrapping = true;
    paragraph.width = 0.9;
    paragraph.height = 0.9;
    paragraph.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    paragraph.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    paragraph.top = 150;

    // Add a row of 3 Babylon JS GUI buttons to the bottom of the card
    const button1 = Button.CreateSimpleButton("but1", "Threads");
    button1.width = 0.2;
    button1.height = "40px";
    button1.color = labColors.slate8;
    button1.cornerRadius = 20;
    button1.background = labColors.slate2;
    button1.thickness = 2;
    button1.borderColor = labColors.slate8;
    button1.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    button1.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    button1.left = "50px";
    button1.top = "-40px";
    button1.zIndex = 1;
    button1.onPointerUpObservable.add(() => {
      console.log("Button 1 pressed");
    });
    advancedTexture.addControl(button1);

    const button2 = Button.CreateSimpleButton("but2", "Instagram");
    button2.width = 0.2;
    button2.height = "40px";
    button2.color = labColors.slate8;
    button2.cornerRadius = 20;
    button2.background = labColors.slate2;
    button2.thickness = 2;
    button2.borderColor = labColors.slate8;
    button2.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    button2.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    button2.top = "-40px";
    button2.zIndex = 1;
    button2.onPointerUpObservable.add(() => {
      console.log("Button 2 pressed");
    });
    advancedTexture.addControl(button2);

    const button3 = Button.CreateSimpleButton("but3", "Oculus");
    button3.width = 0.2;
    button3.height = "40px";
    button3.color = labColors.slate8;
    button3.cornerRadius = 20;
    button3.background = labColors.slate2;
    button3.thickness = 2;
    button3.borderColor = labColors.slate8;
    button3.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    button3.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    button3.left = "-50px";
    button3.top = "-40px";
    button3.zIndex = 1;
    button3.onPointerUpObservable.add(() => {
      console.log("Button 3 pressed");
    });
    advancedTexture.addControl(button3);

    advancedTexture.addControl(paragraph);

    advancedTexture.addControl(cardText);
  };

  const bjsCanvas = ref(null);
  useCanvatoriumScene(bjsCanvas, createLabContent);
</script>

<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
