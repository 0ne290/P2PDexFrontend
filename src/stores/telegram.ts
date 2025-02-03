import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useTelegramStore = defineStore('telegram', () => {
    const userName = ref('')

    const userId = ref(0)

    const isAuth = ref(false)

    async function auth(name: string, id: number) {
        userName.value = name;
        userId.value = id;
        isAuth.value = true;
    }

    return { userName, userId, isAuth, auth }
})
