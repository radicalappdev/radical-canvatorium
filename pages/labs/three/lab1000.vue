<script setup>
  import * as THREE from "three";
  import { VRButton } from "three/examples/jsm/webxr/VRButton.js";

  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
  import { Vector3 } from "babylonjs";
  definePageMeta({
    featured: false,
    title: "Lab 1000 – Hello Canvatorium + Three JS",
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

    // add the camera to a group
    const cameraGroup = new THREE.Group();
    cameraGroup.add(camera);
    cameraGroup.position.set(0, 0, 2); // position the camera group will impact the XR camera
    scene.add(cameraGroup);

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

    // Create the renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height); // TODO: This isn't working!
    renderer.setPixelRatio(window.devicePixelRatio);
    // Add the XR support
    renderer.xr.enabled = true;
    renderer.setAnimationLoop(function () {
      renderer.render(scene, camera);
    });
    document.body.appendChild(VRButton.createButton(renderer));

    // position the XR player / camera 2 meters away from the origin

    // Add the automatically created <canvas> element to the page
    container.value.append(renderer.domElement);
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
