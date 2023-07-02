<template>
  <div class="max-w-screen-md h-[calc(100%_-_2rem)] overflow-y-auto container mx-auto">
    <h1 class="text-xl font-bold my-4">Canvatorium</h1>
    <p>An experimental design lab for spatial computing</p>

    <h3 class="text-lg font-bold my-4">Project resources</h3>
    The revamped project is a little disorganized at the moment, but here are some resources to help you get started.
    <ul class="list-disc pl-5">
      <li>Featured Labs is a list of my current or recent focus.</li>
      <li>Click on All Labs to find everything else.</li>
      <li>Find the code on GitHub: <a class="underline" href="https://github.com/radicalappdev/radical-canvatorium" target="_blank">repo</a></li>
      <li>Latest posts and recaps: <a class="underline" href="https://vrhermit.com/category/technical/canvatorium/" target="_blank">vrhermit.com</a></li>
    </ul>

    <h3 class="text-lg font-bold my-4">Featured Labs</h3>

    <div class="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
      <nuxt-link v-for="route in featuredRoutes" :to="route.path" class="bg-slate-100 p-2 hover:bg-slate-200 drop-shadow-lg" :key="route.path">
        <p class="font-bold">{{ route.meta.title }}</p>
        <p>{{ route.meta.description }}</p>
      </nuxt-link>
    </div>
  </div>
</template>

<script setup>
  definePageMeta({
    featured: false,
    title: "Featrued Labs",
    description:
      "These are the labs that I'm working on or that I want to hightlight. For now, these are just `nuxt-link` components, but I'll might convert this page to a Babylon JS scene."
  });

  const router = useRouter();

  const allRoutes = router.options.routes;

  // Create a new array where route.meta.featured is true
  const featuredRoutes = allRoutes.filter((route) => route.meta.featured);
</script>
