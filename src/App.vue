<script setup lang="ts">
//import { RouterLink, RouterView } from 'vue-router'

import { onMounted } from "vue";
import Header from "@/components/TheHeader.vue";
import { useMetamaskStore } from "@/stores/metamask"
import { useTelegramStore } from "@/stores/telegram"

onMounted(async () => {
    const metamask = useMetamaskStore();
    const telegram = useTelegramStore();

    await metamask.init();
    await telegram.init();
});

</script>

<template>

<Header />
<main class="main container third-border-color border rounded p-0">
    <RouterView />
</main>

</template>

<style scoped>
</style>