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

    alert('Заказ на продажу успешно создан. Другие пользователи смогут его увидеть после того, как транзакция перевода криптовалюты на эскроу-счет будет подтверждена. Сервер запрашивает подтверждение у блокчейна каждые две минуты.')
}

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
                    @click="createSellOrderZ">
                    Создать
                </button>
            </div>
        </div>
    </div>

</template>