<script setup lang="ts">

import * as signalR from "@microsoft/signalr";
import { ref } from 'vue';
import { onBeforeRouteLeave } from 'vue-router'
import { onMounted } from 'vue'

const props = defineProps({
    guid: String
});

onBeforeRouteLeave(async (_, __) => {
    await sellOrderHub.stop();
})

const currentStatus = ref('Unknown')

const sellOrderHub = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost/api/sell-order-hub", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
    })
    .build();

sellOrderHub.on("StatusChangedNotificationHandler", function (newStatus) {
    currentStatus.value = newStatus;
});

onMounted(async () => {
    await sellOrderHub.start();

    await sellOrderHub.invoke("SubscribeToStatusChangeNotification", props.guid)
});

</script>

<template>

    <div>
        {{ currentStatus }}
    </div>

</template>