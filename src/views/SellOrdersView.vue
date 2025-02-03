<script setup lang="ts">

import { ref, onMounted } from "vue";
import { getAllOrders } from "@/services/apiService";

const orders = ref();

onMounted(async () => {
    orders.value = await getAllOrders();
});

</script>

<template>

<div v-for="order in orders">
    {{ order.seller }} | {{ order.crypto }} | {{ order.cryptoAmount }} | {{ order.fiat }} | {{ order.cryptoToFiatExchangeRate }} | {{ order.fiatAmount }} | {{ order.paymentMethodInfo }}
</div>

</template>