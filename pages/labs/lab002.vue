<template>
    <div>
        <h3 class="text-lg font-bold">Lab 002 – </h3>
        <p>
            
        </p>
        <div>
            <canvas id="bjsCanvas" ref="bjsCanvas" />
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { Vector3, Color3, Color4, MeshBuilder, StandardMaterial } from "babylonjs";
import { AdvancedDynamicTexture, TextBlock } from "babylonjs-gui";

const bjsCanvas = ref(null);

definePageMeta({
    featured: false,
    title: 'Lab 002 – watch and watchEffect',
    description: 'Lab 002 – watch and watchEffect'
})

const createLabContent = async (scene)  => {
    
    
    const material = new StandardMaterial("background-material", scene);
    material.diffuseColor = new Color3.FromHexString(labColors.slate2)
    material.alpha = 0.8;
    
    const background = MeshBuilder.CreateBox("background", { width: 3, height: 1, depth: 0.1 });
    background.material = material;
    background.position.y = 1.1;
    background.enableEdgesRendering();
    background.edgesWidth = 1.5;
    background.edgesColor = new Color4.FromHexString(labColors.slate7);
    
    const guiPlane = MeshBuilder.CreatePlane("gui-plane")
    guiPlane.parent = background;
    guiPlane.position.y = 0.14;
    guiPlane.position.z = -0.11;
    
    const advancedTexture = AdvancedDynamicTexture.CreateForMesh(guiPlane);
    advancedTexture.name = "card-texture";
    
    const cardText = new TextBlock("card-text");
    cardText.text = "Canvatorium";
    cardText.color = labColors.slate8;
    cardText.fontSize = 64;
    
    const subtitleText = new TextBlock("subtitle-text");
    subtitleText.text = "(revamped)";
    subtitleText.color = labColors.slate7;
    subtitleText.fontSize = 32;
    subtitleText.top = 60;
    
    advancedTexture.addControl(cardText);
    advancedTexture.addControl(subtitleText);
    guiPlane.scaling = new Vector3(5, 5, 5);
    
    
    
};

useCanvatoriumScene(bjsCanvas, createLabContent);

</script>
