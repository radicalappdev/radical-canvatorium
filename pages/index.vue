<template>
  <div class="max-w-screen-md h-[calc(100%_-_2rem)] overflow-y-auto container mx-auto">
    <h1 class="text-xl font-bold my-4">Canvatorium</h1>
    <p>An experimental design lab for spatial computing</p>

    <div class="grid md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-4 my-4">
      <nuxt-link to="/labs" class="bg-slate-100 p-2 hover:bg-slate-200 drop-shadow-lg rounded">
        <p class="font-bold">Labs</p>
        <p>Spatial Computing (WebXR, VR, AR, MR)</p>
      </nuxt-link>
      <!-- <nuxt-link to="/benches" class="bg-slate-100 p-2 hover:bg-slate-200 drop-shadow-lg rounded">
        <p class="font-bold">Benches</p>
        <p>Exploring 3D concepts and Babylon JS features without WebXR</p>
      </nuxt-link> -->
    </div>
    <p>Go to the project landing pages for the latest labs and updates <a class="underline" href="https://vrhermit.com/canvatorium/">https://vrhermit.com/canvatorium/</a></p>
  </div>
</template>

<script setup>
  definePageMeta({
    featured: false,
    title: "Canvatorium",
    description: "An experimental design lab for spatial computing"
  });

  onMounted(() => {
    window.document.title = "Canvatorium";
  });
</script>
