<script setup>
  import * as THREE from "three";
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

    function extrudePath(path) {
      const id = path.id;

      // get the object from the sample data where countyName matches the id
      const entry = sampleData.find((entry) => entry.countyName === id);

      const value = entry.value;

      // get the value from the entry
      const num = choroplethSegmenter.getSegment(value);
      console.log(id, entry, num);

      // Use the number to pick a color from the array
      const color = colors[num - 1];
      console.log(path.id, num, color);

      const depth = num / heightFactor + 1;

      const points = path.points;
      console.log("points", points);
      const fillMaterial = new THREE.MeshBasicMaterial({ color: labColors.slate6 });
      const stokeMaterial = new THREE.LineBasicMaterial({
        color: labColors.slate3
      });

      const meshGeometry = new THREE.ExtrudeGeometry(points, {
        depth: depth,
        bevelEnabled: false
      });
      const linesGeometry = new THREE.EdgesGeometry(meshGeometry);
      const mesh = new THREE.Mesh(meshGeometry, fillMaterial);
      const lines = new THREE.LineSegments(linesGeometry, stokeMaterial);

      return { mesh, lines };
    }

    // loop through the paths array and extrude each path

    // TODO: add a parent object to group these
    const svgGroup = new THREE.Group();
    svgGroup.scale.y *= -1;
    pathsArray.forEach((path) => {
      const { mesh, lines } = extrudePath(path);
      svgGroup.add(mesh, lines);
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

    // -----------------------------
    // Create the Three JS scene
    // -----------------------------

    // Extract the width and height from the container
    const width = container.value.clientWidth;
    const height = container.value.clientHeight;

    // Create a scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(labColors.slate1);
    scene.add(svgGroup);

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
    controls.maxDistance = 200;
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
