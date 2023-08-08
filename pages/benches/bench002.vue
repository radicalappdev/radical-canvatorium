<script setup>
  import { Vector3, HemisphericLight, Mesh, StandardMaterial, Color3, Color4, MeshBuilder } from "babylonjs";
  import "babylonjs-loaders";
  import sampleData from "@/data/ohio-demo-02.json";

  definePageMeta({
    featured: false,
    title: "Bench 002 – SVG to Babylon JS with sample data + lines",
    description: "Loading an SVG file and converting it to 3D objects in Babylon JS."
  });

  const createLabContent = async (scene) => {
    scene.clearColor = new BABYLON.Color4.FromHexString(labColors.slate6 + "ff");

    const cam = scene.getCameraByName("camera");
    cam.setTarget(new Vector3(0, 0, 0));
    cam.position = new Vector3(0, 5, -6);

    const colors = ["#ffffff", "#e1f5ff", "#c8ecff", "#a4dcff", "#8fd4ff", "#68b6eb", "#40a8e0", "#1168a7", "#1b75bc", "#2d90d1"];
    const numberOfSegments = colors.length;
    const heightFactor = 1;

    // Create an instance of the ChoroplethSegmenter class
    const choroplethSegmenter = new ChoroplethSegmenter(sampleData, numberOfSegments);

    // This SVG contains a list of separate paths, each with its own id and path data
    const svg = await fetch("/assets/usa-oh.svg").then((res) => res.text());

    function extrudePath(data) {
      const id = data.id;

      // get the object from the sample data where countyName matches the id
      const entry = sampleData.find((entry) => entry.countyName === id);

      const value = entry.value;

      // get the value from the entry
      const num = choroplethSegmenter.getSegment(value);
      console.log(id, entry, num);

      // Use the number to pick a color from the array
      const color = colors[num - 1];
      console.log(data.id, num, color);

      // Use the number to pick a depth
      const depth = num / heightFactor + 1;
      const myPath = [new Vector3(0, 0, 0), new Vector3(0, 0.5, 0), new Vector3(0, depth, 0)];
      const options = {
        shape: data.points,
        path: myPath,
        updatable: true,
        cap: Mesh.CAP_ALL,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE
      };

      let extrudedMesh = MeshBuilder.ExtrudeShape("ext", options, scene);

      // Create a material for the mesh
      const material = new StandardMaterial("material", scene);
      material.diffuseColor = new Color3.FromHexString(color);
      material.specularColor = new Color3(0.1, 0.1, 0.1);

      extrudedMesh.material = material;
      extrudedMesh.convertToFlatShadedMesh();
      extrudedMesh.scalingDeterminant = 0.1;

      // Generate a line mesh from the path points and place it on top of the extruded mesh
      // map the data points from XZ to XY
      data.points = data.points.map((point) => new Vector3(point.x, 0, point.y));
      const lineMesh = MeshBuilder.CreateLines("lines", { points: data.points }, scene);
      lineMesh.color = new Color3(0.1, 0.1, 0.1);
      // Rotate the line mesh so it's parallel to the extruded mesh
      lineMesh.parent = extrudedMesh;
      lineMesh.rotation.z = Math.PI;
      lineMesh.rotation.y = -Math.PI / 2;
      lineMesh.position.y = depth + 0.01;

      return extrudedMesh;
    }

    const pathsArray = extractSVG_babylon(svg);

    // Create a group to hold all the extruded paths
    const extrudedPathsGroup = new Mesh("extrudedPathsGroup", scene);

    // loop through the paths array and extrude each path
    pathsArray.forEach((path) => {
      extrudedPathsGroup.addChild(extrudePath(path));
    });

    // Rotate the group so it's facing the camera - important! This must be done before applying the bounding offsets
    extrudedPathsGroup.rotation.y = -Math.PI / 2;
    // get the bounds of the extruded paths group
    const bounds = extrudedPathsGroup.getHierarchyBoundingVectors();
    // Calculate an offset to center the group
    const offsetX = (bounds.max.x - bounds.min.x) / 2 + bounds.min.x;
    const offsetY = 0;
    const offsetZ = (bounds.max.z - bounds.min.z) / 2 + bounds.min.z;

    // Move the group to the center of the scene
    extrudedPathsGroup.position = new Vector3(-offsetX, -offsetY, -offsetZ);

    // Customize the scene lighting and background color
    const ambientLight1 = new HemisphericLight("light-01", new Vector3(10, 10, 10), scene);
    ambientLight1.intensity = 0.6;
    const ambientLight2 = new HemisphericLight("light-02", new Vector3(-10, 10, -10), scene);
    ambientLight2.intensity = 0.6;
  };

  // Configure the scene and pass it the createLabContent function
  const bjsCanvas = ref(null);
  const labSceneOptions = {
    useCamera: true,
    useLights: false,
    useRoom: false,
    useOverlay: false,
    useWebXRPlayer: false
  };
  useCanvatoriumScene(bjsCanvas, createLabContent, labSceneOptions);
</script>
<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
