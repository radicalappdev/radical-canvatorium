import { onMounted, onUnmounted, Ref } from "vue";
import { Engine, Scene } from "babylonjs";
import { createLabScene, LabSceneOptions } from "@/utils/labtools";

export const useBabylonScene = (bjsCanvas: Ref<HTMLCanvasElement | null>, createLabContent: (scene: Scene) => void, options?: LabSceneOptions) => {
  let engine: Engine | null = null;

  const handleResize = () => {
    if (engine) {
      engine.resize();
    }
  };

  onMounted(() => {
    if (bjsCanvas.value) {
      const { engine: createdEngine } = createLabScene(bjsCanvas.value, createLabContent, options);
      engine = createdEngine;
      window.addEventListener("resize", handleResize);
    }
  });

  onUnmounted(() => {
    if (engine) {
      engine.dispose();
    }
    window.removeEventListener("resize", handleResize);
  });
};
