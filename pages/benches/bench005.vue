<script setup>
  import { Scene, Vector3, MeshBuilder } from "babylonjs";
  import { AdvancedDynamicTexture, TextBlock, Image } from "babylonjs-gui";

  definePageMeta({
    featured: false,
    title: "Bench 005 – SVG Playground",
    description: "",
    labNotes: ``
  });

  // Add lab-specific content here using the provided 'scene' instance
  const createLabContent = async (scene) => {
    // Lab 001 only. Move the camera to a better position for the initial scene.
    const cam = scene.getCameraByName("camera");
    if (cam) {
      cam.position = new Vector3(0, 1.4, -4);
    }

    // Create a plane
    const plane = MeshBuilder.CreatePlane("plane", { width: 3, height: 2 }, scene);
    plane.position.y = 1;

    let scalerwidth = 3;
    let scalerheight = 2;

    let width = 1024 * scalerwidth;
    let height = 1024 * scalerheight;

    let svgwidth = 1024 * scalerwidth * 10;
    let svgheight = 1024 * scalerheight * 10;

    console.log("svg size", svgwidth, svgheight);

    // Create an AdvancedDynamicTexture for the plane
    const advancedTexture = AdvancedDynamicTexture.CreateForMesh(plane, width, height, null);
    advancedTexture.background = "gray";

    // Create an Image control with the SVG
    // const svg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg viewBox="10 10 500 500" xmlns="http://www.w3.org/2000/svg" xmlns:bx="https://boxy-svg.com">
    //     <defs></defs>
    //     <path d="M 242.905 133.997 L 380.432 348.074 L 105.378 348.074 L 242.905 133.997 Z" style="stroke: rgb(0, 0, 0); fill: rgb(64, 35, 229);" bx:shape="triangle 105.378 133.997 275.054 214.077 0.5 0 1@e8b45ecb"></path>
    // </svg>`;

    let svg = await fetch("/assets/images/svgtest.svg").then((res) => res.text());

    const parser = new DOMParser();
    const doc = parser.parseFromString(svg, "image/svg+xml");
    const svgElement = doc.getElementsByTagName("svg")[0];
    svgElement.setAttribute("viewBox", `0 0 ${svgwidth} ${svgheight}`);

    console.log(svgElement);

    // get the subject by id and update the X and Y attributes
    const subject = doc.getElementById("subject");
    // place the subject in the center of the svg
    subject.setAttribute("x", svgwidth / 2 - 50);
    subject.setAttribute("y", svgheight / 2 - 50);

    // subject.setAttribute("x", "10");
    // subject.setAttribute("y", "10");

    console.log(subject);

    // replace the svg with the updated version
    svg = doc.documentElement.outerHTML;

    var url = "data:image/svg+xml;base64," + btoa(svg);

    const image = new Image("svgImage", url);
    image.width = 1; // Set the width as needed
    image.height = 1; // Set the height as needed

    // Add the Image control to the AdvancedDynamicTexture
    advancedTexture.addControl(image);
  };

  // If a lab uses the default options, you can just call useBabylonScene() with the bjsCanvas ref and the createLabContent function.
  // Otherwise, you can pass in an options object with the following properties:
  const labSceneOptions = {
    useCamera: true,
    useLight: true,
    useRoom: true
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
