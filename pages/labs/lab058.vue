<script lang="ts" setup>
  import { Scene, Vector3 } from "@babylonjs/core";
  import { ScrollViewer, TextBlock, Control } from "@babylonjs/gui";

  definePageMeta({
    featured: true,
    title: "Lab 058 - MX Ink Demos",
    description: "Playing with the MX Ink virtual stylus",
    labNotes: ``
  });

  const createLabContent = async (scene: Scene, xrPromise: any) => {
    const cam = scene.getCameraByName("camera");
    if (cam) {
      cam.position = new Vector3(0, 1, -1);
    }

    console.log("Only logs after this point will be displayed in VR. This one won't.");

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

    console.log("Lab 058 - MX Ink Demos");
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
