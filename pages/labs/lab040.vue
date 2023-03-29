<script setup>
import { ref } from "vue";
import { AdvancedDynamicTexture, TextBlock, StackPanel, Control, ScrollViewer } from "babylonjs-gui";

const bjsCanvas = ref(null);

const route = useRoute()

definePageMeta({
    featured: true,
    title: 'Lab 040 – Lab Data Overlay with Babylon.js GUI',
    description: 'Using Babylon.js GUI to overlay lab data on the scene instead of using the DOM.'
})

// Add lab-specific content here using the provided 'scene' instance
const createLabContent = async (scene) => {
    // Create a BABYLON GUI AdvancedDynamicTexture
    const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");

    // Create an outer panel to contain the card and place it at the top left of the screen
    const outerPanel = new StackPanel();
    // TODO: on small screens, the outer panel should take up the whole screen instead of being pinned to the top left corner.
    outerPanel.width = "320px";
    outerPanel.background = labColors.slate8;
    outerPanel.alpha = 0.8;
    outerPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    outerPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
  
  
    // Create an inner panel to contain the card content. This has no background and is used to add padding to the card content.
    const innerPanel = new StackPanel();
    innerPanel.width = "320px";
    innerPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    innerPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    innerPanel.paddingTop = "10px";
    innerPanel.paddingLeft = "10px";
    innerPanel.paddingRight = "10px";
    
    // Add a header
    const title = new TextBlock();
    title.text = route.meta.title;
    title.height = "60px";
    title.color = "white";
    title.paddingTop = "10px";
    title.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    title.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    title.fontSize = "22px";
    title.textWrapping = true;
    
    // Add a description
    const description = new TextBlock();
    description.text = route.meta.description;
    description.height = "100px";
    description.color = "white";
    description.paddingTop = "10px";
    description.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    description.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    description.fontSize = "14px";
    description.textWrapping = true;
    
    // Add the header and description to the panel
    innerPanel.addControl(title);
    innerPanel.addControl(description);
    
    // Add the panel to the outer panel
    outerPanel.addControl(innerPanel);
    
    advancedTexture.addControl(outerPanel);
    
    
};

// Without scene options (see lab001 for an example)
useCanvatoriumScene(bjsCanvas, createLabContent);

</script>

<template>
    <canvas id="bjsCanvas" ref="bjsCanvas" ></canvas>
</template>

