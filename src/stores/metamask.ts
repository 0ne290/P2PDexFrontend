import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMetamaskStore = defineStore('metamask', () => {
  const isAuth = ref(false)

  const walletAddress = ref('')

  const walletBalance = ref(0)

  function auth(address: string, balance: number) {
    isAuth.value = true;
    walletAddress.value = address;
    walletBalance.value = balance;
  }

  return { isAuth, walletAddress, walletBalance, auth }
})
