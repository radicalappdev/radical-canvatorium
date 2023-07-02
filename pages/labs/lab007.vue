<script setup>
  import { MeshBuilder, Vector3, StandardMaterial, Color3 } from "babylonjs";
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

  const createLabContent = async (scene, xrPromise) => {
    scene.getCameraByName("camera").position = new BABYLON.Vector3(0, 1, -2);

    console.log("Only logs after this point will be displayed in VR. This one won't.");

    createLabConsoleCard(scene);

    customizeXRForLab(xrPromise);
  };

  const createLabConsoleCard = (scene) => {
    // Reactive variable to hold the console log data
    let conLogData = reactive([]);

    // Override console.log()
    // Adapted from https://ourcodeworld.com/articles/read/104/how-to-override-the-console-methods-in-javascript
    const overrideConsole = () => {
      // Save the original method in a private variable
      let _privateLog = console.log;
      // Redefine console.log method with a custom function
      console.log = function (message) {
        conLogData.push(message.toString());
        _privateLog.apply(console, arguments);
      };
    };
    overrideConsole(); // call once to override console.log()

    console.log("Lab 007 - Console logging in VR with Babylon JS");
    console.log("");

    const card = MeshBuilder.CreateBox("console-card", {
      height: 2.1,
      width: 3.1,
      depth: 0.2
    });
    card.position = new Vector3(0, 1, 0);
    card.scaling = new Vector3(0.5, 0.5, 0.5);

    const cardMaterial = new StandardMaterial("card-material", scene);
    cardMaterial.diffuseColor = new Color3.FromHexString(labColors.slate5);
    card.material = cardMaterial;

    const plane = MeshBuilder.CreatePlane("console-plane", { height: 2, width: 3 }, scene);
    plane.position.z = -0.11;
    plane.parent = card;

    const advancedTexture = AdvancedDynamicTexture.CreateForMesh(plane, 3 * 1024, 2 * 1024);
    advancedTexture.name = "logger-texture";

    const panel = new StackPanel();
    advancedTexture.addControl(panel);

    const scrollViewer = new ScrollViewer("logger-scroll");
    scrollViewer.thickness = 48;
    scrollViewer.color = labColors.slate3;
    scrollViewer.background = labColors.slate3;
    scrollViewer.opacity = 1;
    scrollViewer.width = `${3 * 1024}px`;
    scrollViewer.height = `${2 * 1024 - 32}px`;
    scrollViewer.barSize = 60;
    scrollViewer.barColor = labColors.slate7;
    scrollViewer.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    panel.addControl(scrollViewer);

    const loggerText = new TextBlock("logger-text");
    loggerText.textWrapping = true;
    loggerText.width = 1;
    loggerText.height = 3;
    loggerText.paddingTop = "1%";
    loggerText.paddingLeft = "30px";
    loggerText.paddingRight = "20px";
    loggerText.paddingBottom = "1%";
    loggerText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    loggerText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    loggerText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    loggerText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    loggerText.color = labColors.slate8;
    loggerText.fontSize = "96px";

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

    return card;
  };

  async function customizeXRForLab(xrPromise) {
    const xr = await xrPromise;

    console.log("Lab 007 applying customizations to the XR experience.");
    console.log("");
    console.log("Enter immersive mode and press any of these buttons to see the console log in VR");
    console.log(" • X and Y buttons on the left controller");
    console.log(" • A and B buttons on the right controller");
    console.log("");

    xr.input.onControllerAddedObservable.add((controller) => {
      controller.onMotionControllerInitObservable.add((motionController) => {
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
    useOverlay: false
  };

  const bjsCanvas = ref(null);
  // With scene options
  useCanvatoriumScene(bjsCanvas, createLabContent, labSceneOptions);

  //   const bjsCanvas = ref(null);
  //   useCanvatoriumScene(bjsCanvas, createLabContent);
</script>

<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
