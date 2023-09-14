<script setup>
  import { Vector3, Vector2, MeshBuilder, Quaternion, Color3, PolygonMeshBuilder, StandardMaterial, SixDofDragBehavior, SurfaceMagnetismBehavior } from "babylonjs";
  import * as earcut from "earcut";

  definePageMeta({
    featured: false,
    title: "Lab 054 - MR Plane Detection",
    description: "Based on this Playground: https://playground.babylonjs.com/#98TM63"
  });

  const createLabContent = async (scene) => {
    // Add a custom XR player for AR/MR
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

    const detectedMat = new StandardMaterial("mat", scene);
    detectedMat.diffuseColor = Color3.FromHexString(labColors.slate1);
    detectedMat.alpha = 0.5;

    xrPlanes.onPlaneAddedObservable.add((plane) => {
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

      polygon.createNormals();

      plane.mesh.material = detectedMat;
      // plane.mesh.visibility = 0.2;
      plane.mesh.rotationQuaternion = new Quaternion();
      plane.transformationMatrix.decompose(plane.mesh.scaling, plane.mesh.rotationQuaternion, plane.mesh.position);
    });

    xrPlanes.onPlaneUpdatedObservable.add((plane) => {
      if (plane.mesh) {
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

      plane.mesh.material = detectedMat;
      // plane.mesh.visibility = 0.2;
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

    //controller input
    xr.input.onControllerAddedObservable.add((controller) => {
      controller.onMotionControllerInitObservable.add((motionController) => {
        if (motionController.handness === "left") {
          const xr_ids = motionController.getComponentIds();
          let yButtonComponent = motionController.getComponent(xr_ids[4]); //y-button
          yButtonComponent?.onButtonStateChangedObservable.add(() => {
            if (yButtonComponent.pressed) {
              console.log("Y Button Pressed");
              if (detectedMat.alpha === 0.5) {
                detectedMat.alpha = 0;
              } else {
                detectedMat.alpha = 0.5;
              }
            }
          });
        }
      });
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
