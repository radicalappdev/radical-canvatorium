import { TextBlock, Image, Control, Rectangle, Button, Grid } from "babylonjs-gui";

// use toolbar
export const exampleToolbar = (activeIndex, computingData, scene) => {
  const handlePrevButtonClick = () => {
    let newIndex = activeIndex.value - 1;
    if (newIndex < 0) {
      newIndex = computingData.length - 1;
    }
    activeIndex.value = newIndex;
  };

  const handleNextButtonClick = () => {
    let newIndex = activeIndex.value + 1;
    if (newIndex > computingData.length - 1) {
      newIndex = 0;
    }
    activeIndex.value = newIndex;
  };

  const { plane: toolbarMesh, advancedTexture: toolbarTexture } = canLabCardSimple(2, 0.8, scene);
  toolbarMesh.name = "toolbar-mesh";
  toolbarTexture.name = "toolbar-texture";
  toolbarTexture.getControlByName("rect").alpha = 0; // just a hack to hide the card background

  const toolbarButtonPrev = canLabButtonSimple("toolbar-button-prev", "<");
  toolbarButtonPrev.width = "50px";
  toolbarButtonPrev.height = "50px";
  toolbarButtonPrev.left = "-30px";
  toolbarButtonPrev.onPointerUpObservable.add(handlePrevButtonClick);
  toolbarTexture.addControl(toolbarButtonPrev);

  const toolbarButtonNext = canLabButtonSimple("toolbar-button-next", ">");
  toolbarButtonNext.width = "50px";
  toolbarButtonNext.height = "50px";
  toolbarButtonNext.left = "30px";
  toolbarButtonNext.onPointerUpObservable.add(handleNextButtonClick);
  toolbarTexture.addControl(toolbarButtonNext);

  return toolbarMesh;
};

