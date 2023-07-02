<script setup>
  import { Color3, StandardMaterial, MeshBuilder, Vector3 } from "babylonjs";

  definePageMeta({
    featured: false,
    title: "Lab 004 - Passing the XR Experience from useCanvatoriumScene to the Lab",
    description: "createLabContent now receives the XR experience as a promise.",
    labNotes: `Resolve the promise to get the XR experience and use it in the lab.
- This lab uses the same content as Lab 003, but the XR experience is passed to the lab as a promise from useCanvatoriumScene.
- Move the player when they enter immersive mode
- Controller input example: scale boxes with triggers on the controllers`
  });

  const createLabContent = async (scene, xrPromise) => {
    // Demo 1: Move the player to the purple landing pad when they enter immersive mode
    const purple = new StandardMaterial("purple", scene);
    purple.diffuseColor = new Color3.FromHexString(labColors.purple);

    const landing = MeshBuilder.CreateCylinder("cylinder", { diameter: 1, height: 0.2 }, scene);
    landing.position = new Vector3(2, 0.1, 3);
    landing.material = purple;

    // Demo 2: Controller input. Scale these boxes with the triggers on the controllers
    const cyan = new StandardMaterial("cyan", scene);
    cyan.diffuseColor = new Color3.FromHexString(labColors.cyan);
    const box1 = MeshBuilder.CreateBox("box", { size: 0.8 }, scene);
    box1.position = new Vector3(1.5, 1, 5);
    box1.material = cyan;

    const box2 = MeshBuilder.CreateBox("box", { size: 0.8 }, scene);
    box2.position = new Vector3(2.5, 1, 5);
    box2.material = cyan;

    async function customizeXRForLab() {
      const xr = await xrPromise;
      console.log("xr received by lab", xr);

      xr.baseExperience.onInitialXRPoseSetObservable.add((xrCamera) => {
        console.log("Entering Immersive Mode with camera", xrCamera);
        xrCamera.position.z = landing.position.z;
        xrCamera.position.x = landing.position.x;
      });

      xr.input.onControllerAddedObservable.add((controller) => {
        controller.onMotionControllerInitObservable.add((motionController) => {
          if (motionController.handness === "left") {
            const xr_ids = motionController.getComponentIds();
            let triggerComponent = motionController.getComponent(xr_ids[0]); //xr-standard-trigger
            triggerComponent.onButtonStateChangedObservable.add(() => {
              if (triggerComponent.pressed) {
                box1.scaling = new Vector3(0.8, 0.8, 0.8);
              } else {
                box1.scaling = new Vector3(1, 1, 1);
              }
            });
          }
          if (motionController.handness === "right") {
            const xr_ids = motionController.getComponentIds();
            let triggerComponent = motionController.getComponent(xr_ids[0]); //xr-standard-trigger
            triggerComponent.onButtonStateChangedObservable.add(() => {
              if (triggerComponent.pressed) {
                box2.scaling = new Vector3(0.8, 0.8, 0.8);
              } else {
                box2.scaling = new Vector3(1, 1, 1);
              }
            });
          }
        });
      });
    }
    customizeXRForLab();
  };

  // Omit the scene options to use the default XR experience from useCanvatoriumScene
  const labSceneOptions = {
    useWebXRPlayer: true
  };

  const bjsCanvas = ref(null);
  // With scene options
  useCanvatoriumScene(bjsCanvas, createLabContent, labSceneOptions);
</script>

<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
