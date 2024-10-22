<script lang="ts" setup>
  import { ActionManager, Color3, ExecuteCodeAction, Mesh, MeshBuilder, Scene, StandardMaterial, Vector3, WebXRFeatureName, WebXRSessionManager } from "@babylonjs/core";
  import { ScrollViewer, TextBlock, Control, StackPanel } from "@babylonjs/gui";

  definePageMeta({
    featured: true,
    title: "Lab 058 - MX Ink Demos",
    description: "Playing with the MX Ink virtual stylus",
    labNotes: ``
  });

  const createLabContent = async (scene: Scene, xrPromise: any) => {
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
    const cardLogger = createLabConsoleCard(scene);
    group.addChild(cardLogger);

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

    console.log("Lab 058 - MX Ink Demos");
    console.log("");

    const width = 6;
    const height = 3.6;
    const { plane, advancedTexture } = canLabCardSimple(width, height, scene);
    plane.name = "card-logger";
    plane.position = new Vector3(-1, 2.6, 0);
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

    console.log("scrollViewer", scrollViewer.width, scrollViewer.height);

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
    loggerText.fontSize = "12px";

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
    console.log("Enter immersive mode and press any of the buttons to see the console log in VR");
    console.log("");

    xr.input.onControllerAddedObservable.add((controller: { onMotionControllerInitObservable: { add: (arg0: (motionController: any) => void) => void } }) => {
      controller.onMotionControllerInitObservable.add((motionController: { handness: string; getComponentIds: () => any; getComponent: (arg0: any) => any }) => {
        const xr_ids = motionController.getComponentIds();

        let button1 = motionController.getComponent(xr_ids[1]);
        button1.onButtonStateChangedObservable.add(() => {
          if (button1.pressed) {
            console.log("1 button pressed");
          }
        });

        let button2 = motionController.getComponent(xr_ids[2]);
        button2.onButtonStateChangedObservable.add(() => {
          if (button2.pressed) {
            console.log("2 button pressed");
          }
        });

        let button3 = motionController.getComponent(xr_ids[2]);
        button3.onButtonStateChangedObservable.add(() => {
          if (button3.pressed) {
            console.log("3 button pressed");
          }
        });

        let button4 = motionController.getComponent(xr_ids[2]);
        button4.onButtonStateChangedObservable.add(() => {
          if (button4.pressed) {
            console.log("4 button pressed");
          }
        });

        console.log("Unknown: ", motionController.getComponentIds());
      });
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
