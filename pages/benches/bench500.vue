<script setup>
  import * as THREE from "three";
  definePageMeta({
    featured: false,
    title: "Bench 500 – Hello Canvatorium + Three JS",
    description: "This the first lab using Three JS.",
    labNotes: `Welcome to Canvatorium Lab 500.
  `
  });

  const sceneContainer = ref(null);

  const createThreeScene = (container) => {
    // Extract the width and height from the container
    const width = container.value.clientWidth;
    const height = container.value.clientHeight;

    const scene = new THREE.Scene();

    scene.background = new THREE.Color("#eeeeee");

    // Create a camera
    const fov = 35; // AKA Field of View
    const aspect = width / height;
    const near = 0.1; // the near clipping plane
    const far = 100; // the far clipping plane

    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 0, 10);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: "#cecece" });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // create the renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height); // TODO: This isn't working!
    renderer.setPixelRatio(window.devicePixelRatio);

    // add the automatically created <canvas> element to the page
    container.value.append(renderer.domElement);

    function animate() {
      requestAnimationFrame(animate);

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render(scene, camera);
    }

    animate();
  };

  onMounted(() => {
    console.log("onMounted", sceneContainer);
    createThreeScene(sceneContainer);
    if (sceneContainer.value) {
      console.log("sceneContainer.value", sceneContainer.value);
    }
  });
</script>

<template>
  <div id="sceneContainer" ref="sceneContainer"></div>
</template>
