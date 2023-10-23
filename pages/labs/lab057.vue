<script lang="ts" setup>
  import { Scene, Vector3, SixDofDragBehavior, TransformNode } from "babylonjs";
  import { TextBlock, GUI3DManager, SpherePanel, MeshButton3D, Rectangle, Button, Control3D } from "babylonjs-gui";

  definePageMeta({
    featured: true,
    title: "Lab 057 - ❌ Adding regular controls to GUI3DManager",
    description: "Can I add regular controls to a GUI3DManager instead of MeshButton3D?",
    labNotes: `I'd like to create a mesh that has an ADT, then add the mesh to a control to be able add it to a GUI3DManager.`
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
      // Add the card to a Control?
      // There is no way to pass Control3D a mesh or node from what I can tell...

      // const control = new Control3D(card); // ❌ this fails
      //   panel.addControl(control);
    }
  };

  const generateCard = (scene: Scene, index: number) => {
    const { plane, advancedTexture } = canLabCardSimple(4, 3, scene);
    plane.name = "plane";
    plane.scaling = new Vector3(0.5, 0.5, 0.5);
    advancedTexture.name = "card-texture";

    // get the rect
    const rect = advancedTexture.getControlByName("rect") as Rectangle;
    if (rect) {
      rect.background = "white";
    }

    const titleText = new TextBlock("title-text");
    titleText.text = "Lab 057 Failed. See notes and comments in code.";
    titleText.textWrapping = true;
    titleText.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_LEFT;
    titleText.paddingLeftInPixels = 24;
    titleText.paddingRightInPixels = 24;
    titleText.color = "black";
    titleText.fontSize = 36;
    advancedTexture.addControl(titleText);

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
