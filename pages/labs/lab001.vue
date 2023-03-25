<template>
    <div>
        <h3 class="text-lg font-bold">Lab 001</h3>
        <p>This lab is just the starting point of the app. I'm using this as a place where I can work on the shared labtools and work out the layout of the labs page.</p>
        <div>
            <canvas id="bjsCanvas" ref="bjsCanvas" />
        </div>
    </div>
</template>

<script setup>
import * as BABYLON from "babylonjs";

const bjsCanvas = ref(null);
let engine;
let scene;

const createScene = async (canvas) => {
    // Create and customize the scene
    engine = new BABYLON.Engine(canvas);
    scene = new BABYLON.Scene(engine);
    
    // Create a camera
    labCreateCamera(scene);
    
    // Create a ground
    labCreateRoom(scene);
    
    // Create a light
    labCreateLights(scene);
    
    engine.runRenderLoop(() => {
        scene.render();
    });
    
    window.addEventListener("resize", resizeListener);
    
};

const resizeListener = () => {
    if (engine) {
        engine.resize();
    }
};

onMounted(() => {
    if (bjsCanvas.value) {
        createScene(bjsCanvas.value);
    }
});

onUnmounted(() => {
    engine.dispose();
    window.removeEventListener("resize", resizeListener);
});

</script>