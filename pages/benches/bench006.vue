<script lang="ts" setup>
  import { Scene, Vector3, MeshBuilder, Mesh, StandardMaterial, Color3, Color4, ArcRotateCamera, ExecuteCodeAction, ActionManager } from "babylonjs";
  import { NuxtComponentIndicator } from "nuxt/dist/app/composables/component";

  definePageMeta({
    featured: false,
    title: "Bench 006 – 3D Layout Layers",
    description: "Can I build a simple visual preview of FileMaker layouts in 3D?"
  });

  const createLabContent = async (scene: Scene) => {
    scene.clearColor = Color4.FromHexString(labColors.slate6 + "ff");
    const cam = scene.getCameraByName("camera") as ArcRotateCamera;

    const baselayer = new StandardMaterial("timeline-material", scene);
    baselayer.diffuseColor = Color3.FromHexString(labColors.slate2);
    baselayer.specularColor = new Color3(0.2, 0.2, 0.2);
    baselayer.alpha = 0.7;

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
      offX: number;
      offY: number;
    }

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
          offX: 0,
          offY: 0
        };

        // get the first Bounds child node
        const boundsNode = node.querySelector("Bounds");
        if (boundsNode) {
          bounds.top = Number((boundsNode.getAttribute("top") as unknown as number) ?? 0);
          bounds.left = Number((boundsNode.getAttribute("left") as unknown as number) ?? 0);
          bounds.right = Number((boundsNode.getAttribute("right") as unknown as number) ?? 0);
          bounds.bottom = Number((boundsNode.getAttribute("bottom") as unknown as number) ?? 0);
          console.log("Bounds:", bounds.top);
        }

        console.log("Bounds:", bounds);

        let ancestorCount = 0;
        let parentNode = node.parentNode;
        while (parentNode) {
          if (parentNode.nodeName === "Object") {
            // offset the bounds by the parent's bounds
            const parentBoundsNode = parentNode.querySelector("Bounds");
            if (parentBoundsNode) {
              //   console.log("Parent Bounds:", parentBoundsNode);
              bounds.offX += Number((parentBoundsNode.getAttribute("left") as unknown as number) ?? 0);
              bounds.offY += Number((parentBoundsNode.getAttribute("top") as unknown as number) ?? 0);
              //   bounds.right += Number((parentBoundsNode.getAttribute("right") as unknown as number) ?? 0);
              //   bounds.bottom += Number((parentBoundsNode.getAttribute("bottom") as unknown as number) ?? 0);
            }
            console.log("Bounds offset:", bounds.top);
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
  };

  const createLayerBox = (deep: number, bounds: any, node: Element, scene: Scene, material: StandardMaterial) => {
    const offset = 100;
    const width = (bounds.right - bounds.left) / offset;
    const height = (bounds.bottom - bounds.top) / offset;
    // console.log(width, height);
    const layerBox = MeshBuilder.CreateBox("layer-box", { width: width, height: height, depth: 0.05 }, scene);
    // console.log("Bounds off x:", bounds.offX);
    if (bounds.offX == 0) {
      const posX = bounds.left / offset;
      layerBox.position.x = bounds.left / offset / 2;
      console.log("Bounds regular x:", bounds.offX, posX);
    } else {
      const posX = bounds.offX / offset;
      layerBox.position.x = posX;
      console.log("Bounds offset x:", bounds.offX, posX);
    }
    const posY = bounds.top / offset;
    layerBox.position.y = -posY / 2;
    layerBox.position.z = -deep;
    layerBox.material = material;

    const am = new ActionManager(scene);
    layerBox.actionManager = am;
    layerBox.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnPickTrigger, (evt) => {
        console.log("Clicked on", node.getAttribute("type"), deep, bounds);
      })
    );
  };

  // If a lab uses the default options, you can just call useBabylonScene() with the bjsCanvas ref and the createLabContent function.
  // Otherwise, you can pass in an options object with the following properties:
  const labSceneOptions = {
    useCamera: true,
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
