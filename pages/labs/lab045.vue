<script setup>
  import { Vector3, Animation } from "babylonjs";
  import { TextBlock, Image, Ellipse, Control } from "babylonjs-gui";

  definePageMeta({
    featured: false,
    title: "Lab 045 - Prototype UI Cards",
    description: "In this lab I created a reusable card made from a plane and an AdvancedDynamicTexture."
  });

  const createLabContent = async (scene) => {
    const showModal = ref(false);
    const showReplace = ref(false);
    const showDetail = ref(false);

    // Position the non-VR camera to better see the card
    const cam = scene.getCameraByName("camera");
    cam.position = new Vector3(0, 1.4, -2);

    // Examples of using the canLabCardSimple, defined in lab-cards.ts
    // Build a main / parent card
    const lab045_example_1 = (scene) => {
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
      button1.textBlock.fontSize = 26;
      button1.onPointerUpObservable.add(() => {
        console.log("Modal Open");
        showModal.value = true;
      });
      advancedTexture.addControl(button1);

      const button2 = canLabButtonSimple("replace-open", "Replace");
      button2.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
      button2.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
      button2.top = "-40px";
      button2.zIndex = 1;
      button2.onPointerUpObservable.add(() => {
        console.log("Replace Open");
        showReplace.value = true;
      });
      advancedTexture.addControl(button2);

      const button3 = canLabButtonSimple("detail-open", "Details");
      button3.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
      button3.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
      button3.left = "-50px";
      button3.top = "-40px";
      button3.zIndex = 1;
      button3.onPointerUpObservable.add(() => {
        showDetail.value = showDetail.value ? false : true;
      });
      advancedTexture.addControl(button3);

      watch(showModal, (newValue) => {
        if (newValue) {
          Animation.CreateAndStartAnimation("open-modal", plane, "position.z", 60, 6, plane.position.z, 0.1, 0);
          Animation.CreateAndStartAnimation("open-modal", plane, "visibility", 60, 6, 1, 0.5, 0);

          lab045_example_2(scene);
        } else {
          Animation.CreateAndStartAnimation("open-modal", plane, "position.z", 60, 6, 0.1, 0, 0);
          Animation.CreateAndStartAnimation("open-modal", plane, "visibility", 60, 6, 0.5, 1, 0);
        }
      });

      watch(showReplace, (newValue) => {
        if (newValue) {
          plane.position.z = 0.1;
          plane.visibility = 0.0;

          lab045_example_3(scene);
        } else {
          plane.position.z = 0;
          plane.visibility = 1;
        }
      });

      watch(showDetail, (newValue) => {
        if (newValue) {
          console.log("Detail Open");
          button3.color = labColors.slate2;
          button3.background = labColors.slate8;
        } else {
          console.log("Detail Close from Main");
          button3.color = labColors.slate8;
          button3.background = labColors.slate2;
        }
      });
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
        console.log("Modal Close");
        showModal.value = false;
        plane.dispose();
      });
      advancedTexture.addControl(button1);
    };

    //   lab045_example_3 is another example of a card with a paragraph of text and a button
    // this time it will hide the card and show a new card in its place

    const lab045_example_3 = (scene) => {
      // a simple card with a paragraph of text and a button

      const { plane, advancedTexture } = canLabCardSimple(8, 5.2, scene);

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
        console.log("Replace Close");
        plane.dispose();
        showReplace.value = false;
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
        console.log("Detail Close from Detail");
        showDetail.value = false;
      });
      advancedTexture.addControl(button1);

      plane.visibility = 0;

      watch(showDetail, (newValue) => {
        if (newValue) {
          plane.visibility = 1;
        } else {
          plane.visibility = 0;
        }
      });
    };

    // Call the first example, a parent window
    lab045_example_1(scene);
    // Call example 4, a hidden detail card we can toggle open
    lab045_example_4(scene);
  };

  const bjsCanvas = ref(null);
  useCanvatoriumScene(bjsCanvas, createLabContent);
</script>

<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
