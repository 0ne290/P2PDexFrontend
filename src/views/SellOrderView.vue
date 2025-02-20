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
        <template v-if="order.status == 'SellerToExchangerTransferTransactionConfirmed'">
            <template v-if="order.sellerId == telegram.userId">
                Ждите отклик покупателя.
            </template>
            <template v-else>
                Откликнуться.
            </template>
        </template>
        <template v-else>
            Статус "{{ order.status }}" заказов не поддерживается.
        </template>
    </div>

</template>