// --------------------------
// Create the main content card
// --------------------------
export const exampleContent = (activeRecord, scene) => {
  const { plane: contentMesh, advancedTexture: contentTexture } = canLabCardSimple(8, 4.6, scene);
  contentMesh.name = "content-mesh";
  // Just a hack to give the texture a unique name
  const cardTextureName = "content-texture-" + Date.now();
  contentTexture.name = cardTextureName;

  const imageContainer = new Rectangle("masker");
  imageContainer.width = "100px";
  imageContainer.height = "100px";
  imageContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
  imageContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
  imageContainer.left = "30px";
  imageContainer.top = "30px";
  imageContainer.thickness = 0;
  imageContainer.cornerRadius = 20;
  contentTexture.addControl(imageContainer);

  const image = new Image("image", activeRecord.imageUrl);
  image.name = "image";
  image.alpha = 0.9;
  image.onPointerEnterObservable.add(() => {
    image.alpha = 1;
  });
  image.onPointerOutObservable.add(() => {
    image.alpha = 0.9;
  });
  imageContainer.addControl(image);

  const cardText = new TextBlock("name");
  cardText.text = "";
  cardText.color = labColors.slate8;
  cardText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
  cardText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
  cardText.top = 40;
  cardText.left = 150;
  cardText.fontSize = 48;
  contentTexture.addControl(cardText);

  const knownFor = new TextBlock("knownFor");
  knownFor.color = labColors.slate8;
  knownFor.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
  knownFor.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
  knownFor.top = 100;
  knownFor.left = 150;
  knownFor.fontSize = 18;
  contentTexture.addControl(knownFor);

  const shortDescriptionContainer = new Rectangle("short-description-container");
  shortDescriptionContainer.color = labColors.slate2;
  shortDescriptionContainer.thickness = 1;
  shortDescriptionContainer.background = labColors.slate3 + "80";
  shortDescriptionContainer.cornerRadius = 20;
  shortDescriptionContainer.heightInPixels = 146;
  shortDescriptionContainer.top = -20;
  shortDescriptionContainer.paddingLeft = "30px";
  shortDescriptionContainer.paddingRight = "30px";
  shortDescriptionContainer.paddingTop = "10px";
  shortDescriptionContainer.paddingBottom = "10px";
  shortDescriptionContainer.onPointerEnterObservable.add(() => {
    shortDescriptionContainer.background = labColors.slate3 + "ff";
    shortDescriptionContainer.color = labColors.slate4 + "80";
  });
  shortDescriptionContainer.onPointerOutObservable.add(() => {
    shortDescriptionContainer.background = labColors.slate3 + "80";
    shortDescriptionContainer.color = labColors.slate2;
  });
  contentTexture.addControl(shortDescriptionContainer);

  const shortDescription = new TextBlock("short-description-text");
  shortDescription.text = "";
  shortDescription.textWrapping = true;
  shortDescription.color = labColors.slate8;
  shortDescription.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
  shortDescription.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
  shortDescription.fontSize = 22;
  shortDescription.paddingLeft = "10px";
  shortDescription.paddingRight = "10px";
  shortDescription.paddingTop = "10px";
  shortDescription.paddingBottom = "10px";
  shortDescriptionContainer.addControl(shortDescription);

  const containerLeft = new Rectangle("container-left");
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
  containerLeft.onPointerUpObservable.add(() => {
    console.log("containerLeft clicked");
  });
  contentTexture.addControl(containerLeft);

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

  const birthdateValue = new TextBlock("birthdateValue");
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

  const diedValue = new TextBlock("diedValue");
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
  contentTexture.addControl(containerRight);

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
  educationValue.color = labColors.slate8;
  educationValue.fontSize = 18;
  educationValue.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
  educationValue.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
  educationValue.paddingLeft = "10px";
  educationValue.paddingRight = "10px";
  educationValue.paddingTop = "10px";
  educationValue.paddingBottom = "14px";
  gridRight.addControl(educationValue, 2, 1);

  watch(
    activeRecord,
    (newValue) => {
      console.log("card texture name", cardTextureName);
      const texture = scene.getTextureByName(cardTextureName);
      // activeRecord = computingData[newValue];

      texture.getControlByName("name").text = newValue.name;
      texture.getControlByName("image").source = newValue.imageUrl;
      texture.getControlByName("knownFor").text = `Known for: ${newValue.knownFor}`;
      texture.getControlByName("short-description-text").text = newValue.shortDescription;

      // Update the grid values
      const bornDate = new Date(newValue.born);
      const bornString = bornDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric"
      });
      texture.getControlByName("birthdateValue").text = bornString;
      const diedDate = new Date(newValue.died);
      const diedString = diedDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric"
      });
      texture.getControlByName("diedValue").text = diedString;
      texture.getControlByName("yearsActiveValue").text = newValue.activeYears;

      // Update the gridRight values with a max length of 40 characters
      texture.getControlByName("knownForValue").text = newValue.knownFor.length > 40 ? newValue.knownFor.substring(0, 40) + "..." : newValue.knownFor;
      texture.getControlByName("occupationValue").text = newValue.occupation.length > 40 ? newValue.occupation.substring(0, 40) + "..." : newValue.occupation;
      texture.getControlByName("educationValue").text = newValue.education.length > 40 ? newValue.education.substring(0, 40) + "..." : newValue.education;
    },
    { immediate: true }
  );

  return { contentMesh, contentTexture };
};

export const exampleLabCard = (title, description, scene) => {
  const { plane: contentMesh, advancedTexture: contentTexture } = canLabCardSimple(6, 3.2, scene);
  contentMesh.name = "content-mesh";
  // Just a hack to give the texture a unique name
  const cardTextureName = "content-texture-" + Date.now();
  contentTexture.name = cardTextureName;

  const cardText = new TextBlock("name");
  cardText.text = title;
  cardText.color = labColors.slate8;
  cardText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
  cardText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
  cardText.top = 30;
  cardText.left = 30;
  cardText.fontSize = 36;

  contentTexture.addControl(cardText);

  const shortDescription = new TextBlock("short-description-text");
  shortDescription.text = description;
  shortDescription.textWrapping = true;
  shortDescription.color = labColors.slate8;
  shortDescription.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
  shortDescription.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
  shortDescription.fontSize = 18;
  shortDescription.paddingLeft = "30px";
  shortDescription.paddingRight = "30px";
  shortDescription.paddingTop = "80px";
  shortDescription.paddingBottom = "30px";
  contentTexture.addControl(shortDescription);

  return { contentMesh, contentTexture };
};
