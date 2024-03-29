<script setup>
  import * as BABYLON from "@babylonjs/core";
  import { Vector3 } from "@babylonjs/core";
  import "@babylonjs/loaders";

  definePageMeta({
    featured: false,
    title: "Bench 000 – SVG to Babylon JS with random data",
    description: "Loading an SVG file and converting it to 3D objects in Babylon JS."
  });

  const createLabContent = async (scene) => {
    scene.clearColor = BABYLON.Color4.FromHexString(labColors.slate3 + "ff");

    const cam = scene.getCameraByName("camera");
    cam.setTarget(new Vector3(0, 0, 0));
    cam.position = new Vector3(0, 5, -6);

    // This SVG contains a list of separate paths, each with its own id and path data
    const svg = await fetch("/assets/maps/usa-oh.svg").then((res) => res.text());

    function extrudePath(data) {
      const colors = ["#ffffff", "#e1f5ff", "#c8ecff", "#a4dcff", "#8fd4ff", "#68b6eb", "#40a8e0", "#1168a7", "#1b75bc", "#2d90d1"];

      // Pick a number between 1 and 10
      const num = Math.floor(Math.random() * 10) + 1;

      // Use the number to pick a color from the array
      const color = colors[num - 1];
      console.log("num", num, color);

      // Use the number to pick a depth
      const depth = num / 5 + 1;
      const myPath = [new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 0.5, 0), new BABYLON.Vector3(0, depth, 0)];
      const options = {
        shape: data.points,
        path: myPath,
        updatable: true,
        cap: BABYLON.Mesh.CAP_ALL
        // sideOrientation: BABYLON.Mesh.DOUBLESIDE
      };

      let extrudedMesh = BABYLON.MeshBuilder.ExtrudeShape("ext", options, scene);

      // Create a material for the mesh
      const material = new BABYLON.StandardMaterial("material", scene);
      material.diffuseColor = BABYLON.Color3.FromHexString(color);
      material.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);

      extrudedMesh.material = material;
      extrudedMesh.convertToFlatShadedMesh();
      extrudedMesh.scalingDeterminant = 0.1;
      //   extrudedMesh.visibility = 0.8;
      return extrudedMesh;
    }

    // Function to parse path data and convert it into an array of points
    function parsePathData(pathData) {
      // Regular expression pattern to find all commands and their coordinates
      const regex = /([mlhvcsqtaz])([^mlhvcsqtaz]*)/gi;

      // Array to store the points
      const points = [];

      // Helper function to update the current point based on the command and its parameters
      function updateCurrentPoint(command, parameters) {
        const coordinates = parameters.split(/[ ,]/).map(parseFloat);

        let index = 0;
        while (index < coordinates.length) {
          const dx = coordinates[index];
          const dy = coordinates[index + 1];
          currentPoint.x += dx;
          currentPoint.y += dy;
          points.push(new Vector3(currentPoint.x, currentPoint.y, 0));
          index += 2; // Move to the next set of coordinates (x, y)
        }
      }

      let currentPoint = new Vector3(0, 0, 0); // Starting point

      let match;
      while ((match = regex.exec(pathData)) !== null) {
        const command = match[1];
        const parameters = match[2].trim();
        updateCurrentPoint(command, parameters);
      }

      return points;
    }

    // Create an array to store the objects
    const pathsArray = [];

    // Parse the SVG data to extract the path elements
    const parser = new DOMParser();
    const svgDocument = parser.parseFromString(svg, "image/svg+xml");
    const pathElements = svgDocument.querySelectorAll("path");

    // Iterate through each path and convert it to an object
    pathElements.forEach((pathElement) => {
      // Get the 'id' attribute of the path
      const id = pathElement.getAttribute("id");

      // Get the 'd' attribute of the path, which contains the path data
      const pathData = pathElement.getAttribute("d");
      const points = parsePathData(pathData);
      const pathObject = {
        id,
        points
      };

      pathsArray.push(pathObject);
    });

    // Create a group to hold all the extruded paths
    const extrudedPathsGroup = new BABYLON.Mesh("extrudedPathsGroup", scene);

    // loop through the paths array and extrude each path
    pathsArray.forEach((path) => {
      extrudedPathsGroup.addChild(extrudePath(path));
    });

    // Rotate the group so it's facing the camera - important! This must be done before applying the bounding offsets
    extrudedPathsGroup.rotation.y = -Math.PI / 2;
    // get the bounds of the extruded paths group
    const bounds = extrudedPathsGroup.getHierarchyBoundingVectors();
    console.log(bounds);
    // Calculate an offset to center the group
    const offsetX = (bounds.max.x - bounds.min.x) / 2 + bounds.min.x;
    const offsetY = 0;
    const offsetZ = (bounds.max.z - bounds.min.z) / 2 + bounds.min.z;

    // Move the group to the center of the scene
    extrudedPathsGroup.position = new BABYLON.Vector3(-offsetX, -offsetY, -offsetZ);
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
