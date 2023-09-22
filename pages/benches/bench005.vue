<script lang="ts" setup>
  import { Scene, Vector3, MeshBuilder, Mesh, StandardMaterial, Color3 } from "babylonjs";
  import "babylonjs-loaders";
  import projectData from "@/data/project-timeline.json";

  definePageMeta({
    featured: false,
    title: "Bench 005 – Timeline Concept",
    description: ""
  });

  const createLabContent = async (scene: Scene) => {
    // const cam = scene.getCameraByName("camera");
    // cam.setTarget(new Vector3(0, 0, 0));
    // cam.position = new Vector3(0, 5, -6);

    // Project data contains an array of objects with date, title, and type.
    // Get the earliest and latest dates to calculate the range of the timeline.
    const dateStart = projectData.reduce((a, b) => (a.date < b.date ? a : b)).date;
    const dateEnd = projectData.reduce((a, b) => (a.date > b.date ? a : b)).date;

    console.log(dateStart, dateEnd);

    const timelineMaterial = new StandardMaterial("timeline-material", scene);
    timelineMaterial.diffuseColor = Color3.FromHexString(labColors.slate8);
    timelineMaterial.specularColor = new Color3(0.2, 0.2, 0.2);

    // create a Babylon JS tube that will represent the timeline
    const timeline = MeshBuilder.CreateTube(
      "tube",
      {
        path: [new Vector3(-2.5, 0, 0), new Vector3(2.5, 0, 0)],
        radius: 0.05,
        sideOrientation: Mesh.DOUBLESIDE,
        updatable: true
      },
      scene
    );
    timeline.material = timelineMaterial;
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
