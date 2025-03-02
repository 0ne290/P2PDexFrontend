<script setup lang="ts">

import { ref } from "vue";
import { create as createSellOrder } from "@/services/api/sellOrder";

const cryptoAmount = ref('');
const cryptoToFiatExchangeRate = ref('');
const paymentMethodInfo = ref('');

</script>

<template>

    <div class="container inherit-min-height">
        <div class="inherit-min-height d-flex justify-content-center align-items-center">
            <div
                class="w-25 border border-2 second-border-color rounded d-flex flex-column justify-content-center align-items-center gap-3 p-4">
                <input type="text"
                    class="third-text-color first-background-color second-border-color border-0 border-bottom w-100 px-3 py-1"
                    v-model="cryptoAmount" placeholder="Количество ETH">
                <input type="text"
                    class="third-text-color first-background-color second-border-color border-0 border-bottom w-100 px-3 py-1"
                    v-model="cryptoToFiatExchangeRate" placeholder='Курс "ETH → RUB"'>
                <textarea
                    class="third-text-color first-background-color second-border-color border-0 border-bottom w-100 px-3 py-1"
                    v-model="paymentMethodInfo" placeholder="Информация о способе оплаты"></textarea>
                <button class="third-text-color first-background-color second-border-color rounded mt-3 px-3 py-1"
                    @click="createSellOrder(Number(cryptoAmount), Number(cryptoToFiatExchangeRate), paymentMethodInfo)">
                    Создать
                </button>
            </div>
        </div>
    </div>

</template>