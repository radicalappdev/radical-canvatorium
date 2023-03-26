<template>
    <div>
        <h2 class="text-lg font-bold">Featured Labs</h2>
        <br>
        <div class="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
            <nuxt-link to="/labs/lab000" class="bg-slate-100 p-2 hover:bg-slate-200 drop-shadow-lg">
                <p class="font-bold">Lab 000 – Hello Canvatorium</p>
                <p>This is a recreation of the original Canvatorium Lab 000. Just setting up the shared lab resources. Grid, Lights, Camera, etc.</p>
            </nuxt-link>
            <nuxt-link to="/labs/lab001" class="bg-slate-100 p-2 hover:bg-slate-200 drop-shadow-lg">
                <p class="font-bold">Lab 001 – Picking Colors</p>
                <p class="">This is a recreation of the original Canvatorium Lab 001. I picked out some colors to use throughout the labs in the future. I created a box for each color and used the standard BabylonJS material.</p>
            </nuxt-link>
        </div>
    </div>
</template>

<script setup>
const appConfig = useAppConfig()
console.log(appConfig.colors)
</script>