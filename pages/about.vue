<template>
    <div>
        <h1>Index page</h1>
        <pre>{{ appConfig.colors }}</pre>
    </div>
</template>

<script setup>
const appConfig = useAppConfig()
console.log(appConfig.colors)
</script>