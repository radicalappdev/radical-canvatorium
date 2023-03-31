<template>
  <div class="flex flex-col min-h-screen">
    <header class="fixed top-0 w-full h-12 bg-slate-800 text-white flex items-center justify-between px-4">
      <h1 class="text-lg font-bold">Canvatorium (revamped)</h1>
      <div class="flex">
        <nuxt-link to="/" class="mx-2">Featured Labs</nuxt-link>
        <nuxt-link to="/labs" class="mx-2">All Labs</nuxt-link>
      </div>
    </header>
    <main class="flex-1">
        <div class="mx-4 py-4">
            <slot />
        </div>
        </main>
    <footer class="fixed bottom-0 w-full h-8 bg-slate-800 text-white flex items-center justify-center">
      <p>Canvatorium © Radical Application Development {{ year }}</p>
    </footer>
  </div>
</template>

<script setup>
const year = new Date().getFullYear()
const route = useRoute()
</script>

<style>
/* Add styles to the main element to fill the viewport */
main {
  top: 3rem;
  bottom: 2rem;
  height: calc(100vh - 5rem);
  left: 0;
  right: 0;
  position: fixed;   
  overflow: scroll;
}

</style>

