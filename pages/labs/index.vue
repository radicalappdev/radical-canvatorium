<template>
  <div class="max-w-screen-md h-[calc(100%_-_2rem)] overflow-y-auto container mx-auto">
    <h2 class="text-lg font-bold my-4">All Labs</h2>
    <div class="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
      <nuxt-link v-for="route in labRoutes" :to="route.path" class="bg-slate-100 p-2 hover:bg-slate-200 drop-shadow-lg" :key="route.path">
        <p class="font-bold">{{ route.meta.title }}</p>
        <p>{{ route.meta.description }}</p>
      </nuxt-link>
    </div>
  </div>
</template>

<script setup>
  const router = useRouter();

  definePageMeta({
    featured: false,
    title: "All Labs",
    description: "A list of all labs in the project. For now, these are just `nuxt-link` components, but I'll might convert this page to a Babylon JS scene."
  });

  const allRoutes = router.options.routes;

  // Create a new array that only includes routes that begon with /labs and exlude the index page
  const labRoutes = allRoutes.filter((route) => route.path.startsWith("/labs") && route.path !== "/labs");
</script>
