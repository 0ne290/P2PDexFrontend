<script setup lang="ts">

import * as signalR from "@microsoft/signalr";
import { ref, onMounted } from 'vue';
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import { getOrder } from "@/services/apiService";

const telegram = useTelegramStore();
const router = useRouter();

const props = defineProps({
    guid: String
});

onBeforeRouteLeave(async (_, __) => {
    await sellOrderHub.stop();
})

const order = ref<any>();

const sellOrderHub = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost/api/sell-order-hub", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
    })
    .build();

sellOrderHub.on("StatusChangedNotificationHandler", async function (newStatus) {
    if (newStatus == "RespondedByBuyer") {
        order.value = await getOrder(props.guid!);
        if (order.value == null) {
            alert('У вас нет доступа к данному заказу.');

            router.push({ name: 'getAllSellOrders' });

            return;
        }
    }

    order.value.status = newStatus;
});

onMounted(async () => {
    order.value = await getOrder(props.guid!);
    if (order.value == null) {
        alert('У вас нет доступа к данному заказу.');

        router.push({ name: 'getAllSellOrders' });

        return;
    }

    await sellOrderHub.start();
    await sellOrderHub.invoke("SubscribeToStatusChangeNotification", props.guid)
});

</script>

<template>

    <div>
        <p>{{ order.status }}</p>
        <p>{{ order.sellerId }}</p>
        <p>{{ order.sellerName }}</p>
        <p>{{ order.buyerId }}</p>
        <p>{{ order.buyerName }}</p>
        <p>{{ order.crypto }}</p>
        <p>{{ order.cryptoAmount }}</p>
        <p>{{ order.fiat }}</p>
        <p>{{ order.cryptoToFiatExchangeRate }}</p>
        <p>{{ order.fiatAmount }}</p>
        <p>{{ order.paymentMethodInfo }}</p>
        <br>
        <template v-if="order.status == 'SellerToExchangerTransferTransactionConfirmed'">
            <template v-if="order.sellerId == telegram.userId">
                <p>Ждите отклик покупателя.</p>
            </template>
            <template v-else>
                <p>Откликнуться.</p>
            </template>
        </template>
        <template v-else>
            <p>Статус "{{ order.status }}" заказов не поддерживается.</p>
        </template>
    </div>

</template>