<script setup>
  import { Vector3, Color3, Material, MeshBuilder, SceneLoader } from "babylonjs";
  import { AdvancedDynamicTexture, TextBlock, Image, Ellipse, Control } from "babylonjs-gui";

  definePageMeta({
    featured: false,
    title: "Lab 045",
    description: "Prototype UI Cards"
  });

  const createLabContent = async (scene) => {
    // Load some assets
    SceneLoader.LoadAssetContainer("/assets/", "glass_card_rect.glb", scene, function (container) {
      const meshes = container.meshes;
      const card = meshes[0];
      card.name = "card-rect";
      card.position = new Vector3(0, 1.4, 0);
      card.scaling = new Vector3(0.4, 0.4, 0.4);

      const materials = container.materials;
      const material = materials[0];
      material.name = "card-rect-material";

      material.albedoColor = new Color3.FromHexString(labColors.slate2);
      material.alpha = 0.9;
      material.alphaMode = Material.ALPHA_COMBINE;
      material.transparencyMode = Material.MATERIAL_ALPHABLEND;

      card.material = material;

      createGUI(card);

      // Adds all elements to the scene
      container.addAllToScene();
    });

    const createGUI = (background) => {
      const guiPlane = MeshBuilder.CreatePlane("gui-plane");
      guiPlane.parent = background;
      guiPlane.position.z = 0.05;
      //   guiPlane.position.y = 0.3;

      guiPlane.rotation.y = Math.PI;
      guiPlane.scaling = new Vector3(7, 4, 1);

      //   create an advanced texture sized to the plane (7x4)
      const advancedTexture = AdvancedDynamicTexture.CreateForMesh(guiPlane, 1024 * 0.7, 1024 * 0.4);

      advancedTexture.name = "card-texture";
      //   advancedTexture.background = labColors.slate2;

      const ellipseContainer = new Ellipse("masker");
      ellipseContainer.adaptHeightToChildren = true;
      ellipseContainer.adaptWidthToChildren = true;
      ellipseContainer.width = "80px";
      ellipseContainer.height = "80px";

      // position the ellipse ellipseContainer in the top left corner
      ellipseContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
      ellipseContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
      ellipseContainer.left = "20px";
      ellipseContainer.top = "20px";

      advancedTexture.addControl(ellipseContainer);

      // load an image on the GUI
      const image = new Image("but", "/assets/vrhermit-2023.jpg");
      ellipseContainer.addControl(image);

      const cardText = new TextBlock("card-text");
      cardText.text = "vrhermit";
      cardText.color = labColors.slate8;
      cardText.fontSize = 64;

      const subtitleText = new TextBlock("subtitle-text");
      subtitleText.text = "Joseph Simpson";
      subtitleText.color = labColors.slate7;
      subtitleText.fontSize = 32;
      subtitleText.top = 60;

      advancedTexture.addControl(cardText);
      advancedTexture.addControl(subtitleText);
    };
  };

  const bjsCanvas = ref(null);
  useCanvatoriumScene(bjsCanvas, createLabContent);
</script>

<template>
  <canvas id="bjsCanvas" ref="bjsCanvas"></canvas>
</template>
