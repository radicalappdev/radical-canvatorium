<script setup>
  import { Vector3, SixDofDragBehavior } from "babylonjs";
  import { TextBlock, Image, Control, Rectangle, Button, Grid, AdvancedDynamicTexture } from "babylonjs-gui";
  import computingData from "@/data/computing.json";

  definePageMeta({
    featured: false,
    title: "Lab 046 - A main window",
    description: "Building a main window that will be used across a series of labs."
  });

  const createLabContent = async (scene) => {
    const activeIndex = ref(0);
    let activeRecord = reactive(computingData[activeIndex.value]);

    // Position the non-VR camera to better see the card
    const cam = scene.getCameraByName("camera");
    cam.position = new Vector3(0, 1.4, -2);

    const { plane: grabPlane, advancedTexture: grabTexture } = canLabCardSimple(2, 0.8, scene);
    grabPlane.name = "grab-plane";
    grabPlane.position = new Vector3(0, 1, -0.05);
    grabPlane.scaling = new Vector3(0.2, 0.2, 0.2);
    grabTexture.name = "grab-texture";
    grabTexture.getControlByName("rect").alpha = 0;

    // Add a grab behavior to the toolbar plane
    const sixDofDragBehavior = new SixDofDragBehavior();
    sixDofDragBehavior.allowMultiPointers = true;
    sixDofDragBehavior.moveAttached = false;
    sixDofDragBehavior.maxDragAngle = 0;
    grabPlane.addBehavior(sixDofDragBehavior);
    sixDofDragBehavior.draggableMeshes = [grabPlane];

    const rectIndicator = new Rectangle("rect-indicator");
    rectIndicator.width = "200px";
    rectIndicator.height = "20px";
    rectIndicator.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    rectIndicator.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    rectIndicator.thickness = 0;
    rectIndicator.background = labColors.slate7;
    rectIndicator.cornerRadius = 20;
    rectIndicator.top = -30;
    grabTexture.addControl(rectIndicator);

    // Create a new small plane with an advanced texture to display two buttons
    const { plane: toolbarPlane, advancedTexture: toolbarTexture } = canLabCardSimple(2, 0.8, scene);
    toolbarPlane.name = "toolbar-plane";
    toolbarPlane.position = new Vector3(3, 0, -0.05);
    toolbarPlane.parent = grabPlane;
    toolbarTexture.getControlByName("rect").alpha = 0;
    toolbarTexture.name = "toolbar-texture";

    const buttonLeft = canLabButtonSimple("button-left", "<");
    buttonLeft.width = "50px";
    buttonLeft.height = "50px";
    buttonLeft.left = "-30px";
    buttonLeft.onPointerUpObservable.add(() => {
      // reduce the count, but when gettin to 0, go to the last record
      let newIndex = activeIndex.value - 1;
      if (newIndex < 0) {
        newIndex = computingData.length - 1;
      }
      activeIndex.value = newIndex;
    });
    toolbarTexture.addControl(buttonLeft);

    const buttonRight = canLabButtonSimple("button-right", ">");
    buttonRight.width = "50px";
    buttonRight.height = "50px";
    buttonRight.left = "30px";

    buttonRight.onPointerUpObservable.add(() => {
      // increase the count, but when getting to the last record, go to 0
      let newIndex = activeIndex.value + 1;
      if (newIndex > computingData.length - 1) {
        newIndex = 0;
      }
      activeIndex.value = newIndex;
    });
    toolbarTexture.addControl(buttonRight);

    const { plane, advancedTexture } = canLabCardSimple(8, 4.6, scene);
    plane.name = "parent-plane";
    // plane.scaling = new Vector3(0.8, 0.8, 0.8);
    plane.parent = grabPlane;
    plane.position = new Vector3(0, 2.7, 0);

    const imageContainer = new Rectangle("masker");
    imageContainer.width = "100px";
    imageContainer.height = "100px";
    imageContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    imageContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    imageContainer.left = "30px";
    imageContainer.top = "30px";
    imageContainer.thickness = 0;
    imageContainer.cornerRadius = 20;
    advancedTexture.addControl(imageContainer);

    const image = new Image("image", activeRecord.imageUrl);
    image.alpha = 0.9;
    image.onPointerEnterObservable.add(() => {
      image.alpha = 1;
    });
    image.onPointerOutObservable.add(() => {
      image.alpha = 0.9;
    });
    imageContainer.addControl(image);

    const cardText = new TextBlock("name");
    cardText.text = activeRecord.name;
    cardText.color = labColors.slate8;
    cardText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    cardText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    cardText.top = 40;
    cardText.left = 150;
    cardText.fontSize = 48;
    advancedTexture.addControl(cardText);

    const knownFor = new TextBlock("knownFor");
    knownFor.text = `Known for: ${activeRecord.knownFor}`;
    knownFor.color = labColors.slate8;
    knownFor.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    knownFor.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    knownFor.top = 100;
    knownFor.left = 150;
    knownFor.fontSize = 18;
    advancedTexture.addControl(knownFor);

    const shortDescription = Button.CreateSimpleButton("shortDescription", activeRecord.shortDescription);
    shortDescription.background = labColors.slate3 + "80";
    shortDescription.textWrapping = true;
    shortDescription.paddingLeft = "30px";
    shortDescription.paddingRight = "30px";
    shortDescription.paddingTop = "10px";
    shortDescription.paddingBottom = "10px";
    shortDescription.heightInPixels = 146;
    shortDescription.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    shortDescription.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    shortDescription.cornerRadius = 20;
    shortDescription.thickness = 1;
    shortDescription.color = labColors.slate2;
    shortDescription.top = -20;
    shortDescription.textBlock.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    shortDescription.textBlock.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    shortDescription.textBlock.fontSize = 22;
    shortDescription.textBlock.color = labColors.slate8;
    shortDescription.textBlock.paddingLeft = "10px";
    shortDescription.textBlock.paddingRight = "10px";
    shortDescription.textBlock.paddingTop = "10px";
    shortDescription.textBlock.paddingBottom = "10px";
    // Override the default pointerUp and pointerDown animations
    shortDescription.pointerDownAnimation = () => {};
    shortDescription.pointerUpAnimation = () => {};
    shortDescription.onPointerEnterObservable.add(() => {
      shortDescription.background = labColors.slate3 + "ff";
      shortDescription.color = labColors.slate4 + "80";
    });
    shortDescription.onPointerOutObservable.add(() => {
      shortDescription.background = labColors.slate3 + "80";
      shortDescription.color = labColors.slate2;
    });
    advancedTexture.addControl(shortDescription);

    const containerLeft = new Rectangle("lab-card-rect");
    containerLeft.color = labColors.slate2;
    containerLeft.thickness = 1;
    containerLeft.background = labColors.slate3 + "80";
    containerLeft.cornerRadius = 20;
    containerLeft.widthInPixels = 240;
    containerLeft.heightInPixels = 140;
    containerLeft.top = 130;
    containerLeft.left = -260;
    containerLeft.onPointerEnterObservable.add(() => {
      containerLeft.background = labColors.slate3 + "ff";
      containerLeft.color = labColors.slate4 + "80";
    });
    containerLeft.onPointerOutObservable.add(() => {
      containerLeft.background = labColors.slate3 + "80";
      containerLeft.color = labColors.slate2;
    });
    advancedTexture.addControl(containerLeft);

    // add a 2x3 grid to the left container
    const grid = new Grid();
    grid.addColumnDefinition(0.5);
    grid.addColumnDefinition(0.5);
    grid.addRowDefinition(0.33);
    grid.addRowDefinition(0.33);
    grid.addRowDefinition(0.33);
    containerLeft.addControl(grid);

    // Row one: birthdate label and value
    const birthdateLabel = new TextBlock("birthdateLabel");
    birthdateLabel.text = "Born";
    birthdateLabel.color = labColors.slate6;
    birthdateLabel.fontSize = 18;
    birthdateLabel.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    birthdateLabel.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    birthdateLabel.paddingLeft = "10px";
    birthdateLabel.paddingRight = "10px";
    birthdateLabel.paddingTop = "14px";
    birthdateLabel.paddingBottom = "10px";
    grid.addControl(birthdateLabel, 0, 0);

    // localize the activeRecord.born date
    const bornDate = new Date(activeRecord.born);
    const bornString = bornDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric"
    });
    const birthdateValue = new TextBlock("birthdateValue");
    birthdateValue.text = bornString;
    birthdateValue.color = labColors.slate8;
    birthdateValue.fontSize = 18;
    birthdateValue.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    birthdateValue.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    birthdateValue.paddingLeft = "10px";
    birthdateValue.paddingRight = "10px";
    birthdateValue.paddingTop = "14px";
    birthdateValue.paddingBottom = "10px";
    grid.addControl(birthdateValue, 0, 1);

    // Row Two: Died label and value
    const diedLabel = new TextBlock("diedLabel");
    diedLabel.text = "Died";
    diedLabel.color = labColors.slate6;
    diedLabel.fontSize = 18;
    diedLabel.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    diedLabel.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    diedLabel.paddingLeft = "10px";
    diedLabel.paddingRight = "10px";
    diedLabel.paddingTop = "10px";
    diedLabel.paddingBottom = "10px";
    grid.addControl(diedLabel, 1, 0);

    // localize the activeRecord.died date
    const diedDate = new Date(activeRecord.died);
    const diedString = diedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric"
    });
    const diedValue = new TextBlock("diedValue");
    diedValue.text = diedString;
    diedValue.color = labColors.slate8;
    diedValue.fontSize = 18;
    diedValue.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    diedValue.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    diedValue.paddingLeft = "10px";
    diedValue.paddingRight = "10px";
    diedValue.paddingTop = "10px";
    diedValue.paddingBottom = "10px";
    grid.addControl(diedValue, 1, 1);

    // Row three: years active label and value
    const yearsActiveLabel = new TextBlock("yearsActiveLabel");
    yearsActiveLabel.text = "Years Active";
    yearsActiveLabel.color = labColors.slate6;
    yearsActiveLabel.fontSize = 18;
    yearsActiveLabel.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    yearsActiveLabel.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    yearsActiveLabel.paddingLeft = "10px";
    yearsActiveLabel.paddingRight = "10px";
    yearsActiveLabel.paddingTop = "10px";
    yearsActiveLabel.paddingBottom = "14px";
    grid.addControl(yearsActiveLabel, 2, 0);

    const yearsActiveValue = new TextBlock("yearsActiveValue");
    yearsActiveValue.text = activeRecord.activeYears;
    yearsActiveValue.color = labColors.slate8;
    yearsActiveValue.fontSize = 18;
    yearsActiveValue.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    yearsActiveValue.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    yearsActiveValue.paddingLeft = "10px";
    yearsActiveValue.paddingRight = "10px";
    yearsActiveValue.paddingTop = "10px";
    yearsActiveValue.paddingBottom = "14px";
    grid.addControl(yearsActiveValue, 2, 1);

    const containerRight = new Rectangle("lab-card-rect");
    containerRight.color = labColors.slate2;
    containerRight.thickness = 1;
    containerRight.background = labColors.slate3 + "80";
    containerRight.cornerRadius = 20;
    containerRight.widthInPixels = 500;
    containerRight.heightInPixels = 140;
    containerRight.top = 130;
    containerRight.left = 130;
    containerRight.onPointerEnterObservable.add(() => {
      containerRight.background = labColors.slate3 + "ff";
      containerRight.color = labColors.slate4 + "80";
    });
    containerRight.onPointerOutObservable.add(() => {
      containerRight.background = labColors.slate3 + "80";
      containerRight.color = labColors.slate2;
    });
    advancedTexture.addControl(containerRight);

    // Add a 2x3 grid to the right container
    // knownFor, occupation, education and their labels
    const gridRight = new Grid();
    gridRight.addColumnDefinition(0.2);
    gridRight.addColumnDefinition(0.8);
    gridRight.addRowDefinition(0.33);
    gridRight.addRowDefinition(0.33);
    gridRight.addRowDefinition(0.33);
    containerRight.addControl(gridRight);

    // Row one: knownFor label and value
    const knownForLabel = new TextBlock("knownForLabel");
    knownForLabel.text = "Known For";
    knownForLabel.color = labColors.slate6;
    knownForLabel.fontSize = 18;
    knownForLabel.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    knownForLabel.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    knownForLabel.paddingLeft = "10px";
    knownForLabel.paddingTop = "14px";
    knownForLabel.paddingBottom = "10px";
    gridRight.addControl(knownForLabel, 0, 0);

    const knownForValue = new TextBlock("knownForValue");
    knownForValue.text = activeRecord.knownFor.length > 40 ? activeRecord.knownFor.substring(0, 40) + "..." : activeRecord.knownFor;
    knownForValue.color = labColors.slate8;
    knownForValue.fontSize = 18;
    knownForValue.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    knownForValue.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    knownForValue.paddingLeft = "10px";
    knownForValue.paddingRight = "10px";
    knownForValue.paddingTop = "14px";
    knownForValue.paddingBottom = "10px";
    gridRight.addControl(knownForValue, 0, 1);

    // Row two: occupation label and value
    const occupationLabel = new TextBlock("occupationLabel");
    occupationLabel.text = "Occupation";
    occupationLabel.color = labColors.slate6;
    occupationLabel.fontSize = 18;
    occupationLabel.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    occupationLabel.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    occupationLabel.paddingLeft = "10px";
    occupationLabel.paddingTop = "10px";
    occupationLabel.paddingBottom = "10px";
    gridRight.addControl(occupationLabel, 1, 0);

    const occupationValue = new TextBlock("occupationValue");
    occupationValue.text = activeRecord.occupation.length > 40 ? activeRecord.occupation.substring(0, 40) + "..." : activeRecord.occupation;
    occupationValue.color = labColors.slate8;
    occupationValue.fontSize = 18;
    occupationValue.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    occupationValue.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    occupationValue.paddingLeft = "10px";
    occupationValue.paddingRight = "10px";
    occupationValue.paddingTop = "10px";
    occupationValue.paddingBottom = "10px";
    gridRight.addControl(occupationValue, 1, 1);

    // Row three: education label and value
    const educationLabel = new TextBlock("educationLabel");
    educationLabel.text = "Education";
    educationLabel.color = labColors.slate6;
    educationLabel.fontSize = 18;
    educationLabel.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    educationLabel.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    educationLabel.paddingLeft = "10px";
    educationLabel.paddingTop = "10px";
    educationLabel.paddingBottom = "14px";
    gridRight.addControl(educationLabel, 2, 0);

    const educationValue = new TextBlock("educationValue");
    educationValue.text = activeRecord.education.length > 40 ? activeRecord.education.substring(0, 40) + "..." : activeRecord.education;
    educationValue.color = labColors.slate8;
    educationValue.fontSize = 18;
    educationValue.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    educationValue.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    educationValue.paddingLeft = "10px";
    educationValue.paddingRight = "10px";
    educationValue.paddingTop = "10px";
    educationValue.paddingBottom = "14px";
    gridRight.addControl(educationValue, 2, 1);

    window.addEventListener("keydown", (e) => {
      if (e.key === "=") {
        activeIndex.value++;
      }
      if (e.key === "-") {
        activeIndex.value--;
      }
      if (activeIndex.value < 0) {
        activeIndex.value = computingData.length - 1;
      }
      if (activeIndex.value > computingData.length - 1) {
        activeIndex.value = 0;
      }
    });

    watch(activeIndex, (newValue) => {
      const texture = scene.getTextureByName("lab-card-rect-texture");
      activeRecord = computingData[newValue];

      texture.getControlByName("name").text = activeRecord.name;
      texture.getControlByName("image").source = activeRecord.imageUrl;
      texture.getControlByName("knownFor").text = `Known for: ${activeRecord.knownFor}`;
      texture.getControlByName("shortDescription").textBlock.text = activeRecord.shortDescription;

      // Update the grid values
      const bornDate = new Date(activeRecord.born);
      const bornString = bornDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric"
      });
      texture.getControlByName("birthdateValue").text = bornString;
      const diedDate = new Date(activeRecord.died);
      const diedString = diedDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric"
      });
      texture.getControlByName("diedValue").text = diedString;
      texture.getControlByName("yearsActiveValue").text = activeRecord.activeYears;

      // Update the gridRight values with a max length of 40 characters
      texture.getControlByName("knownForValue").text = activeRecord.knownFor.length > 40 ? activeRecord.knownFor.substring(0, 40) + "..." : activeRecord.knownFor;
      texture.getControlByName("occupationValue").text = activeRecord.occupation.length > 40 ? activeRecord.occupation.substring(0, 40) + "..." : activeRecord.occupation;
      texture.getControlByName("educationValue").text = activeRecord.education.length > 40 ? activeRecord.education.substring(0, 40) + "..." : activeRecord.education;
    });
  };

  const bjsCanvas = ref(null);
  useCanvatoriumScene(bjsCanvas, createLabContent);
</script>

<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>