<script setup>
import { AbstractMesh, MeshBuilder, Vector3 } from "babylonjs";
import { AdvancedDynamicTexture, GUI3DManager, Button3D, TextBlock } from "babylonjs-gui";

definePageMeta({
    featured: false,
    title: 'Lab 002 – watch and watchEffect',
    description: 'Lab 002 – watch and watchEffect'
})

const sample = ref("default");
const count = ref(0);
let reactiveScene;

const createLabContent = async (scene)  => {
    
    
    reactiveScene = scene;
    let anchor = new AbstractMesh("anchor", scene);
    let manager = new GUI3DManager(scene);

    makeCard(scene);
    makeButton(scene, manager, anchor);
    
    
};

const makeCard =(scene) => {
  
  var plane = MeshBuilder.CreatePlane("plane", { size: 0.5}, scene);
  plane.position.y = 2;

  var advancedTexture = AdvancedDynamicTexture.CreateForMesh(plane);
  advancedTexture.name = "card-texture";
  advancedTexture.background = labColors.slate5;

  var cardText = new TextBlock("card-text");
  cardText.text = "Watch";
  cardText.color = "white";
  cardText.fontSize = 64;

  advancedTexture.addControl(cardText);
  plane.scaling = new Vector3(5, 5, 5);
};

const makeButton = (scene, manager, anchor) => {
  // Let's add a button
  var button = new Button3D("reset");
  manager.addControl(button);
  button.linkToTransformNode(anchor);
  button.position.y = 1;

  var text1 = new TextBlock();
  text1.text = "Change Values";
  text1.color = "white";
  text1.fontSize = 24;
  button.content = text1;

  button.onPointerUpObservable.add(() => {
    count.value++;
    sample.value = "Modified";
  });
};

// Watch with a single value
watch(count, (newValue, oldValue) => {
  const texture = reactiveScene.getTextureByName("card-texture");
  texture.getControlByName("card-text").text =
    "From " + oldValue + " to " + newValue;
});

const bjsCanvas = ref(null);
useCanvatoriumScene(bjsCanvas, createLabContent);

</script>
<template>
    <canvas id="bjsCanvas" ref="bjsCanvas" ></canvas>
</template>