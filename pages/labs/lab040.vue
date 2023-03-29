<template>
    <div>
        <canvas id="bjsCanvas" ref="bjsCanvas" />
    </div>
</template>

<script setup>
import { ref } from "vue";
import { Vector3, Color3, Color4, MeshBuilder, StandardMaterial } from "babylonjs";
import { AdvancedDynamicTexture, TextBlock, StackPanel, Control } from "babylonjs-gui";

const bjsCanvas = ref(null);

const route = useRoute()

definePageMeta({
    featured: true,
    title: 'Lab 040 – Lab Data Overlay',
    description: 'Using Babylon.js GUI to overlay lab data on the scene instead of using the DOM.'
})

// Add lab-specific content here using the provided 'scene' instance
const createLabContent = async (scene) => {
    // Create a BABYLON GUI AdvancedDynamicTexture
    const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
    
    // Create a panel to contain all the elements
    const panel = new StackPanel();
    panel.width = "220px";
    panel.fontSize = "14px";
    panel.background = labColors.slate7;
    panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    panel.paddingLeft = "10px"; // Offset left by 10px
    panel.paddingTop = "10px"; // Offset top by 10px
    advancedTexture.addControl(panel);
    
    // Add a header
    const header = new TextBlock();
    header.text = route.meta.title;
    header.height = "36px";
    header.color = "white";
    header.paddingLeft = "10px"; 
    header.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    
    // Add a description
    const description = new TextBlock();
    description.text = route.meta.description;
    description.height = "100px";
    description.color = "white";
    description.paddingLeft = "10px"; 
    description.paddingRight = "10px"; 
    description.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    description.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    description.textWrapping = true;
    
    
    // Add the header and description to the panel
    panel.addControl(header);
    panel.addControl(description);
    
    
};


// Without scene options (see lab001 for an example)
useCanvatoriumScene(bjsCanvas, createLabContent);

</script>
