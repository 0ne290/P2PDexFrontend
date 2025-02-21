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

// Вот это хорошо бы заменить на onUnmounted()
onBeforeRouteLeave(async (_, __) => {
    if (trigger.value) {
        await sellOrderHub.stop();
    }
})

const order = ref<any>();
const trigger = ref<boolean>(false);
let sellOrderHub: signalR.HubConnection;

onMounted(async () => {
    order.value = await getOrder(props.guid!);
    if (order.value == null) {
        alert('У вас нет доступа к данному заказу.');

        router.push({ name: 'getAllSellOrders' });

        return;
    }

    sellOrderHub = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost/api/sell-order-hub", {
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets
        })
        .build();
    sellOrderHub.on("StatusChangedNotificationHandler", async function (newStatus) {
        if (newStatus == "RespondedByBuyer") {
            order.value = await getOrder(props.guid!);
            if (order.value == null) {
                router.push({ name: 'getAllSellOrders' });

                return;
            }
        }

        order.value.status = newStatus;
    });

    await sellOrderHub.start();
    await sellOrderHub.invoke("SubscribeToStatusChangeNotification", props.guid);

    trigger.value = true;
});

</script>

<template>

    <div v-if="trigger">
        <p>Mock</p>
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