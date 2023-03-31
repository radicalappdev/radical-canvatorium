<template>
  <div class="flex flex-col min-h-screen">
    <header class="fixed top-0 w-full h-24 bg-slate-800 text-white px-3">
      <div class="flex flex-col">
        <div class="flex flex-row items-center justify-between my-2">
          <nuxt-link to="/labs/lab000" class="text-lg font-bold">Canvatorium <span class="hidden sm:inline">(revamped)</span></nuxt-link>

          <div class="flex">
            <nuxt-link to="/" class="mx-2 underline">Featured</nuxt-link>
            <nuxt-link to="/labs" class="mx-2 underline">All Labs</nuxt-link>
          </div>
        </div>

        <div class="flex flex-row w-full mt-1">
          <button
            @click="showLab"
            :class="{
              'border border-slate-500 rounded-l-md bg-slate-900 text-white font-semibold focus:outline-none': activeTab === 'lab',
              'bg-slate-700 rounded-l-md': activeTab !== 'lab'
            }"
            class="flex-1 py-1 focus:outline-none"
          >
            Lab Scene
          </button>
          <button
            @click="showLabNotes"
            :class="{
              'border border-slate-500 rounded-r-md bg-slate-900 text-white font-semibold focus:outline-none': activeTab === 'lab-notes',
              'bg-slate-700 rounded-r-md': activeTab !== 'lab-notes'
            }"
            class="flex-1 py-1 focus:outline-none"
          >
            Lab Notes
          </button>
        </div>
      </div>
    </header>

    <main>
      <div class="lab-container" :class="labClasses()">
        <slot />
      </div>

      <div class="lab-notes" :class="labNotesClasses()">
        <div class="container mx-auto my-4 p-4 bg-white max-w-screen-md h-[calc(100%_-_2rem)] overflow-y-auto">
          <h3 class="text-xl font-semibold">{{ $route.meta?.title ?? "Unknown Lab" }}</h3>
          <p>{{ $route.meta?.description ?? "No description" }}</p>
          <h4>Lab Notes:</h4>
          <pre class="text-sm mt-4 whitespace-pre-wrap">{{ $route.meta?.labNotes ?? "" }}</pre>
        </div>
      </div>
    </main>
    <footer class="fixed bottom-0 w-full h-8 bg-slate-800 text-sm text-white flex items-center justify-center">
      <p>Canvatorium © Radical Application Development {{ year }}</p>
    </footer>
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
.lab-container {
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
}

/* Used on the canvas elements in the pages rendered by the slot */
#bjsCanvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
