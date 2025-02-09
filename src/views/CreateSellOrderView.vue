<script setup lang="ts">

import { ref } from "vue";
import { createSellOrder } from "@/services/apiService";
import { sendMessage } from "@/services/telegramService";

const cryptoAmount = ref('');
const cryptoToFiatExchangeRate = ref('');
const paymentMethodInfo = ref('');

async function createSellOrderZ() {
    await createSellOrder(Number(cryptoAmount.value), Number(cryptoToFiatExchangeRate.value), paymentMethodInfo.value);
    
    await sendMessage('Вы создали заказ на продажу.')

    alert('Sell order is successfully created. Check "Sell orders" tab.')
}

</script>

<template>

    <div class="w-100 h-100 d-flex flex-column justify-content-center align-items-center">
        <span class="border border-2 second-border-color rounded d-flex flex-column justify-content-center align-items-center gap-3 p-5">
        <input type="text" class="third-text-color first-background-color second-border-color border-0 border-bottom px-3 py-1" v-model="cryptoAmount" placeholder="ETH amount">
        <input type="text" class="third-text-color first-background-color second-border-color border-0 border-bottom px-3 py-1" v-model="cryptoToFiatExchangeRate" placeholder="ETH to RUB exchange rate">
        <input type="text" class="third-text-color first-background-color second-border-color border-0 border-bottom px-3 py-1" v-model="paymentMethodInfo" placeholder="Payment method info">
        <button class="third-text-color first-background-color second-border-color rounded mt-5 px-3 py-1" @click="createSellOrderZ">
            Create sell order
        </button>
        </span>
    </div>

</template>