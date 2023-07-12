import { Scene, MeshBuilder } from "babylonjs";
import { AdvancedDynamicTexture, Rectangle } from "babylonjs-gui";

// This will be a reusable asset that I can use in other labs
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
