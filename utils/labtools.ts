import { ArcRotateCamera, Scene, Vector3, Color3, MeshBuilder } from "babylonjs";
import { GridMaterial } from "babylonjs-materials";

export const labCreateCamera = (canvas: HTMLCanvasElement, scene: Scene) => {
  // Add an ArcRotateCamera to the scene and attach it to the canvas
  // ArcRotateCamera is used to rotate the camera around the scene when not using WebXR
  const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new Vector3(0, 0, 0), scene);
  camera.wheelDeltaPercentage = 0.01;
  camera.upperBetaLimit = Math.PI / 1.5;
  camera.lowerRadiusLimit = 2;
  camera.upperRadiusLimit = 128;
  camera.setPosition(new Vector3(0, 3.5, -6));
  camera.setTarget(new Vector3(0, 1, 0));
  camera.attachControl(canvas, true);
};

const LabColors = {
  purple: Color3.FromHexString("#8854d0"),
  blue: Color3.FromHexString("#3867d6"),
  teal: Color3.FromHexString("#2d98da"),
  cyan: Color3.FromHexString("#0fb9b1"),

  green: Color3.FromHexString("#20bf6b"),
  yellow: Color3.FromHexString("#f7b731"),
  orange: Color3.FromHexString("#fa8231"),
  red: Color3.FromHexString("#eb3b5a"),

  dark1: Color3.FromHexString("#2a323e"),
  dark2: Color3.FromHexString("#3e4a5d"),
  dark3: Color3.FromHexString("#49576c"),
  dark4: Color3.FromHexString("#53637b"),

  light1: Color3.FromHexString("#a5b1c2"),
  light2: Color3.FromHexString("#b4becc"),
  light3: Color3.FromHexString("#c3cbd7"),
  light4: Color3.FromHexString("#d3d9e1")
};

export const labCreateRoom = (scene: Scene) => {
  // Add a ground plane to the scene. Used for WebXR teleportation
  const ground = MeshBuilder.CreateGround("ground", { width: 20, height: 20 }, scene);

  // Create the grid material
  const groundMaterial = new GridMaterial("ground-mat", scene);
  groundMaterial.majorUnitFrequency = 5;
  groundMaterial.gridRatio = 1;
  groundMaterial.backFaceCulling = false;
  groundMaterial.mainColor = LabColors.light1;
  groundMaterial.lineColor = new Color3(1.0, 1.0, 1.0);
  groundMaterial.opacity = 0.98;

  // Assign the material to the ground mesh
  ground.material = groundMaterial;

  // Create 4 walls around the room with the same material
  const wall1 = MeshBuilder.CreatePlane("wall1", { width: 20, height: 10 }, scene);
  wall1.position = new Vector3(-10, 5, 0);
  wall1.rotation.y = Math.PI / 2;
  wall1.material = groundMaterial;

  const wall2 = MeshBuilder.CreatePlane("wall2", { width: 20, height: 10 }, scene);
  wall2.position = new Vector3(0, 5, 10);
  wall2.rotation.y = Math.PI;
  wall2.material = groundMaterial;

  const wall3 = MeshBuilder.CreatePlane("wall3", { width: 20, height: 10 }, scene);
  wall3.position = new Vector3(10, 5, 0);
  wall3.rotation.y = -Math.PI / 2;
  wall3.material = groundMaterial;

  const wall4 = MeshBuilder.CreatePlane("wall4", { width: 20, height: 10 }, scene);
  wall4.position = new Vector3(0, 5, -10);
  wall4.material = groundMaterial;
};
