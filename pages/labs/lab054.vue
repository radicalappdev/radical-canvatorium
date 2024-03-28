<script lang="ts" setup>
  import { Scene, Vector2, Vector3, Quaternion, Color3, PolygonMeshBuilder, StandardMaterial, WebXRPlaneDetector } from "@babylonjs/core";
  import earcut from "earcut";
  window.earcut = earcut;

  definePageMeta({
    featured: false,
    title: "Lab 054 - MR Plane Detection",
    description: "Render any detected surface as a plane. Based on this Playground: https://playground.babylonjs.com/#98TM63"
  });

  const title = "Lab 054 - MR Plane Detection";
  const description = `When entering AR mode, the app will detect surfaces in the environment and render them as planes.

On Meta Quest devices this works based on your "Room Setup" data.

Press Y on the controller to toggle the planes.`;

  const createLabContent = async (scene: Scene) => {
    // Create a window group object
    const windowGroupMesh = canLabWindowGroup(scene);
    windowGroupMesh.scaling = new Vector3(0.6, 0.6, 0.6);

    // Create the main window and hide it
    const { contentMesh } = exampleLabCard(title, description, scene);
    contentMesh.parent = windowGroupMesh;
    contentMesh.position = new Vector3(0, 1.8, 0);
    contentMesh.isPickable = false;

    // Add a custom XR player for AR/MR
    const xr = await scene.createDefaultXRExperienceAsync({
      uiOptions: {
        sessionMode: "immersive-ar"
      },
      optionalFeatures: true
    });

    // WebXR Plane Detection: https://playground.babylonjs.com/#98TM63

    const fm = xr.baseExperience.featuresManager;
    const xrPlanes = fm.enableFeature(WebXRPlaneDetector.Name, "latest") as WebXRPlaneDetector;
    const planes: any[] = [];

    const detectedMat = new StandardMaterial("mat", scene);
    detectedMat.diffuseColor = Color3.FromHexString(labColors.slate1);
    detectedMat.alpha = 0.5;

    xrPlanes.onPlaneAddedObservable.add((plane: any) => {
      plane.polygonDefinition.push(plane.polygonDefinition[0]);
      var polygon_triangulation = new PolygonMeshBuilder(
        "name",
        plane.polygonDefinition.map((p: Vector3) => new Vector2(p.x, p.z)),
        scene,
        earcut
      );
      var polygon = polygon_triangulation.build(false, 0.01);
      plane.mesh = polygon;
      planes[plane.id] = plane.mesh;

      polygon.createNormals(false);

      plane.mesh.material = detectedMat;
      plane.mesh.rotationQuaternion = new Quaternion();
      plane.transformationMatrix.decompose(plane.mesh.scaling, plane.mesh.rotationQuaternion, plane.mesh.position);
    });

    xrPlanes.onPlaneUpdatedObservable.add((plane: any) => {
      if (plane.mesh) {
        plane.mesh.dispose(false, false);
      }
      const some = plane.polygonDefinition.some((p: Vector3) => !p);
      if (some) {
        return;
      }
      plane.polygonDefinition.push(plane.polygonDefinition[0]);
      var polygon_triangulation = new PolygonMeshBuilder(
        "name",
        plane.polygonDefinition.map((p: Vector3) => new Vector2(p.x, p.z)),
        scene,
        earcut
      );
      var polygon = polygon_triangulation.build(false, 0.01);
      polygon.createNormals(false);
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

    xr.baseExperience.onInitialXRPoseSetObservable.add((xrCamera) => {
      console.log("Entering Immersive Mode with camera", xrCamera.position, windowGroupMesh);
      // Reposition the window group to be in front of the camera - hard coded for now
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
