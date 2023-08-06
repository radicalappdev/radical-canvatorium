<template>
  <div class="max-w-screen-md h-[calc(100%_-_2rem)] overflow-y-auto container mx-auto">
    <h1 class="text-xl font-bold my-4">Canvatorium</h1>
    <p>An experimental design lab for spatial computing</p>
    <br />
    <p>All information about this project has moved to <a class="underline" href="https://vrhermit.com/canvatorium/">https://vrhermit.com/canvatorium/</a></p>
    <br />
    <h2 class="text-lg font-bold my-4">All Labs</h2>
    <div class="grid md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-4">
      <nuxt-link v-for="route in labRoutes" :to="route.path" class="bg-slate-100 p-2 hover:bg-slate-200 drop-shadow-lg" :key="route.path">
        <p class="font-bold">{{ route.meta.title }}</p>
        <p>{{ route.meta.description }}</p>
      </nuxt-link>
    </div>
    <br />
    <h2 class="text-lg font-bold my-4">All Benches</h2>
    <div class="grid md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-4">
      <nuxt-link v-for="route in benchRoutes" :to="route.path" class="bg-slate-100 p-2 hover:bg-slate-200 drop-shadow-lg" :key="route.path">
        <p class="font-bold">{{ route.meta.title }}</p>
        <p>{{ route.meta.description }}</p>
      </nuxt-link>
    </div>
  </div>
</template>

<script setup>
  definePageMeta({
    featured: false,
    title: "Home",
    description: "You are here"
  });

  const router = useRouter();

  const allRoutes = router.options.routes;

  const labRoutes = allRoutes.filter((route) => route.path.startsWith("/labs") && route.path !== "/labs");

  const benchRoutes = allRoutes.filter((route) => route.path.startsWith("/benches") && route.path !== "/benches");
</script>
