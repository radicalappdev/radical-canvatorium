<template>
    <div>
        <h3 class="text-lg font-bold">Lab 001 – Hello Canvatorium</h3>
        <p>
            This is a recreation of the original Canvatorium Lab 000. I'm rebuilding the project in Nuxt.
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

// Add lab-specific content here using the provided 'scene' instance
const createLabContent = (scene)  => {
    
    // Lab 001 only. Move the camera to a better position for the initial scene.
    scene.getCameraByName("camera").position = new Vector3(0, 1.4, -4);
    
    const material = new StandardMaterial("background-material", scene);
    material.diffuseColor = new Color3.FromHexString(labColors.slate5)
    material.alpha = 0.8;
    
    const background = MeshBuilder.CreateBox("background", { width: 3, height: 1, depth: 0.1 });
    background.material = material;
    background.position.y = 1.1;
    background.enableEdgesRendering();
    background.edgesWidth = 1.5;
    background.edgesColor = new Color4.FromHexString(labColors.slate1);

    const guiPlane = MeshBuilder.CreatePlane("gui-plane")
    guiPlane.parent = background;
    guiPlane.position.y = 0.14;
    guiPlane.position.z = -0.11;
    
    const advancedTexture = AdvancedDynamicTexture.CreateForMesh(guiPlane);
    advancedTexture.name = "card-texture";
    
    const cardText = new TextBlock("card-text");
    cardText.text = "Canvatorium";
    cardText.color = "white";
    cardText.fontSize = 64;
    
    const subtitleText = new TextBlock("subtitle-text");
    subtitleText.text = "(revamped)";
    subtitleText.color = "white";
    subtitleText.fontSize = 32;
    subtitleText.top = 60;
    
    advancedTexture.addControl(cardText);
    advancedTexture.addControl(subtitleText);
    guiPlane.scaling = new Vector3(5, 5, 5);
};

// If a lab uses the default options, you can just call useBabylonScene() with the bjsCanvas ref and the createLabContent function.
// Otherwise, you can pass in an options object with the following properties:
const labSceneOptions = {
    useCamera: true,
    useLight: true,
    useRoom: true,
};

// With scene options
useCanvatoriumScene(bjsCanvas, createLabContent, labSceneOptions);

// Without scene options (see lab002 for an example)
// useCanvatoriumScene(bjsCanvas, createLabContent);

</script>
