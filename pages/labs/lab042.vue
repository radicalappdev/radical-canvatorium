<script setup>
import { MeshBuilder, PointerDragBehavior } from "babylonjs";

definePageMeta({
  featured: true,
  title: "Lab 042 - Lay out 3D objects in a line",
  description: "Lay out 3D objects in a line"
});

const createLabContent = async (scene) => {
  const addBoxesToLayout = (numBoxes, layout, scene) => {
    // Add the layout box
    layout.position.y = 0.5;

    // Add the boxes as children of the layout with unique names and space them out evenly on the x-axis
    const boxes = [];
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

        // Reorder boxes when boxes intersect
        for (let j = 0; j < boxes.length; j++) {
          const otherBox = boxes[j];
          if (box !== otherBox && box.intersectsMesh(otherBox)) {
            // Determine the direction to move the boxes
            const direction = box.position.x < otherBox.position.x ? -1 : 1;
            // Determine the index of the other box in the boxes array
            const index = boxes.indexOf(otherBox);
            // Move the other box over by one position in the boxes array and update its position
            boxes.splice(index + direction, 0, boxes.splice(index, 1)[0]);
            otherBox.position.x = (index + direction - (numBoxes - 1) / 2) * 0.25;
          }
        }
      });

      box.addBehavior(grabber);
      box.parent = layout;
      boxes.push(box);
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
