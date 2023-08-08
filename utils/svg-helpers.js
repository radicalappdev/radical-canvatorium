import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { Vector3 } from "babylonjs";

export const renderSVG_three = (extrusion, svg) => {
  const fillMaterial = new THREE.MeshBasicMaterial({ color: labColors.slate6 });
  const stokeMaterial = new THREE.LineBasicMaterial({
    color: labColors.slate3
  });
  const loader = new SVGLoader();
  const svgData = loader.parse(svg);
  const svgGroup = new THREE.Group();
  const updateMap = [];

  svgGroup.scale.y *= -1;
  svgData.paths.forEach((path) => {
    const shapes = SVGLoader.createShapes(path);

    shapes.forEach((shape) => {
      const meshGeometry = new THREE.ExtrudeGeometry(shape, {
        depth: extrusion,
        bevelEnabled: false
      });
      const linesGeometry = new THREE.EdgesGeometry(meshGeometry);
      const mesh = new THREE.Mesh(meshGeometry, fillMaterial);
      const lines = new THREE.LineSegments(linesGeometry, stokeMaterial);

      updateMap.push({ shape, mesh, lines });
      svgGroup.add(mesh, lines);
    });
  });

  const box = new THREE.Box3().setFromObject(svgGroup);
  const size = box.getSize(new THREE.Vector3());
  const yOffset = size.y / -2;
  const xOffset = size.x / -2;

  // Offset all of group's elements, to center them
  svgGroup.children.forEach((item) => {
    item.position.x = xOffset;
    item.position.y = yOffset;
  });
  svgGroup.rotateX(-Math.PI / 2);
  svgGroup.scale.multiplyScalar(0.2);

  return {
    object: svgGroup,
    update(extrusion) {
      updateMap.forEach((updateDetails) => {
        const meshGeometry = new THREE.ExtrudeGeometry(updateDetails.shape, {
          depth: extrusion,
          bevelEnabled: false
        });
        const linesGeometry = new THREE.EdgesGeometry(meshGeometry);

        updateDetails.mesh.geometry.dispose();
        updateDetails.lines.geometry.dispose();
        updateDetails.mesh.geometry = meshGeometry;
        updateDetails.lines.geometry = linesGeometry;
      });
    }
  };
};

// TODO: Refactor to make a bit more sense
export const extractSVG_babylon = (svg) => {
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

  return pathsArray;
};
