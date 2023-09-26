<script lang="ts" setup>
  import { Scene, Camera, Vector3, MeshBuilder, Mesh, StandardMaterial, Color3, KeyboardEventTypes, ArcRotateCamera, ExecuteCodeAction, ActionManager } from "babylonjs";
  import { AdvancedDynamicTexture, Control, Rectangle, ScrollViewer, TextBlock } from "babylonjs-gui";
  import { GridMaterial } from "babylonjs-materials";

  definePageMeta({
    featured: false,
    title: "Bench 006 – 3D Layout Layers",
    description: "Can I build a simple visual preview of FileMaker layouts in 3D?"
  });

  interface Bounds {
    top: number;
    left: number;
    right: number;
    bottom: number;
    posX: number;
    posY: number;
  }

  const createLabContent = async (scene: Scene) => {
    const cam = new ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2, 15, new Vector3(-5, -3, 0), scene);
    cam.attachControl(scene.getEngine().getRenderingCanvas() as HTMLCanvasElement, true);
    if (cam) {
      cam.orthoTop = 6;
      cam.orthoBottom = -6;
      cam.orthoLeft = -6;
      cam.orthoRight = 6;
    }

    // Create the grid material
    const gridMap = new GridMaterial("grid-mat", scene);
    gridMap.majorUnitFrequency = 0.1;
    gridMap.gridRatio = 1;
    gridMap.backFaceCulling = false;
    gridMap.opacity = 0.5;
    gridMap.lineColor = Color3.FromHexString(labColors.slate8);
    gridMap.mainColor = Color3.FromHexString(labColors.slate7);

    let background: Mesh;
    const grid = MeshBuilder.CreateGround("grid", { width: 10, height: 6 }, scene);
    grid.rotation.x = Math.PI / 2;
    grid.position = new Vector3(-5, -3, -2);
    grid.material = gridMap;
    cam.setTarget(grid);

    const layoutMat = new StandardMaterial("timeline-material", scene);
    layoutMat.diffuseColor = Color3.FromHexString(labColors.slate1);
    layoutMat.specularColor = new Color3(0.2, 0.2, 0.2);
    layoutMat.alpha = 0.5;

    const baselayer = new StandardMaterial("timeline-material", scene);
    baselayer.diffuseColor = Color3.FromHexString(labColors.slate2);
    baselayer.specularColor = new Color3(0.2, 0.2, 0.2);
    baselayer.alpha = 0.5;

    // fetch the XML data from the sample-data folder
    const layersData = await fetch("../sample-data/project-layers.xml").then((res) => res.text());

    // parse the XML data into an XMLDocument
    const parser = new DOMParser();
    const layersDoc = parser.parseFromString(layersData, "text/xml");

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

        let ancestorCount = 0;
        let parentNode = node.parentNode;
        while (parentNode) {
          if (parentNode.nodeName === "Object") {
            // Accumulate the count of ancestor Object nodes - used for the z order of layers, containment, etc.
            ancestorCount++;
            // Add the parent's bounds to the current bounds to get the position
            const parentBoundsNode = parentNode.querySelector("Bounds");
            if (parentBoundsNode) {
              bounds.posX += Number((parentBoundsNode.getAttribute("left") as unknown as number) ?? 0);
              bounds.posY += Number((parentBoundsNode.getAttribute("top") as unknown as number) ?? 0);
            }
          }
          parentNode = parentNode.parentNode;
        }

        const previousSiblings = node.parentNode?.querySelectorAll("Object");

        if (previousSiblings) {
          let previousSiblingCount = 0;

          for (let i = 0; i < previousSiblings.length; i++) {
            const sibling = previousSiblings[i];

            // Check if the sibling is before the current node
            if (sibling === node) {
              break; // Stop counting when we reach the current node
            }

            // Calculate the offset for each sibling by using half of the space between major layers
            const offZ = 0.9 / previousSiblings.length;
            // Increment the count for each valid sibling
            previousSiblingCount += offZ;
          }

          ancestorCount += previousSiblingCount;
        }

        console.log("Object Type:", node.getAttribute("type"), "Deep:", ancestorCount, "Bounds:", bounds);
        createLayerBox(ancestorCount, bounds, node, scene, baselayer);
      }
    }

    // Find and process Object nodes
    const objectNodes = layersDoc.querySelectorAll("Object");
    objectNodes.forEach(logObjectTypeAndAncestors);

    // Create the layout layer - FileMaker calculates the bounds of the layout objects, not the layout itself
    const layoutNode = layersDoc.querySelector("Layout");
    if (layoutNode) {
      const layoutTop = Number((layoutNode.getAttribute("enclosingRectTop") as unknown as number) ?? 0);
      const layoutLeft = Number((layoutNode.getAttribute("enclosingRectLeft") as unknown as number) ?? 0);
      const layoutRight = Number((layoutNode.getAttribute("enclosingRectRight") as unknown as number) ?? 0);
      const layoutBottom = Number((layoutNode.getAttribute("enclosingRectBottom") as unknown as number) ?? 0);

      let layoutBounds: Bounds = {
        top: layoutTop,
        left: layoutLeft,
        right: layoutRight,
        bottom: layoutBottom,
        posX: 0,
        posY: 0
      };

      createLayerBox(-1, layoutBounds, layoutNode, scene, layoutMat);
    }

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
          if (kbInfo.event.key === "g") {
            if (grid.visibility == 1) {
              grid.visibility = 0;
            } else {
              grid.visibility = 1;
            }
          }
          if (kbInfo.event.key === "Escape") {
            cam.setTarget(grid);
          }
          break;
      }
    });

    const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("overlay", true, scene);

    const inspector = new ScrollViewer();
    inspector.width = "300px";
    inspector.height = "600px";
    inspector.background = labColors.slate8;
    inspector.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    inspector.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    advancedTexture.addControl(inspector);

    const title = new TextBlock("gui-title");
    title.text = "{Object Type}";
    title.color = "white";
    title.fontSize = "18px";
    title.fontWeight = "bold";
    title.textWrapping = true;
    title.paddingTop = "10px";
    title.paddingBottom = "10px";
    title.paddingLeft = "12px";
    title.paddingRight = "12px";
    title.fontFamily = "NotoSans-Bold";
    title.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    title.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;

    // add a description
    const description = new TextBlock("gui-description");
    description.text = "Description";
    description.color = "white";
    description.fontSize = "14px";
    description.fontWeight = "normal";
    description.textWrapping = true;
    description.top = 60;
    // description.paddingTop = "100px";
    // description.paddingBottom = "10px";
    description.paddingLeft = "12px";
    description.paddingRight = "12px";
    description.fontFamily = "NotoSans-Medium";
    description.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    description.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;

    inspector.addControl(title);
    inspector.addControl(description);
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
