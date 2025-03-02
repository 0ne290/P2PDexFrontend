import { useTelegramStore } from '@/stores/telegram'
import { useMetamaskStore } from '@/stores/metamask'
import { sendMessage, sendMessageTo } from "@/services/telegram";
import { getExchangerAccountAddress, calculateFinalCryptoAmountForTransfer } from "@/services/api/general";
import { toWei, numberToHex } from 'web3-utils';

const apiUrl = "https://localhost/api/sell-order";

/*export async function getUserOrders() {
    await fetch(`${apiUrl}/sell-order`, {
        method: "GET",
        mode: "cors",
        credentials: "include"
    })
}*/

export async function getAll() {
    const telegram = useTelegramStore();

    const response = await fetch(`${apiUrl}/get-all/${telegram.userId}`, {
        method: "GET",
        mode: "cors"
    });

    if (response.status != 200) {
        throw new Error("Unexpected error.");
    }

    return (await response.json()).sellOrders;
}

export async function get(guid: string) {
    const telegram = useTelegramStore();

    const response = await fetch(`${apiUrl}/get/${telegram.userId}:${guid}`, {
        method: "GET",
        mode: "cors"
    });

    const responseBody = await response.json();

    // Если бы на бэкенде была полноценная JWT-аутентификация, то вместо этого бреда, я бы проверял тут "status == 403"
    if (response.status == 400 && responseBody.message == "Trader is neither a buyer nor a seller.") {
        return null;
    }
    if (response.status == 200) {
        return responseBody.sellOrder;
    }

    throw new Error("Unexpected error.");
}

export async function create(cryptoAmount: number, cryptoToFiatExchangeRate: number, paymentMethodInfo: string) {
    const telegram = useTelegramStore();
    const metamask = useMetamaskStore();

    const transactionHash = await metamask.provider!.request({
        method: "eth_sendTransaction",
        params: [
            {
                from: metamask.walletAddress,
                to: await getExchangerAccountAddress(),
                value: numberToHex(toWei((await calculateFinalCryptoAmountForTransfer(cryptoAmount)).toString(), "ether"))
            }
        ]
    });

    const response = await fetch(`${apiUrl}/create`, {
        method: "POST",
        mode: "cors",
        headers: new Headers({
            'content-type': 'application/json'
        }),
        body: JSON.stringify({
            crypto: "Ethereum",
            cryptoAmount: cryptoAmount,
            fiat: "Ruble",
            cryptoToFiatExchangeRate: cryptoToFiatExchangeRate,
            paymentMethodInfo: paymentMethodInfo,
            sellerId: telegram.userId,
            transferTransactionHash: transactionHash
        })
    });

    if (response.status != 200) {
        throw new Error("Unexpected error.");
    }

    await sendMessage('Вы создали заказ на продажу. Другие пользователи смогут его увидеть на сайте после того, как транзакция перевода криптовалюты на эскроу-счет будет подтверждена. Сервер запрашивает подтверждение у блокчейна каждые две минуты.')
}

export async function respondByBuyer(guid: string, sellerId: number) {
    const telegram = useTelegramStore();
    const metamask = useMetamaskStore();

    const response = await fetch(`${apiUrl}/respond-by-buyer`, {
        method: "POST",
        mode: "cors",
        headers: new Headers({
            'content-type': 'application/json'
        }),
        body: JSON.stringify({
            orderGuid: guid,
            buyerId: telegram.userId,
            buyerAccountAddress: metamask.walletAddress
        })
    });

    if (response.status != 200) {
        throw new Error("Unexpected error.");
    }

    await sendMessage('Вы откликнулись на заказ на продажу. Переведите фиат продавцу и подтвердите перевод на сайте.');
    await sendMessageTo(sellerId, 'На ваш заказ на продажу откликнулись. Ждите подтверждение покупателем перевода фиата.');
}

export async function confirmTransferFiatToSellerByBuyer(guid: string, sellerId: number) {
    const telegram = useTelegramStore();
    
    const response = await fetch(`${apiUrl}/confirm-transfer-fiat-to-seller-by-buyer`, {
        method: "POST",
        mode: "cors",
        headers: new Headers({
            'content-type': 'application/json'
        }),
        body: JSON.stringify({
            orderGuid: guid,
            buyerId: telegram.userId
        })
    });

    if (response.status != 200) {
        throw new Error("Unexpected error.");
    }

    await sendMessage('Вы подтвердили перевод фиата продавцу за заказ на продажу. Ждите подтверждение продавцом получения фиата.');
    await sendMessageTo(sellerId, 'Покупатель подтвердил перевод фиата за ваш заказ на продажу. Подтвердите на сайте получение фиата от покупателя.');
}

export async function confirmReceiptFiatFromBuyerBySeller(guid: string, buyerId: number) {
    const telegram = useTelegramStore();
    
    const response = await fetch(`${apiUrl}/confirm-receipt-fiat-from-buyer-by-seller`, {
        method: "POST",
        mode: "cors",
        headers: new Headers({
            'content-type': 'application/json'
        }),
        body: JSON.stringify({
            orderGuid: guid,
            sellerId: telegram.userId
        })
    });

    if (response.status != 200) {
        throw new Error("Unexpected error.");
    }

    await sendMessage('Вы подтвердили получение фиата от покупателя за ваш заказ на продажу. Транзакция перевода криптовалюты с эскроу-счета покупателю отправлена в блокчейн. Сервер запрашивает у блокчейна подтверждение транзакции каждые две минуты. После получения подтверждения, заказ перейдет в состояние "Завершен".');
    await sendMessageTo(buyerId, 'Продавец подтвердил получение фиата за заказ на продажу. Транзакция перевода криптовалюты с эскроу-счета на ваш кошелек отправлена в блокчейн. Сервер запрашивает у блокчейна подтверждение транзакции каждые две минуты. После получения подтверждения, заказ перейдет в состояние "Завершен".');
}