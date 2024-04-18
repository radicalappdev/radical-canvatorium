<script lang="ts" setup>
  import { Engine, Scene, ArcRotateCamera, Camera, Vector3, Color3, MeshBuilder, StandardMaterial } from "@babylonjs/core";
  import { AdvancedDynamicTexture, StackPanel, Control, Button } from "@babylonjs/gui";

  definePageMeta({
    featured: false,
    title: "Bench 005 – Orthographic Camera Damping",
    description: "",
    labNotes: ``
  });

  const cameraOrthoSize = ref(10);
  const cameraMode = ref("perspective");

  const createLabContent = async (scene: Scene) => {
    const engine = scene.getEngine();

    const boxMaterial = new StandardMaterial("box-mat", scene);
    boxMaterial.diffuseColor = Color3.FromHexString(labColors.purple);
    boxMaterial.specularColor = Color3.Black();

    const subject = MeshBuilder.CreateBox("box", { size: 1 }, scene);
    subject.material = boxMaterial;

    const cylinderMaterial = new StandardMaterial("cylinder-mat", scene);
    cylinderMaterial.diffuseColor = Color3.FromHexString(labColors.blue);
    cylinderMaterial.specularColor = Color3.Black();

    const cylinder = MeshBuilder.CreateCylinder("cylinder", { diameterTop: 1, diameterBottom: 1, height: 1 }, scene);
    cylinder.position = new Vector3(1, 1, 1);
    cylinder.material = cylinderMaterial;

    const sphereMaterial = new StandardMaterial("sphere-mat", scene);
    sphereMaterial.diffuseColor = Color3.FromHexString(labColors.green);
    sphereMaterial.specularColor = Color3.Black();

    const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);
    sphere.position = new Vector3(-1, 1.5, 0.5);
    sphere.material = sphereMaterial;

    const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 8, subject.position, scene);
    camera.wheelDeltaPercentage = 0.01;
    camera.upperBetaLimit = Math.PI / 1.5;
    camera.lowerRadiusLimit = 2;
    camera.upperRadiusLimit = 20;
    camera.attachControl(bjsCanvas, true);

    // watch for changes in cameraMode
    watch(cameraMode, (newValue) => {
      if (newValue == "perspective") {
        camera.mode = Camera.PERSPECTIVE_CAMERA;
        if (!camera.inputs.attached.mousewheel) {
          camera.inputs.addMouseWheel();
        }
        console.log("Camera mode is perspective");
      } else {
        camera.mode = Camera.ORTHOGRAPHIC_CAMERA;
        camera.inputs.removeByType("ArcRotateCameraMouseWheelInput");
        console.log("Camera mode is orthographic");

        // adjust ortho size based on current engine size
        adjustOrthoSize(camera, engine, cameraOrthoSize.value);
      }
    });

    createOverlay(scene);
  };

  // Calculate the ortho size based on current engine size
  const adjustOrthoSize = (camera: Camera, engine: Engine, value: number) => {
    camera.orthoTop = engine.getRenderHeight() / value / 10;
    camera.orthoBottom = -(engine.getRenderHeight() / value / 10);
    camera.orthoLeft = -(engine.getRenderWidth() / value / 10);
    camera.orthoRight = engine.getRenderWidth() / value / 10;
  };

  const createOverlay = (scene: Scene) => {
    const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("lab-overlay", true, scene);

    const button1 = Button.CreateSimpleButton("button1", "Ortho Mode");
    button1.top = window.innerHeight / 2 - 60 + "px";
    button1.left = "100px";
    button1.width = "200px";
    button1.height = "40px";
    button1.color = "white";
    button1.background = labColors.slate6;
    button1.onPointerClickObservable.add(() => {
      console.log("button1 clicked");
      cameraMode.value = "orthographic";
    });
    advancedTexture.addControl(button1);

    const button2 = Button.CreateSimpleButton("button2", "Perspective Mode");
    button2.top = window.innerHeight / 2 - 60 + "px";
    button2.left = "-100px";
    button2.width = "200px";
    button2.height = "40px";
    button2.color = "white";
    button2.background = labColors.purple;
    button2.onPointerClickObservable.add(() => {
      console.log("button2 clicked");
      cameraMode.value = "perspective";
    });

    advancedTexture.addControl(button2);

    watch(cameraMode, (value) => {
      if (value === "orthographic") {
        button1.background = labColors.purple;
        button2.background = labColors.slate6;
      } else {
        button1.background = labColors.slate6;
        button2.background = labColors.purple;
      }
    });
  };

  const labSceneOptions = {
    useCamera: false,
    useLight: true,
    useRoom: false,
    useWebXRPlayer: false,
    useOverlay: false
  };

  const bjsCanvas = ref(null);

  useCanvatoriumScene(bjsCanvas, createLabContent, labSceneOptions);
</script>
<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
