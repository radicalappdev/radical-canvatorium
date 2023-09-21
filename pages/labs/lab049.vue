<script lang="ts" setup>
  import { Scene, Vector3, Animation } from "babylonjs";
  import { TextBlock, Control } from "babylonjs-gui";
  import computingData from "@/data/computing.json";

  definePageMeta({
    featured: false,
    title: "Lab 049 - Main Window + Details",
    description: "Use a button to toggle a detail window to the side of the main window. Useful for inspectors, etc."
  });

  const createLabContent = async (scene: Scene) => {
    // Data and state at parent scope
    const activeIndex = ref(3);
    const activeRecord = computed(() => computingData[activeIndex.value]);

    const showDetail = ref(false);

    const cam = scene.getCameraByName("camera");
    if (cam) {
      cam.position = new Vector3(0, 1.4, -2);
    }

    // Use the window group from the lab uikit
    const windowGroupMesh = canLabWindowGroup(scene);
    windowGroupMesh.scaling = new Vector3(0.15, 0.15, 0.15);
    windowGroupMesh.position.y = 0.8;

    // Use the content mesh from lab examples
    let { contentMesh } = exampleContent(activeRecord, scene);
    contentMesh.parent = windowGroupMesh;
    contentMesh.position = new Vector3(0, 2.7, 0);

    // Build a detail window and hide it next to the main window
    const { detailMesh: detailMesh } = lab049_example_1(activeRecord, scene);
    detailMesh.parent = windowGroupMesh;
    detailMesh.position = new Vector3(6, 2.7, -1);
    detailMesh.rotation.y = Math.PI / 6;
    detailMesh.isPickable = false;
    detailMesh.visibility = 0;

    // Create a toolbar for the window with a button to open the detail window
    const toolbarMesh = lab049_example_2(showDetail, scene);
    toolbarMesh.parent = windowGroupMesh;
    toolbarMesh.position = new Vector3(3, 0, -0.05);

    watch(showDetail, (newValue) => {
      if (newValue) {
        Animation.CreateAndStartAnimation("open-replace", detailMesh, "visibility", 60, 6, 0, 1, 0);
        detailMesh.isPickable = true;
      } else {
        Animation.CreateAndStartAnimation("close-replace", detailMesh, "visibility", 60, 6, 1, 0, 0);
        detailMesh.isPickable = false;
      }
    });

    // press the space bar to toggle the replace window
    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        showDetail.value = !showDetail.value;
      }
    });
  };

  // Create a card with a long description
  const lab049_example_1 = (activeRecord: Ref, scene: Scene) => {
    const { plane: detailMesh, advancedTexture: detailTexture } = canLabCardSimple(3.8, 4.6, scene);

    const paragraph = new TextBlock();
    paragraph.text = activeRecord.value.longDescription;
    paragraph.color = labColors.slate8;
    paragraph.fontSize = 18;
    paragraph.textWrapping = true;
    paragraph.width = 0.85;
    paragraph.height = 0.85;
    paragraph.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    paragraph.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    detailTexture.addControl(paragraph);

    return { detailMesh: detailMesh, replaceTexture: detailTexture };
  };

  const lab049_example_2 = (showDetail: Ref, scene: Scene) => {
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

    const toolbarButtonToggleDetail = canLabButtonSimple("toolbar-button-toggle-detail", "Details");
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
  useCanvatoriumScene(bjsCanvas, createLabContent);
</script>

<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
