import { Scene, MeshBuilder } from "babylonjs";
import { AdvancedDynamicTexture, Rectangle, Button } from "babylonjs-gui";

// A styled 2D GUI card with a plane and ADT
export const canLabCardSimple = (width: number, height: number, scene: Scene) => {
  const plane = MeshBuilder.CreatePlane("lab-card-rect-mesh", { width: width, height: height }, scene);

  const advancedTexture = AdvancedDynamicTexture.CreateForMesh(plane, 1024 * (width / 10), 1024 * (height / 10));
  advancedTexture.name = "lab-card-rect-texture";

  const rect = new Rectangle("rect");
  rect.cornerRadius = 48;
  rect.background = labColors.slate2;
  rect.alpha = 0.9;
  rect.color = labColors.slate8;
  rect.thickness = 2;
  rect.zIndex = -10;
  advancedTexture.addControl(rect);

  return {
    plane,
    advancedTexture
  };
};

// A styped button for 2D GUI
export const canLabButtonSimple = (name: string, label: string) => {
  const button = Button.CreateSimpleButton(name, label);
  button.width = 0.2;
  button.height = "50px";
  button.fontSize = "24px";
  button.color = labColors.slate8;
  button.cornerRadius = 20;
  button.background = labColors.slate2;
  button.thickness = 2;

  return button;
};
