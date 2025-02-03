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
    const response = await fetch(`${apiUrl}/sell-order/get-all`, {
        method: "GET",
        mode: "cors"
    });

    if (response.status != 200) {
        throw new Error("Unexpected error.");
    }

    return (await response.json()).data.sellOrders;
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

    return (await response.json()).data.accountAddress
}

async function calculateFinalCryptoAmountForTransfer(cryptoAmount: number): Promise<number> {
    const response = await fetch(`${apiUrl}/calculate-final-crypto-amount-for-transfer/${cryptoAmount}`, {
        method: "GET",
        mode: "cors"
    });

    if (response.status != 200) {
        throw new Error("Unexpected error.");
    }

    return (await response.json()).data.finalCryptoAmount
}