<script setup>
  import * as THREE from "three";
  import { VRButton } from "three/examples/jsm/webxr/VRButton.js";
  import { BoxLineGeometry } from "three/examples/jsm/geometries/BoxLineGeometry.js";

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

    const camera = new THREE.PerspectiveCamera();
    camera.position.set(0, 1.4, 2);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    const room = new THREE.LineSegments(new BoxLineGeometry(20, 10, 20, 20, 10, 20).translate(0, 5, 0), new THREE.LineBasicMaterial({ color: labColors.slate8 }));
    scene.add(room);

    // Create the renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    // Add the XR support and use setAnimationLoop to render the scene instead of requestAnimationFrame
    renderer.xr.enabled = true;
    renderer.setAnimationLoop(function () {
      renderer.render(scene, camera);
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
