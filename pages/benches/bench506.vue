<script setup>
  import * as THREE from "three";
  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
  import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2.js";
  import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
  import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";
  definePageMeta({
    featured: false,
    title: "Bench 506 – LineSegments2",
    description: "A basic Three JS scene with lights, orbit controls, and a cube."
  });

  // A reference to the container element
  const sceneContainer = ref(null);

  // Create the Three JS scene
  const createThreeScene = (container) => {
    // Extract the width and height from the container
    const width = container.value.clientWidth;
    const height = container.value.clientHeight;

    // Create a scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(labColors.slate1);

    // Create a camera
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 5, 10);

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

    // Create a cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: labColors.slate3 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 1, 0);
    scene.add(cube);

    // Create a line using LineSegments2
    const edges = new THREE.EdgesGeometry(geometry);
    const lineGeometry = new LineSegmentsGeometry().fromEdgesGeometry(edges);
    const lineMaterial = new LineMaterial({ color: "aqua", linewidth: 4 });
    const edgesLines = new LineSegments2(lineGeometry, lineMaterial);
    cube.add(edgesLines);

    // Create the renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height); // TODO: This isn't working!
    renderer.setPixelRatio(window.devicePixelRatio);

    // Add the automatically created <canvas> element to the page
    container.value.append(renderer.domElement);

    // Render the scene
    const runScene = () => {
      requestAnimationFrame(runScene);

      //   cube.rotation.y += 0.01;
      lineMaterial.resolution.set(innerWidth, innerHeight);
      //   console.log(innerWidth, innerHeight);

      renderer.render(scene, camera);
    };

    runScene();
  };

  // Create the scene when the component is mounted
  onMounted(() => {
    if (sceneContainer.value) {
      createThreeScene(sceneContainer);
    }
  });
</script>

<template>
  <div id="sceneContainer" ref="sceneContainer"></div>
</template>
