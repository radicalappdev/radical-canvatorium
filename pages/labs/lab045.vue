<script setup>
  import { Vector3, MeshBuilder, Color3 } from "babylonjs";
  import { AdvancedDynamicTexture, TextBlock, Image, Ellipse, Control, Rectangle, Button } from "babylonjs-gui";

  definePageMeta({
    featured: false,
    title: "Lab 045",
    description: "Prototype UI Cards"
  });

  const createLabContent = async (scene) => {
    // Position the non-VR camera to better see the card
    const cam = scene.getCameraByName("camera");
    cam.position = new Vector3(0, 1.4, -2);

    // Call the first example, a parent window
    lab045_example_1(scene);
  };

  // Examples of using the canLabCardSimple
  const lab045_example_1 = (scene) => {
    // canLabCardSimple is defined in lab-cards.ts
    const { plane, advancedTexture } = canLabCardSimple(8, 4.2, scene);
    plane.name = "parent-plane";
    plane.position = new Vector3(0, 1.2, 0);
    plane.scaling = new Vector3(0.2, 0.2, 0.2);

    const ellipseContainer = new Ellipse("masker");
    ellipseContainer.width = "100px";
    ellipseContainer.height = "100px";
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
    advancedTexture.addControl(cardText);

    const paragraph = new TextBlock();
    paragraph.text = "Developer General working with a variety of technology to solve real problems. I focus on UI/UX, Workflow, and Spatial Computing.";
    paragraph.color = labColors.slate8;
    paragraph.background = "white";
    paragraph.fontSize = 28;
    paragraph.textWrapping = true;
    paragraph.width = 0.9;
    paragraph.height = 0.3;
    paragraph.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    paragraph.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    advancedTexture.addControl(paragraph);

    // Add a row of 3 Babylon JS GUI buttons to the bottom of the card
    const button1 = canLabButtonSimple("modal-open", "Modal");
    button1.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    button1.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    button1.left = "50px";
    button1.top = "-40px";
    button1.onPointerUpObservable.add(() => {
      console.log("Button 1 pressed");
      // TODO: animate this: push the current card back just a bit
      plane.position.z = 0.1;
      lab045_example_2(scene);
    });
    advancedTexture.addControl(button1);

    const button2 = canLabButtonSimple("replace-open", "Replace");
    button2.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    button2.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    button2.top = "-40px";
    button2.zIndex = 1;
    button2.onPointerUpObservable.add(() => {
      // hide the current card
      plane.visibility = 0;
      plane.position.z = 0.1;
      console.log("Button 2 pressed");
      lab045_example_3(scene);
    });
    advancedTexture.addControl(button2);

    const button3 = canLabButtonSimple("detail-open", "Details");
    button3.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    button3.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    button3.left = "-50px";
    button3.top = "-40px";
    button3.zIndex = 1;
    button3.onPointerUpObservable.add(() => {
      console.log("Button 3 pressed");
      lab045_example_4(scene);
    });
    advancedTexture.addControl(button3);
  };

  const lab045_example_2 = (scene) => {
    // a simple card with a paragraph of text and a button

    const { plane, advancedTexture } = canLabCardSimple(6, 3.2, scene);

    plane.position = new Vector3(0, 1.2, 0);
    plane.scaling = new Vector3(0.2, 0.2, 0.2);

    const paragraph = new TextBlock();
    paragraph.text = "A modal that appears in front of the parent card. I could fade the parent card to de-emphasize it.";
    paragraph.color = labColors.slate8;
    paragraph.fontSize = 28;
    paragraph.textWrapping = true;
    paragraph.width = 0.9;
    paragraph.height = 0.9;
    paragraph.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    paragraph.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    paragraph.top = 30;

    advancedTexture.addControl(paragraph);

    // Add a Close button to the bottom of the card
    const button1 = canLabButtonSimple("modal-close", "Close");
    button1.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    button1.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    button1.top = "-40px";
    button1.zIndex = 1;
    button1.onPointerUpObservable.add(() => {
      console.log("Button 1 pressed");
      //dispose of the card
      plane.dispose();
      // get the parent plance and push it back to the original position
      const parentPlane = scene.getMeshByName("parent-plane");
      parentPlane.position.z = 0;
    });
    advancedTexture.addControl(button1);
  };

  //   lab045_example_3 is another example of a card with a paragraph of text and a button
  // this time it will hide the card and show a new card in its place

  const lab045_example_3 = (scene) => {
    // a simple card with a paragraph of text and a button

    const { plane, advancedTexture } = canLabCardSimple(10, 4.2, scene);

    plane.position = new Vector3(0, 1.2, 0);
    plane.scaling = new Vector3(0.2, 0.2, 0.2);

    const paragraph = new TextBlock();
    paragraph.text = "Replace the parent card with another card. This could be used for navigation or simple value pickers.";
    paragraph.color = labColors.slate8;
    paragraph.fontSize = 28;
    paragraph.textWrapping = true;
    paragraph.width = 0.9;
    paragraph.height = 0.9;
    paragraph.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    paragraph.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    paragraph.top = 30;

    advancedTexture.addControl(paragraph);

    // Add a Close button to the bottom of the card
    const button1 = canLabButtonSimple("replace-close", "Close");
    button1.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    button1.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    button1.top = "-40px";
    button1.zIndex = 1;
    button1.onPointerUpObservable.add(() => {
      console.log("Button 1 pressed");
      // get the parent plance and push it back to the original position
      const parentPlane = scene.getMeshByName("parent-plane");
      parentPlane.visibility = 1;
      parentPlane.position.z = 0;

      //dispose of the card
      plane.dispose();
    });
    advancedTexture.addControl(button1);
  };

  // lab045_example_4 should show a card next to the parent card
  // place it to the right and angle it slightly to face the camera

  const lab045_example_4 = (scene) => {
    // a simple card with a paragraph of text and a button

    const { plane, advancedTexture } = canLabCardSimple(3.4, 6, scene);

    plane.position = new Vector3(1.2, 1.2, -0.2);
    plane.scaling = new Vector3(0.2, 0.2, 0.2);
    plane.rotation.y = Math.PI / 6;

    const paragraph = new TextBlock();
    paragraph.text = "A detail card that appears next to the parent card. Useful for showing more information.";
    paragraph.color = labColors.slate8;
    paragraph.fontSize = 28;
    paragraph.textWrapping = true;
    paragraph.width = 0.9;
    paragraph.height = 0.9;
    paragraph.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    paragraph.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    paragraph.top = 30;
    advancedTexture.addControl(paragraph);

    // Add a Close button to the bottom of the card
    const button1 = canLabButtonSimple("detail-close", "Close");
    button1.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    button1.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    button1.top = "-40px";
    button1.zIndex = 1;
    button1.width = 0.5;
    button1.onPointerUpObservable.add(() => {
      console.log("Button 1 pressed");
      //dispose of the card
      plane.dispose();
    });
    advancedTexture.addControl(button1);
  };

  const bjsCanvas = ref(null);
  useCanvatoriumScene(bjsCanvas, createLabContent);
</script>

<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
