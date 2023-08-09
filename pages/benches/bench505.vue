<script setup>
  import * as THREE from "three";
  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
  import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2.js";
  import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
  import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";
  import sampleData from "@/data/ohio-demo-01.json";

  definePageMeta({
    featured: false,
    title: "Bench 505 – SVG to Three JS with LineSegments2",
    description: "I haven't been able to get LineSegments2 to work with extruded geometry in this file, but it works in bench506"
  });

  // Create the Three JS scene
  const createThreeScene = async (container) => {
    const colors = ["#ffffff", "#e1f5ff", "#c8ecff", "#a4dcff", "#8fd4ff", "#68b6eb", "#40a8e0", "#1168a7", "#1b75bc", "#2d90d1"];
    const numberOfSegments = colors.length;
    const heightFactor = 1;

    const lineMaterial2 = new LineMaterial({ color: "aqua", linewidth: 4 });

    // Create an instance of the ChoroplethSegmenter class
    const choroplethSegmenter = new ChoroplethSegmenter(sampleData, numberOfSegments);

    const svg = await fetch("/assets/usa-oh.svg").then((res) => res.text());

    const pathsArray = extractSVG_three(svg);
    console.log("Paths Array", pathsArray);

    function extrudePath(path) {
      const id = path.id;
      const entry = sampleData.find((entry) => entry.countyName === id);
      const value = entry.value;
      const num = choroplethSegmenter.getSegment(value);
      const color = colors[num - 1];
      const depth = num / heightFactor + 1;

      const points = path.points;
      const fillMaterial = new THREE.MeshStandardMaterial({ color: color });
      fillMaterial.emissive = new THREE.Color(color);
      fillMaterial.emissiveIntensity = 0.4;

      // Create extrude mesh
      const meshGeometry = new THREE.ExtrudeGeometry(points, {
        depth: depth,
        bevelEnabled: false
      });
      const mesh = new THREE.Mesh(meshGeometry, fillMaterial);

      // Create lines - this isn't rendering
      const edges = new THREE.EdgesGeometry(meshGeometry);
      const lineGeometry = new LineSegmentsGeometry().fromEdgesGeometry(edges);
      const lines = new LineSegments2(lineGeometry, lineMaterial2);

      console.log("lines", lines); // I can see lines in the console, but they aren't rendering

      return { mesh, lines };
    }

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
    scene.background = new THREE.Color(labColors.slate6);
    scene.add(svgGroup);

    // Create a camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(2.5, 15, 18);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    directionalLight.intensity = 0.5;
    scene.add(directionalLight);

    // Add orbit controls
    const controls = new OrbitControls(camera, container.value);
    controls.target.set(0, 0, 0);
    controls.maxPolarAngle = Math.PI / 2;
    controls.minPolarAngle = 0;
    controls.maxDistance = 90;
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

      lineMaterial2.resolution.set(innerWidth, innerHeight);

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
