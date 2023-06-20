<script setup>
  import { MeshBuilder, PointerDragBehavior } from "babylonjs";

  definePageMeta({
    featured: false,
    title: "Lab 042 - Lay out 3D objects in a line",
    description: "Lay out 3D objects in a line"
  });

  const createLabContent = async (scene) => {
    const addBoxesToLayout = (numBoxes, layout, scene) => {
      // Add the layout box
      layout.position.y = 0.5;

      // Add the boxes as children of the layout with unique names and space them out evenly on the x-axis
      for (let i = 0; i < numBoxes; i++) {
        const box = MeshBuilder.CreateBox("box" + i, { size: 0.2 }, scene);
        box.name = "box" + i;
        box.position.x = (i - (numBoxes - 1) / 2) * 0.25;
        box.position.y = 0.5;

        const grabber = new PointerDragBehavior();
        grabber.moveAttached = false; // Disable moving the grabber itself
        grabber.onDragObservable.add((eventData) => {
          box.position.x += eventData.delta.x;
          box.position.y += eventData.delta.y;
        });

        box.addBehavior(grabber);
        box.parent = layout;
      }
    };

    const layout = MeshBuilder.CreateBox("box", { size: 0.5 }, scene);

    const numBoxes = 6;
    addBoxesToLayout(numBoxes, layout, scene);
  };

  const bjsCanvas = ref(null);
  useCanvatoriumScene(bjsCanvas, createLabContent);
</script>

<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
