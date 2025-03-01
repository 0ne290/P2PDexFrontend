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

    <header class="header">
        <Header />
    </header>

    <main class="main">
        <RouterView v-if="telegram.isAuth && metamask.isAuth" />
    </main>

</template>

<style scoped></style>