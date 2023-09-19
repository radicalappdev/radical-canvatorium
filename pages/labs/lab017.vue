<script lang="ts" setup>
  import { Scene, StandardMaterial, Vector3, Color3, MeshBuilder, SixDofDragBehavior, SurfaceMagnetismBehavior } from "babylonjs";

  definePageMeta({
    featured: true,
    title: "Lab 017 - Surface Magnetism Behavior",
    description: "Revamped version of Lab 017, playing the Surface Magnetism Behavior.",
    labNotes: ``
  });

  const createLabContent = async (scene: Scene) => {
    const cam = scene.getCameraByName("camera");
    if (cam) {
      cam.position = new Vector3(0, 1, -1);
    }

    // Create the cards that we will snap the subject to
    const cardMat = new StandardMaterial("card-mat", scene);
    cardMat.diffuseColor = Color3.FromHexString(labColors.slate4);
    cardMat.specularColor = new Color3(0.2, 0.2, 0.2);

    const cardWidth = 0.6;
    const cardHeight = 0.4;
    const cardThickness = 0.01;
    const card = MeshBuilder.CreateBox("card", { width: cardWidth, height: cardHeight, depth: cardThickness }, scene);
    card.isPickable = false;
    card.material = cardMat;
    card.position = new Vector3(0, 1.5, 0);
    card.visibility = 0.2;

    const card2 = card.clone("card2");
    card2.position = new Vector3(-0.6, 1.5, -0.2);
    card2.rotation.y = -0.7;

    const card3 = card.clone("card3");
    card3.position = new Vector3(0.6, 1.5, -0.2);
    card3.rotation.y = 0.7;

    // Create the subject of the lab - the object that will be dragged around
    const subjectMat = new StandardMaterial("grab-mat4", scene);
    subjectMat.diffuseColor = Color3.FromHexString(labColors.purple);
    subjectMat.specularColor = new Color3(0.2, 0.2, 0.2);

    const subject = MeshBuilder.CreateBox("subject", {
      height: 0.6,
      width: 0.6,
      depth: 0.05
    });
    subject.material = subjectMat;
    subject.position = new Vector3(0, 1.15, 0);
    subject.scaling = new Vector3(0.4, 0.4, 0.4);

    const surfaceMagnetismBehavior = new SurfaceMagnetismBehavior();
    surfaceMagnetismBehavior.meshes = [card, card2, card3];
    subject.addBehavior(surfaceMagnetismBehavior);

    const sixDofDragBehavior = new SixDofDragBehavior();
    sixDofDragBehavior.allowMultiPointer = true;
    // When this is enabled, the subject will update based on pointer events
    surfaceMagnetismBehavior.enabled = false;

    // We can use the drag start and end observables enable and disable the surface magnetism behavior
    // It will stop respnding to the pointer events and only snap to the surface during the drag
    sixDofDragBehavior.onDragStartObservable.add(() => {
      surfaceMagnetismBehavior.enabled = true;
      card.visibility = 0.8;
      card2.visibility = 0.8;
      card3.visibility = 0.8;
    });

    sixDofDragBehavior.onDragEndObservable.add(() => {
      surfaceMagnetismBehavior.enabled = false;
      card.visibility = 0.2;
      card2.visibility = 0.2;
      card3.visibility = 0.2;
    });

    subject.addBehavior(sixDofDragBehavior);
  };

  const bjsCanvas = ref(null);
  // With scene options
  useCanvatoriumScene(bjsCanvas, createLabContent);
</script>

<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
