<template>
  <div class="max-w-screen-md h-[calc(100%_-_2rem)] overflow-y-auto container mx-auto">
    <h2 class="text-lg font-bold my-4">All Benches</h2>
    <nuxt-link v-for="route in labRoutes" :to="route.path" :key="route.path">
      <p class="p-2 hover:bg-slate-100 drop-shadow-lg">{{ route.meta.title }}</p>
    </nuxt-link>
  </div>
</template>

<script setup>
  const router = useRouter();

  definePageMeta({
    featured: false,
    title: "All Benches",
    description: "A list of all benches in the project. For now, these are just `nuxt-link` components, but I'll might convert this page to a Babylon JS scene."
  });

  const allRoutes = router.options.routes;

  // Create a new array that only includes routes that begon with /labs and exlude the index page
  let labRoutes = allRoutes.filter((route) => route.path.startsWith("/benches") && route.path !== "/benches");
  labRoutes = labRoutes.sort((a, b) => {
    if (a.meta.title > b.meta.title) {
      return -1;
    }
    if (a.meta.title < b.meta.title) {
      return 1;
    }
    return 0;
  });
</script>
