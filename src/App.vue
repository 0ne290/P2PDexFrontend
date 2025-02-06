<script setup lang="ts">
//import { RouterLink, RouterView } from 'vue-router'

import { onMounted } from "vue";
import Header from "@/components/TheHeader.vue";
import { useMetamaskStore } from "@/stores/metamask"

onMounted(async () => {
    const metamask = useMetamaskStore();
    await metamask.init();
});

</script>

<template>

<Header />
<main class="main container second-border-color border rounded">
    <RouterView />
</main>

</template>

<style scoped>
</style>