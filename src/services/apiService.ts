import { useTelegramStore } from '@/stores/telegram'

const apiUrl = "https://localhost/api";

export async function ensureExistedOfTrader(userName: string, userId: number) {
    const response = await fetch(`${apiUrl}/ensure-existed-of-trader/${userId}:${userName}`, {
        method: "GET",
        mode: "cors"
    });

    if (response.status != 200) {
        throw new Error("Unexpected error.");
    }

    const telegram = useTelegramStore();
    telegram.auth(userName, userId);

    console.log(`Status: ${response.status}\nBody: ${await response.text()}`);
}

export async function getUserOrders() {
    await fetch(`${apiUrl}/sell-order`, {
        method: "GET",
        mode: "cors",
        credentials: "include"
    })
}

export async function getAllOrders() {
    const response = await fetch(`${apiUrl}/sell-order/get-all`, {
        method: "GET",
        mode: "cors"
    });

    if (response.status != 200) {
        throw new Error("Unexpected error.");
    }

    return await response.json();
}

export async function createSellOrder(cryptoAmount: number, cryptoToFiatExchangeRate: number, paymentMethodInfo: string) {
    const telegram = useTelegramStore();

    const response = await fetch(`${apiUrl}/sell-order/create`, {
        method: "POST",
        mode: "cors",
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