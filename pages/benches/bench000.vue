<script setup>
  import { Vector3 } from "babylonjs";
  import { TextBlock } from "babylonjs-gui";
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
      // Get the 'd' attribute of the path, which contains the path data
      const pathData = pathElement.getAttribute("d");
      console.log(pathData);

      // Parse the path data to get an array of points
      const points = parsePathData(pathData);

      // Create an object containing the points array
      const pathObject = {
        points
        // Add any other properties you may want for extrusion, e.g., height, color, etc.
      };

      // Push the object to the pathsArray
      pathsArray.push(pathObject);
    });

    // Now you have an array of objects, each containing an array of points.
    console.log(pathsArray);
  };

  // Function to parse path data and convert it into an array of points
  function parsePathData(pathData) {
    // Regular expression pattern to find all commands and their coordinates
    const regex = /([mlhvcsqtaz])([^mlhvcsqtaz]*)/gi;

    // Array to store the points
    const points = [];

    let currentPoint = new Vector3(0, 0, 0); // Starting point

    // Helper function to update the current point based on the command and its parameters
    function updateCurrentPoint(command, parameters) {
      const [dx, dy] = parameters.split(",").map(parseFloat);
      switch (command.toLowerCase()) {
        case "m": // MoveTo
          currentPoint.x += dx;
          currentPoint.y += dy;
          break;
        case "l": // LineTo
          currentPoint.x += dx;
          currentPoint.y += dy;
          break;
        case "h": // Horizontal LineTo
          currentPoint.x += dx;
          break;
        case "v": // Vertical LineTo
          currentPoint.y += dy;
          break;
        case "z": // ClosePath (Z)
          // For simplicity, we ignore 'z' commands (ClosePath) in this example.
          // If you want to handle closed paths, you can add the necessary logic here.
          break;
        default:
          break;
      }
    }

    let match;
    while ((match = regex.exec(pathData)) !== null) {
      const command = match[1];
      const parameters = match[2].trim();
      updateCurrentPoint(command, parameters);
      points.push(new Vector3(currentPoint.x, currentPoint.y, 0)); // We assume z=0 in this case, as it's a 2D SVG.
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
