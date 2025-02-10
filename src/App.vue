<script setup lang="ts">
//import { RouterLink, RouterView } from 'vue-router'

import { onMounted } from "vue";
import Header from "@/components/TheHeader.vue";
import { useMetamaskStore } from "@/stores/metamask"
import { useTelegramStore } from "@/stores/telegram"

const telegram = useTelegramStore();
const metamask = useMetamaskStore();

onMounted(async () => {
    await metamask.init();
    await telegram.init();
});

</script>

<template>

<Header />
<main class="main container third-border-color border rounded p-0">
    <RouterView v-if="telegram.isAuth && metamask.isAuth"/>
</main>

</template>

<style scoped>
</style>