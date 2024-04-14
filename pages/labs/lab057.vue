<script lang="ts" setup>
  import { Mesh, Vector3, Scene, MeshBuilder, StandardMaterial, Color3, ActionManager, ExecuteCodeAction, WebXRFeatureName, WebXRSessionManager } from "@babylonjs/core";
  import { AdvancedDynamicTexture, TextBlock, StackPanel } from "@babylonjs/gui";

  definePageMeta({
    featured: true,
    title: "Lab 057 – Universal Input with Babylon.js",
    description: `This lab contains a 3D cube and a 2D GUI. Users can interact with these objects in a number of ways depending on how the scene is presented.`,
    labNotes: `
- Mouse / Trackpad on a personal computer
- Tap on touch screen devices
- VR Controllers
  - Laser Pointer
  - Near Interaction
- VR Hand Tracking
  - Laser Pointer
  - Near Interaction for direct touch
- Natural Input (gaze+pinch) on Apple Vision Pro
`
  });

  const createLabContent = async (scene: Scene) => {
    const scaler = ref(5);
    const color = ref(labColors.purple);

    // Create a cube for the user to interact with
    const material = new StandardMaterial("cube-material", scene);
    material.diffuseColor = Color3.FromHexString(color.value);

    const cube = MeshBuilder.CreateBox("cube-mesh", { size: 1 }, scene);
    cube.position = new Vector3(1, 1.3, 0);
    cube.scaling = new Vector3(scaler.value / 10, scaler.value / 10, scaler.value / 10);
    cube.isNearPickable = true; // This will enable direct touch interactions in WebXR
    cube.material = material;

    cube.actionManager = new ActionManager(scene);
    cube.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnPickTrigger, (evt) => {
        if (color.value === labColors.purple) {
          color.value = labColors.blue;
        } else if (color.value === labColors.blue) {
          color.value = labColors.green;
        } else {
          color.value = labColors.purple;
        }
      })
    );

    // Create a 2D GUI
    const { plane, advancedTexture } = canLabCardSimple(8, 4.4, scene);
    plane.position = new Vector3(-1, 1.3, 0);
    plane.scaling = new Vector3(0.3, 0.3, 0.3);
    plane.isNearPickable = true; // This will enable direct touch interactions in WebXR

    const stack = new StackPanel();
    stack.fontSize = "14px";
    stack.verticalAlignment = 2;
    stack.spacing = 20;
    advancedTexture.addControl(stack);

    const titleText = new TextBlock("title-text");
    titleText.text = "Universal Input with Babylon.js";
    titleText.color = "black";
    titleText.fontSize = 36;
    titleText.height = "60px";
    stack.addControl(titleText);

    const lineOne = new TextBlock("title-text");
    lineOne.text = "Tab or click on the cube to change the color.";
    lineOne.color = "black";
    lineOne.fontSize = 24;
    lineOne.height = "40px";
    stack.addControl(lineOne);

    const lineTwo = new TextBlock("title-text");
    lineTwo.text = "Use the buttons to scale the cube.";
    lineTwo.color = "black";
    lineTwo.fontSize = 24;
    lineTwo.height = "40px";
    stack.addControl(lineTwo);

    const row = new StackPanel();
    row.isVertical = false;
    row.height = "100px";
    stack.addControl(row);

    const buttonDecrement = canLabButtonSimple("button-decrement", "-");
    buttonDecrement.fontSize = 48;
    buttonDecrement.width = "200px";
    buttonDecrement.onPointerUpObservable.add(() => {
      scaler.value--;
    });
    row.addControl(buttonDecrement);

    const counterText = new TextBlock("couter-text");
    counterText.text = (scaler.value / 10).toString();
    counterText.color = "black";
    counterText.fontSize = 36;
    counterText.width = "120px";
    row.addControl(counterText);

    const buttonIncrement = canLabButtonSimple("button-Increment", "+");
    buttonIncrement.fontSize = 48;
    buttonIncrement.width = "200px";
    buttonIncrement.onPointerUpObservable.add(() => {
      scaler.value++;
    });
    row.addControl(buttonIncrement);

    // Group the cube and plane so they can be transformed together
    const group = new Mesh("group", scene);
    group.addChild(cube);
    group.addChild(plane);

    // WebXR
    const vrSupported = await WebXRSessionManager.IsSessionSupportedAsync("immersive-vr");
    if (vrSupported) {
      const xr = await scene.createDefaultXRExperienceAsync({
        floorMeshes: [] // pass an empty array to disable teleportation for this demo
      });

      // enable hand tracking
      const featureManager = xr.baseExperience.featuresManager;
      featureManager.enableFeature(WebXRFeatureName.HAND_TRACKING, "latest", {
        xrInput: xr.input
      });

      xr.baseExperience.onInitialXRPoseSetObservable.add((xrCamera) => {
        group.scaling = new Vector3(0.3, 0.3, 0.3);
        group.position = new Vector3(0, 0.8, 0);
        xrCamera.position = new Vector3(0, 0, -0.4);
      });
    }

    // Watchers for reactive updates
    watch(scaler, (newValue) => {
      newValue = Math.min(10, Math.max(1, newValue));
      cube.scaling = new Vector3(newValue / 10, newValue / 10, newValue / 10);
      counterText.text = (newValue / 10).toString();
    });

    watch(color, (newValue) => {
      material.diffuseColor = Color3.FromHexString(newValue);
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
