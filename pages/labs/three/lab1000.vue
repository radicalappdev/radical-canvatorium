<script setup>
  import * as THREE from "three";
  import { VRButton } from "three/examples/jsm/webxr/VRButton.js";
  import { BoxLineGeometry } from "three/examples/jsm/geometries/BoxLineGeometry.js";
  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

  definePageMeta({
    featured: false,
    title: "Lab 1000 – Hello Three JS",
    description: "A basic Three JS scene."
  });

  // A reference to the container element
  const sceneContainer = ref(null);

  // Create the Three JS scene
  const createThreeScene = (container) => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(labColors.slate1);

    const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 1.4, 4);

    // add the camera to a group
    const cameraGroup = new THREE.Group();
    cameraGroup.add(camera);
    cameraGroup.position.set(0, 0, 0); // position the camera group will impact the XR camera
    scene.add(cameraGroup);

    // Add orbit controls
    const controls = new OrbitControls(camera, container.value);
    controls.target.set(0, 1, 0);
    controls.maxPolarAngle = Math.PI / 2;
    controls.minPolarAngle = 0;
    controls.maxDistance = 10;
    controls.minDistance = 1;
    controls.update();

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    const room = new THREE.LineSegments(new BoxLineGeometry(20, 10, 20, 20, 10, 20).translate(0, 5, 0), new THREE.LineBasicMaterial({ color: labColors.slate8 }));
    scene.add(room);

    // Create a cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: labColors.slate3 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 0.25, 0);
    cube.scale.set(0.5, 0.5, 0.5);
    scene.add(cube);

    // Create the renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    // Add the XR support and use setAnimationLoop to render the scene instead of requestAnimationFrame
    renderer.xr.enabled = true;
    renderer.xr.setFoveation(0);

    renderer.setAnimationLoop(function () {
      renderer.render(scene, camera);
    });

    // on session enter
    renderer.xr.addEventListener("sessionstart", () => {
      console.log("sessionstart");
      renderer.xr.setFoveation(0); // this was being set to 1 for some reason
      cameraGroup.position.set(2, 0, 2);
    });

    // on session end
    renderer.xr.addEventListener("sessionend", () => {
      console.log("sessionend");
      cameraGroup.position.set(0, 1.4, 4);
    });

    // Add the automatically created <canvas> element to the page
    container.value.append(renderer.domElement);
    document.body.appendChild(VRButton.createButton(renderer));

    const resize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
    };

    window.addEventListener("resize", resize);
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
