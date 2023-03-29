<script setup>
import { MeshBuilder } from "babylonjs";

definePageMeta({
    featured: false,
    title: 'Lab 002 – watch and watchEffect',
    description: 'Lab 002 – watch and watchEffect'
})

const createLabContent = async (scene)  => {
    
    // Create a box
    const box = MeshBuilder.CreateBox("box", { size: 2 }, scene);
    box.position.y = 1;
    
    
};
const bjsCanvas = ref(null);
useCanvatoriumScene(bjsCanvas, createLabContent);

</script>
<template>
    <canvas id="bjsCanvas" ref="bjsCanvas" ></canvas>
</template>