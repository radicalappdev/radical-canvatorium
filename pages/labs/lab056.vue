<script lang="ts" setup>
  import { Scene, StandardMaterial, Vector3, Color3, MeshBuilder, SixDofDragBehavior, SurfaceMagnetismBehavior, TransformNode, BoundingBox } from "@babylonjs/core";
  import { MeshButton3D, GUI3DManager, SpherePanel } from "@babylonjs/gui";

  definePageMeta({
    featured: false,
    failure: true,
    title: "Lab 056 - Sphere Panel + Surface Magnetism Behavior",
    description: "Can I snap a subject to objects in a Sphere Panel?",
    labNotes: `This functions, but has some quirks.
- There is no way to tell the surface magnetism behavior to attach to a given face of the mesh. It will always attach to the closest face.
- If the subject overlaps the target too much, the behavior may not trigger.`
  });

  const createLabContent = async (scene: Scene) => {
    const cam = scene.getCameraByName("camera");
    if (cam) {
      cam.position = new Vector3(0, 1, -2);
    }

    // Create the cards that we will snap the subject to
    const cardMat = new StandardMaterial("card-mat", scene);
    cardMat.diffuseColor = Color3.FromHexString(labColors.slate4);
    cardMat.specularColor = new Color3(0.2, 0.2, 0.2);
    cardMat.alpha = 0.2;

    const cardWidth = 0.1;
    const cardHeight = 0.1;

    const card = MeshBuilder.CreatePlane("card", { width: cardWidth, height: cardHeight }, scene);
    card.isPickable = false;
    card.material = cardMat;
    card.position = new Vector3(0, 1.5, 0);

    // Create the 3D UI manager
    var manager = new GUI3DManager(scene);
    var anchor = new TransformNode("");
    anchor.position = new Vector3(0, 1.5, 1);

    var panel = new SpherePanel();
    panel.margin = 0.15;
    panel.radius = 1.5;
    panel.columns = 6;

    manager.addControl(panel);
    panel.linkToTransformNode(anchor);
    panel.position.z = -1.5;

    let cards = [];

    panel.blockLayout = true;
    for (var index = 0; index < 18; index++) {
      const newCard = card.clone("card" + index);
      const meshButton3D = new MeshButton3D(newCard, "button" + index);

      panel.addControl(meshButton3D);
      cards.push(newCard);
    }
    panel.blockLayout = false;

    card.dispose();

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
    surfaceMagnetismBehavior.meshes = cards;
    surfaceMagnetismBehavior.hitNormalOffset = 0;
    surfaceMagnetismBehavior.keepOrientationVertical = false;
    surfaceMagnetismBehavior.maxStickingDistance = 1;
    subject.addBehavior(surfaceMagnetismBehavior);

    const sixDofDragBehavior = new SixDofDragBehavior();
    sixDofDragBehavior.allowMultiPointer = true;
    // When this is enabled, the subject will update based on pointer events
    surfaceMagnetismBehavior.enabled = false;

    // We can use the drag start and end observables enable and disable the surface magnetism behavior
    // It will stop respnding to the pointer events and only snap to the surface during the drag
    sixDofDragBehavior.onDragStartObservable.add(() => {
      surfaceMagnetismBehavior.enabled = true;
      cardMat.alpha = 0.8;
    });

    sixDofDragBehavior.onDragEndObservable.add(() => {
      surfaceMagnetismBehavior.enabled = false;
      cardMat.alpha = 0.2;
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
