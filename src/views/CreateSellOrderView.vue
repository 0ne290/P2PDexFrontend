<script setup lang="ts">

import { o } from "@/services/apiService";

</script>

<template>

<div v-for="order in orders">
    {{ order.seller }} | {{ order.crypto }} | {{ order.cryptoAmount }} | {{ order.fiat }} | {{ order.cryptoToFiatExchangeRate }} | {{ order.fiatAmount }} | {{ order.paymentMethodInfo }}
</div>

</template>