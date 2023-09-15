import { Scene, MeshBuilder, Vector3, SixDofDragBehavior } from "babylonjs";
import { AdvancedDynamicTexture, Rectangle, Button, Control, TextBlock, Slider, Checkbox } from "babylonjs-gui";

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

export const canLabWindowGroup = (scene: Scene) => {
  // --------------------------
  // Create a window group object. This is a parent object that will contain the window and toolbar planes, and any other objects we want to add to the window
  // TODO: I may need to name these dynamically so that I can find them later in the node graph
  // TODO: Remove the call to canLabCardSimple and create the mesh and ADT manually so I can customize them
  // --------------------------
  const { plane: windowGroupMesh, advancedTexture: windowGroupTexture } = canLabCardSimple(2, 0.8, scene);
  windowGroupMesh.name = "window-group-mesh";
  windowGroupMesh.position = new Vector3(0, 0.5, -0.05);
  windowGroupMesh.scaling = new Vector3(0.2, 0.2, 0.2);
  windowGroupTexture.name = "window-group-texture";
  const windowGroupRect = windowGroupTexture.getControlByName("rect");
  if (windowGroupRect) {
    windowGroupRect.alpha = 0;
  }

  // Add a grab behavior to the toolbar plane
  const windowGroupDragBehavior = new SixDofDragBehavior();
  windowGroupDragBehavior.allowMultiPointer = true;
  windowGroupMesh.addBehavior(windowGroupDragBehavior);
  windowGroupDragBehavior.draggableMeshes = [windowGroupMesh];

  const windowGroupDragIndicator = new Rectangle("window-group-drag-indicator");
  windowGroupDragIndicator.width = "200px";
  windowGroupDragIndicator.height = "20px";
  windowGroupDragIndicator.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
  windowGroupDragIndicator.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
  windowGroupDragIndicator.thickness = 0;
  windowGroupDragIndicator.background = labColors.slate7;
  windowGroupDragIndicator.cornerRadius = 20;
  windowGroupDragIndicator.top = -30;
  windowGroupTexture.addControl(windowGroupDragIndicator);

  return windowGroupMesh;
};

export const createGridMenuLabel = (text: string) => {
  const label = new TextBlock();
  label.text = text;
  label.height = "60px";
  label.fontSize = "40px";
  label.color = labColors.slate8;
  label.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
  return label;
};

export const createGridMenuSlider = (options: any) => {
  const { min, max, step, value } = options;
  const slider = new Slider();
  slider.minimum = min;
  slider.maximum = max;
  slider.step = step;
  slider.value = value;
  slider.height = "60px";
  slider.width = "100%";
  slider.color = labColors.purple;
  slider.background = labColors.slate4;
  slider.thumbWidth = "60px";
  slider.isThumbCircle = true;
  slider.isThumbClamped = true;

  return slider;
};

export const createGridMenuCheckbox = () => {
  const checkbox = new Checkbox();
  checkbox.isChecked = true;
  checkbox.height = "60px";
  checkbox.width = "70px";
  checkbox.color = labColors.purple;
  checkbox.background = labColors.slate4;
  checkbox.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
  return checkbox;
};
