<script setup>
  import { TransformNode, Vector3, Animation } from "babylonjs";
  import { TextBlock, Image, Control, Rectangle, MeshButton3D, GUI3DManager, PlanePanel } from "babylonjs-gui";
  import computingData from "@/data/computing.json";

  definePageMeta({
    featured: false,
    title: "Lab 050 - Collection View",
    description: "A small Collection view as an alternative to a list views."
  });

  const createLabContent = async (scene) => {
    // Data and state at parent scope
    const showMain = ref(false);
    const activeIndex = ref(0);
    const collectionData = reactive(computingData);
    const activeRecord = computed(() => computingData[activeIndex.value]);

    // Position the non-VR camera to better see the card
    const cam = scene.getCameraByName("camera");
    cam.position = new Vector3(0, 1.4, -2);

    // Create a window group object
    const windowGroupMesh = canLabWindowGroup(scene);

    // Create the main window and hide it
    const { contentMesh } = exampleContent(activeRecord, scene);
    contentMesh.parent = windowGroupMesh;
    contentMesh.position = new Vector3(0, 2.7, 0);
    contentMesh.isPickable = false;
    contentMesh.visibility = 0;

    // Create a toolbar for the window and hide it
    const toolbarMesh = lab050_example_2(showMain, scene);
    toolbarMesh.parent = windowGroupMesh;
    toolbarMesh.position = new Vector3(-3.6, 5.4, -0.05);
    toolbarMesh.isPickable = false;
    toolbarMesh.visibility = 0;

    // ---------------------------
    // START Collection View
    // 3D GUI needs an anchor and a manager
    const anchor = new TransformNode("anchor");
    const manager = new GUI3DManager(scene);

    // Use the PlanePanel to create a grid of cards
    const plainPanel = new PlanePanel();
    const columns = 2;
    plainPanel.margin = 0.1;
    plainPanel.columns = columns;

    manager.addControl(plainPanel);
    plainPanel.linkToTransformNode(anchor);

    // This is a hack to reorder the array because the PlanePanel seems to order the cards left to right, bottom to top
    // We want left to right, top to bottom
    // Current order: 0, 1, 2, 3, 4, 5, 6, 7
    // Desired order: 4, 5, 6, 7, 0, 1, 2, 3
    function reorderArray(array, splitIndex) {
      if (splitIndex >= array.length || splitIndex < 0) {
        throw new Error("Invalid split index");
      }

      const firstPart = array.slice(splitIndex);
      const secondPart = array.slice(0, splitIndex);

      return firstPart.concat(secondPart);
    }

    const sortedData = reorderArray(collectionData, columns);

    // create a card for each record and add them to the plainPanel
    sortedData.forEach((record, index) => {
      const { cellMesh } = lab050_example_1(record, scene);
      cellMesh.parent = anchor;
      cellMesh.position = new Vector3(0, 0, 0);
      cellMesh.scaling = new Vector3(0.45, 0.45, 0.45);
      cellMesh.isPickable = false;

      const button = new MeshButton3D(cellMesh, "button");
      button.scaling = new Vector3(0.3, 0.3, 0.3);
      button.onPointerUpObservable.add(() => {
        console.log("3D Button Pressed for " + record.name);
        activeIndex.value = index;
        showMain.value = true;
      });

      plainPanel.addControl(button);
    });

    anchor.parent = windowGroupMesh;
    anchor.position = new Vector3(0, 2.7, 0);

    // END Collection View
    // ---------------------------

    watch(showMain, (newValue) => {
      if (newValue) {
        // show the main window and toolbar
        Animation.CreateAndStartAnimation("open-modal", contentMesh, "visibility", 60, 6, 0, 1, 0);
        contentMesh.isPickable = true;
        Animation.CreateAndStartAnimation("open-modal", toolbarMesh, "visibility", 60, 6, 0, 1, 0);
        toolbarMesh.isPickable = true;

        // get all content in the anchor and hide it
        anchor.getChildMeshes().forEach((mesh) => {
          Animation.CreateAndStartAnimation("open-modal", mesh, "visibility", 60, 6, 1, 0, 0);
          mesh.isPickable = false;
        });
      } else {
        // hide the main window and toolbar
        Animation.CreateAndStartAnimation("open-modal", contentMesh, "visibility", 60, 6, 1, 0, 0);
        contentMesh.isPickable = false;
        Animation.CreateAndStartAnimation("open-modal", toolbarMesh, "visibility", 60, 6, 1, 0, 0);
        toolbarMesh.isPickable = false;

        // get all content in the anchor and show it
        anchor.getChildMeshes().forEach((mesh) => {
          Animation.CreateAndStartAnimation("open-modal", mesh, "visibility", 60, 6, 0, 1, 0);
          mesh.isPickable = true;
        });
      }
    });
  };

  const lab050_example_1 = (record, scene) => {
    const { plane: cellMesh, advancedTexture: cellTexture } = canLabCardSimple(4, 4.6, scene);

    const cardTextureName = "content-texture-" + record.id;
    cellTexture.name = cardTextureName;

    const imageContainer = new Rectangle("masker");
    imageContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    imageContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    imageContainer.thickness = 0;
    imageContainer.cornerRadius = 20;
    imageContainer.paddingTop = 20;
    imageContainer.paddingBottom = 20;
    imageContainer.paddingLeft = 20;
    imageContainer.paddingRight = 20;
    imageContainer.width = `${1024 * (4 / 10) - 0}px`;
    imageContainer.height = `${1024 * (4 / 10) - 0}px`;

    cellTexture.addControl(imageContainer);

    const image = new Image("image", record.imageUrl);
    image.alpha = 1;
    imageContainer.addControl(image);

    // Add a text block for the name, in front of the image
    const name = new TextBlock("name");
    name.text = "";
    name.color = labColors.slate8;
    name.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    name.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    name.paddingBottom = 28;
    name.fontSize = 32;
    cellTexture.addControl(name);

    watch(
      record,
      (newValue) => {
        const texture = scene.getTextureByName(cardTextureName);
        texture.getControlByName("name").text = newValue.name;
        texture.getControlByName("image").source = newValue.imageUrl;
      },
      { immediate: true }
    );

    return { cellMesh: cellMesh, cellTexture: cellTexture };
  };

  const lab050_example_2 = (showDetail, scene) => {
    const toggleDetailWindow = () => {
      showDetail.value = !showDetail.value;
    };

    const { plane: toolbarMesh, advancedTexture: toolbarTexture } = canLabCardSimple(2, 0.8, scene);
    toolbarMesh.name = "toolbar-mesh";
    toolbarTexture.name = "toolbar-texture";
    toolbarTexture.getControlByName("rect").alpha = 0; // just a hack to hide the card background

    const toolbarButtonToggleDetail = canLabButtonSimple("toolbar-button-toggle-detail", "Back");
    toolbarButtonToggleDetail.width = "100px";
    toolbarButtonToggleDetail.height = "50px";
    toolbarButtonToggleDetail.left = "30px";
    toolbarButtonToggleDetail.onPointerUpObservable.add(toggleDetailWindow);
    toolbarButtonToggleDetail.textBlock.fontSize = 22;
    toolbarTexture.addControl(toolbarButtonToggleDetail);

    return toolbarMesh;
  };

  const bjsCanvas = ref(null);
  useCanvatoriumScene(bjsCanvas, createLabContent);
</script>

<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
