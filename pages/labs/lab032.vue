<script setup>
  import { Vector3, Color3, MeshBuilder, StandardMaterial, PointerDragBehavior, Scalar, Mesh, SixDofDragBehavior } from "babylonjs";
  import { Button, Grid } from "babylonjs-gui";
  import { useStorage } from "@vueuse/core";

  definePageMeta({
    featured: false,
    title: "Lab 032 – Lathe",
    description: "Testing an idea to see if can make a VR interface for the array of Vector3s used by the Lathe tool.",
    labNotes: ``
  });

  // Default settings for the lathe data
  const defaultLatheSettings = {
    numberOfPoints: 10,
    tessellation: 12,
    isFlat: true,
    arc: 1,
    cap: "NO_CAP"
  };

  // Spread the default settings into the stored settings
  // This will only be set if the local storage value is not found, else it will use the local storage value
  let storedLatheSettings = useStorage("lab-lathe-settings", {
    ...defaultLatheSettings
  });

  // Map the stored settings to the reactive settings object
  // I could not find a way to get Watch working with useStorage
  let actualLatheSettings = reactive({
    numberOfPoints: storedLatheSettings.value.numberOfPoints,
    tessellation: storedLatheSettings.value.tessellation,
    isFlat: storedLatheSettings.value.isFlat,
    arc: storedLatheSettings.value.arc,
    cap: storedLatheSettings.value.cap
  });

  watch(actualLatheSettings, (newValue) => {
    storedLatheSettings.value = newValue;
  });

  let grabbersRef;
  let latheMatRef;

  // Add lab-specific content here using the provided 'scene' instance
  const createLabContent = async (scene) => {
    const cam = scene.getCameraByName("camera");
    cam.position = new Vector3(0, 1.4, -3);

    const cardMat = new StandardMaterial("card-mat", scene);
    cardMat.diffuseColor = Color3.FromHexString(labColors.slate2);
    cardMat.alpha = 0.3;

    const cardWidth = 1;
    const cardHeight = 2;
    const cardThickness = 0.01;
    const card = MeshBuilder.CreateBox("card", { width: cardWidth, height: cardHeight, depth: cardThickness }, scene);
    card.isPickable = false;
    card.material = cardMat;
    card.position = new Vector3(0.5, 1, 0);

    // create plane in front of card for bounds checking
    const boundsWidth = 0;
    const boundsHeight = 0;
    const boundsPlane = MeshBuilder.CreatePlane("boundsPlane", { width: cardWidth - boundsWidth, height: cardHeight - boundsHeight }, scene);
    boundsPlane.isPickable = false;
    boundsPlane.position.x = card.position.x;
    boundsPlane.position.y = card.position.y;
    boundsPlane.position.z = -cardThickness / 2;
    boundsPlane.isVisible = false;

    const grabMat = new StandardMaterial("grab-mat6", scene);
    grabMat.diffuseColor = Color3.FromHexString(labColors.purple);
    grabMat.specularColor = new Color3(0.2, 0.2, 0.2);

    const latheMat = new StandardMaterial("grab-mat1", scene);
    latheMat.diffuseColor = Color3.FromHexString(labColors.purple);
    latheMat.specularColor = new Color3(0.2, 0.2, 0.2);
    latheMatRef = latheMat;

    const createGrabbers = () => {
      // dispose of old grabbers
      if (grabbersRef) {
        for (let i = 0; i < grabbersRef.length; i++) {
          grabbersRef[i].dispose();
        }
      }
      let i;
      let grabbers = [];

      for (i = 0; i < actualLatheSettings.numberOfPoints; i++) {
        var planeDragBehavior = new PointerDragBehavior({
          dragPlaneNormal: boundsPlane.forward
        });
        planeDragBehavior.useObjectOrientationForDragging = true;

        planeDragBehavior.validateDrag = (targetPosition) => {
          const bounds = boundsPlane.getBoundingInfo().boundingBox;
          targetPosition.x = Scalar.Clamp(targetPosition.x, bounds.minimum.x + boundsPlane.position.x, bounds.maximum.x + boundsPlane.position.x);
          targetPosition.y = Scalar.Clamp(targetPosition.y, bounds.minimum.y + boundsPlane.position.y, bounds.maximum.y + boundsPlane.position.y);
          return true;
        };
        const grabber = MeshBuilder.CreateSphere("grabber", {
          diameter: 0.05
        });
        const yoffset = i * 0.1;
        grabber.material = grabMat;
        grabber.position = new Vector3(0 + yoffset / 2, 2 - yoffset, 0);
        grabber.addBehavior(planeDragBehavior);
        grabbers.push(grabber);
      }

      grabbersRef = grabbers;

      console.log(grabbers);
    };

    createUICard(scene);
    createGrabbers();

    watch(actualLatheSettings, (newValue) => {
      console.log("actualLatheSettings changed");
      console.log(newValue);
      createGrabbers();
    });
  };

  // If a lab uses the default options, you can just call useBabylonScene() with the bjsCanvas ref and the createLabContent function.
  // Otherwise, you can pass in an options object with the following properties:
  const labSceneOptions = {
    useCamera: true,
    useLight: true,
    useRoom: true
  };

  const bjsCanvas = ref(null);
  // With scene options
  useCanvatoriumScene(bjsCanvas, createLabContent, labSceneOptions);

  const createUICard = (scene) => {
    // Create a window group object
    const windowGroupMesh = canLabWindowGroup(scene);
    windowGroupMesh.scaling = new Vector3(0.1, 0.1, 0.1);
    windowGroupMesh.position = new Vector3(1.5, 1.1, -0.2);
    windowGroupMesh.rotation = new Vector3(0, 0.4, 0);

    const cardMaterial = new StandardMaterial("menu-card-material", scene);
    cardMaterial.diffuseColor = new Color3.FromHexString(labColors.slate1);

    const { plane, advancedTexture } = canLabCardSimple(9, 5.4, scene);
    advancedTexture.name = "menu-texture";

    plane.parent = windowGroupMesh;
    plane.position.y = 3;

    const numberOfPointsLabel = createGridMenuLabel(`Number of points: ${actualLatheSettings.numberOfPoints}`);
    const numberOfPointsSlider = createGridMenuSlider({
      min: 0.1,
      max: 24,
      step: 1,
      value: 6
    });
    numberOfPointsSlider.value = actualLatheSettings.numberOfPoints;
    numberOfPointsSlider.onValueChangedObservable.add(function (value) {
      actualLatheSettings.numberOfPoints = value;
      numberOfPointsLabel.text = `Number of points: ${value}`;
    });

    const tessellationLabel = createGridMenuLabel(`Tessellation: ${actualLatheSettings.tessellation}`);
    const tessellationSlider = createGridMenuSlider({
      min: 6,
      max: 46,
      step: 1,
      value: 12
    });
    tessellationSlider.value = actualLatheSettings.tessellation;
    tessellationSlider.onValueChangedObservable.add(function (value) {
      actualLatheSettings.tessellation = value;
      tessellationLabel.text = `Tessellation: ${value}`;
    });

    const isFlatLabel = createGridMenuLabel("Is Flat Shaded?");
    const isFlatToggle = createGridMenuCheckbox();
    isFlatToggle.isChecked = actualLatheSettings.isFlat;
    isFlatToggle.onIsCheckedChangedObservable.add(function (value) {
      actualLatheSettings.isFlat = value;
    });

    const arcLabel = createGridMenuLabel(`Arc: ${actualLatheSettings.arc.toFixed(2)}`);
    const arcSlider = createGridMenuSlider({
      min: 0.1,
      max: 1,
      step: 0.1,
      value: 1
    });
    arcSlider.value = actualLatheSettings.arc;
    arcSlider.onValueChangedObservable.add(function (value) {
      actualLatheSettings.arc = value;
      arcLabel.text = `Rotation Speed: ${value.toFixed(2)}`;
    });

    const resetButton = canLabButtonSimple("reset-button", "Reset Settings");
    resetButton.width = 1;
    resetButton.height = "72px";
    resetButton.fontSize = "40px";
    resetButton.color = "white";
    resetButton.background = labColors.red;

    resetButton.onPointerUpObservable.add(function () {
      scene.getMeshByName("lathe")?.dispose();
      actualLatheSettings.numberOfPoints = 0;
      actualLatheSettings.numberOfPoints = 10;
      actualLatheSettings.tessellation = 12;
      actualLatheSettings.isFlat = true;
      actualLatheSettings.arc = 1;

      numberOfPointsSlider.value = actualLatheSettings.numberOfPoints;
      tessellationSlider.value = actualLatheSettings.tessellation;
      isFlatToggle.isChecked = actualLatheSettings.isFlat;
      arcSlider.value = actualLatheSettings.arc;
    });

    const buildButton = canLabButtonSimple("build-button", "Build Shape");
    buildButton.height = "72px";
    buildButton.width = 1;
    buildButton.fontSize = "40px";
    buildButton.background = labColors.green;
    buildButton.color = "white";

    buildButton.onPointerUpObservable.add(function () {
      buildLathe(scene);
    });

    const grid = new Grid();
    grid.addColumnDefinition(40, true);
    grid.addColumnDefinition(0.5);
    grid.addColumnDefinition(0.5);
    grid.addColumnDefinition(40, true);

    // Layout the grid content
    // Add rows to the grid and attach controls to the rows, using the current row count.
    // This makes it easy to reorder these in code without having to reindex the grid content.
    grid.addRowDefinition(36, true); // empty row
    grid.addRowDefinition(72, true).addControl(numberOfPointsLabel, grid.rowCount, 1).addControl(numberOfPointsSlider, grid.rowCount, 2);
    grid.addRowDefinition(72, true).addControl(tessellationLabel, grid.rowCount, 1).addControl(tessellationSlider, grid.rowCount, 2);
    grid.addRowDefinition(72, true).addControl(isFlatLabel, grid.rowCount, 1).addControl(isFlatToggle, grid.rowCount, 2);
    grid.addRowDefinition(72, true).addControl(arcLabel, grid.rowCount, 1).addControl(arcSlider, grid.rowCount, 2);

    grid.addRowDefinition(36, true); // empty row
    grid.addRowDefinition(84, true).addControl(resetButton, grid.rowCount, 2);
    grid.addRowDefinition(84, true).addControl(buildButton, grid.rowCount, 2);

    advancedTexture.addControl(grid);

    return;
  };

  const buildLathe = (scene) => {
    scene.getMeshByName("lathe")?.dispose();
    let latheArray = [];
    for (let i = 0; i < grabbersRef.length; i++) {
      latheArray.push(grabbersRef[i].position);
    }

    const lathe = MeshBuilder.CreateLathe("lathe", {
      shape: latheArray,
      sideOrientation: Mesh.DOUBLESIDE,
      tessellation: actualLatheSettings.tessellation,
      arc: actualLatheSettings.arc,
      cap: actualLatheSettings.cap
    });
    lathe.material = latheMatRef;
    // lathe.visibility = 0.6;
    // lathe.closed = true;
    if (actualLatheSettings.isFlat) {
      lathe.convertToFlatShadedMesh();
    }

    const sixDofDragBehavior = new SixDofDragBehavior();
    sixDofDragBehavior.allowMultiPointers = true;
    lathe.addBehavior(sixDofDragBehavior);
  };

  // Without scene options (see lab001 for an example)
  // useCanvatoriumScene(bjsCanvas, createLabContent);
</script>
<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
