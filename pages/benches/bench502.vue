<script setup>
  import * as THREE from "three";
  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
  import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

  definePageMeta({
    featured: false,
    title: "Bench 502 – Ohio SVG to Three JS",
    description: "Loading an SVG file and converting it to 3D objects in Three JS."
  });

  // A reference to the container element
  const sceneContainer = ref(null);

  // Create the Three JS scene
  const createThreeScene = async (container) => {
    // Load the SVG data from the file: @/data/usa-oh.svg
    const ohioSVG = await fetch("/assets/usa-oh.svg").then((res) => res.text());
    // console.log("SVG", ohioSVG);

    const fillMaterial = new THREE.MeshBasicMaterial({ color: "#F3FBFB" });
    const stokeMaterial = new THREE.LineBasicMaterial({
      color: "#00A5E6"
    });

    const renderSVG = (extrusion, svg) => {
      const loader = new SVGLoader();
      const svgData = loader.parse(svg);
      const svgGroup = new THREE.Group();
      const updateMap = [];

      svgGroup.scale.y *= -1;
      svgData.paths.forEach((path) => {
        const shapes = SVGLoader.createShapes(path);

        shapes.forEach((shape) => {
          const meshGeometry = new THREE.ExtrudeGeometry(shape, {
            depth: extrusion,
            bevelEnabled: false
          });
          const linesGeometry = new THREE.EdgesGeometry(meshGeometry);
          const mesh = new THREE.Mesh(meshGeometry, fillMaterial);
          const lines = new THREE.LineSegments(linesGeometry, stokeMaterial);

          updateMap.push({ shape, mesh, lines });
          svgGroup.add(mesh, lines);
        });
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

      return {
        object: svgGroup,
        update(extrusion) {
          updateMap.forEach((updateDetails) => {
            const meshGeometry = new THREE.ExtrudeBufferGeometry(updateDetails.shape, {
              depth: extrusion,
              bevelEnabled: false
            });
            const linesGeometry = new THREE.EdgesGeometry(meshGeometry);

            updateDetails.mesh.geometry.dispose();
            updateDetails.lines.geometry.dispose();
            updateDetails.mesh.geometry = meshGeometry;
            updateDetails.lines.geometry = linesGeometry;
          });
        }
      };
    };

    // const loader = new SVGLoader();
    // const svgData = loader.parse(ohioSVG);
    // console.log("SVG Data", svgData);

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

    const defaultExtrusion = 1;
    const { object, update } = renderSVG(defaultExtrusion, ohioSVG);
    scene.add(object);

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
