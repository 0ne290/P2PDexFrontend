<script setup lang="ts">
//import { RouterLink, RouterView } from 'vue-router'

import Header from "@/components/TheHeader.vue";
import { useMetamaskStore } from "@/stores/metamask"

const metamask = useMetamaskStore();
await metamask.init();

</script>

<template>

<Header />
<main class="main container">
    <RouterView />
</main>

</template>

<style scoped>
</style>