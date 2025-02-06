<script setup lang="ts">

import { ref, onMounted } from "vue";
import { getAllOrders } from "@/services/apiService";

const orders = ref();

onMounted(async () => {
    orders.value = await getAllOrders();
});

</script>

<template>

    <table>
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
            <tr v-for="order in orders">
                <td>{{ order.seller }}</td>
                <td>{{ order.crypto }}</td>
                <td>{{ order.cryptoAmount }}</td>
                <td>{{ order.fiat }}</td>
                <td>{{ order.cryptoToFiatExchangeRate }}</td>
                <td>{{ order.fiatAmount }}</td>
                <td>{{ order.paymentMethodInfo }}</td>
            </tr>
        </tbody>
    </table>

</template>