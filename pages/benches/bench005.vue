<script lang="ts" setup>
  import { Engine, Scene, ArcRotateCamera, Camera, Vector3, Color3, MeshBuilder, StandardMaterial } from "@babylonjs/core";
  import { AdvancedDynamicTexture, StackPanel, Control, Button } from "@babylonjs/gui";

  definePageMeta({
    featured: false,
    title: "Bench 005 – Orthographic Camera Damping",
    description: "",
    labNotes: ``
  });

  let handleScroll: EventListenerOrEventListenerObject;
  const cameraOrthoSize = ref(10);
  let targetTop = 0;
  let targetBottom = 0;
  let targetLeft = 0;
  let targetRight = 0;

  const cameraMode = ref("orthographic");

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
    camera.mode = Camera.ORTHOGRAPHIC_CAMERA;
    adjustOrthoSize(camera, engine, cameraOrthoSize.value);
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

    watch(cameraOrthoSize, (newValue) => {
      nextTick(() => {
        if (newValue) {
          //   console.log("Ortho size changed", newValue);
          if (camera.mode == Camera.ORTHOGRAPHIC_CAMERA) {
            adjustOrthoSize(camera, engine, newValue);
          }
        }
      });
    });

    createOverlay(scene);

    // https://playground.babylonjs.com/#9UNE5Z#15
    scene.onBeforeRenderObservable.add(() => {
      if (cameraMode.value != "orthographic") {
        return;
      }
      const speed = 0.1;
      camera!.orthoTop! += (targetTop - camera!.orthoTop!) * speed;
      camera!.orthoBottom! += (targetBottom - camera!.orthoBottom!) * speed;
      camera!.orthoLeft! += (targetLeft - camera!.orthoLeft!) * speed;
      camera!.orthoRight! += (targetRight - camera!.orthoRight!) * speed;
    });
  };

  // Calculate the ortho size based on current engine size
  const adjustOrthoSize = (camera: Camera, engine: Engine, value: number) => {
    console.log("adjustOrthoSize", engine.getRenderHeight() / value / 10);
    targetTop = engine.getRenderHeight() / value / 10;
    targetBottom = -(engine.getRenderHeight() / value / 10);
    targetLeft = -(engine.getRenderWidth() / value / 10);
    targetRight = engine.getRenderWidth() / value / 10;
  };

  const createOverlay = (scene: Scene) => {
    const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("lab-overlay", true, scene);

    const button1 = Button.CreateSimpleButton("button1", "Ortho Mode");
    button1.top = window.innerHeight / 2 - 60 + "px";
    button1.left = "100px";
    button1.width = "200px";
    button1.height = "40px";
    button1.color = "white";
    button1.background = labColors.purple;
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
    button2.background = labColors.slate6;
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

  handleScroll = function (event: Event) {
    if (cameraMode.value == "perspective") {
      return;
    }
    // Cast the event to WheelEvent
    const wheelEvent = event as WheelEvent;

    const dampeningFactor = 0.5;

    // Adjust the scaling factor based on the scroll speed
    const scalingFactor = Math.abs(wheelEvent.deltaY) / 100;
    // console.log("wheel", wheelEvent.deltaY);
    // console.log("scalingFactor", scalingFactor);

    // Adjust the cameraOrthoSize based on the scroll input, the scaling factor, and the dampening factor
    // Note: wheelEvent.deltaY will be positive if scrolling down, negative if scrolling up
    const newCameraOrthoSize = cameraOrthoSize.value - wheelEvent.deltaY * scalingFactor * dampeningFactor;
    // console.log("newCameraOrthoSize", newCameraOrthoSize);

    // Ensure the new value is within the range [1, 100]
    cameraOrthoSize.value = Math.max(5, Math.min(50, newCameraOrthoSize));
  };

  onMounted(() => {
    const canvas = document.getElementById("bjsCanvas");
    if (canvas) {
      canvas.addEventListener("wheel", handleScroll);
    }
  });

  useCanvatoriumScene(bjsCanvas, createLabContent, labSceneOptions);
</script>
<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
