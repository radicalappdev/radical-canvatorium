<script lang="ts" setup>
  import { Scene, TransformNode, Vector3, Animation, Color4 } from "@babylonjs/core";
  import { AdvancedDynamicTexture, TextBlock, Image, Control, Rectangle, MeshButton3D, GUI3DManager, PlanePanel, Container3D, Control3D } from "@babylonjs/gui";
  import computingData from "@/data/computing.json";

  definePageMeta({
    featured: false,
    title: "Lab 053 - Basic MR Passthrough with 3D GUI",
    description:
      "In this lab I want to explore the use of 3D GUI in a mixed reality environment. I used the example UI from Lab 50 and scaled it down a bit. Toggle the UI on and off. (y-button on the left controller)."
  });

  type ComputingRecord = (typeof computingData)[0];

  const createLabContent = async (scene: Scene) => {
    // Data and state at parent scope
    const showMain = ref(false);
    const activeIndex = ref(0);
    const collectionData = reactive(computingData);
    const activeRecord = computed(() => computingData[activeIndex.value]);

    // Position the non-VR camera to better see the card
    const cam = scene.getCameraByName("camera");
    if (cam) {
      cam.position = new Vector3(0, 1.4, -2);
    }
    scene.clearColor = Color4.FromHexString("#000000");

    // Create a window group object
    const windowGroupMesh = canLabWindowGroup(scene);
    windowGroupMesh.scaling = new Vector3(0.06, 0.06, 0.06);

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
    plainPanel.columns = 4;
    plainPanel.margin = 0.1;
    manager.addControl(plainPanel);
    plainPanel.linkToTransformNode(anchor);

    // This is a hack to reorder the plane panel
    // https://forum.babylonjs.com/t/change-layout-order-of-plane-panel/42709
    // Ignore the type error for this hack by casting to any
    (plainPanel as any)._mapGridNode = function (control: Control3D, nodePosition: Vector3) {
      const mesh = control.mesh;

      if (!mesh) {
        return;
      }

      // Invert the Y axis to force the plane to draw from top to bottom
      let newPos = new Vector3(nodePosition.x, -nodePosition.y, nodePosition.z);

      control.position = newPos;

      const target = newPos.clone();

      switch (this.orientation) {
        case Container3D.FACEORIGIN_ORIENTATION:
        case Container3D.FACEFORWARD_ORIENTATION:
          target.addInPlace(new Vector3(0, 0, 1));
          mesh.lookAt(target);
          break;
        case Container3D.FACEFORWARDREVERSED_ORIENTATION:
        case Container3D.FACEORIGINREVERSED_ORIENTATION:
          target.addInPlace(new Vector3(0, 0, -1));
          mesh.lookAt(target);
          break;
      }
    };

    plainPanel.blockLayout = true;

    // create a card for each record and add them to the plainPanel
    collectionData.forEach((record, index) => {
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

    plainPanel.blockLayout = false;

    anchor.parent = windowGroupMesh;
    anchor.position = new Vector3(0, 2.7, 0);

    // Add  a custom XR player for AR/MR
    const xr = await scene.createDefaultXRExperienceAsync({
      uiOptions: {
        sessionMode: "immersive-ar"
      }
    });

    console.log("xr player created by lab 053", xr);

    xr.baseExperience.onInitialXRPoseSetObservable.add((xrCamera) => {
      console.log("Entering Immersive Mode with camera", xrCamera.position, windowGroupMesh);
      // Reposition the window group to be in front of the camera - hard coded for now
      windowGroupMesh.position = new Vector3(0, 1.1, 0.5);
    });

    //controller input
    xr.input.onControllerAddedObservable.add((controller) => {
      controller.onMotionControllerInitObservable.add((motionController) => {
        if (motionController.handness === "left") {
          const xr_ids = motionController.getComponentIds();
          let yButtonComponent = motionController.getComponent(xr_ids[4]); //y-button
          yButtonComponent?.onButtonStateChangedObservable.add(() => {
            if (yButtonComponent.pressed) {
              console.log("Y Button Pressed");
              // toggleMenu(controller);
              windowGroupMesh.isVisible = !windowGroupMesh.isVisible;
              // toggle visibility of any child meshes
              windowGroupMesh.getChildMeshes().forEach((mesh) => {
                mesh.isVisible = !mesh.isVisible;
              });
            }
          });
        }
        if (motionController.handness === "right") {
          const xr_ids = motionController.getComponentIds();
          let bButtonComponent = motionController.getComponent(xr_ids[4]); //b-button
          bButtonComponent?.onButtonStateChangedObservable.add(() => {
            if (bButtonComponent.pressed) {
              console.log("B Button Pressed");
            }
          });
        }
      });
    });

    // END Collection View
    // ---------------------------

    // watch the showMain value and animate between states
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

  const lab050_example_1 = (record: ComputingRecord, scene: Scene) => {
    const { plane: cellMesh, advancedTexture: cellTexture } = canLabCardSimple(4, 4.6, scene);

    const cardTextureName = "content-texture-" + record.id;
    cellTexture.name = cardTextureName;

    const rect = cellTexture.getControlByName("rect") as Rectangle;
    if (rect) {
      rect.background = "#ffffff";
    }

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
        const texture = scene.getTextureByName(cardTextureName) as AdvancedDynamicTexture;
        if (!texture) {
          return;
        }
        const text = texture.getControlByName("name") as TextBlock;
        if (text) {
          text.text = newValue.name;
        }
        const image = texture.getControlByName("image") as Image;
        if (image) {
          image.source = newValue.imageUrl;
        }
      },
      { immediate: true }
    );

    return { cellMesh: cellMesh, cellTexture: cellTexture };
  };

  const lab050_example_2 = (showDetail: Ref, scene: Scene) => {
    const toggleDetailWindow = () => {
      showDetail.value = !showDetail.value;
    };

    const { plane: toolbarMesh, advancedTexture: toolbarTexture } = canLabCardSimple(2, 0.8, scene);
    toolbarMesh.name = "toolbar-mesh";
    toolbarTexture.name = "toolbar-texture";
    const rectControl = toolbarTexture.getControlByName("rect");
    if (rectControl) {
      rectControl.alpha = 0; // just a hack to hide the card background
    }

    const toolbarButtonToggleDetail = canLabButtonSimple("toolbar-button-toggle-detail", "Back");
    toolbarButtonToggleDetail.width = "100px";
    toolbarButtonToggleDetail.height = "50px";
    toolbarButtonToggleDetail.left = "30px";
    toolbarButtonToggleDetail.onPointerUpObservable.add(toggleDetailWindow);
    if (toolbarButtonToggleDetail.textBlock) {
      toolbarButtonToggleDetail.textBlock.fontSize = 22;
    }
    toolbarTexture.addControl(toolbarButtonToggleDetail);

    return toolbarMesh;
  };

  const bjsCanvas = ref(null);

  const labSceneOptions = {
    useRoom: false,
    useWebXRPlayer: false
  };

  useCanvatoriumScene(bjsCanvas, createLabContent, labSceneOptions);
</script>

<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
