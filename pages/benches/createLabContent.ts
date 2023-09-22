import { Scene, Vector3, MeshBuilder, Mesh } from "babylonjs";
import projectData from "@/data/project-timeline.json";

export const createLabContent = async (scene: Scene) => {
  // const cam = scene.getCameraByName("camera");
  // cam.setTarget(new Vector3(0, 0, 0));
  // cam.position = new Vector3(0, 5, -6);
  // Project data contains an array of objects with date, title, and type.
  // Get the earliest and latest dates to calculate the range of the timeline.
  const dateStart = projectData.reduce((a, b) => (a.date < b.date ? a : b)).date;
  const dateEnd = projectData.reduce((a, b) => (a.date > b.date ? a : b)).date;

  console.log(dateStart, dateEnd);

  const timelineMaterial = new StandardMaterial("timeline-material", scene);

  // create a Babylon JS tube that will represent the timeline
  const timeline = MeshBuilder.CreateTube(
    "tube",
    {
      path: [new Vector3(-2.5, 0, 0), new Vector3(2.5, 0, 0)],
      radius: 0.05,
      sideOrientation: Mesh.DOUBLESIDE,
      updatable: true
    },
    scene
  );
};
