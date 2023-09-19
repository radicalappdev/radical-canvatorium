<script lang="ts" setup>
  import { Scene, Vector3, StandardMaterial, Color3 } from "babylonjs";
  import { AdvancedDynamicTexture, StackPanel, ScrollViewer, TextBlock, Control } from "babylonjs-gui";

  definePageMeta({
    featured: true,
    title: "Lab 007 - Console logging in VR",
    description: "Explore the idea of overriding console.log() so I can view the log in VR",
    labNotes: `Explore the idea of overriding console.log() so I can view the log in VR
- This is just a proof-of-concept, not a full-fledged solution
- Override console.log() and stash the message in a reactive variable
- Watch the variable and display the message in VR by updating the text in a scroll view
- Limited to simple strings, no objects or arrays`
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
    let conLogData = reactive([]);

    // Override console.log()
    const overrideConsole = () => {
      // Save the original method in a private variable
      let _privateLog = console.log;

      // Redefine console.log method with a custom function
      console.log = function (...args) {
        conLogData.push(...args.map((arg) => arg.toString() as never));
        _privateLog.apply(console, args);
      };
    };

    // call once to override console.log()
    overrideConsole();

    console.log("Lab 007 - Console logging in VR with Babylon JS");
    console.log("");
    console.log("test", "another arg");

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

    console.log("Lab 007 applying customizations to the XR experience.");
    console.log("");
    console.log("Enter immersive mode and press any of these buttons to see the console log in VR");
    console.log(" • X and Y buttons on the left controller");
    console.log(" • A and B buttons on the right controller");
    console.log("");

    xr.input.onControllerAddedObservable.add((controller: { onMotionControllerInitObservable: { add: (arg0: (motionController: any) => void) => void } }) => {
      controller.onMotionControllerInitObservable.add((motionController: { handness: string; getComponentIds: () => any; getComponent: (arg0: any) => any }) => {
        if (motionController.handness === "left") {
          const xr_ids = motionController.getComponentIds();

          let xButton = motionController.getComponent(xr_ids[3]);
          xButton.onButtonStateChangedObservable.add(() => {
            if (xButton.pressed) {
              console.log("X button pressed");
            }
          });

          let yButton = motionController.getComponent(xr_ids[4]);
          yButton.onButtonStateChangedObservable.add(() => {
            if (yButton.pressed) {
              console.log("Y button pressed");
            }
          });
        }
        if (motionController.handness === "right") {
          const xr_ids = motionController.getComponentIds();

          let aButton = motionController.getComponent(xr_ids[3]);
          aButton.onButtonStateChangedObservable.add(() => {
            if (aButton.pressed) {
              console.log("A button pressed");
            }
          });

          let bButton = motionController.getComponent(xr_ids[4]);
          bButton.onButtonStateChangedObservable.add(() => {
            if (bButton.pressed) {
              console.log("B button pressed");
            }
          });
        }
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
