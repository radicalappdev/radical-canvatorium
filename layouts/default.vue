<template>
  <div class="flex flex-col min-h-screen">
    <main>
      <div class="lab-container" :class="labClasses()">
        <!-- Using a font in Babylon JS is not enough to tell the browser to load it -->
        <!-- Use the font on an off-screen element to force the browser to load it -->
        <!-- TODO: Creating a component where I can specify the fonts that I need for a lab. -->
        <slot />
        <div style="opacity: 0; z-index: -100">
          <p style="font-family: 'NotoSans-Medium', sans-serif">Loading font NotoSans-Medium</p>
          <p style="font-family: 'NotoSans-MediumItalic', sans-serif">Loading font NotoSans-MediumItalic</p>

          <p style="font-family: 'NotoSans-SemiBold', sans-serif">Loading font NotoSans-SemiBold</p>
          <p style="font-family: 'NotoSans-SemiBoldItalic', sans-serif">Loading font NotoSans-SemiBoldItalic</p>

          <p style="font-family: 'NotoSans-Bold', sans-serif">Loading font NotoSans-Bold</p>
          <p style="font-family: 'NotoSans-BoldItalic', sans-serif">Loading font NotoSans-BoldItalic</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
  const year = new Date().getFullYear();

  const route = useRoute();

  // Create a new reactive variable to store the active tab
  const activeTab = ref("lab");

  // Update the active tab when a button is clicked
  const showLab = () => {
    activeTab.value = "lab";
  };

  const showLabNotes = () => {
    activeTab.value = "lab-notes";
  };

  // Add computed classes to show or hide the lab and lab-notes components based on the active tab
  const labClasses = () => ({
    hidden: activeTab.value !== "lab"
  });

  const labNotesClasses = () => ({
    hidden: activeTab.value !== "lab-notes"
  });

  // Always set activeTab to 'lab' when the route changes
  watch(
    () => route.path,
    () => {
      activeTab.value = "lab";
    }
  );
</script>

<style>
  /* Add styles to the main element to fill the viewport */
  /* .lab-container {
    top: 6rem;
    bottom: 2rem;
    height: calc(100vh - 8rem);
    left: 0;
    right: 0;
    position: fixed;
    overflow: scroll;
  }

  .lab-notes {
    top: 6rem;
    bottom: 2rem;
    height: calc(100vh - 8rem);
    left: 0;
    right: 0;
    position: fixed;
    overflow: scroll;
  } */

  /* Used on the canvas elements in the pages rendered by the slot */
  #bjsCanvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: #64748b 1px solid;
  }

  /* Hacking the style of the webxr button */
  /* There has to be a better way to do this */
  .babylonVRicon {
    background-color: #1e293b !important;
    height: 36px !important;
    width: 60px !important;
    position: fixed;
    bottom: 12px;
    right: 12px;
    border-radius: 4px;
  }
</style>
