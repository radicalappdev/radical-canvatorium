<script lang="ts" setup>
  import {
    Scene,
    Vector3,
    Vector2,
    MeshBuilder,
    Quaternion,
    Color3,
    PolygonMeshBuilder,
    StandardMaterial,
    SixDofDragBehavior,
    SurfaceMagnetismBehavior,
    AxisDragGizmo,
    UtilityLayerRenderer,
    WebXRPlaneDetector
  } from "@babylonjs/core";
  import earcut from "earcut";
  window.earcut = earcut;

  definePageMeta({
    featured: false,
    title: "Lab 055 - MR Plane Detection + Surface Magnetism Behavior",
    description: "This lab expands on Lab 054 and Lab 017 to create a simple scene where I can drag an object around, snapping it to a wall when releasing it."
  });

  const createLabContent = async (scene: Scene) => {
    const detectedMat = new StandardMaterial("mat", scene);
    detectedMat.diffuseColor = Color3.FromHexString(labColors.slate1);
    detectedMat.alpha = 0;

    // Create the subject of the lab - the object that will be dragged around
    const subjectMat = new StandardMaterial("grab-mat4", scene);
    subjectMat.diffuseColor = Color3.FromHexString(labColors.purple);
    subjectMat.specularColor = new Color3(0.2, 0.2, 0.2);
    const subject = MeshBuilder.CreateBox("subject", {
      height: 0.6,
      width: 1,
      depth: 0.05
    });
    subject.material = subjectMat;
    subject.position = new Vector3(0, 1.15, 0);
    subject.scaling = new Vector3(0.4, 0.4, 0.4);

    const surfaceMagnetismBehavior = new SurfaceMagnetismBehavior();
    surfaceMagnetismBehavior.keepOrientationVertical = false;
    subject.addBehavior(surfaceMagnetismBehavior);

    const sixDofDragBehavior = new SixDofDragBehavior();
    sixDofDragBehavior.allowMultiPointer = true;
    // When this is enabled, the subject will update based on pointer events
    surfaceMagnetismBehavior.enabled = true;

    sixDofDragBehavior.onDragStartObservable.add(() => {
      surfaceMagnetismBehavior.enabled = true;
      detectedMat.alpha = 0.5;
    });
    sixDofDragBehavior.onDragEndObservable.add(() => {
      surfaceMagnetismBehavior.enabled = false;
      detectedMat.alpha = 0;
    });

    subject.addBehavior(sixDofDragBehavior);

    // Create utility layer the positionGizmo will be rendered on
    const utilLayer = new UtilityLayerRenderer(scene);

    // Attach a Z axis drag gizmo to the box, just to show the orientation
    var gizmo = new AxisDragGizmo(new Vector3(0, 0, -1), Color3.FromHexString("#8854d0"), utilLayer);
    gizmo.scaleRatio = 1;
    gizmo.updateGizmoRotationToMatchAttachedMesh = true;
    gizmo.updateGizmoPositionToMatchAttachedMesh = true;
    gizmo.attachedMesh = subject;
    gizmo.snapDistance = 0.1;

    // Add  a custom XR player for AR/MR
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
      // plane.mesh.visibility = 0.2;
      plane.mesh.rotationQuaternion = new Quaternion();
      plane.transformationMatrix.decompose(plane.mesh.scaling, plane.mesh.rotationQuaternion, plane.mesh.position);
      surfaceMagnetismBehavior.meshes.push(plane.mesh);
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
      plane.mesh.rotationQuaternion = new Quaternion();
      plane.transformationMatrix.decompose(plane.mesh.scaling, plane.mesh.rotationQuaternion, plane.mesh.position);
      surfaceMagnetismBehavior.meshes.push(plane.mesh);
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
      subject.position = new Vector3(0, 1.15, 0.5);
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
