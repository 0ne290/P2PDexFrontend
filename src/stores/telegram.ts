import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useTelegramStore = defineStore('telegram', () => {
  const isAuth = ref(false)

  const userName = ref('')

  const userId = ref(0)

  function auth(name: string, id: number) {
    isAuth.value = true;
    userName.value = name;
    userId.value = id;
  }

  return { isAuth, userName, userId, auth }
})
