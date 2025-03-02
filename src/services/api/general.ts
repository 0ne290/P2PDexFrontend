import { useTelegramStore } from '@/stores/telegram'

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

export async function getExchangerAccountAddress(): Promise<string> {
    const response = await fetch(`${apiUrl}/get-exchanger-account-address`, {
        method: "GET",
        mode: "cors"
    });

    if (response.status != 200) {
        throw new Error("Unexpected error.");
    }

    return (await response.json()).accountAddress
}

export async function calculateFinalCryptoAmountForTransfer(cryptoAmount: number): Promise<number> {
    const response = await fetch(`${apiUrl}/calculate-final-crypto-amount-for-transfer/${cryptoAmount}`, {
        method: "GET",
        mode: "cors"
    });

    if (response.status != 200) {
        throw new Error("Unexpected error.");
    }

    return (await response.json()).finalCryptoAmount
}