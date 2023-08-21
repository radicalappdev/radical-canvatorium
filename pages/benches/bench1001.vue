<script setup>
  import * as THREE from "three";
  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
  definePageMeta({
    featured: false,
    title: "Bench 1001 – Three JS Lines",
    description: "A basic Three JS scene with lights, orbit controls, and a lines."
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

    //  Create a line
    const material = new THREE.LineBasicMaterial({ color: labColors.red, linecap: "round", linejoin: "round" });

    const points = [];
    points.push(new THREE.Vector3(-1, 0, 0));
    points.push(new THREE.Vector3(0, 1, 0));
    points.push(new THREE.Vector3(1, 0, 0));
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    line.position.set(0, 1, 0);
    scene.add(line);

    // Create the renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height); // TODO: This isn't working!
    renderer.setPixelRatio(window.devicePixelRatio);

    // Add the automatically created <canvas> element to the page
    container.value.append(renderer.domElement);

    // Render the scene
    const runScene = () => {
      requestAnimationFrame(runScene);

      // Create an animation to move the first and last points of the line
      const time = Date.now() * 0.001;
      line.geometry.attributes.position.setXYZ(0, Math.sin(time) * 1, Math.cos(time) * 1, 0);
      line.geometry.attributes.position.setXYZ(2, Math.sin(time + 1) * 1, Math.cos(time + 1) * 1, 0);
      line.geometry.attributes.position.needsUpdate = true;

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
