import { onMounted, onUnmounted, Ref } from "vue";
import { ArcRotateCamera, Scene, Engine, Vector3, Color3, Color4, MeshBuilder, HemisphericLight, GroundMesh, Tools, Camera } from "babylonjs";
import { AdvancedDynamicTexture, TextBlock, StackPanel, Control, Button } from "babylonjs-gui";
import { GridMaterial } from "babylonjs-materials";

interface LabSceneOptions {
  useCamera?: boolean;
  useLights?: boolean;
  useRoom?: boolean;
  useOverlay?: boolean;
  useWebXRPlayer?: boolean;
}

export const useCanvatoriumScene = (bjsCanvas: Ref<HTMLCanvasElement | null>, createLabContent: (scene: Scene) => void, options?: LabSceneOptions) => {
  let engine: Engine | null = null;

  const handleResize = () => {
    if (engine) {
      engine.resize();
    }
  };

  onMounted(() => {
    if (bjsCanvas.value) {
      const { engine: createdEngine } = createLabScene(bjsCanvas.value, createLabContent, options);
      engine = createdEngine;
      window.addEventListener("resize", handleResize);
    }
  });

  onUnmounted(() => {
    if (engine) {
      engine.dispose();
    }
    window.removeEventListener("resize", handleResize);
  });
};

const createLabScene = (canvas: HTMLCanvasElement, createLabContent: (scene: Scene) => void, options?: LabSceneOptions) => {
  const engine = new Engine(canvas);
  const scene = new Scene(engine);

  const defaultOptions: LabSceneOptions = {
    useCamera: true,
    useLights: true,
    useRoom: true,
    useOverlay: true,
    useWebXRPlayer: true
  };

  const mergedOptions = { ...defaultOptions, ...options };

  let teleportMeshes: GroundMesh[] = [];

  if (mergedOptions.useCamera) {
    labCreateCamera(canvas, scene);
  }

  if (mergedOptions.useRoom) {
    teleportMeshes.push(labCreateRoom(scene));
  }

  if (mergedOptions.useLights) {
    labCreateLights(scene);
  }

  if (mergedOptions.useOverlay) {
    labCreateOverlay(scene, engine);
  }

  if (mergedOptions.useWebXRPlayer && teleportMeshes.length > 0) {
    lapCreateWebXRPlayer(scene, teleportMeshes);
  }

  createLabContent(scene);

  engine.runRenderLoop(() => {
    scene.render();
  });

  window.addEventListener("resize", () => {
    engine.resize();
  });

  return {
    engine,
    scene
  };
};

const labCreateCamera = (canvas: HTMLCanvasElement, scene: Scene) => {
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

const labCreateRoom = (scene: Scene) => {
  // Add a ground plane to the scene. Used for WebXR teleportation
  const ground = MeshBuilder.CreateGround("ground", { width: 20, height: 20 }, scene);

  // Create the grid material
  const groundMaterial = new GridMaterial("ground-mat", scene);
  groundMaterial.majorUnitFrequency = 5;
  groundMaterial.gridRatio = 1;
  groundMaterial.backFaceCulling = false;
  groundMaterial.lineColor = Color3.FromHexString(labColors.slate8);
  groundMaterial.mainColor = Color3.FromHexString(labColors.slate7);
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

  // Return the ground to use for teleportation
  return ground;
};

const labCreateLights = (scene: Scene) => {
  // Customize the scene lighting and background color
  const ambientLight1 = new HemisphericLight("light-01", new Vector3(5, 5, 5), scene);
  ambientLight1.intensity = 0.8;
  const ambientLight2 = new HemisphericLight("light-02", new Vector3(-5, 5, -5), scene);
  ambientLight2.intensity = 0.8;
  // set the scene color to
  scene.clearColor = Color4.FromHexString(labColors.slate1);
};

const lapCreateWebXRPlayer = async (scene: Scene, teleportMeshes: GroundMesh[]) => {
  const xr = await scene.createDefaultXRExperienceAsync({
    floorMeshes: teleportMeshes
  });

  console.log("xr player created", xr);
};

const labCreateOverlay = (scene: Scene, engine: Engine) => {
  const route = useRoute();
  // Force these to be strings
  const titleText: string = (route.meta.title ?? "Lab Title").toString();

  // Create a BABYLON GUI AdvancedDynamicTexture
  const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("lab-overlay", true, scene);

  const title = new TextBlock();
  title.text = titleText;
  title.color = "black";
  title.fontSize = "18px";
  title.fontWeight = "bold";
  title.textWrapping = true;
  title.paddingTop = "10px";
  title.paddingBottom = "10px";
  title.paddingLeft = "12px";
  title.paddingRight = "12px";
  title.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
  title.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;

  const buttonScreenshotLabel = new TextBlock();
  buttonScreenshotLabel.text = "Screenshot";
  buttonScreenshotLabel.color = "white";
  buttonScreenshotLabel.fontSize = 14;
  buttonScreenshotLabel.paddingTop = "5px";

  const buttonScreenshot = new Button();
  buttonScreenshot.width = "120px";
  buttonScreenshot.height = "60px";
  buttonScreenshot.color = "white";
  buttonScreenshot.background = labColors.slate8;
  buttonScreenshot.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
  buttonScreenshot.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
  buttonScreenshot.paddingTop = "10px";
  buttonScreenshot.paddingBottom = "10px";
  buttonScreenshot.paddingLeft = "12px";
  buttonScreenshot.paddingRight = "12px";
  buttonScreenshot.cornerRadius = 5;
  buttonScreenshot.thickness = 2;
  buttonScreenshot.addControl(buttonScreenshotLabel);

  buttonScreenshot.onPointerClickObservable.add(() => {
    buttonScreenshot.isVisible = false;

    const size = {
      width: engine.getRenderWidth(),
      height: engine.getRenderHeight()
    };
    const currentCamera = scene.activeCamera;
    if (currentCamera) {
      const screenshot = Tools.CreateScreenshot(engine, currentCamera, size);
      console.log("screenshot created", screenshot);
    }
    // wait a few frames for the screenshot to be created before showing the button again
    setTimeout(() => {
      buttonScreenshot.isVisible = true;
    }, 100);
  });

  // Populate the advanced texture
  advancedTexture.addControl(title);
  advancedTexture.addControl(buttonScreenshot);
};