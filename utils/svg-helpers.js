import { Vector3 } from "@babylonjs/core";

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

export class ChoroplethSegmenter {
  constructor(data, segments) {
    this.data = data;
    this.segments = segments;
    this.min_value = Math.min(...data.map((entry) => entry.value));
    this.max_value = Math.max(...data.map((entry) => entry.value));
    this.segment_width = (this.max_value - this.min_value) / segments;
  }

  getSegment(value) {
    if (value < this.min_value || value > this.max_value) {
      return null; // Value is outside the data range
    }

    // Calculate the segment index
    const segment_index = Math.floor((value - this.min_value) / this.segment_width);

    // Adjust for the last segment to include the maximum value
    if (segment_index === this.segments) {
      return this.segments;
    }

    return segment_index + 1; // Return 1-indexed segment number
  }
}

// These function suck, but I'm leaving them here for now
export function generateMonochromaticScale(startHex, numShades) {
  const startColor = parseInt(startHex.slice(1), 16); // Convert hex to integer
  const startR = (startColor >> 16) & 255; // Extract red component
  const startG = (startColor >> 8) & 255; // Extract green component
  const startB = startColor & 255; // Extract blue component
  const darkerShades = [];

  for (let i = 0; i < numShades; i++) {
    const scale = 1 - (i * 0.2) / (numShades - 1); // Adjusted scale factor for lighter shades
    const newR = Math.floor(startR * scale);
    const newG = Math.floor(startG * scale);
    const newB = Math.floor(startB * scale);
    const newHex = `#${((newR << 16) | (newG << 8) | newB).toString(16).padStart(6, "0")}`;
    darkerShades.push(newHex);
  }

  return darkerShades;
}

function generateMonochromaticShades(startHex, numShades) {
  const startColor = parseInt(startHex.slice(1), 16); // Convert hex to integer
  const startR = (startColor >> 16) & 255; // Extract red component
  const startG = (startColor >> 8) & 255; // Extract green component
  const startB = startColor & 255; // Extract blue component
  const shades = [];

  for (let i = 0; i < numShades; i++) {
    const scale = i / (numShades - 1); // Calculate scale factor
    const newR = Math.floor(startR * (1 - scale));
    const newG = Math.floor(startG * (1 - scale));
    const newB = Math.floor(startB * (1 - scale));
    const newHex = `#${((newR << 16) | (newG << 8) | newB).toString(16).padStart(6, "0")}`;
    shades.push(newHex);
  }

  return shades;
}
