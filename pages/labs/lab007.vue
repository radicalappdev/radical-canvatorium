<script setup>
  import { MeshBuilder, Vector3, StandardMaterial, Color3 } from "babylonjs";
  import { AdvancedDynamicTexture, StackPanel, ScrollViewer, TextBlock, Control } from "babylonjs-gui";

  definePageMeta({
    featured: true,
    title: "Lab 007 - Console... Log(?)",
    description: "Explore the idea of overriding console.log() so I can view the log in VR",
    labNotes: `Explore the idea of overriding console.log() so I can view the log in VR
- This is just a proof-of-concept, not a full-fledged solution
- Override console.log() and stash the message in a reactive variable
- watch the variable and display the message in VR by updating the text in a scroll view`
  });

  const createLabContent = async (scene) => {
    // MeshBuilder.CreateBox("box", { size: 1 }, scene).position.y = 0.5;

    scene.getCameraByName("camera").position = new BABYLON.Vector3(0, 1, -2);

    let conLogData = reactive([]);

    // A reference to the BJS GUI Scroll Viewer, too lazy to query this in the graph...
    let scrollViewer;

    // A reference to the BJS GUI TextBlock, too lazy to query this in the graph...
    let loggerText;

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
    overrideConsole();

    const card = MeshBuilder.CreateBox("console-card", {
      height: 2.1,
      width: 3.1,
      depth: 0.2
    });
    // card.position = new BABYLON.Vector3(-1, 1, 1);
    card.position = new Vector3(0, 1, 0);
    card.scaling = new Vector3(0.5, 0.5, 0.5);
    const cardMaterial = new StandardMaterial("card-material", scene);
    // cardMaterial.diffuseColor = labColors.labBlue;
    cardMaterial.specularColor = new Color3(0.2, 0.2, 0.2);
    card.material = cardMaterial;

    const plane = MeshBuilder.CreatePlane("console-plane", { height: 2, width: 3 }, scene);
    plane.position.z = -0.11;
    plane.parent = card;

    const advancedTexture = AdvancedDynamicTexture.CreateForMesh(plane, 3 * 1024, 2 * 1024);
    advancedTexture.name = "logger-texture";

    var panel = new StackPanel();
    advancedTexture.addControl(panel);

    var sv = new ScrollViewer("logger-scroll");
    scrollViewer = sv;
    sv.thickness = 48;
    sv.color = "#3e4a5d";
    sv.background = "#3e4a5d";
    sv.opacity = 1;
    sv.width = `${3 * 1024}px`;
    sv.height = `${2 * 1024 - 128}px`;
    sv.barSize = 60;
    sv.barColor = "#53637b";
    sv.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;

    panel.addControl(sv);

    var tb = new TextBlock("logger-text");
    loggerText = tb;
    tb.textWrapping = true;

    tb.width = 1;
    tb.height = 3;
    tb.paddingTop = "1%";
    tb.paddingLeft = "30px";
    tb.paddingRight = "20px";
    tb.paddingBottom = "1%";
    tb.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    tb.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    tb.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    tb.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    tb.color = "#d3d9e1";
    tb.fontSize = "96px";

    sv.addControl(tb);

    console.log("WebXR Console Logging in Babylon JS");
    console.log("Wow");
    console.log("I know, right?");

    watch(conLogData, (newValue) => {
      const logData = [...newValue];
      if (scrollViewer && loggerText) {
        loggerText.text = logData.join("\n");
        loggerText.resizeToFit = true;
        scrollViewer.verticalBar.value = 1;
      }
    });
  };

  const bjsCanvas = ref(null);
  useCanvatoriumScene(bjsCanvas, createLabContent);
</script>

<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
