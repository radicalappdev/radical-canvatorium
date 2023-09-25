<script lang="ts" setup>
  import { Scene, Vector3, MeshBuilder, Mesh, StandardMaterial, Color3, Color4, ArcRotateCamera } from "babylonjs";

  definePageMeta({
    featured: false,
    title: "Bench 006 – 3D Layout Layers",
    description: "Can I build a simple visual preview of FileMaker layouts in 3D?"
  });

  const createLabContent = async (scene: Scene) => {
    scene.clearColor = Color4.FromHexString(labColors.slate6 + "ff");
    const cam = scene.getCameraByName("camera") as ArcRotateCamera;

    // fetch the XML data from the sample-data folder
    const layersData = await fetch("../sample-data/project-layers.xml").then((res) => res.text());

    // console.log(layersData);
    // parse the XML data into an XMLDocument
    const parser = new DOMParser();
    const layersDoc = parser.parseFromString(layersData, "text/xml");

    console.log(layersDoc);

    // get the layers from the XMLDocument
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
