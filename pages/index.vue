<template>
    <div>
        <h2>Index page</h2>
        <pre>{{ appConfig.colors }}</pre>
    </div>
</template>

<script setup>
const appConfig = useAppConfig()
console.log(appConfig.colors)
</script>