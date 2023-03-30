<script setup>
import { MeshBuilder, Tools } from "babylonjs";

definePageMeta({
    featured: true,
    title: 'Lab 041 - Screenshots with Babylon.js',
    description: 'Taking screenshots with Babylon.js.'
})

const createLabContent = async (scene)  => {
    
    const engine = scene.getEngine();
    const camera = scene.activeCamera;
    MeshBuilder.CreateBox("box", { size: 1 }, scene).position.y = 0.5;  
    
    // Take a screenshot of the scene when I press the 's' key
    window.addEventListener("keydown", (event) => {
        if (event.key === "s") {
            const screenshot = Tools.CreateScreenshot(engine, camera, 1024);
            console.log(screenshot);
        }
    });

    
};

const bjsCanvas = ref(null);
useCanvatoriumScene(bjsCanvas, createLabContent);
</script>

<template>
    <canvas id="bjsCanvas" ref="bjsCanvas" ></canvas>
</template>