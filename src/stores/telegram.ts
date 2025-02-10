import { ref } from 'vue'
import { defineStore } from 'pinia'
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";

const apiId = 11091111;
const apiHash = "8394b7e420cd79fd603f82cf62fe3f42";
const stringSession = new StringSession("1AgAOMTQ5LjE1NC4xNjcuNDEBu46MkLr8itU1R1SER1WTWK7g4B5KKJWpt58T718S4tQc1Eai6k+ZIYaQuNULnnOiYd6DNlzOTqvK063gE1fP244l71/Qn59umKUmxx8Gce/h9/NifyQOo+XvLd9UiMdG6eWM0619XSg5FLT2wpIpQJji1wXymkKyoWJA14cro5EwGpnsaR0C+kuLCfGNGnGPRpOJ4IrE01UQwKWYhCucfO7gesavSbziqXyifAnsRbm8+8Vpz2m6cSJEkjMcQGbxKhhQa4jVIMYA/oNK4PHD7+Y+s0tQrbG2malIGnXMzv4SMbneP2hNupgmMBmC4w2MSnsF75Yi+JZ1rrLjlNt97Uc=");

export const useTelegramStore = defineStore('telegram', () => {
    const client = ref<TelegramClient>()

    async function init() {
        client.value = new TelegramClient(stringSession, apiId, apiHash, {});

        await client.value.connect();
    }

    const userName = ref<string | null>(null)

    const userId = ref(0)

    const isAuth = ref(false)

    function auth(id: number, name: string | null = null) {
        userName.value = name;
        userId.value = id;
        isAuth.value = true;
    }

    return { client, init, userName, userId, isAuth, auth }
})
