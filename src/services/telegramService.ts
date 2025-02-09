import { Api } from "telegram";
import type { BigInteger } from 'big-integer';
import bigInt from 'big-integer';
import { useTelegramStore } from '@/stores/telegram'

export async function sendMessage(message: string) {
    const telegram = useTelegramStore();

    const result = await telegram.client!.invoke(
        new Api.messages.SendMessage({
            peer: telegram.userId,
            message: message,
            randomId: generateRandomId(),
            silent: false
        })
    );
}

function generateRandomId(): BigInteger {
    return bigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
}