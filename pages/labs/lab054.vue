<script setup>
  import { Vector3, Vector2, Color4, Quaternion, Color3, PolygonMeshBuilder, StandardMaterial, SixDofDragBehavior, SurfaceMagnetismBehavior } from "babylonjs";
  import * as earcut from "earcut";
  import computingData from "@/data/computing.json";

  definePageMeta({
    featured: false,
    title: "Lab 054 - MR Plane Detection",
    description: ""
  });

  const createLabContent = async (scene) => {
    // Data and state at parent scope
    const activeIndex = ref(0);
    const activeRecord = computed(() => computingData[activeIndex.value]);

    // Position the non-VR camera to better see the card
    const cam = scene.getCameraByName("camera");
    cam.position = new Vector3(0, 1.4, -2);
    scene.clearColor = Color4.FromHexString(labColors.slate1);

    // Create a window group object
    const windowGroupMesh = canLabWindowGroup(scene);
    // windowGroupMesh.scaling = new Vector3(0.06, 0.06, 0.06);

    // Create a toolbar for the window. This can be found in lab-examples.js
    const toolbarMesh = exampleToolbar(activeIndex, computingData, scene);
    toolbarMesh.parent = windowGroupMesh;
    toolbarMesh.position = new Vector3(3, 0, -0.05);

    // Create the main content card. This can be found in lab-examples.js
    const { contentMesh } = exampleContent(activeRecord, scene);
    contentMesh.parent = windowGroupMesh;
    contentMesh.position = new Vector3(0, 2.7, 0);

    // Add  a custom XR player for AR/MR
    const xr = await scene.createDefaultXRExperienceAsync({
      uiOptions: {
        sessionMode: "immersive-ar"
      },
      optionalFeatures: true
    });

    // WebXR Plane Detection: https://playground.babylonjs.com/#98TM63

    const fm = xr.baseExperience.featuresManager;

    const xrPlanes = fm.enableFeature(BABYLON.WebXRPlaneDetector.Name, "latest");

    const planes = [];

    xrPlanes.onPlaneAddedObservable.add((plane) => {
      console.log("plane added", plane);
      plane.polygonDefinition.push(plane.polygonDefinition[0]);
      var polygon_triangulation = new PolygonMeshBuilder(
        "name",
        plane.polygonDefinition.map((p) => new Vector2(p.x, p.z)),
        scene,
        earcut
      );
      var polygon = polygon_triangulation.build(false, 0.01);
      plane.mesh = polygon;
      planes[plane.id] = plane.mesh;
      const mat = new StandardMaterial("mat", scene);
      mat.alpha = 0.8;
      // pick a random color
      mat.diffuseColor = Color3.Random();
      polygon.createNormals();
      plane.mesh.material = mat;

      plane.mesh.rotationQuaternion = new Quaternion();
      plane.transformationMatrix.decompose(plane.mesh.scaling, plane.mesh.rotationQuaternion, plane.mesh.position);
    });

    xrPlanes.onPlaneUpdatedObservable.add((plane) => {
      let mat;
      if (plane.mesh) {
        // keep the material, dispose the old polygon
        mat = plane.mesh.material;
        plane.mesh.dispose(false, false);
      }
      const some = plane.polygonDefinition.some((p) => !p);
      if (some) {
        return;
      }
      plane.polygonDefinition.push(plane.polygonDefinition[0]);
      var polygon_triangulation = new PolygonMeshBuilder(
        "name",
        plane.polygonDefinition.map((p) => new Vector2(p.x, p.z)),
        scene,
        earcut
      );
      var polygon = polygon_triangulation.build(false, 0.01);
      polygon.createNormals();
      plane.mesh = polygon;
      planes[plane.id] = plane.mesh;
      plane.mesh.material = mat;
      plane.mesh.rotationQuaternion = new Quaternion();
      plane.transformationMatrix.decompose(plane.mesh.scaling, plane.mesh.rotationQuaternion, plane.mesh.position);
    });

    xrPlanes.onPlaneRemovedObservable.add((plane) => {
      if (plane && planes[plane.id]) {
        planes[plane.id].dispose();
      }
    });

    xr.baseExperience.sessionManager.onXRSessionInit.add(() => {
      planes.forEach((plane) => plane.dispose());
      while (planes.pop()) {}
    });

    console.log("xr player created by lab 053", xr);

    xr.baseExperience.onInitialXRPoseSetObservable.add((xrCamera) => {
      console.log("Entering Immersive Mode with camera", xrCamera.position, windowGroupMesh);
      windowGroupMesh.position = new Vector3(0, 1.1, 0.5);
      windowGroupMesh.scaling = new Vector3(0.06, 0.06, 0.06);
    });
  };

  const bjsCanvas = ref(null);

  const labSceneOptions = {
    useRoom: false,
    useWebXRPlayer: false
  };

  useCanvatoriumScene(bjsCanvas, createLabContent, labSceneOptions);
</script>

<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
