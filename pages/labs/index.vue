<template>
    <h2 class="text-lg font-bold">All Labs</h2>
      <div class="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
      <nuxt-link v-for="route in labRoutes" :to="route.path" class="bg-slate-100 p-2 hover:bg-slate-200 drop-shadow-lg" :key="route.path">
        <p class="font-bold">{{ route.meta.title }}</p>
        <p>{{ route.meta.description }}</p>
      </nuxt-link>
    </div>
</template>

<script setup>

const router = useRouter()

const allRoutes = router.options.routes

// Create a new array that only includes routes that begon with /labs and exlude the index page
const labRoutes = allRoutes.filter(route => route.path.startsWith('/labs') && route.path !== '/labs')

</script>

