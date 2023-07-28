<script setup>
  import * as earcut from "earcut";
  import { Vector3, MeshBuilder, DirectionalLight, StandardMaterial, Color3, ArcRotateCamera } from "babylonjs";
  import { SkyMaterial, CellMaterial, GridMaterial } from "babylonjs-materials";
  //   import { TextBlock } from "babylonjs-gui";

  // Fonts from https://www.kenney.nl/assets/kenney-fonts
  // Converted with http://gero3.github.io/facetype.js/

  console.log(earcut);

  definePageMeta({
    featured: false,
    title: "3D Graphics is my Passion",
    description: "lol"
  });

  // Add lab-specific content here using the provided 'scene' instance
  const createLabContent = async (scene) => {
    const animateIntro = true;
    ArcRotateCamera.prototype.spinTo = function (whichprop, targetval, speed) {
      var ease = new BABYLON.CubicEase();
      ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
      BABYLON.Animation.CreateAndStartAnimation("at4", this, whichprop, speed, 120, this[whichprop], targetval, 0, ease);
    };
    // Lab 001 only. Move the camera to a better position for the initial scene.
    const camera = scene.getCameraByName("camera");

    // const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new Vector3(0, 0, 0), scene);
    camera.wheelDeltaPercentage = 0.01;
    camera.upperBetaLimit = Math.PI / 1.5;
    camera.lowerRadiusLimit = 2;
    camera.upperRadiusLimit = 128;
    // camera.setPosition(new Vector3(-30, 12, 85));
    camera.setPosition(new BABYLON.Vector3(0, 3.5, -6));
    camera.setTarget(new Vector3(0, 1, 24));

    if (animateIntro) {
      setTimeout(() => camera.spinTo("radius", 12, 20), 2000);
      setTimeout(() => camera.spinTo("beta", 1.2, 20), 4000);
      setTimeout(() => camera.spinTo("alpha", Math.PI / 2, 34), 5500);
      setTimeout(() => camera.spinTo("radius", 36, 16), 7000);
      setTimeout(() => camera.spinTo("alpha", 1, 10), 9000);
    }

    var sunPos = new Vector3(-100, 15, -100);

    var skyMaterial = new SkyMaterial("skyMaterial", scene);
    skyMaterial.backFaceCulling = false;
    skyMaterial.turbidity = 0.3;
    skyMaterial.luminance = 0.25;
    skyMaterial.useSunPosition = true; // Do not set sun position from azimuth and inclination
    skyMaterial.sunPosition = sunPos;
    skyMaterial.cameraOffset.y = 200;

    var skybox = MeshBuilder.CreateBox("skyBox", { size: 2000 }, scene);
    skybox.material = skyMaterial;

    const daylight = new DirectionalLight("daylight", new BABYLON.Vector3(sunPos.x - sunPos.x * 2, sunPos.y, sunPos.z - sunPos.z * 2), scene);
    daylight.intensity = 0.5;

    const groundGridMaterial = new GridMaterial("ground-mat", scene);
    groundGridMaterial.majorUnitFrequency = 1;
    groundGridMaterial.gridRatio = 2;
    groundGridMaterial.backFaceCulling = false;
    groundGridMaterial.mainColor = labColors.slate2;
    groundGridMaterial.lineColor = labColors.slate2;
    groundGridMaterial.opacity = 0.2;

    const groundMaterial = new CellMaterial("ground-mat", scene);
    groundMaterial.diffuseColor = new Color3.FromHexString(labColors.green);
    groundMaterial.computeHighLevel = true;

    const ground = BABYLON.MeshBuilder.CreateDisc(
      "ground",
      {
        radius: 64
      },
      scene
    );
    ground.rotation = new Vector3(Math.PI / 2, 0, 0);
    ground.position = new Vector3(0, -0.5, 24);
    ground.material = groundMaterial;

    const groundGrid = ground.clone("ground-grid");
    groundGrid.material = groundGridMaterial;
    groundGrid.position = new Vector3(0, -0.495, 24);

    var fontBlocks = await (await fetch("../../assets/3d-fonts/Kenney_Blocks_Regular.json")).json();
    var fontFuture = await (await fetch("../../assets/3d-fonts/Kenney_Future_Regular.json")).json();

    var myText = MeshBuilder.CreateText(
      "myText",
      "3D Graphics",
      fontFuture,
      {
        size: 16,
        resolution: 64,
        depth: 10
      },
      scene,
      earcut
    );
    console.log(myText);
    myText.scaling = new Vector3(0.1, 0.1, 0.1);
    myText.position = new Vector3(-6, 15, 10);
    myText.rotation = new Vector3(0, Math.PI / -5, 0);

    createBase(scene);
    createRoof(scene);
    createCeilingBlock(scene);
    createCeiling(scene);
    createRails(scene);
    createCorners(scene);
    createWallsInside(scene);
    createWallsOutside(scene);

    const columnDoric = createColumnDoric(scene);
    columnDoric.position = new BABYLON.Vector3(-16.15, 0, 0);
    columnFactory(columnDoric);
  };

  // If a lab uses the default options, you can just call useBabylonScene() with the bjsCanvas ref and the createLabContent function.
  // Otherwise, you can pass in an options object with the following properties:
  const labSceneOptions = {
    useCamera: true,
    useLight: true,
    useRoom: false
  };

  const bjsCanvas = ref(null);
  // With scene options
  useCanvatoriumScene(bjsCanvas, createLabContent, labSceneOptions);

  const createBase = (scene) => {
    const blockMat = new BABYLON.StandardMaterial("base-mat", scene);

    const floor = BABYLON.MeshBuilder.CreateBox("floor", { height: 0.2, width: 36.5, depth: 15 }, scene);
    floor.material = blockMat;
    floor.position = new BABYLON.Vector3(0, 0, -7);

    const step1 = BABYLON.MeshBuilder.CreateBox("step1", { height: 0.2, width: 37.3, depth: 15.8 }, scene);
    step1.material = blockMat;
    step1.position = new BABYLON.Vector3(0, -0.2, -7);

    const step2 = BABYLON.MeshBuilder.CreateBox("step2", { height: 0.2, width: 38.1, depth: 16.6 }, scene);
    step2.material = blockMat;
    step2.position = new BABYLON.Vector3(0, -0.4, -7);

    return [floor, step1, step2];
  };

  const createRoof = (scene) => {
    const blockMat = new BABYLON.StandardMaterial("base-mat", scene);

    const roofCap1 = BABYLON.MeshBuilder.CreateCylinder("roofCap1", {
      tessellation: 3
    });
    roofCap1.convertToFlatShadedMesh();
    roofCap1.rotation = new BABYLON.Vector3(0, 0, Math.PI / 2);
    roofCap1.scaling = new BABYLON.Vector3(3, 0.5, 17);
    roofCap1.position = new BABYLON.Vector3(-17.6, 7.85, -7);
    roofCap1.material = blockMat;

    const roofCap2 = roofCap1.clone("roofCap2");
    roofCap2.position = new BABYLON.Vector3(17.6, 7.85, -7);

    const roofCenterMat = new BABYLON.StandardMaterial("base-mat", scene);

    const roofCenter = BABYLON.MeshBuilder.CreateCylinder("roofCenter", {
      tessellation: 3
    });
    roofCenter.convertToFlatShadedMesh();
    roofCenter.rotation = new BABYLON.Vector3(0, 0, Math.PI / 2);
    roofCenter.scaling = new BABYLON.Vector3(3, 17.4, 17);
    roofCenter.position = new BABYLON.Vector3(0, 7.8, -7);
    roofCenter.material = roofCenterMat;
  };

  const createCeilingBlock = (scene) => {
    const blockMat = new BABYLON.StandardMaterial("ceiling-mat", scene);

    const ceiling = BABYLON.MeshBuilder.CreateBox("ceiling", { height: 1.1, width: 36.5, depth: 15 }, scene);
    ceiling.material = blockMat;
    ceiling.position = new BABYLON.Vector3(0, 6.55, -7);
  };

  const createCeiling = (scene) => {
    const blockMat = new BABYLON.StandardMaterial("ceiling-mat", scene);

    const ceilingPlane = BABYLON.MeshBuilder.CreatePlane("ceiling-plane", { width: 36.2, height: 14 }, scene);
    ceilingPlane.material = blockMat;
    ceilingPlane.position = new BABYLON.Vector3(0, 5.9, -7);
    ceilingPlane.rotation = new BABYLON.Vector3(-Math.PI / 2, 0, 0);
  };

  const createRails = (scene) => {
    const railMat = new BABYLON.StandardMaterial("rail-mat", scene);

    const rail1 = BABYLON.MeshBuilder.CreateBox("rail", { height: 0.6, width: 36.3, depth: 0.8 }, scene);
    rail1.material = railMat;
    rail1.position = new BABYLON.Vector3(0, 5.76, 0);

    const rail2 = rail1.clone();
    rail2.position = new BABYLON.Vector3(0, 5.76, -14);

    const rail3 = BABYLON.MeshBuilder.CreateBox("rail", { height: 0.56, width: 0.75, depth: 14 }, scene);
    rail3.material = railMat;
    rail3.position = new BABYLON.Vector3(17.75, 5.76, -7);

    const rail4 = rail3.clone();
    rail4.position = new BABYLON.Vector3(-17.75, 5.76, -7);
  };

  const createCorners = (scene) => {
    const cornerMat = new BABYLON.StandardMaterial("corner-mat", scene);

    const corner1 = BABYLON.MeshBuilder.CreateBox("corner1", { height: 7, width: 0.82, depth: 0.82 }, scene);
    corner1.material = cornerMat;
    corner1.position = new BABYLON.Vector3(17.75, 3.5, 0);

    const corner2 = corner1.clone();
    corner2.position = new BABYLON.Vector3(-17.75, 3.5, 0);

    const corner3 = corner1.clone();
    corner3.position = new BABYLON.Vector3(17.75, 3.5, -14);

    const corner4 = corner1.clone();
    corner4.position = new BABYLON.Vector3(-17.75, 3.5, -14);
  };

  const createWallsInside = (scene) => {
    const wallMat = new BABYLON.StandardMaterial("wall-mat", scene);

    const wall1 = BABYLON.MeshBuilder.CreatePlane("wall1", { height: 6, width: 35 }, scene);
    wall1.position = new BABYLON.Vector3(0, 3, -13.4);
    wall1.rotation = new BABYLON.Vector3(0, Math.PI, 0);
    wall1.material = wallMat;

    const wall2 = BABYLON.MeshBuilder.CreatePlane("wall2", { height: 6, width: 14 }, scene);
    wall2.position = new BABYLON.Vector3(17.37, 3, -7);
    wall2.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
    wall2.material = wallMat;

    const wall3 = wall2.clone();
    wall3.position = new BABYLON.Vector3(-17.37, 3, -7);
    wall3.rotation = new BABYLON.Vector3(0, -Math.PI / 2, 0);
  };

  const createWallsOutside = (scene) => {
    const wallMat = new BABYLON.StandardMaterial("wall-mat", scene);

    const wall1 = BABYLON.MeshBuilder.CreatePlane("wall1", { height: 6, width: 35 }, scene);
    wall1.position = new BABYLON.Vector3(0, 3, -14.2);
    wall1.rotation = new BABYLON.Vector3(0, 0, 0);
    wall1.material = wallMat;

    const wall2 = BABYLON.MeshBuilder.CreatePlane("wall2", { height: 6, width: 14 }, scene);
    wall2.position = new BABYLON.Vector3(18, 3, -7);
    wall2.rotation = new BABYLON.Vector3(0, -Math.PI / 2, 0);
    wall2.material = wallMat;

    const wall3 = wall2.clone();
    wall3.position = new BABYLON.Vector3(-18, 3, -7);
    wall3.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
  };

  const createColumnDoric = (scene) => {
    const colMat = new BABYLON.StandardMaterial("column-doric-mat", scene);

    const profile = [new BABYLON.Vector3(0.48, 0, 0), new BABYLON.Vector3(0.38, 5.1, 0), new BABYLON.Vector3(0.46, 5.175, 0), new BABYLON.Vector3(0.5, 5.3, 0)];

    const column = BABYLON.MeshBuilder.CreateLathe("stand", {
      tessellation: 18,
      shape: profile,
      sideOrientation: BABYLON.Mesh.DOUBLESIDE
    });
    column.material = colMat;
    column.convertToFlatShadedMesh();

    const cap = BABYLON.MeshBuilder.CreateBox("menu-card", {
      width: 1.02,
      height: 0.16,
      depth: 1.02
    });
    cap.material = colMat;
    cap.parent = column;
    cap.position = new BABYLON.Vector3(0, 5.38, 0);

    const result = BABYLON.Mesh.MergeMeshes([column, cap], true, true);
    return result;
  };

  const columnFactory = (column) => {
    const numberOfColumns = 19;
    var x = column.position.x;
    var i = 0;
    do {
      i++;
      x += 1.7;
      const newCol = column.createInstance("column");
      newCol.position = new BABYLON.Vector3(x, column.position.y, column.position.z);
    } while (i < numberOfColumns);
  };
</script>
<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
