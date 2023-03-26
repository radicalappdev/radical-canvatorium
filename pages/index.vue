<template>
    <div>
        <h2 class="text-lg font-bold">Featured Labs</h2>
        <br>
        <div class="flex flex-row space-x-1">
            <nuxt-link to="/labs/lab000" class="bg-slate-100 p-2">
                <p class="font-bold">Lab 000</p>
                <p>Hello Canvatorium</p>
            </nuxt-link>
            <nuxt-link to="/labs/lab001" class="bg-slate-100 p-2">
                <p class="font-bold">Lab 001</p>
                <p>Picking Colors</p>
            </nuxt-link>
        </div>
    </div>
</template>

<script setup>
const appConfig = useAppConfig()
console.log(appConfig.colors)
</script>