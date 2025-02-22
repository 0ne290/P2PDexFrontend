<script setup lang="ts">

import { ref, onMounted } from "vue";
import { getAllOrders } from "@/services/apiService";
import { useTelegramStore } from '@/stores/telegram'

const telegram = useTelegramStore();

const orders = ref();

onMounted(async () => {
    orders.value = await getAllOrders();
});

</script>

<template>

    <table class="sell-orders-table">
        <thead>
            <tr>
                <th>Продавец</th>
                <th>Криптовалюта</th>
                <th>Количество</th>
                <th>Фиатная валюта</th>
                <th>Курс "Криптовалюта &rarr; Фиатная валюта"</th>
                <th>Цена</th>
                <th>Информация о способе оплаты</th>
            </tr>
        </thead>
        <tbody>
            <template v-for="order in orders">
                <RouterLink :to="{ name: 'getSellOrder', params: { guid: order.guid } }" custom v-slot="{ navigate }">
                    <tr role="button" @click="navigate">
                        <td>{{ order.sellerName == null ? order.sellerId : `${order.sellerId}, ${order.sellerName}` }}</td>
                        <td>{{ order.crypto }}</td>
                        <td>{{ order.cryptoAmount }}</td>
                        <td>{{ order.fiat }}</td>
                        <td>{{ order.cryptoToFiatExchangeRate }}</td>
                        <td>{{ order.fiatAmount }}</td>
                        <td>{{ order.paymentMethodInfo }}</td>
                    </tr>
                </RouterLink>
            </template>
        </tbody>
    </table>

</template>