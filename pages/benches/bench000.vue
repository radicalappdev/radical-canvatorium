<script setup>
  import { Vector3 } from "babylonjs";
  import "babylonjs-loaders";

  definePageMeta({
    featured: false,
    title: "Bench 000 – SVG to Babylon JS",
    description: "Loading an SVG file and converting it to 3D objects in Babylon JS."
  });

  // Add lab-specific content here using the provided 'scene' instance
  const createLabContent = async (scene) => {
    scene.clearColor = new BABYLON.Color4(0.1, 0.1, 0.1, 1);
    // Lab 001 only. Move the camera to a better position for the initial scene.
    const cam = scene.getCameraByName("camera");
    cam.position = new Vector3(0, 1.4, -4);

    const ohioSVG = await fetch("/assets/usa-oh.svg").then((res) => res.text());
    // const ohioSVG = await fetch("/assets/usa-oh.svg").then((res) => res.text());
    // console.log("SVG", ohioSVG);

    // Create an array to store the objects
    const pathsArray = [];

    // Parse the SVG data to extract the path elements
    const parser = new DOMParser();
    const svgDocument = parser.parseFromString(ohioSVG, "image/svg+xml");
    const pathElements = svgDocument.querySelectorAll("path");

    // Iterate through each path and convert it to an object
    pathElements.forEach((pathElement) => {
      // Get the 'id' attribute of the path
      const id = pathElement.getAttribute("id");

      // Get the 'd' attribute of the path, which contains the path data
      const pathData = pathElement.getAttribute("d");

      console.log(id, pathData);
      // Parse the path data to get an array of points
      const points = parsePathData(pathData);
      console.log(points);

      // Create an object containing the 'id' and the points array
      const pathObject = {
        id,
        points
        // Add any other properties you may want for extrusion, e.g., height, color, etc.
      };

      // Push the object to the pathsArray
      pathsArray.push(pathObject);
    });

    function extrudePath(data) {
      const colors = ["#ffffff", "#e1f5ff", "#c8ecff", "#a4dcff", "#8fd4ff", "#68b6eb", "#40a8e0", "#1168a7", "#1b75bc", "#2d90d1"];

      // Pick a number between 1 and 10
      const num = Math.floor(Math.random() * 10) + 1;

      // Use the number to pick a color from the array
      const color = colors[num - 1];
      console.log("num", num, color);

      // Use the number to pick a depth
      const depth = num / 5 + 1;
      // console.log("scaleY", scaleY);
      // get the first path
      const myPath = [new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 0.5, 0), new BABYLON.Vector3(0, depth, 0)];
      const options = {
        shape: data.points, //vec3 array with z = 0,
        path: myPath, //vec3 array
        updatable: true,
        cap: BABYLON.Mesh.CAP_ALL,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE
      };
      //BABYLON.MeshBuilder.ExtrudeShape("star", {shape: myShape, path: myPath, cap: BABYLON.Mesh.CAP_ALL, sideOrientation: BABYLON.Mesh.DOUBLESIDE});

      let extrudedMesh = BABYLON.MeshBuilder.ExtrudeShape("ext", options, scene);

      // Calculate the position along the y axis based on the depth
      //   const positionY = scaleY / 2;

      // Create a material for the mesh
      const material = new BABYLON.StandardMaterial("material", scene);
      material.diffuseColor = new BABYLON.Color3.FromHexString(color);

      extrudedMesh.material = material;
      //   extrudedMesh.enableEdgesRendering();
      extrudedMesh.convertToFlatShadedMesh();
      //   extrudedMesh.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
      // scale in local space
      extrudedMesh.scalingDeterminant = 0.1;
      //   extrudedMesh.position.y = positionY;
      //   extrudedMesh.scaling.y = scaleY;
      return extrudedMesh;
    }

    // Create a group to hold all the extruded paths
    const extrudedPathsGroup = new BABYLON.Mesh("extrudedPathsGroup", scene);
    extrudedPathsGroup.showBoundingBox = true;

    // loop through the paths array and extrude each path

    pathsArray.forEach((path) => {
      extrudedPathsGroup.addChild(extrudePath(path));
    });

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

    // Now you have an array of objects, each containing an 'id' and an array of points.
    console.log(pathsArray);
  };

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
      console.log(match);
      console.log(command);
      console.log(parameters);
      updateCurrentPoint(command, parameters);
    }

    return points;
  }

  // If a lab uses the default options, you can just call useBabylonScene() with the bjsCanvas ref and the createLabContent function.
  // Otherwise, you can pass in an options object with the following properties:
  const labSceneOptions = {
    useCamera: true,
    useLight: true,
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
