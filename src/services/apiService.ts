import { useTelegramStore } from '@/stores/telegram'
import { useMetamaskStore } from '@/stores/metamask'
import { toWei, numberToHex } from 'web3-utils';

const apiUrl = "https://localhost/api";

export async function ensureExistedOfTrader() {
    const telegram = useTelegramStore();

    const response = await fetch(`${apiUrl}/ensure-existed-of-trader/${telegram.userId}:${telegram.userName}`, {
        method: "GET",
        mode: "cors"
    });

    if (response.status != 200) {
        throw new Error("Unexpected error.");
    }
}

export async function getUserOrders() {
    await fetch(`${apiUrl}/sell-order`, {
        method: "GET",
        mode: "cors",
        credentials: "include"
    })
}

export async function getAllOrders() {
    const telegram = useTelegramStore();

    const response = await fetch(`${apiUrl}/sell-order/get-all/${telegram.userId}`, {
        method: "GET",
        mode: "cors"
    });

    if (response.status != 200) {
        throw new Error("Unexpected error.");
    }

    return (await response.json()).sellOrders;
}

export async function getOrder(guid: string) {
    const telegram = useTelegramStore();

    const response = await fetch(`${apiUrl}/sell-order/get/${telegram.userId}:${guid}`, {
        method: "GET",
        mode: "cors"
    });

    const responseBody = await response.json();

    alert(response.status + responseBody);

    // Если бы на бэкенде была полноценная JWT-аутентификация, то вместо этого бреда, я бы проверял тут "status == 403"
    if (response.status == 400 && responseBody.message == "Trader is neither a buyer nor a seller.") {
        return null;
    }
    if (response.status == 200) {
        return responseBody.sellOrder;
    }

    throw new Error("Unexpected error.");
}

export async function createSellOrder(cryptoAmount: number, cryptoToFiatExchangeRate: number, paymentMethodInfo: string) {
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

    const response = await fetch(`${apiUrl}/sell-order/create`, {
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
}

async function getExchangerAccountAddress(): Promise<string> {
    const response = await fetch(`${apiUrl}/get-exchanger-account-address`, {
        method: "GET",
        mode: "cors"
    });

    if (response.status != 200) {
        throw new Error("Unexpected error.");
    }

    return (await response.json()).accountAddress
}

async function calculateFinalCryptoAmountForTransfer(cryptoAmount: number): Promise<number> {
    const response = await fetch(`${apiUrl}/calculate-final-crypto-amount-for-transfer/${cryptoAmount}`, {
        method: "GET",
        mode: "cors"
    });

    if (response.status != 200) {
        throw new Error("Unexpected error.");
    }

    return (await response.json()).finalCryptoAmount
}