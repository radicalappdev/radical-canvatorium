<script lang="ts" setup>
  import { Scene, Vector3, MeshBuilder, Mesh, StandardMaterial, Color3, ActionManager, ExecuteCodeAction, Animation, ArcRotateCamera } from "babylonjs";
  import projectData from "@/data/project-timeline.json";

  definePageMeta({
    featured: false,
    title: "Bench 005 – Timeline Concept",
    description: ""
  });

  const createLabContent = async (scene: Scene) => {
    const cam = scene.getCameraByName("camera") as ArcRotateCamera;

    // cam.setTarget(new Vector3(0, 0, 0));
    // cam.position = new Vector3(0, 5, -6);

    // Project data contains an array of objects with date, title, and type.
    // Get the earliest and latest dates to calculate the range of the timeline.
    // Get these as dates so we can use them to calculate the number of days between them.
    const dateStart = new Date(projectData[0].date);
    const dateEnd = new Date(projectData[projectData.length - 1].date);
    console.log(dateStart, dateEnd);

    // for each day, clone the tube mesh and move it along the x-axis
    const day = 24 * 60 * 60 * 1000;
    const dayCount = Math.round((dateEnd.getTime() - dateStart.getTime()) / day);
    console.log(dayCount);

    const timelineMaterial = new StandardMaterial("timeline-material", scene);
    timelineMaterial.diffuseColor = Color3.FromHexString(labColors.slate8);
    timelineMaterial.specularColor = new Color3(0.2, 0.2, 0.2);

    // timeline: an array of tube meshes where each one represents a day
    // Create one tube mesh , then clone it for each day and move it along the x-axis
    // The tube mesh is created with a radius of 0.1 and a thickness of 0.05

    const timeline = new Mesh("timeline", scene);
    const tube = MeshBuilder.CreateTube(
      "tube",
      { path: [new Vector3(0, 0, 0), new Vector3(0.05, 0, 0)], radius: 0.05, tessellation: 16, cap: Mesh.CAP_ALL, updatable: true },
      scene
    );
    tube.material = timelineMaterial;

    for (let i = 0; i < dayCount; i++) {
      const clone = tube.clone();
      timeline.addChild(clone);
      // set the clone name to the date it represents
      clone.name = new Date(dateStart.getTime() + i * day).toISOString().split("T")[0];
      clone.position.x = i * 0.05;
      clone.actionManager = new ActionManager(scene);
      clone.actionManager.registerAction(
        new ExecuteCodeAction(
          {
            trigger: ActionManager.OnPointerOverTrigger,
            parameter: clone
          },
          () => {
            console.log("date", clone.name);
            Animation.CreateAndStartAnimation("scale-up", clone, "scaling", 60, 6, clone.scaling, new Vector3(1, 2, 2), 0);
          }
        )
      );
      clone.actionManager.registerAction(
        new ExecuteCodeAction(
          {
            trigger: ActionManager.OnPointerOutTrigger,
            parameter: clone
          },
          () => {
            Animation.CreateAndStartAnimation("scale-down", clone, "scaling", 60, 6, clone.scaling, new Vector3(1, 1, 1), 0);
          }
        )
      );
    }

    // position the timeline so it's centered on the x-axis
    timeline.position.x = -dayCount * 0.05 * 0.5;
    console.log(timeline.position.x);

    if (cam) {
      cam.setTarget(timeline);
      cam.useFramingBehavior = true;
    }
  };

  // If a lab uses the default options, you can just call useBabylonScene() with the bjsCanvas ref and the createLabContent function.
  // Otherwise, you can pass in an options object with the following properties:
  const labSceneOptions = {
    useCamera: true,
    useLights: true,
    useRoom: false,
    useOverlay: false,
    useWebXRPlayer: false
  };

  const bjsCanvas = ref(null);
  // With scene options
  useCanvatoriumScene(bjsCanvas, createLabContent, labSceneOptions);

  // Without scene options (see lab001 for an example)
  // useCanvatoriumScene(bjsCanvas, createLabContent);
</script>
<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
