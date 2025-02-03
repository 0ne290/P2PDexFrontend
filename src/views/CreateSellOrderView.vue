<script setup lang="ts">

import { ref } from "vue";
import { createSellOrder } from "@/services/apiService";

const cryptoAmount = ref('');
const cryptoToFiatExchangeRate = ref('');
const paymentMethodInfo = ref('');

</script>

<template>

<input type="text" v-model="cryptoAmount" placeholder="ETH amount">
<input type="text" v-model="cryptoToFiatExchangeRate" placeholder="ETH to RUB exchange rate">
<input type="text" v-model="paymentMethodInfo" placeholder="Payment method info">
<button @click="createSellOrder(Number(cryptoAmount), Number(cryptoToFiatExchangeRate), paymentMethodInfo)">Create sell order</button>

</template>