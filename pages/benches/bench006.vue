<script lang="ts" setup>
  import { camelize } from "@vueuse/core";
  import { Scene, Camera, Vector3, MeshBuilder, Mesh, StandardMaterial, Color3, KeyboardEventTypes, ArcRotateCamera, ExecuteCodeAction, ActionManager } from "babylonjs";
  import { GridMaterial } from "babylonjs-materials";

  definePageMeta({
    featured: false,
    title: "Bench 006 – 3D Layout Layers",
    description: "Can I build a simple visual preview of FileMaker layouts in 3D?"
  });

  const createLabContent = async (scene: Scene) => {
    const cam = new ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2, 15, new Vector3(-5, -3, 0), scene);
    cam.attachControl(scene.getEngine().getRenderingCanvas() as HTMLCanvasElement, true);
    if (cam) {
      cam.orthoTop = 6;
      cam.orthoBottom = -6;
      cam.orthoLeft = -6;
      cam.orthoRight = 6;
    }

    const grid = MeshBuilder.CreateGround("grid", { width: 10, height: 6 }, scene);
    grid.rotation.x = Math.PI / 2;
    grid.position = new Vector3(-5, -3, 0);
    cam.setTarget(grid);

    // Create the grid material
    const groundMaterial = new GridMaterial("ground-mat", scene);
    groundMaterial.majorUnitFrequency = 0.1;
    groundMaterial.gridRatio = 1;
    groundMaterial.backFaceCulling = false;
    groundMaterial.lineColor = Color3.FromHexString(labColors.slate8);
    groundMaterial.mainColor = Color3.FromHexString(labColors.slate7);
    groundMaterial.opacity = 0.5;

    // Assign the ground material
    grid.material = groundMaterial;

    const baselayer = new StandardMaterial("timeline-material", scene);
    baselayer.diffuseColor = Color3.FromHexString(labColors.slate2);
    baselayer.specularColor = new Color3(0.2, 0.2, 0.2);
    baselayer.alpha = 0.5;

    // fetch the XML data from the sample-data folder
    const layersData = await fetch("../sample-data/project-layers.xml").then((res) => res.text());

    // parse the XML data into an XMLDocument
    const parser = new DOMParser();
    const layersDoc = parser.parseFromString(layersData, "text/xml");

    interface Bounds {
      top: number;
      left: number;
      right: number;
      bottom: number;
      posX: number;
      posY: number;
    }

    const createLayerBox = (deep: number, bounds: any, node: Element, scene: Scene, material: StandardMaterial) => {
      const offset = 100;
      const width = (bounds.right - bounds.left) / offset;
      const height = (bounds.bottom - bounds.top) / offset;
      const posX = bounds.posX / offset + width / 2;
      const posY = bounds.posY / offset + height / 2;

      const layerBox = MeshBuilder.CreateBox("layer-box", { width: width, height: height, depth: 0.05 }, scene);
      layerBox.position.x = -posX;
      layerBox.position.y = -posY;
      layerBox.position.z = deep;
      layerBox.material = material;

      const am = new ActionManager(scene);
      layerBox.actionManager = am;
      layerBox.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPickTrigger, (evt) => {
          console.log("Clicked on", node.getAttribute("type"), deep, bounds);
          cam.setTarget(layerBox);
        })
      );
    };

    // Function to log object type and count of ancestor Object nodes
    function logObjectTypeAndAncestors(node: Element) {
      if (node.nodeName === "Object") {
        // console.log("Object:", node);
        // console.log("Object Type:", node.getAttribute("type"));

        let bounds: Bounds = {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          posX: 0,
          posY: 0
        };

        // get the first Bounds child node
        const boundsNode = node.querySelector("Bounds");
        if (boundsNode) {
          bounds.posY = Number((boundsNode.getAttribute("top") as unknown as number) ?? 0);
          bounds.posX = Number((boundsNode.getAttribute("left") as unknown as number) ?? 0);
          bounds.top = Number((boundsNode.getAttribute("top") as unknown as number) ?? 0);
          bounds.left = Number((boundsNode.getAttribute("left") as unknown as number) ?? 0);
          bounds.right = Number((boundsNode.getAttribute("right") as unknown as number) ?? 0);
          bounds.bottom = Number((boundsNode.getAttribute("bottom") as unknown as number) ?? 0);
        }

        console.log("Bounds:", bounds);

        let ancestorCount = 0;
        let parentNode = node.parentNode;
        while (parentNode) {
          if (parentNode.nodeName === "Object") {
            // offset the bounds by the parent's bounds
            const parentBoundsNode = parentNode.querySelector("Bounds");
            if (parentBoundsNode) {
              bounds.posX += Number((parentBoundsNode.getAttribute("left") as unknown as number) ?? 0);
              bounds.posY += Number((parentBoundsNode.getAttribute("top") as unknown as number) ?? 0);
            }
            ancestorCount++;
          }
          parentNode = parentNode.parentNode;
        }

        console.log("Object Type:", node.getAttribute("type"), "Deep:", ancestorCount, "Bounds:", bounds);
        createLayerBox(ancestorCount, bounds, node, scene, baselayer);
      }
    }

    // Find and process Object nodes
    const objectNodes = layersDoc.querySelectorAll("Object");
    objectNodes.forEach(logObjectTypeAndAncestors);

    scene.onKeyboardObservable.add((kbInfo) => {
      switch (kbInfo.type) {
        case KeyboardEventTypes.KEYDOWN:
          if (kbInfo.event.key === "m") {
            if (cam.mode === Camera.ORTHOGRAPHIC_CAMERA) {
              cam.mode = Camera.PERSPECTIVE_CAMERA;
            } else {
              cam.mode = Camera.ORTHOGRAPHIC_CAMERA;
            }
          }
          if (kbInfo.event.key === "Escape") {
            cam.setTarget(grid);
          }
          break;
      }
    });
  };

  // If a lab uses the default options, you can just call useBabylonScene() with the bjsCanvas ref and the createLabContent function.
  // Otherwise, you can pass in an options object with the following properties:
  const labSceneOptions = {
    useCamera: false,
    useLights: true,
    useRoom: false,
    useOverlay: false,
    useWebXRPlayer: false
  };

  const bjsCanvas = ref(null);
  // With scene options
  useCanvatoriumScene(bjsCanvas, createLabContent, labSceneOptions);

  // Without scene options (see lab001 for an example)
  // useCanvatoriumScene(bjsCanvas, createLabContent);
</script>
<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
