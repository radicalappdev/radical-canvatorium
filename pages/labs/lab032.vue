<script setup>
  import { Vector3, Color3, MeshBuilder, StandardMaterial, PointerDragBehavior, Scalar, Mesh, ExecuteCodeAction, ActionManager } from "babylonjs";
  import { TextBlock } from "babylonjs-gui";
  import { useStorage } from "@vueuse/core";

  definePageMeta({
    featured: false,
    title: "Lab 032 – Lathe",
    description: "Testing an idea to see if can make a VR interface for the array of Vector3s used by the Lathe tool.",
    labNotes: ``
  });

  // Add lab-specific content here using the provided 'scene' instance
  const createLabContent = async (scene) => {
    const cam = scene.getCameraByName("camera");
    // cam.position = new Vector3(0, 1.4, -4);

    // Default settings for the lathe data
    const defaultLatheSettings = {
      numberOfPoints: 12,
      tessellation: 12,
      isFlat: true,
      arc: 1,
      cap: "NO_CAP"
    };

    // Spread the default settings into the stored settings
    // This will only be set if the local storage value is not found, else it will use the local storage value
    let storedLatheSettings = useStorage("lab-lathe-settings", {
      ...defaultLatheSettings
    });

    // Map the stored settings to the reactive settings object
    // I could not find a way to get Watch working with useStorage
    let actualLatheSettings = reactive({
      numberOfPoints: storedLatheSettings.value.numberOfPoints,
      tessellation: storedLatheSettings.value.tessellation,
      isFlat: storedLatheSettings.value.isFlat,
      arc: storedLatheSettings.value.arc,
      cap: storedLatheSettings.value.cap
    });

    watch(actualLatheSettings, (newValue) => {
      storedLatheSettings.value = newValue;
    });

    let grabbersRef;
    let latheMatRef;

    const cardMat = new StandardMaterial("card-mat", scene);
    cardMat.diffuseColor = Color3.FromHexString(labColors.slate6);
    cardMat.specularColor = new Color3(0.2, 0.2, 0.2);

    const cardWidth = 2;
    const cardHeight = 2;
    const cardThickness = 0.01;
    const card = MeshBuilder.CreateBox("card", { width: cardWidth, height: cardHeight, depth: cardThickness }, scene);
    card.isPickable = false;
    card.material = cardMat;
    card.position = new Vector3(1, 1, 0);

    // create plane in front of card for bounds checking
    const boundsWidth = 0;
    const boundsHeight = 0;
    const boundsPlane = MeshBuilder.CreatePlane("boundsPlane", { width: cardWidth - boundsWidth, height: cardHeight - boundsHeight }, scene);
    boundsPlane.isPickable = false;
    boundsPlane.position.x = card.position.x;
    boundsPlane.position.y = card.position.y;
    boundsPlane.position.z = -cardThickness / 2;
    boundsPlane.isVisible = false;

    const grabMat = new StandardMaterial("grab-mat6", scene);
    grabMat.diffuseColor = Color3.FromHexString(labColors.purple);
    grabMat.specularColor = new Color3(0.2, 0.2, 0.2);

    let i;
    let grabbers = [];

    for (i = 0; i < actualLatheSettings.numberOfPoints; i++) {
      var planeDragBehavior = new PointerDragBehavior({
        dragPlaneNormal: boundsPlane.forward
      });
      planeDragBehavior.useObjectOrientationForDragging = true;

      planeDragBehavior.validateDrag = (targetPosition) => {
        const bounds = boundsPlane.getBoundingInfo().boundingBox;
        targetPosition.x = Scalar.Clamp(targetPosition.x, bounds.minimum.x + boundsPlane.position.x, bounds.maximum.x + boundsPlane.position.x);
        targetPosition.y = Scalar.Clamp(targetPosition.y, bounds.minimum.y + boundsPlane.position.y, bounds.maximum.y + boundsPlane.position.y);
        return true;
      };
      const grabber = MeshBuilder.CreateSphere("grabber", {
        diameter: 0.05
      });
      const yoffset = i * 0.1;
      grabber.material = grabMat;
      grabber.position = new Vector3(0 + yoffset / 2, 2 - yoffset, 0);
      grabber.addBehavior(planeDragBehavior);
      grabbers.push(grabber);
    }

    grabbersRef = grabbers;

    console.log(grabbers);

    const latheMat = new StandardMaterial("grab-mat1", scene);
    latheMat.diffuseColor = Color3.FromHexString(labColors.purple);
    latheMat.specularColor = new Color3(0.2, 0.2, 0.2);
    latheMatRef = latheMat;
    const subject1 = MeshBuilder.CreateBox("subject1", {
      height: 0.2,
      width: 0.2,
      depth: 0.2
    });
    subject1.material = cardMat;
    subject1.position = new Vector3(2.2, 1, 0);

    // Subject 1 Action: ExecuteCodeAction -> OnPickTrigger
    // Run code when the trigger is activated
    subject1.actionManager = new ActionManager(scene);
    subject1.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
        //   console.log("Subject 1: ExecuteCodeAction -> OnPickTrigger");
        //   scene.getMeshByName("lathe")?.dispose();
        let latheArray = [];
        for (let i = 0; i < grabbers.length; i++) {
          latheArray.push(grabbers[i].position);
        }

        const lathe = MeshBuilder.CreateLathe("lathe", {
          shape: latheArray,
          sideOrientation: Mesh.DOUBLESIDE,
          tessellation: actualLatheSettings.tessellation,
          arc: actualLatheSettings.arc,
          cap: actualLatheSettings.cap
        });
        lathe.material = latheMat;
        lathe.visibility = 0.6;
        // lathe.closed = true;
        if (actualLatheSettings.isFlat) {
          lathe.convertToFlatShadedMesh();
        }

        lathe.addBehavior(
          new BABYLON.PointerDragBehavior({
            dragPlaneNormal: lathe.upVector
          })
        );
      })
    );
  };

  // If a lab uses the default options, you can just call useBabylonScene() with the bjsCanvas ref and the createLabContent function.
  // Otherwise, you can pass in an options object with the following properties:
  const labSceneOptions = {
    useCamera: true,
    useLight: true,
    useRoom: true
  };

  const bjsCanvas = ref(null);
  // With scene options
  useCanvatoriumScene(bjsCanvas, createLabContent, labSceneOptions);

  // Without scene options (see lab001 for an example)
  // useCanvatoriumScene(bjsCanvas, createLabContent);
</script>
<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
