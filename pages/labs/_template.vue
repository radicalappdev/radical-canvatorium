<script setup>
import { MeshBuilder } from "babylonjs";

definePageMeta({
    featured: false,
    title: 'Lab Template',
    description: 'Copy this template to create a new lab'
})

const createLabContent = async (scene)  => {
    
    MeshBuilder.CreateBox("box", { size: 1 }, scene).position.y = 0.5;  
    
};

const bjsCanvas = ref(null);
useCanvatoriumScene(bjsCanvas, createLabContent);

</script>
<template>
    <canvas id="bjsCanvas" ref="bjsCanvas" ></canvas>
</template>