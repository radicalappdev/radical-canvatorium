<script lang="ts" setup>
  import { Scene, Vector3, SixDofDragBehavior, TransformNode } from "babylonjs";
  import { TextBlock, GUI3DManager, SpherePanel, MeshButton3D, Rectangle, Button } from "babylonjs-gui";

  definePageMeta({
    featured: true,
    title: "Lab 058 - Adding 2D GUI to 3D GUI",
    description: "Can I add interactive 2D content to a 3D GUI?",
    labNotes: `I'd like to use 3D GUI features like Sphere Panel to lay out my cards, but I don't want the 3D controls to be interactive. I want to add my own 2D GUI controls to the 3D GUI.`
  });

  const createLabContent = async (scene: Scene) => {
    const windowGroupMesh = canLabWindowGroup(scene);
    windowGroupMesh.position = new Vector3(0, 1, 0);

    // create a 3D GUI
    const manager = new GUI3DManager(scene);
    const anchor = new TransformNode("");
    anchor.parent = windowGroupMesh;
    anchor.position = new Vector3(0, 3, -9);

    //  create a sphere panel
    const panel = new SpherePanel();
    panel.margin = 0.15;
    panel.radius = 9;
    panel.rows = 1;

    manager.addControl(panel);
    panel.linkToTransformNode(anchor);

    for (let i = 0; i < 6; i++) {
      const card = generateCard(scene, i);
      // Add the card to a Control
      const button3D = new MeshButton3D(card, "button-" + i);

      // Override the default animations
      button3D.pointerEnterAnimation = () => {
        console.log("pointerEnterAnimation");
      };
      button3D.pointerOutAnimation = () => {
        console.log("pointerOutAnimation");
      };
      button3D.pointerDownAnimation = () => {
        console.log("pointerDownAnimation");
      };
      button3D.pointerUpAnimation = () => {
        console.log("pointerUpAnimation");
      };

      panel.addControl(button3D);
    }
  };

  const generateCard = (scene: Scene, index: number) => {
    const { plane, advancedTexture } = canLabCardSimple(4, 3, scene);
    plane.name = "plane";
    advancedTexture.name = "card-texture";

    // get the rect
    const rect = advancedTexture.getControlByName("rect") as Rectangle;
    if (rect) {
      rect.background = "white";
    }

    const titleText = new TextBlock("title-text");
    titleText.text = index + " Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
    titleText.textWrapping = true;
    titleText.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_LEFT;
    titleText.paddingLeftInPixels = 24;
    titleText.paddingRightInPixels = 24;
    titleText.color = "black";
    titleText.fontSize = 48;
    advancedTexture.addControl(titleText);

    // Add a button
    const button = Button.CreateSimpleButton("button", "Click Me");
    button.width = 0.2;
    button.height = "40px";
    button.color = "white";
    button.background = "green";
    button.onPointerUpObservable.add(() => {
      console.log("button clicked");
    });
    advancedTexture.addControl(button);

    const sixDofDragBehavior = new SixDofDragBehavior();
    sixDofDragBehavior.allowMultiPointer = true;
    plane.addBehavior(sixDofDragBehavior);

    return plane;
  };

  const bjsCanvas = ref(null);
  useCanvatoriumScene(bjsCanvas, createLabContent);
</script>

<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
