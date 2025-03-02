<script setup lang="ts">

import * as signalR from "@microsoft/signalr";
import { ref, onMounted } from 'vue';
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import { get as getSellOrder, respondByBuyer as respondToSellOrderByBuyer, confirmTransferFiatToSellerByBuyer as confirmTransferFiatToSellerByBuyerForSellOrder, confirmReceiptFiatFromBuyerBySeller as confirmReceiptFiatFromBuyerBySellerForSellOrder } from "@/services/api/sellOrder";

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
    order.value = await getSellOrder(props.guid!);
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
            order.value = await getSellOrder(props.guid!);
            if (order.value == null) {
                alert('На данный заказ откликнулся другой покупатель.');

                router.push({ name: 'getAllSellOrders' });

                return;
            }
        }

        order.value.status = newStatus;
        translateOrderStatusIntoRussian(order.value);
    });

    await sellOrderHub.start();
    await sellOrderHub.invoke("SubscribeToStatusChangeNotification", props.guid);

    translateOrderStatusIntoRussian(order.value)
    trigger.value = true;
});

function translateOrderStatusIntoRussian(order: any) {
    switch (order.status) {
        case 'Created':
            order.status = 'Ожидает подтверждение транзакции перевода криптовалюты продавца на эскроу-счет. Сервер запрашивает подтверждение у блокчейна каждые две минуты'

            break;

        case 'SellerToExchangerTransferTransactionConfirmed':
            order.status = 'Ожидает отклик покупателя'

            break;

        case 'RespondedByBuyer':
            order.status = 'Ожидает подтверждение покупателем перевода фиата'

            break;

        case 'TransferFiatToSellerConfirmedByBuyer':
            order.status = 'Ожидает подтверждение продавцом получения фиата'

            break;

        case 'ReceiptFiatFromBuyerConfirmedBySeller':
            order.status = 'Ожидает подтверждение транзакции перевода криптовалюты от продавца к покупателю с эскроу-счета. Сервер запрашивает подтверждение у блокчейна каждые две минуты'

            break;

        case 'Canceled':
            alert('АЛЯРМ-АЛЯРМ-АЛЯРМ!!!!!!!!!')

            order.status = 'Отменен'

            break;

        case 'ExchangerToBuyerTransferTransactionConfirmed':
            order.status = 'Завершен'

            break;

        default:
            alert('АЛЯРМ!!!')
    }
}

</script>

<template>


    <div class="container" v-if="trigger">
        <div class="p-0 pb-5 border-2 border-bottom second-border-color">
            <table class="sell-order-table">
                <tbody>
                    <tr>
                        <th>Статус</th>
                        <td>{{ order.status }}</td>
                    </tr>
                    <tr>
                        <th>Продавец</th>
                        <td>{{ order.sellerName == null ? order.sellerId : `${order.sellerId}, ${order.sellerName}` }}
                        </td>
                    </tr>
                    <tr>
                        <th>Покупатель</th>
                        <td>{{ order.buyerName == null ? order.buyerId : `${order.buyerId}, ${order.buyerName}` }}</td>
                    </tr>
                    <tr>
                        <th>Криптовалюта</th>
                        <td>{{ order.crypto }}</td>
                    </tr>
                    <tr>
                        <th>Количество</th>
                        <td>{{ order.cryptoAmount }}</td>
                    </tr>
                    <tr>
                        <th>Фиатная валюта</th>
                        <td>{{ order.fiat }}</td>
                    </tr>
                    <tr>
                        <th>Курс "Криптовалюта &rarr; Фиатная валюта"</th>
                        <td>{{ order.cryptoToFiatExchangeRate }}</td>
                    </tr>
                    <tr>
                        <th>Цена</th>
                        <td>{{ order.fiatAmount }}</td>
                    </tr>
                    <tr>
                        <th>Информация о способе оплаты</th>
                        <td>{{ order.paymentMethodInfo }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="p-0 pt-5 d-flex justify-content-around align-items-center">
            <template
                v-if="order.status == 'Ожидает подтверждение транзакции перевода криптовалюты продавца на эскроу-счет. Сервер запрашивает подтверждение у блокчейна каждые две минуты'">
                <div class="second-text-color second-border-color border rounded-pill px-3 py-1">
                    Ждите подтверждение транзакции перевода криптовалюты от продавца на эскроу-счет. Сервер запрашивает
                    подтверждение у блокчейна каждые две минуты
                </div>
            </template>
            <template v-else-if="order.status == 'Ожидает отклик покупателя'">
                <template v-if="order.sellerId == telegram.userId">
                    <div class="second-text-color second-border-color border rounded px-3 py-1">
                        Ждите отклик покупателя
                    </div>
                </template>
                <template v-else>
                    <div role="button" class="second-text-color second-border-color border rounded-pill px-3 py-1"
                        @click="respondToSellOrderByBuyer(props.guid!, order.sellerId)">
                        Откликнуться
                    </div>
                </template>
            </template>
            <template v-else-if="order.status == 'Ожидает подтверждение покупателем перевода фиата'">
                <template v-if="order.sellerId == telegram.userId">
                    <div class="second-text-color second-border-color border rounded px-3 py-1">
                        Ждите подтверждение покупателем перевода фиата
                    </div>
                </template>
                <template v-else>
                    <div role="button" class="second-text-color second-border-color border rounded-pill px-3 py-1"
                        @click="confirmTransferFiatToSellerByBuyerForSellOrder(props.guid!, order.sellerId)">
                        Подтвердить перевод фиата продавцу
                    </div>
                </template>
            </template>
            <template v-else-if="order.status == 'Ожидает подтверждение продавцом получения фиата'">
                <template v-if="order.sellerId == telegram.userId">
                    <div role="button" class="second-text-color second-border-color border rounded-pill px-3 py-1"
                        @click="confirmReceiptFiatFromBuyerBySellerForSellOrder(props.guid!, order.buyerId)">
                        Подтвердить получение фиата от покупателя
                    </div>
                </template>
                <template v-else>
                    <div class="second-text-color second-border-color border rounded px-3 py-1">
                        Ждите подтверждение продавцом получения фиата
                    </div>
                </template>
            </template>
            <template
                v-if="order.status == 'Ожидает подтверждение транзакции перевода криптовалюты от продавца к покупателю с эскроу-счета. Сервер запрашивает подтверждение у блокчейна каждые две минуты'">
                <div class="second-text-color second-border-color border rounded px-3 py-1">
                    Ждите подтверждение транзакции перевода криптовалюты от продавца к покупателю с эскроу-счета. Сервер
                    запрашивает подтверждение у блокчейна каждые две минуты
                </div>
            </template>
            <template v-if="order.status == 'Завершен'">
                <div class="second-text-color second-border-color border rounded px-3 py-1">
                    Заказ завершен
                </div>
            </template>
        </div>
    </div>

</template>