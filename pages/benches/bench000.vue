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
    // Lab 001 only. Move the camera to a better position for the initial scene.
    const cam = scene.getCameraByName("camera");
    cam.position = new Vector3(0, 1.4, -4);

    const ohioSVG = await fetch("/assets/usa-oh.svg").then((res) => res.text());
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
      // get the first path
      const myPath = [new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 0, 5), new BABYLON.Vector3(0, 0, 10)];
      const options = {
        shape: data.points, //vec3 array with z = 0,
        path: myPath, //vec3 array
        updatable: false,
        cap: BABYLON.Mesh.CAP_ALL,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE
      };
      //BABYLON.MeshBuilder.ExtrudeShape("star", {shape: myShape, path: myPath, cap: BABYLON.Mesh.CAP_ALL, sideOrientation: BABYLON.Mesh.DOUBLESIDE});

      let extrudedMesh = BABYLON.MeshBuilder.ExtrudeShape("ext", options, scene);

      // Create a material for the mesh
      const material = new BABYLON.StandardMaterial("material", scene);
      material.diffuseColor = new BABYLON.Color3.FromHexString(labColors.slate3);

      // Apply the material to the mesh
      extrudedMesh.material = material;
      //show outline
      extrudedMesh.enableEdgesRendering();
      //   extrudedMesh.position = new BABYLON.Vector3(0, 0, 0);
      scene.addMesh(extrudedMesh);
    }

    // loop through the paths array and extrude each path
    pathsArray.forEach((path) => {
      extrudePath(path);
    });

    // Now you have an array of objects, each containing an 'id' and an array of points.
    console.log(pathsArray);
  };

  // Rest of the code remains the same...

  // Function to parse path data and convert it into an array of points
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
    useRoom: true,
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
