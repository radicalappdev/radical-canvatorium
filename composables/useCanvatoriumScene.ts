import { onMounted, onUnmounted, Ref } from "vue";
import { ArcRotateCamera, Scene, Engine, Vector3, Color3, Color4, MeshBuilder, HemisphericLight, GroundMesh, Tools, Camera } from "babylonjs";
import { AdvancedDynamicTexture, TextBlock, StackPanel, Control, Button, Rectangle } from "babylonjs-gui";
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
  const descriptionText: string = (route.meta.description ?? "Lab Description").toString();

  // Create a BABYLON GUI AdvancedDynamicTexture
  const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("lab-overlay", true, scene);

  const headerBackground = new Rectangle();
  headerBackground.width = "100%";
  headerBackground.height = "70px";
  headerBackground.background = labColors.slate2;
  headerBackground.alpha = 0.5;
  headerBackground.zIndex = -10;
  headerBackground.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
  headerBackground.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
  advancedTexture.addControl(headerBackground);

  const header = new StackPanel();
  header.width = "100%";
  header.height = "70px";
  header.isVertical = false;
  header.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
  header.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;

  // Create header container
  const headerLeft = new StackPanel();
  headerLeft.width = "80%";
  headerLeft.height = "70px";
  headerLeft.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
  headerLeft.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;

  // Create header right container
  const headerRight = new StackPanel();
  headerRight.width = "20%";
  headerRight.height = "70px";
  // headerRight.background = labColors.slate6;
  headerRight.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
  headerRight.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;

  // Create Canvatorium Text
  const canvatoriumText = new TextBlock();
  canvatoriumText.text = "Canvatorium (revamped)";
  canvatoriumText.color = labColors.slate8;
  canvatoriumText.fontSize = "18px";
  canvatoriumText.fontWeight = "bold";
  canvatoriumText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
  canvatoriumText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
  canvatoriumText.height = "40px";
  canvatoriumText.paddingLeft = "10px";

  // Create header text
  const headerText = new TextBlock();
  headerText.text = titleText;
  headerText.color = labColors.slate8;
  headerText.fontSize = "16px";
  headerText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
  headerText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
  headerText.height = "30px";
  headerText.paddingLeft = "10px";
  headerText.paddingRight = "10px";

  // Create a button for About
  const buttonAbout = Button.CreateSimpleButton("button-about", " ? ");
  buttonAbout.width = "50px";
  buttonAbout.height = "50px";
  buttonAbout.color = "white";
  buttonAbout.fontSize = "16px";
  buttonAbout.background = labColors.slate8;
  buttonAbout.cornerRadius = 5;
  buttonAbout.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
  buttonAbout.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
  buttonAbout.paddingRight = "10px";
  buttonAbout.paddingTop = "10px";
  buttonAbout.onPointerClickObservable.add(() => {
    console.log("About button clicked");
  });

  advancedTexture.addControl(header);
  header.addControl(headerLeft);
  header.addControl(headerRight);
  headerLeft.addControl(canvatoriumText);
  headerLeft.addControl(headerText);
  headerRight.addControl(buttonAbout);

  // Create a panel for the main content
  const infoPanel = new StackPanel();
  infoPanel.width = "80%";
  infoPanel.height = "80%";
  infoPanel.isVertical = true;
  infoPanel.background = labColors.slate1;
  // infoPanel.alpha = 0.5;

  advancedTexture.addControl(infoPanel);

  // Add a description
  const description = new TextBlock();
  description.text = descriptionText;
  description.height = "100px";
  description.color = "black";
  description.paddingTop = "10px";
  description.paddingLeft = "10px";
  description.paddingRight = "10px";
  description.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
  description.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
  description.fontSize = "14px";
  description.textWrapping = true;

  infoPanel.addControl(headerText.clone());
  infoPanel.addControl(description);

  // Add the header and description to the panel
  // innerPanel.addControl(title);
  // innerPanel.addControl(description);

  // Add the panel to the outer panel
  // outerPanel.addControl(innerPanel);

  // Create a footer stack panel
  const footer = new StackPanel();
  footer.width = "100%";
  footer.height = "50px";
  footer.isVertical = false;
  footer.background = labColors.slate2;
  footer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
  footer.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;

  const buttonAllLabs = Button.CreateSimpleButton("button-all-labs", "All Labs");
  buttonAllLabs.width = "100px";
  buttonAllLabs.height = "40px";
  buttonAllLabs.color = "white";
  buttonAllLabs.background = labColors.slate8;
  buttonAllLabs.fontSize = "14px";
  buttonAllLabs.cornerRadius = 5;
  buttonAllLabs.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
  buttonAllLabs.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
  buttonAllLabs.onPointerClickObservable.add(() => {
    console.log("button-all-labs clicked");
  });

  const buttonFeatured = Button.CreateSimpleButton("button-featured", "Featured");
  buttonFeatured.width = "100px";
  buttonFeatured.height = "40px";
  buttonFeatured.color = "white";
  buttonFeatured.background = labColors.slate8;
  buttonFeatured.fontSize = "14px";
  buttonFeatured.cornerRadius = 5;
  buttonFeatured.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
  buttonFeatured.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
  buttonFeatured.onPointerClickObservable.add(() => {
    console.log("button-featured clicked");
  });

  const buttonScreenshot = Button.CreateSimpleButton("button-screenshot", "Screenshot");
  buttonScreenshot.width = "100px";
  buttonScreenshot.height = "40px";
  buttonScreenshot.color = "white";
  buttonScreenshot.background = labColors.slate8;
  buttonScreenshot.fontSize = "14px";
  buttonScreenshot.cornerRadius = 5;
  buttonScreenshot.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
  buttonScreenshot.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;

  buttonScreenshot.onPointerClickObservable.add(() => {
    buttonScreenshot.isVisible = false;
    footer.addControl(buttonScreenshot);
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

  advancedTexture.addControl(footer);
  footer.addControl(buttonFeatured);
  footer.addControl(buttonAllLabs);
  footer.addControl(buttonScreenshot);
};
