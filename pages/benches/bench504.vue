<script setup>
  import * as THREE from "three";
  import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
  import sampleData from "@/data/ohio-demo-01.json";

  definePageMeta({
    featured: false,
    title: "Bench 504 – Ohio SVG to Three JS + Loading Data",
    description: "Loading an SVG file and converting it to 3D objects in Three JS."
  });

  // Create the Three JS scene
  const createThreeScene = async (container) => {
    const colors = ["#ffffff", "#e1f5ff", "#c8ecff", "#a4dcff", "#8fd4ff", "#68b6eb", "#40a8e0", "#1168a7", "#1b75bc", "#2d90d1"];
    const numberOfSegments = colors.length;
    const heightFactor = 1;

    // Create an instance of the ChoroplethSegmenter class
    const choroplethSegmenter = new ChoroplethSegmenter(sampleData, numberOfSegments);

    const svg = await fetch("/assets/usa-oh.svg").then((res) => res.text());

    const pathsArray = extractSVG_three(svg);
    console.log("Paths Array", pathsArray);

    function extrudePath(element) {
      const id = element.id;

      // get the object from the sample data where countyName matches the id
      const entry = sampleData.find((entry) => entry.countyName === id);

      const value = entry.value;

      // get the value from the entry
      const num = choroplethSegmenter.getSegment(value);
      console.log(id, entry, num);

      // Use the number to pick a color from the array
      const color = colors[num - 1];
      console.log(element.id, num, color);

      const depth = num / heightFactor + 1;

      const points = element.points;
      console.log("points", points);
    }

    // loop through the paths array and extrude each path

    // TODO: add a parent object to group these
    pathsArray.forEach((path) => {
      extrudePath(path);
    });

    // -----------------------------
    // Create the Three JS scene
    // -----------------------------

    // Extract the width and height from the container
    const width = container.value.clientWidth;
    const height = container.value.clientHeight;

    // Create a scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(labColors.slate1);

    // Create a camera
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 15, 10);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    // Add orbit controls
    const controls = new OrbitControls(camera, container.value);
    controls.target.set(0, 0, 0);
    controls.maxPolarAngle = Math.PI / 2;
    controls.minPolarAngle = 0;
    controls.maxDistance = 20;
    controls.minDistance = 5;
    controls.update();

    // Add a grid to the scene
    const gridHelper = new THREE.GridHelper(5, 5);
    scene.add(gridHelper);

    // Create the renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height); // TODO: This isn't working!
    renderer.setPixelRatio(window.devicePixelRatio);

    // Add the automatically created <canvas> element to the page
    container.value.append(renderer.domElement);

    // Render the scene
    const runScene = () => {
      requestAnimationFrame(runScene);

      renderer.render(scene, camera);
    };

    runScene();
  };

  const sceneContainer = ref(null);

  onMounted(() => {
    if (sceneContainer.value) {
      createThreeScene(sceneContainer);
    }
  });
</script>

<template>
  <div id="sceneContainer" ref="sceneContainer"></div>
</template>
