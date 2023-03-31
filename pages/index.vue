<template>
  <div class="max-w-screen-md h-[calc(100%_-_2rem)] overflow-y-auto container mx-auto">
    <h2 class="text-lg font-bold my-4">Featured Labs</h2>
    
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
    title: 'Featrued Labs',
    description: "These are the labs that I'm working on or that I want to hightlight. For now, these are just `nuxt-link` components, but I'll might convert this page to a Babylon JS scene."
})

const router = useRouter();

const allRoutes = router.options.routes;

// Create a new array where route.meta.featured is true
const featuredRoutes = allRoutes.filter(route => route.meta.featured);
</script>
