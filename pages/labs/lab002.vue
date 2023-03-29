<script setup>
import { MeshBuilder } from "babylonjs";
import { AdvancedDynamicTexture, Button, TextBlock } from "babylonjs-gui";

definePageMeta({
    featured: true,
    title: 'Lab 002 – watch and watchEffect',
    description: 'Lab 002 – watch and watchEffect'
})

const createLabContent = async (scene)  => {
    
    // Set count as a reactive value
    const count = ref(0);
    
    const plane = MeshBuilder.CreatePlane("plane", { size: 2}, scene);
    plane.position.y = 1.8;
    
    const advancedTexture = AdvancedDynamicTexture.CreateForMesh(plane);
    advancedTexture.name = "card-texture";
    advancedTexture.background = labColors.slate3;

    // Add a title text block
    const titleText = new TextBlock("title-text");
    titleText.text = "Modify a count with Vue watch()";
    titleText.color = "black";
    titleText.fontSize = 64;
    titleText.top = -200;
    advancedTexture.addControl(titleText);
    
    const counterText = new TextBlock("couter-text");
    counterText.text = "0";
    counterText.color = "black";
    counterText.fontSize = 64;
    advancedTexture.addControl(counterText);

    // Create a 2d button to increment the count
    const buttonIncrement = Button.CreateSimpleButton("button", "+");
    buttonIncrement.top = 250;
    buttonIncrement.left = "105px";
    buttonIncrement.width = 0.2;
    buttonIncrement.height = "200px";
    buttonIncrement.color = "white";
    buttonIncrement.fontSize = 64;
    buttonIncrement.cornerRadius = 20;
    buttonIncrement.background = labColors.slate4;
    buttonIncrement.onPointerUpObservable.add(() => {
        // We can modify the count directly instead of editing the value of the counterText control.
        count.value++;
    });
    advancedTexture.addControl(buttonIncrement);

    // Create a 2d button to decrement the count
    const buttonDecrement = Button.CreateSimpleButton("button", "–");
    buttonDecrement.top = 250;
    buttonDecrement.left = "-105px";
    buttonDecrement.width = 0.2;
    buttonDecrement.height = "200px";
    buttonDecrement.color = "white";
    buttonDecrement.fontSize = 64;
    buttonDecrement.cornerRadius = 20;
    buttonDecrement.background = labColors.slate4;
    buttonDecrement.onPointerUpObservable.add(() => {
        // We can modify the count directly instead of editing the value of the counterText control.
        count.value--;
    });
    advancedTexture.addControl(buttonDecrement);
    
    // watch() the count value and update the counterText control 
    watch(count, (newValue) => {
        scene.getTextureByName("card-texture").getControlByName("couter-text").text = newValue;
    });
    
};

const bjsCanvas = ref(null);
useCanvatoriumScene(bjsCanvas, createLabContent);

</script>
<template>
    <canvas id="bjsCanvas" ref="bjsCanvas" ></canvas>
</template>