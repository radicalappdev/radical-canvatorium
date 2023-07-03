<template>
  <div class="max-w-screen-md h-[calc(100%_-_2rem)] overflow-y-auto container mx-auto">
    <h1 class="text-xl font-bold my-4">Canvatorium</h1>
    <p>An experimental design lab for spatial computing</p>
    <br />
    <p>All information about this project has moved to <a class="underline" href="https://vrhermit.com/canvatorium/">https://vrhermit.com/canvatorium/</a></p>
  </div>
</template>

<script setup>
  definePageMeta({
    featured: false,
    title: "Featrued Labs",
    description:
      "These are the labs that I'm working on or that I want to hightlight. For now, these are just `nuxt-link` components, but I'll might convert this page to a Babylon JS scene."
  });

  // const router = useRouter();

  // const allRoutes = router.options.routes;

  // Create a new array where route.meta.featured is true
  // const featuredRoutes = allRoutes.filter((route) => route.meta.featured);
</script>
