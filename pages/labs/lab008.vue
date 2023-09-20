<script lang="ts" setup>
  import { Scene, AbstractMesh, Vector3 } from "babylonjs";
  import { GUI3DManager, NearMenu, TouchHolographicButton, ScrollViewer, TextBlock, Control } from "babylonjs-gui";

  definePageMeta({
    featured: true,
    title: "Lab 008 - Near Menu",
    description: "Revamped version of Lab 008, using the new NearMenu control. I'm still not fond of this control.",
    labNotes: ``
  });

  const createLabContent = async (scene: Scene, xrPromise: any) => {
    const cam = scene.getCameraByName("camera");
    if (cam) {
      cam.position = new Vector3(0, 1, -1);
    }

    // Create the 3D UI manager
    const anchor = new AbstractMesh("anchor", scene);
    const manager = new GUI3DManager(scene);

    console.log("3D GUI:", manager, anchor);

    var near = new NearMenu("near");
    manager.addControl(near);
    // manager.useRealisticScaling = true;
    manager.controlScaling = 0.06;

    var button0 = new TouchHolographicButton("button0");
    button0.text = "Oculus";
    button0.onPointerClickObservable.add(() => {
      console.log("Meta Quest 3", "Oculus was a way better name...");
    });
    console.log("Button0", button0);
    near.addButton(button0);

    var button1 = new TouchHolographicButton("button1");
    button1.text = "Vision";
    button1.onPointerClickObservable.add(() => {
      console.log("Apple Vision Pro", "Silly name, but take my money!");
    });

    near.addButton(button1);

    var button2 = new TouchHolographicButton("button2");
    button2.text = "Vive";
    button2.onPointerClickObservable.add(() => {
      console.log("HTC Vive", "Lol what every happend to them?");
    });
    near.addButton(button2);

    console.log("Near Menu:", near);
    near.defaultBehavior.followBehavior.defaultDistance = 0.25;
    near.defaultBehavior.followBehavior.minimumDistance = 0.2;
    near.defaultBehavior.followBehavior.maximumDistance = 0.75;
    near.defaultBehavior.followBehavior.pitchOffset = -35;
    console.log("Near ", near.mesh);

    createLabConsoleCard(scene);

    customizeXRForLab(xrPromise);
  };

  const createLabConsoleCard = (scene: Scene) => {
    // Reactive variable to hold the console log data
    let conLogData = reactive([] as Array<string>);

    // Override console.log()
    const overrideConsole = () => {
      // Save the original method in a private variable
      let _privateLog = console.log;

      // Redefine console.log method with a custom function
      console.log = function (...args) {
        const logString = args.map((arg) => arg.toString()).join(" | "); // Change the separator as needed

        conLogData.push(logString);
        _privateLog.apply(console, args);
      };
    };

    // call once to override console.log()
    overrideConsole();

    console.log("Lab 008 - Near Interactions");
    console.log("");

    const width = 6;
    const height = 3.6;
    const { plane, advancedTexture } = canLabCardSimple(width, height, scene);
    plane.name = "can-plane";
    plane.position = new Vector3(0, 1, 0);
    plane.scaling = new Vector3(0.3, 0.3, 0.3);
    advancedTexture.name = "logger-texture";

    const scrollViewer = new ScrollViewer("logger-scroll");
    scrollViewer.thickness = 0;
    scrollViewer.width = `${1024 * (width / 10) - 30}px`;
    scrollViewer.height = `${1024 * (height / 10) - 60}px`;
    scrollViewer.barSize = 10;
    scrollViewer.top = 30;
    scrollViewer.barColor = labColors.slate7;
    scrollViewer.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    advancedTexture.addControl(scrollViewer);

    const loggerText = new TextBlock("logger-text");
    loggerText.textWrapping = true;
    loggerText.fontFamily = "Verdana";
    loggerText.width = 1;
    loggerText.height = 3;
    loggerText.paddingTop = "5%";
    loggerText.paddingLeft = "20px";
    loggerText.paddingRight = "20px";
    loggerText.paddingBottom = "5%";
    loggerText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    loggerText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    loggerText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    loggerText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    loggerText.color = labColors.slate8;
    loggerText.fontSize = "14px";

    scrollViewer.addControl(loggerText);

    // Watch the reactive variable and update the text in the scroll view
    watch(conLogData, (newValue) => {
      const logData = [...newValue];
      if (scrollViewer && loggerText) {
        loggerText.text = logData.join("\n");
        loggerText.resizeToFit = true;
        scrollViewer.verticalBar.value = 1;
      }
    });

    return plane;
  };

  async function customizeXRForLab(xrPromise: any) {
    const xr = await xrPromise;

    console.log("Lab 008 applying customizations to the XR experience.");
    console.log("");

    xr.baseExperience.featuresManager.enableFeature(BABYLON.WebXRFeatureName.HAND_TRACKING, "latest", {
      xrInput: xr.input,

      jointMeshes: {
        // enablePhysics: true
      }
    });
  }

  const labSceneOptions = {
    useCamera: true,
    useLight: true,
    useRoom: true,
    useOverlay: true
  };

  const bjsCanvas = ref(null);
  // With scene options
  useCanvatoriumScene(bjsCanvas, createLabContent, labSceneOptions);
</script>

<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
