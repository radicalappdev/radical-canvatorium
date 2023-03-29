<template>
  <div>
    <h2 class="text-lg font-bold">Featured Labs</h2>
    <br>
    <div class="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
      <nuxt-link v-for="route in featuredRoutes" :to="route.path" class="bg-slate-100 p-2 hover:bg-slate-200 drop-shadow-lg" :key="route.path">
        <p class="font-bold">{{ route.meta.title }}</p>
        <p>{{ route.meta.description }}</p>
      </nuxt-link>
    </div>
  </div>
</template>

<script setup>

const router = useRouter();

const allRoutes = router.options.routes;

// Create a new array where route.meta.featured is true
const featuredRoutes = allRoutes.filter(route => route.meta.featured);
</script>
