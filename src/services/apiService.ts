import { useTelegramStore } from '@/stores/telegram'

const apiUrl = "https://localhost/api";

export async function ensureExistedOfTrader(userName: string, userId: number) {
    const response = await fetch(`${apiUrl}/ensure-existed-of-trader/${userId}`, {
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

/*export async function auth(userId: number) {
    await fetch(`${apiUrl}/auth/${userId}`, {
        method: "GET",
        mode: "cors",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({userId: userId})
    })
}*/

export async function auth(userId: number) {
    await fetch(`${apiUrl}/auth/${userId}`, {
        method: "GET"
    })
}

export async function getUserOrders() {
    await fetch(`${apiUrl}/sell-order`, {
        method: "GET",
        mode: "cors",
        credentials: "include"
    })
}

export async function getAllOrders() {
    await fetch(`${apiUrl}/sell-order/all`, {
        method: "GET",
        mode: "cors",
        credentials: "include"
    })
}