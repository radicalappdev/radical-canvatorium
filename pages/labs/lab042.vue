<script setup>
import { MeshBuilder, PointerDragBehavior, Color3, StandardMaterial } from "babylonjs";

definePageMeta({
  featured: true,
  title: "Lab 042 - Lay out 3D objects in a line",
  description: "Lay out 3D objects in a line"
});

const createLabContent = async (scene) => {
  const addBoxesToLayout = (numBoxes, layout, scene) => {
    // Add the layout box
    layout.position.y = 0.5;

    // Define an array of colors to use for the boxes
    const colors = [
      new Color3(1, 0, 0), // Red
      new Color3(0, 1, 0), // Green
      new Color3(0, 0, 1), // Blue
      new Color3(1, 1, 0), // Yellow
      new Color3(1, 0, 1), // Magenta
      new Color3(0, 1, 1) // Cyan
    ];

    // Add the boxes as children of the layout with unique names, colors, and evenly spaced on the x-axis
    const boxes = [];
    for (let i = 0; i < numBoxes; i++) {
      const box = MeshBuilder.CreateBox("box" + i, { size: 0.2 }, scene);
      box.name = "box" + i;
      box.position.x = (i - (numBoxes - 1) / 2) * 0.25;
      box.position.y = 0.5;
      box.material = new StandardMaterial(`boxMaterial${i}`, scene);
      box.material.diffuseColor = colors[i % colors.length];

      const grabber = new PointerDragBehavior();
      grabber.moveAttached = false; // Disable moving the grabber itself
      let originalPosition = null;
      grabber.onDragStartObservable.add(() => {
        originalPosition = box.position.clone();
      });
      grabber.onDragEndObservable.add(() => {
        let closestPair = null;
        let closestDistance = Infinity;

        // Find the closest pair of boxes that intersect
        for (let j = 0; j < boxes.length; j++) {
          const otherBox = boxes[j];
          if (box !== otherBox && box.intersectsMesh(otherBox)) {
            const distance = box.position.subtract(otherBox.position).length();
            if (distance < closestDistance) {
              closestPair = [box, otherBox];
              closestDistance = distance;
            }
          }
        }

        // If there is a closest pair of boxes, insert the dragged box between them and update the layout
        if (closestPair) {
          const [boxA, boxB] = closestPair;
          const indexA = boxes.indexOf(boxA);
          const indexB = boxes.indexOf(boxB);
          const insertIndex = Math.min(indexA, indexB) + 1;
          boxes.splice(boxes.indexOf(box), 1);
          boxes.splice(insertIndex, 0, box);
          const layoutChildren = layout.getChildMeshes();
          for (let i = layoutChildren.length - 1; i >= 0; i--) {
            layout.removeChild(layoutChildren[i]);
          }
          boxes.forEach((box, i) => {
            box.position.x = (i - (numBoxes - 1) / 2) * 0.25;
            box.position.y = 0.5;
            box.parent = layout;
          });
        } else {
          // If the dragged box doesn't intersect any other boxes, move it back to its original position
          box.position.copyFrom(originalPosition);
        }
      });

      grabber.onDragObservable.add((eventData) => {
        // Move the dragged box
        box.position.x += eventData.delta.x;
        box.position.y += eventData.delta.y;
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
