const apiUrl: string = "https://localhost/api";

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