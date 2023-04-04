<script setup>
import { Color3, StandardMaterial, MeshBuilder, Vector3 } from "babylonjs";

definePageMeta({
  featured: true,
  title: "Lab 003",
  description: "Default XR Experience"
});

const createLabContent = async (scene) => {
  const purple = new StandardMaterial("purple", scene);
  purple.diffuseColor = new Color3.FromHexString(labColors.purple);

  const cyan = new StandardMaterial("cyan", scene);
  cyan.diffuseColor = new Color3.FromHexString(labColors.cyan);

  // Create a cylinder
  const landing = MeshBuilder.CreateCylinder("cylinder", { diameter: 1, height: 0.2 }, scene);
  landing.position = new Vector3(2, 0.1, 3);
  landing.material = purple;

  // Create boxes
  const box1 = MeshBuilder.CreateBox("box", { size: 0.8 }, scene);
  box1.position = new Vector3(1.5, 1, 5);
  box1.material = cyan;

  const box2 = MeshBuilder.CreateBox("box", { size: 0.8 }, scene);
  box2.position = new Vector3(2.5, 1, 5);
  box2.material = cyan;

  // get mesh by name 'ground' to use for teleportation - this is created by the labCreateRoom function in useCanvatoriumScene
  const ground = scene.getMeshByName("ground");
  console.log("ground", ground);

  const xr = await scene.createDefaultXRExperienceAsync({
    floorMeshes: ground
  });

  // Move the player when thet enter immersive mode
  xr.baseExperience.onInitialXRPoseSetObservable.add((xrCamera) => {
    console.log("Entering Immersive Mode with camera", xrCamera);
    xrCamera.position.z = landing.position.z;
    xrCamera.position.x = landing.position.x;
  });

  console.log("xr player created", xr);

  //controller input
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
};

// Omit the scene options to use the default XR experience from useCanvatoriumScene
const labSceneOptions = {
  useWebXRPlayer: false
};

const bjsCanvas = ref(null);
// With scene options
useCanvatoriumScene(bjsCanvas, createLabContent, labSceneOptions);
</script>

<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
